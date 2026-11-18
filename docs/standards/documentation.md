# Documentation Standard & Link Integrity

This document defines the documentation rules for the Photography Reservation System (PRS).

## Diataxis Framework

Documentation is organized according to the four Diataxis quadrants:

1. **Tutorials / How-To Guides** (`docs/how-to/`): Step-by-step guides for solving specific operational problems.
2. **Reference** (`docs/reference/`): Technical descriptions, domain glossary, architecture conventions, and contracts.
3. **Architecture Decision Records (ADRs)** (`docs/adr/`): Formal architectural decisions.
4. **Standards** (`docs/standards/`): Rules and guidelines governing code, testing, and documentation.

## ADR Requirements

Every ADR in `docs/adr/` must follow the format with these required sections:

- `## Status` (Proposed, Accepted, Deprecated, Superseded)
- `## Context` (Background and forces at play)
- `## Decision` (The chosen solution and rationale)
- `## Consequences` (Positive, negative, and neutral trade-offs)

## Language & Link Integrity

- All documentation must be written in 100% US English (`en-US`).
- All relative links must point to existing files to ensure link integrity.
- Code blocks must declare language identifiers.
