import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Site Branding & Logo Presentation Governance", () => {
  const repoRoot = process.cwd();
  const headerPath = path.join(repoRoot, "src/common/components/shared/site-header.tsx");
  const footerPath = path.join(repoRoot, "src/common/components/shared/site-footer.tsx");

  it("SiteHeader: renders enlarged PNG logo directly without circular border container", () => {
    const content = fs.readFileSync(headerPath, "utf-8");
    // Ensure the circular wrapper with border/bg-card is not present around the logo
    expect(content).not.toContain("rounded-full border border-border bg-card");
    expect(content).toContain('src="/gradsun-no-bg.png"');
    // Enlarge logo to size-11 (44px) for clear emblem visibility
    expect(content).toContain('className="size-11 object-contain"');
  });

  it("SiteHeader: displays brand name only without secondary tagline subtitle", () => {
    const content = fs.readFileSync(headerPath, "utf-8");
    expect(content).toContain('{tNav("brand")}');
    expect(content).not.toContain('{tNav("tagline")}');
  });

  it("SiteFooter: renders PNG logo directly without circular border container", () => {
    const content = fs.readFileSync(footerPath, "utf-8");
    expect(content).not.toContain("rounded-full border border-border bg-card");
    expect(content).toContain('src="/gradsun-no-bg.png"');
    expect(content).toContain('className="size-8 object-contain"');
  });
});
