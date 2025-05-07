// app/api/exercises/[id]/instructions/route.ts
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exerciseId = params.id;

    // Fetch exercise instructions from the database
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: {
        instructions: true,
        name: true,
        tips: true,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      instructions: exercise.instructions,
      name: exercise.name,
      tips: exercise.tips,
    });
  } catch (error) {
    console.error("Error fetching exercise instructions:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise instructions" },
      { status: 500 }
    );
  }
}