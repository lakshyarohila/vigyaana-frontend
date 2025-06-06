'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { postRequest } from '@/lib/api';
import { Mail, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postRequest('/auth/forgot-password', { email });
      toast.success('Reset link sent to your email');
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#1c4645] mb-4 text-center">🔐 Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full pl-10 pr-3 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c4645] focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1c4645] text-white font-medium rounded-lg hover:bg-[#2a6b69] transition duration-200"
          >
            <Send className="h-5 w-5" />
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {sent && (
          <p className="text-green-600 text-sm mt-4 text-center">
            ✅ Check your email for the password reset link.
          </p>
        )}
      </div>
    </div>
  );
}
