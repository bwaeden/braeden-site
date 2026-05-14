# Phase 4: Work + Projects - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning

<domain>
## Phase Boundary

`/work` route replaces the Phase 2 "Coming soon." stub with an equal-weight responsive grid of all 7 projects sourced from typed `data/projects.ts`. Each project renders as a hairline-bordered card carrying status badge + title + one-line description + tag taxonomy + canonical external link. Visitors who want "show me what he's actually built" land here, scan the grid in under 60 seconds, and click straight out to the artifact (repo, live site, or demo).

**In scope (Phase 4):**
- Replace `app/work/page.tsx` body with the real grid composition
- Populate `data/projects.ts` (currently `projects: Project[] = []`) with all 7 entries: CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, archived braehods
- New `<ProjectCard>` Server Component (likely `components/work/ProjectCard.tsx` plus `ProjectGrid.tsx`)
- Status-color map for the 4 status values (`shipped`, `paper-trading`, `in-dev`, `archived`)
- Wave-0 user-input task: collect canonical hrefs for all 7 projects (analogous to Phase 2's `data/channels.ts` user-input task)
- 2-3 new Playwright specs (`tests/work-grid-renders.spec.ts`, `tests/work-status-badges.spec.ts`, `tests/work-no-flagship.spec.ts`)

**Out of scope (Phase 4 — deferred to later phases):**
- `/work/[slug]` sub-route project case-study pages — WORK-05 explicit; v2 territory (CASE-01 in v2 requirements)
- Interactive tag filtering — WORK-04 says tags must be visible, NOT interactive; deferred
- OG image for /work — Phase 6 SEO sweep
- Light-mode color tokens for status badges — v1 dark-only

</domain>

<decisions>
## Implementation Decisions

### Card Visual Treatment
- **D-01:** Card shape = **hairline tile**. 1px solid `var(--color-border)` (#2a2a2f), internal padding `p-5` (20px) or `p-6` (24px) to be refined by planner against UI-SPEC, slight corner radius (4-6px). Mirrors Phase 2's photo treatment (D-02 in `02-CONTEXT.md`) so the page reads as part of the same editorial-tile design family. NOT borderless block. NOT chiang.com text-row list (would conflict with WORK-01's "equal-weight responsive grid" wording).
- **D-02:** Hover behavior = **border accent + arrow translate**. Hairline border transitions from `var(--color-border)` to `var(--color-accent)` (#7c87ff) on hover. The trailing `↗` arrow glyph translates `+2px` right on hover. Use `transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)]` per Phase 1 motion contract — explicitly NOT `transition-colors` (Phase 2 lesson: shorthand bleeds into `outline-color` and clobbers the `:focus-visible` accent ring; see Plan 02-04 Rule 1 fix). NO `translateY(-2px)` lift on the card itself (would conflict with the in-row alignment + read more app-y than editorial).
- **D-03:** Click target = **entire card is the link**. The whole card markup wraps in a single `<a href={project.href} target="_blank" rel="noopener noreferrer">`. One keyboard tab stop per card (7 total stops on the grid). Mobile touch target trivially exceeds 44×44 floor. Hover state applies uniformly to the entire card.
- **D-04:** Arrow glyph = **inline ↗ external arrow after the title**. Placement: `[Title] ↗` (non-breaking-space, then arrow). Glyph: U+2197 NORTH EAST ARROW (or styled SVG if the unicode glyph reads inconsistent across fonts — planner to verify in Fraunces/Geist Sans). Color: accent `var(--color-accent)`. Size: ~12-14px. The `↗` (vs `→`) signals "opens elsewhere," matching the external-link semantic; `→` is reserved for in-site CTAs per CTAArrowLink convention from Phase 2. NOT bottom-right corner (extra layout structure for no gain). NOT no-arrow (mobile users without hover need an interactivity tell).

### Grid + Density
- **D-05:** Column count = **1-col mobile / 2-col `md:` / 2-col `lg:`**. Tailwind utility: `grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6` (gap refined by planner). 7 projects = 4 rows: 3 full + 1 orphan. With `max-w-3xl` container, 2 columns at desktop = ~360px each card before padding — comfortable for title + description + tags + status. NOT 3 columns at lg (would force `max-w-5xl` widening, breaking D-10 inherited from Phase 3 where `max-w-3xl` is the established root for non-home routes).
- **D-06:** Orphan-card treatment = **left-aligned, half-width** (default CSS Grid behavior — cards keep consistent width across all 4 rows). The 7th card sits in the left column of row 4; right column is empty. Reads as "just one more" rather than as an asymmetric spotlight. NOT centered (draws attention to the asymmetry). NOT full-width spans-2 (would visually weight the orphan, conflicting with WORK-01 "equal-weight, no flagship hierarchy").
- **D-07:** Card height = **content-driven, row-aligned**. Use CSS Grid `grid-template-rows` auto + `align-items: stretch` (Tailwind: `items-stretch` on the grid container) so adjacent cards in the same row match the taller card's height. Description string length varies (the schema caps at 140 chars but real entries will land 60-130) — row-stretching prevents staircased rows. NOT fixed-height (rigid, fights editorial-restrained). NOT pure-content no-stretch (junior-portfolio staircased look).
- **D-08:** Archived braehods placement = **same card style as the others, ordered last in the array**. WORK-01 "equal-weight, no flagship hierarchy" cuts both ways: no project gets a bigger card AND no project gets demoted. The `status: 'archived'` badge alone communicates the bucket (D-09 status-color map). Ordered last so archived sits as the orphan card on row 4. NOT lower opacity (fights equal-weight). NOT a separate "Archive" subsection with its own h2 (introduces page structure /work doesn't need; the badge does the bucketing job).

### Tag + Status Surfacing
- **D-09:** Status-color map (4 status values × 1 dot color each):
    - `shipped` → `var(--color-accent)` `#7c87ff` (live, on-brand, the only "use the accent token" case)
    - `paper-trading` → `#c8a86a` (muted amber, "in motion / not yet live")
    - `in-dev` → `var(--color-muted)` `#a8a8a8` (neutral, work-in-progress)
    - `archived` → `#707070` (deeper muted, "past")
  - **Token discipline note:** `#c8a86a` and `#707070` are 2 new color values outside the locked 6-token palette (D-08 from `01-CONTEXT.md`). v1 ships them as **inline-style literals scoped to the badge dot only** (e.g., `<span style={{ backgroundColor: '#c8a86a' }} />`) — NOT promoted to `@theme` tokens in `globals.css`. Keeps the global token palette pure for v1; planner may revisit in Phase 6 if status badges propagate elsewhere. Document the literal values in a constant map at the top of `ProjectCard.tsx` so the planner / future-Braeden can find them.
  - **Contrast verification:** All 4 dot colors must clear WCAG AA against both gradient endpoints (`#1a1a1f` top, `#0a0a0a` bottom) — verify in plan validation. The dot is decorative-redundant (label carries the info) per A11Y-05, so AA is the floor not the ceiling.
- **D-10:** Status badge placement = **top of card, above title**. Read order top-down: `● paper-trading` (badge) → `CapitolLens ↗` (title) → description → tags. Status is metadata; title is the name. NOT inline-with-title (dot fights the trailing `↗` for attention). NOT bottom-right (takes 2 saccades to register status).
- **D-11:** Status badge text style = **lowercase, exact schema value**. Renders verbatim: `● shipped`, `● paper-trading`, `● in-dev`, `● archived`. Geist Sans 12-13px, label color = `var(--color-muted)` (the dot carries the color, the label is muted). Reads code-aware/dev-honest, no transformation layer. NOT capitalized (`In-dev` looks awkward). NOT uppercase tracked (`PAPER-TRADING` shouts louder than the editorial-restrained palette wants).
- **D-12:** Tag rendering = **plain muted text, comma-separated**. Tags appear as `trading, tools` in muted Geist Sans 12-13px under the description. NO pill chips. NO color-coding by family. Quietest, most editorial — relies on visual scanning to surface family-grouping (4 `trading` projects in a row reads its own pattern). The `Project.tags` array is rendered via `tags.join(', ')`. NOT pills (adds info-density that fights restraint). NOT color-coded by family (4 colored tag values would noise-compete with the status dot).

### Page Composition + Content
- **D-13:** Page heading = **`sr-only` h1 'Work'** (matches Phase 3 `/about` convention — `<h1 id="work-heading" className="sr-only">Work</h1>`, paired with `aria-labelledby="work-heading"` on the section landmark per WCAG 2.4.6). NO visible heading. The route name in Nav is enough orientation; cards are the page content. Editorial/restrained — visitors land and immediately see the work itself.
- **D-14:** Project order = **manual array order in `data/projects.ts`, archived last**. Default sequence: CapitolLens → shorts-factory → meme-dashboard → prediction-market-bot → no-more-short-form → mc-packet-client → archived braehods. CapitolLens leads (the headline current trading work). archived braehods sits last (becomes the orphan card on row 4 per D-06). User can reorder by editing the array. NOT auto-sorted by status (rhythm depends on the status mix — fragile). NOT alphabetical (would land 'archived braehods' near the start, fighting the "here's what I'm working on now" narrative).
- **D-15:** Description sourcing = **Claude drafts first-pass from memory + project knowledge during execute-phase, user edits in-place** (same pattern as Phase 3 D-01). Each description ≤140 chars per the locked `Project` schema, in the warm/concrete voice of the /about bio (no AI-template phrases per ABOUT-01 carry-forward). Memory carries rich context for at least 4 of the 7 projects (CapitolLens form4 strategy, shorts-factory Remotion CLI, meme-dashboard Streamlit scorer, reel-research-agent Streamlit drafting tool — though reel-research-agent is NOT in the WORK-06 list so verify whether it lands). For projects without memory context (prediction-market-bot, no-more-short-form, mc-packet-client) Claude drafts a placeholder and prompts the user during the execute-phase review checkpoint (analogous to Phase 3's bio review checkpoint).
- **D-16:** Canonical href priority = **live site / demo if it exists, else GitHub repo**. Per-project waterfall: live URL > demo (Streamlit Cloud, YouTube playlist, etc.) > public repo URL. Visitor sees the work itself when one exists. Wave-0 user-input task surfaces this per project — user supplies the actual URL string (Claude can suggest from memory but the user confirms each one before commit). For archived braehods specifically: until Phase 6 DNS swap, the live URL is the OLD braehods.com (current GitHub Pages site); after Phase 6 cutover, swap to an archive snapshot URL or to the repo. Document as a Phase 6 carry-forward.

### Claude's Discretion (during execution)
- Exact card padding (`p-5` vs `p-6`) and grid `gap` (`gap-4` vs `gap-6`) — refined against UI-SPEC visual rhythm.
- Whether to factor a `ProjectGrid` wrapper component or inline the grid container in `app/work/page.tsx` (depends on whether stagger orchestration is per-card or grid-level).
- Card stagger choreography (continue the home pattern: stagger fade-in per card with 60-80ms increments; planner picks the exact delay scale).
- Whether the `↗` glyph is a unicode character or an inline SVG (depends on cross-font consistency in Fraunces/Geist Sans — verify during execution).
- Description placeholder wording for projects without memory context — first-pass + flag for user review.
- Whether to add a Phase 4 SUMMARY.md note that /work is the second cross-route consumer of the established Server-Components-only + tile-treatment patterns.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project + Requirements
- `.planning/PROJECT.md` — Core value (visual polish #1, contact-conversion #2), stack constraints, Key Decisions table including "All-equal projects grid (no flagship)" — locks D-08 + WORK-01 wording
- `.planning/REQUIREMENTS.md` § Work / Projects (WORK-01..06) + § Accessibility A11Y-05 — locked requirements; especially WORK-05 (no `/work/[slug]` in v1) and A11Y-05 (color is never the only state indicator — the binding constraint behind D-09 + D-10 + D-11)
- `.planning/ROADMAP.md` § Phase 4 — phase goal, 5 success criteria, dependencies on Phase 1 (data layer scaffold) + Phase 2 (page chrome pattern)

### Phase 2 + 3 carry-forwards (the most load-bearing prior context)
- `.planning/phases/02-home-page/02-CONTEXT.md` — D-01..D-25 design decisions; especially D-02 (hairline tile photo treatment — same family as D-01 here), D-22 (per-element view-transition discipline — Phase 4 does NOT add a view-transition seam unless future Phase 5/6 wants /work cards → modal), D-25 (zero `'use client'`)
- `.planning/phases/02-home-page/02-UI-SPEC.md` — UI design contract; vertical rhythm tokens (`py-8 md:py-12` page padding; `mt-4`/`mt-6`/`mt-8` content gaps from CD-05) inherit
- `.planning/phases/02-home-page/02-SUMMARY.md` — Phase 2 retrospective; lucide-react brand-icons-gone deviation (relevant if /work cards ever surface a repo icon)
- `.planning/phases/03-about-page/03-CONTEXT.md` — D-01 Claude-drafts-content-pattern (origin of D-15 here); sr-only h1 + aria-labelledby pattern (origin of D-13 here)
- `.planning/phases/03-about-page/03-01-SUMMARY.md` — Phase 3 retrospective; bio drafting + cliché-scrub spec pattern (relevant if WORK-03/D-11 ever wants its own AI-template phrase scrubber on descriptions)
- `.planning/phases/02-home-page/02-SCOPE-AMENDMENT.md` — Instagram + GitHub only (no YouTube anywhere in v1) — applies if any project description mentions a YouTube channel or if the canonical href is ever a YT URL. archived braehods previously linked YT; verify before commit.

### Reusable Phase 2 source files
- `data/projects.ts` — schema already locked: `Project { slug, title, description≤140, tags, status, href }` + Zod `ProjectStatus` + `ProjectTag` enums. Phase 4 populates the empty `projects: Project[] = []` array.
- `app/work/page.tsx` — current "Coming soon." stub from Plan 02-05; this phase replaces its body
- `components/home/HeroPhoto.tsx` + `components/home/CTAArrowLink.tsx` — reference implementations of the editorial-tile + accent-arrow patterns Phase 4 mirrors
- `components/home/ChannelButton.tsx` — reference for the hairline-bordered hover-translate pattern (D-02 here is the card-scale version of ChannelButton's button-scale treatment)
- `lib/motion.ts` — `stagger(N)` + `fadeInUp` seam for per-card stagger choreography
- `components/layout/Footer.tsx` + `components/layout/Nav.tsx` — chrome wraps every page automatically; /work consumes via `app/layout.tsx`

### Phase 1 invariants still binding
- `.planning/phases/01-foundation-design-tokens/01-PLAN.md` — FOUND-07 (single client island for ContactModal — /work is Server Component, zero `'use client'`), DSGN-01..09 (token system; the 6-token palette discipline behind the D-09 inline-literal note), focus ring + reduced-motion contract
- `app/globals.css` — `@theme` block with the 6 locked color tokens; `.fade-in-up` class + `@keyframes fade-in-up`; `*:focus-visible` rule (the rule the D-02 `transition-[border-color,color,transform]` decision protects from regressing)
- `CLAUDE.md` — stack inventory; "What NOT to use" list (no Radix UI for cards, no motion library)

### Memory (cross-project user context that informs descriptions)
- `project_capitollens_form4_strategy.md` — CapitolLens description source: Form 4 insider-buy clusters (MEDIUM tier), 180-day hold, +18%/yr Sharpe 0.93 backtest, paper-only (don't claim live)
- `project_capitollens_trading_mode.md` — paper-trading status confirmed; informs `status: 'paper-trading'` value
- `project_shorts_factory.md` — shorts-factory description source: Remotion-based Dam-style YT Shorts CLI (`scripts/make-short.mjs`), no Studio
- `project_meme_dashboard.md` — meme-dashboard description source: Streamlit backtest scorer for YT Shorts/IG Reels/TikTok meme formats
- `project_reel_research_agent.md` — reel-research-agent description source (NOTE: NOT in WORK-06 list — verify before adding/swapping)
- `project_school_planner.md` — school-planner project (NOT in WORK-06 list — out of scope for /work; flagged for awareness only)
- `feedback_avoid_paid_tools.md` — informs description voice: emphasize free libs + Claude Code subscription over paid services where relevant
- `feedback_capitollens_auto_follow.md` — informs CapitolLens description framing: paper-only authorization scope

### External docs (pull as needed during planning)
- WCAG AA contrast verification (manual) — https://webaim.org/resources/contrastchecker/ (verify the 4 status-dot colors against #1a1a1f and #0a0a0a)
- Tailwind v4 grid utilities — https://tailwindcss.com/docs/grid-template-columns (grid-cols + items-stretch + gap reference)
- MDN CSS Grid auto-rows — https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows (reference for the row-stretched content-driven height pattern in D-07)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`data/projects.ts`** — Zod schema + `Project` type already defined; `projects: Project[] = []` empty array awaits 7 entries. Phase 4 populates only — no schema changes (the schema covers everything D-01..D-16 needs).
- **`<HeroPhoto>` + `<ChannelButton>`** — pattern reference for the hairline-tile + hover-translate treatment. Phase 4's `<ProjectCard>` is the card-scale version of these button-scale primitives.
- **`<CTAArrowLink>`** — pattern reference for the inline accent-arrow + hover-translate glyph (D-04). Phase 4 doesn't reuse it directly (different glyph: `↗` external vs `→` internal) but the implementation shape is the model.
- **`lib/motion.ts` `stagger(N)` + `fadeInUp`** — per-card stagger choreography. Phase 4 likely applies stagger 1..7 to the 7 cards (or 1..N where N is `projects.length`).
- **`app/layout.tsx`** — Nav + Footer chrome wraps /work automatically; `max-w-3xl mx-auto px-6` root container is established. Phase 4 inherits — no chrome refactor.

### Established Patterns
- **Server Components default, zero `'use client'`** (FOUND-07 / D-25 from Phase 2) — `<ProjectCard>` is a plain Server Component with `<a>` tag. No state, no event handlers, no client island.
- **`transition-[<single-property>]` on currentColor inheritors** (Phase 2 Plan 02-04 lesson) — D-02 here applies the pattern to the card's border + arrow translate; explicitly NOT `transition-colors`.
- **`target="_blank" rel="noopener noreferrer"` on every external `<a>`** — D-03 inherits.
- **Two-weight typography** (Fraunces 700 display + Geist Sans 400 body) — card title likely Geist Sans (matches description) rather than Fraunces (would compete with home hero word). Planner refines.
- **Inline SVG with `currentColor` for glyphs** (memory: lucide brand icons gone) — if `↗` unicode glyph reads inconsistent across fonts, planner ships an inline SVG arrow instead.
- **`sr-only` h1 + `aria-labelledby` section landmark** (Phase 3 D-13 pattern) — `<section aria-labelledby="work-heading"><h1 id="work-heading" className="sr-only">Work</h1>`.

### Integration Points
- `app/work/page.tsx` — replaces the 5-line "Coming soon." Server Component (Plan 02-05) with the new grid composition. Likely composition: `<section aria-labelledby="work-heading"><h1 className="sr-only">…</h1><ProjectGrid projects={projects} /></section>`.
- `data/projects.ts` — populated with 7 entries. Wave-0 user-input task collects each `href` (analogous to Phase 2's `data/channels.ts` pattern).
- New files (planner to confirm exact paths):
    - `components/work/ProjectCard.tsx` — single card; consumes `Project` prop
    - `components/work/ProjectGrid.tsx` (optional — may inline in page.tsx if simple enough) — grid container with stagger orchestration
    - `tests/work-grid-renders.spec.ts` — asserts all 7 projects rendered, all titles + descriptions + tags + status badges present
    - `tests/work-status-badges.spec.ts` — asserts dot color matches status; asserts each badge has both color AND label (A11Y-05 compliance)
    - `tests/work-no-flagship.spec.ts` — asserts no card has different width/height from peers in the same row (equal-weight verification per WORK-01)
- The cliché-scrub regex from `tests/about-renders.spec.ts` (Phase 3) is reusable if the planner wants to enforce ABOUT-01-style copy hygiene on project descriptions too. Optional spec.

</code_context>

<specifics>
## Specific Ideas

- **Visual reference anchor:** brittanychiang.com `/projects` is the closest spiritual neighbor (hairline-bordered cards, accent-color title hover, arrow glyph) but his cards include thumbnail images — Phase 4 deliberately ships text-only cards (no per-project thumbnails). The decision lands in the editorial-restrained ethic and respects the "no images that aren't load-bearing" implicit norm from Phase 2 (the only image on the site outside /about + / is the LCP portrait).
- **Card title font weight:** Geist Sans 500 or 600 candidate (verify in UI-SPEC). Fraunces 700 would compete with the home hero word; reserving Fraunces for `/` keeps the type-pairing legible across routes.
- **The 4-status palette (D-09):** `#7c87ff` accent / `#c8a86a` amber / `#a8a8a8` muted / `#707070` deep grey. Document the 2 new color literals (`#c8a86a` + `#707070`) inline in `ProjectCard.tsx` constants block — NOT in `globals.css` `@theme` (token discipline for v1).
- **CapitolLens specifically:** description should NOT claim live trading; per memory + ABOUT-01 cliché-scrub principle, "paper-traded" or "paper-only" must appear. Status: `paper-trading`.
- **archived braehods specifically:** the title is "braehods" or "braehods.com (v0)" — planner picks. The href is the OLD live site (currently still GitHub Pages-hosted at braehods.com) UNTIL Phase 6 DNS swap; carry-forward is documented at D-16. Tags include `archived` (the only project where the `archived` tag value applies in v1).
- **Tab order on /work:** Nav (4 links) → 7 ProjectCards in array order → Footer socials. /work has no internal interactive elements beyond Nav, Footer, and the 7 cards. ~13 tab stops total (4 nav + 7 cards + 2 footer socials).

</specifics>

<deferred>
## Deferred Ideas

- **Interactive tag filtering** — WORK-04 says tags must be visible, NOT interactive. If real traffic patterns surface a "user wants to filter by family" need post-launch, v2 candidate.
- **Per-project thumbnails / preview images** — considered, rejected. Editorial-restrained ethic + LCP discipline + the "only load-bearing images" implicit norm. v2 candidate if a flagship project graduates to a case study (CASE-01 in v2).
- **`/work/[slug]` case-study sub-pages** — explicit v2 (CASE-01, CASE-02 in REQUIREMENTS.md). Phase 4 does NOT reserve the route in `app/work/`.
- **Status-color tokens promoted to `globals.css` `@theme`** — D-09 ships the 2 new color literals inline-only for v1. Phase 6 polish may revisit if status badges propagate to other components (project case studies, contact-modal status indicator, etc.).
- **Light-mode color tokens for status badges** — v1 dark-only. LITE-01 in v2.
- **Card-to-modal view-transition seam** (e.g., card → modal contact form when clicked) — irrelevant for v1 (cards link out externally; no in-site target for a transition). Out of scope indefinitely.
- **OG image for /work** — Phase 6 SEO sweep covers (SEO-03 dynamic OG via `@vercel/og`; default OG fallback for `/`).
- **Sort by status / status-grouped subsections** — manual array order chosen instead. Status badge does the bucketing inline. Auto-sorted-by-status considered, rejected (rhythm depends on the status mix, fragile).
- **Tag-family color-coding** — considered, rejected. Plain muted text suffices; color noise from 4 tag-family colors would compete with the status dot.
- **Description cliché-scrub spec** (mirrors `tests/about-renders.spec.ts`) — optional, planner discretion. Worth adding if the 7 descriptions risk ABOUT-01-style template phrasing; cheap insurance.
- **reel-research-agent inclusion** — NOT in WORK-06 list. If user wants to add (per memory: it's an active project), it's an 8th entry that breaks the 7-card grid math (8 = 4 full rows of 2 — actually re-evens the grid). Surface to user during execute-phase data-population review.
- **school-planner inclusion** — NOT in WORK-06 list. Memory flagged it as an active personal project. Same treatment as reel-research-agent — surface during execute-phase review.

### Reviewed Todos (not folded)

None — no pending `.planning/todos/` items match Phase 4 scope as of context-gathering date (`gsd-sdk query todo.match-phase 4` returned `todo_count: 0`).

</deferred>

---

*Phase: 4-work-projects*
*Context gathered: 2026-05-13*
