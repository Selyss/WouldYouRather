/*
  Warnings:

  - You are about to drop the column `questionId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[responseId,userId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_responseId_fkey";

-- DropIndex
DROP INDEX "public"."Vote_questionId_userId_key";

-- AlterTable
ALTER TABLE "public"."Vote" DROP COLUMN "questionId";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_responseId_userId_key" ON "public"."Vote"("responseId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "public"."Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
