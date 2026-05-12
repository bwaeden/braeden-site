---
phase: 02-home-page
plan: 01
subsystem: home / wave-0-validation
tags: [validation, data-scaffold, asset-copy, next-config, red-specs, scope-amendment]
dependency-graph:
  requires:
    - phase-01-foundation-design-tokens (data/channels.ts + data/site.ts scaffolds, playwright.config.ts, lib/motion.ts)
    - data/currently.ts (Phase 1 ships; consumed by tests/currently-renders.spec.ts via literals)
  provides:
    - data/channels.ts (1-entry Instagram Channel[] — Wave 1 ChannelButtonRow consumes)
    - data/site.ts (socials.github + socials.instagram — Wave 2 Footer + Wave 1 source-link consume)
    - public/portrait.jpg (193KB v1 placeholder — Wave 1 HeroPhoto static-imports)
    - next.config.ts images.qualities [75, 90] (Wave 1 HeroPhoto quality={90} build-gate)
    - 8 RED Playwright specs covering HOME-01..06 + PERF-04 + PERF-06
  affects:
    - Wave 1 (Plan 02-02 HeroPhoto + CurrentlyLine — turns 3 specs GREEN)
    - Wave 2 (Plan 02-03 ChannelButton + 02-04 Footer extension — turns 2 specs GREEN)
    - Wave 3 (Plan 02-05 stub routes + 02-06 Hero composition — turns 3 specs GREEN)
    - Wave 4 (Plan 02-07 full-suite verification against Vercel preview)
tech-stack:
  added: []
  patterns:
    - phase-1-spec-stub-pattern (JSDoc header w/ HOME-XX/PERF-XX + "RED until Plan NN" provenance + import { test, expect } from '@playwright/test')
    - data-test-attribute-selectors ([data-test="hero-section"], [data-test="hero-display"], [data-test="hero-photo-tile"], [data-test="hero-flex"])
    - external-link-tabnabbing-mitigation (target="_blank" + rel*="noopener" + rel*="noreferrer" — T-02-02)
    - chromium-mobile-project-gating (viewport.width < 768 skip on chromium-desktop runs for mobile-only assertions)
key-files:
  created:
    - public/portrait.jpg
    - tests/hero-renders.spec.ts
    - tests/photo-lcp.spec.ts
    - tests/currently-renders.spec.ts
    - tests/channels-render.spec.ts
    - tests/ctas-resolve-200.spec.ts
    - tests/view-transition-name-present.spec.ts
    - tests/footer-socials-render.spec.ts
    - tests/mobile-hero-stacks-cleanly.spec.ts
  modified:
    - data/channels.ts
    - data/site.ts
    - next.config.ts
decisions:
  - "Scope amendment compliance: YouTube fully omitted from v1 — data/channels.ts is 1-entry (Instagram only), data/site.ts.socials literal carries only github+instagram keys, tests/channels-render.spec.ts asserts 1 external <a> (not 2), tests/footer-socials-render.spec.ts asserts only GitHub+Instagram aria-labels and explicitly asserts NO YouTube channel link"
  - "Forward-compat preserved: Channel.platform TypeScript union still 'youtube' | 'instagram'; SiteMeta.socials.youtube? optional shape retained — re-enabling YT post-v1 is a single-entry data-file edit"
  - "GitHub username confirmed bwaeden (https://github.com/bwaeden); Instagram handle confirmed braehods (https://instagram.com/braehods) — both URLs https"
  - "Portrait copy preserved as v1 placeholder (193KB, well under 250KB cap); SHA-256 recorded in this summary so Phase 6 can verify the production-photo swap replaces it cleanly"
  - "next.config.ts patch placed inside nextConfig object before withMDX wrapper — no remotePatterns added (Phase 2 uses local static assets only per security_threat_model T-02-03)"
metrics:
  duration_minutes: 4
  completed: 2026-05-11
  tasks_completed: 2
  files_touched: 12
  commits: 2
---

# Phase 2 Plan 01: Wave-0 Validation + Data Scaffolds Summary

**One-liner:** Wave-0 validation gate — populated `data/channels.ts` + `data/site.ts.socials` with real Instagram + GitHub URLs (YouTube omitted per scope amendment), copied 193KB v1 portrait into `public/`, patched `next.config.ts` with `images.qualities: [75, 90]`, and stubbed 8 RED Playwright specs covering HOME-01..06 + PERF-04 + PERF-06 so Waves 1-3 have a complete validation contract before any source ships.

## Outcome

All 5 Wave-0 deliverables landed:

1. **`data/channels.ts`** — 1-entry `Channel[]` with `{ platform: 'instagram', handle: 'braehods', url: 'https://instagram.com/braehods' }`. The `Channel.platform` union keeps `'youtube' | 'instagram'` for forward-compat per `02-SCOPE-AMENDMENT.md`.
2. **`data/site.ts.socials`** — populated with `{ github: 'https://github.com/bwaeden', instagram: 'https://instagram.com/braehods' }`. The `youtube?` key is intentionally absent from the literal; `SiteMeta.socials.youtube?: string` optional shape preserved on the interface.
3. **`public/portrait.jpg`** — copied from `C:/Users/Braeden/Projects/braehods/images/photo.jpg`. Size: 193,424 bytes (~189KB; under 250KB cap, above 50KB floor). **SHA-256:** `EAA79B5DC6B92B822C5566BFD37DD40DFF7E6353EA6E004934713C7CDCB98403`. Phase 6 swap-to-real-photo can verify replacement by hashing the new file and confirming non-match.
4. **`next.config.ts`** — added `images: { qualities: [75, 90] }` inside the existing `nextConfig` object. `withMDX(nextConfig)` wrapper preserved; no `remotePatterns` added (local static assets only per T-02-03).
5. **8 RED Playwright spec files** — all enumerate via `npx playwright test --list` (60 total tests in 21 files; 13 Phase-1 specs unchanged + 8 new Phase-2 stubs). Each spec carries a JSDoc header citing its HOME-XX / PERF-XX requirement and a "RED until Plan NN" provenance line, mirroring the Phase 1 `tests/monogram.spec.ts` convention.

## Spec-to-Requirement Map

| Spec file | Requirements | RED until plan |
|---|---|---|
| `tests/hero-renders.spec.ts` | HOME-01, HOME-02, HOME-03, HOME-05 | 02-06 (Hero.tsx + app/page.tsx) |
| `tests/photo-lcp.spec.ts` | HOME-04, PERF-04, PERF-06 | 02-02 (HeroPhoto.tsx) + 02-06 (composition) |
| `tests/currently-renders.spec.ts` | HOME-02 | 02-02 (CurrentlyLine.tsx + lib/format.ts) |
| `tests/channels-render.spec.ts` | HOME-03 | 02-03 (ChannelButton + ChannelButtonRow) |
| `tests/ctas-resolve-200.spec.ts` | HOME-05 | 02-05 (`/about` + `/work` stub routes) |
| `tests/view-transition-name-present.spec.ts` | HOME-05, D-21 | 02-02 (HeroPhoto inline-style) |
| `tests/footer-socials-render.spec.ts` | HOME-06 | 02-04 (Footer extension + SocialIconLink) |
| `tests/mobile-hero-stacks-cleanly.spec.ts` | HOME-04, CD-04, LNCH-05 (carry-forward) | 02-06 (Hero.tsx flex layout) |

## URLs Collected

The plan body required Task 1 (`checkpoint:human-action`) to collect 5 URLs from the user. The orchestrator supplied them in the executor prompt — no chat prompt fired:

| Field | Value | Notes |
|---|---|---|
| Instagram URL | `https://instagram.com/braehods` | Used for both channel and footer social |
| Instagram handle | `braehods` | Bare, no `@` prefix per ChannelButton convention |
| GitHub URL | `https://github.com/bwaeden` | Doubles as "View source →" link target (D-17) |
| YouTube URL | (not provided) | No YT channel exists yet — omitted per 02-SCOPE-AMENDMENT.md |
| YouTube handle | N/A | — |

## Deviations from Plan

### Scope-amendment compliance (not a deviation — authoritative override)

**`02-SCOPE-AMENDMENT.md` (2026-05-11) supersedes the plan body's YouTube clauses.** All YT-related work intentionally skipped:

- `data/channels.ts` ships a 1-entry array (not 2). The plan body line 217 says "2-entry"; the amended `must_haves` YAML says "1-entry Channel[] with one 'instagram' entry". Implementation follows amendment.
- `data/site.ts.socials` literal contains 2 keys (github + instagram), not 3. Plan body line 218 says all three; amendment overrides.
- `tests/channels-render.spec.ts` asserts 1 external `<a>` and "DM me" only. Plan body line 254 says assert count === 2 with both "Subscribe" and "DM me"; amendment overrides.
- `tests/footer-socials-render.spec.ts` asserts only GitHub + Instagram aria-labels, plus an explicit `.toHaveCount(0)` assertion for the `aria-label="YouTube channel"` selector to guard against accidental YT regression. Plan body line 275 says assert 3 social aria-labels; amendment overrides.
- `tests/footer-socials-render.spec.ts` asserts ≥3 footer `<svg>` (1 monogram + 2 lucide), not ≥4 (1 monogram + 3 lucide) per plan body line 277.

### Auto-fixed issues

**None.** Plan executed exactly as written under the scope-amendment override. No bugs, no missing critical functionality discovered, no blocking issues.

### Authentication gates

**None.** Task 1 was orchestrator-supplied; no auth required for Tasks 2-3.

## Threat-Model Application

Per `<threat_model>` table in `02-01-PLAN.md`:

- **T-02-01 (Tampering, user URLs)** — `mitigate`. Verification step regex enforces `https://` prefix on all channel/social URLs; failure throws before the commit lands. Both committed URLs (`https://instagram.com/braehods`, `https://github.com/bwaeden`) cleared the gate.
- **T-02-02 (Information disclosure, external links)** — `mitigate`. Specs `tests/channels-render.spec.ts` and `tests/footer-socials-render.spec.ts` both assert `rel*="noopener"` + `rel*="noreferrer"` on the relevant external `<a>` elements; the assertion turns GREEN as soon as Plans 02-03 + 02-04 wire the source. Surface area reduced vs. plan body (1 channel external link instead of 2; 2 social icons instead of 3) per scope amendment.
- **T-02-03 (Tampering, next.config.ts)** — `accept`. Only `images.qualities` added; no `remotePatterns`, no build-script changes.
- **T-02-04 (DoS, portrait size)** — `mitigate`. Verify-gate caps at 250KB; committed file is 193KB. Verified above.
- **T-02-05 (Spoofing, user-supplied handles)** — `accept`. No code path executed in this plan (handles render in Plan 02-03); React's default string-escaping is the standing mitigation.

## Phase 1 Carry-Forward Compliance

- **FOUND-07 (zero `'use client'` in `app/`/`components/`/`lib/`)** — verified via Grep across `{app,components,lib,data,tests,next.config.ts}` after each task. Zero results. `tests/no-client-components.spec.ts` continues to pass.
- **`app/%5Ftokens/`** — untouched.
- **`lib/motion.ts` motion contract** — untouched; no alternative motion helpers introduced in specs.
- **Spec convention** — all 8 new files match the `tests/monogram.spec.ts` top-of-file pattern (JSDoc with HOME-XX header, RED-until-Plan provenance, `import { test, expect } from '@playwright/test'`).

## Browser-CSS-Serializer Caveats Respected

- `tests/view-transition-name-present.spec.ts` — uses `evaluate(node => getComputedStyle(node).viewTransitionName)` and expects the literal string `"hero-photo"` (per `<interfaces>` line 170: Chromium returns the literal, no quoting). Cast through `CSSStyleDeclaration & { viewTransitionName?: string }` because the W3C VT extension isn't in the default `lib.dom.d.ts` shipped with TS 5.9 (caught by `npm run typecheck` pre-stage).
- `tests/currently-renders.spec.ts` — accent-dot color regex accepts both `rgb(124, 135, 255)` and `rgba(124, 135, 255, ...)` per Phase 1 W3 carry-forward.
- `tests/mobile-hero-stacks-cleanly.spec.ts` — viewport gating uses `test.skip(!viewport || viewport.width >= 768, ...)` so the `chromium-desktop` project no-ops the mobile-only assertion (Pixel 5 runs in `chromium-mobile`).

## Commits

| # | Hash | Subject |
|---|---|---|
| 1 | `8812755` | `feat(phase-2/w0): populate data/channels + data/site.socials + portrait + next.config qualities` |
| 2 | `ad697ae` | `test(phase-2/w0): stub 8 RED Playwright specs for HOME-01..06 + PERF-04 + PERF-06` |

## Verification Receipts

- **Wave-0 verification gate (all 5 sub-checks):** PASS
- **`npx playwright test --list`:** 60 tests in 21 files (13 Phase 1 + 8 Phase 2 new). No parse errors.
- **`npm run typecheck`:** PASS (zero output, exit 0)
- **`npm run lint`:** PASS (zero output, exit 0)
- **`'use client'` audit:** zero matches in `{app,components,lib,data,tests,next.config.ts}` (FOUND-07 invariant preserved)
- **RED contract:** specs that don't need a running server (`hero-renders`, `currently-renders`, `channels-render`, `view-transition-name-present`, `footer-socials-render`) all expect Phase 2 source that does not yet exist — they will FAIL by design until Waves 1-3. `photo-lcp` + `ctas-resolve-200` defer to Plan 02-07 / Vercel-preview verification.

## Known Stubs

None. This plan's deliverables are data + tests + config; no UI stubs created, no placeholder text introduced. The portrait.jpg itself is a "v1 placeholder" per D-04 but it is a real, displayable photo of the user (193KB JPEG), not a stub graphic — Phase 6 swap is a content refresh, not a stub resolution.

## Self-Check

- `data/channels.ts`: FOUND
- `data/site.ts`: FOUND
- `next.config.ts`: FOUND
- `public/portrait.jpg`: FOUND (193,424 bytes)
- `tests/hero-renders.spec.ts`: FOUND
- `tests/photo-lcp.spec.ts`: FOUND
- `tests/currently-renders.spec.ts`: FOUND
- `tests/channels-render.spec.ts`: FOUND
- `tests/ctas-resolve-200.spec.ts`: FOUND
- `tests/view-transition-name-present.spec.ts`: FOUND
- `tests/footer-socials-render.spec.ts`: FOUND
- `tests/mobile-hero-stacks-cleanly.spec.ts`: FOUND
- Commit `8812755`: FOUND in `git log`
- Commit `ad697ae`: FOUND in `git log`

## Self-Check: PASSED
