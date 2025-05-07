import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { hasSeenWizard } = await req.json();

    // Update the user's hasSeenWizard status in the database
    await prisma.userInfo.update({
      where: {
        userId: userId,
      },
      data: {
        hasSeenWizard: hasSeenWizard,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Wizard status updated successfully",
    });
  } catch (error) {
    console.error("Error updating wizard status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}