import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/welcome") {
    return NextResponse.redirect(new URL("/welcome.html", request.url));
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_expo") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/image") ||
    pathname === "/favicon.ico" ||
    pathname === "/sw.js" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/app-index.html" ||
    pathname === "/Logo.png" ||
    pathname.endsWith(".html")
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/app-index.html", request.url));
}

export const config = {
  matcher: ["/:path*"],
};
