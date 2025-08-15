-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "sensitiveContent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "showSensitiveContent" BOOLEAN NOT NULL DEFAULT false;
