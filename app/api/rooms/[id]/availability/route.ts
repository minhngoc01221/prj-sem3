import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

// GET availability for a room
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const { id: roomId } = await params;

    const availabilityCollection = db.collection('room_availability');

    const availability = await availabilityCollection
      .find({ roomId })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT - Update or create availability for dates
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const { id: roomId } = await params;
    const body = await request.json();

    const { availability } = body;

    const availabilityCollection = db.collection('room_availability');

    // Delete existing availability
    await availabilityCollection.deleteMany({ roomId });

    // Create new availability
    if (availability && availability.length > 0) {
      const availabilityData = availability.map((a: any) => ({
        roomId,
        date: a.date,
        available: a.available || 0,
        booked: a.booked || 0,
      }));

      await availabilityCollection.insertMany(availabilityData);
    }

    const updatedAvailability = await availabilityCollection
      .find({ roomId })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json(updatedAvailability);
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
