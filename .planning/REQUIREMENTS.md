# Requirements: Braeden Site (braehods.com)

**Defined:** 2026-05-07
**Core Value:** Anyone landing on the site walks away thinking "that's a nice
website" first, then "I want to follow up with him" — visual polish #1,
contact-conversion #2.

## v1 Requirements

Requirements for initial release at braehods.com. Each maps to roadmap phases.

### Foundation (FOUND)

- [ ] **FOUND-01**: Project scaffolds with Next.js 16 (App Router) + React 19 + TypeScript 5.9
- [ ] **FOUND-02**: Tailwind v4 installed with `@theme` design tokens defined in `app/globals.css`
- [ ] **FOUND-03**: `@next/mdx` configured with `content/` folder (used for projects in v1, ready for `/writing` in v2)
- [ ] **FOUND-04**: Folder layout enforced: `app/`, `components/{ui,layout,...}`, `content/`, `data/`, `lib/`, `public/`, `@/*` path alias from root
- [ ] **FOUND-05**: Vercel preview deploy wired (every PR gets a preview URL)
- [ ] **FOUND-06**: Repository initialized with `.gitignore`, `README.md`, ESLint + Prettier defaults
- [ ] **FOUND-07**: Single client island for `ContactModal`; everything else server-rendered (RSC default)
- [ ] **FOUND-08**: Typed data layer scaffolded: `data/site.ts`, `data/currently.ts`, `data/channels.ts`, `data/projects.ts` (all with TS types or Zod schemas)

### Design Tokens & Visual Identity (DSGN)

- [ ] **DSGN-01**: Charcoal gradient background (~#1a1a1f → #0a0a0a) implemented as CSS gradient on `<body>` or root layout
- [ ] **DSGN-02**: Subtle grain overlay (SVG noise filter or tiny PNG) layered above gradient at low opacity, costs <2 KB
- [ ] **DSGN-03**: Color tokens — text (cool white ~#e8e8e8), dim (~#707070), accent (soft electric blue ~#7c87ff) — exposed as CSS variables and Tailwind theme entries
- [ ] **DSGN-04**: Type system loaded via `next/font` — display serif (Fraunces or equivalent) + Geist Sans body + Geist Mono UI; zero CLS, font-display swap
- [ ] **DSGN-05**: Custom "B" monogram designed as inline SVG React component, sized via prop, used in nav/hero/footer/favicon/404/OG
- [ ] **DSGN-06**: Visible focus ring style (electric-blue outline) defined globally for all interactive elements
- [ ] **DSGN-07**: Restrained motion primitives — staggered fade-in on load, hover lifts, smooth section transitions — implemented via CSS keyframes + native `<ViewTransition>`; no scroll-jacking, no parallax, no animation library
- [ ] **DSGN-08**: All motion gated behind `@media (prefers-reduced-motion: no-preference)` so reduced-motion users get instant state changes
- [ ] **DSGN-09**: WCAG AA color contrast verified for body text and accent on the gradient (top, middle, bottom)

### Home Page (HOME)

- [ ] **HOME-01**: Hero treats Braeden as the focal point — name, monogram, photo (or placeholder), one-line positioning ("Business student and entrepreneur in LA, building things and running a small content brand" or refined variant)
- [ ] **HOME-02**: "Currently" status block sourced from `data/currently.ts` showing one-line current activity (e.g., "Currently shipping CapitolLens") and last-updated date
- [ ] **HOME-03**: Channel-link block — distinct buttons for YouTube and Instagram channels, opens in new tab, no embeds, includes "DM me" / "Subscribe" affordance
- [ ] **HOME-04**: Hero LCP element loads without animation delay (avoid hero animations that block LCP)
- [ ] **HOME-05**: Curated overview links to `/about` and `/work` with view-transition shared element where photo is reused
- [ ] **HOME-06**: Footer with monogram, social links, copyright year, repo/source link

### About Page (ABOUT)

- [ ] **ABOUT-01**: `/about` page renders short bio in Braeden's voice (no AI-template phrases, no "passionate developer" copy)
- [ ] **ABOUT-02**: Photo treated tastefully on charcoal background (subtle border / treatment); current `images/photo.jpg` acceptable as v1 placeholder
- [ ] **ABOUT-03**: Includes location, current focus, and a friendly CTA to the contact modal
- [ ] **ABOUT-04**: Reads in under 60 seconds — short paragraphs, scannable

### Work / Projects (WORK)

- [ ] **WORK-01**: `/work` page renders all projects in an equal-weight responsive grid (no flagship hierarchy)
- [ ] **WORK-02**: Project entries sourced from `data/projects.ts` (typed), with at minimum: title, one-line description, tags, status, primary URL
- [ ] **WORK-03**: Project status badges (shipped / paper-trading / in-dev / archived) render visually as colored dot + label
- [ ] **WORK-04**: Tag taxonomy supports filtering or visual grouping (trading, content, tools, archived) — even if not interactive in v1, tags are visible
- [ ] **WORK-05**: Each project card links out to its repo, site, or video (no in-site case study pages in v1; route `/work/[slug]` reserved but not built)
- [ ] **WORK-06**: Initial project list seeded: CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, plus archived braehods reference

### Contact (CTCT)

- [ ] **CTCT-01**: Contact opens as a modal (not a new page) using native `<dialog>` or accessible Dialog component with focus trap and ESC close
- [ ] **CTCT-02**: Form posts to existing Formspree endpoint (`xqeypnkw`) — uses fetch directly or `@formspree/react` hook
- [ ] **CTCT-03**: Three states (idle / submitting / success or error) rendered visibly and announced via `aria-live`
- [ ] **CTCT-04**: Honeypot field (custom name, NOT `_gotcha`) plus minimum-time-to-submit check to catch bots without reCAPTCHA
- [ ] **CTCT-05**: Client-side validation for required fields (name, email, message) with accessible error messages
- [ ] **CTCT-06**: `mailto:` fallback link below the form ("Or just email me directly →") so conversion never fully blocks if Formspree fails
- [ ] **CTCT-07**: Modal preserves background scroll lock; reopens cleanly if dismissed and reopened

### SEO & Metadata (SEO)

- [ ] **SEO-01**: Each route generates `<title>` and meta description via `generateMetadata` (home, about, work, 404)
- [ ] **SEO-02**: Open Graph + Twitter card meta tags on every route with correct dimensions (1200×630)
- [ ] **SEO-03**: Dynamic OG image generation via `@vercel/og` — renders page title in site typography on charcoal background; static fallback for `/`
- [ ] **SEO-04**: `app/sitemap.ts` and `app/robots.ts` generated; sitemap iterates the content folder so future `/writing` routes get added free
- [ ] **SEO-05**: Person JSON-LD structured data with `sameAs` array (GitHub, Instagram, YouTube; LinkedIn if available) in root layout
- [ ] **SEO-06**: Canonical URL set per route via `alternates.canonical`
- [ ] **SEO-07**: Custom favicon set: `icon.svg`, `apple-icon.png`, 32×32, 16×16, web manifest — all using the B monogram
- [ ] **SEO-08**: Branded `app/not-found.tsx` 404 page with monogram + return link
- [ ] **SEO-09**: Vercel preview deployments serve `X-Robots-Tag: noindex` to prevent leaking into search

### Accessibility (A11Y)

- [ ] **A11Y-01**: Every interactive element keyboard-reachable in logical tab order
- [ ] **A11Y-02**: Visible focus rings on all interactive elements (no `outline: none` without replacement)
- [ ] **A11Y-03**: Modal contact form passes WCAG dialog requirements (focus trap, ESC, return focus to trigger)
- [ ] **A11Y-04**: All images have meaningful `alt` attributes (or `alt=""` for decorative)
- [ ] **A11Y-05**: Color is never the only state indicator (badges have label text, not just colored dots)
- [ ] **A11Y-06**: `prefers-reduced-motion` respected across all motion (DSGN-08 in practice)
- [ ] **A11Y-07**: Site usable at 200% browser zoom without horizontal scroll on mobile

### Performance (PERF)

- [ ] **PERF-01**: Lighthouse mobile score ≥ 95 across Performance, Accessibility, Best Practices, SEO
- [ ] **PERF-02**: Lighthouse desktop score ≥ 95 across all four
- [ ] **PERF-03**: First-page client JS bundle ≤ 50 KB gzipped (excluding contact modal client island)
- [ ] **PERF-04**: All images served via `next/image` with explicit width/height; LCP image preloaded if needed
- [ ] **PERF-05**: Vercel Speed Insights + Vercel Analytics installed; cookieless, no banner needed
- [ ] **PERF-06**: Hero LCP under 2.5 s on a simulated mid-tier mobile (Vercel Speed Insights as benchmark)

### Launch & Migration (LNCH)

- [ ] **LNCH-01**: Domain `braehods.com` configured on Vercel; DNS swap performed in correct order (add domain to Vercel before swapping CNAME so SSL stages)
- [ ] **LNCH-02**: Old `braehods` GitHub Pages repo archived OR deploys a 301 redirect stub pointing at the new origin to avoid competing for search rank
- [ ] **LNCH-03**: GitHub profile site link, Instagram bio link, YouTube About section all point at `braehods.com` (verify post-launch)
- [ ] **LNCH-04**: Launch checklist run: real-device mobile test (iPhone Safari + Android Chrome), OG validation in iMessage / Slack / LinkedIn / X, contact form end-to-end test (real email arrives at Formspree-backed inbox), all external links verified
- [ ] **LNCH-05**: 320px viewport rendering verified — no horizontal overflow, hero readable, modal usable

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Writing / Blog (WRIT)

- **WRIT-01**: `/writing` route implemented (foundation already in v1)
- **WRIT-02**: First 3 long-form essays migrated or written
- **WRIT-03**: RSS feed published at `/feed.xml`
- **WRIT-04**: Velite + Zod migration evaluated when post count crosses 10–15

### Now Page (NOW)

- **NOW-01**: `/now` page (Derek Sivers convention) with deeper status detail
- **NOW-02**: Listed on nownownow.com directory if /now ships

### Project Case Studies (CASE)

- **CASE-01**: `/work/[slug]` rendered for at least one flagship project (likely CapitolLens) with deeper writeup
- **CASE-02**: Case-study template established for future projects to populate

### Shared-Element Animation (SHRD)

- **SHRD-01**: Hero photo → /about photo shared-element view transition implemented via `view-transition-name`

### Newsletter (NEWS)

- **NEWS-01**: Newsletter signup form (only after writing backlog reaches a meaningful size)

### Light Mode (LITE)

- **LITE-01**: Light theme defined and toggleable (re-evaluated after v1 lives long enough to assess if it's actually wanted)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| YouTube / IG video embeds | Iframes break the editorial mood, add ~100 KB+ third-party JS, force YT/IG branding into the charcoal mood. Channel-link buttons cover the use case. |
| Light-mode toggle | One mood executed precisely beats two executed loosely. Doubles design surface and QA. |
| `/now` page | Empty `/now` is worse than no `/now`. The home "Currently" line covers v1; revisit at v2. |
| Newsletter / RSS at v1 | No essay backlog yet. Empty newsletter signup is anti-credibility. |
| CMS / admin UI | Site updates < 1×/month; PR-driven MDX/JSON is faster than maintaining a CMS for a single user. |
| Comments / likes / view counters | Without traffic, vanity counters are anti-signal. Engagement happens on IG/YT, not on the site. |
| Two-channel content split as separate UI | Strategic split is a content-side concern, not a site-IA concern. Single Channels block is enough. |
| WebGL / particle field hero | Tanks LCP, fails `prefers-reduced-motion`, screams "template." Anti-pattern surfaced in research. |
| Scroll-jacking / parallax / smooth-scroll override | Hostile to keyboard / screen reader users; PROJECT.md explicit anti-pattern. |
| Glassmorphism / purple-blue gradient hero | 2023–2025 trope; signals "I used a Figma kit" not "I built this." |
| Tech-stack sticker wall | Reads as junior dev portfolio; senior-coded sites show outcomes, not toolchains. |
| reCAPTCHA / hCaptcha on contact | User-hostile, Google tracking pixel, breaks editorial mood. Honeypot + min-time-to-submit catches bots invisibly. |
| Multi-language (i18n) | US-based audience, no translated content. English only for v1. |
| Service worker / PWA install | Personal site doesn't benefit from offline; SW caching causes deploy staleness. |
| Cookie consent banner | Vercel Analytics is cookieless — no banner needed. |
| New portrait shoot blocking launch | Portrait is swappable; ship the site, swap the file later. |
| "Hire me" / "Available for work" banner | Wrong audience model — narrows perception to "freelancer." |
| Live YouTube last-video thumbnail fetch | YT Data API requires a key, has quotas, fails silently. Static button is enough. |
| Project case study pages (v1) | Equal-weight grid is the deliberate design. Re-add a case study only if a project graduates to flagship status. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (To be filled by roadmapper) | | |

**Coverage:**
- v1 requirements: 71 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 71 ⚠

---
*Requirements defined: 2026-05-07*
*Last updated: 2026-05-07 after initial definition*
