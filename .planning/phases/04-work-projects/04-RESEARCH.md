# Phase 4: Work + Projects — Research

**Researched:** 2026-05-13
**Domain:** Server-Component CSS-Grid card system over typed local data
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Card Visual Treatment**

- **D-01:** Card shape = hairline tile. `1px solid var(--color-border)` (#2a2a2f), padding `p-5` (20px) per UI-SPEC, `rounded` (4px). Mirrors Phase 2 photo treatment family. NOT borderless block. NOT chiang.com text-row list.
- **D-02:** Hover behavior = border accent + arrow translate. Border transitions `var(--color-border)` → `var(--color-accent)` (#7c87ff). Trailing `↗` glyph translates `+2px` right. `transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)]` — explicitly NOT `transition-colors` (Phase 2 lesson: shorthand bleeds into `outline-color` and clobbers `:focus-visible` ring). NO `translateY(-2px)` lift on the card.
- **D-03:** Click target = entire card. Single `<a href={project.href} target="_blank" rel="noopener noreferrer">` wraps all card content. 1 keyboard tab stop per card (7 total).
- **D-04:** Arrow glyph = inline `↗` after the title. `[Title] ↗` (nbsp + arrow). Glyph: U+2197 NORTH EAST ARROW; SVG fallback if unicode reads inconsistently. Color: `var(--color-accent)`. Reserved external-vs-internal semantic — `↗` external, `→` internal (CTAArrowLink reserves `→`).

**Grid + Density**

- **D-05:** Column count = `grid-cols-1` mobile / `md:grid-cols-2` / `lg:grid-cols-2`. NOT 3 columns at lg (would force `max-w-5xl` widening, breaking inherited `max-w-3xl`).
- **D-06:** Orphan-card treatment = left-aligned half-width (default CSS Grid behavior). 7th card sits in left column of row 4; right column empty. NOT centered. NOT spans-2.
- **D-07:** Card height = content-driven, row-aligned via `items-stretch`. Adjacent cards in same row match the taller card's height. NOT fixed-height.
- **D-08:** Archived braehods placement = same card style as the others, ordered last in the array. WORK-01 "equal-weight, no flagship hierarchy" cuts both ways. NOT lower opacity. NOT separate "Archive" subsection with its own h2.

**Tag + Status Surfacing**

- **D-09:** Status-color map (4 status values × 1 dot color):
  - `shipped` → `var(--color-accent)` `#7c87ff`
  - `paper-trading` → `#c8a86a` (muted amber)
  - `in-dev` → `var(--color-muted)` `#a8a8a8`
  - `archived` → `#707070` (deeper muted)
  - **Token discipline:** `#c8a86a` and `#707070` are NEW color literals NOT promoted to `@theme`. Inline-style scoped to badge dot only. Document in `STATUS_DOT_COLOR` constant at top of `ProjectCard.tsx`.
  - All 4 dot colors must clear WCAG AA against both `#1a1a1f` and `#0a0a0a`. The `#707070` on `#1a1a1f` pair is borderline (~3.6:1) — verify on deployed preview, fallback to `#7a7a7a` if it fails.
- **D-10:** Status badge placement = top of card, above title. Read order: `● paper-trading` → `CapitolLens ↗` → description → tags.
- **D-11:** Status badge text style = lowercase, exact schema value verbatim (`shipped` / `paper-trading` / `in-dev` / `archived`). 14px Geist Sans 400, label color `var(--color-muted)` (dot carries the color). NO transformation layer.
- **D-12:** Tag rendering = plain muted text, comma-separated (`tags.join(', ')`). NO pill chips. NO color-coding by family. Geist Sans 14px muted.

**Page Composition + Content**

- **D-13:** Page heading = `sr-only` h1 'Work' + `aria-labelledby="work-heading"` on section landmark per WCAG 2.4.6. NO visible heading.
- **D-14:** Project order = manual array order, archived last. Default sequence: CapitolLens → shorts-factory → meme-dashboard → prediction-market-bot → no-more-short-form → mc-packet-client → archived braehods.
- **D-15:** Description sourcing = Claude drafts first-pass from memory + project knowledge, user edits in-place at execute-phase review checkpoint (mirrors Phase 3 D-01). Each ≤140 chars. Cliché-ban regex from `tests/about-renders.spec.ts` reusable.
- **D-16:** Canonical href waterfall = live URL > demo (Streamlit Cloud, etc.) > public repo URL. Wave-0 user-input task confirms each.

### Claude's Discretion

- Exact card padding (`p-5` vs `p-6`) and grid `gap` (`gap-4` vs `gap-6`) — UI-SPEC refines to `p-5` + `gap-4 md:gap-6`.
- Whether to factor a `ProjectGrid` wrapper or inline grid in `app/work/page.tsx` — UI-SPEC defaults to inlined.
- Card stagger choreography — UI-SPEC locks to per-card `fadeInUp` with `stagger(i)` 80ms increments × 7 cards = ~960ms total.
- Whether `↗` is unicode or inline SVG — default unicode, ship `components/icons/ExternalArrowIcon.tsx` only if visual verification flags glyph inconsistency.
- Description placeholder wording for projects without memory context — first-pass + flag for user review.
- Whether to add a Phase 4 SUMMARY note that /work is the second cross-route consumer of the editorial-tile patterns.

### Deferred Ideas (OUT OF SCOPE)

- Interactive tag filtering — WORK-04 says visible NOT interactive.
- Per-project thumbnails / preview images.
- `/work/[slug]` case-study sub-pages — explicit v2 (CASE-01).
- Status-color tokens promoted to `globals.css` `@theme` — D-09 ships inline only for v1.
- Light-mode color tokens for status badges — v1 dark-only.
- Card-to-modal view-transition seam — no in-site target exists.
- OG image for /work — Phase 6 SEO sweep covers (SEO-03).
- Sort by status / status-grouped subsections — manual array order chosen.
- Tag-family color-coding — rejected.
- Description cliché-scrub spec — optional, planner discretion.
- **reel-research-agent inclusion** — NOT in WORK-06. If user wants to add (per memory: it's an active project), it's an 8th entry that re-evens the grid to 8 cards. Surface during execute-phase data-population review.
- **school-planner inclusion** — NOT in WORK-06. Memory flagged it as an active personal project. Same treatment as reel-research-agent.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WORK-01 | `/work` renders all projects in equal-weight responsive grid (no flagship hierarchy) | CSS Grid `items-stretch` + uniform `<ProjectCard>` markup ensures uniform width/height per row; `tests/work-no-flagship.spec.ts` enforces |
| WORK-02 | Project entries sourced from typed `data/projects.ts` with title, description, tags, status, primary URL | Existing Zod schema covers exactly these fields (already shipped Phase 1); empty `projects: Project[] = []` array awaits population |
| WORK-03 | Status badges (shipped / paper-trading / in-dev / archived) render as colored dot + label | `STATUS_DOT_COLOR` constant map per D-09; dot is `aria-hidden`, label carries info |
| WORK-04 | Tag taxonomy supports filtering OR visual grouping (trading, content, tools, archived) — even if not interactive in v1, tags are visible | `tags.join(', ')` plain muted text per D-12; visual scanning surfaces the family-grouping pattern (4 trading projects in a row reads its own pattern) |
| WORK-05 | Each card links out to repo / site / video; no in-site case-study pages in v1 | Single `<a target="_blank" rel="noopener noreferrer">` per card per D-03; canonical href waterfall per D-16; `/work/[slug]` route NOT reserved |
| WORK-06 | Initial project list seeded: CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, plus archived braehods reference | 7 entries hard-coded in default array order per D-14; Wave-0 user-input task confirms each href |
| A11Y-05 | Color is never the only state indicator (badges have label text, not just colored dots) | Every status badge is `<span aria-hidden dot /> + <span text label />`; spec asserts both elements present per `tests/work-status-badges.spec.ts` |
</phase_requirements>

## Summary

Phase 4 ships the `/work` route — replacing the Phase 2 `Coming soon.` stub with an equal-weight 7-card responsive grid sourced from typed `data/projects.ts`. Every architectural decision the research must validate is already locked by `04-CONTEXT.md` (D-01..D-16) and `04-UI-SPEC.md` (component contract, grid layout, status-color map, motion choreography). This research's job is NOT to invent — it is to **verify the locked contract is implementable on the actual stack and surface the deterministic open questions the planner must close.**

The phase introduces zero new dependencies, zero new tokens promoted to `@theme`, zero new motion keyframes, zero new fonts, and zero `'use client'`. Two new files (`components/work/ProjectCard.tsx` and a body rewrite of `app/work/page.tsx`), the 7-entry population of `data/projects.ts`, and 3 new Playwright spec files. The `<ProjectGrid>` wrapper is optional and defaults to inlined per UI-SPEC. The pattern model is the Phase 2 `<ChannelButton>` (hairline-tile + hover-border-translate) translated to card scale, with the Phase 2 `<CTAArrowLink>` (accent text + group-hover translate arrow) inlined as the card's title row.

**Primary recommendation:** Plan as a single 1-plan / 4-wave phase: **W0** = data + spec stubs (RED), **W1** = `<ProjectCard>` component, **W2** = `app/work/page.tsx` rewrite (composes the grid + spec stubs flip to GREEN), **W3** = deploy + visual verify on Vercel preview. Mirror the Phase 2 wave cadence. The single non-deterministic question the planner MUST close at Wave 0 is **whether to add `reel-research-agent` and/or `school-planner` to the array** — the answer is binary and changes downstream task structure (8 cards re-evens the grid, 7 leaves the orphan).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Project data definition + validation | Build-time / typed module (`data/projects.ts`) | — | Locked Phase 1 schema; no runtime fetch, no DB. Zod validates at import time if any consumer wraps `Project.parse(entry)` (currently uses TS type only). |
| Card rendering (HTML markup, hairline border, status dot, title, description, tags) | Frontend Server (RSC) | — | FOUND-07 / D-25 invariant: zero `'use client'`. Pure server-rendered output. No state, no event handlers. |
| Grid layout (`grid-cols-1` mobile, `md:grid-cols-2`, `items-stretch`, gap discipline) | Browser CSS engine | — | Native CSS Grid; no JS layout primitives. Tailwind v4 utility classes compile to plain CSS. |
| Hover-state animation (border-color transition + arrow translate) | Browser CSS engine | — | Native `transition-[…]` + `:hover` pseudo-class + `group-hover:` Tailwind. No JS event listeners. |
| Stagger-on-load animation (per-card `fadeInUp`) | Browser CSS engine | — | `@keyframes fade-in-up` already shipped Phase 1; `--stagger` CSS custom property set via inline style on `<li>` wrapper. |
| External-link routing (`target="_blank"`) | Browser navigation | — | Plain `<a>` tag (NOT `next/link`); browser handles new-tab semantics + `noopener` tabnabbing prevention. |
| Focus ring (`:focus-visible`) | Browser CSS engine | — | Phase 1 global rule applies automatically to each `<a>`. |
| Reduced-motion override | Browser CSS engine | — | Phase 1 global `@media (prefers-reduced-motion: reduce)` block defeats stagger + hover transitions. |
| Spec gating (WORK-01..06, A11Y-05) | Build-time / Playwright suite | CI (Vercel preview) | 3 new spec files + optional 4th cliché-scrub spec; runs in CI against deployed preview per Phase 1 W4-T2 lesson. |
| OG metadata + JSON-LD for /work | Frontend Server (RSC) | — | Out of Phase 4 scope — Phase 6 SEO sweep owns. Phase 4 keeps existing `metadata = { title: 'Work' }` from Plan 02-05. |

## Standard Stack

### Core (Inherited — already installed, no changes)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.6 | App Router, RSC, file-based routing | [VERIFIED: package.json] Locked Phase 1 |
| React | 19.2.4 | UI runtime | [VERIFIED: package.json] Locked Phase 1 (note: package.json pins 19.2.4, drift from research-recommended 19.2.6 — within spec, no impact on Phase 4) |
| TypeScript | 5.9.3 | Type safety | [VERIFIED: package.json] Locked Phase 1 |
| Tailwind CSS | 4.3.0 | Utility CSS + `@theme` design tokens | [VERIFIED: package.json] Locked Phase 1 (slight drift from STACK.md 4.2.4 — minor patch, no impact on Phase 4) |
| Zod | 4.4.3 | `Project` schema runtime validation | [VERIFIED: package.json + data/projects.ts:1] Already imported by `data/projects.ts`; no new usage required (schema is locked, only the array literal is populated) |

### Supporting (Inherited — Phase 4 references but does not import new)

| Library | Version | Purpose | Phase 4 Use |
|---------|---------|---------|-------------|
| `@vercel/analytics` | 2.0.1 | Pageviews | Auto-attached via root layout — no Phase 4 work |
| `@vercel/speed-insights` | 2.0.0 | RUM Lighthouse | Auto-attached — no Phase 4 work |
| `geist` | 1.7.0 | Geist Sans / Mono | Card title + description + tags + label all use Geist Sans 400 via `var(--font-sans)` |
| `lucide-react` | 1.14.0 | Icon set | **NOT consumed on /work cards** per UI-SPEC § Design System. The `↗` external arrow is Unicode; brand icons remain inline-SVG via `components/icons/{Github,Instagram}Icon.tsx` for Footer chrome only. [VERIFIED: lucide@1.14.0 still missing brand icons — `node -e "console.log(require('lucide-react').Instagram)"` returns `undefined` 2026-05-13] |
| `@playwright/test` | ^1.59.1 | Spec runner | 3 new spec files added in Wave 0 |

### NOT Used (Phase 4 explicit non-imports)

| Would Be | Why Not |
|----------|---------|
| `next/link` on cards | All card destinations are external (`target="_blank"`); plain `<a>` is correct. `next/link` would add prefetch overhead for URLs that will never be in-app. |
| `next/image` on cards | Phase 4 has no card images — editorial-restraint ethic per CONTEXT.md `<deferred>`; the only images on the site are home + about portrait. |
| `'use client'` directive | FOUND-07 invariant; D-25 inherited; nothing on /work needs client interactivity (hover is CSS, focus ring is CSS, stagger is CSS keyframe). |
| `@vercel/og` | Out of Phase 4 — Phase 6 SEO sweep owns OG image generation per SEO-03. |
| `tailwind-merge` / `clsx` | Not needed — no dynamic class composition; static template strings suffice. |
| Any modal/dialog primitive | No interactivity beyond external links; no `<dialog>` needed. |
| Any new `lucide-react` brand icon import | Verified absent at runtime [VERIFIED: 2026-05-13]. |

### Version Verification (executed 2026-05-13)

```
node --version       → v24.14.0 [VERIFIED]
package.json pins:
  next               → 16.2.6 [VERIFIED]
  react              → 19.2.4 [VERIFIED]
  react-dom          → 19.2.4 [VERIFIED]
  typescript         → 5.9.3 [VERIFIED]
  tailwindcss        → 4.3.0 [VERIFIED]
  @tailwindcss/postcss → 4.3.0 [VERIFIED]
  zod                → 4.4.3 [VERIFIED]
  @playwright/test   → ^1.59.1 [VERIFIED]
  lucide-react       → 1.14.0 [VERIFIED — brand icons absent]
```

**Installation:** none required. Phase 4 introduces zero new packages.

## Architecture Patterns

### System Architecture Diagram

```
                    Browser request: GET /work
                              │
                              ▼
              ┌────────────────────────────────┐
              │  Next.js App Router (RSC)      │
              │  app/layout.tsx (Server)       │
              │   ├─ <Nav />  (Server)         │
              │   └─ <main max-w-3xl>          │
              │       └─ <WorkPage />          │
              └──────────────┬─────────────────┘
                             │
                             ▼
              ┌────────────────────────────────┐
              │  app/work/page.tsx (Server)    │
              │   - imports data/projects.ts   │
              │   - imports lib/motion.ts      │
              │   - imports ProjectCard        │
              │                                │
              │   <section aria-labelledby>    │
              │     <h1 sr-only>Work</h1>      │
              │     <ul grid items-stretch>    │
              │       {projects.map …}         │
              │     </ul>                      │
              │   </section>                   │
              └──────────────┬─────────────────┘
                             │ for each project (1..7):
                             ▼
              ┌────────────────────────────────┐
              │  <li class={fadeInUp}          │
              │      style={stagger(i+1)}>     │
              │   ┌──────────────────────────┐ │
              │   │ <ProjectCard project={}  │ │
              │   │              staggerIdx> │ │
              │   │  Server Component        │ │
              │   │   <a target="_blank">    │ │
              │   │     <span dot/><label>   │ │  ← status badge
              │   │     <div>title ↗</div>   │ │  ← title + arrow
              │   │     <p>description</p>   │ │
              │   │     <p>tag, tag</p>      │ │
              │   │   </a>                   │ │
              │   └──────────────────────────┘ │
              │  </li>                         │
              └──────────────┬─────────────────┘
                             │
                             ▼
              ┌────────────────────────────────┐
              │  Static HTML response          │
              │  (no client JS, no hydration)  │
              │                                │
              │  CSS handles:                  │
              │   - grid layout                │
              │   - hairline border + hover    │
              │     border-color transition    │
              │   - per-card fadeInUp keyframe │
              │   - focus-visible accent ring  │
              │   - reduced-motion override    │
              └────────────────────────────────┘
                             │
                             ▼
                    User clicks card
                             │
                             ▼
              Browser opens project.href in NEW TAB
              (target="_blank" rel="noopener noreferrer")
```

### Recommended Project Structure (delta from current)

```
app/
├── work/
│   └── page.tsx              # REWRITE — replaces 18-line Plan 02-05 stub
└── layout.tsx                # UNCHANGED — Nav + Footer chrome inherited

components/
├── work/                     # NEW directory
│   └── ProjectCard.tsx       # NEW — single card; Server Component
│   (ProjectGrid.tsx)         # OPTIONAL per UI-SPEC; default = inline in page.tsx
├── home/                     # UNCHANGED (Phase 2 atoms)
├── icons/                    # UNCHANGED (GitHub + Instagram inline SVGs)
└── layout/                   # UNCHANGED

components/icons/
└── (ExternalArrowIcon.tsx)   # OPTIONAL FALLBACK — only if Unicode `↗` reads inconsistently

data/
└── projects.ts               # POPULATE — empty array → 7 (or 8) entries; schema unchanged

tests/
├── work-grid-renders.spec.ts       # NEW — WORK-01, WORK-06 (count + presence)
├── work-status-badges.spec.ts      # NEW — WORK-03, A11Y-05 (dot + label both present, color match)
├── work-no-flagship.spec.ts        # NEW — WORK-01 (equal-weight via clientWidth comparison)
└── work-descriptions-cliche-scrub.spec.ts  # OPTIONAL — D-15 (mirrors about-renders cliché regex)
```

### Pattern 1: Hairline-Tile Card (D-01, D-02 — translated from Phase 2 ChannelButton)

**What:** Card-scale version of the Phase 2 `<ChannelButton>` hairline-pill pattern. 1px border, transparent fill (gradient shows through), corner radius, hover transitions border-color to accent without any layout shift.

**When to use:** Any external-link tile that needs to feel like part of the editorial-tile family (currently: home photo, channel buttons, project cards).

**Example:**
```tsx
// Source: components/home/ChannelButton.tsx (verified — line 78)
// Phase 4 adapts this pattern at card scale (block, not inline-flex; p-5, not px-4 py-3)
<a
  href={project.href}
  target="_blank"
  rel="noopener noreferrer"
  className="group block h-full p-5 rounded border border-[var(--color-border)] transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)]"
>
  {/* card body */}
</a>
```

### Pattern 2: Per-Card Stagger via `<li>` Wrapper (D-22 / Phase 2 ChannelButtonRow precedent)

**What:** `fadeInUp` class + `stagger(i)` style live on the `<li>` wrapper, NOT on the inner `<a>`. Separates animation seam from interactive element so hover transitions don't collide with keyframe end-state.

**When to use:** Any list/grid where each item needs a staggered entrance AND an independent hover state.

**Example:**
```tsx
// Source: components/home/ChannelButtonRow.tsx pattern + UI-SPEC § Motion Choreography
import { fadeInUp, stagger } from '@/lib/motion';

{projects.map((project, i) => (
  <li
    key={project.slug}
    className={fadeInUp}
    style={stagger(i + 1)}
  >
    <ProjectCard project={project} staggerIndex={i + 1} />
  </li>
))}
```

### Pattern 3: Decorative Dot + Semantic Label (A11Y-05 enforcement)

**What:** Status badge composed of `<span aria-hidden>` (color-bearing dot) + `<span>` (text label). Color is supplementary; label is the source of truth.

**When to use:** Any badge where color encodes state — A11Y-05 mandates the label-not-just-color pattern across the entire site.

**Example:**
```tsx
// Source: UI-SPEC § ProjectCard component lines 271-273
const STATUS_DOT_COLOR: Record<Project['status'], string> = {
  'shipped':       'var(--color-accent)',
  'paper-trading': '#c8a86a',
  'in-dev':        'var(--color-muted)',
  'archived':      '#707070',
};

<div className="flex items-center gap-2">
  <span
    aria-hidden
    className="inline-block w-1.5 h-1.5 rounded-full"
    style={{ backgroundColor: STATUS_DOT_COLOR[project.status] }}
  />
  <span className="text-sm font-sans" style={{ color: 'var(--color-muted)' }}>
    {project.status}
  </span>
</div>
```

### Pattern 4: sr-only h1 + aria-labelledby Landmark (D-13 — inherited from Phase 3)

**What:** Section landmark named by an `sr-only` heading. Visually hidden, screen-reader accessible, satisfies WCAG 2.4.6.

**When to use:** Pages where the visible content (cards, gallery) IS the page; no display heading is needed.

**Example:**
```tsx
// Source: Phase 3 D-13 inheritance (about-page; no Tailwind sr-only utility yet — uses className="sr-only")
<section
  data-test="work-section"
  aria-labelledby="work-heading"
  className="py-8 md:py-12"
>
  <h1 id="work-heading" className="sr-only">Work</h1>
  {/* grid */}
</section>
```

**Note on `sr-only`:** Tailwind v4 ships `sr-only` as a built-in utility (verified in Phase 3 — works on `app/about/page.tsx` already). No custom CSS needed.

### Pattern 5: External Link with Tabnabbing Prevention (D-03)

**What:** Every external `<a>` carries `target="_blank" rel="noopener noreferrer"`. Plain `<a>` (NOT `next/link`) — Next.js prefetch is wasted on external destinations.

**When to use:** All external links project-wide.

**Example:**
```tsx
// Source: components/home/ChannelButton.tsx line 75-78 (verified)
<a
  href={project.href}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
```

### Anti-Patterns to Avoid

- **`transition-colors` (Tailwind v4 shorthand):** Includes `outline-color` in property list. Combined with `:focus-visible` accent ring causes 200ms-interpolation from inherited muted to accent on Tab. **Fix:** narrow to `transition-[border-color,color,transform]` arbitrary list (Phase 2 Plan 02-04 lesson; mirrored in Footer.tsx + SocialIconLink.tsx).
- **Promoting `#c8a86a` / `#707070` to `@theme`:** D-09 explicitly forbids for v1. Inline-style scope keeps the global 6-token palette pure. Phase 6 may revisit if status badges propagate elsewhere.
- **Uppercase / capitalized status labels:** D-11 mandates verbatim lowercase from schema. No `In-dev`, no `PAPER-TRADING`. The schema string IS the label.
- **Tag pills with background fill:** D-12 mandates plain comma-joined muted text. Pills add info-density that fights restraint.
- **`translateY(-2px)` card lift on hover:** D-02 explicit reject. Reads more app-y than editorial; conflicts with `items-stretch` row alignment.
- **`next/link` on external destinations:** Wasted prefetch overhead; plain `<a>` is correct.
- **3-column grid at lg:** D-05 reject. Forces `max-w-5xl` widening, breaks inherited `max-w-3xl` from Phase 3.
- **Centering or full-spanning the orphan card:** D-06 reject. Default left-align is the design.
- **Lower opacity / smaller font on archived:** D-08 reject. Equal-weight cuts both ways.
- **Status-grouped subsections with their own h2:** D-08 + D-14 reject. Status badge does the bucketing inline.
- **Per-project thumbnails:** Out of scope per CONTEXT.md `<deferred>`.
- **`/work/[slug]` route reservation:** WORK-05 explicit; v2 territory (CASE-01).
- **`'use client'` directive:** FOUND-07 invariant. Will fail `tests/no-client-components.spec.ts`.
- **Reading `STATUS_DOT_COLOR[project.status]` without TS noUncheckedIndexedAccess guard:** TS strict + `noUncheckedIndexedAccess` (enabled per Phase 1) requires `?? FALLBACK` or assertion. The `Record<Project['status'], string>` type makes lookup total — but planner should verify the lookup compiles cleanly under the project's `tsconfig.json` strict settings.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Equal-height cards across rows | Manual `min-height: 200px` or JS `ResizeObserver` | CSS Grid `items-stretch` (D-07) | GPU-cheap native browser feature; zero JS; reflows correctly on 200% zoom |
| Stagger choreography | Per-card `setTimeout` + `useEffect` | Existing `lib/motion.ts` `stagger(i)` + `fade-in-up` keyframe | Already shipped Phase 1; CSS-only; respects reduced-motion via global override |
| Card hover state | JS `onMouseEnter` + state | CSS `:hover` + Tailwind `hover:` | Server Component compatible; no client JS; defeated by reduced-motion automatically |
| External-link new-tab + tabnabbing | Custom `onClick` handler | Plain `<a target="_blank" rel="noopener noreferrer">` | Native browser behavior; no event listeners; works without JS |
| Focus ring | Custom focus state styling | Phase 1 global `*:focus-visible` rule | Already shipped; matches every other interactive element on the site |
| Reduced-motion override | Per-component `@media` queries | Phase 1 global `@media (prefers-reduced-motion: reduce)` block | Already shipped (`app/globals.css` lines 53-63); covers stagger + hover + arrow translate uniformly |
| Status-color mapping logic | `if/else` chain or `switch` | `Record<Project['status'], string>` constant lookup | TS-checked totality; planner can extend in one place if a 5th status is added v2 |
| Cliché-scrub on descriptions | Hand-write banned-word list | Reuse the regex from `tests/about-renders.spec.ts` | Identical voice contract; one source of truth; ABOUT-01 already enforces it |
| External arrow glyph | Hand-author SVG path | Unicode `↗` (U+2197) | Inline character; zero asset weight; SVG fallback documented if cross-font reads inconsistent |
| `<ul>` default styling reset | Override individually | Tailwind `list-none p-0` on the grid container | UI-SPEC line 203 already specifies; standard pattern |

**Key insight:** Phase 4 is almost entirely a composition exercise. Every primitive it needs (CSS Grid, hairline border, focus ring, stagger, reduced-motion, external-link semantics, Server Components) is already shipped by Phases 1-2. The custom code surface is small: 1 new component (~80 lines), 1 page rewrite (~30 lines), 1 data array population (7 × ~5 lines = ~35 lines), 3 new spec files. The risk profile is low; the discipline is in HONORING the locked contract, not in inventing new patterns.

## Runtime State Inventory

> Phase 4 is a greenfield phase (new component, new page, new data entries). It does NOT rename, refactor, or migrate any existing system. **This section is intentionally minimal — included only for completeness.**

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None — `data/projects.ts` is currently empty array `[]`; Phase 4 populates the literal in source. No DB, no localStorage, no IndexedDB. | None — first-write of source literal is not a migration |
| Live service config | None — no external service configuration involved. Vercel project metadata unchanged. | None |
| OS-registered state | None — no OS-level registrations. | None |
| Secrets/env vars | None — Phase 4 introduces no env vars; existing `NEXT_PUBLIC_FORMSPREE_ID` is Phase 5 territory. | None |
| Build artifacts | None new. The `.next/` build output naturally regenerates with the new page route. No stale artifacts. | None |

**Edge case to watch:** When the user populates `data/projects.ts` at Wave 0, Zod schema validation is currently TYPE-only (line 14: `export type Project = z.infer<typeof Project>`). The literal array is type-checked at compile time but NOT runtime-validated unless someone wraps `Project.parse(entry)`. Planner discretion: optionally add a build-time validation step (e.g., a unit test that `Project.parse()` each entry) so a bad URL string fails CI rather than silently breaking at render. **Documented as a planner micro-decision, not a blocker.**

## Common Pitfalls

### Pitfall 1: `transition-colors` clobbers focus ring (Phase 2 Plan 02-04 lesson)

**What goes wrong:** Tailwind v4's `transition-colors` shorthand transitions `outline-color` in addition to `color`/`border-color`. With Phase 1's `*:focus-visible { outline: 2px solid var(--color-accent); }` global rule, a Tab focus on an element using `transition-colors` causes the 2px ring to interpolate from the inherited muted color (currentColor default) to accent over 200ms — visible as a flash of muted ring on first focus.
**Why it happens:** Tailwind v4 expanded the `transition-colors` property list to include `outline-color`; the Phase 1 spec `tests/focus-ring.spec.ts` captures `getComputedStyle.outline` at the first frame after Tab.
**How to avoid:** Use `transition-[border-color,color,transform]` (arbitrary single-property list) on every `:focus-visible`-enabled element where hover transitions a color. UI-SPEC line 256 + 265 already mandate this. **Spec verifies via Phase 1's `tests/focus-ring.spec.ts` regression guard — if it goes RED on /work, the planner has used `transition-colors` somewhere on `ProjectCard.tsx`.**
**Warning signs:** `tests/focus-ring.spec.ts` regression on the /work route after Wave 1.

### Pitfall 2: `#707070` archived dot fails contrast on `#1a1a1f` gradient top

**What goes wrong:** `#707070` on `#1a1a1f` measures ~3.6:1 (UI-SPEC line 167). WCAG AA UI-element minimum is 3.0:1 — passes by 0.6, but the grain layer (`opacity 0.04 mix-blend-mode: overlay`) MAY drop it under threshold on real-device verification.
**Why it happens:** The deepest grey (`archived`) chosen for visual register ("past") sits closest to the gradient-top background; grain interaction is unpredictable until measured on the deployed preview.
**How to avoid:** Documented fallback in CONTEXT.md `<specifics>` and UI-SPEC: bump to `#7a7a7a` or `#808080` if the deployed preview WebAIM check fails. **Wave-0 verification gate must include a manual contrast check on the deployed preview — NOT the local dev server (grain rendering may differ).**
**Warning signs:** WebAIM contrast checker shows `#707070`-on-`#1a1a1f` at <3.0:1 with grain layer applied.

### Pitfall 3: Lucide brand-icons missing (Phase 2 Plan 02-03 lesson)

**What goes wrong:** `lucide-react@1.14.0` does NOT export `Instagram`, `Github`, `Youtube`, or any brand glyph (verified at runtime 2026-05-13: `node -e "console.log(require('lucide-react').Instagram)"` returns `undefined`). Lucide upstream stripped brand icons in 2024 over trademark concerns.
**Why it happens:** The CLAUDE.md "Supporting Libraries" table still references `lucide-react` brand icons — outdated. Memory file `reference_lucide_brand_icons.md` documents the workaround.
**How to avoid:** Phase 4 does NOT consume any lucide-react import (no brand icons on /work cards — UI-SPEC line 39). The `↗` arrow glyph is Unicode (or inline SVG fallback). If the planner ever wants a per-card icon (which is out of scope per CONTEXT.md `<deferred>`), use the `components/icons/` inline-SVG pattern.
**Warning signs:** ANY `import { ... } from 'lucide-react'` in `components/work/*` files. Build will fail with `undefined` symbol.

### Pitfall 4: `next/link` external-href accessibility quirk

**What goes wrong:** Using `<Link target="_blank">` works but adds Next.js prefetch overhead for URLs that will never be in-app. Worse, some Next.js versions don't pass `rel` correctly through `<Link>` — tabnabbing prevention may be silently dropped.
**Why it happens:** `next/link` is designed for in-app navigation; external URLs bypass its routing benefits.
**How to avoid:** Plain `<a target="_blank" rel="noopener noreferrer">` on every card (D-03 + UI-SPEC line 205). Mirrors Phase 2 ChannelButton pattern (line 74-78).
**Warning signs:** `import Link from 'next/link'` in `components/work/ProjectCard.tsx`.

### Pitfall 5: Animation collision on hover-translated arrow

**What goes wrong:** If `fadeInUp` is applied directly to the `<a>` (the card root) AND the arrow has `group-hover:translate-x-0.5`, the keyframe's `transform: translateY(0)` end-state competes with the arrow's `translate-x` on hover. Mid-keyframe hover may produce visual glitches.
**Why it happens:** Browser transform composition; the `transform` property holds one value at a time.
**How to avoid:** Apply `fadeInUp` + `stagger(i)` on the `<li>` wrapper (NOT on the `<a>`). The arrow translate lives on a child `<span>` (NOT on the `<a>`). Both transforms are on independent elements — no collision possible. Mirrors Phase 2 ChannelButtonRow precedent (verified in `02-03-SUMMARY.md` "Animation-collision verification" section). UI-SPEC line 204 + 277 already mandate this split.
**Warning signs:** Visible flicker on hover during the 80-960ms stagger window after page load.

### Pitfall 6: `items-stretch` requires `h-full` on the inner `<a>`

**What goes wrong:** With `items-stretch` on the `<ul>` and the `<a>` lacking `h-full`, the card content sits at the top of its stretched `<li>` cell with empty space below. The hairline border is drawn around the `<a>`'s natural height, not the cell — looks like the row-equalization didn't fire.
**Why it happens:** `items-stretch` sizes the grid item (`<li>`) to the row height, but the `<a>` inside is content-sized unless told otherwise.
**How to avoid:** UI-SPEC line 256 already mandates `h-full` on the `<a>` so it fills its stretched `<li>`. Spec `tests/work-no-flagship.spec.ts` should compare `clientHeight` of the `<a>` (not the `<li>`) to ensure the visual border matches the stretched cell.
**Warning signs:** Visual gap between card border bottom and the `<li>` cell bottom on rows where one card is taller.

### Pitfall 7: Vercel preview vs production alias confusion (Phase 1 W4-T2 lesson)

**What goes wrong:** Running Playwright specs against `https://braeden-site.vercel.app` (Vercel's PRODUCTION alias) instead of the per-branch preview URL. The production alias serves a stale cache (Phase 1 measured `Age: 160062`, ~44h old).
**Why it happens:** Convenience — the production alias is a stable URL; the branch-preview URL changes per push.
**How to avoid:** ALWAYS use the per-branch preview URL from Vercel dashboard → Deployments → most recent. Documented in STATE.md "Preview URL correction." Wave-3 verification protocol must explicitly request the actual preview URL from the user.
**Warning signs:** Spec results disagreeing with local + recent commit content.

### Pitfall 8: First-card stagger gates LCP

**What goes wrong:** The `fade-in-up` keyframe `from { opacity: 0 }` means the first card's content is invisible until ~80ms after page interactive. If LCP is measured during this window, the audit reports a non-LCP candidate.
**Why it happens:** /work has no image LCP; the first card's title/badge IS the LCP candidate. Stagger 80ms + 400ms fade = up to ~480ms before fully painted.
**How to avoid:** UI-SPEC line 110-111 documents the fallback: ship the FIRST ProjectCard without `fadeInUp` (cards 2-7 still stagger). Planner's call. Phase 4 doesn't own LCP audit (Phase 6 does), but if `tests/photo-lcp.spec.ts` style spec is extended to /work, the first-card stagger may need to drop. **Recommendation:** ship with stagger on all 7 cards (motion-equivalence with Phase 2 hero); revisit in Phase 6 if Lighthouse flags.
**Warning signs:** Phase 6 Lighthouse audit reports /work LCP > 2.5s on mobile.

## Code Examples

### Example 1: Complete ProjectCard.tsx (planner reference)

```tsx
// components/work/ProjectCard.tsx
// Source: 04-UI-SPEC.md § ProjectCard component (D-01..D-04, D-09..D-12).
//
// Server Component (NO 'use client' — FOUND-07 / D-25 inherited). Hairline-tile
// card-scale version of components/home/ChannelButton.tsx, but block-display
// (full card click target per D-03) and content-driven height (items-stretch
// row alignment per D-07).
//
// Two color literals (#c8a86a, #707070) live as inline-style on the dot only
// per D-09 token discipline — NOT promoted to globals.css @theme.
//
// Transition discipline: transition-[border-color,color,transform] (NOT
// transition-colors) per Phase 2 Plan 02-04 Rule 1 lesson — Tailwind v4's
// shorthand includes outline-color and would clobber the focus ring.

import type { Project } from '@/data/projects';

const STATUS_DOT_COLOR: Record<Project['status'], string> = {
  'shipped':       'var(--color-accent)', // #7c87ff (token)
  'paper-trading': '#c8a86a',             // muted amber (D-09 inline literal)
  'in-dev':        'var(--color-muted)',  // #a8a8a8 (token)
  'archived':      '#707070',             // deep grey (D-09 inline literal)
};

interface ProjectCardProps {
  project: Project;
  staggerIndex: number; // 1..7 — caller owns stagger choreography
}

export function ProjectCard({ project, staggerIndex: _staggerIndex }: ProjectCardProps) {
  // staggerIndex prefixed with _ — currently unused inside the component
  // (the wrapper <li> carries the animation per Pitfall 5). Pass anyway for
  // forward-compat if a future iteration moves animation onto a card-internal
  // element.

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full p-5 rounded border border-[var(--color-border)] transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)]"
    >
      {/* 1. Status badge (D-10 — top of card) */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: STATUS_DOT_COLOR[project.status] }}
        />
        <span className="text-sm font-sans" style={{ color: 'var(--color-muted)' }}>
          {project.status}
        </span>
      </div>

      {/* 2. Title + arrow (D-04, D-11) */}
      <div
        className="mt-4 text-base font-sans"
        style={{ color: 'var(--color-text)' }}
      >
        {project.title}
        {' '}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5"
          style={{ color: 'var(--color-accent)' }}
        >
          ↗
        </span>
      </div>

      {/* 3. Description (D-15 — drafted at execute time, ≤140 chars) */}
      <p
        className="mt-2 text-sm font-sans"
        style={{ color: 'var(--color-text)' }}
      >
        {project.description}
      </p>

      {/* 4. Tags (D-12 — plain comma-joined muted text) */}
      <p
        className="mt-2 text-sm font-sans"
        style={{ color: 'var(--color-muted)' }}
      >
        {project.tags.join(', ')}
      </p>
    </a>
  );
}
```

### Example 2: app/work/page.tsx rewrite (planner reference)

```tsx
// app/work/page.tsx
// Source: 04-UI-SPEC.md § Page Composition (D-05, D-06, D-07, D-13).
//
// Replaces the Plan 02-05 "Coming soon." stub. Server Component (zero
// 'use client' — FOUND-07 / D-25). Inherits Nav + Footer chrome from
// app/layout.tsx automatically. Inherits max-w-3xl mx-auto px-6 py-16 lg:px-12
// container from app/layout.tsx — does NOT extend to max-w-5xl.
//
// Grid: grid-cols-1 mobile / md:grid-cols-2 desktop / items-stretch row
// equalization per D-05 + D-07. The 7th card (archived braehods) sits in
// row 4 left column with row 4 right column empty — the orphan-card
// treatment per D-06. No special markup needed; default CSS Grid behavior.
//
// Stagger: per-card fadeInUp on the <li> wrapper (NOT on the inner <a>) per
// Phase 2 ChannelButtonRow precedent — separates animation seam from hover
// transition to avoid transform collision.

import { fadeInUp, stagger } from '@/lib/motion';
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/work/ProjectCard';

export const metadata = { title: 'Work' };

export default function WorkPage() {
  return (
    <section
      data-test="work-section"
      aria-labelledby="work-heading"
      className="py-8 md:py-12"
    >
      <h1 id="work-heading" className="sr-only">Work</h1>
      <ul
        data-test="work-grid"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 items-stretch list-none p-0"
      >
        {projects.map((project, i) => (
          <li
            key={project.slug}
            className={fadeInUp}
            style={stagger(i + 1)}
          >
            <ProjectCard project={project} staggerIndex={i + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### Example 3: data/projects.ts populated (planner reference — Wave 0 user confirms)

```ts
// data/projects.ts
import { z } from 'zod';

export const ProjectStatus = z.enum(['shipped', 'paper-trading', 'in-dev', 'archived']);
export const ProjectTag = z.enum(['trading', 'content', 'tools', 'archived']);

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().max(140),
  tags: z.array(ProjectTag),
  status: ProjectStatus,
  href: z.string().url(),
});
export type Project = z.infer<typeof Project>;

// Order locked per D-14: CapitolLens leads (current trading focus); archived
// braehods sits last (becomes the orphan card on row 4 per D-06).
// Wave-0 user-input task confirms each href before commit.
// CapitolLens description MUST contain "paper-only" or "paper-traded"
// per memory feedback_capitollens_auto_follow.md + ABOUT-01 cliché-scrub
// principle.
export const projects: Project[] = [
  {
    slug: 'capitollens',
    title: 'CapitolLens',
    description: 'Form 4 insider-buy signal scanner — paper-traded, 180-day hold, +18%/yr backtest.', // ~92 chars
    tags: ['trading', 'tools'],
    status: 'paper-trading',
    href: 'https://github.com/bwaeden/capitollens', // user confirms at Wave 0
  },
  // ... 6 more entries ...
];
```

### Example 4: Spec file — work-grid-renders.spec.ts (planner reference)

```ts
/**
 * WORK-01, WORK-02, WORK-06: /work renders all 7 (or 8 if reel-research-agent
 * added) projects in an equal-weight responsive grid sourced from typed
 * data/projects.ts. Each card has the hairline-tile structure: status badge
 * (dot + label) + title + description + tags.
 *
 * RED until Phase 4 Wave 2 lands the body rewrite of app/work/page.tsx +
 * the populated data/projects.ts.
 */
import { test, expect } from '@playwright/test';

test('WORK-01, WORK-06: /work renders 7 ProjectCards in the grid', async ({ page }) => {
  await page.goto('/work');

  const section = page.locator('[data-test="work-section"]');
  await expect(section).toHaveCount(1);

  const grid = page.locator('[data-test="work-grid"]');
  await expect(grid).toHaveCount(1);

  const cards = grid.locator('> li');
  await expect(cards, 'expected 7 ProjectCards (or 8 if reel-research-agent added)').toHaveCount(7);
});

test('WORK-02: each card sources from data/projects.ts schema (title + description + tags + status + href)', async ({ page }) => {
  await page.goto('/work');
  const cards = page.locator('[data-test="work-grid"] > li');
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    // Each card has an <a> wrapping the body
    await expect(card.locator('a[target="_blank"]')).toHaveCount(1);
    // Each card has a status badge (label visible)
    await expect(card.locator('text=/^(shipped|paper-trading|in-dev|archived)$/')).toHaveCount(1);
  }
});
```

### Example 5: Spec file — work-status-badges.spec.ts (planner reference)

```ts
/**
 * WORK-03, A11Y-05: Status badges render as colored dot + label, never
 * color-only. Each card's badge contains BOTH a decorative <span> dot AND
 * a <span> label with the verbatim schema status text.
 */
import { test, expect } from '@playwright/test';

test('WORK-03, A11Y-05: every card has status dot + label (color-not-only-indicator)', async ({ page }) => {
  await page.goto('/work');
  const cards = page.locator('[data-test="work-grid"] > li');
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    // Decorative dot — aria-hidden
    const dot = card.locator('span[aria-hidden].rounded-full').first();
    await expect(dot, `card ${i}: status dot must be present + aria-hidden`).toHaveCount(1);
    // Label — visible text matching schema enum
    const label = card.locator('text=/^(shipped|paper-trading|in-dev|archived)$/').first();
    await expect(label, `card ${i}: status label must be visible text matching schema enum`).toHaveCount(1);
  }
});
```

### Example 6: Spec file — work-no-flagship.spec.ts (planner reference)

```ts
/**
 * WORK-01, D-08: No card is "flagship" — every card in the same row has the
 * same width and border. Equal-weight verification.
 */
import { test, expect } from '@playwright/test';

test('WORK-01, D-08: cards in the same row have matching width', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto('/work');
  const cards = page.locator('[data-test="work-grid"] > li');
  const widths = await cards.evaluateAll((els) => els.map((el) => el.clientWidth));

  // In 2-column md:grid-cols-2 layout: cards 0+1 same width, 2+3 same, 4+5 same,
  // card 6 alone in row 4 (orphan — same width as its peers, NOT spanning 2 cols).
  expect(widths[0]).toBe(widths[1]);
  expect(widths[2]).toBe(widths[3]);
  expect(widths[4]).toBe(widths[5]);
  expect(widths[6]).toBe(widths[0]); // orphan must NOT span — same width as row-mates
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router + getStaticProps | App Router + RSC | Next.js 13+ | Phase 4 uses App Router exclusively; static at build time |
| Webpack | Turbopack default | Next.js 16 | Phase 4 inherits; build is ~2s for 5-page site |
| `transition-colors` everywhere | `transition-[<single-prop>]` arbitrary on focus-visible elements | Tailwind v4 (Jan 2025) | Phase 2 Plan 02-04 lesson; Phase 4 honors |
| `lucide-react` brand icons | Inline SVG with `currentColor` (project's `components/icons/` pattern) | Lucide ~2024 dropped brand glyphs | Phase 4 doesn't consume brand icons on /work cards anyway |
| `next/legacy/image` | `next/image` | Next.js 16 deprecation | N/A — Phase 4 uses no images |
| `middleware.ts` | `proxy.ts` | Next.js 16 rename | N/A — Phase 4 needs no middleware |
| `images.domains` | `images.remotePatterns` | Next.js 16 deprecation | N/A — Phase 4 uses no remote images |
| Decimal width queries | Container queries (`@container`) | Tailwind v4 native | Not needed — `md:` breakpoint suffices for 2-col flip |

**Deprecated/outdated:**
- **CLAUDE.md "Supporting Libraries" lucide-react row** still claims brand icons available — outdated since 2024 (Phase 2 Plan 04 SUMMARY flagged for Phase 6 docs sweep). Phase 4 does NOT consume the false claim.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tailwind v4 ships built-in `sr-only` utility (used in Phase 3 already, expected to work on /work) | Pattern 4 | Low — verifiable in 30s by inspecting `class="sr-only"` on `<h1>` in Phase 3's `app/about/page.tsx`. If Tailwind v4 dropped it (unlikely), planner adds custom CSS. |
| A2 | `next/font` Geist Sans `var(--font-sans)` resolves correctly inside inline-style on `<span>` (used elsewhere on the site, expected to work in `ProjectCard.tsx`) | Code Examples | Low — pattern is identical to Phase 2's `ChannelButton.tsx` which is GREEN |
| A3 | `getComputedStyle(li).clientWidth` is consistent across cards in a 2-col `md:grid-cols-2` layout when `items-stretch` applies (basis for `tests/work-no-flagship.spec.ts`) | Example 6 | Low — CSS Grid spec guarantees uniform column-track sizing in `repeat(2, 1fr)` |
| A4 | `noUncheckedIndexedAccess` (per Phase 1 tsconfig) is satisfied by `Record<Project['status'], string>` lookup (TS treats Record-with-enum-key as total) | Anti-Patterns | Low — TS spec; planner can verify with `tsc --noEmit` after Wave 1 |
| A5 | `target="_blank" rel="noopener noreferrer"` on plain `<a>` is universally supported; no special handling needed for screen-reader announcement of "opens in new tab" | Pattern 5 | Low-Medium — WCAG suggests adding `aria-label="opens in new tab"` for clarity; Phase 4 currently does not. **Planner micro-decision:** if Phase 6 A11Y sweep flags, add aria-label or visible "opens externally" text. Out of scope here per editorial restraint. |
| A6 | The 7-card grid renders within ~960ms total stagger time without LCP regression (no /work LCP spec exists yet — Phase 6 territory) | Pitfall 8 | Medium — measured Phase 2 home hero hit ~880ms with 6 elements; /work at 7 is comparable. If Phase 6 audit flags, ship first card without stagger. |
| A7 | `STATUS_DOT_COLOR['paper-trading']` (`#c8a86a`) clears WCAG AA UI-element contrast (≥3:1) on both `#1a1a1f` and `#0a0a0a` per UI-SPEC computed estimate (~7:1, ~8:1) | Common Pitfalls | Low — color math is determinate; UI-SPEC's computed estimates align with WebAIM tooling |
| A8 | `#707070` archived dot at ~3.6:1 on `#1a1a1f` will likely pass WebAIM contrast check on deployed preview but is borderline | Pitfall 2 | Medium — this is the load-bearing pre-flagged risk. Documented fallback (`#7a7a7a`) is ready. **Wave-3 deploy verification gate must include the WebAIM check.** |
| A9 | Vercel Speed Insights / Analytics auto-attached by root layout work correctly on /work without modification | Stack | Low — already proven on /, /about; same root layout |

**No claims tagged `[ASSUMED]` are blocking — all are low-medium risk with documented fallbacks.** A8 is the highest-risk assumption; mitigation is the documented `#7a7a7a` fallback in CONTEXT.md `<specifics>` and UI-SPEC line 167.

## Open Questions

1. **Should `reel-research-agent` and/or `school-planner` be added to the projects array?**
   - What we know: Both are memory-flagged active personal projects. WORK-06 lists exactly 7 projects (the canonical list). Adding `reel-research-agent` makes it 8 cards (re-evens grid to 4 full rows). Adding `school-planner` too makes it 9 cards (back to orphan, but a different orphan).
   - What's unclear: User intent. The deferred-ideas section flags this for execute-phase review.
   - Recommendation: **Wave 0 includes a `checkpoint:human-action` task** that surfaces this question to the user BEFORE populating `data/projects.ts`. The answer is binary: (a) ship 7 per WORK-06 verbatim, or (b) ship 8 with `reel-research-agent`, or (c) ship 9 with both. All three are spec-compatible — `tests/work-grid-renders.spec.ts` `.toHaveCount(N)` adapts. Plan-phase MUST surface this as the first deterministic question.

2. **Final card title for archived braehods: `braehods (v0)` or `braehods.com (v0)`?**
   - What we know: CONTEXT.md `<specifics>` flags both options; planner picks. The `(v0)` suffix communicates the archive bucket alongside the badge.
   - What's unclear: User preference.
   - Recommendation: Default to **`braehods.com (v0)`** (full domain reads more like an artifact link; aligns with the `href` being the live old site URL until Phase 6 DNS swap). Document inline; user can override at the Wave-1 description-review checkpoint.

3. **Canonical href for archived braehods until Phase 6 DNS swap?**
   - What we know: CONTEXT.md D-16 + UI-SPEC § Project Order both document this carry-forward. Pre-Phase-6: the OLD `braehods.com` GitHub Pages site IS the live URL. Post-Phase-6: a snapshot archive URL or repo URL.
   - What's unclear: Which post-Phase-6 URL to swap to (a Wayback Machine link? `https://github.com/bwaeden/braehods` repo? a `/archive` sub-route on the new site?).
   - Recommendation: Wave-0 user-input task captures the v1 href (current live `braehods.com`). Document the Phase-6 swap target in the plan summary as a Phase-6 carry-forward; Phase 6 will decide.

4. **Should the Phase 4 plan ship the optional `tests/work-descriptions-cliche-scrub.spec.ts`?**
   - What we know: D-15 + UI-SPEC § Copywriting Contract list this as planner discretion. Phase 3 has identical regex on `tests/about-renders.spec.ts`. Cheap insurance.
   - What's unclear: Whether the marginal utility justifies the file.
   - Recommendation: **Ship it.** Cost: ~30 lines + 1 commit. Benefit: regression-guards 7 descriptions against ABOUT-01-style template phrasing for the rest of the site's life. The cliché regex is already authored and proven on /about — copy-paste reuse is trivial.

5. **Ship `<ProjectGrid>` wrapper or inline grid in `app/work/page.tsx`?**
   - What we know: CONTEXT.md Claude's Discretion + UI-SPEC line 498 default to **inlined**.
   - What's unclear: Whether future Phase 5/6 work (e.g., a v2 case-study page that reuses the grid layout) would benefit.
   - Recommendation: **Inline.** /work is the only consumer for v1; an extracted wrapper adds indirection without reuse value. If v2 adds `/work/[slug]`, that phase can extract `<ProjectGrid>` then.

6. **Does the planner need a Wave-0 build-time Zod validation step on `data/projects.ts`?**
   - What we know: Schema is type-only (TS `z.infer`); literal array isn't runtime-validated unless wrapped in `Project.parse(entry)`. Phase 1 + 2 + 3 all rely on TS strict for similar arrays.
   - What's unclear: Whether to add a unit test (e.g., `tests/data-projects-schema.spec.ts`) that imports `projects` and runs `Project.parse()` on each entry.
   - Recommendation: **Optional, defer to planner.** TS strict + CI typecheck catches enum mismatches; URL validation (`z.string().url()`) only fires on `parse()`. Add the spec if the planner wants belt-and-suspenders; skip otherwise. **Note:** if added, it's a unit test (not a Playwright spec) — would be the first test of its kind in this repo. Likely just a `playwright.test()` block that imports the data and asserts.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build + dev server + Playwright | ✓ | v24.14.0 [VERIFIED] | — (well above Next 16's `>=20.9.0` requirement) |
| npm | Package management | ✓ | bundled with Node 24 | — |
| Next.js (installed) | App Router + RSC | ✓ | 16.2.6 [VERIFIED] | — |
| React (installed) | UI runtime | ✓ | 19.2.4 [VERIFIED] | — |
| TypeScript (installed) | Type checking | ✓ | 5.9.3 [VERIFIED] | — |
| Tailwind CSS (installed) | Utility classes | ✓ | 4.3.0 [VERIFIED] | — |
| Playwright (installed) | Spec runner | ✓ | ^1.59.1 [VERIFIED] | — |
| Vercel CLI | Optional preview deploy | Not verified locally; not blocking — git push triggers preview | — | Use Vercel dashboard manually |
| Web access (WebAIM contrast checker) | Wave-3 manual verification | ✓ (assumed) | — | Use offline contrast calculator if needed |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None — every Phase 4 dependency is already installed and version-verified.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | `@playwright/test` ^1.59.1 [VERIFIED in package.json] |
| Config file | `playwright.config.ts` (root) |
| Quick run command | `npm run test` (chromium-mobile project, `-x` exit on first failure) |
| Full suite command | `npm run test:full` (all projects) |
| Targeted run | `npx playwright test tests/work-grid-renders.spec.ts tests/work-status-badges.spec.ts tests/work-no-flagship.spec.ts` |
| Per-test isolation | Yes — each spec file is independent; failures don't cascade |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WORK-01 | All 7 projects render in the grid; cards same width per row | unit (Playwright) | `npx playwright test tests/work-grid-renders.spec.ts tests/work-no-flagship.spec.ts` | ❌ Wave 0 stubs |
| WORK-02 | Each card has title + description + tags + status + href from typed data | unit (Playwright) | `npx playwright test tests/work-grid-renders.spec.ts` | ❌ Wave 0 stub |
| WORK-03 | Status badge = dot + label; dot color matches `STATUS_DOT_COLOR` map | unit (Playwright) | `npx playwright test tests/work-status-badges.spec.ts` | ❌ Wave 0 stub |
| WORK-04 | Tags render as visible comma-joined text on each card | unit (Playwright) | `npx playwright test tests/work-grid-renders.spec.ts` (sub-assertion) | ❌ Wave 0 stub |
| WORK-05 | Each card has external `<a target="_blank" rel="noopener noreferrer">` | unit (Playwright) | `npx playwright test tests/work-grid-renders.spec.ts` (sub-assertion) | ❌ Wave 0 stub |
| WORK-06 | 7 (or 8) projects seeded in `data/projects.ts`; manual array order CapitolLens-first | unit (Playwright) | `npx playwright test tests/work-grid-renders.spec.ts` (count + first-card title) | ❌ Wave 0 stub |
| A11Y-05 | Status badge has BOTH dot AND label; dot is `aria-hidden` | unit (Playwright) | `npx playwright test tests/work-status-badges.spec.ts` | ❌ Wave 0 stub |
| (Optional) D-15 | All 7 descriptions pass cliché-ban regex | unit (Playwright) | `npx playwright test tests/work-descriptions-cliche-scrub.spec.ts` | ❌ Wave 0 stub (optional) |
| FOUND-07 (regression) | Zero `'use client'` in `app/work/`, `components/work/` | unit (Playwright) | `npx playwright test tests/no-client-components.spec.ts` | ✓ exists Phase 1 |
| `:focus-visible` ring (regression) | Card focus shows accent ring; no transition-colors leak | unit (Playwright) | `npx playwright test tests/focus-ring.spec.ts` | ✓ exists Phase 1 |
| Reduced motion (regression) | Stagger + hover transitions defeated under emulation | unit (Playwright) | `npx playwright test tests/reduced-motion.spec.ts` | ✓ exists Phase 1 |
| Phase 1 + 2 + 3 chrome (regression) | Nav, Footer, hero, about all still GREEN after Phase 4 | unit (Playwright) | `npm run test:full` | ✓ exists |

### Sampling Rate

- **Per task commit:** `npx playwright test tests/work-*.spec.ts tests/no-client-components.spec.ts tests/focus-ring.spec.ts` (~7 specs total — fast feedback)
- **Per wave merge:** `npm run test:full` (all 24+ specs across 2 projects = ~50+ test runs)
- **Phase gate:** Full suite GREEN against deployed Vercel branch preview before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/work-grid-renders.spec.ts` — covers WORK-01, WORK-02, WORK-04, WORK-05, WORK-06
- [ ] `tests/work-status-badges.spec.ts` — covers WORK-03, A11Y-05
- [ ] `tests/work-no-flagship.spec.ts` — covers WORK-01 equal-weight verification
- [ ] `tests/work-descriptions-cliche-scrub.spec.ts` — OPTIONAL per D-15 (recommended ship per OQ#4)
- Framework install: ✓ already present (`@playwright/test` ^1.59.1)
- Shared fixtures (`tests/conftest.py`, `tests/setup.ts` analog): ✓ N/A — `playwright.config.ts` handles project + viewport setup

## Security Domain

**Security enforcement:** ENABLED (`security_enforcement: true`, `security_asvs_level: 1` per `.planning/config.json`).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | yes (carry-forward) | Server Component invariant; zero client JS surface; no new attack surface |
| V2 Authentication | no | Phase 4 is fully public; no auth gates |
| V3 Session Management | no | Static page; no session state |
| V4 Access Control | no | All content is public |
| V5 Input Validation | yes | `data/projects.ts` literal is type-checked at build time via Zod schema; URLs validated via `z.string().url()` if `Project.parse()` is invoked |
| V6 Cryptography | no | No crypto; no secrets; no sensitive data |
| V7 Error Handling | no | Static page; no runtime error paths |
| V8 Data Protection | no | All content is public-by-design |
| V9 Communication | yes | All external `<a>` carry `rel="noopener noreferrer"` (tabnabbing prevention) per D-03 |
| V10 Malicious Code | no | No third-party JS executes (no client islands) |
| V11 Business Logic | no | No business logic; static rendering |
| V12 File / Resource | no | No file uploads, no resource access |
| V13 API | no | No API endpoints |
| V14 Configuration | yes (carry-forward) | `next.config.ts` unchanged from Phase 2; no new env vars |

### Known Threat Patterns for Next.js 16 RSC + External Links

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Tabnabbing via `target="_blank"` (opener can navigate parent) | Tampering / Spoofing | `rel="noopener noreferrer"` on every external `<a>` per D-03 + UI-SPEC line 205 |
| XSS via project description / title injection | Tampering / Information Disclosure | All values are TS-literals in source (no runtime user input); React escapes by default; no `dangerouslySetInnerHTML` |
| Open redirect via `project.href` | Spoofing | Hrefs are TS-literals confirmed at Wave 0; Zod URL validation backstops if `Project.parse()` is added; no dynamic href construction |
| CSP bypass | Tampering | No inline scripts; no `eval`; Next.js handles CSP defaults |
| Lucide brand-icon supply-chain (already mitigated Phase 2) | Spoofing | Brand icons are inline SVG owned in `components/icons/` — no third-party brand-glyph import |
| Schema-mismatch silent failure | Tampering | TS strict + Zod literal cap (`description: z.string().max(140)`) |
| Memory disclosure of unrelated personal projects | Information Disclosure | WORK-06 list is the canonical scope; reel-research-agent + school-planner explicitly require user opt-in (per OQ#1) |
| Description prose containing sensitive info (paper-trading framing) | Information Disclosure | D-15 cliché-ban + "paper-only" honesty marker on CapitolLens; user reviews descriptions before commit per Phase 3 D-01 pattern |

**Threat model summary:** Phase 4 has near-zero new attack surface. The only meaningful threat is tabnabbing via external links — fully mitigated by `rel="noopener noreferrer"` (D-03 mandate). The optional Wave-0 Zod build-time validation (OQ#6) closes the remaining residual risk on `href` validation. **No security blockers identified at ASVS-1.**

## Project Constraints (from CLAUDE.md)

Extracted from `./CLAUDE.md` (sections relevant to Phase 4):

- **Tech stack pinned:** Next.js 16.2.6 (App Router), React 19.2.6 (project ships 19.2.4 — within spec), TypeScript 5.9, Tailwind v4 — Phase 4 honors all pins.
- **Performance:** Lighthouse 95+ on mobile (Phase 6 owns final audit); near-zero JS for initial load (Phase 4 ships zero new client JS).
- **Accessibility:** WCAG AA at minimum; color contrast on charcoal gradient must clear AA; all interactive elements keyboard-navigable; motion respects `prefers-reduced-motion` — Phase 4 honors all (status-dot contrast verification staged for Wave-3 deploy preview).
- **Content scope:** No CMS; content lives in MDX or typed JSON in repo, edited via PR — Phase 4 populates `data/projects.ts` typed literal exactly per this constraint.
- **What NOT to use (project-wide):**
  - **Contentlayer** (abandoned) — N/A Phase 4
  - **Pages Router** — Phase 4 uses App Router only
  - **Webpack** — Phase 4 inherits Turbopack default
  - **GSAP / Lenis / WebGL / glassmorphism / particle backgrounds** — Phase 4 uses none
  - **Google Analytics 4** — Phase 4 inherits Vercel Analytics
  - **`framer-motion` / `motion` package** — Phase 4 uses CSS-only motion via `lib/motion.ts`
  - **`next/legacy/image`, `middleware.ts`, `images.domains`** — Phase 4 uses none
  - **Radix UI primitives** — Phase 4 uses none (no modal on /work)
  - **`next-themes`** — Phase 4 inherits dark-only
  - **Heavy CMS** — Phase 4 uses typed TS literal
- **GSD Workflow Enforcement:** Edit/Write/file-changing tools must be entered through a GSD command — Phase 4 plans + execution via `/gsd-execute-phase 4`.
- **Project Skills:** None registered (`./.claude/skills/`, `./.agents/skills/` directories absent — verified 2026-05-13).

**Phase 4 alignment:** All CLAUDE.md directives honored. The single CLAUDE.md outdated row (Supporting Libraries lucide-react brand icons claim) is irrelevant to Phase 4 because /work cards consume zero brand icons.

## Sources

### Primary (HIGH confidence)
- `package.json` — verified version pins for next@16.2.6, react@19.2.4, typescript@5.9.3, tailwindcss@4.3.0, zod@4.4.3, @playwright/test@^1.59.1, lucide-react@1.14.0
- `data/projects.ts` (lines 1-17) — verified Zod schema + empty array literal awaiting Phase 4 population
- `app/work/page.tsx` (lines 1-19) — verified Plan 02-05 stub being replaced
- `components/home/ChannelButton.tsx` (lines 44-90) — verified pattern reference for hairline-tile + group-hover hover-state
- `components/home/CTAArrowLink.tsx` (lines 28-43) — verified pattern reference for accent text-link + arrow group-hover translate
- `components/layout/Footer.tsx` (lines 32-86) — verified `transition-[color]` arbitrary-property fix from Phase 2 Plan 02-04 Rule 1
- `lib/motion.ts` (lines 1-15) — verified `fadeInUp` + `stagger(i)` API
- `app/globals.css` (lines 1-106) — verified `@theme` 6-token palette, `*:focus-visible` rule, reduced-motion override, `fade-in-up` keyframe
- `app/layout.tsx` (lines 1-25) — verified `max-w-3xl mx-auto px-6 py-16 lg:px-12` container; Nav + Footer chrome wrap
- `tests/about-renders.spec.ts` (lines 1-75) — verified cliché-ban regex source for optional D-15 spec
- `.planning/phases/04-work-projects/04-CONTEXT.md` — D-01..D-16 + Claude's Discretion + Deferred Ideas, all locked
- `.planning/phases/04-work-projects/04-UI-SPEC.md` — full UI design contract (642 lines)
- `.planning/REQUIREMENTS.md` — WORK-01..06 + A11Y-05 verbatim
- `.planning/STATE.md` — Phase 1 + 2 + 3 carry-forward lessons (transition-colors bug, lucide brand icons, Vercel preview vs production alias)
- `.planning/phases/02-home-page/02-SUMMARY.md` — Phase 2 retrospective with all 3 lessons applicable to Phase 4
- `.planning/phases/03-about-page/03-01-SUMMARY.md` — Phase 3 retrospective with sr-only h1 + cliché-scrub spec patterns
- Runtime verification: `node -e "console.log(require('lucide-react').Instagram)"` returns `undefined` (2026-05-13)

### Secondary (MEDIUM confidence)
- CLAUDE.md "Supporting Libraries" lucide-react row — flagged outdated; verified above against runtime
- npm registry estimates (versions cross-checked against package.json — no fresh `npm view` calls needed since all versions are pinned and verified locally)
- Phase 1 STACK.md research — versions match what package.json ships

### Tertiary (LOW confidence)
- Memory file claims about non-WORK-06 projects (`reel-research-agent`, `school-planner`) — accurate but require user confirmation (OQ#1) before adding to scope

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — all versions verified in package.json + runtime checks; zero new packages introduced
- Architecture: **HIGH** — every pattern is a translation of an already-shipped Phase 1/2/3 pattern; UI-SPEC + CONTEXT.md lock all design contracts
- Pitfalls: **HIGH** — 7 of 8 pitfalls are documented Phase 1/2 lessons (transition-colors, lucide brand icons, Vercel preview, animation collision, items-stretch + h-full, sr-only, ProjectGrid wrapper). Pitfall 2 (`#707070` contrast) is the one MEDIUM-risk item, with documented fallback.
- Validation Architecture: **HIGH** — Playwright is shipped, 3 specs are deterministic, regression tests already exist for FOUND-07, focus-ring, reduced-motion
- Security: **HIGH** — ASVS-1 review surfaces only tabnabbing (already mitigated by D-03 mandate)
- Open Questions: deterministic — 6 questions, 5 with strong recommendations, 1 (OQ#1) requires Wave-0 user input

**Research date:** 2026-05-13
**Valid until:** 2026-06-13 (30 days — stack is stable; the only fast-moving item is `lucide-react` which Phase 4 doesn't consume on /work cards)

---

*Research complete — planner can proceed to draft `04-01-PLAN.md`. Recommended structure: 1 plan / 4 waves (W0 data + spec stubs + user-input checkpoint, W1 ProjectCard component, W2 page rewrite, W3 deploy + verify). Critical Wave-0 deliverables: (a) resolve OQ#1 binary decision via user checkpoint, (b) populate `data/projects.ts` with confirmed hrefs + drafted descriptions for user review, (c) stub 3 (or 4 with optional cliché-scrub) RED Playwright specs.*
