/*
  Warnings:

  - You are about to drop the column `workoutScheduleAvailability` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "workoutScheduleAvailability",
ADD COLUMN     "sessionTime" INTEGER,
ADD COLUMN     "weeklySession" INTEGER;
