"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  Users, 
  MapPin,
  Tag,
  Heart,
  ChevronRight
} from "lucide-react";
import { TourCardData, calculateDiscount } from "@/types/information";
import { CompactCountdown } from "./CountdownTimer";

interface TourCardProps {
  tour: TourCardData;
  showCountdown?: boolean;
  countdownEndDate?: string;
  className?: string;
}

export default function TourCard({ 
  tour, 
  showCountdown = false, 
  countdownEndDate,
  className = "" 
}: TourCardProps) {
  const discountPercent = tour.discountPercent || 
    (tour.discountPrice ? calculateDiscount(tour.price, tour.discountPrice) : 0);
  
  const hasDiscount = discountPercent > 0;

  return (
    <Link
      href={`/tours/${tour.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Main Image */}
        <Image
          src={tour.images[0] || "/images/placeholder-tour.jpg"}
          alt={tour.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
              -{discountPercent}%
            </span>
          )}
          {tour.isNewArrival && (
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
              NEW
            </span>
          )}
          {tour.isHotDeal && (
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
              HOT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            // Handle wishlist
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        >
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Countdown Timer Overlay */}
        {showCountdown && countdownEndDate && (
          <div className="absolute bottom-3 left-3 right-3">
            <CompactCountdown endDate={countdownEndDate} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Destination */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span className="truncate">{tour.destinations.join(", ")}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-2">
          {tour.name}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{tour.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-400">({tour.reviewCount} reviews)</span>
        </div>

        {/* Tour Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{tour.groupSize} guests</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-orange-600">
                  ${tour.discountPrice?.toLocaleString()}
                </span>
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ${tour.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${tour.price.toLocaleString()}
              </span>
            )}
            <span className="text-sm text-gray-500">/person</span>
          </div>
          
          <div className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

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
