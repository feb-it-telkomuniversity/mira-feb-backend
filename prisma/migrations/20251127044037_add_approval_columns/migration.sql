-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('Approved', 'Returned', 'Submitted', 'Pending', 'Skipped');

-- AlterTable
ALTER TABLE "partnership_documents" ADD COLUMN     "approval_dekan" "ApprovalStatus",
ADD COLUMN     "approval_dir_spio" "ApprovalStatus",
ADD COLUMN     "approval_dir_sps" "ApprovalStatus",
ADD COLUMN     "approval_kabag_kst" "ApprovalStatus",
ADD COLUMN     "approval_kabag_sekpim" "ApprovalStatus",
ADD COLUMN     "approval_kaur_legal" "ApprovalStatus",
ADD COLUMN     "approval_rektor" "ApprovalStatus",
ADD COLUMN     "approval_wadek1" "ApprovalStatus",
ADD COLUMN     "approval_wadek2" "ApprovalStatus",
ADD COLUMN     "approval_warek1" "ApprovalStatus",
ADD COLUMN     "doc_link" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "pic_external_phone" TEXT;
