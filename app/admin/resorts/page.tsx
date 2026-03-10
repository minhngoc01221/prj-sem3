import { Suspense } from 'react';
import { ResortsManagementContent } from '@/components/admin/resorts/ResortsManagementContent';
import ResortsLoading from './loading';
import type { Resort } from '@/types/admin';

async function getResorts(): Promise<Resort[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/resorts`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch resorts:', error);
    return [];
  }
}

export default async function AdminResortsPage() {
  const resorts = await getResorts();

  return (
    <Suspense fallback={<ResortsLoading />}>
      <ResortsManagementContent resorts={resorts} isLoading={false} />
    </Suspense>
  );
}
