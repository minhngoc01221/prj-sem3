import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/adminAuth';

// GET vehicles - requires auth
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
    const vehiclesCollection = db.collection('transports');

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const provider = searchParams.get('provider');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const query: any = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (provider && provider !== 'all') {
      query.company = { $regex: provider, $options: 'i' };
    }

    if (isActive !== null && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { route: { $regex: search, $options: 'i' } },
      ];
    }

    const vehicles = await vehiclesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const vehiclesWithFormatted = vehicles.map((v: any) => ({
      ...v,
      id: v._id?.toString() || v.id,
      provider: v.company,
      route: v.route ? `${v.departure} → ${v.arrival}` : '',
      departure: v.departure,
      arrival: v.arrival,
      schedule: v.schedule ? v.schedule.split(',').map((s: string) => s.trim()) : [],
      isActive: v.isActive !== false,
      createdAt: v.createdAt?.toISOString(),
      updatedAt: v.updatedAt?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: vehiclesWithFormatted,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicles', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  // Require auth for creating vehicles
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
    const vehiclesCollection = db.collection('transports');

    const body = await request.json();

    const {
      name,
      type,
      provider,
      departure,
      arrival,
      schedule,
      price,
      images,
      capacity,
      amenities,
      duration,
      contact,
      description,
    } = body;

    if (!name || !type || !provider || !departure || !arrival) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vehicle = {
      name,
      type,
      company: provider,
      route: `${departure} → ${arrival}`,
      departure,
      arrival,
      schedule: Array.isArray(schedule) ? schedule.join(', ') : schedule || '',
      price: price || 0,
      capacity: capacity || 0,
      duration: duration || '',
      contact: contact || '',
      description: description || '',
      amenities: amenities || [],
      images: images || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await vehiclesCollection.insertOne(vehicle);

    return NextResponse.json(
      {
        success: true,
        message: 'Vehicle created successfully',
        data: { ...vehicle, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create vehicle' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
