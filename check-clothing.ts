import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const clothes = await prisma.clothing.findMany();
  console.log('모든 옷:', JSON.stringify(clothes, null, 2));
  await prisma.$disconnect();
}

check();
