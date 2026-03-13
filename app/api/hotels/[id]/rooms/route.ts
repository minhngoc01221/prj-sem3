import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET rooms for a hotel
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = await getDb();
    const { id: hotelId } = await params;

    const roomsCollection = db.collection('rooms');
    const rooms = await roomsCollection.find({ hotelId }).toArray();

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST - Create a new room
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = await getDb();
    const { id: hotelId } = await params;

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

    const room = {
      hotelId,
      type: type || 'Standard',
      description: description || '',
      price: price || basePrice || 0,
      basePrice: basePrice || price || 0,
      available: available || totalRooms || 0,
      totalRooms: totalRooms || available || 0,
      maxGuests: maxGuests || 2,
      amenities: amenities || [],
      images: images || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await roomsCollection.insertOne(room);

    return NextResponse.json(
      { ...room, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
