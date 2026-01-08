/*
  Warnings:

  - You are about to alter the column `realization` on the `contract_management` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "contract_management" ALTER COLUMN "target" SET DATA TYPE TEXT,
ALTER COLUMN "realization" SET DATA TYPE DOUBLE PRECISION;
