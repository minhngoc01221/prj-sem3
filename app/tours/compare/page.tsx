import type { Metadata } from "next";
import { Suspense } from "react";
import ComparePageContent from "./ComparePageContent";

export const metadata: Metadata = {
  title: "So sánh Tour - Karnel Travels",
  description: "So sánh các tour du lịch để chọn tour phù hợp nhất",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<CompareSkeleton />}>
        <ComparePageContent />
      </Suspense>
    </main>
  );
}

function CompareSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="h-12 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
