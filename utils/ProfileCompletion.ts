//ProfileCompletion.ts
import prisma from "@/prisma/prisma";

export async function isProfileComplete(userId: string): Promise<boolean> {
  const userInfo = await prisma.userInfo.findUnique({
    where: { userId },
    select: {
      birthdate: true,
      height: true,
      weight: true,
      fitnessGoals: true,
      experienceLevel: true,
      weeklySession: true,   
      sessionTime: true 
    }
  });
  
  // If no user info exists, profile is definitely incomplete
  if (!userInfo) {
    return false;
  }
  
  // Update this based on which fields you consider mandatory
  return !!(
    userInfo.birthdate && 
    userInfo.height && 
    userInfo.weight && 
    userInfo.fitnessGoals && 
    userInfo.experienceLevel && 
    userInfo.weeklySession && 
    userInfo.sessionTime  
  ); 
}