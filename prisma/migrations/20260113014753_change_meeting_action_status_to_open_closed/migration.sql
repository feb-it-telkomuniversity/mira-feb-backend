/*
  Warnings:

  - The values [Pending,OnProgress,Done,Cancelled] on the enum `MeetingActionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MeetingActionStatus_new" AS ENUM ('Open', 'Closed');
ALTER TABLE "public"."meeting_action_items" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "meeting_action_items" ALTER COLUMN "status" TYPE "MeetingActionStatus_new" USING ("status"::text::"MeetingActionStatus_new");
ALTER TYPE "MeetingActionStatus" RENAME TO "MeetingActionStatus_old";
ALTER TYPE "MeetingActionStatus_new" RENAME TO "MeetingActionStatus";
DROP TYPE "public"."MeetingActionStatus_old";
ALTER TABLE "meeting_action_items" ALTER COLUMN "status" SET DEFAULT 'Closed';
COMMIT;

-- AlterTable
ALTER TABLE "meeting_action_items" ALTER COLUMN "status" SET DEFAULT 'Closed';
