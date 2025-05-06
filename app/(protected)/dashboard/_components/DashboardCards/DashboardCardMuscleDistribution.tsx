import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/prisma";
import { IconHeartFilled } from "@tabler/icons-react";
import DashboardCardTemplate from "./DashboardCardTemplate";

export default async function DashboardCardMuscleDistribution() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  // Get all workout logs for this user in the last 30 days
  const workoutLogs = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    select: {
      exercises: {
        select: {
          exerciseId: true,
        },
      },
    },
  });

  // If no workout logs are found, return default data
  if (workoutLogs.length === 0) {
    return (
      <DashboardCardTemplate
        title="Top Muscle Group"
        icon={<IconHeartFilled className="text-primary" />}
      >
        <div>
          <span className="text-lg font-medium">No data yet</span>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Based on your workouts
          </div>
        </div>
      </DashboardCardTemplate>
    );
  }

  // Extract all exercise IDs from the workout logs
  const exerciseIds = workoutLogs.flatMap(log => 
    log.exercises.map(exercise => exercise.exerciseId)
  );

  // Get all exercises with their primary and secondary muscles
  const exercises = await prisma.exercise.findMany({
    where: {
      id: {
        in: exerciseIds,
      },
    },
    select: {
      primary_muscles: true,
      secondary_muscles: true,
    },
  });

  // Count frequency of each muscle group
  const muscleCounts: Record<string, number> = {};
  
  // Process all exercises to count muscle usage
  exercises.forEach(exercise => {
    // Primary muscles count more than secondary
    exercise.primary_muscles.forEach(muscle => {
      muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 2; // Primary muscle gets weight of 2
    });
    
    exercise.secondary_muscles.forEach(muscle => {
      muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1; // Secondary muscle gets weight of 1
    });
  });

  // Find the most worked muscle group
  let topMuscle = "None";
  let topCount = 0;

  Object.entries(muscleCounts).forEach(([muscle, count]) => {
    if (count > topCount) {
      topMuscle = muscle;
      topCount = count;
    }
  });

  // Format the muscle name for display
  const displayMuscle = topMuscle.replace(/_/g, ' ');
  const capitalizedMuscle = displayMuscle.charAt(0).toUpperCase() + displayMuscle.slice(1);

  return (
    <DashboardCardTemplate
      title="Top Muscle Group"
      icon={<IconHeartFilled className="text-primary" />}
    >
      <div>
        <span className="text-lg font-medium">{capitalizedMuscle}</span>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Based on your workouts
        </div>
      </div>
    </DashboardCardTemplate>
  );
}