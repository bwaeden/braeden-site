# Phase 4: Work + Projects — Pattern Map

**Mapped:** 2026-05-13
**Files analyzed:** 8 (5 source files to create/modify + 3-4 test specs)
**Analogs found:** 8 / 8

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `data/projects.ts` (POPULATE) | data / typed-array module | build-time read | `data/channels.ts` | exact (sibling typed-array) |
| `components/work/ProjectCard.tsx` (NEW) | component (Server, presentational card-as-link) | request-response (RSC render) | `components/home/ChannelButton.tsx` | exact (hairline-tile + external `<a>` + group-hover) |
| `app/work/page.tsx` (REWRITE) | route page (Server, composes grid) | request-response (RSC render) | `app/about/page.tsx` | exact (sr-only h1 + section landmark + per-item stagger) |
| `components/icons/ExternalArrowIcon.tsx` (OPTIONAL FALLBACK) | icon component | static SVG | `components/icons/InstagramIcon.tsx` | exact (inline SVG, currentColor, lucide-shape signature) |
| `tests/work-grid-renders.spec.ts` (NEW) | test (Playwright) | DOM assertion | `tests/hero-renders.spec.ts` | exact (count + literal-text + section selector) |
| `tests/work-status-badges.spec.ts` (NEW) | test (Playwright) | computed-style assertion | `tests/currently-renders.spec.ts` | exact (aria-hidden dot + `getComputedStyle.backgroundColor` regex) |
| `tests/work-no-flagship.spec.ts` (NEW) | test (Playwright) | layout assertion | `tests/footer-socials-render.spec.ts` | role-match (count + sibling `clientWidth` evaluate) |
| `tests/work-descriptions-cliche-scrub.spec.ts` (OPTIONAL) | test (Playwright) | innerText regex | `tests/about-renders.spec.ts` | exact (cliché-ban regex reuse) |

---

## Pattern Assignments

### `data/projects.ts` — POPULATE the empty `projects: Project[] = []` array

**Analog:** `data/channels.ts` (sibling typed-array; same Phase 1 scaffolding pattern)
**Schema source (DO NOT MODIFY):** `data/projects.ts` lines 1-14 (Zod + type already locked)

**Existing schema to populate against** (`data/projects.ts` lines 1-16):
```typescript
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

export const projects: Project[] = [];
```

**Population shape** (mirror `data/channels.ts` lines 8-13 — single-block array literal with leading comment that documents scope decisions):
```typescript
// data/channels.ts (lines 7-13) — model for the comment-then-array pattern
export const channels: Channel[] = [
  { platform: 'instagram', handle: 'braehods', url: 'https://instagram.com/braehods' },
];
```

**Phase 4 application:**
- Replace line 16 (`export const projects: Project[] = [];`) with a 7-entry array (or 8 if user adds reel-research-agent during Wave-0 review).
- Above the array, add a leading comment documenting the order rationale (CapitolLens leads, archived braehods last per D-14) and the canonical-href waterfall (D-16: live > demo > repo).
- Each entry conforms to the locked `Project` schema. `description` ≤140 chars (Zod will catch overflow at parse time if any consumer wraps `Project.parse(entry)`; TS type already enforces shape).
- For `archived braehods`, document the post-Phase-6 DNS-swap carry-forward in an inline comment beside that entry.

---

### `components/work/ProjectCard.tsx` — NEW (Server Component)

**Analog:** `components/home/ChannelButton.tsx` (hairline-bordered external-link tile; the closest existing match — Phase 4 is its card-scale translation)
**Secondary analog:** `components/home/CTAArrowLink.tsx` (group-hover translate-arrow pattern)
**Tertiary analog:** `components/home/CurrentlyLine.tsx` (aria-hidden colored dot + label pattern)

**Imports pattern** (model: `components/home/ChannelButton.tsx` lines 44-45 — type-only data import + sibling component import via `@/` alias):
```typescript
// Source: components/home/ChannelButton.tsx lines 44-45
import type { Channel } from '@/data/channels';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
```

**Phase 4 imports:**
```typescript
import type { Project } from '@/data/projects';
// (no icon import unless ExternalArrowIcon fallback ships)
```

**Source-attribution header comment** (model: `components/home/ChannelButton.tsx` lines 1-43 — every Phase 1-3 component opens with a `// Source:` block citing the plan, UI-SPEC sections, and key invariants):
```typescript
// components/work/ProjectCard.tsx
// Source: PLAN.md 04-XX-TX; 04-UI-SPEC § ProjectCard component (D-01..D-04, D-09..D-12).
//
// Server Component (NO 'use client' — FOUND-07 / D-25 inherited). Card-scale
// version of the Phase 2 ChannelButton hairline-tile pattern (see
// components/home/ChannelButton.tsx lines 73-89 for the button-scale
// precedent). Single <a target="_blank" rel="noopener noreferrer"> wraps
// all card content per D-03 (1 keyboard tab stop per card).
//
// TRANSITION DISCIPLINE (CRITICAL — Phase 2 Plan 02-04 lesson):
//   `transition-[border-color,color,transform]` arbitrary list — NOT
//   `transition-colors` shorthand. The shorthand transitions outline-color
//   and clobbers the `:focus-visible` accent ring on Tab. Mirrored here
//   from Footer.tsx + SocialIconLink.tsx fixes.
```

**Status-color map pattern** (model: `components/home/ChannelButton.tsx` lines 50-56 — `as const` lookup map at top of file with inline comments documenting scope):
```typescript
// Source: components/home/ChannelButton.tsx lines 50-56
const ICON_BY_PLATFORM = {
  instagram: InstagramIcon,
} as const;

const CTA_BY_PLATFORM = {
  instagram: 'DM me',
} as const;
```

**Phase 4 application** (per UI-SPEC lines 281-291 — exact constant locked):
```typescript
const STATUS_DOT_COLOR: Record<Project['status'], string> = {
  'shipped':       'var(--color-accent)', // #7c87ff (token)
  'paper-trading': '#c8a86a',             // muted amber, inline literal (D-09)
  'in-dev':        'var(--color-muted)',  // #a8a8a8 (token)
  'archived':      '#707070',             // deep grey, inline literal (D-09)
};
```

**Hairline-tile + external link pattern** (model: `components/home/ChannelButton.tsx` lines 73-79 — the closest in-repo analog for the card root `<a>`):
```tsx
// Source: components/home/ChannelButton.tsx lines 73-79
<a
  href={channel.url}
  target="_blank"
  rel="noopener noreferrer"
  className="group inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-sans transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-px hover:border-[var(--color-accent)]"
>
```

**Phase 4 adaptation** (per UI-SPEC line 256 — `block` not `inline-flex`, `p-5` not `px-4 py-3`, NO `hover:-translate-y-px` per D-02):
```tsx
<a
  href={project.href}
  target="_blank"
  rel="noopener noreferrer"
  className="group block h-full p-5 rounded border border-[var(--color-border)] transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)]"
>
```

**Group-hover translate-arrow pattern** (model: `components/home/CTAArrowLink.tsx` lines 35-40 — the only existing in-repo translate-on-hover-arrow):
```tsx
// Source: components/home/CTAArrowLink.tsx lines 35-40
<span
  aria-hidden
  className="inline-block transition-transform group-hover:translate-x-1"
>
  →
</span>
```

**Phase 4 adaptation** (per UI-SPEC line 277 — `↗` not `→`, `translate-x-0.5` (2px) not `translate-x-1` (4px), accent color):
```tsx
<span
  aria-hidden
  className="inline-block transition-transform group-hover:translate-x-0.5"
  style={{ color: 'var(--color-accent)' }}
>
  ↗
</span>
```

**Aria-hidden colored-dot pattern** (model: `components/home/CurrentlyLine.tsx` lines 30-33 — the canonical 6px dot + aria-hidden contract; Phase 4 status badge is the second consumer):
```tsx
// Source: components/home/CurrentlyLine.tsx lines 30-33
<span
  aria-hidden
  className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
/>
```

**Phase 4 adaptation** (per UI-SPEC line 272 — inline-style `backgroundColor` from `STATUS_DOT_COLOR` lookup since 2 of 4 colors are inline literals not Tailwind utilities):
```tsx
<span
  aria-hidden
  className="inline-block w-1.5 h-1.5 rounded-full"
  style={{ backgroundColor: STATUS_DOT_COLOR[project.status] }}
/>
```

**Inline-style color cascade convention** (model: `components/home/CurrentlyLine.tsx` lines 42-46 + 49-52 — the project-wide inline-style baseline for `var(--color-text)` / `var(--color-muted)`; ChannelButton's `text-[var(--color-muted)]` Tailwind arbitrary is the documented one-off deviation):
```tsx
// Source: components/home/CurrentlyLine.tsx lines 42-52 — inline-style is the baseline
<span style={{ color: 'var(--color-text)' }}>{data.statement}</span>
<span aria-hidden style={{ color: 'var(--color-muted)' }}>·</span>
<time
  dateTime={data.updatedAt}
  className="font-mono text-sm"
  style={{ color: 'var(--color-muted)' }}
>
```

**Phase 4 application:** All four card text colors (status label muted, title text, description text, tags muted) use inline-style `style={{ color: 'var(--color-…)' }}` — match CurrentlyLine convention, not ChannelButton's deviation.

---

### `app/work/page.tsx` — REWRITE (Server Component, page composition)

**Analog:** `app/about/page.tsx` (the most recent route page; same sr-only h1 + aria-labelledby section landmark pattern Phase 4 inherits per D-13)
**Secondary analog:** `components/home/Hero.tsx` (composition pattern with multiple data imports + lib/motion stagger orchestration)
**Tertiary analog:** `components/home/ChannelButtonRow.tsx` (per-item `<li>`-wrapper stagger pattern)

**Imports pattern** (model: `app/about/page.tsx` lines 21-23 — three imports: component, sibling component, motion seam):
```typescript
// Source: app/about/page.tsx lines 21-23
import { HeroPhoto } from '@/components/home/HeroPhoto';
import { CTAArrowLink } from '@/components/home/CTAArrowLink';
import { fadeInUp, stagger } from '@/lib/motion';
```

**Phase 4 imports** (per UI-SPEC lines 371-373 — locked import block):
```typescript
import { fadeInUp, stagger } from '@/lib/motion';
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/work/ProjectCard';
```

**Metadata pattern** (model: `app/about/page.tsx` line 25 + `app/work/page.tsx` line 8 — both export `metadata = { title: '…' }`; Phase 4 keeps the existing `Work` title):
```typescript
// Source: app/work/page.tsx line 8 (current stub — preserve)
export const metadata = { title: 'Work' };
```

**Section landmark + sr-only h1 pattern** (model: `app/about/page.tsx` lines 29-41 — the canonical inheritance source for D-13):
```tsx
// Source: app/about/page.tsx lines 29-41
<section
  data-test="about-section"
  aria-labelledby="about-heading"
  className="py-8 md:py-12"
>
  <div
    data-test="about-flex"
    className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-16"
  >
    <div className="flex flex-col items-start">
      <h1 id="about-heading" className="sr-only">
        About
      </h1>
```

**Phase 4 adaptation** (per UI-SPEC lines 200-202 + 379-384 — same shape, swap `about` → `work`, swap inner content from flex-photo to grid-list):
```tsx
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
    …
  </ul>
</section>
```

**Per-item `<li>`-wrapper stagger pattern** (model: `components/home/ChannelButtonRow.tsx` lines 27-33 — the only in-repo pattern that wraps stagger on a list-item wrapper around an interactive child):
```tsx
// Source: components/home/ChannelButtonRow.tsx lines 27-33
<div className="mt-8 flex flex-row flex-wrap gap-3">
  {channels.map((channel, i) => (
    <div key={channel.platform} className={fadeInUp} style={stagger(3 + i)}>
      <ChannelButton channel={channel} />
    </div>
  ))}
</div>
```

**Phase 4 adaptation** (per UI-SPEC lines 389-397 — semantic `<li>` not `<div>`, `stagger(i + 1)` starting at 80ms not `stagger(3 + i)`):
```tsx
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

**Note on stagger seam discipline:** `fadeInUp` + `stagger()` MUST live on the `<li>` wrapper, NOT on the inner `<a>` per the Phase 2 lesson documented in `components/home/ChannelButtonRow.tsx` lines 8-10 (keyframe end-state must not collide with hover translate). Same rule applies here — the card's `transition-[border-color,color,transform]` would collide with the keyframe's `transform: translateY(0)` end-state.

---

### `components/icons/ExternalArrowIcon.tsx` — OPTIONAL FALLBACK (only if Unicode `↗` reads inconsistently)

**Analog:** `components/icons/InstagramIcon.tsx` (closest exact match — same `size` + `strokeWidth` API mirroring lucide signature, same `stroke="currentColor"` cascade)
**Secondary analog:** `components/icons/GithubIcon.tsx` (identical pattern, second-Octocat-style example)

**Pattern excerpt** (model: `components/icons/InstagramIcon.tsx` lines 23-46 — full canonical inline-SVG-icon pattern):
```tsx
// Source: components/icons/InstagramIcon.tsx lines 23-46
interface InstagramIconProps {
  size?: number;
  strokeWidth?: number;
}

export function InstagramIcon({ size = 18, strokeWidth = 1.75 }: InstagramIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
```

**Phase 4 adaptation** (only if planner ships the fallback per UI-SPEC line 98 — same shape, swap inner SVG path data for a NE arrow at 24x24, default `size={14}` to match title face per UI-SPEC line 96):
- Same `size` + `strokeWidth` props.
- Same `stroke="currentColor"` so card's `style={{ color: 'var(--color-accent)' }}` cascades.
- `aria-hidden="true"` since the arrow is decorative (the `<a target="_blank">` carries external-link semantics).
- Path data: a simple NE arrow (e.g., diagonal stroke from (5,19) to (19,5) + arrowhead at (19,5)).

**File header comment** mirrors `components/icons/InstagramIcon.tsx` lines 1-22 (provenance + lucide-shape rationale + reference to memory `reference_lucide_brand_icons.md`).

---

### `tests/work-grid-renders.spec.ts` — NEW (Playwright DOM assertion)

**Analog:** `tests/hero-renders.spec.ts` (closest exact match — section selector + literal-text count assertions; same shape Phase 4 needs)

**Imports + header pattern** (model: `tests/hero-renders.spec.ts` lines 1-15):
```typescript
// Source: tests/hero-renders.spec.ts lines 1-15
/**
 * HOME-01, HOME-02, HOME-03, HOME-05: Hero section renders with name +
 * positioning copy + Currently statement + channel buttons + dual CTAs.
 *
 * On `/`:
 *  - exactly one `[data-test="hero-section"]` resolves
 *  - …
 *
 * RED until Plan 02-06 lands `components/home/Hero.tsx` + `app/page.tsx` rewrite.
 */
import { test, expect } from '@playwright/test';
```

**Section + count assertion pattern** (model: `tests/hero-renders.spec.ts` lines 25-26 + 41-44):
```typescript
// Source: tests/hero-renders.spec.ts lines 25-26
const heroSection = page.locator('[data-test="hero-section"]');
await expect(heroSection, 'expected exactly one [data-test="hero-section"] on /').toHaveCount(1);

// Source: tests/hero-renders.spec.ts lines 41-44
await expect(
  page.getByText('More about me', { exact: false }),
  'CTA1 "More about me" should appear on /'
).toHaveCount(1);
```

**Phase 4 application:**
- Header docstring cites WORK-01 + WORK-06 + Plan number.
- Goto `/work` (not `/`).
- Locate `[data-test="work-section"]` and `[data-test="work-grid"]` — assert count 1 each.
- Iterate over the 7 (or 8) project titles from `data/projects.ts` (planner: import directly OR hard-code the title list to keep the spec a black-box DOM check; pick the same approach the spec author used in `hero-renders` — hard-coded literals).
- Assert all 7 titles appear once via `page.getByText(title, { exact: false })`.
- Assert grid `<li>` count equals projects.length.

---

### `tests/work-status-badges.spec.ts` — NEW (Playwright computed-style + label-text assertion; A11Y-05 enforcement)

**Analog:** `tests/currently-renders.spec.ts` (closest exact match — accent-dot computed-style assertion + aria-hidden span locator; the canonical pattern for "color is supplementary, label carries info")

**`getComputedStyle` + accent-color regex pattern** (model: `tests/currently-renders.spec.ts` lines 22 + 46-57):
```typescript
// Source: tests/currently-renders.spec.ts line 22
const ACCENT_RGB = /rgba?\(\s*124\s*,\s*135\s*,\s*255/;

// Source: tests/currently-renders.spec.ts lines 46-57
test('HOME-02: Currently accent dot uses --color-accent (rgb 124,135,255)', async ({ page }) => {
  await page.goto('/');

  // The first aria-hidden <span> inside the Currently paragraph is the dot.
  const dot = page
    .locator('p:has-text("Currently") span[aria-hidden]')
    .first();
  await expect(dot, 'Currently accent dot should exist').toHaveCount(1);

  const bg = await dot.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg, `accent dot background should be --color-accent (got: ${bg})`).toMatch(ACCENT_RGB);
});
```

**Phase 4 application:**
- Define 4 RGB regex constants at top, one per status (mirror line 22):
  - `SHIPPED_RGB = /rgba?\(\s*124\s*,\s*135\s*,\s*255/` (accent #7c87ff)
  - `PAPER_TRADING_RGB = /rgba?\(\s*200\s*,\s*168\s*,\s*106/` (#c8a86a)
  - `IN_DEV_RGB = /rgba?\(\s*168\s*,\s*168\s*,\s*168/` (muted #a8a8a8)
  - `ARCHIVED_RGB = /rgba?\(\s*112\s*,\s*112\s*,\s*112/` (#707070; planner: use `/rgba?\(\s*122\s*,\s*122\s*,\s*122/` if Phase 6 contrast verification bumps to #7a7a7a)
- For each card, assert:
  - The badge contains an `aria-hidden` `<span>` (the dot).
  - The badge contains a sibling `<span>` carrying the status label text (literal: `shipped` / `paper-trading` / `in-dev` / `archived`).
  - `getComputedStyle(dot).backgroundColor` matches the regex for that card's status.
- Both elements present = A11Y-05 pass (color AND label).

---

### `tests/work-no-flagship.spec.ts` — NEW (Playwright layout assertion; WORK-01 enforcement)

**Analog:** `tests/footer-socials-render.spec.ts` (closest in-repo example of multi-element count + sibling-element assertion; planner extends with a `clientWidth` evaluate)
**Secondary analog:** `tests/about-renders.spec.ts` (paragraph-count range assertion shape, lines 69-74)

**Sibling-element count + assertion pattern** (model: `tests/footer-socials-render.spec.ts` lines 28-39):
```typescript
// Source: tests/footer-socials-render.spec.ts lines 28-39
const externalLinks = footer.locator('a[target="_blank"]');
await expect(
  externalLinks,
  'expected ≥2 footer <a target="_blank"> (GH + IG; source link also external)'
).not.toHaveCount(0);
const externalCount = await externalLinks.count();
expect(
  externalCount,
  `expected ≥2 external footer links (got ${externalCount})`
).toBeGreaterThanOrEqual(2);
```

**Phase 4 application** (no exact analog for clientWidth-based layout assertion — this is a new pattern Phase 4 introduces; combine the `count + evaluate` shape from `currently-renders.spec.ts` line 56 with the multi-element iteration from `footer-socials-render.spec.ts`):
- Locate all `<li>` children of `[data-test="work-grid"]`.
- Iterate across pairs in the same row (cards 0+1, 2+3, 4+5; card 6 is the orphan and excluded from pair comparison).
- For each pair: `evaluate` returns `{ widthA, widthB }` via `getBoundingClientRect().width` on each `<li>`.
- Assert `Math.abs(widthA - widthB) < 1` (within 1px — accounts for sub-pixel rounding).
- Set viewport to `md` breakpoint (≥768px) before assertions so the 2-col grid is active.
- Optional second assertion: card heights in the same row are equal (per D-07 `items-stretch` contract).

---

### `tests/work-descriptions-cliche-scrub.spec.ts` — OPTIONAL (planner discretion per UI-SPEC line 346)

**Analog:** `tests/about-renders.spec.ts` (closest exact match — cliché-ban regex, voice guardrail, identical contract Phase 4 mirrors)

**Cliché-ban regex pattern** (model: `tests/about-renders.spec.ts` lines 27-28):
```typescript
// Source: tests/about-renders.spec.ts lines 27-28 — REUSE VERBATIM
const CLICHE_BAN_REGEX =
  /passionate|I love to learn|driven by|innovative|cutting[-\s]edge|lifelong learner|wear many hats|results[-\s]oriented|outcome[-\s]driven/i;
```

**Innertext extraction + scrub assertion pattern** (model: `tests/about-renders.spec.ts` lines 50-58):
```typescript
// Source: tests/about-renders.spec.ts lines 50-58
const paragraphTexts = await page.locator('[data-test="about-section"] p').allInnerTexts();
const text = paragraphTexts.join(' ');

expect(text, 'bio prose must NOT contain any AI-template cliché (ABOUT-01 / D-05)').not.toMatch(
  CLICHE_BAN_REGEX,
);

expect(text, 'bio prose must NOT contain exclamation points (D-05 voice guardrail)').not.toContain('!');
```

**Phase 4 application:**
- Reuse the verbatim regex literal from `tests/about-renders.spec.ts` line 28 (ONE source of truth for the cliché contract per the "Don't Hand-Roll" rule in RESEARCH.md).
- Goto `/work`.
- Extract description text from each card: `page.locator('[data-test="work-section"] li p').allInnerTexts()` (the description is the first `<p>` in each card body; the tags line is the second `<p>`).
- Concat into one string; assert `.not.toMatch(CLICHE_BAN_REGEX)`.
- Optional: assert `.not.toContain('!')` per the voice guardrail.

---

## Shared Patterns

### Server Component default + zero `'use client'`
**Source:** `tests/no-client-components.spec.ts` (the enforcement spec); every existing component file in `components/` carries the discipline (e.g., `components/home/ChannelButton.tsx` line 5: `// Server Component (NO 'use client' — FOUND-07 / D-25)`).
**Apply to:** All Phase 4 source files (`ProjectCard.tsx`, `app/work/page.tsx`, optional `ExternalArrowIcon.tsx`).
**Concrete excerpt** (model: `components/home/ChannelButton.tsx` lines 5-9):
```typescript
// Server Component (NO 'use client' — FOUND-07 / D-25). [description of what
// this file does]. target="_blank" rel="noopener noreferrer" per HOME-03 +
// D-12 (new tab, no embeds) + tabnabbing prevention.
```
**Enforcement:** `tests/no-client-components.spec.ts` recursively scans `app/`, `components/`, `lib/` and fails if any file declares `'use client'`. Phase 4 adds files to the same scan tree — automatically enforced, no opt-in needed.

---

### Transition-property discipline (NO `transition-colors` shorthand)
**Source:** `components/layout/SocialIconLink.tsx` lines 18-32 (the canonical bug-fix doc); `components/home/ChannelButton.tsx` line 78 (`transition-[border-color,color,transform]`); `components/layout/Footer.tsx` line 76 (`transition-[color]`).
**Apply to:** Every interactive element on /work — primarily the `<a>` root in `ProjectCard.tsx`.
**Concrete excerpt** (model: `components/home/ChannelButton.tsx` line 78):
```tsx
className="… transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)]"
```
**Why** (model: `components/layout/SocialIconLink.tsx` lines 19-32 — the inline doc):
> Tailwind v4's `transition-colors` shorthand includes `outline-color` in the transitioned-property list. Because the parent sets `color: var(--color-muted)` and `outline-color` defaults to `currentcolor`, the rest-state outline-color resolves to muted — and when `*:focus-visible` fires (`outline: 2px solid var(--color-accent)`), the 200ms transition makes the focus ring visibly tint muted on the first frame. Narrowing to `transition-[border-color,color,transform]` (an arbitrary list excluding `outline-color`) leaves the focus ring crisp.

**Enforcement:** `tests/focus-ring.spec.ts` (lines 22-23 — the `ACCENT_OUTLINE_RE` regex) catches regressions on Tab focus. Phase 4 adds 7 new tab targets (the cards) — the spec already iterates the focus chain and will exercise them automatically once the page lands.

---

### External link + tabnabbing prevention
**Source:** `components/home/ChannelButton.tsx` lines 75-77; `components/layout/SocialIconLink.tsx` lines 45-47; `components/layout/Footer.tsx` lines 73-75.
**Apply to:** Every external `<a>` in `ProjectCard.tsx` (and the optional `ExternalArrowIcon.tsx` is decorative-only, no link).
**Concrete excerpt** (model: `components/home/ChannelButton.tsx` lines 75-77):
```tsx
<a
  href={channel.url}
  target="_blank"
  rel="noopener noreferrer"
  …
>
```

---

### Inline-style color cascade (NOT Tailwind text-color utilities)
**Source:** `components/home/CurrentlyLine.tsx` lines 42-52 (the convention baseline); explicitly documented as the project default in `components/home/ChannelButton.tsx` lines 38-43 (which calls out its own `text-[var(--color-muted)]` as a one-off deviation).
**Apply to:** All text colors in `ProjectCard.tsx` (status label, title text, description, tags) AND any `style={{ color }}` on the trailing `↗` glyph.
**Concrete excerpt** (model: `components/home/CurrentlyLine.tsx` lines 42-46):
```tsx
<span style={{ color: 'var(--color-text)' }}>{data.statement}</span>
…
<span aria-hidden style={{ color: 'var(--color-muted)' }}>·</span>
```

---

### Source-attribution file headers
**Source:** Every Phase 1-3 component opens with a `// Source:` block. Examples: `components/home/ChannelButton.tsx` lines 1-43, `components/home/CurrentlyLine.tsx` lines 1-15, `app/about/page.tsx` lines 1-19, `components/icons/InstagramIcon.tsx` lines 1-22.
**Apply to:** All new Phase 4 source files.
**Pattern:**
- Line 1: file path comment (`// components/work/ProjectCard.tsx`).
- Lines 2-3: `// Source: PLAN.md NN-NN-TN; UI-SPEC § Section (D-xx..D-yy).`
- Following lines: any non-obvious decisions, deviations, or invariants the executor must preserve (transition discipline, lucide-brand-icons-gone, RSC discipline, etc.).
- Blank line, then imports.

---

### Test-spec docstring + RED-marker convention
**Source:** Every Phase 1-3 spec opens with a JSDoc block that lists requirements asserted + the "RED until …" marker. Examples: `tests/hero-renders.spec.ts` lines 1-13, `tests/about-renders.spec.ts` lines 1-24, `tests/currently-renders.spec.ts` lines 1-15.
**Apply to:** All 3 (or 4) new Phase 4 spec files.
**Pattern** (model: `tests/hero-renders.spec.ts` lines 1-13):
```typescript
/**
 * [REQUIREMENT-ID]: [one-sentence description].
 *
 * On `/work`:
 *  - [bulleted list of what the spec asserts]
 *
 * RED until Plan 04-XX lands [files].
 */
import { test, expect } from '@playwright/test';
```

---

### Section-landmark + sr-only h1 (D-13 inheritance from Phase 3)
**Source:** `app/about/page.tsx` lines 29-41 (the canonical pattern; first consumer).
**Apply to:** `app/work/page.tsx`.
**Concrete excerpt:**
```tsx
<section
  data-test="work-section"
  aria-labelledby="work-heading"
  className="py-8 md:py-12"
>
  <h1 id="work-heading" className="sr-only">Work</h1>
  …
</section>
```
**Enforcement:** Tailwind v4 ships `sr-only` as a built-in utility (verified working on `/about` per Phase 3). No custom CSS needed.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `tests/work-no-flagship.spec.ts` (the equal-width assertion specifically) | test (layout) | `getBoundingClientRect()` evaluate | No existing spec asserts sibling-element layout-width parity. The shape is composable from `tests/footer-socials-render.spec.ts` (multi-element count + iteration) + `tests/currently-renders.spec.ts` line 56 (`evaluate(el => getComputedStyle(el).…)`), but the exact "row-pair widths within 1px" assertion is new to the codebase. Planner builds it from those primitives. |

All other Phase 4 files have at least a role-match analog; most have exact analogs.

---

## Metadata

**Analog search scope:** `data/`, `components/home/`, `components/layout/`, `components/icons/`, `components/ui/`, `app/`, `tests/`, `lib/`
**Files scanned:** 23 source files + 24 test specs + 1 globals.css
**Pattern extraction date:** 2026-05-13
