"use client";

import { Check, X } from "lucide-react";
import { Plane, Hotel, UtensilsCrossed, UserCheck, Ticket, HelpCircle } from "lucide-react";

interface TourServicesProps {
  includes: string[];
  excludes: string[];
}

const getServiceIcon = (service: string) => {
  const lower = service.toLowerCase();
  if (lower.includes('vé máy bay') || lower.includes('flight') || lower.includes('máy bay')) return <Plane className="w-5 h-5" />;
  if (lower.includes('khách sạn') || lower.includes('hotel') || lower.includes('lưu trú')) return <Hotel className="w-5 h-5" />;
  if (lower.includes('ăn') || lower.includes('meal') || lower.includes('buffet')) return <UtensilsCrossed className="w-5 h-5" />;
  if (lower.includes('hướng dẫn') || lower.includes('guide')) return <UserCheck className="w-5 h-5" />;
  if (lower.includes('vé') || lower.includes('ticket')) return <Ticket className="w-5 h-5" />;
  return <HelpCircle className="w-5 h-5" />;
};

export default function TourServices({ includes, excludes }: TourServicesProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Included Services */}
      <div className="bg-green-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-green-800">Bao gồm</h3>
        </div>
        
        <ul className="space-y-3">
          {includes.map((service, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center gap-2">
                {getServiceIcon(service)}
                <span className="text-gray-700">{service}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Excluded Services */}
      <div className="bg-red-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-red-800">Không bao gồm</h3>
        </div>
        
        <ul className="space-y-3">
          {excludes.map((service, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-center gap-2">
                {getServiceIcon(service)}
                <span className="text-gray-700">{service}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
