import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { RecentBookingsResponse, ApiResponse, BookingStatus } from '@/types/dashboard';

export async function GET(
  request: Request
): Promise<NextResponse<ApiResponse<RecentBookingsResponse>>> {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') as BookingStatus | null;

    const contacts = await prisma.contact.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: status ? { status } : undefined,
    });

    const statusMap: Record<string, BookingStatus> = {
      pending: 'pending',
      processed: 'confirmed',
    };

    const bookings = contacts.map((contact) => ({
      id: contact.id,
      customer: {
        id: contact.id,
        customerName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
      },
      serviceType: contact.serviceType || 'general',
      serviceName: contact.serviceType || 'Tư vấn dịch vụ',
      totalAmount: contact.groupSize ? contact.groupSize * 500000 : 500000,
      status: statusMap[contact.status] || 'pending',
      createdAt: contact.createdAt,
    }));

    const total = await prisma.contact.count();

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
  }
}
