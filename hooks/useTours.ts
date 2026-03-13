// Tour Data Hooks
// F068-F083 - Tours listing, detail, and compare data fetching
// FIXED: Prevent infinite loops and unnecessary re-fetches

import { useState, useEffect, useCallback, useRef } from "react";
import type { 
  TourCardData, 
  TourDetailData, 
  TourFilters, 
  TourSortOption,
  TourFilter,
  ToursListResponse,
  TourDetailResponse,
  ToursCompareResponse,
  CompareState,
  CompareItem
} from "@/types/tours";

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
    // Add caching for GET requests
    cache: options?.method ? undefined : "default",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// ==================== UTILITY: Stable JSON stringifier for comparison ====================
function stableStringify(value: unknown): string {
  if (value === undefined) return "";
  return JSON.stringify(value);
}

// ==================== USE TOURS LIST (F068, F069-F072, F080) ====================

interface UseToursOptions {
  filters?: TourFilters;
  filter?: TourFilter;
  page?: number;
  limit?: number;
  // New option to enable/disable auto-fetch
  enabled?: boolean;
}

interface UseToursReturn {
  tours: TourCardData[];
  isLoading: boolean;
  error: Error | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => Promise<void>;
}

export function useTours(options: UseToursOptions = {}): UseToursReturn {
  const { filters = {}, filter, page = 1, limit = 12, enabled = true } = options;

  const [tours, setTours] = useState<TourCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Ref to prevent fetching after unmount
  const isMountedRef = useRef(true);
  // Ref to track current request and prevent duplicate calls
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track previous params to avoid unnecessary fetches
  const prevParamsRef = useRef<string>("");

  // Build query params - memoized based on primitive values
  const queryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    // Search
    if (filters.search) {
      params.append("search", filters.search);
    }
    
    // Destinations (F069)
    if (filters.destinations && filters.destinations.length > 0) {
      params.append("destinations", filters.destinations.join(","));
    }
    
    // Duration (F070)
    if (filters.duration) {
      params.append("duration", filters.duration);
    }
    
    // Price range (F071)
    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange[0].toString());
      params.append("maxPrice", filters.priceRange[1].toString());
    }
    
    // Start date (F072)
    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }
    
    // Sort
    if (filters.sort) {
      params.append("sort", filters.sort);
    }
    
    // Filter (F081, F082, F083)
    if (filter) {
      params.append("filter", filter);
    }
    
    // Pagination
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    
    return params.toString();
  }, [filters.search, filters.destinations, filters.duration, filters.priceRange, filters.startDate, filters.sort, filter, page, limit]);

  // Fetch tours function
  const fetchTours = useCallback(async () => {
    if (!enabled) return;
    
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const currentParams = queryParams();
    
    // Skip if params haven't changed
    if (prevParamsRef.current === currentParams && !isLoading) {
      return;
    }
    
    prevParamsRef.current = currentParams;
    
    setIsLoading(true);
    try {
      const data = await fetchApi<ToursListResponse>(`/api/tours?${currentParams}`);
      
      // Only update state if still mounted
      if (isMountedRef.current) {
        setTours(data.data.tours);
        setTotal(data.data.totalTours);
        setTotalPages(data.data.totalPages);
        setError(null);
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === "AbortError") return;
      
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [queryParams, enabled, isLoading]);

  // Clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch on dependency change
  useEffect(() => {
    if (enabled) {
      fetchTours();
    }
  }, [fetchTours, enabled]);

  return {
    tours,
    isLoading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchTours,
  };
}

// ==================== USE FEATURED TOURS (F081) ====================

interface UseFeaturedToursOptions {
  limit?: number;
  enabled?: boolean;
}

interface UseFeaturedToursReturn {
  tours: TourCardData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFeaturedTours(options: UseFeaturedToursOptions = {}): UseFeaturedToursReturn {
  const { limit = 8, enabled = true } = options;

  const [tours, setTours] = useState<TourCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevDepsRef = useRef<string>("");

  const fetchFeaturedTours = useCallback(async () => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const depsKey = `limit-${limit}`;
    if (prevDepsRef.current === depsKey) return;
    prevDepsRef.current = depsKey;

    setIsLoading(true);
    try {
      const data = await fetchApi<ToursListResponse>(
        `/api/tours?filter=featured&limit=${limit}&sort=popular`
      );

      if (isMountedRef.current) {
        const toursWithFlags = data.data.tours.map((tour: TourCardData) => ({
          ...tour,
          isFeatured: true,
        }));
        setTours(toursWithFlags);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [limit, enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchFeaturedTours();
    }
  }, [fetchFeaturedTours, enabled]);

  return {
    tours,
    isLoading,
    error,
    refetch: fetchFeaturedTours,
  };
}

// ==================== USE NEW ARRIVALS (F082) ====================

interface UseNewArrivalsOptions {
  limit?: number;
  daysThreshold?: number;
  enabled?: boolean;
}

interface UseNewArrivalsReturn {
  tours: TourCardData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useNewArrivals(options: UseNewArrivalsOptions = {}): UseNewArrivalsReturn {
  const { limit = 8, daysThreshold = 30, enabled = true } = options;

  const [tours, setTours] = useState<TourCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevDepsRef = useRef<string>("");

  const fetchNewArrivals = useCallback(async () => {
    if (!enabled) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const depsKey = `limit-${limit}-days-${daysThreshold}`;
    if (prevDepsRef.current === depsKey) return;
    prevDepsRef.current = depsKey;

    setIsLoading(true);
    try {
      const data = await fetchApi<ToursListResponse>(
        `/api/tours?filter=new&limit=${limit}&days=${daysThreshold}&sort=newest`
      );

      if (isMountedRef.current) {
        const toursWithFlags = data.data.tours.map((tour: TourCardData) => ({
          ...tour,
          isNewArrival: true,
        }));
        setTours(toursWithFlags);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [limit, daysThreshold, enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchNewArrivals();
    }
  }, [fetchNewArrivals, enabled]);

  return {
    tours,
    isLoading,
    error,
    refetch: fetchNewArrivals,
  };
}

// ==================== USE HOT DEALS (F083) ====================

interface UseHotDealsOptions {
  limit?: number;
  enabled?: boolean;
}

interface UseHotDealsReturn {
  tours: TourCardData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useHotDeals(options: UseHotDealsOptions = {}): UseHotDealsReturn {
  const { limit = 8, enabled = true } = options;

  const [tours, setTours] = useState<TourCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevDepsRef = useRef<string>("");

  const fetchHotDeals = useCallback(async () => {
    if (!enabled) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const depsKey = `limit-${limit}`;
    if (prevDepsRef.current === depsKey) return;
    prevDepsRef.current = depsKey;

    setIsLoading(true);
    try {
      const data = await fetchApi<ToursListResponse>(
        `/api/tours?filter=hot-deals&limit=${limit}`
      );

      if (isMountedRef.current) {
        const toursWithFlags = data.data.tours.map((tour: TourCardData) => ({
          ...tour,
          isHotDeal: true,
        }));
        setTours(toursWithFlags);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [limit, enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchHotDeals();
    }
  }, [fetchHotDeals, enabled]);

  return {
    tours,
    isLoading,
    error,
    refetch: fetchHotDeals,
  };
}

// ==================== USE TOUR DETAIL (F073-F078) ====================

interface UseTourDetailOptions {
  id: string;
  enabled?: boolean;
}

interface UseTourDetailReturn {
  tour: TourDetailData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTourDetail(options: UseTourDetailOptions): UseTourDetailReturn {
  const { id, enabled = true } = options;

  const [tour, setTour] = useState<TourDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTourDetail = useCallback(async () => {
    if (!enabled || !id) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      const data = await fetchApi<TourDetailResponse>(`/api/tours/${id}`);
      
      if (isMountedRef.current) {
        setTour(data.data);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [id, enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (enabled && id) {
      fetchTourDetail();
    }
  }, [fetchTourDetail, enabled, id]);

  return {
    tour,
    isLoading,
    error,
    refetch: fetchTourDetail,
  };
}

// ==================== USE TOUR COMPARE (F079) ====================

const COMPARE_STORAGE_KEY = "tours_compare";
const MAX_COMPARE_ITEMS = 4;

interface CompareItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface CompareState {
  selectedTours: CompareItem[];
  isOpen: boolean;
}

interface UseTourCompareReturn {
  compareState: CompareState;
  addTour: (tour: CompareItem) => void;
  removeTour: (id: string) => void;
  clearAll: () => void;
  toggleCompare: () => void;
  isInCompare: (id: string) => boolean;
  canAddMore: () => boolean;
}

export function useTourCompare(): UseTourCompareReturn {
  const [compareState, setCompareState] = useState<CompareState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return { selectedTours: [], isOpen: false };
        }
      }
    }
    return { selectedTours: [], isOpen: false };
  });

  // Debounced save to localStorage to prevent excessive writes
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce localStorage write (wait 300ms after last change)
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareState));
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [compareState]);

  const addTour = useCallback((tour: CompareItem) => {
    setCompareState((prev) => {
      if (prev.selectedTours.length >= MAX_COMPARE_ITEMS) {
        return prev;
      }
      if (prev.selectedTours.some((t) => t.id === tour.id)) {
        return prev;
      }
      return {
        selectedTours: [...prev.selectedTours, tour],
        isOpen: true,
      };
    });
  }, []);

  const removeTour = useCallback((id: string) => {
    setCompareState((prev) => ({
      ...prev,
      selectedTours: prev.selectedTours.filter((t) => t.id !== id),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setCompareState({ selectedTours: [], isOpen: false });
  }, []);

  const toggleCompare = useCallback(() => {
    setCompareState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  // Memoize selectedTours to prevent unnecessary re-renders
  const selectedTours = compareState.selectedTours;

  const isInCompare = useCallback(
    (id: string) => {
      return selectedTours.some((t) => t.id === id);
    },
    [selectedTours]
  );

  const canAddMore = useCallback(() => {
    return selectedTours.length < MAX_COMPARE_ITEMS;
  }, [selectedTours]);

  const isOpen = compareState.isOpen;

  return {
    compareState: { selectedTours, isOpen },
    addTour,
    removeTour,
    clearAll,
    toggleCompare,
    isInCompare,
    canAddMore,
  };
}

// ==================== USE TOURS COMPARE DATA (F079) ====================

interface UseToursCompareDataOptions {
  tourIds: string[];
  enabled?: boolean;
}

interface UseToursCompareDataReturn {
  tours: TourDetailData[];
  isLoading: boolean;
  error: Error | null;
}

export function useToursCompareData(options: UseToursCompareDataOptions): UseToursCompareDataReturn {
  const { tourIds, enabled = true } = options;

  const [tours, setTours] = useState<TourDetailData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevIdsRef = useRef<string>("");

  const fetchCompareData = useCallback(async () => {
    if (!enabled || tourIds.length === 0) {
      setTours([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const idsKey = tourIds.sort().join(",");
    if (prevIdsRef.current === idsKey) return;
    prevIdsRef.current = idsKey;

    setIsLoading(true);
    try {
      const data = await fetchApi<ToursCompareResponse>(`/api/tours/compare`, {
        method: "POST",
        body: JSON.stringify({ tourIds }),
      });

      if (isMountedRef.current) {
        setTours(data.data.tours);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [tourIds, enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchCompareData();
    }
  }, [fetchCompareData, enabled]);

  return {
    tours,
    isLoading,
    error,
  };
}

// ==================== COMBINED TOURS DATA HOOK ====================

interface UseAllToursDataReturn {
  featured: UseFeaturedToursReturn;
  newArrivals: UseNewArrivalsReturn;
  hotDeals: UseHotDealsReturn;
}

export function useAllToursData(options?: {
  featured?: UseFeaturedToursOptions;
  newArrivals?: UseNewArrivalsOptions;
  hotDeals?: UseHotDealsOptions;
}): UseAllToursDataReturn {
  const featured = useFeaturedTours(options?.featured);
  const newArrivals = useNewArrivals(options?.newArrivals);
  const hotDeals = useHotDeals(options?.hotDeals);

  return {
    featured,
    newArrivals,
    hotDeals,
  };
}
