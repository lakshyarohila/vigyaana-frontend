'use client'
import Link from "next/link";
import { Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-white py-8" style={{ backgroundColor: '#1c4645' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand & Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
            <h3 className="text-xl font-bold">Vigyaana</h3>
            <div className="flex space-x-6 text-sm">
              <Link href="/" className="hover:opacity-80 transition-opacity">Home</Link>
              <Link href="/courses" className="hover:opacity-80 transition-opacity">Courses</Link>
              <Link href="/blogs" className="hover:opacity-80 transition-opacity">Blog</Link>
              <Link href="/about-us" className="hover:opacity-80 transition-opacity">About</Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <Mail size={16} />
              <span>team.vigyaana@gmail.com</span>
            </div>
            <div className="flex space-x-3">
              <a href="#" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-4 border-t border-white/20">
          <p className="text-sm opacity-80">© 2025 Vigyaana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;