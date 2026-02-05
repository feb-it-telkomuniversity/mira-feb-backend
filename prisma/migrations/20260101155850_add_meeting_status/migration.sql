-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('Selesai', 'Berlangsung', 'Terjadwal', 'Batal');

-- AlterTable
ALTER TABLE "meeting_agendas" ALTER COLUMN "discussion" DROP NOT NULL;

-- AlterTable
ALTER TABLE "meetings" ADD COLUMN     "status" "MeetingStatus" NOT NULL DEFAULT 'Terjadwal';
