"use client";

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Search, 
  Trash2, 
  Eye, 
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Star,
  Download,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
  Reply,
  FileSpreadsheet
} from 'lucide-react';
import type { Contact } from '@/types/admin';
import { ContactDetailModal } from './ContactDetailModal';
import { DeleteConfirmModal } from '../promotions/DeleteConfirmModal';

interface ContactsManagementContentProps {
  contacts: Contact[];
  isLoading: boolean;
}

const statusLabels: Record<string, string> = {
  unread: 'Chưa đọc',
  read: 'Đã đọc',
  replied: 'Đã phản hồi'
};

const statusColors: Record<string, string> = {
  unread: 'bg-red-100 text-red-700',
  read: 'bg-green-100 text-green-700',
  replied: 'bg-blue-100 text-blue-700'
};

export function ContactsManagementContent({ contacts: initialContacts, isLoading }: ContactsManagementContentProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    setContacts(initialContacts || []);
  }, [initialContacts]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = async (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
    
    // Auto-mark as read (F213)
    if (contact.status === 'unread') {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/admin/contacts/${contact.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' }),
        });
        setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'read' } : c));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingContact) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/contacts/${deletingContact.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setContacts(prev => prev.filter(c => c.id !== deletingContact.id));
        showToast('success', 'Xóa tin nhắn thành công!');
      } else {
        showToast('error', result.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('error', 'Đã xảy ra lỗi.');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingContact(null);
    }
  };

  const handleReplySuccess = (contactId: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: 'replied' } : c));
    showToast('success', 'Gửi phản hồi thành công!');
    setIsDetailModalOpen(false);
  };

  // Export to CSV (F218)
  const handleExportCSV = () => {
    const headers = ['STT', 'Họ tên', 'Email', 'SĐT', 'Tiêu đề', 'Nội dung', 'Ngày gửi', 'Trạng thái'];
    const rows = filteredContacts.map((c, index) => [
      index + 1,
      c.fullName,
      c.email,
      c.phone || '',
      c.title || '',
      c.message.replace(/"/g, '""'),
      new Date(c.createdAt).toLocaleString('vi-VN'),
      statusLabels[c.status] || c.status
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
    link.download = `danh-sach-lien-he-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Xuất file Excel thành công!');
  };

  const openDeleteModal = (contact: Contact) => {
    setDeletingContact(contact);
    setIsDeleteModalOpen(true);
  };

  // Calculate stats
  const unreadCount = contacts.filter(c => c.status === 'unread').length;
  const readCount = contacts.filter(c => c.status === 'read').length;
  const repliedCount = contacts.filter(c => c.status === 'replied').length;

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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý liên hệ</h1>
          <p className="text-gray-500 mt-1">Quản lý tin nhắn liên hệ từ khách hàng</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Xuất Excel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng tin nhắn</p>
              <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chưa đọc</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã đọc</p>
              <p className="text-2xl font-bold text-gray-900">{readCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Reply className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã phản hồi</p>
              <p className="text-2xl font-bold text-gray-900">{repliedCount}</p>
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
              placeholder="Tìm kiếm theo tên, email..."
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
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
            <option value="replied">Đã phản hồi</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Người gửi</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tiêu đề</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Nội dung</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Ngày gửi</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${contact.status === 'unread' ? 'bg-blue-50/50' : ''}`}
                  onClick={() => handleViewDetail(contact)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        {contact.fullName}
                        {contact.status === 'unread' && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-3.5 h-3.5" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="w-3.5 h-3.5" />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{contact.title || 'Không có tiêu đề'}</p>
                    {contact.serviceType && (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {contact.serviceType}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 line-clamp-2 max-w-[200px]">{contact.message}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${statusColors[contact.status] || 'bg-gray-100 text-gray-700'}`}>
                      {contact.status === 'unread' && <AlertCircle className="w-3.5 h-3.5" />}
                      {contact.status === 'read' && <CheckCircle className="w-3.5 h-3.5" />}
                      {contact.status === 'replied' && <Reply className="w-3.5 h-3.5" />}
                      {statusLabels[contact.status] || contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(contact)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(contact)}
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
        {filteredContacts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredContacts.length)} của {filteredContacts.length}
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
      <ContactDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        contact={selectedContact}
        onReplySuccess={handleReplySuccess}
      />

      {/* Delete Modal (F204) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa tin nhắn"
        message="Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác."
        itemName={deletingContact?.fullName}
      />
    </div>
  );
}
