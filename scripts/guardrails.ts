import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseSync } from "oxc-parser";

export interface GuardrailViolation {
  law: number;
  file: string;
  message: string;
  line?: number;
}

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "out",
  "coverage",
  ".superpowers",
  ".vercel",
]);

type AstNode = Record<string, unknown>;

function walkDirectory(dir: string, onFile: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(fullPath, onFile);
    } else if (entry.isFile()) {
      onFile(fullPath);
    }
  }
}

function walkAst(node: unknown, visit: (node: AstNode) => void) {
  if (!node || typeof node !== "object") return;
  const obj = node as AstNode;
  visit(obj);
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === "object") walkAst(item, visit);
      }
    } else if (val && typeof val === "object") {
      walkAst(val, visit);
    }
  }
}

export function runGuardrails(repoRoot: string): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];

  // ----------------------------------------------------
  // Law 1: UI & Styling Governance
  // ----------------------------------------------------
  const tailwindConfigs = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ];
  for (const cfg of tailwindConfigs) {
    if (fs.existsSync(path.join(repoRoot, cfg))) {
      violations.push({
        law: 1,
        file: cfg,
        message:
          "tailwind.config.* is banned. Tailwind CSS v4 uses CSS theme tokens in globals.css.",
      });
    }
  }

  // ----------------------------------------------------
  // Law 6: Banned Packages in package.json
  // ----------------------------------------------------
  const packageJsonPath = path.join(repoRoot, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      const bannedExact = new Set([
        "tailwindcss-animate",
        "@supabase/supabase-js",
        "@supabase/ssr",
        "moment",
        "dayjs",
        "luxon",
        "axios",
        "lodash",
        "underscore",
        "nanoid",
        "uuidv4",
      ]);

      for (const dep of Object.keys(allDeps)) {
        if (bannedExact.has(dep) || dep.startsWith("@radix-ui/") || dep.startsWith("@base-ui/")) {
          violations.push({
            law: 6,
            file: "package.json",
            message: `Banned package detected: ${dep} in package.json.`,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // ----------------------------------------------------
  // Law 2: Messages Dictionary Key Parity
  // ----------------------------------------------------
  const messagesDir = path.join(repoRoot, "messages");
  if (fs.existsSync(messagesDir)) {
    const enPath = path.join(messagesDir, "en-US.json");
    const idPath = path.join(messagesDir, "id-ID.json");

    if (fs.existsSync(enPath) && fs.existsSync(idPath)) {
      try {
        const enJson = JSON.parse(fs.readFileSync(enPath, "utf-8"));
        const idJson = JSON.parse(fs.readFileSync(idPath, "utf-8"));

        function collectKeys(obj: unknown, prefix = ""): Map<string, string> {
          const map = new Map<string, string>();
          if (!obj || typeof obj !== "object") return map;
          for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
            const full = prefix ? `${prefix}.${k}` : k;
            if (typeof v === "object" && v !== null && !Array.isArray(v)) {
              for (const [childK, childV] of collectKeys(v, full)) {
                map.set(childK, childV);
              }
            } else {
              map.set(full, String(v));
            }
          }
          return map;
        }

        const enKeys = collectKeys(enJson);
        const idKeys = collectKeys(idJson);

        for (const [k, v] of enKeys) {
          if (!idKeys.has(k)) {
            violations.push({
              law: 2,
              file: "messages/id-ID.json",
              message: `Missing translation key in id-ID: ${k}`,
            });
          }
          if (v.trim().length === 0) {
            violations.push({
              law: 2,
              file: "messages/en-US.json",
              message: `Empty translation value in en-US: ${k}`,
            });
          }
        }

        for (const [k] of idKeys) {
          if (!enKeys.has(k)) {
            violations.push({
              law: 2,
              file: "messages/en-US.json",
              message: `Missing translation key in en-US: ${k}`,
            });
          }
        }
      } catch {
        // syntax error
      }
    }
  }

  // ----------------------------------------------------
  // Law 3: Secret Isolation
  // ----------------------------------------------------
  const envExamplePath = path.join(repoRoot, ".env.example");
  if (fs.existsSync(envExamplePath)) {
    const lines = fs.readFileSync(envExamplePath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const rawValue = trimmed.slice(eqIdx + 1).trim();
        const value = rawValue.replace(/^["']|["']$/g, "").trim();
        if (value.length > 0) {
          const sensitiveKey = /SECRET|PASSWORD|PRIVATE_KEY|DATABASE_URL|DIRECT_URL/i.test(key);
          const isGeneric =
            value === "local" ||
            value === "http://localhost:3000" ||
            value.startsWith("placeholder") ||
            value.startsWith("your-");
          if (sensitiveKey && !isGeneric) {
            violations.push({
              law: 3,
              file: ".env.example",
              message: `Non-placeholder secret detected in .env.example: ${key}`,
            });
          }
        }
      }
    }
  }

  // ----------------------------------------------------
  // Law 5: Docs Integrity
  // ----------------------------------------------------
  const agentsPath = path.join(repoRoot, "AGENTS.md");
  if (fs.existsSync(agentsPath)) {
    const content = fs.readFileSync(agentsPath, "utf-8");
    const lines = content.split("\n").length;
    if (lines > 120) {
      violations.push({
        law: 5,
        file: "AGENTS.md",
        message: `AGENTS.md exceeds 120 lines budget (got ${lines}).`,
      });
    }
  }

  // Check Skills in .agents/skills/
  const skillsDir = path.join(repoRoot, ".agents", "skills");
  if (fs.existsSync(skillsDir)) {
    walkDirectory(skillsDir, (filePath) => {
      if (filePath.endsWith("SKILL.md")) {
        const rel = path.relative(repoRoot, filePath);
        const content = fs.readFileSync(filePath, "utf-8");
        if (
          !content.startsWith("---") ||
          !content.includes("name:") ||
          !content.includes("description:")
        ) {
          violations.push({
            law: 5,
            file: rel,
            message: `Skill file missing required name or description frontmatter in ${rel}.`,
          });
        }
      }
    });
  }

  // Check ADRs in docs/adr/
  const adrDir = path.join(repoRoot, "docs", "adr");
  if (fs.existsSync(adrDir)) {
    walkDirectory(adrDir, (filePath) => {
      if (filePath.endsWith(".md")) {
        const rel = path.relative(repoRoot, filePath);
        const content = fs.readFileSync(filePath, "utf-8");
        const requiredSections = ["Status", "Context", "Decision", "Consequences"];
        for (const sec of requiredSections) {
          if (!new RegExp(`##?\\s+${sec}`, "i").test(content)) {
            violations.push({
              law: 5,
              file: rel,
              message: `ADR missing required section "${sec}" in ${rel}.`,
            });
          }
        }
      }
    });
  }

  // ----------------------------------------------------
  // Source Tree Checks (AST & Path Walk)
  // ----------------------------------------------------
  const rawControls = new Set(["button", "input", "select", "textarea", "table"]);
  const arbitraryColorRegex =
    /(?:^|\s)(?:[\w-]+:)*(?:bg|text|border|fill|stroke|ring|accent|outline|from|to|via)-\[(?:#[0-9a-fA-F]+|(?:rgb|rgba|hsl|hsla)\([^\]]+\))\]/;

  walkDirectory(repoRoot, (filePath) => {
    const rel = path.relative(repoRoot, filePath);
    const isAppOrModule =
      rel.startsWith(path.join("src", "app")) || rel.startsWith(path.join("src", "modules"));
    const isSrc = rel.startsWith("src");

    // Law 3: Committed .env files forbidden
    if (path.basename(filePath).startsWith(".env") && path.basename(filePath) !== ".env.example") {
      if (path.basename(filePath) === ".env.local") {
        try {
          execSync(`git ls-files --error-unmatch "${filePath}"`, { stdio: "ignore" });
          violations.push({ law: 3, file: rel, message: `Committed .env file forbidden: ${rel}.` });
        } catch {
          // Untracked local env file is fine
        }
        return;
      }
      violations.push({ law: 3, file: rel, message: `Committed .env file forbidden: ${rel}.` });
      return;
    }

    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;
    const content = fs.readFileSync(filePath, "utf-8");

    // Law 3: process.env isolation
    const isAllowedEnv =
      rel === path.join("src", "env.ts") ||
      rel === "next.config.ts" ||
      rel.startsWith("tests") ||
      rel.startsWith("scripts");
    if (!isAllowedEnv && /\bprocess\.env\b/.test(content)) {
      violations.push({
        law: 3,
        file: rel,
        message: `process.env usage forbidden outside src/env.ts in ${rel}.`,
      });
    }

    // Law 4: Role name comparisons banned
    if (isSrc) {
      if (/\b\.role\s*[!=]==?/.test(content)) {
        violations.push({
          law: 4,
          file: rel,
          message: `Hardcoded role comparison (.role === / !==) in ${rel}.`,
        });
      }
      if (/\bhasRole\s*\(/.test(content)) {
        violations.push({
          law: 4,
          file: rel,
          message: `Hardcoded role comparison hasRole() in ${rel}.`,
        });
      }
    }

    // Law 4: Prisma Access Isolation Rule
    const isAllowedPrisma =
      rel.includes(path.join("repositories")) ||
      rel.startsWith(path.join("src", "infrastructure", "prisma")) ||
      rel.startsWith("tests");
    if (
      !isAllowedPrisma &&
      /\bprisma\.[a-zA-Z]+\.(findMany|findUnique|findFirst|create|update|delete|upsert|count|aggregate)\b/.test(
        content,
      )
    ) {
      violations.push({
        law: 4,
        file: rel,
        message: `Direct Prisma database query forbidden outside repositories/ in ${rel}. Follow Clean Architecture dependency flow.`,
      });
    }

    // Law 6: Safe action required for server actions
    if (isAppOrModule && /^\s*["']use server["']/m.test(content)) {
      if (
        !content.includes("actionClient") &&
        !content.includes("safeAction") &&
        !content.includes("next-safe-action")
      ) {
        violations.push({
          law: 6,
          file: rel,
          message: `Server action in 'use server' file must use safe-action in ${rel}.`,
        });
      }
    }

    // AST Parse for JSX/UI Checks
    try {
      const parsed = parseSync(filePath, content);
      if (!parsed?.program) return;

      walkAst(parsed.program, (node) => {
        if (node.type === "ImportDeclaration" && node.source) {
          const src = String((node.source as AstNode).value || "");
          if (src.includes("/components/ui/form")) {
            violations.push({
              law: 1,
              file: rel,
              message: `Legacy FormField / ui/form import in ${rel}. Use shadcn Field + Controller.`,
            });
          }
        }

        if (isAppOrModule && node.type === "JSXElement") {
          const opening = node.openingElement as AstNode | undefined;
          const nameNode = opening?.name as AstNode | undefined;
          const elemName = typeof nameNode?.name === "string" ? nameNode.name : "";

          // Law 1: Raw HTML controls
          if (elemName && rawControls.has(elemName)) {
            violations.push({
              law: 1,
              file: rel,
              message: `Raw HTML control <${elemName}> forbidden in ${rel}. Use shadcn components.`,
            });
          }

          // Law 1 & Law 2 attributes
          const attrs = Array.isArray(opening?.attributes) ? opening.attributes : [];
          for (const item of attrs) {
            const attr = item as AstNode;
            if (attr.type === "JSXAttribute" && attr.name) {
              const attrName =
                typeof (attr.name as AstNode)?.name === "string" ? (attr.name as AstNode).name : "";
              const valNode = attr.value as AstNode | undefined;

              if (
                attrName === "className" &&
                valNode?.type === "Literal" &&
                typeof valNode.value === "string"
              ) {
                if (arbitraryColorRegex.test(valNode.value)) {
                  violations.push({
                    law: 1,
                    file: rel,
                    message: `Arbitrary color class forbidden in ${rel}. Use theme tokens.`,
                  });
                }
              }

              if (
                ["placeholder", "title", "aria-label", "alt"].includes(attrName as string) &&
                valNode?.type === "Literal" &&
                typeof valNode.value === "string"
              ) {
                violations.push({
                  law: 2,
                  file: rel,
                  message: `Literal UI attribute "${attrName}" in ${rel}. Use next-intl.`,
                });
              }
            }
          }

          // Law 2: Literal JSX Text
          const children = Array.isArray(node.children) ? node.children : [];
          for (const c of children) {
            const child = c as AstNode;
            if (child.type === "JSXText") {
              const text = typeof child.value === "string" ? child.value.trim() : "";
              if (text && text.length > 0) {
                violations.push({
                  law: 2,
                  file: rel,
                  message: `Untranslated JSX text literal "${text}" in ${rel}. Use next-intl.`,
                });
              }
            }
          }
        }
      });
    } catch {
      // ignore
    }
  });

  return violations;
}

if (process.argv[1]?.endsWith("guardrails.ts")) {
  const repoRoot = process.cwd();
  const violations = runGuardrails(repoRoot);
  if (violations.length > 0) {
    console.error(`\x1b[31m[GUARDRAIL ERROR]\x1b[0m ${violations.length} violations detected:`);
    for (const v of violations) {
      console.error(`  - [Law ${v.law}] \x1b[33m${v.file}\x1b[0m: ${v.message}`);
    }
    process.exit(1);
  }
  console.log("\x1b[32m[GUARDRAILS PASSED]\x1b[0m All 6 Mechanical Laws satisfied cleanly.");
  process.exit(0);
}
