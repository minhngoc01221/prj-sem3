import { Suspense } from 'react';
import { SpotsManagementContent } from '@/components/admin/spots/SpotsManagementContent';
import SpotsLoading from './loading';
import type { TouristSpot } from '@/types/admin';

async function getSpots(): Promise<TouristSpot[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/spots`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch spots:', error);
    return [];
  }
}

export default async function AdminSpotsPage() {
  const spots = await getSpots();

  return (
    <Suspense fallback={<SpotsLoading />}>
      <SpotsManagementContent spots={spots} isLoading={false} />
    </Suspense>
  );
}
