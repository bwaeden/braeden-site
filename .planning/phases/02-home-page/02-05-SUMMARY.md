---
phase: 02-home-page
plan: 05
subsystem: routing
tags: [stub-routes, app-router, server-components, D-18, HOME-05]
requires:
  - app/layout.tsx (Phase 1 — Nav + Footer + metadata template chrome)
provides:
  - app/about/page.tsx (Server Component stub for /about — Phase 3 replaces body)
  - app/work/page.tsx (Server Component stub for /work — Phase 4 replaces body)
affects:
  - HOME-05 (Nav links + CTAArrowLink hrefs no longer 404)
  - tests/ctas-resolve-200.spec.ts (RED → GREEN)
tech-stack:
  added: []
  patterns:
    - "App Router file-based routing — adding app/<route>/page.tsx creates the route automatically"
    - "Metadata template inheritance — root layout's `template: '%s · Braeden Hodson'` composes per-page `title: 'About'` into `About · Braeden Hodson` browser-tab title"
    - "Server Component default — zero 'use client' (FOUND-07 / D-25)"
key-files:
  created:
    - app/about/page.tsx
    - app/work/page.tsx
  modified: []
decisions:
  - "D-18 implemented as written: each stub is 5 visible lines of body + a 6-line context comment; ≤15 lines per file"
  - "Used inline-style `style={{ color: 'var(--color-muted)' }}` (matches Phase 1 Hero/Currently convention) instead of utility class `text-[var(--color-muted)]` — both work; chose the inline-style form because Phase 1 set the precedent (visible in app/page.tsx-adjacent components)"
metrics:
  duration: "~6 minutes (single commit, two near-identical files)"
  completed: "2026-05-11"
  tasks: 2
  files_created: 2
  files_modified: 0
  commits: 1
---

# Phase 2 Plan 05: Stub Routes /about + /work — Summary

**One-liner:** Two 18-line Server Component stubs ship `/about` and `/work` as HTTP 200 routes, closing the 404 gap for Nav (Plan 04) and CTAArrowLink (Plan 06) without touching any chrome.

## What shipped

Two files, identical structure modulo metadata title + function name + leading comment:

```tsx
// app/about/page.tsx
export const metadata = { title: 'About' };
export default function AboutPage() {
  return (
    <section className="py-24">
      <p className="font-sans text-base" style={{ color: 'var(--color-muted)' }}>
        Coming soon.
      </p>
    </section>
  );
}
```

`app/work/page.tsx` is the same with `title: 'Work'` and `WorkPage`.

Both files: 18 lines each (5 body + 6 leading comment + 7 blank/sig).

## Verification (all from a live `npm start` + curl/playwright pass)

| Check | Result |
|-------|--------|
| `npm run typecheck` | exit 0 — clean |
| `npm run lint` | exit 0 — clean |
| `npm run build` | success — `/about` and `/work` both prerendered as static (`○`) in Next 16 Turbopack output |
| `curl /about` | HTTP 200 |
| `curl /work` | HTTP 200 |
| `<title>` on /about | `About · Braeden Hodson` (template composition confirmed) |
| `<title>` on /work | `Work · Braeden Hodson` |
| `tests/ctas-resolve-200.spec.ts` | **2 passed** — both routes return 200 (RED → GREEN) |
| `tests/no-client-components.spec.ts` | **1 passed** — no `'use client'` introduced (Phase 1 spec still GREEN) |
| `tests/folder-structure.spec.ts` | **1 passed** — no regression |
| `tests/build-output.spec.ts` | **1 passed** — no regression |

## Invariants honored

- Zero `'use client'` in either file (FOUND-07 / D-25 — verified by no-client-components spec).
- No `<h1>` Fraunces wordmark (would compete with hero on `/`).
- No view-transition-name on either stub (Phase 3 wires `hero-photo` on the real /about photo).
- No `data-test="hero-section"` (stubs are not heroes).
- No Nav/Footer inline rendering — chrome wraps automatically from `app/layout.tsx`.
- `py-24` integer Tailwind utility (no fractional utilities).
- Copy is literally `Coming soon.` (title case, period, no exclamation — matches UI-SPEC voice guardrails).
- `text-base` = 16px Geist Sans body via inherited body font + `font-sans` class.

## Commits

| Hash | Message |
|------|---------|
| `9f7d16d` | `feat(phase-2/w2): app/about + app/work stub pages (D-18 — Coming soon. — Server Components inheriting layout chrome)` |

One atomic commit; the two files are paired by design.

## Deviations from Plan

None — plan executed exactly as written. The plan supplied the exact body string for each file and the executor wrote it verbatim. No auto-fixes, no architectural surprises, no auth gates.

## Scope-amendment impact

Plan 05 has no YouTube references in scope (stubs render only "Coming soon."), so the Phase 2 SCOPE-AMENDMENT.md is informational here. Channels/socials work belongs to Plans 02-03 (channel button) and 02-04 (footer) — already shipped per recent commits and conformant to the amendment.

## Forward-compat notes for Phase 3 / Phase 4

- **Phase 3 (real /about):** Replace the body of `app/about/page.tsx` with the real bio + photo. The photo must get `style={{ viewTransitionName: 'hero-photo' }}` matching the home-page's HeroPhoto so the Plan 02 motion seam fires. The `metadata = { title: 'About' }` export can be expanded with `description` + OpenGraph fields; the existing line stays valid.
- **Phase 4 (real /work):** Replace the body of `app/work/page.tsx` with the equal-weight project grid sourced from `data/projects.ts`. Same metadata pattern.
- Neither phase needs to touch `app/layout.tsx` (chrome remains shared) or this SUMMARY (file paths and metadata exports are stable public APIs of the App Router page).

## Self-Check: PASSED

- `app/about/page.tsx` — FOUND
- `app/work/page.tsx` — FOUND
- Commit `9f7d16d` — FOUND in `git log --all`
- Both routes prerendered in Next build output — verified
- Tab titles render via metadata template — verified via curl
- Phase 1 spec regressions — none (no-client-components, folder-structure, build-output all GREEN)
