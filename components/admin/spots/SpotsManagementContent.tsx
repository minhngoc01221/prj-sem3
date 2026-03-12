"use client";

import { useState, useMemo } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Layers
} from 'lucide-react';
import type { TouristSpot } from '@/types/admin';
import { SpotFormModal } from './SpotFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { mockSpots } from './mockData';

interface SpotsManagementContentProps {
  spots?: TouristSpot[];
  isLoading?: boolean;
}

const regionLabels = {
  north: 'Miền Bắc',
  central: 'Miền Trung',
  south: 'Miền Nam'
};

const regionColors = {
  north: 'bg-blue-100 text-blue-700',
  central: 'bg-orange-100 text-orange-700',
  south: 'bg-green-100 text-green-700'
};

const typeLabels = {
  beach: 'Bãi biển',
  mountain: 'Núi',
  historical: 'Di tích',
  waterfall: 'Thác nước',
  other: 'Khác'
};

export function SpotsManagementContent({ spots: initialSpots, isLoading: initialLoading = false }: SpotsManagementContentProps) {
  const [spots, setSpots] = useState<TouristSpot[]>(initialSpots?.length ? initialSpots : mockSpots);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const itemsPerPage = 10;

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.location.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleToggleActive = (id: string) => {
    setSpots(prev => prev.map(spot => 
      spot.id === id ? { ...spot, isActive: !spot.isActive } : spot
    ));
  };

  const handleAddNew = () => {
    setSelectedSpot(null);
    setFormMode('add');
    setIsFormModalOpen(true);
  };

  const handleEdit = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDelete = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<TouristSpot>) => {
    if (formMode === 'add') {
      const newSpot: TouristSpot = {
        ...data as TouristSpot,
        id: String(Date.now()),
        rating: 0,
        reviewCount: 0,
        tourCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSpots(prev => [newSpot, ...prev]);
    } else if (selectedSpot) {
      setSpots(prev => prev.map(spot => 
        spot.id === selectedSpot.id 
          ? { ...spot, ...data, updatedAt: new Date().toISOString() } 
          : spot
      ));
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSpot) {
      setSpots(prev => prev.filter(spot => spot.id !== selectedSpot.id));
      setSelectedSpots(prev => prev.filter(id => id !== selectedSpot.id));
    }
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
              <p className="text-2xl font-bold text-gray-900">{spots.length}</p>
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
                {spots.filter(s => s.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Miền Bắc</p>
              <p className="text-2xl font-bold text-gray-900">
                {spots.filter(s => s.region === 'north').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Miền Trung</p>
              <p className="text-2xl font-bold text-gray-900">
                {spots.filter(s => s.region === 'central').length}
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
              <option value="north">Miền Bắc</option>
              <option value="central">Miền Trung</option>
              <option value="south">Miền Nam</option>
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
              <option value="beach">Bãi biển</option>
              <option value="mountain">Núi</option>
              <option value="historical">Di tích</option>
              <option value="waterfall">Thác nước</option>
              <option value="other">Khác</option>
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
                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 hidden lg:table-cell">Số tour</th>
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
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Layers className="w-4 h-4" />
                      <span className="font-medium">{spot.tourCount}</span>
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

      {/* Modals */}
      <SpotFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        spot={selectedSpot}
        mode={formMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        spot={selectedSpot}
      />
    </div>
  );
}
