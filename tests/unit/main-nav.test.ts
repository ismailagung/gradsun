import { describe, expect, it } from "vitest";
import {
  getNavItems,
  isNavActive,
  shouldRenderSiteHeader,
} from "@/common/components/shared/main-nav";

describe("Public Navigation & Site Header Governance", () => {
  describe("isNavActive route matching", () => {
    it("correctly identifies active state for exact root home path", () => {
      expect(isNavActive("/", "/")).toBe(true);
      expect(isNavActive("/gallery", "/")).toBe(false);
      expect(isNavActive("/packages", "/")).toBe(false);
      expect(isNavActive("/track-order", "/")).toBe(false);
    });

    it("correctly identifies active state for gallery and alias routes", () => {
      expect(isNavActive("/gallery", "/gallery")).toBe(true);
      expect(isNavActive("/gallery/item-1", "/gallery")).toBe(true);
      expect(isNavActive("/portfolio", "/gallery")).toBe(true);
      expect(isNavActive("/portfolio/session", "/gallery")).toBe(true);
      expect(isNavActive("/", "/gallery")).toBe(false);
      expect(isNavActive("/packages", "/gallery")).toBe(false);
    });

    it("correctly identifies active state for packages routes", () => {
      expect(isNavActive("/packages", "/packages")).toBe(true);
      expect(isNavActive("/packages/checkout", "/packages")).toBe(true);
      expect(isNavActive("/", "/packages")).toBe(false);
      expect(isNavActive("/track-order", "/packages")).toBe(false);
    });

    it("correctly identifies active state for track-order routes", () => {
      expect(isNavActive("/track-order", "/track-order")).toBe(true);
      expect(isNavActive("/track-order/INV-2025-001", "/track-order")).toBe(true);
      expect(isNavActive("/", "/track-order")).toBe(false);
      expect(isNavActive("/gallery", "/track-order")).toBe(false);
    });
  });

  describe("getNavItems navigation structure", () => {
    it("returns all standard public navigation items", () => {
      const items = getNavItems();
      expect(items).toHaveLength(4);
      expect(items.map((i) => i.href)).toEqual(["/", "/gallery", "/packages", "/track-order"]);
    });
  });

  describe("shouldRenderSiteHeader route visibility", () => {
    it("suppresses public header on admin, invoice, and auth routes", () => {
      expect(shouldRenderSiteHeader("/admin")).toBe(false);
      expect(shouldRenderSiteHeader("/admin/bookings")).toBe(false);
      expect(shouldRenderSiteHeader("/admin/studios")).toBe(false);
      expect(shouldRenderSiteHeader("/invoice/INV-123")).toBe(false);
      expect(shouldRenderSiteHeader("/login")).toBe(false);
    });

    it("renders public header on all storefront routes", () => {
      expect(shouldRenderSiteHeader("/")).toBe(true);
      expect(shouldRenderSiteHeader("/gallery")).toBe(true);
      expect(shouldRenderSiteHeader("/packages")).toBe(true);
      expect(shouldRenderSiteHeader("/track-order")).toBe(true);
    });
  });
});
