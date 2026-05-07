# Pitfalls Research

**Domain:** Editorial-dark personal portfolio (Next.js App Router + MDX, deployed Vercel, replacing live braehods.com)
**Researched:** 2026-05-07
**Confidence:** HIGH (Next.js + Vercel + Formspree behaviors verified against official docs and current community practice; visual/credibility pitfalls reflect well-documented portfolio failure modes)

The site has two jobs in order of priority: (1) "that's a nice website," (2) "I want to follow up with him." Almost every pitfall below maps back to one of those two failing in front of a recruiter, investor, or stranger from IG/YT. Multi-audience credibility is fragile — a single broken thing on mobile (where most clicks land) ends the visit before the second impression forms.

---

## Critical Pitfalls

### Pitfall 1: Charcoal-on-charcoal text fails AA

**What goes wrong:**
Body text and especially "muted" text (timestamps, metadata, "Currently" line, project descriptions) is set in a mid-grey on the `#1a1a1f → #0a0a0a` gradient and quietly fails the 4.5:1 contrast minimum, especially in the darker bottom region. Looks "tasteful" in Figma; fails axe; recruiters on dim laptop screens can't read it.

**Why it happens:**
Designers chase the "muted, editorial" feel and pick `#666` or `#777` body greys that look right on a single solid background. Gradient backgrounds break that — a colour that passes against `#1a1a1f` (top) can fail against `#0a0a0a` (bottom). WCAG also doesn't excuse a dark theme as "optional" — every page state has to clear AA on its own.

**How to avoid:**
- Lock body text minimum at `#e2e2e2` or lighter (~15:1 against `#0a0a0a`, comfortably AA on the lightest gradient stop too).
- Lock muted text minimum at `#a8a8a8` (≥7:1 against `#0a0a0a`, ≥6:1 against `#1a1a1f`) — never softer.
- Test every text colour against BOTH ends of the gradient using WebAIM contrast checker, not just the average.
- Ban pure `#fff` on pure `#000` — high contrast causes halation against serif strokes; aim for soft-white on near-black.
- Run axe DevTools on each page in dev; treat any contrast warning as a build blocker.

**Warning signs:**
- "Looks great" on the designer's calibrated monitor but unreadable on a coworker's cheap laptop.
- Lighthouse Accessibility score drops below 95.
- Squinting on the "Currently" line.

**Phase to address:** Design Tokens (set the floor before any UI is built); re-verify in Polish/SEO.

---

### Pitfall 2: Grain texture overlay tanks performance and accessibility

**What goes wrong:**
A full-viewport grain overlay is implemented as a 2MB PNG `background-image` repeating across the body, or as an animated `<feTurbulence>` SVG running at 60fps, or layered with a heavy `mix-blend-mode` that forces the GPU to composite the entire viewport every scroll frame. Lighthouse mobile drops below 90, scrolling stutters on iPhone 12, and the noise reduces effective contrast on text by 1–2 stops, breaking AA.

**Why it happens:**
Tutorials reach for `<feTurbulence>` and `mix-blend-mode: overlay` because they look great in a CodePen. People copy them onto a full-page overlay without measuring paint cost. PNG noise textures get exported at 2x for retina without compression.

**How to avoid:**
- Use a single inlined SVG with `<feTurbulence>` rendered ONCE to a static `data:` URI or small (≤30KB) PNG; do not animate the noise.
- Apply at low opacity (0.03–0.06) with `pointer-events: none; position: fixed; inset: 0; z-index: 0;` and a fixed (not scrolling) layer to avoid repaint per scroll.
- Avoid `mix-blend-mode` on a top-level overlay — use a flat `opacity` value instead; Chrome and Safari composite blend modes differently and force fullscreen repaints.
- After applying grain, re-run contrast checks on text sitting under it (grain effectively darkens light pixels).
- Set `will-change: auto` (NOT `transform`) on the noise layer — promoting it to a layer wastes GPU memory.

**Warning signs:**
- Scroll feels "sticky" on mobile.
- Lighthouse Performance under 95 on mobile with no other obvious culprit.
- Total Blocking Time spike in DevTools when scrolling.
- Body text contrast that passed in design now fails with grain on top.

**Phase to address:** Design Tokens (define noise layer contract); Polish/SEO (verify perf and contrast).

---

### Pitfall 3: Display serif looks great big, looks broken small

**What goes wrong:**
A high-contrast display serif (Editorial New, GT Sectra, Tiempos Headline, etc.) used for hero headline AND for project titles and section labels at 14–18px. Hairline strokes disappear sub-pixel on Windows ClearType; italics are unreadable on Android Chrome at body sizes. Looks like a typography mistake, which on a credibility-forward site reads as "this person doesn't have taste."

**Why it happens:**
Serif pairing references (display serif + sans body) get misapplied — designers use the display serif for too many roles instead of restricting it to display sizes only. Mac Retina rendering hides the problem from the designer.

**How to avoid:**
- Display serif: ONLY hero name, page H1s, large quotes — `≥40px`, never below `28px`.
- Project titles, navigation, "Currently" line, body, captions: clean sans (Inter, Geist, etc.).
- Test the actual chosen serif at every size it's used on Windows (ClearType), Android Chrome, and Safari iOS — not just Mac.
- Apply `font-feature-settings: 'liga', 'kern'` and `text-rendering: optimizeLegibility` on serifs.
- Avoid italic serif at small sizes; if italic is needed below 24px, use the sans italic instead.

**Warning signs:**
- Strokes disappear in screenshots taken on Windows.
- Friends say "the small text looks weird" but can't articulate why.
- Glyphs render as squares momentarily on slow connections.

**Phase to address:** Design Tokens (define type scale + role-by-role font assignments).

---

### Pitfall 4: Custom font FOIT/FOUT on hero headline

**What goes wrong:**
The hero headline (Braeden's name in display serif) is invisible for 1–3 seconds on first load (FOIT), or pops in dramatically with a layout shift (FOUT) because the fallback metrics don't match. First impression of the site is a blank space where the name should be — the opposite of "credibility-forward."

**Why it happens:**
Self-hosted custom fonts loaded via raw `@font-face` without `font-display: swap` block render. Even with `next/font`, if you forget to mark hero font with `preload: true` or use `display: 'block'`, the headline waits. CLS comes from missing `adjustFontFallback` — fallback Times/Georgia has different metrics than Editorial New so the headline jumps when it swaps in.

**How to avoid:**
- Use `next/font/local` (or `next/font/google` if applicable) — it inlines CSS, self-hosts, preloads at build time, and applies `size-adjust` automatically to match fallback metrics.
- For the display serif used in the hero: set `display: 'swap'` and `preload: true`.
- For the body sans (used everywhere): set `display: 'swap'`, `preload: true`, `adjustFontFallback: true`.
- Subset to Latin only (lop ~70% of weight); only load the weights actually used (probably Regular + Medium for sans, one weight for display serif).
- Verify CLS = 0 on the hero in Lighthouse — any non-zero CLS is the font swap.

**Warning signs:**
- Hero name visibly "snaps" larger or smaller a second after page load.
- Lighthouse flags "Ensure text remains visible during webfont load."
- CLS > 0.

**Phase to address:** Foundation (next/font set up correctly); verify in Hero phase.

---

### Pitfall 5: Wordmark and monogram fight each other

**What goes wrong:**
Hero stages a stylized "Braeden" wordmark in display serif AND the custom "B" monogram next to it (or in the nav AND the hero). The eye doesn't know which is the brand mark. Footer adds a third treatment of the name. Site feels like it has three logos instead of one identity.

**Why it happens:**
Excitement about the monogram leads to using it everywhere, while the name typeset in the display serif is also doing wordmark duty. Designers don't define the role hierarchy.

**How to avoid:**
- Pick ONE primary mark: either the monogram or the wordmark. The other becomes a secondary expression.
- Suggested rule for this site: **monogram = nav, favicon, footer signature, transition flourish**; **wordmark (just the name in serif) = hero only**. They never appear in the same viewport above the fold.
- Define a clear lockup spec (size, spacing, allowed colours) in design tokens before building components.
- Make sure the monogram works at 32px (favicon) AND at 200px+ (any hero use) without redrawing.

**Warning signs:**
- More than two treatments of "Braeden" / "B" visible at once.
- Designer or tester can't articulate "what's the logo of this site."
- Monogram + wordmark in the same nav row.

**Phase to address:** Design Tokens (define mark hierarchy and lockup); Hero (enforce one mark per viewport).

---

### Pitfall 6: prefers-reduced-motion ignored on the "craft motion" we just added

**What goes wrong:**
Staggered fade-in on load, hover lifts, smooth section transitions all run for users who explicitly set OS-level reduce motion. For users with vestibular disorders this can cause nausea. For everyone else it's a quiet a11y fail that Lighthouse won't flag but axe will, and that an investor's accessibility-conscious assistant will notice.

**Why it happens:**
Devs implement motion first and "add a11y later." Framer Motion ships motion enabled by default; the `MotionConfig reducedMotion="user"` opt-in is not the default and is easy to forget.

**How to avoid:**
- Wrap the entire app in `<MotionConfig reducedMotion="user">` once at the root layout. This auto-disables transform/layout animations for users with reduce-motion preference while keeping opacity (which is fine).
- For non-Framer animations (CSS keyframes, transitions on hover): wrap in `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; animation-iteration-count: 1 !important; } }`.
- Do NOT use `prefers-reduced-motion: no-preference` as a feature flag for "should I animate?" — it's no-consent (users haven't opted IN to motion, they may just not know the setting exists). Animate by default but be ready to kill it.
- Test in DevTools: Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce."

**Warning signs:**
- Site has motion but no `MotionConfig` wrapper anywhere.
- No `@media (prefers-reduced-motion)` block in global CSS.
- axe DevTools shows no motion-related warnings (might mean it can't detect them — verify manually).

**Phase to address:** Foundation (add MotionConfig + global CSS rule before any animation is written); enforce in every animated component.

---

### Pitfall 7: Contact modal is not keyboard-accessible

**What goes wrong:**
The Formspree contact modal opens, but Tab moves focus to elements behind the modal (header nav, body content). Esc doesn't close it. Focus doesn't return to the trigger button after close. Screen readers don't announce the modal opening. A keyboard-only recruiter can't submit the form — silent conversion loss.

**Why it happens:**
Custom modal built from divs without `role="dialog"`, without focus trap library, without restoring focus on close. Devs test with mouse only.

**How to avoid:**
- Use the native `<dialog>` element with `.showModal()` — the browser handles focus trap and Esc-to-close for free. (Backdrop styling: `dialog::backdrop`.)
- If using a Headless UI / Radix Dialog component, both ship with focus management built in — prefer them over hand-rolling.
- Required wiring: `aria-labelledby` pointing to the modal heading; `aria-describedby` for body; restore focus to the trigger on close.
- Test with keyboard only: Tab cycles inside modal, Shift+Tab cycles back, Esc closes, focus returns to trigger.
- Test with VoiceOver (Mac) or NVDA (Windows): modal opening is announced.

**Warning signs:**
- Tab key escapes the modal to nav links behind it.
- Esc doesn't close the modal.
- After closing, focus is on `<body>` (the page jumps to top on next Tab).
- No `role="dialog"` or `aria-modal` in DOM.

**Phase to address:** Contact (dialog implementation); verify in Polish/SEO.

---

### Pitfall 8: Focus rings stripped because "they look ugly"

**What goes wrong:**
A `:focus { outline: none; }` reset is left in global CSS. Keyboard users have no visible indication of where focus is. WCAG 2.4.7 (Focus Visible) fail. Recruiters using keyboard navigation, anyone with a tremor, anyone with a broken trackpad — all blocked from interacting with the site.

**Why it happens:**
Default browser focus rings clash with editorial-dark aesthetic. Designer says "remove the blue ring"; dev `outline: none`s it without adding a replacement.

**How to avoid:**
- NEVER `outline: none` without a replacement. Pattern:
  ```css
  *:focus { outline: none; }
  *:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 2px; }
  ```
- Use `:focus-visible` (not `:focus`) so mouse clicks don't show the ring but keyboard does. This IS the modern compromise — it satisfies a11y AND keeps the design clean.
- The accent blue (`#7c87ff`) on charcoal gives ~6:1 contrast — strong, on-brand, AA-compliant.
- Inputs, buttons, links, modal close button, project cards (if interactive) — all need a visible focus state.
- Test by tabbing through every page from top to bottom. You should always see where you are.

**Warning signs:**
- Tabbing through the page and losing track of focus position.
- `outline: none` anywhere in CSS without an adjacent `:focus-visible` rule.
- axe DevTools "elements must have visible focus indicator" warning.

**Phase to address:** Design Tokens (define focus ring as a token); Foundation (apply globally).

---

### Pitfall 9: Status conveyed by colour alone

**What goes wrong:**
Form submission states ("submitting…" / "sent" / "error") are differentiated only by border or text colour change. Project tags ("active" green vs "archived" grey) carry meaning only in colour. Colourblind users see no difference. WCAG 1.4.1 fail.

**Why it happens:**
Designers love clean colour-only states; devs implement what's in the design.

**How to avoid:**
- Every state change pairs colour with a non-colour signal: text label, icon, weight change, or position.
- Form: "Sent ✓" not just green border. "Error: please retry" not just red border.
- Project cards: "Archived" label or strikethrough — not just a desaturated tile.
- Active/inactive nav: underline or weight, not just colour.

**Warning signs:**
- Black-and-white screenshot of the site loses meaning.
- A desaturated/grayscale browser preview can't tell two states apart.

**Phase to address:** Design Tokens (state pattern definition); Contact (form states); Work (project status).

---

### Pitfall 10: Missing or wrong-dimension OG image

**What goes wrong:**
Site is shared on iMessage / Slack / X / LinkedIn and appears as a tiny favicon thumbnail with no preview, OR a stretched/cropped logo. The first time someone shares Braeden's site link in a DM, it looks unloved. This is the FIRST impression for ~30% of inbound traffic on a personal site.

**Why it happens:**
Devs ship without `app/opengraph-image.tsx`. Or they ship with one that's 800x400 (wrong ratio), or a screenshot of the site that's 4MB and gets rejected by some scrapers, or no Twitter card meta so X falls back to the small thumbnail.

**How to avoid:**
- Use Next.js App Router file convention: `app/opengraph-image.tsx` (or `.png`) at exactly **1200×630**, ≤8MB. Mirror as `app/twitter-image.tsx` (Twitter uses `summary_large_image`, ≤5MB).
- Use Next's `ImageResponse` (from `next/og`) so the OG image is generated at the edge with the same fonts and brand — gives a free dynamic OG that matches the site visually.
- Required meta in root `layout.tsx` `metadata`:
  - `title`, `description`
  - `openGraph: { title, description, url, siteName, images: [{ url, width: 1200, height: 630 }], type: 'website' }`
  - `twitter: { card: 'summary_large_image', title, description, images }`
  - `metadataBase: new URL('https://braehods.com')` — without this, OG image URLs are relative and break on some scrapers.
- Validate before launch: paste URL into [opengraph.xyz](https://www.opengraph.xyz), Twitter card validator, LinkedIn Post Inspector, iMessage on a real iPhone.

**Warning signs:**
- Sharing the URL in iMessage or Slack and seeing a generic favicon.
- OG validators showing red Xs on required fields.
- `metadataBase` missing from root layout.

**Phase to address:** Polish/SEO (OG image + meta); verify in Launch.

---

### Pitfall 11: No sitemap, robots, or canonical — and Vercel preview URLs leak into Google

**What goes wrong:**
Site goes live without `sitemap.xml` or `robots.txt`. Google crawls slowly. Worse: every Vercel preview deploy URL (`braeden-site-abc123.vercel.app`) is publicly indexable, so Google ends up with multiple copies of the site competing — `braehods.com/about`, `braehods.com.vercel.app/about`, `braeden-site-xyz.vercel.app/about`. Duplicate content penalties, ranking dilution.

**Why it happens:**
App Router developers forget that `app/sitemap.ts` and `app/robots.ts` are file conventions you have to opt into. Vercel's `*.vercel.app` URLs are public by default.

**How to avoid:**
- Add `app/sitemap.ts` exporting the homepage, /about, /work, /contact (and individual project routes if any).
- Add `app/robots.ts` allowing all crawl on production, blocking on preview.
- Set `metadataBase: new URL('https://braehods.com')` in root layout so all canonical URLs resolve to the production domain.
- For each page set `alternates: { canonical: 'https://braehods.com/path' }` in `metadata`.
- Block preview deployments from indexing: in `vercel.json` or via env-aware middleware, send `X-Robots-Tag: noindex` when `VERCEL_ENV !== 'production'`.
- After launch, submit sitemap via Google Search Console and verify domain ownership.

**Warning signs:**
- `site:braehods.com` Google search returns nothing 2 weeks post-launch.
- `site:vercel.app braeden` returns preview deploys.
- Search Console shows "Duplicate, Google chose different canonical."

**Phase to address:** Polish/SEO (sitemap + robots); Launch (Search Console verification, preview noindex).

---

### Pitfall 12: Title tag duplication / no per-page metadata

**What goes wrong:**
Every page shows "Braeden — Personal Site" as the browser tab title. Google SERP results all show identical titles. /about, /work, /contact look like duplicates of each other. Click-through rate from search drops.

**Why it happens:**
Root `layout.tsx` defines a global title and per-page `metadata` exports are missing.

**How to avoid:**
- Root layout: `metadata: { title: { default: 'Braeden — Builder, content, trading systems', template: '%s · Braeden' } }`
- Each page (`app/about/page.tsx`, etc.) exports `export const metadata = { title: 'About', description: '…' }` — the template renders this as "About · Braeden."
- Description must be unique per page, ~150 chars, and not start with "Welcome to my…"
- Project pages (if any): generate metadata dynamically from MDX frontmatter.

**Warning signs:**
- View Source on /about and /work shows identical `<title>`.
- Google SERP shows multiple results with the same title.

**Phase to address:** Polish/SEO; verify per-page metadata exists during each page phase (About, Work, Contact).

---

### Pitfall 13: Person JSON-LD malformed or missing

**What goes wrong:**
Searching "Braeden Hodson" doesn't surface a Knowledge Graph entry. "About this result" shows nothing structured. Site is a generic blue link instead of a rich result. Worse: malformed JSON-LD (missing `@context`, relative URLs in `sameAs`, mismatched property casing) shows up as a Search Console error.

**Why it happens:**
Dev copies a JSON-LD example from a blog and forgets to update `sameAs` URLs, or types `dateofBirth` instead of `birthDate`, or uses relative `/about` URLs in `url`.

**How to avoid:**
- Add a single Person schema block in root layout via a `<Script id="json-ld-person" type="application/ld+json">` tag. Required fields:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Braeden Hodson",
    "url": "https://braehods.com",
    "image": "https://braehods.com/portrait.jpg",
    "jobTitle": "...",
    "sameAs": [
      "https://github.com/...",
      "https://www.youtube.com/...",
      "https://www.instagram.com/..."
    ]
  }
  ```
- All URLs must be absolute (`https://...`), not relative.
- Property names are exact camelCase per schema.org (`jobTitle`, `birthDate`, `worksFor` — not `job_title`).
- Visible page content must back up structured claims (jobTitle in JSON-LD must match what's on /about).
- Validate via Google Rich Results Test AND schema.org validator before launch.

**Warning signs:**
- Google Rich Results Test shows "Person not eligible" or specific errors.
- Search Console "Unparsable structured data" report has entries.
- `sameAs` URLs are 404s (e.g., wrong YouTube handle).

**Phase to address:** Polish/SEO; validate in Launch.

---

### Pitfall 14: Project data lives in component JSX

**What goes wrong:**
The /work page is implemented with each project hardcoded in JSX:
```tsx
<ProjectCard title="CapitolLens" desc="..." link="..." />
<ProjectCard title="shorts-factory" desc="..." link="..." />
```
Adding a project means editing layout code. Adding a future /writing page that pulls "latest project" requires duplicating data. When CapitolLens status changes, you can't grep cleanly. The /work page becomes a maintenance liability and blocks the architecture for future content surfaces.

**Why it happens:**
Initial scope is "just the 7 projects, what's the harm." It compounds over time — every hard-coded list becomes a dam against future reuse.

**How to avoke:**
- Single source of truth: `content/projects.ts` (typed) or `content/projects/*.mdx` (one file per project).
- Schema includes: `slug, title, summary, status (active/shipped/archived/paper-traded), tags, links{github, demo, writeup}, year, featured?`.
- /work page maps over the data; /about can pull "Currently shipping" by filtering `status === 'active'`; future /writing can cross-link.
- Validate the schema with Zod at build time so a malformed project breaks the build, not the page.

**Warning signs:**
- Project descriptions appear in `.tsx` files, not `.mdx` or `.json`.
- Updating a project means editing layout code.
- "Currently" line on home is hardcoded as a string instead of pulled from project data.

**Phase to address:** Foundation (decide content shape); Work (implement against the schema, not against components).

---

### Pitfall 15: Design tokens hardcoded as Tailwind arbitrary values

**What goes wrong:**
Charcoal background written as `bg-[#1a1a1f]`, accent as `text-[#7c87ff]`, repeated 40+ times across components. Changing the accent blue from `#7c87ff` to `#8590ff` after a design review is a multi-file find-replace. Theme drift: one component uses `#7c87ff`, another `#7d87fe`, no one notices.

**Why it happens:**
Tailwind arbitrary value syntax is fast at the start. Token discipline is a phase-2 problem until it isn't.

**How to avoid:**
- Define tokens in `tailwind.config.ts` `theme.extend.colors`: `bg.base`, `bg.elevated`, `text.primary`, `text.muted`, `accent.default`, `accent.subtle`, `border.subtle`, etc.
- Mirror as CSS custom properties in `:root` so MDX content can use them without Tailwind.
- For the gradient: define it once as a token (`bg-gradient-charcoal`).
- For the accent: define `accent-default` AND `accent-subtle` (lower-opacity for hovers) — don't `/50` everywhere.
- Lint rule (or simply code review): no hex values in component files.

**Warning signs:**
- Hex values in `.tsx` files.
- Two close-but-not-identical accent blues used in different places.
- Adding a new component requires copying colour values from another component.

**Phase to address:** Design Tokens (define and enforce before any UI is built).

---

### Pitfall 16: /work page tightly coupled to project schema, blocking future /writing

**What goes wrong:**
The grid layout, card component, and routing logic are all written assuming "items are projects." When /writing is added later, you can't reuse `<Card>` because it expects `tech tags` and `github link`; you end up forking it. The "this site is built to extend" promise breaks.

**Why it happens:**
YAGNI taken too literally. `<ProjectCard>` is built specific because there's only projects. Six months later, /writing needs a card and the card has no abstraction seam.

**How to avoid:**
- Card component takes generic content props: `title, eyebrow, summary, meta[], href, image?`. Project-specific stuff (tech tags, status) is just one possible shape of `meta[]`.
- Grid layout takes an array of generic items, not "an array of projects."
- Even if /writing is out of scope for v1, write the Card and Grid generically once. The cost is minutes.
- Router: decide URL shape (`/work/[slug]` vs `/projects/[slug]`) consciously — don't paint into a corner.

**Warning signs:**
- ProjectCard component imports a project type, not a content type.
- Grid component is named `<ProjectsGrid>` not `<CardGrid>`.
- Adding `/writing` later requires forking components.

**Phase to address:** Work (build with abstraction seams); design intent set in Foundation.

---

### Pitfall 17: DNS swap timing breaks the live site

**What goes wrong:**
Old site at braehods.com is live on GitHub Pages. New site is built and ready on Vercel. CNAME is swapped Friday afternoon. Vercel hasn't issued an SSL cert yet because the old CNAME was still pointing at GitHub Pages when the domain was added to Vercel. Site is down for hours. People who shared the URL in DMs see browser warnings.

**Why it happens:**
Wrong order of operations. SSL provisioning needs the domain pointed at Vercel BEFORE the cert can be issued, but if you point it before the new site is ready, you have downtime. Doing both at once = race condition.

**How to avoid:**
1. Add `braehods.com` to the new Vercel project FIRST (this stages the SSL cert; Vercel will show "Invalid Configuration" until DNS points to it — that's expected).
2. Test the new site fully on the Vercel preview URL — every page, contact form submission verified, mobile, OG previews.
3. Lower TTL on the existing braehods.com DNS record to 300s, 24h before the swap.
4. Pick a low-traffic window (early Sunday).
5. Update the CNAME / A record to Vercel.
6. Wait for Vercel to confirm SSL provisioned (5–60 min).
7. Verify https://braehods.com loads the new site, no cert warning.
8. Restore TTL to 3600+.
9. ONLY THEN archive the old `braehods` repo.

**Warning signs:**
- Cert warning ("not secure") on braehods.com after swap.
- Site loads on `*.vercel.app` but not on the apex domain.
- DNS propagation incomplete (use [dnschecker.org](https://dnschecker.org) to verify globally).

**Phase to address:** Launch.

---

### Pitfall 18: Old braehods repo keeps ranking and competes with the new site

**What goes wrong:**
The old `braehods` GitHub Pages repo isn't archived. Even after DNS swap, the GitHub Pages deployment is still live at `braehods.github.io` (or whatever the username is). It's been indexed for months. Search results for "Braeden Hodson" point to the old minimal site OR to a 404. Worse: someone bookmarked `braehods.github.io` and gets the old version forever.

**Why it happens:**
Excitement of launch; old repo gets forgotten. GitHub Pages doesn't auto-redirect.

**How to avoid:**
- Replace the old repo's `index.html` with a JavaScript redirect AND a `<meta http-equiv="refresh" content="0; url=https://braehods.com">` to the new site. (GitHub Pages can't do server-side 301s — this is the best available.)
- Update the GitHub repo description and pin the new repo, unpin the old.
- Update GitHub profile bio link to `braehods.com`.
- Delete or archive the old repo only AFTER the redirect HTML is in place and you've verified `braehods.github.io` redirects correctly.
- If you have a Linktree, IG bio, YouTube channel link, Resume PDF, email signature — search-and-replace any old URLs.

**Warning signs:**
- `site:github.io braeden` returns the old site.
- IG/YT bio still shows `braehods.github.io` or any URL not `braehods.com`.
- Searching your name returns the old site above the new.

**Phase to address:** Launch (cleanup checklist).

---

### Pitfall 19: Formspree ID exposed → spam abuse, no rate limit

**What goes wrong:**
The Formspree endpoint `xqeypnkw` is fetched from a client-side `<form action="https://formspree.io/f/xqeypnkw">`. A scraper finds it, blasts 10,000 spam submissions to your inbox, you blow through the free tier. Or worse, attackers use the form to send spear-phishing-style messages with the user's name in `_replyto`.

**Why it happens:**
Formspree IDs are inherently public (the browser has to know where to POST). The defense is layered, not "hide the ID."

**How to avoid:**
- Add Formspree's built-in honeypot: hidden input named `_gotcha` (CSS-hidden, not `type="hidden"` — bots see and fill `type="hidden"`).
- ALSO add a custom honeypot field with a non-obvious name (Formspree-aware bots skip `_gotcha`). Name it something innocuous like `website_url`, hide via `position: absolute; left: -9999px;`. If filled, reject client-side before submit.
- Enable Formspree's built-in reCAPTCHA in the dashboard for this form.
- Add a min-time-on-page check: don't accept submissions less than 3 seconds after page load (humans don't fill forms that fast).
- Add `aria-hidden="true"` and `tabindex="-1"` on honeypot fields so screen readers and keyboard users don't see them.
- For extra safety: route through a Next.js API route (`app/api/contact/route.ts`) that does the honeypot check + rate limit (e.g. Upstash Redis, 3 submissions per IP per hour) and only forwards verified submissions to Formspree. Endpoint becomes `/api/contact`, not Formspree directly.

**Warning signs:**
- Inbox has 10+ obviously-bot messages in a day.
- Formspree dashboard shows submissions you didn't see in your inbox (filter is dropping them).
- Free-tier monthly cap notification from Formspree.

**Phase to address:** Contact (honeypot + reCAPTCHA from day 1); optional rate-limit API route in Polish/SEO if abuse appears.

---

### Pitfall 20: "Coming soon" or lorem ipsum shipped to production

**What goes wrong:**
Project tile reads "More details coming soon." About page has "Bio coming." A "Currently" line says "Currently shipping [TODO]." Recruiter reads it, thinks "this kid hasn't finished his own site, why would I trust him to finish my project."

**Why it happens:**
Devs treat content as a placeholder problem and forget to fill in. Or the launch deadline hits before content is ready.

**How to avoid:**
- Hard rule: **NO content placeholders ship to production.** If a section can't have real content, the section doesn't exist on launch.
- Pre-launch grep: `grep -rE "TODO|TBD|lorem|ipsum|coming soon|placeholder|FIXME" --include="*.{ts,tsx,mdx,md,json}"` — must return zero hits.
- For projects with no public writeup (e.g., paper-traded CapitolLens): write a 1–2 sentence honest summary of what it is and its current state. "Insider-trading Form 4 strategy, paper-traded, +18%/yr Sharpe 0.93 in backtest." That's better than "Coming soon."
- Image placeholders: ship with real screenshots or with intentional minimal visuals (e.g., a styled tile with title + status). Never the broken-image icon.

**Warning signs:**
- Any page section has fewer than 2 sentences of real copy.
- Friend opens the site and asks "is this finished?"
- Project tile has no description or a one-word description.

**Phase to address:** Launch (pre-flight grep); ongoing during About + Work phases.

---

### Pitfall 21: "Currently" line goes stale

**What goes wrong:**
On launch, "Currently shipping CapitolLens" is accurate. Six months later, the user has moved on to a new project but never updated the line. Visitors see "Currently shipping CapitolLens" and assume it's the most recent thing — i.e., the user has done nothing in 6 months. Worse than no Currently line.

**Why it happens:**
"Currently" is in JSX, not in surfaced data. There's no review cadence. The user forgets it exists.

**How to avoid:**
- Store "Currently" as a single typed value: `content/currently.ts` exporting `{ text: string, since: string }`. Render `since` as "updated 3 weeks ago" relative time below the line — invisible if recent, a soft prod if stale.
- If `since` is older than 90 days, show a build warning (e.g., a Next.js build-time `console.warn` that surfaces in Vercel's deploy log).
- Calendar reminder: review this line monthly, same day as content batch planning.
- Acceptable fallback for periods between projects: "Currently in Los Angeles, building" — vague but undated, can sit longer without rotting.

**Warning signs:**
- "Currently" line hasn't changed in your last 5 deploys.
- The thing it mentions has shipped, been archived, or pivoted.

**Phase to address:** Hero (architect for easy update); launch checklist (note review cadence in PROJECT.md).

---

### Pitfall 22: Generic "passionate developer who loves to build" copy

**What goes wrong:**
The About paragraph reads "Passionate full-stack developer who loves clean code and building delightful experiences. Always learning, always shipping." It is indistinguishable from 10,000 other portfolios. Recruiter glazes over. Investor sees zero signal. The site failed Job #1 ("that's a nice website") because the writing has no voice.

**Why it happens:**
Devs default to LinkedIn-summary register because writing about yourself is hard. They don't realize the copy IS a differentiator.

**How to avoid:**
- Bans (do not ship): "passionate," "love to build," "delightful experiences," "clean code," "always learning," "I'm a [X]-year-old [Y] from [Z]."
- Replace with specifics: numbers, named projects, named cities, named tools. Concrete > vague.
- Voice rule: write the way you'd describe yourself to a friend, then cut 30%. Editorial-dark sites earn the right to have personality.
- Borrow restraint from references: rauno.me's "I make things on the web. Currently designing at Vercel." brittanychiang.com's "I'm a software engineer that specializes in building..." — short, specific, factual. No emoji, no exclamation marks.
- Suggested shape for this site: **what you do (specific) + what you've shipped (named) + where you are (LA) + what's next (Currently line)**.

**Warning signs:**
- About paragraph contains the word "passionate," "love," or "journey."
- Friend reads it and says "this could be anyone."
- The copy works for any business student in any city.

**Phase to address:** About; voice guardrails set in Foundation (a simple `BANNED_WORDS.md` in `.planning/`).

---

### Pitfall 23: First/third-person inconsistency

**What goes wrong:**
Hero says "Braeden is a business student in LA" (third person). About page opens "I'm a builder and content creator…" (first person). Footer credit says "Made by me" (first). Project pages say "Braeden built this to…" (third). Reads sloppy. Reads like a template that wasn't customized.

**Why it happens:**
Copy is written across multiple sessions, multiple sources (some lifted from old site, some new), no style guide enforced.

**How to avoid:**
- Pick ONE: this site should be **first person throughout**. ("I build trading systems. I run a small content brand. I'm in LA.") First person is warmer and matches the editorial-craft register.
- Exception: meta/SEO description and JSON-LD `description` field can be third person ("Braeden is a builder and entrepreneur in LA…") because those are about-the-person not from-the-person.
- Pre-launch grep: search for "Braeden " (with space) in components and MDX. Each hit should be intentional (titles, structured data, footer signature).

**Warning signs:**
- Mixing "I" and "Braeden" in body copy on the same page.
- Different pages use different voices.

**Phase to address:** About (set the rule); Hero, Work (apply consistently); Polish/SEO (pre-launch audit).

---

### Pitfall 24: Mobile layout broken or untested at 320px

**What goes wrong:**
Hero name overflows on iPhone SE. Project grid stacks weirdly. Modal contact form has a fixed width that scrolls horizontally on small phones. Recruiter on a subway opens the link, sees a broken layout, closes the tab. **Most recruiter clicks come from mobile.** This is the highest-cost pitfall on the list.

**Why it happens:**
Designers and devs work on 13"+ screens. They test in DevTools "iPhone 14" (390px) but never on a real 320px viewport. Editorial typography looks great at desktop, breaks at small sizes.

**How to avoid:**
- Design tokens include a `min` breakpoint of 320px (iPhone 5/SE width); every layout must work there.
- Hero font-size: clamp(2rem, 8vw, 5rem) or similar — fluid, not breakpoint-stepped.
- Test on real iPhone (not just Chrome DevTools — touch targets, font rendering, scroll behaviour differ).
- Test on Android Chrome (most popular browser globally).
- Touch targets minimum 44×44px (Apple HIG) — small text links in nav can fail this even when they look fine.
- Use `overflow-wrap: anywhere` or `text-wrap: pretty` on long names/titles.

**Warning signs:**
- Horizontal scroll on any page at 320px width.
- Hero name overlaps the photo on small screens.
- Tap targets feel "fiddly" on real phone.
- Lighthouse mobile score ≠ desktop score by more than 5 points.

**Phase to address:** Foundation (set 320px floor); every component phase (verify); Polish/SEO (real-device testing).

---

### Pitfall 25: Hero portrait photo unoptimized → 4MB above-the-fold

**What goes wrong:**
Portrait at `/portrait.jpg` is shipped at 4032×3024px (raw camera output), 4MB JPEG. Above the fold of the home page. LCP (Largest Contentful Paint) hits 5+ seconds on 3G. Lighthouse Performance score in the 60s. Mobile users on cellular bail before the photo loads.

**Why it happens:**
Drop the portrait into `/public`, write `<img src="/portrait.jpg">`. Done. No `next/image`, no compression, no responsive `srcset`, no priority hint.

**How to avoid:**
- Use `<Image>` from `next/image` for every image. It auto-serves WebP/AVIF, generates `srcset`, lazy-loads non-priority images.
- For the hero portrait: set `priority` (preload it) AND set explicit `width`/`height` (prevents CLS).
- Pre-process the source: export at 1600×1600 max, ~150KB JPEG. `next/image` will serve smaller versions per device.
- Add `placeholder="blur"` with a `blurDataURL` — site feels instant even before the photo loads.
- Don't store the source 4MB photo in `/public` — keep it in `/source-assets/` outside the build.
- Check LCP element in Lighthouse — must be the portrait, must be < 2.5s on mobile 4G.

**Warning signs:**
- Lighthouse Performance < 95 on mobile.
- "Properly size images" warning in Lighthouse.
- Photo visibly fades or pops in 1+ seconds after the rest of the page.
- Network panel shows >500KB image transfer for a portrait.

**Phase to address:** Hero.

---

### Pitfall 26: Unnecessary `'use client'` blowing up the JS bundle

**What goes wrong:**
A wrapper component at the top of the layout uses `'use client'` because of one tooltip. Every child below it is now in the client bundle. MDX content (which renders fine on the server) ships its full React reconciler to the browser. Total JS for the home page balloons to 200KB+. Lighthouse Performance drops.

**Why it happens:**
"Hooks need to be in client components, so I'll just put `'use client'` at the top." App Router rendering boundaries are subtle and easy to mis-place.

**How to avoid:**
- Default: every component is a Server Component. Mark `'use client'` only on the leaf component that actually needs interactivity (tooltip, modal trigger, form).
- Pattern: keep `'use client'` as deep in the tree as possible. Layouts and page roots should be Server Components.
- Pass server-rendered children INTO client components via `children` prop — the children stay server-rendered.
- Audit with `next build` output: total First Load JS for the home page should be under 100KB.
- For MDX: render MDX server-side (`@next/mdx` or `next-mdx-remote/rsc`) — never client-side compile.

**Warning signs:**
- `'use client'` at the top of `layout.tsx` or `page.tsx`.
- First Load JS > 150KB on a content-heavy page.
- Lighthouse "Reduce unused JavaScript" warning.

**Phase to address:** Foundation (establish RSC defaults); enforced in every component phase.

---

### Pitfall 27: Hidden layout shift from late-loading content

**What goes wrong:**
Hero loads, looks great, then 800ms in the photo loads and pushes the headline down by 200px. Or the "Currently" line is fetched client-side and pops in below the name, shifting the whole intro. CLS score is 0.15+ (red zone). Site feels "janky" even if individual elements are pretty.

**Why it happens:**
Images without explicit dimensions. Web fonts swapping in with different metrics. Client-side data fetches replacing content that wasn't there before.

**How to avoid:**
- Every image has `width` and `height` attributes (required by `next/image` anyway).
- Every web font uses `next/font` with `adjustFontFallback` so swap is metric-matched.
- "Currently" line is server-rendered (read from `content/currently.ts` at build time), not fetched.
- Reserve space for any element that loads asynchronously: if you must client-fetch something, render a skeleton of equal dimensions.
- Lighthouse CLS metric must be 0 on every page.

**Warning signs:**
- Visible "jump" during page load when watching the hero.
- CLS > 0 in Lighthouse.
- Layout Instability API in DevTools logs shifts.

**Phase to address:** Hero (most critical); verify all pages in Polish/SEO.

---

### Pitfall 28: Vercel Function cold start makes contact submit feel broken

**What goes wrong:**
Contact form is wired through a Next.js API route (`app/api/contact/route.ts`) for honeypot/rate-limit. The route runs in a Node.js Vercel Function. After a quiet period, the first submission of the day takes 3–7 seconds (cold start). User clicks Submit, sees nothing happen, refreshes, double-submits. Conversion lost.

**Why it happens:**
Default Vercel functions cold-start. Personal sites get low traffic so functions are almost always cold.

**How to avoid:**
- For the contact route specifically: use the **Edge Runtime** (`export const runtime = 'edge';`) — Edge functions cold-start in ~50ms not 3s.
- Or: post directly to Formspree from the client (skip the API route) and rely on Formspree's own honeypot/reCAPTCHA — simpler for v1, no cold-start concern at all.
- If using a server route: ALWAYS show optimistic UI on submit (button → "Sending…" → "Sent ✓") so the user knows something is happening even during a 3s cold start.
- Disable the submit button immediately on click to prevent double-submit.
- Show a hard error state with retry option if submission takes > 10s.

**Warning signs:**
- First contact submission after deploy takes 5+ seconds.
- Submit button has no loading state.
- User reports "I sent it twice, did you get both?"

**Phase to address:** Contact.

---

### Pitfall 29: Contact form silently fails

**What goes wrong:**
User fills out the form, hits Submit, nothing visible happens. Form was rejected (spam filter, Formspree quota, network blip), but UI shows no error. User assumes it sent. Message never arrives. Recruiter follows up via a different channel weeks later confused why you ignored them — except you never got it.

**Why it happens:**
Devs handle the happy path ("on success, show 'Sent'"). Failure modes — network error, 4xx response, Formspree spam-block, validation error — are not surfaced.

**How to avoid:**
- Three explicit states with distinct UI: idle, submitting, success, error. Each is announced to screen readers via `aria-live="polite"`.
- On error: show a human message ("Something went wrong. You can also email me directly at [user@domain]"). Always provide an email fallback.
- Log client-side errors (e.g., to Vercel Analytics or Sentry) — silent failures stay silent without observability.
- Test failure modes manually: throttle network in DevTools to "Offline" mid-submission, watch what happens. Submit a known-spam payload (the word "viagra") and watch what happens.
- Treat "Sent ✓" message ONLY after a 200-OK response is confirmed — never on optimistic-only.

**Warning signs:**
- Submit button has no error state.
- No `aria-live` region for status changes.
- No fallback email visible anywhere on the contact UI.
- "I never got your message" reports.

**Phase to address:** Contact.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|---|---|---|---|
| Hardcode project list in `<Work />` JSX | Saves 30 min on launch | Every project change is a code change; blocks /writing reuse | Never — content schema is cheap |
| Skip `next/font`, use `<link>` Google Fonts | One less build dep | FOUT, CLS, Lighthouse hit, no self-hosting | Never |
| `:focus { outline: none }` global reset | "Cleaner" design | WCAG fail, recruiter on keyboard can't navigate | Never without `:focus-visible` replacement |
| Single hex per colour with no token | Faster initial styling | Theme drift; rebrand is multi-file find-replace | Prototype branch only |
| `'use client'` at root layout | Easier mental model ("everything's a React app") | Whole app becomes client bundle; LCP/JS regression | Never |
| Static OG image (no per-page customization) | Saves implementing `ImageResponse` | All shared links look identical | Acceptable for v1; add dynamic in Polish phase |
| Contact direct-to-Formspree (no API route) | No cold-start, no rate-limit infra | Limited spam defense (rely on Formspree built-ins) | Acceptable for v1 with honeypot + reCAPTCHA enabled |
| Skip `prefers-reduced-motion` handling | Faster motion implementation | Inaccessible, possible nausea trigger, axe failures | Never |
| One-off SVG noise PNG instead of inlined | Faster to ship | Larger network payload, can't tweak opacity in CSS | Acceptable if the PNG is < 30KB |
| Skip Person JSON-LD | Saves 15 min | No Knowledge Graph entry; "Braeden Hodson" search returns no rich result | Never on a personal-brand site |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|---|---|---|
| Formspree | Embedding `xqeypnkw` in client form with no honeypot | Custom honeypot field + Formspree reCAPTCHA enabled in dashboard + min-time check |
| Vercel domain | Add domain to Vercel AFTER swapping CNAME | Add to Vercel FIRST (stages cert), test on `*.vercel.app`, THEN swap CNAME |
| Vercel previews | Letting `*.vercel.app` URLs index | `X-Robots-Tag: noindex` when `VERCEL_ENV !== 'production'` |
| Google Search Console | Submit before sitemap exists | Build `app/sitemap.ts` and `app/robots.ts` first; submit sitemap.xml URL after launch |
| `next/image` | Loading from `/public` raw, no `priority` on hero | Always use `<Image>`, set `priority` on LCP image, set explicit dimensions |
| `next/font` | Using `<link>` to Google Fonts for "simplicity" | `next/font/google` or `next/font/local` — inlines, preloads, fixes CLS |
| MDX | Putting `'use client'` in MDX wrapper | Render server-side (RSC); only mark client at the leaf |
| Framer Motion | Per-component `useReducedMotion` checks | Single `<MotionConfig reducedMotion="user">` at root |
| Formspree honeypot | Using only `_gotcha` (Formspree-aware bots skip it) | Custom hidden field + `_gotcha` + reCAPTCHA = layered |
| GitHub Pages legacy | Deleting old repo = 404 on indexed URLs | Replace `index.html` with redirect, then archive |
| OG image | Using a stretched 800×400 screenshot | `app/opengraph-image.tsx` at 1200×630 via `next/og` `ImageResponse` |
| GitHub profile / IG bio / YT bio | Forgotten on launch day | Launch checklist explicitly includes "update all link-in-bio surfaces" |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|---|---|---|---|
| Animated `<feTurbulence>` overlay | Scroll stutter, fan spin-up, mobile Lighthouse drop | Render noise once to static PNG/data-URI; never animate the noise | Immediately on any low-end mobile |
| Hero portrait raw 4MB | LCP > 4s on mobile, "properly size images" warning | `next/image` with `priority`, pre-process source ≤ 200KB | Immediately on 4G or slower |
| `'use client'` too high in tree | First Load JS > 150KB, hydration time spike | Push `'use client'` to leaf interactive components | At ~50KB+ added bundle |
| Loading 8 font weights | FCP delay, font network waterfall | Load ≤ 3 weights total (e.g., serif Regular + sans Regular + sans Medium) | At any cellular connection |
| Client-side fetched MDX | Visible content delay, extra round trips | Render MDX server-side via `@next/mdx` or `next-mdx-remote/rsc` | Always |
| Large `mix-blend-mode` overlay | GPU compositing entire viewport per scroll frame | Use flat opacity instead; or scope blend to small element | On mid-range mobile |
| Vercel function cold start on contact | First daily submit takes 5s, user retries | Edge Runtime for the route; or skip route, post direct to Formspree | After every quiet period (~10 min idle) |
| Loading Framer Motion on every page | +30KB JS even on static pages | Motion only in components that animate; consider CSS for static fades | On 3G mobile |
| No image lazy loading on /work grid | Loading 7 project tiles upfront | `next/image` lazy by default — verify it's not overridden with `priority` | On the /work page specifically |
| Eager `<Script>` for analytics | Render-blocking JS | `<Script strategy="afterInteractive" />` or `lazyOnload` | Always |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---|---|---|
| Formspree ID with no honeypot/captcha | Spam blast → inbox flood, Formspree quota exhaustion | Custom honeypot + `_gotcha` + reCAPTCHA layered |
| Form `_replyto` reflects user input unchecked | Phishing via your email channel (attacker spoofs reply-to to look like internal) | Formspree handles this — but verify in headers; never trust user-controlled From |
| Unrestricted CORS on `/api/contact` | API can be called from any origin abusing your endpoint | Reject requests where `Origin` !== production domain |
| Secrets in `next.config.js` | Leaked to client bundle | Server-only env vars must NOT have `NEXT_PUBLIC_` prefix |
| Email address as plain text in HTML | Scraped for spam lists | Reverse-fill via JS, or use a `mailto:` only inside the contact modal (gated by user click) |
| GitHub repo public with `.env` committed | Formspree key, future API keys exposed | `.env*` in `.gitignore`; pre-commit secret scan |
| Hot-linked images from third parties (e.g., GitHub project READMEs) | They can change, redirect, or be removed; tracking pixels | Self-host all images; check imports |
| `<a href>` to user-typed URLs in MDX without `rel` | XSS-equivalent, reputation hit | Add `rel="noopener noreferrer"` to all external links |
| No CSP header | XSS surface, third-party script injection | Configure `Content-Security-Policy` via `next.config.js` headers; tight policy for personal site is feasible |
| Dependabot disabled | Vulnerable npm packages stay vulnerable | Enable Dependabot; auto-merge minor security updates |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---|---|---|
| Modal opens without focus moving to it | Keyboard users stuck on trigger button | Native `<dialog>` or focus-trap library; auto-focus first input |
| Modal can't be dismissed without clicking the X | Mobile users tap-trapped | Esc, click-outside, AND visible close button — three exits |
| "Currently" line is invisibly stale | "He's done nothing in 6 months" | Show relative date below; build-time stale warning |
| Channel buttons open in same tab | User leaves site, doesn't come back | `target="_blank"` + `rel="noopener noreferrer"` for external |
| Project tile has no indication of state (live/archived/in progress) | Can't tell what's current vs old | Status pill on every tile (with text label + colour, not colour alone) |
| Hover-only project metadata on mobile | Mobile users see nothing extra (no hover) | Show key metadata always; hover reveals secondary detail only |
| All links the same colour as body text | Users don't know what's clickable | Underline on hover at minimum; subtle accent on links in body copy |
| Smooth-scroll hijacks all anchor clicks | Some users hate it (also a11y concern) | `scroll-behavior: smooth` global is fine; never custom-JS scroll-jack |
| No back/breadcrumb on /work/[slug] | User stuck on detail pages | "← Work" link top-left of every detail page |
| Email visible only inside modal | User has to fill the form to see it; some prefer email | Show email also in footer (obfuscated if spam concern) |
| Hero photo + name on mobile crops the face | Looks cheap | Test portrait composition at 320–390px width; consider a square crop variant |

---

## "Looks Done But Isn't" Checklist

- [ ] **OG image:** Verify on iMessage, Slack, LinkedIn Post Inspector, Twitter Card Validator — not just localhost preview.
- [ ] **Favicon:** Tested on Chrome (light + dark theme), Safari, iOS bookmark, Android home screen. `apple-touch-icon` present, 180×180.
- [ ] **404 page:** Custom branded `app/not-found.tsx` exists. Default Next.js 404 page is a tell.
- [ ] **Loading state:** `app/loading.tsx` is branded, not the default spinner.
- [ ] **Robots/sitemap:** `https://braehods.com/robots.txt` and `https://braehods.com/sitemap.xml` both return 200 with correct content.
- [ ] **JSON-LD:** Person schema validates green on Google Rich Results Test.
- [ ] **Contact form:** Tested end-to-end — submit, verify email arrived in real inbox, with correct From field.
- [ ] **Contact failure:** Tested with network offline — UI shows error, fallback email visible.
- [ ] **Reduce motion:** Toggled OS setting on, reloaded, all animations disabled or reduced to opacity-only.
- [ ] **Keyboard nav:** Tabbed from page top to footer, never lost focus, modal works, focus returns to trigger.
- [ ] **Screen reader:** Tested at least the hero and contact form with VoiceOver.
- [ ] **Mobile real device:** Tested on a real iPhone AND a real Android, not just DevTools.
- [ ] **320px width:** No horizontal scroll on iPhone SE / 320px viewport.
- [ ] **Lighthouse mobile:** Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO ≥95.
- [ ] **Lighthouse desktop:** Same thresholds.
- [ ] **CLS:** Score is 0 on every page.
- [ ] **Placeholder grep:** `grep -rE "TODO|TBD|lorem|coming soon|placeholder|FIXME"` returns nothing in shipped content.
- [ ] **External links:** All `target="_blank"` have `rel="noopener noreferrer"`.
- [ ] **GitHub profile:** Bio link updated to `braehods.com`.
- [ ] **IG bio:** Link updated.
- [ ] **YouTube channel "About" link:** Updated.
- [ ] **Old `braehods` repo:** `index.html` redirects to new site; repo archived AFTER verification.
- [ ] **DNS propagation:** Checked globally on dnschecker.org post-swap.
- [ ] **SSL cert:** Green padlock on `braehods.com` from a fresh browser, no warning.
- [ ] **Vercel preview indexing:** `site:vercel.app braeden` returns nothing.
- [ ] **Email mailto fallback:** Visible somewhere on the page (not gated behind form alone).
- [ ] **"Currently" line:** Reflects actual current work as of launch day.
- [ ] **About copy:** No banned words ("passionate," "love to build," "journey").
- [ ] **Voice consistency:** First-person used everywhere except meta/SEO.
- [ ] **Print stylesheet (low effort, high signal):** `@media print` doesn't show black-on-black; recruiter prints to PDF and it's readable.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---|---|---|
| OG image broken in production | LOW | Add `app/opengraph-image.tsx`, redeploy. Re-scrape via FB/Twitter/LinkedIn debuggers. |
| Contact form spammed | MEDIUM | Enable Formspree reCAPTCHA, rotate to a new Formspree form ID, deploy. Old ID stays valid temporarily. |
| Old GitHub Pages still ranking | LOW | Add redirect HTML to old repo, push, wait for Google recrawl (1–4 weeks). Resubmit new sitemap to Search Console. |
| SSL cert not provisioned post-DNS-swap | MEDIUM | Verify DNS is correct, force re-issue in Vercel domain settings, wait up to 24h. Communicate downtime if extended. |
| Stale "Currently" line discovered post-launch | LOW | Update `content/currently.ts`, commit, deploy. Set calendar reminder. |
| Lighthouse Performance regression after Polish phase | MEDIUM | Bisect commits with `next build` analysis. Common culprits: new client component, new font weight, new image without `priority`. |
| FOUT/FOIT shipped | LOW | Switch to `next/font` with proper `display: 'swap'` and `adjustFontFallback`. Redeploy. |
| Modal a11y failure discovered | MEDIUM | Replace custom modal with native `<dialog>` or Radix Dialog. ~1–3 hours. |
| JSON-LD Person rejected | LOW | Validate via Google Rich Results Test, fix the specific error reported, redeploy. |
| Lost SEO ranking after migration | HIGH (time, not effort) | Verify 301 redirects, sitemap, canonical, JSON-LD all correct. Resubmit sitemap. Wait 30–90 days for re-ranking. |
| `*.vercel.app` URLs leaked into Google | LOW | Add `noindex` middleware on non-prod env, redeploy. Use Search Console "Remove URL" tool to expedite removal. |
| Mobile layout broken on real device | LOW–MEDIUM | Bug-fix specific component. Add real-device testing to launch checklist permanently. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---|---|---|
| 1. Charcoal-on-charcoal text fails AA | Design Tokens | axe DevTools clean on every page; manual contrast check against both gradient stops |
| 2. Grain texture overlay tanks performance | Design Tokens | Lighthouse Performance ≥95 mobile; smooth scroll on iPhone 12 |
| 3. Display serif unreadable small | Design Tokens | Visual review on Windows + Android; serif used only at ≥28px |
| 4. Custom font FOIT/FOUT | Foundation | CLS = 0 on hero; "ensure text remains visible" Lighthouse audit passes |
| 5. Wordmark + monogram fight | Design Tokens, Hero | Mark hierarchy doc exists; one mark per viewport above fold |
| 6. prefers-reduced-motion ignored | Foundation | DevTools emulation: motion stops; axe clean |
| 7. Modal not keyboard-accessible | Contact | Keyboard-only test: tab cycles, Esc closes, focus returns |
| 8. Focus rings stripped | Design Tokens, Foundation | `:focus-visible` everywhere; tab through every page |
| 9. Color-only state | Design Tokens, Contact, Work | Grayscale browser preview retains meaning |
| 10. Missing/wrong OG image | Polish/SEO | Validates on opengraph.xyz + iMessage + Slack |
| 11. No sitemap/robots, preview leaks | Polish/SEO, Launch | `/robots.txt` + `/sitemap.xml` exist; `site:vercel.app` empty |
| 12. Title tag duplication | Polish/SEO | Each page has unique `<title>` and meta description |
| 13. Person JSON-LD malformed | Polish/SEO | Google Rich Results Test green |
| 14. Project data in JSX | Foundation, Work | `content/projects.ts` (or .mdx) is single source; component imports from it |
| 15. Tokens hardcoded | Design Tokens | No hex literals in component files (grep) |
| 16. /work tightly coupled | Work | Components named generically (`<CardGrid>` not `<ProjectsGrid>`); types use `content` not `project` |
| 17. DNS swap timing | Launch | Domain added to Vercel BEFORE CNAME swap; SSL green post-swap |
| 18. Old braehods repo competes | Launch | `braehods.github.io` redirects to `braehods.com`; profile/bio links updated |
| 19. Formspree spam | Contact | Honeypot present; reCAPTCHA enabled; manual spam-payload test |
| 20. Coming soon / lorem placeholders | Launch | Pre-launch grep returns nothing |
| 21. Currently line stale | Hero, Launch | Single source `content/currently.ts`; calendar reminder |
| 22. Generic "passionate developer" copy | About | Banned-words grep clean; voice review |
| 23. First/third person inconsistency | About, Polish/SEO | Pre-launch voice audit |
| 24. Mobile broken at 320px | Foundation, all phases, Polish/SEO | Real-iPhone test; no horizontal scroll at 320px |
| 25. Hero portrait unoptimized | Hero | Hero image < 200KB; `next/image` with `priority`; LCP < 2.5s mobile |
| 26. Unnecessary `'use client'` | Foundation, all phases | First Load JS < 100KB on home; `next build` audit |
| 27. Hidden layout shift | Hero, all phases | CLS = 0 on every page |
| 28. Vercel cold start on contact | Contact | Edge Runtime declared; or direct-to-Formspree; loading state present |
| 29. Contact silent failure | Contact | Network-offline test surfaces error; email fallback visible |

---

## Multi-Audience Credibility Risk Map

A reminder that on this site, every audience is one click from leaving.

| Audience | Highest-Risk Pitfall | Why |
|---|---|---|
| Recruiter (mobile, 30 sec scan) | #24 (mobile broken), #20 (placeholder copy), #1 (low contrast) | They make a snap judgment in seconds; any visible flaw ends the visit |
| Investor (desktop, ~2 min) | #22 (generic copy), #21 (stale Currently), #14 (project data thin) | They're evaluating substance + taste; weak signals = no follow-up |
| Fellow builder (curious, may inspect) | #25 (slow images), #26 (bloated JS), #2 (perf issues) | They open DevTools and grade you on craft |
| Content viewer from IG/YT | #10 (broken OG share), #29 (contact fails), #18 (old site competing) | They're the casual share path — friction kills conversion |
| Future Braeden | #14 (data in components), #16 (tight coupling), #15 (no tokens) | All make adding /writing or new sections a refactor instead of a feature |

---

## Sources

- [Next.js — Metadata Files: opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — HIGH (official)
- [Next.js — generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — HIGH (official)
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — HIGH (official)
- [Next.js — App Router common mistakes (Upsun)](https://upsun.com/blog/avoid-common-mistakes-with-next-js-app-router/) — MEDIUM
- [Vercel — Cold start performance guide](https://vercel.com/kb/guide/how-can-i-improve-serverless-function-lambda-cold-start-performance-on-vercel) — HIGH (official)
- [Vercel — Avoiding duplicate content with vercel.app URLs](https://vercel.com/kb/guide/avoiding-duplicate-content-with-vercel-app-urls) — HIGH (official)
- [Formspree — Honeypot spam filtering](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering) — HIGH (official)
- [Formspree — How to prevent spam](https://help.formspree.io/hc/en-us/articles/360017735154-How-to-prevent-spam) — HIGH (official)
- [Formspree — Bot Detection Guide](https://formspree.io/blog/bot-detection/) — MEDIUM (official blog)
- [Motion (Framer Motion) — Accessibility guide](https://motion.dev/docs/react-accessibility) — HIGH (official)
- [Tatiana Mac — `prefers-reduced-motion` no-consent model](https://www.tatianamac.com/posts/prefers-reduced-motion) — MEDIUM (well-cited)
- [WebAIM — Contrast and Color Accessibility](https://webaim.org/articles/contrast/) — HIGH
- [BOIA — Dark mode doesn't satisfy WCAG contrast](https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements) — MEDIUM
- [Accessibility Checker — Designer's Guide to Dark Mode](https://www.accessibilitychecker.org/blog/dark-mode-accessibility/) — MEDIUM
- [UXPin — Build Accessible Modals with Focus Traps (2026)](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/) — MEDIUM
- [BrowserStack — Modal Focus Trap docs](https://www.browserstack.com/docs/accessibility/rules/assisted-test/modal-focus-trap) — MEDIUM
- [CSS-Tricks — Grainy Gradients](https://css-tricks.com/grainy-gradients/) — MEDIUM
- [Daniel Immke — Making Noisy SVGs](https://daniel.do/article/making-noisy-svgs) — MEDIUM
- [Speed Kit — Reducing layout shift with custom fallback fonts](https://www.speedkit.com/blog/reducing-layout-shift-with-custom-fallback-fonts) — MEDIUM
- [LogRocket — Next.js font optimization](https://blog.logrocket.com/next-js-font-optimization-custom-google-fonts/) — MEDIUM
- [Finisky Garden — Migrate GitHub Pages by 301 Redirects](https://finisky.github.io/en/migrate-github-pages-by-301-redirects/) — MEDIUM
- [Schema.org Validator (Nuxt SEO)](https://nuxtseo.com/tools/schema-validator) — HIGH (validation tool)
- [JSONLD.com — Person Schema examples](https://jsonld.com/person/) — MEDIUM
- [Userbrain — Lorem Ipsum Has to Die](https://www.userbrain.com/blog/lorem-ipsum-has-to-die/) — MEDIUM
- [DebugBear — Optimize Next.js Performance](https://www.debugbear.com/blog/nextjs-performance) — MEDIUM
- Personal knowledge: portfolio launch checklists, dev portfolio review patterns, recruiter-on-mobile observation
- Project context: `.planning/PROJECT.md` (anti-patterns, constraints, Formspree id, multi-audience requirement)

---
*Pitfalls research for: Editorial-dark personal portfolio (Next.js + MDX, replacing braehods.com)*
*Researched: 2026-05-07*
