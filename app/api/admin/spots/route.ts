import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const spotsCollection = db.collection('spots');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const region = searchParams.get('region');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};

    if (isActive !== null && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    if (region && region !== 'all') {
      query.region = region;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await spotsCollection.countDocuments(query);
    const spots = await spotsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const spotsWithFormatted = spots.map((s: any) => ({
      ...s,
      id: s._id?.toString() || s.id,
      images: s.images || [],
      rating: s.rating || 0,
      reviewCount: s.reviewCount || 0,
      isActive: s.isActive !== false,
      createdAt: s.createdAt?.toISOString(),
      updatedAt: s.updatedAt?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: spotsWithFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching spots:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch spots', data: [] },
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
    const spotsCollection = db.collection('spots');

    const body = await request.json();

    const {
      name,
      slug,
      description,
      location,
      region,
      type,
      images,
      bestTime,
      ticketPrice,
      highlights,
      tips,
      isActive,
    } = body;

    if (!name || !description || !location) {
      return NextResponse.json(
        { success: false, message: 'Name, description and location are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const generatedSlug = slug || name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const spot = {
      name,
      slug: generatedSlug,
      description,
      location,
      region: region || 'north',
      type: type || 'other',
      images: images || [],
      highlights: highlights || [],
      tips: tips || [],
      bestTime: bestTime || '',
      ticketPrice: ticketPrice || '',
      rating: 0,
      reviewCount: 0,
      tourCount: 0,
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await spotsCollection.insertOne(spot);

    return NextResponse.json(
      {
        success: true,
        message: 'Spot created successfully',
        data: { ...spot, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating spot:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create spot' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
