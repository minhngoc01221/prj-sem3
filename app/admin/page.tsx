import { Suspense } from 'react';
import { DashboardContent } from '@/components/admin/dashboard/DashboardContent';
import DashboardLoading from './loading';
import type { DashboardStats, RevenueChartData, RecentBooking, ContactAlert, Notification } from '@/types/dashboard';

async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/dashboard/stats`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return null;
  }
}

async function getRevenueData(): Promise<RevenueChartData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/dashboard/revenue`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch revenue data:', error);
    return null;
  }
}

async function getRecentBookings(): Promise<RecentBooking[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/dashboard/bookings?limit=10`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data.bookings : null;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return null;
  }
}

async function getContactAlerts(): Promise<ContactAlert[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/dashboard/contacts`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data.contacts : null;
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return null;
  }
}

async function getNotifications(): Promise<Notification[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/dashboard/notifications`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data.notifications : null;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const [stats, revenueData, bookings, contacts, notifications] = await Promise.all([
    getDashboardStats(),
    getRevenueData(),
    getRecentBookings(),
    getContactAlerts(),
    getNotifications(),
  ]);

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent
        stats={stats}
        revenueData={revenueData}
        bookings={bookings}
        contacts={contacts}
        notifications={notifications}
        isLoading={false}
      />
    </Suspense>
  );
}
