import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { IconCalendarWeek } from "@tabler/icons-react";
import { subDays } from "date-fns";
import DashboardCardTemplate from "./DashboardCardTemplate";

export default async function DashboardCardWeeklyWorkouts() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  // Get a date exactly 7 days ago
  const oneWeekAgo = subDays(new Date(), 7);
  
  const workouts = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: oneWeekAgo,
      },
    },
  });

  return (
    <DashboardCardTemplate
      title="Weekly Workouts"
      icon={<IconCalendarWeek className="text-primary" />}
    >
      {workouts.length}
    </DashboardCardTemplate>
  );
}