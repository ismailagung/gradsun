import { describe, expect, it } from "vitest";
import { getAdminNavGroups } from "@/common/components/app-sidebar";

describe("Admin App Sidebar Navigation Structure (TDD)", () => {
  it("provides two distinct categories: Studio Operations and Content Management", () => {
    const groups = getAdminNavGroups((key: string) => key);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.labelKey).toBe("sectionOperations");
    expect(groups[1]?.labelKey).toBe("sectionContent");
  });

  it("retains all original operational pages inside Studio Operations", () => {
    const groups = getAdminNavGroups((key: string) => key);
    const operationsGroup = groups[0];
    expect(operationsGroup).toBeDefined();

    const urls = operationsGroup?.items.map((i) => i.url);
    expect(urls).toEqual([
      "/admin",
      "/admin/bookings",
      "/admin/packages",
      "/admin/studios",
      "/admin/galleries",
      "/admin/customers",
    ]);
  });

  it("contains all public portal client-side management pages inside Content Management", () => {
    const groups = getAdminNavGroups((key: string) => key);
    const contentGroup = groups[1];
    expect(contentGroup).toBeDefined();

    const urls = contentGroup?.items.map((i) => i.url);
    expect(urls).toEqual([
      "/admin/content",
      "/admin/content/showcase",
      "/admin/content/testimonials",
    ]);
  });
});
