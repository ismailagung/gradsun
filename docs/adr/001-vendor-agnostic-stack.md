# ADR 001: Vendor-Agnostic Core Stack

## Status

Accepted

## Context

The platform requires an enterprise web architecture that avoids proprietary cloud vendor lock-in while leveraging modern Next.js 15 capabilities, React 19, TypeScript, and open standards.

## Decision

We select:

1. **Next.js 15 (App Router)** and **React 19** as the application framework.
2. **Prisma ORM** as the database layer over Supabase PostgreSQL.
3. Separate connection strings: pooled `DATABASE_URL` (Supavisor port 6543) for runtime queries, and `DIRECT_URL` (direct port 5432) for schema migrations.
4. **Better Auth** for self-contained session and credential management.
5. Standard **npm** package manager.

## Consequences

- The database can be migrated away from Supabase to any PostgreSQL host without rewriting application queries.
- Two database URLs must be maintained in `.env`.
