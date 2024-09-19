-- AlterTable
ALTER TABLE "WorkoutImage" ADD COLUMN     "workoutPlanId" TEXT;

-- AddForeignKey
ALTER TABLE "WorkoutImage" ADD CONSTRAINT "WorkoutImage_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "WorkoutPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
