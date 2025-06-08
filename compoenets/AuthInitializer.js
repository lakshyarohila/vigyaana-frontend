// components/AuthInitializer.js or in your layout component
'use client';

import { useEffect } from 'react';
import useAuthStore from '@/lib/store';

export default function AuthInitializer({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return children;
}

// In your layout.js or _app.js, wrap your app:
// <AuthInitializer>
//   {children}
// </AuthInitializer>