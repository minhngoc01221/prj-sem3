'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RevenueDataPoint } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueChartProps {
  data: RevenueDataPoint[] | null;
  isLoading: boolean;
  totalRevenue?: number;
  averageRevenue?: number;
}

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

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:bg-slate-800 dark:border-slate-700">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey === 'revenue' ? 'Doanh thu: ' : 'Đơn hàng: '}
            {entry.dataKey === 'revenue' 
              ? `${formatCurrency(entry.value)} VNĐ`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data, isLoading, totalRevenue, averageRevenue }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Doanh thu & Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Doanh thu & Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không có dữ liệu
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Doanh thu & Đơn hàng</CardTitle>
        <div className="flex gap-6 text-sm">
          {totalRevenue !== undefined && (
            <div className="text-right">
              <p className="text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(totalRevenue)} VNĐ
              </p>
            </div>
          )}
          {averageRevenue !== undefined && (
            <div className="text-right">
              <p className="text-slate-500 dark:text-slate-400">Trung bình/tháng</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(averageRevenue)} VNĐ
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis
                dataKey="month"
                className="text-xs text-slate-500 dark:text-slate-400"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs text-slate-500 dark:text-slate-400"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Doanh thu"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
                name="Đơn hàng"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
