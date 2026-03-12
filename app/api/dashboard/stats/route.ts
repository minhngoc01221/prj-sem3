import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import type { DashboardStats, ApiResponse } from '@/types/dashboard';

export async function GET(): Promise<NextResponse<ApiResponse<DashboardStats>>> {
  try {
    await client.connect();
    const db = getDb();
    
    const [
      touristSpotsCount,
      hotelsCount,
      restaurantsCount,
      resortsCount,
      contactsCount,
      lastMonthContactsCount,
    ] = await Promise.all([
      db.collection('tourist_spots').countDocuments(),
      db.collection('hotels').countDocuments(),
      db.collection('restaurants').countDocuments(),
      db.collection('resorts').countDocuments(),
      db.collection('contacts').countDocuments(),
      db.collection('contacts').countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    const totalOrders = contactsCount;
    const totalRevenue = contactsCount * 500000;
    const revenueChange = lastMonthContactsCount > 0 
      ? ((contactsCount - lastMonthContactsCount) / lastMonthContactsCount) * 100 
      : 100;
    const ordersChange = revenueChange;

    const stats: DashboardStats = {
      totalTouristSpots: touristSpotsCount,
      totalHotels: hotelsCount,
      totalRestaurants: restaurantsCount,
      totalResorts: resortsCount,
      totalOrders,
      totalRevenue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
