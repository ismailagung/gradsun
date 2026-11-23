import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({
  env: {
    NEXT_PUBLIC_APP_URL: "https://gradsun.id",
  },
}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getPhotographyStudioSchema } from "@/common/components/json-ld";

describe("SEO - Sitemap Generation", () => {
  it("should dynamically generate sitemap containing required public routes", () => {
    const items = sitemap();
    expect(Array.isArray(items)).toBe(true);

    const urls = items.map((item) => item.url);
    expect(urls.some((url) => url === "https://gradsun.id/")).toBe(true);
    expect(urls.some((url) => url === "https://gradsun.id/packages")).toBe(true);
    expect(urls.some((url) => url === "https://gradsun.id/gallery")).toBe(true);
    expect(urls.some((url) => url === "https://gradsun.id/track-order")).toBe(true);

    for (const item of items) {
      expect(item.url).toMatch(/^https?:\/\//);
      expect(item.lastModified).toBeDefined();
    }
  });
});

describe("SEO - Robots.txt Configuration", () => {
  it("should configure public crawling while disallowing admin and api routes", () => {
    const config = robots();
    expect(config.sitemap).toBe("https://gradsun.id/sitemap.xml");

    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    expect(rules.userAgent).toBe("*");
    expect(rules.allow).toBe("/");

    const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
    expect(disallow.some((d) => d?.includes("/admin"))).toBe(true);
    expect(disallow.some((d) => d?.includes("/api"))).toBe(true);
  });
});

describe("SEO - JSON-LD Structured Data", () => {
  it("should generate valid schema.org PhotographyStudio structured data", () => {
    const schema = getPhotographyStudioSchema();

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("PhotographyStudio");
    expect(schema.name).toContain("Gradsun");
    expect(schema.url).toBe("https://gradsun.id");
    expect(schema.priceRange).toBeDefined();

    // Opening hours validation
    expect(Array.isArray(schema.openingHoursSpecification)).toBe(true);
    expect(schema.openingHoursSpecification.length).toBeGreaterThan(0);
    expect(schema.openingHoursSpecification[0].opens).toBeDefined();
    expect(schema.openingHoursSpecification[0].closes).toBeDefined();

    // Address validation
    expect(schema.address).toBeDefined();
    expect(schema.address["@type"]).toBe("PostalAddress");
    expect(schema.address.addressCountry).toBe("ID");
  });
});
