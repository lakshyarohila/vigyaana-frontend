'use client'
import { useEffect } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/compoenets/Navbar";
import Script from "next/script"; // ✅ Added missing import
import useAuthStore from '@/lib/store';
import  Footer  from "@/compoenets/Footer";
import { LenisProvider } from "@/compoenets/LenisProvider";


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
        {children}
        </LenisProvider>
        {/* ✅ Razorpay Script - Loads globally once */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Footer/>
      </body>
    </html>
  );
}