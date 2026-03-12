'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel = 'so với tháng trước',
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800',
    success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  };

  const iconColorStyles = {
    default: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700',
    success: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50',
    danger: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50',
  };

  const changeColorStyles = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-500 dark:text-slate-400',
  };

  const getChangeStyle = () => {
    if (!change) return changeColorStyles.neutral;
    return change > 0 ? changeColorStyles.positive : changeColorStyles.negative;
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-6 shadow-sm transition-all hover:shadow-md',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <span className={cn('font-medium', getChangeStyle())}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-slate-400 dark:text-slate-500">
                {changeLabel}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'rounded-lg p-3',
            iconColorStyles[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
