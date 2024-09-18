/*
  Warnings:

  - You are about to drop the column `workoutLogId` on the `WorkoutImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutImage" DROP CONSTRAINT "WorkoutImage_workoutLogId_fkey";

-- AlterTable
ALTER TABLE "WorkoutImage" DROP COLUMN "workoutLogId";
