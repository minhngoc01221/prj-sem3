"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNewArrivals } from "@/hooks/useInformationData";
import TourCard, { TourCardSkeleton } from "./TourCard";

interface NewToursSectionProps {
  className?: string;
}

export default function NewToursSection({ className = "" }: NewToursSectionProps) {
  const { tours, isLoading } = useNewArrivals({ limit: 8, daysThreshold: 30 });

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600 uppercase tracking-wider">
                New Arrivals
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Tour Mới
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Explore our newest tour packages! Fresh adventures added recently with exclusive launch prices.
            </p>
          </div>
          
          <Link
            href="/tours?filter=new"
            className="hidden md:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
          >
            View All New Tours
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
            href="/tours?filter=new"
            className="inline-flex items-center gap-2 text-orange-600 font-medium"
          >
            View All New Tours
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
        No New Tours Available
      </h3>
      <p className="text-gray-500 mb-4">
        Check back soon for new tour packages!
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
