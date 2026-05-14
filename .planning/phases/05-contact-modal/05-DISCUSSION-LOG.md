# Phase 5: Contact Modal - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-13
**Phase:** 5-contact-modal
**Areas discussed:** Form fields, Trigger surfaces, Modal copy + tone

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Form fields | Required minimum is name + email + message (CTCT-05). Add subject? Topic dropdown? Source field? Or keep it minimal. | ✓ |
| Trigger surfaces | Nav 'Contact' link + /about 'Get in touch' CTA already have placeholders waiting. Add Hero (/) CTA too? Footer link? Or stay tight at 2 surfaces. | ✓ |
| Modal copy + tone | Lock the modal heading, submit button label, success message, and error message wording — first-person warm or restrained editorial? | ✓ |
| mailto: fallback email | What email goes in the 'Or just email me directly →' fallback link? memory says fakegoat1@gmail.com — public-facing portfolio: keep that, or use a different alias? | (skipped — Claude's discretion → fakegoat1@gmail.com per memory; D-15) |

---

## Form Fields

### Q1: Beyond the locked minimum (name, email, message — CTCT-05), what extra fields, if any, should the form carry?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimum only — name + email + message (Recommended) | Three fields, lowest friction. Fits the editorial-restrained ethic. Matches the existing braehods.com Connect modal you already ship today. Conversion math says fewer fields = more sends. | ✓ |
| Add subject (one extra text field) | Optional 'Subject' line so messages arrive in the inbox with a hint of what they're about. Cheap to add, helps you triage if traffic ever spikes. Still 4 fields total. | |
| Add topic dropdown (collab / hire / question / just hi) | Routing hint via a dropdown. Helps you mentally bucket messages, lets future-you set up Formspree filters per topic. Adds a click and an opinion to the form, slightly more 'app-y'. | |

**User's choice:** Minimum only — name + email + message
**Decision captured in CONTEXT.md as:** D-01

### Q2: Message field shape — how tall, and any character cap?

| Option | Description | Selected |
|--------|-------------|----------|
| 4-row textarea, soft cap at 1000 chars (Recommended) | Visible character counter that turns muted-amber past 800, blocks past 1000. Nudges concise messages without hard-walling someone with a longer story. Standard for portfolio contact forms. | ✓ |
| 3-row textarea, no cap | Smaller visual footprint, lets the modal stay compact. No counter. Formspree free tier has its own message-size limits (~64KB) so 'no cap' is really 'browser cap'. | |
| Auto-growing textarea, no cap | Starts at 3 rows, expands as the user types. Feels modern but adds JS for the auto-grow logic. Slightly more 'app-y' than the editorial-restrained ethic wants. | |

**User's choice:** 4-row textarea, soft cap at 1000 chars
**Decision captured in CONTEXT.md as:** D-02

### Q3 (check-in): Form fields locked — more questions or move on?

| Option | Description | Selected |
|--------|-------------|----------|
| Next area — trigger surfaces | Move on to where the modal trigger lives (Nav, /about CTA, Hero, Footer). | ✓ |
| More form-field questions | Cover remaining details — required-field marking style, label placement, validation timing. | |

**User's choice:** Next area
**Notes:** Required-field marking, label placement, and validation timing become Claude's discretion (captured as D-03 in CONTEXT.md, anchored to standard HTML form practice).

---

## Trigger Surfaces

### Q1: Where do contact triggers live? Stay tight at Nav + /about CTA, or expand?

| Option | Description | Selected |
|--------|-------------|----------|
| Tight — Nav + /about CTA only (Recommended) | Two surfaces, both already placeholdered. Nav is global (every page); /about is the warm post-bio nudge. Editorial-restrained — doesn't add a 'CONTACT ME' CTA bar to every page. Conversion path: Nav for direct intent, /about for warmed-up readers. | ✓ |
| Add Hero (/) text-link CTA | Add a third 'Drop me a line →' CTAArrowLink at the bottom of the home hero block. Increases visibility for visitors who never leave /. Cost: more visual weight at the top of the funnel. | |
| Add both Hero CTA + Footer 'Contact' link | Maximum surface coverage. 4 surfaces total. Costs editorial restraint — you start to feel like a 'hire me' funnel. | |

**User's choice:** Tight — Nav + /about CTA only
**Decision captured in CONTEXT.md as:** D-04

### Q2 (check-in): Triggers locked — more questions or move on?

| Option | Description | Selected |
|--------|-------------|----------|
| Next area — modal copy + tone | Move on to lock the modal heading, submit button label, success message, and error message wording. | ✓ |
| More trigger questions | Cover trigger architecture (hash-based vs client wrapper button), Nav label rewording, and mobile nav placement. | |

**User's choice:** Next area
**Notes:** Trigger architecture (hash-based vs button-with-onclick) becomes Claude's discretion (captured as D-06 in CONTEXT.md with strong recommendation for hash-based — preserves Server-Component triggers + URL-bookmarkability + browser-back-closes-modal). Mobile nav placement defaults to "Contact stays inside the existing `<details>` hamburger" since the LINKS array is shared (D-07).

---

## Modal Copy + Tone

### Q1: Modal heading — first words a visitor reads when the modal opens.

| Option | Description | Selected |
|--------|-------------|----------|
| 'Get in touch' (Recommended) | Matches the /about CTA wording verbatim — visitor clicks 'Get in touch →' and lands in a modal headed 'Get in touch'. Continuous. Editorial-restrained, neutral warmth. | ✓ |
| 'Drop me a line' | Warmer, more first-person. Matches the IG 'DM me' family of phrasing from the content brand. More inviting but slightly more casual than the editorial-dark aesthetic. | |
| 'Say hi' | Maximum warmth, lowest friction. Reads more like a personal blog than a credibility-forward portfolio. Good for content-brand audience, possibly too casual for recruiter / investor. | |

**User's choice:** 'Get in touch'
**Decision captured in CONTEXT.md as:** D-08

### Q2: Submit button label.

| Option | Description | Selected |
|--------|-------------|----------|
| 'Send message' (Recommended) | Specific verb + object. Reads cleanly across the loading transition ('Send message' → 'Sending…' → 'Sent'). Matches the editorial-restrained tone better than just 'Send'. | ✓ |
| 'Send' | Single verb. Compact, modern app-style. | |
| 'Send →' (with arrow) | Keeps the accent-arrow language from CTAArrowLink and ChannelButton — visual consistency with the rest of the site. Cost: harder to render the loading state cleanly. | |

**User's choice:** 'Send message'
**Decision captured in CONTEXT.md as:** D-09 (and D-12 for the 'Sending…' submitting state)

### Q3: Success state copy.

| Option | Description | Selected |
|--------|-------------|----------|
| 'Thanks — I'll get back to you within a day or two.' (Recommended) | Sets a soft expectation (24-48h). Warm-but-honest. Doesn't promise instant reply (spam protection / weekends). First-person, matches the about-page voice. | ✓ |
| 'Got it — thanks for reaching out.' | Shorter, no time commitment. Safer if you can't reliably reply in 1-2 days. Reads slightly cooler/professional. | |
| 'Thanks. I read every message myself.' | Establishes that this isn't going to a VA / auto-responder — reinforces the personal-site credibility signal. Slight risk of feeling formal. Skips the time commitment. | |

**User's choice:** 'Thanks — I'll get back to you within a day or two.'
**Decision captured in CONTEXT.md as:** D-10

### Q4: Error state copy.

| Option | Description | Selected |
|--------|-------------|----------|
| 'Something went wrong sending that. Try the email link below.' (Recommended) | Warm, non-technical, points the visitor at the mailto: fallback that's already on the page (CTCT-06). Doesn't blame them. Doesn't expose what specifically broke. | ✓ |
| 'Couldn't send your message. Try again or email me directly.' | Slightly more action-oriented — invites a retry first, fallback second. Good if you'd rather visitors retry than immediately defect to email. | |
| 'Error — the form failed. {error.message}' | Surfaces the actual Formspree error message. Most diagnostic for debugging, but exposes implementation detail. Reads technical / unfriendly. | |

**User's choice:** 'Something went wrong sending that. Try the email link below.'
**Decision captured in CONTEXT.md as:** D-11

### Q5 (check-in): Modal copy locked — more copy questions or all 3 areas done?

| Option | Description | Selected |
|--------|-------------|----------|
| All 3 areas done — write CONTEXT.md | Lock what we have. Field labels, modal subhead presence, fallback link wording, animation timing all become Claude's discretion against the established Phase 1/2 patterns. | ✓ |
| More copy questions | Cover modal subhead/intro line, field-label wording, mailto: fallback link copy, and submitting-state label. | |

**User's choice:** All 3 areas done — write CONTEXT.md
**Notes:** Field labels, mailto link wording ("Or just email me directly →" — D-15), and submitting-state label ("Sending…" — D-12) all became Claude's discretion items in CONTEXT.md, anchored to the established voice from D-08..11.

---

## Claude's Discretion

The following decisions were left to Claude (and captured in CONTEXT.md with concrete defaults):

- **Trigger architecture** (D-06) — hash-based `href="#contact"` strongly recommended over client-wrapper button (preserves Server-Component triggers + URL-bookmarkability + browser-back-closes-modal); planner verifies feasibility.
- **Mobile nav placement** (D-07) — Contact stays inside the existing `<details>` hamburger (single LINKS source covers both surfaces).
- **Required-field marking + label placement + validation timing** (D-03) — anchored to standard HTML form practice (visible `<label>` above field, `*` asterisk or `(required)` text, `<input required>` + custom JS message).
- **Honeypot field name** (D-13) — `company` (NOT `_gotcha` per CTCT-04 explicit exclusion).
- **Min-time-to-submit threshold** (D-14) — 1500ms (1.5s).
- **mailto: fallback target + wording** (D-15) — `mailto:fakegoat1@gmail.com?subject=Hi%20Braeden`, link text "Or just email me directly →". User skipped this gray area in selection — captured as Claude's discretion with default per memory.
- **Modal entrance animation** (D-16) — CSS-only fade-in via `:open` selector, ~200-240ms, reduced-motion respected.
- **Modal shape** (D-17) — centered dialog on all viewports, `max-w-md`, `view-transition-name: contact-modal` reserved for Phase 6 polish.
- **Backdrop styling** (D-18) — dim with subtle 2px blur (NOT glassmorphism per CLAUDE.md anti-pattern list).
- **Submission strategy** (D-19) — `@formspree/react@3.0.0` `useForm` hook over raw fetch (CLAUDE.md recommendation).
- **Field label exact wording, modal subhead presence, exact file paths for new components** — execute-time refinement against UI-SPEC.

## Deferred Ideas

(Captured in CONTEXT.md `<deferred>` section in full detail. Summary:)

- Hero (`/`) CTA + Footer Contact link surfaces — explicit reject D-04; v1.x candidate.
- Subject field, topic dropdown — explicit reject D-01; v1.x or v2 candidate.
- Dedicated `/contact` page — REQUIREMENTS.md CTCT-01 explicit; v2 only if SEO requires.
- `view-transition-name: contact-modal` for card-to-modal seam — reserved D-17, irrelevant for v1.
- Status-color tokens (`#c8a86a`) promoted to `@theme` — v1 inline-only per Phase 4 D-09 carry-forward.
- Public-facing email alias (`hi@braehods.com`) — D-15a informational; Phase 6 polish or v1.x.
- Auto-grow textarea — D-02 reject; v1.x candidate if 4-row feels cramped.
- reCAPTCHA / hCaptcha — explicit indefinite defer per REQUIREMENTS.md + memory; Cloudflare Turnstile is the migration target if real spam volume warrants.
- Form analytics — Phase 6 polish.
- In-modal stagger choreography — v2 polish.
