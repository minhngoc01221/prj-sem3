"use client";

import Link from "next/link";
import { Flame, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useHotDeals } from "@/hooks/useInformationData";
import TourCard, { TourCardSkeleton } from "./TourCard";

interface HotDealsSectionProps {
  className?: string;
}

export default function HotDealsSection({ className = "" }: HotDealsSectionProps) {
  const { tours, isLoading } = useHotDeals({ limit: 8 });

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-600 uppercase tracking-wider">
                Hot Deals
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Tour Giảm Giá
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Grab these amazing deals before they're gone! Limited time offers with up to 50% off.
            </p>
          </div>
          
          <Link
            href="/tours?filter=discounted"
            className="hidden md:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
          >
            View All Deals
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
            {tours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                showCountdown={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/tours?filter=discounted"
            className="inline-flex items-center gap-2 text-orange-600 font-medium"
          >
            View All Deals
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
        <Flame className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Hot Deals Available
      </h3>
      <p className="text-gray-500 mb-4">
        Check back soon for exciting promotions!
      </p>
      <Link
        href="/tours"
        className="inline-flex items-center gap-2 text-orange-600 font-medium"
      >
        Browse All Tours
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
