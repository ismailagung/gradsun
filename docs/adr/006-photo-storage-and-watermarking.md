# ADR 006: Photo Storage and Watermarking Pipeline

## Status

Accepted

## Context

High-resolution RAW and master JPEG files must be preserved safely while delivering lightweight watermarked previews for client proofing without overloading client bandwidth.

## Decision

1. Store master photography files using Supabase S3-compatible storage API accessed via `@aws-sdk/client-s3`.
2. Process proofing thumbnails and watermarks using **Sharp** into optimized WebP formats.
3. Serve public proofing previews with embedded watermarks until final payment is settled.

## Consequences

- Fast client gallery loading speeds on mobile devices.
- Direct download of non-watermarked master files is gated behind payment verification.
