// app/api/profile/check-completion/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { isProfileComplete } from "@/utils/ProfileCompletion";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const isComplete = await isProfileComplete(user.id);
    
    return NextResponse.json({ isComplete });
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return NextResponse.json(
      { error: "Failed to check profile completion" },
      { status: 500 }
    );
  }
}