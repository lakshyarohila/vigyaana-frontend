'use client'
import { useEffect } from "react";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import { Toaster } from "react-hot-toast";
import Navbar from "@/compoenets/Navbar";
import Script from "next/script"; // ✅ Added missing import
import useAuthStore from '@/lib/store';
import  Footer  from "@/compoenets/Footer";
import { LenisProvider } from "@/compoenets/LenisProvider";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "@/lib/react-query";
import AuthInitializer from "@/compoenets/AuthInitializer";
export default function RootLayout({ children }) {
const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // 🧠 Load user from cookie on every refresh
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
        <title>Vigyaana</title>
        <link rel="icon" sizes="96x96"href="https://cdn-icons-png.flaticon.com/128/8131/8131880.png" />
      </head>

      <body>
        <Toaster position="top-right" />
        <Navbar />
       <LenisProvider>
    
       <QueryClientProvider client={queryClient}>
       <SessionProvider>
        {children}
        </SessionProvider>
        </QueryClientProvider>
       
        </LenisProvider>
        {/* ✅ Razorpay Script - Loads globally once */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Footer/>
      </body>
    </html>
  );
}