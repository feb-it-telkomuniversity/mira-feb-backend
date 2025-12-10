/*
  Warnings:

  - You are about to drop the column `activity_type` on the `partnership_documents` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('Terlaksana', 'BelumTerlaksana');

-- AlterTable
ALTER TABLE "partnership_documents" DROP COLUMN "activity_type";

-- CreateTable
CREATE TABLE "partnership_activities" (
    "id" SERIAL NOT NULL,
    "type" "ActivityType",
    "status" "ActivityStatus" DEFAULT 'BelumTerlaksana',
    "document_id" INTEGER NOT NULL,

    CONSTRAINT "partnership_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "partnership_activities" ADD CONSTRAINT "partnership_activities_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "partnership_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
