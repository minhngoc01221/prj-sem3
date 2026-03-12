import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const { id } = await params;

    const roomsCollection = db.collection('rooms');
    const room = await roomsCollection.findOne({ _id: new ObjectId(id) });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const { id } = await params;

    const roomsCollection = db.collection('rooms');
    const body = await request.json();

    const {
      type,
      description,
      price,
      basePrice,
      available,
      totalRooms,
      maxGuests,
      amenities,
      images,
    } = body;

    const room = await roomsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          type: type || 'Standard',
          description: description || '',
          price: price || basePrice || 0,
          basePrice: basePrice || price || 0,
          available: available || totalRooms || 0,
          totalRooms: totalRooms || available || 0,
          maxGuests: maxGuests || 2,
          amenities: amenities || [],
          images: images || [],
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const { id } = await params;

    const roomsCollection = db.collection('rooms');
    const pricingCollection = db.collection('room_pricing');
    const availabilityCollection = db.collection('room_availability');

    // Delete related pricing and availability first
    await pricingCollection.deleteMany({ roomId: id });
    await availabilityCollection.deleteMany({ roomId: id });

    await roomsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
