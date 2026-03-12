"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  AlertCircle,
  Bus,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Users,
  Route
} from 'lucide-react';
import type { Vehicle } from '@/types/admin';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vehicle>) => void;
  vehicle?: Vehicle | null;
  mode: 'add' | 'edit';
}

const vehicleTypeOptions = [
  { value: 'bus', label: 'Xe khách' },
  { value: 'limousine', label: 'Limousine' },
  { value: 'airplane', label: 'Máy bay' },
  { value: 'train', label: 'Tàu hỏa' },
  { value: 'car', label: 'Thuê xe' },
];

const amenityOptions = [
  'WiFi', 'Điều hòa', 'Nước uống', 'Khăn lạnh', 'TV', 'Ổ cắm điện',
  'Wifi', 'Hỗ trợ khuyết tật', 'Ghế ngồi VIP', 'Giường nằm',
  'Chỗ hành lý', 'Nhà vệ sinh', 'Đèn đọc sách', 'Gối nghỉ'
];

export function VehicleFormModal({ isOpen, onClose, onSubmit, vehicle, mode }: VehicleFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [scheduleTimes, setScheduleTimes] = useState<string[]>([]);
  const [newScheduleTime, setNewScheduleTime] = useState('');

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: '',
    type: 'bus',
    provider: '',
    departure: '',
    arrival: '',
    schedule: [],
    price: 0,
    images: [],
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && vehicle) {
        setFormData({
          name: vehicle.name || '',
          type: vehicle.type || 'bus',
          provider: vehicle.provider || '',
          departure: vehicle.departure || '',
          arrival: vehicle.arrival || '',
          schedule: vehicle.schedule || [],
          price: vehicle.price || 0,
          images: vehicle.images || [],
          isActive: vehicle.isActive ?? true,
        });
        setImages(vehicle.images || []);
        setSelectedAmenities([]);
        setScheduleTimes(vehicle.schedule || []);
      } else {
        setFormData({
          name: '',
          type: 'bus',
          provider: '',
          departure: '',
          arrival: '',
          schedule: [],
          price: 0,
          images: [],
          isActive: true,
        });
        setImages([]);
        setSelectedAmenities([]);
        setScheduleTimes([]);
      }
      setErrors({});
    }
  }, [isOpen, mode, vehicle]);

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
    setImages(prev => [...prev, ...newImageUrls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addScheduleTime = () => {
    if (newScheduleTime && !scheduleTimes.includes(newScheduleTime)) {
      setScheduleTimes(prev => [...prev, newScheduleTime].sort());
      setNewScheduleTime('');
    }
  };

  const removeScheduleTime = (time: string) => {
    setScheduleTimes(prev => prev.filter(t => t !== time));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên phương tiện là bắt buộc';
    }

    if (!formData.type) {
      newErrors.type = 'Loại phương tiện là bắt buộc';
    }

    if (!formData.provider?.trim()) {
      newErrors.provider = 'Nhà cung cấp là bắt buộc';
    }

    if (!formData.departure?.trim()) {
      newErrors.departure = 'Điểm khởi hành là bắt buộc';
    }

    if (!formData.arrival?.trim()) {
      newErrors.arrival = 'Điểm đến là bắt buộc';
    }

    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Giá vé phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: Partial<Vehicle> = {
        ...formData,
        images: images,
        schedule: scheduleTimes,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl m-4">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Thêm phương tiện mới' : 'Chỉnh sửa phương tiện'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh phương tiện
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Kéo thả hình ảnh hoặc click để chọn
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Hỗ trợ JPG, PNG, GIF
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên phương tiện <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Bus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên phương tiện"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại phương tiện <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                {vehicleTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhà cung cấp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="Tên nhà xe/hãng hàng không"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.provider ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.provider && (
                <p className="text-red-500 text-sm mt-1">{errors.provider}</p>
              )}
            </div>
          </div>

          {/* Tuyến đường */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm khởi hành <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Route className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.departure}
                  onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  placeholder="Ví dụ: Hà Nội"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.departure ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.departure && (
                <p className="text-red-500 text-sm mt-1">{errors.departure}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đến <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Route className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-180" />
                <input
                  type="text"
                  value={formData.arrival}
                  onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
                  placeholder="Ví dụ: TP. Hồ Chí Minh"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.arrival ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.arrival && (
                <p className="text-red-500 text-sm mt-1">{errors.arrival}</p>
              )}
            </div>
          </div>

          {/* Giá vé và lịch trình */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá vé (VND) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  placeholder="Nhập giá vé"
                  min="0"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lịch trình (giờ khởi hành)
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={addScheduleTime}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Thêm
                </button>
              </div>
              {scheduleTimes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {scheduleTimes.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                    >
                      <Clock className="w-3 h-3" />
                      {time}
                      <button
                        type="button"
                        onClick={() => removeScheduleTime(time)}
                        className="ml-1 hover:text-orange-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tiện ích */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiện ích đi kèm
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? 'bg-orange-100 border-orange-500 text-orange-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                  }`}
                >
                  {selectedAmenities.includes(amenity) && (
                    <Check className="w-3 h-3 inline mr-1" />
                  )}
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isActive ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">
              {formData.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : mode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
