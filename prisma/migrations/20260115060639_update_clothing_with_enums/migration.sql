/*
  Warnings:

  - You are about to drop the column `weather` on the `Clothing` table. All the data in the column will be lost.
  - Added the required column `season` to the `Clothing` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `color` on the `Clothing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BLACK', 'WHITE', 'GRAY', 'NAVY', 'BLUE', 'SKY_BLUE', 'RED', 'PINK', 'ORANGE', 'YELLOW', 'GREEN', 'KHAKI', 'BROWN', 'BEIGE', 'PURPLE', 'MULTI', 'ETC');

-- AlterTable
ALTER TABLE "Clothing" DROP COLUMN "weather",
ADD COLUMN     "season" "Season" NOT NULL,
ADD COLUMN     "temperature" INTEGER,
DROP COLUMN "color",
ADD COLUMN     "color" "Color" NOT NULL;
