import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const routineId = params.id;

    // Check if user owns this routine
    const routine = await prisma.workoutPlan.findFirst({
      where: {
        id: routineId,
        userId: userId,
      },
    });

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    // Generate shareId if it doesn't exist
    let shareId = routine.shareId;
    if (!shareId) {
      shareId = nanoid(10); // Generate a 10-character unique ID
      
      await prisma.workoutPlan.update({
        where: { id: routineId },
        data: { shareId },
      });
    }

    return NextResponse.json({ shareId });
  } catch (error) {
    console.error("Error generating share link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}