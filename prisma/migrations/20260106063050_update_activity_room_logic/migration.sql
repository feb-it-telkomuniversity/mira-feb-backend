/*
  Warnings:

  - You are about to drop the column `prodi` on the `activity_monitoring` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity_monitoring" DROP COLUMN "prodi",
ADD COLUMN     "location_detail" TEXT;
