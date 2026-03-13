import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    await client.connect();
    const db = await getDb();
    const menuCollection = db.collection('navigation_menus');

    const menus = await menuCollection.find({}).sort({ position: 1 }).toArray();

    return NextResponse.json({
      success: true,
      data: menus.map((m: any) => ({
        ...m,
        id: m._id?.toString(),
        createdAt: m.createdAt?.toISOString(),
        updatedAt: m.updatedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch menus' },
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
    const menuCollection = db.collection('navigation_menus');

    const body = await request.json();
    const { name, url, icon, position, parentId, isActive } = body;

    if (!name || !url) {
      return NextResponse.json(
        { success: false, message: 'Name and URL are required' },
        { status: 400 }
      );
    }

    const menu = {
      name,
      url,
      icon: icon || null,
      position: position || 0,
      parentId: parentId || null,
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await menuCollection.insertOne(menu);

    return NextResponse.json({
      success: true,
      message: 'Menu created successfully',
      data: { ...menu, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create menu' },
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
    const menuCollection = db.collection('navigation_menus');

    const body = await request.json();
    const { id, name, url, icon, position, parentId, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Menu ID is required' },
        { status: 400 }
      );
    }

    const { ObjectId } = await import('mongodb');
    const updateData: any = { updatedAt: new Date() };
    
    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (icon !== undefined) updateData.icon = icon;
    if (position !== undefined) updateData.position = position;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await menuCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update menu' },
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
    const menuCollection = db.collection('navigation_menus');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Menu ID is required' },
        { status: 400 }
      );
    }

    const { ObjectId } = await import('mongodb');
    const result = await menuCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete menu' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
