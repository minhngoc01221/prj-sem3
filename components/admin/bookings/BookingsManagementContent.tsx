"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Download,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';
import type { Booking } from '@/types/admin';
import { BookingDetailModal } from './BookingDetailModal';
import { DeleteConfirmModal } from '../promotions/DeleteConfirmModal';

interface BookingsManagementContentProps {
  bookings: Booking[];
  isLoading: boolean;
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const paymentLabels: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền'
};

const paymentColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  refunded: 'bg-purple-100 text-purple-700'
};

export function BookingsManagementContent({ bookings: initialBookings, isLoading }: BookingsManagementContentProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    setBookings(initialBookings || []);
  }, [initialBookings]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;
    
    let matchesDate = true;
    if (dateFrom && booking.bookingDate) {
      matchesDate = new Date(booking.bookingDate) >= new Date(dateFrom);
    }
    if (dateTo && booking.bookingDate) {
      matchesDate = matchesDate && new Date(booking.bookingDate) <= new Date(dateTo + 'T23:59:59');
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async (id: string, newStatus: Booking['status']) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      
      if (result.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        showToast('success', `Đơn hàng đã chuyển sang "${statusLabels[newStatus]}"`);
      } else {
        showToast('error', result.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('error', 'Đã xảy ra lỗi.');
    }
  };

  const handleDelete = async () => {
    if (!deletingBooking) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/bookings/${deletingBooking.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setBookings(prev => prev.filter(b => b.id !== deletingBooking.id));
        showToast('success', 'Xóa đơn hàng thành công!');
      } else {
        showToast('error', result.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      showToast('error', 'Đã xảy ra lỗi.');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingBooking(null);
    }
  };

  // Export CSV (F199)
  const handleExportCSV = () => {
    const headers = ['Mã đơn', 'Tên khách', 'Email', 'SĐT', 'Dịch vụ', 'Tên', 'Ngày đặt', 'Ngày khởi hành', 'Số khách', 'Tổng tiền', 'Thanh toán', 'Trạng thái'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.userName || '',
      b.userEmail || '',
      b.userPhone || '',
      b.type || '',
      b.itemName || '',
      b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('vi-VN') : '',
      b.travelDate ? new Date(b.travelDate).toLocaleDateString('vi-VN') : '',
      b.guests || '',
      b.totalPrice || 0,
      paymentLabels[b.paymentStatus] || b.paymentStatus,
      statusLabels[b.status] || b.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-don-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Xuất file Excel thành công!');
  };

  const openDeleteModal = (booking: Booking) => {
    setDeletingBooking(booking);
    setIsDeleteModalOpen(true);
  };

  // Calculate stats
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn đặt</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả đơn đặt tour và dịch vụ</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Xuất Excel
        </button>
      </div>

      {/* Stats (F200) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng đơn đặt</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters (F191-F193) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Từ ngày"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Đến ngày"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả thanh toán</option>
            <option value="unpaid">Chưa thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Mã đơn</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Khách hàng</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Dịch vụ</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Ngày đặt</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Ngày khởi hành</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Số người</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tổng tiền</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thanh toán</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {booking.id?.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{booking.userName}</p>
                      <p className="text-sm text-gray-500">{booking.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{booking.itemName}</p>
                      <p className="text-sm text-gray-500 capitalize">{booking.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      {booking.guests || 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[booking.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {paymentLabels[booking.paymentStatus] || booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(booking)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Xác nhận"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Hoàn thành"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hủy đơn"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(booking)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} của {filteredBookings.length} đơn
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
        onStatusChange={handleUpdateStatus}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa đơn đặt"
        message="Bạn có chắc chắn muốn xóa đơn đặt này? Hành động này không thể hoàn tác."
        itemName={deletingBooking?.userName}
      />
    </div>
  );
}
