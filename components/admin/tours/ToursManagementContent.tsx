"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plane, 
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
  Users,
  DollarSign
} from 'lucide-react';
import type { TourPackage } from '@/types/admin';
import { TourFormModal } from './TourFormModal';

interface ToursManagementContentProps {
  tours: TourPackage[];
  isLoading: boolean;
}

export function ToursManagementContent({ tours: initialTours, isLoading }: ToursManagementContentProps) {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const itemsPerPage = 10;

  useEffect(() => {
    setTours(initialTours || []);
  }, [initialTours]);

  const getTourId = (tour: TourPackage, index: number): string => {
    return tour.id || `tour-${index}`;
  };

  const handleAddTour = () => {
    setEditingTour(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditTour = (tour: TourPackage) => {
    setEditingTour(tour);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSubmitTour = async (data: Partial<TourPackage>) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      if (modalMode === 'add') {
        const response = await fetch(`${baseUrl}/api/admin/tours`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          setTours(prev => [result.data, ...prev]);
        }
      } else if (editingTour) {
        const response = await fetch(`${baseUrl}/api/admin/tours/${editingTour.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          setTours(prev => prev.map(t => t.id === editingTour.id ? result.data : t));
        }
      }
    } catch (error) {
      console.error('Error submitting tour:', error);
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tour này?')) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/tours/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setTours(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const filteredTours = tours.filter(tour => {
    if (!tour.name) return false;
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.destinations && tour.destinations.join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedTours.length === paginatedTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(paginatedTours.map(t => getTourId(t, 0)));
    }
  };

  const handleSelectTour = (id: string) => {
    setSelectedTours(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleActive = (id: string) => {
    setTours(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tour</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả gói tour trong hệ thống</p>
        </div>
        <button 
          onClick={handleAddTour}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm tour
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng tour</p>
              <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
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
                {tours.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng lượt đặt</p>
              <p className="text-2xl font-bold text-gray-900">
                {tours.reduce((acc, t) => acc + (t.bookingCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(
                  tours.reduce((acc, t) => acc + (t.price || 0), 0) / (tours.length || 1)
                )}
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
              placeholder="Tìm kiếm tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
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
                    checked={selectedTours.length === paginatedTours.length && paginatedTours.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hình ảnh</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tên tour</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thời gian</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Điểm đến</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Giá</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Lượt đặt</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTours.map((tour, index) => {
                const tourId = getTourId(tour, index);
                return (
                  <tr key={tourId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTours.includes(tourId)}
                        onChange={() => handleSelectTour(tourId)}
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        {tour.images && tour.images.length > 0 ? (
                          <img 
                            src={tour.images[0]} 
                            alt={tour.name}
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
                        <p className="font-medium text-gray-900">{tour.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{tour.duration}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {tour.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="max-w-[150px] truncate">
                        {tour.destinations?.join(', ') || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        {tour.bookingCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(tourId)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          tour.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tour.isActive ? (
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
                          href={`/admin/tours/${tourId}`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEditTour(tour)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tourId)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTours.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTours.length)} của {filteredTours.length} tour
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

      {/* Tour Form Modal */}
      <TourFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTour}
        tour={editingTour}
        mode={modalMode}
      />
    </div>
  );
}
