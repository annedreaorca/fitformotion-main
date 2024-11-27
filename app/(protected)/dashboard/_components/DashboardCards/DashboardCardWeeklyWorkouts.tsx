// DashboardCardWeeklyWorkouts.tsx
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { IconCalendarWeek } from "@tabler/icons-react";
import DashboardCardTemplate from "./DashboardCardTemplate";

export default async function DashboardCardWeeklyWorkouts() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const workouts = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
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
