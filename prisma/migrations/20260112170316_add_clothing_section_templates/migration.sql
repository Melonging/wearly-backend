/*
  Warnings:

  - Made the column `birthDate` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "birthDate" SET NOT NULL;

-- CreateTable
CREATE TABLE "Clothing" (
    "cloth_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "section_template_id" INTEGER NOT NULL,
    "closet_template_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "closet_id" INTEGER NOT NULL,
    "categorySub_id" INTEGER NOT NULL,
    "categoryMain_id" INTEGER NOT NULL,
    "weather" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clothing_pkey" PRIMARY KEY ("cloth_id")
);

-- CreateTable
CREATE TABLE "Section" (
    "section_id" SERIAL NOT NULL,
    "section_template_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "closet_id" INTEGER NOT NULL,
    "closet_template_id" INTEGER NOT NULL,
    "category_name" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "Closet" (
    "closet_id" SERIAL NOT NULL,
    "closet_template_id" INTEGER NOT NULL,
    "closet_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Closet_pkey" PRIMARY KEY ("closet_id")
);
