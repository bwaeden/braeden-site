---
phase: 04-work-projects
plan: 01 (consolidated — covers Plans 04-01 + 04-02)
status: complete
subsystem: work / projects-grid / wave-1-page-composition
tags: [work, projects, grid, project-card, hairline-tile, status-badge, server-component, playwright, cliché-scrub, vercel-preview-deferred, webaim-deferred]

# Dependency graph
requires:
  - phase: phase-01-foundation-design-tokens
    provides: "FOUND-07 (Server-Component invariant) · DSGN-06 (focus ring) · DSGN-09 (contrast) · CD-05 (vertical rhythm tokens) · `app/globals.css` @theme palette + `*:focus-visible` rule + `.fade-in-up` keyframe"
  - phase: phase-02-home-page
    provides: "`components/home/ChannelButton.tsx` (hairline-tile + group-hover analog) · `components/home/CTAArrowLink.tsx` (accent-arrow translate analog) · `components/layout/SocialIconLink.tsx` (Plan 02-04 transition-discipline lesson) · `lib/motion.ts` (`fadeInUp` + `stagger(N)` seam) · `data/projects.ts` (locked Zod schema + empty array literal Phase 4 populates) · `app/work/page.tsx` Plan 02-05 'Coming soon.' stub Phase 4 replaces"
  - phase: phase-03-about-page
    provides: "Cliché-ban regex pattern (`tests/about-renders.spec.ts` line 28 reused verbatim by `tests/work-descriptions-cliche-scrub.spec.ts`) · sr-only h1 + aria-labelledby section landmark convention (D-13 inheritance) · Claude-drafts-content + user-edits-in-place pattern (D-15 inheritance from D-01)"
provides:
  - "`/work` route as a real, equal-weight 7-card responsive grid (replaces the Plan 02-05 'Coming soon.' Server-Component stub)"
  - "`components/work/ProjectCard.tsx` — Server Component hairline-tile card; locked `STATUS_DOT_COLOR` constant; `transition-[border-color,color,transform]` arbitrary-list discipline; full-card `<a target=\"_blank\" rel=\"noopener noreferrer\">`; aria-hidden dot + lowercase exact-schema label; tabnabbing + cliché-ban + D-15 honesty contract enforced bidirectionally"
  - "`data/projects.ts` populated with 7 user-confirmed entries (CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, archived braehods.com (v0))"
  - "4 newly-GREEN Playwright specs (`tests/work-grid-renders.spec.ts`, `tests/work-status-badges.spec.ts`, `tests/work-no-flagship.spec.ts`, `tests/work-descriptions-cliche-scrub.spec.ts`)"
  - "Cross-route consumer pattern #2 (after Phase 3 `/about` was #1) for the editorial-tile design family translated from button scale (Phase 2 ChannelButton) to card scale (Phase 4 ProjectCard)"
affects:
  - "Phase 5 (Contact Modal) — inherits Server-Components-only invariant; will need its own client-island carve-out for the modal; ProjectCard's hover treatment + focus-ring discipline is a forward-compat reference for any cards Phase 5 adds"
  - "Phase 6 (Polish + SEO + Launch) — owns the Phase 4 deploy-verify cycle (T5/T6 deferred per user choice); WebAIM contrast measurement on archived dot; 28-item visual checklist walk on the deployed Vercel preview; 3 placeholder GitHub repo URL real-link verification; archived braehods href post-DNS-swap target decision; the 7 pre-existing `/`-route spec failures (lighthouse, photo-lcp, no-bare-outline-none); `STATUS_DOT_COLOR` literal promotion to `@theme` revisit if status badges propagate beyond ProjectCard"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Card-scale translation of the Phase 2 ChannelButton hairline-tile pattern: `group block h-full p-5 rounded border border-[var(--color-border)] transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)]` — hover transitions border-color + arrow translate-x; explicitly NOT `transition-colors` shorthand (Plan 02-04 Rule 1 lesson holds)"
    - "Per-card stagger seam discipline (Pitfall 5): the `fadeInUp` keyframe lives on the per-card `<li>` wrapper added by `app/work/page.tsx`, NOT on the inner `<a>`, to avoid `transform: translateY(0)` end-state colliding with the card's hover `translate-x` arrow. Pattern is identical to Phase 2's `components/home/ChannelButtonRow.tsx` analog. First card animates at 80ms, last at 560ms (7×80ms increments)."
    - "Single-source-of-truth count derivation in Playwright specs (checker warning #4 fix): every spec that depends on N imports `{ projects } from '../data/projects'` and asserts `toHaveCount(projects.length)` rather than a hard-coded numeric literal. Adding/removing a project entry automatically recalibrates spec assertions with no spec edit. Adopted in 3 of 4 new specs (`work-grid-renders`, `work-status-badges`, `work-no-flagship`); `work-descriptions-cliche-scrub` derives via DOM extraction so the import is unnecessary."
    - "Scoped exact-match selector pattern for spec assertions over data with overlapping enum values: `card.locator('span:text-is(\"${project.status}\")')` rather than the substring `text=` matcher, to defeat (a) substring collision (`in-dev` enum substring matched inside `in-development` description text on cards 3/4/5) AND (b) cross-tag exact-match collision (`archived` exact-matched both the badge `<span>` and the tags `<p>` on card 6). Pattern: scope selector to the structural tag that holds the value AND use `:text-is` for exact equality. Documented inline in `tests/work-grid-renders.spec.ts:62-68`."
    - "D-15 honesty contract enforced bidirectionally at the data layer: positive-honesty check (CapitolLens description MUST contain `paper-only` or `paper-traded`) AND negative-honesty check (every entry where `status === 'in-dev'` MUST NOT contain `live` or `shipped` case-insensitively). Both checks live as one-off `node` validations inside the Wave-0b + Wave-1 verify gates AND as cliché-scrub regex backstops at the DOM layer in `tests/work-descriptions-cliche-scrub.spec.ts`."

key-files:
  created:
    - "data/projects.ts (Wave-0b populated 7 entries — schema lines 1-14 unchanged)"
    - "components/work/ProjectCard.tsx (Wave-1 — Server Component hairline-tile)"
    - "tests/work-grid-renders.spec.ts (Wave-0c — WORK-02/04/05/06)"
    - "tests/work-status-badges.spec.ts (Wave-0c — WORK-03 + A11Y-05)"
    - "tests/work-no-flagship.spec.ts (Wave-0c — WORK-01 equal-weight clientWidth parity)"
    - "tests/work-descriptions-cliche-scrub.spec.ts (Wave-0c — D-15 voice + cliché regression)"
    - ".planning/phases/04-work-projects/04-01-SUMMARY.md (this file — consolidated 04-01 + 04-02)"
  modified:
    - "app/work/page.tsx (Wave-2 — replaced Plan 02-05 'Coming soon.' stub with grid composition; preserves `export const metadata = { title: 'Work' };`)"
    - ".planning/REQUIREMENTS.md (WORK-01..06 + A11Y-05 traceability flipped Pending → Complete; section checkboxes flipped)"
    - ".planning/ROADMAP.md (Phase 4 row checked; Plans count 1 → 2; both 04-01-PLAN.md + 04-02-PLAN.md lines flipped to [x]; Progress Table row 0/2 → 2/2 Complete; completion date 2026-05-14)"
    - ".planning/STATE.md (progress.completed_phases 3 → 4; progress.completed_plans 9 → 11; Spec scoreboard +4 newly-GREEN Phase 4 specs; Last Session entry appended)"

key-decisions:
  - "Wave-0a OQ resolution: user typed 'use all defaults' verbatim — (a) ship 7 (WORK-06 verbatim), (b) all 7 hrefs default to github.com/bwaeden/<slug> for the 6 active projects + https://braehods.com for the archived entry, (c) archived braehods title = 'braehods.com (v0)' (planner-recommended default). Three of the github.com/bwaeden/<slug> hrefs (prediction-market-bot, no-more-short-form, mc-packet-client) initially shipped with `// TODO(user)` markers; user later approved the placeholders verbatim and the markers were cleared in commit c69d255 (Wave 3a pre-deploy gate satisfaction)."
  - "Wave-3a TODO(user) marker resolution: user approved the github.com/bwaeden/<slug> placeholders for the 3 markers via 'approve placeholders' override. Risk acknowledged: if any of the 3 repos are not public, the cards will link to GitHub 404s — Phase 6 owns post-deploy walk-through to flag any 404s."
  - "Wave-3b WebAIM contrast verification DEFERRED to manual user task. The `#707070` archived dot on `#1a1a1f` background measures ~3.6:1 in clean conditions per UI-SPEC § Color contrast verification table; the grain layer (opacity 0.04, mix-blend-mode overlay) MAY drop it below the WCAG AA UI-element minimum of 3.0:1 once compositing is real. The documented `#7a7a7a` fallback (1-line `ProjectCard.tsx` STATUS_DOT_COLOR['archived'] edit + 1-line `tests/work-status-badges.spec.ts` `ARCHIVED_RGB` regex update) is ready to ship if WebAIM measurement on the deployed preview returns < 3.0:1."
  - "Wave-2 Task 4 spec selector deviation (Rule 1 fix in commit 95d1d7d): `tests/work-grid-renders.spec.ts:62` selector tightened from substring matcher (`text=${project.status}`) to scoped exact-match (`span:text-is(\"${project.status}\")`) to defeat two cross-file collisions surfaced during the verify gate — substring `in-dev` matching inside `in-development` description text on cards 3/4/5 AND `archived` exact-matching both the badge `<span>` and the tags `<p>` on card 6. Spec contract intent (badge label === status enum, exactly once per card) preserved and strengthened."
  - "T5 (deploy + Playwright-against-preview + 28-item visual checklist) and T6 (WebAIM contrast measurement) DEFERRED by deliberate user choice — user will run the manual deploy-verify cycle after Phase 4 close, separate from implementation. Phase 4 is closed at the implementation level (Tasks 1-4 + TODO marker clearance done; build clean; full local Playwright suite passes for Phase 4 specs + Phase 1+2+3 chrome regression canaries; 7 pre-existing failures on `/`-route specs confirmed pre-Phase-4 via stash-and-rerun and deferred to Phase 6 deploy)."
  - "Phase 4 split into 2 plans during planning per checker scope_sanity feedback: 8 tasks across 4 waves exceeded the 5+ task BLOCKER threshold for a single plan. 04-01 covered Waves 0+1 (4 tasks: data + spec stubs + ProjectCard); 04-02 covered Waves 2+3 (4 tasks: page rewrite + deploy + verify + summary). Single consolidated SUMMARY (this file at `04-01-SUMMARY.md`) covers both plans; no separate `04-02-SUMMARY.md` exists."

patterns-established:
  - "Cross-route consumer pattern #2 for the editorial-tile design family: Phase 2 established the hairline-tile shape at button scale (ChannelButton); Phase 3 reused the home HeroPhoto on `/about` for the cross-route view-transition seam; Phase 4 translates the same hairline-tile shape to card scale on `/work` via ProjectCard. Future routes adding card-grid surfaces inherit ProjectCard wholesale (or the pattern: hairline border + group-hover border-color transition + arrow translate-x + items-stretch row equalization + per-li stagger wrapper)."
  - "Single-source-of-truth N derivation in Playwright specs: spec files import the data array they're testing and derive `toHaveCount(...)` from `array.length` rather than hard-coding the literal. Adopted phase-wide for any spec where the data layer's count drives the spec count."
  - "Scoped exact-match selector for assertions over data with overlapping enum values: `tag-selector:text-is('${value}')` defeats both substring collisions (enum value appears inside other prose) and cross-tag exact-match collisions (same value renders inside multiple tag types on the same card)."
  - "Two-phase deploy-verify-WebAIM cycle as a deliberate user-driven step OUTSIDE the autonomous executor: implementation (Tasks 1-4) lands atomically via the executor; deploy-verify-WebAIM (Tasks 5-6) is a manual user-driven cycle the user runs against the Vercel preview when ready. SUMMARY Phase-6 carry-forwards section captures the exact commands + verification steps + fallback recipes."
  - "TODO(user) marker as a pre-deploy gate: any data-layer file (data/*.ts) shipped with `// TODO(user)` markers gates the deploy step. The deploy task surfaces marker count to the user; user either supplies refined content (re-commit) or explicitly approves the placeholders (override recorded in SUMMARY). Pattern protects public preview URLs from leaking unrefined placeholder copy."

requirements-completed: [WORK-01, WORK-02, WORK-03, WORK-04, WORK-05, WORK-06, A11Y-05]

# Metrics
duration: ~120 min (across 4 executor dispatches: Plan 04-01 W0a/0b/0c/W1 + Plan 04-02 W2 + Wave-3a TODO clearance + Wave-3c SUMMARY/traceability flip)
completed: 2026-05-14
---

# Phase 4 Plans 01 + 02: Work + Projects Summary

**`/work` ships an equal-weight 7-card responsive grid sourced from typed `data/projects.ts` (CapitolLens lead, archived braehods.com (v0) orphan), each rendered by a hairline-tile Server Component (`components/work/ProjectCard.tsx`) with status-dot+lowercase-label (D-09 4-color map), title + ↗ arrow, ≤140-char description, and comma-joined tags — replaces the Plan 02-05 `Coming soon.` stub, flips 4 RED Playwright specs GREEN, and closes WORK-01..06 + A11Y-05 at the implementation level (deploy + WebAIM contrast verification deferred to user-driven Phase 6 cycle).**

## Performance

- **Duration:** ~120 min total across 4 executor dispatches + orchestrator-level Wave-0a checkpoint pre-resolution
- **Started:** 2026-05-13 (Plan 04-01 dispatch)
- **Completed:** 2026-05-14T03:29:47Z (this consolidated SUMMARY commit)
- **Tasks:** 7 of 7 — Tasks 0/1/2/3 (Plan 04-01 Waves 0a/0b/0c/W1) + Task 4 (Plan 04-02 Wave 2) + Task 5 partial (Wave 3a TODO clearance only; deploy DEFERRED) + Task 6 DEFERRED + Task 7 (Wave 3c, this commit)
- **Files created:** 7 (4 specs + 1 component + 1 SUMMARY + 1 populated data file body)
- **Files modified:** 4 (page.tsx + REQUIREMENTS.md + ROADMAP.md + STATE.md)
- **Commits:** 5 task-level + 1 final docs commit (this) = 6 total

## Accomplishments

- **`/work` is no longer a `Coming soon.` stub.** The Plan 02-05 placeholder body has been replaced with the real grid composition. Visiting `/work` (locally; Vercel preview deferred to user) shows 7 hairline-tile cards in a 1-col mobile / 2-col `md:`+ grid with `items-stretch` row equalization and per-card 80ms stagger fade-in.
- **CapitolLens leads, archived braehods.com (v0) sits as the orphan card** in row 4 left column of the 2-col grid (default CSS Grid behavior per D-06; the empty right cell IS the design — no `col-span`, no centering).
- **Status badges read as colored dot + lowercase exact-schema label** (A11Y-05 + WORK-03): shipped→accent #7c87ff, paper-trading→#c8a86a amber, in-dev→#a8a8a8 muted, archived→#707070 deep grey. The label carries the info; the dot is decoratively redundant (`aria-hidden`).
- **D-15 honesty contract enforced bidirectionally.** CapitolLens description contains `paper-only` (positive check). All 5 in-dev entries' descriptions exclude `live` and `shipped` substrings (case-insensitive negative check — symmetric counterpart). Cliché-ban regex inherited verbatim from Phase 3's `tests/about-renders.spec.ts:28` is GREEN against all 7 descriptions; zero `!`; zero emoji.
- **4 newly-GREEN Playwright specs.** `tests/work-grid-renders.spec.ts` + `tests/work-status-badges.spec.ts` + `tests/work-no-flagship.spec.ts` + `tests/work-descriptions-cliche-scrub.spec.ts` all flipped RED → GREEN at Task 4 commit (`95d1d7d`). Targeted Phase 4 spec set: 24 pass / 0 fail / 0 skip.
- **Phase 1+2+3 chrome regression canaries unaffected.** `npm run test:full`: 83 pass / 7 fail / 2 skip. The 7 failures are PRE-EXISTING — confirmed pre-Phase-4 via stash-and-rerun against the commit before Task 4: 2 × `tests/no-bare-outline-none.spec.ts`, 4 × `tests/photo-lcp.spec.ts` (HOME-04/PERF-06 LCP + PERF-04 hero img dimensions, both browser projects), 1 × `tests/lighthouse.spec.ts` (chromium-desktop CLS + font-loading) — all on `/` route, deferred to Phase 6 per prior STATE.md "PERF-06 LCP RED on local dev/start deferred to Plan 07 Vercel preview".
- **Zero `'use client'` added.** Both `app/work/page.tsx` and `components/work/ProjectCard.tsx` are pure Server Components. FOUND-07 / D-25 invariant preserved. `tests/no-client-components.spec.ts` GREEN.
- **Zero new dependencies.** `package.json` diff = 0 across both Plans 04-01 + 04-02.
- **Net Phase 4 spec scoreboard delta: +4 newly-GREEN, 0 regressions caused by Phase 4.**

## Task Commits

Each task was committed atomically. All 5 commits landed on `main`.

1. **Task 0 (Plan 04-01 Wave 0a — checkpoint:human-action):** Pre-resolved by orchestrator before executor dispatch (Wave-0a OQ#1/OQ#2/OQ#3 user response: "use all defaults" — see Deviation #1). No commit.
2. **Task 1 (Plan 04-01 Wave 0b):** `9306790` — `feat(phase-4/w0): populate data/projects.ts with 7 entries (D-14 order, D-16 href waterfall, D-15 honesty)` (feat)
3. **Task 2 (Plan 04-01 Wave 0c):** `f1fb996` — `test(phase-4/w0): stub 4 RED Playwright specs for WORK-01..06 + A11Y-05 + D-15 cliché-scrub (counts derived from projects.length)` (test)
4. **Task 3 (Plan 04-01 Wave 1):** `9ff0909` — `feat(phase-4/w1): components/work/ProjectCard.tsx (hairline-tile card; Server Component; D-01..D-04, D-09..D-12)` (feat)
5. **Task 4 (Plan 04-02 Wave 2):** `95d1d7d` — `feat(phase-4/w2): rewrite app/work/page.tsx to render projects grid (D-05, D-06, D-07, D-13; flips W0 RED specs GREEN)` (feat — INCLUDES Rule 1 deviation: tests/work-grid-renders.spec.ts:62 selector tightened — see Deviation #2)
6. **Task 5 partial (Plan 04-02 Wave 3a — TODO clearance only):** `c69d255` — `chore(phase-4/w3a): clear 3 TODO(user) href markers per user 'approve placeholders' override` (chore — pre-deploy gate satisfaction; the actual deploy + Playwright-against-preview + 28-item visual checklist + WebAIM contrast measurement DEFERRED per user choice)
7. **Task 6 (Plan 04-02 Wave 3b — WebAIM contrast verification):** DEFERRED. No commit, no source change.
8. **Task 7 (Plan 04-02 Wave 3c — this task):** `docs(phase-4): close Phase 4 — 04-01-SUMMARY.md (consolidated 04-01 + 04-02) + ROADMAP + STATE + REQUIREMENTS traceability flip`

_Note: Plan 04-01 Task 0 was a `checkpoint:human-action` resolved by the orchestrator before executor dispatch. Plan 04-02 Tasks 5/6 are documented above as DEFERRED — see `## Phase 6 Carry-Forwards` for the manual user task list._

## Files Created/Modified

- `data/projects.ts` — Replaced empty `export const projects: Project[] = []` with a populated 7-entry literal. Schema lines 1-14 (Zod definitions + Project type) preserved verbatim. Header comment block documents D-14 order rationale, D-16 href waterfall, archived braehods Phase-6 carry-forward, and D-15 honesty contract.
- `components/work/ProjectCard.tsx` — New Server Component (89 lines including comment block). Locked `STATUS_DOT_COLOR` constant with the 4 status→color literals. Card root `<a>` with `target="_blank" rel="noopener noreferrer"` + `transition-[border-color,color,transform]` arbitrary-list discipline. JSX tree: status badge (aria-hidden dot + lowercase exact-schema label) → title row (text + space + aria-hidden ↗ glyph with `group-hover:translate-x-0.5`) → description `<p>` → tags `<p>` (comma-joined). `staggerIndex` prop is forward-compat (animation lives on the `<li>` wrapper per Pitfall 5; destructured as `_staggerIndex` to silence TS unused-var).
- `tests/work-grid-renders.spec.ts` — Imports `{ projects } from '../data/projects'`; 3 tests covering WORK-02/04/05/06; `toHaveCount(projects.length)` for grid size; per-card iteration over `projects` for external-link + tabnabbing-rel + status label + tags-text assertions; scoped exact-match `span:text-is("...")` selector per Deviation #2.
- `tests/work-status-badges.spec.ts` — 4 RGB regex constants for the 4 status-dot colors; covers WORK-03 + A11Y-05; `getComputedStyle.backgroundColor` switch on `project.status` (data-driven, NOT label-text-driven).
- `tests/work-no-flagship.spec.ts` — Sets viewport 1024×800; iterates row pairs derived from `Math.floor(projects.length / 2)`; asserts `clientWidth` parity within each pair AND orphan width === card-0 width (orphan must NOT span — same width as row-mates per D-06).
- `tests/work-descriptions-cliche-scrub.spec.ts` — Reuses `CLICHE_BAN_REGEX` literal from `tests/about-renders.spec.ts:28` verbatim; extracts all card descriptions via `[data-test="work-grid"] li p` and asserts `not.toMatch(CLICHE_BAN_REGEX)` + `not.toContain('!')`.
- `app/work/page.tsx` — Replaced 18-line `Coming soon.` Server Component body with the grid composition (66 lines including comment block). Imports `{ fadeInUp, stagger }` from `@/lib/motion`, `{ projects }` from `@/data/projects`, `{ ProjectCard }` from `@/components/work/ProjectCard`. JSX tree: `<section data-test="work-section" aria-labelledby="work-heading" className="py-8 md:py-12">` → `<h1 id="work-heading" className="sr-only">Work</h1>` → `<ul data-test="work-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 items-stretch list-none p-0">` → `{projects.map((project, i) => <li key={project.slug} className={fadeInUp} style={stagger(i + 1)}><ProjectCard project={project} staggerIndex={i + 1} /></li>)}`. `export const metadata = { title: 'Work' };` preserved verbatim from Plan 02-05.
- `.planning/REQUIREMENTS.md` — WORK-01..06 + A11Y-05 traceability table rows flipped Pending → Complete (local; deploy verify deferred to Phase 6); WORK section + A11Y-05 line checkboxes flipped `[ ]` → `[x]`.
- `.planning/ROADMAP.md` — Phase 4 row checked `[x]`; Plans count "1 plan, 4 waves" → "2 plans, 4 waves"; both 04-01-PLAN.md + 04-02-PLAN.md plan lines flipped `[x]`; Progress Table row 0/2 → 2/2 Complete; completion date 2026-05-14.
- `.planning/STATE.md` — `progress.completed_phases` 3 → 4; `progress.completed_plans` 9 → 11; Spec scoreboard incremented by +4 newly-GREEN Phase 4 specs; Last Session entry appended documenting the 7-task wave structure across both plans + commit hashes + duration + T5/T6 deferral.

## User Decisions

### Wave-0a OQ#1 / OQ#2 / OQ#3 — user response (typed "use all defaults" verbatim)

| OQ | Choice | Detail |
|----|--------|--------|
| OQ#1 (project count) | **ship 7** (WORK-06 verbatim) | reel-research-agent + school-planner NOT added |
| OQ#2 (archived braehods title) | **`braehods.com (v0)`** | planner-recommended default accepted |
| OQ#3 (canonical hrefs) | **all defaults** | 6 active projects → `https://github.com/bwaeden/<slug>`; archived → `https://braehods.com` |

The 6 default `github.com/bwaeden/<slug>` hrefs are: `capitollens`, `shorts-factory`, `meme-dashboard`, `prediction-market-bot`, `no-more-short-form`, `mc-packet-client`. Three of these (prediction-market-bot, no-more-short-form, mc-packet-client) initially shipped with `// TODO(user)` markers above their entries — see Wave-3a resolution below.

### Wave-3a TODO(user) marker resolution — user approved placeholders

3 `// TODO(user)` markers cleared via commit `c69d255`. User explicitly approved the `github.com/bwaeden/<slug>` defaults via "approve placeholders" override. Marker count now 0 (verified pre-deploy).

**Risk acknowledged:** if any of the 3 repos (`prediction-market-bot`, `no-more-short-form`, `mc-packet-client`) are not public, the corresponding cards will link to GitHub 404s on the deployed preview. Phase 6 walk-through owns post-deploy 404 detection. User opted in with this risk known.

### Wave-3b WebAIM contrast verification — DEFERRED

Per UI-SPEC § Color contrast verification table, the `#707070` archived dot on `#1a1a1f` background measures **~3.6:1 in clean conditions**. The grain layer (opacity 0.04, mix-blend-mode: overlay) MAY drop it below the WCAG AA UI-element minimum of **3.0:1** once compositing is real on the deployed CDN-served bundle. The borderline-pair measurement was deliberately deferred to a Phase 6 manual user-driven cycle (see `## Phase 6 Carry-Forwards` for the exact recipe).

**Documented `#7a7a7a` fallback ready to ship if WebAIM check fails:**
- `components/work/ProjectCard.tsx` line 37: `STATUS_DOT_COLOR['archived']` `'#707070'` → `'#7a7a7a'` (1-line)
- `tests/work-status-badges.spec.ts` `ARCHIVED_RGB`: `/rgba?\(\s*112\s*,\s*112\s*,\s*112/` → `/rgba?\(\s*122\s*,\s*122\s*,\s*122/` (1-line)
- Single atomic commit: `fix(phase-4/w3): bump archived dot to #7a7a7a per WebAIM contrast verification`

## Net Spec Movement

**4 newly-GREEN Phase 4 specs** (all flipped RED → GREEN at Task 4 commit `95d1d7d`):
1. `tests/work-grid-renders.spec.ts` — 3 tests (WORK-06 grid count, WORK-02/05 external link + status label, WORK-04 tags text)
2. `tests/work-status-badges.spec.ts` — 2 tests (WORK-03/A11Y-05 dot+label presence, WORK-03 dot computed-color matches STATUS_DOT_COLOR)
3. `tests/work-no-flagship.spec.ts` — 2 tests (WORK-01/D-08 row-pair clientWidth parity, D-07 row-pair height parity within 1px)
4. `tests/work-descriptions-cliche-scrub.spec.ts` — 2 tests (D-15 cliché-ban regex on description text, D-15 no `!` in card copy)

**Local verify gate results (Task 4 final, pre-final-commit):**
- `npm run typecheck`: PASS (exit 0)
- `npm run lint`: PASS (0 errors; 2 pre-existing warnings unrelated to Phase 4 — `.lcp-element-runner.mjs` unused-import + `ProjectCard.tsx` `_staggerIndex` underscore-prefixed forward-compat param)
- `npm run build`: PASS (7 static pages generated, /work prerendered as static `○`)
- Targeted Phase 4 specs (4 W0 RED specs + 3 regression canaries `tests/no-client-components.spec.ts` + `tests/focus-ring.spec.ts` + `tests/reduced-motion.spec.ts`): **24 pass / 0 fail / 0 skip — all 4 W0 RED specs flipped GREEN**
- `npm run test:full`: **83 pass / 7 fail / 2 skip — the 7 failures are PRE-EXISTING** (`tests/no-bare-outline-none.spec.ts` ×2, `tests/photo-lcp.spec.ts` ×4, `tests/lighthouse.spec.ts` ×1 — all on `/` route, deferred to Phase 6 per prior STATE.md "PERF-06 LCP RED on local dev/start deferred to Plan 07 Vercel preview"); CONFIRMED pre-Phase-4 via stash-and-rerun against the commit before Task 4

**Spec scoreboard delta:** +4 newly-GREEN Phase 4 specs (no regressions caused by Phase 4; 0 specs went from GREEN → RED).

**Net package.json diff:** 0 new dependencies installed across Plans 04-01 + 04-02.

## Decisions Made

- **OQ#1 — ship 7 projects (not 8 or 9).** User typed "use all defaults" verbatim. reel-research-agent + school-planner NOT added (despite memory flagging both as active personal projects); WORK-06's verbatim 7-project list is honored.
- **OQ#2 — archived braehods title `braehods.com (v0)`.** Planner-recommended default accepted by user.
- **OQ#3 — all 7 hrefs defaulted.** 6 active projects → `github.com/bwaeden/<slug>`; archived → `https://braehods.com` (the OLD live GitHub Pages site; URL changes after Phase 6 DNS swap — documented as a Phase 6 carry-forward).
- **Wave-3a TODO(user) markers cleared via user "approve placeholders" override** rather than supplying refined href URLs. 3 markers (prediction-market-bot, no-more-short-form, mc-packet-client) → 0 markers via single chore commit `c69d255`. Risk acknowledged: GitHub 404 if any repo is private/non-existent; Phase 6 owns post-deploy verification.
- **Wave-3b WebAIM contrast verification DEFERRED.** User explicitly chose to defer the deployed-preview measurement to a manual Phase 6 cycle. The `#7a7a7a` fallback recipe is documented and ready to ship if needed.
- **Phase 4 split into 2 plans during planning per checker scope_sanity feedback** (8 tasks → 2 plans of 4 tasks each). Single consolidated SUMMARY (this file at `04-01-SUMMARY.md`) covers both plans; no separate `04-02-SUMMARY.md` exists.
- **Spec selector deviation from substring `text=` matcher to scoped exact-match `span:text-is(...)`** committed inline with the page rewrite (commit `95d1d7d`) rather than as a separate spec-fix commit, because the spec was structurally inseparable from the verify gate for Task 4. Deviation #2 below documents in detail.
- **`STATUS_DOT_COLOR` 2 inline color literals (`#c8a86a`, `#707070`) NOT promoted to `globals.css` `@theme`.** D-09 token discipline preserved for v1 (keeps the locked 6-token palette pure). Phase 6 may revisit if status badges propagate to other components beyond ProjectCard.
- **Stagger choreography: 80ms increments via `stagger(i + 1)` on the per-`<li>` wrapper.** First card animates at 80ms, last (7th) at 560ms. Total ~640ms after interactive — comfortably inside the LCP envelope.

## Deviations from Plan

### Auto-fixed Issues

**1. [Orchestrator-level — Wave 0a checkpoint pre-resolution]**
- **Found during:** Pre-Plan-04-01 dispatch (orchestrator step before executor spawn)
- **Issue:** Rather than spawning the executor and having it surface AskUserQuestion at Task 0 (`checkpoint:human-action`), the orchestrator pre-resolved OQ#1/OQ#2/OQ#3 before dispatching Plan 04-01 — saved one round-trip.
- **Fix:** Orchestrator surfaced the 3 OQs to user; user responded "use all defaults" verbatim; orchestrator inlined the resolved answers into the executor's dispatch prompt; executor skipped Task 0 and proceeded directly to Task 1 with the answers known.
- **Files modified:** None (resolution captured in executor prompt only; this SUMMARY records the decision per Wave-0a acceptance criteria)
- **Verification:** Task 1 commit `9306790` shipped 7 entries with the user-confirmed hrefs + archived title; Task 1 verify gate (Project.parse + D-15 honesty checks) passed
- **Committed in:** Resolved before Task 1 commit `9306790`; no separate commit

**2. [Rule 1 - Bug] Spec selector tightened from substring `text=` to scoped exact-match `span:text-is(...)`**
- **Found during:** Task 4 (Plan 04-02 Wave 2 — page rewrite verify gate)
- **Issue:** Two cross-file invariant collisions surfaced during the 4-spec verify gate:
  - **Substring collision:** Playwright's `text=` is substring; the `in-dev` enum substring matched inside `in-development` description text on cards 3/4/5 (shorts-factory, meme-dashboard, prediction-market-bot — each in-dev, each with the substring "in-development" in their description)
  - **Cross-tag exact-match collision:** even after switching to exact-match regex `text=/^${project.status}$/`, `archived` exact-matched both the badge `<span>` AND the tags `<p>` on card 6 (braehods-archive, where `tags=['archived']`)
- **Fix:** Scoped selector to `<span>` elements only (the badge label tag) AND used `:text-is` exact pseudo: `span:text-is("${project.status}")`
- **Files modified:** `tests/work-grid-renders.spec.ts:62-68` (selector + 4-line inline comment documenting both collisions)
- **Verification:** Re-ran `npx playwright test tests/work-grid-renders.spec.ts` after the fix — 3/3 GREEN; targeted full-Phase-4 + regression-canary set: 24/24 GREEN
- **Committed in:** `95d1d7d` (alongside the page rewrite, not as a separate commit, because the spec was structurally inseparable from the Task 4 verify gate)

**3. [Rule N/A — User Decision] Plan 04-02 Tasks 5 (deploy + verify) and 6 (WebAIM contrast) DEFERRED**
- **Found during:** Plan 04-02 Wave 3 (after Task 5 pre-deploy gate satisfaction via commit `c69d255`)
- **Issue (not a bug — a deliberate user choice):** User explicitly opted to defer the deploy + preview-verify + WebAIM measurement cycle to a manual user-driven run after Phase 4 close. T5 pre-deploy gate (TODO(user) count = 0) was satisfied via commit `c69d255`; the actual `git push`, Vercel preview deploy, `BASE_URL=<preview>` Playwright run, 28-item visual checklist walk, and WebAIM color-picker measurement remain as user-driven verification before the Phase 6 cutover.
- **Fix:** Phase 4 closed at the implementation level (Tasks 1-4 + TODO marker clearance done; build clean; full local Playwright suite passes for Phase 4 specs + Phase 1+2+3 chrome regression canaries; 7 pre-existing failures on `/`-route specs deferred to Phase 6). REQUIREMENTS.md marks WORK-01..06 + A11Y-05 as `Complete (local; deploy verify deferred to Phase 6)`. SUMMARY's `## Phase 6 Carry-Forwards` section documents the exact manual-verification recipe.
- **Files modified:** None (deferral documentation only)
- **Verification:** Pre-deploy gate verified via `grep -c 'TODO(user)' data/projects.ts` = 0
- **Committed in:** No separate commit — documented here in SUMMARY only

**4. [Runtime — worktree branching not applied]**
- **Found during:** Plan 04-01 + 04-02 executor dispatches
- **Issue:** Claude Code's runtime did not create separate `worktree-agent-*` branches for these executor dispatches (likely because the project's `workflow.use_worktrees` config was not interpreted as creating actual worktrees in this runtime context). All commits landed atomically on `main`.
- **Fix:** None required — all commits landed cleanly; no orchestrator file conflicts; no concurrent multi-agent activity.
- **Files modified:** None
- **Verification:** `git log --oneline` shows all 5 Phase 4 commits on `main` in correct order with expected hashes (`9306790`, `f1fb996`, `9ff0909`, `95d1d7d`, `c69d255`)
- **Committed in:** N/A

---

**Total deviations:** 4 (1 orchestrator pre-resolution, 1 Rule 1 spec selector fix, 1 user-deliberate deferral, 1 runtime worktree-not-applied)
**Impact on plan:** Deviation #1 saved a round-trip with no fidelity loss. Deviation #2 strengthened spec contract intent (badge label === status enum, exactly once per card) and is documented inline in the spec for future reference. Deviation #3 is a deliberate user choice — Phase 4 implementation is complete; deploy-verify is a Phase 6 concern by user choice. Deviation #4 had no functional impact — commits landed cleanly on main.

## Issues Encountered

**None during execution beyond the 4 deviations documented above.** The Wave-0a checkpoint was pre-resolved by the orchestrator without surfacing as a runtime block. Tasks 1, 2, 3 (Plan 04-01) executed cleanly. Task 4 (Plan 04-02) surfaced the spec selector collision but auto-fixed inline via Rule 1. Task 5 partial (TODO clearance) was a single chore commit. Tasks 6 and the deploy half of Task 5 were deferred by user choice — not by error.

## Authentication Gates

**None.** Phase 4 ships pure static / Server-Component / zero-secret content. No auth required at any point.

## Threat-Model Application

Per `<threat_model>` in 04-01-PLAN.md + 04-02-PLAN.md:

- **T-04-01 (Tampering / Spoofing — `<a target="_blank">` tabnabbing on every ProjectCard)** — `mitigate`. ProjectCard root `<a>` carries `target="_blank" rel="noopener noreferrer"` verbatim per D-03. Spec `tests/work-grid-renders.spec.ts` Test 2 (now GREEN) asserts the `rel` attribute contains both `noopener` and `noreferrer` on every card link.
- **T-04-02 (Spoofing — `project.href` open-redirect risk)** — `accept`. All 7 hrefs are TS-string-literals confirmed at the Wave-0a user-input checkpoint. No dynamic href construction. Zod schema validates URL syntax via `z.string().url()` at the Task 1 build-time validation step.
- **T-04-03 (Tampering / Information Disclosure — XSS via project description / title injection)** — `accept`. All project fields are TS-literals in source; React's default JSX escaping applies; no `dangerouslySetInnerHTML` used.
- **T-04-04 (Information Disclosure — CapitolLens framing reveals "live" trading when paper-only)** — `mitigate`. CapitolLens description contains `paper-only` literal (verified by Task 1 verify gate node-one-liner). All 5 in-dev entries' descriptions exclude `live` and `shipped` (verified by both Task 1 and Task 3 verify gates — symmetric counterpart).
- **T-04-05 (Information Disclosure — memory disclosure of unrelated personal projects)** — `mitigate`. Wave-0a checkpoint required explicit user opt-in via OQ#1; user chose ship 7 (no memory-flagged additions). reel-research-agent + school-planner NOT added.
- **T-04-06 (Tampering — schema-mismatch silent failure)** — `mitigate`. Task 1 verify gate ran `Project.safeParse()` on every entry; zero errors. TS strict + `noUncheckedIndexedAccess` (Phase 1 tsconfig) catches enum mismatches at typecheck time.
- **T-04-07 (Tampering — Lucide brand-icon supply-chain)** — `accept`. Phase 4 imports zero `lucide-react`. The `↗` arrow glyph is Unicode (U+2197). Task 3 acceptance Test 3 asserts zero `lucide-react` imports in `ProjectCard.tsx`.
- **T-04-08 (Tampering — page rewrite breaks LCP element via unrefined `// TODO(user)` markers)** — `mitigate`. Pre-deploy gate satisfied via commit `c69d255` (TODO marker count = 0 confirmed pre-Phase-6-deploy). User opt-in to placeholder hrefs recorded above.
- **T-04-09 (Information Disclosure — Vercel branch preview URL discoverable)** — `accept`. Inherits Phase 1 + 2 + 3 SEO posture; SEO-09 closes this in Phase 6.
- **T-04-10 (Tampering — WebAIM fallback two-file edit drift)** — `mitigate by deferral`. The fallback is documented as a single atomic commit shipping BOTH ProjectCard literal + status-badges spec regex. If the deferred Phase 6 WebAIM measurement triggers the fallback, the executor handling that fix MUST land both edits in one commit.
- **T-04-11 (Information Disclosure — preview URL embeds user-confirmed canonical hrefs)** — `accept`. User explicitly confirmed each href at Wave-0a; private-repo URLs (if any of the 3 default `github.com/bwaeden/<slug>` repos turn out to be non-public) are by definition the user's own decision per the Wave-3a "approve placeholders" override.

All threats either mitigated, accepted by design, or deferred to Phase 6 deploy-verify cycle.

## Phase 1 + Phase 2 + Phase 3 Carry-Forward Compliance

- **FOUND-07 (zero `'use client'`)** — verified: `app/work/page.tsx` + `components/work/ProjectCard.tsx` both Server Components. `tests/no-client-components.spec.ts` GREEN.
- **CD-05 vertical rhythm tokens** — page section uses `py-8 md:py-12` (matches Phase 2 home hero + Phase 3 about); card root padding `p-5` (Phase-1 spacing-scale multiple of 4); card internal gaps `mt-4` (between badge + title) + `mt-2` (between title/description/tags); grid gap `gap-4 md:gap-6` (multiples of 4 from Phase 1 scale). Zero new tokens introduced.
- **Two-weight typography** — page + card use Geist Sans 400 only (no Fraunces — title tier reserved for `/`'s hero word). Zero `font-medium` / `font-bold`.
- **`max-w-3xl` container inheritance** — `app/work/page.tsx` does NOT extend the home page's `max-w-5xl`. Page deliberately inherits the narrower root container from `app/layout.tsx` (matches Phase 3 `/about` discipline).
- **Token discipline** — 2 new color literals (`#c8a86a` paper-trading amber, `#707070` archived deep grey) live as inline `style={{ backgroundColor: ... }}` on the dot only — NOT promoted to `globals.css` `@theme`. The locked 6-token palette stays pure for v1 per D-09.
- **Plan 02-04 transition-discipline lesson holds** — ProjectCard root `<a>` className uses `transition-[border-color,color,transform]` arbitrary-list, NOT `transition-colors` shorthand. Prevents Tailwind v4's outline-color transition interpolation from clobbering `*:focus-visible` accent ring on Tab focus. Verified GREEN by `tests/focus-ring.spec.ts`.
- **`tests/about-renders.spec.ts:28` cliché-ban regex literal reused verbatim** in `tests/work-descriptions-cliche-scrub.spec.ts` (Phase 3 source-of-truth pattern preserved across phases).

## Visual Milestone

`/work` is no longer a `Coming soon.` stub. Visiting `http://localhost:3000/work` (locally) renders the real grid: a section landmark with sr-only h1 "Work", followed by an unordered grid list of 7 hairline-bordered tiles. On desktop (≥768px) the grid lays out as 2 columns × 4 rows; CapitolLens occupies row 1 left (paper-trading amber dot + "CapitolLens ↗" + paper-only Form 4 description + "trading, tools" tags), shorts-factory row 1 right, meme-dashboard + prediction-market-bot row 2, no-more-short-form + mc-packet-client row 3, archived `braehods.com (v0)` orphan in row 4 left column with the right column empty (the design per D-06). Status dots match the locked color map per D-09. Hovering any card transitions its border from `#2a2a2f` to accent `#7c87ff` and translates the trailing ↗ glyph +2px right; no card lifts vertically. Tab navigation cycles through Nav (4 stops) → 7 ProjectCards → Footer (3 stops) = ~14 stops total, each card showing the 2px accent focus ring on selection. Per-card stagger fade-in plays 80ms apart on initial page load (1st card 80ms → 7th card 560ms). On mobile (<768px) the grid collapses to 1 column with all 7 cards stacking vertically. `prefers-reduced-motion: reduce` defeats per-card stagger AND the card hover border-color transition AND the arrow translate per the Phase 1 reduced-motion contract.

The Vercel preview rendering of this layout is the manual verification carried forward to Phase 6 (per the deferred `## Phase 6 Carry-Forwards` items below).

## Phase 6 Carry-Forwards

The following items are explicitly deferred to a manual user-driven Phase 6 cycle. Phase 4 is closed at the implementation level; deploy-verify-WebAIM is a separate phase concern.

### 1. Deploy verification deferred — manual user task

User will perform when ready (no autonomous executor handoff):

```bash
# Step 1: push the 5 Phase 4 commits to trigger Vercel preview build
git push origin main

# Step 2: grab per-branch Vercel preview URL from dashboard
#   NOTE: NOT the production alias `braeden-site.vercel.app` — that serves stale cache
#         per Pitfall 7 in 04-RESEARCH.md. Use the per-deploy URL of the form
#         `braeden-site-<hash>-<scope>.vercel.app` from Vercel Dashboard → Deployments → most recent.

# Step 3a (targeted Phase 4 verification):
BASE_URL=https://<preview-hash>.vercel.app npx playwright test tests/work-*.spec.ts

# Step 3b (regression check including the 7 pre-existing /-route failures —
#          verify they remain at 7 and don't grow):
BASE_URL=https://<preview-hash>.vercel.app npm run test:full

# Step 4: walk 28-item UI-SPEC § Phase Exit Visual Verification checklist
#         (lines ~559-600 of 04-UI-SPEC.md) on the preview URL in a real browser
```

**`playwright.config.ts` BASE_URL handling:** if the config does not currently honor `process.env.BASE_URL`, amend it inline to `process.env.BASE_URL ?? 'http://localhost:3000'` on the `use.baseURL` field as a documented one-line dev-loop change before the test run.

### 2. WebAIM contrast verification deferred — manual user task

```
1. Open `/work` on Vercel preview URL in a real browser (Chrome / Safari / Firefox)
2. Locate archived braehods card (last card; row 4 left column on desktop)
3. Use DevTools color-picker to read:
   - rendered dot color hex (the inline-style #707070 with grain compositing)
   - rendered background color hex underneath the dot (gradient + grain compositing)
4. Enter both hex values into https://webaim.org/resources/contrastchecker/
5. Read the contrast ratio.
```

**If ratio ≥ 3.0:1 (WCAG AA UI-element minimum):** PASS. No source change. Record measurement in any future Phase 6 SUMMARY.

**If ratio < 3.0:1:** apply documented `#7a7a7a` fallback as a single atomic commit:
- 1-line edit: `components/work/ProjectCard.tsx:37` — `STATUS_DOT_COLOR['archived']` `'#707070'` → `'#7a7a7a'`
- 1-line edit: `tests/work-status-badges.spec.ts` — `ARCHIVED_RGB` regex `/rgba?\(\s*112\s*,\s*112\s*,\s*112/` → `/rgba?\(\s*122\s*,\s*122\s*,\s*122/`
- Re-run `npx playwright test tests/work-status-badges.spec.ts` to confirm GREEN
- Single atomic commit: `fix(phase-4/w3): bump archived dot to #7a7a7a per WebAIM contrast verification`
- Push to trigger re-deploy.

### 3. 3 placeholder GitHub repo URLs need real-link verification

The 3 hrefs that originally shipped with `// TODO(user)` markers (cleared via `c69d255` per user opt-in):
- `https://github.com/bwaeden/prediction-market-bot`
- `https://github.com/bwaeden/no-more-short-form`
- `https://github.com/bwaeden/mc-packet-client`

User opt-in approved at Wave 3a; if any repo is private/non-existent, the card links to a GitHub 404. Phase 6 should walk these manually post-deploy (e.g., during the 28-item visual checklist click-through pass) and either (a) make the repos public, (b) supply alternate canonical hrefs (live demo, Streamlit Cloud, YT playlist, etc.), or (c) drop the entries entirely if the projects are not externally surfaceable.

### 4. `STATUS_DOT_COLOR` literal promotion to `@theme`

Currently 2 inline literals (`#c8a86a`, `#707070`) live in `components/work/ProjectCard.tsx` only. If a future phase adds status badges beyond ProjectCard (e.g., contact-modal status indicator, project case-study sub-pages, etc.), revisit promotion to `globals.css` `@theme` block. v1 ships them as inline-style scoped to the badge dot only per D-09 token discipline.

### 5. archived braehods `href` post-Phase-6 DNS-swap target

Currently `https://braehods.com` (the live OLD GitHub Pages site at the production-alias domain). Phase 6's DNS cutover swaps `braehods.com` to point at the new Vercel deployment, at which point the archived card link will point at the new live site (recursive — pointing at itself), not the original v0 GitHub Pages site.

Phase 6 must update this href to one of:
- A Wayback Machine snapshot of the original GitHub Pages site
- A `/archive` sub-route hosting a static snapshot of the old site
- The archived GitHub repo URL (if the old `~/Projects/braehods` repo is preserved per LNCH-02)

### 6. Phase 6 Lighthouse + LCP audit owns the 7 pre-existing `/`-route spec failures

The 7 pre-existing failures in `npm run test:full` (CONFIRMED unchanged by Phase 4 via stash-and-rerun against the commit before Task 4):
- `tests/no-bare-outline-none.spec.ts` (×2 chromium-mobile + chromium-desktop)
- `tests/photo-lcp.spec.ts` (×4 — HOME-04/PERF-06 LCP < 2500ms + PERF-04 hero img dimensions, both browser projects)
- `tests/lighthouse.spec.ts` (×1 — chromium-desktop CLS + font-loading)

These are pre-existing per prior STATE.md "PERF-06 LCP RED on local dev/start deferred to Plan 07 Vercel preview" and inherit Phase 1 + 2 + 6 ownership. Phase 4 confirmed via stash-and-rerun that none of them were caused by Phase 4 changes; the count remained at 7 both pre-Task-4 and post-Task-4.

## User Setup Required

**None.** Phase 4 is fully static / Server-Component / zero-secret. No environment variables, no external services, no manual configuration required for the implementation level.

The deploy-verify cycle (`git push` + Vercel preview verify + WebAIM contrast measurement + 28-item visual checklist) is a manual user-driven Phase 6 task, not a Phase 4 user-setup requirement. See `## Phase 6 Carry-Forwards` for the recipe.

## Known Stubs

**None blocking Phase 4 completion.** All 7 cards render real data (titles, descriptions, tags, statuses, hrefs). The 3 placeholder `github.com/bwaeden/<slug>` hrefs (prediction-market-bot, no-more-short-form, mc-packet-client) carry the documented risk of GitHub 404 if those repos are not public — but the user explicitly opted in to that risk via the "approve placeholders" Wave-3a override, and Phase 6 owns post-deploy 404 verification per `## Phase 6 Carry-Forwards` item 3.

The archived braehods `https://braehods.com` href is intentional per D-16 — links to the OLD live GitHub Pages site UNTIL Phase 6 DNS swap, at which point Phase 6 updates the href per `## Phase 6 Carry-Forwards` item 5.

## Self-Check

- `data/projects.ts`: FOUND (populated, 7 entries, schema verbatim, 0 TODO(user) markers)
- `components/work/ProjectCard.tsx`: FOUND (Server Component, locked STATUS_DOT_COLOR, locked JSX tree)
- `app/work/page.tsx`: FOUND (rewrite shipped, all 5 data-test selectors present, metadata preserved)
- `tests/work-grid-renders.spec.ts`: FOUND (3 tests; scoped exact-match selector per Deviation #2)
- `tests/work-status-badges.spec.ts`: FOUND (4 RGB regex constants; 2 tests)
- `tests/work-no-flagship.spec.ts`: FOUND (clientWidth + clientHeight parity tests)
- `tests/work-descriptions-cliche-scrub.spec.ts`: FOUND (cliché-ban regex + no-`!` test)
- `.planning/phases/04-work-projects/04-01-SUMMARY.md`: FOUND (this file)
- `.planning/REQUIREMENTS.md`: WORK-01..06 + A11Y-05 traceability flipped Pending → Complete; section checkboxes flipped (verified after this commit)
- `.planning/ROADMAP.md`: Phase 4 row checked, Plans count "1 plan" → "2 plans", both 04-01 + 04-02 plan lines flipped to [x], completion date 2026-05-14, Progress Table 0/2 → 2/2 (verified after this commit)
- `.planning/STATE.md`: progress.completed_phases 3 → 4; progress.completed_plans 9 → 11; Spec scoreboard +4 (verified after this commit)
- Commit `9306790` (Task 1): FOUND in `git log --oneline`
- Commit `f1fb996` (Task 2): FOUND in `git log --oneline`
- Commit `9ff0909` (Task 3): FOUND in `git log --oneline`
- Commit `95d1d7d` (Task 4): FOUND in `git log --oneline`
- Commit `c69d255` (Task 5 partial): FOUND in `git log --oneline`
- `npm run typecheck`: PASS (per Task 4 verify gate)
- `npm run lint`: PASS (per Task 4 verify gate; 2 pre-existing warnings unrelated to Phase 4)
- `npm run build`: PASS (per Task 4 verify gate; /work prerendered as static `○`)
- Targeted Phase 4 spec set: 24 pass / 0 fail / 0 skip (per Task 4 verify gate)
- `npm run test:full`: 83 pass / 7 fail / 2 skip — 7 failures are PRE-EXISTING `/`-route specs (per Task 4 verify gate; confirmed via stash-and-rerun)

## Self-Check: PASSED

## Next Phase Readiness

**Phase 4 is complete at the implementation level.** All 7 requirement IDs (WORK-01..06 + A11Y-05) are flipped to Complete in the traceability table, with the explicit qualifier `Complete (local; deploy verify deferred to Phase 6)`. The route is fully shipped, spec-gated locally, and ready for the Phase 6 deploy-verify-WebAIM cycle.

**Ready for Phase 5 (Contact Modal):** Phase 4 introduces zero new patterns Phase 5 must inherit beyond what's already documented in Phase 2 + 3. The cross-route consumer pattern (Server-Component-only Pages reusing component primitives) is established; Phase 5's contact modal will be the first client-island carve-out per FOUND-07 — a different concern from Phase 4's pure-static grid.

**Pending for Phase 6 (Polish + SEO + Launch):**
- Manual deploy + Playwright-against-preview cycle per `## Phase 6 Carry-Forwards` item 1
- WebAIM contrast verification on archived dot per `## Phase 6 Carry-Forwards` item 2; ship `#7a7a7a` fallback if needed
- 3 placeholder GitHub repo URL real-link walk-through per item 3
- archived braehods href post-DNS-swap target decision per item 5
- Phase 6 Lighthouse audit owns the 7 pre-existing `/`-route spec failures per item 6
- 28-item UI-SPEC § Phase Exit Visual Verification checklist (lines ~559-600 of 04-UI-SPEC.md) on deployed preview
- `STATUS_DOT_COLOR` literal promotion to `@theme` revisit if status badges propagate beyond ProjectCard (item 4)
- CLAUDE.md `chore(docs)` row update for lucide-react brand icons (still outstanding from Phase 2 SUMMARY; Phase 4 did not consume any lucide brand icon so didn't surface again)

---
*Phase: 04-work-projects*
*Completed: 2026-05-14*
