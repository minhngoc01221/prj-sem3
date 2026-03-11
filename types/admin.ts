export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  location: string;
  region: 'north' | 'central' | 'south';
  type: 'beach' | 'mountain' | 'historical' | 'waterfall' | 'other';
  images: string[];
  rating: number;
  reviewCount: number;
  bestTime: string;
  ticketPrice?: string;
  isActive: boolean;
  tourCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  starRating: number;
  priceRange: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  contactPhone?: string;
  contactEmail?: string;
  roomTypes?: RoomType[];
  reviews?: HotelReview[];
  createdAt: string;
  updatedAt: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  capacity: number;
  maxCapacity: number;
  amenities: string[];
  images: string[];
  totalRooms: number;
  availableRooms: number;
  pricing: RoomPricing[];
  availability: RoomAvailability[];
}

export interface RoomPricing {
  id: string;
  date: string;
  price: number;
  isSpecial: boolean;
  specialReason?: string;
}

export interface RoomAvailability {
  id: string;
  date: string;
  available: number;
  booked: number;
}

export interface HotelReview {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  response?: {
    content: string;
    respondedAt: string;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  cuisineType: string;
  priceRange: 'budget' | 'medium' | 'high';
  style: 'cafe' | 'restaurant' | 'bar' | 'food_stall';
  openingHours: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  contactPhone?: string;
  menu?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Resort {
  id: string;
  name: string;
  description: string;
  address: string;
  location: 'beach' | 'mountain' | 'lake' | 'island';
  starRating: number;
  priceRange: string;
  amenities: string[];
  roomTypes: RoomType[];
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  type: 'bus' | 'limousine' | 'airplane' | 'train' | 'car';
  name: string;
  provider: string;
  route: string;
  departure: string;
  arrival: string;
  schedule: string[];
  price: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourPackage {
  id: string;
  name: string;
  description: string;
  duration: string;
  destinations: string[];
  price: number;
  groupSize: number;
  startDates: string[];
  includedServices: string[];
  excludedServices: string[];
  itinerary: ItineraryDay[];
  images: string[];
  guideId?: string;
  isActive: boolean;
  bookingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  type: 'tour' | 'hotel' | 'vehicle' | 'restaurant';
  itemId: string;
  itemName: string;
  bookingDate: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableItems: {
    type: 'tour' | 'hotel' | 'vehicle' | 'all';
    ids: string[];
  };
  isActive: boolean;
  showOnHome: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subject: string;
  message: string;
  service?: string;
  preferredDate?: string;
  guestCount?: string;
  rating?: number;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'staff';
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
