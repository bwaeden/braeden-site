# Project Research Summary

**Project:** braeden-site (braehods.com)
**Synthesized:** 2026-05-07
**Confidence:** HIGH across all four research areas

---

## Executive Summary

This is an editorial-dark personal brand site for a multi-audience principal (recruiters, investors, fellow builders, IG/YT fans). The research is unambiguous about approach: Next.js 16 App Router with static export to Vercel, RSC by default with client islands only where interaction demands it, CSS-first design tokens in Tailwind v4, and zero animation library for v1. The site has two jobs in strict priority order: (1) look like a genuinely nice website, (2) convert a stranger into someone who reaches out. Every technical and design decision should be evaluated against those two bars.

The stack is locked and confirmed: Next.js 16.2.6 + React 19.2.6 + TypeScript 5.9 + Tailwind v4 + Vercel. Four divergences surfaced across the research files and have been resolved. MDX tooling: use the official @next/mdx plugin (not Velite), which is Turbopack-compatible, App Router native, and maintained by the Next.js team; Velite is deferred until the /writing route exists and post count exceeds ~15. Phase structure: 6 phases (not 8), collapsing ARCHITECTURE.md Phase 1+2 into a single Foundation phase and Phase 7+8 into a single Polish+Launch phase. The data/currently.ts pattern is confirmed by both STACK.md and ARCHITECTURE.md. Animation: no motion library for v1; all CSS-first with lib/motion.ts as the isolation seam so a future motion@12.x swap is a one-file change.

The key risk cluster is credibility-destruction through overlooked details: contrast failure on the charcoal gradient (especially muted text at the dark end), font FOIT on the hero headline, a contact modal that is not keyboard-accessible, and Vercel preview URLs leaking into Google search results. None of these are hard to fix, but all of them are invisible until someone outside the build team encounters them. The mitigation strategy is to set constraints at the Foundation phase (prefers-reduced-motion rule, focus ring tokens, contrast minimums) and verify at the Polish phase before DNS cutover.

---

## Key Findings

### From STACK.md

**Core technologies:**
- Next.js 16.2.6 (App Router, Turbopack default, React 19.2 integration, static export-friendly)
- React 19.2.6 (required peer; ships ViewTransition API used for route transitions)
- TypeScript 5.9 strict mode (pin to 5.9; TS 6.0 just released, tooling ecosystem lagging)
- Tailwind CSS v4.2.4 (CSS-first @theme config, Lightning CSS, 5x faster full builds)
- @next/mdx 16.2.6 (official plugin, Turbopack-compatible, App Router native via mdx-components.tsx)

**Supporting libraries with rationale:**
- Fraunces (display serif, Google Fonts, free variable font) + Geist Sans (body) + Geist Mono (UI/code) - all loaded via next/font, zero CLS
- @formspree/react 3.0.0 - useForm hook, preserves existing xqeypnkw endpoint, client-only (no server action proxy needed)
- @vercel/analytics 2.0.1 + @vercel/speed-insights 2.0.0 - cookieless, free on Vercel, required to verify Lighthouse 95+ in production
- Zod 4.4.3 - runtime validation of project/content metadata
- clsx 2.1.1 + tailwind-merge 3.5.0 - className composition (cn() helper pattern)
- lucide-react 1.14.0 - tree-shakeable icons (GitHub, Instagram, YouTube, mail all included)
- SVG feTurbulence grain overlay (~400 bytes inline data-URI, static, mix-blend-mode: overlay at opacity 0.04-0.06)
- Native <dialog> element for contact modal (browser-native focus trap + Esc, no Radix needed for one modal)

**Critical do-not-use list:** Contentlayer (abandoned), GSAP (license + weight), Lenis/smooth-scroll (scroll-jacking), WebGL libraries, next-themes (dark-only for v1), Radix Dialog (one modal does not justify the dependency).

**Version compatibility note:** Node >= 20.9.0 required (Next 16 dropped Node 18). @formspree/react works with React 19 despite stale publish date.

### From FEATURES.md

**Table stakes (damage if absent):**
Responsive layout 320px-4K, WCAG AA color contrast, keyboard navigation with visible focus rings, prefers-reduced-motion respect, dark mode default, custom favicon set (B monogram), branded 404 page, per-route OG and Twitter meta, sitemap.xml + robots.txt, per-route title + description, Person schema JSON-LD, working Formspree contact with honeypot + validation + success/error states, external social links, Lighthouse 95+ mobile + desktop, hero (photo + name + positioning + Currently), About sub-page, Projects grid (7 projects equal-weight), Channel links block (no embeds), HTTPS on braehods.com.

**Differentiators (competitive edge):**
- Custom B monogram system (favicon, hero, footer, 404, OG template) - the memorable anchor
- Currently/status block on home - multi-audience signal reading from data/currently.ts
- Editorial display serif + sans pairing (Fraunces + Geist) - almost no dev portfolios use serif headlines
- Charcoal gradient (#1a1a1f to #0a0a0a) + grain overlay - difference between dark mode and editorial dark
- Dynamic OG images via @vercel/og - biggest shareability differentiator vs both reference sites
- Restrained craft motion (staggered fades, hover lifts) - rauno.me school, not scroll-jacking
- Hybrid IA (curated home + /about + /work sub-pages) - avoids both endless-scroll and empty-multi-page traps
- Project status badges + tag taxonomy in equal-weight grid

**Anti-features (explicitly excluded and why):**
Video embeds (kills Lighthouse + editorial mood), light mode toggle (dilutes single-mood identity), /writing route for v1 (no essay backlog; launch empty = worse than not having it), glassmorphism/purple-gradient hero (exhausted template signal), tech-stack sticker wall (reads as junior), reCAPTCHA (user-hostile; honeypot catches >99% of bots), generic copy.

**v2+ deferred triggers:**
- /writing route: when >= 3 essays drafted and site has been live >= 60 days
- Per-project case study pages: when a single project becomes flagship-worthy
- Shared-element hero-to-about photo transition: after layout is stable (v1.x)
- Live YouTube thumbnail fetch: when channel ships > 2 videos/week

**Critical dependency note:** B monogram blocks five surfaces (favicon, hero, footer, 404, dynamic OG template). Design phase must produce the mark before any of these can be finalized. Make monogram delivery the first design milestone.

### From ARCHITECTURE.md

**Project structure (10 major component groups):**
- app/ - routing only (page.tsx, layout.tsx, metadata files, route handlers)
- components/ui/ - atoms (MonogramMark, Button, Link, GrainOverlay)
- components/layout/ - site chrome (Nav, Footer)
- components/home/ - Hero, CurrentlyBlock, ChannelLinkBlock, FeaturedWork
- components/about/ - AboutBio
- components/work/ - ProjectCard, ProjectGrid, ProjectDetail
- components/contact/ - ContactModal (use client), ContactTrigger (use client)
- content/ - MDX source files (projects/*.mdx, about.mdx, reserved writing/)
- data/ - typed TS constants (currently.ts, channels.ts, site.ts, nav.ts)
- lib/ - pure logic (content.ts, og.ts, seo.ts, motion.ts, utils.ts)

**RSC pattern (non-negotiable):** Server components by default; "use client" only at leaf interactive nodes. For this site, the only required client islands are ContactModal/ContactTrigger and any animation reading cursor/scroll. Hero, ProjectCards, AboutBio, WorkGrid all stay server.

**Key architectural patterns:**
1. Server components by default, client islands for interaction
2. Design tokens in CSS (Tailwind v4 @theme) - one source of truth, no config bloat
3. SVG-as-component for the monogram (currentColor, zero HTTP request, reusable across all surfaces)
4. Metadata co-located with routes (each route owns generateMetadata + opengraph-image.tsx)
5. Single data source per concern (data/currently.ts = one string, one edit, one PR)

**Data flow:** Entirely build-time for content; runtime only for contact form POST to Formspree. No database, no CMS, no Server Actions required for v1.

**lib/motion.ts role (resolved divergence):** Acts as an isolation seam for all animation intent. Contains CSS animation class names and any future motion variant objects. When/if motion@12.x is added later, this is the one file that changes. Keeps "use CSS" and "use motion library" decisions swappable without touching component files.

**Velite vs @next/mdx (resolved divergence):** @next/mdx wins for v1. It is official, Turbopack-compatible, and has zero abandonment risk. Velite is deferred because it is pre-1.0, single-maintainer, webpack-only, and overkill for 7 projects in a JSON file and zero blog posts. The content/ folder structure is designed for Velite to slot in later without restructuring.

**Future-proofing built in:** Adding /writing later requires one new content/writing/ folder, one Velite collection, one app/writing/ route, and one nav entry in data/nav.ts. No existing files move.

### From PITFALLS.md

**Top 5 pitfalls by damage potential:**

1. **Charcoal-on-charcoal contrast failure** (Critical) - Muted text at #666-#777 passes against the lighter gradient stop but fails against #0a0a0a at the dark end. Lock minimums: body text >= #e2e2e2, muted text >= #a8a8a8. Test against BOTH gradient endpoints. Address: Design Tokens phase.

2. **Grain overlay performance** (Critical) - Animated feTurbulence or large PNG grain kills mobile Lighthouse (drops below 90) and forces GPU repaint on every scroll frame. Use static SVG data-URI grain at low opacity (0.03-0.06), position: fixed, pointer-events: none. Address: Design Tokens phase.

3. **Hero font FOIT/FOUT** (Critical) - Display serif on hero headline is invisible or shifts layout on first load. Use next/font/google with display: swap, preload: true, adjustFontFallback: true. Verify CLS = 0 on Lighthouse. Address: Foundation phase.

4. **Contact modal keyboard inaccessibility** (Critical) - Tab escapes modal, Esc does not close, focus does not return to trigger. Use native <dialog> element (browser handles focus trap and Esc for free). Test keyboard-only on every browser. Address: Contact phase.

5. **Vercel preview URLs in Google index** (Critical) - Every preview deploy at *.vercel.app is publicly indexable by default, creating duplicate-content penalties. Solve via env-aware robots.ts that sends noindex when VERCEL_ENV !== production. Address: Polish+Launch phase.

**Additional pitfalls to address by phase:**
- Foundation: prefers-reduced-motion global CSS rule before any animation; focus ring tokens with :focus-visible (never outline:none without replacement)
- Design Tokens: monogram/wordmark role hierarchy (monogram = nav/footer/favicon; wordmark = hero only; never both above fold); serif restricted to >= 40px display use only
- Work phase: project data in data/projects.ts not JSX; status conveyed by text+icon not color alone
- Polish: OG image dimensions exactly 1200x630, metadataBase set in root layout, per-page title template active, Person JSON-LD validated via Google Rich Results Test
- Launch: DNS SSL race condition sequence (add domain to Vercel first to stage SSL cert, test on *.vercel.app, lower TTL, then swap CNAME)

---

## Implications for Roadmap

### Suggested Phase Structure (6 phases)

The 8 phases in ARCHITECTURE.md are the right granularity for technical build order. For roadmap purposes they collapse into 6 deliverable phases that each have a clear external review gate.

**Phase 1: Foundation + Design Tokens**
Rationale: Everything else builds on top of the token system. Set contrast floors, font loading, animation rules, and grain overlay behavior before any visible UI exists. A wrong decision here propagates into every subsequent phase.
Delivers: Deployable blank page with correct fonts, dark gradient, grain overlay, design token system, prefers-reduced-motion global CSS rule, focus ring tokens.
Features from FEATURES.md: WCAG AA contrast foundation, prefers-reduced-motion, dark mode, font pairing, GrainOverlay component.
Pitfalls to avoid: Pitfall 1 (contrast), Pitfall 2 (grain perf), Pitfall 3 (serif at wrong sizes), Pitfall 4 (FOIT), Pitfall 6 (reduced-motion missing), Pitfall 8 (focus rings stripped).
Research flag: Standard patterns. No per-phase research needed.

**Phase 2: Home Page**
Rationale: The home page is the primary conversion surface and the hardest design problem (multi-audience, one scroll). Get it right before building secondary pages.
Delivers: Complete / route - Hero (photo + name + positioning + Currently), Channel links block, craft motion (staggered fades, hover lifts), default OG image, Lighthouse 95+ on this page.
Features from FEATURES.md: Hero, Currently block (data/currently.ts), Channel links, restrained motion, ViewTransitions, Vercel Analytics.
Pitfalls to avoid: Pitfall 4 (FOIT on hero name), Pitfall 5 (monogram/wordmark clash), Pitfall 6 (motion without reduced-motion guard).
Research flag: Standard patterns. No per-phase research needed.

**Phase 3: About Page**
Rationale: Secondary page, simpler layout, delivers the "tell me more" answer for investors and recruiters. Low complexity, high credibility value.
Delivers: /about route - bio, photo, story, per-route metadata + OG image.
Features from FEATURES.md: About sub-page, editorial type pairing at body sizes, per-route OG meta.
Pitfalls to avoid: Pitfall 3 (serif too small), Pitfall 12 (per-page title/description unique).
Research flag: Standard patterns. No per-phase research needed.

**Phase 4: Work + Projects Grid**
Rationale: Depends on content being authored (7 MDX files) and the data schema being finalized. Most content-heavy phase. Equal-weight grid is the "I do many things well" moment.
Delivers: /work route (equal-weight grid) + /work/[slug] routes (per-project detail), all 7 projects with tags + status badges, per-project OG images, MDX scaffolding present for future /writing.
Features from FEATURES.md: Projects grid, project status badges, tag taxonomy, hybrid IA, dynamic OG images, MDX scaffolding.
Pitfalls to avoid: Pitfall 14 (project data in JSX - must live in data/projects.ts), Pitfall 9 (status conveyed by color alone - text+icon required), Pitfall 10 (OG image dimensions/metadataBase).
Research flag: Standard patterns. No per-phase research needed.

**Phase 5: Contact**
Rationale: The site has one conversion goal beyond credibility. The contact form must work flawlessly with the Formspree endpoint preserved.
Delivers: ContactModal client component, ContactTrigger in nav and footer, Formspree POST to xqeypnkw, success/error states, honeypot spam filter, mailto fallback.
Features from FEATURES.md: Contact modal, Formspree integration, success/error states, mailto fallback, smart anti-spam (honeypot layered with minimum-time-to-submit check).
Pitfalls to avoid: Pitfall 7 (modal not keyboard-accessible - use native <dialog>), Pitfall 9 (form states color-only - add text labels + icons).
Research flag: Standard patterns. No per-phase research needed.

**Phase 6: Polish + Launch**
Rationale: Quality gate before DNS cutover. All Lighthouse, SEO, accessibility, and OG verification happens here. DNS migration has a specific sequence to avoid SSL race condition.
Delivers: sitemap.xml, robots.txt (with preview noindex), canonical URLs, Person JSON-LD validated, OG images validated (1200x630), Lighthouse 95+ verified on all pages, WCAG AA audit complete, DNS migrated to Vercel, old braehods repo archived.
Features from FEATURES.md: sitemap + robots, canonical URLs, Person JSON-LD, HTTPS on braehods.com.
Pitfalls to avoid: Pitfall 11 (preview URL indexing), Pitfall 10 (OG wrong dimensions), Pitfall 12 (duplicate titles), Pitfall 13 (malformed JSON-LD), DNS SSL race condition.
Research flag: Standard patterns. No per-phase research needed.

### Research Flags

All 6 phases follow well-documented Next.js App Router patterns. None require per-phase research sprints before planning.

The one area that may benefit from a targeted design spike before Phase 2 (Home): **B monogram design**. This is a design dependency, not a technology question. The monogram path data must be available before Phase 2 begins (it blocks favicon, hero, footer, 404, and OG template). If the monogram is not designed before Phase 1 completes, use a typographic placeholder and mark a swap pass in Phase 6.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm registry 2026-05-07; Next.js release notes + upgrade guide cross-checked; deprecations and breaking changes confirmed |
| Features | HIGH | Cross-referenced against both reference sites (rauno.me, brittanychiang.com) plus Next.js App Router docs, Formspree docs, Vercel OG docs |
| Architecture | HIGH | Aligns with Next.js official project structure recommendations; RSC and client island patterns from official App Router docs |
| Pitfalls | HIGH | Verified against official docs (MDN, WCAG, Next.js), current community practice, and known failure modes in dark-mode editorial portfolio builds |

**Overall confidence: HIGH.** The research is internally consistent, source-backed, and has been cross-checked for divergences. No gaps are expected to require research before planning begins.

### Gaps to Address During Planning

1. **B monogram path data** - Design deliverable, not a research gap. Must be available before Phase 2. The stack recommendation (inline SVG component, currentColor) does not depend on which mark is chosen.
2. **Portrait photo** - Current site has images/photo.jpg. Site is architected to use a placeholder and swap in a new photo out-of-band. Not a blocker.
3. **TypeScript 6.0 adoption** - TS 6.0 released May 2026. Pinned to TS 5.9 for v1. Revisit at first phase boundary after confirming Next.js + ESLint plugin compatibility.
4. **Safari ViewTransitions partial support** - React 19.2 ViewTransition fallback (no transition) is acceptable. Verify exact UX in Safari during Phase 2 design review.
5. **Formspree free tier limits** - @formspree/react is stable but last published 2024. The free tier submission limit should be confirmed before launch.

---

## Resolved Divergences

Four divergences were identified across the research files and resolved:

| # | Divergence | Resolution | Rationale |
|---|------------|------------|-----------|
| 1 | MDX library: STACK.md recommends @next/mdx; ARCHITECTURE.md recommends Velite + Zod | Use @next/mdx for v1; defer Velite | @next/mdx is official, Turbopack-compatible, zero abandonment risk. Velite is pre-1.0, single-maintainer, webpack-only. Revisit when /writing exceeds ~15 posts. |
| 2 | Phase count: STACK.md suggests 3-4; ARCHITECTURE.md defines 8 | 6 phases | ARCHITECTURE.md Phase 1+2 merged (Foundation+Tokens), Phase 7+8 merged (Polish+Launch). All 8 build steps preserved, regrouped into 6 review-gate phases. |
| 3 | data/currently.ts pattern | Confirmed | Both files agree: typed TS file exporting { statement: string; updatedAt: string; link?: string }. Single edit point. |
| 4 | Animation: STACK.md and PITFALLS.md recommend CSS + native ViewTransitions; ARCHITECTURE.md keeps lib/motion.ts with Framer Motion variants | CSS-only for v1; lib/motion.ts as isolation seam | No motion library installed for v1. All animation is CSS keyframes + transition. lib/motion.ts centralizes animation CSS class names and reduced-motion variants. Future motion@12.x swap = one file change. |

---

## Sources (Aggregated)

**PRIMARY (HIGH confidence):**
- Next.js 16 Release Notes (Oct 21 2025) - nextjs.org/blog/next-16
- Next.js Upgrade Guide v16 - nextjs.org/docs/app/guides/upgrading/version-16
- Tailwind CSS v4.0 Release - tailwindcss.com/blog/tailwindcss-v4
- npm registry direct query (2026-05-07) - all library versions verified
- Next.js metadata + OG images docs - nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js sitemap.ts + robots.ts conventions - nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Next.js JSON-LD guide - nextjs.org/docs/app/guides/json-ld
- Vercel OG Image Generation - vercel.com/docs/og-image-generation
- MDN: prefers-reduced-motion - developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Google Fonts: Fraunces - fonts.google.com/specimen/Fraunces
- Vercel Geist Font (SIL OFL license) - vercel.com/font
- CSS-Tricks: Grainy Gradients - css-tricks.com/grainy-gradients/
- Motion (formerly Framer Motion) docs - motion.dev/

**SECONDARY (MEDIUM-HIGH confidence):**
- brittanychiang.com (v4) - reference site, dark editorial
- rauno.me - reference site, craft motion
- Formspree React guide - formspree.io/guides/nextjs/
- Best Practices for Organizing Next.js 15 - dev.to/bajrayejoon
- Privacy-first analytics comparison (2026) - mitzu.io/post/best-privacy-compliant-analytics-tools-for-2026/

**TERTIARY (MEDIUM confidence, specific narrow use):**
- @formspree/react on npm - last publish 2024, stable but not actively maintained
- Velite docs - velite.js.org (deferred, referenced for future migration path only)
- Lucide React bundle size benchmark - medium.com/codetodeploy

---

*Research synthesis for: braeden-site (braehods.com)*
*Synthesized: 2026-05-07*
*Source files: STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md*