'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!allowedRoles.includes(user.role)) {
      router.push('/');
    }
  }, [user]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Or loading spinner
  }

  return children;
}
