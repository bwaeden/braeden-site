# Stack Research

**Domain:** Personal portfolio / brand site (editorial-dark, content-extensible)
**Researched:** 2026-05-07
**Confidence:** HIGH

The user has already locked Next.js (App Router) + MDX + TypeScript + Vercel.
This document is prescriptive about *how* to assemble those pieces and which
sibling libraries earn their bytes given the constraints (Lighthouse 95+ mobile,
WCAG AA, restrained craft motion, dark editorial aesthetic, Formspree
preserved, /writing route deferred but architected-for).

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** | `16.2.6` | App Router, RSC, file-based routing, `next/image`, `next/font`, build pipeline | Locked by user. v16 is current stable (released Oct 21 2025), default Turbopack bundler is 2-5x faster builds and 10x faster Fast Refresh, layout deduplication makes /writing future-cheap. Static-friendly: this site can be fully prerendered with zero runtime cost on Vercel. |
| **React** | `19.2.6` | UI runtime | Required peer for Next 16. View Transitions API (React 19.2) is exactly what "smooth section transitions" calls for — declarative, no library, ships with React. |
| **TypeScript** | `5.9.x` (project) / `6.0.3` (latest) | Type safety, content schema enforcement | Locked by user. Use `strict: true`. Pin to TS 5.9 for now — TS 6.0 just dropped and Velite/some MDX tooling may lag a beat; revisit at first phase boundary. |
| **Tailwind CSS** | `4.2.4` | Styling primitives + design tokens | v4 is stable (since Jan 2025), uses Lightning CSS, full builds 5x faster, incremental builds 100x faster. CSS-first config (`@theme` in `globals.css`) is a perfect fit for editorial design tokens (charcoal scale, electric blue accent, serif/sans font families). Pairs cleanly with Geist/Vercel ecosystem. |
| **MDX** | `@next/mdx 16.2.6` + `@mdx-js/react 3.x` | Long-form content authoring (project pages, future /writing) | Use the *official* `@next/mdx` plugin. It's maintained by the Next.js team, supports App Router via `mdx-components.tsx`, integrates into the build pipeline (no separate watcher), and is the path of least resistance to add /writing later without restructuring. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **`@vercel/analytics`** | `2.0.1` | Pageviews, Core Web Vitals signal | Always — zero-config on Vercel, lightest of the three options measured (touches only `userAgent` + `fetch`, no localStorage). Cookie-free, no consent banner. Adds ~0.5KB to first-load JS. |
| **`@vercel/speed-insights`** | `2.0.0` | Real-user Lighthouse / Web Vitals | Always — required to *prove* the Lighthouse 95+ goal in production, not just lab. Free on Vercel hobby. |
| **`geist`** | `1.7.0` | Geist Sans + Geist Mono via `next/font` | The user is leaving the *current* Geist-only site, but Geist Sans is still the right pick for body copy: it's open-source (SIL OFL), Vercel-ecosystem-native, designed for screen legibility, and reads "2026" without leaning generic Inter. The font shift comes from *pairing* it with an editorial serif (see Fonts section). |
| **`@formspree/react`** | `3.0.0` | Contact form submission to existing endpoint `xqeypnkw` | Required — preserves the existing inbox without server work. `useForm` hook + `ValidationError` component. Note: the package hasn't been republished since 2024; it's stable (not abandoned), but pin the version. See Formspree section for the App Router wiring. |
| **`lucide-react`** | `1.14.0` | Icon set (mail, github, instagram, youtube, arrow-out-link, x-close) | Tree-shakeable per-icon imports keep the bundle tight (~29M weekly downloads, market leader). Stroke-based style matches editorial sensibility better than Phosphor's heavier weights or Tabler's denser strokes. |
| **`clsx`** | `2.1.1` | Conditional className composition | Tiny (~250B), used everywhere with Tailwind. Industry-standard pairing. |
| **`tailwind-merge`** | `3.5.0` | Resolve Tailwind class conflicts (e.g., `cn()` helper) | Required when building reusable components that accept `className` overrides — e.g., a `<Heading>` that has default styles but lets a caller override `text-*`. |
| **`zod`** | `4.4.3` | Runtime schema for project/content metadata | Use to validate the typed JSON/MDX frontmatter for the projects grid (title, slug, year, tags, status). Cheap insurance against typos breaking the build. |
| **`shiki`** | `4.0.2` | Syntax highlighting for MDX code blocks | Build-time highlighting via `rehype-pretty-code` — zero runtime JS. Future-proofs the /writing route (essays will have code). Don't ship Prism: heavier, runtime, themes feel dated. |
| **`rehype-pretty-code`** | `0.14.3` | Shiki integration into MDX pipeline | The standard MDX + Shiki bridge in 2026. Supports per-line highlighting, ANSI, custom themes (use one matching the charcoal palette, e.g., `vesper` or a custom `one-dark`-derived). |
| **`remark-gfm`** | `4.0.1` | GitHub-flavored Markdown in MDX (tables, strikethrough, task lists) | Drop-in remark plugin. Costs nothing at runtime (build-time transform). |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **ESLint 9 (flat config)** | Linting | Use `@next/eslint-plugin-next` (defaults to flat config in Next 16). Note: `next lint` was *removed* in Next 16 — invoke ESLint directly via `npm run lint` script. |
| **Prettier 3.8** + `prettier-plugin-tailwindcss 0.8.0` | Formatting + Tailwind class sort | Auto-sort prevents class-list churn in PRs. |
| **TypeScript 5.9** (`strict: true`) | Type checking | Enable `noUncheckedIndexedAccess` for the project metadata array. |
| **Vercel CLI** | Preview deploys | `vercel --prod` for the launch cutover; preview deploys for design review. |
| **`@next/codemod`** | Future Next upgrades | When Next 17 lands, run `npx @next/codemod@canary upgrade latest`. |

---

## Installation

```bash
# Core (Next + React + TS handled by create-next-app)
npx create-next-app@latest braeden-site \
  --typescript --tailwind --app --src-dir --import-alias "@/*" --use-npm

# MDX (official plugin)
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx

# Content pipeline
npm install rehype-pretty-code shiki remark-gfm zod

# Fonts
npm install geist

# Forms
npm install @formspree/react

# Analytics
npm install @vercel/analytics @vercel/speed-insights

# UI utilities
npm install clsx tailwind-merge lucide-react

# Dev
npm install -D prettier prettier-plugin-tailwindcss
```

---

## Fonts (specific candidates, not generic)

### Display Serif (headlines, name, section heads)

**Recommended: `Fraunces`** (Google Fonts, free, variable)

- Variable font (one file covers Regular through Black + optical sizes), so we
  can scale from "B" monogram-adjacent display weights down to a softer
  paragraph-lead serif without shipping multiple files.
- Has a "Soft" axis and an optical-size axis — supports the editorial-dark
  feel without being as ornate as Tiempos or as expensive (Tiempos is
  commercial; ~$200+ for web license).
- Loads cleanly via `next/font/google` with `display: 'swap'` and subset
  preloading.

**Alternatives considered:**
- **Newsreader** (Google) — also free, also editorial, more "magazine
  paragraph" than "magazine headline." Reach for it if Fraunces feels too
  characterful in the wordmark.
- **GT Sectra** / **Tiempos** / **Editorial New** — what Pentagram/Linear-tier
  sites actually use. Commercial licenses ($200-$2000). Worth it if the user
  later wants to upgrade the brand; *not* worth it for v1 launch.
- **Playfair Display** — avoid. Overused on Squarespace/Webflow; the contrast
  is too high for body and reads "wedding invitation" not "editorial."

### Body Sans (paragraphs, UI, nav)

**Recommended: `Geist Sans`** via the `geist` package

- Vercel-designed, Inter-influenced but more geometric and distinct.
- Loads through `next/font` with full self-hosting (no Google Fonts FOIT).
- Has a Mono companion (`Geist Mono`) for the "currently shipping
  CapitolLens" tickertape, code blocks, and any monospace UI.

**Alternatives considered:**
- **Inter** (Rasmus Andersson) — the safe default. Pick this if Geist feels
  too on-the-nose given the user is *leaving* the current Geist-only site.
  It is more neutral and pairs equally well with Fraunces.
- **Söhne** — what brittanychiang.com et al. actually use. Commercial
  ($600+). Skip for v1.
- **IBM Plex Sans** — also free, slightly warmer than Geist. Consider for the
  /writing route if it ever feels like editorial paragraphs need more
  humanism.

### Pairing decision

Lock in **Fraunces (display) + Geist Sans (body) + Geist Mono (UI accents,
"Currently" ticker, code)**. All free, all loadable through `next/font` with
zero CLS. If the user wants to differentiate from the previous Geist-only
identity hard, swap Geist Sans → Inter — but the differentiation is already
carried by the *serif*, so this is a soft preference.

```ts
// app/fonts.ts
import { Fraunces } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
});

export { GeistSans, GeistMono };
```

---

## Animation Approach (matches "restrained craft")

**Recommendation: CSS-first, no animation library for v1.**

The constraint set — staggered fades on load, hover lifts, smooth section
transitions, no scroll-jacking, no parallax, no WebGL, Lighthouse 95+ — is
*exactly* what CSS now does well without JS. Shipping Motion (formerly
Framer Motion) for this would mean adding ~40KB gzipped of animation runtime
to a site whose entire design language is "restrained."

**What to use instead:**

| Effect | Technique |
|--------|-----------|
| Staggered fades on load | CSS `@keyframes` + `animation-delay` set via `--stagger: calc(var(--i) * 80ms)` inline style on each item. Zero JS. |
| Hover lifts | `transform: translateY(-2px)` + `transition: transform 200ms cubic-bezier(0.2, 0, 0, 1)`. Pure CSS. |
| Section transitions / page reveals | React 19.2 `<ViewTransition>` (built into React, no library). Wraps a component in declarative view-transition semantics; falls back gracefully on unsupported browsers (Safari has partial support, Firefox lagging — but the *fallback is no transition*, which is fine). |
| Reduced motion | `@media (prefers-reduced-motion: reduce) { animation: none !important; transition: none !important; }` block in `globals.css`. WCAG AA requirement. |

**When to add Motion (`motion@12.38.0`, formerly framer-motion):**

Only if a future requirement lands that CSS genuinely can't express:
- Spring-physics drag interactions
- Layout animations across route boundaries that View Transitions can't cover
- Coordinated stagger sequences across many independent components

For v1: **don't install it.** This is a craft signal — every byte of JS is
intentional.

**What NOT to install (animation):**
- ❌ **GSAP** — overkill, ~30KB+, license headaches for commercial use, the
  "agency portfolio" smell.
- ❌ **Lenis** / smooth-scroll libraries — explicitly forbidden by the
  "no scroll-jacking" constraint.
- ❌ **AOS (animate-on-scroll)** — abandoned, jQuery-era, the staggered fade
  pattern with `IntersectionObserver` + CSS is 30 lines of code.

---

## Other Specific Decisions

### MDX setup: `@next/mdx` (not Velite, not next-mdx-remote, definitely not Contentlayer)

| Option | Verdict |
|--------|---------|
| **`@next/mdx`** ✅ | Official, App Router native, integrates via `mdx-components.tsx`, works with `rehype-pretty-code` + `remark-gfm`. Zero risk of being abandoned. **Pick this.** |
| `next-mdx-remote` (`6.0.0`) | Use only if MDX content is fetched from a *remote* source (CMS, GitHub API). Not the case here — content lives in-repo. |
| `velite` (`0.3.1`) | Type-safe, Zod-driven, generates a typed content layer. Genuinely good — but: still pre-1.0, single maintainer, and overkill when v1 has 7 projects in a JSON file and zero blog posts. Re-evaluate when `/writing` ships and post count crosses ~20. |
| `contentlayer` ❌ | **Abandoned.** Last publish June 2023. Do not use. |

### Image optimization: `next/image` (already included)

- Use it for the portrait photo and any project thumbnails.
- Note: Next.js 16 changed `images.qualities` default from `[1..100]` to
  `[75]`. If the portrait needs higher fidelity, set
  `images.qualities: [75, 90]` in `next.config.ts` and pass `quality={90}`.
- Place static assets in `public/` for the hero portrait; use `priority` prop
  to preload above-the-fold.
- For the placeholder portrait phase, use a low-quality blur placeholder
  generated by `next/image`'s `placeholder="blur"` from a static import.

### Monogram approach: inline SVG component

```tsx
// app/components/Monogram.tsx
export function Monogram({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* B path here, single color: currentColor */}
    </svg>
  );
}
```

**Why inline (not imported `.svg`):**
- Recolorable via `currentColor` (one component, works in hero, footer,
  favicon).
- Zero HTTP request, no flash.
- Tiny (a "B" monogram is <500 bytes of path data).
- Reusable for the favicon by hand-converting the same path to `favicon.svg`
  + `apple-touch-icon.png`.

**Don't:** import as a `.svg` URL — that's a request and breaks `currentColor`.
**Don't:** use `@svgr/webpack` for a single mark — yak-shave for one icon.

### Grain texture: SVG `feTurbulence` filter, applied as background-image

```css
/* globals.css */
.grain {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
  background-size: 200px;
  mix-blend-mode: overlay;
  opacity: 0.06;
  pointer-events: none;
}
```

**Why SVG `feTurbulence`:**
- Single inline data-URI, ~400 bytes — beats a PNG/WebP grain texture by
  10-50x.
- Resolution-independent (sharp on Retina without 2x assets).
- `mix-blend-mode: overlay` over the charcoal gradient gives the dithered
  film-grain look that prevents banding on the long gradient.

**Apply via:** a single `<div className="grain">` absolutely positioned over
the `<body>` background, `pointer-events: none`, fixed positioning so it
doesn't scroll-jitter.

**Don't:** use a PNG. Even an optimized one is 5-30KB and looks fuzzy on
Retina. **Don't:** layer two SVG noises ("dual-octave") — diminishing returns,
ship one and tune `baseFrequency`.

### Formspree integration

The existing endpoint is `https://formspree.io/f/xqeypnkw`. Two valid paths:

**Option A (recommended): `@formspree/react` hook in a Client Component**

```tsx
'use client';
import { useForm, ValidationError } from '@formspree/react';

export function ContactForm() {
  const [state, handleSubmit] = useForm('xqeypnkw');
  if (state.succeeded) return <p>Thanks — I'll reply within a day or two.</p>;
  return (
    <form onSubmit={handleSubmit}>
      {/* email + message fields, ValidationError per field */}
    </form>
  );
}
```

- Handles loading / error / success states out of the box.
- Keeps the form a small client island; the rest of the page stays RSC.
- Zero server code (matches the user's "no CMS, no backend" constraint).

**Option B: Server Action that POSTs to Formspree from the server**

- More "modern Next 16" but: (a) the form is the *only* dynamic piece on the
  whole site, so adding a Server Action route just to proxy a POST is
  ceremony, (b) Formspree's spam protection (honeypot, reCAPTCHA fallback)
  works best when the request comes from the browser, (c) `@formspree/react`
  has a year of production wear.

**Pick A.** Wire honeypot via Formspree's `_gotcha` hidden input pattern (no
JS dependency).

### Analytics: Vercel Analytics + Speed Insights (recommended), defer Plausible

| Option | Verdict |
|--------|---------|
| **Vercel Analytics + Speed Insights** ✅ | Free on hobby tier, zero-config, cookie-free, lightest API surface (just `userAgent` + `fetch`), no consent banner needed in EU. Speed Insights is the only way to *verify* the Lighthouse 95+ goal in production with real users. **Pick this.** |
| Plausible Cloud | Genuinely better dashboard for "where are people landing from," but $9/mo and adds a ~1.8KB script. Not worth it for a personal site that ships 1-2 traffic spikes/month. Reconsider only if `/writing` becomes a real channel. |
| Umami (self-hosted) | Free if self-hosted, but requires a Postgres + a deploy. Yak-shave for a portfolio. |
| Google Analytics 4 | ❌ — requires a cookie banner in EU, much heavier script, fights the editorial aesthetic. Avoid. |

### Deploy: Vercel (locked) — concrete config

- **Framework preset:** Next.js (auto-detected).
- **Production branch:** `main`.
- **Environment variables:** `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` (so the ID
  is configurable per-environment but defaults to the user's existing
  endpoint).
- **Domain:** Add `braehods.com` + `www.braehods.com` in Vercel project
  settings, set apex DNS to Vercel's anycast (`76.76.21.21`), `www` as CNAME
  to `cname.vercel-dns.com`. Migration from current GitHub Pages CNAME
  happens at cutover.
- **Build command:** `next build` (default).
- **Output:** Mostly SSG. The site is statically generatable end-to-end —
  Vercel will prerender every route at build time, contact form is a client
  island, no Server Components hit a database.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Tailwind v4 | CSS Modules | If the user wanted hand-crafted CSS-in-CSS with no utility framework. Tailwind v4's CSS-first config is closer to vanilla CSS than v3 ever was — alternative is unnecessary here. |
| Tailwind v4 | vanilla-extract | If the project needed type-safe styles shared across a large component library. Overkill for a 5-page site. |
| `@next/mdx` | Velite | When `/writing` ships with 20+ posts and frontmatter validation becomes load-bearing. Plan to migrate then; don't pre-optimize now. |
| CSS-only animation | `motion@12.38.0` | If a future requirement needs spring physics, layout animations, or coordinated multi-element stagger that CSS can't cleanly express. Defer until then. |
| Fraunces | Tiempos / GT Sectra | When the user is ready to spend $200-$2000 on a commercial editorial license. Migration is a one-line change in `app/fonts.ts`. |
| Geist Sans | Inter | If post-launch the user feels too tied to the previous Geist identity. Drop-in swap, no design impact. |
| Lucide | `react-icons` | Only if needing brand glyphs (FontAwesome, Simple Icons) that Lucide lacks. For YouTube/Instagram/GitHub specifically, Lucide has all three. |
| Vercel Analytics | Plausible | When `/writing` becomes content-marketing serious and you need referrer + UTM analysis Vercel doesn't surface. |
| `@formspree/react` | Server Action + native fetch to Formspree | If you ever migrate off Formspree to your own SMTP (Resend, Postmark). Until then, the React hook is faster to build with. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Contentlayer** | Abandoned (last publish June 2023). Repository unmaintained. Past-tense library being recommended in stale 2024 tutorials. | `@next/mdx` (now) → `velite` (later, if /writing scales) |
| **Pages Router** | Legacy. The user explicitly chose App Router. Don't accidentally mix `pages/api/` for the contact form — use Route Handlers in `app/` if a server route is ever needed. | App Router only |
| **Webpack** in Next 16 | Default switched to Turbopack. Sticking with webpack means slower DX with no upside on a fresh project. | Default Turbopack |
| **GSAP** | Bundle weight (~30KB), commercial license confusion, "agency demo reel" aesthetic. | CSS animations + React 19.2 View Transitions |
| **Lenis** / smooth-scroll | Explicitly forbidden by "no scroll-jacking" constraint. Hijacks native scroll, breaks accessibility, fights the OS. | Native browser scroll, `scroll-behavior: smooth` only on internal anchor links if needed |
| **WebGL** (`react-three-fiber`, Three.js, `OGL`) | Explicitly forbidden by spec. Heavy, CLS risk, accessibility nightmare. | SVG monogram + grain filter |
| **Glassmorphism** (`backdrop-filter` heavy panels) | Explicitly listed as anti-pattern in PROJECT.md. Performance cost on mobile (Safari especially), aesthetic is exhausted. | Solid charcoal panels with grain overlay |
| **Particle/orb backgrounds** (tsParticles, vanta.js) | Anti-pattern in PROJECT.md. WebGL-adjacent. | Gradient + grain |
| **Google Analytics 4** | Cookie consent banner, heavy script (~50KB), regulatory headaches. | Vercel Analytics |
| **`framer-motion`** package name | The package is now `motion` (rebranded late 2024). Importing from `framer-motion` still works but is the older entry point. | If/when adding: `npm install motion`, import from `motion/react` |
| **`next/legacy/image`** | Deprecated in Next 16. | `next/image` |
| **`middleware.ts`** | Renamed to `proxy.ts` in Next 16; old name deprecated. | `proxy.ts` (and unlikely to be needed at all for this site) |
| **`images.domains` config** | Deprecated in Next 16 in favor of `images.remotePatterns`. | `images.remotePatterns` (also unlikely to be needed — most images are local) |
| **Radix UI primitives** | Excellent library, but the only modal on the site is the contact form. A ~50-line `<dialog>` element ships native, accessible, and zero-dep. Adding `@radix-ui/react-dialog` (`1.1.15`) for one modal is a yak-shave. | Native HTML `<dialog>` element with `:modal` styling |
| **`next-themes`** | Theme switcher library — not needed (dark-only by spec). | Don't install. If light mode ever ships, revisit. |
| **Heavy CMS (Sanity, Contentful, Payload)** | Spec explicitly excludes a CMS for v1. Content lives in MDX/JSON. | MDX in `content/`, JSON in `data/` |

---

## Stack Patterns by Variant

**If `/writing` ships in the next milestone (post-launch):**
- Add `velite@0.3.1` for type-safe frontmatter + tag taxonomy validation.
- Add `reading-time` package for "X min read" metadata.
- Keep `@next/mdx` as the renderer, use Velite for the content layer only.
- Consider `feed` package for an RSS feed.

**If a future product page needs interactive demos (e.g., a CapitolLens dashboard preview):**
- Add `motion@12.38.0` then (not before).
- Add `recharts` or `visx` for charts (don't ship D3 raw).
- Lazy-load the demo as a dynamic import — keep it off the homepage's
  initial bundle.

**If the portrait shoot eventually delivers high-res imagery:**
- Add `next/image` `placeholder="blur"` with static imports for blur data.
- Consider `sharp` for build-time AVIF generation (Vercel handles this
  automatically, but local dev wants `sharp` for parity).

**If light mode is ever added:**
- Add `next-themes@0.4.6`.
- Re-derive the charcoal palette as CSS custom properties keyed off `[data-theme]`.
- Re-evaluate the grain filter (currently tuned for dark; light-mode noise
  needs `mix-blend-mode: multiply` instead of `overlay`).

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.2.6` | `react@^19.0.0`, `react-dom@^19.0.0` | Hard requirement. React 18 is *not* supported on Next 16. |
| `next@16.2.6` | `node@>=20.9.0` | Node 18 dropped. Vercel runs 20 LTS by default. |
| `next@16.2.6` | `typescript@>=5.1` | TS 5.9 fine, TS 6.0.3 fine. |
| `motion@12.38.0` | `react@^18.0.0 \|\| ^19.0.0` | Compatible with React 19 (the old framer-motion → motion rebrand fixed the React 19 issues). Not needed for v1 but documented in case of future. |
| `tailwindcss@4.2.4` | `@tailwindcss/postcss@4.2.4` (matched), Browsers: Safari 16.4+, Chrome 111+, Firefox 128+ | Matches Next 16's browser baseline (Chrome 111+, Safari 16.4+). |
| `@formspree/react@3.0.0` | `react@>=16.8` | Works fine with React 19 despite stale publish date — pure hook, no internals depending on React versions. |
| `@vercel/analytics@2.0.1` | `next@>=13`, any React | Universal. |
| `geist@1.7.0` | `next@>=13.2` (for `next/font`) | Self-hosted, zero external font requests. |
| `velite@0.3.1` (if added later) | Vite-style runtime, runs alongside Next dev — separate watcher | Use only when /writing post count justifies the build-time complexity. |

---

## Open Questions / Phase Flags

- **Monogram form:** Deferred to design phase (per PROJECT.md). Stack
  recommendation is "inline SVG component" regardless of which mark wins —
  the implementation pattern doesn't change.
- **View Transitions browser support:** Chrome/Edge full, Safari partial,
  Firefox lagging. Fallback (no transition) is acceptable. Verify the
  exact UX in Safari during the design review phase.
- **Velite migration trigger:** When `/writing` post count crosses ~10-15
  posts and frontmatter typos are causing build breakages. Until then,
  vanilla `@next/mdx` + a hand-rolled `data/projects.ts` typed array is
  enough.
- **TypeScript 6.0 adoption:** Just released (May 2026). Pin to TS 5.9 for
  v1 launch; adopt 6.0 at first phase boundary after verifying Velite +
  Next 16 + ESLint plugins all play nice.

---

## Sources

- [Next.js 16 Release Notes (Oct 21 2025)](https://nextjs.org/blog/next-16) — verified Next 16 features, breaking changes, Turbopack default, React 19.2 integration, `proxy.ts` rename. **HIGH** confidence.
- [Next.js Upgrade Guide v16](https://nextjs.org/docs/app/guides/upgrading/version-16) — verified deprecations, removed APIs. **HIGH** confidence.
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) — verified v4 stable status (Jan 2025), Lightning CSS, browser baseline. **HIGH** confidence.
- [npm registry direct query](https://www.npmjs.com) — verified all version numbers as of 2026-05-07: `next@16.2.6`, `react@19.2.6`, `tailwindcss@4.2.4`, `motion@12.38.0`, `velite@0.3.1`, `next-mdx-remote@6.0.0`, `@next/mdx@16.2.6`, `@vercel/analytics@2.0.1`, `@formspree/react@3.0.0`, `lucide-react@1.14.0`, `clsx@2.1.1`, `tailwind-merge@3.5.0`, `zod@4.4.3`, `shiki@4.0.2`, `rehype-pretty-code@0.14.3`, `geist@1.7.0`. **HIGH** confidence.
- [Contentlayer npm last publish](https://www.npmjs.com/package/contentlayer) — verified abandoned (last modified June 2023). **HIGH** confidence.
- [Motion (formerly Framer Motion) docs](https://motion.dev/) — verified rebrand, current version, React 19 compatibility. **HIGH** confidence.
- [CSS-Tricks: Grainy Gradients](https://css-tricks.com/grainy-gradients/) — verified SVG `feTurbulence` technique for noise. **HIGH** confidence.
- [Vercel Geist Font](https://vercel.com/font) — verified open-source SIL OFL licensing. **HIGH** confidence.
- [Google Fonts: Fraunces](https://fonts.google.com/specimen/Fraunces) — verified variable font, axes, free license. **HIGH** confidence.
- [@formspree/react on npm](https://www.npmjs.com/package/@formspree/react) — verified API surface (`useForm`, `ValidationError`). **MEDIUM** confidence (last publish 2024 — stable but not active).
- [Privacy-first analytics comparison (Nuxt Scripts blog)](https://scripts.nuxt.com/learn/privacy-first-analytics-compared) — verified Vercel Analytics minimal API surface vs Plausible vs Umami. **MEDIUM** confidence (independent benchmark).
- [Lucide React bundle size benchmark (CodeToDeploy)](https://medium.com/codetodeploy/the-hidden-bundle-cost-of-react-icons-why-lucide-wins-in-2026-1ddb74c1a86c) — verified Lucide's tree-shaking advantage over Phosphor. **MEDIUM** confidence (third-party benchmark).
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — verified accessibility pattern. **HIGH** confidence.

---
*Stack research for: personal portfolio / brand site (editorial-dark, Next.js + MDX + TS + Vercel locked)*
*Researched: 2026-05-07*
