# ADR 002: Feature-Driven Clean Architecture

## Status

Accepted

## Context

Codebases often suffer from layered technical grouping (`src/services/`, `src/actions/`), which degrades modularity and obscures domain boundaries as the application expands.

## Decision

We enforce Feature-Driven and Use-Case Driven Clean Architecture in `src/modules/<feature>/`:

1. Each business domain contains its own `actions/`, `use-cases/`, `repositories/`, `schemas/`, `components/`, and `types/`.
2. Adhere to **1 File = 1 Responsibility**: single-purpose classes or functions per file.
3. Strict dependency flow: `Page -> Action -> Use Case -> Repository -> Prisma -> DB`.
4. Repositories are the only layer permitted to access Prisma directly.

## Consequences

- High domain cohesion and isolation of side effects.
- Direct database calls from presentation layers are prevented by automated AST guardrails.
