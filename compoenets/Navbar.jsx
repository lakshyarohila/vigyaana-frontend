'use client';

import Link from 'next/link';
import useAuthStore from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed');
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between">
      <Link href="/" className="font-bold text-xl">Vigyana</Link>

      <div className="flex gap-4">
        {!user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            {user.role === 'STUDENT' && <Link href="/dashboard">My Courses</Link>}
            {user.role === 'INSTRUCTOR' && <Link href="/instructor">Instructor Panel</Link>}
            {user.role === 'ADMIN' && <Link href="/admin">Admin Panel</Link>}
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
