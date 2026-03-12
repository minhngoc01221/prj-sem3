"use client";

import { useState, useEffect } from 'react';
import {
  X,
  Tag,
  Percent,
  Calendar,
  MapPin,
  Search,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { Promotion } from '@/types/admin';

interface TargetOption {
  id: string;
  name: string;
  type: string;
  price?: number;
}

interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromotionFormData) => void;
  promotion: Promotion | null;
  mode: 'add' | 'edit';
  isSubmitting: boolean;
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

export function PromotionFormModal({ isOpen, onClose, onSubmit, promotion, mode, isSubmitting }: PromotionFormModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [targetOptions, setTargetOptions] = useState<TargetOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState<PromotionFormData>({
    promoCode: '',
    name: '',
    description: '',
    discountPercent: 0,
    startDate: '',
    endDate: '',
    targetType: '',
    targetId: '',
    isShowHome: false
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && promotion) {
        setFormData({
          promoCode: promotion.promoCode || '',
          name: promotion.name || '',
          description: promotion.description || '',
          discountPercent: promotion.discountPercent || 0,
          startDate: promotion.startDate ? promotion.startDate.split('T')[0] : '',
          endDate: promotion.endDate ? promotion.endDate.split('T')[0] : '',
          targetType: promotion.targetType || '',
          targetId: promotion.targetId || '',
          isShowHome: promotion.isShowHome || false
        });
      } else {
        setFormData({
          promoCode: '',
          name: '',
          description: '',
          discountPercent: 0,
          startDate: '',
          endDate: '',
          targetType: '',
          targetId: '',
          isShowHome: false
        });
      }
      setErrors({});
      setSearchQuery('');
      setTargetOptions([]);
    }
  }, [isOpen, mode, promotion]);

  // Search for targets (F207)
  useEffect(() => {
    if (!formData.targetType || formData.targetType === '') {
      setTargetOptions([]);
      return;
    }

    const searchTargets = async () => {
      setIsSearching(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(
          `${baseUrl}/api/admin/promotions/targets?type=${formData.targetType}&search=${searchQuery}`,
          { cache: 'no-store' }
        );
        const result = await response.json();
        if (result.success) {
          setTargetOptions(result.data || []);
        }
      } catch (error) {
        console.error('Error searching targets:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchTargets, 300);
    return () => clearTimeout(debounce);
  }, [formData.targetType, searchQuery]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tên khuyến mãi là bắt buộc';
    if (!formData.promoCode.trim()) newErrors.promoCode = 'Mã khuyến mãi là bắt buộc';
    
    if (formData.discountPercent < 0 || formData.discountPercent > 100) {
      newErrors.discountPercent = 'Phần trăm giảm giá phải từ 0-100';
    }
    
    if (!formData.startDate) newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    if (!formData.endDate) newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const selectedTarget = targetOptions.find(t => t.id === formData.targetId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Promo Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã khuyến mãi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.promoCode}
                onChange={e => setFormData(prev => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.promoCode ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="VD: SUMMER2024"
              />
            </div>
            {errors.promoCode && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.promoCode}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên khuyến mãi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="VD: Giảm giá mùa hè 2024"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Mô tả chi tiết khuyến mãi..."
              rows={3}
            />
          </div>

          {/* Discount Percent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phần trăm giảm giá (%) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={e => setFormData(prev => ({ ...prev, discountPercent: parseInt(e.target.value) || 0 }))}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.discountPercent ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="0-100"
              />
            </div>
            {errors.discountPercent && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.discountPercent}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Target Type (Searchable Dropdown - F207) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Áp dụng cho
            </label>
            <select
              value={formData.targetType}
              onChange={e => setFormData(prev => ({ ...prev, targetType: e.target.value, targetId: '' }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tất cả dịch vụ</option>
              <option value="Tour">Tour du lịch</option>
              <option value="Hotel">Khách sạn</option>
            </select>
          </div>

          {/* Target Search (F207) */}
          {formData.targetType && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm {formData.targetType === 'Tour' ? 'Tour' : 'Khách sạn'} cụ thể
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={`Tìm ${formData.targetType === 'Tour' ? 'tour...' : 'khách sạn...'} `}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Searchable Dropdown */}
              {showDropdown && targetOptions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {targetOptions.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, targetId: option.id }));
                        setSearchQuery(option.name);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                        formData.targetId === option.id ? 'bg-orange-50' : ''
                      }`}
                    >
                      <span>{option.name}</span>
                      <span className="text-xs text-gray-500">{option.type}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Clear selection */}
              {formData.targetId && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, targetId: '' }));
                    setSearchQuery('');
                  }}
                  className="text-xs text-orange-500 hover:text-orange-600 mt-1"
                >
                  ✕ Bỏ chọn
                </button>
              )}
            </div>
          )}

          {/* Show on Home (F208) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isShowHome: !prev.isShowHome }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isShowHome ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isShowHome ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className="text-sm text-gray-700">Hiển thị trên trang chủ</span>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
