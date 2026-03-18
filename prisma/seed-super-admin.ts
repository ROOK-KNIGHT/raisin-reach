import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@raisinreach.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  console.log('🔍 Checking for existing super admin...');

  // Check if super admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: 'SUPER_ADMIN',
    },
  });

  if (existingAdmin) {
    console.log('✅ Super admin already exists:', existingAdmin.email);
    console.log('   To update, delete the existing user first.');
    return;
  }

  // Check if user with this email exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('📧 User with this email exists. Updating to SUPER_ADMIN role...');
    const updated = await prisma.user.update({
      where: { email },
      data: {
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✅ Updated user to SUPER_ADMIN:', updated.email);
    return;
  }

  // Create new super admin
  console.log('🔐 Hashing password...');
  const hashedPassword = await bcrypt.hash(password, 12);

  console.log('👤 Creating super admin user...');
  const superAdmin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      membershipStatus: 'ACTIVE',
    },
  });

  console.log('✅ Super admin created successfully!');
  console.log('📧 Email:', superAdmin.email);
  console.log('🔑 Password:', password);
  console.log('⚠️  IMPORTANT: Change this password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
