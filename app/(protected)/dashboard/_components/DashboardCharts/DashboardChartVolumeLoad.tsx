import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { format, subDays } from "date-fns"; // Import subDays to calculate previous dates
import DashboardChartVolumeLoadClient from "./DashboardChartVolumeLoad.client";
import {
  calculateIntervals,
  getIntervalStartAndEndDates,
} from "./utils/dateUtils";

type WorkoutVolumeLoadData = {
  period: string;
  totalVolumeLoad: number;
};

// Generate mock data for the previous 7 days
const generateMockData = (): WorkoutVolumeLoadData[] => {
  const mockData: WorkoutVolumeLoadData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i); // Get the date for the past week
    mockData.push({
      period: format(date, "MM-dd-yyyy"), // Format the date
      totalVolumeLoad: 0, // Set totalVolumeLoad to 0
    });
  }

  return mockData;
};

export default async function DashboardChartVolumeLoad({
  dateRange = "1W",
}: {
  dateRange?: string;
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const intervals = calculateIntervals(dateRange);
  const startDate = intervals[0];
  const endDate = new Date();

  const workoutLogs = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  if (workoutLogs.length === 0) {
    // Use the generated mock data for the previous 7 days
    const mockData = generateMockData();
    return <DashboardChartVolumeLoadClient data={mockData} isUsingMockData />;
  }

  let lastKnownVolumeLoad = 0;

  let workoutVolumeLoads: WorkoutVolumeLoadData[] = intervals.map(
    (interval) => {
      const { startOfInterval, endOfInterval } = getIntervalStartAndEndDates(
        interval,
        dateRange,
      );

      let volumeLoadInInterval = workoutLogs
        .filter((workoutLog) => {
          const logDate = new Date(workoutLog.date);
          return logDate >= startOfInterval && logDate <= endOfInterval;
        })
        .reduce((totalVolume, workoutLog) => {
          const workoutVolume = workoutLog.exercises.reduce(
            (totalExerciseVolume, exercise) => {
              const exerciseVolume = exercise.sets.reduce(
                (totalSetVolume, set) => {
                  const setVolume = (set.weight || 0) * (set.reps || 0);
                  return totalSetVolume + setVolume;
                },
                0,
              );
              return totalExerciseVolume + exerciseVolume;
            },
            0,
          );
          return totalVolume + workoutVolume;
        }, 0);

      if (volumeLoadInInterval === 0) {
        volumeLoadInInterval = lastKnownVolumeLoad;
      } else {
        lastKnownVolumeLoad = volumeLoadInInterval;
      }

      return {
        period: format(startOfInterval, "MM-dd-yyyy"),
        totalVolumeLoad: volumeLoadInInterval,
      };
    },
  );

  return <DashboardChartVolumeLoadClient data={workoutVolumeLoads} />;
}
