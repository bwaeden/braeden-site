# Phase 2: Home Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-05-11
**Phase:** 2-Home Page
**Areas discussed:** Hero composition, Positioning copy, Routes to /about & /work (+ view-transitions)

---

## Hero composition

### Photo placement

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side | Photo on one side, name + positioning + Currently stacked on the other. Desktop magazine pattern; brittanychiang.com energy. On mobile, photo moves above text. | ✓ |
| Stacked, centered | Photo on top, monogram + name + positioning below, all center-aligned. Symmetric, minimal, more 'profile card.' | |
| Editorial: big wordmark left, small photo top-right | Name and Currently dominate the left column; small portrait floats top-right. Closest to rauno.me energy. | |
| No photo on home | Save the photo for /about. Home becomes pure typography + monogram + Currently. | |

**User's choice:** Side-by-side
**Notes:** Recommended option taken. Drives the most familiar editorial-portfolio first impression.

### Photo treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Hairline border + retain color | 1px solid `var(--color-border)` (#2a2a2f), small inner padding, slightly rounded (4-6px). Editorial 'tile' look. | ✓ |
| Desaturated + soft vignette | B&W or low-saturation, subtle radial vignette to charcoal edges. More editorial-mag. | |
| Rounded square, no border | 12-16px corner radius, full color, no border. Modern app-card feel. | |
| Floats, no chrome | Color image, no border, no rounding, just sits on charcoal. | |

**User's choice:** Hairline border + retain color
**Notes:** Most consistent with the editorial-dark palette locked in Phase 1.

### Above-the-fold stacking order

| Option | Description | Selected |
|--------|-------------|----------|
| Name → positioning → Currently → channels → CTAs to /about & /work | Classic portfolio order. | ✓ |
| Name → Currently → positioning → channels → CTAs | Status pinned closer to the name — 'active builder' signal lands first. | |
| Name → positioning → channels → Currently as a footer-of-hero line | Currently treated as a quiet sign-off under the hero. | |

**User's choice:** Name → positioning → Currently → channels → CTAs

### Display name treatment

| Option | Description | Selected |
|--------|-------------|----------|
| "Braeden" only | Matches Phase 1's hero word. Monogram + Nav surname carry the full identity. | ✓ |
| "Braeden Hodson" full | Both names in serif, balanced. More formal. | |
| "Braeden" big + "Hodson" small/muted below | Editorial flourish — first name dominates, surname in muted sans below. | |

**User's choice:** "Braeden" only
**Notes:** Preserves the wordmark established in Phase 1; resolves PITFALLS Pitfall 5 (wordmark vs monogram fight) since the monogram lives in Nav/Footer/favicon, the wordmark lives in the hero only.

### Photo side (side-by-side follow-up)

| Option | Description | Selected |
|--------|-------------|----------|
| Right (text left) | Eye lands on name first, then photo as the credibility tile. Western reading pattern. | ✓ |
| Left (text right) | Photo introduces, then text fills in. | |

**User's choice:** Right (text left)

### Photo size

| Option | Description | Selected |
|--------|-------------|----------|
| Medium tile (~280-320px square) | Big enough to read the face, small enough that the wordmark dominates. | ✓ |
| Small portrait (~180-220px) | Photo is a credibility checkmark; wordmark fully dominates. | |
| Large feature (~400px+) | Photo is co-equal with the wordmark. | |

**User's choice:** Medium tile (~280-320px square)

---

## Positioning copy

### Choose the one-liner

| Option | Description | Selected |
|--------|-------------|----------|
| PROJECT.md draft (verbatim) | "Business student and entrepreneur in LA, building things and running a small content brand." Safe, multi-audience. | ✓ |
| Tighter / punchier | "Builder and entrepreneur in LA. Trading systems, short-form content, side projects." | |
| Two-line editorial | "Building in Los Angeles. / Trading systems, short-form content, side projects." | |
| LinkedIn-formal | "Business student at [school], builder of trading systems and short-form content. Based in Los Angeles." | |

**User's choice:** PROJECT.md draft (verbatim)

### Tone bias (for future iterations)

| Option | Description | Selected |
|--------|-------------|----------|
| Concrete (names of things you build) | Trades a bit of mystery for clarity. | |
| Vague but evocative | "Building things in Los Angeles" — lets the projects grid do the explaining. | |
| Aspirational / mission-ish | Framing-forward. Strong if it lands; preachy if it doesn't. | ✓ |

**User's choice:** Aspirational / mission-ish

### "Business student" framing?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — keep the student framing | Useful credential signal for recruiters. | |
| No — just builder/entrepreneur | Reads more confident, less 'in-school.' | ✓ |
| Mention school by name | Adds 'at [USC / UCLA / etc]' — most concrete credential. | |

**User's choice:** No — just builder/entrepreneur

### Conflict resolution

| Option | Description | Selected |
|--------|-------------|----------|
| Ship the PROJECT.md draft verbatim | Honor Q1. Treat the tone biases as 'for future iterations only.' | ✓ |
| Drop 'business student'; aspirational rewrite | Honor Q2 + Q3. Draft 2-3 aspirational alternates. | |
| Punt to Wave 3 / copy pass | Lock the structure, defer the exact wording. | |

**User's choice:** Ship the PROJECT.md draft verbatim
**Notes:** Q1 wins for v1 execution. Q2 + Q3 captured as deferred guidance (D-08 in CONTEXT.md) for a future copy pass — the line ships unchanged in Phase 2 but the next rewrite is steered.

---

## Routes to /about & /work (+ view-transitions)

### Stub-route strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Stub minimal pages now in Phase 2 | Create `app/about/page.tsx` and `app/work/page.tsx` as placeholder bodies wearing Nav/Footer chrome. | ✓ |
| Link anyway, accept 404 on preview | Reviewers see broken links until Phases 3-4 land. | |
| Hide CTAs until target pages exist | Phase 2 omits the CTAs; Phase 3 adds /about CTA. | |
| Link to in-page anchors (#about, #work) | Throwaway markup; rewire later. | |

**User's choice:** Stub minimal pages now in Phase 2
**Notes:** Preserves the home → /about/work flow on every preview deploy from Phase 2 onward. No reviewer ever clicks a dead link.

### View-transition v1 scope (ROADMAP HOME-05 vs FEATURES.md row 64 conflict)

| Option | Description | Selected |
|--------|-------------|----------|
| Ship the seam in Phase 2, activate fully when /about lands | Add `view-transition-name: hero-photo` to home photo. Phase 3 adds matching name on /about photo. Browser-native, graceful no-op. | ✓ |
| Defer entirely to v2 per FEATURES.md | No view-transition wiring in v1. Modify HOME-05. | |
| Full view-transitions for ALL route changes in v1 | Wrap root layout in `<ViewTransitions>`. Larger blast radius. | |

**User's choice:** Ship the seam in Phase 2, activate fully when /about lands
**Notes:** Resolves the FEATURES.md (v2) vs ROADMAP HOME-05 (v1) conflict in ROADMAP's favor. FEATURES.md row 64 needs an update note.

### Hero CTA prominence

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle text-links inline, below channels | Accent-colored text links with `→` glyph. Editorial, restrained. | ✓ |
| Pill buttons — same treatment as channel buttons | Visual parity with channel-link block. | |
| Skip dedicated CTAs — rely on nav | Cleanest hero; lower CTR. | |

**User's choice:** Subtle text-links inline, below channels

---

## Data-supply strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Note as Wave-0 user-input task | CONTEXT.md flags missing values; executor pings user for IG handle/URL, YT handle/URL, GitHub URL before W2-T1. | ✓ |
| User pastes them now | Update data files as part of context capture. | |
| Use placeholder URLs | Vercel preview ships dead links until swapped. | |

**User's choice:** Note as Wave-0 user-input task

---

## Claude's Discretion

The user explicitly deferred these to Claude (anchored to Phase 1 patterns + PITFALLS.md):
- **Channel-link block visual treatment** — area was offered but not selected for discussion. CD-01 in CONTEXT.md locks pill-with-hairline buttons, `[icon] [handle] [verb]` layout, subtle `translateY` hover.
- **"Currently" line visual treatment** — locked in CD-02: single line in Geist Sans 14-15px, accent dot prefix, muted Mono date suffix.
- **Page-load motion choreography** — locked in CD-03: explicit timing list, name + photo skip animation (LCP), 80ms staggered cascade for everything else.
- **Mobile reflow specifics** — locked in CD-04: side-by-side stacks at `<md`, photo above text, channel buttons wrap.
- **Hero spacing rhythm** — locked in CD-05: approximate Tailwind v4 scale spacing; planner refines via UI-SPEC.
- **Footer source-link wording** — open. Planner picks something reasonable; Phase 6 polish can revisit.

## Deferred Ideas

- Future positioning-copy rewrite (drop "business student", lean aspirational) — captured as D-08 for v1.x or v2 copy pass.
- Real designed monogram swap — Phase 6 (carried from Phase 1 D-01).
- Real portrait shoot — out-of-band, not blocking.
- Project-wide `<ViewTransitions>` for all routes — defer to v2.
- Hero shared-element on /work cards — v2 territory (no `/work/[slug]` in v1).
- "Currently" link affordance — optional `link` field unset; CD-02 specifies treatment if populated.
- Footer source-link exact wording — Phase 6 polish if needed.
- Hero `<h2>` for SEO — Phase 6 SEO sweep.
