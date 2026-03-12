"use client";

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import type { RoomType, RoomAvailability } from '@/types/admin';

interface RoomAvailabilityGridProps {
  roomType: RoomType;
  onUpdateAvailability: (availability: RoomAvailability[]) => void;
}

export function RoomAvailabilityGrid({ roomType, onUpdateAvailability }: RoomAvailabilityGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<RoomAvailability[]>(roomType.availability || []);

  useEffect(() => {
    setAvailability(roomType.availability || []);
  }, [roomType.availability]);

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

  const getAvailabilityForDate = (dateKey: string): RoomAvailability | undefined => {
    return availability.find(a => a.date === dateKey);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getStatusForAvailability = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'full';
    if (percentage <= 20) return 'critical';
    if (percentage <= 50) return 'low';
    return 'available';
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

  // Calculate summary
  const totalRooms = roomType.totalRooms;
  const next30DaysAvail = availability.slice(0, 30);
  const availableCount = next30DaysAvail.filter(a => a.available > 0).length;
  const fullyBookedCount = next30DaysAvail.filter(a => a.available === 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Tình trạng phòng trống - {roomType.name}
        </h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bed className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng phòng</p>
              <p className="text-xl font-bold text-gray-900">{totalRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày còn phòng</p>
              <p className="text-xl font-bold text-gray-900">{availableCount}/30</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày hết phòng</p>
              <p className="text-xl font-bold text-gray-900">{fullyBookedCount}/30</p>
            </div>
          </div>
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
            const availData = getAvailabilityForDate(dateKey);

            const status = availData ? getStatusForAvailability(availData.available, totalRooms ?? 0) : 'available';
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            const statusColors = {
              available: 'bg-green-50 border-green-200',
              low: 'bg-yellow-50 border-yellow-200',
              critical: 'bg-orange-50 border-orange-200',
              full: 'bg-red-50 border-red-200'
            };

            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 border-t border-r border-gray-100 transition-colors ${
                  isPast ? 'bg-gray-50' : statusColors[status]
                } ${isToday ? 'ring-2 ring-orange-500 ring-inset' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isPast ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {day}
                </div>

                {!isPast && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      {status === 'available' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {status === 'low' && (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                      {status === 'critical' && (
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      )}
                      {status === 'full' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-semibold ${
                        status === 'available' ? 'text-green-700' :
                        status === 'low' ? 'text-yellow-700' :
                        status === 'critical' ? 'text-orange-700' :
                        'text-red-700'
                      }`}>
                        {availData ? availData.available : totalRooms}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      / {totalRooms} phòng
                    </div>

                    {availData && (availData.booked ?? 0) > 0 && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              status === 'available' ? 'bg-green-500' :
                              status === 'low' ? 'bg-yellow-500' :
                              status === 'critical' ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${((availData.booked ?? 0) / (totalRooms ?? 1)) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {availData.booked} đã đặt
                        </div>
                      </div>
                    )}

                    {isWeekend && (
                      <div className="mt-1">
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          Weekend
                        </span>
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
          <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
          <span>Còn nhiều</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded"></div>
          <span>Còn ít</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded"></div>
          <span>Sắp hết</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
          <span>Hết phòng</span>
        </div>
      </div>
    </div>
  );
}
