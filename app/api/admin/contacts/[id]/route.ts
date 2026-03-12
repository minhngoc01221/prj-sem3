import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const contactsCollection = db.collection('contacts');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid contact ID' },
        { status: 400 }
      );
    }

    const contact = await contactsCollection.findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }

    // Auto-update to "read" status when viewing (F213)
    if (contact.status === 'unread') {
      await contactsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'read', updatedAt: new Date() } }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...contact,
        id: contact._id?.toString(),
        createdAt: contact.createdAt?.toISOString(),
        updatedAt: contact.updatedAt?.toISOString(),
        desiredDate: contact.desiredDate?.toISOString(),
        repliedAt: contact.repliedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact' },
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
    const db = getDb();
    const contactsCollection = db.collection('contacts');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid contact ID' },
        { status: 400 }
      );
    }

    const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete contact' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
