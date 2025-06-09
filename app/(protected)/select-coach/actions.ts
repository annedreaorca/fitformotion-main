// app/(protected)/select-coach/actions.ts
"use server";

import { clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function updateUserCoach(userId: string, coachId: string, coachName: string) {
  try {
    // Get current user metadata
    const user = await clerkClient.users.getUser(userId);
    
    // Update the user's public metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        coachId: coachId,
        coachName: coachName,
      }
    });

    // Revalidate the pages that might show this data
    revalidatePath("/select-coach");
    revalidatePath("/coach-users");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user coach:", error);
    return { success: false, error: "Failed to update coach assignment" };
  }
}

export async function removeUserCoach(userId: string) {
  try {
    // Get current user metadata
    const user = await clerkClient.users.getUser(userId);
    
    // Remove coach info from metadata
    const updatedMetadata = { ...user.publicMetadata };
    delete updatedMetadata.coachId;
    delete updatedMetadata.coachName;
    
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: updatedMetadata
    });

    // Revalidate the pages that might show this data
    revalidatePath("/select-coach");
    revalidatePath("/coach-users");
    
    return { success: true };
  } catch (error) {
    console.error("Error removing user coach:", error);
    return { success: false, error: "Failed to remove coach assignment" };
  }
}