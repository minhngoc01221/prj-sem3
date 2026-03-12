"use client";

import { useState, useEffect, useRef } from "react";
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
  LogIn,
  LogOut,
  Heart,
  FileText,
  Settings,
  ChevronRight,
  UserCircle,
  Plane
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Search", href: "/search" },
  { label: "Contact", href: "/contact" },
];

const infoMenuItems = [
  { label: "Tourist Spots", href: "/spots", icon: MapPin },
  { label: "Travel Info", href: "/travel", icon: Bus },
  { label: "Hotels", href: "/hotels", icon: Building2 },
  { label: "Restaurants", href: "/restaurants", icon: Utensils },
  { label: "Resorts", href: "/resorts", icon: Palmtree },
];

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Hide navbar on admin/login pages (but show on auth pages)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login-admin")) {
    return null;
  }

  // Wait for hydration before checking localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load user from localStorage on mount (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, [isHydrated]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileInfoOpen(false);
    setIsMobileUserMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const userMenuItems = [
    { label: "My Profile", href: "/profile", icon: UserCircle },
    { label: "My Bookings", href: "/bookings", icon: FileText },
    { label: "Favorites", href: "/favorites", icon: Heart },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return null;
  }

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
              <Plane className="w-6 h-6 text-white transform -rotate-45" />
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
                Information
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

          {/* Right Side - Search & User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button */}
            <Link
              href="/search"
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* User Menu (Logged in) */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                    isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                  }`}
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-medium max-w-[120px] truncate ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}>
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    isScrolled ? "text-gray-600" : "text-white"
                  } ${isUserMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* User Dropdown */}
                <div 
                  className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                    isUserMenuOpen 
                      ? "opacity-100 visible translate-y-0" 
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {userMenuItems.map((item) => (
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

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Login/Register Buttons (Not logged in) */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-colors ${
                    isScrolled 
                      ? "text-gray-700 hover:bg-gray-100" 
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
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
                <span>Information</span>
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

              {/* Mobile User Section */}
              {user ? (
                <>
                  {/* User Info Header */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* User Menu Toggle */}
                  <button
                    onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                    className="flex items-center justify-between py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span>My Account</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isMobileUserMenuOpen ? "rotate-90" : ""
                    }`} />
                  </button>

                  {/* Mobile User Submenu */}
                  {isMobileUserMenuOpen && (
                    <div className="ml-4 border-l-2 border-orange-200 pl-4 space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 py-2 px-4 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Mobile Login/Register Buttons */
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 border border-orange-500 text-orange-500 font-medium px-5 py-3 rounded-full transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-3 rounded-full transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
