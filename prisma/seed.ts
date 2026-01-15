// 더미 데이터 넣는 파일. npx tsx prisma/seed.ts 로 실행. 지워도 됨.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  // 1. 테스트 유저 생성
  const user1 = await prisma.user.upsert({
    where: { user_loginID: "testuser1" },
    update: {},
    create: {
      user_loginID: "testuser1",
      name: "김철수",
      password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456", // 해시된 비밀번호
      gender: "MALE",
      birthDate: new Date("1995-05-15"),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { user_loginID: "testuser2" },
    update: {},
    create: {
      user_loginID: "testuser2",
      name: "이영희",
      password: "$2b$10$abcdefghijklmnopqrstuvwxyz123456",
      gender: "FEMALE",
      birthDate: new Date("1998-08-20"),
    },
  });

  console.log("✅ 유저 생성 완료:", user1.name, user2.name);

  // 2. 옷장 템플릿 생성
  const closetTemplate = await prisma.closetTemplate.upsert({
    where: { closet_template_id: 1 },
    update: {},
    create: {
      template_name: "기본 옷장",
    },
  });

  console.log("✅ 옷장 템플릿 생성 완료");

  // 3. 섹션 템플릿 생성
  const sectionTemplate1 = await prisma.sectionTemplate.create({
    data: {
      closet_template_id: closetTemplate.closet_template_id,
      section_type: "top",
      position_order: 1,
      default_name: "상의",
    },
  });

  const sectionTemplate2 = await prisma.sectionTemplate.create({
    data: {
      closet_template_id: closetTemplate.closet_template_id,
      section_type: "bottom",
      position_order: 2,
      default_name: "하의",
    },
  });

  console.log("✅ 섹션 템플릿 생성 완료");

  // 4. 카테고리 생성
  const categoryMain1 = await prisma.categoryMain.create({
    data: {
      name: "상의",
      subs: {
        create: [
          { name: "티셔츠", thumbnail_image: null },
          { name: "셔츠", thumbnail_image: null },
          { name: "후드티", thumbnail_image: null },
        ],
      },
    },
  });

  const categoryMain2 = await prisma.categoryMain.create({
    data: {
      name: "하의",
      subs: {
        create: [
          { name: "청바지", thumbnail_image: null },
          { name: "슬랙스", thumbnail_image: null },
          { name: "반바지", thumbnail_image: null },
        ],
      },
    },
  });

  console.log("✅ 카테고리 생성 완료");

  // 5. 옷장 생성 (user1용)
  const closet1 = await prisma.closet.create({
    data: {
      user_id: user1.user_id,
      closet_template_id: closetTemplate.closet_template_id,
      closet_name: "봄/여름 옷장",
    },
  });

  const closet2 = await prisma.closet.create({
    data: {
      user_id: user1.user_id,
      closet_template_id: closetTemplate.closet_template_id,
      closet_name: "가을/겨울 옷장",
    },
  });

  console.log("✅ 옷장 생성 완료:", closet1.closet_name, closet2.closet_name);

  // 6. 섹션 생성
  const section1 = await prisma.section.create({
    data: {
      section_template_id: sectionTemplate1.section_template_id,
      closet_id: closet1.closet_id,
      name: "여름 상의",
    },
  });

  const section2 = await prisma.section.create({
    data: {
      section_template_id: sectionTemplate2.section_template_id,
      closet_id: closet1.closet_id,
      name: "여름 하의",
    },
  });

  console.log("✅ 섹션 생성 완료");

  // 7. 옷 아이템 생성
  const tshirtCategory = await prisma.categorySub.findFirst({
    where: { name: "티셔츠" },
  });

  const jeansCategory = await prisma.categorySub.findFirst({
    where: { name: "청바지" },
  });

  if (tshirtCategory && jeansCategory) {
    await prisma.clothing.createMany({
      data: [
        {
          user_id: user1.user_id,
          closet_id: closet1.closet_id,
          section_id: section1.section_id,
          categorySub_id: tshirtCategory.categorySub_id,
          weather: "여름",
          color: "흰색",
          image: "https://via.placeholder.com/300x400?text=White+Tshirt",
        },
        {
          user_id: user1.user_id,
          closet_id: closet1.closet_id,
          section_id: section1.section_id,
          categorySub_id: tshirtCategory.categorySub_id,
          weather: "여름",
          color: "검정",
          image: "https://via.placeholder.com/300x400?text=Black+Tshirt",
        },
        {
          user_id: user1.user_id,
          closet_id: closet1.closet_id,
          section_id: section2.section_id,
          categorySub_id: jeansCategory.categorySub_id,
          weather: "사계절",
          color: "청색",
          image: "https://via.placeholder.com/300x400?text=Blue+Jeans",
        },
      ],
    });

    console.log("✅ 옷 아이템 생성 완료");
  }

  console.log("🎉 시드 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 데이터 생성 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
