import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    await client.connect();
    const db = getDb();
    const settingsCollection = db.collection('settings');

    const emailConfig = await settingsCollection.findOne({ key: 'email_config' });

    if (!emailConfig) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    // Parse and mask sensitive data
    const config = JSON.parse(emailConfig.value);
    if (config.password) {
      config.password = '••••••••';
    }

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error fetching email config:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch email config' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const settingsCollection = db.collection('settings');

    const body = await request.json();
    const { smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail, fromName, useTLS } = body;

    // Validate required fields
    if (!smtpHost || !smtpPort || !smtpUser || !fromEmail) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const config = {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword: smtpPassword || '', // Will be stored as-is
      fromEmail,
      fromName: fromName || 'System',
      useTLS: useTLS !== false,
      updatedAt: new Date().toISOString(),
    };

    await settingsCollection.updateOne(
      { key: 'email_config' },
      { 
        $set: { 
          value: JSON.stringify(config),
          type: 'json',
          updatedAt: new Date() 
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Email configuration saved successfully',
    });
  } catch (error) {
    console.error('Error saving email config:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save email config' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
