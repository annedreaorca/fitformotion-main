/*
  Warnings:

  - Made the column `workoutImageId` on table `WorkoutLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WorkoutLog" ALTER COLUMN "workoutImageId" SET NOT NULL;
