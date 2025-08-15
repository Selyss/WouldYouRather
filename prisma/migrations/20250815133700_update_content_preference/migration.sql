/*
  Warnings:

  - You are about to drop the column `showSensitiveContent` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ContentPreference" AS ENUM ('ALL', 'SAFE_ONLY', 'ADULT_ONLY');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "showSensitiveContent",
ADD COLUMN     "contentPreference" "public"."ContentPreference" NOT NULL DEFAULT 'SAFE_ONLY';
