/*
  Warnings:

  - You are about to drop the column `outfit_name` on the `Outfit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Date" ADD COLUMN     "memo" TEXT;

-- AlterTable
ALTER TABLE "Outfit" DROP COLUMN "outfit_name",
ADD COLUMN     "is_heart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_star" BOOLEAN NOT NULL DEFAULT false;
