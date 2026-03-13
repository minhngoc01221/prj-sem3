"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { SpotSearchParams, Region, SpotType, regionLabelsEn, spotTypeLabelsEn } from "@/types/spots";

interface SpotFiltersProps {
  className?: string;
  onFilterChange?: (filters: Partial<SpotSearchParams>) => void;
}

function SpotFiltersContent({ className = "", onFilterChange }: SpotFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("query") || "");

  // Get params from URL
  const getParams = useCallback((): SpotSearchParams => {
    return {
      query: searchParams.get("query") || undefined,
      region: searchParams.get("region") as Region || undefined,
      spotType: searchParams.get("type") as SpotType || undefined,
      sortBy: (searchParams.get("sortBy") as SpotSearchParams['sortBy']) || "rating",
      sortOrder: (searchParams.get("sortOrder") as SpotSearchParams['sortOrder']) || "desc",
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: 12,
    };
  }, [searchParams]);

  const params = getParams();

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchParams.get("query") || "");
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    
    const timer = setTimeout(() => {
      if (searchInput !== currentQuery) {
        updateParams({ query: searchInput || undefined });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateParams = useCallback((updates: Partial<SpotSearchParams>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    
    // Reset to page 1 when filters change (not for page updates)
    if (updates.query !== undefined || updates.region !== undefined || updates.spotType !== undefined || updates.sortBy !== undefined) {
      newParams.delete("page");
    }
    
    const newUrl = `/spots?${newParams.toString()}`;
    router.push(newUrl);
    
    // Also trigger callback for components using hooks
    if (onFilterChange) {
      const currentParams = getParams();
      onFilterChange({ ...currentParams, ...updates });
    }
  }, [searchParams, router, onFilterChange, getParams]);

  const handleRegionChange = useCallback((region: Region | "") => {
    updateParams({ region: region || undefined });
  }, [updateParams]);

  const handleTypeChange = useCallback((spotType: SpotType | "") => {
    updateParams({ spotType: spotType || undefined });
  }, [updateParams]);

  const handleSortChange = useCallback((sortBy: SpotSearchParams['sortBy']) => {
    updateParams({ sortBy, sortOrder: 'desc' });
  }, [updateParams]);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    router.push("/spots");
  }, [router]);

  const hasActiveFilters = params.region || params.spotType || params.query;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search destinations, attractions..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex flex-wrap items-center gap-3">
        {/* Region Filter */}
        <div className="relative">
          <select
            value={params.region || ""}
            onChange={(e) => handleRegionChange(e.target.value as Region | "")}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 cursor-pointer hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Regions</option>
            <option value="north">{regionLabelsEn.north}</option>
            <option value="central">{regionLabelsEn.central}</option>
            <option value="south">{regionLabelsEn.south}</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Spot Type Filter */}
        <div className="relative">
          <select
            value={params.spotType || ""}
            onChange={(e) => handleTypeChange(e.target.value as SpotType | "")}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 cursor-pointer hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Types</option>
            <option value="beach">{spotTypeLabelsEn.beach}</option>
            <option value="mountain">{spotTypeLabelsEn.mountain}</option>
            <option value="historical">{spotTypeLabelsEn.historical}</option>
            <option value="waterfall">{spotTypeLabelsEn.waterfall}</option>
            <option value="island">{spotTypeLabelsEn.island}</option>
            <option value="lake">{spotTypeLabelsEn.lake}</option>
            <option value="cave">{spotTypeLabelsEn.cave}</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={params.sortBy || "rating"}
            onChange={(e) => handleSortChange(e.target.value as SpotSearchParams['sortBy'])}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 cursor-pointer hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="rating">Top Rated</option>
            <option value="reviewCount">Most Reviewed</option>
            <option value="name">Name A-Z</option>
            <option value="newest">Newest</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium"
      >
        <SlidersHorizontal className="w-5 h-5" />
        Filters
        {hasActiveFilters && (
          <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {params.region && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
              {regionLabelsEn[params.region]}
              <button onClick={() => handleRegionChange("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {params.spotType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
              {spotTypeLabelsEn[params.spotType]}
              <button onClick={() => handleTypeChange("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function SpotFilters(props: SpotFiltersProps) {
  return (
    <Suspense fallback={<div className="h-20 bg-gray-100 animate-pulse rounded-xl" />}>
      <SpotFiltersContent {...props} />
    </Suspense>
  );
}
