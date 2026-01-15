import { PrismaClient, Gender } from "@prisma/client";
const prisma = new PrismaClient();

export const getClosetsInfo = async (userId: number) => {
  const closets = await prisma.closet.findMany({
    where: {
      user_id: userId, //로그인 정보에서 기본으로 들어가는 거 어떻게 하지?
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
