/*
  Warnings:

  - You are about to drop the column `categorySub_id` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the `CategoryMain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategorySub` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `Clothing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategorySub" DROP CONSTRAINT "CategorySub_categoryMain_id_fkey";

-- DropForeignKey
ALTER TABLE "Clothing" DROP CONSTRAINT "Clothing_categorySub_id_fkey";

-- AlterTable
ALTER TABLE "Clothing" DROP COLUMN "categorySub_id",
DROP COLUMN "color",
DROP COLUMN "season",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CategoryMain";

-- DropTable
DROP TABLE "CategorySub";

-- DropEnum
DROP TYPE "Color";

-- DropEnum
DROP TYPE "Season";

-- CreateTable
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- AddForeignKey
ALTER TABLE "Clothing" ADD CONSTRAINT "Clothing_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
