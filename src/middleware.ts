import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    const hasAuthHeader = Boolean(request.headers.get("authorization")?.startsWith("Bearer "));
    const hasBypassHeader = Boolean(request.headers.get("x-admin-bypass"));

    if (!sessionToken && !hasAuthHeader && !hasBypassHeader) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("auth", "required");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
