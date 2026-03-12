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

    const restaurantsCollection = db.collection('restaurants');
    const reviewsCollection = db.collection('restaurant_reviews');
    const bookingsCollection = db.collection('restaurant_bookings');

    const restaurant = await restaurantsCollection.findOne({ _id: new ObjectId(id) });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Get reviews
    const reviews = await reviewsCollection
      .find({ restaurantId: id })
      .sort({ createdAt: -1 })
      .toArray();

    // Get bookings
    const bookings = await bookingsCollection
      .find({ restaurantId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        ...restaurant,
        _id: restaurant._id?.toString(),
        reviews: reviews.map(r => ({ ...r, _id: r._id?.toString() })),
        bookings: bookings.map(b => ({ ...b, _id: b._id?.toString() })),
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant' },
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
    const body = await request.json();

    const restaurantsCollection = db.collection('restaurants');

    const updateData = {
      name: body.name,
      description: body.description || '',
      address: body.address,
      city: body.city,
      cuisineType: body.cuisineType,
      priceRange: body.priceRange,
      style: body.style,
      openingHours: body.openingHours,
      closingHours: body.closingHours,
      images: body.images || [],
      contactPhone: body.contactPhone || '',
      menu: body.menu || [],
      isActive: body.isActive ?? true,
      updatedAt: new Date().toISOString(),
    };

    const restaurant = await restaurantsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...restaurant, _id: restaurant._id?.toString() }
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update restaurant' },
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

    const restaurantsCollection = db.collection('restaurants');
    const reviewsCollection = db.collection('restaurant_reviews');
    const bookingsCollection = db.collection('restaurant_bookings');

    // Delete related data first
    await reviewsCollection.deleteMany({ restaurantId: id });
    await bookingsCollection.deleteMany({ restaurantId: id });

    const result = await restaurantsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete restaurant' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
