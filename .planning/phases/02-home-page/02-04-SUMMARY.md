---
phase: 02-home-page
plan: 04
subsystem: layout chrome extension (W2 — Footer social row + Nav route rewire)
tags: [phase-2, wave-2, server-components, footer, navigation, social-icons, lucide-workaround, tailwind-v4]
status: complete
requirements_completed: [HOME-05, HOME-06]
dependency_graph:
  requires:
    - data/site.ts (Plan 02-01 — socials.github + socials.instagram populated; youtube key omitted per 02-SCOPE-AMENDMENT.md)
    - components/ui/MonogramMark.tsx (Phase 1 W3-T1 — currentColor inheritance pattern reused)
    - components/home/ChannelButton.tsx (Plan 02-03 — InstagramIcon source, hoisted out into shared module by this plan)
    - app/globals.css (Phase 1 W2 — *:focus-visible rule + --color-accent token)
  provides:
    - "SocialIconLink: Server Component exporting SocialIconLink({ href, label, Icon }): JSX.Element — icon-only external link primitive inheriting --color-muted from parent footer (D-15..D-16, HOME-06)"
    - "Footer extension: 2 SocialIconLink instances (GitHub + Instagram per 02-SCOPE-AMENDMENT.md) + 'View source →' link to socials.github (D-17)"
    - "Nav LINKS rewire: /about + /work hrefs (HOME-05, D-18) — mobile hamburger preserved verbatim from Phase 1 a975967"
    - "components/icons/{GithubIcon, InstagramIcon}: shared inline-SVG modules (lucide-react brand-icons workaround, established in 02-03-SUMMARY)"
  affects:
    - Plan 02-05 (stub routes — /about and /work must return 200 to satisfy tests/ctas-resolve-200.spec.ts; Nav now points at them)
    - Plan 02-06 (Hero composition — no direct dependency, but the Footer + Nav chrome wraps the home route)
    - Plan 02-07 (Wave 4 verification — Phase 1's 13 chrome specs continue GREEN; 3 new GREEN assertions added by this plan)
    - Future: any plan adding more social platforms can reuse SocialIconLink with components/icons/ source
tech-stack:
  added: []  # no new deps
  patterns:
    - "Inline-SVG brand-icon modules at components/icons/* (Github, Instagram — both inheriting currentColor; lucide@1.14.0 brand-icons workaround)"
    - "Component-prop icon injection — SocialIconLink accepts Icon: ComponentType<SVGProps & { size?, strokeWidth? }> so the same component works for any inline-SVG icon module OR a future lucide-restored brand icon (drop-in compatible signature)"
    - "Phase 1 inline-style currentColor cascade hoisted up — parent <footer> div sets color: var(--color-muted) once; all descendants (monogram, copyright, social icons, source link, domain text) inherit via the cascade. Replaces Phase 1's per-child repeat-style. Visual result identical."
    - "transition-[color] arbitrary single-property utility instead of transition-colors — Tailwind v4's transition-colors includes outline-color, which interpolates the *:focus-visible accent ring from currentcolor (muted) toward accent over 200ms. transition-[color] keeps outline-color unanimated so the focus ring renders accent immediately."
    - "Defensive site.socials.* conditional rendering preserved (Plan 01 always populates GH + IG in v1, but {site.socials.github && (...)} guard means a future user removing a key won't crash the render). YouTube conditional OMITTED ENTIRELY per scope amendment — no dead code in source."
key-files:
  created:
    - components/layout/SocialIconLink.tsx (38 lines — Server Component primitive)
    - components/icons/GithubIcon.tsx (43 lines — inline-SVG Octocat path, currentColor)
    - components/icons/InstagramIcon.tsx (46 lines — hoisted from ChannelButton.tsx)
  modified:
    - components/layout/Footer.tsx (Phase 1 chrome preserved; +52 net lines for social row + View source + extension comment block; gap-3 → gap-4)
    - components/layout/Nav.tsx (3 href rewires + 2 leading-comment lines — exactly 5/5 diff)
    - components/home/ChannelButton.tsx (InstagramIcon hoisted out; now imports from components/icons/InstagramIcon — net -19 lines)
decisions:
  - "Extracted InstagramIcon to components/icons/InstagramIcon.tsx (and created GithubIcon there) rather than co-locating per file. Reasoning: Plan 03 SUMMARY explicitly flagged that Plan 04 (this plan) would need its own copy of the IG icon; pre-emptively introducing components/icons/ keeps a single source-of-truth (footer + ChannelButton render the exact same glyph) and gives any future social platform a known home. Counter-reasoning: this is one additional commit (refactor) and one new directory; deemed worth it for the duplication-prevention + reuse symmetry. Committed as an atomic refactor (3a093a3) before any Plan 04 task touched ChannelButton's call site."
  - "Hoisted color: var(--color-muted) from Phase 1's two per-child inline-styles up to the container <div> (UI-SPEC line 446 suggested it; Plan 04 picked yes). All five descendants (monogram, copyright span, 2× SocialIconLink, View source <a>, braehods.com span) inherit it via the cascade. Removed the redundant per-child style on the monogram-group and the braehods.com span. Visual result is identical (verified — color is cascaded down via currentcolor anyway)."
  - "Source link 'View source →' shares site.socials.github (D-17 — reused per Plan 01's chosen approach, no new socials.repo field). The same URL is therefore the destination of both the GitHub SocialIconLink and the source-link CTA; intentional duplication, semantically distinct (icon-only profile link vs prose-style 'go look at the code' link)."
  - "Rule 1 deviation (caught at verification, not in original plan): Tailwind v4's transition-colors shorthand includes outline-color in its transitioned-property list. Combined with the parent footer's inherited muted color cascading to outline-color via currentcolor default, this caused tests/focus-ring.spec.ts to regress from GREEN to RED — the *:focus-visible 2px accent ring became a 200ms transition from muted (#a8a8a8) to accent (#7c87ff), and getComputedStyle reported the in-flight muted value on the first frame after Tab. Fixed by narrowing both new <a> elements to transition-[color] (arbitrary single-property). No other plan code uses transition-colors against an inherited muted color cascade — Plan 03's ChannelButton uses transition-[border-color,color,transform] (already narrow) and ChannelButtonRow + CTAArrowLink don't transition colors at the link level. Defensive: documented inline in both files."
metrics:
  duration_minutes: 22
  completed: "2026-05-11T22:25:00Z"
  tasks_completed: 3
  commits: 6
---

# Phase 2 Plan 04: Layout Chrome Extension (W2) Summary

**Footer extended with GitHub + Instagram social icons (per scope amendment, no YouTube) + 'View source →' link, Nav rewired to /about + /work, plus shared components/icons/ directory introduced to dedupe the lucide-brand-icons workaround across ChannelButton + Footer.**

## Performance

- **Duration:** ~22 min (4 atomic feature commits + 1 refactor + 1 fix)
- **Started:** 2026-05-11T22:03:00Z
- **Completed:** 2026-05-11T22:25:00Z
- **Tasks:** 3 (plus 1 atomic refactor + 1 Rule 1 fix)
- **Files created:** 3 (SocialIconLink, GithubIcon, InstagramIcon)
- **Files modified:** 3 (Footer, Nav, ChannelButton — InstagramIcon import update)

## Accomplishments

- Footer.tsx extended in place — Phase 1 chrome (monogram + © 2026 Braeden Hodson + braehods.com) verbatim-preserved; new social row (GH + IG) + 'View source →' link added; container gap-3 → gap-4 per UI-SPEC line 446.
- Nav.tsx LINKS rewired exactly per spec — `/about` + `/work` + `/` (Contact stub). 5 insertions / 5 deletions total; mobile `<details>`/`<summary>` hamburger from `a975967` preserved verbatim (UI-SPEC item #11 / 320px viewport unaffected).
- SocialIconLink.tsx new — reusable icon-only external link primitive with `Icon: ComponentType<...>` prop, currentColor inheritance, ~34×34 tactile target.
- `components/icons/` directory introduced — shared home for inline-SVG brand-icon modules. InstagramIcon hoisted out of ChannelButton.tsx; GithubIcon created. Both extend the lucide-react brand-icons workaround pattern established in Plan 02-03.
- Rule 1 bug fix applied during verification: narrowed `transition-colors` → `transition-[color]` on the two new `<a>` elements to prevent Tailwind v4's `transition-colors` from interpolating the `*:focus-visible` ring's outline-color (DSGN-06 / A11Y-02 regression caught and resolved before plan completion).

## Task Commits

Each task atomic-committed; the refactor + the fix also got their own commits:

1. **Refactor: hoist InstagramIcon to components/icons/** — `3a093a3` (refactor)
2. **Task 0b: components/icons/GithubIcon** — `2d0da0a` (feat)
3. **Task 1: SocialIconLink** — `431372f` (feat)
4. **Task 2: Footer extension** — `61eb62d` (feat)
5. **Task 3: Nav LINKS rewire** — `ddd7c86` (feat)
6. **Rule 1 fix: narrow Footer/SocialIconLink transition-[color]** — `e3ed657` (fix)

_Plan metadata commit (this SUMMARY + STATE updates) will follow — see "Final commit" below._

## Files Created/Modified

### Created

- **`components/layout/SocialIconLink.tsx`** (38 lines) — Server Component primitive. Renders `<a target="_blank" rel="noopener noreferrer" aria-label={label}>` with `inline-flex items-center justify-center p-2 transition-[color] duration-200 hover:text-[var(--color-text)]`. Icon child is `<Icon size={18} strokeWidth={1.75} aria-hidden />`. No explicit color on the `<a>` — color cascades from the parent footer's `--color-muted` setting.
- **`components/icons/GithubIcon.tsx`** (43 lines) — Inline-SVG Octocat silhouette at 24×24 viewBox, `stroke="currentColor"`, default size=18, strokeWidth=1.75. Mirrors lucide-react's pre-removal Github glyph + matches the project's InstagramIcon shape.
- **`components/icons/InstagramIcon.tsx`** (46 lines) — Hoisted from `components/home/ChannelButton.tsx`. Geometry unchanged: rounded-square `<rect rx=5>` frame + inner circle (`<path>` lens) + upper-right `<line>` light dot. ChannelButton.tsx now imports it instead of defining it inline.

### Modified

- **`components/layout/Footer.tsx`** — Phase 1 chrome preserved verbatim (MonogramMark + '© 2026 Braeden Hodson' span + 'braehods.com' span). Adds: imports for SocialIconLink + GithubIcon + InstagramIcon + `site`, social-row `<div>` with 2 SocialIconLink instances (GH + IG, defensive conditionals on `site.socials.github` + `site.socials.instagram`), right-group `<div>` with 'View source →' link (reuses `site.socials.github` per D-17) + the preserved domain text. Container className: `gap-3` → `gap-4`. Color: hoisted from per-child inline-styles to the container (single source of cascade). YouTube conditional OMITTED entirely per `02-SCOPE-AMENDMENT.md`.
- **`components/layout/Nav.tsx`** — LINKS[0].href: `/` → `/about` (HOME-05). LINKS[1].href: `/` → `/work` (HOME-05). LINKS[2] href stays `/` with new `// stub until Phase 5 wires the modal trigger` inline comment. Leading comment updated to reference Plan 02-04-T3. **Everything else verbatim**: `<details>/<summary>` mobile hamburger (a975967), `nav-mobile-toggle` / `nav-icon-menu` / `nav-icon-close` classes, `MonogramMark size={24}`, `linkClass`, `divider-bottom` chrome. Diff stats: 5 insertions / 5 deletions, 1 file changed.
- **`components/home/ChannelButton.tsx`** — Inline InstagramIcon sub-component removed; imports `{ InstagramIcon }` from `@/components/icons/InstagramIcon` instead. Leading comment updated to reference the Plan 04 hoist. No behavior change — same icon, same prop API.

## Decisions Made

See `key-decisions` in frontmatter. In short:
1. Extract InstagramIcon to a shared `components/icons/` directory (vs co-locate per file) — done as an atomic refactor commit BEFORE Task 1.
2. Hoist `color: var(--color-muted)` from per-child inline-styles up to the container — single source of cascade, removes redundant per-child styles on monogram-group and domain-span.
3. 'View source →' link reuses `site.socials.github` URL per D-17 (no new `socials.repo` field, Plan 01's choice).
4. The Rule 1 fix (`transition-[color]` arbitrary instead of `transition-colors`) was applied as a separate fix commit to keep the deviation atomic and reviewable.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Tailwind v4 `transition-colors` includes `outline-color`, regressing tests/focus-ring.spec.ts**

- **Found during:** Verification step after Tasks 1-3 committed (`npx playwright test tests/focus-ring.spec.ts` returned 2 failures on both chromium-mobile and chromium-desktop projects).
- **Issue:** The plan body specified `transition-colors duration-200` on both the SocialIconLink `<a>` and the Footer's 'View source' `<a>`. Tailwind v4 (verified in the served `_next/static/chunks/*.css` bundle) defines `.transition-colors` as `transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-{from,via,to}`. **`outline-color` is in that list** (it wasn't in Tailwind v3). Because the parent `<footer>` sets `color: var(--color-muted)` and `outline-color` inherits `currentcolor` by default, the rest-state outline-color on these `<a>` elements resolves to muted. When `*:focus-visible` fires (`outline: 2px solid var(--color-accent)`), the 200ms transition makes `getComputedStyle(el).outline` report the in-flight muted-tinted value on the first frame after Tab. The focus-ring spec (DSGN-06 / A11Y-02) saw `rgb(168, 168, 168) solid 2px` instead of the expected `rgb(124, 135, 255) solid 2px` and failed.
- **Fix:** Replace `transition-colors` with `transition-[color]` (Tailwind arbitrary single-property) on both new `<a>` elements. `transition-[color]` only animates the `color` property; `outline-color` stays unanimated so the `:focus-visible` ring renders the accent token immediately. Inline source-comments added to both files explaining the rationale for the next reader.
- **Files modified:** `components/layout/SocialIconLink.tsx`, `components/layout/Footer.tsx`.
- **Verification:** All 10 targeted specs (3 footer-socials assertions × 2 projects + 2 no-client-components + 2 focus-ring) GREEN. Then the full Phase 1 chrome suite (visual, monogram, reduced-motion, tokens, contrast, no-bare-outline-none, folder-structure, build-output, favicon, motion-seam, format) — 34/34 GREEN, no regression.
- **Committed in:** `e3ed657` (separate fix commit, atomic).

---

**Total deviations:** 1 auto-fixed (1 bug, caught at verification).
**Impact on plan:** Fix essential — without it Phase 1's DSGN-06 / A11Y-02 contract regresses. The narrower `transition-[color]` utility is semantically identical to what the plan body intended (animate just the text color on hover). No scope creep; no architectural change. The full Phase 1 chrome spec suite (13 specs) remains GREEN.

### Out-of-scope discoveries (logged, NOT fixed in this plan)

- **CLAUDE.md "Supporting Libraries" lucide-react row is factually wrong about brand-icon availability.** The row currently claims Lucide supports `mail, github, instagram, youtube, arrow-out-link, x-close`. Per Plan 03 SUMMARY's deviation record + this plan's continued reliance on inline-SVG icons via `components/icons/*`, `lucide-react@1.14.0` does NOT export `Github`, `Instagram`, or `Youtube` (brand glyphs dropped from Lucide ~2024 over trademark concerns). The "Alternatives Considered" row claiming "Lucide has all three" for YouTube/Instagram/GitHub specifically is also wrong. Recommend a one-line `chore(docs)` amendment to CLAUDE.md in Plan 02-07 (Wave 4 doc-sweep) or as a standalone docs commit — out of scope for this plan.

## Docs to amend in Plan 07

- **CLAUDE.md "Supporting Libraries" lucide-react row** — claim "Lucide has all three [YouTube/Instagram/GitHub]" is factually wrong as of 2026-05-11. Brand icons removed from lucide-react in 2024. The project's de facto pattern is inline-SVG modules at `components/icons/*` (introduced in Plan 02-04, established in Plan 02-03). The CLAUDE.md row should mention this divergence + point at `components/icons/` as the local convention.

## Authentication gates

None.

## Spec scoreboard

Net Phase 2 spec movement from Plan 04:

| Spec | Before Plan 04 | After Plan 04 | Notes |
|------|----------------|---------------|-------|
| `tests/footer-socials-render.spec.ts` | RED (3 assertions) | **GREEN (3 assertions × 2 projects)** | First plan-graduated specs in Phase 2. Footer renders globally so `/` works. |
| `tests/focus-ring.spec.ts` | GREEN | GREEN (after Rule 1 fix — see deviation) | Briefly regressed during Task 2 commit, fixed in `e3ed657`. |
| `tests/no-client-components.spec.ts` | GREEN | GREEN | Three new Server Components in this plan (SocialIconLink, GithubIcon, InstagramIcon hoist). Zero `'use client'`. |
| `tests/monogram.spec.ts` | GREEN | GREEN | Phase 1 footer monogram preserved verbatim. |
| `tests/visual.spec.ts` | GREEN | GREEN | No change to body gradient / grain. |
| `tests/reduced-motion.spec.ts` | GREEN | GREEN | No new animations introduced. |
| `tests/tokens.spec.ts` | GREEN | GREEN | No new tokens. |
| `tests/contrast.spec.ts` | GREEN | GREEN | All new copy inherits existing muted-vs-text contrast. |
| `tests/no-bare-outline-none.spec.ts` | GREEN | GREEN | No new outline-none rules. |
| `tests/folder-structure.spec.ts` | GREEN | GREEN | New `components/icons/` dir is allowed (no rule forbids it). |
| `tests/build-output.spec.ts` | GREEN | GREEN | Built CSS unchanged. |
| `tests/favicon.spec.ts` | GREEN | GREEN | No icon changes. |
| `tests/motion-seam.spec.ts` | GREEN | GREEN | `lib/motion.ts` untouched. |
| `tests/format.spec.ts` | GREEN | GREEN | `lib/format.ts` untouched. |
| Plan 06-gated specs (hero-renders, channels-render, currently-renders, mobile-hero-stacks-cleanly, photo-lcp, view-transition-name-present) | RED | RED | Mount-gated by Plan 06 — out of Plan 04's scope. Identical to Plan 03 SUMMARY's documented state. |
| Plan 05-gated specs (ctas-resolve-200) | RED | RED | Route-gated by Plan 05 — out of Plan 04's scope. Nav now points at `/about` and `/work` but Plan 05 ships the stub pages. |

**Net:** +3 newly-GREEN assertions (footer-socials-render: footer external links, View source link, ≥3 svgs); 0 regressions.

## Verification

```bash
$ npm run typecheck    # exit 0
$ npm run lint         # exit 0
$ npm run build        # exit 0 (Turbopack, 1.97s compile, 5 static pages)
$ npx playwright test \
    tests/footer-socials-render.spec.ts \
    tests/no-client-components.spec.ts \
    tests/focus-ring.spec.ts
  # 10 passed (3.9s)
$ npx playwright test \
    tests/visual.spec.ts tests/monogram.spec.ts \
    tests/reduced-motion.spec.ts tests/tokens.spec.ts \
    tests/contrast.spec.ts tests/no-bare-outline-none.spec.ts \
    tests/folder-structure.spec.ts tests/build-output.spec.ts \
    tests/favicon.spec.ts tests/motion-seam.spec.ts \
    tests/format.spec.ts
  # 34 passed (6.8s)
$ npx playwright test
  # 47 passed, 19 failed (all Plan 05/06-gated as documented), 2 skipped
```

### Invariant grep (all 3 newly-created files + 2 modified)

- **Zero `'use client'`** in any modified or new file (line-based grep — comments containing the string don't count) — VERIFIED.
- **`target="_blank" rel="noopener noreferrer"`** on every external `<a>` — SocialIconLink (1), Footer 'View source' (1) — VERIFIED.
- **No fractional spacing utilities** — `gap-4` (16px), `p-2` (8px) — both integer multiples of 4. No `*-1.5` or `*-2.5` anywhere — VERIFIED.
- **2-weight font inventory** — `font-sans` only (Geist Sans 400). No `font-medium`, `font-bold`, `font-semibold` in any modified/new file — VERIFIED.
- **Lucide brand-icon imports** — ABSENT from Footer.tsx (the plan body's `import { Github, Instagram } from 'lucide-react'` instruction is documented-not-followed; the workaround uses `components/icons/{Github,Instagram}Icon` instead). `Youtube` symbol does NOT appear anywhere in Footer.tsx source — VERIFIED.
- **Container gap-4** on Footer container — VERIFIED.
- **Phase 1 chrome preserved** — `MonogramMark`, `© 2026 Braeden Hodson`, `braehods.com` all still in Footer.tsx source. `<details>`, `<summary>`, `nav-mobile-toggle`, `nav-icon-menu`, `nav-icon-close`, `MonogramMark size={24}`, `aria-label="Toggle menu"` all still in Nav.tsx source — VERIFIED.

### Lucide-react bundle impact (D-16 forward-look — informational)

The plan body anticipated 3 lucide icons entering the bundle (Github, Instagram, Youtube). Actual bundle inclusion from `lucide-react`: **zero brand icons** (the workaround uses inline SVG). Marginal bundle cost of the inline-SVG icons: ~280 bytes each × 2 (GH + IG) = ~560 bytes total (uncompressed). This is strictly smaller than the lucide tree-shake would have been (per Plan 03 SUMMARY's T-02-14 note). PERF-03 bundle budget unaffected.

### Phase 1 specs sanity-check

All 13 Phase 1 chrome-touching specs GREEN: visual (2 assertions), monogram (2), reduced-motion (1), tokens (1), contrast (1), no-bare-outline-none (1), folder-structure (1), build-output (1), favicon (1), motion-seam (2). No regression.

## Threat Flags

None. The threat-model in the plan covered the external-link surface (T-02-16 tabnabbing prevention, T-02-17 publicly readable aria-labels, T-02-18 in-site nav rewire, T-02-19 lucide bundle, T-02-20 color cascade hoist). All five mitigations applied as planned:
- T-02-16: `rel="noopener noreferrer"` on every new `<a target="_blank">` — VERIFIED (2 social icons + 1 source link).
- T-02-19: bundle inflation AVOIDED entirely (workaround uses inline SVG, smaller than lucide).
- T-02-20: hoist is a no-op for visual result (verified — Phase 1 specs GREEN).
- T-02-18: hrefs rewired to `/about` + `/work`; Plan 07 deploy gate (ctas-resolve-200.spec.ts) catches Plan 05's commitment via the suite.

The Rule 1 deviation (transition-colors → transition-[color]) is INSIDE the trust boundary of the focus-visible CSS rule; no new external surface added.

## Known Stubs

None. All new components are wired to live data:
- `SocialIconLink` consumed by `Footer.tsx` with real `site.socials.github` + `site.socials.instagram` URLs (Plan 01 populated).
- 'View source' link consumed by `Footer.tsx` with real `site.socials.github`.
- Nav LINKS point at `/about` and `/work` — Plan 02-05 (parallel wave 2) ships the stub pages so these resolve to 200, not 404.

## Issues Encountered

- **Stale `next start` server during verification.** A previous `next start` (PID 33712) was serving an older build when I ran the Playwright suite. Killed the process and started a fresh `npm run start` against the just-built `.next/` output. After the restart all targeted specs ran against the new Footer source. This is workflow ops, not a plan defect.

## Next plan unblocked

- **Plan 02-05 (Wave 2 — Stub routes):** Independent of Plan 04 (parallel in W2). After both land, `/about` and `/work` will return 200 from the Nav LINKS Plan 04 wired. No coordination needed.
- **Plan 02-06 (Wave 2 — Hero composition):** Independent of Plan 04. The chrome is now extended and the Nav route surface is correct; Plan 06 mounts the hero into `/` without touching Footer or Nav.
- **Plan 02-07 (Wave 4 — Deploy + spec verification):** Gates on Plan 04's footer-socials-render specs being GREEN — confirmed. The Phase 1 chrome spec suite continues GREEN (verified 34/34).

---

## Self-Check: PASSED

- `components/layout/SocialIconLink.tsx` — FOUND
- `components/icons/GithubIcon.tsx` — FOUND
- `components/icons/InstagramIcon.tsx` — FOUND
- `components/layout/Footer.tsx` — MODIFIED (extension preserved Phase 1 chrome)
- `components/layout/Nav.tsx` — MODIFIED (5/5 diff, hamburger preserved)
- `components/home/ChannelButton.tsx` — MODIFIED (InstagramIcon hoist)
- Commit `3a093a3` (refactor: hoist InstagramIcon) — FOUND in git log
- Commit `2d0da0a` (feat: GithubIcon) — FOUND in git log
- Commit `431372f` (feat: SocialIconLink) — FOUND in git log
- Commit `61eb62d` (feat: Footer extension) — FOUND in git log
- Commit `ddd7c86` (feat: Nav rewire) — FOUND in git log
- Commit `e3ed657` (fix: transition-[color] Rule 1) — FOUND in git log
- `npm run typecheck` — exit 0
- `npm run lint` — exit 0
- `npm run build` — exit 0 (Turbopack, 5 static pages)
- `tests/footer-socials-render.spec.ts` — 3/3 × 2 projects = 6/6 GREEN
- `tests/no-client-components.spec.ts` — 2/2 GREEN
- `tests/focus-ring.spec.ts` — 2/2 GREEN (after Rule 1 fix)
- Phase 1 chrome suite (13 specs) — 34 total assertions GREEN, no regression

---
*Phase: 02-home-page*
*Plan: 04*
*Completed: 2026-05-11*
