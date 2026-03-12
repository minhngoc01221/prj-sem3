"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Utensils, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Star,
  Grid,
  MessageSquare,
  Calendar,
  UtensilsCrossed,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import type { Restaurant } from '@/types/admin';
import { restaurantService, RestaurantReview, RestaurantBooking, MenuItem } from '@/lib/services/restaurantService';

interface RestaurantsManagementContentProps {
  restaurants?: Restaurant[];
  isLoading?: boolean;
}

type DetailTab = 'info' | 'menu' | 'gallery' | 'reviews' | 'bookings';

const priceRangeLabels: Record<string, string> = {
  budget: 'Bình dân',
  medium: 'Trung cấp',
  high: 'Cao cấp'
};

const cuisineTypes = [
  'Việt Nam',
  'Trung Quốc',
  'Nhật Bản',
  'Hàn Quốc',
  'Ý',
  'Pháp',
  'Hải sản',
  'BBQ',
  'Café',
  'Quán ăn'
];

const styleOptions = [
  { value: 'restaurant', label: 'Nhà hàng' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'food_stall', label: 'Quán ăn' }
];

const priceRangeOptions = [
  { value: 'budget', label: 'Bình dân', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Trung cấp', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'Cao cấp', color: 'bg-purple-100 text-purple-700' }
];

export function RestaurantsManagementContent({ restaurants: initialRestaurants, isLoading: initialLoading = false }: RestaurantsManagementContentProps) {
  // State for restaurants list
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  
  // State for selected restaurant detail
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedDetailTab, setSelectedDetailTab] = useState<DetailTab>('info');
  const [restaurantReviews, setRestaurantReviews] = useState<RestaurantReview[]>([]);
  const [restaurantBookings, setRestaurantBookings] = useState<RestaurantBooking[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // State for modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<Partial<Restaurant>>({});
  
  // State for notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const itemsPerPage = 10;

  // Fetch restaurants from API
  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      const filters = {
        city: cityFilter !== 'all' ? cityFilter : undefined,
        cuisineType: cuisineFilter !== 'all' ? cuisineFilter : undefined,
        search: searchTerm || undefined,
      };
      
      const data = await restaurantService.getRestaurants(filters);
      setRestaurants(data.map((r: any) => ({
        id: r._id?.toString() || r.id,
        name: r.name,
        description: r.description || '',
        address: r.address,
        city: r.city,
        cuisineType: r.cuisineType,
        priceRange: r.priceRange,
        style: r.style,
        openingHours: r.openingHours,
        images: r.images || [],
        rating: r.rating || 0,
        reviewCount: r.reviewCount || 0,
        isActive: r.isActive ?? true,
        contactPhone: r.contactPhone,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      showNotification('error', 'Không thể tải danh sách nhà hàng');
    } finally {
      setIsLoading(false);
    }
  }, [cityFilter, cuisineFilter, searchTerm]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch restaurant details
  const fetchRestaurantDetails = async (restaurant: Restaurant) => {
    try {
      const data = await restaurantService.getRestaurantById(restaurant.id) as any;
      setSelectedRestaurant({
        ...data,
        id: data._id?.toString() || data.id,
      } as Restaurant);
      setRestaurantReviews(data.reviews || []);
      setRestaurantBookings(data.bookings || []);
      setMenuItems(data.menu || []);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      showNotification('error', 'Không thể tải thông tin chi tiết');
    }
  };

  const cities = [...new Set(restaurants.map(r => r.city).filter(Boolean))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const restaurantName = restaurant.name?.toLowerCase() || '';
    const restaurantAddress = restaurant.address?.toLowerCase() || '';
    const search = searchTerm?.toLowerCase() || '';
    
    const matchesSearch = restaurantName.includes(search) ||
      restaurantAddress.includes(search);
    const matchesCity = cityFilter === 'all' || restaurant.city === cityFilter;
    const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisineType === cuisineFilter;
    return matchesSearch && matchesCity && matchesCuisine;
  });

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSelectAll = () => {
    if (selectedRestaurants.length === paginatedRestaurants.length) {
      setSelectedRestaurants([]);
    } else {
      setSelectedRestaurants(paginatedRestaurants.map(r => r.id));
    }
  };

  const handleSelectRestaurant = (id: string) => {
    setSelectedRestaurants(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleActive = async (id: string) => {
    try {
      const restaurant = restaurants.find(r => r.id === id);
      if (!restaurant) return;

      await restaurantService.toggleRestaurantActive(id, !restaurant.isActive);
      setRestaurants(prev => prev.map(r => 
        r.id === id ? { ...r, isActive: !r.isActive } : r
      ));
      if (selectedRestaurant?.id === id) {
        setSelectedRestaurant(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      }
      showNotification('success', 'Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error toggling status:', error);
      showNotification('error', 'Không thể cập nhật trạng thái');
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      cuisineType: 'Việt Nam',
      priceRange: 'medium',
      style: 'restaurant',
      openingHours: '07:00 - 22:00',
      images: [],
      contactPhone: '',
      isActive: true,
    });
    setFormMode('add');
    setIsFormModalOpen(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setFormData(restaurant);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDelete = async (restaurant: Restaurant) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhà hàng "${restaurant.name}"?`)) return;

    try {
      await restaurantService.deleteRestaurant(restaurant.id);
      setRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
      if (selectedRestaurant?.id === restaurant.id) {
        setSelectedRestaurant(null);
      }
      showNotification('success', 'Xóa nhà hàng thành công');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      showNotification('error', 'Không thể xóa nhà hàng');
    }
  };

  const handleViewDetails = async (restaurant: Restaurant) => {
    await fetchRestaurantDetails(restaurant);
  };

  const handleFormSubmit = async (data: Partial<Restaurant>) => {
    try {
      if (formMode === 'add') {
        await restaurantService.createRestaurant(data);
        showNotification('success', 'Thêm nhà hàng thành công');
      } else if (selectedRestaurant) {
        await restaurantService.updateRestaurant(selectedRestaurant.id, data);
        showNotification('success', 'Cập nhật nhà hàng thành công');
      }
      await fetchRestaurants();
      setIsFormModalOpen(false);
      setSelectedRestaurant(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('error', 'Không thể lưu nhà hàng');
    }
  };

  const handleUpdateMenu = async (menu: MenuItem[]) => {
    if (!selectedRestaurant) return;
    try {
      await restaurantService.updateMenu(selectedRestaurant.id, menu);
      setMenuItems(menu);
      showNotification('success', 'Cập nhật thực đơn thành công');
    } catch (error) {
      console.error('Error updating menu:', error);
      showNotification('error', 'Không thể cập nhật thực đơn');
    }
  };

  const handleUpdateGallery = async (images: string[]) => {
    if (!selectedRestaurant) return;
    try {
      await restaurantService.updateGallery(selectedRestaurant.id, images);
      setSelectedRestaurant(prev => prev ? { ...prev, images } : null);
      setRestaurants(prev => prev.map(r => 
        r.id === selectedRestaurant.id ? { ...r, images } : r
      ));
      showNotification('success', 'Cập nhật gallery thành công');
    } catch (error) {
      console.error('Error updating gallery:', error);
      showNotification('error', 'Không thể cập nhật gallery');
    }
  };

  const handleReplyReview = async (reviewId: string, response: string) => {
    if (!selectedRestaurant) return;
    try {
      await restaurantService.replyToReview(selectedRestaurant.id, reviewId, response);
      setRestaurantReviews(prev => prev.map(r =>
        r.id === reviewId
          ? { ...r, response: { content: response, respondedAt: new Date().toISOString() } }
          : r
      ));
      showNotification('success', 'Phản hồi đánh giá thành công');
    } catch (error) {
      console.error('Error replying to review:', error);
      showNotification('error', 'Không thể phản hồi đánh giá');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: RestaurantBooking['status']) => {
    try {
      await restaurantService.updateBookingStatus(bookingId, status);
      setRestaurantBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ));
      showNotification('success', 'Cập nhật trạng thái đặt bàn thành công');
    } catch (error) {
      console.error('Error updating booking:', error);
      showNotification('error', 'Không thể cập nhật trạng thái đặt bàn');
    }
  };

  const handleBackToList = () => {
    setSelectedRestaurant(null);
    fetchRestaurants();
  };

  // Loading state
  if (isLoading || initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Detail View
  if (selectedRestaurant) {
    return (
      <div className="space-y-6">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{selectedRestaurant.name}</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {selectedRestaurant.city} • {selectedRestaurant.address}
            </p>
          </div>
          <button
            onClick={() => handleEdit(selectedRestaurant)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setSelectedDetailTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'info'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Thông tin
            </button>
            <button
              onClick={() => setSelectedDetailTab('menu')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'menu'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Thực đơn ({menuItems.length})
            </button>
            <button
              onClick={() => setSelectedDetailTab('gallery')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'gallery'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
              Gallery
            </button>
            <button
              onClick={() => setSelectedDetailTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'reviews'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Đánh giá ({restaurantReviews.length})
            </button>
            <button
              onClick={() => setSelectedDetailTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedDetailTab === 'bookings'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Đặt bàn ({restaurantBookings.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {selectedDetailTab === 'info' && (
            <RestaurantInfoTab restaurant={selectedRestaurant} />
          )}

          {selectedDetailTab === 'menu' && (
            <MenuManagementTab 
              menuItems={menuItems} 
              onUpdate={handleUpdateMenu} 
            />
          )}

          {selectedDetailTab === 'gallery' && (
            <GalleryManagementTab 
              images={selectedRestaurant.images || []} 
              onUpdate={handleUpdateGallery} 
            />
          )}

          {selectedDetailTab === 'reviews' && (
            <ReviewsTab 
              reviews={restaurantReviews} 
              onReply={handleReplyReview} 
            />
          )}

          {selectedDetailTab === 'bookings' && (
            <BookingsTab 
              bookings={restaurantBookings} 
              onUpdateStatus={handleUpdateBookingStatus} 
            />
          )}
        </div>

        {/* Form Modal */}
        {isFormModalOpen && (
          <RestaurantFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSubmit={handleFormSubmit}
            restaurant={formData}
            mode={formMode}
          />
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhà hàng</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả nhà hàng trong hệ thống</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm nhà hàng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng nhà hàng</p>
              <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {restaurants.filter(r => r.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cao cấp</p>
              <p className="text-2xl font-bold text-gray-900">
                {restaurants.filter(r => r.priceRange === 'high').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đánh giá TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {(restaurants.reduce((sum, r) => sum + r.rating, 0) / (restaurants.length || 1)).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhà hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất cả thành phố</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất cả ẩm thực</option>
              {cuisineTypes.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRestaurants.length === paginatedRestaurants.length && paginatedRestaurants.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hình ảnh</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tên nhà hàng</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Loại ẩm thực</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Phong cách</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Mức giá</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Giờ mở cửa</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRestaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRestaurants.includes(restaurant.id)}
                      onChange={() => handleSelectRestaurant(restaurant.id)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {restaurant.images && restaurant.images.length > 0 ? (
                        <img 
                          src={restaurant.images[0]} 
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{restaurant.name}</p>
                      <p className="text-sm text-gray-500">{restaurant.city}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{restaurant.cuisineType}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {styleOptions.find(s => s.value === restaurant.style)?.label || restaurant.style}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      priceRangeOptions.find(p => p.value === restaurant.priceRange)?.color
                    }`}>
                      {priceRangeLabels[restaurant.priceRange]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {restaurant.openingHours}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(restaurant.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        restaurant.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {restaurant.isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Tắt
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetails(restaurant)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(restaurant)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRestaurants.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRestaurants.length)} của {filteredRestaurants.length} nhà hàng
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page 
                        ? 'bg-orange-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có nhà hàng nào</p>
          <button
            onClick={handleAddNew}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Thêm nhà hàng đầu tiên
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <RestaurantFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          restaurant={formData}
          mode={formMode}
        />
      )}
    </div>
  );
}

// ============ Sub-Components ============

function RestaurantInfoTab({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">Tên nhà hàng</label>
            <p className="font-medium">{restaurant.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Mô tả</label>
            <p className="text-gray-700">{restaurant.description || 'Chưa có mô tả'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Loại ẩm thực</label>
            <p className="font-medium">{restaurant.cuisineType}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phong cách</label>
            <p className="font-medium">{styleOptions.find(s => s.value === restaurant.style)?.label}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Mức giá</label>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              priceRangeOptions.find(p => p.value === restaurant.priceRange)?.color
            }`}>
              {priceRangeLabels[restaurant.priceRange]}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">Địa chỉ</label>
            <p className="font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {restaurant.address}, {restaurant.city}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Số điện thoại</label>
            <p className="font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {restaurant.contactPhone || 'Chưa cập nhật'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Giờ mở cửa</label>
            <p className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {restaurant.openingHours}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Đánh giá</label>
            <p className="font-medium flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} đánh giá)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuManagementTab({ menuItems, onUpdate }: { menuItems: MenuItem[]; onUpdate: (menu: MenuItem[]) => void }) {
  const [menu, setMenu] = useState<MenuItem[]>(menuItems);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Món chính',
    isAvailable: true,
  });

  useEffect(() => {
    setMenu(menuItems);
  }, [menuItems]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: `menu-${Date.now()}`,
      name: newItem.name,
      description: newItem.description || '',
      price: newItem.price,
      category: newItem.category || 'Món chính',
      isAvailable: newItem.isAvailable ?? true,
    };
    const updatedMenu = [...menu, item];
    setMenu(updatedMenu);
    onUpdate(updatedMenu);
    setIsAddingItem(false);
    setNewItem({ name: '', description: '', price: 0, category: 'Món chính', isAvailable: true });
  };

  const handleDeleteItem = (id: string) => {
    const updatedMenu = menu.filter(item => item.id !== id);
    setMenu(updatedMenu);
    onUpdate(updatedMenu);
  };

  const handleToggleAvailability = (id: string) => {
    const updatedMenu = menu.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setMenu(updatedMenu);
    onUpdate(updatedMenu);
  };

  const categories = [...new Set(menu.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Quản lý thực đơn</h3>
        <button
          onClick={() => setIsAddingItem(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" />
          Thêm món
        </button>
      </div>

      {isAddingItem && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium">Thêm món mới</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tên món"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            />
            <input
              type="number"
              placeholder="Giá (VNĐ)"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="Món khai vị">Món khai vị</option>
              <option value="Món chính">Món chính</option>
              <option value="Món tráng miệng">Món tráng miệng</option>
              <option value="Đồ uống">Đồ uống</option>
            </select>
            <input
              type="text"
              placeholder="Mô tả"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Thêm
            </button>
            <button
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h4 className="font-medium text-gray-700">{category}</h4>
          <div className="space-y-2">
            {menu.filter(item => item.category === category).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-orange-500 font-medium">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.isAvailable ? 'Còn' : 'Hết'}
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {menu.length === 0 && !isAddingItem && (
        <div className="text-center py-8 text-gray-500">
          Chưa có món nào trong thực đơn
        </div>
      )}
    </div>
  );
}

function GalleryManagementTab({ images, onUpdate }: { images: string[]; onUpdate: (images: string[]) => void }) {
  const [galleryImages, setGalleryImages] = useState<string[]>(images);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    setGalleryImages(images);
  }, [images]);

  const handleAddImage = () => {
    if (!newImageUrl) return;
    const updatedImages = [...galleryImages, newImageUrl];
    setGalleryImages(updatedImages);
    onUpdate(updatedImages);
    setNewImageUrl('');
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
    onUpdate(updatedImages);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Quản lý hình ảnh</h3>
      
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Nhập URL hình ảnh..."
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
        />
        <button
          onClick={handleAddImage}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Thêm
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {galleryImages.map((img, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleDeleteImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {galleryImages.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Chưa có hình ảnh nào
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewsTab({ reviews, onReply }: { reviews: RestaurantReview[]; onReply: (reviewId: string, response: string) => void }) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    onReply(reviewId, replyText);
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Đánh giá từ khách hàng</h3>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có đánh giá nào
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              
              {review.response && (
                <div className="mt-3 pl-4 border-l-2 border-orange-200">
                  <p className="text-sm text-gray-500">Phản hồi:</p>
                  <p className="text-gray-700">{review.response.content}</p>
                </div>
              )}
              
              {!review.response && replyingTo !== review.id && (
                <button
                  onClick={() => setReplyingTo(review.id)}
                  className="mt-3 text-sm text-orange-500 hover:text-orange-600"
                >
                  Phản hồi
                </button>
              )}
              
              {replyingTo === review.id && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập phản hồi..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitReply(review.id)}
                      className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600"
                    >
                      Gửi
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(''); }}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingsTab({ bookings, onUpdateStatus }: { bookings: RestaurantBooking[]; onUpdateStatus: (bookingId: string, status: RestaurantBooking['status']) => void }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Quản lý đặt bàn</h3>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có đặt bàn nào
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{booking.customerName}</p>
                  <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                  <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                  {booking.status === 'pending' ? 'Chờ xác nhận' :
                   booking.status === 'confirmed' ? 'Đã xác nhận' :
                   booking.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {booking.bookingTime}
                </span>
                <span className="flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  {booking.numberOfGuests} người
                </span>
              </div>
              {booking.specialRequests && (
                <p className="mt-2 text-sm text-gray-500">
                  Yêu cầu đặc biệt: {booking.specialRequests}
                </p>
              )}
              {booking.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RestaurantFormModal({
  isOpen,
  onClose,
  onSubmit,
  restaurant,
  mode
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Restaurant>) => void;
  restaurant: Partial<Restaurant>;
  mode: 'add' | 'edit';
}) {
  const [formData, setFormData] = useState<Partial<Restaurant>>(restaurant);

  useEffect(() => {
    setFormData(restaurant);
  }, [restaurant]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {mode === 'add' ? 'Thêm nhà hàng mới' : 'Chỉnh sửa nhà hàng'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhà hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại ẩm thực
              </label>
              <select
                value={formData.cuisineType || 'Việt Nam'}
                onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phong cách
              </label>
              <select
                value={formData.style || 'restaurant'}
                onChange={(e) => setFormData({ ...formData, style: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {styleOptions.map(style => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mức giá
              </label>
              <select
                value={formData.priceRange || 'medium'}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="budget">Bình dân</option>
                <option value="medium">Trung cấp</option>
                <option value="high">Cao cấp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giờ mở cửa
            </label>
            <input
              type="text"
              placeholder="VD: 07:00 - 22:00"
              value={formData.openingHours || ''}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Hoạt động
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {mode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
