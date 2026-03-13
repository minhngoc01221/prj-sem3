import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const toursCollection = db.collection('tour_packages');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    const query: any = {};

    if (isActive !== null && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destinations: { $regex: search, $options: 'i' } },
      ];
    }

    const tours = await toursCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const toursWithFormatted = tours.map((t: any) => ({
      ...t,
      id: t._id?.toString() || t.id,
      destinations: t.destinations || [],
      itinerary: t.itinerary || [],
      includes: t.includes || [],
      images: t.images || [],
      price: t.price || 0,
      discount: t.discount || 0,
      rating: t.rating || 0,
      isActive: t.isActive !== false,
      bookingCount: 0,
      createdAt: t.createdAt?.toISOString(),
      updatedAt: t.updatedAt?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: toursWithFormatted,
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tours', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const toursCollection = db.collection('tour_packages');

    const body = await request.json();

    const {
      name,
      description,
      duration,
      itinerary,
      includes,
      price,
      discount,
      startDate,
      endDate,
      destinations,
      images,
    } = body;

    if (!name || !description || !duration || !price || !destinations) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tour = {
      name,
      description,
      duration,
      itinerary: itinerary || [],
      includes: includes || [],
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      destinations: Array.isArray(destinations) ? destinations : [destinations],
      images: images || [],
      rating: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await toursCollection.insertOne(tour);

    return NextResponse.json(
      {
        success: true,
        message: 'Tour created successfully',
        data: { ...tour, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create tour' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
