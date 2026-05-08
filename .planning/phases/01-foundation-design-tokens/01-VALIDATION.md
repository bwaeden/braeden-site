---
phase: 1
slug: foundation-design-tokens
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-08
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source of truth for test mapping: `01-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.55.x (E2E + visual + a11y), `@axe-core/playwright`, `playwright-lighthouse` |
| **Config file** | `playwright.config.ts` (Wave 0 creates) |
| **Quick run command** | `npm run lint && npm run typecheck && npx playwright test --project=chromium-mobile -x` |
| **Full suite command** | `npm run build && npx playwright test` |
| **Estimated runtime** | ~30s quick, ~120s full |

---

## Sampling Rate

- **After every task commit:** quick run command (~30s)
- **After every plan wave:** full suite command (~2min)
- **Before `/gsd-verify-work`:** Full suite must be green against the deployed Vercel preview URL (set `baseURL` env in CI)
- **Max feedback latency:** 30s

---

## Per-Task Verification Map

| Req ID | Wave | Behavior | Test Type | Automated Command | File Exists | Status |
|--------|------|----------|-----------|-------------------|-------------|--------|
| FOUND-01 | W0 | Project builds without error | smoke | `npm run build` exits 0 | ❌ W0 | ⬜ pending |
| FOUND-02 | W2 | Tailwind v4 `@theme` compiles to CSS custom props | smoke | `tests/build-output.spec.ts` greps emitted CSS for `--color-bg-end: #0a0a0a` | ❌ W0 | ⬜ pending |
| FOUND-03 | W2 | `@next/mdx` loads without crash | smoke | Build step crashes if `mdx-components.tsx` missing | ❌ W0 | ⬜ pending |
| FOUND-04 | W1 | Folder layout exists | smoke | `tests/folder-structure.spec.ts` asserts `app/`, `components/{ui,layout}`, `content/`, `data/`, `lib/`, `public/` | ❌ W0 | ⬜ pending |
| FOUND-05 | W4 | Vercel preview URL renders within ~2 minutes | manual | Push branch; verify Vercel deploys ≤ 2min via dashboard | manual | ⬜ pending |
| FOUND-06 | W1 | ESLint clean; Prettier formats clean | unit | `npm run lint && npx prettier --check .` exits 0 | ❌ W0 | ⬜ pending |
| FOUND-07 | W3 | No `'use client'` in Phase 1 sources | unit | `tests/no-client-components.spec.ts` greps `**/*.tsx` for `'use client'` — must be zero hits | ❌ W0 | ⬜ pending |
| FOUND-08 | W1 | Typed data files compile under `tsc --noEmit` | smoke | `npm run typecheck` exits 0 | ❌ W0 | ⬜ pending |
| DSGN-01 | W2 | Body shows charcoal gradient | e2e | `tests/visual.spec.ts` — `getComputedStyle(body).backgroundImage` includes `linear-gradient(180deg, rgb(26,26,31), rgb(10,10,10))` | ❌ W0 | ⬜ pending |
| DSGN-02 | W2 | Grain overlay renders (`body::after`, opacity 0.04) | e2e | `tests/visual.spec.ts` — `getComputedStyle(body, '::after').opacity === '0.04'` | ❌ W0 | ⬜ pending |
| DSGN-03 | W2 | Color tokens emit as CSS custom properties | unit | `tests/tokens.spec.ts` — assert all 6 token values via `getPropertyValue` | ❌ W0 | ⬜ pending |
| DSGN-04 | W2 | Three fonts load via `next/font` with zero CLS | e2e + Lighthouse | `tests/lighthouse.spec.ts` — assert CLS = 0 + Fraunces/Geist Sans/Geist Mono in computed font-family stack | ❌ W0 | ⬜ pending |
| DSGN-05 | W3 | MonogramMark renders in nav, footer, `/_tokens` at expected sizes | e2e | `tests/monogram.spec.ts` — locate SVG by role/aria, assert size attrs | ❌ W0 | ⬜ pending |
| DSGN-06 | W3 | `:focus-visible` shows electric-blue ring | e2e | `tests/focus-ring.spec.ts` — Tab through nav, assert `outline: rgb(124,135,255) solid 2px` on focused element | ❌ W0 | ⬜ pending |
| DSGN-07 | W3 | Motion primitives defined but unused | unit | `tests/motion-seam.spec.ts` — assert `lib/motion.ts` exports + keyframes | ❌ W0 | ⬜ pending |
| DSGN-08 / A11Y-06 | W3 | `prefers-reduced-motion: reduce` zeroes durations | e2e | Playwright `emulateMedia({ reducedMotion: 'reduce' })` + verify `transition-duration: 0.01ms` | ❌ W0 | ⬜ pending |
| DSGN-09 | W3 | All token+gradient pairs clear WCAG AA | e2e + axe | `tests/contrast.spec.ts` — `@axe-core/playwright` against `/_tokens` route | ❌ W0 | ⬜ pending |
| A11Y-02 | W3 | No `outline: none` without `:focus-visible` replacement | unit + axe | `tests/no-bare-outline-none.spec.ts` + axe-core focus indicator check | ❌ W0 | ⬜ pending |
| SEO-07 | W2 | Favicon SVG renders | smoke | `tests/favicon.spec.ts` — `page.goto('/icon.svg')`, assert SVG path + viewBox | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Framework install: `npm install -D @playwright/test @axe-core/playwright playwright-lighthouse && npx playwright install chromium`
- [ ] `playwright.config.ts` — base config, mobile + desktop projects, `baseURL` env var
- [ ] `tests/build-output.spec.ts` — covers FOUND-02
- [ ] `tests/folder-structure.spec.ts` — covers FOUND-04
- [ ] `tests/no-client-components.spec.ts` — covers FOUND-07
- [ ] `tests/visual.spec.ts` — covers DSGN-01, DSGN-02
- [ ] `tests/tokens.spec.ts` — covers DSGN-03
- [ ] `tests/lighthouse.spec.ts` — covers DSGN-04 (CLS = 0)
- [ ] `tests/monogram.spec.ts` — covers DSGN-05
- [ ] `tests/focus-ring.spec.ts` — covers DSGN-06, A11Y-02
- [ ] `tests/motion-seam.spec.ts` — covers DSGN-07
- [ ] `tests/reduced-motion.spec.ts` — covers DSGN-08, A11Y-06
- [ ] `tests/contrast.spec.ts` — covers DSGN-09
- [ ] `tests/favicon.spec.ts` — covers SEO-07

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel preview URL renders within ~2 minutes after push | FOUND-05 | Requires observing Vercel deploy timing in dashboard; not deterministic from local CI | Push branch → open Vercel project → verify build duration ≤ 2 min and preview URL serves the gradient page |

---

## Validation Sign-Off

- [ ] All Phase 1 requirements have an `<automated>` verify command or Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all 13 missing test files + framework install
- [ ] No watch-mode flags (`-x` used to skip flaky tests, not for watch)
- [ ] Feedback latency < 30s on quick run
- [ ] FOUND-05 manual sign-off checklist item added to W4
- [ ] `nyquist_compliant: true` set in frontmatter once planner verifies coverage

**Approval:** pending
