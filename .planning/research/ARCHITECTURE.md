# Architecture Research

**Domain:** Personal portfolio / brand site (Next.js App Router, MDX, TypeScript, Vercel)
**Researched:** 2026-05-07
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                       Edge / Vercel CDN                           │
│  Static HTML  ·  Static MDX-rendered pages  ·  /og image route   │
├──────────────────────────────────────────────────────────────────┤
│                  Next.js App Router (RSC)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   /      │  │ /about   │  │ /work    │  │ /work/   │          │
│  │ (home)   │  │          │  │ (index)  │  │ [slug]   │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │             │             │                 │
│       └─────────────┴──────┬──────┴─────────────┘                 │
│                            │                                      │
│        ┌───────────────────┴───────────────────┐                  │
│        │           Shared Layout               │                  │
│        │  RootLayout · Nav · Footer · Fonts    │                  │
│        └───────────────────┬───────────────────┘                  │
│                            │                                      │
│  ┌────────────────────────┴─────────────────────────────┐         │
│  │                  Component Layer                      │         │
│  │  Hero · ProjectCard · ChannelLinkBlock · Currently   │         │
│  │  ContactModal (client) · MonogramMark · GrainOverlay │         │
│  └────────────────────────┬─────────────────────────────┘         │
│                            │                                      │
├────────────────────────────┴──────────────────────────────────────┤
│                       Content / Data Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ content/     │  │ data/        │  │ lib/         │             │
│  │ projects/*   │  │ channels.ts  │  │ projects.ts  │             │
│  │ about.mdx    │  │ currently.ts │  │ mdx.ts       │             │
│  │ (MDX)        │  │ (typed TS)   │  │ (loaders)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
├──────────────────────────────────────────────────────────────────┤
│                     External Services (read)                       │
│  Formspree (POST /xqeypnkw)  ·  Vercel Analytics  ·  Plausible?   │
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **App Router pages** | URL → page mapping, metadata, data fetching | RSC by default, no `"use client"` unless needed |
| **Root layout** | HTML shell, fonts, theme variables, nav, footer, GrainOverlay | `app/layout.tsx`, server component |
| **Page components** | Compose page-specific blocks; ~50-150 lines | Server components, async if loading content |
| **Reusable UI** | Atoms used across pages (MonogramMark, ProjectCard, Button) | `components/ui/`, mostly pure, no client unless interactive |
| **Page-specific blocks** | Composed sections (Hero, AboutBio, WorkGrid) | `components/[page]/`, can be split client-side as needed |
| **Client islands** | Interactivity (ContactModal, theme toggle if added) | `"use client"` + React state/effects |
| **Content loaders** | Read MDX/TS files at build time, return typed data | `lib/content.ts`, sync (Velite generates) or async (gray-matter) |
| **Theme tokens** | CSS custom properties + Tailwind theme | `app/globals.css` `:root` block, Tailwind v4 `@theme` |
| **Metadata** | OG images, titles, descriptions per route | `opengraph-image.tsx`, `generateMetadata`, per-route files |

## Recommended Project Structure

```
braeden-site/
├── app/                                    # Routes (URLs)
│   ├── layout.tsx                          # Root: <html>, fonts, theme, nav, footer
│   ├── page.tsx                            # Home: Hero + Currently + Channels + Featured Work
│   ├── globals.css                         # CSS vars (charcoal gradient, accent), Tailwind base
│   ├── icon.svg                            # Favicon (the B monogram, black bg)
│   ├── apple-icon.png                      # iOS touch icon
│   ├── opengraph-image.tsx                 # Default OG (name + monogram + tagline)
│   ├── twitter-image.tsx                   # Twitter card variant (or re-export OG)
│   ├── robots.ts                           # robots.txt generator
│   ├── sitemap.ts                          # sitemap.xml generator
│   │
│   ├── about/
│   │   ├── page.tsx                        # /about — short-form bio + photo
│   │   └── opengraph-image.tsx             # About-specific OG (optional)
│   │
│   ├── work/
│   │   ├── page.tsx                        # /work — equal-weight project grid
│   │   ├── opengraph-image.tsx             # Work index OG
│   │   └── [slug]/
│   │       ├── page.tsx                    # /work/capitollens — MDX render
│   │       └── opengraph-image.tsx         # Per-project dynamic OG
│   │
│   ├── api/                                # Optional — only if server actions don't fit
│   │   └── contact/route.ts                # Server proxy to Formspree (alt: client fetch)
│   │
│   └── (future)/                           # Reserved — DO NOT create yet
│       └── writing/                        # Stubbed in roadmap, built in v1.x
│
├── components/                             # Reusable React components
│   ├── ui/                                 # Atoms (no business logic)
│   │   ├── monogram-mark.tsx               # <MonogramMark size="sm|md|lg" /> SVG-as-component
│   │   ├── button.tsx                      # Primary/ghost/icon variants
│   │   ├── link.tsx                        # Wrapper for external/internal w/ proper rels
│   │   └── grain-overlay.tsx               # Fixed SVG/PNG noise layer (server-safe)
│   │
│   ├── layout/                             # Site chrome
│   │   ├── nav.tsx                         # Top nav (logo + 3-4 links + contact CTA)
│   │   ├── footer.tsx                      # Footer (monogram, copyright, channel links, contact)
│   │   └── theme-provider.tsx              # Only if/when light mode lands
│   │
│   ├── home/                               # Page-specific composites
│   │   ├── hero.tsx                        # Photo + name + TL;DR + Currently
│   │   ├── currently-block.tsx             # "Currently shipping…" component
│   │   ├── featured-work.tsx               # Optional curated 3-card preview
│   │   └── channel-link-block.tsx          # Inline YT + IG buttons
│   │
│   ├── about/
│   │   └── about-bio.tsx                   # Photo + multi-paragraph copy
│   │
│   ├── work/
│   │   ├── project-card.tsx                # Used in grid AND featured (one component, props vary)
│   │   ├── project-grid.tsx                # CSS-grid wrapper for cards
│   │   └── project-detail.tsx              # Layout for /work/[slug] (header + MDX body)
│   │
│   └── contact/
│       ├── contact-modal.tsx               # "use client" — Dialog + form + Formspree submit
│       └── contact-trigger.tsx             # Button that opens the modal (client island)
│
├── content/                                # Authored content (Velite source)
│   ├── projects/                           # One MDX per project
│   │   ├── capitollens.mdx                 # frontmatter + body
│   │   ├── shorts-factory.mdx
│   │   ├── meme-dashboard.mdx
│   │   ├── prediction-market-bot.mdx
│   │   ├── no-more-short-form.mdx
│   │   ├── mc-packet-client.mdx
│   │   └── braehods-archive.mdx
│   ├── about.mdx                           # About page body (single source of truth)
│   └── (writing/)                          # Reserved — v1.x adds content/writing/*.mdx
│
├── data/                                   # Hand-typed runtime data (not MDX)
│   ├── channels.ts                         # YouTube + IG handles, URLs, labels
│   ├── currently.ts                        # The "Currently shipping" string (1 file = 1 edit point)
│   ├── site.ts                             # name, tagline, domain, social, contact id
│   └── nav.ts                              # Nav link list (single source)
│
├── lib/                                    # Pure logic / utilities
│   ├── content.ts                          # Velite-generated data re-exports (typed)
│   ├── og.ts                               # Shared OG image helpers (fonts, layout primitives)
│   ├── seo.ts                              # generateMetadata helpers (title template, defaults)
│   ├── motion.ts                           # Reduced-motion-safe animation variants
│   └── utils.ts                            # cn() classnames helper, formatters
│
├── styles/                                 # (Optional — keep minimal, prefer globals.css)
│   └── tokens.css                          # Only if tokens grow past one file
│
├── public/                                 # Static assets served as-is
│   ├── images/
│   │   ├── portrait.jpg                    # Hero/about photo (sized variants ok)
│   │   └── projects/                       # Project screenshots referenced from MDX
│   ├── fonts/                              # Self-hosted serif/sans (if not via next/font)
│   └── og/                                 # Pre-rendered fallback OG images (rarely needed)
│
├── content-types.d.ts                      # Velite-generated types (gitignored or committed)
├── velite.config.ts                        # Content schema (Zod) — projects, about
├── tailwind.config.ts                      # Minimal in v4 (most theme in CSS @theme)
├── next.config.mjs                         # MDX, image domains, redirects
├── postcss.config.mjs                      # Tailwind v4 PostCSS plugin
├── tsconfig.json                           # strict: true, paths: { "@/*": ["./*"] }
├── package.json
├── .env.local                              # FORMSPREE_ID=xqeypnkw (and copy to Vercel)
└── .planning/                              # GSD project planning (already exists)
```

### Structure Rationale

- **`app/` is for routing only.** Pages compose components from `components/`; they don't define UI primitives. This keeps URL → file mapping discoverable and components reusable across pages. Vercel/Next docs explicitly recommend resisting the urge to put everything under `app/`.
- **`components/` mirrors page structure** with `ui/` (atoms), `layout/` (chrome), and one folder per page (`home/`, `work/`, etc.). Page-specific composites live next to their page; reusable atoms live in `ui/`. Rule of thumb: if used in 2+ pages, promote to `ui/`.
- **`content/` is for MDX (long-form, body copy).** Project descriptions, about copy, and future writing all live here. Velite reads this folder, validates with Zod, and emits typed data.
- **`data/` is for tiny typed-TS facts** that don't need MDX overhead — channel URLs, the "Currently" line, site metadata. Hand-edited TS modules with `as const` for inference. Separating `data/` from `content/` makes the "easy to update" requirement (currently line) trivial: one file, one string, one PR.
- **`lib/` is pure logic** — no React, no JSX (with a small exception for `og.ts` which uses ImageResponse JSX). Loaders, formatters, motion variants, SEO helpers.
- **No `src/` folder.** Optional in Next.js; for a project this size it adds a directory level without benefit. Path alias `@/components/...` resolves from project root.
- **Route groups deferred.** No `(marketing)` group needed at v1 — the home/about/work split is flat enough that grouping adds noise. Reserve for v1.x if `/writing` warrants its own layout. Adding a route group later is a folder rename, not a restructure.
- **`/work/[slug]` (not flat).** Even with 7 projects, dynamic routes give per-project OG images, deep-linkable detail pages, and zero refactor to add an 8th. Flat MDX-on-grid would force a rewrite when you want to link "https://braehods.com/work/capitollens" anywhere.
- **Future `/writing` slot is pre-architected.** Adding it later means: one folder under `content/writing/`, one Velite collection, one route under `app/writing/` and `app/writing/[slug]/`, one nav entry in `data/nav.ts`. Zero existing files move.

## Architectural Patterns

### Pattern 1: Server Components by Default, Client Islands for Interaction

**What:** Every page and most components are React Server Components (RSC). Only components that need browser APIs, state, or event handlers get `"use client"`.

**When to use:** Always. RSC is the default in App Router; deviate only when forced.

**Trade-offs:**
- Pros: Near-zero JS for static pages, faster TTI, smaller bundle, content rendered on the server.
- Cons: Cannot use `useState`/`useEffect`/event handlers in RSCs; client islands need clear boundaries.

**Example:**
```tsx
// app/page.tsx — SERVER component (default)
import { Hero } from "@/components/home/hero";
import { CurrentlyBlock } from "@/components/home/currently-block";
import { ContactTrigger } from "@/components/contact/contact-trigger"; // client island

export default function HomePage() {
  return (
    <main>
      <Hero />              {/* server */}
      <CurrentlyBlock />    {/* server */}
      <ContactTrigger />    {/* "use client" island, hydrates standalone */}
    </main>
  );
}
```

```tsx
// components/contact/contact-modal.tsx
"use client"; // ← only this subtree ships JS

import { useState } from "react";
export function ContactModal() { /* ... */ }
```

For a portfolio, the only required client islands are the ContactModal/trigger and any animation that reads cursor/scroll. Hero, ProjectCards, AboutBio, WorkGrid all stay server.

### Pattern 2: Content-as-Code via Velite + Zod

**What:** Author MDX in `content/`, validate with a Zod schema in `velite.config.ts`, consume typed data anywhere via a generated module.

**When to use:** Any content that's longer than 1-2 sentences or has structured frontmatter (projects, essays, case studies). For tiny one-line strings (the "Currently" status), use plain TS in `data/`.

**Trade-offs:**
- Pros: Type safety on frontmatter (TS errors if you mistype a field), auto-completion, build-time validation, fast dev loop, no client-side parsing.
- Cons: Extra build step (Velite watcher), Turbopack incompat (use webpack until Velite Turbopack support lands), one more dependency.

**Example:**
```ts
// velite.config.ts
import { defineConfig, defineCollection, s } from "velite";

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.mdx",
  schema: s.object({
    slug: s.slug("projects"),
    title: s.string(),
    tagline: s.string().max(140),
    status: s.enum(["live", "shipping", "archived"]),
    stack: s.array(s.string()),
    href: s.string().url().optional(),
    repo: s.string().url().optional(),
    order: s.number().default(99),
    body: s.mdx(),
  }),
});

export default defineConfig({
  collections: { projects },
  root: "content",
});
```

```ts
// app/work/page.tsx
import { projects } from "#site/content"; // Velite-generated alias
export default function WorkIndex() {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  return <ProjectGrid projects={sorted} />;
}
```

**Alternative considered:** `next-mdx-remote/rsc` + `gray-matter`. Works fine but you lose the Zod-validated, type-generated DX. Choose Velite unless Turbopack is non-negotiable.

### Pattern 3: Design Tokens in CSS, Tailwind v4 `@theme`, No Config Bloat

**What:** All design tokens (colors, fonts, gradients, spacing scales) live in `app/globals.css` under `:root` and Tailwind v4's `@theme` directive. `tailwind.config.ts` is nearly empty.

**When to use:** Always in Tailwind v4. The CSS-first approach is the official direction; `tailwind.config.ts` is being relegated to plugins-only.

**Trade-offs:**
- Pros: Tokens are inspectable in DevTools, theme-able by overriding `:root`, shadcn-compatible if components are added later, no JS required to change a color.
- Cons: Some tooling/IDE plugins still expect config-based tokens (improving rapidly).

**Example:**
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-serif: "Fraunces", ui-serif, Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --color-ink-50:  #f5f5f7;
  --color-ink-400: #6b6b76;
  --color-ink-900: #0a0a0a;

  --color-charcoal-start: #1a1a1f;
  --color-charcoal-end:   #0a0a0a;

  --color-accent: #7c87ff;        /* soft electric blue */
  --color-accent-glow: #7c87ff33; /* 20% alpha for hover/focus */
}

:root {
  --bg-gradient: radial-gradient(
    ellipse at top,
    var(--color-charcoal-start),
    var(--color-charcoal-end)
  );
  --grain-opacity: 0.04;
}

html { background: var(--bg-gradient); color: var(--color-ink-50); }
```

The grain layer is a single `<GrainOverlay />` server component fixed-positioned at z-index 1, using a base64'd SVG noise pattern with `mix-blend-mode: overlay` and `opacity: var(--grain-opacity)`.

### Pattern 4: SVG-as-Component for the Monogram

**What:** The "B" monogram lives once as a React component (`components/ui/monogram-mark.tsx`) with a `size` prop and inherits `currentColor`. It is then composed into nav, hero, footer, OG images, and the favicon (via `app/icon.svg`).

**When to use:** Any vector mark/logo that appears in 2+ contexts and may need color/size variations.

**Trade-offs:**
- Pros: One source of truth, scales perfectly, themable via `currentColor`, no extra HTTP request, can animate via CSS/Framer Motion.
- Cons: Slightly larger HTML payload than `<img>` (negligible for a small mark).

**Example:**
```tsx
// components/ui/monogram-mark.tsx
type Size = "sm" | "md" | "lg" | "xl";
const px: Record<Size, number> = { sm: 16, md: 24, lg: 48, xl: 120 };

export function MonogramMark({ size = "md", className = "" }: { size?: Size; className?: string }) {
  const s = px[size];
  return (
    <svg
      width={s} height={s} viewBox="0 0 64 64"
      fill="currentColor" aria-hidden="true"
      className={className}
    >
      {/* path data — final form set in design phase */}
      <path d="M..." />
    </svg>
  );
}
```

Used as: `<MonogramMark size="xl" className="text-accent" />` in hero, `<MonogramMark size="sm" />` in nav, `<MonogramMark size="lg" className="opacity-40" />` in footer. The `app/icon.svg` is a static export of the same path (Next.js favicon convention requires a file, not a component).

### Pattern 5: Metadata Co-located with Routes

**What:** Each route owns its `generateMetadata` (or static `metadata` export) and its `opengraph-image.tsx`. A shared helper in `lib/seo.ts` provides defaults (title template, description fallback, default OG).

**When to use:** Always. Co-location keeps SEO drift from happening as pages are added.

**Trade-offs:**
- Pros: Per-page OG images (huge for `/work/[slug]` shareability), automatic title templates, per-route canonical URLs, Vercel pre-renders OGs at build.
- Cons: Slight boilerplate per route.

**Example:**
```tsx
// app/work/[slug]/page.tsx
import { projects } from "#site/content";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = projects.find((x) => x.slug === params.slug);
  return buildMetadata({
    title: p?.title,
    description: p?.tagline,
    path: `/work/${params.slug}`,
  });
}
```

```tsx
// app/work/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: { slug: string } }) {
  const p = projects.find((x) => x.slug === params.slug);
  return new ImageResponse(
    <div /* charcoal gradient + monogram + project title */ />,
    size
  );
}
```

### Pattern 6: Single Data Source per Concern

**What:** Each piece of mutable copy has exactly one file to edit.

| Concern | Single Source |
|---------|---------------|
| "Currently shipping…" line | `data/currently.ts` (export `currentlyStatus = "..."`) |
| Channel URLs/labels | `data/channels.ts` |
| Nav links | `data/nav.ts` |
| Site name/tagline/domain | `data/site.ts` |
| About body | `content/about.mdx` |
| A specific project | `content/projects/[slug].mdx` |

**Why:** The PROJECT.md requirement "easy to update" for the Currently line is satisfied if there's one obvious edit point. Hunting through JSX to find a hardcoded string is the failure mode this prevents.

## Data Flow

### Build-Time Flow (the dominant one for this site)

```
Author writes content/projects/capitollens.mdx
    ↓
`pnpm dev` or `pnpm build` triggers Velite watcher
    ↓
Velite parses frontmatter + body, validates against Zod schema
    ↓
Emits .velite/ generated TS modules (typed `projects` array)
    ↓
Next.js RSC imports projects via `#site/content` alias
    ↓
At build, Next renders /work/page.tsx and each /work/[slug]/page.tsx to static HTML
    ↓
Vercel uploads static HTML + Edge functions (OG routes)
    ↓
User hits braehods.com → CDN serves static HTML, near-zero TTFB
```

### Runtime Flow — Contact Form

```
User clicks "Contact" in nav/footer
    ↓
ContactTrigger (client island) sets modal open state
    ↓
ContactModal renders form (name, email, message)
    ↓
Submit → fetch("https://formspree.io/f/xqeypnkw", { method: "POST", body: FormData })
    ↓
Formspree validates, sends email to user inbox, returns 200
    ↓
Modal shows success state, auto-dismisses or shows confirmation
```

**Choice point:** Direct client → Formspree fetch (simpler, no server hop) vs. Server Action proxy (`app/api/contact/route.ts` → Formspree). For v1 use direct fetch — Formspree is built for this, the FORMSPREE_ID is public-safe, and a server proxy adds a Vercel function invocation per submission with no real benefit. Switch to Server Action only if spam becomes an issue and you need server-side validation.

### Runtime Flow — Page Navigation

```
User clicks /work in nav
    ↓
Next.js client router prefetches /work HTML (already prefetched on hover)
    ↓
Soft navigation: layout persists, only main content swaps
    ↓
ProjectGrid renders cards (data already in JS bundle from build)
    ↓
User clicks a card → /work/capitollens
    ↓
Same pattern: pre-rendered MDX HTML loads, layout persists
```

### State Management

For v1: **none beyond React local state.**

- Page data → Server-rendered, passed as props.
- Modal open/close → `useState` in the contact modal client island.
- Theme → CSS variables only (no toggle in v1, so no provider needed).
- Form state → Native `useFormStatus` if using Server Actions, or local state for direct fetch.

If/when light mode is added: `next-themes` (~1KB), wraps a single ThemeProvider in root layout. No Redux, no Zustand, no Jotai — they're solving problems this site doesn't have.

## Build Order (Maps to Roadmap Phases)

Recommended phase boundaries, in dependency order:

### Phase 1: Foundation & Scaffold
**Goal:** Empty Next.js app deploys successfully to a Vercel preview URL.
- `create-next-app` (App Router, TS, Tailwind v4, ESLint, src-less)
- Connect repo to Vercel, get preview URL on push
- Configure `tsconfig.json` (strict, path alias `@/*`)
- Drop in `next.config.mjs` MDX support, basic Velite scaffold
- Self-host fonts via `next/font` (one serif + one sans)
- `app/layout.tsx` with raw `<html>`, no chrome yet
- Confirm green deploy

**Exit criteria:** Empty page renders at `<vercel-preview>.vercel.app` with chosen fonts loaded.

### Phase 2: Design Tokens, Theme, Monogram
**Goal:** The site "feels right" before any content exists.
- `app/globals.css` with `@theme` block (charcoal gradient, accent, fonts)
- `<GrainOverlay />` component
- `<MonogramMark />` SVG component (placeholder path ok; final from design)
- `app/icon.svg` favicon (matching mark)
- Nav (logo + 3-4 placeholder links) and Footer (monogram + © + channel placeholders)
- Verify dark gradient + grain + accent on a blank page

**Exit criteria:** A blank page demonstrates the visual identity. Stranger reaction: "ok this is going to be nice."

### Phase 3: Home Page
**Goal:** The page that closes the deal.
- `<Hero />`: portrait + name + TL;DR positioning
- `<CurrentlyBlock />` reading from `data/currently.ts`
- `<ChannelLinkBlock />` reading from `data/channels.ts`
- (Optional) curated featured-work preview reading first 3 from Velite projects
- Restrained motion: staggered fade-in on load (Framer Motion or CSS), `prefers-reduced-motion` respected
- Default `opengraph-image.tsx` for `/`

**Exit criteria:** `/` is a complete, shareable page. Lighthouse 95+.

### Phase 4: About Page
**Goal:** The "tell me more" answer.
- `app/about/page.tsx` reads `content/about.mdx` via Velite
- `<AboutBio />` layout (photo + multi-paragraph copy)
- Per-route metadata + OG image
- Photo treated tastefully (placeholder ok per PROJECT.md)

**Exit criteria:** `/about` reads as a coherent short bio with the same visual language as home.

### Phase 5: Work Index + Detail
**Goal:** Project credibility, equal-weight grid + linkable detail pages.
- Velite schema for projects finalized
- `content/projects/*.mdx` for all 7 projects (CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, braehods-archive)
- `<ProjectCard />` component
- `app/work/page.tsx` renders `<ProjectGrid />` from Velite data
- `app/work/[slug]/page.tsx` renders detail (header + MDX body)
- Per-project `opengraph-image.tsx` (dynamic OG with project title + monogram)
- `generateStaticParams` for all slugs

**Exit criteria:** All 7 projects live at `/work/[slug]`, equal-weight grid at `/work`, each has its own OG image.

### Phase 6: Contact
**Goal:** Conversion goal of the site.
- `<ContactModal />` client component (Dialog + form)
- `<ContactTrigger />` in nav and footer
- Direct POST to `https://formspree.io/f/xqeypnkw`
- Success/error states, keyboard-accessible, focus-trap
- `FORMSPREE_ID` in `data/site.ts` (or env var; it's public-safe either way)

**Exit criteria:** Send a real test message; it lands in the existing Formspree inbox.

### Phase 7: Polish, SEO, Analytics, A11y
**Goal:** Lighthouse 95+, WCAG AA, social-share-pretty.
- `robots.ts`, `sitemap.ts`, canonical URLs
- Verify OG images render correctly (Slack, Twitter, iMessage previews)
- Vercel Analytics or Plausible (lightweight, privacy-respecting)
- Reduced-motion audit
- Color contrast audit on charcoal gradient
- 320px viewport check
- Lighthouse run, fix flagged items

**Exit criteria:** All quality bars in PROJECT.md cleared.

### Phase 8: Domain Migration & Launch
**Goal:** braehods.com points at this repo.
- Archive old `~/Projects/braehods` repo (README → "moved to braeden-site")
- Remove GitHub Pages CNAME on old repo
- Add `braehods.com` as custom domain in Vercel project
- Update DNS (A records or CNAME → cname.vercel-dns.com)
- Verify Formspree still works at the new host (it should — domain-agnostic)
- Production deploy from `main`

**Exit criteria:** braehods.com serves the new site, old repo archived, contact form delivers.

**Future (v1.x, NOT in v1):**
- `/writing` — add `content/writing/`, Velite collection, route, nav entry. No restructure required.
- Light mode toggle.
- `/now` page.
- Newsletter signup.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **Today (1 author, 7 projects)** | Current architecture is right-sized. No changes. |
| **+ /writing with 10-50 essays** | Add Velite collection; add `app/writing/[slug]`. RSS feed via a Route Handler reading the collection. Build time grows ~5s. |
| **+ /writing with 200+ essays** | Pagination on `/writing` (Next supports this natively). Maybe ISR for reduced build time. Still no DB needed. |
| **External traffic surge** | Vercel CDN handles it; static HTML is the entire site for >99% of routes. The OG image route runs at the edge, also fine. |
| **Multi-author / drafts / scheduled posts** | Migrate `content/` to a headless CMS (Sanity, Tina, or Contentful). Velite remains the type layer if Sanity emits MDX; otherwise replace Velite with the CMS client. Far future. |

### Scaling Priorities

1. **First bottleneck: build time.** Velite re-runs on every content change in dev. If `content/` exceeds ~500 files, switch to incremental builds or move to a CMS.
2. **Second bottleneck: image weight.** Project screenshots and the portrait can blow Lighthouse if not optimized. Use `next/image` everywhere, store originals in `public/images/`, let Next handle responsive variants.
3. **Third bottleneck: form spam.** If Formspree starts forwarding spam, add reCAPTCHA (Formspree supports it) or move submission through a Server Action with a honeypot field. Don't pre-emptively add complexity.

## Anti-Patterns

### Anti-Pattern 1: Putting UI Components Under `app/`

**What people do:** Drop `app/_components/Hero.tsx`, `app/_lib/utils.ts`, etc., turning `app/` into the entire codebase.

**Why it's wrong:** `app/` is a routing primitive — every folder is a potential URL segment. Mixing routing with reusable UI muddles boundaries, makes refactors riskier (rename = URL break), and obscures which files are routes vs. helpers. Underscore-prefixed folders (`_components`) work but are a workaround for a structural problem.

**Do this instead:** `app/` contains only `page.tsx`, `layout.tsx`, `loading.tsx`, route metadata files, and route-handler `route.ts` files. Everything else lives in `components/`, `lib/`, `data/`, `content/`.

### Anti-Pattern 2: One Mega Client Component at the Root

**What people do:** Slap `"use client"` on `app/layout.tsx` or the page root because "I need state somewhere."

**Why it's wrong:** Defeats the entire RSC value prop. The whole subtree ships as JS, build sizes balloon, fonts/styles flash, and SEO suffers. Lighthouse score collapses.

**Do this instead:** Keep RSC at the top. Push `"use client"` to the smallest possible leaf — usually just the modal, the form, or the animated element. Server components can render client components freely; the boundary is one-way.

### Anti-Pattern 3: Hardcoding the "Currently" String in JSX

**What people do:** `<p>Currently shipping CapitolLens</p>` directly inside `Hero.tsx`.

**Why it's wrong:** PROJECT.md explicitly requires "easy to update" for this line. If it's buried in a component, every update is a code change in a file the author has to remember exists.

**Do this instead:** `data/currently.ts` exports the string. Hero imports it. Updating the line is "open one file, change one string, push." Zero hunting.

### Anti-Pattern 4: Tailwind Config Sprawl with Hardcoded Hex

**What people do:** Maintain a 200-line `tailwind.config.ts` with the entire color palette inlined, plus duplicated tokens in CSS for non-Tailwind use.

**Why it's wrong:** Two sources of truth, drifts immediately. Tailwind v4 explicitly moves to CSS-first.

**Do this instead:** Tokens in `globals.css` `@theme` block. Tailwind picks them up automatically. Non-Tailwind CSS uses the same `var(--color-accent)`. One source.

### Anti-Pattern 5: MDX Frontmatter Without Validation

**What people do:** Author `content/projects/foo.mdx` with arbitrary frontmatter, parse with gray-matter, hope for the best.

**Why it's wrong:** Typos in frontmatter (`taglien` vs `tagline`) silently render as `undefined`. No type safety. Refactoring a field name means searching every MDX file.

**Do this instead:** Velite + Zod schema. Build fails loudly if a project file is missing `tagline`. Refactoring is a schema change + TS errors guiding you.

### Anti-Pattern 6: Animations That Ignore `prefers-reduced-motion`

**What people do:** Drop Framer Motion `<motion.div animate={...}>` everywhere with no guard.

**Why it's wrong:** Vestibular-disorder-affected users get nauseated; WCAG AA fail. PROJECT.md explicitly requires `prefers-reduced-motion` respect.

**Do this instead:** Centralize motion variants in `lib/motion.ts`. Each variant has a reduced-motion branch (instant transition or zero distance). Or use the `useReducedMotion()` Framer hook and short-circuit. CSS animations: wrap in `@media (prefers-reduced-motion: no-preference) { ... }`.

### Anti-Pattern 7: Per-Page Layout Duplication

**What people do:** Each page recreates nav + footer + GrainOverlay because "I might want it different on /work."

**Why it's wrong:** Three files diverge over time. Bug-fix-in-one means bug-fix-in-three.

**Do this instead:** `app/layout.tsx` owns nav, footer, GrainOverlay. Every page renders inside it. If `/work` legitimately needs a different layout, use a route group `app/(work-layout)/work/page.tsx` with its own `layout.tsx` — explicit, scoped.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Formspree** | Direct client `fetch` from ContactModal to `https://formspree.io/f/xqeypnkw` | FORMSPREE_ID is public-safe. Existing inbox preserved. Optional: move to Server Action if spam filtering needed. |
| **Vercel** | Connected via GitHub; auto-preview on PR, auto-prod on push to `main` | No GitHub Actions needed. Custom domain `braehods.com` set in Vercel dashboard. |
| **Vercel Analytics** | `<Analytics />` in root layout (1 line) | Privacy-respecting, lightweight (~2KB), free for personal sites. |
| **YouTube + Instagram** | Outbound links only — `data/channels.ts` exports URLs, ChannelLinkBlock renders them | No iframes, no API calls, no SDKs. Per PROJECT.md: "no on-site video embeds." |
| **next/font** | Self-hosts Google Fonts at build time | Zero layout shift, zero external font request, no privacy implications. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **`app/` ↔ `components/`** | Direct import (`@/components/...`) | One-way: app imports components, never reverse. |
| **`components/` ↔ `lib/`** | Direct import (`@/lib/...`) | Components consume lib utilities; lib never imports components. |
| **`components/` ↔ `data/`** | Direct import (`@/data/...`) | Static, build-time. |
| **`app/` ↔ `content/` (via Velite)** | Import from `#site/content` alias | Velite generates the module; consumers don't see raw MDX. |
| **Server ↔ Client (RSC boundary)** | Props serialization | Cannot pass functions, classes, or non-serializable values. Pass primitives, plain objects, ReactNodes. |
| **Build ↔ Runtime** | All content baked at build | No runtime DB, no runtime CMS calls. Edge runs only OG image generation and (optionally) the contact server action. |

## Sources

- [Next.js — Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js — Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Next.js — MDX Guide](https://nextjs.org/docs/app/guides/mdx)
- [Next.js — Metadata files: opengraph-image / twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Next.js — generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js — App Icons (favicon, icon, apple-icon)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [Next.js — Forms with Server Actions](https://nextjs.org/docs/app/guides/forms)
- [Velite — Introduction & Quick Start](https://velite.js.org/guide/introduction)
- [Velite — Define Collections](https://velite.js.org/guide/define-collections)
- [Velite — Next.js integration](https://velite.js.org/guide/with-nextjs)
- [shadcn/ui — Theming with Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
- [Theming Shadcn with Tailwind v4 and CSS Variables (Joseph Goins)](https://medium.com/@joseph.goins/theming-shadcn-with-tailwind-v4-and-css-variables-d602f6b3c258)
- [Formspree — React Forms with NextJS guide](https://formspree.io/guides/nextjs/)
- [Vercel — Deploying GitHub Projects](https://vercel.com/docs/git/vercel-for-github)
- [Vercel — Environments (preview vs. production)](https://vercel.com/docs/deployments/environments)
- [Best Practices for Organizing Your Next.js 15 (DEV Community)](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)

---
*Architecture research for: Next.js App Router personal portfolio site (braehods.com)*
*Researched: 2026-05-07*
