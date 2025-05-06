// C:\Users\anned\Desktop\fitformotion\app\(protected)\dashboard\_components\DashboardGoals\DashboardGoals.tsx
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { Progress } from "@nextui-org/progress";
import { UserGoal } from "@prisma/client";
import { IconTarget } from "@tabler/icons-react";
import Link from "next/link";
import CreateDashboardGoal from "./CreateDashboardGoal";
import DashboardGoalTemplate from "./DashboardGoalTemplate";

type ExerciseWithIdAndName = {
  id: string;
  name: string;
};

type GoalWithProgress = {
  progress?: number;
  bestValue?: number;
  Exercise: ExerciseWithIdAndName;
} & UserGoal;

export default async function DashboardGoals({
  isAdvancedView = false
}: {
  isAdvancedView?: boolean;
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const goals: GoalWithProgress[] = await prisma.userGoal.findMany({
    where: {
      userId,
    },
    include: {
      Exercise: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  for (const goal of goals) {
    const workoutLogs = await prisma.workoutLog.findMany({
      where: {
        userId,
        exercises: {
          some: {
            exerciseId: goal.exerciseId,
          },
        },
      },
      include: {
        exercises: {
          where: {
            exerciseId: goal.exerciseId,
          },
          include: {
            sets: true,
          },
        },
      },
    });

    let bestValue = 0;
    for (const workoutLog of workoutLogs) {
      for (const exercise of workoutLog.exercises) {
        for (const set of exercise.sets) {
          if ((set.weight ?? 0) > bestValue) {
            bestValue = set.weight ?? 0;
          }
        }
      }
    }

    goal.progress = bestValue / goal.goalValue;
    goal.bestValue = bestValue;
  }

  // In advanced view, show all goals. In beginner view, show a limited number.
  const displayGoals = isAdvancedView ? goals : goals.slice(0, 4);
  const maxGoals = isAdvancedView ? 8 : 4;

  return (
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Your Goals</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {displayGoals.map((goal, index) => (
            <DashboardGoalTemplate
              key={goal.id}
              title={`Goal ${index + 1}`}
              icon={<IconTarget className="text-primary" />}
              showSettings
              id={goal.id}
            >
              <div className="text-sm truncate mb-3">{goal.Exercise.name}</div>
              <div className="flex justify-between mb-3">
                <div className="text-sm">
                  Best: <span className="text-danger">{goal.bestValue}</span>
                </div>
                <div className="text-sm">
                  Target:{" "}
                  <span className="text-black dark:text-primary">
                    {goal.goalValue}
                  </span>
                </div>
              </div>
              <Progress
                aria-label="Goal Progress"
                value={(goal.progress || 0) * 100}
                color={
                  (goal.progress || 0) > 0.9 
                    ? "success" 
                    : (goal.progress || 0) > 0.5 
                      ? "primary" 
                      : "default"
                }
                showValueLabel={true}
                classNames={{
                  label: "text-xs"
                }}
              />
              
              <div className="text-xs mt-2 text-gray-500">
                {goal.progress && goal.progress >= 1 
                  ? "Goal achieved!" 
                  : `${Math.round((goal.progress || 0) * 100)}% complete`}
              </div>
              
              {!isAdvancedView && goal.progress && goal.progress < 1 && (
                <div className="text-xs mt-1 text-primary">
                  {Math.round((goal.goalValue - (goal.bestValue || 0)) * 10) / 10} more to reach your goal
                </div>
              )}
            </DashboardGoalTemplate>
          ))}

          {displayGoals.length < maxGoals && (
            <DashboardGoalTemplate
              title="Add New Goal"
              icon={<IconTarget className="text-primary" />}
            >
              <p className="text-sm mb-3 leading-none text-zinc-600 dark:text-zinc-400">
                Select a{" "}
                <Link href="/exercises" className="text-danger dark:text-primary">
                  favorite exercise
                </Link>{" "}
                to track
              </p>
              <CreateDashboardGoal />
            </DashboardGoalTemplate>
          )}
        </div>
      </div>
    </>
  );
}