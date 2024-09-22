import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/about-us", "/features", "/pricing", "/faq", "/contact-us", "/references"],
  
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", "/api/upload", "/gallery"],
};
