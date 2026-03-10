'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { RecentBooking, BookingStatus } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RecentBookingsTableProps {
  bookings: RecentBooking[] | null;
  isLoading: boolean;
  total?: number;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: {
    label: 'Chờ xử lý',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  confirmed: {
    label: 'Đã xác nhận',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  completed: {
    label: 'Hoàn thành',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

export function RecentBookingsTable({ bookings, isLoading, total }: RecentBookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không có đơn hàng nào
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Đơn hàng gần đây</CardTitle>
        {total !== undefined && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Tổng: {total} đơn
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border dark:border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead className="font-semibold">Mã đơn</TableHead>
                <TableHead className="font-semibold">Khách hàng</TableHead>
                <TableHead className="font-semibold">Dịch vụ</TableHead>
                <TableHead className="text-right font-semibold">Tổng tiền</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold">Ngày tạo</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const status = statusConfig[booking.status];
                return (
                  <TableRow
                    key={booking.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <TableCell className="font-medium">
                      #{booking.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.customer.customerName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {booking.customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{booking.serviceName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {booking.serviceType}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(booking.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                      {format(new Date(booking.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedBooking(
                          selectedBooking === booking.id ? null : booking.id
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
