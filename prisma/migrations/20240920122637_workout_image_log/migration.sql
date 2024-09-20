/*
  Warnings:

  - You are about to drop the column `workoutPlanId` on the `WorkoutImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workoutImageId]` on the table `WorkoutLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "WorkoutImage" DROP CONSTRAINT "WorkoutImage_workoutPlanId_fkey";

-- AlterTable
ALTER TABLE "WorkoutImage" DROP COLUMN "workoutPlanId";

-- AlterTable
ALTER TABLE "WorkoutLog" ADD COLUMN     "workoutImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutLog_workoutImageId_key" ON "WorkoutLog"("workoutImageId");

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_workoutImageId_fkey" FOREIGN KEY ("workoutImageId") REFERENCES "WorkoutImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
