# Project State: Braeden Site (braehods.com)

**Last updated:** 2026-05-07
**Updated by:** roadmapper (initialization)

## Project Reference

**Core value:** Anyone landing on the site walks away thinking "that's a nice
website" first, then "I want to follow up with him." Visual polish #1,
contact-conversion #2.

**Stack:** Next.js 16.2.6 (App Router) + React 19.2 + TypeScript 5.9 +
Tailwind v4 + `@next/mdx` + Fraunces / Geist Sans / Geist Mono + Vercel.

**Current focus:** Roadmap defined. Awaiting `/gsd-plan-phase 1` for Phase 1
(Foundation + Design Tokens).

## Current Position

**Milestone:** v1 (initial launch at braehods.com)
**Phase:** Not started — ready for Phase 1
**Plan:** None
**Status:** Roadmap complete, awaiting plan-phase

**Progress:** Phase 0/6 complete

```
[----------] 0% — Roadmap defined, no phases planned yet
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

### Last Session (2026-05-07 — initialization)

- Read PROJECT.md, REQUIREMENTS.md (67 v1 reqs), research SUMMARY/ARCHITECTURE/STACK/PITFALLS
- Derived 6 phases from natural delivery boundaries (Foundation → Home → About → Work → Contact → Polish+Launch)
- Mapped all 67 v1 requirements to exactly one phase (no orphans, no duplicates)
- Distributed cross-cutting A11Y / PERF / SEO across phases per instructions
- Wrote ROADMAP.md, STATE.md, updated REQUIREMENTS.md traceability table

### Next Session

Run `/gsd-plan-phase 1` to decompose Phase 1 (Foundation + Design Tokens) into
plans. Phase 1 is on the critical path — every later phase depends on the
token system, monogram, font loading, and motion contract.

---
*State initialized: 2026-05-07 by roadmapper*
