'use client'
import { useEffect } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/compoenets/Navbar";
import Script from "next/script"; // ✅ Added missing import
import useAuthStore from '@/lib/store';
import  Footer  from "@/compoenets/Footer";


export default function RootLayout({ children }) {
const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // 🧠 Load user from cookie on every refresh
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
        <title>Vigyaana</title>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <Toaster position="top-right" />
        <Navbar />
        {children}
        {/* ✅ Razorpay Script - Loads globally once */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Footer/>
      </body>
    </html>
  );
}