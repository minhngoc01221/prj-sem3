"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  AlertCircle,
  Building2,
  MapPin,
  FileText,
  DollarSign,
  Star,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import type { Hotel } from '@/types/admin';

interface HotelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Hotel>) => void;
  hotel?: Hotel | null;
  mode: 'add' | 'edit';
}

const amenityOptions = [
  'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service',
  'Parking', 'Airport Shuttle', 'Business Center', 'Private Beach',
  'Kids Club', 'Water Sports', 'Tennis Court', 'Beach Access'
];

const starOptions = [1, 2, 3, 4, 5];

export function HotelFormModal({ isOpen, onClose, onSubmit, hotel, mode }: HotelFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: '',
    description: '',
    address: '',
    city: '',
    starRating: 5,
    priceRange: '',
    amenities: [],
    rating: 0,
    reviewCount: 0,
    isActive: true,
    contactPhone: '',
    contactEmail: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && hotel) {
        setFormData({
          name: hotel.name || '',
          description: hotel.description || '',
          address: hotel.address || '',
          city: hotel.city || '',
          starRating: hotel.starRating || 5,
          priceRange: hotel.priceRange || '',
          amenities: hotel.amenities || [],
          rating: hotel.rating || 0,
          reviewCount: hotel.reviewCount || 0,
          isActive: hotel.isActive ?? true,
          contactPhone: hotel.contactPhone || '',
          contactEmail: hotel.contactEmail || '',
        });
        setImages(hotel.images || []);
        setSelectedAmenities(hotel.amenities || []);
      } else {
        setFormData({
          name: '',
          description: '',
          address: '',
          city: '',
          starRating: 5,
          priceRange: '',
          amenities: [],
          rating: 0,
          reviewCount: 0,
          isActive: true,
          contactPhone: '',
          contactEmail: '',
        });
        setImages([]);
        setSelectedAmenities([]);
      }
      setNewImages([]);
      setErrors({});
    }
  }, [isOpen, mode, hotel]);

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

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên khách sạn là bắt buộc';
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'Thành phố là bắt buộc';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    if (images.length === 0) {
      newErrors.images = 'Vui lòng tải lên ít nhất 1 hình ảnh';
    }
    if (selectedAmenities.length === 0) {
      newErrors.amenities = 'Vui lòng chọn ít nhất 1 tiện nghi';
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
        amenities: selectedAmenities,
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
    setSelectedAmenities([]);
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      starRating: 5,
      priceRange: '',
      amenities: [],
      rating: 0,
      reviewCount: 0,
      isActive: true,
      contactPhone: '',
      contactEmail: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Thêm khách sạn mới' : 'Chỉnh sửa khách sạn'}
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
                  Hình ảnh khách sạn <span className="text-red-500">*</span>
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
                    Tên khách sạn <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nhập tên khách sạn"
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
                    Thành phố <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ví dụ: TP. Hồ Chí Minh"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.city ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nhập địa chỉ chi tiết"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.address ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Star Rating & Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Hạng sao <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <select
                      value={formData.starRating}
                      onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                    >
                      {starOptions.map(star => (
                        <option key={star} value={star}>
                          {star} sao
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Khoảng giá
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      placeholder="Ví dụ: 1.500.000 - 5.000.000 VNĐ"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
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
                    placeholder="Mô tả chi tiết về khách sạn..."
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

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+84 28 3822 8888"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="booking@hotel.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiện nghi <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {amenityOptions.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {selectedAmenities.includes(amenity) && (
                        <Check className="w-3 h-3 inline mr-1" />
                      )}
                      {amenity}
                    </button>
                  ))}
                </div>
                {errors.amenities && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.amenities}
                  </p>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Trạng thái hiển thị</p>
                  <p className="text-sm text-gray-500">Cho phép hiển thị khách sạn này</p>
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
