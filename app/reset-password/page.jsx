'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { postRequest } from '@/lib/api';
import { Lock, RotateCw } from 'lucide-react';
import { Suspense } from 'react';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTokenReady, setIsTokenReady] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure searchParams are fully loaded
    const timer = setTimeout(() => {
      setIsTokenReady(true);
      console.log('Token from URL:', token); // Debug log
      
      if (!token || token.trim() === '') {
        toast.error('Invalid or missing reset token');
        router.push('/forgot-password');
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional validation
    if (!token || token.trim() === '') {
      toast.error('Reset token is missing');
      return;
    }

    if (!password || password.trim() === '') {
      toast.error('Password is required');
      return;
    }

    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      console.log('=== PASSWORD RESET DEBUG ===');
      console.log('Token:', token);
      console.log('Token length:', token.length);
      console.log('Password length:', password.length);
      
      // Your backend expects 'newPassword', not 'password'
      const requestData = { 
        token: token.trim(), 
        newPassword: password.trim()  // Changed from 'password' to 'newPassword'
      };
      console.log('Request payload:', requestData);
      
      const response = await postRequest('/auth/reset-password', requestData);
      
      console.log('Reset response:', response);
      toast.success('Password updated successfully!');
      router.push('/login');
    } catch (err) {
      console.error('=== PASSWORD RESET ERROR ===');
      console.error('Full error object:', err);
      console.error('Error message:', err.message);
      console.error('Error status:', err.status);
      console.error('Error response:', err.response);
      
      // Show more specific error messages
      if (err.status === 400) {
        toast.error('Invalid request. Token may be expired or invalid.');
      } else if (err.status === 404) {
        toast.error('Reset endpoint not found.');
      } else if (err.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(err.message || 'Password reset failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while token is being processed
  if (!isTokenReady) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4645] mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#1c4645] mb-4 text-center">
          🔒 Reset Your Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] text-black transition"
                placeholder="Enter new password (min 6 chars)"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="confirm"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] text-black transition"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {/* Password match indicator */}
          {confirm && (
            <div className="text-sm">
              {password === confirm ? (
                <span className="text-green-600">✓ Passwords match</span>
              ) : (
                <span className="text-red-600">✗ Passwords don't match</span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !password || !confirm || password !== confirm}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1c4645] text-white font-medium rounded-lg hover:bg-[#2a6b69] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <RotateCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Debug info (remove in production) */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <strong>Debug:</strong> Token present: {token ? 'Yes' : 'No'}
          {token && <div>Token length: {token.length}</div>}
        </div>
      </div>
    </div>
  );
}

// Wrap the main component in Suspense
export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4645] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reset form...</p>
        </div>
      </div>
    }>
      <ResetForm />
    </Suspense>
  );
}