"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Star, 
  Check, 
  X, 
  Clock, 
  MapPin,
  Users,
  CreditCard
} from "lucide-react";
import { useTourCompare, useToursCompareData } from "@/hooks/useTours";
import { TourDetailData } from "@/types/tours";
import { defaultTourImages } from "@/types/tours";

export default function ComparePageContent() {
  const { compareState, clearAll, removeTour } = useTourCompare();
  const [isMounted, setIsMounted] = useState(false);
  const tourIds = compareState.selectedTours.map(t => t.id);
  const { tours, isLoading, error } = useToursCompareData({ tourIds: isMounted ? tourIds : [] });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đang tải...
          </h2>
        </div>
      </div>
    );
  }

  if (tourIds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chưa có tour để so sánh
          </h2>
          <p className="text-gray-500 mb-8">
            Hãy chọn ít nhất 2 tour từ danh sách để so sánh
          </p>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Xem danh sách tour
          </Link>
        </div>
      </div>
    );
  }

  if (tourIds.length === 1) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cần thêm tour để so sánh
          </h2>
          <p className="text-gray-500 mb-8">
            Hãy chọn thêm ít nhất 1 tour nữa để so sánh
          </p>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Chọn thêm tour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/tours"
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách tour
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            So sánh Tour
          </h1>
          <p className="text-gray-500 mt-1">
            So sánh {tours.length} tour để chọn tour phù hợp nhất
          </p>
        </div>
        <button
          onClick={clearAll}
          className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Xóa tất cả
        </button>
      </div>

      {isLoading ? (
        <CompareTableSkeleton />
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Có lỗi khi tải dữ liệu. Vui lòng thử lại.
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {/* Compare Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 text-left w-40 bg-gray-50 font-semibold text-gray-600"></th>
                  {tours.map((tour) => (
                    <th key={tour.id} className="p-4 text-center w-64">
                      <div className="relative">
                        <button
                          onClick={() => removeTour(tour.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                        </button>
                        <div className="aspect-video relative rounded-lg overflow-hidden mb-3">
                          <Image
                            src={tour.images[0] || defaultTourImages.placeholder}
                            alt={tour.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="font-semibold text-gray-900 line-clamp-2 text-sm">
                          {tour.name}
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty columns */}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="p-4 w-64">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Tour {i + tours.length + 1}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">Giá</td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4 text-center">
                      <div className="font-bold text-orange-600 text-lg">
                        {(tour.discountPrice || tour.price).toLocaleString('vi-VN')}đ
                      </div>
                      {tour.discountPrice && tour.discountPrice < tour.price && (
                        <div className="text-sm text-gray-400 line-through">
                          {tour.price.toLocaleString('vi-VN')}đ
                        </div>
                      )}
                      <div className="text-xs text-gray-500">/người</div>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Duration */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Thời gian
                  </td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4 text-center">
                      <span className="font-medium">{tour.duration}</span>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Destinations */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Điểm đến
                  </td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4 text-center">
                      <div className="text-sm">
                        {tour.destinations.map((dest, i) => (
                          <span key={i}>
                            {dest}
                            {i < tour.destinations.length - 1 && <span className="text-gray-400">, </span>}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Highlights */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">Điểm nổi bật</td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4">
                      <ul className="text-sm space-y-1">
                        {(tour.highlights || []).slice(0, 3).map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Includes */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">Bao gồm</td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4">
                      <ul className="text-sm space-y-1">
                        {(tour.includes || []).slice(0, 5).map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Excludes */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">Không bao gồm</td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4">
                      <ul className="text-sm space-y-1">
                        {(tour.excludes || []).slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">
                    <Star className="w-4 h-4 inline mr-1" />
                    Đánh giá
                  </td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{tour.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({tour.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Booking Count */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    Đã đặt
                  </td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4 text-center">
                      <span className="font-semibold text-orange-600">
                        {tour.bookingCount.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-gray-500 text-sm"> khách</span>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4"></td>
                  {tours.map((tour) => (
                    <td key={tour.id} className="p-4 text-center">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/tours/${tour.id}`}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                        <Link
                          href={`/booking?tour=${tour.id}`}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Đặt Tour
                        </Link>
                      </div>
                    </td>
                  ))}
                  {[...Array(3 - tours.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="p-4"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add More Tours */}
      {tours.length < 3 && (
        <div className="mt-8 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-full text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            + Thêm tour để so sánh
          </Link>
        </div>
      )}
    </div>
  );
}

function CompareTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
