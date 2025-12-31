-- CreateEnum
CREATE TYPE "MeetingActionStatus" AS ENUM ('Pending', 'OnProgress', 'Done', 'Cancelled');

-- CreateTable
CREATE TABLE "meetings" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "leader" TEXT NOT NULL,
    "notetaker" TEXT NOT NULL,
    "participants" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_agendas" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "discussion" TEXT NOT NULL,
    "decision" TEXT,
    "meeting_id" INTEGER NOT NULL,

    CONSTRAINT "meeting_agendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_action_items" (
    "id" SERIAL NOT NULL,
    "task" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "deadline" DATE NOT NULL,
    "status" "MeetingActionStatus" NOT NULL DEFAULT 'Pending',
    "meeting_id" INTEGER NOT NULL,

    CONSTRAINT "meeting_action_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meeting_agendas" ADD CONSTRAINT "meeting_agendas_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
