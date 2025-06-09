import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/prisma";
import { notFound, redirect } from "next/navigation";
import ImportRoutineClient from "../ImportRoutineClient";

type Exercise = {
  id: string;
  name: string;
  category: string;
};

type WorkoutPlanExercise = {
  Exercise: Exercise;
  sets: number;
  reps: number | null;
  exerciseDuration: number | null;
  trackingType: string | null;
  order: number | null;
};

type ExtendedWorkoutPlan = {
  id: string;
  name: string;
  notes: string | null;
  userId: string | null;
  WorkoutPlanExercise: WorkoutPlanExercise[];
};

export default async function ImportRoutineByShareId({
  params,
}: {
  params: { shareId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const shareId = params.shareId;

  // Find the routine by shareId
  const routine: ExtendedWorkoutPlan | null = await prisma.workoutPlan.findFirst({
    where: {
      shareId: shareId,
    },
    select: {
      id: true,
      name: true,
      notes: true,
      userId: true,
      WorkoutPlanExercise: {
        select: {
          sets: true,
          reps: true,
          exerciseDuration: true,
          trackingType: true,
          order: true,
          Exercise: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!routine) {
    notFound();
  }

  // Runtime check to ensure userId is not null
  if (!routine.userId) {
    notFound(); // Handle the case where userId is null
  }

  // Check if user is trying to import their own routine
  if (routine.userId === userId) {
    redirect("/workout?error=own-routine");
  }

  // Create a new object with the correct type after null check
  const routineWithUserId = {
    ...routine,
    userId: routine.userId as string // Safe assertion after null check
  };

  return <ImportRoutineClient routine={routineWithUserId} shareId={shareId} />;
}