import { Suspense } from 'react';
import { SettingsContent } from '@/components/admin/settings/SettingsContent';
import SettingsLoading from './loading';

export const dynamic = 'force-dynamic';

async function getSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/settings/general`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : {};
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return {};
  }
}

async function getMenus() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/settings/menu`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch menus:', error);
    return [];
  }
}

async function getBanners() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/settings/banners`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return [];
  }
}

async function getEmailConfig() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/settings/email-config`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch email config:', error);
    return null;
  }
}

export default async function AdminSettingsPage() {
  const [settings, menus, banners, emailConfig] = await Promise.all([
    getSettings(),
    getMenus(),
    getBanners(),
    getEmailConfig(),
  ]);

  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent 
        settings={settings} 
        menus={menus}
        banners={banners}
        emailConfig={emailConfig}
        isLoading={false} 
      />
    </Suspense>
  );
}
