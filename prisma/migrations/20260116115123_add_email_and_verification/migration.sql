-- AlterTable: User 테이블에 email 필드 추가 (기존 데이터에는 기본값 설정)
ALTER TABLE "User" ADD COLUMN "email" TEXT;

-- 기존 데이터에 임시 이메일 할당 (user_loginID 기반)
UPDATE "User" SET "email" = "user_loginID" || '@temp.com' WHERE "email" IS NULL;

-- email을 NOT NULL로 변경
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex: email에 유니크 제약 추가
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateTable: EmailVerification 테이블 생성
CREATE TABLE "EmailVerification" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("id")
);
