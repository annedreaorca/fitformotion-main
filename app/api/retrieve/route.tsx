import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch images associated with the user
    const images = await prisma.workoutImage.findMany({
      where: { userId: userId },
      orderBy: { uploadedAt: "desc" },
    });

    // Return the images in the response
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
