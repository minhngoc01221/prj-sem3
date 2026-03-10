import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>

      {/* Chart & Alerts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 h-[400px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-[400px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Table Skeleton */}
      <div className="h-[300px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />

      {/* Loading Indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Đang tải dữ liệu...
        </span>
      </div>
    </div>
  );
}
