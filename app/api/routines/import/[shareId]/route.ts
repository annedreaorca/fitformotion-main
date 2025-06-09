import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareId = params.shareId;

    // Find the routine by shareId
    const originalRoutine = await prisma.workoutPlan.findFirst({
      where: {
        shareId: shareId,
      },
      include: {
        WorkoutPlanExercise: {
          include: {
            Exercise: true,
          },
        },
      },
    });

    if (!originalRoutine) {
      return NextResponse.json(
        { message: "Routine not found or not shared" },
        { status: 404 }
      );
    }

    // Check if user is trying to import their own routine
    if (originalRoutine.userId === userId) {
      return NextResponse.json(
        { message: "You cannot import your own routine" },
        { status: 400 }
      );
    }

    // Create a copy for the current user
    const newRoutine = await prisma.workoutPlan.create({
      data: {
        name: `${originalRoutine.name} (Imported)`,
        notes: originalRoutine.notes,
        userId: userId,
        isSystemRoutine: false,
        shareId: null, // Don't copy the shareId
        WorkoutPlanExercise: {
          create: originalRoutine.WorkoutPlanExercise.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            exerciseDuration: exercise.exerciseDuration,
            trackingType: exercise.trackingType,
            order: exercise.order,
          })),
        },
      },
    });

    return NextResponse.json({
      routineId: newRoutine.id,
      message: "Routine imported successfully",
    });
  } catch (error) {
    console.error("Error importing routine:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}