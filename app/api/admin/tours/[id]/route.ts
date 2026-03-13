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
    const toursCollection = db.collection('tour_packages');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid tour ID' },
        { status: 400 }
      );
    }

    const tour = await toursCollection.findOne({ _id: new ObjectId(id) });

    if (!tour) {
      return NextResponse.json(
        { success: false, message: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...tour,
        id: tour._id?.toString(),
        destinations: tour.destinations || [],
        itinerary: tour.itinerary || [],
        includes: tour.includes || [],
        images: tour.images || [],
        price: tour.price || 0,
        discount: tour.discount || 0,
        rating: tour.rating || 0,
        isActive: tour.isActive !== false,
        bookingCount: 0,
        createdAt: tour.createdAt?.toISOString(),
        updatedAt: tour.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tour' },
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
    const toursCollection = db.collection('tour_packages');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid tour ID' },
        { status: 400 }
      );
    }

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
      isActive,
    } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (itinerary !== undefined) updateData.itinerary = itinerary;
    if (includes !== undefined) updateData.includes = includes;
    if (price !== undefined) updateData.price = Number(price);
    if (discount !== undefined) updateData.discount = Number(discount);
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (destinations !== undefined) updateData.destinations = Array.isArray(destinations) ? destinations : [destinations];
    if (images !== undefined) updateData.images = images;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await toursCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tour updated successfully',
      data: {
        ...result,
        id: result._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update tour' },
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
    const toursCollection = db.collection('tour_packages');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid tour ID' },
        { status: 400 }
      );
    }

    const result = await toursCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete tour' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
