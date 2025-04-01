-- AlterTable
ALTER TABLE "RedeemRequests" ADD COLUMN     "paymentDetails" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
