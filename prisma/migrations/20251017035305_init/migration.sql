-- CreateEnum
CREATE TYPE "Role" AS ENUM ('mahasiswa', 'dosen');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Sidang', 'Keuangan', 'Wisuda', 'Sekretariat', 'Wadek1', 'Wadek2', 'ProdiS1', 'ProdiS2');

-- CreateEnum
CREATE TYPE "Step" AS ENUM ('select_role', 'ask_lecturer_name', 'lecturer_select_unit', 'ask_student_nim', 'ask_student_name', 'menu', 'chat', 'awaiting_feedback');

-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('user', 'bot', 'admin');

-- CreateEnum
CREATE TYPE "Feedback" AS ENUM ('1', '2', '3');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('open', 'in_progress', 'resolved');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('draft', 'pending', 'sent', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "phone_number" VARCHAR(30) NOT NULL,
    "name" VARCHAR(200),
    "role" "Role",
    "identifier" VARCHAR(255),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category" "Category",
    "last_bot_message_id" INTEGER,
    "step" "Step" NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "message_text" TEXT NOT NULL,
    "need_human" BOOLEAN DEFAULT false,
    "feedback" "Feedback",
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unresolved" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "status" "Status" DEFAULT 'open',
    "assigned_to" VARCHAR(100),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unresolved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "event_title" TEXT NOT NULL,
    "event_description" TEXT NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL,
    "reminder_time" TIMESTAMP(3) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'pending',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_recipients" (
    "id" SERIAL NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "schedule_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phone_number" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "user_id" ON "conversations"("user_id");

-- CreateIndex
CREATE INDEX "conversation_id" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "message_id" ON "unresolved"("message_id");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_ibfk_1" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unresolved" ADD CONSTRAINT "unresolved_ibfk_1" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule_recipients" ADD CONSTRAINT "schedule_recipients_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
