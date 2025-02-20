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
    "/demo(.*)" // Makes all subpages inside /demo public
  ],
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
