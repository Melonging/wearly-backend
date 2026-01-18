import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getClosetsInfo = async (userId: number) => {
  const closets = await prisma.closet.findMany({
    where: {
      user_id: userId,
    },
    select: {
      closet_id: true,
      closet_name: true,
    },
  });

  console.log("옷장 정보 조회 결과:", closets);

  if (!closets) {
    return null;
  }
  return closets;
};

export const getClothingInfo = async (clothingId: number) => {
  const clothing = await prisma.clothing.findUnique({
    where: {
      clothing_id: clothingId,
    },
    select: {
      clothing_id: true,
      temperature: true,
      season: true,
      color: true,
      image: true,
      categorySub_id: true,
      section_id: true,
    },
  });
  
  console.log("옷 정보 조회 결과:", clothing);

  if (!clothing) {
    return null;
  }
  return clothing;
};

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
      user_id: userId,
    },
    include: {
      categorySub: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
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