import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 모든 카테고리 불러오기
export const getCategoryList = async () => {
  const categories = await prisma.category.findMany({
    select: {
      category_id: true,
      name: true,
    },
  });

  console.log("모든 카테고리 조회 결과:", categories);

  if (!categories) {
    return null;
  }
  return categories;
};

// 선택한 카테고리의 모든 옷 불러오기
