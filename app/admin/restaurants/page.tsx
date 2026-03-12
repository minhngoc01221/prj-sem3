import { Suspense } from 'react';
import { RestaurantsManagementContent } from '@/components/features/admin/restaurants/RestaurantsManagementContent';
import RestaurantsLoading from './loading';
import type { Restaurant } from '@/types/admin';

async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/restaurants`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    return [];
  }
}

export default async function AdminRestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <Suspense fallback={<RestaurantsLoading />}>
      <RestaurantsManagementContent restaurants={restaurants} isLoading={false} />
    </Suspense>
  );
}
