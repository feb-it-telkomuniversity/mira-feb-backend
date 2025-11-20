/*
  Warnings:

  - The values [SK] on the enum `DocType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PartnershipType" AS ENUM ('Akademik', 'Penelitian', 'Abdimas');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('JointDegree', 'DoubleDegree', 'JointClass', 'StudentExchange', 'VisitingProfessor', 'JointResearch', 'JointPublication', 'JointCommunityService', 'SocialProject', 'General');

-- AlterEnum
BEGIN;
CREATE TYPE "DocType_new" AS ENUM ('MoA', 'MoU');
ALTER TABLE "partnership_documents" ALTER COLUMN "doc_type" TYPE "DocType_new" USING ("doc_type"::text::"DocType_new");
ALTER TYPE "DocType" RENAME TO "DocType_old";
ALTER TYPE "DocType_new" RENAME TO "DocType";
DROP TYPE "public"."DocType_old";
COMMIT;

-- AlterTable
ALTER TABLE "partnership_documents" ADD COLUMN     "activity_type" "ActivityType",
ADD COLUMN     "partnership_type" "PartnershipType";
