// types/globals.d.ts (Updated)
export {};

// Create a type for the roles
export type Roles = "admin" | "coach" | "member";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
    publicMetadata: {
      role?: Roles;
      coachId?: string;
      coachName?: string;
    };
  }
}