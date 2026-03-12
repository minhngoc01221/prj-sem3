"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Bus, 
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
  Route
} from 'lucide-react';
import type { Vehicle } from '@/types/admin';

interface VehiclesManagementContentProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

const vehicleTypeLabels = {
  bus: 'Xe khách',
  limousine: 'Limousine',
  airplane: 'Máy bay',
  train: 'Tàu hỏa',
  car: 'Thuê xe'
};

export function VehiclesManagementContent({ vehicles: initialVehicles, isLoading }: VehiclesManagementContentProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const itemsPerPage = 10;

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedVehicles.length === paginatedVehicles.length) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(paginatedVehicles.map(v => v.id));
    }
  };

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicles(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleActive = (id: string) => {
    setVehicles(prev => prev.map(v => 
      v.id === id ? { ...v, isActive: !v.isActive } : v
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phương tiện</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả phương tiện vận chuyển trong hệ thống</p>
        </div>
        <Link 
          href="/admin/vehicles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm phương tiện
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng phương tiện</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
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
                {vehicles.filter(v => v.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Bus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Xe khách</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.type === 'bus').length}
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
              <p className="text-sm text-gray-500">Limousine</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.type === 'limousine').length}
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
              placeholder="Tìm kiếm phương tiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả loại phương tiện</option>
            <option value="bus">Xe khách</option>
            <option value="limousine">Limousine</option>
            <option value="airplane">Máy bay</option>
            <option value="train">Tàu hỏa</option>
            <option value="car">Thuê xe</option>
          </select>
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
                    checked={selectedVehicles.length === paginatedVehicles.length && paginatedVehicles.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hình ảnh</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tên phương tiện</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Loại</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Nhà cung cấp</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tuyến đường</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Giá vé</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={() => handleSelectVehicle(vehicle.id)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img 
                          src={vehicle.images[0]} 
                          alt={vehicle.name}
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
                      <p className="font-medium text-gray-900">{vehicle.name}</p>
                      <p className="text-sm text-gray-500">{vehicle.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {vehicleTypeLabels[vehicle.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.provider}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Route className="w-4 h-4" />
                      {vehicle.departure} → {vehicle.arrival}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vehicle.price)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(vehicle.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        vehicle.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {vehicle.isActive ? (
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
                        href={`/admin/vehicles/${vehicle.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/vehicles/${vehicle.id}/edit`}
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
        {filteredVehicles.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} của {filteredVehicles.length} phương tiện
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
