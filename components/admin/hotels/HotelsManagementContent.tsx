"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
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
  Star,
  Filter
} from 'lucide-react';
import type { Hotel } from '@/types/admin';

interface HotelsManagementContentProps {
  hotels: Hotel[];
  isLoading: boolean;
}

const starLabels = {
  1: '1 sao',
  2: '2 sao',
  3: '3 sao',
  4: '4 sao',
  5: '5 sao'
};

export function HotelsManagementContent({ hotels: initialHotels, isLoading }: HotelsManagementContentProps) {
  const [hotels, setHotels] = useState(initialHotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const itemsPerPage = 10;

  const cities = [...new Set(hotels.map(h => h.city))];

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || hotel.city === cityFilter;
    const matchesStar = starFilter === 'all' || hotel.starRating === parseInt(starFilter);
    return matchesSearch && matchesCity && matchesStar;
  });

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedHotels.length === paginatedHotels.length) {
      setSelectedHotels([]);
    } else {
      setSelectedHotels(paginatedHotels.map(hotel => hotel.id));
    }
  };

  const handleSelectHotel = (id: string) => {
    setSelectedHotels(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleActive = (id: string) => {
    setHotels(prev => prev.map(hotel => 
      hotel.id === id ? { ...hotel, isActive: !hotel.isActive } : hotel
    ));
  };

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách sạn</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả khách sạn trong hệ thống</p>
        </div>
        <Link 
          href="/admin/hotels/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm khách sạn
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng khách sạn</p>
              <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
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
                {hotels.filter(h => h.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Khách sạn 5 sao</p>
              <p className="text-2xl font-bold text-gray-900">
                {hotels.filter(h => h.starRating === 5).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tỉnh/Thành phố</p>
              <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
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
              placeholder="Tìm kiếm khách sạn..."
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
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất cả hạng sao</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
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
                    checked={selectedHotels.length === paginatedHotels.length && paginatedHotels.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hình ảnh</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tên khách sạn</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Địa chỉ</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hạng sao</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Khoảng giá</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Đánh giá</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedHotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedHotels.includes(hotel.id)}
                      onChange={() => handleSelectHotel(hotel.id)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {hotel.images && hotel.images.length > 0 ? (
                        <img 
                          src={hotel.images[0]} 
                          alt={hotel.name}
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
                      <p className="font-medium text-gray-900">{hotel.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{hotel.city}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{hotel.address}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(hotel.starRating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{hotel.priceRange}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm">({hotel.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(hotel.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        hotel.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {hotel.isActive ? (
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
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/hotels/${hotel.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/hotels/${hotel.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
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
        {filteredHotels.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredHotels.length)} của {filteredHotels.length} khách sạn
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
    </div>
  );
}
