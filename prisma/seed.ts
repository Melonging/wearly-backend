import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  // 1. 카테고리 생성
  console.log("📦 카테고리 생성 중...");
  const categories = [
    { name: "상의" },
    { name: "아우터" },
    { name: "바지" },
    { name: "스커트/원피스" },
    { name: "신발" },
    { name: "가방" },
    { name: "소품" },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name },
    });
    if (!existing) {
      await prisma.category.create({
        data: category,
      });
    }
  }
  console.log("✅ 카테고리 생성 완료!");

  // 2. 옷장 템플릿 생성
  console.log("📋 옷장 템플릿 생성 중...");

  // 옷장 템플릿 1
  const closetTemplate1 = await prisma.closetTemplate.upsert({
    where: { closet_template_id: 1 },
    update: {},
    create: {
      template_name: "기본 옷장",
    },
  });

  // 옷장 템플릿 2
  const closetTemplate2 = await prisma.closetTemplate.upsert({
    where: { closet_template_id: 2 },
    update: {},
    create: {
      template_name: "서랍장",
    },
  });

  // 옷장 템플릿 3
  const closetTemplate3 = await prisma.closetTemplate.upsert({
    where: { closet_template_id: 3 },
    update: {},
    create: {
      template_name: "신발장",
    },
  });

  console.log("✅ 옷장 템플릿 생성 완료!");

  // 3. 섹션 템플릿 생성
  console.log("🗂️  섹션 템플릿 생성 중...");

  // 옷장1 - 행거 섹션
  await prisma.sectionTemplate.upsert({
    where: { section_template_id: 1 },
    update: {},
    create: {
      closet_template_id: closetTemplate1.closet_template_id,
      section_type: "행거",
      position_order: 1,
      default_name: "행거1",
    },
  });

  await prisma.sectionTemplate.upsert({
    where: { section_template_id: 2 },
    update: {},
    create: {
      closet_template_id: closetTemplate1.closet_template_id,
      section_type: "행거",
      position_order: 2,
      default_name: "행거2",
    },
  });

  // 서랍장1 - 서랍 섹션
  await prisma.sectionTemplate.upsert({
    where: { section_template_id: 3 },
    update: {},
    create: {
      closet_template_id: closetTemplate2.closet_template_id,
      section_type: "서랍",
      position_order: 1,
      default_name: "서랍1",
    },
  });

  await prisma.sectionTemplate.upsert({
    where: { section_template_id: 4 },
    update: {},
    create: {
      closet_template_id: closetTemplate2.closet_template_id,
      section_type: "서랍",
      position_order: 2,
      default_name: "서랍2",
    },
  });

  await prisma.sectionTemplate.upsert({
    where: { section_template_id: 5 },
    update: {},
    create: {
      closet_template_id: closetTemplate2.closet_template_id,
      section_type: "서랍",
      position_order: 3,
      default_name: "서랍3",
    },
  });

  // 신발장1 - 선반 섹션
  await prisma.sectionTemplate.upsert({
    where: { section_template_id: 6 },
    update: {},
    create: {
      closet_template_id: closetTemplate3.closet_template_id,
      section_type: "선반",
      position_order: 1,
      default_name: "선반1",
    },
  });

  await prisma.sectionTemplate.upsert({
    where: { section_template_id: 7 },
    update: {},
    create: {
      closet_template_id: closetTemplate3.closet_template_id,
      section_type: "선반",
      position_order: 2,
      default_name: "선반2",
    },
  });

  console.log("✅ 섹션 템플릿 생성 완료!");

  // 4. 테스트 유저 생성 (옵션)
  console.log("👤 테스트 유저 생성 중...");
  const testUser = await prisma.user.upsert({
    where: { user_loginID: "testuser" },
    update: {},
    create: {
      user_loginID: "testuser",
      email: "test@example.com",
      name: "테스트 유저",
      password: "$2b$10$YourHashedPasswordHere", // 실제로는 bcrypt로 해시된 비밀번호
      gender: "PREFER_NOT_TO_SAY",
      birthDate: new Date("1990-01-01"),
    },
  });
  console.log("✅ 테스트 유저 생성 완료!");

  // 5. 테스트 유저의 옷장 생성
  console.log("🏠 테스트 유저 옷장 생성 중...");

  const closet1 = await prisma.closet.upsert({
    where: { closet_id: 1 },
    update: {},
    create: {
      closet_template_id: closetTemplate1.closet_template_id,
      user_id: testUser.user_id,
      closet_name: "옷장1",
    },
  });

  const closet2 = await prisma.closet.upsert({
    where: { closet_id: 2 },
    update: {},
    create: {
      closet_template_id: closetTemplate2.closet_template_id,
      user_id: testUser.user_id,
      closet_name: "서랍장1",
    },
  });

  const closet3 = await prisma.closet.upsert({
    where: { closet_id: 3 },
    update: {},
    create: {
      closet_template_id: closetTemplate3.closet_template_id,
      user_id: testUser.user_id,
      closet_name: "신발장1",
    },
  });

  console.log("✅ 테스트 유저 옷장 생성 완료!");

  // 6. 섹션 생성
  console.log("📂 섹션 생성 중...");

  // 옷장1의 섹션
  await prisma.section.create({
    data: {
      section_template_id: 1,
      closet_id: closet1.closet_id,
      name: "행거1",
    },
  });

  await prisma.section.create({
    data: {
      section_template_id: 2,
      closet_id: closet1.closet_id,
      name: "행거2",
    },
  });

  // 서랍장1의 섹션
  await prisma.section.create({
    data: {
      section_template_id: 3,
      closet_id: closet2.closet_id,
      name: "서랍1",
    },
  });

  await prisma.section.create({
    data: {
      section_template_id: 4,
      closet_id: closet2.closet_id,
      name: "서랍2",
    },
  });

  await prisma.section.create({
    data: {
      section_template_id: 5,
      closet_id: closet2.closet_id,
      name: "서랍3",
    },
  });

  // 신발장1의 섹션
  await prisma.section.create({
    data: {
      section_template_id: 6,
      closet_id: closet3.closet_id,
      name: "선반1",
    },
  });

  await prisma.section.create({
    data: {
      section_template_id: 7,
      closet_id: closet3.closet_id,
      name: "선반2",
    },
  });

  console.log("✅ 섹션 생성 완료!");

  console.log("🎉 모든 시드 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 데이터 생성 중 오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
