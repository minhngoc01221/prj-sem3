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
  tourCount?: number;
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

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price?: number;
  basePrice?: number;
  capacity: number;
  maxCapacity?: number;
  amenities: string[];
  images: string[];
  available?: number;
  total?: number;
  totalRooms?: number;
  availableRooms?: number;
  pricing?: RoomPricing[];
  availability?: RoomAvailability[];
}

export interface RoomPricing {
  id?: string;
  date: string;
  price: number;
  isSpecial?: boolean;
  specialReason?: string;
}

export interface RoomAvailability {
  date: string;
  available: number;
  booked?: number;
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
  contact?: string;
  rating?: number;
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
  discount?: number;
  groupSize: number;
  startDates: string[];
  includedServices: string[];
  excludedServices: string[];
  includes?: string[];
  excludes?: string[];
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
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountPercent?: number;
  promoCode?: string;
  code?: string;
  startDate: string;
  endDate: string;
  applicableItems?: {
    type: 'tour' | 'hotel' | 'vehicle' | 'all';
    ids: string[];
  };
  targetType?: string;
  targetId?: string;
  isActive?: boolean;
  showOnHome?: boolean;
  isShowHome?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  address?: string;
  subject: string;
  title?: string;
  message: string;
  service?: string;
  serviceType?: string;
  preferredDate?: string;
  desiredDate?: string;
  guestCount?: string;
  rating?: number;
  isRead: boolean;
  status?: 'pending' | 'replied' | 'processed';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  password?: string; // Only for traditional login
  role: 'admin' | 'moderator' | 'staff' | 'user';
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  
  // Social Login Fields
  provider?: 'google' | 'facebook' | 'traditional';
  providerId?: string; // ID from social provider
  emailVerified?: boolean;
  
  // Password Reset Fields
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // Account Verification
  isEmailVerified?: boolean;
  verificationToken?: string;
}

// Auth Payload for JWT
export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

// Login Request/Response
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  accessToken: string;
}

// Register Request/Response
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Social Login Request
export interface SocialLoginRequest {
  provider: 'google' | 'facebook';
  providerToken: string; // Token from Google/Facebook
}

export interface SocialProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}

// Forgot Password
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
