import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST() {
  try {
    await client.connect();
    const db = await getDb();

    // Get all collections
    const collections = await db.listCollections().toArray();
    const backupData: Record<string, any[]> = {};

    // Export all data from each collection
    for (const collection of collections) {
      const data = await db.collection(collection.name).find({}).toArray();
      backupData[collection.name] = data.map((doc: any) => {
        // Convert ObjectId to string
        if (doc._id) {
          doc._id = doc._id.toString();
        }
        // Convert dates to ISO strings
        Object.keys(doc).forEach(key => {
          if (doc[key] instanceof Date) {
            doc[key] = doc[key].toISOString();
          }
        });
        return doc;
      });
    }

    // Create backup directory
    const backupDir = join(process.cwd(), 'backups');
    await mkdir(backupDir, { recursive: true });

    // Create backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json`;
    const filepath = join(backupDir, filename);

    // Write backup file
    await writeFile(filepath, JSON.stringify(backupData, null, 2));

    // Log the backup
    console.log(`[Backup] Created backup: ${filename}`);

    return NextResponse.json({
      success: true,
      message: 'Backup created successfully',
      data: {
        filename,
        createdAt: new Date().toISOString(),
        collectionsCount: collections.length,
        totalDocuments: Object.values(backupData).reduce((acc, arr) => acc + arr.length, 0),
      },
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create backup' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
