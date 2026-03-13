"use client";

import { useSearchParams } from "next/navigation";
import { useSpots, useSpotPagination } from "@/hooks/useSpots";
import SpotCard, { SpotCardSkeleton } from "./SpotCard";
import { SpotSearchParams, Region, SpotType } from "@/types/spots";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SpotGridProps {
  className?: string;
}

export default function SpotGrid({ className = "" }: SpotGridProps) {
  const searchParams = useSearchParams();
  
  // Build params from URL
  const initialParams: SpotSearchParams = {
    query: searchParams.get("query") || undefined,
    region: searchParams.get("region") as Region || undefined,
    spotType: searchParams.get("type") as SpotType || undefined,
    sortBy: (searchParams.get("sortBy") as SpotSearchParams['sortBy']) || "rating",
    sortOrder: (searchParams.get("sortOrder") as SpotSearchParams['sortOrder']) || "desc",
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    limit: 12,
  };

  const { 
    spots, 
    isLoading, 
    params, 
    setParams, 
    pagination,
    filters 
  } = useSpots({ 
    initialParams,
  });

  const { 
    goToPage, 
    nextPage, 
    prevPage, 
    currentPage, 
    totalPages,
    hasNext, 
    hasPrev 
  } = useSpotPagination(pagination, setParams);

  return (
    <div className={className}>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {pagination?.total || 0} destinations found
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SpotCardSkeleton key={i} />
          ))}
        </div>
      ) : spots.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={!hasPrev}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-orange-500 text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={nextPage}
                  disabled={!hasNext}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No destinations found
      </h3>
      <p className="text-gray-500 mb-6">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
}
