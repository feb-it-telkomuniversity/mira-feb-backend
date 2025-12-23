/*
  Warnings:

  - The values [Conflict] on the enum `ActivityMonitoringStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityMonitoringStatus_new" AS ENUM ('Normal', 'RoomConflict', 'OfficialConflict', 'DoubleConflict', 'Cancelled');
ALTER TABLE "public"."ActivityMonitoring" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ActivityMonitoring" ALTER COLUMN "status" TYPE "ActivityMonitoringStatus_new" USING ("status"::text::"ActivityMonitoringStatus_new");
ALTER TYPE "ActivityMonitoringStatus" RENAME TO "ActivityMonitoringStatus_old";
ALTER TYPE "ActivityMonitoringStatus_new" RENAME TO "ActivityMonitoringStatus";
DROP TYPE "public"."ActivityMonitoringStatus_old";
ALTER TABLE "ActivityMonitoring" ALTER COLUMN "status" SET DEFAULT 'Normal';
COMMIT;
