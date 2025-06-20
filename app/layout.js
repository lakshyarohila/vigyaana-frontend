'use client'
import { useEffect } from "react";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "react-hot-toast";
import Navbar from "@/compoenets/Navbar";
import Script from "next/script"; // ✅ Added missing import
import useAuthStore from '@/lib/store';
import  Footer  from "@/compoenets/Footer";
import { LenisProvider } from "@/compoenets/LenisProvider";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "@/lib/react-query";

export default function RootLayout({ children }) {
const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // 🧠 Load user from cookie on every refresh
  }, []);
  return (
   <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
    <html lang="en" suppressHydrationWarning>
    <head>
        <title>Vigyaana</title>
       
      </head>

      <body>
        <Toaster position="top-right" />
        <Navbar />
       <LenisProvider>
    
       <QueryClientProvider client={queryClient}>

        {children}
     
        </QueryClientProvider>
       
        </LenisProvider>
        {/* ✅ Razorpay Script - Loads globally once */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Footer/>
        
      </body>
    </html>
    </GoogleOAuthProvider>
  );
}