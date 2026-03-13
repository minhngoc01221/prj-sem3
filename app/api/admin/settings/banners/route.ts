import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    await client.connect();
    const db = await getDb();
    const bannersCollection = db.collection('banners');

    const banners = await bannersCollection.find({}).sort({ position: 1 }).toArray();

    return NextResponse.json({
      success: true,
      data: banners.map((b: any) => ({
        ...b,
        id: b._id?.toString(),
        createdAt: b.createdAt?.toISOString(),
        updatedAt: b.updatedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch banners' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    await client.connect();
    const db = await getDb();
    const bannersCollection = db.collection('banners');

    const body = await request.json();
    const { title, description, imageUrl, linkUrl, position, isActive, startDate, endDate } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    const banner = {
      title,
      description: description || '',
      imageUrl,
      linkUrl: linkUrl || '',
      position: position || 0,
      isActive: isActive !== false,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await bannersCollection.insertOne(banner);

    return NextResponse.json({
      success: true,
      message: 'Banner created successfully',
      data: { ...banner, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create banner' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(request: Request) {
  try {
    await client.connect();
    const db = await getDb();
    const bannersCollection = db.collection('banners');

    const body = await request.json();
    const { id, title, description, imageUrl, linkUrl, position, isActive, startDate, endDate } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const { ObjectId } = await import('mongodb');
    const updateData: any = { updatedAt: new Date() };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (position !== undefined) updateData.position = position;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    const result = await bannersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update banner' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(request: Request) {
  try {
    await client.connect();
    const db = await getDb();
    const bannersCollection = db.collection('banners');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const { ObjectId } = await import('mongodb');
    const result = await bannersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete banner' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
