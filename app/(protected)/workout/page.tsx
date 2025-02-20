import PageHeading from "@/components/PageHeading/PageHeading";
import { startTour } from "@/components/TourGuide/StartWorkoutGuide";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { Prisma, WorkoutPlan } from "@prisma/client";
import { IconPlus, IconWalk } from "@tabler/icons-react";
import Link from "next/link";
import RoutineCards from "./_components/RoutineCards";

type Exercise = {
  id: string;
  name: string;
  category: string;
};

type WorkoutPlanExercise = {
  Exercise: Exercise;
  order: number | null;
  sets: number;
};

type ExtendedWorkoutPlan = WorkoutPlan & {
  WorkoutPlanExercise: WorkoutPlanExercise[];
};

export default async function WorkoutPage() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("You must be signed in to view this page.");
  }

  const whereClause: Prisma.WorkoutPlanWhereInput[] = [
    { isSystemRoutine: true },
  ];

  if (userId && typeof userId === "string") {
    whereClause.push({
      userId: userId,
    });
  }

  const routines: ExtendedWorkoutPlan[] = await prisma.workoutPlan.findMany({
    where: {
      OR: whereClause,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      WorkoutPlanExercise: {
        select: {
          sets: true,
          reps: true,
          exerciseDuration: true,
          order: true,
          Exercise: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
      },
    },
  });

  const userRoutines = routines.filter((routine) => !routine.isSystemRoutine);
  const systemRoutines = routines.filter((routine) => routine.isSystemRoutine);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6" id="workout-header">
        <div id="workout-heading">
          <PageHeading title="Start Workout" />
        </div>
        <div className="flex gap-[10px] items-center">
          <button
            onClick={startTour}
            className="p-[5px] bg-zinc-800 text-white rounded-full hover:bg-zinc-700 w-10 h-10 flex items-center justify-center"
          >
            <IconWalk size={22} />
          </button>
          <Button
            as={Link}
            href="/edit-routine/step-1"
            color="primary"
            className="gap-unit-1"
            id="new-routine-button"
          >
            <IconPlus size={16} /> New Routine
          </Button>
        </div>
      </div>

      <div id="user-routines-section">
        <h2 className="font-semibold text-xl md:text-[22px] mb-5 mt-5">
          Your Routines
        </h2>
        {userRoutines.length > 0 ? (
          <RoutineCards routines={userRoutines} isSystem={false} />
        ) : (
          <p>
            No routines have been created.{" "}
            <Link
              className="text-danger dark:text-danger"
              href="/edit-routine/step-1"
            >
              Click here to create one
            </Link>
            .
          </p>
        )}
      </div>

      <div id="suggested-routines-section">
        <h3 className="font-semibold text-xl md:text-[22px] mb-5 mt-10">
          Suggested Routines
        </h3>
        <RoutineCards routines={systemRoutines} isSystem={true} />
      </div>
    </div>
  );
}
