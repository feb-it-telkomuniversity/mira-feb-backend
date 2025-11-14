/*
  Warnings:

  - You are about to drop the column `name` on the `schedule_recipients` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `schedule_recipients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "schedule_recipients" DROP COLUMN "name",
DROP COLUMN "phone_number",
ADD COLUMN     "contact_id" INTEGER;

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_phone_number_key" ON "contacts"("phone_number");

-- AddForeignKey
ALTER TABLE "schedule_recipients" ADD CONSTRAINT "schedule_recipients_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
