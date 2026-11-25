import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Site Branding & Logo Presentation Governance", () => {
  const repoRoot = process.cwd();
  const headerPath = path.join(repoRoot, "src/common/components/shared/site-header.tsx");
  const footerPath = path.join(repoRoot, "src/common/components/shared/site-footer.tsx");

  it("SiteHeader: renders PNG logo directly with original size-9 dimensions", () => {
    const content = fs.readFileSync(headerPath, "utf-8");
    expect(content).not.toContain("rounded-full border border-border bg-card");
    expect(content).toContain('src="/gradsun-no-bg.png"');
    expect(content).toContain('className="size-9 object-contain"');
  });

  it("SiteHeader: displays brand name only without secondary tagline subtitle", () => {
    const content = fs.readFileSync(headerPath, "utf-8");
    expect(content).toContain('{tNav("brand")}');
    expect(content).toContain("text-lg font-semibold");
    expect(content).not.toContain('{tNav("tagline")}');
  });

  it("SiteFooter: renders PNG logo directly without circular border container", () => {
    const content = fs.readFileSync(footerPath, "utf-8");
    expect(content).not.toContain("rounded-full border border-border bg-card");
    expect(content).toContain('src="/gradsun-no-bg.png"');
    expect(content).toContain('className="size-8 object-contain"');
  });
});
