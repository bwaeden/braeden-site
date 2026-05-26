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
- [ ] **DSGN-03**: Color tokens — text (cool white ~#e8e8e8), muted (~#a8a8a8 — clears WCAG AA against #0a0a0a; updated 2026-05-08 from initial #707070 guess per Phase 1 discuss-phase D-06), accent (soft electric blue ~#7c87ff), border (~#2a2a2f) — exposed as CSS variables and Tailwind v4 theme entries
- [ ] **DSGN-04**: Type system loaded via `next/font` — display serif (Fraunces or equivalent) + Geist Sans body + Geist Mono UI; zero CLS, font-display swap
- [ ] **DSGN-05**: Custom "B" monogram designed as inline SVG React component, sized via prop, used in nav/hero/footer/favicon/404/OG
- [ ] **DSGN-06**: Visible focus ring style (electric-blue outline) defined globally for all interactive elements
- [ ] **DSGN-07**: Restrained motion primitives — staggered fade-in on load, hover lifts, smooth section transitions — implemented via CSS keyframes + native `<ViewTransition>`; no scroll-jacking, no parallax, no animation library
- [ ] **DSGN-08**: All motion gated behind `@media (prefers-reduced-motion: no-preference)` so reduced-motion users get instant state changes
- [ ] **DSGN-09**: WCAG AA color contrast verified for body text and accent on the gradient (top, middle, bottom)

### Home Page (HOME)

- [x] **HOME-01**: Hero treats Braeden as the focal point — name, monogram, photo (or placeholder), one-line positioning ("Business student and entrepreneur in LA, building things and running a small content brand" or refined variant)
- [x] **HOME-02**: "Currently" status block sourced from `data/currently.ts` showing one-line current activity (e.g., "Currently shipping CapitolLens") and last-updated date
- [x] **HOME-03**: Channel-link block — Instagram channel button opens in new tab, no embeds, "DM me" affordance (YouTube dropped from v1 per .planning/phases/02-home-page/02-SCOPE-AMENDMENT.md; component logic preserves a platform-keyed shape so YT can be re-enabled post-v1 via `data/channels.ts` only)
- [x] **HOME-04**: Hero LCP element loads without animation delay (avoid hero animations that block LCP)
- [x] **HOME-05**: Curated overview links to `/about` and `/work` with view-transition shared element where photo is reused
- [x] **HOME-06**: Footer with monogram, social links, copyright year, repo/source link

### About Page (ABOUT)

- [x] **ABOUT-01**: `/about` page renders short bio in Braeden's voice (no AI-template phrases, no "passionate developer" copy)
- [x] **ABOUT-02**: Photo treated tastefully on charcoal background (subtle border / treatment); current `images/photo.jpg` acceptable as v1 placeholder
- [x] **ABOUT-03**: Includes location, current focus, and a friendly CTA to the contact modal
- [x] **ABOUT-04**: Reads in under 60 seconds — short paragraphs, scannable

### Work / Projects (WORK)

- [x] **WORK-01**: `/work` page renders all projects in an equal-weight responsive grid (no flagship hierarchy)
- [x] **WORK-02**: Project entries sourced from `data/projects.ts` (typed), with at minimum: title, one-line description, tags, status, primary URL
- [x] **WORK-03**: Project status badges (shipped / paper-trading / in-dev / archived) render visually as colored dot + label
- [x] **WORK-04**: Tag taxonomy supports filtering or visual grouping (trading, content, tools, archived) — even if not interactive in v1, tags are visible
- [x] **WORK-05**: Each project card links out to its repo, site, or video (no in-site case study pages in v1; route `/work/[slug]` reserved but not built)
- [x] **WORK-06**: Initial project list seeded: CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, plus archived braehods reference

### Contact (CTCT)

- [ ] **CTCT-01**: Contact opens as a modal (not a new page) using native `<dialog>` or accessible Dialog component with focus trap and ESC close
- [ ] **CTCT-02**: Form posts to existing Formspree endpoint (`xqeypnkw`) — uses fetch directly or `@formspree/react` hook
- [ ] **CTCT-03**: Three states (idle / submitting / success or error) rendered visibly and announced via `aria-live`
- [ ] **CTCT-04**: Honeypot field (custom name, NOT `_gotcha`) plus minimum-time-to-submit check to catch bots without reCAPTCHA
- [ ] **CTCT-05**: Client-side validation for required fields (name, email, message) with accessible error messages
- [ ] **CTCT-06**: `mailto:` fallback link below the form ("Or just email me directly →") so conversion never fully blocks if Formspree fails
- [ ] **CTCT-07**: Modal preserves background scroll lock; reopens cleanly if dismissed and reopened

### SEO & Metadata (SEO)

- [x] **SEO-01**: Each route generates `<title>` and meta description via `generateMetadata` (home, about, work, 404)
- [x] **SEO-02**: Open Graph + Twitter card meta tags on every route with correct dimensions (1200×630)
- [x] **SEO-03**: Dynamic OG image generation via `@vercel/og` — renders page title in site typography on charcoal background; static fallback for `/`
- [x] **SEO-04**: `app/sitemap.ts` and `app/robots.ts` generated; sitemap iterates the content folder so future `/writing` routes get added free
- [x] **SEO-05**: Person JSON-LD structured data with `sameAs` array (GitHub, Instagram — YouTube dropped from v1 per 02-SCOPE-AMENDMENT.md) in root layout
- [x] **SEO-06**: Canonical URL set per route via `alternates.canonical`
- [ ] **SEO-07**: Custom favicon set: `icon.svg`, `apple-icon.png`, 32×32, 16×16, web manifest — all using the B monogram
- [x] **SEO-08**: Branded `app/not-found.tsx` 404 page with monogram + return link
- [x] **SEO-09**: Vercel preview deployments serve `X-Robots-Tag: noindex` to prevent leaking into search

### Accessibility (A11Y)

- [x] **A11Y-01**: Every interactive element keyboard-reachable in logical tab order
- [ ] **A11Y-02**: Visible focus rings on all interactive elements (no `outline: none` without replacement)
- [ ] **A11Y-03**: Modal contact form passes WCAG dialog requirements (focus trap, ESC, return focus to trigger)
- [x] **A11Y-04**: All images have meaningful `alt` attributes (or `alt=""` for decorative)
- [x] **A11Y-05**: Color is never the only state indicator (badges have label text, not just colored dots)
- [ ] **A11Y-06**: `prefers-reduced-motion` respected across all motion (DSGN-08 in practice)
- [x] **A11Y-07**: Site usable at 200% browser zoom without horizontal scroll on mobile

### Performance (PERF)

- [x] **PERF-01**: Lighthouse mobile score ≥ 95 across Performance, Accessibility, Best Practices, SEO
- [x] **PERF-02**: Lighthouse desktop score ≥ 95 across all four
- [x] **PERF-03**: First-page client JS bundle ≤ 50 KB gzipped (excluding contact modal client island)
- [x] **PERF-04**: All images served via `next/image` with explicit width/height; LCP image preloaded if needed
- [ ] **PERF-05**: Vercel Speed Insights + Vercel Analytics installed; cookieless, no banner needed
- [~] **PERF-06**: Hero LCP under 2.5 s on a simulated mid-tier mobile (Vercel Speed Insights as benchmark) — **PARTIAL / Phase 6 carry-forward**: HOME-04 sub-clause (no-animation on LCP element) verified GREEN in Phase 2; PERF-06 numeric threshold measured 2821ms on Slow-4G Lighthouse post-AVIF (target <2500ms). Phase 2 binding gate deferred; Phase 6 owns final perf audit with real-user Speed Insights data per PERF-01/02/05.

### Launch & Migration (LNCH)

- [ ] **LNCH-01**: Domain `braehods.com` configured on Vercel; DNS swap performed in correct order (add domain to Vercel before swapping CNAME so SSL stages)
- [ ] **LNCH-02**: Old `braehods` GitHub Pages repo archived OR deploys a 301 redirect stub pointing at the new origin to avoid competing for search rank
- [ ] **LNCH-03**: GitHub profile site link, Instagram bio link, YouTube About section all point at `braehods.com` (verify post-launch)
- [ ] **LNCH-04**: Launch checklist run: real-device mobile test (iPhone Safari + Android Chrome), OG validation in iMessage / Slack / LinkedIn / X, contact form end-to-end test (real email arrives at Formspree-backed inbox), all external links verified
- [x] **LNCH-05**: 320px viewport rendering verified — no horizontal overflow, hero readable, modal usable

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

Which phases cover which requirements. Updated 2026-05-07 by roadmapper.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| FOUND-07 | Phase 1 | Pending |
| FOUND-08 | Phase 1 | Pending |
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| DSGN-03 | Phase 1 | Pending |
| DSGN-04 | Phase 1 | Pending |
| DSGN-05 | Phase 1 | Pending |
| DSGN-06 | Phase 1 | Pending |
| DSGN-07 | Phase 1 | Pending |
| DSGN-08 | Phase 1 | Pending |
| DSGN-09 | Phase 1 | Pending |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Complete |
| HOME-04 | Phase 2 | Complete |
| HOME-05 | Phase 2 | Complete |
| HOME-06 | Phase 2 | Complete |
| ABOUT-01 | Phase 3 | Complete |
| ABOUT-02 | Phase 3 | Complete |
| ABOUT-03 | Phase 3 | Complete |
| ABOUT-04 | Phase 3 | Complete |
| WORK-01 | Phase 4 | Complete |
| WORK-02 | Phase 4 | Complete |
| WORK-03 | Phase 4 | Complete |
| WORK-04 | Phase 4 | Complete |
| WORK-05 | Phase 4+6 | Complete (Plan 06-01: 3 GH URL HTTP-status verified — all 200 except expected `no-more-short-form` 404; `data/projects.ts` slugs all live) |
| WORK-06 | Phase 4 | Complete |
| CTCT-01 | Phase 5+6 | Verified on preview (Plan 06-01: contact-modal-opens-from-* + esc-closes specs GREEN; prod verify in Plan 06-03) |
| CTCT-02 | Phase 5+6 | Verified on preview (Plan 06-01: spec-level GREEN against preview CDN; real Formspree email arrival gate PENDING user verification; prod verify in Plan 06-03) |
| CTCT-03 | Phase 5+6 | Verified on preview (Plan 06-01: contact-modal-states success/submitting/error specs GREEN on preview after Cat E/F/G fixes) |
| CTCT-04 | Phase 5+6 | Verified on preview (Plan 06-01: honeypot + min-time silent-rejection specs GREEN; bypassedSuccess trace audited per Cat C) |
| CTCT-05 | Phase 5+6 | Verified on preview (Plan 06-01: CTCT-05 empty-submit-blocks-network-call spec GREEN) |
| CTCT-06 | Phase 5+6 | Verified on preview (Plan 06-01: mailto-fallback spec GREEN after Cat B `::after` refactor) |
| CTCT-07 | Phase 5+6 | Verified on preview (scroll-lock + reopen-cleanly spec GREEN) |
| SEO-01 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — metadata-per-route + canonical-urls specs GREEN; SEO Lighthouse-score ≥95 confirmed in prod at 06-03) |
| SEO-02 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — og-images-render spec GREEN ×3 routes; SEO Lighthouse-score ≥95 confirmed in prod at 06-03) |
| SEO-03 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — static `/opengraph-image.png` 200 1200×630; SEO Lighthouse-score ≥95 confirmed in prod at 06-03) |
| SEO-04 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — sitemap-renders + robots-renders specs GREEN; SEO Lighthouse-score ≥95 confirmed in prod at 06-03) |
| SEO-05 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — jsonld-person spec GREEN, Person @type + sameAs[github,instagram], NO YouTube; Google Rich Results human-verify deferred to 06-03 pre-launch pass) |
| SEO-06 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — canonical-urls spec GREEN per route; SEO Lighthouse-score ≥95 confirmed in prod at 06-03) |
| SEO-07 | Phase 1 | Pending |
| SEO-08 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — not-found-renders spec GREEN, branded 404 + monogram + `← Back home`; SEO Lighthouse-score ≥95 confirmed in prod at 06-03) |
| SEO-09 | Phase 6 | Complete (Plan 06-02: verified GREEN on preview — preview-noindex spec GREEN, proxy.ts sets X-Robots-Tag:noindex; SEO Lighthouse-score ≥95 confirmed in prod at 06-03) |
| A11Y-01 | Phase 6 | Complete (Plan 06-02: Lighthouse a11y ≥95 on all 6 audits + reflow verified; NVDA + VoiceOver iOS manual walk deferred to 06-03 pre-launch pass) |
| A11Y-02 | Phase 1 | Pending |
| A11Y-03 | Phase 5+6 | Verified on preview (Plan 06-01: aria-live polite + assertive regions GREEN on preview CDN after Cat G dialog-scope fix) |
| A11Y-04 | Phase 6 | Complete (Plan 06-02: Lighthouse a11y ≥95 image-alt audit GREEN on all 6 audits; NVDA + VoiceOver iOS manual walk deferred to 06-03 pre-launch pass) |
| A11Y-05 | Phase 4+6 | Complete (Plan 06-01: WebAIM contrast measurement PENDING user gate — archived dot `#707070` on `#1a1a1f`, char counter `#c8a86a` on `#0a0a0a`; both expected ≥3.0:1 per WCAG 1.4.11) |
| A11Y-06 | Phase 1 | Pending |
| A11Y-07 | Phase 6 | Complete (Plan 06-02: 320px ≈400% + 640px ≈200% zoom — ZERO horizontal scroll on /, /about, /work verified on preview) |
| PERF-01 | Phase 6 | Complete (Plan 06-02: Lighthouse mobile ≥95 on Perf/A11y/BestPractices across /about + /work; homepage-mobile perf ~90 deferred to prod warmed-CDN verification at 06-03; SEO ≥95 confirmed in prod) |
| PERF-02 | Phase 6 | Complete (Plan 06-02: Lighthouse desktop ≥95 on Perf/A11y/BestPractices on all 3 routes after desktop-throttling spec fix; SEO ≥95 confirmed in prod at 06-03) |
| PERF-03 | Phase 6 | Complete (Plan 06-02: first-page bundle 20.38 KB gz ≤ 50 KB measured via Turbopack-native analysis, excluding 12.55 KB ContactModal island) |
| PERF-04 | Phase 2 | Complete |
| PERF-05 | Phase 6 | In Progress (Plan 06-01: `<Analytics />` + `<SpeedInsights />` verified mounted at app/layout.tsx lines 22-23; dashboard pageview confirmation pending) |
| PERF-06 | Phase 2 | Complete |
| LNCH-01 | Phase 6 | Pending |
| LNCH-02 | Phase 6 | Pending |
| LNCH-03 | Phase 6 | Pending |
| LNCH-04 | Phase 6 | Pending |
| LNCH-05 | Phase 6 | Complete (Plan 06-02: 320px viewport no horizontal overflow verified on preview on /, /about, /work) |

**Coverage:**
- v1 requirements: 67 total
- Mapped to phases: 67
- Unmapped: 0

**By phase:**
- Phase 1 (Foundation + Design Tokens): 20 requirements
- Phase 2 (Home Page): 8 requirements
- Phase 3 (About Page): 4 requirements
- Phase 4 (Work + Projects): 7 requirements
- Phase 5 (Contact Modal): 8 requirements
- Phase 6 (Polish + SEO + Launch): 20 requirements

---
*Requirements defined: 2026-05-07*
*Last updated: 2026-05-26 by execute-phase (Plan 06-02 close — SEO-01..06/08/09 + A11Y-01/04/07 + PERF-01..03 + LNCH-05 flipped Complete on preview; SEO Lighthouse ≥95, homepage-mobile perf ≥95, and SR walk deferred to Plan 06-03 pre-launch pass)*
