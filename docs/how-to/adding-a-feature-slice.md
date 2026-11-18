# How-To: Adding a Feature Slice

Follow this sequence to implement a new feature slice in `src/modules/<feature>/`:

1. **Schema**: Create `src/modules/<feature>/schemas/<name>.schema.ts` defining input validation via Zod.
2. **Repository**: Create `src/modules/<feature>/repositories/<name>.repository.ts` with Prisma persistence methods.
3. **Use Case**: Create `src/modules/<feature>/use-cases/<name>.use-case.ts` with business invariants.
4. **Action**: Create `src/modules/<feature>/actions/<name>.action.ts` wrapping the use case in `next-safe-action`.
5. **Components**: Build UI components using shadcn primitives.
6. **Tests**: Create unit tests in `tests/unit/` verifying use-case invariants.
7. **Verification**: Run `npm run check` to verify all mechanical gates pass.
