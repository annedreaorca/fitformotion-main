import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/prisma";
import DashboardChartExerciseMuscleDistributionClient from "./DashboardChartExerciseMuscleDistribution.client";
import {
  calculateIntervals,
  getIntervalStartAndEndDates,
} from "./utils/dateUtils";

type ExerciseMuscleData = {
  muscle: string;
  count: number;
};

// Mock data to display when no workout data is available
const mockData: ExerciseMuscleData[] = [
  { muscle: "abdominals", count: 14 },
  { muscle: "hamstrings", count: 8 },
  { muscle: "adductors", count: 4 },
  { muscle: "quadriceps", count: 12 },
  { muscle: "biceps", count: 10 },
  { muscle: "shoulders", count: 15 },
  { muscle: "chest", count: 18 },
  { muscle: "middle back", count: 7 },
  { muscle: "calves", count: 6 },
  { muscle: "glutes", count: 9 },
  { muscle: "lower back", count: 5 },
  { muscle: "lats", count: 11 },
  { muscle: "triceps", count: 13 },
  { muscle: "traps", count: 8 },
  { muscle: "forearms", count: 4 },
  { muscle: "neck", count: 2 },
  { muscle: "abductors", count: 3 }
];

export default async function DashboardChartExerciseMuscleDistribution({
  dateRange = "1W",
}: {
  dateRange?: string;
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const minCount = 2;
  const intervals = calculateIntervals(dateRange);
  const startDate = intervals[0];
  const endDate = new Date();

  // Get all workout logs for this user in the date range
  const workoutLogs = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate,
        lte: endDate,
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

  // If no workout logs are found, return mock data
  if (workoutLogs.length === 0) {
    return <DashboardChartExerciseMuscleDistributionClient data={mockData} isUsingMockData={true} />;
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

  // Get all possible muscle values from the enum
  const allMuscles = [
    "abdominals",
    "hamstrings",
    "adductors",
    "quadriceps",
    "biceps",
    "shoulders",
    "chest",
    "middle_back",
    "calves",
    "glutes",
    "lower_back",
    "lats",
    "triceps",
    "traps",
    "forearms",
    "abductors"
  ];

  // Format data for the radar chart
  const radarChartData: ExerciseMuscleData[] = allMuscles.map(muscle => {
    // Map the DB enum values to display names
    const displayMuscle = muscle.replace(/_/g, ' ');
    
    return {
      muscle: displayMuscle,
      count: muscleCounts[muscle] || minCount,
    };
  });

  return (
    <DashboardChartExerciseMuscleDistributionClient data={radarChartData}/>
  );
}