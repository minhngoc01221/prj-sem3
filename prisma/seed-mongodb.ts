import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const url = process.env.DATABASE_URL || 'mongodb+srv://root:randompassword@cluster0.ab1cd.mongodb.net/project_travel?retryWrites=true&w=majority';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const existingUser = await users.findOne({ email: 'admin@karnel.com' });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    const result = await users.insertOne({
      email: 'admin@karnel.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Admin user created:', result.insertedId);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

main();
