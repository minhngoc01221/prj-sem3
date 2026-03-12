// Information Page Data Hooks
// F050-F054 - Real-time data fetching for promotions and tours

import { useState, useEffect, useCallback } from "react";
import type { 
  PromotionWithTimer, 
  TourCardData, 
  PromotionsResponse,
  TimeRemaining 
} from "@/types/information";
import { calculateTimeRemaining } from "@/types/information";

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

// ==================== PROMOTIONS HOOK (F050, F053, F054) ====================

interface UsePromotionsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UsePromotionsReturn {
  promotions: PromotionWithTimer[];
  featuredPromotions: PromotionWithTimer[];
  expiringSoon: PromotionWithTimer[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePromotions(options: UsePromotionsOptions = {}): UsePromotionsReturn {
  const { autoRefresh = true, refreshInterval = 60000 } = options; // Default: refresh every 60s
  
  const [promotions, setPromotions] = useState<PromotionWithTimer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPromotions = useCallback(async () => {
    try {
      const data = await fetchApi<PromotionsResponse>("/api/promotions?status=active");
      
      // Add time remaining to each promotion
      const promotionsWithTimer: PromotionWithTimer[] = data.data.activePromotions.map(
        (promo: PromotionWithTimer) => {
          const timeRemaining = calculateTimeRemaining(promo.endDate);
          return {
            ...promo,
            timeRemaining,
            isExpired: timeRemaining.isExpired,
            isExpiringSoon: timeRemaining.isExpiringSoon,
          };
        }
      );

      setPromotions(promotionsWithTimer);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();

    if (autoRefresh) {
      const interval = setInterval(fetchPromotions, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchPromotions, autoRefresh, refreshInterval]);

  // Filter promotions
  const featuredPromotions = promotions.filter((p) => p.isShowHome || p.showOnHome);
  const expiringSoon = promotions.filter((p) => p.isExpiringSoon && !p.isExpired);

  return {
    promotions,
    featuredPromotions,
    expiringSoon,
    isLoading,
    error,
    refetch: fetchPromotions,
  };
}

// ==================== HOT DEALS HOOK (F051) ====================

interface UseHotDealsOptions {
  limit?: number;
}

interface UseHotDealsReturn {
  tours: TourCardData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useHotDeals(options: UseHotDealsOptions = {}): UseHotDealsReturn {
  const { limit = 8 } = options;
  
  const [tours, setTours] = useState<TourCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHotDeals = useCallback(async () => {
    try {
      const data = await fetchApi<{ data: TourCardData[] }>(
        `/api/tours?filter=hot-deals&limit=${limit}`
      );
      const toursWithFlags = data.data.map((tour: TourCardData) => ({
        ...tour,
        isHotDeal: true,
      }));
      setTours(toursWithFlags);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchHotDeals();
  }, [fetchHotDeals]);

  return {
    tours,
    isLoading,
    error,
    refetch: fetchHotDeals,
  };
}

// ==================== NEW ARRIVALS HOOK (F052) ====================

interface UseNewArrivalsOptions {
  limit?: number;
  daysThreshold?: number; // Tours added within this many days are considered "new"
}

interface UseNewArrivalsReturn {
  tours: TourCardData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useNewArrivals(options: UseNewArrivalsOptions = {}): UseNewArrivalsReturn {
  const { limit = 8, daysThreshold = 30 } = options;
  
  const [tours, setTours] = useState<TourCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNewArrivals = useCallback(async () => {
    try {
      const data = await fetchApi<{ data: TourCardData[] }>(
        `/api/tours?filter=new&limit=${limit}&days=${daysThreshold}`
      );
      const toursWithFlags = data.data.map((tour: TourCardData) => ({
        ...tour,
        isNewArrival: true,
      }));
      setTours(toursWithFlags);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, daysThreshold]);

  useEffect(() => {
    fetchNewArrivals();
  }, [fetchNewArrivals]);

  return {
    tours,
    isLoading,
    error,
    refetch: fetchNewArrivals,
  };
}

// ==================== COMBINED INFO DATA HOOK ====================

interface UseInformationDataReturn {
  promotions: UsePromotionsReturn;
  hotDeals: UseHotDealsReturn;
  newArrivals: UseNewArrivalsReturn;
  isLoading: boolean;
}

export function useInformationData(): UseInformationDataReturn {
  const promotions = usePromotions({ autoRefresh: true, refreshInterval: 30000 }); // Refresh every 30s
  const hotDeals = useHotDeals();
  const newArrivals = useNewArrivals();

  return {
    promotions,
    hotDeals,
    newArrivals,
    isLoading: promotions.isLoading || hotDeals.isLoading || newArrivals.isLoading,
  };
}
