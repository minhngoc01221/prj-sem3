import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAdminAuth } from '@/lib/adminAuth';

// GET all users - requires auth
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
    const usersCollection = db.collection('users');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await usersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const usersWithFormatted = users.map((u: any) => ({
      ...u,
      id: u._id?.toString() || u.id,
      createdAt: u.createdAt?.toISOString(),
      lastLogin: u.lastLogin?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: usersWithFormatted,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  // Require admin role to create users
  const authResult = await verifyAdminAuth(request);
  
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, message: authResult.error },
      { status: 401 }
    );
  }

  // Only admin can create users
  if (authResult.user?.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Chỉ admin mới có quyền tạo người dùng" },
      { status: 403 }
    );
  }

  try {
    await client.connect();
    const db = await getDb();
    const usersCollection = db.collection('users');

    const body = await request.json();

    const {
      name,
      email,
      phone,
      role,
      password,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    const user = {
      name,
      email,
      phone: phone || '',
      role: role || 'staff',
      status: 'active',
      password: password || 'default_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: { ...user, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
