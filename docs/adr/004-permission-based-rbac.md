# ADR 004: Granular Permission-Based Access Control

## Status

Accepted

## Context

Hardcoding coarse role checks (`.role === 'admin'`) creates brittle authorization rules that fail when new roles (such as "lead photographer", "assistant", or "accountant") are introduced.

## Decision

1. Implement granular permission keys (such as `reservations.slots.manage`, `galleries.proofs.upload`, `payments.invoices.view`).
2. Map users to roles, and roles to sets of granular permissions.
3. Ban hardcoded role name checks (`.role ===` or `hasRole()`) in application logic.
4. Protect server actions and use-cases by checking whether the caller holds the specific required permission.

## Consequences

- Flexible role assignments without modifying business logic code.
- Permissions can be queried dynamically and verified centrally.
