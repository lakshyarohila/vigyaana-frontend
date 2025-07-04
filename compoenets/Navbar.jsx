'use client';

import Link from "next/link";
import useAuthStore from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LogIn,
  UserPlus,
  BookOpen,
  Presentation,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Users,
  Ghost
} from "lucide-react";
import { useState } from "react";
import UsersGroupIcon from "./UsersGroupIcon";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("https://vigyaana-server.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-[#0f302f] text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-semibold">Vigyaana</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/blogs"
              className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#2a5a58] transition-colors duration-200"
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-medium font-sans">Blogs</span>
            </Link>

            {!user && (
              <>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 bg-[#e17100] hover:bg-[#c5610a] px-4 py-2 rounded-full transition-colors duration-200 font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 border border-[#e17100] text-[#e17100] hover:bg-[#e17100] hover:text-white px-4 py-2 rounded-full transition-colors duration-200 font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}

            {user && (
              <>
                <div className="flex items-center space-x-2 px-3 py-1 bg-[#2a5a58] rounded-full">
                  <User className="h-4 w-4 text-[#e17100]" />
                  <span className="text-sm font-medium">
                    {user.name || user.email}
                  </span>
                </div>

                {/* ✅ Community Link */}
                <Link
                  href="/community"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#2a5a58] transition-colors duration-200"
                >
                  <Ghost className="h-4 w-4" />
                  <span>Community</span>
                </Link>

                {user.role === "STUDENT" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#2a5a58] transition-colors duration-200"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>My Courses</span>
                  </Link>
                )}

                {user.role === "INSTRUCTOR" && (
                  <Link
                    href="/instructor"
                    className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#2a5a58] transition-colors duration-200"
                  >
                    <Presentation className="h-4 w-4" />
                    <span>Instructor Panel</span>
                  </Link>
                )}

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#2a5a58] transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors duration-200 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}

            <Link
              href="/about-us"
              className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#2a5a58] transition-colors duration-200"
            >
              <UsersGroupIcon />
              <span className="font-medium">About Us</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-[#2a5a58] transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#1c4645] border-t border-[#2a5a58] shadow-lg z-50">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/about-us"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UsersGroupIcon />
                <span>About Us</span>
              </Link>

              <Link
                href="/blogs"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                <span>Blogs</span>
              </Link>

              {user && (
                <Link
                  href="/community"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Ghost className="h-5 w-5" />
                  <span>Community</span>
                </Link>
              )}

              {!user && (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 bg-[#e17100] hover:bg-[#c5610a] px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-3 border border-[#e17100] text-[#e17100] hover:bg-[#e17100] hover:text-white px-4 py-3 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Register</span>
                  </Link>
                </>
              )}

              {user && (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-[#2a5a58] rounded-lg">
                    <User className="h-5 w-5 text-[#e17100]" />
                    <span className="font-medium">
                      {user.name || user.email}
                    </span>
                  </div>

                  {user.role === "STUDENT" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>My Courses</span>
                    </Link>
                  )}

                  {user.role === "INSTRUCTOR" && (
                    <Link
                      href="/instructor"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Presentation className="h-5 w-5" />
                      <span>Instructor Panel</span>
                    </Link>
                  )}

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2a5a58] transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-colors duration-200 font-medium w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    {/* Spacer div to prevent content from hiding behind fixed navbar */}
    <div className="h-16"></div>
    </>
  );
}