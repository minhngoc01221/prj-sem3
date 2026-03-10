import { Suspense } from 'react';
import { VehiclesManagementContent } from '@/components/admin/vehicles/VehiclesManagementContent';
import VehiclesLoading from './loading';
import type { Vehicle } from '@/types/admin';

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/vehicles`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    return [];
  }
}

export default async function AdminVehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <Suspense fallback={<VehiclesLoading />}>
      <VehiclesManagementContent vehicles={vehicles} isLoading={false} />
    </Suspense>
  );
}
