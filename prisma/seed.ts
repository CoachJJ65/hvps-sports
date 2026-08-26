import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password_hash = await bcrypt.hash('changeme-admin', 12);

  await prisma.user.upsert({
    where: { email: 'admin@hvps.local' },
    update: {},
    create: {
      email: 'admin@hvps.local',
      name: 'HVPS Admin',
      role: Role.ADMIN,
      password_hash,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
