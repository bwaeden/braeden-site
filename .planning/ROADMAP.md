# Roadmap: Braeden Site (braehods.com)

**Created:** 2026-05-07
**Granularity:** standard (5-8 phases)
**Phases:** 6
**Coverage:** 67/67 v1 requirements mapped

## Core Value

Anyone landing on the site walks away thinking "that's a nice website" first,
then "I want to follow up with him." Visual polish #1, contact-conversion #2.

Every phase ships a deployable Vercel preview URL. No big-bang launch — quality
gates are reviewable from Phase 1 onward.

## Phases

- [x] **Phase 1: Foundation + Design Tokens** — Shipped 2026-05-10. Deployable preview with charcoal gradient, fonts, monogram, design tokens, focus + reduced-motion rules.
- [x] **Phase 2: Home Page** — Shipped 2026-05-12. Curated `/` with hero (photo + name + Currently), Instagram channel button (YouTube dropped per 02-SCOPE-AMENDMENT.md), craft motion. 7 plans, 28 commits, 21/22 specs GREEN; PERF-06 LCP deferred to Phase 6 (2821ms post-AVIF on Slow-4G synthetic; Phase 6 owns the real-user Speed Insights gate).
- [ ] **Phase 3: About Page** — `/about` route delivers a short bio that reads in under 60 seconds
- [x] **Phase 4: Work + Projects** — Shipped 2026-05-14 (implementation complete; deploy + WebAIM contrast verification deferred to user-driven Phase 6 cycle). `/work` equal-weight 7-card grid renders all projects from typed `data/projects.ts`; CapitolLens leads, archived `braehods.com (v0)` orphan; ProjectCard Server Component (hairline-tile + status-dot+lowercase-label per A11Y-05); 4 Playwright specs flipped GREEN; 5 atomic commits + final docs commit; 0 new dependencies; Phase 1+2+3 chrome regression canaries unaffected (7 pre-existing `/`-route failures isolated to Phase 6 deploy concern).
- [x] **Phase 5: Contact Modal** — Shipped 2026-05-14 (implementation complete; full 12-item Phase Exit Visual Verification + 22 spec failures across Categories A–D deferred to user-driven Phase 6 cycle). Native `<dialog>` client island (`components/contact/ContactModal.tsx` — the SOLE `'use client'` directive per FOUND-07 carve-out) posts to Formspree `xqeypnkw` with focus trap + ESC + scroll lock; honeypot (`name="company"`) + 1500ms min-time bot defense; mailto fallback to `fakegoat1@gmail.com`; 9 new specs across 3 plans; D-05 atomic Nav + /about trigger swap landed in single commit `48f0a10` (Plan 03 Task 1); Rule 1 fix `e9206a5` discovered Next.js Link pushState pitfall (hashchange never fires) and added delegated anchor click listener.
- [ ] **Phase 6: Polish + SEO + Launch** — A11Y/PERF/SEO audit complete, OG images live, JSON-LD + sitemap shipped, DNS migrated to braehods.com

## Phase Details

### Phase 1: Foundation + Design Tokens
**Goal**: A deployable preview URL exists at `*.vercel.app` showing a blank charcoal-gradient page with the chosen fonts, the B monogram in the nav/footer/favicon, and the design-token + reduced-motion contracts that every later phase will build on.
**Depends on**: Nothing (first phase, critical path)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, FOUND-08, DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06, DSGN-07, DSGN-08, DSGN-09, A11Y-02, A11Y-06, SEO-07
**Success Criteria** (what must be TRUE):
  1. Pushing a commit produces a working Vercel preview URL within ~2 minutes (FOUND-05)
  2. Visiting that preview shows the charcoal gradient + grain overlay + cool-white text in Fraunces / Geist Sans / Geist Mono with zero font-swap flash (DSGN-01, DSGN-02, DSGN-04)
  3. The B monogram appears as the favicon, in the nav, and in the footer at the right sizes (DSGN-05, SEO-07)
  4. Tabbing through any link shows a visible electric-blue focus ring; users with `prefers-reduced-motion: reduce` see no animation (DSGN-06, DSGN-08, A11Y-02, A11Y-06)
  5. Body and accent text colors clear WCAG AA against both gradient endpoints (DSGN-09)
**Plans**: 1 plan, 5 waves (W0 validation infrastructure, W1 scaffold, W2 tokens + fonts + favicon, W3 components + contracts + showcase, W4 deploy + sign-off)
- [ ] 01-PLAN.md — Foundation + design-token surface in 5 sequential waves; ships Vercel preview URL with all 20 Phase 1 requirements verified by Playwright + axe + Lighthouse
**UI hint**: yes

### Phase 2: Home Page
**Goal**: A stranger landing on `/` sees a hero with Braeden's photo, name, one-line positioning, and a "Currently" status; can scan the channel-link block and follow CTAs into `/about` and `/work`; the page achieves Lighthouse 95+ on its own.
**Depends on**: Phase 1 (tokens, monogram, fonts, motion contract)
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, PERF-04, PERF-06
**Success Criteria** (what must be TRUE):
  1. Hero shows photo (or placeholder), name in display serif, monogram, and the one-line positioning ("Business student and entrepreneur in LA…") above the fold (HOME-01)
  2. The "Currently" line is rendered from `data/currently.ts` and updates with a one-file edit + push (HOME-02)
  3. Distinct YouTube and Instagram channel buttons open in new tabs with no on-site embeds (HOME-03)
  4. Hero LCP element renders without animation delay; mid-tier mobile LCP under 2.5s (HOME-04, PERF-06)
  5. Footer shows the monogram, social links, copyright year, and source link; in-page links go to `/about` and `/work` (HOME-05, HOME-06)
**Plans**: 7 plans, 4 waves (W0 data + tests + asset, W1 hero atoms, W2 chrome + stubs + composition, W3 deploy + visual sign-off)
- [x] 02-01-PLAN.md — W0 foundation: collect user URLs, populate data/channels.ts + data/site.ts.socials, copy public/portrait.jpg, patch next.config.ts images.qualities, stub 8 RED Playwright specs
- [x] 02-02-PLAN.md — W1 display atoms: components/home/HeroPhoto.tsx (LCP-safe + view-transition seam), components/home/CurrentlyLine.tsx (accent dot + Mono date), lib/format.ts (UTC-anchored formatDate)
- [x] 02-03-PLAN.md — W1 interactive atoms: components/home/ChannelButton.tsx + ChannelButtonRow.tsx (lucide YT/IG icons, target=_blank, hover translate), components/home/CTAArrowLink.tsx (accent text-link with arrow translate)
- [x] 02-04-PLAN.md — W2 layout extension: components/layout/SocialIconLink.tsx, extend components/layout/Footer.tsx (social row + View source), rewire components/layout/Nav.tsx LINKS to /about + /work
- [x] 02-05-PLAN.md — W2 stub routes: app/about/page.tsx + app/work/page.tsx (D-18 — "Coming soon." Server Components inheriting layout chrome)
- [x] 02-06-PLAN.md — W2 hero composition: components/home/Hero.tsx (composes 4 atoms in CD-05 rhythm + D-01 responsive layout) + rewrite app/page.tsx to <Hero />
- [ ] 02-07-PLAN.md — W3 deploy + verify: full 22-spec Playwright suite + axe smoke + Lighthouse mobile LCP against Vercel branch preview; 28-item visual checklist (user); squash-merge to main
**UI hint**: yes

### Phase 3: About Page
**Goal**: Visitors who want "tell me more" land on `/about`, read a short bio in Braeden's voice in under 60 seconds, see the photo, and have an obvious nudge to open the contact modal.
**Depends on**: Phase 2 (page chrome, photo treatment pattern)
**Requirements**: ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04
**Success Criteria** (what must be TRUE):
  1. `/about` renders a short bio with no AI-template phrases or "passionate developer" copy (ABOUT-01)
  2. Photo is treated tastefully on charcoal (subtle border / spacing) using the v1 placeholder image (ABOUT-02)
  3. Page surfaces location, current focus, and a friendly CTA wired to the future contact modal trigger (ABOUT-03)
  4. A first-time reader can finish the page in under 60 seconds — paragraphs are short and scannable (ABOUT-04)
**Plans**: 1 plan, 1 wave (composes the page + drafts bio prose + user reviews in-place per D-01)
- [x] 03-01-PLAN.md — Rewrite app/about/page.tsx: two-column composition (text + HeroPhoto reuse with view-transition seam match), draft 150-250 word first-person bio in 2-3 paragraphs (3 buckets: who+where+studying / current focus / open-to invitation), wire single `Get in touch →` CTA (CTAArrowLink reuse, href='/' placeholder pending Phase 5); 2 new Playwright specs (cliché-scrub regex + view-transition seam regression guard); 3 tasks including human-verify checkpoint for bio review
**UI hint**: yes

### Phase 4: Work + Projects
**Goal**: A `/work` route shows all 7 projects in an equal-weight responsive grid, each card sourced from `data/projects.ts` with title / description / tags / status / link, and status badges read clearly even without color.
**Depends on**: Phase 1 (data layer scaffold), Phase 2 (page chrome pattern)
**Requirements**: WORK-01, WORK-02, WORK-03, WORK-04, WORK-05, WORK-06, A11Y-05
**Success Criteria** (what must be TRUE):
  1. `/work` renders all 7 projects (CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, archived braehods) in an equal-weight grid with no flagship hierarchy (WORK-01, WORK-06)
  2. Project entries are typed and live in `data/projects.ts`; editing one adds or modifies a card with no JSX hunt (WORK-02)
  3. Status badges (shipped / paper-trading / in-dev / archived) are readable as colored dot + label, never color-only (WORK-03, A11Y-05)
  4. Tags render visibly on each card and group projects by family (trading / content / tools / archived) even without interactive filtering (WORK-04)
  5. Each card links out to its repo, site, or video with correct external-link semantics; no in-site case-study pages exist in v1 (WORK-05)
**Plans**: 2 plans, 4 waves (W0 data + 4 RED spec stubs + user-input checkpoint resolving OQ#1, W1 ProjectCard component, W2 page rewrite + spec flip RED to GREEN, W3 deploy + WebAIM contrast verify)
- [x] 04-01-PLAN.md — W0+W1: populate data/projects.ts (7 user-confirmed entries via Wave-0a "use all defaults", D-15 honesty contract), stub 4 RED Playwright specs (counts derived from projects.length import), ship components/work/ProjectCard.tsx (Server Component, hairline-tile, status dot+label per A11Y-05)
- [x] 04-02-PLAN.md — W2+W3: rewrite app/work/page.tsx (flips RED specs GREEN), TODO(user) marker clearance via user "approve placeholders" override (commit c69d255), consolidated SUMMARY + ROADMAP/STATE/REQUIREMENTS traceability flip; deploy + Playwright-against-preview + 28-item visual checklist + WebAIM contrast measurement DEFERRED to user-driven Phase 6 cycle by deliberate user choice
**UI hint**: yes

### Phase 5: Contact Modal
**Goal**: Visitors anywhere on the site can click "Contact," see a focus-trapped modal, submit a message that lands in the existing Formspree inbox (`xqeypnkw`), get a clear success/error state, and have a `mailto:` fallback if anything breaks.
**Depends on**: Phase 1 (focus ring tokens), Phase 2 (nav trigger), Phase 3 (about CTA)
**Requirements**: CTCT-01, CTCT-02, CTCT-03, CTCT-04, CTCT-05, CTCT-06, CTCT-07, A11Y-03
**Success Criteria** (what must be TRUE):
  1. Clicking the contact trigger from any page opens a native `<dialog>` modal with focus trapped inside, ESC closing it, and focus returning to the trigger (CTCT-01, CTCT-07, A11Y-03)
  2. Submitting the form posts to Formspree `xqeypnkw` and a real email arrives at the user's inbox (CTCT-02)
  3. Idle / submitting / success / error states are all visible AND announced via `aria-live` for screen readers (CTCT-03)
  4. Honeypot field (custom name) plus minimum-time-to-submit check silently rejects bots; client-side validation surfaces accessible inline errors for missing required fields (CTCT-04, CTCT-05)
  5. A `mailto:` fallback link sits below the form so a Formspree outage never fully blocks conversion (CTCT-06)
**Plans**: 3 plans, 3 waves (W0/Plan 01 = test infra + @formspree/react@3.0.0 + globals.css dialog rules; W1/Plan 02 = ContactModal client island [the SOLE 'use client' per FOUND-07 carve-out] + atomic spec update; W2/Plan 03 = atomic D-05 commit [mount + Nav swap + about swap + spec assertion swap, all in 1 commit] + Phase Exit verify + close)
- [x] 05-01-PLAN.md — W0: install @formspree/react@3.0.0, append modal-fade-in keyframe + dialog rules to globals.css (D-16/D-18), stub 9 RED Playwright specs (verbatim copy + atomic swap + single-client-island)
- [x] 05-02-PLAN.md — W1: ship components/contact/ContactModal.tsx (the SOLE 'use client' island per FOUND-07 carve-out — D-01..D-19); wire data/site.ts.email per D-15a; atomically update tests/no-client-components.spec.ts to allow ContactModal
- [x] 05-03-PLAN.md — W2: atomic D-05 commit `48f0a10` (4 files in 1 commit per `git log -n 1 --name-only` binding); Rule 1 fix `e9206a5` for Next.js Link pushState pitfall (delegated anchor click listener — hashchange listener alone insufficient); 12-item Phase Exit Visual Verification + 22 cross-project spec failures across Categories A–D (Plan 01 spec design + Plan 02 implementation gaps) DEFERRED by user to Phase 6 deploy-verify cycle; consolidated SUMMARY closing Phase 5
**UI hint**: yes

### Phase 6: Polish + SEO + Launch
**Goal**: Every quality bar in PROJECT.md is cleared and braehods.com serves the new site. Lighthouse 95+ on every route, WCAG AA verified, OG images render correctly when shared, sitemap + robots + JSON-LD shipped, preview URLs are noindexed, and the old GitHub Pages site is archived/redirected.
**Depends on**: Phases 1-5 (all routes and the contact modal must exist before audit and DNS swap)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-08, SEO-09, A11Y-01, A11Y-04, A11Y-07, PERF-01, PERF-02, PERF-03, PERF-05, LNCH-01, LNCH-02, LNCH-03, LNCH-04, LNCH-05
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile and desktop both score ≥95 across Performance, Accessibility, Best Practices, and SEO on `/`, `/about`, `/work`, and `/work/[slug]` (PERF-01, PERF-02); first-page client JS bundle ≤50KB gzipped excluding the contact island (PERF-03); Vercel Speed Insights + Analytics installed and reporting (PERF-05)
  2. Sharing any URL in Slack / iMessage / LinkedIn / X renders a correct 1200×630 OG image with the page title in site typography on charcoal; default OG renders for `/` (SEO-02, SEO-03); Person JSON-LD validates in Google Rich Results Test with `sameAs` array for GitHub / Instagram / YouTube (SEO-05); per-route `<title>` + meta description + canonical URL set; sitemap and robots generated; branded 404 renders the monogram and a return link (SEO-01, SEO-04, SEO-06, SEO-08); Vercel preview deploys serve `X-Robots-Tag: noindex` (SEO-09)
  3. Keyboard-only walk-through reaches every interactive element in logical tab order; all images have meaningful `alt` (or `alt=""` for decorative); the site is usable at 200% zoom on mobile with no horizontal scroll; 320px viewport renders cleanly with no overflow (A11Y-01, A11Y-04, A11Y-07, LNCH-05)
  4. braehods.com resolves to the new Vercel deployment over HTTPS — DNS swap completed in correct order (Vercel domain added first so SSL stages before CNAME flip); old `~/Projects/braehods` GitHub Pages repo is archived OR serves a 301 redirect to braehods.com (LNCH-01, LNCH-02)
  5. Post-launch checklist passes: real-device tests on iPhone Safari + Android Chrome; contact form delivers a real email end-to-end; GitHub profile / Instagram bio / YouTube About all link to braehods.com (LNCH-03, LNCH-04)
**Plans**: 3 plans, 3 waves
- [~] 06-01-PLAN.md — Deploy + Cat A-D spec/component cleanup + %5Ftokens delete + Analytics verify + Vercel preview deploy + real Formspree on preview + 40-item visual checklist + GH URL/WebAIM contrast (Plan 06-01 exit gate) — **Autonomous portion CLOSED 2026-05-19**: 22 Cat A-D + 3 newly-discovered Cat E/F/G spec-side bugs all CLOSED on preview CDN (117/122 GREEN); `app/%5Ftokens/` deleted; Analytics + SpeedInsights verified mounted; 3 GH URLs verified; 40-item checklist scaffolded; SUMMARY drafted. **3 manual gates pending** (visual sweep + real Formspree email + WebAIM contrast).
- [x] 06-02-PLAN.md — 8 new SEO specs (sitemap/robots/og/jsonld/not-found/proxy/canonical/metadata) + Lighthouse 95+ on 6 audits + PERF-03 bundle via next experimental-analyze + NVDA/VoiceOver iOS walks + 200%/320px verify + Google Rich Results + TTF vendoring + monogram triple-source + CTAArrowLink direction prop + 404 page — **CLOSED 2026-05-26 at implementation + preview-audit level**: all 8 SEO surfaces live; 30/30 SEO specs GREEN ×2 projects; 6/6 Lighthouse GREEN after the desktop-throttling spec fix `9b3b960`; PERF-03 bundle 20.38 KB gz (≤50); FOUND-07 preserved (1 client island); SEO-01..06/08/09 + A11Y-01/04/07 + PERF-01..03 + LNCH-05 flipped Complete on preview. **6 human-verification gates DEFERRED to Plan 06-03 pre-launch pass** (SR walk + 06-01 Gates 1-3 + prod SEO ≥95 + prod homepage-mobile perf ≥95) per user decision, matching the Phase 4/5 deferral precedent.
- [ ] 06-03-PLAN.md — Pre-DNS-flip data/projects.ts href edit (D-16) + Vercel domain add + SSL stage + registrar CNAME flip + braehods.com smoke walk + iOS Safari + Android Chrome real-device + prod Formspree submit + OG validation + gh repo archive bwaeden/braehods + GH/IG/YT bio updates (v1 SHIP gate)
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Design Tokens | 0/1 | Not started | - |
| 2. Home Page | 7/7 | Complete | 2026-05-12 |
| 3. About Page | 0/0 | Not started | - |
| 4. Work + Projects | 2/2 | Complete | 2026-05-14 |
| 5. Contact Modal | 3/3 | Complete (local; deploy verify deferred to Phase 6) | 2026-05-14 |
| 6. Polish + SEO + Launch | 2/3 (06-01 + 06-02 closed at implementation/preview-audit level; human-verification gates batched into 06-03 pre-launch pass) | In Progress | - |

## Cross-Cutting Concerns (How A11Y / PERF / SEO Are Distributed)

A11Y, PERF, and SEO are NOT separate phases. They are baked into the phase that produces the relevant UI, with the final audit + bulk work in Phase 6:

| Concern | Where it lives |
|---------|----------------|
| Reduced motion + focus rings (A11Y-02, A11Y-06) | Phase 1 (foundation contract) |
| Color-not-only-indicator (A11Y-05) | Phase 4 (status badges are the trigger) |
| Modal a11y (A11Y-03) | Phase 5 (built with the modal) |
| Keyboard order, alt text, 200% zoom (A11Y-01, A11Y-04, A11Y-07) | Phase 6 (audit across all built routes) |
| `next/image` width/height + LCP (PERF-04, PERF-06) | Phase 2 (hero is first image; sets pattern) |
| Lighthouse 95+, bundle size, Speed Insights (PERF-01-03, PERF-05) | Phase 6 (verified once all UI exists) |
| Favicon set (SEO-07) | Phase 1 (depends on monogram) |
| All other SEO (metadata, OG, sitemap, JSON-LD, canonical, 404, preview noindex) | Phase 6 (bulk work) |

## Phase Numbering Convention

- **Integer phases (1-6):** Planned milestone work above.
- **Decimal phases (e.g., 2.1):** Reserved for urgent insertions via `/gsd-insert-phase`. Execute between integers.

---
*Roadmap created: 2026-05-07*
*Source requirements: 67 v1 items across FOUND, DSGN, HOME, ABOUT, WORK, CTCT, SEO, A11Y, PERF, LNCH*
*Last updated: 2026-05-11 by plan-phase — Phase 2 finalized (7 plans, 4 waves; 02-NN-PLAN.md files created)*
*Last updated: 2026-05-11 by execute-phase — Plan 02-04 complete (4/7 Phase-2 plans done; W2 layout chrome extension shipped — Footer + Nav rewire + SocialIconLink + components/icons/)*
*Last updated: 2026-05-13 by plan-phase — Phase 4 finalized (1 plan, 4 waves; 04-01-PLAN.md created)*
*Last updated: 2026-05-13 by plan-phase (revision mode) — Phase 4 split into 2 plans per checker scope_sanity feedback (8 tasks across 4 waves exceeded the 5+ task BLOCKER threshold for a single plan); 04-01 covers Waves 0+1 (data + spec stubs + ProjectCard component, 4 tasks), 04-02 covers Waves 2+3 (page rewrite + deploy + verify + summary, 4 tasks); checker warning fixes baked in: D-15 negative-honesty test on in-dev entries, TODO(user) deploy gate, projects.length import for spec count derivation*
*Last updated: 2026-05-14 by execute-phase — Phase 4 closed at implementation level. Plans 04-01 + 04-02 Tasks 0-4 + Task 5 partial (TODO clearance only) + Task 7 (this commit) shipped. Tasks 5 (deploy + Playwright-against-preview + 28-item visual checklist) and 6 (WebAIM contrast measurement) DEFERRED by deliberate user choice to a manual user-driven Phase 6 cycle. Single consolidated SUMMARY at .planning/phases/04-work-projects/04-01-SUMMARY.md covers BOTH plans (no separate 04-02-SUMMARY.md). 5 atomic task commits + 1 final docs commit; 4 newly-GREEN Phase 4 specs; 0 new dependencies; 0 regressions caused by Phase 4 (7 pre-existing /-route spec failures isolated to Phase 6 deploy concern, confirmed via stash-and-rerun).*
*Last updated: 2026-05-26 by execute-phase — Phase 6 Plan 06-02 closed at implementation + preview-audit level. 8 SEO surfaces shipped + verified GREEN on preview (30/30 SEO specs, 6/6 Lighthouse after desktop-throttling spec fix `9b3b960`); PERF-03 bundle 20.38 KB gz; FOUND-07 preserved. SEO-01..06/08/09 + A11Y-01/04/07 + PERF-01..03 + LNCH-05 flipped Complete. 6 human-verification gates (SR walk, 06-01 Gates 1-3, prod SEO ≥95, prod homepage-mobile perf ≥95) DEFERRED to Plan 06-03 pre-launch verification pass per user decision (Phase 4/5 precedent). Progress Table Phase 6 row → 2/3.*
