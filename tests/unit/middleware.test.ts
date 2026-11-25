import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({
  env: {
    NODE_ENV: "production",
  },
}));

import { checkAdminAccess } from "@/middleware";

describe("Middleware Admin Portal Access Governance", () => {
  it("allows non-admin routes freely regardless of environment", () => {
    expect(checkAdminAccess({ pathname: "/" }).allowed).toBe(true);
    expect(checkAdminAccess({ pathname: "/gallery" }).allowed).toBe(true);
    expect(checkAdminAccess({ pathname: "/packages" }).allowed).toBe(true);
    expect(checkAdminAccess({ pathname: "/login" }).allowed).toBe(true);
  });

  it("permits direct access to admin portal in development mode for UI auditing", () => {
    const result = checkAdminAccess({
      pathname: "/admin",
      nodeEnv: "development",
      sessionToken: null,
      hasAuthHeader: false,
      hasBypassHeader: false,
    });
    expect(result.allowed).toBe(true);
  });

  it("permits direct access to admin nested routes in development mode", () => {
    const result = checkAdminAccess({
      pathname: "/admin/bookings",
      nodeEnv: "development",
      sessionToken: null,
    });
    expect(result.allowed).toBe(true);
  });

  it("blocks unauthenticated admin access in production when no credentials provided", () => {
    const result = checkAdminAccess({
      pathname: "/admin",
      nodeEnv: "production",
      sessionToken: null,
      hasAuthHeader: false,
      hasBypassHeader: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.redirectUrl).toBe("/?auth=required");
  });

  it("allows admin access in production when valid session token exists", () => {
    const result = checkAdminAccess({
      pathname: "/admin",
      nodeEnv: "production",
      sessionToken: "valid-session-token-xyz",
    });
    expect(result.allowed).toBe(true);
  });

  it("allows admin access in production when authorization header or bypass header exists", () => {
    const withBearer = checkAdminAccess({
      pathname: "/admin/studios",
      nodeEnv: "production",
      hasAuthHeader: true,
    });
    expect(withBearer.allowed).toBe(true);

    const withBypass = checkAdminAccess({
      pathname: "/admin/galleries",
      nodeEnv: "production",
      hasBypassHeader: true,
    });
    expect(withBypass.allowed).toBe(true);
  });
});
