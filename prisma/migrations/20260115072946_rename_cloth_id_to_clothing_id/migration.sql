/*
  Warnings:

  - The values [MULTI] on the enum `Color` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Clothing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cloth_id` on the `Clothing` table. All the data in the column will be lost.
  - The primary key for the `OutfitCloth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cloth_id` on the `OutfitCloth` table. All the data in the column will be lost.
  - Added the required column `clothing_id` to the `OutfitCloth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Color_new" AS ENUM ('BLACK', 'WHITE', 'GRAY', 'NAVY', 'BLUE', 'SKY_BLUE', 'RED', 'PINK', 'ORANGE', 'YELLOW', 'GREEN', 'KHAKI', 'BROWN', 'BEIGE', 'PURPLE', 'ETC');
ALTER TABLE "Clothing" ALTER COLUMN "color" TYPE "Color_new" USING ("color"::text::"Color_new");
ALTER TYPE "Color" RENAME TO "Color_old";
ALTER TYPE "Color_new" RENAME TO "Color";
DROP TYPE "Color_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "OutfitCloth" DROP CONSTRAINT "OutfitCloth_cloth_id_fkey";

-- AlterTable
ALTER TABLE "Clothing" DROP CONSTRAINT "Clothing_pkey",
DROP COLUMN "cloth_id",
ADD COLUMN     "clothing_id" SERIAL NOT NULL,
ADD CONSTRAINT "Clothing_pkey" PRIMARY KEY ("clothing_id");

-- AlterTable
ALTER TABLE "OutfitCloth" DROP CONSTRAINT "OutfitCloth_pkey",
DROP COLUMN "cloth_id",
ADD COLUMN     "clothing_id" INTEGER NOT NULL,
ADD CONSTRAINT "OutfitCloth_pkey" PRIMARY KEY ("outfit_id", "clothing_id");

-- AddForeignKey
ALTER TABLE "OutfitCloth" ADD CONSTRAINT "OutfitCloth_clothing_id_fkey" FOREIGN KEY ("clothing_id") REFERENCES "Clothing"("clothing_id") ON DELETE CASCADE ON UPDATE CASCADE;
