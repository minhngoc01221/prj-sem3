import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import type { RevenueChartData, ApiResponse } from '@/types/dashboard';

export async function GET(): Promise<NextResponse<ApiResponse<RevenueChartData>>> {
  try {
    await client.connect();
    const db = getDb();
    
    const contactsCollection = db.collection('contacts');
    
    const now = new Date();
    const months: { month: string; startDate: Date; endDate: Date }[] = [];

    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthName = startOfMonth.toLocaleDateString('vi-VN', { month: 'short' });
      months.push({ month: monthName, startDate: startOfMonth, endDate: endOfMonth });
    }

    const contactsData = await Promise.all(
      months.map(async ({ startDate, endDate }) => {
        const count = await contactsCollection.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });
        return count;
      })
    );

    const revenuePerOrder = 500000;
    const data = months.map(({ month }, index) => ({
      month,
      revenue: contactsData[index] * revenuePerOrder,
      orders: contactsData[index],
    }));

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const averageRevenue = Math.round(totalRevenue / data.length);

    const response: RevenueChartData = {
      data,
      totalRevenue,
      averageRevenue,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
