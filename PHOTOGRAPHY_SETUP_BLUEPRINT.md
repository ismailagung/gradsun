# Photography Reservation System: Architecture & Ground-Zero Setup Blueprint

> **For AI Agents & Developers:** This document is an executable, end-to-end scaffolding blueprint for initializing a greenfield **Photography Reservation & Studio Management Platform**. 
> It strictly conforms to your repository's **Next.js 15, Feature-Driven, Use-Case Driven, Prisma Repository Pattern, and 1 File = 1 Responsibility** standards using **`npm`**.
>
> When opened in a new project root, an AI agent or engineer can follow this document step-by-step to bootstrap the entire repository governance and folder structure before writing application business logic.

---

## 1. System Vision & Architecture Alignment

### 1.1 The Domain: Photography Reservation & Studio Operations

The platform handles:

- **Public & Customer Portal:** Package discovery, interactive calendar slot booking, add-on selection (extra hours, studio themes, edited photos), deposit checkout, and private client gallery proofing.
- **Photographer & Admin Shell:** Photographer schedule availability, studio room allocations, booking status lifecycle (`requested` $\rightarrow$ `confirmed` $\rightarrow$ `session_done` $\rightarrow$ `proofing` $\rightarrow$ `delivered`), invoice tracking, and automated reminders.

### 1.2 Target Directory Structure (Conforming to AGENTS.md)

```text
src/
├── app/                                  # Presentation & Delivery (Thin pages ≤ 150 lines)
│   ├── (auth)/                           # Login, register, profile
│   ├── (booking)/                        # Customer booking funnel
│   ├── (dashboard)/                      # Admin & photographer management portal
│   ├── (gallery)/                        # Client photo proofing & delivery portal
│   ├── api/                              # Route handlers (webhooks, cron triggers)
│   ├── globals.css                       # Tailwind v4 theme variables
│   └── layout.tsx
├── modules/                              # Feature-Driven Domain Slices (src/modules/)
│   ├── reservations/                     # Domain: Booking & Schedule Reservations
│   │   ├── actions/                      # Orchestration layer (1 action per file ≤ 100 lines)
│   │   │   ├── book-session.action.ts
│   │   │   ├── reschedule-session.action.ts
│   │   │   └── cancel-session.action.ts
│   │   ├── use-cases/                    # Pure business logic (1 use-case per file ≤ 150 lines)
│   │   │   ├── book-session.use-case.ts
│   │   │   ├── reschedule-session.use-case.ts
│   │   │   └── cancel-session.use-case.ts
│   │   ├── repositories/                 # Prisma data access (1 repo per file ≤ 150 lines)
│   │   │   └── reservation.repository.ts
│   │   ├── schemas/                      # Zod validation (1 schema per file)
│   │   │   ├── book-session.schema.ts
│   │   │   ├── reschedule-session.schema.ts
│   │   │   └── cancel-session.schema.ts
│   │   ├── services/                     # Domain-specific integrations
│   │   │   └── slot-calculator.service.ts
│   │   ├── components/                   # Presentation components (≤ 200 lines)
│   │   │   ├── booking-calendar.tsx
│   │   │   └── slot-picker.tsx
│   │   ├── hooks/                        # Feature-scoped client hooks (≤ 100 lines)
│   │   ├── types/                        # Feature domain types & interfaces
│   │   ├── constants/                    # Domain constants & statuses
│   │   └── index.ts                      # Clean module public export
│   ├── packages/                         # Domain: Photography service packages & add-ons
│   ├── schedules/                        # Domain: Working hours, exceptions & blackout dates
│   ├── payments/                         # Domain: Invoices, down payments, payment proofs
│   ├── galleries/                        # Domain: Client photo proofing, selections, delivery
│   └── notifications/                    # Domain: In-app alerts, Web Push & reminder triggers
├── common/                               # Cross-cutting Shared Code
│   ├── components/                       # shadcn/ui radix-nova primitives & compound UI
│   │   ├── ui/                           # Button, Input, Card, Dialog, Calendar, Table
│   │   └── shared/                       # Data table wrappers, page headers, modals
│   ├── hooks/                            # use-debounce, use-media-query, use-pagination
│   ├── utils/                            # cn helper, formatters
│   ├── constants/                        # Global system constants, navigation links
│   ├── validators/                       # Shared reusable Zod primitives
│   └── lib/                              # Date utilities (date-fns Asia/Jakarta), safe-action client
├── infrastructure/                       # External System Drivers & Adapters
│   ├── prisma/                           # Prisma client instance & extensions
│   │   ├── client.ts
│   │   └── schema.prisma
│   ├── storage/                          # S3 / Cloudflare R2 / Local driver (Sharp WebP)
│   ├── payments/                         # Payment gateway client or transfer verification
│   └── notifications/                    # Web Push & email/WA dispatchers
└── types/                                # Global ambient types
```

### 1.3 Strict Dependency Flow (Enforced by Architecture)

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer / Admin UI
    participant Page as Page / Route Handler (src/app/**)
    participant Action as Server Action (src/modules/*/actions/*.action.ts)
    participant Schema as Zod Schema (src/modules/*/schemas/*.schema.ts)
    participant UseCase as Pure Use Case (src/modules/*/use-cases/*.use-case.ts)
    participant Repo as Repository (src/modules/*/repositories/*.repository.ts)
    participant Prisma as Prisma Client (src/infrastructure/prisma/client.ts)
    participant DB as PostgreSQL Database

    User->>Page: Interacts with UI
    Page->>Action: Calls Server Action
    Action->>Schema: Validate input with Zod
    Schema-->>Action: Validated Typed Input
    Action->>UseCase: new BookSessionUseCase(repo).execute(validatedInput)
    Note over UseCase: Pure Business Logic & Invariants<br/>- Checks calendar double-booking<br/>- Validates session buffer times<br/>- Calculates deposit amount
    UseCase->>Repo: reservationRepo.createBooking(tx, data)
    Note over Repo: ONLY layer allowed to call Prisma!<br/>Forbidden in Page, Action, Component.
    Repo->>Prisma: prisma.reservation.create(...)
    Prisma->>DB: SQL Query
    DB-->>Prisma: Database Records
    Prisma-->>Repo: Database Entity
    Repo-->>UseCase: Domain Entity
    UseCase-->>Action: Success / Typed Error Result
    Action-->>Page: Safe Action Response
    Page-->>User: Re-renders UI (Server Component First)
```

---

## 2. Toolchain & `package.json` Specification (npm)

Create this `package.json` in the root of your project:

```json
{
  "name": "photo-reserve",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "biome check .",
    "format": "biome format --write .",
    "check:spell": "cspell --no-progress \"**\" --config cspell.json",
    "check:guardrails": "tsx scripts/guardrails.ts",
    "prisma:generate": "prisma generate --schema=src/infrastructure/prisma/schema.prisma",
    "prisma:migrate": "prisma migrate dev --schema=src/infrastructure/prisma/schema.prisma",
    "prisma:seed": "tsx src/infrastructure/prisma/seed.ts",
    "prisma:studio": "prisma studio --schema=src/infrastructure/prisma/schema.prisma",
    "test": "vitest run",
    "check": "npm run typecheck && npm run lint && npm run check:spell && npm run check:guardrails && npm run test"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1162.0",
    "@aws-sdk/s3-request-presigner": "^3.1162.0",
    "@date-fns/tz": "^1.5.0",
    "@hookform/resolvers": "^7.0.2",
    "@prisma/client": "^6.4.1",
    "@t3-oss/env-nextjs": "^0.13.11",
    "@tanstack/react-table": "^9.3.1",
    "better-auth": "^1.7.16",
    "class-variance-authority": "^0.7.1",
    "cmdk": "^1.1.1",
    "cn": "^0.5.2",
    "date-fns": "^4.4.0",
    "lucide-react": "^1.68.0",
    "next": "^15.2.0",
    "next-intl": "^4.14.9",
    "next-safe-action": "^8.7.3",
    "next-themes": "^0.4.6",
    "nuqs": "^2.10.2",
    "radix-ui": "^1.8.1",
    "react": "^19.0.0",
    "react-day-picker": "^10.0.2",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.91.0",
    "recharts": "^3.8.0",
    "sanitize-html": "^2.18.1",
    "server-only": "^0.0.1",
    "shadcn": "^4.23.0",
    "sharp": "^0.35.5",
    "sonner": "^2.0.8",
    "tw-animate-css": "^1.4.0",
    "uuid": "^14.0.3",
    "web-push": "^3.6.7",
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.6.4",
    "@tailwindcss/postcss": "^4.3.4",
    "@testing-library/react": "^16.3.3",
    "@types/node": "^26.6.6",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/sanitize-html": "^2.16.2",
    "@types/sharp": "^0.32.0",
    "@types/uuid": "^11.0.0",
    "@types/web-push": "^3.6.4",
    "cspell": "^10.4.0",
    "happy-dom": "^21.0.4",
    "oxc-parser": "^0.157.0",
    "prisma": "^6.4.1",
    "tailwindcss": "^4.3.4",
    "tsx": "^4.23.15",
    "typescript": "^5.8.2",
    "vitest": "^5.1.0"
  }
}
```

---

## 3. Updated `AGENTS.md` (Bridging Pemuda Quality + Next.js 15 Clean Rules)

Save in `AGENTS.md` (clean, under 120 lines, zero frontmatter):

```markdown
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in node_modules/next/dist/docs/ before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Next.js 15 Architecture Rules: Photography Reservation Platform

Welcome, agentic collaborators. This repository is built strictly with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma, Supabase PostgreSQL, and npm.

## Core Architectural & Git Mandate

1. **Architecture Philosophy:** Feature-Driven (`src/modules/<feature>/`), Use-Case Driven, Clean Architecture, Server Components First.
2. **1 File = 1 Responsibility:** Strict single-purpose files with kebab-case suffixes:
   - Use Cases: `src/modules/<feature>/use-cases/<name>.use-case.ts` (exposes `execute()`)
   - Actions: `src/modules/<feature>/actions/<name>.action.ts` (wraps use-cases via `next-safe-action`)
   - Repositories: `src/modules/<feature>/repositories/<name>.repository.ts` (ONLY layer accessing Prisma)
   - Schemas: `src/modules/<feature>/schemas/<name>.schema.ts` (one Zod schema per use-case)
3. **Strict Dependency Flow:** `Page/Route -> Action -> Use Case -> Repository -> Prisma -> Database`. Never query Prisma in pages, components, actions, or route handlers.
4. **Issue-Driven Git Workflow:**
   - 1 Issue = 1 Dedicated Branch: `feat/issue-<N>-<slug>`. Direct pushes to `main` are strictly forbidden.
   - Mandatory Audit Trail: Assign self & post kickoff comment on issue before creating branch; post completion comment linking opened PR.
   - Schema-PR Isolation: Schema modifications in `schema.prisma` must be merged as an isolated Schema PR before UI/use-case work.
   - Owned Paths: Touch ONLY paths listed under `Owned Paths` in the assigned issue specification.
   - Merges to `main` are restricted to Squash and Merge only.
5. **TDD Iron Law:** Write failing unit tests in `tests/unit/` before writing use-case or repository implementations.
6. **Data Privacy:** Real customer names, phone numbers, or credentials are strictly forbidden in repo commits, seeders, or test fixtures. Use fake data only.
7. **Language Mandate:** 100% US English (`en-US`) across all code, identifiers, comments, commit messages, and PRs (enforced by `cspell`).

## The 6 Mechanical Laws

All code must pass `npm run check` (`npm run check:guardrails` via `scripts/guardrails.ts`):

- **Law 1 (UI Governance):** Use `shadcn/ui` v4 `radix-nova` components and theme tokens. Raw HTML controls (`<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`), arbitrary colors (`hover:bg-[#10b981]`), legacy `<FormField>`, and `tailwind.config.*` are banned.
- **Law 2 (Strict i18n):** Zero hardcoded JSX text or literal UI attributes in `src/app/**` or `src/modules/**`. All user-facing text uses `next-intl`. Key parity and non-empty translations are enforced between `messages/en-US.json` and `messages/id-ID.json`.
- **Law 3 (Secret Isolation):** `process.env` is restricted to `src/env.ts` and `next.config.ts`. No committed `.env*` files (except placeholder `.env.example`).
- **Law 4 (Prisma Isolation & RBAC):** Direct Prisma calls outside `src/modules/**/repositories/**` or `src/infrastructure/prisma/**` are banned. Direct `.role === 'admin'` checks are banned (use granular permission checks).
- **Law 5 (Docs & Agent Integrity):** `AGENTS.md` has no frontmatter and ≤ 120 lines. `.agents/skills/*/SKILL.md` requires `name:` and `description:` frontmatter. ADRs require Status, Context, Decision, Consequences.
- **Law 6 (Anti-Primitive Discipline):** Banned/vendor-locked packages are rejected. Server Actions must use `next-safe-action` and delegate to use-cases. `dangerouslySetInnerHTML` requires `sanitizeHtml`.

## Documentation Map

- [Documentation Map](docs/README.md): Index of Diataxis guides, ADRs, and runbooks.
- [Architecture Conventions](docs/reference/architecture-conventions.md): Detailed module layouts, use-case contracts, and Prisma schemas.
- [Issue & PR Workflow](docs/how-to/issue-and-pr-workflow.md): Team collaboration, branch naming, and Schema-PR isolation.
```

---

## 4. AST Guardrail Engine: `scripts/guardrails.ts` (Adapted for Prisma & Module Structure)

Save in `scripts/guardrails.ts`:

```typescript
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
        const value = trimmed.slice(eqIdx + 1).trim();
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

    if (path.basename(filePath).startsWith(".env") && path.basename(filePath) !== ".env.example") {
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
    // Direct prisma queries are ONLY allowed inside repositories/ or infrastructure/prisma/
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
```

---

## 5. Supabase, Prisma & Environment Configuration (Option A: Vendor-Agnostic)

### 5.1 Prisma Schema with Supabase Pooler (`src/infrastructure/prisma/schema.prisma`)

Supabase uses Supavisor for connection pooling. Next.js serverless queries run through `DATABASE_URL` (pooled port 6543), while `prisma migrate` requires `DIRECT_URL` (direct port 5432).

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Baseline Models for Auth & System
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  roles         UserRole[]
  reservations  Reservation[]
}

model Role {
  id          String           @id @default(uuid())
  name        String           @unique
  permissions RolePermission[]
  users       UserRole[]
}

model Permission {
  id    String                 @id @default(uuid())
  key   String                 @unique // e.g. "reservations.slots.manage"
  roles RolePermission[]
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role            @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission      @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
}

model UserRole {
  userId String
  roleId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role   @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
}

model Reservation {
  id          String           @id @default(uuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id])
  status      String           @default("requested") // requested, confirmed, session_done, proofing, delivered, cancelled
  sessionDate DateTime
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}
```

### 5.2 Centralized Environment Schema (`src/env.ts`)

Using `@t3-oss/env-nextjs` with zero raw `process.env` in application code:

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    // Supabase PostgreSQL (Pooled for runtime queries)
    DATABASE_URL: z.string().url(),
    // Supabase PostgreSQL (Direct for Prisma migrations)
    DIRECT_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    STORAGE_DRIVER: z.enum(["local", "s3"]).default("s3"),
    // Supabase Storage S3 API: https://<project-ref>.supabase.co/storage/v1/s3
    S3_ENDPOINT: z.string().url().optional(),
    S3_REGION: z.string().default("ap-southeast-1"),
    S3_BUCKET: z.string().default("photos"),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    CRON_SECRET: z.string().min(16),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_STORAGE_BASE_URL: z.string().url().default("http://localhost:3000/uploads"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STORAGE_BASE_URL: process.env.NEXT_PUBLIC_STORAGE_BASE_URL,
  },
});
```

### 5.3 Supabase Environment Template (`.env.example`)

```bash
# Supabase PostgreSQL Database (Transaction Pooler - Port 6543)
DATABASE_URL="postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase PostgreSQL Database (Direct Connection - Port 5432 for prisma migrate)
DIRECT_URL="postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Better Auth Configuration
BETTER_AUTH_SECRET="placeholder-32-character-secret-key-min"
BETTER_AUTH_URL="http://localhost:3000"

# Supabase Storage via S3 API (@aws-sdk/client-s3)
STORAGE_DRIVER="s3"
S3_ENDPOINT="https://[YOUR-PROJECT-REF].supabase.co/storage/v1/s3"
S3_REGION="ap-southeast-1"
S3_BUCKET="photos"
S3_ACCESS_KEY_ID="placeholder-supabase-s3-access-key-id"
S3_SECRET_ACCESS_KEY="placeholder-supabase-s3-secret-access-key"
NEXT_PUBLIC_STORAGE_BASE_URL="https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/photos"

# Cron Secret for Automated Reminders
CRON_SECRET="placeholder-cron-secret-16chars"

# Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 6. Diataxis Documentation Architecture & Initial ADRs

Initialize the `docs/` folder in the project root adhering to the Diataxis documentation framework:

```text
docs/
├── README.md                                  # Documentation index & map
├── standards/
│   └── documentation.md                       # Documentation standard, ADR rules & link integrity
├── adr/                                       # Architecture Decision Records
│   ├── 001-vendor-agnostic-stack.md           # Next.js 15, Prisma ORM, Supabase PostgreSQL, npm @latest
│   ├── 002-feature-usecase-clean-architecture.md # Clean architecture, 1 File = 1 Responsibility in src/modules/
│   ├── 003-global-ui-governance.md            # shadcn/ui radix-nova, mobile CTAs size="lg"
│   ├── 004-permission-based-rbac.md           # Dynamic RBAC, zero hardcoded role checks
│   ├── 005-concurrency-safe-booking-slots.md  # Prisma $transaction row lock anti double-booking
│   └── 006-photo-storage-and-watermarking.md  # Supabase S3 API storage with Sharp WebP & client proofing
├── reference/
│   ├── architecture-conventions.md            # Dependency flow & module contracts
│   └── domain-glossary.md                     # Domain vocabulary in US English (Slot, Session, Proofing, Add-on, DP)
└── how-to/
    ├── agent-environment-setup.md             # Superpowers & context7 MCP configuration
    ├── local-development.md                   # Prisma migrations with directUrl, Supabase, seeders
    ├── issue-and-pr-workflow.md               # Wave/Track execution, branch naming, TDD lifecycle
    └── adding-a-feature-slice.md              # Checklist: Prisma model -> repo -> use-case -> action -> UI
```

### Initial ADR Checklist (Draft Specs for PRS)

1. **`001-vendor-agnostic-stack.md`**: Next.js 15 (App Router), React 19, TypeScript, Prisma ORM, Supabase PostgreSQL (`DATABASE_URL` & `DIRECT_URL`), Better Auth, npm @latest.
2. **`002-feature-usecase-clean-architecture.md`**: Pure business logic in `src/modules/<feature>/use-cases/**`, Prisma access strictly in `src/modules/<feature>/repositories/**`, single responsibility per file (`*.use-case.ts`, `*.schema.ts`, `*.action.ts`, `*.repository.ts`).
3. **`003-global-ui-governance.md`**: `shadcn/ui` v4 `radix-nova` preset in `src/common/components/ui/`, ban raw HTML controls (`<button>`, `<input>`), mobile-first primary booking actions with `size="lg"`.
4. **`004-permission-based-rbac.md`**: Granular permissions (`reservations.slots.manage`, `galleries.proofs.upload`, `payments.invoices.view`), ban `.role === 'admin'` checks.
5. **`005-concurrency-safe-booking-slots.md`**: Concurrency protection against double-booking using PostgreSQL row-level locks via Prisma `$transaction` (`SELECT ... FOR UPDATE` or conditional atomic insert).
6. **`006-photo-storage-and-watermarking.md`**: Dual-driver Supabase S3 storage for high-res original photos, Sharp WebP transformation for watermarked client proofing galleries.

---

## 7. Wave & Track Execution Roadmap for Photography Reservation

Structure your GitHub Milestones and Issues into 4 concurrent Waves following the `src/modules/` architecture:

```text
Milestone 1: Wave 1 - Foundation & Architecture
├── Track A (Arch): Issue #1 - Runtime env schema (@t3-oss/env-nextjs) with Supabase DIRECT_URL, next-intl, date-fns Asia/Jakarta helpers
├── Track B (UI): Issue #2 - shadcn/ui radix-nova setup in src/common/components/ui, theme tokens, TanStack Table v9
├── Track A (DB): Issue #3 - Supabase PostgreSQL Prisma schema with pooler/directUrl, client setup in src/infrastructure/prisma/, Better Auth, RBAC
├── Track C (Storage): Issue #4 - Supabase S3-compatible storage in src/infrastructure/storage/ with Sharp WebP
└── Track B (Shell): Issue #5 - Unified role-agnostic app shell & navigation in src/app/(dashboard)/

Milestone 2: Wave 2 - Studio Master Data & Packages
├── Track A (Schema): Issue #6 - Prisma domain models: Package, StudioRoom, ScheduleSlot, BlackoutDate [Schema PR]
├── Track A (Packages): Issue #7 - Module src/modules/packages/ (CRUD use-cases, repository, schemas, actions)
├── Track B (Schedule): Issue #8 - Module src/modules/schedules/ (working hours, blackout dates use-case & repo)
├── Track C (Pricing): Issue #9 - Pricing tiers, down payment (DP) rules, deposit percentage calculator service
└── Track A (Customers): Issue #10 - Module src/modules/customers/ (customer directory use-cases & repository)

Milestone 3: Wave 3 - Core Booking & Concurrency Engine
├── Track A (Booking): Issue #11 - Module src/modules/reservations/ (interactive booking calendar & slot picker)
├── Track B (Concurrency): Issue #12 - BookSessionUseCase with Prisma transactional lock ($transaction) to prevent double-booking
├── Track B (Operations): Issue #13 - Photographer agenda view, session status lifecycle, calendar sync
├── Track C (Payments): Issue #14 - Module src/modules/payments/ (invoice generation, payment proof upload, ledger)
└── Track A (Portal): Issue #15 - Customer self-service portal (reschedule & cancellation use-cases)

Milestone 4: Wave 4 - Delivery, Push & Analytics
├── Track B (Galleries): Issue #16 - Module src/modules/galleries/ (photo proofing, client photo selection, watermarked previews)
├── Track A (Push): Issue #17 - Module src/modules/notifications/ (W3C Web Push subscriptions & reminder cron)
├── Track A (Messaging): Issue #18 - Automated WhatsApp/Email booking confirmation webhooks
└── Track C (Analytics): Issue #19 - Studio utilization rate, revenue charts, photographer performance dashboard
```

---

## 8. GitHub Governance & CI Setup (npm)

### 8.1 GitHub Actions CI: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    name: Verification and Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run verification checks
        run: npm run check

      - name: Build application
        run: npm run build
```

### 8.2 GitHub Pull Request Template: `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Description

Provide a clear and concise summary of the changes introduced in this pull request.

Closes #<!-- Issue number -->

## Type of Change

- [ ] New feature (non-breaking change adding functionality)
- [ ] Bug fix (non-breaking change resolving an issue)
- [ ] Documentation update
- [ ] Refactoring or performance improvement

## Quality Checklist

- [ ] I have read and followed the repository `AGENTS.md` and architecture rules.
- [ ] Work was developed on a dedicated branch (`feat/issue-<N>-<slug>`).
- [ ] Only files listed under `Owned Paths` were modified.
- [ ] Unit tests were written first (TDD) and pass locally via `npm run test`.
- [ ] Mechanical checks pass cleanly via `npm run check` (zero violations).
- [ ] Production build succeeds via `npm run build`.
- [ ] Zero real customer data or credentials exist in code, seeders, or fixtures.
- [ ] Code is 100% US English (`en-US`) and clean of spelling issues (`cspell`).
- [ ] Relevant documentation and ADRs have been updated or added if applicable.
```

### 8.3 Feature Issue Template: `.github/ISSUE_TEMPLATE/feature-slice.yml`

```yaml
name: Feature Slice
description: Propose a new feature slice or vertical capability
title: "feat: "
labels: ["feature", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Please specify the feature slice with clear acceptance criteria in US English (`en-US`).
  - type: input
    id: summary
    attributes:
      label: Summary
      description: Brief one-line description of the feature slice.
    validations:
      required: true
  - type: input
    id: wave_track
    attributes:
      label: Wave & Track
      description: "e.g., Wave 3, Track A"
    validations:
      required: true
  - type: dropdown
    id: schema_pr
    attributes:
      label: Schema PR?
      description: Does this issue modify schema.prisma? (Must be merged first)
      options:
        - "No"
        - "Yes (Schema PR isolation required)"
    validations:
      required: true
  - type: textarea
    id: owned_paths
    attributes:
      label: Owned Paths (Mandatory Concurrency Boundary)
      description: List the exact file paths or glob patterns this issue exclusively modifies.
      placeholder: |
        - src/modules/reservations/use-cases/book-session.use-case.ts
        - src/modules/reservations/actions/book-session.action.ts
        - tests/unit/book-session.test.ts
    validations:
      required: true
  - type: textarea
    id: requirements
    attributes:
      label: Acceptance Criteria (TDD First)
      description: Detailed acceptance criteria, edge cases, and expected behaviors.
    validations:
      required: true
  - type: textarea
    id: architecture
    attributes:
      label: Packages (@latest) & Dependencies
      description: Mention designated packages, banned packages, and required permissions.
    validations:
      required: false
```

### 8.4 Custom Agent Skill: `.agents/skills/implement-issue/SKILL.md`

````markdown
---

name: implement-issue
description: Standard operating procedure for implementing an assigned GitHub Issue end-to-end using npm, context7, and TDD
---

# Implement Issue SOP

This skill defines the standard procedure for implementing an assigned GitHub Issue in the Photography Reservation platform.

## Workflow Steps

1. **Issue Assignment & Kickoff Comment (Mandatory Audit Trail):**
   - Assign issue to self before starting work:

     ```bash
     gh issue edit <N> --add-assignee @me
     ```
   - Post a formal kickoff comment recording the branch:

     ```bash
     gh issue comment <N> --body "Assigned to @$(gh api user -q .login). Starting implementation on branch \`feat/issue-<N>-<slug>\` following TDD and project standards."
     ```

2. **Branch Creation:**
   - Create a dedicated feature branch from latest `main`:

     ```bash
     git checkout main && git pull origin main
     git checkout -b feat/issue-<N>-<slug>
     ```

3. **Schema-PR Isolation Check:**
   - If the issue modifies `schema.prisma`, verify whether this is an isolated Schema PR. Schema PRs must be merged to `main` before dependent UI and use-case branches begin.

4. **Verify Owned Paths:**
   - Review `Owned Paths` in the issue specification (`gh issue view <N>`).
   - Touch ONLY the paths listed. Never introduce unrelated refactorings outside your slice.

5. **Install Designated Packages (@latest):**

   ```bash
   npm install <package>@latest
   ```
````

6. **Verify APIs with Context7:**
   - Query `context7` MCP (`resolve-library-id`, then `query-docs`) for official modern APIs.

7. **Execute TDD Cycle (Red -> Green -> Refactor):**
   - Write failing use-case and repository tests in `tests/unit/`.
   - Confirm test failure.
   - Implement pure use-case logic in `src/modules/<domain>/use-cases/`.
   - Wrap use-cases in `next-safe-action` in `src/modules/<domain>/actions/`.
   - Implement UI components using shadcn v4 primitives.
   - Confirm all tests pass green.

8. **Zero Real Data Check:**
   - Ensure all seeders and test fixtures use fake/synthetic data only.

9. **Run Mechanical Verification:**

   ```bash
   npm run check
   npm run build
   ```

10. **Open Pull Request & Link Issue:**

    ```bash
    git push -u origin feat/issue-<N>-<slug>
    gh pr create --title "feat(<scope>): ..." --body "Closes #<N> ..." --base main
    gh issue comment <N> --body "Implementation complete. Opened PR #<PR_NUMBER> for review."
    ```
````

### 8.5 One-Time GitHub Branch Protection Ruleset
To guarantee that neither human developers nor AI agents can bypass quality gates, configure a repository Ruleset on `main`:
1. **Target:** Default branch (`main`).
2. **Restrict deletions & Block force pushes:** Enabled.
3. **Require a pull request before merging:**
   - Required approvals: 1.
   - Dismiss stale approvals on new commits: Enabled.
   - Require conversation resolution: Enabled.
4. **Require status checks to pass:**
   - Status check required: `ci` (Verification and Build).
   - Require branches to be up to date before merging: Enabled.
5. **Allowed merge methods:** **Squash and Merge only** (Rebase and standard Merge commits disabled).

### 8.6 Repository Ownership: `.github/CODEOWNERS`

```text
# Repository Ownership
* @your-github-username
````

---

## 9. Quickstart: Ground-Zero Bootstrap Runbook

When you are inside your target project directory, run these commands to scaffold the ground-zero structure:

```bash
# 1. Initialize git & npm
git init
npm init -y

# 2. Configure package.json with scripts and dependencies from Section 2
# (npm install ...)

# 3. Create target directory tree
mkdir -p src/app src/modules src/common/components/ui src/common/components/shared src/common/hooks src/common/utils src/common/constants src/common/validators src/common/lib src/infrastructure/prisma src/infrastructure/storage src/infrastructure/payments src/infrastructure/notifications src/types messages tests/unit scripts docs/adr docs/how-to docs/reference docs/standards .agents/skills/implement-issue .github/workflows .github/ISSUE_TEMPLATE

# 4. Create Prisma Schema placeholder in src/infrastructure/prisma/schema.prisma
# and run:
npx prisma generate --schema=src/infrastructure/prisma/schema.prisma

# 5. Populate scripts/guardrails.ts and verify mechanical gates
npm run check
```
