"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Send } from "lucide-react";

const quickLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Điểm đến", href: "#destinations" },
  { label: "Khuyến mãi", href: "#promotions" },
];

const services = [
  { label: "Tour du lịch", href: "#" },
  { label: "Đặt khách sạn", href: "#" },
  { label: "Thuê xe", href: "#" },
  { label: "Resort", href: "#" },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin/login pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login-admin")) {
    return null;
  }

  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="font-bold text-xl">Du Lịch Việt</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Công ty du lịch hàng đầu Việt Nam. Chúng tôi cam kết mang đến cho 
              quý khách những trải nghiệm du lịch đáng nhớ nhất.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Liên Kết Nhanh</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">Dịch Vụ</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link 
                    href={service.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Liên Hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="tel:1900xxxx" className="text-gray-400 hover:text-orange-400 transition-colors">
                  1900-xxxx
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="mailto:info@dulichviet.com" className="text-gray-400 hover:text-orange-400 transition-colors">
                  info@dulichviet.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-lg mb-1">Đăng ký nhận tin</h4>
              <p className="text-gray-400 text-sm">Nhận các ưu đãi mới nhất từ chúng tôi</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 md:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-r-lg transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Du Lịch Việt. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
