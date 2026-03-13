import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = await getDb();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'tour' | 'hotel'
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    let results: any[] = [];

    if (type === 'tour') {
      const toursCollection = db.collection('tour_packages');
      const tours = await toursCollection
        .find({
          name: { $regex: search, $options: 'i' }
        })
        .limit(limit)
        .toArray();

      results = tours.map((t: any) => ({
        id: t._id?.toString() || t.id,
        name: t.name,
        type: 'tour',
        price: t.price,
      }));
    } else if (type === 'hotel') {
      const hotelsCollection = db.collection('hotels');
      const hotels = await hotelsCollection
        .find({
          name: { $regex: search, $options: 'i' }
        })
        .limit(limit)
        .toArray();

      results = hotels.map((h: any) => ({
        id: h._id?.toString() || h.id,
        name: h.name,
        type: 'hotel',
        price: h.priceMin,
      }));
    } else {
      // Get both tours and hotels
      const toursCollection = db.collection('tour_packages');
      const hotelsCollection = db.collection('hotels');

      const [tours, hotels] = await Promise.all([
        toursCollection
          .find({ name: { $regex: search, $options: 'i' } })
          .limit(limit)
          .toArray(),
        hotelsCollection
          .find({ name: { $regex: search, $options: 'i' } })
          .limit(limit)
          .toArray(),
      ]);

      results = [
        ...tours.map((t: any) => ({
          id: t._id?.toString() || t.id,
          name: t.name,
          type: 'tour',
          price: t.price,
        })),
        ...hotels.map((h: any) => ({
          id: h._id?.toString() || h.id,
          name: h.name,
          type: 'hotel',
          price: h.priceMin,
        })),
      ].slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error searching targets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
