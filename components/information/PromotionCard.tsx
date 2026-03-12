"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { PromotionWithTimer } from "@/types/information";
import CountdownTimer from "./CountdownTimer";

interface PromotionCardProps {
  promotion: PromotionWithTimer;
  className?: string;
}

export default function PromotionCard({ promotion, className = "" }: PromotionCardProps) {
  const isExpiringSoon = promotion.isExpiringSoon && !promotion.isExpired;

  return (
    <Link
      href={promotion.targetType === 'tour' ? `/tours/${promotion.targetId}` : '/tours'}
      className={`group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Header with gradient */}
      <div className={`relative px-4 py-3 ${isExpiringSoon ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {promotion.discountPercent && (
              <span className="px-2 py-1 bg-white text-orange-600 text-sm font-bold rounded-lg">
                {promotion.discountPercent}% OFF
              </span>
            )}
            {promotion.discountValue && (
              <span className="px-2 py-1 bg-white text-orange-600 text-sm font-bold rounded-lg">
                ${promotion.discountValue} OFF
              </span>
            )}
          </div>
          
          {isExpiringSoon && (
            <span className="text-white text-xs font-medium animate-pulse">
              ⏰ Ending Soon
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {promotion.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {promotion.description}
        </p>

        {/* Applicable Items */}
        {promotion.applicableItems && (
          <div className="flex flex-wrap gap-2 mb-4">
            {promotion.applicableItems.type !== 'all' && 
              promotion.applicableItems.ids.slice(0, 3).map((id, index) => (
                <span 
                  key={id} 
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  Item {index + 1}
                </span>
              ))
            }
            {promotion.applicableItems.type === 'all' && (
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                All Tours & Hotels
              </span>
            )}
          </div>
        )}

        {/* Promo Code */}
        {promotion.promoCode && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">Code:</span>
            <code className="font-mono font-bold text-orange-600">{promotion.promoCode}</code>
          </div>
        )}

        {/* Valid Dates */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Countdown Timer */}
        {!promotion.isExpired && (
          <div className="mb-4">
            <CountdownTimer
              endDate={promotion.endDate}
              size="sm"
              variant="subtle"
            />
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">View Details</span>
          <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
