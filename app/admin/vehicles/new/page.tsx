import { Suspense } from 'react';
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
  Route,
  Calendar,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import type { Vehicle } from '@/types/admin';
import { VehicleFormModal } from '@/components/admin/vehicles/VehicleFormModal';

interface NewVehiclePageProps {
  params: Promise<{}>;
}

const vehicleTypeLabels: Record<string, string> = {
  bus: 'Xe khách',
  limousine: 'Limousine',
  airplane: 'Máy bay',
  train: 'Tàu hỏa',
  car: 'Thuê xe'
};

export default function NewVehiclePage({ params }: NewVehiclePageProps) {
  // This is a client-side form page
  return (
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
            <h1 className="text-2xl font-bold text-gray-900">Thêm phương tiện mới</h1>
            <p className="text-gray-500 mt-1">Tạo mới phương tiện vận chuyển</p>
          </div>
        </div>
      </div>

      {/* This would normally be a form - for now show a message */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Thêm phương tiện mới</h2>
          <p className="text-gray-500 mb-6">
            Vui lòng sử dụng nút "Thêm phương tiện" trong trang danh sách để thêm mới.
          </p>
          <Link 
            href="/admin/vehicles"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}
