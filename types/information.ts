// Information Page Types
// F049-F055 - Information Page Types

import type { TourPackage, Promotion } from './admin';

// ==================== POLICY LINKS (F049) ====================

export interface PolicyLink {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  href: string;
  icon: string;
}

export const policyLinks: PolicyLink[] = [
  {
    id: 'privacy',
    title: 'Chính sách bảo mật',
    titleEn: 'Privacy Policy',
    description: 'Learn how we protect your personal information',
    href: '/privacy',
    icon: 'Shield',
  },
  {
    id: 'terms',
    title: 'Điều khoản sử dụng',
    titleEn: 'Terms of Service',
    description: 'Terms and conditions for using our services',
    href: '/terms',
    icon: 'FileText',
  },
  {
    id: 'payment',
    title: 'Hướng dẫn thanh toán',
    titleEn: 'Payment Guide',
    description: 'Step-by-step payment instructions',
    href: '/payment-guide',
    icon: 'CreditCard',
  },
  {
    id: 'faq',
    title: 'Câu hỏi thường gặp',
    titleEn: 'FAQ',
    description: 'Frequently asked questions answered',
    href: '/faq',
    icon: 'HelpCircle',
  },
  {
    id: 'cancellation',
    title: 'Chính sách hoàn hủy',
    titleEn: 'Cancellation Policy',
    description: 'Refund and cancellation guidelines',
    href: '/cancellation-policy',
    icon: 'RefreshCcw',
  },
];

// ==================== PROMOTION TYPES (F050-F054) ====================

export interface PromotionWithTimer extends Promotion {
  timeRemaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  };
  isExpired?: boolean;
  isExpiringSoon?: boolean; // Less than 24 hours
}

// API Response for promotions
export interface PromotionsResponse {
  success: boolean;
  data: {
    activePromotions: PromotionWithTimer[];
    expiringSoon: PromotionWithTimer[];
    featured: PromotionWithTimer[];
  };
  timestamp: string;
}

// ==================== TOUR TYPES (F051-F052) ====================

export interface TourCardData {
  id: string;
  name: string;
  description: string;
  duration: string;
  destinations: string[];
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  bookingCount: number;
  startDates: string[];
  isNewArrival?: boolean;
  isHotDeal?: boolean;
  createdAt: string;
}

// Calculate discount percentage
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Calculate time remaining until a date
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export function calculateTimeRemaining(endDate: string): TimeRemaining {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const total = end - now;

  if (total <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
      isExpired: true,
      isExpiringSoon: false,
    };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    total,
    isExpired: false,
    isExpiringSoon: total < 24 * 60 * 60 * 1000, // Less than 24 hours
  };
}

// ==================== SECTIONS CONFIG ====================

export interface InfoSection {
  id: string;
  title: string;
  titleEn: string;
  subtitle?: string;
  viewAllHref?: string;
}

// Section configurations
export const infoSections: InfoSection[] = [
  {
    id: 'promotions',
    title: 'Khuyến mãi đặc biệt',
    titleEn: 'Special Offers',
    subtitle: 'Limited time deals for your dream vacation',
    viewAllHref: '/promotions',
  },
  {
    id: 'hot-deals',
    title: 'Tour giảm giá',
    titleEn: 'Hot Deals',
    subtitle: 'Save big on these exclusive tours',
    viewAllHref: '/tours?filter=discounted',
  },
  {
    id: 'new-arrivals',
    title: 'Tour mới',
    titleEn: 'New Arrivals',
    subtitle: 'Discover our newest tour packages',
    viewAllHref: '/tours?filter=new',
  },
];

// ==================== API QUERY KEYS ====================

export const queryKeys = {
  promotions: ['promotions'] as const,
  promotionById: (id: string) => ['promotion', id] as const,
  tours: ['tours'] as const,
  tourById: (id: string) => ['tour', id] as const,
  hotDeals: ['tours', 'hot-deals'] as const,
  newArrivals: ['tours', 'new-arrivals'] as const,
  featuredTours: ['tours', 'featured'] as const,
};
