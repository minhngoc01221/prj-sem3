"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Điểm đến", href: "#destinations" },
  { label: "Khuyến mãi", href: "#promotions" },
  { label: "Liên hệ", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className={`font-bold text-xl transition-colors ${
              isScrolled ? "text-gray-800" : "text-white"
            }`}>
              Du Lịch Việt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-orange-500 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact & Social Icons - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Quick Contact */}
            <div className={`flex flex-col gap-1 ${isScrolled ? "text-gray-600" : "text-white/90"}`}>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span className="font-medium">1900-xxxx</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@dulichviet.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all hover:bg-orange-500 hover:text-white ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all hover:bg-orange-500 hover:text-white ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all hover:bg-orange-500 hover:text-white ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-2 px-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>1900-xxxx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>info@dulichviet.com</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 px-4">
                  <a href="https://facebook.com" className="p-2 text-gray-600 hover:text-orange-500">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com" className="p-2 text-gray-600 hover:text-orange-500">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://youtube.com" className="p-2 text-gray-600 hover:text-orange-500">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
