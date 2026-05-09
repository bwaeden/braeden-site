// app/fonts.ts
// Source: PLAN.md W2-T2; RESEARCH.md Pattern 3 + Open Question #2; D-04 / DSGN-04.
//
// Loads the three Phase 1 typefaces via `next/font`:
//   - Fraunces (display serif) from Google Fonts, with the SOFT and opsz
//     variation axes requested + weights 600/700 only.
//   - Geist Sans + Geist Mono via the `geist` package (self-hosted).
//
// Open Question #2 result (RESEARCH.md / PLAN.md W2-T2):
// FALLBACK APPLIED. The plan's verbatim config combined `axes: ['SOFT', 'opsz']`
// WITH explicit `weight: ['600', '700']`. Next 16.2.6 / Turbopack rejects this
// at build time with:
//   "Axes can only be defined for variable fonts when the weight property is
//    nonexistent or set to `variable`."
// (Surfaced during W2-T3 build, before the DevTools verification step the plan
// schedules after W2-T4 — same fallback contingency, earlier signal.)
//
// Per the plan's documented fallback path:
//   1. ✅ Removed `axes` from the Fraunces config; proceeding with weight-only
//      loading (600/700) — matches PITFALLS perf budget.
//   2. ⏭ W3-T1 monogram path tracing must use a static Fraunces Black source
//      file rather than the runtime variable instance (no SOFT axis available).
//   3. ✅ Documented in this leading comment + flagged in the W2 commit + will
//      be flagged in the Phase 1 SUMMARY when the plan completes.
//
// Do NOT load extra Fraunces weights "for later" — PITFALLS perf trap. 600 +
// 700 are the only weights Phase 1 + Phase 2 hero need.

import { Fraunces } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  // axes dropped (see fallback note above); weight-only loading.
  weight: ['600', '700'],
  // adjustFontFallback defaults to true for Google fonts in Next 16+ (CLS-killer)
});

export { GeistSans, GeistMono };
