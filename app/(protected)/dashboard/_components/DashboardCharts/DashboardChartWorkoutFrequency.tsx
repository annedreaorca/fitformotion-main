// import prisma from "@/prisma/prisma";
// import { auth } from "@clerk/nextjs";
// import { format, subDays } from "date-fns"; // Import subDays to calculate previous dates
// import DashboardChartWorkoutFrequencyClient from "./DashboardChartWorkoutFrequency.client";
// import {
//   calculateIntervals,
//   getIntervalStartAndEndDates,
// } from "./utils/dateUtils";

// type WorkoutFrequencyData = {
//   period: string;
//   workouts: number;
// };

// // Generate mock data for the previous 7 days
// const generateMockData = (): WorkoutFrequencyData[] => {
//   const mockData: WorkoutFrequencyData[] = [];
//   const today = new Date();

//   for (let i = 6; i >= 0; i--) {
//     const date = subDays(today, i); // Get the date for the past week
//     mockData.push({
//       period: format(date, "MM-dd-yyyy"), // Format the date
//       workouts: 0, // Set workouts to 0
//     });
//   }

//   return mockData;
// };

// export default async function DashboardChartWorkoutFrequency({
//   dateRange = "1W",
// }: {
//   dateRange?: string;
// }) {
//   const { userId }: { userId: string | null } = auth();

//   if (!userId) {
//     throw new Error("You must be signed in to view this page.");
//   }

//   const intervals = calculateIntervals(dateRange);

//   const workoutLogs = await prisma.workoutLog.groupBy({
//     by: ["date"],
//     where: {
//       userId: userId,
//       date: {
//         gte: intervals[0],
//       },
//     },
//     _count: {
//       _all: true,
//     },
//     orderBy: {
//       date: "asc",
//     },
//   });

//   if (workoutLogs.length === 0) {
//     // Use the generated mock data for the previous 7 days
//     const mockData = generateMockData();
//     return <DashboardChartWorkoutFrequencyClient data={mockData} isUsingMockData />;
//   }

//   const workoutsPerInterval = intervals.map(
//     (interval): WorkoutFrequencyData => {
//       const { startOfInterval, endOfInterval } = getIntervalStartAndEndDates(
//         interval,
//         dateRange,
//       );

//       const workoutsInInterval = workoutLogs.filter((log) => {
//         const logDate = new Date(log.date);
//         return logDate >= startOfInterval && logDate <= endOfInterval;
//       });

//       return {
//         period: format(startOfInterval, "MM-dd-yyyy"),
//         workouts: workoutsInInterval.length,
//       };
//     },
//   );

//   return <DashboardChartWorkoutFrequencyClient data={workoutsPerInterval} />;
// }

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import DashboardChartWorkoutFrequencyClient from "./DashboardChartWorkoutFrequency.client";
import {
  calculateIntervals,
  getIntervalStartAndEndDates,
} from "./utils/dateUtils";

type WorkoutFrequencyData = {
  period: string;
  workouts: number;
};

const mockData: WorkoutFrequencyData[] = [
  { period: '01-01-2024', workouts: 1 },
  { period: '02-01-2024', workouts: 3 },
  { period: '03-01-2024', workouts: 2 },
  { period: '04-01-2024', workouts: 4 },
  { period: '05-01-2024', workouts: 3 },
  { period: '06-01-2024', workouts: 5 },
  { period: '07-01-2024', workouts: 4 },
  { period: '08-01-2024', workouts: 6 },
  { period: '09-01-2024', workouts: 5 },
  { period: '10-01-2024', workouts: 7 },
];

export default async function DashboardChartWorkoutFrequency({
  dateRange = "1W",
}: {
  dateRange?: string;
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const intervals = calculateIntervals(dateRange);

  const workoutLogs = await prisma.workoutLog.groupBy({
    by: ["date"],
    where: {
      userId: userId,
      date: {
        gte: intervals[0],
      },
    },
    _count: {
      _all: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  if (workoutLogs.length === 0) {
    // Return mock data if no records
    return <DashboardChartWorkoutFrequencyClient data={mockData} isUsingMockData />;
  }

  const workoutsPerInterval = intervals.map(
    (interval): WorkoutFrequencyData => {
      const { startOfInterval, endOfInterval } = getIntervalStartAndEndDates(
        interval,
        dateRange,
      );

      const workoutsInInterval = workoutLogs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= startOfInterval && logDate <= endOfInterval;
      });

      return {
        period: format(startOfInterval, "MM-dd-yyyy"),
        workouts: workoutsInInterval.length,
      };
    },
  );

  return <DashboardChartWorkoutFrequencyClient data={workoutsPerInterval} />;
}