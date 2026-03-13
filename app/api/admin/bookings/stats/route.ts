import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/adminAuth';

// GET bookings stats - requires auth
export async function GET(request: Request) {
  const authResult = await verifyAdminAuth(request);
  
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, message: authResult.error },
      { status: 401 }
    );
  }

  try {
    await client.connect();
    const db = await getDb();
    const bookingsCollection = db.collection('bookings');

    // Get stats by status
    const statusStats = await bookingsCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]).toArray();

    // Calculate totals
    const stats = {
      totalBookings: 0,
      totalRevenue: 0,
      pending: { count: 0, revenue: 0 },
      confirmed: { count: 0, revenue: 0 },
      completed: { count: 0, revenue: 0 },
      cancelled: { count: 0, revenue: 0 },
    };

    statusStats.forEach((s: any) => {
      stats.totalBookings += s.count;
      stats.totalRevenue += s.totalRevenue || 0;
      
      if (s._id === 'pending') {
        stats.pending = { count: s.count, revenue: s.totalRevenue || 0 };
      } else if (s._id === 'confirmed') {
        stats.confirmed = { count: s.count, revenue: s.totalRevenue || 0 };
      } else if (s._id === 'completed') {
        stats.completed = { count: s.count, revenue: s.totalRevenue || 0 };
      } else if (s._id === 'cancelled') {
        stats.cancelled = { count: s.count, revenue: s.totalRevenue || 0 };
      }
    });

    // Get recent bookings
    const recentBookings = await bookingsCollection
      .find({})
      .sort({ bookingDate: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentBookings: recentBookings.map((b: any) => ({
          ...b,
          id: b._id?.toString(),
          bookingDate: b.bookingDate?.toISOString(),
          createdAt: b.createdAt?.toISOString(),
        }))
      },
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats', data: null },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
