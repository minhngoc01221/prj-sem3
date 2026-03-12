// Search Hooks
// F039: Search History, F040: Autocomplete, F047: Saved Search, F048: Compare

import { useState, useEffect, useCallback } from 'react';
import {
  SearchType,
  SortOption,
  AutocompleteSuggestion,
  SearchHistoryItem,
  SavedSearch,
  CompareItem,
  AdvancedSearchParams,
  Region,
  SpotType,
} from '@/types/search';

const SEARCH_HISTORY_KEY = 'karnel_search_history';
const COMPARE_LIST_KEY = 'karnel_compare_list';
const MAX_HISTORY_ITEMS = 10;
const MAX_COMPARE_ITEMS = 4;

// ==================== SEARCH HISTORY (F039) ====================

/**
 * Hook to manage search history in localStorage
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  // Save search to history
  const addToHistory = useCallback((query: string, type: SearchType, resultsCount?: number) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      type,
      timestamp: new Date(),
      resultsCount,
    };

    setHistory(prev => {
      // Remove duplicate queries
      const filtered = prev.filter(item => item.query !== query);
      // Add new item at the beginning
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      // Save to localStorage
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  // Remove single item
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}

// ==================== AUTOCOMPLETE (F040) ====================

/**
 * Hook for autocomplete search
 */
export function useAutocomplete() {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: query, limit: '8' });
      const response = await fetch(`/api/search/autocomplete?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    search,
    clearSuggestions,
  };
}

// ==================== MAIN SEARCH (F021-F037) ====================

/**
 * Main search hook with filters and pagination
 */
export function useSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Search params state
  const [params, setParams] = useState({
    query: '',
    type: SearchType.SPOT,
    page: 1,
    limit: 12,
    sort: SortOption.RATING_DESC,
    // Spot filters
    region: undefined as Region | undefined,
    spotType: undefined as SpotType | undefined,
    // Hotel filters
    city: '',
    starRating: [] as number[],
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    amenities: [] as string[],
    checkIn: '',
    checkOut: '',
    guests: 0,
    // Restaurant filters
    cuisineType: [] as string[],
    priceRange: [] as string[],
    style: [] as string[],
    // Resort filters
    locationType: [] as string[],
    resortType: [] as string[],
  });

  const search = useCallback(async (newParams?: Partial<typeof params>) => {
    setIsLoading(true);
    setError(null);

    const searchParams = { ...params, ...newParams };
    if (newParams) {
      setParams(searchParams);
    }

    try {
      const queryString = new URLSearchParams();
      
      // Build query string
      if (searchParams.query) queryString.set('query', searchParams.query);
      if (searchParams.type) queryString.set('type', searchParams.type);
      queryString.set('page', searchParams.page.toString());
      queryString.set('limit', searchParams.limit.toString());
      queryString.set('sort', searchParams.sort);

      // Add filters
      if (searchParams.region) queryString.set('region', searchParams.region);
      if (searchParams.spotType) queryString.set('spotType', searchParams.spotType);
      if (searchParams.city) queryString.set('city', searchParams.city);
      if (searchParams.starRating?.length) {
        queryString.set('starRating', searchParams.starRating.join(','));
      }
      if (searchParams.priceMin) queryString.set('priceMin', searchParams.priceMin.toString());
      if (searchParams.priceMax) queryString.set('priceMax', searchParams.priceMax.toString());
      if (searchParams.amenities?.length) {
        queryString.set('amenities', searchParams.amenities.join(','));
      }
      if (searchParams.checkIn) queryString.set('checkIn', searchParams.checkIn);
      if (searchParams.checkOut) queryString.set('checkOut', searchParams.checkOut);
      if (searchParams.guests) queryString.set('guests', searchParams.guests.toString());
      if (searchParams.cuisineType?.length) {
        queryString.set('cuisineType', searchParams.cuisineType.join(','));
      }
      if (searchParams.priceRange?.length) {
        queryString.set('priceRange', searchParams.priceRange.join(','));
      }
      if (searchParams.style?.length) {
        queryString.set('style', searchParams.style.join(','));
      }
      if (searchParams.locationType?.length) {
        queryString.set('locationType', searchParams.locationType.join(','));
      }
      if (searchParams.resortType?.length) {
        queryString.set('resortType', searchParams.resortType.join(','));
      }

      const response = await fetch(`/api/search?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      setResults(data.data || []);
      setPagination(data.pagination);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // Change page
  const goToPage = useCallback((page: number) => {
    search({ page });
  }, [search]);

  // Update sort
  const changeSort = useCallback((sort: SortOption) => {
    search({ sort, page: 1 });
  }, [search]);

  // Update type
  const changeType = useCallback((type: SearchType) => {
    search({ type, page: 1 });
  }, [search]);

  return {
    results,
    isLoading,
    error,
    pagination,
    params,
    setParams: search,
    search,
    goToPage,
    changeSort,
    changeType,
  };
}

// ==================== ADVANCED SEARCH (F041-F046) ====================

/**
 * Advanced search hook with combined criteria
 */
export function useAdvancedSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const search = useCallback(async (searchParams: AdvancedSearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('Advanced search failed');
      }

      const data = await response.json();
      
      setResults(data.data || []);
      setPagination(data.pagination);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToPage = useCallback((page: number, currentParams: AdvancedSearchParams) => {
    search({ ...currentParams, page });
  }, [search]);

  return {
    results,
    isLoading,
    error,
    pagination,
    search,
    goToPage,
  };
}

// ==================== COMPARE LIST (F048) ====================

/**
 * Hook to manage compare list
 */
export function useCompare() {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COMPARE_LIST_KEY);
    if (stored) {
      try {
        setCompareList(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse compare list:', e);
      }
    }
  }, []);

  // Add item to compare
  const addToCompare = useCallback((item: CompareItem) => {
    setCompareList(prev => {
      if (prev.length >= MAX_COMPARE_ITEMS) {
        return prev; // Max items reached
      }
      if (prev.find(i => i.id === item.id)) {
        return prev; // Already in list
      }
      const newList = [...prev, item];
      localStorage.setItem(COMPARE_LIST_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  // Remove item from compare
  const removeFromCompare = useCallback((id: string) => {
    setCompareList(prev => {
      const newList = prev.filter(item => item.id !== id);
      localStorage.setItem(COMPARE_LIST_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  // Clear compare list
  const clearCompare = useCallback(() => {
    setCompareList([]);
    localStorage.removeItem(COMPARE_LIST_KEY);
  }, []);

  // Check if item is in compare list
  const isInCompare = useCallback((id: string) => {
    return compareList.some(item => item.id === id);
  }, [compareList]);

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    maxItems: MAX_COMPARE_ITEMS,
  };
}

// ==================== SAVED SEARCH (F047) ====================

/**
 * Hook to manage saved searches
 */
export function useSavedSearch() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved searches
  const loadSavedSearches = useCallback(async (userId?: string) => {
    setIsLoading(true);
    try {
      const params = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/search/saved${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setSavedSearches(data.savedSearches || []);
      }
    } catch (e) {
      console.error('Failed to load saved searches:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save a search
  const saveSearch = useCallback(async (name: string, params: AdvancedSearchParams, userId?: string) => {
    try {
      const response = await fetch('/api/search/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, params, userId }),
      });

      if (response.ok) {
        await loadSavedSearches(userId);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to save search:', e);
      return false;
    }
  }, [loadSavedSearches]);

  // Delete a saved search
  const deleteSavedSearch = useCallback(async (searchId: string) => {
    try {
      const response = await fetch(`/api/search/saved?id=${searchId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedSearches(prev => prev.filter(s => s.id !== searchId));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to delete saved search:', e);
      return false;
    }
  }, []);

  return {
    savedSearches,
    isLoading,
    loadSavedSearches,
    saveSearch,
    deleteSavedSearch,
  };
}
