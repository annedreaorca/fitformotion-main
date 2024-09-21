-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "subscriptionType" TEXT NOT NULL DEFAULT 'free';
