/*
  Warnings:

  - You are about to drop the column `doc_link` on the `partnership_documents` table. All the data in the column will be lost.
  - You are about to drop the column `pic_external_phone` on the `partnership_documents` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "DocType" ADD VALUE 'IA';

-- AlterTable
ALTER TABLE "partnership_documents" DROP COLUMN "doc_link",
DROP COLUMN "pic_external_phone";
