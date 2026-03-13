import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/restaurants - Get all restaurants
export async function GET(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const cuisineType = searchParams.get('cuisineType');
    const priceRange = searchParams.get('priceRange');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    const restaurantsCollection = db.collection('restaurants');
    
    const query: any = {};
    
    if (city && city !== 'all') query.city = city;
    if (cuisineType && cuisineType !== 'all') query.cuisineType = cuisineType;
    if (priceRange && priceRange !== 'all') query.priceRange = priceRange;
    if (isActive !== null && isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const restaurants = await restaurantsCollection.find(query).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: restaurants.map(r => ({
        ...r,
        _id: r._id?.toString(),
      }))
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST /api/restaurants - Create new restaurant
export async function POST(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const body = await request.json();
    
    const restaurantsCollection = db.collection('restaurants');
    
    const newRestaurant = {
      name: body.name,
      description: body.description || '',
      address: body.address,
      city: body.city,
      cuisineType: body.cuisineType,
      priceRange: body.priceRange || 'medium',
      style: body.style || 'restaurant',
      openingHours: body.openingHours || '07:00 - 22:00',
      closingHours: body.closingHours || '22:00',
      images: body.images || [],
      rating: 0,
      reviewCount: 0,
      isActive: true,
      contactPhone: body.contactPhone || '',
      menu: body.menu || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = await restaurantsCollection.insertOne(newRestaurant);
    
    return NextResponse.json({
      success: true,
      data: { ...newRestaurant, _id: result.insertedId.toString() }
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create restaurant' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
