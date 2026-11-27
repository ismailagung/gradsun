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
   - **Zero Direct Coding:** No code changes without a tracked issue. Even for ad-hoc requests, exploratory spikes, or freeform coding, the agent MUST create a GitHub Issue first (`gh issue create`), create branch `feat/issue-<N>-<slug>` (or `chore/...`), execute, open PR, and Squash & Merge.
   - 1 Issue = 1 Dedicated Branch: `feat/issue-<N>-<slug>`. Direct pushes to `main` are strictly forbidden.
   - Mandatory Audit Trail: Assign self & post kickoff comment on issue before creating branch; post completion comment linking opened PR.
   - Schema-PR Isolation: Schema modifications in `schema.prisma` must be merged as an isolated Schema PR before UI/use-case work.
   - Owned Paths: Touch ONLY paths listed under `Owned Paths` in the assigned issue specification.
   - Merges to `main` are restricted to Squash and Merge only.
5. **TDD Iron Law:** Write failing unit tests in `tests/unit/` before writing use-case or repository implementations.
6. **Data Privacy:** Real customer names, phone numbers, or credentials are strictly forbidden in repo commits, seeders, or test fixtures. Use fake data only.
7. **Language Mandate:** 100% US English (`en-US`) across all code, identifiers, comments, commit messages, and PRs (enforced by `cspell`).
8. **Decisive SemVer & Net-Delta Changelog Mandate:**
   - **Opinionated Release Guidance:** After merging any issue PR, the agent MUST provide a decisive, opinionated recommendation (YES or NO)—never ambiguous options—on whether to cut a new release or stay on the current version based on milestone completeness.
   - **Net-Delta Changelog Hygiene:** Changelogs and Release Notes MUST strictly represent the net delta between the previous release and current release ($\Delta = \text{State}(V_{\text{curr}}) - \text{State}(V_{\text{prev}})$). Only 3 categories qualify: Added (absent before, present now), Changed/Fixed (A before, B now), or Removed (present before, deleted now). Intermediate draft churn, self-canceling experiments, or features added and removed during the same development cycle ($\Delta = 0$) are strictly forbidden from release notes.

## The 6 Mechanical Laws

All code must pass `npm run check` (`npm run check:guardrails` via `scripts/guardrails.ts`):

- **Law 1 (UI Governance):** Use `shadcn/ui` v4 `radix-nova` components and theme tokens. Primitives must be installed via `npx shadcn@latest add <component>` to `src/common/components/ui/` (manual `@radix-ui/*` installation is forbidden). Desktop controls and tables must use compact height `h-8` (32px). Primary Call-to-Action buttons on mobile viewport must use `size="lg"` (minimum touch target 44-48px). Raw HTML controls (`<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`), arbitrary colors (`hover:bg-[#10b981]`), legacy `<FormField>`, and `tailwind.config.*` are banned.
- **Law 2 (Strict i18n):** Zero hardcoded JSX text or literal UI attributes in `src/app/**` or `src/modules/**`. All user-facing text uses `next-intl`. Key parity and non-empty translations are enforced between `messages/en-US.json` and `messages/id-ID.json`.
- **Law 3 (Secret Isolation):** `process.env` is restricted to `src/env.ts` and `next.config.ts`. No committed `.env*` files (except placeholder `.env.example`).
- **Law 4 (Prisma Isolation & RBAC):** Direct Prisma calls outside `src/modules/**/repositories/**` or `src/infrastructure/prisma/**` are banned. Direct `.role === 'admin'` checks are banned (use granular permission checks).
- **Law 5 (Docs & Agent Integrity):** `AGENTS.md` has no frontmatter and ≤ 120 lines. `.agents/skills/*/SKILL.md` requires `name:` and `description:` frontmatter. ADRs require Status, Context, Decision, Consequences.
- **Law 6 (Anti-Primitive Discipline):** Banned/vendor-locked packages are rejected. Server Actions must use `next-safe-action` and delegate to use-cases. `dangerouslySetInnerHTML` requires `sanitizeHtml`.

## Documentation Map

- [Documentation Map](docs/README.md): Index of Diataxis guides, ADRs, and runbooks.
- [Architecture Conventions](docs/reference/architecture-conventions.md): Detailed module layouts, use-case contracts, and Prisma schemas.
- [Issue & PR Workflow](docs/how-to/issue-and-pr-workflow.md): Team collaboration, branch naming, and Schema-PR isolation.
