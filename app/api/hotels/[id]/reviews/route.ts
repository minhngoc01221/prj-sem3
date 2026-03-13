import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = await getDb();
    const { id: hotelId } = await params;

    const reviewsCollection = db.collection('hotel_reviews');
    const hotelsCollection = db.collection('hotels');
    const body = await request.json();

    const {
      userId,
      userName,
      userAvatar,
      rating,
      comment,
      images,
    } = body;

    const review = {
      hotelId,
      userId: userId || null,
      userName: userName || 'Anonymous',
      userAvatar: userAvatar || null,
      rating: rating || 5,
      comment: comment || '',
      images: images || [],
      createdAt: new Date(),
    };

    const result = await reviewsCollection.insertOne(review);

    // Update hotel rating
    const allReviews = await reviewsCollection.find({ hotelId }).toArray();

    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / allReviews.length;

      await hotelsCollection.updateOne(
        { _id: new ObjectId(hotelId) },
        { $set: { rating: avgRating } }
      );
    }

    return NextResponse.json(
      { ...review, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
