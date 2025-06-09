export {};

// Create a type for the roles
export type Roles = "admin" | "coach";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
    publicMetadata: {
      role?: Roles;
    };
  }
}