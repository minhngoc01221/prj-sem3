"use client";

import { useState, useRef, useCallback } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
  GripVertical
} from 'lucide-react';

interface GalleryManagerProps {
  images: string[];
  onUpdate: (images: string[]) => void;
  maxImages?: number;
  title?: string;
}

export function GalleryManager({ 
  images, 
  onUpdate, 
  maxImages = 10,
  title = 'Quản lý gallery'
}: GalleryManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
    if (images.length + files.length > maxImages) {
      alert(`Tối đa ${maxImages} ảnh`);
      return;
    }

    const newImageUrls = files.map(file => URL.createObjectURL(file));
    onUpdate([...images, ...newImageUrls]);
  };

  const handleAddUrl = (url: string) => {
    if (!url.trim()) return;
    if (images.length >= maxImages) {
      alert(`Tối đa ${maxImages} ảnh`);
      return;
    }
    onUpdate([...images, url.trim()]);
  };

  const removeImage = (index: number) => {
    onUpdate(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onUpdate(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{images.length}/{maxImages} ảnh</span>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-200 hover:border-gray-300'
        } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={images.length >= maxImages}
        />

        <div className="text-center">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isDragging ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-orange-600' : 'text-gray-400'}`} />
          </div>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-orange-600">Click để tải lên</span> hoặc kéo thả
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, GIF tối đa 10MB
          </p>
        </div>
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nhập URL hình ảnh..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddUrl((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
        <button
          onClick={(e) => {
            const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
            handleAddUrl(input.value);
            input.value = '';
          }}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-move transition-all ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              }`}
            >
              {/* Cover Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-lg">
                  Ảnh bìa
                </div>
              )}

              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Drag Handle */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1 bg-black/50 text-white rounded-lg">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          {images.length < maxImages && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto" />
                <span className="text-sm text-gray-500">Thêm ảnh</span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có hình ảnh nào</p>
          <p className="text-sm text-gray-400">Thêm hình ảnh để hiển thị trong gallery</p>
        </div>
      )}
    </div>
  );
}
