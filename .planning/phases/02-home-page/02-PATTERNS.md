# Phase 2: Home Page - Pattern Map

**Mapped:** 2026-05-11
**Files analyzed:** 15 (12 source + 1 asset + 2 data populate)
**Analogs found:** 15 / 15 (every file has a strong in-repo analog from Phase 1)

> Path alias: `@/*` maps to project root (`tsconfig.json` line 23-24). Use `@/components/...`, `@/lib/...`, `@/data/...` consistently — Phase 1 set this convention in `app/layout.tsx` line 3-4 and `components/ui/MonogramMark.tsx` callers.
>
> **Server Component invariant:** FOUND-07 / D-25 — zero `'use client'` in any Phase 2 file. `tests/no-client-components.spec.ts` enforces this. Every analog below is a Server Component and every new file must remain one.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `components/home/Hero.tsx` | component (layout composer) | data-in → JSX | `app/%5Ftokens/page.tsx` | role-match (page-level layout composer; same data-import + section-stack rhythm) |
| `components/home/HeroPhoto.tsx` | component (presentational + asset) | static-asset → JSX | `components/ui/MonogramMark.tsx` | role-match (a single visual asset wrapper that owns its own size + a11y attrs) |
| `components/home/CurrentlyLine.tsx` | component (data-driven row) | typed-data-prop → JSX | `app/%5Ftokens/page.tsx` color row (lines 41-52) | role-match (icon/dot + label + mono-text trio in flex row) |
| `components/home/ChannelButton.tsx` | component (link button) | typed-data-prop → external `<a>` | `components/layout/Nav.tsx` `<Link>` row (lines 32-37) + `linkClass` (line 18-19) | role-match (single-row interactive link with hover state and on-grid padding) |
| `components/home/ChannelButtonRow.tsx` | component (list wrapper) | typed-array → mapped children | `components/layout/Nav.tsx` desktop nav (`LINKS.map`, lines 31-37) | exact (typed array → `.map()` → flex-wrap row) |
| `components/home/CTAArrowLink.tsx` | component (text link) | href + children → `<Link>` | `components/layout/Nav.tsx` `linkClass` link (lines 32-37) | role-match (Next `<Link>` with text + hover underline; CTAArrowLink adds accent color + arrow glyph) |
| `components/layout/SocialIconLink.tsx` | component (icon link) | href + Icon → external `<a>` | `components/ui/MonogramMark.tsx` (currentColor SVG) + `components/layout/Nav.tsx` mobile hamburger button (lines 41-72) | role-match (icon-only `<a>` inheriting `currentColor`, square tactile padding) |
| `components/layout/Footer.tsx` (extend) | component (chrome) | static + new social array | itself (`components/layout/Footer.tsx`) | exact (extend container layout; keep `divider-top` + muted color contract) |
| `components/layout/Nav.tsx` (modify) | component (chrome) | static `LINKS` rewire | itself (`components/layout/Nav.tsx`) | exact (rewire `LINKS` array hrefs; preserve mobile disclosure verbatim) |
| `lib/format.ts` | utility (pure function) | string → string | `lib/motion.ts` | role-match (small lib-level helper with leading comment, named export, zero deps) |
| `app/page.tsx` (rewrite) | route (page composition) | `data/*` imports → `<Hero />` | `app/%5Ftokens/page.tsx` | exact (Server Component default export, top-of-file source-trace comment, data imports → JSX section stack) |
| `app/about/page.tsx` | route (stub) | none → static JSX | `app/page.tsx` (Phase 1 hero scaffold) | role-match (Server Component default export rendering a `<section>` with muted placeholder copy; Nav + Footer inherited from layout) |
| `app/work/page.tsx` | route (stub) | none → static JSX | `app/page.tsx` (Phase 1 hero scaffold) | role-match (same as above) |
| `data/channels.ts` (populate) | data (typed module) | const-array | itself | exact (shape locked Phase 1; user supplies values) |
| `data/site.ts` (populate `socials`) | data (typed module) | const-object | itself | exact (shape locked Phase 1; user supplies values) |
| `public/portrait.jpg` (asset) | asset | n/a | `app/icon.svg` (static file convention) | role-match (static file under `public/` — copied not generated) |
| `tests/*.spec.ts` (Phase 2 specs) | test | filesystem + browser | `tests/monogram.spec.ts`, `tests/focus-ring.spec.ts`, `tests/lighthouse.spec.ts`, `tests/no-client-components.spec.ts` | exact (Playwright + axe + Lighthouse layering preserved) |

---

## Pattern Assignments

### `components/home/Hero.tsx` (component, layout composer)

**Analog:** `app/%5Ftokens/page.tsx`

Why it's the right analog: `_tokens/page.tsx` is the only existing file that composes multiple sub-components into a vertically-stacked editorial layout reading typed data + emitting `<section>` blocks. The hero is the same pattern at a smaller scale: import data → render sections with spacing utilities.

**Imports pattern** (model after `app/%5Ftokens/page.tsx` lines 1-22 + `app/layout.tsx` line 3-4 for `@/` alias):
```typescript
// components/home/Hero.tsx
// Source: PLAN.md WX-TY; UI-SPEC § Hero (composition D-01..D-06, motion CD-03).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Composes the home
// hero block. Reads typed data from data/*.ts (Phase 1 scaffolds, populated
// in W0). Wires the Phase 1 lib/motion.ts seam for staggered fade-in.

import { site } from '@/data/site';
import { currently } from '@/data/currently';
import { channels } from '@/data/channels';
import { HeroPhoto } from '@/components/home/HeroPhoto';
import { CurrentlyLine } from '@/components/home/CurrentlyLine';
import { ChannelButtonRow } from '@/components/home/ChannelButtonRow';
import { CTAArrowLink } from '@/components/home/CTAArrowLink';
import { fadeInUp, stagger } from '@/lib/motion';
```

**Section-stack pattern** (analog: `app/%5Ftokens/page.tsx` lines 33-87 — top-level `<div className="space-y-12">` wrapping `<section>` children):
```tsx
// Phase 2 hero replaces space-y-12 with explicit per-element mt-* per CD-05
// (16/24/32/24 rhythm) — see UI-SPEC line 56-62.
export function Hero() {
  return (
    <section data-test="hero-section" className="...">
      <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-16">
        <div className="flex flex-col items-start">
          <h1 data-test="hero-display" className="font-serif text-[clamp(4rem,12vw,6rem)] leading-[1.05] font-bold">
            Braeden
          </h1>
          <p className={`mt-4 font-sans text-lg leading-relaxed max-w-[44ch] ${fadeInUp}`} style={stagger(1)}>
            {site.tagline}
          </p>
          <CurrentlyLine data={currently} />
          <ChannelButtonRow channels={channels} />
          <div className="mt-6 flex flex-col gap-2">
            <CTAArrowLink href="/about" stagger={5}>More about me</CTAArrowLink>
            <CTAArrowLink href="/work" stagger={6}>See the work</CTAArrowLink>
          </div>
        </div>
        <HeroPhoto />
      </div>
    </section>
  );
}
```

**Phase 2 deltas vs analog:**
- Replace `space-y-12` (uniform vertical rhythm in `_tokens`) with **per-element `mt-*` classes** to honor CD-05's 16/24/32/24 rhythm.
- Add `data-test="hero-section"` + `data-test="hero-display"` (Phase 1 placeholder selectors already wired; preserve them so Lighthouse spec `tests/lighthouse.spec.ts` lines 80-81 + the new `tests/hero-renders.spec.ts` continue to pass).
- `flex-col-reverse` on mobile + `md:flex-row` on desktop (UI-SPEC line 161-178): photo above text on mobile, photo right on desktop.
- The hero `<h1>` does NOT receive `fadeInUp` (D-24 — LCP-adjacent, no animation).
- The `<HeroPhoto />` element does NOT receive `fadeInUp` either (D-24 — IS the LCP).

---

### `components/home/HeroPhoto.tsx` (component, presentational + asset)

**Analog:** `components/ui/MonogramMark.tsx`

Why it's the right analog: `MonogramMark` is the only existing component that ships a single visual asset with explicit `size` props, leading provenance comment, and decorative `aria-hidden` toggling. The Phase 2 photo follows the same single-purpose ownership pattern — wrap a static asset, encode size + a11y inside the component, expose a minimal API (here, zero props).

**Imports + leading-comment pattern** (`components/ui/MonogramMark.tsx` lines 1-28):
```typescript
// components/home/HeroPhoto.tsx
// Source: PLAN.md WX-TY; UI-SPEC § HeroPhoto (D-01..D-04, D-23, D-24, D-21).
//
// Server Component (NO 'use client' — FOUND-07). Wraps the v1 portrait
// asset in a hairline-border tile with 8px inner padding (D-02). Marked
// with `view-transition-name: hero-photo` (D-21) so Phase 3's /about photo
// can wire the matching name for a CSS-only shared-element transition.
// NO animation — this IS the LCP element (D-24, HOME-04).

import Image from 'next/image';
import portrait from '@/public/portrait.jpg';
```

**Static-import + explicit-size pattern** (no existing `next/image` analog in the repo yet; pull contract straight from UI-SPEC line 217-228 + STACK.md notes):
```tsx
export function HeroPhoto() {
  return (
    <div
      className="rounded border border-[var(--color-border)] p-2 shrink-0"
      style={{ viewTransitionName: 'hero-photo' }}
    >
      <Image
        src={portrait}
        alt="Braeden Hodson"
        width={320}
        height={320}
        priority
        placeholder="blur"
        quality={90}
        className="rounded-[2px] w-60 h-60 md:w-80 md:h-80 object-cover"
      />
    </div>
  );
}
```

**Phase 2 deltas vs `MonogramMark` analog:**
- Use `next/image` with **static import** instead of inline SVG — `width={320} height={320}` (PERF-04, D-23).
- `priority` prop preloads the LCP (Next 16 auto-preload).
- `quality={90}` requires a `next.config.ts` addition: `images: { qualities: [75, 90] }` (Next 16 changed the default from `[1..100]` to `[75]` only — see CLAUDE.md "Image optimization: next/image" note).
- Static import enables `placeholder="blur"` without manual blurDataURL.
- Inline `style={{ viewTransitionName: 'hero-photo' }}` (D-21) — viable in Server Components since it's a static-value style object, no client state.
- Same `aria-hidden` discipline as `MonogramMark` BUT inverted: photo is meaningful, so omit `aria-hidden` and rely on `alt="Braeden Hodson"` (UI-SPEC line 227).
- File location `public/portrait.jpg` — copy from `~/Projects/braehods/images/photo.jpg` (D-04; 193KB v1 placeholder).

---

### `components/home/CurrentlyLine.tsx` (component, data-driven row)

**Analog:** `app/%5Ftokens/page.tsx` color-row (lines 41-52)

Why it's the right analog: that color-row is the closest existing pattern for "small visual swatch + Geist Sans label + Geist Mono value in a flex row." The Currently line is the same shape with an accent dot replacing the color swatch and a `<time>` replacing the value.

**Row composition pattern** (`app/%5Ftokens/page.tsx` lines 41-52):
```tsx
<div key={t.name} className="flex items-center gap-4">
  <span
    className="block h-8 w-8 rounded"
    style={{ background: t.value, border: '1px solid var(--color-border)' }}
  />
  <span className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
    {t.name}
  </span>
  <span className="font-mono text-sm">{t.value}</span>
</div>
```

**Phase 2 transposition** (per UI-SPEC lines 263-271):
```tsx
// components/home/CurrentlyLine.tsx
// Source: PLAN.md WX-TY; UI-SPEC § CurrentlyLine (CD-02, HOME-02).
//
// Server Component. Renders the "Currently" line: accent dot + statement
// + middle dot + Geist Mono date. Date formatting handled by lib/format.ts.

import { formatDate } from '@/lib/format';
import type { CurrentlyStatement } from '@/data/currently';
import { fadeInUp, stagger } from '@/lib/motion';

interface CurrentlyLineProps {
  data: CurrentlyStatement;
}

export function CurrentlyLine({ data }: CurrentlyLineProps) {
  return (
    <p
      className={`mt-6 flex items-center gap-2 text-base ${fadeInUp}`}
      style={stagger(2)}
    >
      <span
        aria-hidden
        className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
      />
      {data.link ? (
        <a href={data.link} className="underline underline-offset-4 decoration-1">
          {data.statement}
        </a>
      ) : (
        <span>{data.statement}</span>
      )}
      <span aria-hidden style={{ color: 'var(--color-muted)' }}>·</span>
      <time
        dateTime={data.updatedAt}
        className="font-mono text-sm"
        style={{ color: 'var(--color-muted)' }}
      >
        {formatDate(data.updatedAt)}
      </time>
    </p>
  );
}
```

**Phase 2 deltas vs analog:**
- Replace `h-8 w-8 rounded` swatch with `w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]` accent dot — 6px circle (CD-02).
- Wrap statement in optional `<a>` if `data.link` is set (UI-SPEC line 268).
- Use `<time dateTime={...}>` semantic wrapper for the date — accessibility win over the analog's plain `<span>`.
- Apply `fadeInUp` + `stagger(2)` from `lib/motion.ts` — first real consumer of the Phase 1 seam.
- Inline `style={{ color: 'var(--color-muted)' }}` mirrors the analog's pattern (lines 47, 52). Alternative: Tailwind `text-[var(--color-muted)]` — both work; analog uses inline-style for the muted variant.

---

### `components/home/ChannelButton.tsx` (component, link button)

**Analog:** `components/layout/Nav.tsx` `linkClass` link (lines 18-19 + 32-37)

Why it's the right analog: the existing Nav link is the only in-repo "interactive `<a>`/`<Link>` with on-grid padding, hover state, font-sans body weight." ChannelButton extends the same pattern with an icon + handle + verb composition and a hairline border.

**Hover-able link pattern** (`components/layout/Nav.tsx` line 18-19 + 32-37):
```typescript
const linkClass =
  'px-2 py-2 font-sans text-base decoration-1 underline-offset-4 hover:underline';

// ...
<Link key={label} href={href} className={linkClass}>
  {label}
</Link>
```

**Phase 2 transposition** (per UI-SPEC lines 319-353):
```tsx
// components/home/ChannelButton.tsx
// Source: PLAN.md WX-TY; UI-SPEC § ChannelButton (D-12..D-14, CD-01).
//
// Server Component. Single external link rendered as a rounded-rectangle
// hairline-bordered button. `target="_blank" rel="noopener noreferrer"`
// per HOME-03. NO 'use client' — pure <a> tag.

import { Youtube, Instagram } from 'lucide-react';
import type { Channel } from '@/data/channels';

const ICON_BY_PLATFORM = { youtube: Youtube, instagram: Instagram } as const;
const CTA_BY_PLATFORM = { youtube: 'Subscribe', instagram: 'DM me' } as const;

interface ChannelButtonProps {
  channel: Channel;
}

export function ChannelButton({ channel }: ChannelButtonProps) {
  const Icon = ICON_BY_PLATFORM[channel.platform];
  const verb = CTA_BY_PLATFORM[channel.platform];
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-sans transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-px hover:border-[var(--color-accent)]"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
      <span style={{ color: 'var(--color-text)' }}>@{channel.handle}</span>
      <span aria-hidden style={{ color: 'var(--color-muted)' }}>·</span>
      <span className="transition-colors" style={{ color: 'var(--color-muted)' }}>
        {verb}
      </span>
    </a>
  );
}
```

**Phase 2 deltas vs Nav-link analog:**
- Use plain `<a>` (external, new tab) — not Next.js `<Link>` which is internal-only.
- `target="_blank" rel="noopener noreferrer"` is required (UI-SPEC line 320, HOME-03).
- Add `border-[var(--color-border)] rounded-md` hairline tile (CD-01). Nav-link has no border.
- Add `px-4 py-3` (16×12) — clears WCAG 44px touch-target by spec (UI-SPEC line 324). On-grid (multiples of 4); do NOT regress to `py-2.5` (checker revision 2026-05-11 explicitly fixed this).
- Add `hover:-translate-y-px` (CD-01 hover lift) — the project's first translate-on-hover. Reduced-motion override in `globals.css` line 54-63 already neutralizes it.
- `lucide-react` imports — Phase 2 is the **first real consumer** of the package (installed Phase 1 unused). Tree-shaken per-icon import: `import { Youtube, Instagram } from 'lucide-react'`. Stroke width 1.75 matches the monogram and Nav hamburger SVG (`Nav.tsx` line 50, 65). Size 18 matches UI-SPEC line 327.
- Body weight (Geist Sans 400). Checker revision 2026-05-11 explicitly dropped `font-medium` here — 2-weight inventory invariant. Do NOT add weight 500.

---

### `components/home/ChannelButtonRow.tsx` (component, list wrapper)

**Analog:** `components/layout/Nav.tsx` desktop nav `LINKS.map` (lines 31-37)

Why it's the right analog: the desktop nav block is the existing pattern for "typed array → `.map()` → flex row of identical link children." Drop-in transposition with `flex-wrap` for mobile.

**Map-to-row pattern** (`components/layout/Nav.tsx` lines 31-37):
```tsx
<nav aria-label="Primary" className="hidden gap-4 sm:flex">
  {LINKS.map(({ href, label }) => (
    <Link key={label} href={href} className={linkClass}>
      {label}
    </Link>
  ))}
</nav>
```

**Phase 2 transposition** (per UI-SPEC lines 348-354):
```tsx
// components/home/ChannelButtonRow.tsx
// Source: PLAN.md WX-TY; UI-SPEC § ChannelButton "Layout" subsection.
//
// Server Component. flex-wrap row wrapping ChannelButton items so the row
// stays single-line on tablet+ but wraps cleanly on 320px viewport (CD-04).
// Per-button stagger lives on each child via lib/motion.ts; wrapper does NOT
// animate (CD-03).

import { ChannelButton } from '@/components/home/ChannelButton';
import { fadeInUp, stagger } from '@/lib/motion';
import type { Channel } from '@/data/channels';

interface ChannelButtonRowProps {
  channels: Channel[];
}

export function ChannelButtonRow({ channels }: ChannelButtonRowProps) {
  return (
    <div className="mt-8 flex flex-row flex-wrap gap-3">
      {channels.map((channel, i) => (
        <div
          key={channel.platform}
          className={fadeInUp}
          style={stagger(3 + i)}
        >
          <ChannelButton channel={channel} />
        </div>
      ))}
    </div>
  );
}
```

**Phase 2 deltas vs Nav analog:**
- `flex-wrap` added — the Nav uses `hidden sm:flex` without wrap (desktop only). Channel row must wrap on mobile (CD-04 explicit).
- Stagger wrapper `<div>` around each `<ChannelButton>` — animation lands on the wrapper so the button itself stays an unanimated `<a>` with its own hover transform. (Otherwise the `fadeInUp` keyframe collides with the hover translate.)
- `key={channel.platform}` since each platform value is unique within the array.
- `stagger(3 + i)` — YT gets `stagger(3)` (240ms), IG gets `stagger(4)` (320ms) per CD-03.
- **NOT** the same wrapping `<nav>` element used in `Nav.tsx` — these are channel links, not site nav. Plain `<div>` wrapper.

---

### `components/home/CTAArrowLink.tsx` (component, text link)

**Analog:** `components/layout/Nav.tsx` `<Link>` row (lines 32-37) with `linkClass`

Why it's the right analog: same Next.js `<Link>` + hover-underline + font-sans body shape. CTAArrowLink swaps text color to accent and appends an arrow glyph.

**Next.js `<Link>` pattern** (`components/layout/Nav.tsx` lines 9 + 32-37):
```typescript
import Link from 'next/link';
// ...
<Link key={label} href={href} className={linkClass}>
  {label}
</Link>
```

**Phase 2 transposition** (per UI-SPEC lines 388-414):
```tsx
// components/home/CTAArrowLink.tsx
// Source: PLAN.md WX-TY; UI-SPEC § CTAArrowLink (D-19, D-20).
//
// Server Component. Accent-colored Next.js <Link> with a right-arrow glyph
// that translates +4px on hover (UI-SPEC line 411). Internal routes only
// (/about, /work) — uses next/link for client-side nav prefetch.

import Link from 'next/link';
import { fadeInUp, stagger } from '@/lib/motion';

interface CTAArrowLinkProps {
  href: string;
  children: string;
  staggerIndex: number;
}

export function CTAArrowLink({ href, children, staggerIndex }: CTAArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4 ${fadeInUp}`}
      style={{ color: 'var(--color-accent)', ...stagger(staggerIndex) }}
    >
      {children}
      <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}
```

**Phase 2 deltas vs Nav-link analog:**
- Color → `var(--color-accent)` instead of inherited body text (Phase 2 D-19 — first non-focus-ring accent use).
- Underline is hover-only, not default (Nav uses `hover:underline` already — same pattern).
- Append Unicode `→` glyph (UI-SPEC line 394 prefers Unicode over Lucide ArrowRight; planner can swap if icon weight reads better).
- `group` + `group-hover:translate-x-1` for the arrow micro-motion. `translate-x-1` = 4px (checker rev 2026-05-11 dropped fractional `translate-x-0.5`).
- Merge `stagger(i)` into the existing inline-style object — both `color` and `--stagger` ride together (React allows arbitrary CSS custom properties via the `as React.CSSProperties` cast already in `lib/motion.ts` line 13-15).

---

### `components/layout/SocialIconLink.tsx` (component, icon link)

**Analog:** `components/ui/MonogramMark.tsx` (currentColor SVG pattern) + `components/layout/Nav.tsx` mobile hamburger button (lines 41-72)

Why it's the right analog: `MonogramMark` already inherits color from the parent via `currentColor` (line 45 `fill="currentColor"`); Phase 2's `Footer.tsx` parent sets `style={{ color: 'var(--color-muted)' }}` (line 22) and the monogram picks it up (line 18-21). SocialIconLink reuses the same currentColor inheritance and the Nav-hamburger's icon-only `<a>` shape (centered icon, square padding, no label).

**currentColor inheritance pattern** (`components/layout/Footer.tsx` lines 18-21):
```tsx
<div className="flex items-center gap-3" style={{ color: 'var(--color-muted)' }}>
  <MonogramMark size={16} aria-hidden />
  <span className="font-sans text-sm">© 2026 Braeden Hodson</span>
</div>
```

**Icon-only `<a>` pattern** (`components/layout/Nav.tsx` lines 41-72 hamburger summary):
```tsx
<summary
  aria-label="Toggle menu"
  className="nav-mobile-toggle flex cursor-pointer items-center justify-center rounded-sm p-2"
>
  <svg /* ... 18px stroke 1.75 ... */ />
</summary>
```

**Phase 2 composition** (per UI-SPEC lines 461-475):
```tsx
// components/layout/SocialIconLink.tsx
// Source: PLAN.md WX-TY; UI-SPEC § FooterSocials (D-15..D-16, HOME-06).
//
// Server Component. Icon-only external link inheriting --color-muted from
// the parent <footer>. lucide-react icon passed as a component prop so the
// import lives at the call site (tree-shaken per-icon).

import type { ComponentType, SVGProps } from 'react';

interface SocialIconLinkProps {
  href: string;
  label: string; // e.g. "GitHub profile"
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>;
}

export function SocialIconLink({ href, label, Icon }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center p-2 transition-colors duration-200 hover:text-[var(--color-text)]"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
    </a>
  );
}
```

**Phase 2 deltas vs analog blend:**
- Combines `MonogramMark`'s `currentColor` inheritance (no explicit color on the `<a>` — parent `<footer>` sets `--color-muted`) with the Nav-hamburger's `flex items-center justify-center p-2` square tactile shape.
- Stroke width 1.75 + size 18 — matches `Nav.tsx` line 50/65 (hamburger) and the ChannelButton platform icons. Consistent stroke pitch.
- `aria-label` is required (UI-SPEC line 472-475 — "GitHub profile", "Instagram profile", "YouTube channel"). Icon itself gets `aria-hidden`.
- Pass `Icon` as a component prop rather than hard-coding which lucide icon — keeps SocialIconLink reusable for all three platforms with a single import at the Footer call site.
- Touch-target trade-off: ~34×34 falls short of WCAG 44×44 (UI-SPEC line 469 acknowledges this is the editorial-restraint trade-off; Phase 6 may revisit).

---

### `components/layout/Footer.tsx` (extend in place)

**Analog:** itself (`components/layout/Footer.tsx`)

Why: D-15 explicit — "extend, do not rewrite." Preserve the `divider-top`, container, monogram + copyright group, and the muted-color inheritance. Insert the social row and source/domain group between the existing left and right groups.

**Existing layout** (`components/layout/Footer.tsx` lines 15-26 — verbatim, preserve):
```tsx
<footer className="divider-top px-6 py-8 lg:px-12">
  <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3" style={{ color: 'var(--color-muted)' }}>
      <MonogramMark size={16} aria-hidden />
      <span className="font-sans text-sm">© 2026 Braeden Hodson</span>
    </div>
    <span className="font-sans text-sm" style={{ color: 'var(--color-muted)' }}>
      braehods.com
    </span>
  </div>
</footer>
```

**Phase 2 extension** (per UI-SPEC lines 442-449):
```tsx
import { MonogramMark } from '@/components/ui/MonogramMark';
import { Github, Instagram, Youtube } from 'lucide-react';
import { SocialIconLink } from '@/components/layout/SocialIconLink';
import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="divider-top px-6 py-8 lg:px-12">
      <div
        className="mx-auto flex max-w-3xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ color: 'var(--color-muted)' }}
      >
        {/* Left: monogram + copyright (unchanged) */}
        <div className="flex items-center gap-3">
          <MonogramMark size={16} aria-hidden />
          <span className="font-sans text-sm">© 2026 Braeden Hodson</span>
        </div>

        {/* Center: social row (new) */}
        <div className="flex items-center gap-4">
          {site.socials.github && (
            <SocialIconLink href={site.socials.github} label="GitHub profile" Icon={Github} />
          )}
          {site.socials.instagram && (
            <SocialIconLink href={site.socials.instagram} label="Instagram profile" Icon={Instagram} />
          )}
          {site.socials.youtube && (
            <SocialIconLink href={site.socials.youtube} label="YouTube channel" Icon={Youtube} />
          )}
        </div>

        {/* Right: source link + domain (new + existing) */}
        <div className="flex items-center gap-4">
          {site.socials.github && (
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm transition-colors hover:text-[var(--color-text)]"
            >
              View source →
            </a>
          )}
          <span className="font-sans text-sm">braehods.com</span>
        </div>
      </div>
    </footer>
  );
}
```

**Phase 2 deltas vs Phase 1 Footer:**
- `gap-3` → `gap-4` on the container (UI-SPEC line 446 — accommodates the social row).
- **Hoist** the muted color to the container `<div>` — both Phase 1 inner blocks already inherit it via repeated inline-style; one parent declaration cleans up the new layout. (Phase 1's repeated `style={{ color: 'var(--color-muted)' }}` on lines 18 + 22 is the documented pattern; hoisting is a minor refactor — preserve the pattern at child elements if the planner prefers, both work.)
- Conditional rendering on `site.socials.*` so undefined values don't render broken links (W0 data populate is gating but defensive coding doesn't hurt).
- `View source →` shares the same href as the GitHub profile per UI-SPEC line 492 "Planner's call. CONTEXT.md doesn't lock; either approach works."

---

### `components/layout/Nav.tsx` (modify in place)

**Analog:** itself (`components/layout/Nav.tsx`)

Why: Phase 2 only rewires the `LINKS` array hrefs. Preserve the mobile disclosure (`a975967` ships the hamburger; UI-SPEC line 11 of Phase 1 inherits verbatim).

**Single change** (`components/layout/Nav.tsx` lines 12-16):
```typescript
// BEFORE (Phase 1):
const LINKS = [
  { href: '/', label: 'About' },
  { href: '/', label: 'Work' },
  { href: '/', label: 'Contact' },
];

// AFTER (Phase 2 — D-18 + Phase 5 carry-forward):
const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/', label: 'Contact' }, // stub until Phase 5 wires the modal trigger
];
```

**Phase 2 deltas vs Phase 1 Nav:**
- `LINKS[0].href`: `/` → `/about`
- `LINKS[1].href`: `/` → `/work`
- `LINKS[2].href`: stays `/` (UI-SPEC line 550 — "Contact → /` (still stub; Phase 5 wires modal trigger)").
- Everything else unchanged — DO NOT touch the `<details>/<summary>` mobile hamburger (a975967), `linkClass`, monogram size 24, or `divider-bottom` chrome.

---

### `lib/format.ts` (utility)

**Analog:** `lib/motion.ts`

Why it's the right analog: `lib/motion.ts` is the project's only existing `lib/` helper. Same role (a tiny pure-function module with a leading source-trace comment + named exports + zero runtime deps). New file follows the same shape exactly.

**File shape** (`lib/motion.ts` lines 1-16):
```typescript
// lib/motion.ts
// Isolation seam for animation. CSS-only for v1; if motion@12.x is ever added,
// this is the one file that changes. Source: CONTEXT.md CD-03; ARCHITECTURE.md.

export const respectsReducedMotion = true;

/** Class name applying @keyframes fade-in-up (defined in app/globals.css). */
export const fadeInUp = 'fade-in-up' as const;

/** Inline-style helper for staggered animation delays.
 *  Usage: <div style={stagger(2)} className={fadeInUp}>...
 *  Phase 2 hero will consume both. */
export function stagger(i: number): React.CSSProperties {
  return { '--stagger': `${i * 80}ms` } as React.CSSProperties;
}
```

**Phase 2 transposition** (per UI-SPEC lines 272-276):
```typescript
// lib/format.ts
// Source: PLAN.md WX-TY; UI-SPEC § CurrentlyLine (CD-02 date suffix).
//
// Date formatter helper. Server-side (RSC) — no client-side date math, no
// timezone surprises. Input: ISO YYYY-MM-DD. Output: "MMM D" (e.g. "May 9").

/** Format an ISO YYYY-MM-DD date string as "MMM D" (no year, no leading zero on day). */
export function formatDate(iso: string): string {
  // Parse as UTC to avoid timezone shifts on YYYY-MM-DD-only inputs.
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d!));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
```

**Phase 2 deltas vs motion-seam analog:**
- Same leading-comment / source-trace discipline.
- Single named export instead of three.
- Uses `Intl.DateTimeFormat` (Node + browser built-in) — zero runtime deps, matches the analog's "no library install" philosophy.
- `timeZone: 'UTC'` + manual `Date.UTC(...)` construction avoids the "May 9 in PST = May 8 in UTC" hazard that bites server-rendered date components.

---

### `app/page.tsx` (rewrite)

**Analog:** `app/%5Ftokens/page.tsx`

Why it's the right analog: same role (Next.js App Router page, Server Component default export, top-of-file source-trace comment, typed-data import → JSX composition). Replace the placeholder hero with the new `<Hero />` composition.

**Imports + structure pattern** (`app/%5Ftokens/page.tsx` lines 1-22 + 33):
```typescript
// app/_tokens/page.tsx
// Source: PLAN.md W3-T4; CONTEXT.md D-11; RESEARCH.md Open Question #4.
//
// Hidden but deployed (D-11). Phase 2 deletes this route. [...]

import { MonogramMark } from '@/components/ui/MonogramMark';

export const metadata = {
  title: 'Tokens',
  robots: { index: false, follow: false },
};

const tokens = [/* ... */] as const;

export default function TokensPage() {
  return (
    <div className="space-y-12">
      {/* ... sections ... */}
    </div>
  );
}
```

**Phase 2 transposition**:
```typescript
// app/page.tsx
// Source: PLAN.md WX-TY; UI-SPEC § Hero (full composition D-01..D-25).
//
// Server Component. Composes the home page hero. Reads typed data from
// data/*.ts (W0 populates channels + site.socials).

import { Hero } from '@/components/home/Hero';

// Phase 1 placeholder removed — Hero now owns the hero block, including the
// data-test="hero-section" / data-test="hero-display" selectors the Phase 1
// Lighthouse + visual specs assert.

export default function HomePage() {
  return <Hero />;
}
```

**Phase 2 deltas vs `_tokens` analog:**
- No `metadata` export here — root layout already sets `title: 'Braeden Hodson'` (UI-SPEC defers per-route metadata to Phase 6 SEO).
- Single component invocation — the hero composition lives in `components/home/Hero.tsx` for testability + reuse on Phase 3 share-element wiring.
- Phase 1's existing `app/page.tsx` lines 3-9 (`<section data-test="hero-section">` + `<h1 data-test="hero-display">`) move INTO `Hero.tsx`. The test selectors are preserved (UI-SPEC line 184-187).
- Wraps inside the root layout's `<main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">` (`app/layout.tsx` line 18). Note: hero needs `max-w-5xl` (UI-SPEC line 194) — Hero.tsx can apply its own wider container as a child if the planner wants OR root layout's max-width can be widened. **Planner decision recommendation:** keep root layout `max-w-3xl` (matches stubs and footer); Hero.tsx applies its own `max-w-5xl` via a nested `<div>` if side-by-side needs the extra width. This avoids regressing Phase 1's stub-page width contract.

---

### `app/about/page.tsx` + `app/work/page.tsx` (stub routes)

**Analog:** `app/page.tsx` (Phase 1 hero scaffold, lines 1-12)

Why it's the right analog: same shape (Server Component, default export, single `<section>` with editorial typography). Strip the Fraunces hero and replace with a muted placeholder line.

**Phase 1 scaffold pattern** (`app/page.tsx` lines 1-12):
```tsx
export default function HomePage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center" data-test="hero-section">
      <h1
        data-test="hero-display"
        className="font-serif text-[clamp(4rem,12vw,6rem)] leading-[1.05] font-bold"
      >
        Braeden
      </h1>
    </section>
  );
}
```

**Phase 2 stub transposition** (per UI-SPEC lines 513-521):
```tsx
// app/about/page.tsx
// Source: PLAN.md WX-TY; UI-SPEC § Stub Routes (D-18, HOME-05).
//
// Stub placeholder until Phase 3 ships real /about content + the matching
// view-transition-name: hero-photo on the about-page photo. Inherits Nav +
// Footer chrome from app/layout.tsx automatically.

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

`app/work/page.tsx` is identical except `title: 'Work'` and the default export name. UI-SPEC line 516-518 specifies `max-w-3xl px-6 py-24 lg:px-12` for the section, but `app/layout.tsx` already applies `mx-auto max-w-3xl px-6 lg:px-12` to `<main>` (line 18) — the stub `<section>` only needs `py-24` vertical padding to override the layout's `py-16`.

**Phase 2 deltas vs Phase 1 hero scaffold:**
- Strip the `<h1>` Fraunces word.
- Replace with a single `<p>` in Geist Sans body weight, muted color.
- `py-24` (96px top + bottom) generous breathing room — makes the empty state feel intentional (UI-SPEC line 528).
- Drop the `data-test="hero-*"` selectors — these are stubs, not heroes.
- Add `export const metadata = { title: 'About' }` (or `'Work'`) — surfaces in the browser tab, leveraging the root layout's `template: '%s · Braeden Hodson'` (`app/layout.tsx` line 9).

---

### `data/channels.ts` + `data/site.ts` (populate)

**Analog:** themselves (shapes locked Phase 1)

Why: Phase 2 only adds values. The `Channel` and `SiteMeta` types stay untouched. UI-SPEC line 696 + Phase 2 CONTEXT lines 95-100 explicit — W0 user-input task BEFORE W1 hero work begins.

**`data/channels.ts` populate** (file currently lines 1-7):
```typescript
export const channels: Channel[] = [
  { platform: 'youtube',   handle: '<braehods handle>', url: 'https://youtube.com/@<handle>' },
  { platform: 'instagram', handle: '<braehods handle>', url: 'https://instagram.com/<handle>' },
];
```

**`data/site.ts` populate `socials`** (file currently lines 9-15):
```typescript
export const site: SiteMeta = {
  // ... name, tagline, domain unchanged ...
  socials: {
    github:    'https://github.com/<user>',
    instagram: 'https://instagram.com/<handle>',
    youtube:   'https://youtube.com/@<handle>',
  },
};
```

**Phase 2 deltas:** Shape unchanged. Values must come from user (CONTEXT.md `<decisions>` "Data the User Must Supply"). Executor blocks W1 on real URLs — Vercel preview must serve working external links.

---

### Test files (new Phase 2 specs)

**Analog:** the Phase 1 `tests/*.spec.ts` suite — specifically:

| New Phase 2 spec (per CONTEXT.md line 159) | Closest Phase 1 analog | What to copy |
|--------------------------------------------|------------------------|--------------|
| `tests/hero-renders.spec.ts` | `tests/monogram.spec.ts` lines 14-24 | `page.goto('/')` + `locator('[data-test="hero-section"]')` + `toHaveCount(1)` assertion shape |
| `tests/photo-lcp.spec.ts` | `tests/lighthouse.spec.ts` lines 35-72 (Lighthouse via `playwright-lighthouse` + `--remote-debugging-port=9222`) | `playAudit` invocation + `lhr.audits['largest-contentful-paint'].numericValue` assertion + the same `chromium-only` skip on `browserName !== 'chromium'` |
| `tests/currently-renders.spec.ts` | `tests/monogram.spec.ts` (DOM presence) + `tests/tokens.spec.ts` (computed-style assertion) | Locator for accent-dot span + statement text + `<time>` element |
| `tests/channels-render.spec.ts` | `tests/monogram.spec.ts` + verifies `target="_blank"` attribute | `page.locator('a[target="_blank"]')` and count = `channels.length` |
| `tests/ctas-resolve-200.spec.ts` | `tests/favicon.spec.ts` lines 14-29 (`request.get('/icon.svg')` + `status(200)`) | `request.get('/about')` + `request.get('/work')` and assert `status() === 200` for both |
| `tests/view-transition-name-present.spec.ts` | `tests/visual.spec.ts` lines 19-38 (computed-style assertion via `getComputedStyle`) | `getComputedStyle(photoWrapper).viewTransitionName === 'hero-photo'` |
| `tests/footer-socials-render.spec.ts` | `tests/monogram.spec.ts` (icon count in `<footer>`) | `page.locator('footer svg').count()` ≥ 3 + per-link `aria-label` check |
| `tests/mobile-hero-stacks-cleanly.spec.ts` | `tests/visual.spec.ts` (computed-style at viewport) + `playwright.config.ts` lines 27-30 (`chromium-mobile` device = Pixel 5) | Use the `chromium-mobile` project; assert hero `flex-direction === 'column-reverse'` |

**Top-of-file boilerplate** (`tests/monogram.spec.ts` lines 1-14):
```typescript
/**
 * HOME-XX: <what this verifies>.
 *
 * Loads `/` and asserts ...
 *
 * RED until WX-TY lands `components/home/...`.
 */
import { test, expect } from '@playwright/test';
```

**Computed-style serializer caveats to inherit** (Phase 1 specs document these — Phase 2 must respect them):
- `tests/focus-ring.spec.ts` line 21-23: outline serializer order — Chromium emits `<color> <style> <width>`, authored CSS is `<width> <style> <color>`. Match both with a regex.
- `tests/visual.spec.ts` line 24-29: `linear-gradient(180deg, ...)` normalizes to no `180deg`. Tolerate both.
- `tests/reduced-motion.spec.ts` line 24-29: `0.01ms` normalizes to `1e-05s`. Accept either.
- `tests/focus-ring.spec.ts` lines 47-49: Vercel preview injects `<vercel-live-feedback>` custom element into the tab order — skip elements whose tagName contains a hyphen.

---

## Shared Patterns

### Server Component default + leading source-trace comment

**Source:** every existing file under `app/`, `components/`, `lib/`
**Apply to:** every new file in Phase 2

```typescript
// <path/to/file>
// Source: PLAN.md WX-TY; UI-SPEC § <Section> (D-XX, CD-XX).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). <one-line purpose>.
// <integration notes if any>.
```

`tests/no-client-components.spec.ts` (lines 65-84) auto-fails the build if any Phase 2 source file adds `'use client'`. Hold the line.

---

### `@/` path alias for all internal imports

**Source:** `tsconfig.json` lines 22-24, `app/layout.tsx` lines 3-4, `components/ui/MonogramMark.tsx` (consumed as `@/components/ui/MonogramMark`)
**Apply to:** every new component import path

```typescript
import { Hero } from '@/components/home/Hero';
import { formatDate } from '@/lib/format';
import { site } from '@/data/site';
import portrait from '@/public/portrait.jpg';
```

Never use relative paths like `../../lib/format`. The alias is consistent everywhere Phase 1 ships.

---

### Color via inline `style={{ color: 'var(--color-*)' }}` (preferred over Tailwind arbitrary)

**Source:** `components/layout/Footer.tsx` lines 18, 22; `app/%5Ftokens/page.tsx` lines 37, 47, 52, 80, 82
**Apply to:** all new components needing token colors

Phase 1 established a clear preference: inline `style={{ color: 'var(--color-muted)' }}` for color (and `style={{ background: ... }}` for backgrounds) rather than `text-[var(--color-muted)]` Tailwind arbitrary syntax. Both work in Tailwind v4; the inline form is what's shipping. **Border colors use the arbitrary syntax** (`border-[var(--color-border)]`) because there's no inline shorthand. Keep this distinction.

Exceptions where Tailwind arbitrary IS used: borders (`border-[var(--color-border)]`), backgrounds when paired with utility classes (`bg-[var(--color-bg-end)]` on the Nav mobile drawer, line 75).

---

### lucide-react: per-icon tree-shaken imports

**Source:** (none yet — Phase 2 is the **first real consumer**; CLAUDE.md "Supporting Libraries" + UI-SPEC line 477-481)
**Apply to:** `ChannelButton.tsx`, `Footer.tsx` (via SocialIconLink)

```typescript
import { Github, Instagram, Youtube } from 'lucide-react';
```

Standardize props across all lucide consumers:
- `size={18}` for inline-in-text icons (channel buttons, social icons)
- `strokeWidth={1.75}` — matches the Nav hamburger SVGs (`Nav.tsx` lines 50, 65)
- `aria-hidden` for decorative icons (parent `<a>` has the `aria-label`)

Do NOT use `react-icons` or any other icon package — CLAUDE.md "What NOT to Use" implicitly via the lucide-only stack lock.

---

### Animation wiring via lib/motion.ts seam

**Source:** `lib/motion.ts` (the seam) + `app/globals.css` lines 66-79 (the keyframe + class)
**Apply to:** `Hero.tsx` (positioning), `CurrentlyLine.tsx`, `ChannelButtonRow.tsx` (per-button), `CTAArrowLink.tsx`, but **NOT** `HeroPhoto.tsx` or the `<h1>` (both LCP-adjacent — D-24)

```typescript
import { fadeInUp, stagger } from '@/lib/motion';

<p className={fadeInUp} style={stagger(1)}>...</p>
```

Spread `stagger(i)` if the element also needs a color inline-style:
```typescript
<Link
  style={{ color: 'var(--color-accent)', ...stagger(staggerIndex) }}
  className={fadeInUp}
>
```

Stagger indices for Phase 2 (UI-SPEC lines 608-617):
- 1 → positioning subhead
- 2 → CurrentlyLine
- 3 → ChannelButton (YouTube)
- 4 → ChannelButton (Instagram)
- 5 → CTAArrowLink (about)
- 6 → CTAArrowLink (work)

---

### Spacing: on-grid multiples of 4 only

**Source:** Phase 1 UI-SPEC lines 36-54 + Phase 2 UI-SPEC line 74 ("No `0.5`/`2.5` fractional Tailwind utilities are used in any component contract")
**Apply to:** every new component

Allowed: `p-1 p-2 p-3 p-4 p-6 p-8 p-12 p-16` (= 4/8/12/16/24/32/48/64px); `gap-1..gap-16` likewise. Plus `mt-4 mt-6 mt-8` for the hero rhythm.

Forbidden: `p-0.5 p-1.5 p-2.5 gap-1.5 translate-x-0.5` etc.

**Documented exceptions** (UI-SPEC lines 69-73):
- Currently accent dot diameter: 6px (`w-1.5 h-1.5`) — explicit sub-grid exception, visual signal.
- Photo `next/image` dimensions: 240/320 — content, not spacers.

The Spacing-Scale invariant test isn't currently in the suite; spec-writers can grep `tsx` for `\.[0-9]+` Tailwind utilities as a guard.

---

### Test data-attribute selectors

**Source:** `app/page.tsx` lines 3, 5 (`data-test="hero-section"`, `data-test="hero-display"`); `tests/lighthouse.spec.ts` line 80
**Apply to:** Hero.tsx (preserve both); spec-writers (target via `[data-test="..."]`)

The two existing data-test selectors must continue to resolve to single elements on `/` so Phase 1's Lighthouse spec keeps passing. New Phase 2 specs add their own selectors (e.g., `data-test="hero-photo-tile"`) sparingly.

---

## No Analog Found

No files in this phase lack an in-repo analog. The only truly new surfaces are:

| Surface | Pattern source (since no Phase 1 file uses it) |
|---------|-----------------------------------------------|
| `next/image` static import + `priority` + `placeholder="blur"` | CLAUDE.md "Image optimization" + Next.js 16 docs (`images.qualities: [75, 90]` config addition) |
| `lucide-react` per-icon tree-shaken import | CLAUDE.md "Supporting Libraries" table |
| `view-transition-name` CSS property | MDN View Transitions API (UI-SPEC line 234 — "Phase 2 is the first consumer") |
| `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })` | Node + browser built-in (CLAUDE.md zero-extra-deps philosophy) |
| `next.config.ts` `images.qualities: [75, 90]` | Required so `quality={90}` is permitted in Next 16 (default was narrowed to `[75]` only) |

Planner pulls these patterns from RESEARCH.md / STACK.md / CLAUDE.md — they're documented stack patterns rather than codebase analogs.

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `data/`, `tests/`, repo root config files
**Files scanned:** 17 source files + 13 test files + 4 data files + 4 config files (`tsconfig.json`, `playwright.config.ts`, `app/fonts.ts`, `app/globals.css`)
**Pattern extraction date:** 2026-05-11
**Notable line-range references** (kept non-overlapping per read-discipline):
- `app/layout.tsx` 1-25 (full)
- `app/page.tsx` 1-12 (full)
- `app/globals.css` 1-106 (full)
- `app/%5Ftokens/page.tsx` 1-89 (full)
- `components/layout/Nav.tsx` 1-87 (full)
- `components/layout/Footer.tsx` 1-28 (full)
- `components/ui/MonogramMark.tsx` 1-56 (full)
- `lib/motion.ts` 1-16 (full)
- `lib/utils.ts` 1-7 (full)
- `data/site.ts` 1-15 + `data/currently.ts` 1-10 + `data/channels.ts` 1-7 (full)
- `tests/*.spec.ts` — one full read of each, no duplicate reads
- `tsconfig.json` 1-35, `playwright.config.ts` 1-49
