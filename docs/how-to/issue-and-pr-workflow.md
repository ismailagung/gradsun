# How-To: Issue and PR Workflow

This guide explains the branch strategy and quality gates for contributing to PRS.

## Branch Naming Convention

- Always create dedicated branches: `feat/issue-<N>-<slug>`
- Never commit directly to `main`.

## Schema-PR Isolation Rule

When a feature requires changes to `src/infrastructure/prisma/schema.prisma`:

1. Submit an isolated Schema PR containing solely the schema changes and migration.
2. Merge the Schema PR to `main` before starting UI and use-case implementation branches.

## Owned Paths Boundary

Every task must strictly adhere to its assigned `Owned Paths` to prevent merge conflicts in concurrent workflows.

## Merge Strategy

All pull requests must be merged via **Squash and Merge**.
