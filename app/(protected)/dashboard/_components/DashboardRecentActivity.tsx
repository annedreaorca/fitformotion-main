// C:\Users\anned\Desktop\fitformotion\app\(protected)\dashboard\_components\DashboardRecentActivity.tsx
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
}

export default async function DashboardRecentActivity({
  isAdvancedView = false
}: {
  isAdvancedView?: boolean;
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  // In advanced view, show more recent activity items
  const takeLimit = isAdvancedView ? 8 : 4;

  const recentActivity = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      inProgress: false,
    },
    take: takeLimit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      duration: true,
      createdAt: true,
      WorkoutPlan: {
        select: {
          name: true,
        },
      },
      exercises: {
        select: {
          id: true,
          Exercise: {
            select: {
              name: true,
            },
          },
          sets: {
            select: {
              weight: true,
              reps: true,
              exerciseDuration: true,
            },
          },
        },
      },
    },
  });

  return (
    <>
      {recentActivity.length > 0 && (
        <>
          <h2 className="mb-3 mt-2 text-lg">Recent Activity</h2>
          <div className={`grid grid-cols-1 md:grid-cols-1 ${isAdvancedView ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-3 mb-5`}>
            {recentActivity.map((activity) => {
              const totalWeight = activity.exercises.reduce(
                (total, exercise) => {
                  const exerciseWeight = exercise.sets.reduce(
                    (total, set) => total + (set.weight || 0),
                    0,
                  );
                  return total + exerciseWeight;
                },
                0,
              );

              return (
                <Card key={activity.id} shadow="none" className="shadow-md">
                  <CardHeader className="flex gap-3 px-5 pt-4">
                    <div className="flex flex-col flex-grow">
                      <p className="text-md text-black dark:text-primary leading-5">
                        {activity.WorkoutPlan.name}
                      </p>
                      <p className="text-xs text-default-500 leading-5">
                        <span className="flex space-x-1">
                          <time>
                            {format(new Date(activity.createdAt), "MM/dd/yyyy")}
                          </time>
                          <span className="text-zinc-500">|</span>
                          <span>{formatDuration(activity.duration)}</span>
                          <span className="text-zinc-500">|</span>
                          <span>{totalWeight} KG</span>
                        </span>
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0 px-5 pb-4">
                    <ul>
                      {activity.exercises.map((exercise) => (
                        <li
                          key={exercise.id}
                          className="flex gap-1 justify-between text-sm"
                        >
                          <p className="grow truncate">
                            {exercise.Exercise.name}
                          </p>
                          <p className="shrink-0">
                            {exercise.sets.length} Sets
                          </p>
                        </li>
                      ))}
                    </ul>
                    
                    {isAdvancedView && (
                      <div className="mt-3">
                        <Link href={`/activity/${activity.id}`} className="text-sm text-primary hover:underline">
                          View Details
                        </Link>
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button as={Link} href="/activity">
              View all activity
            </Button>
          </div>
        </>
      )}
    </>
  );
}