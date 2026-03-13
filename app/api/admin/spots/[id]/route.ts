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
    const spotsCollection = db.collection('spots');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid spot ID' },
        { status: 400 }
      );
    }

    const spot = await spotsCollection.findOne({ _id: new ObjectId(id) });

    if (!spot) {
      return NextResponse.json(
        { success: false, message: 'Spot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...spot,
        id: spot._id?.toString(),
        images: spot.images || [],
        highlights: spot.highlights || [],
        tips: spot.tips || [],
        rating: spot.rating || 0,
        reviewCount: spot.reviewCount || 0,
        isActive: spot.isActive !== false,
        createdAt: spot.createdAt?.toISOString(),
        updatedAt: spot.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching spot:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch spot' },
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
    const spotsCollection = db.collection('spots');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid spot ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      description,
      location,
      region,
      type,
      images,
      highlights,
      tips,
      bestTime,
      ticketPrice,
      isActive,
    } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (region !== undefined) updateData.region = region;
    if (type !== undefined) updateData.type = type;
    if (images !== undefined) updateData.images = images;
    if (highlights !== undefined) updateData.highlights = highlights;
    if (tips !== undefined) updateData.tips = tips;
    if (bestTime !== undefined) updateData.bestTime = bestTime;
    if (ticketPrice !== undefined) updateData.ticketPrice = ticketPrice;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await spotsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Spot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Spot updated successfully',
      data: {
        ...result,
        id: result._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating spot:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update spot' },
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
    const spotsCollection = db.collection('spots');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid spot ID' },
        { status: 400 }
      );
    }

    const result = await spotsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Spot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Spot deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting spot:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete spot' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
