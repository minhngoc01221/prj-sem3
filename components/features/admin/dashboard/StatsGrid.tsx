'use client';

import {
  MapPin,
  Building2,
  UtensilsCrossed,
  Palmtree,
  ShoppingCart,
  DollarSign,
} from 'lucide-react';
import { StatCard } from './StatCard';
import type { DashboardStats } from '@/types/dashboard';

interface StatsGridProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không có dữ liệu
            </p>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Điểm du lịch',
      value: stats.totalTouristSpots,
      icon: MapPin,
      variant: 'default' as const,
    },
    {
      title: 'Khách sạn',
      value: stats.totalHotels,
      icon: Building2,
      variant: 'default' as const,
    },
    {
      title: 'Nhà hàng',
      value: stats.totalRestaurants,
      icon: UtensilsCrossed,
      variant: 'default' as const,
    },
    {
      title: 'Resort',
      value: stats.totalResorts,
      icon: Palmtree,
      variant: 'default' as const,
    },
    {
      title: 'Đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: stats.ordersChange,
      variant: stats.ordersChange >= 0 ? 'success' as const : 'danger' as const,
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      change: stats.revenueChange,
      variant: stats.revenueChange >= 0 ? 'success' as const : 'danger' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          change={item.change}
          variant={item.variant}
        />
      ))}
    </div>
  );
}
