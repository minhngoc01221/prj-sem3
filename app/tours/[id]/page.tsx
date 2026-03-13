import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TourDetailContent from "./TourDetailContent";

interface TourDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  return {
    title: "Chi tiết Tour - Karnel Travels",
    description: "Xem chi tiết lịch trình, dịch vụ và đánh giá tour du lịch",
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<TourDetailSkeleton />}>
        <TourDetailContent tourId={id} />
      </Suspense>
    </main>
  );
}

function TourDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
          {/* Right Column */}
          <div className="bg-white rounded-2xl p-6 h-fit sticky top-24">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-14 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
