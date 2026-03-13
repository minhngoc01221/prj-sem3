import { NextRequest, NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/adminAuth';

// GET settings - requires auth
export async function GET(request: NextRequest) {
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
    const settingsCollection = db.collection('settings');

    const settings = await settingsCollection.find({}).toArray();
    
    // Convert to key-value object
    const settingsObj: Record<string, any> = {};
    settings.forEach((s: any) => {
      try {
        settingsObj[s.key] = s.type === 'json' ? JSON.parse(s.value) : s.value;
      } catch {
        settingsObj[s.key] = s.value;
      }
    });

    return NextResponse.json({
      success: true,
      data: settingsObj,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
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
    const settingsCollection = db.collection('settings');

    const body = await request.json();
    const { key, value, type = 'text' } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, message: 'Key is required' },
        { status: 400 }
      );
    }

    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    await settingsCollection.updateOne(
      { key },
      { 
        $set: { 
          value: stringValue, 
          type,
          updatedAt: new Date() 
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update setting' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
