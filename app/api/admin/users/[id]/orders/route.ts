import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = await getDb();
    const ordersCollection = db.collection('bookings');

    const { id } = await params;

    const orders = await ordersCollection
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .toArray();

    const ordersWithFormatted = orders.map((o: any) => ({
      id: o._id?.toString() || o.id,
      orderCode: o.orderCode || `ORD-${o._id?.toString().slice(-6)}`,
      createdAt: o.createdAt?.toISOString(),
      totalAmount: o.totalAmount || o.totalPrice || 0,
      status: o.status || 'pending',
    }));

    return NextResponse.json({
      success: true,
      data: ordersWithFormatted,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
