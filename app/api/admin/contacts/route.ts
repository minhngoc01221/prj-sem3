import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/adminAuth';

// GET contacts - requires auth
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
    const contactsCollection = db.collection('contacts');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await contactsCollection.countDocuments(query);
    const contacts = await contactsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const contactsWithFormatted = contacts.map((c: any) => ({
      ...c,
      id: c._id?.toString() || c.id,
      createdAt: c.createdAt?.toISOString(),
      updatedAt: c.updatedAt?.toISOString(),
      desiredDate: c.desiredDate?.toISOString(),
      repliedAt: c.repliedAt?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: contactsWithFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contacts', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
