"use client";

import { ArrowRight, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Khám phá Việt Nam</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
            Trải Nghiệm
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Du Lịch Đáng Nhớ
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            Khám phá những vùng đất tuyệt đẹp của Việt Nam cùng chúng tôi. 
            Tận hưởng dịch vụ chuyên nghiệp, giá cả hợp lý và những khoảnh khắc đáng nhớ.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
            <a
              href="#book-tour"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30"
            >
              Đặt Tour Ngay
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#destinations"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            >
              Khám Phá Điểm Đến
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
              <div className="text-gray-400 text-sm">Tour Du Lịch</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
              <div className="text-gray-400 text-sm">Khách Hàng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">98%</div>
              <div className="text-gray-400 text-sm">Hài Lòng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
