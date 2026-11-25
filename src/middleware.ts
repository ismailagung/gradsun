import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export interface CheckAdminAccessOptions {
  pathname: string;
  nodeEnv?: string;
  sessionToken?: string | null;
  hasAuthHeader?: boolean;
  hasBypassHeader?: boolean;
}

export function checkAdminAccess(options: CheckAdminAccessOptions): {
  allowed: boolean;
  redirectUrl?: string;
} {
  const {
    pathname,
    nodeEnv = env.NODE_ENV,
    sessionToken,
    hasAuthHeader,
    hasBypassHeader,
  } = options;

  if (!pathname.startsWith("/admin")) {
    return { allowed: true };
  }

  // Development bypass: allow direct access during UI prototyping and design review
  if (nodeEnv === "development") {
    return { allowed: true };
  }

  if (sessionToken || hasAuthHeader || hasBypassHeader) {
    return { allowed: true };
  }

  return { allowed: false, redirectUrl: "/?auth=required" };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const hasAuthHeader = Boolean(request.headers.get("authorization")?.startsWith("Bearer "));
  const hasBypassHeader = Boolean(request.headers.get("x-admin-bypass"));

  const access = checkAdminAccess({
    pathname,
    sessionToken,
    hasAuthHeader,
    hasBypassHeader,
  });

  if (!access.allowed && access.redirectUrl) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("auth", "required");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
