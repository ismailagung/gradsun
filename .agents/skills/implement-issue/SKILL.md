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
