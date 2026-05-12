# Phase 3: About Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-12
**Phase:** 3-about-page
**Areas discussed:** Bio content + voice, Page layout, CTA approach + placement, Photo + current-focus details

---

## Bio content + voice

### Bio copy authorship

| Option | Description | Selected |
|--------|-------------|----------|
| Draft a first pass | Claude writes a 2-3 paragraph draft (~150-250 words = 60-second read) using memory; user edits | ✓ |
| User provides the prose | User pastes the bio copy during execution; Claude structures the page around it | |
| One-liner + extend later | Ship v1 with one substantial paragraph (~80 words); user expands later | |

**Notes:** User chose first-pass draft for speed. CONTEXT.md D-01 reflects this — Claude drafts at execution time, user edits in-place.

### Bio voice

| Option | Description | Selected |
|--------|-------------|----------|
| Warm + personal | First-person, conversational, hints at curiosity beyond the resume | ✓ |
| Dry + minimal | Third-person or no-pronoun, factual, brittanychiang.com / rauno.me terseness | |
| Earnest + ambitious | First-person, leans into "why I'm building things" — riskier but more memorable | |

**Notes:** Warm + personal matches the editorial-dark restrained-craft aesthetic. Captured in CONTEXT.md D-02.

### Bio coverage (multi-select)

| Option | Description | Selected |
|--------|-------------|----------|
| Current projects (CapitolLens, shorts, dev tools) | Names what user is actively building | ✓ |
| School + studies (business) | Adds context for recruiter audience | ✓ |
| Origin / why you build | Personality > resume, optional warmth | |
| Open to / looking for | Explicit invitation, lowest-friction conversion | ✓ |

**Notes:** Three of four selected. User explicitly excluded "Origin / why you build" — resume-anchored over personality-narrative. Captured in CONTEXT.md D-03 (3 buckets) + D-04 (explicit exclusion).

---

## Page layout

### Layout structure

| Option | Description | Selected |
|--------|-------------|----------|
| Two-column (mirrors home hero) | Photo right, text left; mobile flex-col-reverse | ✓ |
| Single-column scroll | Photo at top centered (160px), bio in narrow column below | |
| Hero-style band + sectioned content | Hero band + Building / Studying / Open to sections below | |

**Notes:** User selected the side-by-side option specifically to maximize the shared-element transition feel from / → /about. Capt CONTEXT.md D-07.

### Text width

| Option | Description | Selected |
|--------|-------------|----------|
| Narrow (max-w-[44ch]) | Matches home positioning subhead width; editorial | ✓ |
| Medium (max-w-prose, ~65ch) | Tailwind default for long-form | |
| Wider (max-w-2xl, ~80ch) | Resume-ish, sectioned content friendly | |

**Notes:** Captured in CONTEXT.md D-09.

---

## CTA approach + placement

### CTA visual style

| Option | Description | Selected |
|--------|-------------|----------|
| Text-link with arrow | Reuse CTAArrowLink (D-19) — quiet, on-brand | ✓ |
| Pill button | Reuse ChannelButton-style hairline pill — stronger weight | |
| Both — inline text-link + pill at bottom | Two paths, higher conversion at elegance cost | |

**Notes:** Captured in CONTEXT.md D-12.

### CTA target in v1

| Option | Description | Selected |
|--------|-------------|----------|
| Link to / (placeholder, matches Nav) | Phase 5 wires modal globally; until then, link to / | ✓ |
| Link to mailto:fakegoat1@gmail.com directly | Works immediately but bypasses Formspree (project constraint) | |
| Hidden until Phase 5 | Drop CTA from v1 /about; loses ABOUT-03 compliance | |

**Notes:** Captured in CONTEXT.md D-15. Phase 5 carry-forward documented: href="/" swaps to modal trigger atomically across Nav + /about CTA when Phase 5 lands.

---

## Photo + current-focus details

### Shared-element transition

| Option | Description | Selected |
|--------|-------------|----------|
| Same photo + view-transition-name | Browsers with API show smooth cross-route transition; graceful degradation elsewhere | ✓ |
| Same photo, no transition seam | Skip the seam if it turns out flaky on Safari | |
| Different photo (e.g., casual /about) | Loses shared-element opportunity entirely | |

**Notes:** Confirms Phase 2's deliberate setup (HeroPhoto comment anticipated /about wiring the matching name). Captured in CONTEXT.md D-16, D-17.

### Current focus + location surfacing

| Option | Description | Selected |
|--------|-------------|----------|
| Weave both into bio prose | No separate Currently block, no metadata strip — single narrative | ✓ |
| Separate Currently block (reuse home component) | Duplicates the home signal but anchors "today" on /about | |
| Labeled metadata strip (Currently / Location / Open to) | Resume-ish, scannable, separate from bio prose | |

**Notes:** Captured in CONTEXT.md D-18, D-19. Home page's CurrentlyLine is the rolling "today" surface; /about is the durable identity page.

---

## Claude's Discretion

Items where the user deferred to Claude's judgment during planning/execution (per CONTEXT.md "Claude's Discretion" section):

- Reuse `<HeroPhoto />` directly vs. factor a `<PortraitTile>` shared abstraction
- Exact paragraph splits in the bio (2 vs 3 paragraphs)
- CTA text exact wording within the "Get in touch / Drop me a line / Say hi" range (per D-13)
- Stagger indices for the new content blocks (photo NOT animated per D-24; bio paragraphs stagger 1/2/3; CTA stagger 4)
- Whether the photo sits left or right on desktop (visual balance call; mobile photo-on-top is locked via `flex-col-reverse`)
- Whether to add a Phase 3 SUMMARY.md note that /about is the first stagger of cross-route transition testing

## Deferred Ideas

Ideas raised or considered during discussion but pushed out of Phase 3 scope:

- Sectioned content (Currently / Location / Open to metadata strip) — rejected per D-18; could resurface in a future v1.x pass.
- Photo treatment variations (different /about portrait, casual vs professional pair) — deferred to Phase 6 design pass (D-01 carry-forward).
- "Origin / why I build" narrative paragraph — explicit user exclusion in Phase 3.
- Press / LinkedIn / résumé download — out of scope for v1 portfolio aesthetic; deferred indefinitely.
- `/about/[slug]` sub-routes — no plan for sub-pages.
- Resume/CV download button — same.
- First-cross-route-transition visual validation — automated spec asserts both sides carry the matching `view-transition-name`; subjective transition quality verification deferred to Phase 6 polish or user manual testing during /about execution.
