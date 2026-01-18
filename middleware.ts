import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Webmaster"',
    },
  });
}

function isProtectedPath(pathname: string) {
  return pathname === "/agentic-seo" || pathname.startsWith("/agentic-seo/") || pathname === "/pricing" || pathname.startsWith("/pricing/");
}

export function middleware(req: NextRequest) {
  if (!isProtectedPath(req.nextUrl.pathname)) return NextResponse.next();

  const expectedUser = process.env.WEBMASTER_USER || "";
  const expectedPass = process.env.WEBMASTER_PASS || "";
  if (!expectedUser || !expectedPass) return unauthorized();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return unauthorized();

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return unauthorized();

  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorized();
  }

  const [user, pass] = decoded.split(":");
  if (user !== expectedUser || pass !== expectedPass) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/agentic-seo/:path*", "/pricing/:path*"],
};
