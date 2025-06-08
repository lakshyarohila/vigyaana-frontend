'use client';

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postRequest } from "@/lib/api";
import useAuthStore from "@/lib/store";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Shield } from "lucide-react";

// Separate component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessingGoogleAuth, setIsProcessingGoogleAuth] = useState(false);
  const [hasProcessedToken, setHasProcessedToken] = useState(false);

  // Memoize the token processing function
  const processGoogleToken = useCallback(async (token) => {
    if (hasProcessedToken) return;
    
    setHasProcessedToken(true);
    setIsProcessingGoogleAuth(true);
    console.log("Processing Google OAuth token:", token);
    
    try {
      // First, let's try to validate the token format
      if (!token || token.split('.').length !== 3) {
        throw new Error("Invalid token format");
      }

      // Store token first
      localStorage.setItem("token", token);
      
      // Try different authorization header formats
      const authHeaders = [
        `Bearer ${token}`,
        token,
        `JWT ${token}`
      ];

      let userData = null;
      let lastError = null;

      // Try different authorization formats
      for (const authHeader of authHeaders) {
        try {
          console.log("Trying auth header:", authHeader.substring(0, 20) + "...");
          
          const response = await fetch("https://vigyaana-server.onrender.com/api/auth/me", {
            method: "GET",
            headers: { 
              "Authorization": authHeader,
              "Content-Type": "application/json"
            },
            credentials: "include",
          });

          console.log("Response status:", response.status);
          console.log("Response headers:", Object.fromEntries(response.headers.entries()));

          if (response.ok) {
            userData = await response.json();
            console.log("User data received:", userData);
            break;
          } else {
            const errorText = await response.text();
            console.error(`Auth attempt failed with ${response.status}:`, errorText);
            lastError = new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } catch (error) {
          console.error("Request failed:", error);
          lastError = error;
        }
      }

      // If none of the auth formats worked, try without credentials
      if (!userData) {
        try {
          console.log("Trying without credentials...");
          const response = await fetch("https://vigyaana-server.onrender.com/api/auth/me", {
            method: "GET",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            // Remove credentials: "include"
          });

          if (response.ok) {
            userData = await response.json();
            console.log("User data received (without credentials):", userData);
          }
        } catch (error) {
          console.error("Request without credentials failed:", error);
        }
      }

      // If we still don't have user data, try a different endpoint or approach
      if (!userData) {
        console.log("Trying alternative approach - decode token locally");
        try {
          // Decode JWT token to get user info (if available)
          const tokenParts = token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Token payload:", payload);
          
          // Check if token is expired
          if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new Error("Token has expired");
          }

          // If token contains user ID, try to use it
          if (payload.id) {
            userData = { id: payload.id };
            console.log("Using token payload as user data:", userData);
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }

      if (!userData) {
        throw lastError || new Error("Failed to authenticate with server");
      }
      
      if (userData && userData.id) {
        setUser(userData);
        
        toast.success(`Welcome back, ${userData.name || userData.email || 'User'}!`, {
          icon: "🎉",
          duration: 3000,
          style: {
            backgroundColor: "#10b981",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
          },
        });
        
        // Clean up URL and redirect after a short delay
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Google OAuth error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to complete Google login. Please try again.";
      
      if (error.message.includes("401")) {
        errorMessage = "Authentication failed. The server doesn't recognize your login token.";
      } else if (error.message.includes("404")) {
        errorMessage = "Authentication service not found. Please contact support.";
      } else if (error.message.includes("expired")) {
        errorMessage = "Your login session has expired. Please try logging in again.";
      } else if (error.message.includes("Invalid token")) {
        errorMessage = "Invalid login token received. Please try again.";
      }
      
      toast.error(errorMessage);
      
      // Clean up on error
      localStorage.removeItem("token");
      setHasProcessedToken(false);
      router.replace("/login");
    } finally {
      setIsProcessingGoogleAuth(false);
    }
  }, [hasProcessedToken, setUser, router]);

  // Handle URL parameters
  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    
    // Handle OAuth errors
    if (error && !hasProcessedToken) {
      if (error === "auth_failed") {
        toast.error("Google authentication failed. Please try again.");
      } else if (error === "token_failed") {
        toast.error("Failed to generate authentication token.");
      } else {
        toast.error(`Authentication error: ${error}`);
      }
      // Clean up URL
      router.replace("/login");
      return;
    }

    // Handle successful OAuth with token
    if (token && !hasProcessedToken && !isProcessingGoogleAuth) {
      processGoogleToken(token);
    }
  }, [searchParams, processGoogleToken, hasProcessedToken, isProcessingGoogleAuth, router]);

  // Redirect if already logged in (but not during Google auth processing)
  useEffect(() => {
    if (user && user.id && !isProcessingGoogleAuth && !searchParams.get("token")) {
      console.log("User already logged in, redirecting to home");
      router.push("/");
    }
  }, [user, router, isProcessingGoogleAuth, searchParams]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postRequest("/auth/login", form);
      console.log("Login response:", res);
      
      if (res.user && res.token) {
        // Store token
        localStorage.setItem("token", res.token);
        
        // Set user in store
        setUser(res.user);
        
        toast.success("Logged in successfully!", {
          icon: "🚀",
          style: {
            backgroundColor: "#332a38",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
          },
        });
        
        router.push("/");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google login");
    // Reset processing state before redirect
    setHasProcessedToken(false);
    setIsProcessingGoogleAuth(false);
    
    // Add current URL as redirect parameter to help with debugging
    const currentUrl = window.location.origin + "/login";
    window.location.href = `https://vigyaana-server.onrender.com/api/auth/google?redirect=${encodeURIComponent(currentUrl)}`;
  };

  // Show loading state during Google OAuth processing
  if (isProcessingGoogleAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4645] mx-auto mb-4"></div>
          <p className="text-gray-600">Completing Google login...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c4645] to-[#2a6b69]">
          <img src="/login.png" alt="Login" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
        </div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl opacity-90">Sign in to continue your journey with us</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <img src="/login.png" alt="Login" className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#1c4645]" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1c4645] mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full pl-10 text-black pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] transition"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 text-black py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>

              <div className="text-right mt-2">
                <button onClick={() => router.push('/forgot-password')} type="button" className="text-sm text-[#1c4645] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1c4645] text-white font-medium rounded-lg hover:bg-[#2a6b69] transition duration-200"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </button>
          </form>

          {/* Google Login Button */}
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isProcessingGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <button onClick={() => router.push("/register")} className="inline-flex items-center gap-1 text-[#1c4645] hover:text-[#2a6b69] font-medium">
                <UserPlus className="h-4 w-4" />
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Secure Login</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoginPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4645]"></div>
    </div>
  );
}

// Main component wrapped with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginForm />
    </Suspense>
  );
}