# Phase 6 Visual Checklist — Combined P4 (28) + P5 (12) Dedup'd

**Source:** Dedup'd from `04-01-SUMMARY.md` § Phase 6 Carry-Forwards (28 items) + `05-03-SUMMARY.md` § Phase 6 Carry-Forwards (12 items) per CONTEXT D-08.

**Target:** All sections 1–5 must be 100% ✓ on the deployed preview URL before Plan 06-01 exits. Sections 6 + 7 are **deferred to Plan 06-02** (the 404 page is shipped by Plan 06-02; OG image surfaces are shipped by Plan 06-02). They're listed here for completeness so the user walks a single combined sweep at Plan 06-02 exit, not two.

**Preview URL (Plan 06-01 W2 deploy):** `https://braeden-site-evecb9bdz-bwaedens-projects.vercel.app`

**Row taxonomy** (per UI-SPEC § "Assertion shape per row"):
- `visual` — observable visual property at a viewport
- `interaction` — element + action → expected outcome
- `screen-reader` — SR walk-through announces an expected phrase (**Plan 06-01: SKIP** — NVDA + VoiceOver audit is owned by Plan 06-02. Rows marked accordingly.)
- `responsive` — surface renders cleanly at viewport-px with no horizontal scroll

---

## Section 1 — Chrome (Nav + Footer) — 5 items

- [ ] visual Nav: monogram aligns vertically with the link row at 1280px (cap height matches link baseline)
- [ ] interaction Nav mobile hamburger (Pixel 5 ~393px): tap `<details>` summary → 4 links (Home, About, Work, Contact) become visible
- [ ] interaction Nav link focus: Tab through Nav → 2px accent `:focus-visible` ring appears around each link in sequence
- [ ] interaction Nav "Contact" link: click → `#contact` hash applied AND ContactModal `<dialog>` opens with Name input focused
- [ ] visual Footer: monogram size, copyright `© 2026 Braeden Hodson`, social icons (IG + GH), "View source" link, "braehods.com" text all present and aligned

## Section 2 — `/` (Home) — 8 items

- [ ] visual `/` hero photo: renders without flash (LCP element; no late-paint jump)
- [ ] visual `/` Fraunces "Braeden" wordmark: renders in serif headline weight, no font-swap shift
- [ ] visual `/` CurrentlyLine: accent dot + body copy + Mono date suffix all on one line at desktop
- [ ] interaction `/` ChannelButton row (IG button): hover → hairline border transitions to accent + arrow glyph translates +2px right
- [ ] interaction `/` CTAArrowLink to `/about`: click → navigates to `/about` route with view-transition (or no jank if fallback)
- [ ] interaction `/` CTAArrowLink to `/work`: click → navigates to `/work` route
- [ ] responsive `/`: renders cleanly at 320px viewport with no horizontal scroll
- [ ] visual `/` on-load stagger: hero + CurrentlyLine + ChannelButton row + CTAs fade in with 80ms stagger between each (defeated by `prefers-reduced-motion: reduce`)

## Section 3 — `/about` — 5 items

- [ ] visual `/about` desktop (≥768px): two-column composition (text left, photo right) renders without overlap
- [ ] responsive `/about`: collapses to single-column at <768px with photo above OR below text per Phase 3 design
- [ ] visual `/about` bio prose: paragraphs read without AI-template clichés (no "passionate", "love to learn", "driven by", "innovative", "cutting-edge", "lifelong learner", "wear many hats", "results-oriented", "outcome-driven")
- [ ] interaction `/about` "Get in touch →" CTA: click → `#contact` hash applied AND ContactModal opens
- [ ] visual `/about` photo: treatment matches the home hero photo (same crop, same charcoal compositing, no second-look "is that a different person?" effect)

## Section 4 — `/work` — 8 items

- [ ] visual `/work` desktop (1280px): 7-card grid renders with CapitolLens in row 1 col 1
- [ ] visual `/work` desktop: 2-column grid with archived `braehods.com (v0)` orphan card in row 4 col 1 (right cell empty per D-06)
- [ ] responsive `/work`: collapses to 1-col mobile (<768px) with all 7 cards stacked vertically, no horizontal scroll at 320px
- [ ] interaction `/work` any card hover: hairline border `#2a2a2f` → accent `#7c87ff` + ↗ glyph translates +2px right (no card lift)
- [ ] visual `/work` every card: status dot (4 colors per D-09: shipped #7c87ff, paper-trading #c8a86a, in-dev #a8a8a8, archived #707070) + lowercase exact-schema label rendered
- [ ] visual `/work` archived card: `#707070` dot reads as a deep grey ≥3:1 against `#1a1a1f` charcoal (numeric WebAIM ratio captured separately in 06-01-SUMMARY)
- [ ] visual `/work` every card: tags line comma-joined (e.g., "trading, tools") in muted color below description
- [ ] interaction `/work` every card title row: hover → external `↗` glyph translates right (`group-hover:translate-x-0.5`)

## Section 5 — ContactModal — 8 items

- [ ] interaction ContactModal trigger from Nav: click "Contact" → modal opens, Name input focused (verifies hash + click-listener path)
- [ ] interaction ContactModal trigger from `/about`: click "Get in touch →" CTA → modal opens (same path, different entry)
- [ ] interaction ContactModal focus trap: Tab + Shift+Tab while modal open → focus cycles inside dialog only (does NOT escape to Nav links underneath)
- [ ] interaction ContactModal ESC: press ESC → modal closes + `#contact` hash cleared from URL + focus returns to the original trigger link
- [ ] visual ContactModal fields: Name + Email + Message all show labels with required-asterisk `*` markers; placeholders + autocomplete attrs set
- [ ] visual ContactModal char counter: type Message past 800 chars → counter color transitions from rest grey to amber `#c8a86a` (numeric WebAIM ratio captured separately in 06-01-SUMMARY)
- [ ] interaction ContactModal submit success: complete form + wait 1500ms + click Send → fields show submitting state then success copy `Thanks — I'll get back to you within a day or two.` replaces form; "Send another →" link visible
- [ ] visual ContactModal mailto fallback: `Or just email me directly →` link rendered in BOTH idle and success branches; the `→` glyph is rendered via CSS `::after` pseudo-element (not a child `<span>`) and translates +2px right on hover

## Section 6 — 404 — 3 items (DEFERRED to Plan 06-02 — `app/not-found.tsx` ships there)

> **Verified after Plan 06-02 ships the SEO surfaces.** Listed here so the Plan 06-02 visual sweep walks one combined checklist, not two.

- [ ] visual 404 page (`/this-route-does-not-exist`): renders with full chrome (Nav + Footer) + centered monogram + Fraunces "Page not found" heading + body line "Try /about or /work — or get in touch if you were looking for me." + "← Back home" return link
- [ ] interaction 404 page inline `get in touch` text: click → ContactModal opens (same hash path as Nav)
- [ ] interaction 404 page "← Back home" return link: click → navigates to `/` route

## Section 7 — OG sharing — 3 items (DEFERRED to Plan 06-02 — OG image routes ship there)

> **Verified after Plan 06-02 ships the SEO surfaces.** Listed here so the Plan 06-02 visual sweep walks one combined checklist, not two.

- [ ] visual `/` OG: paste preview URL in Slack/iMessage → static 1200×630 PNG renders with Fraunces "Braeden" wordmark + monogram on charcoal gradient
- [ ] visual `/about` OG: paste `<preview>/about` → dynamic ImageResponse renders with "About" title in Fraunces 700 on charcoal
- [ ] visual `/work` OG: paste `<preview>/work` → dynamic ImageResponse renders with "Work" title in Fraunces 700 on charcoal

---

## Walk Instructions (for the gate)

1. Open the preview URL on desktop Chrome at default zoom (100%).
2. Walk Sections 1 → 5 in order. Mark each row `[ ]` → `[x]` if PASS, `[ ]` → `[✗]` if FAIL.
3. For any `[✗]`: screenshot to `.planning/phases/06-polish-seo-launch/visual-checklist-failures/<row-id>.png` (path optional — paste into SUMMARY if cheaper).
4. Skip Sections 6 + 7 — those are Plan 06-02's gate.
5. Skip any `screen-reader` rows — those are Plan 06-02's gate (NVDA + VoiceOver audit).
6. Report outcome as: `visual-clean: <N>/<TOTAL>` where TOTAL excludes deferred + screen-reader rows. With sections 1–5 active and no SR rows in those sections, TOTAL = 34.

---

*Generated by Plan 06-01 W2 Task 7 (D-08 single-combined-sweep emission). Walk gate is Plan 06-01 W2 Task 8.*
