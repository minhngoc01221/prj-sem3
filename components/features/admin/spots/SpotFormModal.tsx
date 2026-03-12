"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  GripVertical,
  Check,
  AlertCircle,
  MapPin,
  Tag,
  FileText,
  DollarSign,
  Calendar
} from 'lucide-react';
import type { TouristSpot } from '@/types/admin';

interface SpotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TouristSpot>) => void;
  spot?: TouristSpot | null;
  mode: 'add' | 'edit';
}

const regionOptions = [
  { value: 'north', label: 'Miền Bắc' },
  { value: 'central', label: 'Miền Trung' },
  { value: 'south', label: 'Miền Nam' },
];

const typeOptions = [
  { value: 'beach', label: 'Bãi biển' },
  { value: 'mountain', label: 'Núi' },
  { value: 'historical', label: 'Di tích lịch sử' },
  { value: 'waterfall', label: 'Thác nước' },
  { value: 'other', label: 'Khác' },
];

export function SpotFormModal({ isOpen, onClose, onSubmit, spot, mode }: SpotFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<TouristSpot>>({
    name: '',
    description: '',
    location: '',
    region: 'north',
    type: 'beach',
    bestTime: '',
    ticketPrice: '',
    isActive: true,
  });

  // Update form data when spot or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && spot) {
        setFormData({
          name: spot.name || '',
          description: spot.description || '',
          location: spot.location || '',
          region: spot.region || 'north',
          type: spot.type || 'beach',
          bestTime: spot.bestTime || '',
          ticketPrice: spot.ticketPrice || '',
          isActive: spot.isActive ?? true,
        });
        setImages(spot.images || []);
      } else {
        setFormData({
          name: '',
          description: '',
          location: '',
          region: 'north',
          type: 'beach',
          bestTime: '',
          ticketPrice: '',
          isActive: true,
        });
        setImages([]);
      }
      setNewImages([]);
      setErrors({});
    }
  }, [isOpen, mode, spot]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setNewImages(prev => [...prev, ...files]);
    setImages(prev => [...prev, ...newImageUrls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (index < newImages.length) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên điểm du lịch là bắt buộc';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Vị trí là bắt buộc';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    if (images.length === 0) {
      newErrors.images = 'Vui lòng tải lên ít nhất 1 hình ảnh';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        images,
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImages([]);
    setNewImages([]);
    setErrors({});
    setFormData({
      name: '',
      description: '',
      location: '',
      region: 'north',
      type: 'beach',
      bestTime: '',
      ticketPrice: '',
      isActive: true,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Thêm điểm du lịch mới' : 'Chỉnh sửa điểm du lịch'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh điểm du lịch <span className="text-red-500">*</span>
                </label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
                    isDragging 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${errors.images ? 'border-red-300 bg-red-50' : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      isDragging ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <Upload className={`w-6 h-6 ${isDragging ? 'text-orange-600' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium text-orange-600">Click để tải lên</span> hoặc kéo thả vào đây
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF tối đa 10MB mỗi file
                    </p>
                  </div>
                </div>
                
                {errors.images && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.images}
                  </p>
                )}

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded">
                            Ảnh bìa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên điểm du lịch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nhập tên điểm du lịch"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vị trí <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ví dụ: TP. Hạ Long, Quảng Ninh"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.location ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>
              </div>

              {/* Region & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vùng miền
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value as TouristSpot['region'] })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                    >
                      {regionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Loại hình
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as TouristSpot['type'] })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về điểm du lịch..."
                    rows={4}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                      errors.description ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thời điểm tốt nhất
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.bestTime}
                      onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                      placeholder="Ví dụ: Tháng 4 - Tháng 10"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Giá vé (nếu có)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                      placeholder="Ví dụ: 100.000 VNĐ"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Trạng thái hiển thị</p>
                  <p className="text-sm text-gray-500">Cho phép hiển thị điểm du lịch này</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isActive ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {mode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
