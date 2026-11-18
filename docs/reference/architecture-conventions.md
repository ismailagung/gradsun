# Architecture Conventions & Contracts

This document outlines the strict architecture conventions for the Photography Reservation System (PRS).

## Layer Responsibilities

1. **Pages (`src/app/**/page.tsx`)**:
   - Thin presentation composition layers (target ≤ 150 lines).
   - Load initial data and invoke Server Actions.
   - Forbidden from containing business rules, Zod schemas, or direct Prisma calls.

2. **Server Actions (`src/modules/*/actions/*.action.ts`)**:
   - Orchestration layer (target ≤ 100 lines).
   - Wrap inputs using `next-safe-action`.
   - Validate input via module Zod schemas.
   - Instantiate and invoke pure Use Cases.

3. **Use Cases (`src/modules/*/use-cases/*.use-case.ts`)**:
   - Framework-independent business logic (target ≤ 150 lines).
   - Expose an `execute(input)` method.
   - Coordinate domain rules, invariant validations, and repository calls.

4. **Repositories (`src/modules/*/repositories/*.repository.ts`)**:
   - Persistence layer (target ≤ 150 lines).
   - Sole layer authorized to execute Prisma queries.
   - Handle transactions, filtering, and database mappings.

## Dependency Flow

```text
Page / Route Handler
  ↓
Server Action (next-safe-action)
  ↓
Use Case (Pure Domain Logic)
  ↓
Repository
  ↓
Prisma Client
  ↓
PostgreSQL
```
