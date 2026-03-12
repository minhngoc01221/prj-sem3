"use client";

import Link from "next/link";
import { ArrowRight, Tag, Flame } from "lucide-react";
import { usePromotions } from "@/hooks/useInformationData";
import { PromotionWithTimer } from "@/types/information";
import CountdownTimer from "./CountdownTimer";
import PromotionCard from "./PromotionCard";

interface PromotionsSectionProps {
  className?: string;
}

export default function PromotionsSection({ className = "" }: PromotionsSectionProps) {
  const { promotions, featuredPromotions, expiringSoon, isLoading } = usePromotions({
    autoRefresh: true,
    refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  return (
    <section className={`py-12 bg-gradient-to-b from-orange-50/50 to-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 uppercase tracking-wider">
                Limited Time
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Special Offers
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Don't miss out on our exclusive promotions and deals. Book now and save big on your dream vacation!
            </p>
          </div>
          
          <Link
            href="/promotions"
            className="hidden md:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
          >
            View All Promotions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Promotions with Countdown */}
        {featuredPromotions.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPromotions.slice(0, 2).map((promotion) => (
                <FeaturedPromotionCard 
                  key={promotion.id} 
                  promotion={promotion} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Expiring Soon Section */}
        {expiringSoon.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Ending Soon
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {expiringSoon.slice(0, 4).map((promotion) => (
                <ExpiringSoonCard 
                  key={promotion.id} 
                  promotion={promotion} 
                />
              ))}
            </div>
          </div>
        )}

        {/* All Active Promotions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Active Promotions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.slice(0, 6).map((promotion) => (
              <PromotionCard 
                key={promotion.id} 
                promotion={promotion} 
              />
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 text-orange-600 font-medium"
          >
            View All Promotions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Featured Promotion Card with Large Countdown
function FeaturedPromotionCard({ promotion }: { promotion: PromotionWithTimer }) {
  const discount = promotion.discountValue || promotion.discountPercent || promotion.discountType === 'percentage' ? 0 : 0;

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500" />
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative p-6 md:p-8 flex flex-col h-full">
        <div className="flex-1">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
            <Tag className="w-4 h-4" />
            Special Offer
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {promotion.name}
          </h3>
          
          {/* Description */}
          <p className="text-white/80 mb-4">
            {promotion.description}
          </p>

          {/* Discount Value */}
          {promotion.discountPercent && (
            <div className="inline-block px-4 py-2 bg-white text-orange-600 rounded-xl font-bold text-3xl mb-4">
              SAVE {promotion.discountPercent}%
            </div>
          )}
          {promotion.discountValue && (
            <div className="inline-block px-4 py-2 bg-white text-orange-600 rounded-xl font-bold text-3xl mb-4">
              SAVE ${promotion.discountValue}
            </div>
          )}

          {/* Promo Code */}
          {promotion.promoCode && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white/70">Use code:</span>
              <code className="px-3 py-1 bg-white/20 rounded-lg font-mono text-white font-bold">
                {promotion.promoCode}
              </code>
            </div>
          )}
        </div>

        {/* Countdown & CTA */}
        <div className="mt-auto">
          {!promotion.isExpired && (
            <div className="mb-4">
              <p className="text-white/70 text-sm mb-2">Offer ends in:</p>
              <CountdownTimer
                endDate={promotion.endDate}
                size="lg"
                variant="subtle"
                className="bg-white/10 rounded-xl p-4"
              />
            </div>
          )}
          
          <Link
            href={promotion.targetType === 'tour' ? `/tours/${promotion.targetId}` : '/tours'}
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Expiring Soon Card
function ExpiringSoonCard({ promotion }: { promotion: PromotionWithTimer }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
          Ending Soon
        </span>
        {promotion.discountPercent && (
          <span className="text-sm font-bold text-orange-600">
            -{promotion.discountPercent}%
          </span>
        )}
      </div>
      
      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
        {promotion.name}
      </h4>
      
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {promotion.description}
      </p>

      <CompactCountdown endDate={promotion.endDate} />
    </div>
  );
}

// Import CompactCountdown
import { CompactCountdown } from "./CountdownTimer";
