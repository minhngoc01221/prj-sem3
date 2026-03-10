import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { NotificationsResponse, ApiResponse } from '@/types/dashboard';

export async function GET(): Promise<NextResponse<ApiResponse<NotificationsResponse>>> {
  try {
    const recentContacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const pendingCount = await prisma.contact.count({
      where: { status: 'pending' },
    });

    const notifications = recentContacts.map((contact, index) => ({
      id: contact.id,
      type: 'contact' as const,
      title: contact.serviceType ? `Yêu cầu: ${contact.serviceType}` : 'Liên hệ mới',
      message: `${contact.fullName}: ${contact.message.slice(0, 50)}...`,
      isRead: contact.status !== 'pending' || index > 0,
      createdAt: contact.createdAt,
    }));

    const response: NotificationsResponse = {
      notifications,
      unreadCount: pendingCount,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
