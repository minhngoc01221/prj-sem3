// Dashboard Stats Types
export interface DashboardStats {
  totalTouristSpots: number;
  totalHotels: number;
  totalRestaurants: number;
  totalResorts: number;
  totalOrders: number;
  totalRevenue: number;
  revenueChange: number; // percentage change from last month
  ordersChange: number;
}

// Revenue Chart Types
export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface RevenueChartData {
  data: RevenueDataPoint[];
  totalRevenue: number;
  averageRevenue: number;
}

// Recent Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingCustomer {
  id: string;
  customerName: string;
  email: string;
  phone: string;
}

export interface RecentBooking {
  id: string;
  customer: BookingCustomer;
  serviceType: string;
  serviceName: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: Date;
}

export interface RecentBookingsResponse {
  bookings: RecentBooking[];
  total: number;
}

// Contact Alert Types
export interface ContactAlert {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string | null;
  message: string;
  createdAt: Date;
}

export interface ContactAlertsResponse {
  contacts: ContactAlert[];
  unreadCount: number;
}

// Notification Types
export type NotificationType = 'new_booking' | 'contact' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
