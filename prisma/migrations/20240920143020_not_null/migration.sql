/*
  Warnings:

  - Made the column `workoutImageId` on table `WorkoutLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WorkoutLog" DROP CONSTRAINT "WorkoutLog_workoutImageId_fkey";

-- AlterTable
ALTER TABLE "WorkoutLog" ALTER COLUMN "workoutImageId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_workoutImageId_fkey" FOREIGN KEY ("workoutImageId") REFERENCES "WorkoutImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
