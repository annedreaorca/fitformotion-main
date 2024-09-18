/*
  Warnings:

  - Added the required column `workoutLogId` to the `WorkoutImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutImage" ADD COLUMN     "workoutLogId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutImage" ADD CONSTRAINT "WorkoutImage_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
