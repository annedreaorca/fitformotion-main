import { authMiddleware } from "@clerk/nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isBot = (req: NextRequest) => {
  const userAgent = req.headers.get("user-agent") || "";
  return /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|Slurp/.test(userAgent);
};

export default authMiddleware({
  publicRoutes: ["/", "/about-us", "/features", "/pricing", "/faq", "/references"],
  beforeAuth(req) {
    // Allow bots to proceed without authentication
    if (isBot(req)) {
      return NextResponse.next();
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", "/api/upload", "/gallery"],
};
