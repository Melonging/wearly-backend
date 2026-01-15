import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//섹션 정보 조회 (옷장 이름 포함)
export const findSectionWithCloset = async (sectionId: number) => {
  return await prisma.section.findUnique({
    where: { section_id: sectionId },
    include: {
      closet: {
        select: {
          closet_name: true,
        },
      },
    },
  });
};

//섹션에 속한 옷들 조회
export const findClothesBySection = async (sectionId: number, userId: number) => {
  return await prisma.clothing.findMany({
    where: {
      section_id: sectionId,
      user_id: userId, // 본인 옷만 조회
    },
    include: {
      categorySub: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc', // 최신순
    },
  });
};

// 섹션 소유자 확인 (권한 검증)
export const checkSectionOwnership = async (sectionId: number, userId: number) => {
  const section = await prisma.section.findFirst({
    where: {
      section_id: sectionId,
      closet: {
        user_id: userId,
      },
    },
  });
  return section !== null;
};