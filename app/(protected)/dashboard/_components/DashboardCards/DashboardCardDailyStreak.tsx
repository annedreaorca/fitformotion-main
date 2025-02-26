// DashboardCardDailyStreak.tsx
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { IconFlame } from "@tabler/icons-react";
import { differenceInCalendarDays } from "date-fns";
import DashboardCardTemplate from "./DashboardCardTemplate";

export default async function DashboardCardDailyStreak() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const workouts = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });

  let streak = 0;
  for (let i = 0; i < workouts.length - 1; i++) {
    const diff = differenceInCalendarDays(
      workouts[i].createdAt,
      workouts[i + 1].createdAt,
    );
    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }

  return (
    <DashboardCardTemplate
      title="Daily Streak"
      icon={<IconFlame className="text-primary" />}
    >
      {streak}
    </DashboardCardTemplate>
  );
}
