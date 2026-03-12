"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, X, ChevronLeft, ChevronRight } from "lucide-react";

const awards = [
  {
    name: "Top 10 Công ty Du lịch uy tín",
    organization: "TripAdvisor",
    year: "2024",
    description: "Được bình chọn trong top 10 công ty du lịch uy tín nhất Việt Nam",
    icon: "🏆",
  },
  {
    name: "Chứng nhận Du lịch Xanh",
    organization: "Bộ Du lịch Việt Nam",
    year: "2023",
    description: "Cam kết phát triển du lịch bền vững và thân thiện với môi trường",
    icon: "🌿",
  },
  {
    name: "Giải thưởng Dịch vụ Khách hàng xuất sắc",
    organization: "Vietnam Customer Awards",
    year: "2023",
    description: "Đạt giải thưởng dịch vụ khách hàng xuất sắc nhất trong ngành du lịch",
    icon: "⭐",
  },
  {
    name: "Hội viên VITA",
    organization: "Hiệp hội Lữ hành Việt Nam",
    year: "2022",
    description: "Là hội viên chính thức của Hiệp hội Lữ hành Việt Nam",
    icon: "🎖️",
  },
  {
    name: "Chứng nhận An toàn Du lịch",
    organization: "Sở Du lịch TP.HCM",
    year: "2022",
    description: "Đạt chứng nhận an toàn du lịch từ Sở Du lịch TP.HCM",
    icon: "🛡️",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1542640244-7e67286feb90?w=800&q=80",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "https://images.unsplash.com/photo-1534430480872-6c74c477a309?w=800&q=80",
];

export default function GalleryAndAwards() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Awards Section */}
        <div className="mb-20">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Giải Thưởng & Chứng Nhận
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Những Thành Tựu Trên <span className="text-orange-500">Hành Trình Phục Vụ</span>
            </h2>
          </div>

          {/* Awards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-orange-100"
              >
                <div className="text-4xl mb-3">{award.icon}</div>
                <div className="text-xs font-bold text-orange-600 mb-1">{award.year}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                  {award.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {award.organization}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        <div>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Hình Ảnh Thực Tế
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khoảnh Khắc Đáng Nhớ <span className="text-orange-500">Cùng Karnel Travels</span>
            </h2>
            <p className="text-gray-600">
              Hình ảnh thực tế từ hành trình của chúng tôi và khách hàng
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative h-48 md:h-60 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={galleryImages[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
