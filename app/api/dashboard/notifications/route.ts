import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import type { NotificationsResponse, ApiResponse } from '@/types/dashboard';

export async function GET(): Promise<NextResponse<ApiResponse<NotificationsResponse>>> {
  try {
    await client.connect();
    const db = await getDb();
    
    const contactsCollection = db.collection('contacts');
    
    const recentContacts = await contactsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const pendingCount = await contactsCollection.countDocuments({ status: 'pending' });

    const notifications = recentContacts.map((contact, index) => ({
      id: contact._id?.toString() || '',
      type: 'contact' as const,
      title: contact.serviceType ? `Yêu cầu: ${contact.serviceType}` : 'Liên hệ mới',
      message: `${contact.fullName || contact.name}: ${contact.message.slice(0, 50)}...`,
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
  } finally {
    await client.close();
  }
}
