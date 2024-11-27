// import prisma from "@/prisma/prisma";
// import { auth } from "@clerk/nextjs";
// import { format, subDays } from "date-fns"; // Import subDays to calculate previous dates
// import DashboardChartWeightProgressClient from "./DashboardChartWeightProgress.client"; // Adjust the import as needed
// import {
//   calculateIntervals,
//   getIntervalStartAndEndDates,
// } from "./utils/dateUtils";

// type UserWeightData = {
//   period: string; // This will represent the date
//   totalWeight: number; // This will represent the weight
// };

// // Generate mock data for the previous 7 days
// const generateMockData = (): UserWeightData[] => {
//   const mockData: UserWeightData[] = [];
//   const today = new Date();

//   for (let i = 6; i >= 0; i--) {
//     const date = subDays(today, i); // Get the date for the past week
//     mockData.push({
//       period: format(date, "MM-dd-yyyy"), 
//       totalWeight: 0, 
//     });
//   }

//   return mockData;
// };

// export default async function DashboardChartUserWeight({
//   dateRange = "1W",
// }: {
//   dateRange?: string;
// }) {
//   const { userId }: { userId: string | null } = auth();

//   if (!userId) {
//     throw new Error("You must be signed in to view this page.");
//   }

//   // Fetch user weight data from the UserWeight model
//   const userWeights = await prisma.userWeight.findMany({
//     where: {
//       userId: userId,
//       recordedAt: {
//         gte: subDays(new Date(), 7), // Fetch weights recorded in the last 7 days
//         lte: new Date(),
//       },
//     },
//     select: {
//       recordedAt: true, // Select the date when the weight was recorded
//       weight: true,     // Select the weight
//     },
//     orderBy: {
//       recordedAt: "asc", // Order by date in ascending order
//     },
//   });

//   if (userWeights.length === 0) {
//     // Use the generated mock data for the previous 7 days if no user weight data exists
//     const mockData = generateMockData();
//     return <DashboardChartWeightProgressClient data={mockData} isUsingMockData />;
//   }

//   // Prepare data for the chart by mapping userWeights
//   const totalWeights: UserWeightData[] = userWeights.map((entry) => ({
//     period: format(entry.recordedAt, "MM-dd-yyyy"), // Format the date
//     totalWeight: entry.weight || 0, // Set totalWeight to the recorded weight
//   }));

//   // Prepare data for the chart based on intervals
//   const intervals = calculateIntervals(dateRange);
//   const adjustedData = intervals.map((interval) => {
//     const { startOfInterval, endOfInterval } = getIntervalStartAndEndDates(
//       interval,
//       dateRange,
//     );
//     const period = format(startOfInterval, "MM-dd-yyyy");

//     // Filter totalWeights to get those within the current interval
//     let weightsUpToInterval = totalWeights.filter((item) => {
//       const itemDate = new Date(item.period);
//       return itemDate <= endOfInterval;
//     });

//     // Get the last recorded weight in the interval
//     let lastTotalWeight =
//       weightsUpToInterval.length > 0
//         ? weightsUpToInterval[weightsUpToInterval.length - 1].totalWeight
//         : 0;

//     return {
//       period,
//       totalWeight: lastTotalWeight, // Return the total weight for the period
//     };
//   });

//   return <DashboardChartWeightProgressClient data={adjustedData} />;
// }


import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { format, subDays } from "date-fns"; // Import subDays to calculate previous dates
import DashboardChartWeightProgressClient from "./DashboardChartWeightProgress.client"; // Adjust the import as needed
import {
  calculateIntervals,
  getIntervalStartAndEndDates,
} from "./utils/dateUtils";

type UserWeightData = {
  period: string;
  totalWeight: number; 
};

// Mock data
const mockData: UserWeightData[] = [
  { period: '01-01-2024', totalWeight: 100 },
  { period: '02-01-2024', totalWeight: 140 },
  { period: '03-01-2024', totalWeight: 120 },
  { period: '04-01-2024', totalWeight: 160 },
  { period: '05-01-2024', totalWeight: 150 },
  { period: '06-01-2024', totalWeight: 170 },
  { period: '07-01-2024', totalWeight: 160 },
  { period: '08-01-2024', totalWeight: 180 },
  { period: '09-01-2024', totalWeight: 170 },
  { period: '10-01-2024', totalWeight: 190 },

  // Add more mock data as needed
];

export default async function DashboardChartProgressOverTime({
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
        ? cumulativeWeightsUpToInterval[
            cumulativeWeightsUpToInterval.length - 1
          ].totalWeight
        : 0;

    return {
      period,
      totalWeight: lastCumulativeWeight,
    };
  });

  return <DashboardChartWeightProgressClient data={adjustedData} />;
}