/*
  Warnings:

  - You are about to drop the column `categoryMain_id` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the column `closet_template_id` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the column `section_template_id` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the column `category_name` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `closet_template_id` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `template_id` on the `Section` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Closet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Closet" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Clothing" DROP COLUMN "categoryMain_id",
DROP COLUMN "closet_template_id",
DROP COLUMN "section_template_id";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "category_name",
DROP COLUMN "closet_template_id",
DROP COLUMN "template_id",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CategoryMain" (
    "categoryMain_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryMain_pkey" PRIMARY KEY ("categoryMain_id")
);

-- CreateTable
CREATE TABLE "CategorySub" (
    "categorySub_id" SERIAL NOT NULL,
    "categoryMain_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail_image" TEXT,

    CONSTRAINT "CategorySub_pkey" PRIMARY KEY ("categorySub_id")
);

-- CreateTable
CREATE TABLE "ClosetTemplate" (
    "closet_template_id" SERIAL NOT NULL,
    "template_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClosetTemplate_pkey" PRIMARY KEY ("closet_template_id")
);

-- CreateTable
CREATE TABLE "SectionTemplate" (
    "section_template_id" SERIAL NOT NULL,
    "closet_template_id" INTEGER NOT NULL,
    "section_type" TEXT NOT NULL,
    "position_order" INTEGER NOT NULL,
    "default_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionTemplate_pkey" PRIMARY KEY ("section_template_id")
);

-- AddForeignKey
ALTER TABLE "CategorySub" ADD CONSTRAINT "CategorySub_categoryMain_id_fkey" FOREIGN KEY ("categoryMain_id") REFERENCES "CategoryMain"("categoryMain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionTemplate" ADD CONSTRAINT "SectionTemplate_closet_template_id_fkey" FOREIGN KEY ("closet_template_id") REFERENCES "ClosetTemplate"("closet_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Closet" ADD CONSTRAINT "Closet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Closet" ADD CONSTRAINT "Closet_closet_template_id_fkey" FOREIGN KEY ("closet_template_id") REFERENCES "ClosetTemplate"("closet_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_section_template_id_fkey" FOREIGN KEY ("section_template_id") REFERENCES "SectionTemplate"("section_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_closet_id_fkey" FOREIGN KEY ("closet_id") REFERENCES "Closet"("closet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clothing" ADD CONSTRAINT "Clothing_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clothing" ADD CONSTRAINT "Clothing_closet_id_fkey" FOREIGN KEY ("closet_id") REFERENCES "Closet"("closet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clothing" ADD CONSTRAINT "Clothing_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clothing" ADD CONSTRAINT "Clothing_categorySub_id_fkey" FOREIGN KEY ("categorySub_id") REFERENCES "CategorySub"("categorySub_id") ON DELETE RESTRICT ON UPDATE CASCADE;
