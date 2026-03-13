// Tourist Spot Data Hooks
// F056-F067 - Data fetching hooks for tourist spots

import { useState, useEffect, useCallback } from "react";
import type { 
  SpotCardData, 
  SpotDetailData, 
  SpotSearchParams, 
  SpotSearchResponse,
  Region,
  SpotType
} from "@/types/spots";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ==================== FETCH UTILITIES ====================

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// ==================== SPOT LIST HOOK (F056, F057, F058, F066) ====================

interface UseSpotsOptions {
  initialParams?: SpotSearchParams;
  autoFetch?: boolean;
}

interface UseSpotsReturn {
  spots: SpotCardData[];
  isLoading: boolean;
  error: Error | null;
  params: SpotSearchParams;
  setParams: (params: SpotSearchParams) => void;
  filters: SpotSearchResponse['filters'] | null;
  pagination: SpotSearchResponse['pagination'] | null;
  refetch: () => Promise<void>;
}

export function useSpots(options: UseSpotsOptions = {}): UseSpotsReturn {
  const { initialParams = {}, autoFetch = true } = options;
  
  const [spots, setSpots] = useState<SpotCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParamsState] = useState<SpotSearchParams>(initialParams);
  const [filters, setFilters] = useState<SpotSearchResponse['filters'] | null>(null);
  const [pagination, setPagination] = useState<SpotSearchResponse['pagination'] | null>(null);

  const buildQueryString = useCallback((searchParams: SpotSearchParams): string => {
    const queryParts: string[] = [];
    
    if (searchParams.query) {
      queryParts.push(`query=${encodeURIComponent(searchParams.query)}`);
    }
    if (searchParams.region) {
      queryParts.push(`region=${searchParams.region}`);
    }
    if (searchParams.spotType) {
      queryParts.push(`type=${searchParams.spotType}`);
    }
    if (searchParams.minRating) {
      queryParts.push(`minRating=${searchParams.minRating}`);
    }
    if (searchParams.maxTicketPrice) {
      queryParts.push(`maxPrice=${searchParams.maxTicketPrice}`);
    }
    if (searchParams.sortBy) {
      queryParts.push(`sortBy=${searchParams.sortBy}`);
    }
    if (searchParams.sortOrder) {
      queryParts.push(`sortOrder=${searchParams.sortOrder}`);
    }
    if (searchParams.page) {
      queryParts.push(`page=${searchParams.page}`);
    }
    if (searchParams.limit) {
      queryParts.push(`limit=${searchParams.limit}`);
    }
    
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  }, []);

  const fetchSpots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryString(params);
      const data = await fetchApi<SpotSearchResponse>(`/api/spots${queryString}`);
      
      setSpots(data.data);
      setFilters(data.filters);
      setPagination(data.pagination);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params, buildQueryString]);

  useEffect(() => {
    if (autoFetch) {
      fetchSpots();
    }
  }, [fetchSpots, autoFetch]);

  const setParams = useCallback((newParams: SpotSearchParams) => {
    setParamsState(prev => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  return {
    spots,
    isLoading,
    error,
    params,
    setParams,
    filters,
    pagination,
    refetch: fetchSpots,
  };
}

// ==================== SPOT DETAIL HOOK (F059-F063, F067) ====================

interface UseSpotDetailOptions {
  slug: string;
}

interface UseSpotDetailReturn {
  spot: SpotDetailData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSpotDetail(options: UseSpotDetailOptions): UseSpotDetailReturn {
  const { slug } = options;
  
  const [spot, setSpot] = useState<SpotDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSpot = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchApi<{ data: SpotDetailData }>(`/api/spots/${slug}`);
      setSpot(data.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchSpot();
  }, [fetchSpot]);

  return {
    spot,
    isLoading,
    error,
    refetch: fetchSpot,
  };
}

// ==================== FILTER HELPERS ====================

// F057: Filter by Region
export function useSpotsByRegion(region: Region) {
  const { spots, isLoading, error, setParams, ...rest } = useSpots({
    initialParams: { region, limit: 20 },
  });
  
  return { spots, isLoading, error, setParams: (region: Region) => setParams({ region }), ...rest };
}

// F058: Filter by Spot Type
export function useSpotsByType(spotType: SpotType) {
  const { spots, isLoading, error, setParams, ...rest } = useSpots({
    initialParams: { spotType, limit: 20 },
  });
  
  return { spots, isLoading, error, setParams: (type: SpotType) => setParams({ spotType: type }), ...rest };
}

// F066: Search with Vietnamese support
export function useSpotSearch(query: string) {
  const { spots, isLoading, error, setParams, ...rest } = useSpots({
    initialParams: { query, limit: 20 },
  });
  
  return { 
    spots, 
    isLoading, 
    error, 
    search: (q: string) => setParams({ query: q }),
    ...rest 
  };
}

// ==================== FEATURED SPOTS ====================

interface UseFeaturedSpotsOptions {
  limit?: number;
}

interface UseFeaturedSpotsReturn {
  spots: SpotCardData[];
  isLoading: boolean;
  error: Error | null;
}

export function useFeaturedSpots(options: UseFeaturedSpotsOptions = {}): UseFeaturedSpotsReturn {
  const { limit = 6 } = options;
  
  const [spots, setSpots] = useState<SpotCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await fetchApi<{ data: SpotCardData[] }>(`/api/spots/featured?limit=${limit}`);
        setSpots(data.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeatured();
  }, [limit]);

  return { spots, isLoading, error };
}

// ==================== PAGINATION HELPERS ====================

export function useSpotPagination(
  pagination: SpotSearchResponse['pagination'] | null,
  setParams: (params: SpotSearchParams) => void
) {
  const goToPage = useCallback((page: number) => {
    setParams({ page });
  }, [setParams]);

  const nextPage = useCallback(() => {
    if (pagination?.hasNext) {
      setParams({ page: pagination.page + 1 });
    }
  }, [pagination, setParams]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrev) {
      setParams({ page: pagination.page - 1 });
    }
  }, [pagination, setParams]);

  return {
    goToPage,
    nextPage,
    prevPage,
    currentPage: pagination?.page || 1,
    totalPages: pagination?.totalPages || 1,
    hasNext: pagination?.hasNext || false,
    hasPrev: pagination?.hasPrev || false,
  };
}
