import type { Restaurant } from '@/types/admin';

const API_BASE_URL = '/api/restaurants';

export interface RestaurantFilters {
  city?: string;
  cuisineType?: string;
  priceRange?: string;
  search?: string;
  isActive?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
}

export interface RestaurantReview {
  id: string;
  restaurantId: string;
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

export interface RestaurantBooking {
  id: string;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingDate: string;
  bookingTime: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

class RestaurantService {
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ============ Restaurant CRUD ============

  async getRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
    const params = new URLSearchParams();
    
    if (filters?.city && filters.city !== 'all') params.set('city', filters.city);
    if (filters?.cuisineType && filters.cuisineType !== 'all') params.set('cuisineType', filters.cuisineType);
    if (filters?.priceRange && filters.priceRange !== 'all') params.set('priceRange', filters.priceRange);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.isActive !== undefined) params.set('isActive', String(filters.isActive));

    const query = params.toString();
    const result = await this.fetchApi<{ success: boolean; data: Restaurant[] }>(
      query ? `?${query}` : ''
    );
    
    return result.data;
  }

  async getRestaurantById(id: string): Promise<Restaurant & { 
    reviews?: RestaurantReview[]; 
    bookings?: RestaurantBooking[] 
  }> {
    const result = await this.fetchApi<{ 
      success: boolean; 
      data: Restaurant & { 
        reviews?: RestaurantReview[]; 
        bookings?: RestaurantBooking[] 
      } 
    }>(`/${id}`);
    
    return result.data;
  }

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const result = await this.fetchApi<{ success: boolean; data: Restaurant }>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return result.data;
  }

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const result = await this.fetchApi<{ success: boolean; data: Restaurant }>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    return result.data;
  }

  async deleteRestaurant(id: string): Promise<void> {
    await this.fetchApi(`/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleRestaurantActive(id: string, isActive: boolean): Promise<Restaurant> {
    return this.updateRestaurant(id, { isActive });
  }

  // ============ Menu Management ============

  async updateMenu(restaurantId: string, menu: MenuItem[]): Promise<Restaurant> {
    return this.updateRestaurant(restaurantId, { menu } as any);
  }

  // ============ Gallery Management ============

  async updateGallery(restaurantId: string, images: string[]): Promise<Restaurant> {
    return this.updateRestaurant(restaurantId, { images });
  }

  // ============ Reviews ============

  async replyToReview(
    restaurantId: string, 
    reviewId: string, 
    response: string
  ): Promise<void> {
    // In a real implementation, this would call an API endpoint
    console.log(`Replying to review ${reviewId} at restaurant ${restaurantId}: ${response}`);
  }

  // ============ Bookings ============

  async getBookings(restaurantId: string): Promise<RestaurantBooking[]> {
    // In a real implementation, this would call an API endpoint
    const restaurant = await this.getRestaurantById(restaurantId);
    return restaurant.bookings || [];
  }

  async updateBookingStatus(
    bookingId: string, 
    status: RestaurantBooking['status']
  ): Promise<void> {
    // In a real implementation, this would call an API endpoint
    console.log(`Updating booking ${bookingId} status to: ${status}`);
  }

  // ============ Statistics ============

  async getRestaurantStats(restaurantId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    totalBookings: number;
    pendingBookings: number;
  }> {
    const restaurant = await this.getRestaurantById(restaurantId);
    
    return {
      totalReviews: restaurant.reviewCount || 0,
      averageRating: restaurant.rating || 0,
      totalBookings: restaurant.bookings?.length || 0,
      pendingBookings: restaurant.bookings?.filter(b => b.status === 'pending').length || 0,
    };
  }
}

export const restaurantService = new RestaurantService();
