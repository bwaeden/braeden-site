# Phase 4: Work + Projects - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-13
**Phase:** 04-work-projects
**Areas discussed:** Card visual treatment, Grid + density, Tag + status surfacing, Project content + ordering

---

## Card Visual Treatment

### Q1: Card shape on charcoal

| Option | Description | Selected |
|--------|-------------|----------|
| Hairline tile (matches D-02) | 1px solid var(--color-border) #2a2a2f, ~16px padding, 4-6px corner radius. Mirrors photo treatment from home hero. | ✓ |
| Borderless block + hover lift | No border, generous padding. Hover: title accent + card translateY(-2px). | |
| Text-row list (chiang.com-style) | No card per se — title + arrow left, tags + status right, hairline divider between rows. | |

**User's choice:** Hairline tile (matches D-02)
**Notes:** Aligns the /work tile family with Phase 2's photo treatment — same "editorial tile on charcoal" framing applied to a card-scale primitive.

### Q2: Card hover behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Border accent + arrow translate | Border transitions border-color → accent #7c87ff (200ms transition-[border-color,color], outline untouched per Phase 2 lesson). Arrow glyph translates +2px right. | ✓ |
| Border accent + translateY(-2px) lift | Same border-color shift + subtle Y translate. Reads "tactile." | |
| Title color shift only, no border change | Only title goes accent. Border stays muted. | |

**User's choice:** Border accent + arrow translate
**Notes:** Recommended pick — quietest hover that's still visible. Honors the Phase 2 Plan 02-04 lesson (transition-[border-color,color] not transition-colors) so the focus ring stays accent and doesn't 200ms-interpolate from muted.

### Q3: Click target

| Option | Description | Selected |
|--------|-------------|----------|
| Entire card is the link | Whole `<a>` wraps card content. Single tab stop per card. Mobile touch target trivially exceeds 44×44. | ✓ |
| Title only is the link | Only title is `<a>`. Tags/status/description non-interactive. | |
| Title link + small icon-row link (e.g., GitHub) | Title canonical link + repo-icon corner = second link. Doubles tab stops. | |

**User's choice:** Entire card is the link
**Notes:** Simplest mental model + biggest mobile target. Eliminates the keyboard-tab-bloat of icon-row links.

### Q4: Arrow glyph placement

| Option | Description | Selected |
|--------|-------------|----------|
| Inline after title | Title — e.g., `CapitolLens ↗` — with 45° external arrow inline. Accent color, 12-14px, +2px translate on hover. | ✓ |
| Bottom-right corner of card | Arrow lower-right, away from title. Pinterest-card vibe. | |
| No arrow — hover signals interactivity | Hover-only interactivity tell. | |

**User's choice:** Inline after title (↗ external)
**Notes:** ↗ (vs CTAArrowLink's →) signals "opens elsewhere." Mobile users without hover still get the affordance.

---

## Grid + Density

### Q1: Column count at desktop

| Option | Description | Selected |
|--------|-------------|----------|
| 1-col mobile / 2-col md / 2-col lg | Tablet+ holds 2 columns. 7 projects = 4 rows (3 full + 1 orphan). Editorial breathing room at max-w-3xl. | ✓ |
| 1-col mobile / 2-col md / 3-col lg | 3 cols at lg. 7 = 2 full + 1 orphan. ~240px columns at max-w-3xl — cramped; would force max-w-5xl widening. | |
| 1-col stack throughout (no grid) | Single column on every viewport. Likely too sparse on desktop for 7 entries. | |

**User's choice:** 1/2/2
**Notes:** Preserves max-w-3xl (D-10 inherited from Phase 3) — no need to widen the page container. Cards get ~360px each at desktop, comfortable for full content.

### Q2: Orphan card placement

| Option | Description | Selected |
|--------|-------------|----------|
| Left-aligned, half-width | Default CSS Grid. Orphan in left column, right column empty. Reads as "just one more." | ✓ |
| Centered, half-width | Symmetric but draws attention to the asymmetric whitespace. | |
| Full-width spans both columns | Orphan stretches to fill — visually weights it. Conflicts with WORK-01 "equal-weight." | |

**User's choice:** Left-aligned, half-width
**Notes:** Equal-weight discipline + simplest CSS Grid behavior.

### Q3: Card height

| Option | Description | Selected |
|--------|-------------|----------|
| Content-driven, row-aligned | items-stretch — cards in same row match the taller card's height. Description varies 60-140 chars; row-stretch prevents staircase. | ✓ |
| Fixed height (e.g., 200px) | Pristine grid look but short descriptions strand whitespace; long ones risk clipping. | |
| Pure content (no row-align) | Adjacent cards in same row can have different heights — staircased look. | |

**User's choice:** Content-driven, row-aligned
**Notes:** Best of both — content drives vertical extent, row-stretch keeps the visual baseline clean.

### Q4: Archived braehods placement

| Option | Description | Selected |
|--------|-------------|----------|
| Same as the others, ordered last | Equal-weight cuts both ways. Archived badge alone communicates the bucket. | ✓ |
| Visually demoted (lower opacity) | Opacity ~0.6, "this is history." Fights equal-weight. | |
| Pulled into separate "Archive" subsection | h2 below the main grid, one card. Adds page structure /work doesn't need. | |

**User's choice:** Same as the others, ordered last
**Notes:** Lands as the orphan card on row 4. The badge does the bucketing job.

---

## Tag + Status Surfacing

### Q1: Status color map

| Option | Description | Selected |
|--------|-------------|----------|
| Accent for live, muted greys for the rest | shipped #7c87ff, paper-trading #c8a86a, in-dev #a8a8a8, archived #707070. Editorial-restrained palette. | ✓ |
| Traffic-light (green/amber/blue/grey) | shipped #4ade80 green, paper-trading #fbbf24 amber, in-dev #7c87ff, archived #707070. More familiar but introduces 2 colors outside the locked palette and reads "app-y." | |
| Accent + 3 shades of muted | shipped accent, others varying greys. Most monochromatic but greys are visually almost-identical. | |

**User's choice:** Accent for live, muted greys for the rest
**Notes:** Introduces 2 new color literals (#c8a86a amber + #707070 deep grey) outside the 6-token palette. Documented in CONTEXT.md D-09 as inline-style scoped to badge dot only — NOT promoted to globals.css @theme for v1 to keep token discipline pure.

### Q2: Badge placement

| Option | Description | Selected |
|--------|-------------|----------|
| Top of card, above title | Badge first read, title follows. Status is metadata, title is the name. | ✓ |
| Inline with title (`CapitolLens · ● paper-trading ↗`) | Densest single-line. Dot fights arrow for trailing-edge attention. | |
| Bottom-right corner | Status floats bottom-right. Takes 2 saccades to register status. | |

**User's choice:** Top of card, above title
**Notes:** Cleanest hierarchy — status communicates context BEFORE title carries the name.

### Q3: Tag rendering style

| Option | Description | Selected |
|--------|-------------|----------|
| Plain muted text, comma-separated | `trading, content` in muted Geist Sans 12-13px. No pills. | ✓ |
| Hairline pill chips (matches ChannelButton) | Rounded-rect chips with var(--color-border) border. Adds info-density. | |
| Color-coded text by family | Tags colored to match family. 4 colored values would noise-compete with status dot. | |

**User's choice:** Plain muted text, comma-separated
**Notes:** Quietest, most editorial. Family grouping emerges via visual scanning — 4 "trading" projects in a row reads its own pattern.

### Q4: Status badge text style

| Option | Description | Selected |
|--------|-------------|----------|
| Lowercase, exact schema value | `● shipped`, `● paper-trading`, `● in-dev`, `● archived`. Geist Sans 12-13px, muted. Reads code-aware/dev-honest. | ✓ |
| Capitalized: `● Paper-trading` / `● In-dev` | First-letter caps. `In-dev` looks awkward with hyphenation. | |
| Uppercase + tracked: `● PAPER-TRADING` | Status pill aesthetic. Louder than editorial-restrained wants. | |

**User's choice:** Lowercase, exact schema value
**Notes:** No transformation layer — what's in the data is what renders. Honest.

---

## Project Content + Ordering

### Q1: Canonical href when multiple URLs exist

| Option | Description | Selected |
|--------|-------------|----------|
| Live site/demo if it exists, else repo | Priority: live URL > demo > public repo. Visitor sees the work itself when one exists. | ✓ |
| GitHub repo always (uniformity) | Every card → repo. Predictable but misses live demos. | |
| Mixed per-project, decided in data file | No rule — user picks per project at data-population time. | |

**User's choice:** Live site/demo if it exists, else repo
**Notes:** Wave-0 user-input task surfaces actual URLs per project. archived braehods specifically: until Phase 6 DNS swap, links to current GitHub-Pages-hosted braehods.com; Phase 6 swap to archive snapshot — documented as carry-forward.

### Q2: Page heading

| Option | Description | Selected |
|--------|-------------|----------|
| sr-only h1 'Work', no visible heading | Same pattern as /about. Cards are the page content. WCAG 2.4.6 satisfied via sr-only. | ✓ |
| Visible 'Work' h1 in Fraunces 700 | Display-serif heading. Eats vertical space. Inconsistent with /about. | |
| Visible 'Selected work' / 'Projects' eyebrow in muted Geist Sans | Small muted label as section eyebrow. | |

**User's choice:** sr-only h1 'Work'
**Notes:** Consistent with Phase 3 /about convention. Route name in Nav is enough orientation.

### Q3: Project order

| Option | Description | Selected |
|--------|-------------|----------|
| Manual array order, archived last | Hand-set in data/projects.ts. CapitolLens first (headline trading work), archived braehods last. | ✓ |
| By status: shipped → paper-trading → in-dev → archived | Auto-sorted. Self-organizes but rhythm depends on status mix. | |
| Alphabetical by title | 'archived braehods' would land near start, fights "here's what I'm working on now." | |

**User's choice:** Manual array order, archived last
**Notes:** Manual control = single-file edit to promote a new project to position 1.

### Q4: Description sourcing

| Option | Description | Selected |
|--------|-------------|----------|
| Claude drafts first-pass from memory + project knowledge, user edits in-place | Same pattern as Phase 3 bio (D-01). Memory has rich context for 4 of 7 projects. | ✓ |
| User supplies all 7 descriptions at Wave-0 input task | Like data/channels.ts — full control, more work upfront. | |
| Pull descriptions from each repo's README first line | Auto-import. Brittle — couples /work to repo state. | |

**User's choice:** Claude drafts first-pass from memory, user edits in-place
**Notes:** Mirrors Phase 3 bio drafting pattern. For projects without memory context (prediction-market-bot, no-more-short-form, mc-packet-client) — Claude drafts placeholder + flags for user review at execute-phase checkpoint.

---

## Claude's Discretion

The user accepted the recommended option on every gray area. No "you decide" deferrals were issued, but the following details are left to the planner / executor:

- Exact card padding (`p-5` vs `p-6`) and grid `gap` (`gap-4` vs `gap-6`) — refined against UI-SPEC visual rhythm
- Whether to factor a `<ProjectGrid>` wrapper component or inline the grid container in `app/work/page.tsx`
- Card stagger choreography per-card delay scale (60-80ms increment baseline from Phase 2)
- Whether the `↗` glyph is unicode (U+2197) or inline SVG — depends on cross-font consistency in Fraunces/Geist Sans
- Description placeholder wording for projects without memory context — first-pass + flag for user review
- Whether to add a Phase 4 SUMMARY.md note that /work is the second cross-route consumer of the established Server-Components-only + tile-treatment patterns

---

## Deferred Ideas

- Interactive tag filtering — WORK-04 says visible NOT interactive; v2 candidate
- Per-project thumbnails / preview images — editorial-restrained ethic + LCP discipline; v2 case-study only
- `/work/[slug]` case-study sub-pages — explicit v2 (CASE-01, CASE-02)
- Status-color tokens promoted to `globals.css` `@theme` — v1 ships inline literals; Phase 6 polish may revisit
- Light-mode color tokens for status badges — v1 dark-only (LITE-01 in v2)
- Card-to-modal view-transition seam — irrelevant for v1 (cards link out externally)
- OG image for /work — Phase 6 SEO sweep
- Sort by status / status-grouped subsections — manual array order chosen instead
- Tag-family color-coding — rejected; plain muted text suffices
- Description cliché-scrub spec (mirrors `tests/about-renders.spec.ts`) — optional, planner discretion
- reel-research-agent inclusion (NOT in WORK-06 list, but active per memory) — surface during execute-phase data-population review
- school-planner inclusion (NOT in WORK-06 list, but active per memory) — same treatment as reel-research-agent
