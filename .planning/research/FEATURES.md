# Feature Research

**Domain:** Personal portfolio / brand site (multi-audience credibility-first, expandable)
**Researched:** 2026-05-07
**Confidence:** HIGH (recommendations cross-verified against current Next.js 16 / App Router docs, Vercel platform docs, MDN, Formspree docs, and reference sites rauno.me + brittanychiang.com)

---

## Feature Landscape

### Table Stakes (The Site Doesn't Clear the Bar Without These)

These are non-negotiable. Their absence on a personal site in 2026 reads as "incomplete" or "amateur" — they earn no credit when present, but inflict damage when missing.

| Feature | Why Expected | Complexity | v1? | Notes |
|---------|--------------|------------|-----|-------|
| Responsive layout (320px → 4K) | A site that breaks on phones in 2026 destroys credibility instantly. Recruiters and IG visitors land on mobile first. | LOW | v1 | Tailwind responsive utilities; design mobile-first. |
| WCAG AA color contrast | Charcoal gradient + soft electric blue must clear AA. Body text on darkest background must be ≥ 4.5:1. | LOW | v1 | Verify with axe DevTools. PROJECT.md already commits to AA. |
| Keyboard navigation + visible focus rings | Every link, button, form field, and modal trigger reachable by Tab. Focus ring must be visible against the dark background. | LOW | v1 | Custom focus ring (electric blue) instead of browser default; dialog focus trap. |
| `prefers-reduced-motion` respect | All staggered fades, hover lifts, transitions wrap in `@media (prefers-reduced-motion: no-preference)`. PROJECT.md commits to this. | LOW | v1 | Single Tailwind variant or CSS layer; cheap to add, expensive to retrofit. |
| Dark mode (default, no toggle) | PROJECT.md decision: one mood executed precisely. Don't ship a half-baked light mode. | LOW | v1 | `color-scheme: dark` in CSS; no theme provider needed. |
| Custom favicon set | Apple touch icon, 32×32, 16×16, SVG, manifest. Browser tab without favicon looks broken. | LOW | v1 | Use the "B" monogram. Next.js App Router: drop `icon.svg`, `apple-icon.png` in `app/`. |
| 404 page (branded) | Default Next.js 404 looks like a deploy error. A branded 404 reinforces the brand on the most accidental visit. | LOW | v1 | `app/not-found.tsx` with monogram + return link. Editorial-dark, copy in Braeden's voice. |
| OG / Twitter meta tags (every page) | Link unfurls on iMessage, Slack, Twitter, LinkedIn, Discord. Missing OG = a blank rectangle when shared. | LOW | v1 | Next.js `generateMetadata` per route; static OG image acceptable for v1. |
| `sitemap.xml` + `robots.txt` | Search engines need them to crawl efficiently. Trivial in Next.js App Router via `app/sitemap.ts` + `app/robots.ts`. | LOW | v1 | Auto-generates; keep it dynamic so future /writing routes get added free. |
| `<title>` + meta description per route | Google search snippet looks broken without them. Affects CTR even when site ranks. | LOW | v1 | Next.js `generateMetadata` per page. |
| Person schema (JSON-LD) | Triggers Google's Knowledge Panel rich result for Braeden's name. 20-30% CTR boost on branded queries. | LOW | v1 | Single `<script type="application/ld+json">` in root layout. Include `sameAs` array (GitHub, IG, YT). |
| Working contact form (Formspree) | The site's #2 job is conversion. Form must submit, validate, and confirm. PROJECT.md: preserve `xqeypnkw`. | LOW | v1 | Honeypot field (`_gotcha` or custom) for spam. Client validation + success state. |
| Contact success/error states | A form that "submits" with no feedback feels broken. Loading spinner → success message → reset. | LOW | v1 | Three states: idle, submitting, success/error. Accessible aria-live region for screen readers. |
| External links to socials (GitHub, IG, YT, LinkedIn?) | Recruiters and visitors verify identity by cross-checking other surfaces. Link OUT, don't try to substitute. | LOW | v1 | `rel="noopener noreferrer"` on all external links; `target="_blank"` for socials. |
| Lighthouse 95+ mobile + desktop | PROJECT.md commits to this. Slow personal sites get bounced before content loads — 2026 visitors have zero patience. | MEDIUM | v1 | Static export, image optimization, near-zero JS, font subsetting. |
| Hero with name + photo + one-line positioning | The "who is this person in 1.5 seconds" answer. Multi-audience problem demands it. PROJECT.md hero spec. | LOW | v1 | Largest contentful paint should be the hero — avoid hero animations that delay LCP. |
| About section (short bio + photo + story) | Recruiters and investors want context fast. PROJECT.md requires this. | LOW | v1 | Sub-page (`/about`) per the hybrid IA decision. Photo can be the hero photo reused tastefully. |
| Projects grid (equal weight, all 7) | Core "I do many things well" message. PROJECT.md requires equal-weight grid for CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client, archived braehods. | MEDIUM | v1 | Card per project: title, one-line, tags, primary link out. No case-study pages in v1. |
| Channel links block (YT + IG, styled) | PROJECT.md requires this. Buttons or block linking out — no embeds. Channel B and Channel A are part of the brand surface. | LOW | v1 | Two distinct channel buttons; thumbnail/icon + handle + subscribe-style CTA. |
| HTTPS + custom domain (braehods.com) | A personal site on a `.vercel.app` URL signals "demo not real." Domain already owned. | LOW | v1 | Vercel domain transfer or DNS swap. CNAME from current GitHub Pages setup. |
| Canonical URLs | Prevents duplicate-content SEO issues if site is ever proxied or accessed via alt domain. | LOW | v1 | `alternates.canonical` in `generateMetadata`. |

---

### Differentiators (Competitive Edge for THIS Site)

These are where the site competes and earns the "interesting person, let me reach out" reaction. Not required for the bar, but each one is a beat above generic dev portfolios.

| Feature | Value Proposition | Complexity | v1? | Notes |
|---------|-------------------|------------|-----|-------|
| Custom "B" monogram system | A recurring visual mark across favicon, hero, footer, transitions creates instant brand recognition without leaning on motion or templates. PROJECT.md hero requirement. | MEDIUM | v1 | Design phase outputs SVG; component-ize so it's reused everywhere. The "memorable anchor" Brittany Chiang has with her "B" or Rauno has with his dock. |
| "Currently" / status block on home | Multi-audience killer — recruiter sees "active builder," investor sees momentum, fan sees relevance. PROJECT.md hero requirement. | LOW | v1 | Recommended pattern: typed `data/currently.ts` const exporting `{ statement, updatedAt, link? }`. Edit via PR. Avoid full /now page for v1 (PROJECT.md defers it). |
| Editorial display serif + sans pairing | Almost zero dev portfolios use serif headlines. Instant signal of taste over template. PROJECT.md commits to this. | LOW | v1 | Pair: e.g., Fraunces / GT Sectra / Tiempos Headline (display) + Inter / Geist (body). Self-host via `next/font` to avoid CLS. |
| Soft electric blue accent (~#7c87ff) | A single accent color used sparingly (CTA, hover, focus, link underline) feels designed instead of decorated. PROJECT.md commits to this. | LOW | v1 | Single CSS variable; do NOT introduce a second accent. |
| Charcoal gradient + grain overlay | The grain overlay is the difference between "dark mode" and "editorial dark." Costs <2KB. PROJECT.md commits to this. | LOW | v1 | SVG noise filter or tiny PNG repeat; `mix-blend-mode: overlay` at low opacity. |
| Restrained craft motion (staggered fades, hover lifts) | The rauno.me / Devouring Details school: tiny, intentional motion, not parallax or scroll-jacking. Signals craft. PROJECT.md commits to this. | MEDIUM | v1 | Framer Motion or pure CSS; stagger via `animation-delay`. Wrap all in `prefers-reduced-motion`. |
| Dynamic OG images via `@vercel/og` | When projects/about get shared on Twitter/LinkedIn, the OG image renders the page title in Braeden's typography on the editorial-dark background. Distinctive. | MEDIUM | v1 | `app/api/og/route.tsx` using `ImageResponse`. 1200×630, flexbox-only, <500KB bundle. Static fallback for `/`. Massive ROI for low cost. |
| Privacy-friendly analytics (Vercel Analytics) | Zero-friction since site is on Vercel. No cookie banner. Gives Braeden visibility into who's coming from where (IG bio link vs recruiter search) so the site can iterate. | LOW | v1 | `@vercel/analytics` package; one `<Analytics />` in root layout. Free tier sufficient. |
| Vercel Speed Insights (Web Vitals) | Real-user Core Web Vitals data — Lighthouse only measures synthetic. Helps maintain the 95+ commitment over time. | LOW | v1 | `@vercel/speed-insights`; same one-line install. |
| Hybrid IA (curated home + sub-pages) | Home tells the story in one scroll; `/about` and `/work` give depth. Avoids the "endless scroll one-pager" trap and the "empty multi-page site" trap. PROJECT.md commits to this. | LOW | v1 | App Router: `app/page.tsx`, `app/about/page.tsx`, `app/work/page.tsx`. |
| Project tag taxonomy (trading, content, tools, archived) | Lets the equal-weight grid still communicate breadth without flagship hierarchy. A visitor scanning for "show me trading work" can spot CapitolLens. | LOW | v1 | Typed tag union in `data/projects.ts`; rendered as small caps or pill labels under each card. |
| Project status badges (paper-trading, shipped, archived, in-dev) | Adds credibility ("CapitolLens — paper-trading, +18%/yr Sharpe 0.93 in backtest" reads more credible than just a name) and signals which projects are alive. | LOW | v1 | Lives in `data/projects.ts`; badge component renders a colored dot + label. |
| Explicit "DM me" CTA on channels block | Aligns with feedback_reel_cta_dm_format.md (#1 IG signal is DMs). Site can reinforce the same conversion behavior. | LOW | v1 | Each channel button shows handle + "DM me" or "Subscribe" depending on channel. |
| `ViewTransitions` API on route nav | Smooth cross-page transitions (e.g., `/` → `/work`) without a full white flash. Browser-native, ~5 lines of CSS. Genuine craft signal. | LOW | v1 | `<ViewTransitions />` in root layout; `view-transition-name` on hero/photo for shared-element nav. Progressive enhancement — degrades gracefully. |
| Contact modal (not page) for v1 | Preserves the existing braehods.com pattern, keeps conversion in-context, and makes the homepage feel like the destination. | LOW | v1 | Radix Dialog or HeadlessUI Dialog (a11y handled); ESC closes, focus trap, scroll lock. Honeypot inside modal. |
| Smart `mailto:` fallback in modal footer | If form fails (Formspree down, JS off), a "Or just email me directly →" link below the form ensures conversion never fully blocks. | LOW | v1 | `mailto:` with subject pre-filled. Costs nothing, saves contact attempts. |
| Architectural readiness for `/writing` | Folder structure, MDX pipeline, sitemap generator, RSS scaffolding present but unrouted. PROJECT.md decision: defer the page, not the foundation. | MEDIUM | v1 | Install `@next/mdx` + `gray-matter`; create `content/writing/` empty; sitemap generator iterates the folder. /writing route file not created until v2. |
| Shared-element transition: hero photo → /about photo | The same photo in different sizes/positions across pages, animated via `view-transition-name`. Single highest-craft moment in the build. | MEDIUM | v2 | Defer to v1.x once layout is stable. Adds to "interesting" without risking launch timeline. |

---

### Anti-Features (Deliberately NOT Built — Backs PROJECT.md Out of Scope)

These would be requested or reflexively added but actively harm the site's goals. Documenting them here prevents scope creep.

| Anti-Feature | Why Requested / Tempting | Why Problematic for THIS Site | Alternative |
|--------------|--------------------------|-------------------------------|-------------|
| YouTube / IG video embeds | Obvious "show the content" instinct; feels like proof of work. | Iframes break the editorial mood, add 100s of KB of third-party JS, kill Lighthouse score, and force YT/IG branding inside a charcoal site. PROJECT.md explicit. | Channel-link buttons that open in a new tab. Optionally a single curated YT thumbnail (static image) with a play overlay that links out. |
| Light-mode toggle | "Accessibility" reflex; some visitors prefer light. | One mood executed precisely beats two executed loosely. Doubles design surface, doubles QA, dilutes the editorial dark identity. PROJECT.md explicit. | Ship dark only. Note in code comment that light mode was intentionally deferred. |
| `/now` page (Derek Sivers style) | Trendy convention; nownownow.com community membership. | A `/now` page launched empty or stale is worse than no `/now` page. PROJECT.md: "Currently" line on home covers it for v1. | Single "Currently" status block on home, updated via typed data file. Re-evaluate at v2. |
| `/writing` or blog page | Standard portfolio expectation; recruiters look for it. | Zero existing essay backlog. An empty `/writing` page reads "this person doesn't actually write." PROJECT.md explicit. | Architect the foundation (MDX pipeline, content folder, sitemap-ready) but don't render a route. Add when ≥3 essays exist. |
| Newsletter signup / RSS | "Build an audience" reflex. | Audience is on IG/YT, not email. A newsletter signup with no newsletter is worse than none. Adds Substack/ConvertKit dependency. PROJECT.md defers. | Defer entirely. RSS becomes free when /writing ships. |
| CMS / admin UI (Sanity, Contentlayer, etc.) | "What if you want to update without redeploying?" | Site updates are <1× per month. PR-driven MDX/JSON is faster than building, learning, and maintaining a CMS for one user. PROJECT.md explicit. | Typed JSON / MDX in repo, edited via PR. |
| Comments on projects | Engagement signal; "let people react." | Spam target, moderation burden, no audience density to make it feel populated. Empty comment sections look dead. | Channel links — engagement happens where the audience already is (IG DMs, YT comments). |
| Like / clap / view counts on projects | Social proof reflex. | Without traffic, low counts are anti-signal. With traffic, optimization-pressure on the wrong metric. | Project status badges (shipped, in-dev, paper-trading) communicate momentum without vanity counters. |
| Two-channel split as separate UI surfaces | Strategically tempting since Channel A vs Channel B are deliberately different. PROJECT.md noted as out of scope. | Splits the channel block visually for a distinction visitors don't care about. Strategic split is content-side, not site-side. | Single "Channels" block with both linked. Internal naming can differ. |
| WebGL / Three.js / particle field hero | "Look, I can do graphics." Reference: most generic dev portfolios in 2024–2025. | PROJECT.md explicit anti-pattern. Murders LCP, doesn't survive `prefers-reduced-motion`, signals "template" not "craft." | Restrained motion: staggered fades, hover lifts, view transitions. |
| Scroll-jacking / parallax / smooth-scroll override | "Cinematic feel" instinct. PROJECT.md explicit anti-pattern. | Breaks browser scroll, hostile to keyboard/screen reader users, infantilizes the visitor. | Trust browser scroll. Add ScrollSnap only if it serves a specific section. |
| Glassmorphism / purple-blue gradient hero | 2023–2025 design template trope. PROJECT.md explicit anti-pattern. | Reads "I used a Figma kit." Doesn't match editorial-dark identity. | Charcoal gradient (~#1a1a1f → #0a0a0a) + grain overlay + soft electric blue accent. |
| Tech-stack sticker wall | "Show competence." PROJECT.md explicit anti-pattern. | Reads as junior. Senior-coded portfolios show projects, not logos. | Tag projects with the tech they use; let the breadth across projects communicate the stack. |
| reCAPTCHA / hCaptcha on contact | Default anti-spam reflex. | User-hostile (puzzle solving), Google tracking pixel, breaks the editorial mood. | Honeypot field (Formspree's `_gotcha` or custom) — invisible, zero friction, catches >95% of bots. |
| Multi-language (i18n) | "Reach global audiences." PROJECT.md explicit. | Audience is US-based; no translated content backlog. Adds routing complexity. | English only. Re-evaluate if traffic shows non-English audience. |
| New portrait shoot blocking launch | "The photo has to be perfect." | Site can ship with placeholder or current photo treated tastefully (per PROJECT.md). New shoot is out-of-band. | Photo is swappable; ship the site, swap the file later. |
| "Hire me" / "Available for work" banner | Common portfolio convention. | Wrong audience model — Braeden is a student/founder, not a freelancer. Banner narrows perception ("contractor") when site needs to read broad ("interesting person"). | Generic "Get in touch" CTA. The "Currently" line carries availability signal indirectly. |
| Generic "Passionate developer who loves to build" copy | Default portfolio voice. PROJECT.md explicit anti-pattern. | Identical to 100,000 dev portfolios. Reads AI-generated. | Specific, voiced copy. The PROJECT.md positioning ("Business student and entrepreneur in LA, building things and running a small content brand") IS the model. |
| Live YouTube last-video thumbnail fetch (v1) | "Make the channels block dynamic." | YouTube Data API requires a key, has quotas, adds a build-time or runtime fetch, fails silently when quota exceeded. The thumbnail rarely changes. | v1: Static channel button with handle + subscribe icon. v2: Build-time fetch via ISR if it adds value (probably won't). |
| Project case study pages (/work/[slug]) | Standard portfolio depth. | PROJECT.md decision: equal-weight grid, no flagship. Case study pages would invert the "I do many things well" message into "let me explain CapitolLens at length." | Each project card links OUT to its repo / site / video. Revisit v2 if a single project graduates to flagship status. |
| Service worker / PWA install | "Modern web" reflex. | Personal site doesn't benefit from offline. Service worker caching causes deploy-staleness issues. | Skip. Vercel CDN handles fast loads. |
| Cookie consent banner | Default "compliance" reflex. | Vercel Analytics is cookieless. No cookies = no banner needed. Banners damage editorial mood and slow first interaction. | Use cookieless analytics (Vercel / Plausible / Umami). |

---

## Feature Dependencies

```
[Custom B monogram (design)]
    └──blocks──> [Favicon set]
    └──blocks──> [Hero brand mark]
    └──blocks──> [Footer mark]
    └──blocks──> [404 page mark]
    └──blocks──> [Dynamic OG image template]

[Editorial type pairing decision]
    └──blocks──> [Hero typography]
    └──blocks──> [Dynamic OG image template]
    └──blocks──> [Self-host fonts via next/font]

[MDX + content-folder scaffold]
    └──enables──> [Future /writing route (v2)]
    └──enables──> [Sitemap auto-includes new content]
    └──enables──> [RSS feed (v2)]

[Hybrid IA decision (home + /about + /work)]
    └──blocks──> [Sitemap.xml entries]
    └──blocks──> [Per-route generateMetadata]
    └──blocks──> [Per-route OG images]

[Typed data files (data/projects.ts, data/currently.ts)]
    └──enables──> [Projects grid render]
    └──enables──> [Currently block render]
    └──enables──> [Project status badges]
    └──enables──> [Project tag taxonomy]

[Formspree (xqeypnkw) integration]
    └──requires──> [Honeypot field]
    └──requires──> [Form validation (client + a11y)]
    └──requires──> [Success/error states]
    └──requires──> [mailto: fallback link]

[Contact modal pattern]
    └──requires──> [Accessible Dialog primitive (Radix/HeadlessUI)]
    └──requires──> [Focus trap + ESC close + scroll lock]

[ViewTransitions API]
    └──enhances──> [Hybrid IA navigation]
    └──enables──> [Shared-element hero photo → about photo (v2)]

[Person schema JSON-LD]
    └──requires──> [Final list of social URLs (sameAs)]
    └──requires──> [Final positioning copy (description)]

[Vercel deployment]
    └──enables──> [Vercel Analytics]
    └──enables──> [Vercel Speed Insights]
    └──enables──> [@vercel/og dynamic image route]
    └──enables──> [Edge caching of OG images]
```

### Dependency Notes

- **B monogram blocks five surfaces.** Design phase must produce the mark before favicon, hero, footer, 404, and dynamic OG template can be finalized. Without it, those surfaces use a placeholder and need a later swap pass. Make monogram delivery the first design milestone.

- **Editorial type pairing must be decided before the OG template is built.** The OG image renders text in the site's typography — if fonts change, every cached OG image is stale until cache busts. Lock fonts before shipping `/api/og`.

- **Typed data files (`data/projects.ts`, `data/currently.ts`) are the central content layer.** Five visible features depend on them. Defining the schemas early (TypeScript types) lets the design and copy work happen in parallel.

- **MDX scaffolding for /writing should ship with v1 even though the route doesn't.** The cost is ~2 hours of setup; the cost of retrofitting MDX into a working site later is 10×. The dependency is one-directional — present scaffolding doesn't break v1, missing scaffolding blocks v2.

- **Vercel deployment unlocks four differentiators for free.** Migrating off Vercel later (e.g., to Cloudflare) means rebuilding analytics, speed insights, OG image edge runtime, and cache behavior. PROJECT.md already commits to Vercel.

- **Formspree contact form has cascading requirements.** A "working contact form" is not one task — it's a form + honeypot + validation + a11y + states + fallback. Estimate accordingly.

- **Person schema requires content decisions, not just code.** The `sameAs` array, jobTitle, and description must be finalized — copy work is on the critical path for SEO completeness.

---

## MVP Definition

### Launch With (v1) — The braehods.com Replacement

The minimum bundle that lets Braeden swap DNS away from the current Geist-font site without regression and clear the "nice site / want to follow up" bar.

**Foundation (table stakes — non-negotiable):**
- [ ] Responsive layout 320px → 4K
- [ ] WCAG AA contrast verified
- [ ] Keyboard nav + visible focus rings
- [ ] `prefers-reduced-motion` respected
- [ ] Dark mode (default, no toggle)
- [ ] Custom favicon set (using B monogram)
- [ ] Branded 404 page
- [ ] Per-route OG meta + Twitter cards
- [ ] `sitemap.xml` + `robots.txt` (auto-generated)
- [ ] Per-route `<title>` + meta description
- [ ] Person schema JSON-LD (root layout)
- [ ] Working Formspree contact (with honeypot + validation + states + mailto fallback)
- [ ] External social links with safe `rel` attributes
- [ ] Lighthouse 95+ on mobile + desktop
- [ ] HTTPS on braehods.com via Vercel

**Hero + content:**
- [ ] Hero: photo + name + one-line positioning + "Currently" status block
- [ ] About sub-page: bio + photo + story
- [ ] Work sub-page: equal-weight projects grid (7 projects with tags + status badges)
- [ ] Channels block: YT + IG distinct buttons (no embeds)
- [ ] Contact modal (Radix/HeadlessUI Dialog with Formspree)

**Differentiation (the "interesting" layer):**
- [ ] B monogram across favicon / hero / footer / 404
- [ ] "Currently" data file (`data/currently.ts`)
- [ ] Editorial display serif + clean sans pairing (self-hosted)
- [ ] Soft electric blue accent (~#7c87ff)
- [ ] Charcoal gradient + grain overlay
- [ ] Restrained craft motion (staggered fades, hover lifts)
- [ ] Dynamic OG images via `@vercel/og`
- [ ] Vercel Analytics + Speed Insights
- [ ] Hybrid IA (`/`, `/about`, `/work`)
- [ ] Project status badges + tag taxonomy
- [ ] ViewTransitions on route navigation
- [ ] MDX scaffolding present (no `/writing` route rendered)

### Add After Validation (v1.x — Within 30 Days of Launch)

Features to add once the launch is stable and Braeden has analytics data on what's actually viewed.

- [ ] Shared-element transition: hero photo ↔ /about photo (`view-transition-name`) — adds craft moment after layout proves stable
- [ ] Iterate "Currently" cadence — set a calendar reminder if updates lapse >30 days
- [ ] OG image template refinement based on which pages get shared most
- [ ] Add LinkedIn link if sameAs cross-verification proves valuable for SEO
- [ ] Add a single curated YT thumbnail (static, links out) IF analytics shows YT-bound CTAs are high-intent

### Future Consideration (v2+ — When Triggered)

- [ ] `/writing` route — TRIGGER: ≥3 essays drafted; site has been live ≥60 days
- [ ] RSS feed — TRIGGER: /writing exists
- [ ] Per-project case study pages — TRIGGER: a single project becomes flagship-worthy (e.g., CapitolLens goes live, has results to discuss)
- [ ] `/now` page (full Derek Sivers style) — TRIGGER: "Currently" line consistently outgrows one sentence
- [ ] Live YouTube last-video fetch (ISR build-time) — TRIGGER: channel ships >2 videos/week and freshness becomes a feature
- [ ] Newsletter signup — TRIGGER: an actual newsletter exists
- [ ] Light-mode toggle — TRIGGER: never (PROJECT.md commitment to single mood)
- [ ] CMS (Sanity / Contentlayer) — TRIGGER: ≥3 non-technical contributors editing content
- [ ] Multi-language — TRIGGER: ≥20% non-English traffic for ≥3 months

---

## Feature Prioritization Matrix

For each v1 feature: User Value (does it move the "interesting/contact me" needle?) × Implementation Cost (relative to a 1-2 week build).

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Responsive layout | HIGH | LOW | P1 |
| WCAG AA + keyboard + focus rings | HIGH | LOW | P1 |
| `prefers-reduced-motion` | MEDIUM | LOW | P1 |
| Dark mode (default, no toggle) | HIGH | LOW | P1 |
| Favicon set (B monogram) | MEDIUM | LOW | P1 |
| 404 page (branded) | LOW | LOW | P1 |
| OG meta tags per route | HIGH | LOW | P1 |
| `sitemap.xml` + `robots.txt` | MEDIUM | LOW | P1 |
| Person schema JSON-LD | MEDIUM | LOW | P1 |
| Hero (photo + name + positioning + Currently) | HIGH | MEDIUM | P1 |
| About sub-page | HIGH | LOW | P1 |
| Work sub-page (projects grid) | HIGH | MEDIUM | P1 |
| Channels block | MEDIUM | LOW | P1 |
| Contact modal + Formspree + honeypot + states | HIGH | MEDIUM | P1 |
| Lighthouse 95+ | HIGH | MEDIUM | P1 |
| B monogram (across surfaces) | HIGH | MEDIUM | P1 |
| "Currently" data file | HIGH | LOW | P1 |
| Editorial type pairing | HIGH | LOW | P1 |
| Charcoal gradient + grain + accent | HIGH | LOW | P1 |
| Restrained motion (fades, hover lifts) | MEDIUM | LOW | P1 |
| Hybrid IA (3 routes) | HIGH | LOW | P1 |
| Dynamic OG images via @vercel/og | HIGH | MEDIUM | P1 |
| Vercel Analytics + Speed Insights | MEDIUM | LOW | P1 |
| Project status badges + tags | MEDIUM | LOW | P1 |
| ViewTransitions (basic) | MEDIUM | LOW | P1 |
| MDX scaffolding (no route) | MEDIUM | MEDIUM | P2 |
| Shared-element photo transition | MEDIUM | MEDIUM | P2 |
| `/writing` route | HIGH (when content exists) | MEDIUM | P3 |
| RSS feed | LOW (no audience yet) | LOW | P3 |
| Per-project case study pages | LOW (anti to current strategy) | HIGH | P3 |

**Priority key:**
- **P1:** Must ship in v1 to clear the bar
- **P2:** Should ship in v1 if scope allows; otherwise v1.x
- **P3:** Defer until trigger condition met

---

## Competitor Feature Analysis

| Feature | brittanychiang.com (v4) | rauno.me | Recommended for braehods.com |
|---------|--------------------------|----------|------------------------------|
| Aesthetic | Dark navy + cyan-green accent, dense typographic | Charcoal-black, OS-metaphor dock, side-scrolling feed | Editorial-dark + electric blue accent + B monogram (between the two) |
| Hero pattern | Name + role + one-line + intro paragraph | Atmospheric image background, sparse text | Photo + name + one-line + Currently (closer to Brittany, but adds Currently) |
| Projects display | Featured projects (cards with tech tags) + "Other Noteworthy" list | Project list with custom hover detail | Equal-weight grid (no flagship/secondary split — PROJECT.md choice) |
| Case study pages | Yes for featured | Yes for some craft pieces | NO for v1 — link out only |
| /writing or blog | No (resume + projects only) | "Craft" section (essays) | NO route v1, scaffolded for v2 |
| Motion approach | Subtle hover + carousel work history | High-craft micro-interactions, dock animation, sound | Restrained craft motion (rauno-school but quieter) |
| Contact | Email button → mailto | Email link in footer | Modal with Formspree + mailto fallback |
| Status / "Currently" | "Currently working at Klaviyo" embedded in intro | Bio mentions Vercel | Dedicated "Currently" data block, more prominent |
| Channel / content links | None (not a content creator) | None (not a content creator) | NEW SURFACE — distinct channels block (Braeden's differentiator) |
| Custom mark / monogram | Logo "B." in nav + favicon | Custom favicon + dock icon | "B" monogram across favicon / hero / footer / 404 |
| Tech | Gatsby + Netlify | Custom (likely Next.js + Vercel) | Next.js App Router + MDX + Vercel |
| OG images | Static | Static | DYNAMIC via @vercel/og — differentiator over both |
| Analytics | Unknown | Unknown | Vercel Analytics (cookieless) |

**Key insight from competitor analysis:** Both reference sites are senior IC engineers at design-led companies. Their content pattern is "deep on craft, deep on a single role." Braeden's pattern is broader: builder + content creator + student + founder — which means the differentiator is the channels block (neither competitor has anything like it) and the Currently block (more prominent than Brittany's embedded mention). The B monogram and dynamic OG images are the craft signals that match the reference standard.

---

## Implementation Notes (For Requirements Phase)

### "Currently" Status Block — Recommended Pattern

Three options were considered:

1. **Manual MDX update** (edit `app/page.tsx` or a `currently.mdx`) — simplest but mixes content with code; harder to script later.
2. **Full /now page** (Sivers convention) — PROJECT.md explicitly defers; would launch sparse.
3. **Typed data file** (`data/currently.ts` exporting `{ statement: string; updatedAt: string; link?: string }`) — RECOMMENDED.

The typed data file approach: (a) decouples content from layout, (b) is editable in a single line via PR, (c) provides the `updatedAt` field for a subtle "updated 12 days ago" if desired, (d) graduates cleanly to a full `/now` page later (the data file becomes the page's source).

### Contact Form — Anti-Spam Layering

PROJECT.md commits to Formspree (`xqeypnkw`). Recommended layered defense (no reCAPTCHA):

1. **Hidden honeypot** field with a non-obvious name (e.g., `website_url` or a random word — NOT `_gotcha`, since spammers know it). Hide via `position: absolute; left: -9999px;` AND `tabindex="-1"` AND `aria-hidden="true"` (so screen readers don't read it).
2. **Submit-time check** — if the honeypot is filled, silently `return` success without posting (so bots don't learn).
3. **Minimum-time-to-submit check** — record `Date.now()` on form mount; reject submissions <2 seconds after mount (humans take longer).
4. **Formspree's built-in spam filter** does the rest server-side.

This stack catches >99% of bots with zero user friction.

### Dynamic OG Images — Constraints to Design Around

`@vercel/og` (built on Satori + Resvg) has hard limits:

- **CSS:** Only flexbox, no grid; subset of CSS properties only.
- **Bundle:** ≤500KB per route (JSX + CSS + fonts + images).
- **Fonts:** Must be loaded as ArrayBuffer; subset to only needed glyphs to fit budget.
- **Images:** External images must be accessible from edge runtime.

Practical implication: design the OG template as a flat flexbox layout with the B monogram, page title, subtitle, and Braeden's name in the editorial typography. Subset the display serif to ASCII + common punctuation.

### Person Schema — Required Fields

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Braeden [Last]",
  "url": "https://braehods.com",
  "image": "https://braehods.com/og/portrait.jpg",
  "description": "Business student and entrepreneur in LA, building things and running a small content brand",
  "jobTitle": "Builder",
  "sameAs": [
    "https://github.com/[handle]",
    "https://instagram.com/[handle]",
    "https://youtube.com/@[handle]"
  ]
}
```

The `sameAs` array is critical — it's how Google links the site to other identities and triggers the Knowledge Panel.

---

## Sources

**Reference sites:**
- [brittanychiang.com (v4)](https://brittanychiang.com/) — equal-weight projects, dark editorial, custom mark
- [rauno.me](https://rauno.me/) — craft motion, OS-metaphor, Devouring Details school
- [Devouring Details](https://devouringdetails.com/) — Rauno's interaction-design essays
- [404s.design](https://www.404s.design/) — curated 404 gallery for editorial inspiration
- [nownownow.com](https://nownownow.com/) — Now-page convention reference

**Tooling and convention:**
- [Next.js metadata + OG images docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js sitemap.ts + robots.ts file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld)
- [Vercel OG Image Generation](https://vercel.com/docs/og-image-generation)
- [Formspree honeypot docs](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering)
- [Derek Sivers — How and why to make a /now page](https://sive.rs/now2)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Privacy-first analytics comparison (2026)](https://mitzu.io/post/best-privacy-compliant-analytics-tools-for-2026/)
- [Next.js SEO complete guide 2026](https://adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero)
- [WebAIM: 2026 accessibility predictions](https://webaim.org/blog/2026-predictions/)

---

*Feature research for: Personal portfolio / brand site (multi-audience credibility-first, expandable)*
*Researched: 2026-05-07*
