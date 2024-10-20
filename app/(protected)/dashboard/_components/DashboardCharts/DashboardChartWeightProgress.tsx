import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { format, subDays } from "date-fns";
import DashboardChartWeightProgressClient from "./DashboardChartWeightProgress.client";
import {
  calculateIntervals,
  getIntervalStartAndEndDates,
} from "./utils/dateUtils";

type WorkoutData = {
  period: string;
  totalWeight: number;
};

// Generate mock data for the previous 7 days
const generateMockData = (): WorkoutData[] => {
  const mockData: WorkoutData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i); // Get the date for the past week
    mockData.push({
      period: format(date, "MM-dd-yyyy"), // Format the date
      totalWeight: 0, // Set totalWeight to 0
    });
  }

  return mockData;
};

export default async function DashboardChartWeightProgress({
  dateRange = "1W",
}: {
  dateRange?: string;
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const startDate = await prisma.workoutLog.findFirst({
    where: { userId: userId },
    orderBy: { date: "asc" },
    select: { date: true },
  });

  const intervals = calculateIntervals(dateRange);

  let workoutLogs = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate?.date || new Date(),
        lte: new Date(),
      },
    },
    select: {
      date: true,
      exercises: {
        select: {
          sets: {
            select: {
              weight: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  if (workoutLogs.length === 0) {
    // Use the generated mock data for the previous 7 days
    const mockData = generateMockData();
    return <DashboardChartWeightProgressClient data={mockData} isUsingMockData />;
  }

  let cumulativeTotalWeight = 0;

  let cumulativeWeights = workoutLogs.map((log) => {
    const totalWeightForLog = log.exercises.reduce(
      (total, exercise) =>
        total +
        exercise.sets.reduce(
          (setTotal, set) => setTotal + (set.weight || 0),
          0,
        ),
      0,
    );
    cumulativeTotalWeight += totalWeightForLog;
    return {
      period: format(log.date, "yyyy-MM-dd"),
      totalWeight: cumulativeTotalWeight,
    };
  });

  const adjustedData = intervals.map((interval) => {
    const { startOfInterval, endOfInterval } = getIntervalStartAndEndDates(
      interval,
      dateRange,
    );
    const period = format(startOfInterval, "MM-dd-yyyy");

    let cumulativeWeightsUpToInterval = cumulativeWeights.filter((item) => {
      const itemDate = new Date(item.period);
      return itemDate <= endOfInterval;
    });

    let lastCumulativeWeight =
      cumulativeWeightsUpToInterval.length > 0
        ? cumulativeWeightsUpToInterval[cumulativeWeightsUpToInterval.length - 1].totalWeight
        : 0;

    return {
      period,
      totalWeight: lastCumulativeWeight,
    };
  });

  return <DashboardChartWeightProgressClient data={adjustedData} />;
}
