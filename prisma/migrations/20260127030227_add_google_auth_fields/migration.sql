/*
  Warnings:

  - You are about to drop the column `categorySub_id` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Clothing` table. All the data in the column will be lost.
  - You are about to drop the `CategoryMain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategorySub` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,provider_user_id]` on the table `oauth_account` will be added. If there are existing duplicate values, this will fail.
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

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleEmail" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "loginType" TEXT NOT NULL DEFAULT 'email';

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

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleEmail_key" ON "User"("googleEmail");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_account_provider_provider_user_id_key" ON "oauth_account"("provider", "provider_user_id");

-- AddForeignKey
ALTER TABLE "Clothing" ADD CONSTRAINT "Clothing_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
