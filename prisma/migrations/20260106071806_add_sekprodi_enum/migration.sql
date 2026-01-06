-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OfficialOption" ADD VALUE 'SekprodiS1Manajemen';
ALTER TYPE "OfficialOption" ADD VALUE 'SekprodiS1ICTBusiness';
ALTER TYPE "OfficialOption" ADD VALUE 'SekprodiS1Akuntansi';
ALTER TYPE "OfficialOption" ADD VALUE 'SekprodiS2Manajemen';
ALTER TYPE "OfficialOption" ADD VALUE 'SekprodiS2ManajemenPJJ';
ALTER TYPE "OfficialOption" ADD VALUE 'SekprodiS2AdministrasiBisnis';
