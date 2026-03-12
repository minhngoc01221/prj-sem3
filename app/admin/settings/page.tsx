import { Suspense } from 'react';
import { SettingsContent } from '@/components/features/admin/settings/SettingsContent';
import SettingsLoading from './loading';

async function getSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/settings`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent settings={settings} isLoading={false} />
    </Suspense>
  );
}
