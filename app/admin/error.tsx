'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
          Đã xảy ra lỗi
        </h2>
        <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {error.message || 'Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
          <Button onClick={() => window.location.href('/')} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
