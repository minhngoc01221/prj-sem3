"use client";

import { useState } from "react";
import { ChevronDown, Sun, Moon, Coffee, UtensilsCrossed, Bed } from "lucide-react";
import { ItineraryDay } from "@/types/tours";

interface TourItineraryProps {
  itinerary: ItineraryDay[];
}

const getTimeIcon = (time: string) => {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return <Sun className="w-4 h-4 text-yellow-500" />;
  if (hour < 18) return <Sun className="w-4 h-4 text-orange-500" />;
  return <Moon className="w-4 h-4 text-indigo-500" />;
};

const getMealIcon = (meal?: string) => {
  if (meal === 'breakfast') return <Coffee className="w-4 h-4 text-amber-500" />;
  if (meal === 'lunch') return <UtensilsCrossed className="w-4 h-4 text-green-500" />;
  if (meal === 'dinner') return <UtensilsCrossed className="w-4 h-4 text-purple-500" />;
  return null;
};

export default function TourItinerary({ itinerary }: TourItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(
    itinerary.reduce((acc, day) => ({ ...acc, [day.day]: true }), {})
  );

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có lịch trình chi tiết
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Lịch trình tour</h3>
      
      {itinerary.map((day, index) => (
        <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Day Header */}
          <button
            onClick={() => toggleDay(day.day)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                {day.day}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">{day.title}</div>
                <div className="text-sm text-gray-500">{day.description}</div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedDays[day.day] ? 'rotate-180' : ''}`} />
          </button>

          {/* Day Content */}
          {expandedDays[day.day] && (
            <div className="p-4 space-y-4">
              {/* Morning */}
              {day.morning && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Sun className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-sm font-medium text-gray-500">{day.morning.time}</div>
                    <div className="font-medium text-gray-900">{day.morning.activity}</div>
                    {day.morning.location && (
                      <div className="text-sm text-gray-500">{day.morning.location}</div>
                    )}
                    {day.morning.meal && (
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">
                        <Coffee className="w-3 h-3" />
                        {day.morning.meal === 'breakfast' ? 'Ăn sáng' : 'Ăn trưa'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Afternoon */}
              {day.afternoon && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Sun className="w-4 h-4 text-orange-600" />
                    </div>
                    {day.evening && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-sm font-medium text-gray-500">{day.afternoon.time}</div>
                    <div className="font-medium text-gray-900">{day.afternoon.activity}</div>
                    {day.afternoon.location && (
                      <div className="text-sm text-gray-500">{day.afternoon.location}</div>
                    )}
                    {day.afternoon.meal && (
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                        <UtensilsCrossed className="w-3 h-3" />
                        {day.afternoon.meal === 'lunch' ? 'Ăn trưa' : 'Ăn tối'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Evening */}
              {day.evening && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Moon className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">{day.evening.time}</div>
                    <div className="font-medium text-gray-900">{day.evening.activity}</div>
                    {day.evening.location && (
                      <div className="text-sm text-gray-500">{day.evening.location}</div>
                    )}
                    {day.evening.meal && (
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">
                        <UtensilsCrossed className="w-3 h-3" />
                        Ăn tối
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Accommodation */}
              {day.accommodation && (
                <div className="flex gap-4 pt-2 border-t border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bed className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">Nghỉ đêm</div>
                    <div className="font-medium text-gray-900">{day.accommodation}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
