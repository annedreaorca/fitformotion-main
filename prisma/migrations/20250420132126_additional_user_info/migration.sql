-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('beginner', 'intermediate', 'expert');

-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "fitnessGoals" TEXT,
ADD COLUMN     "workoutScheduleAvailability" JSONB;
