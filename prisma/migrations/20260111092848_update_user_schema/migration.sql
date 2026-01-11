/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_profileImg` on the `User` table. All the data in the column will be lost.
  - Made the column `gender` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'PREFER_NOT_TO_SAY';

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "user_profileImg",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ALTER COLUMN "gender" SET NOT NULL;
