"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface TourGalleryProps {
  images: string[];
  tourName: string;
}

export default function TourGallery({ images, tourName }: TourGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const displayImages = images.length > 0 
    ? images 
    : ['/images/placeholder-tour.jpg'];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={displayImages[selectedIndex]}
            alt={`${tourName} - Hình ảnh ${selectedIndex + 1}`}
            fill
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
            onClick={() => setShowLightbox(true)}
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          
          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {displayImages.slice(0, 5).map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  selectedIndex === index 
                    ? 'ring-2 ring-orange-500 ring-offset-2' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {index === 4 && displayImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                    +{displayImages.length - 5}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={handlePrev}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <Image
            src={displayImages[selectedIndex]}
            alt={`${tourName} - Hình ảnh ${selectedIndex + 1}`}
            width={1200}
            height={800}
            className="object-contain max-w-full max-h-full"
          />
          
          <button
            onClick={handleNext}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 text-white rounded-full">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
