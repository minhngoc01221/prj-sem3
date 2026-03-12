"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Sẵn Sàng Cho Hành Trình Của Bạn?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Để lại thông tin, đội ngũ tư vấn viên của Karnel Travels sẽ liên hệ và hỗ trợ bạn lập kế hoạch hoàn hảo nhất.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              Đặt Tour Ngay
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-full border border-white/30 transition-all duration-300 hover:bg-white/20"
            >
              Liên Hệ Tư Vấn
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/80">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>1900 xxxx</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>info@karneltravels.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
