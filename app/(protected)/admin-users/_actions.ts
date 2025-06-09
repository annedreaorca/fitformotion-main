"use server";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData) {
  // Check that the user trying to set the role is an admin
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    return { message: "Not Authorized" };
  }
  
  try {
    const userId = formData.get("id") as string;
    const role = formData.get("role") as string;
    
    // Handle empty role (make member)
    const roleToSet = role === "" ? undefined : role;
    
    console.log("Setting role:", { userId, role, roleToSet });
    
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: roleToSet ? { role: roleToSet } : {},
    });
    
    // Revalidate the page to show updated roles
    revalidatePath("/admin-users");
    
    return { message: `Role updated successfully to ${roleToSet || "member"}` };
  } catch (err) {
    console.error("Error setting role:", err);
    return { message: `Error: ${err}` };
  }
}