"use client";

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Check,
  Star
} from 'lucide-react';
import type { RoomType, RoomPricing } from '@/types/admin';
import { formatPrice } from './mockData';

interface DatePricingCalendarProps {
  roomType: RoomType;
  onUpdatePricing: (pricing: RoomPricing[]) => void;
}

export function DatePricingCalendar({ roomType, onUpdatePricing }: DatePricingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pricing, setPricing] = useState<RoomPricing[]>(roomType.pricing || []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setPricing(roomType.pricing || []);
  }, [roomType.pricing]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date: Date, day: number) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getPricingForDate = (dateKey: string): RoomPricing | undefined => {
    return pricing.find(p => p.date === dateKey);
  };

  const getPriceForDate = (dateKey: string): number => {
    const pricingData = getPricingForDate(dateKey);
    if (pricingData) return pricingData.price;

    // Default pricing logic based on day of week
    const date = new Date(dateKey);
    const dayOfWeek = date.getDay();
    let basePrice = roomType.basePrice;

    // Weekend pricing
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return Math.round(basePrice * 1.2);
    }

    return basePrice;
  };

  const getAvailabilityForDate = (dateKey: string) => {
    if (!roomType.availability) return null;
    return roomType.availability.find(a => a.date === dateKey);
  };

  const isSpecialDate = (dateKey: string): boolean => {
    const pricingData = getPricingForDate(dateKey);
    return pricingData?.isSpecial || false;
  };

  const getSpecialReason = (dateKey: string): string | undefined => {
    const pricingData = getPricingForDate(dateKey);
    return pricingData?.specialReason;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (dateKey: string) => {
    setSelectedDate(dateKey);
    setEditingPrice(getPriceForDate(dateKey));
    setShowEditModal(true);
  };

  const handleSavePrice = () => {
    if (!selectedDate || editingPrice === null) return;

    const existingIndex = pricing.findIndex(p => p.date === selectedDate);
    const isSpecial = editingPrice !== roomType.basePrice;
    const specialReason = isSpecial ? getSpecialReason(selectedDate) || 'Giá đặc biệt' : undefined;

    let newPricing: RoomPricing[];

    if (existingIndex >= 0) {
      newPricing = pricing.map((p, i) =>
        i === existingIndex
          ? { ...p, price: editingPrice, isSpecial, specialReason }
          : p
      );
    } else {
      newPricing = [
        ...pricing,
        {
          id: `price-${Date.now()}`,
          date: selectedDate,
          price: editingPrice,
          isSpecial,
          specialReason
        }
      ];
    }

    setPricing(newPricing);
    onUpdatePricing(newPricing);
    setShowEditModal(false);
    setSelectedDate(null);
    setEditingPrice(null);
  };

  const handleBulkUpdate = (dayOfWeek: number[], multiplier: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);

    let newPricing = [...pricing];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (dayOfWeek.includes(date.getDay())) {
        const dateKey = formatDateKey(currentDate, day);
        const newPrice = Math.round(roomType.basePrice * multiplier);
        const existingIndex = newPricing.findIndex(p => p.date === dateKey);

        if (existingIndex >= 0) {
          newPricing[existingIndex] = {
            ...newPricing[existingIndex],
            price: newPrice,
            isSpecial: multiplier !== 1,
            specialReason: multiplier !== 1 ? (multiplier > 1 ? 'Cuối tuần' : 'Giảm giá') : undefined
          };
        } else {
          newPricing.push({
            id: `price-${Date.now()}-${day}`,
            date: dateKey,
            price: newPrice,
            isSpecial: multiplier !== 1,
            specialReason: multiplier !== 1 ? (multiplier > 1 ? 'Cuối tuần' : 'Giảm giá') : undefined
          });
        }
      }
    }

    setPricing(newPricing);
    onUpdatePricing(newPricing);
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Lịch giá - {roomType.name}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBulkUpdate([0, 6], 1.2)}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            +20% Cuối tuần
          </button>
          <button
            onClick={() => handleBulkUpdate([1, 2, 3, 4, 5], 0.9)}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            -10% Weekday
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((day, index) => (
            <div
              key={day}
              className={`py-3 text-center text-sm font-medium ${
                index === 0 ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for first day */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[100px] bg-gray-50" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateKey = formatDateKey(currentDate, day);
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isPast = date < today;
            const isToday = date.getTime() === today.getTime();
            const isSpecial = isSpecialDate(dateKey);
            const price = getPriceForDate(dateKey);
            const availability = getAvailabilityForDate(dateKey);
            const isAvailable = !availability || availability.available > 0;
            const priceChange = Math.round(((price - roomType.basePrice) / roomType.basePrice) * 100);

            return (
              <div
                key={day}
                onClick={() => !isPast && handleDateClick(dateKey)}
                className={`min-h-[100px] p-2 border-t border-r border-gray-100 cursor-pointer transition-colors ${
                  isPast ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-orange-50'
                } ${isToday ? 'bg-orange-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isPast ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {day}
                </div>

                {!isPast && (
                  <>
                    <div className={`text-xs font-semibold ${
                      isSpecial ? 'text-orange-600' : 'text-gray-700'
                    }`}>
                      {formatPrice(price)}
                    </div>

                    {priceChange !== 0 && (
                      <div className={`text-xs ${priceChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {priceChange > 0 ? '+' : ''}{priceChange}%
                      </div>
                    )}

                    {isSpecial && (
                      <div className="mt-1">
                        <Star className="w-3 h-3 text-yellow-500 inline" />
                      </div>
                    )}

                    {availability && (
                      <div className={`text-xs mt-1 ${
                        isAvailable ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {availability.available} trống
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-50 border border-gray-200 rounded"></div>
          <span>Hôm nay</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Ngày đặc biệt</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span>Còn phòng</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span>Hết phòng</span>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Cập nhật giá</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-sm text-gray-600">
                  Ngày: <span className="font-medium text-gray-900">{selectedDate}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá phòng (VNĐ)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={editingPrice || ''}
                      onChange={(e) => setEditingPrice(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Giá cơ bản: <span className="font-medium">{formatPrice(roomType.basePrice)}</span>
                  </span>
                </div>

                {editingPrice && editingPrice !== roomType.basePrice && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-700">
                      {editingPrice > roomType.basePrice ? 'Tăng' : 'Giảm'}:{' '}
                      {Math.abs(Math.round(((editingPrice - roomType.basePrice) / roomType.basePrice) * 100))}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSavePrice}
                  className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
