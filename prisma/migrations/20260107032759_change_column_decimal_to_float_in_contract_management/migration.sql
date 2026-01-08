/*
  Warnings:

  - You are about to alter the column `pers_real` on the `contract_management` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `DoublePrecision`.
  - You are about to alter the column `value` on the `contract_management` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `DoublePrecision`.
  - You are about to alter the column `achievement` on the `contract_management` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "contract_management" ALTER COLUMN "max" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "min" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "pers_real" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "achievement" SET DATA TYPE DOUBLE PRECISION;
