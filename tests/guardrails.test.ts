import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runGuardrails } from "../scripts/guardrails";

describe("Guardrails Mechanical Engine", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "guardrails-test-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("Law 1: rejects tailwind.config.js/ts", () => {
    fs.writeFileSync(path.join(tempDir, "tailwind.config.ts"), "export default {};");
    const violations = runGuardrails(tempDir);
    expect(violations.some((v) => v.law === 1 && v.file === "tailwind.config.ts")).toBe(true);
  });

  it("Law 2: flags missing translation key between en-US and id-ID", () => {
    const msgDir = path.join(tempDir, "messages");
    fs.mkdirSync(msgDir, { recursive: true });
    fs.writeFileSync(
      path.join(msgDir, "en-US.json"),
      JSON.stringify({ hello: "Hello", missing: "Key" }),
    );
    fs.writeFileSync(path.join(msgDir, "id-ID.json"), JSON.stringify({ hello: "Halo" }));

    const violations = runGuardrails(tempDir);
    expect(violations.some((v) => v.law === 2 && v.message.includes("missing"))).toBe(true);
  });

  it("Law 3: detects process.env outside src/env.ts", () => {
    const srcDir = path.join(tempDir, "src", "modules", "sample");
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(srcDir, "sample.ts"), "const secret = process.env.SECRET;");

    const violations = runGuardrails(tempDir);
    expect(violations.some((v) => v.law === 3 && v.message.includes("process.env"))).toBe(true);
  });

  it("Law 4: flags direct Prisma call outside repositories", () => {
    const actionsDir = path.join(tempDir, "src", "modules", "booking", "actions");
    fs.mkdirSync(actionsDir, { recursive: true });
    fs.writeFileSync(
      path.join(actionsDir, "book.action.ts"),
      "export const action = async () => { return prisma.user.findMany(); };",
    );

    const violations = runGuardrails(tempDir);
    expect(violations.some((v) => v.law === 4 && v.message.includes("Prisma database query"))).toBe(
      true,
    );
  });

  it("Law 5: flags AGENTS.md exceeding 120 lines", () => {
    const longContent = Array.from({ length: 125 }, (_, i) => `Line ${i + 1}`).join("\n");
    fs.writeFileSync(path.join(tempDir, "AGENTS.md"), longContent);

    const violations = runGuardrails(tempDir);
    expect(violations.some((v) => v.law === 5 && v.message.includes("120 lines"))).toBe(true);
  });

  it("Law 6: flags banned packages in package.json", () => {
    const pkg = {
      name: "test-pkg",
      dependencies: {
        axios: "^1.0.0",
        "@radix-ui/react-dialog": "^1.0.0",
      },
    };
    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify(pkg));

    const violations = runGuardrails(tempDir);
    expect(violations.some((v) => v.law === 6 && v.message.includes("axios"))).toBe(true);
    expect(
      violations.some((v) => v.law === 6 && v.message.includes("@radix-ui/react-dialog")),
    ).toBe(true);
  });
});
