-- CreateTable
CREATE TABLE "management_reports" (
    "id" SERIAL NOT NULL,
    "indicator" TEXT NOT NULL,
    "evidence_link" TEXT,
    "year" INTEGER NOT NULL,
    "tw_1" BOOLEAN NOT NULL DEFAULT false,
    "tw_2" BOOLEAN NOT NULL DEFAULT false,
    "tw_3" BOOLEAN NOT NULL DEFAULT false,
    "tw_4" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "management_reports_indicator_year_key" ON "management_reports"("indicator", "year");
