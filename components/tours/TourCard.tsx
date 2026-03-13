"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  Users, 
  MapPin,
  Heart,
  GitCompare,
  Check
} from "lucide-react";
import { TourCardData, calculateDiscountPercent, defaultTourImages } from "@/types/tours";
import { useTourCompare } from "@/hooks/useTours";
import { useState, useEffect, memo } from "react";

interface TourCardProps {
  tour: TourCardData;
  showCompareButton?: boolean;
  className?: string;
}

// Optimized TourCard with memo to prevent unnecessary re-renders
function TourCardComponent({
  tour,
  showCompareButton = true,
  className = ""
}: TourCardProps) {
  const { addTour, removeTour, isInCompare, canAddMore } = useTourCompare();
  const [imageError, setImageError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const discountPercent = tour.discountPercent ||
    (tour.discountPrice ? calculateDiscountPercent(tour.price, tour.discountPrice) : 0);

  const hasDiscount = discountPercent > 0;
  const isInCompareList = isMounted && isInCompare(tour.id);
  const canAdd = isMounted && canAddMore();

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCompareList) {
      removeTour(tour.id);
    } else if (canAdd) {
      addTour({
        id: tour.id,
        name: tour.name,
        image: tour.images[0] || defaultTourImages.placeholder,
        price: tour.discountPrice || tour.price,
      });
    }
  };

  const imageSrc = imageError 
    ? defaultTourImages.placeholder 
    : (tour.images[0] || defaultTourImages.placeholder);

  return (
    <Link
      href={`/tours/${tour.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Main Image */}
        <Image
          src={imageSrc}
          alt={tour.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {tour.isNewArrival && (
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
              NEW
            </span>
          )}
          {tour.isHotDeal && (
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
              HOT
            </span>
          )}
          {tour.isFeatured && !tour.isHotDeal && !tour.isNewArrival && (
            <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full shadow-lg">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist & Compare Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Compare Button */}
          {showCompareButton && isMounted && (
            <button
              onClick={handleCompareToggle}
              disabled={!canAdd && !isInCompareList}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                isInCompareList 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : canAdd 
                    ? 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-110'
                    : 'bg-white/50 text-gray-400 cursor-not-allowed'
              }`}
              title={isInCompareList ? 'Bỏ so sánh' : canAdd ? 'Thêm vào so sánh' : 'Đã đủ 3 tour'}
            >
              {isInCompareList ? <Check className="w-5 h-5" /> : <GitCompare className="w-5 h-5" />}
            </button>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle wishlist
            }}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
            title="Thêm vào yêu thích"
          >
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Booking Count Badge */}
        {tour.bookingCount > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{(tour.bookingCount || 0).toLocaleString('vi-VN')} đã đặt</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Destination */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <span className="truncate">{tour.destinations?.join(", ") || ""}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-2 min-h-[3rem]">
          {tour.name}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{(tour.rating || 0).toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-400">({tour.reviewCount || 0} đánh giá)</span>
        </div>

        {/* Tour Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
          {tour.groupSize && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Max {tour.groupSize}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-orange-600">
                  {tour.discountPrice?.toLocaleString('vi-VN')}đ
                </span>
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {(tour.price || 0).toLocaleString('vi-VN')}đ
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {(tour.price || 0).toLocaleString('vi-VN')}đ
              </span>
            )}
            <span className="text-sm text-gray-500">/người</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Memoize TourCard to prevent unnecessary re-renders when compare state changes
const TourCard = memo(TourCardComponent);

// Add display name for better debugging
TourCard.displayName = "TourCard";

// Export as default
export default TourCard;

// Skeleton loading state
export function TourCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm ${className}`}>
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
