import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ContactAlertsResponse, ApiResponse } from '@/types/dashboard';

export async function GET(): Promise<NextResponse<ApiResponse<ContactAlertsResponse>>> {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        status: 'pending',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const unreadCount = await prisma.contact.count({
      where: {
        status: 'pending',
      },
    });

    const alerts = contacts.map((contact) => ({
      id: contact.id,
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      serviceType: contact.serviceType,
      message: contact.message,
      createdAt: contact.createdAt,
    }));

    const response: ContactAlertsResponse = {
      contacts: alerts,
      unreadCount,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching contact alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact alerts' },
      { status: 500 }
    );
  }
}
