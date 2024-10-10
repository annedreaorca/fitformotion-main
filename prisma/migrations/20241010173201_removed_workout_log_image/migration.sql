/*
  Warnings:

  - You are about to drop the column `workoutPlanId` on the `WorkoutImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutImage" DROP CONSTRAINT "WorkoutImage_workoutPlanId_fkey";

-- AlterTable
ALTER TABLE "WorkoutImage" DROP COLUMN "workoutPlanId";
