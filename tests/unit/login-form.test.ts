import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("LoginForm Component Presentation & Governance", () => {
  const repoRoot = process.cwd();
  const loginFormPath = path.join(repoRoot, "src/common/components/login-form.tsx");
  const content = fs.readFileSync(loginFormPath, "utf-8");

  it("Left Form: renders raw Gradsun PNG logo instead of letter 'G' avatar box", () => {
    expect(content).toContain('src="/gradsun-no-bg.png"');
    expect(content).not.toContain('{"G"}');
    expect(content).not.toContain(
      "bg-primary text-primary-foreground font-serif text-base font-semibold",
    );
  });

  it("Left Form: removes 'or continue with' divider and terms agreement notice", () => {
    expect(content).not.toContain('tAuth("orDivider")');
    expect(content).not.toContain("<FieldSeparator");
    expect(content).not.toContain('tAuth("termsNoticePre")');
  });

  it("Left Form: provides 'Back to Home' navigation button", () => {
    expect(content).toContain('tAuth("backToHome")');
    expect(content).not.toContain('tAuth("backToStorefront")');
  });

  it("Password Field: provides show/hide toggle using Lightbulb / LightbulbOff icons", () => {
    expect(content).toContain("Lightbulb");
    expect(content).toContain("LightbulbOff");
    // Explicitly enforce no eye icons per design mandate
    expect(content).not.toContain("Eye");
    expect(content).not.toContain("EyeOff");
  });

  it("Right Panel: removes EST tag and city list while keeping SemVer and editorial quote", () => {
    expect(content).not.toContain("EST. 2025");
    expect(content).not.toContain("Depok • Bandung • Yogyakarta");
    expect(content).toContain("v0.4.0");
    expect(content).toContain('tAuth("editorialQuote")');
  });

  it("Right Panel: displays subtle soft-blurred Gradsun logo in the background", () => {
    // Assert blurred background logo presence
    expect(content).toMatch(/blur-\[.*px\]|blur-xs|blur-sm/);
  });
});
