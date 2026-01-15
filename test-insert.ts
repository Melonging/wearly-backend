import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 테스트 옷 데이터 추가
  const clothing = await prisma.clothing.create({
    data: {
      user_id: 1,
      closet_id: 1,
      section_id: 1,
      categorySub_id: 1,
      season: 'SUMMER',
      color: 'WHITE',
      temperature: 25,
      image: 'https://via.placeholder.com/300x400?text=Test+Clothing',
    },
  });

  console.log('✅ 테스트 옷 생성 완료:', clothing);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
