import type { Metadata } from "next";
import { Suspense } from "react";
import ToursListing from "./ToursListing";

export const metadata: Metadata = {
  title: "Danh sách Tour Du lịch - Karnel Travels",
  description: "Khám phá và đặt tour du lịch hấp dẫn. Tour nổi bật, tour mới, tour giảm giá. Đặt tour ngay để nhận ưu đãi.",
  keywords: ["tour du lịch", "đặt tour", "tour nổi bật", "tour giảm giá", "du lịch Việt Nam"],
};

export default function ToursPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<ToursListingSkeleton />}>
        <ToursListing />
      </Suspense>
    </main>
  );
}

function ToursListingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-12 bg-white/20 rounded-lg w-3/4 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
