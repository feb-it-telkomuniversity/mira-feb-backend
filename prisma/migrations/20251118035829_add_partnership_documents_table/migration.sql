-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('MoA', 'MoU', 'SK');

-- CreateEnum
CREATE TYPE "Scope" AS ENUM ('national', 'international');

-- CreateTable
CREATE TABLE "partnership_documents" (
    "id" SERIAL NOT NULL,
    "year_issued" INTEGER NOT NULL,
    "doc_type" "DocType" NOT NULL,
    "partner_name" TEXT NOT NULL,
    "scope" "Scope" NOT NULL,
    "pic_external" TEXT,
    "pic_external_phone" TEXT,
    "pic_internal" TEXT,
    "doc_number_internal" TEXT,
    "doc_number_external" TEXT,
    "date_created" TIMESTAMP(3),
    "signing_type" TEXT,
    "date_signed" TIMESTAMP(3),
    "doc_link" TEXT,
    "valid_until" TIMESTAMP(3),
    "notes" TEXT,
    "has_hardcopy" BOOLEAN NOT NULL DEFAULT false,
    "has_softcopy" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partnership_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partnership_documents_doc_number_internal_key" ON "partnership_documents"("doc_number_internal");

-- CreateIndex
CREATE UNIQUE INDEX "partnership_documents_doc_number_external_key" ON "partnership_documents"("doc_number_external");
