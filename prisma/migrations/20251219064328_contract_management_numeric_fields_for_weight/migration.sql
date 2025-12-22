/*
  Warnings:

  - You are about to alter the column `weight` on the `contract_management` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "contract_management" ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;
