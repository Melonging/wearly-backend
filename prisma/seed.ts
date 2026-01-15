import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("�� 시드 시작...");

  const user1 = await prisma.user.upsert({
    where: { user_loginID: "testuser1" },
    update: {},
    create: {
      user_loginID: "testuser1",
      name: "김철수",
      password: "$2b$10$hash",
      gender: "MALE",
      birthDate: new Date("1995-05-15"),
    },
  });

  const closetTemplate = await prisma.closetTemplate.create({
    data: { template_name: "기본 옷장" },
  });

  const sectionTemplate = await prisma.sectionTemplate.create({
    data: {
      closet_template_id: closetTemplate.closet_template_id,
      section_type: "top",
      position_order: 1,
      default_name: "상의",
    },
  });

  const category = await prisma.categoryMain.create({
    data: {
      name: "상의",
      subs: { create: [{ name: "티셔츠" }] },
    },
  });

  const closet = await prisma.closet.create({
    data: {
      user_id: user1.user_id,
      closet_template_id: closetTemplate.closet_template_id,
      closet_name: "여름 옷장",
    },
  });

  const section = await prisma.section.create({
    data: {
      section_template_id: sectionTemplate.section_template_id,
      closet_id: closet.closet_id,
      name: "상의",
    },
  });

  const cat = await prisma.categorySub.findFirst({ where: { name: "티셔츠" } });

  if (cat) {
    await prisma.clothing.create({
      data: {
        user_id: user1.user_id,
        closet_id: closet.closet_id,
        section_id: section.section_id,
        categorySub_id: cat.categorySub_id,
        season: "SUMMER",
        color: "WHITE",
        temperature: 25,
        image: "https://via.placeholder.com/300x400",
      },
    });
  }

  console.log("✅ 완료!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
