/*
  Warnings:

  - You are about to drop the column `meeting_id` on the `meeting_action_items` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `meetings` table. All the data in the column will be lost.
  - Added the required column `agenda_id` to the `meeting_action_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "meeting_action_items" DROP CONSTRAINT "meeting_action_items_meeting_id_fkey";

-- AlterTable
ALTER TABLE "activity_monitoring" ALTER COLUMN "room" SET DEFAULT 'AulaFEB';

-- AlterTable
ALTER TABLE "meeting_action_items" DROP COLUMN "meeting_id",
ADD COLUMN     "agenda_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "meetings" DROP COLUMN "location",
ADD COLUMN     "location_detail" TEXT,
ADD COLUMN     "room" "RoomOption" NOT NULL;

-- AddForeignKey
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_agenda_id_fkey" FOREIGN KEY ("agenda_id") REFERENCES "meeting_agendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
