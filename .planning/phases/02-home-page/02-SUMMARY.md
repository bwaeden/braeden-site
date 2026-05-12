---
phase: 02-home-page
type: phase-summary
status: complete
completed: 2026-05-12
branch: test/phase-2-home → main
---

# Phase 2 — Home Page — SUMMARY

## What shipped

A complete Home page at `/` with all 6 Phase 2 requirements met (HOME-01..06), wired into Phase 1's design tokens and chrome. The site now answers "who is Braeden?" above the fold and converts to either contact channel (Instagram) or further info (/about, /work stubs).

### Components landed

- `components/home/Hero.tsx` — orchestrates the 4 atoms in CD-05 vertical rhythm, mobile-flips photo above text via `flex-col-reverse`, desktop renders side-by-side via `md:flex-row` (D-01)
- `components/home/HeroPhoto.tsx` — `next/image` with static portrait import, blur placeholder, explicit 320×320 dims (PERF-04), per-element `view-transition-name: hero-photo` seam for future cross-route shared element (D-22)
- `components/home/CurrentlyLine.tsx` — accent dot + statement text + `<time dateTime>` Mono date from `data/currently.ts`
- `components/home/ChannelButton.tsx` — Instagram-only pill button (inline currentColor SVG, scope amendment: YT dropped), `target="_blank" rel="noopener noreferrer"`, "DM me" CTA per IG algo signal
- `components/home/ChannelButtonRow.tsx` — single combined channels block (D-13), maps `channels` with stagger wrappers
- `components/home/CTAArrowLink.tsx` — accent text-link with `→` micro-translate, used for "More about me" + "See the work"
- `components/layout/SocialIconLink.tsx` — icon-only external link inheriting `currentColor` from parent footer
- `components/icons/GithubIcon.tsx` + `components/icons/InstagramIcon.tsx` — inline SVG, currentColor stroke (workaround for lucide-react brand-icon removal in 2024)

### Surface changes

- `components/layout/Footer.tsx` extended in place (preserved Phase 1 monogram + © + braehods.com) with GitHub + Instagram social icons + "View source →" link
- `components/layout/Nav.tsx` LINKS array rewired: About → `/about`, Work → `/work`, Contact → `/` (Phase 5 will wire modal). Mobile hamburger preserved verbatim.
- `app/page.tsx` rewritten from Phase 1 placeholder to one-line `<Hero />`
- `app/about/page.tsx` + `app/work/page.tsx` — minimal "Coming soon." Server Components, inherit chrome from root layout
- `lib/format.ts` — UTC-anchored `formatDate` (avoids hydration drift)
- `next.config.ts` — `images.qualities: [75, 90]` (HeroPhoto quality=90 gate) + `images.formats: ['image/avif', 'image/webp']` (LCP optimization)
- `data/channels.ts` populated with 1 Instagram entry (`@braehods`)
- `data/site.ts.socials` populated with `github: bwaeden, instagram: braehods` (YouTube key absent per scope amendment, optional shape preserved for forward-compat)
- `public/portrait.jpg` — 193KB v1 placeholder (copied from `~/Projects/braehods/images/photo.jpg`)
- 9 new Playwright specs added: hero-renders, currently-renders, channels-render, ctas-resolve-200, view-transition-name-present, mobile-hero-stacks-cleanly, footer-socials-render, photo-lcp, format

### Spec scoreboard (against Vercel branch preview)

- Phase 1 chrome — **13/13 GREEN** (zero regressions)
- Phase 2 stubs from Plan 01 — **8/8 GREEN** (mounted via Hero composition in Plan 06)
- Plan 02 format spec — **GREEN** (4/4 cases × 2 projects)
- `photo-lcp.spec.ts` PERF-04 dims — **GREEN**
- `photo-lcp.spec.ts` PERF-06 LCP — **DEFERRED TO PHASE 6** (2821ms post-AVIF vs <2500ms target on Slow-4G synthetic — see "Carry-forwards" below)
- Final: **21/22 spec files fully GREEN, 1 partial (LCP deferred)**

## Key decisions made during execution

### Scope amendment: YouTube dropped from v1 (2026-05-11)

User directive on day-1 of execution: no YouTube channel exists yet, so v1 ships with Instagram + GitHub only — no YouTube data, no YouTube button, no YouTube footer icon. Authoritative doc at `.planning/phases/02-home-page/02-SCOPE-AMENDMENT.md`. Plan must_haves and REQUIREMENTS.md HOME-03 amended in pre-execution commit `4b2d2b2`. Component shape kept platform-keyed (`Channel.platform: 'youtube' | 'instagram'`, `SiteMeta.socials.youtube?` optional) so re-enabling YT post-v1 is a single-line `data/channels.ts` edit + optional Footer block. 4/4 compliance receipts captured in 02-VERIFICATION.md Step 4.

### Lucide-react brand icons gone (2026-05-12)

Plan 02-03 discovered that `lucide-react@1.14.0` no longer exports `Github`, `Instagram`, or `Youtube` — upstream Lucide stripped brand glyphs in 2024 over trademark concerns. Pivoted to inline `currentColor` stroke SVG sub-components (~280 bytes each) following the existing `components/ui/MonogramMark.tsx` pattern. Hoisted shared `InstagramIcon` from ChannelButton into `components/icons/InstagramIcon.tsx` so Footer reuses the same source. CLAUDE.md "Supporting Libraries" table still references lucide brand icons; Phase 6 docs sweep should amend.

### Tailwind v4 `transition-colors` interpolates `outline-color` (2026-05-12)

Plan 02-04 discovered that Tailwind v4's `transition-colors` shorthand includes `outline-color`. On currentColor-inheriting elements (Footer SocialIconLink, "View source" link), hover state's color change leaked into the focus ring's `outline-color`, causing `tests/focus-ring.spec.ts` to capture an in-flight muted value rather than the authored accent. Fix: narrow to `transition-[color]` (arbitrary single-property) on those two `<a>` elements. Documented inline + in 02-04-SUMMARY.md.

### PERF-06 LCP gate deferred to Phase 6 (2026-05-12)

Initial measurement 2885ms (target <2500ms). AVIF auto-format remediation (next.config.ts `images.formats: ['image/avif', 'image/webp']`) reduced payload by ~70% (193KB JPEG → 57KB AVIF) but only shaved LCP to 2821ms. On Slow-4G synthetic Lighthouse, the bottleneck is RTT + 4x CPU throttling more than image bytes. Performance score is 95/100 overall; LCP is the only failing metric. User decision: defer numeric LCP gate to Phase 6, which owns full perf audit with real-user Speed Insights data (PERF-01/02/05). REQUIREMENTS.md PERF-06 marked `[~]` partial. HOME-04 sub-clause (no-animation on LCP element) PASS automated.

### Visual checklist skipped (2026-05-12)

User stance: trust automation (21/22 specs GREEN + axe 0 serious/critical + scope-amendment 4/4 + Phase 1 chrome zero regressions). 24-item visual checklist in 02-VERIFICATION.md Step 6 left unchecked by deliberate user choice.

## Carry-forwards to later phases

| To | What | Why |
|----|------|-----|
| Phase 3 | Real /about content + `view-transition-name: hero-photo` on the page-1 photo | Hero photo wrapper carries the seam; /about's portrait should match for cross-route shared-element transition |
| Phase 4 | Real /work grid | Plan 05 ships "Coming soon." stubs |
| Phase 5 | Modal trigger for Nav "Contact" link | Nav.tsx LINKS array has `{ href: '/', label: 'Contact' }` placeholder |
| Phase 6 | PERF-06 LCP — final binding gate | Slow-4G synthetic Lighthouse measures 2821ms; real-user Speed Insights post-launch will be the actual measure |
| Phase 6 | Lucide-react row in CLAUDE.md Supporting Libraries — incorrect | Lucide dropped brand icons 2024; `components/icons/*` is the v1 source of truth |
| Phase 6 | `.lighthouse-runner.mjs` + `.axe-scan.mjs` + `tests/photo-lcp.spec.ts` need `--workers=1` pinning | CDP port 9222 contention when Playwright runs both Lighthouse-bound specs in parallel; orchestrator currently relies on `--workers=1` invocation. Permanent fix: assign each Lighthouse spec its own CDP port via Playwright project config |
| Phase 6 | YouTube re-enable (optional, post-v1) | One-line `data/channels.ts` edit (add YT entry) + uncomment Footer YouTube SocialIconLink block (if added at all). Component shape already supports it. |
| Phase 6 | `/about` + `/work` stubs trip `page-has-heading-one` axe rule (moderate, not blocking) | Resolved when Phase 3/4 ship real content |

## Commits (chronological, on `test/phase-2-home`)

1. `4b2d2b2` docs(02): scope amendment — drop YouTube from v1
2. `8812755` feat(phase-2/w0): populate data/channels + data/site.socials + portrait + next.config qualities
3. `ad697ae` test(phase-2/w0): stub 8 RED Playwright specs for HOME-01..06 + PERF-04 + PERF-06
4. `afd203b` docs(phase-2/01): complete wave-0 validation plan — SUMMARY + state + roadmap + requirements
5. `15d9375` feat(phase-2/w1): lib/format.ts (UTC-anchored formatDate) + spec
6. `e51a396` feat(phase-2/w1): CurrentlyLine component (accent dot + Mono date)
7. `9ddfe69` feat(phase-2/w1): HeroPhoto component (LCP-safe + view-transition seam)
8. `eb2460c` docs(phase-2/02): complete W1 display-atoms plan
9. `8dd8163` feat(phase-2/w1): ChannelButton (Instagram-only per scope amendment, DM me CTA, hairline pill)
10. `8f965e2` feat(phase-2/w1): ChannelButtonRow
11. `a0d76d8` feat(phase-2/w1): CTAArrowLink
12. `e721a1f` docs(phase-2/03): complete W1 interactive-atoms plan
13. `3a093a3` refactor(phase-2/w2): hoist InstagramIcon out of ChannelButton into components/icons/
14. `2d0da0a` feat(phase-2/w2): components/icons/GithubIcon
15. `431372f` feat(phase-2/w2): SocialIconLink
16. `61eb62d` feat(phase-2/w2): Footer extended with social row + View source
17. `ddd7c86` feat(phase-2/w2): Nav LINKS rewired to /about + /work
18. `e3ed657` fix(phase-2/w2): narrow Footer/SocialIconLink hover-transition to 'color' (Rule 1 — Tailwind v4 outline-color leak)
19. `4ed6f13` docs(phase-2/04): complete W2 layout-extension plan
20. `9f7d16d` feat(phase-2/w2): app/about + app/work stub pages (D-18)
21. `7da5c64` docs(phase-2/05): complete W2 stub-routes plan
22. `16fe2f2` feat(phase-2/w3): Hero composition
23. `149be22` feat(phase-2/w3): rewrite app/page.tsx to <Hero />
24. `072f45b` fix(phase-2/w3): broaden lighthouse mono regex to accept GeistMono and Geist Mono
25. `47e4fc0` docs(phase-2/06): complete W3 hero-composition plan
26. `189d6e0` docs(phase-2/07): verification report (initial run — pre-AVIF)
27. `8ddcb2f` perf(phase-2/w4): enable AVIF + WebP auto-negotiation for hero LCP
28. + the doc-finalization commit closing out this SUMMARY

**Total**: 28 atomic commits across W0-W4 (~3.5 hours wall-clock orchestration).

## Phase 1 W4 lessons applied

- ✅ Vercel branch preview URL used throughout, NEVER `braeden-site.vercel.app` production alias (Phase 1 cache-staleness lesson)
- ✅ Phase 1 chrome zero-regression — all 13 specs hold against deployed preview
- ✅ Zero `'use client'` regression — FOUND-07 invariant intact across all new files

## What's next

Phase 3 (`/about` page) is the natural follow-on. The view-transition seam is already in place on the home hero photo wrapper; Phase 3 wires the matching `view-transition-name: hero-photo` on the /about photo for the cross-route shared-element transition.
