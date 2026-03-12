"use client";

import { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Bed,
  Users,
  DollarSign,
  Image as ImageIcon,
  AlertCircle,
  Check
} from 'lucide-react';
import type { RoomType } from '@/types/admin';
import { formatPrice } from './mockData';

interface RoomTypeManagementProps {
  roomTypes: RoomType[];
  onUpdate: (roomTypes: RoomType[]) => void;
}

const amenityOptions = [
  'WiFi', 'TV', 'Minibar', 'Safe', 'Air Conditioning', 'Balcony',
  'Ocean View', 'Bay View', 'Garden View', 'City View', 'Private Pool',
  'Jacuzzi', 'Butler Service', 'Room Service'
];

export function RoomTypeManagement({ roomTypes, onUpdate }: RoomTypeManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<RoomType>>({
    name: '',
    description: '',
    basePrice: 0,
    capacity: 2,
    maxCapacity: 3,
    amenities: [],
    images: [],
    totalRooms: 10,
    availableRooms: 10,
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  const openAddModal = () => {
    setEditingRoomType(null);
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      capacity: 2,
      maxCapacity: 3,
      amenities: [],
      images: [],
      totalRooms: 10,
      availableRooms: 10,
    });
    setSelectedAmenities([]);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description,
      basePrice: roomType.basePrice,
      capacity: roomType.capacity,
      maxCapacity: roomType.maxCapacity,
      amenities: roomType.amenities,
      images: roomType.images,
      totalRooms: roomType.totalRooms,
      availableRooms: roomType.availableRooms,
    });
    setSelectedAmenities(roomType.amenities);
    setErrors({});
    setIsModalOpen(true);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên loại phòng là bắt buộc';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      newErrors.basePrice = 'Giá cơ bản phải lớn hơn 0';
    }
    if (!formData.totalRooms || formData.totalRooms <= 0) {
      newErrors.totalRooms = 'Số phòng phải lớn hơn 0';
    }
    if (selectedAmenities.length === 0) {
      newErrors.amenities = 'Vui lòng chọn ít nhất 1 tiện nghi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const roomTypeData: RoomType = {
      id: editingRoomType?.id || `rt-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      basePrice: formData.basePrice || 0,
      capacity: formData.capacity || 2,
      maxCapacity: formData.maxCapacity || 3,
      amenities: selectedAmenities,
      images: formData.images || [],
      totalRooms: formData.totalRooms || 10,
      availableRooms: editingRoomType ? formData.availableRooms || 0 : formData.totalRooms || 10,
      pricing: editingRoomType?.pricing || [],
      availability: editingRoomType?.availability || [],
    };

    if (editingRoomType) {
      onUpdate(roomTypes.map(rt => rt.id === editingRoomType.id ? roomTypeData : rt));
    } else {
      onUpdate([...roomTypes, roomTypeData]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (roomTypeId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      onUpdate(roomTypes.filter(rt => rt.id !== roomTypeId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quản lý loại phòng</h3>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm loại phòng
        </button>
      </div>

      {/* Room Types List */}
      {roomTypes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Bed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có loại phòng nào</p>
          <p className="text-sm text-gray-400">Thêm loại phòng để quản lý giá và tình trạng</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roomTypes.map(roomType => (
            <div
              key={roomType.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {roomType.images && roomType.images.length > 0 ? (
                    <img
                      src={roomType.images[0]}
                      alt={roomType.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{roomType.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{roomType.description}</p>

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3.5 h-3.5" />
                      <span>{roomType.capacity}-{roomType.maxCapacity} người</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-600 font-medium">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{formatPrice(roomType.basePrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      roomType.availableRooms > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {roomType.availableRooms}/{roomType.totalRooms} phòng trống
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => openEditModal(roomType)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(roomType.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mt-3">
                {roomType.amenities.slice(0, 4).map(amenity => (
                  <span
                    key={amenity}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {amenity}
                  </span>
                ))}
                {roomType.amenities.length > 4 && (
                  <span className="px-2 py-0.5 text-gray-400 text-xs">
                    +{roomType.amenities.length - 4} khác
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRoomType ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên loại phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Deluxe King Room"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về loại phòng..."
                    rows={2}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                      errors.description ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Price & Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá cơ bản (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      placeholder="1500000"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.basePrice ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.basePrice && <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tổng số phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value), availableRooms: Number(e.target.value) })}
                      placeholder="10"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.totalRooms ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.totalRooms && <p className="mt-1 text-sm text-red-500">{errors.totalRooms}</p>}
                  </div>
                </div>

                {/* Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sức chứa tối thiểu
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                      min={1}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sức chứa tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                      min={1}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiện nghi <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenityOptions.map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
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

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Nhập URL hình ảnh"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} alt={`Room ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {editingRoomType ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
