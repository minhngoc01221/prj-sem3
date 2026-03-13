"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNewArrivals } from "@/hooks/useTours";
import TourCard, { TourCardSkeleton } from "./TourCard";

interface NewArrivalsProps {
  limit?: number;
  className?: string;
}

export default function NewArrivals({ limit = 8, className = "" }: NewArrivalsProps) {
  const { tours, isLoading, error } = useNewArrivals({ limit });

  if (error) {
    return null;
  }

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600 uppercase tracking-wider">
                Mới nhất
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Tour Mới
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Khám phá những tour mới được cập nhật gần đây với lịch trình hấp dẫn
            </p>
          </div>
          
          <Link
            href="/tours?filter=new"
            className="hidden md:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <TourCardSkeleton key={i} />
            ))}
          </div>
        ) : tours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours.slice(0, 4).map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                showCompareButton={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/tours?filter=new"
            className="inline-flex items-center gap-2 text-orange-600 font-medium"
          >
            Xem tất cả tour mới
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Chưa có tour mới
      </h3>
      <p className="text-gray-500 mb-4">
        Hãy quay lại sau để xem các tour mới!
      </p>
      <Link
        href="/tours"
        className="inline-flex items-center gap-2 text-orange-600 font-medium"
      >
        Xem tất cả tour
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
