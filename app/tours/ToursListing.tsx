"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTours } from "@/hooks/useTours";
import { tourSortLabels, TourSortOption, TourFilter } from "@/types/tours";
import TourCard, { TourCardSkeleton } from "@/components/tours/TourCard";
import TourSearchBar from "@/components/tours/TourSearchBar";
import TourFilters from "@/components/tours/TourFilters";
import CompareBar from "@/components/tours/CompareBar";
import Link from "next/link";

// View mode
type ViewMode = 'grid' | 'list';

export default function ToursListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter params from URL - use useMemo to prevent recalculation
  const search = useMemo(() => searchParams.get("search") || "", [searchParams]);
  const destinationsParam = useMemo(() => searchParams.get("destinations"), [searchParams]);
  const destinations = useMemo(() => destinationsParam ? destinationsParam.split(",") : [], [destinationsParam]);
  const duration = useMemo(() => searchParams.get("duration") as TourSortOption | null, [searchParams]);
  const minPrice = useMemo(() => searchParams.get("minPrice"), [searchParams]);
  const maxPrice = useMemo(() => searchParams.get("maxPrice"), [searchParams]);
  const startDate = useMemo(() => searchParams.get("startDate") || "", [searchParams]);
  const sort = useMemo(() => (searchParams.get("sort") as TourSortOption) || "popular", [searchParams]);
  const filter = useMemo(() => searchParams.get("filter") as TourFilter | null, [searchParams]);
  const page = useMemo(() => parseInt(searchParams.get("page") || "1"), [searchParams]);

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Build filters object - use primitive values in dependency array
  const filters = useMemo(() => ({
    search,
    destinations: destinations.length > 0 ? destinations : undefined,
    duration: duration || null,
    priceRange: minPrice && maxPrice 
      ? [parseInt(minPrice), parseInt(maxPrice)] 
      : undefined,
    startDate: startDate || undefined,
    sort,
  }), [search, destinationsParam, destinations.length, duration, minPrice, maxPrice, startDate, sort]);

  // Fetch tours
  const { tours, isLoading, total, totalPages, refetch } = useTours({
    filters,
    filter: filter || undefined,
    page,
    limit: 12,
  });

  // Update document title
  useEffect(() => {
    if (filter === 'featured') {
      document.title = "Tour Nổi Bật - Karnel Travels";
    } else if (filter === 'new') {
      document.title = "Tour Mới - Karnel Travels";
    } else if (filter === 'hot-deals') {
      document.title = "Tour Giảm Giá - Karnel Travels";
    } else if (search) {
      document.title = `Tìm kiếm: ${search} - Karnel Travels`;
    } else {
      document.title = "Danh sách Tour Du lịch - Karnel Travels";
    }
  }, [filter, search]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/tours?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort change
  const handleSortChange = (newSort: TourSortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/tours?${params.toString()}`);
  };

  // Get page title
  const getPageTitle = () => {
    if (filter === 'featured') return 'Tour Nổi Bật';
    if (filter === 'new') return 'Tour Mới';
    if (filter === 'hot-deals') return 'Tour Giảm Giá';
    if (search) return `Kết quả tìm kiếm: "${search}"`;
    return 'Tất cả Tour';
  };

  // Get breadcrumb
  const getBreadcrumb = () => {
    const items = [
      { label: "Trang chủ", href: "/" },
      { label: "Tour", href: "/tours" },
    ];

    if (filter === 'featured') {
      items.push({ label: "Nổi bật", href: "/tours?filter=featured" });
    } else if (filter === 'new') {
      items.push({ label: "Mới", href: "/tours?filter=new" });
    } else if (filter === 'hot-deals') {
      items.push({ label: "Giảm giá", href: "/tours?filter=hot-deals" });
    } else if (search) {
      items.push({ label: `Tìm: ${search}`, href: "#" });
    }

    return items;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 py-16 relative overflow-hidden">
        {/* Background Pattern */}
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

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-xl text-white/90">
              Khám phá những tour du lịch hấp dẫn và đặt ngay hôm nay
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <TourSearchBar initialValue={search} />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                {item.href !== "#" ? (
                  <Link 
                    href={item.href}
                    className="text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-orange-600 font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <TourFilters />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Results Count */}
              <div className="text-gray-600">
                {!isLoading && (
                  <span>
                    Tìm thấy <strong className="text-gray-900">{total}</strong> tour
                    {search && <span> cho "<strong>{search}</strong>"</span>}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value as TourSortOption)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  {Object.entries(tourSortLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    title="Grid view"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    title="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Lọc
                </button>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(destinations.length > 0 || duration || startDate || (minPrice && maxPrice)) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {destinations.map((dest) => (
                  <span 
                    key={dest}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {dest}
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        const newDests = destinations.filter(d => d !== dest);
                        if (newDests.length > 0) {
                          params.set("destinations", newDests.join(","));
                        } else {
                          params.delete("destinations");
                        }
                        router.push(`/tours?${params.toString()}`);
                      }}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {duration && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {duration}
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("duration");
                        router.push(`/tours?${params.toString()}`);
                      }}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minPrice && maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {minPrice} - {maxPrice}
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("minPrice");
                        params.delete("maxPrice");
                        router.push(`/tours?${params.toString()}`);
                      }}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Tours Grid */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {[...Array(6)].map((_, i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            ) : tours.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {tours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    showCompareButton={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState search={search} />
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        page === pageNum 
                          ? "bg-orange-500 text-white" 
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
            <TourFilters 
              isMobile={true} 
              onClose={() => setShowMobileFilters(false)} 
            />
          </div>
        </div>
      )}

      {/* Compare Bar */}
      <CompareBar />
    </>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Grid3X3 className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {search ? "Không tìm thấy tour nào" : "Chưa có tour nào"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {search 
          ? `Không có tour nào phù hợp với từ khóa "${search}". Vui lòng thử từ khóa khác.`
          : "Chúng tôi sẽ sớm cập nhật các tour du lịch hấp dẫn. Vui lòng quay lại sau."
        }
      </p>
      <Link
        href="/tours"
        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
      >
        Xem tất cả tour
      </Link>
    </div>
  );
}
