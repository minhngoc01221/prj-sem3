import { NextResponse } from 'next/server';import client, { getDb } from '@/lib/mongodb';

// GET pricing for a room
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const { id: roomId } = await params;

    const pricingCollection = db.collection('room_pricing');

    const pricing = await pricingCollection
      .find({ roomId })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT - Update or create pricing for dates
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const { id: roomId } = await params;
    const body = await request.json();

    const { pricing } = body;

    const pricingCollection = db.collection('room_pricing');

    // Delete existing pricing
    await pricingCollection.deleteMany({ roomId });

    // Create new pricing
    if (pricing && pricing.length > 0) {
      const pricingData = pricing.map((p: any) => ({
        roomId,
        date: p.date,
        price: p.price,
        isSpecial: p.isSpecial || false,
        specialReason: p.specialReason || null,
      }));

      await pricingCollection.insertMany(pricingData);
    }

    const updatedPricing = await pricingCollection
      .find({ roomId })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json(updatedPricing);
  } catch (error) {
    console.error('Error updating pricing:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
