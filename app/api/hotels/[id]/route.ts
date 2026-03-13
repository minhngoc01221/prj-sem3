import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = await getDb();
    const { id } = await params;

    const hotelsCollection = db.collection('hotels');
    const hotel = await hotelsCollection.findOne({ _id: new ObjectId(id) });

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }

    // Get rooms, pricing, availability, and reviews
    const roomsCollection = db.collection('rooms');
    const reviewsCollection = db.collection('hotel_reviews');
    const pricingCollection = db.collection('room_pricing');
    const availabilityCollection = db.collection('room_availability');

    const rooms = await roomsCollection
      .find({ hotelId: id })
      .toArray();

    const roomsWithDetails = await Promise.all(
      rooms.map(async (room: any) => {
        const pricing = await pricingCollection
          .find({ roomId: room._id.toString() })
          .sort({ date: 1 })
          .toArray();
        const availability = await availabilityCollection
          .find({ roomId: room._id.toString() })
          .sort({ date: 1 })
          .toArray();
        return { ...room, pricing, availability };
      })
    );

    const reviews = await reviewsCollection
      .find({ hotelId: id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ ...hotel, roomTypes: roomsWithDetails, reviews });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
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
    const db = await getDb();
    const { id } = await params;

    const hotelsCollection = db.collection('hotels');
    const body = await request.json();

    const {
      name,
      address,
      city,
      starRating,
      priceMin,
      priceMax,
      amenities,
      images,
      description,
      contact,
      policies,
      rating,
      isActive,
    } = body;

    const hotel = await hotelsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          address,
          city,
          starRating,
          priceMin: priceMin || 0,
          priceMax: priceMax || 0,
          amenities: amenities || [],
          images: images || [],
          description: description || '',
          contact: contact || '',
          policies: policies || '',
          rating: rating || 0,
          isActive: isActive ?? true,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Error updating hotel:', error);
    return NextResponse.json(
      { error: 'Failed to update hotel' },
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
    const db = await getDb();
    const { id } = await params;

    const hotelsCollection = db.collection('hotels');
    const roomsCollection = db.collection('rooms');
    const reviewsCollection = db.collection('hotel_reviews');
    const pricingCollection = db.collection('room_pricing');
    const availabilityCollection = db.collection('room_availability');

    // Delete related records first
    await reviewsCollection.deleteMany({ hotelId: id });

    const rooms = await roomsCollection.find({ hotelId: id }).toArray();

    for (const room of rooms) {
      await pricingCollection.deleteMany({ roomId: room._id.toString() });
      await availabilityCollection.deleteMany({ roomId: room._id.toString() });
    }

    await roomsCollection.deleteMany({ hotelId: id });

    await hotelsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json(
      { error: 'Failed to delete hotel' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
