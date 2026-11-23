# Photography Reservation & Studio Management Platform

An enterprise-grade photography reservation, client proofing, and studio operations management platform built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Prisma ORM, Supabase PostgreSQL, and Clean Architecture.

## System Overview

The platform is designed around two operational cores:

- **Client Booking & Proofing Funnel:** Package discovery, interactive calendar slot booking with anti-double-booking locks, deposit checkout, and private watermarked photo proofing galleries.
- **Studio & Photographer Operations:** Scheduling availability, studio room assignments, booking lifecycle tracking (`requested` -> `confirmed` -> `session_done` -> `proofing` -> `delivered`), automated reminder triggers, and invoice tracking.

## Core Architecture

This repository adheres to Feature-Driven and Use-Case Driven Clean Architecture:

- **Presentation Layer (`src/app/`):** Thin Next.js 15 App Router Server Components (target ≤ 150 lines). Free of raw HTML controls and business logic.
- **Domain Slices (`src/modules/`):** Self-contained domain modules (`reservations`, `packages`, `schedules`, `payments`, `galleries`, `notifications`).
  - `actions/`: Input orchestration with `next-safe-action` (≤ 100 lines).
  - `use-cases/`: Pure business logic and invariant validation (≤ 150 lines).
  - `repositories/`: Persistence layer accessing Prisma ORM (≤ 150 lines).
  - `schemas/`: Zod validation schemas.
- **Shared Primitives (`src/common/`):** `shadcn/ui` with the `radix-nova` style preset, common utilities, hooks, and date libraries (`date-fns`).
- **Infrastructure (`src/infrastructure/`):** External adapters for Prisma database pooling, S3-compatible photo storage, notifications, and payment webhooks.
- **Strict Dependency Flow:** `Page -> Action -> Use Case -> Repository -> Prisma -> Database`. Direct Prisma queries outside repositories are forbidden by automated AST guardrails.

## Tech Stack

| Domain                     | Technology                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Application Framework      | Next.js 15 (App Router, Server Components First)                                   |
| UI Library & Design        | React 19, Tailwind CSS v4, `shadcn/ui` (`radix-nova`), Lucide Icons                |
| Language & Runtime         | TypeScript 5.8, Node.js 22 LTS                                                     |
| Database & ORM             | PostgreSQL via Supabase, Prisma ORM (Supavisor pooled port 6543, direct port 5432) |
| Authentication             | Better Auth                                                                        |
| Media Processing & Storage | Supabase Storage (S3 API via `@aws-sdk/client-s3`), Sharp WebP pipeline            |
| Localization               | `next-intl` (100% dictionary parity between `en-US` and `id-ID`)                   |
| Toolchain & Verification   | npm, Biome, CSpell, Vitest, `oxc-parser` AST Guardrails                            |

## Getting Started

### Prerequisites

- Node.js 22 LTS or newer
- npm 10+
- A running PostgreSQL database or Supabase project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ismailagung/gradsun.git
   cd gradsun
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and populate valid credentials:

   ```bash
   cp .env.example .env.local
   ```

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Run development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Quality Gates & Verification

All code must pass mechanical quality checks before merging to `main`:

```bash
# Run all verification checks (typecheck, lint, cspell, guardrails, tests)
npm run check

# Run specific gates
npm run typecheck        # TypeScript static type check
npm run lint             # Biome linting & format check
npm run check:spell      # CSpell dictionary validation
npm run check:guardrails # AST Guardrail Engine (6 Mechanical Laws)
npm run test             # Vitest unit test suite
npm run build            # Next.js production build
```

## The 6 Mechanical Laws

Enforced automatically via `scripts/guardrails.ts`:

1. **Law 1 (UI Governance):** Use `shadcn/ui` v4 `radix-nova` components and theme tokens. Desktop controls and tables must use compact `h-8` (32px). Primary Call-to-Action buttons on mobile viewport must use `size="lg"`. Raw HTML controls (`<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`) are banned.
2. **Law 2 (Strict i18n):** Zero hardcoded JSX text or literal UI attributes. All user-facing strings use `next-intl` with parity between `en-US.json` and `id-ID.json`.
3. **Law 3 (Secret Isolation):** `process.env` is restricted to `src/env.ts` and `next.config.ts`. No committed `.env*` files.
4. **Law 4 (Prisma Isolation & RBAC):** Direct Prisma queries are permitted only in `repositories/`. Direct `.role === 'admin'` comparisons are banned in favor of granular permission keys.
5. **Law 5 (Docs & Agent Integrity):** `AGENTS.md` budget ≤ 120 lines with zero frontmatter. ADRs must have Status, Context, Decision, Consequences.
6. **Law 6 (Anti-Primitive Discipline):** Banned vendor-locked packages are rejected. Server Actions must use `next-safe-action` and delegate to use-cases.

## Documentation Map

- **[Architecture Mandates](AGENTS.md):** Repository rules, code conventions, and agent instructions.
- **[Documentation Index](docs/README.md):** Central Diataxis documentation portal.
- **[Architecture Decision Records](docs/adr/):**
  - [ADR 001: Vendor-Agnostic Core Stack](docs/adr/001-vendor-agnostic-stack.md)
  - [ADR 002: Feature-Driven Clean Architecture](docs/adr/002-feature-usecase-clean-architecture.md)
  - [ADR 003: Global UI Governance](docs/adr/003-global-ui-governance.md)
  - [ADR 004: Granular Permission-Based Access Control](docs/adr/004-permission-based-rbac.md)
  - [ADR 005: Concurrency-Safe Booking Slot Allocation](docs/adr/005-concurrency-safe-booking-slots.md)
  - [ADR 006: Photo Storage and Watermarking Pipeline](docs/adr/006-photo-storage-and-watermarking.md)
- **[How-To Guides](docs/how-to/):**
  - [Local Development Guide](docs/how-to/local-development.md)
  - [Issue & PR Workflow](docs/how-to/issue-and-pr-workflow.md)
  - [Adding a Feature Slice](docs/how-to/adding-a-feature-slice.md)
- **[Reference](docs/reference/):**
  - [Architecture Conventions](docs/reference/architecture-conventions.md)
  - [Domain Glossary](docs/reference/domain-glossary.md)

## License

Private & Proprietary. All rights reserved.
