"use client";

import { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
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
  Layers,
  Loader2,
  Star,
  Upload
} from 'lucide-react';
import type { TouristSpot } from '@/types/admin';

interface SpotsManagementContentProps {
  spots?: TouristSpot[];
  isLoading?: boolean;
}

const regionLabels: Record<string, string> = {
  north: 'Miền Bắc',
  central: 'Miền Trung',
  south: 'Miền Nam'
};

const regionColors: Record<string, string> = {
  north: 'bg-blue-100 text-blue-700',
  central: 'bg-orange-100 text-orange-700',
  south: 'bg-green-100 text-green-700'
};

const typeLabels: Record<string, string> = {
  beach: 'Bãi biển',
  mountain: 'Núi',
  historical: 'Di tích',
  waterfall: 'Thác nước',
  other: 'Khác'
};

const typeOptions = [
  { value: 'beach', label: 'Bãi biển' },
  { value: 'mountain', label: 'Núi' },
  { value: 'historical', label: 'Di tích' },
  { value: 'waterfall', label: 'Thác nước' },
  { value: 'other', label: 'Khác' },
];

const regionOptions = [
  { value: 'north', label: 'Miền Bắc' },
  { value: 'central', label: 'Miền Trung' },
  { value: 'south', label: 'Miền Nam' },
];

export function SpotsManagementContent({ spots: initialSpots, isLoading: initialLoading = false }: SpotsManagementContentProps) {
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<Partial<TouristSpot>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const itemsPerPage = 10;

  // Fetch spots from API
  const fetchSpots = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/spots?isActive=all`, {
        cache: 'no-store',
      });
      const result = await response.json();
      if (result.success) {
        setSpots(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching spots:', error);
      showToast('error', 'Lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  useEffect(() => {
    if (initialSpots && initialSpots.length > 0) {
      setSpots(initialSpots);
      setIsLoading(initialLoading);
    }
  }, [initialSpots, initialLoading]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      const matchesSearch = 
        spot.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === 'all' || spot.region === regionFilter;
      const matchesType = typeFilter === 'all' || spot.type === typeFilter;
      return matchesSearch && matchesRegion && matchesType;
    });
  }, [spots, searchTerm, regionFilter, typeFilter]);

  const totalPages = Math.ceil(filteredSpots.length / itemsPerPage);
  const paginatedSpots = filteredSpots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedSpots.length === paginatedSpots.length) {
      setSelectedSpots([]);
    } else {
      setSelectedSpots(paginatedSpots.map(spot => spot.id));
    }
  };

  const handleSelectSpot = (id: string) => {
    setSelectedSpots(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleActive = async (id: string) => {
    const spot = spots.find(s => s.id === id);
    if (!spot) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/spots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !spot.isActive }),
      });
      const result = await response.json();
      
      if (result.success) {
        setSpots(prev => prev.map(s => 
          s.id === id ? { ...s, isActive: !s.isActive } : s
        ));
        showToast('success', spot.isActive ? 'Đã vô hiệu hóa' : 'Đã kích hoạt');
      } else {
        showToast('error', result.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      showToast('error', 'Lỗi khi cập nhật');
    }
  };

  // Form handlers
  const handleAddNew = () => {
    setSelectedSpot(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      location: '',
      region: 'north',
      type: 'other',
      images: [],
      bestTime: '',
      ticketPrice: '',
      highlights: [],
      tips: [],
      isActive: true,
    });
    setFormMode('add');
    setIsFormModalOpen(true);
  };

  const handleEdit = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setFormData({
      name: spot.name,
      slug: spot.slug || '',
      description: spot.description,
      location: spot.location,
      region: spot.region,
      type: spot.type,
      images: spot.images || [],
      bestTime: spot.bestTime || '',
      ticketPrice: spot.ticketPrice || '',
      highlights: spot.highlights || [],
      tips: spot.tips || [],
      isActive: spot.isActive,
    });
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDelete = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setIsDeleteModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'spots');

      const response = await fetch(`${baseUrl}/api/admin/settings/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), result.data.url]
        }));
        showToast('success', 'Tải ảnh thành công!');
      } else {
        showToast('error', result.message || 'Tải ảnh thất bại');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('error', 'Lỗi khi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.description || !formData.location) {
      showToast('error', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      if (formMode === 'add') {
        const response = await fetch(`${baseUrl}/api/admin/spots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();

        if (result.success) {
          showToast('success', 'Thêm điểm du lịch thành công!');
          fetchSpots();
          setIsFormModalOpen(false);
        } else {
          showToast('error', result.message || 'Thêm thất bại');
        }
      } else if (selectedSpot) {
        const response = await fetch(`${baseUrl}/api/admin/spots/${selectedSpot.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();

        if (result.success) {
          showToast('success', 'Cập nhật thành công!');
          fetchSpots();
          setIsFormModalOpen(false);
        } else {
          showToast('error', result.message || 'Cập nhật thất bại');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('error', 'Lỗi khi lưu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSpot) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/spots/${selectedSpot.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        setSpots(prev => prev.filter(spot => spot.id !== selectedSpot.id));
        showToast('success', 'Xóa thành công!');
      } else {
        showToast('error', result.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Error deleting spot:', error);
      showToast('error', 'Lỗi khi xóa');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedSpot(null);
    }
  };

  // Stats
  const totalSpots = spots.length;
  const activeSpots = spots.filter(s => s.isActive).length;
  const northCount = spots.filter(s => s.region === 'north').length;
  const centralCount = spots.filter(s => s.region === 'central').length;

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
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý điểm du lịch</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả điểm du lịch trong hệ thống</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm điểm du lịch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng điểm du lịch</p>
              <p className="text-2xl font-bold text-gray-900">{totalSpots}</p>
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
              <p className="text-2xl font-bold text-gray-900">{activeSpots}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Miền Bắc</p>
              <p className="text-2xl font-bold text-gray-900">{northCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Miền Trung</p>
              <p className="text-2xl font-bold text-gray-900">{centralCount}</p>
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
              placeholder="Tìm kiếm điểm du lịch..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[160px]"
            >
              <option value="all">Tất cả vùng miền</option>
              {regionOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[160px]"
            >
              <option value="all">Tất cả loại hình</option>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                <th className="text-left px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedSpots.length === paginatedSpots.length && paginatedSpots.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900">Hình ảnh</th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 min-w-[200px]">Tên điểm du lịch</th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 hidden md:table-cell">Vị trí</th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900">Vùng miền</th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 hidden lg:table-cell">Loại hình</th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 hidden lg:table-cell">Đánh giá</th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSpots.map((spot) => (
                <tr key={spot.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSpots.includes(spot.id)}
                      onChange={() => handleSelectSpot(spot.id)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {spot.images && spot.images.length > 0 ? (
                        <img 
                          src={spot.images[0]} 
                          alt={spot.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{spot.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1 md:hidden">{spot.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 hidden md:table-cell">{spot.location}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${regionColors[spot.region]}`}>
                      {regionLabels[spot.region]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600 hidden lg:table-cell">{typeLabels[spot.type]}</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{spot.rating || 0}</span>
                      <span className="text-gray-400 text-sm">({spot.reviewCount || 0})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleActive(spot.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        spot.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {spot.isActive ? (
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
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(spot)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(spot)}
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

        {/* Empty State */}
        {filteredSpots.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy điểm du lịch</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Pagination */}
        {filteredSpots.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSpots.length)} của {filteredSpots.length} điểm du lịch
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
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
                    className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFormModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {formMode === 'add' ? 'Thêm điểm du lịch mới' : 'Chỉnh sửa điểm du lịch'}
              </h2>
              <button onClick={() => setIsFormModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                <div className="flex flex-wrap gap-2">
                  {formData.images?.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên điểm du lịch *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="VD: Vịnh Hạ Long"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="vịnh-ha-long"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả *</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Mô tả về điểm du lịch..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí *</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Quảng Ninh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vùng miền</label>
                  <select
                    value={formData.region || 'north'}
                    onChange={e => setFormData(prev => ({ ...prev, region: e.target.value as any }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {regionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
                  <select
                    value={formData.type || 'other'}
                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời điểm tốt nhất</label>
                  <input
                    type="text"
                    value={formData.bestTime || ''}
                    onChange={e => setFormData(prev => ({ ...prev, bestTime: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Tháng 4 - Tháng 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá vé</label>
                  <input
                    type="text"
                    value={formData.ticketPrice || ''}
                    onChange={e => setFormData(prev => ({ ...prev, ticketPrice: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="200.000 VNĐ"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive !== false}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Kích hoạt hiển thị</label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {formMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa điểm du lịch <strong>"{selectedSpot.name}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
