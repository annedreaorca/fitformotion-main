-- AlterTable
ALTER TABLE "WorkoutImage" ADD COLUMN     "workoutLogId" TEXT;

-- AddForeignKey
ALTER TABLE "WorkoutImage" ADD CONSTRAINT "WorkoutImage_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
