"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Percent,
  Home,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type { Promotion } from '@/types/admin';
import { PromotionFormModal } from './PromotionFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface PromotionsManagementContentProps {
  promotions: Promotion[];
  isLoading: boolean;
}

interface PromotionFormData {
  promoCode: string;
  name: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  targetType: string;
  targetId: string;
  isShowHome: boolean;
}

const statusLabels: Record<string, string> = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  expired: 'Hết hạn',
  scheduled: 'Sắp diễn ra'
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  expired: 'bg-red-100 text-red-700',
  scheduled: 'bg-blue-100 text-blue-700'
};

const targetTypeLabels: Record<string, string> = {
  Tour: 'Tour du lịch',
  Hotel: 'Khách sạn',
  null: 'Tất cả'
};

export function PromotionsManagementContent({ promotions: initialPromotions, isLoading }: PromotionsManagementContentProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setPromotions(initialPromotions || []);
  }, [initialPromotions]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-update expired status (F210)
  const getStatusWithExpiration = (promo: Promotion): string => {
    const now = new Date();
    const endDate = new Date(promo.endDate);
    const startDate = new Date(promo.startDate);
    
    if (now > endDate) return 'expired';
    if (now < startDate) return 'scheduled';
    return promo.status || 'active';
  };

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.promoCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const currentStatus = getStatusWithExpiration(promo);
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setModalMode('add');
    setIsFormModalOpen(true);
  };

  const handleEditPromotion = (promo: Promotion) => {
    setEditingPromotion(promo);
    setModalMode('edit');
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: PromotionFormData) => {
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      if (modalMode === 'add') {
        const response = await fetch(`${baseUrl}/api/admin/promotions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        
        if (result.success) {
          setPromotions(prev => [result.data, ...prev]);
          showToast('success', 'Thêm khuyến mãi thành công!');
        } else {
          showToast('error', result.message || 'Thêm thất bại');
        }
      } else if (editingPromotion) {
        const response = await fetch(`${baseUrl}/api/admin/promotions/${editingPromotion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        
        if (result.success) {
          setPromotions(prev => prev.map(p => p.id === editingPromotion.id ? result.data : p));
          showToast('success', 'Cập nhật khuyến mãi thành công!');
        } else {
          showToast('error', result.message || 'Cập nhật thất bại');
        }
      }
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error submitting promotion:', error);
      showToast('error', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePromotion = async () => {
    if (!deletingPromotion) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/promotions/${deletingPromotion.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        setPromotions(prev => prev.filter(p => p.id !== deletingPromotion.id));
        showToast('success', 'Xóa khuyến mãi thành công!');
      } else {
        showToast('error', result.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      showToast('error', 'Đã xảy ra lỗi.');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingPromotion(null);
    }
  };

  const handleToggleStatus = async (promo: Promotion) => {
    const newStatus = promo.status === 'active' ? 'inactive' : 'active';
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/promotions/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      
      if (result.success) {
        setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, status: newStatus } : p));
        showToast('success', newStatus === 'active' ? 'Đã kích hoạt!' : 'Đã vô hiệu hóa!');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('error', 'Đã xảy ra lỗi.');
    }
  };

  const handleToggleShowHome = async (promo: Promotion) => {
    const newShowHome = !promo.isShowHome;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/promotions/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isShowHome: newShowHome }),
      });
      const result = await response.json();
      
      if (result.success) {
        setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, isShowHome: newShowHome } : p));
        showToast('success', newShowHome ? 'Đã hiển thị trang chủ!' : 'Đã ẩn khỏi trang chủ!');
      }
    } catch (error) {
      console.error('Error toggling show home:', error);
      showToast('error', 'Đã xảy ra lỗi.');
    }
  };

  const openDeleteModal = (promo: Promotion) => {
    setDeletingPromotion(promo);
    setIsDeleteModalOpen(true);
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

  // Calculate stats
  const activeCount = promotions.filter(p => getStatusWithExpiration(p) === 'active').length;
  const showHomeCount = promotions.filter(p => p.isShowHome).length;
  const expiredCount = promotions.filter(p => getStatusWithExpiration(p) === 'expired').length;
  const maxDiscount = promotions.length > 0 
    ? Math.max(...promotions.map(p => p.discountPercent || 0)) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả khuyến mãi và giảm giá</p>
        </div>
        <button 
          onClick={handleAddPromotion}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm khuyến mãi
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng khuyến mãi</p>
              <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hiển thị trang chủ</p>
              <p className="text-2xl font-bold text-gray-900">{showHomeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Percent className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Giảm giá cao nhất</p>
              <p className="text-2xl font-bold text-gray-900">{maxDiscount}%</p>
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
              placeholder="Tìm kiếm khuyến mãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="expired">Hết hạn</option>
            <option value="scheduled">Sắp diễn ra</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Mã & Tên</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Giảm giá</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Áp dụng cho</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Ngày</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trang chủ</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPromotions.map((promo) => {
                const currentStatus = getStatusWithExpiration(promo);
                return (
                  <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        {promo.promoCode && (
                          <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded mb-1">
                            {promo.promoCode}
                          </span>
                        )}
                        <p className="font-medium text-gray-900">{promo.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-orange-600">
                        {promo.discountPercent}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        promo.targetType === 'Tour' ? 'bg-blue-100 text-blue-700' :
                        promo.targetType === 'Hotel' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {targetTypeLabels[promo.targetType || 'null'] || 'Tất cả'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(promo.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">→</span>
                        {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleShowHome(promo)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          promo.isShowHome 
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {promo.isShowHome ? (
                          <>
                            <Home className="w-3.5 h-3.5" />
                            Hiển thị
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Ẩn
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(promo)}
                        disabled={currentStatus === 'expired'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          currentStatus === 'active' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : currentStatus === 'expired'
                            ? 'bg-red-100 text-red-700 cursor-not-allowed'
                            : currentStatus === 'scheduled'
                            ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {currentStatus === 'active' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Hoạt động
                          </>
                        ) : currentStatus === 'expired' ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Hết hạn
                          </>
                        ) : currentStatus === 'scheduled' ? (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            Sắp diễn ra
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
                          onClick={() => handleEditPromotion(promo)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(promo)}
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
        {filteredPromotions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredPromotions.length)} của {filteredPromotions.length} khuyến mãi
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

      {/* Form Modal */}
      <PromotionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        promotion={editingPromotion}
        mode={modalMode}
        isSubmitting={isSubmitting}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePromotion}
        title="Xóa khuyến mãi"
        message="Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác."
        itemName={deletingPromotion?.name}
      />
    </div>
  );
}
