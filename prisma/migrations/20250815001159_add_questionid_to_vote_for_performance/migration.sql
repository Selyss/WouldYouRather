/*
  Warnings:

  - A unique constraint covering the columns `[questionId,userId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Vote" ADD COLUMN     "questionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_questionId_userId_key" ON "public"."Vote"("questionId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
