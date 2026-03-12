import { Suspense } from 'react';
import { HotelsManagementContent } from '@/components/features/admin/hotels/HotelsManagementContent';
import HotelsLoading from './loading';
import type { Hotel } from '@/types/admin';

async function getHotels(): Promise<Hotel[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/hotels`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    return [];
  }
}

export default async function AdminHotelsPage() {
  const hotels = await getHotels();

  return (
    <Suspense fallback={<HotelsLoading />}>
      <HotelsManagementContent hotels={hotels} isLoading={false} />
    </Suspense>
  );
}
