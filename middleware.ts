import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

const isBot = (req: NextRequest) => {
  const userAgent = req.headers.get("user-agent") || "";
  return /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|Slurp/.test(userAgent);
};

export default authMiddleware({
  publicRoutes: ["/", "/about-us", "/features", "/pricing", "/faq", "/references"],
  beforeAuth(req) {
    if (isBot(req)) {
      return NextResponse.next(); // Allow bots to proceed
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", "/api/upload", "/gallery"],
};