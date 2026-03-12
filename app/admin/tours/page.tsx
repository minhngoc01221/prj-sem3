import { Suspense } from 'react';
import { ToursManagementContent } from '@/components/features/admin/tours/ToursManagementContent';
import ToursLoading from './loading';
import type { TourPackage } from '@/types/admin';

async function getTours(): Promise<TourPackage[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/tours`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch tours:', error);
    return [];
  }
}

export default async function AdminToursPage() {
  const tours = await getTours();

  return (
    <Suspense fallback={<ToursLoading />}>
      <ToursManagementContent tours={tours} isLoading={false} />
    </Suspense>
  );
}
