/*
  Warnings:

  - You are about to drop the `ActivityMonitoring` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ActivityMonitoring";

-- CreateTable
CREATE TABLE "activity_monitoring" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "unit" "UnitOption" NOT NULL,
    "prodi" "ProdiOption",
    "room" "RoomOption" NOT NULL,
    "officials" "OfficialOption"[],
    "status" "ActivityMonitoringStatus" NOT NULL DEFAULT 'Normal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_monitoring_pkey" PRIMARY KEY ("id")
);
