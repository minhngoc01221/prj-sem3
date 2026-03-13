import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = await getDb();
    const hotelsCollection = db.collection('hotels');

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const starRating = searchParams.get('starRating');
    const search = searchParams.get('search');

    const query: any = {};

    if (city && city !== 'all') {
      query.city = city;
    }

    if (starRating && starRating !== 'all') {
      query.starRating = parseInt(starRating);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const hotels = await hotelsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Get rooms, pricing, availability, and reviews for each hotel
    const roomsCollection = db.collection('rooms');
    const reviewsCollection = db.collection('hotel_reviews');
    const pricingCollection = db.collection('room_pricing');
    const availabilityCollection = db.collection('room_availability');

    const hotelsWithDetails = await Promise.all(
      hotels.map(async (hotel: any) => {
        const rooms = await roomsCollection
          .find({ hotelId: hotel._id.toString() })
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
          .find({ hotelId: hotel._id.toString() })
          .sort({ createdAt: -1 })
          .toArray();

        return { ...hotel, roomTypes: roomsWithDetails, reviews };
      })
    );

    return NextResponse.json(hotelsWithDetails);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    await client.connect();
    const db = await getDb();
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
    } = body;

    const hotel = {
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
      rating: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await hotelsCollection.insertOne(hotel);

    return NextResponse.json(
      { ...hotel, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
