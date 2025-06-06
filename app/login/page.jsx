'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postRequest } from "@/lib/api";
import useAuthStore from "@/lib/store";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postRequest("/auth/login", form);
      setUser(res.user);
      toast.success("Logged in!", {
        duration: 3000,
        position: "top-right",
        style: {
          backgroundColor: "#332a38",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
        icon: "🚀",
      });

      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c4645] to-[#2a6b69]">
          <img
            src="/login.png"
            alt="Login"
            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl opacity-90">
              Sign in to continue your journey with us
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile image */}
          <div className="lg:hidden mb-8 text-center">
            <img
              src="/login.png"
              alt="Login"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#1c4645]"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1c4645] mb-2">Sign In</h2>
            <p className="text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
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
                  className="block w-full pl-10 text-black pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
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
                  className="block w-full pl-10 pr-12 text-black py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-[#1c4645] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-[#1c4645] transition-colors" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm text-[#1c4645] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1c4645] text-white font-medium rounded-lg hover:bg-[#2a6b69] focus:outline-none focus:ring-2 focus:ring-[#1c4645] focus:ring-offset-2 transition duration-200 transform hover:scale-105"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center gap-1 text-[#1c4645] hover:text-[#2a6b69] font-medium transition-colors duration-200"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Secure Login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
