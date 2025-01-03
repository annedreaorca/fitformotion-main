import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { IconHourglass } from "@tabler/icons-react";
import { subDays } from "date-fns";
import DashboardCardTemplate from "./DashboardCardTemplate";

export default async function DashboardCardAverageWorkoutDuration() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const thirtyDaysAgo = subDays(new Date(), 30);
  const workouts = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      duration: true,
    },
  });

  const totalDuration = workouts.reduce(
    (total, workout) => total + workout.duration / 60,
    0,
  );
  const averageDuration =
    workouts.length > 0 ? Math.round(totalDuration / workouts.length) : 0;

  return (
    <DashboardCardTemplate
      title="Avg Workout Time"
      icon={<IconHourglass className="text-primary" />}
    >
      <div className="flex gap-3 items-end">
        <span>{averageDuration}</span>
        <p className="text-[16px] mb-[-5px] text-zinc-400">minute/s</p>
      </div>
    </DashboardCardTemplate>
  );
}
