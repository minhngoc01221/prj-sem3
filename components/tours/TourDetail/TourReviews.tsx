"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { TourReview, ReviewStats } from "@/types/tours";
import TourCard from "../TourCard";

interface TourReviewsProps {
  reviews: TourReview[];
  reviewStats: ReviewStats;
}

export default function TourReviews({ reviews, reviewStats }: TourReviewsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Đánh giá từ khách hàng</h3>
      
      {/* Rating Overview */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-500">{reviewStats.averageRating.toFixed(1)}</div>
            <div className="flex justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(reviewStats.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-500">{reviewStats.totalReviews} đánh giá</div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution];
              const percentage = reviewStats.totalReviews > 0 
                ? (count / reviewStats.totalReviews) * 100 
                : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating} ⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  {review.userAvatar ? (
                    <Image
                      src={review.userAvatar}
                      alt={review.userName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-500">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{review.userName}</span>
                        {review.isVerified && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                            Đã đặt tour
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  {review.title && (
                    <div className="font-medium text-gray-900 mb-1">{review.title}</div>
                  )}
                  <p className="text-gray-600 mb-3">{review.content}</p>

                  {/* Travel Date */}
                  {review.travelDate && (
                    <div className="text-sm text-gray-500 mb-3">
                      📅 Thời gian đi: {new Date(review.travelDate).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Hữu ích ({review.helpful})</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Trả lời</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Chưa có đánh giá nào
          </div>
        )}
      </div>
    </div>
  );
}
