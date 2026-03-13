'use client';

import { RevenueChart } from './RevenueChart';
import { StatsGrid } from './StatsGrid';
import { RecentBookingsTable } from './RecentBookingsTable';
import { ContactAlerts } from './ContactAlerts';
import { Notifications } from './Notifications';
import type { DashboardStats, RevenueChartData, RecentBooking, ContactAlert, Notification } from '@/types/dashboard';

interface DashboardContentProps {
  stats: DashboardStats | null;
  revenueData: RevenueChartData | null;
  bookings: RecentBooking[] | null;
  contacts: ContactAlert[] | null;
  notifications: Notification[] | null;
  isLoading: boolean;
  statsError?: string;
  revenueError?: string;
  bookingsError?: string;
  contactsError?: string;
}

export function DashboardContent({
  stats,
  revenueData,
  bookings,
  contacts,
  notifications,
  isLoading,
  statsError,
  revenueError,
  bookingsError,
  contactsError,
}: DashboardContentProps) {
  const unreadContactsCount = contacts?.length || 0;
  const unreadNotificationsCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tổng quan hệ thống quản lý du lịch
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid - F161-F166 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Thống kê tổng quan
        </h2>
        {statsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20">
            Lỗi: {statsError}
          </div>
        ) : (
          <StatsGrid stats={stats} isLoading={isLoading} />
        )}
      </section>

      {/* Revenue Chart - F168 & Recent Bookings - F167 */}
      <section className="grid gap-6 lg:grid-cols-3">
        <RevenueChart
          data={revenueData?.data || null}
          isLoading={isLoading}
          totalRevenue={revenueData?.totalRevenue}
          averageRevenue={revenueData?.averageRevenue}
        />
        <ContactAlerts
          alerts={contacts || null}
          isLoading={isLoading}
          unreadCount={unreadContactsCount}
        />
      </section>

      {/* Recent Bookings Table - F167 */}
      <section>
        <RecentBookingsTable
          bookings={bookings || null}
          isLoading={isLoading}
          total={bookings?.length}
        />
      </section>

      {/* Notifications - F170 */}
      <section>
        <Notifications
          initialNotifications={notifications || []}
          initialUnreadCount={unreadNotificationsCount}
          pollingInterval={30000}
        />
      </section>
    </div>
  );
}
