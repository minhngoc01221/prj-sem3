"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { TourCardData } from "@/types/tours";
import TourCard from "../TourCard";

interface TourRelatedToursProps {
  tours: TourCardData[];
  currentTourId?: string;
}

export default function TourRelatedTours({ tours, currentTourId }: TourRelatedToursProps) {
  if (!tours || tours.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Tour liên quan</h3>
        <Link
          href="/tours"
          className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
        >
          Xem tất cả
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tours
          .filter(t => t.id !== currentTourId)
          .slice(0, 4)
          .map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              showCompareButton={false}
            />
          ))}
      </div>
    </div>
  );
}
