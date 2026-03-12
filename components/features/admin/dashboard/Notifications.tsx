'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Bell,
  ShoppingCart,
  MessageSquare,
  Settings,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Notification, NotificationType } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationsProps {
  initialNotifications?: Notification[];
  initialUnreadCount?: number;
  pollingInterval?: number;
}

const notificationIcons: Record<NotificationType, typeof Bell> = {
  new_booking: ShoppingCart,
  contact: MessageSquare,
  system: Settings,
};

const notificationColors: Record<NotificationType, string> = {
  new_booking: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  contact: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  system: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
};

export function Notifications({
  initialNotifications = [],
  initialUnreadCount = 0,
  pollingInterval = 30000,
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/notifications');
      const result = await response.json();
      
      if (result.success && result.data) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isPolling) return;

    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchNotifications, isPolling, pollingInterval]);

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/dashboard/notifications', {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const togglePolling = () => {
    setIsPolling((prev) => !prev);
  };

  if (notifications.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Thông báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
            <Bell className="h-8 w-8 opacity-50" />
            <p className="text-sm">Không có thông báo nào</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Thông báo
          {unreadCount > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Cập nhật: {format(lastUpdated, 'HH:mm:ss')}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={togglePolling}
            className="text-xs"
          >
            {isPolling ? 'Tắt realtime' : 'Bật realtime'}
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Đánh dấu đã đọc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="max-h-[400px] space-y-2 overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              const colorClass = notificationColors[notification.type];
              
              return (
                <div
                  key={notification.id}
                  className={`group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className={`rounded-full p-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm font-medium ${
                        !notification.isRead 
                          ? 'text-slate-900 dark:text-slate-100' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
