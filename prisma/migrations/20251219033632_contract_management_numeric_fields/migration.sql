/*
  Warnings:

  - The `weight` column on the `contract_management` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `target` column on the `contract_management` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `realization` column on the `contract_management` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `achievement` column on the `contract_management` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `pers_real` on the `contract_management` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,2)`.
  - You are about to alter the column `value` on the `contract_management` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,2)`.

*/
-- AlterTable
ALTER TABLE "contract_management" DROP COLUMN "weight",
ADD COLUMN     "weight" DECIMAL(5,2),
DROP COLUMN "target",
ADD COLUMN     "target" DECIMAL(10,2),
DROP COLUMN "realization",
ADD COLUMN     "realization" DECIMAL(10,2),
DROP COLUMN "achievement",
ADD COLUMN     "achievement" DECIMAL(6,2),
ALTER COLUMN "pers_real" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "value" SET DATA TYPE DECIMAL(6,2);
