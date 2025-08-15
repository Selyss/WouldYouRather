-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_authorId_fkey";

-- AlterTable
ALTER TABLE "public"."Question" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
