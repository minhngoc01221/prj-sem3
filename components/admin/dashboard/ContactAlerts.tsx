'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { ContactAlert } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContactAlertsProps {
  alerts: ContactAlert[] | null;
  isLoading: boolean;
  unreadCount?: number;
}

export function ContactAlerts({ alerts, isLoading, unreadCount }: ContactAlertsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Yêu cầu chờ xử lý
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-slate-400" />
            Yêu cầu chờ xử lý
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không có yêu cầu nào
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Yêu cầu chờ xử lý
        </CardTitle>
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            {unreadCount} mới
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="group rounded-lg border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:hover:border-slate-600"
          >
            <div className="mb-2 flex items-start justify-between">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                {alert.fullName}
              </h4>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {format(new Date(alert.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </span>
            </div>
            
            <div className="mb-2 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <a
                href={`mailto:${alert.email}`}
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Mail className="h-3.5 w-3.5" />
                {alert.email}
              </a>
              <a
                href={`tel:${alert.phone}`}
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Phone className="h-3.5 w-3.5" />
                {alert.phone}
              </a>
            </div>

            {alert.serviceType && (
              <p className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                Dịch vụ quan tâm: {alert.serviceType}
              </p>
            )}

            <div className="flex items-start gap-2 rounded-md bg-slate-50 p-2 dark:bg-slate-800/50">
              <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
              <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                {alert.message}
              </p>
            </div>

            <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button size="sm" variant="outline">
                Xem chi tiết
              </Button>
              <Button size="sm">
                Xử lý
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
