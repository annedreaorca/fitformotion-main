/*
  Warnings:

  - You are about to drop the column `workoutImageId` on the `WorkoutLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutLog" DROP CONSTRAINT "WorkoutLog_workoutImageId_fkey";

-- AlterTable
ALTER TABLE "WorkoutLog" DROP COLUMN "workoutImageId";
