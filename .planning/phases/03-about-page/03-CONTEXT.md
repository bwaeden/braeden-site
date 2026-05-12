# Phase 3: About Page - Context

**Gathered:** 2026-05-12
**Status:** Ready for planning

<domain>
## Phase Boundary

`/about` route replaces the Phase 2 "Coming soon." stub with a short bio in Braeden's voice, surfaces location + current focus, and offers a friendly nudge toward the contact modal. Visitors who clicked through from `/` or directly land here finish the page in under 60 seconds with a clear "follow up with him" impulse.

**In scope (Phase 3):**
- Replace `app/about/page.tsx` body with real content
- Reuse `<HeroPhoto />` (or near-identical wrapper) with matching `view-transition-name: hero-photo` for cross-route shared-element transition with `/`
- Two-column layout mirroring home hero (photo right, text left desktop; photo top, text below mobile via `flex-col-reverse`)
- ~150-250 word bio in warm + personal first-person voice
- `<CTAArrowLink>` "Get in touch →" pointing to `/` placeholder (Phase 5 wires the modal)

**Out of scope (Phase 3 — deferred to later phases):**
- Modal trigger wiring (Phase 5 owns CTCT-01..07)
- Real-photo replacement (Phase 6 v1.x design pass; current `public/portrait.jpg` is the v1 placeholder per D-04)
- `/about/[whatever]` sub-routes
- LinkedIn / press links / résumé download

</domain>

<decisions>
## Implementation Decisions

### Bio Content + Voice
- **D-01:** Claude drafts a first-pass `~150-250 word` bio in execution; user edits in-place during the plan-phase or execute-phase review. No "I'll provide later" placeholder — first commit ships real prose so the Vercel preview shows a real page.
- **D-02:** Voice = **warm + personal, first-person** ("Hi, I'm Braeden — I build…"). Conversational, hints at curiosity beyond the resume. Consistent with the editorial-dark, restrained-craft aesthetic. NOT dry/minimal third-person. NOT earnest/why-I-build (explicit user exclusion).
- **D-03:** Bio coverage = **3 buckets**, ordered:
    1. **Who + where + studying** — opening sentence anchors identity (name, location LA, business student).
    2. **Current projects** — names CapitolLens (Form 4 insider-buy signals, paper-trading), the two-channel YT Shorts brand (stories + meme reactions), developer tools (GSD, shorts-factory, meme-dashboard, reel-research-agent). Specific projects > generic categories.
    3. **Open to / looking for** — explicit invitation (e.g., "open to trading-desk internships, content collabs, or just a chat about what's working in AI-finance"). Lowest-friction conversion signal.
- **D-04:** Bio **explicitly excludes** the "Origin / why I build" content bucket (resume-anchored over personality-narrative per user choice). No biographical backstory paragraph.
- **D-05:** ABOUT-01 ban on AI-template phrases is binding — copy MUST NOT contain "passionate developer," "I love to learn," "I am driven by," "innovative," "cutting-edge," "I am a [role] with experience in [list]," or other recruiter-resume-template language. Draft passes a manual cliché scrub before commit.
- **D-06:** Length target = **150-250 words / ~60-second read** (ABOUT-04). Split into **2-3 short paragraphs** (not one wall, not labeled sections). Each paragraph ≤4 sentences.

### Page Layout
- **D-07:** Layout = **two-column mirroring home hero**. Desktop: text-column left, photo right via `md:flex-row` (or `md:flex-row-reverse` — Claude's discretion based on visual balance during execution). Mobile: photo on top, text below via `flex-col-reverse` (matches home pattern from `components/home/Hero.tsx`). Maximizes the shared-element transition feel from `/` → `/about` (the photo "stays put" visually while text content swaps).
- **D-08:** Photo dimensions match home hero: **240×240 mobile (`w-60 h-60`), 320×320 desktop (`w-80 md:w-80`)**. Same `<Image>` props as home (`priority`, `placeholder="blur"`, `quality={90}`, static portrait import). Reuse `<HeroPhoto />` directly OR factor a thin shared `<PortraitTile>` component if the photo wrapper needs slightly different framing on /about (e.g., no `data-test="hero-photo-tile"`). Decision left to planning.
- **D-09:** Text-column reading width = **`max-w-[44ch]`** — matches the home positioning subhead width per UI-SPEC. ~44 characters per line is optimal-reading-length per typography research. Forces concise prose. Reads editorial.
- **D-10:** Page outer container inherits `max-w-3xl` from `app/layout.tsx` root layout — same as `/about`'s current stub. Hero-style wider container (`max-w-5xl`) used by home is NOT extended to /about (home is the only page warranting wider treatment).
- **D-11:** Vertical rhythm follows **CD-05 tokens** from Phase 1/2 — `py-8 md:py-12` section padding, `mt-4` / `mt-6` / `mt-8` between content blocks. Same scale as `<Hero />`.

### CTA Approach + Placement
- **D-12:** CTA visual = **reuse `<CTAArrowLink>` from `components/home/CTAArrowLink.tsx`** (D-19 accent text-link with arrow glyph + hover-translate). Quiet, on-brand, consistent with home CTAs. NOT a pill button (D-12 ChannelButton style is for external links). NOT both-styles (visual noise).
- **D-13:** CTA text = **"Get in touch →"** (first-pass; user may edit during execution to a more specific verb like "Drop me a line →" or "Say hi →" — within the warm+personal voice). Lowercase or sentence case TBD by Claude's discretion.
- **D-14:** CTA placement = **end of bio prose** (single CTA after the last paragraph). NOT inline-woven into a sentence (loses the obvious-CTA effect). NOT duplicated (top + bottom redundant for a 60-second-read page).
- **D-15:** CTA target v1 = **`/`** (same placeholder as Nav "Contact" link per Phase 2 plan 02-04 carry-forward). Phase 5 wires the actual modal trigger globally; at that point the `href="/"` swaps to `href="#contact"` (or button-with-onclick) atomically across Nav + /about CTA. Documented as a Phase 5 carry-forward.

### Photo + Current Focus
- **D-16:** Photo source = **same `public/portrait.jpg` as home** (the v1 placeholder copied from `~/Projects/braehods/images/photo.jpg` per D-04 in Phase 2). Phase 6 design pass swaps both / and /about portraits atomically. NOT a separate /about portrait in v1.
- **D-17:** Shared-element transition = **YES, matching `view-transition-name: hero-photo` wrapper on /about's photo**. Phase 2's `HeroPhoto` component already carries the seam (`style={{ viewTransitionName: 'hero-photo' }}` per D-21/D-22 in Phase 2). Phase 3 must wire the matching name on the /about side so browsers supporting the View Transitions API render a smooth photo transition during `/` ↔ `/about` navigation. Browsers without API support (older Safari) get standard navigation — graceful degradation. NO project-wide `<ViewTransition>` root wrapper (preserves D-22 per-element-seam discipline from Phase 2).
- **D-18:** Current-focus surfacing = **woven into bio prose, no separate Currently block, no labeled metadata strip**. Bio paragraph 2 covers "what I'm building right now" with the project names. Home page's `<CurrentlyLine>` is the rolling "today" surface; /about is the more durable identity page. NOT reusing `<CurrentlyLine>` on /about (duplicates the home signal and adds visual noise). NOT a sectioned `Currently / Location / Open to` metadata strip (more resume-ish than warm+personal voice wants).
- **D-19:** Location surfacing = **inline in bio prose** ("...in LA..." or "...based in Los Angeles..." — natural mention in paragraph 1). NOT a dedicated `Location: LA` line. NOT pulled from a typed data field — static prose suffices for one location string.

### Claude's Discretion (during execution)
- Whether to reuse `<HeroPhoto />` directly or factor a `<PortraitTile>` shared abstraction (depends on whether /about wants different `data-test` selectors, different aria-labels, etc.)
- Exact paragraph splits in the bio (2 vs 3 paragraphs)
- CTA text exact wording within the "Get in touch / Drop me a line / Say hi" range (per D-13)
- Stagger indices for the new content blocks (continue the home pattern: photo NOT animated per D-24; bio paragraphs stagger 1/2/3; CTA stagger 4)
- Whether the photo sits left or right on desktop (visual balance call; mobile is locked to photo-on-top via `flex-col-reverse`)
- Whether to add a Phase 3 SUMMARY.md note that /about is a candidate for the first stagger of cross-route transition testing (verifies the D-21 seam works end-to-end)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project + Requirements
- `.planning/PROJECT.md` — Core value (visual polish #1, contact-conversion #2), stack constraints, anti-patterns
- `.planning/REQUIREMENTS.md` § About Page (ABOUT-01..04) — locked requirements, esp. ABOUT-01 ban on AI-template copy
- `.planning/ROADMAP.md` § Phase 3 — phase goal, success criteria, dependencies on Phase 2

### Phase 2 carry-forwards (the most load-bearing prior context)
- `.planning/phases/02-home-page/02-CONTEXT.md` — D-01..D-25 design decisions from Phase 2 (many apply: D-22 per-element view-transition discipline; D-25 zero `'use client'`; CD-04/05 layout + rhythm tokens)
- `.planning/phases/02-home-page/02-UI-SPEC.md` — UI design contract (max-w-[44ch], py-8 md:py-12, the full vertical rhythm system)
- `.planning/phases/02-home-page/02-SUMMARY.md` — Phase 2 retrospective; carry-forwards section explicitly names "/about should wire matching view-transition-name: hero-photo on its portrait" as a Phase 3 task
- `.planning/phases/02-home-page/02-SCOPE-AMENDMENT.md` — Instagram + GitHub only (no YouTube anywhere); applies if Phase 3 prose mentions channels

### Reusable Phase 2 source files
- `components/home/HeroPhoto.tsx` — reusable as-is OR factor into `<PortraitTile>` shared component (D-08 decision)
- `components/home/CTAArrowLink.tsx` — reuse for the "Get in touch →" CTA (D-12)
- `components/home/Hero.tsx` — pattern reference for two-column flex layout (D-07)
- `lib/motion.ts` — `stagger(N)` seam for content fade-ins
- `app/about/page.tsx` — current "Coming soon." stub from Plan 02-05; this phase replaces its body
- `data/site.ts` — `site.tagline` (home positioning) can inform bio paragraph 1 phrasing; `site.socials` populated for any inline social mentions
- `data/currently.ts` — NOT consumed by /about per D-18 (current focus woven into prose instead), but exists for cross-reference

### Phase 1 invariants still binding
- `.planning/phases/01-foundation-design-tokens/01-PLAN.md` — FOUND-07 (single client island for ContactModal — /about is Server Component), DSGN-01..09 (token system), the focus ring + reduced-motion contract
- `CLAUDE.md` — stack inventory, font system (Fraunces 700 + Geist Sans 400), animation approach (CSS-only)

### Memory (cross-project user context that informs voice)
- `feedback_reel_cta_dm_format.md` — IG CTA = "DM me" (relevant if bio mentions Instagram channel)
- `reference_lucide_brand_icons.md` — Lucide brand-icons gone; inline-SVG via currentColor (relevant only if /about surfaces social icons)
- `project_capitollens_form4_strategy.md` — current trading focus = MEDIUM-tier Form 4 insider buys, 180d hold (informs project description in bio paragraph 2)
- `project_two_channel_split.md` + `project_shorts_factory.md` + `project_meme_dashboard.md` + `project_reel_research_agent.md` — content brand + tooling context for bio paragraph 2

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`<HeroPhoto />`** (`components/home/HeroPhoto.tsx`) — Server Component, 320×320 + view-transition-name + blur placeholder + priority + quality=90. Direct reuse on /about OR refactor pivot point.
- **`<CTAArrowLink>`** (`components/home/CTAArrowLink.tsx`) — accent text-link with `→` glyph + hover-translate + `staggerIndex` prop. Reuse for /about CTA.
- **`<Hero>`** (`components/home/Hero.tsx`) — pattern reference for the two-column flex + stagger composition; /about's `<AboutContent>` (or whatever it's named) follows the same shape with different children.
- **`lib/motion.ts stagger(N)`** — fade-in seam, accepts a numeric index, returns CSS custom property `--stagger`.
- **`app/layout.tsx`** — Nav + Footer chrome wraps every page; /about inherits automatically. `max-w-3xl mx-auto px-6` container is the established root.

### Established Patterns
- Server Components by default (FOUND-07 / D-25) — zero `'use client'` in `app/`, `components/`, `lib/`, `data/`. /about adds zero client directives.
- Per-element view-transition seam only (D-22) — no root `<ViewTransition>` wrapper. /about applies the seam on its photo wrapper, not on the page or layout.
- CD-05 vertical rhythm — `py-8 md:py-12` page padding, `mt-4`/`mt-6`/`mt-8` content gaps.
- Two-weight typography — Fraunces 700 (display) + Geist Sans 400 (body). No `font-medium`, no `font-bold`. Geist Mono for metadata only.
- `target="_blank" rel="noopener noreferrer"` on every external `<a>` (tabnabbing per T-02-XX).
- `transition-[color]` on currentColor inheritors (Phase 2 Tailwind v4 lesson — avoid `transition-colors` shorthand bleeding into `outline-color`).

### Integration Points
- `app/about/page.tsx` — replaces the 5-line "Coming soon." Server Component (Plan 02-05) with the new bio + photo composition.
- `data/site.ts` (read-only on /about) — tagline + socials available if bio prose references them inline.
- Spec file additions — Phase 3 likely needs 2-3 new spec files: `tests/about-renders.spec.ts` (bio + photo + CTA locators present + zero AI-template phrases like `/passionate/i`), `tests/about-photo-shared-transition.spec.ts` (matching `view-transition-name`), `tests/about-cta-target.spec.ts` (CTA resolves + has correct placeholder href).

</code_context>

<specifics>
## Specific Ideas

- **Phrase to avoid:** explicit ABOUT-01 ban on "passionate developer" / "I love to learn" / "I am driven by" / "innovative" / "cutting-edge" / "I am a [role] with experience in [list]" template language. Draft cliché-scrub before commit.
- **Phrase to weave in:** Memory `feedback_reel_cta_dm_format.md` says IG = "DM me" not "follow me" — if bio mentions Instagram, it's "DM @braehods" not "follow on IG."
- **Project specifics for bio paragraph 2** (per memory):
    - CapitolLens — Form 4 insider-buy signals, paper-trading, +18%/yr Sharpe 0.93 on MEDIUM tier (don't claim live trading yet — user is paper-only)
    - Two-channel YT Shorts strategy — Channel A = wholesome POV stories, Channel B = single-meme deadpan reads
    - Dev tools — GSD (a Claude Code skill suite — sophisticated framing), shorts-factory (Remotion CLI for Dam-style shorts), meme-dashboard (Streamlit backtest scorer), reel-research-agent (Streamlit AI-news drafting tool)
- **Photo wrapper alt text:** Same as home — `alt="Braeden Hodson"`. Not "Headshot of Braeden" or "Picture of myself" (over-described).
- **Tab order on /about:** Nav (4 links) → CTA "Get in touch →" → Footer socials. /about has no internal interactive elements beyond Nav, Footer, and the single CTA.

</specifics>

<deferred>
## Deferred Ideas

- **Sectioned content (Currently / Location / Open to metadata strip)** — considered, rejected per D-18. Future v1.x pass could add a small structured-data block if recruiter-skim audience grows; for now, prose covers it.
- **Photo treatment variations** (different /about portrait, casual vs professional pair) — deferred to Phase 6 design pass (D-01 carry-forward from Phase 2).
- **"Origin / why I build" narrative paragraph** — explicit user exclusion in Phase 3 discuss. May land in a future "Notes" or "Writing" section if /writing ever ships.
- **Press / LinkedIn / résumé download** — out of scope for v1 portfolio aesthetic; deferred indefinitely.
- **`/about/[slug]` sub-routes** — no plan for sub-pages on /about; deferred indefinitely.
- **Resume/CV download button** — same.
- **First-cross-route-transition validation testing** — /about is the first real test of the D-21/D-22 view-transition seam. Phase 3 plan should include a spec asserting the matching `view-transition-name` exists on both sides; visual verification of the actual transition is deferred to Phase 6 polish or to user manual testing during /about execution.

### Reviewed Todos (not folded)

None — no pending `.planning/todos/` items match Phase 3 scope as of context-gathering date.

</deferred>

---

*Phase: 3-about-page*
*Context gathered: 2026-05-12*
