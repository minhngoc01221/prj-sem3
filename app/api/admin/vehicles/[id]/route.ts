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
    const vehiclesCollection = db.collection('transports');

    const { id } = await params;

    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }

    const vehicle = await vehiclesCollection.findOne(query);

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const formattedVehicle = {
      ...vehicle,
      id: vehicle._id?.toString() || vehicle.id,
      provider: vehicle.company,
      route: vehicle.route ? `${vehicle.departure} → ${vehicle.arrival}` : '',
      departure: vehicle.departure,
      arrival: vehicle.arrival,
      schedule: vehicle.schedule ? vehicle.schedule.split(',').map((s: string) => s.trim()) : [],
      isActive: vehicle.isActive !== false,
      createdAt: vehicle.createdAt?.toISOString(),
      updatedAt: vehicle.updatedAt?.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedVehicle,
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicle' },
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
    const vehiclesCollection = db.collection('transports');

    const { id } = await params;
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
      isActive,
    } = body;

    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (provider) updateData.company = provider;
    if (departure) {
      updateData.departure = departure;
      updateData.route = `${departure} → ${arrival || ''}`;
    }
    if (arrival) {
      updateData.arrival = arrival;
      updateData.route = `${departure || ''} → ${arrival}`;
    }
    if (schedule) {
      updateData.schedule = Array.isArray(schedule) ? schedule.join(', ') : schedule;
    }
    if (price !== undefined) updateData.price = price;
    if (images) updateData.images = images;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (amenities) updateData.amenities = amenities;
    if (duration) updateData.duration = duration;
    if (contact) updateData.contact = contact;
    if (description) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await vehiclesCollection.updateOne(query, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const updatedVehicle = await vehiclesCollection.findOne(query);

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle,
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update vehicle' },
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
    const vehiclesCollection = db.collection('transports');

    const { id } = await params;

    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }

    const result = await vehiclesCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete vehicle' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
