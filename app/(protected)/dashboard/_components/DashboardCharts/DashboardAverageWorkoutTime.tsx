// DashboardAverageWorkoutTime.tsx
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import DashboardAverageWorkoutTimeClient from "./DashboardAverageWorkoutTime.client";
import {
  calculateIntervals,
  getIntervalStartAndEndDates,
} from "./utils/dateUtils";

type WorkoutData = {
  period: string;
  duration: number;
};

// Mock data for when no workouts exist
const mockData: WorkoutData[] = [
  { period: '01-01-2024', duration: 45 },
  { period: '02-01-2024', duration: 50 },
  { period: '03-01-2024', duration: 40 },
  { period: '04-01-2024', duration: 55 },
  { period: '05-01-2024', duration: 45 },
  { period: '06-01-2024', duration: 60 },
  { period: '07-01-2024', duration: 50 },
  { period: '08-01-2024', duration: 65 },
  { period: '09-01-2024', duration: 55 },
  { period: '10-01-2024', duration: 70 },
];

export default async function DashboardAverageWorkoutTime({
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
      duration: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  if (workoutLogs.length === 0) {
    return <DashboardAverageWorkoutTimeClient data={mockData} isUsingMockData />;
  }

  // Group workouts by interval and calculate average duration
  const durationByInterval = new Map<string, { total: number; count: number }>();

  intervals.forEach((interval) => {
    const { startOfInterval, endOfInterval } = getIntervalStartAndEndDates(
      interval,
      dateRange
    );
    const period = format(startOfInterval, "MM-dd-yyyy");
    
    // Find all workouts in this interval
    const workoutsInInterval = workoutLogs.filter((log) => {
      return log.date >= startOfInterval && log.date <= endOfInterval;
    });
    
    // Calculate total duration and count
    const totalDuration = workoutsInInterval.reduce(
      (sum, log) => sum + (log.duration / 60), // Convert seconds to minutes
      0
    );
    
    durationByInterval.set(period, {
      total: totalDuration,
      count: workoutsInInterval.length,
    });
  });

  // Convert to the format needed for the chart
  const chartData = Array.from(durationByInterval.entries()).map(([period, data]) => ({
    period,
    duration: data.count > 0 ? Math.round(data.total / data.count) : 0, // Average duration in minutes
  }));

  return <DashboardAverageWorkoutTimeClient data={chartData} />;
}