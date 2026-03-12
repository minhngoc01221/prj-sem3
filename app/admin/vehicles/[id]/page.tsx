import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Bus, 
  MapPin, 
  Clock, 
  DollarSign, 
  Phone, 
  Check, 
  X,
  Edit2,
  Route,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import type { Vehicle } from '@/types/admin';
import VehicleDetailLoading from './loading';

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/vehicles/${id}`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch vehicle:', error);
    return null;
  }
}

const vehicleTypeLabels: Record<string, string> = {
  bus: 'Xe khách',
  limousine: 'Limousine',
  airplane: 'Máy bay',
  train: 'Tàu hỏa',
  car: 'Thuê xe'
};

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = await params;
  const vehicle = await getVehicle(id);

  if (!vehicle) {
    notFound();
  }

  return (
    <Suspense fallback={<VehicleDetailLoading />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/vehicles"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
              <p className="text-gray-500 mt-1">Chi tiết phương tiện</p>
            </div>
          </div>
          <Link 
            href={`/admin/vehicles/${vehicle.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
            Chỉnh sửa
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh phương tiện</h2>
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={image} 
                        alt={`${vehicle.name} - Hình ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Chưa có hình ảnh</p>
                  </div>
                </div>
              )}
            </div>

            {/* Route Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tuyến đường</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Điểm khởi hành</p>
                    <p className="text-lg font-semibold text-gray-900">{vehicle.departure}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Điểm đến</p>
                    <p className="text-lg font-semibold text-gray-900">{vehicle.arrival}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700">
                  <Route className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Tuyến đường:</span>
                  <span>{vehicle.departure} → {vehicle.arrival}</span>
                </div>
              </div>
            </div>

            {/* Schedule */}
            {vehicle.schedule && vehicle.schedule.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch trình</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.schedule.map((time, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg"
                    >
                      <Clock className="w-4 h-4" />
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái</h2>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                  vehicle.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {vehicle.isActive ? (
                    <>
                      <Check className="w-4 h-4" />
                      Hoạt động
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Không hoạt động
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Bus className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Loại phương tiện</p>
                    <p className="font-medium text-gray-900">{vehicleTypeLabels[vehicle.type]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nhà cung cấp</p>
                    <p className="font-medium text-gray-900">{vehicle.provider}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Giá vé</p>
                    <p className="font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vehicle.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {vehicle.contact && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ</h2>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-gray-900">{vehicle.contact}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thời gian</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-medium text-gray-900">
                      {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-medium text-gray-900">
                      {vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
