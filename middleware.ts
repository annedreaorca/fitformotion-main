// middleware.ts - simplified version
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about-us",
    "/features",
    "/pricing",
    "/faq",
    "/references",
    "/terms-of-service",
    "/privacy-policy",
    "/demo(.*)",
    "/profile-check" // Add this route as public for testing
  ]
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/api/upload",
    "/gallery",
  ],
};