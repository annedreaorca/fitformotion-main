// DashboardChartWorkoutFrequency.tsx
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";  
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import DashboardChartWorkoutFrequencyClient from "./DashboardChartWorkoutFrequency.client";

type WeeklyWorkoutData = {
  week: string;
  daysWorkedOut: number;
  startDate: string;
  endDate: string;
};

const mockData: WeeklyWorkoutData[] = [
  { week: 'Jan 7-13', daysWorkedOut: 2, startDate: '2025-01-07', endDate: '2025-01-13' },
  { week: 'Jan 14-20', daysWorkedOut: 3, startDate: '2025-01-14', endDate: '2025-01-20' },
  { week: 'Jan 21-27', daysWorkedOut: 1, startDate: '2025-01-21', endDate: '2025-01-27' },
  { week: 'Jan 28-Feb 3', daysWorkedOut: 4, startDate: '2025-01-28', endDate: '2025-02-03' },
  { week: 'Feb 4-10', daysWorkedOut: 2, startDate: '2025-02-04', endDate: '2025-02-10' },
  { week: 'Feb 11-17', daysWorkedOut: 5, startDate: '2025-02-11', endDate: '2025-02-17' },
  { week: 'Feb 18-24', daysWorkedOut: 3, startDate: '2025-02-18', endDate: '2025-02-24' },
  { week: 'Feb 25-Mar 3', daysWorkedOut: 4, startDate: '2025-02-25', endDate: '2025-03-03' },
  { week: 'Mar 4-10', daysWorkedOut: 2, startDate: '2025-03-04', endDate: '2025-03-10' },
  { week: 'Mar 11-17', daysWorkedOut: 5, startDate: '2025-03-11', endDate: '2025-03-17' },
  { week: 'Mar 18-24', daysWorkedOut: 4, startDate: '2025-03-18', endDate: '2025-03-24' },
  { week: 'Mar 25-31', daysWorkedOut: 3, startDate: '2025-03-25', endDate: '2025-03-31' },
  { week: 'Apr 1-7', daysWorkedOut: 5, startDate: '2025-04-01', endDate: '2025-04-07' },
  { week: 'Apr 8-14', daysWorkedOut: 2, startDate: '2025-04-08', endDate: '2025-04-14' },
];

export default async function DashboardChartWorkoutFrequency() {
  const { userId }: { userId: string | null } = auth();
  
  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  // Generate the last 12 weeks (3 months of data)
  const today = new Date();
  const weeks: Date[] = [];
  for (let i = 11; i >= 0; i--) {
    weeks.push(startOfWeek(subWeeks(today, i), { weekStartsOn: 1 })); // Start week on Monday
  }

  // Fetch all workout logs for the period
  const startDate = weeks[0];
  const workoutLogs = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate,
      },
    },
    select: {
      date: true,
    },
    distinct: ['date'], // Ensure we count each day only once
    orderBy: {
      date: "asc",
    },
  });

  if (workoutLogs.length === 0) {
    // Return mock data if no records
    return <DashboardChartWorkoutFrequencyClient data={mockData} isUsingMockData />;
  }

  // Group workouts by week and count unique days
  const weeklyData: WeeklyWorkoutData[] = weeks.map((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    // Count unique days with workouts in this week
    const uniqueWorkoutDays = new Set();
    workoutLogs.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= weekStart && logDate <= weekEnd) {
        // Use date string without time as the set key
        uniqueWorkoutDays.add(format(logDate, 'yyyy-MM-dd'));
      }
    });

    // Format week label with month and dates
    // Handle month transition in the week
    const monthStart = format(weekStart, 'MMM');
    const monthEnd = format(weekEnd, 'MMM');
    const weekLabel = monthStart === monthEnd 
      ? `${monthStart} ${format(weekStart, 'd')}-${format(weekEnd, 'd')}`
      : `${monthStart} ${format(weekStart, 'd')}-${monthEnd} ${format(weekEnd, 'd')}`;

    return {
      week: weekLabel,
      daysWorkedOut: uniqueWorkoutDays.size,
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(weekEnd, 'yyyy-MM-dd')
    };
  });

  return <DashboardChartWorkoutFrequencyClient data={weeklyData} />;
}