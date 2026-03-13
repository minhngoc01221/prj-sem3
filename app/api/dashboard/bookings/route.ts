import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import type { RecentBookingsResponse, ApiResponse, BookingStatus } from '@/types/dashboard';

export async function GET(
  request: Request
): Promise<NextResponse<ApiResponse<RecentBookingsResponse>>> {
  try {
    await client.connect();
    const db = await getDb();
    
    const contactsCollection = db.collection('contacts');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const contacts = await contactsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const statusMap: Record<string, BookingStatus> = {
      pending: 'pending',
      processed: 'confirmed',
    };

    const bookings = contacts.map((contact) => ({
      id: contact._id?.toString() || '',
      customer: {
        id: contact._id?.toString() || '',
        customerName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
      },
      serviceType: contact.serviceType || 'general',
      serviceName: contact.serviceType || 'Tư vấn dịch vụ',
      totalAmount: contact.groupSize ? Number(contact.groupSize) * 500000 : 500000,
      status: statusMap[contact.status || ''] || 'pending',
      createdAt: contact.createdAt,
    }));

    const total = await contactsCollection.countDocuments();

    const response: RecentBookingsResponse = {
      bookings,
      total,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent bookings' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
