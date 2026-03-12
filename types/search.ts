// Search Types and Interfaces
// F021-F069 - Search & Advanced Search Types
// Uses types from @types/admin for entity types

// Import entity types from admin
import type { TouristSpot, Hotel, Restaurant, Resort, RoomType, Vehicle, TourPackage, ItineraryDay, Booking, Promotion, Contact, User, ApiResponse } from './admin';

// Re-export entity types from admin
export type { TouristSpot, Hotel, Restaurant, Resort, RoomType, Vehicle, TourPackage, ItineraryDay, Booking, Promotion, Contact, User, ApiResponse };

// Re-export for convenience - using type alias to avoid conflicts
export type { Vehicle as TransportVehicle };

// ==================== ENUMS ====================

export enum SearchType {
  SPOT = 'spot',
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
  RESORT = 'resort',
  TRANSPORT = 'transport',
  TOUR = 'tour',
}

export enum SpotType {
  BEACH = 'bãi biển',
  MOUNTAIN = 'núi',
  HISTORICAL = 'di tích',
  WATERFALL = 'thác nước',
  ISLAND = 'đảo',
  LAKE = 'hồ',
  CAVE = 'hang động',
}

export enum Region {
  NORTH = 'Bắc',
  CENTRAL = 'Trung',
  SOUTH = 'Nam',
}

export enum CuisineType {
  VIETNAMESE = 'Việt',
  CHINESE = 'Trung',
  JAPANESE = 'Nhật',
  KOREAN = 'Hàn',
  ITALIAN = 'Ý',
  SEAFOOD = 'hải sản',
  FASTFOOD = 'fast food',
  CAFE = 'cafe',
  BAR = 'bar',
}

export enum PriceRange {
  BUDGET = 'bình dân',
  MIDDLE = 'trung cấp',
  HIGH = 'cao cấp',
}

export enum RestaurantStyle {
  QUAN_AN = 'quán ăn',
  NHA_HANG = 'nhà hàng',
  CAFE = 'cafe',
  BAR = 'bar',
}

export enum ResortLocationType {
  BEACH = 'biển',
  MOUNTAIN = 'núi',
  LAKE = 'hồ',
  ISLAND = 'đảo',
}

export enum ResortType {
  BEACH = 'biển',
  MOUNTAIN = 'núi',
  ECOLOGICAL = 'sinh thái',
  SPA = 'spa',
}

export enum SortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING_DESC = 'rating_desc',
  RATING_ASC = 'rating_asc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  DISTANCE = 'distance',
}

export enum TransportType {
  PLANE = 'máy bay',
  BUS = 'xe khách',
  TRAIN = 'tàu hỏa',
  CAR_RENTAL = 'thuê xe',
  LIMOUSINE = 'limousine',
}

// ==================== BASE INTERFACES ====================

export interface BaseSearchParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface PriceRangeFilter {
  min?: number;
  max?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// ==================== SEARCH PARAM INTERFACES ====================

// F021: Main search with multi-purpose input
export interface MainSearchParams extends BaseSearchParams {
  query?: string;
  type?: SearchType;
}

// F022-F025: Tourist Spot Search
export interface SpotSearchParams extends BaseSearchParams {
  region?: Region;
  type?: SpotType;
  minRating?: number;
  maxTicketPrice?: number;
  query?: string;
}

// F023-F027: Hotel Search
export interface HotelSearchParams extends BaseSearchParams {
  city?: string;
  starRating?: number[];
  priceRange?: PriceRangeFilter;
  amenities?: string[];
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  query?: string;
}

// F028-F030: Restaurant Search
export interface RestaurantSearchParams extends BaseSearchParams {
  city?: string;
  cuisineType?: CuisineType[];
  priceRange?: PriceRange[];
  style?: RestaurantStyle[];
  openNow?: boolean;
  query?: string;
}

// F031-F033: Resort Search
export interface ResortSearchParams extends BaseSearchParams {
  locationType?: ResortLocationType[];
  starRating?: number[];
  priceRange?: PriceRangeFilter;
  resortType?: ResortType[];
  amenities?: string[];
  query?: string;
}

// F051-F055: Tour Package Search
export interface TourSearchParams extends BaseSearchParams {
  query?: string;
  destination?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  priceMin?: number;
  priceMax?: number;
}

// F056-F060: Transport Search
export interface TransportSearchParams extends BaseSearchParams {
  query?: string;
  transportType?: string[];
  departure?: string;
  arrival?: string;
  priceMin?: number;
  priceMax?: number;
  company?: string[];
  duration?: string;
}

// F067 & F069: Combo Search
export interface ComboSearchParams {
  totalBudget: number;
  tourParams?: {
    destination?: string;
    duration?: string;
    startDate?: string;
  };
  hotelParams?: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
  transportParams?: {
    departure?: string;
    arrival?: string;
  };
}

export interface ComboResult {
  tour?: TourPackage;
  hotel?: Hotel;
  transport?: Vehicle;
  totalPrice: number;
  savings: number;
  combinations: number;
}

// F041-F046: Advanced Search
export interface AdvancedSearchParams {
  // Combined criteria
  spot?: SpotSearchParams;
  hotel?: HotelSearchParams;
  restaurant?: RestaurantSearchParams;
  resort?: ResortSearchParams;

  // F042: Distance-based search
  originLocation?: GeoLocation;
  maxDistance?: number;

  // F043: Rating filter
  minRating?: number;

  // F044: Amenities filter
  amenities?: string[];

  // F045: Date-specific search
  dateRange?: DateRange;

  // F046: Group size
  groupSize?: number;

  // Pagination & Sorting
  page?: number;
  limit?: number;
  sort?: SortOption;
}

// ==================== RESPONSE INTERFACES ====================

// Note: Using custom PaginatedResponse for search (different from admin)
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Base search result
export interface SearchResult {
  id: string;
  type: SearchType;
  name: string;
  description?: string;
  image?: string;
  rating?: number;
  price?: number;
  location?: string;
  distance?: number;
}

// Combo search response (F067, F069)
export interface ComboSearchResponse {
  data: ComboResult[];
  summary: {
    totalCombinations: number;
    averagePrice: number;
    bestValue: ComboResult | null;
  };
}

// ==================== SAVED SEARCH (F047) ====================

export interface SavedSearch {
  id: string;
  userId?: string;
  name: string;
  params: AdvancedSearchParams;
  createdAt: Date;
  notifyOnChange?: boolean;
}

// ==================== SEARCH HISTORY (F039) ====================

export interface SearchHistoryItem {
  id: string;
  query: string;
  type: SearchType;
  timestamp: Date;
  resultsCount?: number;
}

// ==================== COMPARE ITEM (F048) ====================

export interface CompareItem {
  id: string;
  type: SearchType;
  name: string;
  image?: string;
  price?: number;
  rating?: number;
  keyFeatures: Record<string, string | number>;
}

export interface CompareList {
  id: string;
  userId?: string;
  items: CompareItem[];
  maxItems: number;
}

// ==================== AUTOCOMPLETE (F040) ====================

export interface AutocompleteSuggestion {
  id: string;
  type: SearchType;
  name: string;
  subtext?: string;
  image?: string;
}

export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
  categories: {
    type: SearchType;
    count: number;
  }[];
}
