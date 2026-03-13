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
    const contactsCollection = db.collection('contacts');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid contact ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { replyMessage, repliedBy } = body;

    if (!replyMessage || !replyMessage.trim()) {
      return NextResponse.json(
        { success: false, message: 'Reply message is required' },
        { status: 400 }
      );
    }

    // Update contact with reply
    const result = await contactsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          replyMessage,
          repliedBy: repliedBy || 'Admin',
          repliedAt: new Date(),
          status: 'replied',
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }

    // In production, send email here using nodemailer/sendgrid
    // For now, we just save the reply to database
    console.log(`[Email Simulation] Sending reply to ${result.email}: ${replyMessage.substring(0, 50)}...`);

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        ...result,
        id: result._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send reply' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
