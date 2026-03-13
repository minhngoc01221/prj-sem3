import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import type { ContactAlertsResponse, ApiResponse } from '@/types/dashboard';

export async function GET(): Promise<NextResponse<ApiResponse<ContactAlertsResponse>>> {
  try {
    await client.connect();
    const db = await getDb();
    
    const contactsCollection = db.collection('contacts');
    
    const contacts = await contactsCollection
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const unreadCount = await contactsCollection.countDocuments({ status: 'pending' });

    const alerts = contacts.map((contact) => ({
      id: contact._id?.toString() || '',
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
  } finally {
    await client.close();
  }
}
