import type { Metadata } from "next";
import SpotFilters from "@/components/spots/SpotFilters";
import SpotGrid from "@/components/spots/SpotGrid";

export const metadata: Metadata = {
  title: "Tourist Spots - Discover Vietnam | Karnel Travels",
  description: "Explore the most beautiful tourist destinations in Vietnam. Find beaches, mountains, historical sites, waterfalls and more.",
  keywords: ["tourist spots", "Vietnam travel", "destinations", "beach", "mountain", "historical"],
};

interface SpotsPageProps {
  searchParams: Promise<{
    query?: string;
    region?: string;
    type?: string;
    page?: string;
    sortBy?: string;
  }>;
}

export default async function SpotsPage({ searchParams }: SpotsPageProps) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative py-16 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tourist Spots
            </h1>
            <p className="text-xl text-white/90">
              Discover the most beautiful destinations across Vietnam
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <SpotFilters />
          </div>
          
          <SpotGrid />
        </div>
      </section>
    </main>
  );
}
