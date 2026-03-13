// Tourist Spot Types for Frontend
// F056-F067 - Tourist Spot Information Page Types

import type { TouristSpot } from './admin';

// ==================== ENUMS ====================

export enum Region {
  NORTH = 'north',
  CENTRAL = 'central',
  SOUTH = 'south',
}

export enum SpotType {
  BEACH = 'beach',
  MOUNTAIN = 'mountain',
  HISTORICAL = 'historical',
  WATERFALL = 'waterfall',
  ISLAND = 'island',
  LAKE = 'lake',
  CAVE = 'cave',
  PARK = 'park',
  OTHER = 'other',
}

// Vietnamese labels for enums
export const regionLabels: Record<Region, string> = {
  [Region.NORTH]: 'Miền Bắc',
  [Region.CENTRAL]: 'Miền Trung',
  [Region.SOUTH]: 'Miền Nam',
};

export const regionLabelsEn: Record<Region, string> = {
  [Region.NORTH]: 'North',
  [Region.CENTRAL]: 'Central',
  [Region.SOUTH]: 'South',
};

export const spotTypeLabels: Record<SpotType, string> = {
  [SpotType.BEACH]: 'Bãi biển',
  [SpotType.MOUNTAIN]: 'Núi',
  [SpotType.HISTORICAL]: 'Di tích',
  [SpotType.WATERFALL]: 'Thác nước',
  [SpotType.ISLAND]: 'Đảo',
  [SpotType.LAKE]: 'Hồ',
  [SpotType.CAVE]: 'Hang động',
  [SpotType.PARK]: 'Công viên',
  [SpotType.OTHER]: 'Khác',
};

export const spotTypeLabelsEn: Record<SpotType, string> = {
  [SpotType.BEACH]: 'Beach',
  [SpotType.MOUNTAIN]: 'Mountain',
  [SpotType.HISTORICAL]: 'Historical',
  [SpotType.WATERFALL]: 'Waterfall',
  [SpotType.ISLAND]: 'Island',
  [SpotType.LAKE]: 'Lake',
  [SpotType.CAVE]: 'Cave',
  [SpotType.PARK]: 'Park',
  [SpotType.OTHER]: 'Other',
};

// ==================== SPOT CARD DATA ====================

export interface SpotCardData {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  region: Region;
  spotType: SpotType;
  images: string[];
  rating: number;
  reviewCount: number;
  bestTime: string;
  ticketPrice?: string;
  tourCount?: number;
  isActive: boolean;
}

// ==================== SPOT DETAIL DATA ====================

export interface SpotDetailData extends SpotCardData {
  fullDescription: string;
  activities: string[];
  nearbyHotels: {
    id: string;
    name: string;
    starRating: number;
    distance: string;
    image: string;
    priceRange: string;
  }[];
  nearbyRestaurants: {
    id: string;
    name: string;
    cuisineType: string;
    distance: string;
    image: string;
    priceRange: string;
  }[];
  reviews: SpotReview[];
}

export interface SpotReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
}

// ==================== SEARCH & FILTER ====================

export interface SpotSearchParams {
  query?: string;
  region?: Region;
  spotType?: SpotType;
  minRating?: number;
  maxTicketPrice?: number;
  sortBy?: 'rating' | 'reviewCount' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SpotSearchResponse {
  data: SpotCardData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    regions: { value: Region; label: string; count: number }[];
    spotTypes: { value: SpotType; label: string; count: number }[];
    priceRanges: { value: string; label: string; count: number }[];
  };
}

// ==================== URL SLUG ====================

export function generateSpotSlug(name: string, id: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens
  
  return `${slug}-${id}`;
}

export function parseSpotSlug(slug: string): string | null {
  const parts = slug.split('-');
  const id = parts[parts.length - 1];
  return id || null;
}

// ==================== NEARBY SUGGESTION LOGIC ====================

export interface NearbySearchParams {
  spotId: string;
  spotLocation: string;
  radius?: number; // in km
  limit?: number;
}

export function calculateNearbyItems<T extends { location: string }>(
  items: T[],
  spotLocation: string,
  radius: number = 10
): T[] {
  // Simple string-based matching (in production, use geo-coordinates)
  // Filter items that contain similar location keywords
  const spotKeywords = spotLocation.toLowerCase().split(/[\s,]+/);
  
  return items
    .map(item => {
      let score = 0;
      const itemKeywords = item.location.toLowerCase().split(/[\s,]+/);
      
      // Calculate keyword overlap
      spotKeywords.forEach(sk => {
        if (sk.length > 2) {
          itemKeywords.forEach(ik => {
            if (ik.includes(sk) || sk.includes(ik)) {
              score++;
            }
          });
        }
      });
      
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, radius)
    .map(({ item }) => item);
}

// ==================== ADMIN TYPES ====================

export interface SpotFormData {
  name: string;
  description: string;
  location: string;
  region: Region;
  spotType: SpotType;
  bestTime: string;
  ticketPrice?: string;
  activities?: string[];
  images: string[];
  isActive: boolean;
}

export interface SpotAdminRow {
  id: string;
  name: string;
  location: string;
  region: string;
  spotType: string;
  rating: number;
  reviewCount: number;
  tourCount: number;
  isActive: boolean;
  createdAt: string;
  actions: string;
}

// ==================== API QUERY KEYS ====================

export const spotQueryKeys = {
  all: ['spots'] as const,
  lists: () => [...spotQueryKeys.all, 'list'] as const,
  list: (filters: SpotSearchParams) => [...spotQueryKeys.lists(), filters] as const,
  details: () => [...spotQueryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...spotQueryKeys.details(), slug] as const,
  featured: () => [...spotQueryKeys.all, 'featured'] as const,
  byRegion: (region: Region) => [...spotQueryKeys.all, 'region', region] as const,
  byType: (type: SpotType) => [...spotQueryKeys.all, 'type', type] as const,
};
