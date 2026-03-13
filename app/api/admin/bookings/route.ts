import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const bookingsCollection = db.collection('bookings');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};

    // Search by customer name
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { itemName: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) {
        query.bookingDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.bookingDate.$lte = new Date(endDate);
      }
    }

    const total = await bookingsCollection.countDocuments(query);
    const bookings = await bookingsCollection
      .find(query)
      .sort({ bookingDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const bookingsWithFormatted = bookings.map((b: any) => ({
      ...b,
      id: b._id?.toString() || b.id,
      bookingDate: b.bookingDate?.toISOString(),
      travelDate: b.travelDate?.toISOString(),
      createdAt: b.createdAt?.toISOString(),
      updatedAt: b.updatedAt?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: bookingsWithFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
