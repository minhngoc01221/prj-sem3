import { Suspense } from 'react';
import { PromotionsManagementContent } from '@/components/features/admin/promotions/PromotionsManagementContent';
import PromotionsLoading from './loading';
import type { Promotion } from '@/types/admin';

async function getPromotions(): Promise<Promotion[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/promotions`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch promotions:', error);
    return [];
  }
}

export default async function AdminPromotionsPage() {
  const promotions = await getPromotions();

  return (
    <Suspense fallback={<PromotionsLoading />}>
      <PromotionsManagementContent promotions={promotions} isLoading={false} />
    </Suspense>
  );
}
