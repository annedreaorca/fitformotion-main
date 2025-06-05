import PageHeading from "@/components/PageHeading/PageHeading";
import prisma from "@/prisma/prisma";
import WorkoutManager from "./_components/WorkoutManager";

async function fetchRoutine(id: string) {
  return await prisma.workoutPlan.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      notes: true,
      WorkoutPlanExercise: {
        select: {
          Exercise: {
            select: {
              id: true,
              name: true,
            },
          },
          sets: true,
          reps: true,
          exerciseDuration: true,
          trackingType: true,
          order: true,
        },
      },
    },
  });
}

export default async function StartWorkout({
  params,
}: {
  params: { id: string };
}) {
  const workout = await fetchRoutine(params.id);

  if (!workout) {
    throw new Error("Workout not found");
  }

  return (
    <div className="page-container">
      <div className="flex items-center gap-[8px] mb-6">
        <PageHeading title={`Workout:`} />
        <p className="font-[600] text-[26px] max-[410px]:text-[22px] max text-zinc-800 dark:text-white">
          {workout.name}
        </p>
      </div>

      <WorkoutManager workout={workout} />
    </div>
  );
}
