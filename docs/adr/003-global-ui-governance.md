# ADR 003: Global UI Governance and Design System

## Status

Accepted

## Context

Inconsistent user interfaces, hardcoded CSS hex codes, and raw HTML controls degrade accessibility, visual polish, and brand identity across mobile and desktop devices.

## Decision

1. Adopt **shadcn/ui v4** with the **radix-nova** style preset in `src/common/components/ui/`.
2. Ban raw HTML controls (`<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`) in favor of design system primitives.
3. Ban arbitrary CSS color classes (such as `bg-[#...]`) in favor of CSS theme tokens in `src/app/globals.css`.
4. Ensure mobile booking actions provide comfortable touch targets using `size="lg"`.

## Consequences

- Guaranteed WCAG accessibility compliance across form controls and dialogs.
- Dark mode support is handled out of the box via CSS variables.
