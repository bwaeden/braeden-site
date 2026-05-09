// app/fonts.ts
// Source: PLAN.md W2-T2; RESEARCH.md Pattern 3 + Open Question #2; D-04 / DSGN-04.
//
// Loads the three Phase 1 typefaces via `next/font`:
//   - Fraunces (display serif) from Google Fonts, with the SOFT and opsz
//     variation axes requested + weights 600/700 only.
//   - Geist Sans + Geist Mono via the `geist` package (self-hosted).
//
// Open Question #2 contingency (RESEARCH.md):
// If Fraunces' SOFT variation axis fails to apply under Turbopack 16.2.6
// (verifiable in DevTools by inspecting `getComputedStyle(:root).fontVariationSettings`,
// or via a Playwright `page.evaluate(() => getComputedStyle(document.documentElement).fontVariationSettings)`),
// the documented fallback is:
//   1. Remove the `axes: ['SOFT', 'opsz']` line from the Fraunces() config and
//      proceed with weight-only loading (600/700).
//   2. Trace the W3-T1 monogram path from a *static* Fraunces Black source
//      file rather than the runtime variable instance.
//   3. Document the regression in the Phase 1 SUMMARY so a future maintainer
//      sees why the axes config was dropped.
// The W2 executor verifies this once the dev server is up after W2-T4 ships.
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
  axes: ['SOFT', 'opsz'],
  weight: ['600', '700'],
  // adjustFontFallback defaults to true for Google fonts in Next 16+ (CLS-killer)
});

export { GeistSans, GeistMono };
