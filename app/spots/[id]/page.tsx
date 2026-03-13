"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Ticket, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Share2,
  Clock,
  Users,
  Check,
} from "lucide-react";
import { useSpotDetail } from "@/hooks/useSpots";
import { SpotReview, regionLabelsEn, spotTypeLabelsEn } from "@/types/spots";
import { Button } from "@/components/ui/button";

interface SpotDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { id } = use(params);
  const { spot, isLoading, error } = useSpotDetail({ slug: id });
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  if (isLoading) {
    return <SpotDetailSkeleton />;
  }

  if (error || !spot) {
    return <SpotDetailError />;
  }

  const images = spot.images.length > 0 ? spot.images : [];
  const gradientClass = getPlaceholderGradient(spot.spotType);

  return (
    <main className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[50vh] lg:h-[60vh]">
          {/* Main Image */}
          <div className="relative lg:col-span-2 h-full">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage]}
                alt={spot.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                <MapPin className="w-24 h-24 text-white/30" />
              </div>
            )}
            
            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Back Button */}
            <Link
              href="/spots"
              className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </Link>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="hidden lg:flex gap-2 p-4 bg-white overflow-x-auto">
            {images.slice(0, 6).map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  selectedImage === index ? "border-orange-500" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
            {images.length > 6 && (
              <button
                onClick={() => setShowAllImages(true)}
                className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center"
              >
                <span className="text-sm font-medium">+{images.length - 6} more</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                    {spotTypeLabelsEn[spot.spotType as keyof typeof spotTypeLabelsEn] || spot.spotType}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {regionLabelsEn[spot.region as keyof typeof regionLabelsEn] || spot.region}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {spot.name}
                </h1>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>{spot.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{spot.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({spot.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {spot.fullDescription || spot.description}
                </p>
              </div>

              {/* Best Time */}
              {spot.bestTime && (
                <div className="bg-orange-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Best Time to Visit
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {spot.bestTime}
                  </p>
                </div>
              )}

              {/* Ticket Price */}
              {spot.ticketPrice && (
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Ticket className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Entrance Fee
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {spot.ticketPrice}
                  </p>
                </div>
              )}

              {/* Activities */}
              {spot.activities && spot.activities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Activities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {spot.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reviews
                  </h2>
                  <button className="text-orange-600 font-medium hover:text-orange-700">
                    Write a Review
                  </button>
                </div>
                
                {spot.reviews && spot.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {spot.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Booking CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Book a Tour
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span>Flexible itinerary</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-orange-500" />
                      <span>Small group available</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Check className="w-5 h-5 text-orange-500" />
                      <span>Free cancellation</span>
                    </div>
                  </div>

                  <Link
                    href={`/search?destination=${encodeURIComponent(spot.name)}`}
                    className="block w-full py-3 bg-orange-500 text-white text-center font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Search Tours
                  </Link>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Compare prices from multiple operators
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Helper function for placeholder gradient
function getPlaceholderGradient(spotType: string): string {
  const gradients: Record<string, string> = {
    beach: "from-cyan-400 via-blue-500 to-blue-600",
    mountain: "from-green-400 via-emerald-500 to-teal-600",
    historical: "from-amber-400 via-orange-500 to-red-500",
    waterfall: "from-blue-400 via-cyan-500 to-teal-600",
    island: "from-yellow-400 via-orange-500 to-pink-500",
    lake: "from-blue-300 via-sky-500 to-indigo-600",
    cave: "from-gray-400 via-slate-500 to-zinc-600",
    park: "from-green-300 via-emerald-400 to-teal-500",
  };
  return gradients[spotType] || "from-orange-400 via-amber-500 to-yellow-600";
}

// Review Card Component
function ReviewCard({ review }: { review: SpotReview }) {
  const [showAll, setShowAll] = useState(false);
  const isLong = review.comment.length > 200;

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="font-medium text-orange-600">
            {review.userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            {isLong && !showAll
              ? review.comment.slice(0, 200) + "..."
              : review.comment}
            {isLong && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-orange-600 font-medium ml-1"
              >
                {showAll ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function SpotDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[50vh] bg-gray-200 animate-pulse" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Error State
function SpotDetailError() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Spot not found
        </h2>
        <p className="text-gray-500 mb-4">
          The destination you're looking for doesn't exist
        </p>
        <Link
          href="/spots"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl"
        >
          Back to Spots
        </Link>
      </div>
    </div>
  );
}
