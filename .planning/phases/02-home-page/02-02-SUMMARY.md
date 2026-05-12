---
phase: 02-home-page
plan: 02
subsystem: display atoms (W1 — HeroPhoto + CurrentlyLine + formatDate)
tags: [phase-2, wave-1, server-components, lcp, view-transitions, motion-seam]
status: complete
requirements_completed: [HOME-01, HOME-02, HOME-04, PERF-04, PERF-06]
dependency_graph:
  requires:
    - public/portrait.jpg (Plan 02-01)
    - next.config.ts images.qualities: [75, 90] (Plan 02-01)
    - data/currently.ts (Phase 1 shape, Plan 01 value)
    - lib/motion.ts (Phase 1 seam — first real consumer)
  provides:
    - "HeroPhoto: Server Component exporting HeroPhoto(): JSX.Element"
    - "CurrentlyLine: Server Component exporting CurrentlyLine({ data: CurrentlyStatement })"
    - "formatDate: (iso: string) => string — 'MMM D' UTC-anchored output"
    - "data-test='hero-photo-tile' wrapper selector for Plan 01 RED specs"
    - "viewTransitionName: 'hero-photo' seam (D-21) consumable by Phase 3 /about"
  affects:
    - Plan 02-06 (Hero composition — imports all three)
tech-stack:
  added: [] # zero new deps — Intl.DateTimeFormat is built-in
  patterns:
    - "Server Component default (FOUND-07 / D-25): all three files are zero-client"
    - "next/image static import + priority + placeholder='blur' (first consumer)"
    - "view-transition-name as per-element inline style (first consumer; D-22)"
    - "lib/motion.ts seam consumed: fadeInUp className + stagger(2) inline style"
    - "UTC-anchored Intl.DateTimeFormat (no third-party date library)"
key-files:
  created:
    - lib/format.ts (32 lines)
    - components/home/CurrentlyLine.tsx (57 lines)
    - components/home/HeroPhoto.tsx (42 lines)
    - tests/format.spec.ts (54 lines)
  modified: []
decisions:
  - "Used relative import (../lib/format) in tests/format.spec.ts because no existing spec uses the @/ alias — matches Phase 1's spec convention rather than introducing a divergent pattern (plan body authorized this fallback)."
  - "Comment-line text uses 'zero client directive' rather than the literal 'use client' string so the plan's inline-regex verifier (which does not strip comments) does not false-positive. tests/no-client-components.spec.ts already strips leading comments, so both verifiers are satisfied."
  - "formatDate accepts ISO YYYY-MM-DD string (matches plan body + UI-SPEC line 273, lib/format-spec already wired). Frontmatter `must_haves` line restated the same signature; the orchestrator brief restating `formatDate(date: Date)` was a brief-summary mismatch — plan body + spec stubs are authoritative."
metrics:
  duration_minutes: 5
  completed: "2026-05-12T04:50:37Z"
---

# Phase 2 Plan 02: Display Atoms (W1) Summary

LCP-safe HeroPhoto with view-transition-name seam, accent-dot CurrentlyLine wired to lib/motion stagger, and a UTC-anchored formatDate helper — all Server Components.

## What shipped

### `lib/format.ts` (32 lines)
- **Export:** `formatDate(iso: string): string`
- Parses ISO `YYYY-MM-DD`, builds a `Date` from `Date.UTC(...)`, formats via `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })`.
- Output examples: `'2026-05-09' → 'May 9'`, `'2026-01-03' → 'Jan 3'`, `'2026-12-25' → 'Dec 25'`.
- Throws on malformed input (defensive guard for `noUncheckedIndexedAccess: true`).
- Zero third-party deps.

### `components/home/CurrentlyLine.tsx` (57 lines)
- **Export:** `CurrentlyLine({ data }: CurrentlyLineProps)` where `data: CurrentlyStatement`.
- Render: `<p>` wrapper (mt-6 flex items-center gap-2 text-base + fadeInUp class + stagger(2) inline style) → aria-hidden 6px accent dot (`w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]`) → statement (`<a>` when `data.link` set, `<span>` otherwise; `--color-text`) → aria-hidden middle dot in `--color-muted` → `<time dateTime={data.updatedAt}>` in font-mono text-sm muted, content from `formatDate(data.updatedAt)`.
- First real consumer of Phase 1's `lib/motion.ts` seam (HOME-02, CD-02, CD-03).

### `components/home/HeroPhoto.tsx` (42 lines)
- **Export:** `HeroPhoto()` (zero props).
- Outer `<div>` (data-test='hero-photo-tile', `rounded border border-[var(--color-border)] p-2 shrink-0`, inline `style={{ viewTransitionName: 'hero-photo' }}`).
- Inner `<Image>` (static-import portrait, alt='Braeden Hodson', width=320, height=320, priority, placeholder='blur', quality=90, `rounded-[2px] w-60 h-60 md:w-80 md:h-80 object-cover`).
- ZERO animation classes (D-24 LCP discipline).

### `tests/format.spec.ts` (54 lines)
- 4 cases — all GREEN: 'May 9', 'Jan 3', 'Dec 25', and a `process.env.TZ = 'America/Los_Angeles'` round-trip proving the UTC anchor.

## Build canary

`npm run build` succeeded (Next.js 16.2.6 Turbopack, compiled in 2.7s, 5 static pages, no warnings). Confirms:

- `next.config.ts` `images.qualities: [75, 90]` (set in Plan 02-01) permits `quality={90}` on the `<Image>`.
- Static import `from '@/public/portrait.jpg'` resolves and Next derives blur placeholder at build time.
- TypeScript strict + noUncheckedIndexedAccess pass.
- ESLint clean.

## Spec scoreboard

| Spec | Before this plan | After this plan | Notes |
|------|------------------|-----------------|-------|
| `tests/format.spec.ts` | did not exist | **GREEN (4/4)** | New in this plan, full coverage |
| `tests/no-client-components.spec.ts` | GREEN | GREEN | No regression — all 3 new files Server Components |
| `tests/view-transition-name-present.spec.ts` | RED | RED (deferred) | Component exists with the inline style; spec runs against `/`, but Hero.tsx is not yet mounted on the page. Turns GREEN when Plan 02-06 wires `<HeroPhoto />` into `app/page.tsx`. |
| `tests/photo-lcp.spec.ts` (PERF-04 half) | RED | RED (deferred) | Same gate — needs Plan 02-06 mount. The component itself satisfies the assertion (width/height attrs on `<img>`). |
| `tests/photo-lcp.spec.ts` (Lighthouse half) | RED | RED (deferred) | Needs `next start` running + hero mounted; Plan 02-07 phase verification. |
| `tests/currently-renders.spec.ts` | RED | RED (deferred) | Same gate — needs Plan 02-06 mount. |
| `tests/hero-renders.spec.ts` | RED | RED (deferred) | Needs Hero.tsx composition (Plan 02-06). |
| Phase 1 13 specs | GREEN | GREEN | No regression. |

Net Phase 2 movement: 8 RED → 7 RED + 1 GREEN-new (format), plus 4 deferred RED-but-component-ready awaiting Plan 02-06 mount.

## Deviations from Plan

None. Plan executed exactly as written. No bugs found, no missing critical functionality, no blocking issues.

Two minor implementation notes captured in `decisions` frontmatter:
1. `tests/format.spec.ts` uses relative import (`../lib/format`) per the plan body's authorized fallback ("if `@/lib/motion` is not currently imported in any spec, use a relative path").
2. Comment text uses 'zero client directive' wording rather than the literal 'use client' string. This satisfies both the plan's inline-regex verifier (which does not strip comments) and `tests/no-client-components.spec.ts` (which already strips leading comments). The semantic guarantee is preserved.

The orchestrator-brief paragraph referenced `formatDate(date: Date): string`, but the plan body, the `must_haves` block, and the existing `tests/currently-renders.spec.ts` RED stub all require `formatDate(iso: string): string` (the spec passes `data.updatedAt` which is `string`). Plan body is authoritative.

## Authentication gates

None.

## Threat Flags

None — no new security surface introduced. The view-transition-name seam is a public CSS coordination key (already accepted in the threat register T-02-07). Static import + same-origin asset, no remote patterns. CurrentlyLine renders `data.statement` as React text (escaped); the optional `data.link` field is currently unset and renders as an in-tab `<a>` when populated (conservative default per threat register T-02-10).

## Commit history

| Commit | Description |
|--------|-------------|
| `15d9375` | `feat(phase-2/w1): lib/format.ts (UTC-anchored formatDate) + spec` |
| `e51a396` | `feat(phase-2/w1): CurrentlyLine component (accent dot + Mono date)` |
| `9ddfe69` | `feat(phase-2/w1): HeroPhoto component (LCP-safe + view-transition seam)` |

## Next plan unblocked

- **Plan 02-03 (Wave 1, parallel):** Interactive Hero atoms — `ChannelButton`, `ChannelButtonRow`, `CTAArrowLink`. No file overlap, can run concurrently.
- **Plan 02-06 (Wave 2):** Hero composition — imports `HeroPhoto`, `CurrentlyLine`, and the format helper transitively. All three exports are now available under their documented contracts.

## Self-Check: PASSED

- `lib/format.ts` — FOUND
- `components/home/CurrentlyLine.tsx` — FOUND
- `components/home/HeroPhoto.tsx` — FOUND
- `tests/format.spec.ts` — FOUND
- Commit `15d9375` — FOUND in git log
- Commit `e51a396` — FOUND in git log
- Commit `9ddfe69` — FOUND in git log
- `npm run typecheck` — exit 0
- `npm run lint` — exit 0
- `npm run build` — exit 0
- `tests/format.spec.ts` — 4/4 GREEN
- `tests/no-client-components.spec.ts` — GREEN (no regression)
