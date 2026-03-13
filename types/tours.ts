// Tour Information Page Types
// F068-F083 - Tour Listing, Detail, and Compare Pages

import type { TourPackage, ItineraryDay as AdminItineraryDay } from './admin';

// ==================== TOUR CARD DATA (F068) ====================

export interface TourCardData {
  id: string;
  name: string;
  description: string;
  duration: string;           // "3 ngày 2 đêm"
  destinations: string[];     // ["Đà Nẵng", "Hội An"]
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  bookingCount: number;
  startDates: string[];
  isFeatured?: boolean;       // F081
  isNewArrival?: boolean;     // F082
  isHotDeal?: boolean;        // F083
  isDiscounted?: boolean;
  groupSize?: number;
  createdAt: string;
}

// Helper function to check if tour is discounted
export function isTourDiscounted(tour: TourCardData): boolean {
  return !!(tour.discountPrice && tour.discountPrice < tour.price);
}

// Helper function to calculate discount percentage
export function calculateDiscountPercent(originalPrice: number, discountPrice: number): number {
  if (originalPrice <= 0 || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

// ==================== ITINERARY (F073) ====================

export interface ItineraryTimeSlot {
  time: string;
  activity: string;
  location?: string;
  meal?: 'breakfast' | 'lunch' | 'dinner';
  icon?: 'sun' | 'moon' | 'coffee' | 'utensils' | 'bed';
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  morning?: ItineraryTimeSlot;
  afternoon?: ItineraryTimeSlot;
  evening?: ItineraryTimeSlot;
  accommodation?: string;
  isOvernight?: boolean;
}

// Convert admin itinerary to frontend format
export function convertAdminItinerary(adminItinerary: AdminItineraryDay[]): ItineraryDay[] {
  return adminItinerary.map(item => ({
    day: item.day,
    title: item.title,
    description: item.description,
    accommodation: item.accommodation,
    isOvernight: !!item.accommodation,
  }));
}

// ==================== TOUR SERVICES (F074) ====================

export interface ServiceItem {
  id: string;
  name: string;
  icon?: string;
  category: 'transport' | 'accommodation' | 'meal' | 'guide' | 'ticket' | 'other';
  included: boolean;
}

export interface TourServices {
  includes: ServiceItem[];
  excludes: ServiceItem[];
}

// Group services by category
export function groupServicesByCategory(services: ServiceItem[]): Record<string, ServiceItem[]> {
  return services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, ServiceItem[]>);
}

// ==================== TOUR REVIEWS (F076) ====================

export interface TourReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  travelDate: string;
  createdAt: string;
  helpful: number;
  isVerified: boolean; // Verified booking
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedReviews: number;
}

// ==================== TOUR DETAIL (F073-F078) ====================

export interface TourDetailData extends TourCardData {
  fullDescription: string;
  groupSize: number;
  minAge?: number;
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  highlights: string[];
  pickupLocation?: string;
  dropoffLocation?: string;
  termsAndConditions?: string;
  cancellationPolicy?: string;
  reviews: TourReview[];
  reviewStats: ReviewStats;
  relatedTours: TourCardData[];
  availableDates: string[];
}

// ==================== TOUR FILTERS (F069-F072) ====================

export interface TourFilters {
  search?: string;
  destinations?: string[];
  duration?: TourDuration | null;
  priceRange?: [number, number];
  startDate?: string | null;
  sort?: TourSortOption;
}

export type TourDuration = 
  | '2n1d'   // 2 ngày 1 đêm
  | '3n2d'   // 3 ngày 2 đêm
  | '4n3d'   // 4 ngày 3 đêm
  | '5n4d'   // 5 ngày 4 đêm'
  | '6n5d+'; // 6+ ngày

export type TourSortOption = 
  | 'popular'     // Theo lượt đặt
  | 'newest'      // Mới nhất
  | 'price-asc'   // Giá tăng dần
  | 'price-desc'  // Giá giảm dần
  | 'rating';     // Theo đánh giá

export type TourFilter = 
  | 'featured'    // F081
  | 'new'         // F082
  | 'hot-deals'   // F083
  | 'discounted'; // Tour giảm giá

// Duration display labels
export const tourDurationLabels: Record<TourDuration, string> = {
  '2n1d': '2 ngày 1 đêm',
  '3n2d': '3 ngày 2 đêm',
  '4n3d': '4 ngày 3 đêm',
  '5n4d': '5 ngày 4 đêm',
  '6n5d+': '6+ ngày',
};

// Sort options labels
export const tourSortLabels: Record<TourSortOption, string> = {
  'popular': 'Phổ biến nhất',
  'newest': 'Mới nhất',
  'price-asc': 'Giá tăng dần',
  'price-desc': 'Giá giảm dần',
  'rating': 'Đánh giá cao nhất',
};

// ==================== API RESPONSE TYPES ====================

export interface ToursListResponse {
  success: boolean;
  data: {
    tours: TourCardData[];
    total: number;
    page: number;
    totalPages: number;
    totalTours: number;
  };
}

export interface TourDetailResponse {
  success: boolean;
  data: TourDetailData;
}

export interface ToursCompareResponse {
  success: boolean;
  data: {
    tours: TourDetailData[];
  };
}

// ==================== COMPARE FEATURE (F079) ====================

export interface CompareItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface CompareState {
  selectedTours: CompareItem[];
  isOpen: boolean;
}

// ==================== POPULAR DESTINATIONS ====================

export interface Destination {
  id: string;
  name: string;
  slug: string;
  tourCount: number;
}

export const popularDestinations: Destination[] = [
  { id: '1', name: 'Đà Nẵng', slug: 'da-nang', tourCount: 45 },
  { id: '2', name: 'Hội An', slug: 'hoi-an', tourCount: 38 },
  { id: '3', name: 'Nha Trang', slug: 'nha-trang', tourCount: 32 },
  { id: '4', name: 'Phú Quốc', slug: 'phu-quoc', tourCount: 28 },
  { id: '5', name: 'Đà Lạt', slug: 'da-lat', tourCount: 25 },
  { id: '6', name: 'Hà Nội', slug: 'ha-noi', tourCount: 22 },
  { id: '7', name: 'TP. Hồ Chí Minh', slug: 'tp-ho-chi-minh', tourCount: 20 },
  { id: '8', name: 'Phan Thiết', slug: 'phan-thiet', tourCount: 18 },
  { id: '9', name: 'Cần Thơ', slug: 'can-tho', tourCount: 15 },
  { id: '10', name: 'Huế', slug: 'hue', tourCount: 12 },
];

// ==================== PRICE RANGE ====================

export const defaultPriceRange: [number, number] = [0, 50000000];
export const priceStep = 500000;

// ==================== DEFAULT IMAGES ====================

export const defaultTourImages = {
  placeholder: '/images/placeholder-tour.jpg',
  gallery: [
    '/images/tours/gallery-1.jpg',
    '/images/tours/gallery-2.jpg',
    '/images/tours/gallery-3.jpg',
    '/images/tours/gallery-4.jpg',
  ],
};
