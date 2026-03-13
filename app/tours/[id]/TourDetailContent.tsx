"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  ChevronRight,
  ChevronLeft,
  Share2,
  Heart
} from "lucide-react";
import { useTourDetail } from "@/hooks/useTours";
import { TourDetailData } from "@/types/tours";
import TourGallery from "@/components/tours/TourDetail/TourGallery";
import TourItinerary from "@/components/tours/TourDetail/TourItinerary";
import TourServices from "@/components/tours/TourDetail/TourServices";
import TourReviews from "@/components/tours/TourDetail/TourReviews";
import TourRelatedTours from "@/components/tours/TourDetail/TourRelatedTours";
import TourBooking from "@/components/tours/TourDetail/TourBooking";
import CompareBar from "@/components/tours/CompareBar";

interface TourDetailContentProps {
  tourId: string;
}

type TabType = 'itinerary' | 'services' | 'reviews';

export default function TourDetailContent({ tourId }: TourDetailContentProps) {
  const { tour, isLoading, error } = useTourDetail({ id: tourId });
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [showStickyBooking, setShowStickyBooking] = useState(false);

  // Handle sticky booking bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        const rect = bookingSection.getBoundingClientRect();
        setShowStickyBooking(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <TourDetailSkeleton />;
  }

  if (error || !tour) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour không tồn tại</h1>
        <Link href="/tours" className="text-orange-600 hover:text-orange-700">
          Quay lại danh sách tour
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-600">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/tours" className="text-gray-500 hover:text-orange-600">Tour</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-orange-600 font-medium truncate">{tour.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <TourGallery images={tour.images} tourName={tour.name} />

            {/* Tour Info Header */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tour.isFeatured && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">Nổi bật</span>
                )}
                {tour.isNewArrival && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Mới</span>
                )}
                {tour.isHotDeal && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">Hot Deal</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{tour.name}</h1>

              {/* Destinations */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>{tour.destinations.join(" → ")}</span>
              </div>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{tour.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({tour.reviewCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Tối đa {tour.groupSize} khách</span>
                </div>
              </div>

              {/* Share & Wishlist */}
              <div className="flex items-center gap-3 mt-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Chia sẻ</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Yêu thích</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                {[
                  { id: 'itinerary', label: 'Lịch trình' },
                  { id: 'services', label: 'Dịch vụ' },
                  { id: 'reviews', label: 'Đánh giá' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`pb-4 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-orange-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 'itinerary' && (
                <TourItinerary itinerary={tour.itinerary || []} />
              )}
              {activeTab === 'services' && (
                <TourServices 
                  includes={tour.includes || []} 
                  excludes={tour.excludes || []} 
                />
              )}
              {activeTab === 'reviews' && (
                <TourReviews 
                  reviews={tour.reviews || []} 
                  reviewStats={tour.reviewStats} 
                />
              )}
            </div>

            {/* Related Tours */}
            <TourRelatedTours tours={tour.relatedTours || []} currentTourId={tour.id} />
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1" id="booking-section">
            <TourBooking tour={tour} />
          </div>
        </div>
      </div>

      {/* Sticky Booking Bar */}
      {showStickyBooking && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900">{tour.name}</div>
                <div className="text-orange-600 font-bold">
                  {(tour.discountPrice || tour.price).toLocaleString('vi-VN')}đ/người
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50"
                >
                  Chọn ngày
                </button>
                <button 
                  onClick={() => window.location.href = `/booking?tour=${tour.id}`}
                  className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full"
                >
                  Đặt Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CompareBar />
    </>
  );
}

function TourDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 h-fit">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-14 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
