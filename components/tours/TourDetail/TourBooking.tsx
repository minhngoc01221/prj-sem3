"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  Users, 
  MapPin,
  Calendar,
  ChevronRight,
  Check,
  X,
  Minus,
  Plus,
  CreditCard,
  ShieldCheck,
  Truck
} from "lucide-react";
import { useState } from "react";
import { useTourCompare } from "@/hooks/useTours";
import { TourDetailData, defaultTourImages, calculateDiscountPercent } from "@/types/tours";

interface TourBookingProps {
  tour: TourDetailData;
}

export default function TourBooking({ tour }: TourBookingProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateType, setDateType] = useState<"schedule" | "custom">("schedule");
  const [customDate, setCustomDate] = useState<string>("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Get minimum date for custom selection (3 days from now)
  const minDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  })();

  const totalGuests = adults + children;
  const displayPrice = tour.discountPrice || tour.price || 0;
  const totalPrice = displayPrice * adults + (displayPrice * 0.7 * children);

  const getSelectedDateValue = () => {
    if (dateType === "custom" && customDate) {
      return customDate;
    }
    return selectedDate;
  };

  const handleBooking = () => {
    const finalDate = getSelectedDateValue();
    if (!finalDate) {
      alert("Vui lòng chọn ngày khởi hành");
      return;
    }
    // Navigate to booking page
    window.location.href = `/booking?tour=${tour.id}&date=${finalDate}&adults=${adults}&children=${children}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {tour.discountPrice && tour.discountPrice < tour.price && (
            <>
              <span className="text-2xl font-bold text-gray-400 line-through">
                {tour.price?.toLocaleString('vi-VN')}đ
              </span>
              <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                -{tour.discountPercent || calculateDiscountPercent(tour.price, tour.discountPrice)}%
              </span>
            </>
          )}
        </div>
        <div className="text-3xl font-bold text-orange-600">
          {displayPrice.toLocaleString('vi-VN')}đ
        </div>
        <div className="text-sm text-gray-500">/người</div>
      </div>

      {/* Date Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Chọn ngày khởi hành
        </label>

        {/* Date Type Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setDateType("schedule")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
              dateType === "schedule"
                ? "bg-orange-100 text-orange-700 border border-orange-300"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            Ngày cố định
          </button>
          <button
            type="button"
            onClick={() => setDateType("custom")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
              dateType === "custom"
                ? "bg-orange-100 text-orange-700 border border-orange-300"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            Ngày tùy chọn
          </button>
        </div>

        {dateType === "schedule" ? (
          (() => {
            // Use availableDates first, fallback to startDates
            const dates = (tour as any).availableDates?.length > 0
              ? (tour as any).availableDates
              : tour.startDates || [];

            if (dates.length === 0) {
              return (
                <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-center">
                  Chưa có ngày khởi hành. Chọn "Ngày tùy chọn" để đặt theo yêu cầu.
                </div>
              );
            }

            return (
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">Chọn ngày</option>
                {dates.map((date: string) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            );
          })()
        ) : (
          <div className="space-y-2">
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              min={minDate}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
            <p className="text-xs text-gray-500">
              Chọn ngày khởi hành theo yêu cầu của bạn. Vui lòng liên hệ hotline để xác nhận.
            </p>
          </div>
        )}
      </div>

      {/* Guests Counter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="w-4 h-4 inline mr-1" />
          Số lượng khách
        </label>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div>
            <div className="text-sm font-medium">Người lớn</div>
            <div className="text-xs text-gray-500">Từ 12 tuổi trở lên</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{adults}</span>
            <button
              onClick={() => setAdults(Math.min(tour.groupSize || 30, adults + 1))}
              className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mt-2">
          <div>
            <div className="text-sm font-medium">Trẻ em</div>
            <div className="text-xs text-gray-500">Dưới 12 tuổi</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{children}</span>
            <button
              onClick={() => setChildren(Math.min((tour.groupSize || 30) - adults, children + 1))}
              className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="border-t border-gray-100 pt-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">
            {adults} người lớn {children > 0 ? `+ ${children} trẻ em` : ''}
          </span>
          <span className="text-xl font-bold text-orange-600">
            {totalPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleBooking}
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Đặt Tour Ngay
      </button>

      {/* Trust Badges */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-6 h-6 text-green-500 mb-1" />
          <span className="text-xs text-gray-500">Bảo đảm</span>
        </div>
        <div className="flex flex-col items-center">
          <Check className="w-6 h-6 text-green-500 mb-1" />
          <span className="text-xs text-gray-500">Xác nhận</span>
        </div>
        <div className="flex flex-col items-center">
          <Truck className="w-6 h-6 text-green-500 mb-1" />
          <span className="text-xs text-gray-500">Tiện lợi</span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Thời gian: {tour.duration || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>Điểm đến: {tour.destinations?.join(", ") || ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Tối đa {tour.groupSize || 30} khách/tour</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center gap-6">
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">{(tour.bookingCount || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500">Đã đặt</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">{tour.reviewCount || 0}</div>
          <div className="text-xs text-gray-500">Đánh giá</div>
        </div>
      </div>
    </div>
  );
}
