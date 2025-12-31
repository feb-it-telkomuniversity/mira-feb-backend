-- CreateTable
CREATE TABLE "employee_tpa" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "work_unit" TEXT NOT NULL,
    "employment_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_tpa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturers" (
    "id" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "nuptk" TEXT,
    "front_title" TEXT,
    "name" TEXT NOT NULL,
    "back_title" TEXT,
    "prodi" TEXT NOT NULL,
    "lecturer_code" TEXT,
    "education" TEXT,
    "job_functional" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_tpa_nip_key" ON "employee_tpa"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_nip_key" ON "lecturers"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_lecturer_code_key" ON "lecturers"("lecturer_code");
