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

## Issue-First Protocol & Decisive SemVer Advisory

1. **Issue-First Protocol:** Every task, feature request, ad-hoc change, or maintenance chore must originate with a tracked GitHub Issue before creating a branch. Direct pushes to `main` are strictly forbidden.
2. **Decisive SemVer Advisory:** Collaborating agents must provide an opinionated, decisive recommendation (YES or NO)—never ambiguous options—after every merged issue on whether to trigger a release or maintain current version status based on milestone completeness.

## Changelog Hygiene & Net-Delta Protocol

Release notes and changelogs represent solely the user-facing delta between the previous release and current release ($\Delta = \text{State}(V_{\text{curr}}) - \text{State}(V_{\text{prev}})$).

Only three change types qualify for publication:

1. **Added:** Present in current version, absent in previous version.
2. **Changed / Fixed:** Existed as $A$ in previous version, transformed to $B$ in current version.
3. **Removed:** Existed in previous version, excised in current version.

**Internal Churn Rule:** Features, fields, or chores introduced and subsequently removed or superseded within the same sprint cycle ($\Delta = 0$) are considered internal drafting noise and must be expunged from release notes before publishing.

## Pull Request Title & Conventional Commits

All pull request titles are strictly validated via the `Semantic PR Check` GitHub Action (`amannn/action-semantic-pull-request`). Titles must follow Conventional Commits:

- `feat(<scope>): ...` — Introduces a new feature (triggers MINOR version bump).
- `fix(<scope>): ...` — Fixes a bug (triggers PATCH version bump).
- `feat(<scope>)!: ...` or `fix(<scope>)!: ...` — Introduces breaking changes (triggers MAJOR version bump).
- `chore(<scope>): ...`, `docs: ...`, `refactor: ...`, `test: ...`, `ci: ...` — Maintenance, documentation, and internal changes.

## Automated Releases (Google Release Please)

Semantic versioning and changelog maintenance are automated using Google Release Please:

1. When PRs merge into `main`, the `Release Please` action analyzes commit types.
2. A Release PR is automatically opened or updated with bumped versions in `package.json` and generated notes in `CHANGELOG.md`.
3. When the Release PR is merged, the git tag (e.g. `v1.0.0`) and GitHub Release are automatically published.
4. Breaking changes marked with `!` directly trigger `v1.0.0` or major bumps.
