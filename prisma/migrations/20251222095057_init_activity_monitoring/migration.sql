-- CreateEnum
CREATE TYPE "UnitOption" AS ENUM ('Dekan', 'WakilDekanI', 'WakilDekanII', 'UrusanSekretariatDekan', 'UrusanLayananAkademik', 'UrusanLaboratorium', 'UrusanSDMKeuangan', 'UrusanKemahasiswaan', 'ProdiS1Manajemen', 'ProdiS1AdministrasiBisnis', 'ProdiS1Akuntansi', 'ProdiS1LeisureManagement', 'ProdiS1BisnisDigital', 'ProdiS2Manajemen', 'ProdiS2ManajemenPJJ', 'ProdiS2AdministrasiBisnis', 'ProdiS2Akuntansi', 'ProdiS3Manajemen');

-- CreateEnum
CREATE TYPE "ProdiOption" AS ENUM ('S1Manajemen', 'S1AdministrasiBisnis', 'S1Akuntansi', 'S1LeisureManagement', 'S1BisnisDigital', 'S2Manajemen', 'S2ManajemenPJJ', 'S2AdministrasiBisnis', 'S2Akuntansi', 'S3Manajemen');

-- CreateEnum
CREATE TYPE "RoomOption" AS ENUM ('RuangRapatManterawuLt2', 'RuangRapatMiossuLt1', 'RuangRapatMiossuLt2', 'RuangRapatMaratuaLt1', 'AulaFEB', 'AulaManterawu', 'Lainnya');

-- CreateEnum
CREATE TYPE "OfficialOption" AS ENUM ('Rektor', 'WakilRektor1', 'WakilRektor2', 'WakilRektor3', 'WakilRektor4', 'Dekan', 'WakilDekanI', 'WakilDekanII', 'KaurSekretariatDekan', 'KaurAkademik', 'KaurLaboratorium', 'KaurSDMKeuangan', 'KaurKemahasiswaan', 'KaprodiS1Manajemen', 'KaprodiS1AdministrasiBisnis', 'KaprodiS1Akuntansi', 'KaprodiS1LeisureManagement', 'KaprodiS1BisnisDigital', 'KaprodiS2Manajemen', 'KaprodiS2ManajemenPJJ', 'KaprodiS2AdministrasiBisnis', 'KaprodiS2Akuntansi', 'KaprodiS3Manajemen');

-- CreateEnum
CREATE TYPE "ActivityMonitoringStatus" AS ENUM ('Normal', 'Conflict');

-- CreateTable
CREATE TABLE "ActivityMonitoring" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "status" "ActivityMonitoringStatus" NOT NULL DEFAULT 'Normal',

    CONSTRAINT "ActivityMonitoring_pkey" PRIMARY KEY ("id")
);
