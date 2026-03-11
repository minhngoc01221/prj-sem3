"use client";

import { useState } from 'react';
import {
  Star,
  MessageCircle,
  Reply,
  Check,
  Image as ImageIcon,
  ThumbsUp,
  Flag
} from 'lucide-react';
import type { HotelReview } from '@/types/admin';
import { formatDate } from './mockData';

interface HotelReviewsListProps {
  reviews: HotelReview[];
  onReply?: (reviewId: string, response: string) => void;
}

export function HotelReviewsList({ reviews, onReply }: HotelReviewsListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const handleSubmitReply = (reviewId: string) => {
    if (!replyContent.trim()) return;
    if (onReply) {
      onReply(reviewId, replyContent);
    }
    setReplyingTo(null);
    setReplyContent('');
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">{reviews.length} đánh giá</p>
          </div>

          <div className="flex-1 space-y-2">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Lọc:</span>
        <button
          onClick={() => setFilterRating(null)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            filterRating === null
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tất cả
        </button>
        {[5, 4, 3, 2, 1].map(rating => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              filterRating === rating
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {rating} ★
            <span className="ml-1 text-xs opacity-75">
              ({reviews.filter(r => r.rating === rating).length})
            </span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có đánh giá nào</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.userName}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Review Content */}
              <div className="mt-4">
                <p className="text-gray-700">{review.comment}</p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {review.images.map((img, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                    >
                      <img
                        src={img}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="mt-4 flex items-center gap-4">
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Hữu ích</span>
                </button>
                <button
                  onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Phản hồi</span>
                </button>
              </div>

              {/* Admin Response */}
              {review.response && (
                <div className="mt-4 pl-4 border-l-4 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <Reply className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Phản hồi từ khách sạn</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDate(review.response.respondedAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.response.content}</p>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === review.id && (
                <div className="mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Viết phản hồi..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSubmitReply(review.id)}
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
