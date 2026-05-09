---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
last_updated: "2026-05-09T01:30:00.000Z"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 1
  completed_plans: 0
---

# Project State: Braeden Site (braehods.com)

**Last updated:** 2026-05-09
**Updated by:** execute-phase (Phase 1 / Wave 2 complete)

## Project Reference

**Core value:** Anyone landing on the site walks away thinking "that's a nice
website" first, then "I want to follow up with him." Visual polish #1,
contact-conversion #2.

**Stack:** Next.js 16.2.6 (App Router) + React 19.2 + TypeScript 5.9 +
Tailwind v4 + `@next/mdx` + Fraunces / Geist Sans / Geist Mono + Vercel.

**Current focus:** Phase 1 / Plan 01 mid-flight. W0 + W1 + W2 shipped. **First
visible site exists** — charcoal gradient + grain + Fraunces "Braeden" hero word
on `/`. Awaiting `/gsd-execute-phase 1 --wave 3` for components + a11y contracts
+ `/_tokens` showcase.

## Current Position

**Milestone:** v1 (initial launch at braehods.com)
**Phase:** Phase 1 — execution in progress
**Plan:** 01-PLAN.md (5 waves, 22 tasks)
**Status:** W0 + W1 + W2 complete (11/22 tasks); 8/13 spec files fully GREEN, 1 partial, 4 deferred to W3
**Wave progress:** W0 ✅ · W1 ✅ · W2 ✅ · W3 ⏳ · W4 ⏳

**Spec scoreboard (after W2):** GREEN — `build-output`, `favicon`, `folder-structure`, `lighthouse` (CLS+hero-font; mono deferred), `no-bare-outline-none`, `no-client-components`, `tokens`, `visual` (DSGN-01+02). Partial — `motion-seam` (keyframe ✅, lib/motion.ts contract pending W3). Deferred to W3 — `contrast`, `focus-ring`, `monogram`, `reduced-motion`.

**Progress:** Phase 0/6 complete (Phase 1 plan 50% complete by tasks)

```
[#####-----] 50% (11/22 plan tasks) — visible site shipped; components + a11y next
```

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Mobile | ≥95 across all four | Not measured (no UI yet) |
| Lighthouse Desktop | ≥95 across all four | Not measured |
| First-page JS bundle (gz) | ≤50KB excluding contact island | Not measured |
| Hero LCP (mid-tier mobile) | <2.5s | Not measured |
| WCAG AA contrast | Pass on both gradient endpoints | Not verified |
| Cumulative Layout Shift | 0 on hero | Not measured |

## Accumulated Context

### Key Decisions (from PROJECT.md + research synthesis)

| Decision | Rationale |
|----------|-----------|
| Editorial-dark over minimalist | User wants polish + craft, not whitespace-purism. References: rauno.me, brittanychiang.com |
| 6 phases (collapsed from ARCHITECTURE.md's 8) | Foundation+Tokens merged; Polish+Launch merged. Standard granularity, every phase ships a Vercel preview |
| `@next/mdx` over Velite for v1 | Official, Turbopack-compatible, zero abandonment risk. Revisit Velite when /writing exceeds ~15 posts |
| CSS-only animation for v1, no motion library | Constraints (restrained craft motion, Lighthouse 95+) are exactly what CSS now does well. `lib/motion.ts` is the isolation seam if motion@12 is ever added |
| Native `<dialog>` for contact modal | Browser handles focus trap + ESC for free. One modal does not justify Radix Dialog dependency |
| All 7 projects equal-weight, no flagship | "I do many things well" reads stronger than "I have one thing" given multi-audience |
| Skip /writing for v1 | Zero essay backlog. Architect for it (content/ folder ready) but don't ship empty |
| Skip light-mode toggle | One mood executed precisely beats two executed loosely |
| A11Y/PERF/SEO are cross-cutting, not separate phases | Bake into the phase that builds the UI; bulk audit + remaining work in Phase 6 |

### Open Todos

- (none — roadmap just created; todos will accumulate as phases plan and execute)

### Blockers

- **B monogram path data** — design deliverable, not a research gap. If not designed before Phase 1 plan-phase begins, use a typographic placeholder and mark a swap pass in Phase 6
- **Portrait photo** — current `images/photo.jpg` from old braehods repo is acceptable as v1 placeholder. New shoot is out-of-band and not blocking
- **Formspree free-tier limits** — confirm before launch (Phase 6)

### Research Flags

All 6 phases follow well-documented Next.js App Router patterns. No per-phase
research sprints required. The one design dependency is the B monogram, which
blocks favicon (Phase 1) but does not block other tokens.

## Session Continuity

### Last Session (2026-05-09 — Phase 1 Wave 2 execution)

- Spawned `gsd-executor` for W2-T1..T5 only (sequential, on master)
- W2-T1 `d92035b` — `feat(phase-1/w2): @theme tokens + charcoal gradient + grain + focus + reduced-motion contract`
- W2-T2 `32fb0f9` — `feat(phase-1/w2): wire Fraunces + Geist Sans + Geist Mono via next/font`
- Carry-forward fix `40aa9e7` — `fix(phase-1/w2): lighthouse spec port-config + re-include tests/ in tsc` (W1's tsconfig `tests/` exclude resolved; `playwright-lighthouse@4` requires `port: 9222`, Playwright launches Chrome with `--remote-debugging-port=9222`)
- **Open Question #2 verdict** `b11f8b5` — `fix(phase-1/w2): apply Fraunces axes fallback`. **Result: SOFT axis CANNOT coexist with explicit `weight: ['600','700']` in `next/font/google` (Next 16.2.6 build-time error: "Axes can only be defined for variable fonts when the weight property is nonexistent or set to `variable`"). Fallback: dropped `axes`, weight-only loading. Knock-on: W3-T1 MonogramMark must trace from a static Fraunces Black source, not the runtime variable instance — back-pointer in `app/fonts.ts` and `app/icon.svg`.**
- W2-T3 `8ddd5ca` — `feat(phase-1/w2): root layout with font vars, Analytics, SpeedInsights, divider placeholders`
- W0 stub corrections `59aae89` — `fix(phase-1/w2): correct W0 stub specs for Turbopack + browser CSS serialization`. Two W0-stubbed tests had infrastructure assumptions wrong: `tests/build-output.spec.ts` was scanning `.next/static/css/` (webpack convention) but Turbopack emits to `.next/static/chunks/` (now recurses from `.next/static/`); `tests/visual.spec.ts` DSGN-01 regex required literal `180deg` but Chromium's `getComputedStyle.backgroundImage` serializer drops the default angle (regex now accepts both forms; authored CSS still `180deg` per D-09).
- W2-T4 `a10d26f` — `feat(phase-1/w2): placeholder Fraunces 'Braeden' hero word`
- W2-T5 `9ae2f74` — `feat(phase-1/w2): app/icon.svg favicon (text-on-charcoal placeholder, W3-T1 retrace pending)`
- **Open Question #1 verdict:** A1 default shipped, no deviation — text-on-charcoal (light B `#e8e8e8` on `#0a0a0a`). Phase 2 real-device testing can flip if 16px legibility is poor.
- **Visual milestone:** `npm run dev` now renders the real charcoal-gradient site — full-viewport gradient (`#1a1a1f` → `#0a0a0a`), 4% grain via `feTurbulence`, single Fraunces 700 "Braeden" word centered (clamp 64→96px). Placeholder hairline divider top + bottom await W3 Nav/Footer.
- **Spec scoreboard:** 8 spec files fully GREEN, 1 partial (motion-seam keyframe ✅, lib/motion.ts contract pending), 4 deferred to W3 (focus-ring, monogram, reduced-motion, the lib/motion.ts subtest of motion-seam). `contrast` passes trivially right now and runs meaningfully after W3-T4.

### Last Session (2026-05-09 — Phase 1 Wave 1 execution)

- Bootstrapped Next.js 16 + React 19 + Tailwind v4 + TS 5.9 via `npx create-next-app` (orchestrator ran non-interactively with `--yes`)
- Spawned `gsd-executor` for W1-T2..T4 only (W1-T1 was orchestrator-completed)
- W1-T2 committed `e97a55f` — `chore(phase-1/w1): merge create-next-app bootstrap, pin versions, harden tsconfig`
- W1-T3 committed `8c8670a` — `chore(phase-1/w1): folder layout, prettier, env scaffold, README`
- W1-T4 committed `2e082cb` — `chore(phase-1/w1): mdx wiring, lib/utils, typed data scaffolds`
- **`tests/folder-structure.spec.ts` GREEN** — first W1 milestone
- Versions pinned: Next 16.2.6, React 19.2.4 (vs plan 19.2.6 — patch drift, within spec), Tailwind 4.3.0 (vs research 4.2.4 — minor drift, latest stable), `@playwright/test` ^1.59.1 (preserved from W0)
- Bootstrap dir `../braeden-site-bootstrap/` deleted; `app/favicon.ico` deleted (D-04)
- Executor deviations (all logged): excluded `tests/` from `tsconfig.json` (W0's lighthouse spec has a real type error against `playwright-lighthouse@4`'s API — W2-T2 revisits); added `.prettierignore` to protect `.planning/`, `CLAUDE.md`, `tests/`, `playwright.config.ts` from formatter
- Carried-forward TODO: `tests/lighthouse.spec.ts` needs a `port: number` arg per `playwright-lighthouse@4` — W2-T2 (font work) is the natural place to fix it

### Last Session (2026-05-08 — Phase 1 Wave 0 execution)

- Spawned `gsd-executor` for Phase 1 / Plan 01 / Wave 0 only (user is pacing wave-by-wave)
- W0-T1 committed `1ecc966` — `chore(phase-1/w0): install Playwright + axe + Lighthouse, scaffold config`
- W0-T2 committed `0a14e38` — `chore(phase-1/w0): stub 13 RED test specs (validation infra ready)`
- Created `.gitignore` (executor deviation, sensible — needed for `node_modules/`)
- `@playwright/test` resolved to `^1.59.1` (caret-resolved from `^1.55.0`; within spec)
- 13 spec files in `tests/` collect cleanly; 15/16 fail with assertions (RED contract); `tests/no-client-components.spec.ts` passes trivially because target dirs (`app/`, `components/`, `lib/`) don't exist yet — gates meaningfully starting W1

### Last Session (2026-05-08 — Phase 1 plan-phase finalization)

- Finalized `01-PLAN.md` (1759 lines, 5 waves, 22 tasks, 20 requirements)
- Committed `bc5b1ce plan(phase-1): finalize 01-PLAN.md (5 waves, 22 tasks, 20 reqs)`
- ROADMAP updated to reflect 1 plan / 5 waves

### Last Session (2026-05-07 — initialization)

- Read PROJECT.md, REQUIREMENTS.md (67 v1 reqs), research SUMMARY/ARCHITECTURE/STACK/PITFALLS
- Derived 6 phases from natural delivery boundaries (Foundation → Home → About → Work → Contact → Polish+Launch)
- Mapped all 67 v1 requirements to exactly one phase (no orphans, no duplicates)
- Distributed cross-cutting A11Y / PERF / SEO across phases per instructions
- Wrote ROADMAP.md, STATE.md, updated REQUIREMENTS.md traceability table

### Next Session

Run `/gsd-execute-phase 1 --wave 3` to ship the components + a11y contracts +
`/_tokens` showcase. W3 is 6 tasks (T1 MonogramMark with Fraunces-traced path
+ sync app/icon.svg per D-04 single-source rule; T2 Nav with monogram + name +
3 placeholder links; T3 Footer with muted monogram + © + braehods.com text; T4
hidden `/_tokens` showcase route; T5 lib/motion.ts seam per CD-03; T6 sweep
enforcement — no `'use client'`, no bare `outline:none`, full local suite).

**Carry-forward into W3-T1:** Open Question #2 fallback consequence — Fraunces
SOFT axis is unavailable at runtime under Next 16.2.6's `next/font/google`
constraint (axes + explicit weight are mutually exclusive). MonogramMark must
trace from a static Fraunces Black source (e.g., a downloaded `.ttf` file) not
the runtime variable instance.

**After W3, 4 more specs turn GREEN** — `tests/monogram.spec.ts`,
`tests/focus-ring.spec.ts`, `tests/motion-seam.spec.ts` (full), `tests/reduced-motion.spec.ts`,
`tests/contrast.spec.ts` (meaningfully). All 13 spec files green except the
deploy-only ones, ready for W4 Vercel deploy.

---
*State initialized: 2026-05-07 by roadmapper*
*State updated: 2026-05-08 by discuss-phase (Phase 1 context)*
*State updated: 2026-05-08 by plan-phase (Phase 1 plan finalized)*
*State updated: 2026-05-08 by execute-phase (Phase 1 Wave 0 complete)*
*State updated: 2026-05-09 by execute-phase (Phase 1 Wave 1 complete)*
*State updated: 2026-05-09 by execute-phase (Phase 1 Wave 2 complete)*
