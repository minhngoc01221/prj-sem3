"use client";

import { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Send,
  Loader2,
  User,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Contact } from '@/types/admin';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onReplySuccess: (contactId: string) => void;
}

export function ContactDetailModal({ isOpen, onClose, contact, onReplySuccess }: ContactDetailModalProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReplyContent('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      setError('Vui lòng nhập nội dung phản hồi');
      return;
    }

    if (!contact) return;

    setIsSubmitting(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/contacts/${contact.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          replyMessage: replyContent,
          repliedBy: 'Admin'
        }),
      });
      const result = await response.json();

      if (result.success) {
        onReplySuccess(contact.id);
      } else {
        setError(result.message || 'Gửi phản hồi thất bại');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !contact) return null;

  const isReplied = contact.status === 'replied';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Chi tiết liên hệ
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ngày gửi: {new Date(contact.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Left: Contact Info */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin người gửi
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium text-gray-900">{contact.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${contact.email}`} className="font-medium text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>

                {contact.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <a href={`tel:${contact.phone}`} className="font-medium text-gray-900 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{contact.address}</p>
                    </div>
                  </div>
                )}

                {contact.serviceType && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dịch vụ quan tâm</p>
                      <p className="font-medium text-gray-900">{contact.serviceType}</p>
                    </div>
                  </div>
                )}

                {contact.desiredDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày mong muốn</p>
                      <p className="font-medium text-gray-900">
                        {new Date(contact.desiredDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Message */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Nội dung tin nhắn
              </h3>

              <div className="bg-gray-50 rounded-lg p-4">
                {contact.title && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Tiêu đề</p>
                    <p className="font-semibold text-gray-900">{contact.title}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nội dung</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>

              {/* Reply Section (F214) */}
              {isReplied ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-800">Đã phản hồi</p>
                  </div>
                  {contact.replyMessage && (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {contact.replyMessage}
                    </div>
                  )}
                  {contact.repliedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Phản hồi lúc: {new Date(contact.repliedAt).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Phản hồi khách hàng (F214)
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Nhập nội dung phản hồi..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[150px]"
                  />
                  {error && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </p>
                  )}
                  <button
                    onClick={handleSubmitReply}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi phản hồi
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
