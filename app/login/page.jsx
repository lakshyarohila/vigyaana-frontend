'use client';

import { Suspense } from 'react';
import LoginPage from './LoginForm';// Your main login form moved to a child component

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
