-- CreateTable
CREATE TABLE "oauth_account" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "oauth_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "token_id" SERIAL NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "Outfit" (
    "outfit_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "outfit_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("outfit_id")
);

-- CreateTable
CREATE TABLE "OutfitCloth" (
    "outfit_id" INTEGER NOT NULL,
    "cloth_id" INTEGER NOT NULL,

    CONSTRAINT "OutfitCloth_pkey" PRIMARY KEY ("outfit_id","cloth_id")
);

-- CreateTable
CREATE TABLE "Date" (
    "date_id" SERIAL NOT NULL,
    "outfit_id" INTEGER NOT NULL,
    "wear_date" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Date_pkey" PRIMARY KEY ("date_id")
);

-- AddForeignKey
ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitCloth" ADD CONSTRAINT "OutfitCloth_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "Outfit"("outfit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitCloth" ADD CONSTRAINT "OutfitCloth_cloth_id_fkey" FOREIGN KEY ("cloth_id") REFERENCES "Clothing"("cloth_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "Outfit"("outfit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
