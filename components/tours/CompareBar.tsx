"use client";

import Link from "next/link";
import Image from "next/image";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { useTourCompare } from "@/hooks/useTours";
import { useState, useEffect } from "react";

interface CompareBarProps {
  className?: string;
}

export default function CompareBar({ className = "" }: CompareBarProps) {
  const { compareState, removeTour, clearAll } = useTourCompare();
  const [isMounted, setIsMounted] = useState(false);
  const { selectedTours, isOpen } = compareState;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch - render nothing on server
  if (!isMounted) {
    return null;
  }

  if (selectedTours.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50 transform transition-transform duration-300 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selected Tours */}
          <div className="flex items-center gap-3 overflow-x-auto flex-1">
            {selectedTours.map((tour, index) => (
              <div
                key={tour.id}
                className="flex items-center gap-2 bg-gray-100 rounded-full pr-2 pl-1 py-1 flex-shrink-0"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {tour.name}
                </span>
                <button
                  onClick={() => removeTour(tour.id)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}

            {/* Add more hint */}
            {selectedTours.length < 3 && (
              <span className="text-sm text-gray-400 flex-shrink-0">
                Thêm tour để so sánh
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Xóa tất cả
            </button>
            <Link
              href="/tours/compare"
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              So sánh ({selectedTours.length})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Compare Button (shown when not expanded)
export function FloatingCompareButton() {
  const { compareState } = useTourCompare();
  const [isMounted, setIsMounted] = useState(false);
  const { selectedTours } = compareState;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || selectedTours.length < 2) {
    return null;
  }

  return (
    <Link
      href="/tours/compare"
      className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
    >
      <GitCompare className="w-5 h-5" />
      So sánh ({selectedTours.length})
    </Link>
  );
}
