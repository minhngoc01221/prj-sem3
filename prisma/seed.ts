import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  try {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@karnel.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        isActive: true,
      },
    });
    console.log('Admin user created:', admin);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin:', error);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
