---
phase: 01-foundation-design-tokens
plan: 01
status: complete
branch: test/phase-1-found-05-final
merged_to: main  # post-merge update
date_completed: 2026-05-11
---

# Phase 1 / Plan 01 — Summary

## What shipped

A Next.js 16 + React 19.2 + Tailwind v4 + Fraunces/Geist app, deployed to a
working Vercel preview at `braeden-site-8plhvy7fu-bwaedens-projects.vercel.app`.
The page itself is intentionally placeholder — a hero with "Braeden" in
Fraunces, a nav with three non-functional links, and a footer with the
monogram + braehods.com text. The deliverable is **the foundation, not the
content**: design tokens, fonts, focus contract, RSC-only architecture,
deploy pipeline.

## Acceptance — all green

**Specs:** 32/32 Playwright passing against both `http://localhost:3000`
(`npm run build && npm start`) and the deployed preview URL. Run via
`PLAYWRIGHT_BASE_URL=https://braeden-site-8plhvy7fu-bwaedens-projects.vercel.app/ npx playwright test`.

**Requirements satisfied:**

| ID | Bar | Result |
|----|-----|--------|
| FOUND-01..04 | Next 16 App Router, RSC-default, MDX wired, TS strict | ✅ verified by `no-client-components.spec.ts`, build output, `tsconfig.json` |
| FOUND-05 | Preview URL deploys ≤120s of push | ✅ 4 in-scope deploys: `f5e2b73`=24s, `a975967`=21s, `2f219aa`=24s, `d2b0397`=21s (Vercel API) |
| FOUND-06 | Tailwind v4 with `@theme` tokens | ✅ `app/globals.css` |
| FOUND-07 | Zero `'use client'` directives | ✅ `no-client-components.spec.ts` |
| FOUND-08 | Static SSG output | ✅ build logs show `λ index` prerendered |
| DSGN-01..09 | Charcoal gradient, Fraunces/Geist, accent #7c87ff, monogram, grain, focus ring | ✅ `visual.spec.ts`, `tokens.spec.ts`, `monogram.spec.ts`, `contrast.spec.ts`, `focus-ring.spec.ts` |
| A11Y-02 | No bare `outline: none` | ✅ `no-bare-outline-none.spec.ts` + `focus-ring.spec.ts` |
| A11Y-06 | `prefers-reduced-motion` respected | ✅ `reduced-motion.spec.ts` |
| SEO-07 | Favicon + metadata baseline | ✅ `favicon.spec.ts` |

## Decisions made during execution

1. **Mobile nav uses native `<details>/<summary>`, not a client-component
   hamburger.** Preserves FOUND-07 (zero `'use client'`). Browser gives
   us ESC-to-close and outside-click semantics for free at zero JS.
   Commit `a975967`.

2. **`mix-blend-mode: overlay` on the body grain retained, not dropped.**
   User accepted perceived performance during W4-T3 review. Preserves
   D-09 grain dithering quality on the charcoal gradient.

3. **`*:focus { outline: none }` paired with `*:focus-visible { outline:
   2px solid var(--color-accent) }`** — keyboard users see the accent
   ring; mouse users don't get the visual noise.

## Surprises

1. **`braeden-site.vercel.app` is the production alias, not the branch
   preview.** During W4-T2 we initially ran Playwright against
   `braeden-site.vercel.app` and reported 32/32 GREEN. Curl headers
   later revealed `Age: 160062` (~44h) and `X-Vercel-Cache: HIT` — the
   alias was serving a stale production cache. The correct branch
   preview is at `braeden-site-<hash>-<scope>.vercel.app` and must be
   pulled from the Vercel dashboard or `vercel ls`. We re-ran the suite
   against the real branch preview to validate.

2. **Vercel preview deploys inject a `<vercel-live-feedback>` custom
   element into the page's tab order.** This caused DSGN-06 to fail
   when first run against the preview: Tab walked past our 4 nav
   links, landed on Vercel's feedback widget, and naturally found it
   doesn't have *our* accent focus ring. The widget is invisible to
   `curl` (rendered client-side) and absent locally. Fixed in
   `tests/focus-ring.spec.ts` by stopping the walk at any custom
   element (tagName containing `-`). The DSGN-06 contract is unchanged
   — only the test's awareness of out-of-contract elements.

3. **`page.waitForLoadState('networkidle')` and Tab+Shift+Tab modality
   warm-ups did not fix the failure** before we identified the Vercel
   widget. Time spent chasing a false hypothesis (Playwright
   `:focus-visible` heuristic timing) before adding debug logging that
   immediately showed `tag: "VERCEL-LIVE-FEEDBACK"`. Lesson: instrument
   first, theorize second.

4. **Local `npm run build && npm start` is the closest reproduction of
   Vercel's serving stack** (production bundle, no dev scripts) but
   does not catch Vercel-injected runtime elements like the feedback
   widget. Future phases should run the full suite against an actual
   branch preview before declaring W4-T2 done.

## Deferred / carried forward

- **Custom domain `braehods.com`** — DNS not yet configured. Carried to
  Phase 6 (deploy-readiness audit). FOUND-05 acceptance was explicitly
  scoped to `*.vercel.app` preview deploy duration, so this is not a
  Phase 1 blocker.

- **Real route content** (`/about`, `/work`, `/contact`, project entries,
  /writing) — Phases 2–5 ship these. Phase 1's nav links all point to
  `/` as placeholders.

- **Lighthouse 95+ targets** — not measured in Phase 1; reserved for
  Phase 5 (perf + a11y audit). Phase 1 specs verify the *scaffolding*
  for those targets (CLS=0 on hero, fonts via `next/font`, ≤50KB
  first-load goal as a structural property of RSC-only output).

## Files of note

- `app/globals.css` — design tokens, `@theme` block, focus contract, grain filter
- `app/layout.tsx` — fonts wired, Nav + Footer composed
- `app/fonts.ts` — `next/font` for Fraunces + Geist Sans + Geist Mono
- `components/layout/Nav.tsx` — header with `<details>/<summary>` mobile disclosure
- `components/layout/Footer.tsx` — monogram + braehods.com text (NOT a link in Phase 1)
- `components/ui/MonogramMark.tsx` — inline SVG monogram, `currentColor`-tinted
- `tests/focus-ring.spec.ts` — DSGN-06 spec, patched to skip Vercel preview widget

## How to verify post-merge

```bash
# 1. Local prod build
npm run build && npm start
PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test
# expect: 32/32 passed

# 2. Against the actual deployed preview/production URL
PLAYWRIGHT_BASE_URL=https://<deploy-url>/ npx playwright test
# expect: 32/32 passed
```
