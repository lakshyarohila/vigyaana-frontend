'use client'
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Vigyaana</h3>
            <p className="text-sm leading-relaxed">
              Empowering learners through technology-driven education.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
              
              <Link href="/about-us" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/about-us" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Contact Info */}
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail size={16} />
              <span className="text-sm">team.vigyaana@gmail.com</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © 2025 Vigyaana. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;