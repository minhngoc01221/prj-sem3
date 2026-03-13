"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Heart, 
  Calendar,
  Ticket,
  ChevronRight
} from "lucide-react";
import { SpotCardData, regionLabelsEn, spotTypeLabelsEn } from "@/types/spots";

interface SpotCardProps {
  spot: SpotCardData;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

// Placeholder gradient based on spot type
function getPlaceholderGradient(spotType: string): string {
  const gradients: Record<string, string> = {
    beach: "from-cyan-400 via-blue-500 to-blue-600",
    mountain: "from-green-400 via-emerald-500 to-teal-600",
    historical: "from-amber-400 via-orange-500 to-red-500",
    waterfall: "from-blue-400 via-cyan-500 to-teal-600",
    island: "from-yellow-400 via-orange-500 to-pink-500",
    lake: "from-blue-300 via-sky-500 to-indigo-600",
    cave: "from-gray-400 via-slate-500 to-zinc-600",
    park: "from-green-300 via-emerald-400 to-teal-500",
  };
  return gradients[spotType] || "from-orange-400 via-amber-500 to-yellow-600";
}

export default function SpotCard({ spot, className = "", variant = "default" }: SpotCardProps) {
  if (variant === "compact") {
    return <SpotCardCompact spot={spot} className={className} />;
  }
  
  if (variant === "featured") {
    return <SpotCardFeatured spot={spot} className={className} />;
  }
  
  return <SpotCardDefault spot={spot} className={className} />;
}

// Default Card Variant
function SpotCardDefault({ spot, className = "" }: { spot: SpotCardData; className?: string }) {
  const gradientClass = getPlaceholderGradient(spot.spotType as string);
  const hasValidImage = spot.images && spot.images.length > 0 && spot.images[0];
  
  return (
    <Link
      href={`/spots/${spot.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {hasValidImage ? (
          <Image
            src={spot.images[0]}
            alt={spot.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <MapPin className="w-12 h-12 text-white/50" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
            {spotTypeLabelsEn[spot.spotType as keyof typeof spotTypeLabelsEn] || spot.spotType}
          </span>
        </div>

        {/* Region Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            {regionLabelsEn[spot.region as keyof typeof regionLabelsEn] || spot.region}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        >
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span className="truncate">{spot.location}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-2">
          {spot.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {spot.description}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{spot.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-400">({spot.reviewCount} reviews)</span>
          </div>
          
          {spot.ticketPrice && (
            <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
              <Ticket className="w-4 h-4" />
              <span>{spot.ticketPrice}</span>
            </div>
          )}
        </div>

        {/* Best Time */}
        {spot.bestTime && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">
              Best time: <span className="font-medium text-gray-900">{spot.bestTime}</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// Compact Card Variant
function SpotCardCompact({ spot, className = "" }: { spot: SpotCardData; className?: string }) {
  const gradientClass = getPlaceholderGradient(spot.spotType as string);
  const hasValidImage = spot.images && spot.images.length > 0 && spot.images[0];
  
  return (
    <Link
      href={`/spots/${spot.id}`}
      className={`group flex gap-4 p-3 bg-white rounded-xl hover:shadow-md transition-all ${className}`}
    >
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {hasValidImage ? (
          <Image
            src={spot.images[0]}
            alt={spot.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <MapPin className="w-6 h-6 text-white/50" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {spot.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{spot.location}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">{spot.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-400">({spot.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}

// Featured Card Variant
function SpotCardFeatured({ spot, className = "" }: { spot: SpotCardData; className?: string }) {
  const gradientClass = getPlaceholderGradient(spot.spotType as string);
  const hasValidImage = spot.images && spot.images.length > 0 && spot.images[0];
  
  return (
    <Link
      href={`/spots/${spot.id}`}
      className={`group block relative rounded-2xl overflow-hidden ${className}`}
    >
      <div className="relative aspect-[3/4]">
        {hasValidImage ? (
          <Image
            src={spot.images[0]}
            alt={spot.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <MapPin className="w-16 h-16 text-white/30" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {/* Badges */}
          <div className="flex gap-2 mb-3">
            <span className="px-2 py-1 bg-orange-500 text-xs font-medium rounded-full">
              {spotTypeLabelsEn[spot.spotType as keyof typeof spotTypeLabelsEn] || spot.spotType}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
            {spot.name}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span className="text-white/80">{spot.location}</span>
          </div>
          
          {/* Rating & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{spot.rating.toFixed(1)}</span>
              <span className="text-white/60">({spot.reviewCount} reviews)</span>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Skeleton Loading
export function SpotCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm ${className}`}>
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
