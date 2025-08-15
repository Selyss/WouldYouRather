-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."QuestionCategory" ADD VALUE 'GENERAL';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'ANIMALS';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'CAREER';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'FOOD';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'HEALTH';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'MONEY';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'POP_CULTURE';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'RELATIONSHIPS';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'SCI_FI';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'SUPERPOWERS';
ALTER TYPE "public"."QuestionCategory" ADD VALUE 'TRAVEL';
