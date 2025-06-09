// utils/roles.ts (Updated)
import { Roles } from "@/types/globals";
import { currentUser } from "@clerk/nextjs";

export const checkRole = async (role: Roles) => {
  const user = await currentUser();
  
  if (!user) return false;
  
  return user.publicMetadata?.role === role;
};

// Helper function to check if user is admin
export const isAdmin = async () => {
  return await checkRole("admin");
};

// Helper function to check if user is coach
export const isCoach = async () => {
  return await checkRole("coach");
};

// Helper function to check if user is member (or has no role - default member)
export const isMember = async () => {
  const user = await currentUser();
  if (!user) return false;
  
  const role = user.publicMetadata?.role as string;
  // User is a member if they have no role or explicit "member" role
  return !role || role === "member";
};

// Helper function to check if user has elevated permissions (admin or coach)
export const hasElevatedPermissions = async () => {
  const user = await currentUser();
  if (!user) return false;
  
  const role = user.publicMetadata?.role as string;
  return role === "admin" || role === "coach";
};

// Helper function to get user role
export const getUserRole = async () => {
  const user = await currentUser();
  if (!user) return "member";
  
  return (user.publicMetadata?.role as string) || "member";
};