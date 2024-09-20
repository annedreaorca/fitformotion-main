/*
  Warnings:

  - A unique constraint covering the columns `[workoutImageId]` on the table `WorkoutLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WorkoutLog" ADD COLUMN     "workoutImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutLog_workoutImageId_key" ON "WorkoutLog"("workoutImageId");

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_workoutImageId_fkey" FOREIGN KEY ("workoutImageId") REFERENCES "WorkoutImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
