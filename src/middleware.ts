import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_expo") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname === "/app-index.html"
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/app-index.html", request.url));
}

export const config = {
  matcher: ["/:path*"],
};
