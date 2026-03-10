"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  MapPin, 
  Bus, 
  Building2, 
  Utensils, 
  Palmtree,
  User,
  LogIn
} from "lucide-react";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Tìm kiếm", href: "/search" },
  { label: "Liên hệ", href: "/contact" },
];

const infoMenuItems = [
  { label: "Điểm du lịch", href: "/spots", icon: MapPin },
  { label: "Thông tin Du lịch", href: "/travel", icon: Bus },
  { label: "Thông tin Khách sạn", href: "/hotels", icon: Building2 },
  { label: "Thông tin Nhà hàng", href: "/restaurants", icon: Utensils },
  { label: "Thông tin Resort", href: "/resorts", icon: Palmtree },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileInfoOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className={`font-bold text-xl hidden sm:block transition-colors ${
              isScrolled ? "text-gray-800" : "text-white"
            }`}>
              Karnel Travels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-orange-500 ${
                  isActive(link.href) 
                    ? "text-orange-500" 
                    : isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setIsInfoMenuOpen(true)}
              onMouseLeave={() => setIsInfoMenuOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 font-medium transition-colors hover:text-orange-500 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Thông tin
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isInfoMenuOpen ? "rotate-180" : ""
                }`} />
              </button>

              {/* Dropdown Content */}
              <div 
                className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                  isInfoMenuOpen 
                    ? "opacity-100 visible translate-y-0" 
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="py-2">
                  {infoMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right Side - Search & Login */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </Link>
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
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Info Menu Toggle */}
              <button
                onClick={() => setIsMobileInfoOpen(!isMobileInfoOpen)}
                className="flex items-center justify-between py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>Thông tin</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileInfoOpen ? "rotate-180" : ""
                }`} />
              </button>

              {/* Mobile Info Submenu */}
              {isMobileInfoOpen && (
                <div className="ml-4 border-l-2 border-orange-200 pl-4 space-y-1">
                  {infoMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile Login Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-3 rounded-full transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
