import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Star, Users, Check, X } from 'lucide-react';

async function getTour(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/tours/${id}`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch tour:', error);
    return null;
  }
}

interface TourDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/tours"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tour không tồn tại</h1>
            <p className="text-gray-500 mt-1">Không tìm thấy tour với ID này</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/tours"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tour.name}</h1>
            <p className="text-gray-500 mt-1">Chi tiết tour</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            tour.isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {tour.isActive ? <><Check className="w-4 h-4" /> Hoạt động</> : <><X className="w-4 h-4" /> Tạm dừng</>}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {tour.images && tour.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 p-4">
                {tour.images.slice(0, 4).map((img: string, index: number) => (
                  <div key={index} className={`${index === 0 ? 'col-span-2 row-span-2' : ''} aspect-video rounded-lg overflow-hidden`}>
                    <img src={img} alt={`Tour image ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <p>Chưa có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mô tả tour</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{tour.description}</p>
          </div>

          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch trình</h2>
              <div className="space-y-4">
                {tour.itinerary.map((day: any, index: number) => (
                  <div key={index} className="border-l-2 border-orange-500 pl-4 pb-4">
                    <h3 className="font-semibold text-gray-900">Ngày {day.day}: {day.title}</h3>
                    <p className="text-gray-600 mt-1">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes */}
          {tour.includes && tour.includes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bao gồm</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.includes.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Thông tin nhanh</h2>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium text-gray-900">{tour.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Điểm đến</p>
                <p className="font-medium text-gray-900">{tour.destinations?.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Giá</p>
                <p className="font-medium text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}
                </p>
              </div>
            </div>

            {tour.discount > 0 && (
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Giảm giá</p>
                  <p className="font-medium text-orange-600">{tour.discount}%</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Lượt đặt</p>
                <p className="font-medium text-gray-900">{tour.bookingCount || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Đánh giá</p>
                <p className="font-medium text-gray-900">{tour.rating || 0} / 5</p>
              </div>
            </div>
          </div>

          {/* Created/Updated */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày tạo</span>
                <span className="text-gray-900">
                  {tour.createdAt ? new Date(tour.createdAt).toLocaleDateString('vi-VN') : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cập nhật lần cuối</span>
                <span className="text-gray-900">
                  {tour.updatedAt ? new Date(tour.updatedAt).toLocaleDateString('vi-VN') : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
