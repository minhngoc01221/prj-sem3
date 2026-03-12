"use client";

import { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  AlertCircle,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  GripVertical
} from 'lucide-react';
import type { TourPackage } from '@/types/admin';

interface TourFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TourPackage>) => void;
  tour?: TourPackage | null;
  mode: 'add' | 'edit';
}

export function TourFormModal({ isOpen, onClose, onSubmit, tour, mode }: TourFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<TourPackage>>({
    name: '',
    description: '',
    duration: '',
    destinations: [],
    price: 0,
    discount: 0,
    itinerary: [],
    includes: [],
    images: [],
    isActive: true,
  });

  const [newDestination, setNewDestination] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newItineraryDay, setNewItineraryDay] = useState({ day: 1, title: '', description: '' });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && tour) {
        setFormData({
          name: tour.name || '',
          description: tour.description || '',
          duration: tour.duration || '',
          destinations: tour.destinations || [],
          price: tour.price || 0,
          discount: tour.discount || 0,
          itinerary: tour.itinerary || [],
          includes: tour.includes || [],
          images: tour.images || [],
          isActive: tour.isActive ?? true,
        });
        setImages(tour.images || []);
      } else {
        setFormData({
          name: '',
          description: '',
          duration: '',
          destinations: [],
          price: 0,
          discount: 0,
          itinerary: [],
          includes: [],
          images: [],
          isActive: true,
        });
        setImages([]);
      }
      setErrors({});
      setNewDestination('');
      setNewInclude('');
      setNewItineraryDay({ day: 1, title: '', description: '' });
    }
  }, [isOpen, mode, tour]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
      setFormData(prev => ({ ...prev, images: [...prev.images || [], ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addDestination = () => {
    if (newDestination.trim()) {
      const newDestinations = [...(formData.destinations || []), newDestination.trim()];
      setFormData(prev => ({ ...prev, destinations: newDestinations }));
      setNewDestination('');
    }
  };

  const removeDestination = (index: number) => {
    const newDestinations = (formData.destinations || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, destinations: newDestinations }));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      const newIncludes = [...(formData.includes || []), newInclude.trim()];
      setFormData(prev => ({ ...prev, includes: newIncludes }));
      setNewInclude('');
    }
  };

  const removeInclude = (index: number) => {
    const newIncludes = (formData.includes || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, includes: newIncludes }));
  };

  const addItineraryDay = () => {
    if (newItineraryDay.title.trim() && newItineraryDay.description.trim()) {
      const newItinerary = [...(formData.itinerary || []), { 
        day: newItineraryDay.day,
        title: newItineraryDay.title,
        description: newItineraryDay.description,
        activities: [],
        meals: []
      }];
      setFormData(prev => ({ ...prev, itinerary: newItinerary as any }));
      setNewItineraryDay({ day: (formData.itinerary?.length || 0) + 2, title: '', description: '' });
    }
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = (formData.itinerary || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, itinerary: newItinerary as any }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Tên tour là bắt buộc';
    if (!formData.description?.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.duration?.trim()) newErrors.duration = 'Thời gian là bắt buộc';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (!formData.destinations || formData.destinations.length === 0) newErrors.destinations = 'Ít nhất một điểm đến';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Sửa tour' : 'Thêm tour mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tour <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="VD: Tour Hà Nội - Sa Pa 3 ngày 2 đêm"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Mô tả chi tiết về tour..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.duration ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="VD: 3 ngày 2 đêm"
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  value={formData.discount || 0}
                  onChange={e => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Tạm dừng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Điểm đến</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thêm điểm đến <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDestination}
                  onChange={e => setNewDestination(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addDestination())}
                  className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.destinations ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="VD: Hà Nội, Sa Pa, Lào Cai"
                />
                <button
                  type="button"
                  onClick={addDestination}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {errors.destinations && <p className="text-red-500 text-sm mt-1">{errors.destinations}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.destinations?.map((dest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full"
                >
                  <MapPin className="w-4 h-4" />
                  {dest}
                  <button
                    type="button"
                    onClick={() => removeDestination(index)}
                    className="ml-1 hover:text-orange-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Bao gồm</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thêm dịch vụ
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInclude}
                  onChange={e => setNewInclude(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="VD: Xe khứ hồi, Khách sạn 3 sao, Bữa ăn"
                />
                <button
                  type="button"
                  onClick={addInclude}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.includes?.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full"
                >
                  <Check className="w-4 h-4" />
                  {item}
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="ml-1 hover:text-green-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hình ảnh</h3>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Click để tải lên hình ảnh</p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
