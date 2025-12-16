-- CreateEnum
CREATE TYPE "ContractManagementCategory" AS ENUM ('Financial', 'NonFinancial', 'InternalBusinessProcess');

-- CreateTable
CREATE TABLE "contract_management" (
    "id" SERIAL NOT NULL,
    "ContractManagementCategory" "ContractManagementCategory",
    "responsibility" TEXT NOT NULL,
    "quarterly" TEXT NOT NULL,
    "unit" TEXT,
    "weight" TEXT,
    "target" TEXT,
    "realization" TEXT,
    "achievement" TEXT,
    "max" INTEGER,
    "min" INTEGER,
    "pers_real" DECIMAL(65,30),
    "value" DECIMAL(65,30),
    "Input" TEXT,
    "Monitor" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_management_pkey" PRIMARY KEY ("id")
);
