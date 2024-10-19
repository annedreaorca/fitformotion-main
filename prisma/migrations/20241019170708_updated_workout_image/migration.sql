/*
  Warnings:

  - You are about to drop the column `userWeight` on the `WorkoutImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserWeight" DROP CONSTRAINT "UserWeight_userId_fkey";

-- AlterTable
ALTER TABLE "WorkoutImage" DROP COLUMN "userWeight",
ADD COLUMN     "currentWeight" DOUBLE PRECISION,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserWeight" ADD CONSTRAINT "UserWeight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
