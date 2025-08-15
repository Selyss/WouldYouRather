-- CreateEnum
CREATE TYPE "public"."QuestionCategory" AS ENUM ('ETHICS', 'FUN');

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "category" "public"."QuestionCategory" NOT NULL DEFAULT 'FUN';
