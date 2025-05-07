// C:\Users\anned\Desktop\fitformotion\utils\ProfileCompletion.ts
import prisma from "@/prisma/prisma";

export async function isProfileComplete(userId: string): Promise<boolean> {
  try {
    // Get user measurements from database
    const userInfo = await prisma.userInfo.findUnique({
      where: { userId },
      select: {
        height: true,
        weight: true,
        fitnessGoals: true,
        experienceLevel: true
      }
    });
    
    // If no user info exists, profile is definitely incomplete
    if (!userInfo) {
      return false;
    }
    
    // Focus on the essential fields for fitness tracking
    // We consider the profile complete if the user has provided:
    // - Height (physical measurement)
    // - Weight (physical measurement)
    // - Fitness goals (objective)
    // - Experience level (training context)
    
    return (
      userInfo.height !== null && 
      userInfo.weight !== null && 
      userInfo.fitnessGoals !== null && 
      userInfo.experienceLevel !== null
    );
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false; // Default to incomplete on error
  }
}