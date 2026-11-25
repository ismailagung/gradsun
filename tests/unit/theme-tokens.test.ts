import fs from "node:fs";
import path from "node:path";
import tailwind from "@tailwindcss/postcss";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

describe("Tailwind v4 Theme Tokens and Neutral Palette", () => {
  const globalsCssPath = path.join(process.cwd(), "src/app/globals.css");
  const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");

  it("globals.css defines @theme inline with essential color tokens", () => {
    expect(globalsCss).toContain("@theme inline");
    expect(globalsCss).toContain("--color-card: var(--card);");
    expect(globalsCss).toContain("--color-background: var(--background);");
    expect(globalsCss).toContain("--color-foreground: var(--foreground);");
  });

  it("globals.css does not contain unintended golden tints (#c4871a or #d99b26)", () => {
    expect(globalsCss).not.toContain("#c4871a");
    expect(globalsCss).not.toContain("#d99b26");
  });

  it("globals.css sets neutral primary and clean background", () => {
    expect(globalsCss).toContain("--primary: #18181b;");
    expect(globalsCss).toContain("--background: #ffffff;");
  });

  it("generates .bg-card utility via PostCSS compilation", async () => {
    const res = await postcss([tailwind()]).process(globalsCss, {
      from: globalsCssPath,
    });
    expect(res.css).toContain(".bg-card");
  });
});
