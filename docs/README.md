# Photography Reservation System (PRS) Documentation

Welcome to the Photography Reservation System (PRS) documentation suite. This documentation follows the Diataxis framework, organized into tutorials/how-tos, reference, architecture decision records (ADR), and standards.

## Structure

- **[Standards](standards/documentation.md)**: Documentation standards, ADR formatting, and link integrity rules.
- **[Architecture Decision Records (ADRs)](adr/)**: Record of significant architectural choices.
  - [ADR 001: Vendor-Agnostic Stack](adr/001-vendor-agnostic-stack.md)
  - [ADR 002: Feature-Driven Clean Architecture](adr/002-feature-usecase-clean-architecture.md)
  - [ADR 003: Global UI Governance](adr/003-global-ui-governance.md)
  - [ADR 004: Permission-Based RBAC](adr/004-permission-based-rbac.md)
  - [ADR 005: Concurrency-Safe Booking Slots](adr/005-concurrency-safe-booking-slots.md)
  - [ADR 006: Photo Storage and Watermarking](adr/006-photo-storage-and-watermarking.md)
- **[Reference](reference/)**: Technical reference and contracts.
  - [Architecture Conventions](reference/architecture-conventions.md)
  - [Domain Glossary](reference/domain-glossary.md)
- **[How-To Guides](how-to/)**: Practical operational guides.
  - [Agent Environment Setup](how-to/agent-environment-setup.md)
  - [Local Development](how-to/local-development.md)
  - [Issue & PR Workflow](how-to/issue-and-pr-workflow.md)
  - [Adding a Feature Slice](how-to/adding-a-feature-slice.md)
