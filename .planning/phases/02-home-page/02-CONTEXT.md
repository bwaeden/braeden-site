# Phase 2: Home Page - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

A curated `/` route that gives a stranger the "who is this and should I follow up" answer in one viewport: hero with photo + name + one-line positioning + Currently, channel-link block (YouTube + Instagram), and subtle CTAs into `/about` and `/work`. Page must achieve Lighthouse 95+ on its own and ship a view-transition seam on the photo so Phase 3 (`/about`) can wire the shared-element animation without restructuring.

In scope (8 v1 requirements):
- HOME-01..06 — hero composition, Currently block, channel buttons, LCP-safe hero, /about and /work CTAs + view-transition seam, footer with monogram/socials/source/year.
- PERF-04 — `next/image` with explicit width/height; LCP image preloaded.
- PERF-06 — Hero LCP < 2.5s on mid-tier mobile.
- Stub pages: `app/about/page.tsx` and `app/work/page.tsx` (placeholder "Coming soon" bodies wearing Nav/Footer chrome so `/` CTAs don't 404 on Vercel preview).

Out of scope:
- Real `/about` content + photo treatment (Phase 3).
- Real `/work` grid + project cards (Phase 4).
- Contact modal trigger wiring (Phase 5 — Nav and About surface the trigger then).
- OG image generation, sitemap, robots, JSON-LD, dynamic 404 (Phase 6).
- Page-wide Lighthouse audit + DNS swap (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Hero Composition
- **D-01:** Layout = **side-by-side, photo on the right**. Text column (name + positioning + Currently + channels + CTAs) on the left. On mobile, photo reflows above the text column so the face still introduces. Recruiter/investor scan pattern (Western reading order, brittanychiang.com-adjacent).
- **D-02:** Photo treatment = **hairline border + retain color**. 1px solid `var(--color-border)` (#2a2a2f), small inner padding (8-12px), slight corner radius (4-6px). Editorial "tile" framing on charcoal; consistent with Phase 1's muted palette.
- **D-03:** Photo size = **medium tile, 280–320px square on desktop**. Big enough to read the face, small enough that the wordmark + Currently dominate. Defer exact responsive sizing rules to planner — must respect PERF-04 (explicit width/height on `next/image`) and HOME-04 (no animation on LCP element).
- **D-04:** Photo source = **`~/Projects/braehods/images/photo.jpg`** copied into this repo's `public/portrait.jpg` (or `public/images/portrait.jpg`). The v1 placeholder per PROJECT.md. Real shoot is out-of-band (PROJECT.md "Out of Scope (v1)").
- **D-05:** Display name = **"Braeden" only** (single word, Fraunces 700, matches Phase 1's existing hero word). The monogram + Nav surname carry the full identity. No `<h1>` rendering of "Braeden Hodson" in the hero.
- **D-06:** Above-the-fold stacking order (top → bottom): **Name → positioning → Currently → channels → CTAs to /about & /work**. Classic portfolio rhythm — identity → context → momentum → reach → next-step.

### Positioning Copy (HOME-01)
- **D-07:** Ships **verbatim from PROJECT.md draft**:
  > Business student and entrepreneur in LA, building things and running a small content brand.
- **D-08:** Future-iteration tone bias (NOT applied in v1): if the line is rewritten post-launch, lean **aspirational/mission-ish** and **drop the "business student" framing**. Captured for v1.x copy pass, not Phase 2 execution.
- **D-09:** Typographic treatment = Geist Sans, weight TBD by planner (likely 400 or 500), sized below the Fraunces name so it reads as the subhead. Color = `var(--color-text)` (#e8e8e8) — body, not muted, so it lands. One line on desktop; allowed to wrap to two on mobile.

### "Currently" Block (HOME-02)
- **D-10:** Source = `data/currently.ts` (shape already locked in Phase 1: `{ statement: string; updatedAt: string; link?: string }`). Current value: `"Currently shipping CapitolLens"`, `updatedAt: "2026-05-09"`. Editing one field + commit updates the page on next deploy.
- **D-11:** Visual treatment goes to Claude's discretion (see below) — but the line must include the `updatedAt` date in a muted micro-format somewhere (REQUIREMENTS HOME-02 requires "last-updated date"). Color must clear AA on both gradient endpoints (PITFALLS Pitfall 1 — use `var(--color-text)` for the statement, `var(--color-muted)` only for the date).

### Channel-Link Block (HOME-03)
- **D-12:** Two distinct buttons: **YouTube** and **Instagram**. Open in new tab. No on-site embeds (PROJECT.md hard constraint). Per-channel CTA wording differs:
    - YouTube → "Subscribe" affordance
    - Instagram → "DM me" affordance (memory: feedback_reel_cta_dm_format.md — IG's #1 algo signal is DMs; reinforce on the site).
- **D-13:** Single combined "channels" block (NOT two separate Channel-A / Channel-B surfaces). PROJECT.md explicit: "Two-channel content split as separate UI surfaces — single 'channels' block is enough."
- **D-14:** Visual treatment + button shape goes to Claude's discretion (see below). Constraints: distinct from CTA text-links (D-19), accessible (clear focus ring already from Phase 1), platform-recognizable (icon + handle + CTA verb).

### Footer Expansion (HOME-06)
- **D-15:** Phase 1 Footer already has monogram + © year. Phase 2 expands to add: **social links** (GitHub, Instagram, YouTube) + **source-link** (this repo on GitHub). Existing `components/layout/Footer.tsx` is the integration point — extend, do not rewrite.
- **D-16:** Social link icons sourced from `lucide-react` (already in CLAUDE.md stack). Tree-shakeable per-icon imports — `Github`, `Instagram`, `Youtube`. Inherit `currentColor` from `--color-muted` like the monogram.
- **D-17:** Source/repo link = plain text or small "view source" affordance pointing at the GitHub repo URL. Inline with the social icons, not its own band.

### Stub Routes (supports HOME-05)
- **D-18:** Phase 2 ships **placeholder** `app/about/page.tsx` and `app/work/page.tsx`. Each renders Nav + Footer chrome + a single muted "Coming soon" line. Phases 3 and 4 replace the page bodies — no chrome refactor needed at that time. Prevents 404s on Vercel preview during the multi-phase build.

### Hero CTAs to /about and /work (HOME-05)
- **D-19:** **Subtle text-links inline, below the channel block.** Style: accent-colored (`var(--color-accent)` #7c87ff) with `→` glyph, e.g. `More about me →` and `See the work →`. Editorial, restrained — Nav is the load-bearing navigation; in-flow CTAs are a soft second nudge. No pill buttons (would duplicate the channel-block treatment).
- **D-20:** Visual rhythm: small vertical gap between channels (D-12..14) and these CTAs so they read as a related but lower-density group, not as competing buttons.

### View-Transition Seam (HOME-05)
- **D-21:** Resolve ROADMAP/FEATURES conflict in **ROADMAP's favor** — ship the **seam** in Phase 2. Apply `view-transition-name: hero-photo` (CSS) to the home photo. The transition does not fire until Phase 3 wires the matching `view-transition-name` on the `/about` photo. Browser-native, ~5 lines of CSS, **graceful no-op** in Safari/Firefox (and on mobile Safari pre-iOS 18.2). Update FEATURES.md row 64 from "v2" to "v1, photo seam shipped Phase 2; activates Phase 3."
- **D-22:** Do NOT wrap root layout in a project-wide `<ViewTransition>` for cross-route fades in v1. Per-element seam only. Avoids surprise transitions on later phases (Work cards, Contact modal trigger) and keeps the blast radius small.

### Performance (PERF-04, PERF-06, HOME-04)
- **D-23:** Hero photo uses `next/image` with **explicit `width`/`height` props** (matches PERF-04). LCP image: add `priority` prop and rely on Next 16's automatic preload (per CLAUDE.md "Stack Patterns" — `next/image` with `priority` is the standard). Static import from `public/` so blur placeholder works.
- **D-24:** **Hero photo is the LCP element** (per HOME-04). It MUST NOT have an entry animation. The staggered-fade seam from Phase 1 (`lib/motion.ts` keyframe + `respectsReducedMotion` flag, CD-03 from `01-CONTEXT.md`) is applied to **non-LCP elements only**: positioning line, Currently, channel buttons, CTAs. Stagger order = top-down, ~80ms increments. Name (`<h1>`) also skips animation (typography LCP candidate; safest to also skip).
- **D-25:** Channel buttons and CTAs are server-rendered (`<a target="_blank" rel="noopener noreferrer">`). Zero `'use client'` in Phase 2 source code — preserves Phase 1's FOUND-07 invariant. Channel block + CTAs participate in the stagger via CSS class names from `lib/motion.ts`, no React state.

### Claude's Discretion

The user did not select the **Channel-link visual treatment** gray area and skipped page-load motion choreography. Decisions for the planner / executor to make autonomously, anchored to Phase 1 patterns + PITFALLS:

- **CD-01:** Channel button shape = pill/rounded-rectangle with `var(--color-border)` 1px hairline, internal layout = `[platform icon] [handle] [CTA verb]`, e.g. `[YT-icon] @braehods · Subscribe`. Width = content + padding (NOT full-width). Two buttons sit in a horizontal row with `gap-3` on desktop, stack on mobile. Hover: subtle `translateY(-1px)` + accent-color border. Maintains visual parity with Phase 1's editorial-restrained aesthetic.
- **CD-02:** "Currently" line visual treatment = single line in Geist Sans 14-15px, prefix with a small accent dot (4-6px circle in `var(--color-accent)`) to give it a "live" feel, suffix the date in `var(--color-muted)` Geist Mono e.g. `· May 9`. If `data/currently.ts.link` is set, statement becomes a link with underline-offset; else plain text.
- **CD-03:** Hero motion choreography — explicit list of what fades:
  - Name (`<h1>`): **no animation** (typography LCP candidate, safest).
  - Positioning line: fade-in 240ms, delay 80ms.
  - Currently block: fade-in 240ms, delay 160ms.
  - Channel button 1: fade-in 240ms, delay 240ms.
  - Channel button 2: fade-in 240ms, delay 320ms.
  - CTA text-link 1: fade-in 240ms, delay 400ms.
  - CTA text-link 2: fade-in 240ms, delay 480ms.
  - Photo: **no animation** (LCP element, HOME-04).
  - All wrapped by `@media (prefers-reduced-motion: reduce)` override from Phase 1's `globals.css`.
- **CD-04:** Mobile reflow rules: side-by-side hero stacks to single column at `<md` (768px). Photo moves above the text column. Photo size on mobile = ~200-240px to leave room for the wordmark. Channel buttons stay in a row if they fit, stack if not (use `flex-wrap`).
- **CD-05:** Hero spacing rhythm — vertical gaps between stack items follow the existing Tailwind v4 token scale (Phase 1's `app/globals.css` `@theme`). Approximate: name → positioning = 16-20px; positioning → Currently = 24-32px; Currently → channels = 32-40px; channels → CTAs = 24-32px. Planner refines against UI-SPEC.

### Data the User Must Supply (Wave-0 user-input task)

The following `data/` files have empty values that block W1+:
- **`data/channels.ts`** — needs `Channel[]` populated with `{ platform: 'youtube' | 'instagram', handle: string, url: string }` × 2.
- **`data/site.ts.socials`** — needs `{ github?: string, instagram?: string, youtube?: string }` populated with real URLs (used by Footer per HOME-06).

Executor must prompt the user for these values at the start of Wave 0 (or before Wave 1 image+button work begins). Do NOT proceed to W1 with placeholder URLs — Vercel preview must serve real, working external links from day one.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level decisions (locked)
- `.planning/PROJECT.md` — Core Value, Constraints, Key Decisions table. Hero pattern: photo + name + TL;DR + "Currently"; single channels block; no embeds.
- `.planning/REQUIREMENTS.md` §"Home Page (HOME)" + §"Performance (PERF)" — 8 Phase 2 requirements (HOME-01..06, PERF-04, PERF-06). HOME-05 wording locks shared-element-on-photo for v1.
- `.planning/ROADMAP.md` §"Phase 2: Home Page" — phase goal + success criteria (5 items).
- `.planning/STATE.md` — current project state (Phase 1 W4 review pending; 32/32 specs GREEN; mobile-nav hamburger landed in `a975967`).
- `CLAUDE.md` — full stack table, font choices, animation approach, `next/image` config, `lucide-react` for icons, what-NOT-to-use list.

### Phase 1 outputs (this phase builds on them)
- `.planning/phases/01-foundation-design-tokens/01-CONTEXT.md` — locked tokens (6 colors), monogram strategy, motion seam (CD-01..03), Vercel preview workflow.
- `.planning/phases/01-foundation-design-tokens/01-UI-SPEC.md` — Phase 1 UI design contract; Phase 2 inherits Nav/Footer chrome rules.
- `.planning/phases/01-foundation-design-tokens/01-PLAN.md` — wave structure precedent (W0 validation infra → W1 scaffold → W2 tokens → W3 components → W4 deploy); replicate for Phase 2.
- `.planning/phases/01-foundation-design-tokens/01-VALIDATION.md` — spec patterns to mimic (32 spec files, Playwright + axe + Lighthouse).

### Research (synthesized 2026-05-07, HIGH confidence)
- `.planning/research/SUMMARY.md` — executive synthesis, resolved divergences.
- `.planning/research/STACK.md` — `next/image` v16 changes (qualities default, `images.remotePatterns`), `lucide-react` icon imports, no motion library for v1.
- `.planning/research/ARCHITECTURE.md` — folder layout, RSC default, `lib/motion.ts` isolation seam (Phase 2 IS the first consumer of this seam).
- `.planning/research/PITFALLS.md` — **Phase 2 owns:** Pitfall 1 (contrast on charcoal), Pitfall 4 (FOIT on hero — but `next/font` already mitigated in Phase 1), Pitfall 5 (wordmark vs monogram fight — D-05 + Nav monogram split resolves), Pitfall 10 (LCP-blocking hero animations — D-24 explicit).
- `.planning/research/FEATURES.md` — **Note:** row 64 "Shared-element transition" listed as v2, but ROADMAP HOME-05 supersedes — Phase 2 ships the seam (D-21).

### Existing data scaffolds (need values from user before W1)
- `data/currently.ts` — shape locked, has placeholder value.
- `data/channels.ts` — shape locked, **array is empty** (W0 user-input task).
- `data/site.ts` — `socials: {}` **empty** (W0 user-input task).

### External docs (pull as needed during planning)
- Next.js 16 `next/image` — https://nextjs.org/docs/app/api-reference/components/image (verify `priority`, `placeholder="blur"`, static-import blur data, `width`/`height` requirement).
- View Transitions API — https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API (Safari support matrix; `view-transition-name` CSS property).
- React 19.2 `<ViewTransition>` component — https://react.dev/reference/react/ViewTransition (referenced by CLAUDE.md; v1 uses CSS-level seam, not the React wrapper).
- Lucide React — https://lucide.dev/icons (verify `Github`, `Instagram`, `Youtube` icon names and stroke-width consistency with the monogram).
- WebAIM contrast checker (manual verification) — https://webaim.org/resources/contrastchecker/

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`components/ui/MonogramMark.tsx`** — Phase 1 ships with `size` prop + `currentColor` fill. Hero does NOT consume it in the hero block per D-05 (name dominates); Footer already consumes it via Phase 1 D-04.
- **`components/layout/Nav.tsx`** — already has 3 placeholder links pointing at `/`. Phase 2 rewires them to `/about`, `/work`, and the Contact trigger placeholder (Phase 5 wires the modal). Native `<details>`/`<summary>` mobile hamburger from `a975967` stays — Phase 2 must not regress UI-SPEC item #11 (320px viewport).
- **`components/layout/Footer.tsx`** — Phase 1 ships monogram + `© 2026 Braeden Hodson` + `braehods.com` plain text. Phase 2 extends with social icons + source link (D-15..17). Reuses the `divider-top` + muted-color pattern.
- **`lib/motion.ts`** — Phase 1's isolation seam (CD-03 in `01-CONTEXT.md`). Phase 2 is the first real consumer. Exports stagger-fade keyframe class names + `respectsReducedMotion` flag — wire-up should be a one-import addition.
- **`app/fonts.ts`** — Fraunces + Geist Sans + Geist Mono already loaded via `next/font` with `display: 'swap'`, `preload: true`. Hero name and positioning consume these. NO new font loading.
- **`app/globals.css` @theme tokens** — 6 colors locked, gradient + grain shipping. Hero typography sizes can reuse Fraunces clamp pattern from `app/page.tsx` (`text-[clamp(4rem,12vw,6rem)]`).
- **`data/currently.ts`, `data/channels.ts`, `data/site.ts`** — shapes locked Phase 1. Phase 2 consumes them as RSC `await` imports (server-rendered).

### Established Patterns
- **Server Components default, zero `'use client'`** (FOUND-07 from Phase 1). Phase 2 must hold this line — channel buttons are plain `<a>` tags, CTAs are plain `<Link>`, photo is `next/image` (server-renderable). No state, no event handlers.
- **`view-transition-name` lives in CSS, not React** — per D-21. Use the existing `app/globals.css` and a small companion stylesheet or scoped Tailwind utility (Tailwind v4 supports arbitrary CSS at-rules).
- **App Router private-folder workaround (`%5F`)** — only relevant to `/_tokens` which Phase 6 deletes. Phase 2 ships normal route folders (`app/about`, `app/work`).
- **Playwright spec pattern** — `tests/*.spec.ts` files following Phase 1's structure. Phase 2's W0 stubs ~6-8 new specs (hero-renders, photo-lcp, currently-renders, channels-render, ctas-resolve-200, view-transition-name-present, footer-socials-render, mobile-hero-stacks-cleanly).
- **CSS serializer quirks** — Phase 1 learned Chromium serializes `outline` shorthand differently, normalizes `0.01ms` to `1e-05s`. Phase 2 specs that check computed CSS must accept both orderings — see `tests/focus-ring.spec.ts` precedent.

### Integration Points
- **Vercel preview deploy** — every push generates a branch-preview URL of form `braeden-site-<hash>-<scope>.vercel.app` (NOT the production alias `braeden-site.vercel.app`, which is ~44h stale per STATE.md). Phase 2 W4 validation must use the branch preview, not the production alias. Carry the lesson from Phase 1 W4-T2.
- **`NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw`** — set in Vercel env from Phase 1 D-13. Phase 2 doesn't touch it; Phase 5 does.
- **`braehods.com` + `www.braehods.com` domains** — added to Vercel project in Phase 1 W4-T1 with "Invalid Configuration" pending (DNS flip in Phase 6). Phase 2 deploys still serve preview URLs only.

</code_context>

<specifics>
## Specific Ideas

- **Visual reference anchors:** rauno.me (craft, restraint, editorial typography) and brittanychiang.com (architectural side-by-side hero, accent-color text-links). Phase 2 hero is the closest the site gets to chiang.com's homepage pattern — side-by-side photo right, name left, accent-blue text-links below. Don't copy 1:1; channel the rhythm.
- **HOME-05 wording is binding:** "view-transition shared element where photo is reused" — locks in the seam being on the **photo**, not on the wordmark or any other element. D-21 honors this. FEATURES.md row 64 (currently "v2") is overridden by ROADMAP.
- **"DM me" wording for Instagram channel** comes from `feedback_reel_cta_dm_format.md` (memory): IG's #1 algorithmic signal is DMs. The site reinforces the same conversion behavior the reels do. YouTube uses "Subscribe" — different platform mechanics.
- **Photo source path:** `~/Projects/braehods/images/photo.jpg` (193KB, verified present 2026-05-11). Copy into this repo's `public/` directory at planner discretion. PROJECT.md "Out of Scope (v1)" explicitly defers a new shoot.
- **Currently statement at Phase 2 plan time:** `"Currently shipping CapitolLens"`. This is accurate (memory: `project_capitollens_form4_strategy` and `project_capitollens_high_drought` — CapitolLens paper-trades the Form 4 strategy). Update before launch if priorities shift.

</specifics>

<deferred>
## Deferred Ideas

- **Future positioning-copy rewrite** (D-08) — drop "business student" framing, lean aspirational. Captured for v1.x or v2 copy pass, not this phase.
- **Real designed monogram swap** — Phase 6 (carried from Phase 1 D-01).
- **Real portrait shoot** — out-of-band, not blocking. PROJECT.md "Out of Scope (v1)."
- **Project-wide `<ViewTransitions>` for all route changes** (D-22 reject) — defer to v2 once all routes exist and we can audit blast radius. v1 ships per-element seam only.
- **Hero shared-element on /work cards** (e.g., project-card image → `/work/[slug]` detail) — v1 does not ship `/work/[slug]` (WORK-05 explicit), so no shared-element opportunity. v2 territory.
- **Channel-link visual treatment refinements** — user skipped this gray area; Claude's discretion CD-01 covers the default. If executed work surfaces a real visual problem (e.g., buttons look "app-y" against editorial type), revisit in Phase 6 polish.
- **"Currently" status block link affordance** — `data/currently.ts.link` field is optional and currently unset. CD-02 specifies how to render IF set. User can populate at any time.
- **Source-link wording in footer** — "view source" vs `<icon-only>` vs `</> View on GitHub` — planner picks something reasonable; revisit Phase 6 if it reads off.
- **Hero `<h2>` for SEO** — not in scope. Phase 6 SEO sweep adds structured headings if needed for Lighthouse SEO 95+.

</deferred>

---

*Phase: 2-Home Page*
*Context gathered: 2026-05-11*
