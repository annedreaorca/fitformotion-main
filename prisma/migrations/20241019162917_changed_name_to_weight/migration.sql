/*
  Warnings:

  - You are about to drop the column `workoutName` on the `WorkoutImage` table. All the data in the column will be lost.
  - Made the column `userId` on table `WorkoutImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WorkoutImage" DROP COLUMN "workoutName",
ADD COLUMN     "userWeight" DOUBLE PRECISION,
ALTER COLUMN "userId" SET NOT NULL;
