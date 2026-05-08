# Phase 1: Foundation + Design Tokens - Research

**Researched:** 2026-05-08
**Domain:** Next.js 16 App Router scaffold + design-token surface + Vercel preview pipeline + accessibility contracts
**Confidence:** HIGH (every locked decision is already in CONTEXT.md / UI-SPEC; remaining surface is patterns + verification)

---

## Summary

Phase 1 is unusually well-pre-decided. CONTEXT.md locks 14 implementation decisions (D-01..D-14) and 3 Claude-discretion items (CD-01..CD-03), and UI-SPEC.md fully derives the visual contract from CONTEXT + REQUIREMENTS + STACK + PITFALLS. **Research's job is not to discover stack choices — those are locked.** Research's job is to give the planner (a) the concrete patterns each decision implies, (b) the validation hooks that prove each success criterion, and (c) the small handful of remaining open decisions the planner needs to make (e.g., favicon foreground/background direction, exact `body::after` opacity tuning).

The dominant risks are not stack risks. They are **execution-detail risks**: (1) `mix-blend-mode: overlay` on `body::after` may regress mobile Lighthouse and needs an instrumented fallback, (2) Fraunces variable axes loaded via `next/font/google` have a documented `axes` API that must be wired correctly to actually use the SOFT axis, (3) Vercel preview SSL staging for `braehods.com` requires the domain be added BEFORE the CNAME flip (Phase 6) — the planner must order this correctly, (4) `body::after` grain interacts with `:focus-visible` z-index — focus rings must remain visible above the grain layer.

**Primary recommendation:** Plan Phase 1 as five sequential waves: (W0) test scaffold + bootstrap, (W1) design tokens + globals.css, (W2) fonts + monogram, (W3) layout chrome (Nav + Footer), (W4) Vercel + observability + verification gate. Each wave merges to `main` and produces an independently-deployable preview URL — this matches the "every phase ships a preview" project rule and makes regressions trivially bisectable.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

#### B Monogram (v1 placeholder)
- **D-01:** Ship a Fraunces-traced "B" as a placeholder for v1; flag a swap-pass in Phase 6 when the real mark is designed.
- **D-02:** Form = Fraunces "B" exported as an SVG `<path>` (not geometric, not letter-in-shape).
- **D-03:** Variant = Fraunces Black, Soft axis full. Trace from the variable font instance, then export path data.
- **D-04:** Single SVG path used everywhere via `components/ui/MonogramMark.tsx` with a `size` prop and `currentColor` fill. For `favicon.svg` at 16/32px, add `shape-rendering="crispEdges"` and ship a slightly-thicker stem variant of the same path. No separate hand-simplified favicon path; no PNG fallback for v1.
- **D-05:** Surfaces wired in Phase 1: nav, footer, `app/icon.svg` (favicon convention).

#### Color Tokens + Tailwind v4 wiring
- **D-06:** Lock muted text at `#a8a8a8` (clears WCAG AA against `#0a0a0a`). REQUIREMENTS.md DSGN-03 updated to match.
- **D-07:** Tokens live in `@theme` only inside `app/globals.css`. All component code uses Tailwind classes. Tailwind v4 auto-exposes `@theme` tokens as CSS custom properties. No parallel `:root` block.
- **D-08:** Six tokens for v1, named flat (no scales): `--color-bg-start: #1a1a1f`, `--color-bg-end: #0a0a0a`, `--color-text: #e8e8e8`, `--color-muted: #a8a8a8`, `--color-accent: #7c87ff`, `--color-border: #2a2a2f`.
- **D-09:** Gradient + grain composition: body gradient via `linear-gradient(180deg, var(--color-bg-start), var(--color-bg-end))`, grain via `body::after` with inline SVG feTurbulence data-URI, opacity 0.04, mix-blend-mode overlay. No separate component file.

#### Repo Bootstrap + Vercel Deploy
- **D-10:** Bootstrap via `npx create-next-app@latest ../braeden-site-bootstrap --typescript --tailwind --app --use-npm`, then merge generated files into this repo (preserving `.git`, `.planning/`, `CLAUDE.md`).
- **D-11:** Phase 1 preview renders a token-showcase: `/` shows gradient + grain + monogram in nav and footer + a single Fraunces hero word ("Braeden"). Plus a hidden `/_tokens` route that lists every color token, type ramp, and the monogram at every size. Phase 2 deletes/replaces both.
- **D-12:** Vercel project: name `braeden-site`, production branch `main`, every other branch + PR gets a preview URL. Add `braehods.com` and `www.braehods.com` to the project as a Phase 1 deliverable (DNS still points at GitHub Pages, but Vercel begins SSL cert staging). DNS CNAME flip stays in Phase 6.
- **D-13:** `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` set in Vercel project env (all environments).
- **D-14:** Install `@vercel/analytics` and `@vercel/speed-insights` in Phase 1 (not Phase 6) for real-user Core Web Vitals data on every preview from day one.

### Claude's Discretion (executor follows PITFALLS guidance — no further user discussion)

- **CD-01:** Reduced-motion = opt-out global override in `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- **CD-02:** Focus ring = `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: inherit; }` global rule. Never `outline: none` without explicit replacement.
- **CD-03:** `lib/motion.ts` ships in Phase 1 as the isolation seam ARCHITECTURE.md calls for, even though Phase 1 has no motion of its own. Exports `respectsReducedMotion`, `fadeInUp` class name, `stagger(i)` helper. No `motion@12.x` install.

### Deferred Ideas (OUT OF SCOPE)

- Real B monogram design (Phase 6 swap-pass)
- iOS Safari favicon PNG fallback (Phase 6 if real-device testing flags it)
- `apple-touch-icon.png`, web manifest (Phase 6 SEO sweep)
- TS 6.0 adoption (re-evaluate at first phase boundary)
- Light-mode toggle (LITE-01, v2)

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Project scaffolds with Next.js 16 (App Router) + React 19 + TypeScript 5.9 | Standard Stack table; create-next-app command (D-10) |
| FOUND-02 | Tailwind v4 installed with `@theme` design tokens defined in `app/globals.css` | `@theme` Pattern (Pattern 1); D-07/D-08 lock the surface |
| FOUND-03 | `@next/mdx` configured with `content/` folder | MDX Config Pattern (Pattern 5); STACK.md has `@next/mdx@16.2.6` verified |
| FOUND-04 | Folder layout enforced: `app/`, `components/{ui,layout}`, `content/`, `data/`, `lib/`, `public/`, `@/*` alias | Project Structure section; ARCHITECTURE.md prescribes layout |
| FOUND-05 | Vercel preview deploy wired (every PR gets a preview URL) | Vercel Pipeline Pattern (Pattern 6); D-12 |
| FOUND-06 | Repo init with `.gitignore`, `README.md`, ESLint + Prettier defaults | ESLint 9 flat config + Prettier 3.8 + `prettier-plugin-tailwindcss` per STACK.md |
| FOUND-07 | Single client island for `ContactModal`; everything else server-rendered | RSC-default Pattern (Pattern 2); Phase 1 ships zero client components |
| FOUND-08 | Typed data layer scaffolded: `data/site.ts`, `data/currently.ts`, `data/channels.ts`, `data/projects.ts` | Data Scaffolds Pattern (Pattern 7); types/Zod schemas |
| DSGN-01 | Charcoal gradient background | Pattern 3 (gradient + grain); D-09 |
| DSGN-02 | Subtle grain overlay <2KB | Pattern 3; CSS-Tricks Grainy Gradients verified |
| DSGN-03 | Color tokens (text/muted/accent/border) | D-06/D-08 |
| DSGN-04 | Fraunces + Geist Sans + Geist Mono via `next/font`, zero CLS, font-display swap | Pattern 4 (next/font); `axes: ['SOFT', 'opsz']` for Fraunces |
| DSGN-05 | B monogram as inline SVG React component, sized via prop | Pattern 8 (MonogramMark); D-01..D-04 |
| DSGN-06 | Visible focus ring style globally | CD-02 |
| DSGN-07 | Restrained motion primitives (defined, not implemented in Phase 1) | CD-03 (`lib/motion.ts` seam ships, keyframes defined) |
| DSGN-08 | All motion gated behind reduced-motion preference | CD-01 (opt-out global override) |
| DSGN-09 | WCAG AA contrast verified at gradient endpoints | Verification gate; WebAIM contrast checker tooling |
| A11Y-02 | Visible focus rings (no `outline: none` without replacement) | CD-02 |
| A11Y-06 | `prefers-reduced-motion` respected | CD-01 |
| SEO-07 | Custom favicon set via B monogram | Pattern 8 + `app/icon.svg` convention |

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design token surface | Build / CSS | Browser (computed style) | Tokens emit at build via Tailwind v4 `@theme`; browser resolves CSS custom properties at render |
| Charcoal gradient | Browser (CSS) | — | Pure CSS `linear-gradient` on `body`, `background-attachment: fixed` |
| Grain overlay | Browser (CSS + inline SVG) | — | `body::after` with data-URI feTurbulence; static, GPU compositing only |
| Font loading | Build (next/font) | Browser (font-display: swap) | next/font self-hosts at build, browser swaps fallback to actual when ready |
| Monogram component | RSC (Server Component) | — | Pure SVG path, no interactivity; renders at build, ships as HTML |
| Favicon | Build / Static asset | Browser (cache) | `app/icon.svg` static file; Next 16 auto-injects link tags |
| Nav/Footer chrome | RSC | — | Server-rendered; no client state in Phase 1 |
| Reduced-motion contract | Browser (CSS @media) | — | Honored entirely by browser via media query |
| Focus ring contract | Browser (CSS `:focus-visible`) | — | Browser-managed pseudo-class |
| Vercel preview pipeline | CI/CD (Vercel) | — | Build runs on Vercel; preview URL exposed per branch/PR |
| Real-user telemetry | Browser → Vercel | — | `@vercel/analytics` + `@vercel/speed-insights` send events; Vercel ingests |
| Domain SSL staging | Vercel control plane | DNS (still GitHub Pages) | Vercel pre-stages cert for `braehods.com` while DNS still points elsewhere — eliminates Phase 6 SSL race |

---

## Standard Stack

### Core (verified versions per STACK.md & CLAUDE.md, 2026-05-07 npm registry checks)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.2.6` | App Router, RSC, build pipeline, font/image optimization, file-convention favicons | Locked by user. v16 is current stable (Oct 2025). Default Turbopack 2-5x faster builds. `app/icon.svg` convention auto-generates favicon link tags. [VERIFIED: STACK.md npm check 2026-05-07] |
| `react` + `react-dom` | `19.2.6` | UI runtime | Required peer for Next 16. View Transitions API ships natively (used in Phase 2/3, not Phase 1). [VERIFIED: STACK.md] |
| `typescript` | `5.9.x` (pin, not `^`) | Type safety | TS 6.0 just dropped May 2026 — pin 5.9 to avoid Velite/MDX tooling lag (per CLAUDE.md). `strict: true`, `noUncheckedIndexedAccess: true`. [VERIFIED: CLAUDE.md] |
| `tailwindcss` | `4.2.4` | Styling + design tokens via `@theme` | v4 stable since Jan 2025. Lightning CSS. Browser baseline: Safari 16.4+, Chrome 111+, Firefox 128+ — matches Next 16. CSS-first `@theme` is the official direction. [VERIFIED: tailwindcss.com/blog/tailwindcss-v4] |
| `@tailwindcss/postcss` | `4.2.4` | Tailwind v4 PostCSS bridge | Required for Next 16 + Tailwind v4 integration. [VERIFIED: tailwindcss v4 docs] |
| `@next/mdx` | `16.2.6` | MDX in App Router (used Phase 4 for projects) | Phase 1 installs and configures the plugin even though Phase 1 has no MDX content yet — wiring in `next.config.ts` and `mdx-components.tsx` belongs here so Phase 4 just adds files. [VERIFIED: STACK.md] |
| `@mdx-js/loader` + `@mdx-js/react` | `3.x` | MDX loader + React adapter | `@next/mdx` peer deps. [VERIFIED: STACK.md] |
| `@types/mdx` | latest | TS types for MDX | Required when `next.config.ts` references MDX in TS. [VERIFIED: STACK.md] |

### Supporting (Phase 1 installs)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `geist` | `1.7.0` | Geist Sans + Geist Mono via `next/font` | Required for DSGN-04. Self-hosted, no Google Fonts FOIT. [VERIFIED: STACK.md npm check] |
| `@vercel/analytics` | `2.0.1` | Pageviews, Core Web Vitals signal | D-14 — install Phase 1 for real-user data on every preview. ~0.5KB first-load. [VERIFIED: STACK.md] |
| `@vercel/speed-insights` | `2.0.0` | Real-user Lighthouse metrics | D-14 — required to verify the Lighthouse 95+ goal in production. [VERIFIED: STACK.md] |
| `clsx` | `2.1.1` | Conditional className composition | Used by `cn()` helper in `lib/utils.ts`. ~250B. [VERIFIED: STACK.md] |
| `tailwind-merge` | `3.5.0` | Resolve Tailwind class conflicts | Required for `cn()` helper that lets components accept `className` overrides cleanly. [VERIFIED: STACK.md] |
| `zod` | `4.4.3` | Runtime schema for typed data files | FOUND-08 calls for typed data files with TS types or Zod schemas. Use Zod for `data/projects.ts` to validate at build. [VERIFIED: STACK.md] |
| `lucide-react` | `1.14.0` | Icon set | Phase 1 installs but doesn't surface icons in UI; library is dormant until Phase 2. Tree-shakeable. [VERIFIED: STACK.md] |

### Dev Tools (Phase 1 installs, mostly via create-next-app + manual additions)

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| `eslint` (flat config) | 9.x (latest) | Linting | `@next/eslint-plugin-next` defaults to flat config in Next 16. **`next lint` was removed in Next 16** — invoke ESLint directly via `npm run lint`. [VERIFIED: CLAUDE.md] |
| `prettier` | `3.8` | Formatting | [VERIFIED: STACK.md] |
| `prettier-plugin-tailwindcss` | `0.8.0` | Auto-sort Tailwind classes | Prevents class-list churn in PRs. [VERIFIED: STACK.md] |

### Deliberately NOT installed in Phase 1 (per CONTEXT.md / CLAUDE.md "What NOT to Use")

| Library | Reason |
|---------|--------|
| `motion` (formerly framer-motion) | CSS-only animation for v1 per CD-03; `lib/motion.ts` is the isolation seam if motion is ever needed |
| `@radix-ui/react-dialog` | Native `<dialog>` for the one Phase 5 modal — explicitly rejected in CLAUDE.md |
| `@formspree/react` | Phase 5 install, not Phase 1 |
| `shiki`, `rehype-pretty-code`, `remark-gfm` | Phase 4 install when project MDX content lands; Phase 1's `@next/mdx` wiring leaves the rehype/remark plugin slots empty |
| `velite` | Pre-1.0, single maintainer; revisit at /writing v2 milestone |
| `next-themes` | Dark-only by spec |
| Google Analytics 4 | Cookie banner + heavy script |
| GSAP, Lenis, AOS, framer-motion (old name), tsParticles, vanta.js, react-three-fiber, OGL | All in CLAUDE.md "What NOT to Use" |

### Installation (Phase 1 specific)

```bash
# Bootstrap (from a temp directory per D-10)
npx create-next-app@latest ../braeden-site-bootstrap \
  --typescript --tailwind --app --use-npm --eslint
# Then merge generated files into this repo, preserving .git/, .planning/, CLAUDE.md

# After merge, install Phase 1 dependencies
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install geist
npm install @vercel/analytics @vercel/speed-insights
npm install clsx tailwind-merge lucide-react zod

# Dev tools (most come from create-next-app; add Prettier)
npm install -D prettier prettier-plugin-tailwindcss
```

**Version verification reminder for the planner:** STACK.md verified versions on 2026-05-07. Before committing `package.json`, the executor should re-run `npm view <pkg> version` for each pinned package to confirm currency. Versions older than ~30 days should be considered stale — the planner should include a verification step in the bootstrap wave. [VERIFIED: STACK.md]

---

## Architecture Patterns

### System Architecture Diagram (Phase 1 build-time + first-paint flow)

```
                       ┌──────────────────────────────┐
                       │     Source (Git repo)        │
                       │  app/ components/ data/      │
                       │  content/ lib/ public/       │
                       └──────────────┬───────────────┘
                                      │
                                  push to GitHub
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │     Vercel Build (CI)        │
                       │  - npm ci                    │
                       │  - next build (Turbopack)    │
                       │  - Tailwind v4 emits @theme  │
                       │    tokens as CSS custom      │
                       │    properties                │
                       │  - next/font self-hosts      │
                       │    Fraunces + Geist Sans +   │
                       │    Geist Mono                │
                       │  - app/icon.svg → favicon    │
                       │    link tags injected        │
                       └──────────────┬───────────────┘
                                      │
                       Static HTML + CSS + fonts to CDN
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │  Preview URL (*.vercel.app)  │
                       │  or production braehods.com  │
                       │  (Phase 6)                   │
                       └──────────────┬───────────────┘
                                      │
                                browser request
                                      │
                                      ▼
            ┌──────────────────────────────────────────────────┐
            │              Browser (first paint)                │
            │                                                   │
            │  HTML arrives → CSS parsed (gradient + grain      │
            │  paint immediately, no JS needed)                 │
            │     │                                             │
            │     ├─→ next/font fonts load (display: swap)      │
            │     │   adjustFontFallback prevents CLS           │
            │     │                                             │
            │     ├─→ <body> renders linear-gradient            │
            │     │   <body::after> renders feTurbulence SVG    │
            │     │   data-URI overlay                          │
            │     │                                             │
            │     ├─→ <Nav> renders MonogramMark + name + links │
            │     ├─→ <main> renders Fraunces "Braeden" hero    │
            │     └─→ <Footer> renders MonogramMark + copyright │
            │                                                   │
            │  Hydration: only @vercel/analytics +              │
            │  @vercel/speed-insights ship JS                   │
            │  (Phase 1 has zero client components)             │
            │                                                   │
            │  Browser respects:                                │
            │     - prefers-reduced-motion (CSS @media override)│
            │     - :focus-visible (CSS pseudo-class)           │
            └──────────────────────────────────────────────────┘
```

### Recommended Project Structure (Phase 1 — derived from ARCHITECTURE.md, scoped to what Phase 1 ships)

```
braeden-site/
├── app/
│   ├── layout.tsx                          # <html>, <body>, font CSS variables, <Nav/>, {children}, <Footer/>, <Analytics/>, <SpeedInsights/>
│   ├── page.tsx                            # / — placeholder hero "Braeden" word in Fraunces 96px
│   ├── globals.css                         # @import "tailwindcss"; @theme {...}; body gradient; body::after grain; :focus-visible; @media reduced-motion override; @keyframes fade-in-up
│   ├── icon.svg                            # static SVG, B monogram with shape-rendering="crispEdges"
│   ├── fonts.ts                            # next/font definitions for Fraunces + GeistSans + GeistMono, exposed as CSS variables
│   └── _tokens/
│       └── page.tsx                        # /_tokens — hidden showcase route (Phase 2 deletes)
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                         # <header> with MonogramMark + name + 3 placeholder links
│   │   └── Footer.tsx                      # <footer> with MonogramMark + © + braehods.com text
│   └── ui/
│       └── MonogramMark.tsx                # SVG path component, size prop, currentColor fill
├── content/                                # empty in Phase 1 (Phase 4 adds projects/)
├── data/
│   ├── site.ts                             # name, tagline, domain, social handles (placeholders ok)
│   ├── currently.ts                        # { statement, updatedAt, link? } — placeholder data
│   ├── channels.ts                         # YT + IG handles, URLs (placeholders)
│   └── projects.ts                         # typed array (placeholder; Phase 4 fills)
├── lib/
│   ├── utils.ts                            # cn() helper using clsx + tailwind-merge
│   └── motion.ts                           # respectsReducedMotion flag, fadeInUp, stagger() — unused in Phase 1
├── public/                                 # empty (Phase 2 adds images/)
├── mdx-components.tsx                      # @next/mdx App Router contract (empty mapping ok)
├── next.config.ts                          # MDX wiring, images config (no remotePatterns yet)
├── tsconfig.json                           # strict, paths: { "@/*": ["./*"] }, noUncheckedIndexedAccess
├── eslint.config.mjs                       # flat config from create-next-app
├── prettier.config.cjs                     # prettier-plugin-tailwindcss
├── postcss.config.mjs                      # @tailwindcss/postcss
├── package.json
├── .gitignore                              # next, .env*, .vercel, .DS_Store
├── .env.local                              # NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw (also set in Vercel)
├── README.md                               # one-paragraph description + dev/build/lint commands
└── .planning/                              # already exists; preserved by D-10 merge step
```

### Pattern 1: `@theme` Tokens in `globals.css` (Tailwind v4, single source)

**What:** Define all 6 color tokens + 3 font CSS variables inside one `@theme` block in `app/globals.css`. Tailwind v4 auto-emits them as CSS custom properties, and Tailwind utilities (e.g., `bg-bg-end`, `text-text`, `text-accent`) are auto-generated from the same tokens.

**When to use:** Phase 1 establishing wave (W1).

**Example:**
```css
/* app/globals.css */
/* Source: D-07/D-08; tailwindcss.com/docs/theme */
@import "tailwindcss";

@theme {
  /* Colors — flat (no scales), one role per token */
  --color-bg-start: #1a1a1f;
  --color-bg-end: #0a0a0a;
  --color-text: #e8e8e8;
  --color-muted: #a8a8a8;
  --color-accent: #7c87ff;
  --color-border: #2a2a2f;

  /* Font CSS variables (consumed via Tailwind font-* utilities) */
  --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* Body gradient + grain (D-09) */
body {
  background: linear-gradient(180deg, var(--color-bg-start), var(--color-bg-end));
  background-attachment: fixed;
  color: var(--color-text);
  font-family: var(--font-sans);
  font-feature-settings: "kern", "liga";
  text-rendering: optimizeLegibility;
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
  will-change: auto; /* Pitfall 2: do NOT promote to layer */
}

/* Focus ring (CD-02 / DSGN-06 / A11Y-02) */
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: inherit;
}

/* Reduced motion (CD-01 / DSGN-08 / A11Y-06) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Phase 2 hero will use this — defined in Phase 1 per CD-03 */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
  animation: fade-in-up 400ms cubic-bezier(0.2, 0, 0, 1) both;
  animation-delay: var(--stagger, 0ms);
}
```

**Source notes:** [VERIFIED: tailwindcss.com/blog/tailwindcss-v4 — `@theme` directive auto-emits CSS custom properties + utility classes]; [VERIFIED: CONTEXT.md D-07/D-08/D-09]; [CITED: CSS-Tricks "Grainy Gradients" for the feTurbulence pattern]; [VERIFIED: MDN prefers-reduced-motion].

---

### Pattern 2: RSC by Default, Zero Client Components in Phase 1

**What:** Every component in Phase 1 is a Server Component. No `"use client"` directive appears anywhere.

**When to use:** Always in Phase 1. The first `"use client"` lands in Phase 5 (`ContactModal`).

**Example (Nav as RSC):**
```tsx
// components/layout/Nav.tsx — SERVER component (no 'use client')
import Link from 'next/link';
import { MonogramMark } from '@/components/ui/MonogramMark';

export function Nav() {
  return (
    <header className="border-b border-[var(--color-border)] px-6 py-6 lg:px-12">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <MonogramMark size={24} aria-hidden />
          <span className="font-sans text-base">Braeden Hodson</span>
        </Link>
        <nav className="flex gap-4">
          {/* Phase 1 stubs — all route to / */}
          <Link href="/" className="font-sans text-base">About</Link>
          <Link href="/" className="font-sans text-base">Work</Link>
          <Link href="/" className="font-sans text-base">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
```

**Source notes:** [VERIFIED: ARCHITECTURE.md Pattern 1 (Server Components by Default)]; [VERIFIED: nextjs.org/docs/app/getting-started/server-and-client-components].

---

### Pattern 3: `next/font` for Fraunces + Geist Sans + Geist Mono (zero CLS, swap)

**What:** Load all three fonts in a dedicated `app/fonts.ts` module, apply CSS variables on `<html>` in `app/layout.tsx`. Tailwind v4 `@theme` references the variables.

**When to use:** Phase 1 establishing wave (W2).

**Example:**
```ts
// app/fonts.ts
// Source: nextjs.org/docs/app/getting-started/fonts
import { Fraunces } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'], // SOFT axis for the editorial feel; opsz for size-aware optical adjustments
  weight: ['600', '700'],  // SemiBold for Display M; Black for hero + monogram trace
  // adjustFontFallback defaults to true for Google fonts in Next 16+
});

export { GeistSans, GeistMono };
```

```tsx
// app/layout.tsx (Phase 1 root)
// Source: nextjs.org/docs/app/getting-started/fonts
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { fraunces, GeistSans, GeistMono } from './fonts';
import './globals.css';

export const metadata = {
  title: { default: 'Braeden Hodson', template: '%s · Braeden Hodson' },
  description: 'Personal site of Braeden Hodson.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Source notes:** [CITED: nextjs.org/docs/app/getting-started/fonts — `axes` parameter for variable fonts; `display: 'swap'`; `adjustFontFallback`]; [VERIFIED: STACK.md app/fonts.ts pattern]; [CITED: vercel.com/font — Geist self-hosted, SIL OFL].

**Important note on `axes`:** Per the Next.js font docs, only the weight axis is included by default. To use `SOFT` and `opsz`, they must be explicitly named in the `axes` array. The Fraunces variable file ships with `wght` (weight), `opsz` (optical size), and `SOFT` (softness) axes. [VERIFIED: fonts.google.com/specimen/Fraunces].

---

### Pattern 4: MonogramMark Component (single source, currentColor)

**What:** A single React component holds the SVG path; every consumer (nav, footer, favicon, future hero/404/OG) reaches for it. The `app/icon.svg` static file mirrors the same path.

**When to use:** Phase 1 establishing wave (W2). Stable API matters more than internal path data — Phase 6 will swap path data without changing the API.

**Example:**
```tsx
// components/ui/MonogramMark.tsx
// Source: CONTEXT.md D-04
interface MonogramMarkProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

export function MonogramMark({
  size = 24,
  className,
  'aria-hidden': ariaHidden = true,
}: MonogramMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-hidden={ariaHidden}
      role={ariaHidden ? 'presentation' : 'img'}
    >
      {/* Path data: traced from Fraunces Black, SOFT axis full, character "B".
          Replace with the actual exported path during W2. */}
      <path d="M ... Z" />
    </svg>
  );
}
```

```svg
<!-- app/icon.svg
     Source: CONTEXT.md D-04, D-05; nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
     Same path data as MonogramMark, but with shape-rendering="crispEdges"
     and a slightly thicker stem variant for legibility at 16/32px. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <rect width="64" height="64" fill="#0a0a0a"/>
  <path d="M ... Z" fill="#e8e8e8"/>
</svg>
```

**Source notes:** [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons — `app/icon.svg` adds `sizes="any"`]; [VERIFIED: CONTEXT.md D-01..D-05].

**Open decision the planner must surface to the executor:** the favicon needs to pick *one* of `charcoal-on-text` (dark B on light bg) or `text-on-charcoal` (light B on dark bg). UI-SPEC says "implementer picks the more legible of the two and documents in `app/icon.svg` comment." [ASSUMED] **text-on-charcoal** is likely more legible at 16px on most browser tab themes (most browsers render tab backgrounds light → a dark mark on a charcoal field reads as a dark monogram silhouette). The planner should document this as an executor decision-with-default.

---

### Pattern 5: `@next/mdx` Wiring (Phase 1 sets it up; Phase 4 uses it)

**What:** Configure `@next/mdx` in `next.config.ts` and ship an empty `mdx-components.tsx`. Phase 4 adds `content/projects/*.mdx`; Phase 1 just leaves the wiring ready.

**When to use:** Phase 1 establishing wave (W1).

**Example:**
```ts
// next.config.ts
// Source: nextjs.org/docs/app/guides/mdx
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],   // Phase 4 adds remark-gfm
    rehypePlugins: [],   // Phase 4 adds rehype-pretty-code
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // No images.remotePatterns yet — Phase 2 adds if needed
};

export default withMDX(nextConfig);
```

```tsx
// mdx-components.tsx
// Source: nextjs.org/docs/app/guides/mdx
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
```

**Source notes:** [CITED: nextjs.org/docs/app/guides/mdx]; [VERIFIED: STACK.md `@next/mdx@16.2.6`].

---

### Pattern 6: Vercel Preview Pipeline + Domain Pre-staging

**What:** Connect the GitHub repo to Vercel; enable preview deploys on every branch. Add `braehods.com` + `www.braehods.com` to the project (DNS still points at GitHub Pages — Vercel pre-stages SSL).

**When to use:** Phase 1 deploy wave (W4).

**Steps (planner ordering):**
1. Create Vercel project named `braeden-site`. Framework preset: Next.js (auto-detected). Production branch: `main`.
2. Connect GitHub repo. Confirm preview-on-PR is on (default).
3. Set environment variables (D-13):
   - `NEXT_PUBLIC_FORMSPREE_ID = xqeypnkw` (Production, Preview, Development)
4. Add custom domains in Project Settings → Domains:
   - `braehods.com`
   - `www.braehods.com`
   - Vercel will show "Invalid Configuration" until DNS points to it. **That's expected** — SSL cert begins staging anyway. Phase 6 flips DNS.
5. Push first commit to a non-main branch. Verify `*.vercel.app` URL renders within ~2 minutes (FOUND-05 success criterion).
6. Confirm `<Analytics />` and `<SpeedInsights />` register an event in Vercel dashboard.

**Build budget:** Phase 1's success criterion is "preview URL within ~2 minutes." Per Vercel docs, typical Next.js apps deploy in under 1 minute on standard runners; Phase 1's bundle is tiny (no images, no MDX content, ~3 fonts). [CITED: vercel.com/docs/frameworks/full-stack/nextjs].

**Source notes:** [CITED: vercel.com/docs/git/vercel-for-github]; [VERIFIED: CONTEXT.md D-12, D-13, D-14]; [VERIFIED: STACK.md deploy section].

---

### Pattern 7: Typed Data Scaffolds (FOUND-08)

**What:** `data/*.ts` files export typed const arrays / objects. Zod schemas only where build-time validation is worthwhile (`projects.ts`).

**When to use:** Phase 1 W1; Phase 2 reads `site.ts` and `currently.ts`; Phase 4 reads `projects.ts`.

**Example:**
```ts
// data/currently.ts
// Source: SUMMARY.md resolved-divergences table; CONTEXT.md <specifics>
export interface CurrentlyStatement {
  statement: string;
  updatedAt: string; // ISO date — surfaces "updated X weeks ago" in Phase 2
  link?: string;
}

export const currently: CurrentlyStatement = {
  statement: 'Currently shipping CapitolLens',
  updatedAt: '2026-05-08',
};
```

```ts
// data/projects.ts
// Source: PITFALLS.md Pitfall 14, Pitfall 15; FEATURES.md
import { z } from 'zod';

export const ProjectStatus = z.enum(['shipped', 'paper-trading', 'in-dev', 'archived']);
export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().max(140),
  tags: z.array(z.enum(['trading', 'content', 'tools', 'archived'])),
  status: ProjectStatus,
  href: z.string().url(),
});
export type Project = z.infer<typeof Project>;

export const projects: Project[] = [
  // Phase 4 fills with real entries
];
```

**Source notes:** [VERIFIED: REQUIREMENTS.md FOUND-08]; [VERIFIED: ARCHITECTURE.md Pattern 6].

---

### Pattern 8: `lib/motion.ts` Isolation Seam (CD-03)

**What:** Phase 1 ships `lib/motion.ts` with the contract the Phase 2 hero will consume. No motion library install. Verbatim per UI-SPEC:

```ts
// lib/motion.ts
// Source: CONTEXT.md CD-03; ARCHITECTURE.md isolation seam
export const respectsReducedMotion = true;

export const fadeInUp = 'fade-in-up'; // applies @keyframes fade-in-up from globals.css
export const stagger = (i: number) => ({
  '--stagger': `${i * 80}ms`,
} as React.CSSProperties);
```

**Source notes:** [VERIFIED: CONTEXT.md CD-03]; [VERIFIED: UI-SPEC § Motion + Focus Contract].

---

### Anti-Patterns to Avoid (Phase 1 specific)

- **`'use client'` anywhere in Phase 1.** Phase 1 has zero interactivity. Adding `'use client'` to layout/page/components ships the React reconciler unnecessarily. (PITFALLS Pitfall 26)
- **Hex values in component files.** Use Tailwind classes (`bg-bg-end`, `text-text`) or CSS custom properties (`var(--color-accent)`). One source. (PITFALLS Pitfall 15)
- **`outline: none` without `:focus-visible` replacement.** Already prevented by CD-02; the executor must not add it back at component level. (PITFALLS Pitfall 8)
- **PNG grain texture.** Inline SVG data-URI is 10-50x smaller and resolution-independent. (PITFALLS Pitfall 2)
- **Animating the grain layer.** Static only. Animation forces GPU repaints. (PITFALLS Pitfall 2)
- **Italic Fraunces below 24px.** Hard rule from PITFALLS Pitfall 3. Phase 1 only uses Fraunces at 96px display so this is automatic, but note it for Phase 2/3.
- **Per-page nav/footer duplication.** Live in `app/layout.tsx`. (PITFALLS Pitfall 7 anti-pattern from ARCHITECTURE.md)
- **UI components under `app/`.** `app/` is for routing only; components live in `components/`. (ARCHITECTURE.md anti-pattern 1)
- **Tailwind config sprawl.** Tailwind v4 is CSS-first; do not maintain a 200-line `tailwind.config.ts`. (PITFALLS Pitfall 15)
- **Loading 8 font weights.** Phase 1 loads 2 Fraunces weights (600, 700) plus Geist Sans/Mono defaults. Each extra weight is a font network request. (PITFALLS performance traps)
- **Adding `motion@12.x` because "we'll need it later."** CD-03 explicitly defers this. The seam is in `lib/motion.ts`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting + CLS prevention | Custom `@font-face` + size-adjust matching | `next/font/google` + `next/font/local` (`geist` package) | Auto subsetting, automatic `adjustFontFallback`, build-time inlining, zero external requests |
| CSS-variable design token system | Hand-rolled `:root` block + Tailwind `extend.colors` parallel definitions | Tailwind v4 `@theme` only (D-07) | Tailwind v4 auto-emits both utility classes and CSS custom properties from one source |
| Favicon multi-size strategy | Manual `<link rel="icon" sizes="...">` tags + multiple PNGs | `app/icon.svg` (Next 16 file convention) | Next 16 auto-injects link tags with `sizes="any"` for SVG; one file, multiple sizes implicit |
| Reduced-motion detection in JS | `useReducedMotion` hook + per-component checks | CSS `@media (prefers-reduced-motion: reduce)` global override (CD-01) | Zero JS, zero runtime cost, can't be forgotten in a component |
| Focus ring management | Custom `:focus` styles per component | Single global `:focus-visible` rule (CD-02) | Browser handles `:focus-visible` heuristic correctly; one rule = consistent everywhere |
| Vercel preview deploy infra | GitHub Actions + custom Vercel API calls | Connect repo to Vercel project (D-12) | Default behavior; preview-on-PR is automatic |
| Real-user telemetry | Custom Web Vitals reporter | `@vercel/analytics` + `@vercel/speed-insights` (D-14) | One-line layout addition; zero config; cookie-free |
| SVG noise texture | Photoshop-exported PNG grain | Inline SVG `feTurbulence` data-URI (D-09) | ~400 bytes vs ~30KB; resolution-independent |
| className composition | Hand-rolled string concatenation | `cn()` helper using `clsx` + `tailwind-merge` | Resolves Tailwind class conflicts when components accept `className` overrides |
| Type validation for data files | Hand-rolled type guards | `zod` schemas with `z.infer<typeof X>` | Build-time validation + auto-derived TS types |
| Animation library install | `motion@12.x` for staggered fades | CSS `@keyframes` + `--stagger` inline style (CD-03) | Zero JS; the constraint set is exactly what CSS does well |

**Key insight:** Phase 1 is a "wire the contracts" phase. Every piece of state-of-the-art tooling (next/font, Tailwind v4 `@theme`, Next 16 file-convention favicons, CSS `prefers-reduced-motion`, `:focus-visible`) replaces 50-300 lines of hand-rolled code with a config line or one CSS rule. The planner should resist the temptation to "add structure" beyond what's listed — Phase 1 is small by design and the small-ness is what makes it shippable in one wave-train.

---

## Common Pitfalls (Phase 1 owns)

### Pitfall 1: Charcoal-on-charcoal text fails AA at the dark gradient end

**What goes wrong:** Body text at `#e2e2e2` looks fine on the `#1a1a1f` top of the gradient but barely passes AA on the `#0a0a0a` bottom. Muted text at the originally-considered `#707070` fails.
**Why it happens:** Designers test contrast against the average of the gradient, not both endpoints.
**How to avoid:** D-06 already locks `#a8a8a8` muted (clears 7:1 against `#0a0a0a`). Verification gate: WebAIM contrast checker at top, middle, bottom of gradient — all four token+bg pairs must clear AA.
**Warning signs:** axe DevTools contrast warnings; Lighthouse Accessibility < 95.
**Phase 1 owns it.**

### Pitfall 2: Grain texture tanks performance

**What goes wrong:** `mix-blend-mode: overlay` forces full-viewport recomposite per scroll frame on Chrome/Safari mobile, dropping Lighthouse Performance below 95.
**Why it happens:** Browsers composite blend modes differently and force fullscreen repaints.
**How to avoid:** D-09 ships `mix-blend-mode: overlay` with the explicit fallback per UI-SPEC § Charcoal Gradient: if `@vercel/speed-insights` shows mobile Performance < 95 with mix-blend-mode flagged as the culprit, remove the blend mode and rely on flat opacity 0.04. Plan must include this as a tuning checkpoint in W4.
**Warning signs:** Total Blocking Time spike on scroll; mobile Lighthouse Performance regression with no other obvious cause.
**Phase 1 owns it.**

### Pitfall 3: Display serif breaks small (Fraunces below 40px)

**What goes wrong:** Fraunces at 14-18px on Windows ClearType has hairline strokes disappear sub-pixel.
**Why it happens:** Display serifs aren't designed for body sizes.
**How to avoid:** UI-SPEC § Typography "Hard rules" — Fraunces never below 40px. Phase 1 surfaces it only at 96px (placeholder hero). All body, nav, captions use Geist Sans.
**Warning signs:** Strokes look broken in Windows screenshots.
**Phase 1 owns it (sets the rule).**

### Pitfall 4: Custom font FOIT/FOUT

**What goes wrong:** Hero "Braeden" word is invisible for 1-3 seconds (FOIT) or pops in with layout shift (FOUT).
**Why it happens:** Wrong `display` mode; missing `adjustFontFallback`.
**How to avoid:** Pattern 3 above — `display: 'swap'` + `adjustFontFallback: true` (Next 16 default for Google fonts) + `next/font` self-hosting. Verify CLS = 0 on `/` before phase exit.
**Warning signs:** Hero name visibly snaps after page load; Lighthouse CLS > 0.
**Phase 1 owns it.**

### Pitfall 6: prefers-reduced-motion ignored

**What goes wrong:** Phase 1 has no motion to ignore, but the contract isn't shipped, so Phase 2's hero animations escape the override.
**Why it happens:** "Add a11y later" — never gets added.
**How to avoid:** CD-01 ships the global override in `globals.css` Phase 1 W1. Verification gate: DevTools "Emulate prefers-reduced-motion: reduce" → no animation runs anywhere.
**Phase 1 owns it.**

### Pitfall 8: Focus rings stripped

**What goes wrong:** A `:focus { outline: none; }` reset blocks keyboard users from seeing where focus is.
**Why it happens:** Designer says "the blue ring is ugly"; dev complies without replacement.
**How to avoid:** CD-02 ships the canonical pattern (`:focus { outline: none; }` + `:focus-visible { outline: 2px solid var(--color-accent); ... }`). Verify by Tab-walking the deployed preview — focus must always be visible.
**Phase 1 owns it.**

### Pitfall 17 (preview): Vercel SSL race at DNS swap (Phase 6, but Phase 1 sets up)

**What goes wrong:** At Phase 6 cutover, Vercel hasn't issued the SSL cert because the domain wasn't added to the project before the CNAME flip.
**Why it happens:** Doing both at once = race.
**How to avoid:** D-12 — add `braehods.com` and `www.braehods.com` to the Vercel project in Phase 1 (DNS still points at GitHub Pages, Vercel shows "Invalid Configuration" — that's expected). Cert pre-stages. Phase 6 flips DNS and the cert is ready.
**Phase 1 owns the staging step.**

### Pitfall 27: Hidden CLS from late-loading content

**What goes wrong:** Fonts swap with different metrics → page reflows → CLS > 0.
**How to avoid:** `next/font` `adjustFontFallback: true` (default for Google fonts in Next 16) + self-hosting Geist + verify CLS = 0 in Lighthouse on `/` before phase exit.
**Phase 1 owns it (font phase).**

---

## Code Examples

### `app/globals.css` (full Phase 1 surface)

See Pattern 1 above — the complete file.

### `app/layout.tsx` (full Phase 1 surface)

See Pattern 3 above.

### `lib/utils.ts` — `cn()` helper

```ts
// lib/utils.ts
// Source: STACK.md (clsx + tailwind-merge industry-standard pairing)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### `app/_tokens/page.tsx` — Hidden token showcase (D-11)

```tsx
// app/_tokens/page.tsx
// Source: CONTEXT.md D-11; UI-SPEC § Layout & Component Inventory
import { MonogramMark } from '@/components/ui/MonogramMark';

const tokens = [
  { name: '--color-bg-start', value: '#1a1a1f' },
  { name: '--color-bg-end', value: '#0a0a0a' },
  { name: '--color-text', value: '#e8e8e8' },
  { name: '--color-muted', value: '#a8a8a8' },
  { name: '--color-accent', value: '#7c87ff' },
  { name: '--color-border', value: '#2a2a2f' },
] as const;

export default function TokensPage() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-mono text-sm">Colors</h2>
        <div className="mt-6 space-y-2">
          {tokens.map((t) => (
            <div key={t.name} className="flex items-center gap-4">
              <span className="block h-8 w-8 rounded border border-[var(--color-border)]" style={{ background: t.value }} />
              <span className="font-mono text-sm text-muted">{t.name}</span>
              <span className="font-mono text-sm">{t.value}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-mono text-sm">Typography</h2>
        <p className="mt-6 font-serif text-[6rem] leading-[1.05] font-bold">Display XL · 96</p>
        <p className="font-serif text-[4rem] leading-[1.10] font-bold">Display L · 64</p>
        <p className="font-serif text-[2.5rem] leading-[1.15] font-semibold">Display M · 40</p>
        <p className="mt-6 font-sans text-base">Body 16 / Geist Sans · The quick brown fox.</p>
        <p className="font-mono text-sm text-muted">Mono 14 / Geist Mono · 0123456789</p>
      </section>
      <section>
        <h2 className="font-mono text-sm">Monogram</h2>
        <div className="mt-6 flex items-end gap-6">
          {[16, 24, 48, 96, 120].map((s) => (
            <MonogramMark key={s} size={s} aria-hidden />
          ))}
        </div>
        <div className="mt-3 text-[var(--color-accent)]">
          <MonogramMark size={48} aria-hidden />
        </div>
      </section>
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router (RSC default) | Next 13.4 (May 2023) stable; locked here | Phase 1 uses App Router — no `pages/` folder appears |
| `next lint` | Direct ESLint invocation (`npm run lint`) | Next 16 (Oct 2025) removed `next lint` | `package.json` script must run `eslint .` directly |
| `middleware.ts` | `proxy.ts` | Next 16 deprecation | Not used in Phase 1 (no middleware), but the planner should avoid creating `middleware.ts` |
| `images.domains` | `images.remotePatterns` | Next 16 deprecation | N/A in Phase 1 (no remote images) |
| `tailwind.config.ts` color extend | `@theme` block in `globals.css` | Tailwind v4 (Jan 2025) | D-07 locks the CSS-first approach |
| Hand-rolled `<link rel="icon">` tags | `app/icon.svg` file convention | Next 13 metadata files; refined through Next 16 | One file, automatic injection |
| `useReducedMotion` per-component hook | Global `@media (prefers-reduced-motion: reduce)` opt-out override | Modern best practice (per CSS-Zone 2026, web.dev guidance) | CD-01 ships this; UI-SPEC notes the inversion vs DSGN-08's "no-preference" wording |
| webpack | Turbopack (default in Next 16) | Next 16 stable | 2-5x faster builds; no opt-in needed |

**Deprecated/outdated patterns Phase 1 must avoid:**
- `next/legacy/image` (Next 16 deprecates)
- `framer-motion` package name (rebranded to `motion`)
- Contentlayer (abandoned 2023)
- Pages Router file conventions (`pages/api/`, `pages/_app.tsx`)
- Google Fonts via `<link>` tag (use `next/font/google`)

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Favicon should be light-monogram-on-charcoal-background (not the inverse) for best 16px legibility | Pattern 4 (MonogramMark) | Low — UI-SPEC explicitly delegates to executor; the wrong choice is reversible by editing one SVG file |
| A2 | Verifying preview-build time is "~2 minutes" against an empty Phase 1 bundle is achievable on Vercel default runners | Pattern 6 (Vercel Pipeline) | Low — Vercel docs say typical Next.js apps deploy in under 1 minute; Phase 1 is below typical complexity. If it fails, Vercel's Turbo build machines ($0.126/min) are the documented escalation |
| A3 | `axes: ['SOFT', 'opsz']` is the correct argument shape for Fraunces variable axes in Next 16 `next/font/google` | Pattern 3 (next/font) | Medium — there are documented Next.js issues around `axes` (vercel/next.js#64960 — "clarification needed"); the executor should verify on first run that the SOFT axis is actually applied (inspect computed CSS for `font-variation-settings`) before exporting the monogram path. If `axes` doesn't apply correctly, fallback is to load Fraunces with `weight: ['600', '700']` only and trace the monogram from a static Fraunces Black instance externally |
| A4 | `mix-blend-mode: overlay` at opacity 0.04 will not regress mobile Lighthouse below 95 in the average case | Pattern 1 (gradient + grain) | Medium — PITFALLS Pitfall 2 explicitly warns against blend modes; UI-SPEC ships D-09 with a documented fallback. Plan must include the W4 tuning checkpoint |
| A5 | The grain SVG `feTurbulence` parameters (`baseFrequency: 0.85`, `numOctaves: 2`, `stitchTiles: stitch`, `background-size: 200px`) are correct as-shipped | Pattern 1 | Low — STACK.md and CSS-Tricks both verify these as the standard grain parameters. Tunable in W4 if visual review wants finer/coarser grain |
| A6 | The bootstrap merge in D-10 will not stomp the existing `.git/`, `.planning/`, `CLAUDE.md` if executed correctly with explicit file-by-file diff-and-keep | Pattern 6 | Medium — D-10 explicitly says "Plan should call out a manual diff-and-keep step." The plan must explicitly enumerate the files to copy from the temp dir (config files only, not `.git/`, `node_modules/`, generated `.next/`) |

---

## Open Questions

1. **Favicon foreground/background direction.**
   - What we know: UI-SPEC delegates to executor based on real-device legibility.
   - What's unclear: Which direction looks crisper at 16px in Chrome/Safari/Firefox tab strips?
   - Recommendation: Default to text-on-charcoal (light B on dark bg) and document in `app/icon.svg` leading comment. If real-device testing in Phase 2 shows poor legibility, swap (single-file change).

2. **Fraunces `axes` API correctness for Next 16.**
   - What we know: Next.js docs document `axes: ['SOFT', 'opsz']` as the API; multiple GitHub issues note past confusion.
   - What's unclear: Whether `axes` actually surfaces the SOFT/opsz instances correctly under Turbopack in Next 16.2.6.
   - Recommendation: Plan must include a W2 verification step — after wiring fonts, inspect `<html>` computed style in DevTools to confirm `font-variation-settings` references SOFT and opsz. If broken, fall back to weight-only Fraunces and trace the monogram externally.

3. **`mix-blend-mode: overlay` mobile performance impact.**
   - What we know: PITFALLS Pitfall 2 explicit warning; D-09 ships it anyway with a documented fallback.
   - What's unclear: Whether the 0.04 opacity is low enough to avoid the GPU recomposite cost on mid-tier Android.
   - Recommendation: W4 checkpoint — run Chrome DevTools Performance tab on mobile emulation while scrolling the deployed preview. If frames drop, kill `mix-blend-mode` and rely on flat opacity. Document the resolution in the phase exit notes.

4. **Token-showcase route exposure.**
   - What we know: D-11 says `/_tokens` is "hidden but deployed" — no nav link.
   - What's unclear: Should preview deployments emit `X-Robots-Tag: noindex` for `/_tokens` specifically (or for the whole preview, per SEO-09)?
   - Recommendation: SEO-09 lives in Phase 6, but Phase 1 should at minimum add a `<meta name="robots" content="noindex">` to the `_tokens` route's metadata. Cheap insurance.

5. **`mdx-components.tsx` location.**
   - What we know: Next 16 docs require it in the project root for App Router.
   - What's unclear: Whether to ship a stub now (Phase 1) or only when the first MDX file lands (Phase 4).
   - Recommendation: Ship stub in Phase 1 W1 — `@next/mdx` config without `mdx-components.tsx` will crash if any `.mdx` import is attempted. Empty stub is 4 lines and de-risks Phase 4.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js (≥20.9.0) | Next 16 build | Must verify | — | Vercel runs Node 20 LTS by default — fine for CI; local dev needs nvm/Volta to upgrade if older |
| npm | create-next-app, all installs | Must verify | — | Use `--use-pnpm` or `--use-yarn` if preferred, but D-10 specifies `--use-npm` |
| git | Repo bootstrap merge step | ✓ (.git/ exists in repo) | — | — |
| GitHub account | Repo connection to Vercel | ✓ (assumed; existing repo at `~/Projects/braeden-site`) | — | — |
| Vercel account | D-12 deploy | Must verify | — | Free Hobby tier is sufficient for v1 |
| Vercel CLI | Optional for `vercel --prod` cutover | Optional | — | Web dashboard works for everything in Phase 1 |
| Browser DevTools (Chrome) | Verification gate (Lighthouse, prefers-reduced-motion emulation) | ✓ (assumed dev environment) | — | Firefox + axe DevTools as alternative |
| `@vercel/analytics` ingestion | Real-user telemetry verification | ✓ (Vercel dashboard) | — | — |

**Missing dependencies with no fallback:** None identified. Phase 1 is self-contained on a typical web dev machine.

**Missing dependencies with fallback:**
- A non-Vercel deploy host (Netlify, Cloudflare Pages) is technically possible but breaks D-12, D-14, and the SSL pre-staging strategy. **Not a fallback for v1** — Vercel is locked.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **Playwright 1.55.x** (recommended) for E2E + visual + accessibility, **vitest 2.x** for unit (only if pure-logic tests emerge — Phase 1 has none) |
| Config file | `playwright.config.ts` (Wave 0 creates) |
| Quick run command | `npx playwright test --project=chromium-mobile -x` |
| Full suite command | `npx playwright test` |

**Rationale:** Phase 1's success criteria are all visual or behavioral against a deployed page (gradient renders, fonts load with zero CLS, focus ring shows on Tab, reduced-motion override stops animation, contrast clears AA). Unit tests can't verify any of these. Playwright with `@axe-core/playwright` and `playwright-lighthouse` covers all five success criteria with one tool. Phase 1 also doesn't have business logic to unit-test — `lib/motion.ts` is just constants, `lib/utils.ts` is a wrapper around two well-tested libraries.

[ASSUMED] Playwright is the right framework here. The alternative is Vitest + Testing Library + custom Lighthouse CLI scripts; that fragments the toolchain. If the user has a strong opinion against Playwright, the planner should surface this in plan-check.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| FOUND-01 | Project builds without error | smoke | `npm run build` exits 0 | ❌ Wave 0 |
| FOUND-02 | Tailwind v4 compiles `@theme` to CSS custom properties | smoke | `tests/build-output.spec.ts` greps emitted CSS for `--color-bg-end: #0a0a0a` | ❌ Wave 0 |
| FOUND-03 | `@next/mdx` loads without crash | smoke | Build step (above) — crashes if `mdx-components.tsx` missing | ❌ Wave 0 |
| FOUND-04 | Folder layout exists with required folders | smoke | `tests/folder-structure.spec.ts` asserts `app/`, `components/{ui,layout}`, `content/`, `data/`, `lib/`, `public/` | ❌ Wave 0 |
| FOUND-05 | Vercel preview URL renders within ~2 minutes | manual + observability | Push to a branch; verify Vercel deploys ≤ 2min via dashboard. Optional CI check via `vercel inspect`. | manual |
| FOUND-06 | ESLint runs clean; Prettier formats clean | unit | `npm run lint && npx prettier --check .` exits 0 | ❌ Wave 0 |
| FOUND-07 | No `'use client'` directives in Phase 1 sources | unit | `tests/no-client-components.spec.ts` greps `**/*.tsx` for `'use client'` — must return zero hits | ❌ Wave 0 |
| FOUND-08 | Typed data files compile under `tsc --noEmit` | smoke | `npm run typecheck` exits 0 | ❌ Wave 0 |
| DSGN-01 | Body has charcoal gradient | e2e | `tests/visual.spec.ts` — `getComputedStyle(document.body).backgroundImage` includes `linear-gradient(180deg, rgb(26, 26, 31), rgb(10, 10, 10))` | ❌ Wave 0 |
| DSGN-02 | Grain overlay renders (`body::after`, opacity 0.04) | e2e | `tests/visual.spec.ts` — `getComputedStyle(document.body, '::after').opacity === '0.04'` | ❌ Wave 0 |
| DSGN-03 | Color tokens emit as CSS custom properties | unit | `tests/tokens.spec.ts` — `getComputedStyle(document.documentElement).getPropertyValue('--color-text')` returns `#e8e8e8` for all 6 tokens | ❌ Wave 0 |
| DSGN-04 | Three fonts load via next/font with zero CLS | e2e + Lighthouse | `tests/lighthouse.spec.ts` runs Lighthouse on `/`; assert CLS = 0; assert Fraunces, Geist Sans, Geist Mono are in computed font-family stack | ❌ Wave 0 |
| DSGN-05 | MonogramMark renders in nav, footer, and `/_tokens` at expected sizes | e2e | `tests/monogram.spec.ts` — locate SVG by role/aria, assert width/height attrs match `size` prop on each surface | ❌ Wave 0 |
| DSGN-06 | `:focus-visible` shows electric-blue ring on Tab through nav links | e2e | `tests/focus-ring.spec.ts` — `page.keyboard.press('Tab')`, snapshot screenshot, assert `outline: rgb(124, 135, 255) solid 2px` on focused element | ❌ Wave 0 |
| DSGN-07 | Motion primitives defined (keyframe + lib/motion.ts exports) but unused in Phase 1 | unit | `tests/motion-seam.spec.ts` — import `lib/motion.ts`, assert `respectsReducedMotion === true`, `fadeInUp === 'fade-in-up'`, `stagger(2)['--stagger'] === '160ms'` | ❌ Wave 0 |
| DSGN-08 / A11Y-06 | `prefers-reduced-motion: reduce` zeroes animation durations | e2e | Playwright `page.emulateMedia({ reducedMotion: 'reduce' })`, then run a `page.evaluate()` that adds a test class with a 1s transition and verifies `transition-duration: 0.01ms` is applied | ❌ Wave 0 |
| DSGN-09 | All token+gradient pairs clear WCAG AA | e2e + axe | `tests/contrast.spec.ts` — `@axe-core/playwright` runs against `/_tokens` route, asserts zero color-contrast violations | ❌ Wave 0 |
| A11Y-02 | No `outline: none` without `:focus-visible` replacement | unit + axe | `tests/no-bare-outline-none.spec.ts` — grep `**/*.css` for `outline: none` not adjacent to `:focus-visible`; axe-core also flags missing focus indicators | ❌ Wave 0 |
| SEO-07 | Favicon SVG renders | smoke | `tests/favicon.spec.ts` — `page.goto('/icon.svg')`, asserts SVG content with `<path>` and viewBox | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run lint && npm run typecheck && npx playwright test --project=chromium-mobile -x` (~30s; runs unit + folder/build smoke + a small e2e subset)
- **Per wave merge:** `npm run build && npx playwright test` (~2min; full suite + Lighthouse)
- **Phase gate:** Full suite green on the deployed Vercel preview URL — not just localhost. Add a `playwright.config.ts` `baseURL` env var that points at the Vercel preview URL when running in CI.

### Wave 0 Gaps

- [ ] `playwright.config.ts` — base config, mobile + desktop projects, `baseURL` env var
- [ ] `tests/build-output.spec.ts` — covers FOUND-02
- [ ] `tests/folder-structure.spec.ts` — covers FOUND-04
- [ ] `tests/no-client-components.spec.ts` — covers FOUND-07
- [ ] `tests/visual.spec.ts` — covers DSGN-01, DSGN-02
- [ ] `tests/tokens.spec.ts` — covers DSGN-03
- [ ] `tests/lighthouse.spec.ts` — covers DSGN-04 (CLS = 0)
- [ ] `tests/monogram.spec.ts` — covers DSGN-05
- [ ] `tests/focus-ring.spec.ts` — covers DSGN-06, A11Y-02
- [ ] `tests/motion-seam.spec.ts` — covers DSGN-07
- [ ] `tests/reduced-motion.spec.ts` — covers DSGN-08, A11Y-06
- [ ] `tests/contrast.spec.ts` — covers DSGN-09
- [ ] `tests/favicon.spec.ts` — covers SEO-07
- [ ] Framework install: `npm install -D @playwright/test @axe-core/playwright playwright-lighthouse && npx playwright install chromium`

**FOUND-05 cannot be fully automated** (it requires observing the Vercel deploy timing). Treat it as a manual phase-exit verification with the Vercel deploy log as evidence. The plan must include a "FOUND-05 sign-off" checklist item in W4.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in Phase 1 (no auth anywhere in v1 — site is read-only) |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | All routes are public |
| V5 Input Validation | partial — only data file Zod schemas | `zod@4.4.3` for `data/projects.ts` runtime validation; build fails on invalid frontmatter |
| V6 Cryptography | no (HTTPS only) | Vercel auto-issues TLS cert (Let's Encrypt managed); no app-layer crypto |
| V7 Error Handling | minimal | Next 16 default error boundary; Phase 6 adds custom 404. Phase 1 ships only the default Next error page |
| V8 Data Protection | minimal | No user data collected in Phase 1; `@vercel/analytics` is cookieless and IP-anonymized |
| V9 Communications | yes (HTTPS) | Vercel enforces HTTPS by default; redirect plain HTTP → HTTPS at edge |
| V10 Malicious Code | partial | npm dependencies: 11 direct production deps, all from npm registry top-tier (Vercel, Tailwind, Geist, Lucide). Pin all versions in `package.json` (no `^` prefix on critical deps); commit `package-lock.json` |
| V14 Configuration | yes | `NEXT_PUBLIC_FORMSPREE_ID` is the ONLY env var; it's intentionally public-safe (Formspree IDs are public). `.gitignore` must exclude `.env*` |

### Known Threat Patterns for Next.js + Vercel + Public Static Site

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Vercel preview URLs leak into Google search | Information Disclosure | Phase 6 adds `X-Robots-Tag: noindex` on previews (SEO-09); Phase 1 should add `<meta name="robots" content="noindex">` to `/_tokens` specifically as a precaution |
| Supply-chain attack via compromised npm package | Tampering | Pin versions; commit lockfile; review `npm audit` output before each merge |
| Secrets committed to git | Information Disclosure | `.env*` in `.gitignore`; only `NEXT_PUBLIC_*` env vars in `.env.local` (Formspree ID is public-safe) |
| `<script>`-injection via MDX (Phase 4 scope, but `@next/mdx` config in Phase 1) | Injection | `@next/mdx` renders MDX server-side via React — no client-side `eval`. Author content only ships from `content/` (Phase 4 onward) |
| External link click-jacking | Tampering | All `<a target="_blank">` links must use `rel="noopener noreferrer"` (Phase 2 onward; Phase 1's nav stubs route to `/`) |
| Dependency confusion / typo-squatting | Tampering | Use scoped packages where possible (`@next/mdx`, `@vercel/analytics`); pin versions |
| Unvalidated Formspree submissions | Spoofing / DoS | Phase 5 owns this (honeypot + min-time + reCAPTCHA). Phase 1 only sets `NEXT_PUBLIC_FORMSPREE_ID` env var |

**Phase 1 security posture:** Low-risk by design. No user input, no secrets beyond a public Formspree ID, no auth, no DB. The main concrete actions: (1) commit `package-lock.json`, (2) `.gitignore` `.env*`, (3) no `outline: none` (a11y-as-security per WCAG), (4) `noindex` on `/_tokens`. ASVS Level 1 is trivially clearable for a static personal site.

---

## Sources

### Primary (HIGH confidence)

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16) — Next 16 features, breaking changes, Turbopack default, `proxy.ts` rename, `next lint` removal
- [Next.js Upgrade Guide v16](https://nextjs.org/docs/app/guides/upgrading/version-16) — deprecations, removed APIs
- [Next.js — Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) — `next/font/google`, variable font `axes`, `display`, `adjustFontFallback`
- [Next.js — Components: Font](https://nextjs.org/docs/pages/api-reference/components/font) — `axes` parameter for variable fonts
- [Next.js — Metadata Files: favicon, icon, apple-icon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) — `app/icon.svg` convention, automatic `sizes="any"` for SVG
- [Next.js — MDX Guide](https://nextjs.org/docs/app/guides/mdx) — `@next/mdx` configuration, `mdx-components.tsx`
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) — v4 stable, Lightning CSS, `@theme` directive
- [Tailwind CSS — Theme Variables](https://tailwindcss.com/docs/theme) — `@theme` block best practices
- [Tailwind CSS — Functions and Directives](https://tailwindcss.com/docs/functions-and-directives) — `@theme`, `@import`, `@apply`
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — accessibility media query
- [W3C — C39: Using prefers-reduced-motion to prevent motion](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) — WCAG technique
- [Vercel — Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) — preview deploy timing, Turbopack support
- [Vercel — Deploying GitHub Projects](https://vercel.com/docs/git/vercel-for-github) — preview-on-PR setup
- [Vercel — Geist Font](https://vercel.com/font) — SIL OFL, self-hosted
- [Google Fonts — Fraunces](https://fonts.google.com/specimen/Fraunces) — variable axes (wght, opsz, SOFT)
- [CSS-Tricks — Grainy Gradients](https://css-tricks.com/grainy-gradients/) — feTurbulence + mix-blend-mode pattern
- npm registry direct queries (verified 2026-05-07 per STACK.md) — versions for next, react, tailwindcss, geist, @next/mdx, @vercel/analytics, @vercel/speed-insights, clsx, tailwind-merge, zod, lucide-react

### Secondary (MEDIUM confidence)

- [GitHub Discussion #18471 — Theming best practices in Tailwind v4](https://github.com/tailwindlabs/tailwindcss/discussions/18471) — community-verified `@theme` patterns
- [Next.js Issue #64960 — Clarification: `axes` with variable fonts in `next/font/google`](https://github.com/vercel/next.js/issues/64960) — flags potential ambiguity around `axes`; informs A3 in Assumptions Log
- [CSS-Zone — CSS Animations Best Practices 2026](https://css-zone.com/blog/css-animations-performance) — modern reduced-motion guidance
- [Pope Tech — Design accessible animation 2025](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) — current accessibility patterns

### Tertiary (project-internal — HIGH confidence)

- `.planning/phases/01-foundation-design-tokens/01-CONTEXT.md` — 14 locked decisions
- `.planning/phases/01-foundation-design-tokens/01-UI-SPEC.md` — visual contract derived from CONTEXT
- `.planning/REQUIREMENTS.md` — 20 Phase 1 requirements
- `.planning/research/STACK.md` — verified versions + library choices (2026-05-07)
- `.planning/research/ARCHITECTURE.md` — folder layout, RSC pattern, isolation seams
- `.planning/research/PITFALLS.md` — 29 pitfalls; Phase 1 owns 1, 2, 3, 4, 6, 8, and partial 17, 27
- `.planning/research/SUMMARY.md` — phase rationale, resolved divergences
- `CLAUDE.md` — full stack table, "What NOT to Use" list, font choices

---

## Project Constraints (from CLAUDE.md)

The CLAUDE.md root file constrains Phase 1 implementation. The planner must verify every plan complies:

| Directive | Source | Phase 1 Implication |
|-----------|--------|---------------------|
| Next.js App Router only (no Pages Router) | CLAUDE.md "What NOT to Use" | All routes go in `app/`; no `pages/` folder appears |
| Turbopack (default in Next 16) | CLAUDE.md | Don't downgrade to webpack; don't add a `webpack.config` |
| TypeScript `strict: true` + `noUncheckedIndexedAccess: true` | CLAUDE.md | `tsconfig.json` enables both |
| Pin TS to 5.9 (not 6.0) | CLAUDE.md | `package.json` "typescript": "5.9.x" exact |
| `next lint` removed in Next 16 — invoke ESLint via npm script | CLAUDE.md | `package.json` "scripts.lint": "eslint ." |
| `@next/mdx` (NOT Velite, NOT next-mdx-remote, NOT Contentlayer) | CLAUDE.md | Phase 1 wires `@next/mdx` only |
| Tailwind v4 `@theme` (NOT v3 config, NOT CSS Modules, NOT vanilla-extract) | CLAUDE.md | One `@theme` block in `globals.css` |
| Native `<dialog>` for the one modal (NOT Radix) | CLAUDE.md | No `@radix-ui/*` install in Phase 1 |
| CSS-only animation for v1 (NOT motion@12.x, NOT GSAP, NOT Lenis, NOT AOS) | CLAUDE.md | `lib/motion.ts` ships seam; no animation library install |
| `next/image` (NOT `next/legacy/image`) | CLAUDE.md | Phase 2 follows; Phase 1 has no images |
| Vercel Analytics (NOT GA4, NOT Plausible) | CLAUDE.md | Install `@vercel/analytics` + `@vercel/speed-insights` |
| Geist + Fraunces (NOT Inter alone, NOT Playfair, NOT commercial fonts) | CLAUDE.md | Pattern 3 above |
| `proxy.ts` (NOT `middleware.ts`) | CLAUDE.md | N/A in Phase 1 — no proxy/middleware needed |
| `images.remotePatterns` (NOT `images.domains`) | CLAUDE.md | N/A in Phase 1 — no remote images |
| No CMS, no admin UI | CLAUDE.md | Content lives in `content/` (Phase 4) and `data/` (Phase 1 scaffolds, Phase 2+ uses) |
| No CookieBanner / consent / `next-themes` | CLAUDE.md | None of these install in Phase 1 |
| GSD workflow enforcement: do not edit outside a GSD command | CLAUDE.md | All Phase 1 work runs through `/gsd-execute-phase` |

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — versions verified by STACK.md npm queries 2026-05-07; locked by CLAUDE.md; Tailwind v4, Next 16, geist 1.7.0 cross-verified against official release notes
- Architecture: **HIGH** — patterns derive directly from Next.js + Tailwind official docs; CONTEXT.md and UI-SPEC.md eliminate ambiguity on every Phase 1 decision
- Pitfalls: **HIGH** — drawn from PITFALLS.md (verified against MDN, WCAG, Next.js docs, CSS-Tricks); Phase 1 owns six known pitfalls and the mitigation pattern is concrete for each
- Validation Architecture: **MEDIUM** — Playwright + axe-core + Lighthouse is the canonical stack for these signals, but Wave 0 has no existing test infrastructure to inherit; A1 in Assumptions Log marks this
- Security: **HIGH** — ASVS L1 is trivially clearable for a static public site with no auth or user input

**Research date:** 2026-05-08
**Valid until:** 2026-06-08 (30 days — stack is mature; Tailwind v4, Next 16, geist 1.7.0 all stable; revisit if Next 17 lands or Tailwind v5 ships in the window)
