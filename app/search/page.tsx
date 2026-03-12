// Search Page
// F021-F048: Main Search Page

"use client";

import { useSearch } from '@/hooks/useSearch';
import Navbar from '@/components/layout/user/UserNavbar';
import Footer from '@/components/layout/user/Footer';
import SearchBar from '@/components/features/search/SearchBar';
import FilterSidebar from '@/components/features/search/FilterSidebar';
import { SearchType, SortOption } from '@/types/search';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  MapPin, Building2, Utensils, Palmtree, Star,
  Grid, List, ChevronLeft, ChevronRight, Loader2,
  Heart, GitCompare, Search, Bus, Plane
} from 'lucide-react';

const TYPE_TABS = [
  { type: SearchType.SPOT, label: 'Điểm du lịch', icon: MapPin },
  { type: SearchType.HOTEL, label: 'Khách sạn', icon: Building2 },
  { type: SearchType.RESTAURANT, label: 'Nhà hàng', icon: Utensils },
  { type: SearchType.RESORT, label: 'Resort', icon: Palmtree },
  { type: SearchType.TOUR, label: 'Tour du lịch', icon: Plane },
  { type: SearchType.TRANSPORT, label: 'Vận chuyển', icon: Bus },
];

const SORT_OPTIONS = [
  { value: SortOption.RATING_DESC, label: 'Đánh giá cao nhất' },
  { value: SortOption.PRICE_ASC, label: 'Giá tăng dần' },
  { value: SortOption.PRICE_DESC, label: 'Giá giảm dần' },
  { value: SortOption.NAME_ASC, label: 'Tên A-Z' },
];

export default function SearchPage() {
  const { 
    results, isLoading, error, pagination, params, search, 
    goToPage, changeSort, changeType 
  } = useSearch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentType, setCurrentType] = useState<SearchType>(SearchType.SPOT);

  // Load initial search
  useEffect(() => {
    search({ type: currentType });
  }, []);

  const handleTypeChange = (type: SearchType) => {
    setCurrentType(type);
    changeType(type);
  };

  const handleFilterChange = (filters: any) => {
    search({
      ...filters,
      type: currentType,
    });
  };

  const renderResultCard = (item: any, index: number) => {
    const getImage = () => item.images?.[0] || '/placeholder.jpg';
    const getPrice = () => {
      if (item.priceMin !== undefined) return `${item.priceMin.toLocaleString()} - ${item.priceMax?.toLocaleString()}đ`;
      if (item.price) {
        const price = item.discountedPrice || item.price;
        if (item.discount) return `${price.toLocaleString()}đ (giảm ${item.discount}%)`;
        return `${price.toLocaleString()}đ`;
      }
      if (item.ticketPrice) return `${item.ticketPrice.toLocaleString()}đ`;
      return 'Liên hệ';
    };
    const getLocation = () => {
      if (item.location) return item.location;
      if (item.address) return item.address;
      if (item.departure && item.arrival) return `${item.departure} → ${item.arrival}`;
      if (item.destinations?.length) return item.destinations.join(', ');
      return item.city || '';
    };
    const getSubtitle = () => {
      if (item.starRating) return `${'★'.repeat(item.starRating)}`;
      if (item.cuisineType) return item.cuisineType;
      if (item.type) return item.type;
      if (item.duration) return item.duration;
      if (item.route) return item.route;
      return '';
    };

    if (viewMode === 'list') {
      return (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex">
          <div className="w-72 h-48 relative flex-shrink-0">
            <Image 
              src={getImage()} 
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex-1">
              <div className="text-sm text-orange-500 font-medium mb-1">{getSubtitle()}</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                {getLocation()}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{item.rating?.toFixed(1) || '0'}</span>
                </div>
                {item.distance && (
                  <span className="text-gray-400">• {item.distance.toFixed(1)} km</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-orange-500 font-bold text-xl">{getPrice()}</span>
                {item.priceMin && <span className="text-gray-400 text-sm"> / đêm</span>}
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <GitCompare className="w-5 h-5 text-gray-400" />
                </button>
                <Link 
                  href={`/${currentType}s/${item.id}`}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <Image 
            src={getImage()} 
            alt={item.name}
            fill
            className="object-cover"
          />
          <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white">
            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>
        <div className="p-4">
          <div className="text-sm text-orange-500 font-medium mb-1">{getSubtitle()}</div>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{getLocation()}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium text-sm">{item.rating?.toFixed(1) || '0'}</span>
            </div>
            {item.distance && (
              <span className="text-gray-400 text-xs">{item.distance.toFixed(1)} km</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-orange-500 font-bold">{getPrice()}</span>
              {item.priceMin && <span className="text-gray-400 text-xs"> / đêm</span>}
            </div>
            <Link 
              href={`/${currentType}s/${item.id}`}
              className="text-orange-500 font-medium text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-center mb-6">
            
            </h1>
            <div className="flex justify-center">
              <SearchBar variant="hero" />
            </div>
          </div>
        </div>

        {/* Type Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3 overflow-x-auto">
              {TYPE_TABS.map(tab => (
                <button
                  key={tab.type}
                  onClick={() => handleTypeChange(tab.type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                    currentType === tab.type
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <FilterSidebar onFilterChange={handleFilterChange} currentType={currentType} />

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-xl text-gray-900">
                    {pagination.total} kết quả
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={params.sort}
                    onChange={(e) => changeSort(e.target.value as SortOption)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{error}</p>
                </div>
              )}

              {/* Results Grid/List */}
              {!isLoading && !error && (
                <>
                  {results.length === 0 ? (
                    <div className="text-center py-20">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Không tìm thấy kết quả nào</p>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                      {results.map((item, index) => renderResultCard(item, index))}
                    </div>
                  )}
                </>
              )}

              {/* Pagination (F037) */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          pagination.page === page
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-凭证"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
