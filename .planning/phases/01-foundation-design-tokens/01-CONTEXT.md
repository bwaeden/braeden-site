# Phase 1: Foundation + Design Tokens - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

A deployable Vercel preview at `*.vercel.app` showing a charcoal-gradient page with the chosen fonts, the B monogram in nav/footer/favicon, and the design-token + reduced-motion contracts every later phase builds on. Covers 20 v1 requirements: FOUND-01..08, DSGN-01..09, A11Y-02, A11Y-06, SEO-07.

In scope:
- Next 16 + React 19.2 + TS 5.9 + Tailwind v4 + `@next/mdx` scaffold
- `data/` + `components/` + `lib/` + `content/` folder layout
- `@theme` design tokens (6 colors)
- Charcoal gradient + grain overlay
- Fraunces / Geist Sans / Geist Mono via `next/font`
- B monogram (Fraunces-traced placeholder) as inline SVG component used in nav/footer/favicon
- Visible focus ring + reduced-motion gate
- Vercel project + preview deploys + braehods.com domain staged

Out of scope:
- Hero, About, Work, Contact pages (Phases 2–5)
- Real B monogram (Phase 6 swap-pass)
- Lighthouse audit, JSON-LD, sitemap, OG images, DNS swap (Phase 6)

</domain>

<decisions>
## Implementation Decisions

### B Monogram (v1 placeholder)
- **D-01:** Ship a Fraunces-traced "B" as a placeholder for v1; flag a swap-pass in Phase 6 when the real mark is designed. STATE.md already lists this as the agreed fallback.
- **D-02:** Form = Fraunces "B" exported as an SVG `<path>` (not geometric, not letter-in-shape). Reuses the locked display-serif identity, looks intentional rather than placeholder-y.
- **D-03:** Variant = Fraunces Black, Soft axis full. Reads dense + editorial at small sizes, sculpted at 96px+. Trace from the variable font instance, then export path data.
- **D-04:** Single SVG path used everywhere via `components/ui/MonogramMark.tsx` with a `size` prop and `currentColor` fill. For `favicon.svg` at 16/32px, add `shape-rendering="crispEdges"` and ship a slightly-thicker stem variant of the same path so the silhouette holds. No separate hand-simplified favicon path; no PNG fallback for v1 (revisit in Phase 6 if iOS Safari favicon rendering is bad).
- **D-05:** Surfaces wired in Phase 1: nav, footer, `app/icon.svg` (favicon convention). Hero/404/OG-image consumers come online in Phases 2/6.

### Color Tokens + Tailwind v4 wiring
- **D-06:** Resolve REQUIREMENTS vs PITFALLS conflict in PITFALLS' favor. Lock muted text at `#a8a8a8` (clears WCAG AA against `#0a0a0a`). REQUIREMENTS.md DSGN-03 is updated to match — `~#707070` was a first-pass guess, not a verified-against-gradient value.
- **D-07:** Tokens live in `@theme` only inside `app/globals.css`. All component code uses Tailwind classes. Tailwind v4 auto-exposes `@theme` tokens as CSS custom properties, so the rare non-Tailwind consumer (keyframes, inline SVG attrs, `body::after` grain rule) reads `var(--color-…)` directly. Single source of truth, no parallel `:root` block.
- **D-08:** Six tokens for v1, named flat (no scales):
    - `--color-bg-start: #1a1a1f` (gradient top)
    - `--color-bg-end: #0a0a0a` (gradient bottom)
    - `--color-text: #e8e8e8` (cool white body)
    - `--color-muted: #a8a8a8` (AA-safe muted)
    - `--color-accent: #7c87ff` (soft electric blue)
    - `--color-border: #2a2a2f` (hairline / dividers)
- **D-09:** Gradient + grain composition:
    - `body { background: linear-gradient(180deg, var(--color-bg-start), var(--color-bg-end)); background-attachment: fixed; }`
    - `body::after { content:""; position: fixed; inset: 0; pointer-events: none; z-index: -1; opacity: 0.04; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,…feTurbulence…"); }`
    - No GPU repaint per scroll frame, no extra DOM node, no `<GrainOverlay />` component file.

### Repo Bootstrap + Vercel Deploy
- **D-10:** Bootstrap via `npx create-next-app@latest ../braeden-site-bootstrap --typescript --tailwind --app --use-npm`, then merge generated files into this repo (preserving `.git`, `.planning/`, `CLAUDE.md`). Strip the create-next-app default `page.tsx`/`globals.css`/`README.md` content. Plan should call out a manual diff-and-keep step for `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`.
- **D-11:** Phase 1 preview renders a token-showcase: `/` shows gradient + grain + monogram in nav and footer + a single Fraunces hero word for size hierarchy. Plus a hidden-but-deployed `/_tokens` route that lists every color token, type ramp, and the monogram at every size. Phase 2 deletes/replaces both.
- **D-12:** Vercel project: name `braeden-site`, production branch `main`, every other branch + PR gets a preview URL. Add `braehods.com` and `www.braehods.com` to the project as a Phase 1 deliverable (DNS still points at GitHub Pages, but Vercel begins SSL cert staging — eliminates the SSL-race pitfall called out in PITFALLS.md). DNS CNAME flip stays in Phase 6.
- **D-13:** `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` set in Vercel project env (all environments). Locks Phase 5 to the `@formspree/react` client-island architecture already in PROJECT.md.
- **D-14:** Install `@vercel/analytics` and `@vercel/speed-insights` in Phase 1 (not Phase 6) so we have real-user Core Web Vitals data on every preview from day one. Required for verifying the Lighthouse 95+ goal in production, not just lab.

### Claude's Discretion

The user did not select the **reduced-motion + focus-ring** gray area, so the planner / executor implements DSGN-06, DSGN-07, DSGN-08, A11Y-02, A11Y-06 directly from PITFALLS.md guidance (no further user discussion needed):

- **CD-01:** Reduced-motion = opt-out global override. `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }` in `globals.css`. Components write motion CSS as if motion is always allowed; the override defaults them off for users who opt out. (PITFALLS recommends this pattern; DSGN-08's "no-preference" wording is a higher-level statement of intent that this implements.)
- **CD-02:** Focus ring = `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: inherit; }` global rule. Never `outline: none` without an explicit replacement. Inputs and buttons use the same rule; `[type=text]` style retains the ring on `:focus-visible` only (not plain `:focus`) so mouse clicks don't show it.
- **CD-03:** `lib/motion.ts` ships in Phase 1 as the isolation seam ARCHITECTURE.md calls for, even though Phase 1 has no motion of its own. It exports the staggered-fade keyframe class names + a `respectsReducedMotion` flag so Phase 2's hero animations are a one-import wire-up. No `motion@12.x` install for v1.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level decisions (locked)
- `.planning/PROJECT.md` — Core Value, Constraints, Key Decisions table. Visual polish > contact-conversion priority.
- `.planning/REQUIREMENTS.md` — 20 Phase 1 requirements (FOUND-01..08, DSGN-01..09, A11Y-02, A11Y-06, SEO-07). **Note: DSGN-03 muted color value updated from `~#707070` to `#a8a8a8` per D-06.**
- `.planning/ROADMAP.md` §"Phase 1: Foundation + Design Tokens" — phase goal + success criteria (5 items).
- `.planning/STATE.md` — current project state, blockers (B monogram noted as design dependency).
- `CLAUDE.md` — full stack table with version pins, font choices, animation approach, MDX setup, Vercel config, what-NOT-to-use list.

### Research (synthesized 2026-05-07, HIGH confidence)
- `.planning/research/SUMMARY.md` — executive synthesis, resolved divergences, phase structure rationale.
- `.planning/research/STACK.md` — every library + version + why; do-not-use list.
- `.planning/research/ARCHITECTURE.md` — folder layout, RSC pattern, `lib/motion.ts` isolation seam, data-flow.
- `.planning/research/PITFALLS.md` — top 5 critical pitfalls. **Phase 1 owns Pitfall 1 (contrast), Pitfall 2 (grain perf), Pitfall 3 (FOIT), Pitfall 6 (reduced-motion missing), Pitfall 8 (focus rings stripped).**
- `.planning/research/FEATURES.md` — table-stakes vs differentiators vs anti-features.

### External docs (referenced by stack table — pull as needed during planning)
- Next.js 16 release notes — https://nextjs.org/blog/next-16
- Next.js Upgrade Guide v16 — https://nextjs.org/docs/app/guides/upgrading/version-16
- Tailwind CSS v4 release — https://tailwindcss.com/blog/tailwindcss-v4
- Vercel Geist Font (SIL OFL) — https://vercel.com/font
- Google Fonts: Fraunces — https://fonts.google.com/specimen/Fraunces
- CSS-Tricks: Grainy Gradients — https://css-tricks.com/grainy-gradients/
- MDN: prefers-reduced-motion — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **None in this repo yet.** Source code is greenfield; only `.planning/` and `CLAUDE.md` exist.
- **Old `~/Projects/braehods` repo (existing braehods.com)**: holds the current `images/photo.jpg` portrait that's acceptable as v1 placeholder (consumed in Phase 2/3, not Phase 1). Not imported into this repo — Phase 2 will copy the file directly.

### Established Patterns
- **Stack patterns are documented but not yet implemented.** ARCHITECTURE.md prescribes the folder layout, RSC default, `lib/motion.ts` seam, design-token-in-CSS pattern. Phase 1 IS the establishing phase — every later phase is constrained by what we lock here.
- **No `lint`-prescribed patterns yet** (no source code). Plan should commit a working ESLint flat config + Prettier config so Phase 2 inherits them.

### Integration Points
- **Vercel deploy hook** — preview URL becomes the "is the design right?" review surface for every later phase.
- **`next/font`** — fonts loaded in `app/layout.tsx` and exposed as CSS variables; Tailwind `@theme` reads those variables for `font-display` / `font-body` / `font-mono` token classes.
- **`@theme` token surface** — every component in Phases 2–6 uses Tailwind classes derived from these tokens. Renaming or removing one is a project-wide refactor; lock with care.
- **`MonogramMark` component** — single import surface; nav/footer/hero/404/OG all reach for it in later phases. Stable API matters more than internal implementation.

</code_context>

<specifics>
## Specific Ideas

- Visual references already in PROJECT.md: rauno.me (craft, micro-detail), brittanychiang.com (architectural rigor, dark-navy + electric accent). Phase 1 deliverables should look intentional even though they're "just" tokens — the token-showcase preview at `/_tokens` is the proof.
- The "editorial-dark over minimalist" decision (PROJECT.md key decisions) means: don't optimize for minimum-elements; optimize for crafted-feel. The grain overlay isn't decoration; it's the difference between "dark mode" and "editorial dark."
- `data/currently.ts` shape is already locked by the resolved-divergences table (SUMMARY.md): `{ statement: string; updatedAt: string; link?: string }`. Phase 1 ships the file structure with placeholder data; Phase 2 reads it.

</specifics>

<deferred>
## Deferred Ideas

- **Real B monogram design.** Captured. Swap-pass in Phase 6.
- **Reduced-motion / focus-ring deeper discussion.** User skipped this gray area; Claude defaults to PITFALLS.md guidance per CD-01..03. If executed work surfaces a real choice (e.g., custom motion curves), revisit then.
- **iOS Safari favicon edge case (PNG fallback).** Hold for Phase 6 polish unless real-device testing in Phase 2 reveals the SVG favicon doesn't render.
- **`apple-touch-icon.png`, web manifest.** Mapped to Phase 6 (SEO-07 lives in Phase 1 per traceability, but apple-icon + manifest belong with the broader SEO sweep).
- **TypeScript 6.0 adoption.** Pinned to TS 5.9 for v1 per CLAUDE.md. Re-evaluate at first phase boundary.
- **Light-mode toggle.** Out of scope for v1 (LITE-01 in v2 requirements).

</deferred>

---

*Phase: 1-Foundation + Design Tokens*
*Context gathered: 2026-05-08*
