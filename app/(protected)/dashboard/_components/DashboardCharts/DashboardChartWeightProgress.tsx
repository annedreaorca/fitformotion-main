// C:\Users\anned\Desktop\fitformotion\app\(protected)\dashboard\_components\DashboardCharts\DashboardChartWeightProgress.tsx

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { format, subDays } from "date-fns";
import DashboardChartWeightProgressClient from "./DashboardChartWeightProgress.client";
import {
  calculateIntervals,
  getIntervalStartAndEndDates,
} from "./utils/dateUtils";

type UserWeightData = {
  period: string; 
  totalWeight: number; 
};

// Static mock data for when no weight data exists
const mockData: UserWeightData[] = [
  { period: '01-14-2024', totalWeight: 180 },
  { period: '01-15-2024', totalWeight: 175 },
  { period: '01-16-2024', totalWeight: 170 },
  { period: '01-17-2024', totalWeight: 165 },
  { period: '01-18-2024', totalWeight: 160 },
  { period: '01-19-2024', totalWeight: 155 },
  { period: '01-20-2024', totalWeight: 150 },
];

export default async function DashboardChartUserWeight({
  dateRange = "1W",
}: {
  dateRange?: string;
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  // Fetch user weight data from the UserWeight model
  const userWeights = await prisma.userWeight.findMany({
    where: {
      userId: userId,
      recordedAt: {
        gte: subDays(new Date(), 7), // Fetch weights recorded in the last 7 days
        lte: new Date(),
      },
    },
    select: {
      recordedAt: true, // Select the date when the weight was recorded
      weight: true,     // Select the weight
    },
    orderBy: {
      recordedAt: "asc", // Order by date in ascending order
    },
  });

  if (userWeights.length === 0) {
    // Use the static mock data if no user weight data exists
    return <DashboardChartWeightProgressClient data={mockData} isUsingMockData />;
  }

  // Prepare data for the chart by mapping userWeights
  const totalWeights: UserWeightData[] = userWeights.map((entry) => ({
    period: format(entry.recordedAt, "MM-dd-yyyy"), // Format the date
    totalWeight: entry.weight || 0, // Set totalWeight to the recorded weight
  }));

  // Prepare data for the chart based on intervals
  const intervals = calculateIntervals(dateRange);
  const adjustedData = intervals.map((interval) => {
    const { startOfInterval, endOfInterval } = getIntervalStartAndEndDates(
      interval,
      dateRange,
    );
    const period = format(startOfInterval, "MM-dd-yyyy");

    // Filter totalWeights to get those within the current interval
    let weightsUpToInterval = totalWeights.filter((item) => {
      const itemDate = new Date(item.period);
      return itemDate <= endOfInterval;
    });

    // Get the last recorded weight in the interval
    let lastTotalWeight =
      weightsUpToInterval.length > 0
        ? weightsUpToInterval[weightsUpToInterval.length - 1].totalWeight
        : 0;

    return {
      period,
      totalWeight: lastTotalWeight, // Return the total weight for the period
    };
  });

  return <DashboardChartWeightProgressClient data={adjustedData} />;
}