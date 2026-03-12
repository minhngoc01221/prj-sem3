"use client";

import { X, User, Mail, Phone, Calendar, MapPin, Clock, Check, Package, FileText, CreditCard } from 'lucide-react';
import type { Booking } from '@/types/admin';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusChange: (id: string, status: Booking['status']) => void;
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

export function BookingDetailModal({ isOpen, onClose, booking, onStatusChange }: BookingDetailModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Chi tiết đơn đặt
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Mã đơn: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{booking.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Trạng thái đơn</p>
              <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                {statusLabels[booking.status] || booking.status}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Thanh toán</p>
              <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
                booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                booking.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-700' :
                'bg-red-100 text-red-700'
              }`}>
                {paymentLabels[booking.paymentStatus] || booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Họ tên</p>
                <p className="font-medium text-gray-900">{booking.userName}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <a href={`mailto:${booking.userEmail}`} className="font-medium text-blue-600 hover:underline">{booking.userEmail}</a>
              </div>
              <div>
                <p className="text-gray-500">Số điện thoại</p>
                <a href={`tel:${booking.userPhone}`} className="font-medium text-gray-900 hover:underline">{booking.userPhone || '-'}</a>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Thông tin đơn đặt
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Loại dịch vụ</p>
                <p className="font-medium text-gray-900 capitalize">{booking.type}</p>
              </div>
              <div>
                <p className="text-gray-500">Tên dịch vụ</p>
                <p className="font-medium text-gray-900">{booking.itemName || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày đặt</p>
                <p className="font-medium text-gray-900">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày khởi hành</p>
                <p className="font-medium text-gray-900">{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('vi-VN') : '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Số khách</p>
                <p className="font-medium text-gray-900">{booking.guests || 1}</p>
              </div>
              <div>
                <p className="text-gray-500">Tổng tiền</p>
                <p className="font-medium text-gray-900 text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Ghi chú
              </h3>
              <p className="text-sm text-gray-600">{booking.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-100 pt-4 flex gap-2">
            {booking.status === 'pending' && (
              <button
                onClick={() => onStatusChange(booking.id, 'confirmed')}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Xác nhận đơn
              </button>
            )}
            {booking.status === 'confirmed' && (
              <button
                onClick={() => onStatusChange(booking.id, 'completed')}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Đánh dấu hoàn thành
              </button>
            )}
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <button
                onClick={() => onStatusChange(booking.id, 'cancelled')}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Hủy đơn
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
