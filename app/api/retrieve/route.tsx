// app/api/retrieve/route.tsx
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function GET(req: NextRequest) {
  // Extract userId from the query parameters
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const images = await prisma.workoutImage.findMany({
      where: { userId: userId },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
