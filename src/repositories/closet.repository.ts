import { PrismaClient } from '@prisma/client';

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

// 옷장 정보 조회 (템플릿 정보 포함)
export const findClosetWithTemplate = async (closetId: number, userId: number) => {
  return await prisma.closet.findFirst({
    where: {
      closet_id: closetId,
      user_id: userId,
    },
    include: {
      closetTemplate: {
        select: {
          template_name: true,
        },
      },
    },
  });
};

// 옷장의 섹션 목록 조회 (섹션 타입, 별명, 옷 개수 포함)
export const findSectionsByClosetId = async (closetId: number) => {
  return await prisma.section.findMany({
    where: {
      closet_id: closetId,
    },
    include: {
      sectionTemplate: {
        select: {
          section_type: true,
          default_name: true,
        },
      },
      _count: {
        select: {
          clothings: true,
        },
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });
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