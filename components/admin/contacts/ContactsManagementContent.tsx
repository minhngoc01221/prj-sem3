"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  Search, 
  Edit2, 
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
  Filter,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Contact } from '@/types/admin';

interface ContactsManagementContentProps {
  contacts: Contact[];
  isLoading: boolean;
}

export function ContactsManagementContent({ contacts: initialContacts, isLoading }: ContactsManagementContentProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && contact.isRead) || 
      (statusFilter === 'unread' && !contact.isRead);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleRead = (id: string) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, isRead: !c.isRead } : c
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý liên hệ</h1>
          <p className="text-gray-500 mt-1">Quản lý tin nhắn liên hệ từ khách hàng</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          <Download className="w-5 h-5" />
          Xuất danh sách
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
              <p className="text-2xl font-bold text-gray-900">
                {contacts.filter(c => !c.isRead).length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {contacts.filter(c => c.isRead).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đánh giá</p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.filter(c => c.rating).length}
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
              placeholder="Tìm kiếm liên hệ..."
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
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Đánh giá</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedContacts.map((contact) => (
                <tr key={contact.id} className={`hover:bg-gray-50 transition-colors ${!contact.isRead ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
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
                    <p className="font-medium text-gray-900">{contact.subject}</p>
                    {contact.service && (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {contact.service}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 line-clamp-2 max-w-[250px]">{contact.message}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {contact.rating ? (
                      <div className="flex items-center gap-1">
                        {[...Array(contact.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleRead(contact.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        contact.isRead 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {contact.isRead ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đã đọc
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" />
                          Chưa đọc
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/contacts/${contact.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Trả lời"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
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
        {filteredContacts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredContacts.length)} của {filteredContacts.length} liên hệ
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
