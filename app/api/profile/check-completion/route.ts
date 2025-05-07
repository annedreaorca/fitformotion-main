import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user info from database
    const userInfo = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
      select: {
        birthdate: true,
        height: true,
        weight: true,
        fitnessGoals: true,
        experienceLevel: true,
        weeklySession: true,
        sessionTime: true,
        hasSeenWizard: true, // Include the hasSeenWizard field
      },
    });

    // Calculate if profile is complete
    const isComplete = userInfo && 
                        userInfo.birthdate &&
                        userInfo.height &&
                        userInfo.weight &&
                        userInfo.fitnessGoals &&
                        userInfo.experienceLevel &&
                        userInfo.weeklySession &&
                        userInfo.sessionTime;

    return NextResponse.json({
      isComplete: Boolean(isComplete),
      hasSeenWizard: Boolean(userInfo?.hasSeenWizard),
    });
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}