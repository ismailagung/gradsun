# ADR 005: Concurrency-Safe Booking Slot Allocation

## Status

Accepted

## Context

High-demand photo session slots (such as golden hour or holiday weekend slots) risk double-booking if concurrent requests arrive at the same millisecond.

## Decision

1. Enforce atomic slot reservations using PostgreSQL row-level locks via Prisma `$transaction`.
2. Check existing bookings within the transaction before inserting or updating the reservation record.
3. Apply unique constraints on photographer schedule slot allocations.

## Consequences

- Guaranteed zero double-booking under high concurrent load.
- Transactions hold short row locks, so database operations must remain lightweight.
