# Phase 5: Contact Modal - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the **first and only `'use client'` island** on the site (FOUND-07): a focus-trapped native `<dialog>` ContactModal that posts to the existing Formspree endpoint (`xqeypnkw`, env var already set in Vercel from Phase 1 D-13). Wire it to the two existing trigger placeholders so a visitor anywhere on the site can hit "Contact" (Nav) or "Get in touch" (/about CTA), see the modal open with focus trapped, fill three fields, get a clear visible + screen-reader-announced state for each of idle / submitting / success / error, and have a `mailto:` fallback link that converts even if Formspree is down.

**In scope (Phase 5):**
- New ContactModal client island (likely `components/contact/ContactModal.tsx` — exact path planner discretion). Single `'use client'` directive in the entire app — verified by spec.
- Native HTML `<dialog>` element (NOT Radix, NOT a custom div) — `showModal()` for focus-trap + scroll-lock + top-layer + ESC-close + return-focus all delivered by the browser.
- Three fields: name (text, required), email (email, required), message (4-row textarea, required, soft 1000-char cap with counter past 800).
- Honeypot field (custom name, NOT `_gotcha`) + minimum-time-to-submit check (~1.5s) — silently rejects bots without a reCAPTCHA pixel.
- Four states with `aria-live` announcements: idle, submitting, success, error. Locked copy (D-09..12 below).
- `mailto:` fallback link below the form: `mailto:fakegoat1@gmail.com` (per memory) with subject prefix.
- Atomic trigger swap: `components/layout/Nav.tsx` LINKS array `{ href: '/', label: 'Contact' }` and `app/about/page.tsx` `<CTAArrowLink href="/" staggerIndex={4}>Get in touch</CTAArrowLink>` both swap from `href="/"` placeholder to the modal trigger mechanism (planner picks hash-based `href="#contact"` vs button-with-onclick — Claude's discretion against FOUND-07 + minimal-island discipline).
- Modal mounts in `app/layout.tsx` (or a thin wrapper) so it's available on every route.
- New Playwright specs: focus-trap, ESC-close, return-focus-to-trigger, all-4-states-render-and-announce, honeypot-rejection, mailto-fallback-present, atomic-trigger-rewire (Nav + /about CTA both point to the modal).

**Out of scope (Phase 5 — deferred to later phases):**
- Hero (`/`) CTA + Footer "Contact" link surfaces — explicit reject per D-05 ("tight, 2 surfaces"). v1.x candidate if conversion data warrants.
- Subject field, topic dropdown — explicit reject per D-01 ("minimum 3 fields").
- Cliché-scrub spec on success/error copy — copy is locked verbatim in D-09..12; no AI-template risk.
- `view-transition-name` on the modal — modal triggers are not navigation, no shared-element pairing.
- View-transition seam between trigger and modal (e.g., card→modal) — irrelevant; cards link out externally.
- OG image / SEO for the contact route — there is no contact route; modal lives in layout.
- reCAPTCHA / hCaptcha — explicitly excluded by REQUIREMENTS.md "Out of Scope" + memory `feedback_avoid_paid_tools.md`. Honeypot + min-time-to-submit do the bot defense job.
- Light-mode color tokens — v1 dark-only.

</domain>

<decisions>
## Implementation Decisions

### Form Fields (Area 1)
- **D-01:** Field count = **3 fields only** — name (text input, required), email (`type="email"`, required), message (textarea, required). Matches existing braehods.com Connect modal you ship today; lowest friction = highest conversion. NOT subject (rejected — extra field per modal). NOT topic dropdown (rejected — too "app-y" for editorial-restrained ethic; routing happens in your inbox, not in the form).
- **D-02:** Message field shape = **4-row `<textarea>` with soft 1000-char cap**. Visible character counter sits below the textarea (Geist Mono micro-format, `var(--color-muted)` color) and turns muted-amber (`#c8a86a` — same literal as Phase 4 D-09 paper-trading dot, scoped inline-only NOT promoted to `@theme`) past 800 chars; submit blocks past 1000. The 1000-char cap nudges concise messages without hard-walling someone with a longer story. NOT 3-row no-cap (smaller but no concision nudge). NOT auto-grow (adds JS for the auto-grow seam — fights the "single client island = ContactModal" discipline; the textarea state is already inside the client island so an auto-grow effect WOULD be free, but the 4-row fixed-height + counter is cleaner editorially and easier to QA across screen sizes).
- **D-03:** Required-field marking + label placement = **Claude's discretion**, anchored to standard HTML form practice: visible `<label>` above each field, `*` asterisk suffix (or `(required)` text — planner picks against UI-SPEC), `<input required>` HTML attribute, accessible inline error messages on submit (CTCT-05 binding). Validation timing: native browser validation on submit + custom JS message (since browser default email validation is loose). NOT floating-label (more "app-y", harder to tab-cycle).

### Trigger Surfaces (Area 2)
- **D-04:** Trigger surfaces = **Nav + /about CTA only — exactly 2 surfaces**. Nav `Contact` link = global access from every page (header is on every route). /about `Get in touch` = warm post-bio nudge for visitors who read about Braeden. NOT Hero (`/`) CTA (rejected — adds visual weight at top of funnel; the home page already has 'More about me →' and 'See the work →' CTAs, a third would tilt the hero toward "hire me" framing which the audience model rejects). NOT Footer Contact link (rejected — exit-time visibility cost in editorial restraint not worth the marginal conversion lift).
- **D-05:** Atomic swap requirement (binding from Phase 3 D-15 carry-forward + Phase 3 `.continue-here.md`): the trigger placeholders MUST swap atomically in a single commit (or single Wave) — never leave one side pointing at `href="/"` and the other side pointing at the modal trigger. The Nav-side change is `components/layout/Nav.tsx` line 15 `{ href: '/', label: 'Contact' }`. The /about-side change is `app/about/page.tsx` line 75 `<CTAArrowLink href="/" staggerIndex={4}>Get in touch</CTAArrowLink>`. Both swap together; specs lock both states.
- **D-06:** Trigger architecture = **Claude's discretion**, anchored to FOUND-07 single-client-island rule. Two viable patterns: (a) **hash-based** — triggers stay server-rendered as `<a href="#contact">`, ContactModal client island listens to `location.hash` + `hashchange` + opens itself; URL-bookmarkable (`braehods.com/about#contact` opens modal directly); ESC-close clears the hash. (b) **client wrapper button** — trigger becomes a `<button onClick={openContact}>` from a small client wrapper component; no URL signal. **Strong recommendation** for hash-based: keeps Nav.tsx + CTAArrowLink.tsx pure Server Components (no client wrappers), preserves the single-island invariant most cleanly, gets URL-shareability + browser-back-closes-modal for free. Planner verifies feasibility against the trigger element types (Nav uses `<Link>`, /about uses `<CTAArrowLink>` which is a `<Link>` — both honor `href="#contact"` natively).
- **D-07:** Mobile nav placement = **Contact stays inside the existing `<details>` hamburger** (no special-case promotion to always-visible). The Nav LINKS array maps over both desktop nav AND mobile hamburger nav from a single source — so the trigger swap in D-05 covers both surfaces from one edit. Same `Contact` label.

### Modal Copy + Tone (Area 3)
- **D-08:** Modal heading = **"Get in touch"** verbatim. Matches the /about CTA wording exactly so the visitor experiences continuity (click "Get in touch →" on /about, land in a modal headed "Get in touch"). Editorial-restrained, neutral warmth. NOT "Drop me a line" (warmer but less continuous with /about). NOT "Say hi" (too casual for the credibility-forward audience model). Rendered as `<h2>` inside the dialog; the dialog itself gets `aria-labelledby` pointing at the heading id (WCAG dialog pattern).
- **D-09:** Submit button label = **"Send message"** (idle state). Specific verb + object reads cleanly across the loading transition: "Send message" → "Sending…" (submitting state) → button hides on success/error. NOT "Send" (too terse, app-style). NOT "Send →" (arrow makes the loading state hard to render cleanly — does the arrow stay, become a spinner, disappear?). Button uses accent color (`var(--color-accent)` #7c87ff) text on transparent background with hairline border, matching the rest-of-site button language (CD-01 ChannelButton family).
- **D-10:** Success state copy = **"Thanks — I'll get back to you within a day or two."** verbatim. Sets a soft 24-48h expectation (warm-but-honest; doesn't promise instant reply for spam-protection / weekend reasons). First-person, matches /about bio voice. The form replaces with this message + a single "Send another →" link (Claude's discretion on the link wording within the warm-personal range). Wrapped in `aria-live="polite"` region per CTCT-03.
- **D-11:** Error state copy = **"Something went wrong sending that. Try the email link below."** verbatim. Warm, non-technical, points at the mailto: fallback (CTCT-06) instead of blaming the visitor or exposing implementation detail. NOT surfacing the raw Formspree error message (technical / unfriendly). NOT "Try again" (defaults to retry-first behavior; we'd rather visitors defect to email if Formspree is failing — the inbox is the conversion goal, not the form). Wrapped in `aria-live="assertive"` region per CTCT-03 (errors are higher-priority than success).
- **D-12:** Submitting state = **button label changes to "Sending…"** + button is disabled + `aria-busy="true"` on the form. No spinner glyph (too app-y; the label change + disabled state communicates clearly). The form fields remain visible but become read-only via `disabled` attribute (preserves the visitor's typed values if the submit takes a beat). Wrapped in `aria-live="polite"` region.

### Bot Defense (Claude's Discretion + binding constraints)
- **D-13:** Honeypot field = **custom name `company`** (NOT `_gotcha` per CTCT-04 explicit exclusion — Formspree's documented `_gotcha` is too well-known and bots have learned it). Field is `<input type="text" name="company" tabindex="-1" autocomplete="off">` wrapped in a visually-hidden container (`absolute opacity-0 pointer-events-none`) and `aria-hidden="true"` so screen readers skip it. Submission is silently rejected (returns success-shaped response, no email sent) when honeypot is non-empty.
- **D-14:** Min-time-to-submit threshold = **1500ms** (1.5 seconds). Form mount timestamp is captured in `useState(() => Date.now())` on the client island. Submit handler rejects if `Date.now() - mountTime < 1500`. Threshold balances bot defense against accidental fast-typist false positives (1.5s is below human read-form-and-fill speed; 3s would over-block; 500ms wouldn't catch the bots). Silent rejection (same shape as honeypot — looks like success).

### mailto: Fallback (Claude's Discretion)
- **D-15:** Fallback email = **`mailto:fakegoat1@gmail.com`** per CLAUDE.md userEmail context. Link wording = **"Or just email me directly →"** (matches the editorial-restrained-but-conversational tone, uses the accent-arrow language consistent with CTAArrowLink). The mailto: link includes a `?subject=Hi%20Braeden` query param so the email lands in the inbox with a recognizable subject. Sits **below the form** per CTCT-06 wording (NOT in the modal footer/border, NOT only in the error state). Visible in idle, submitting, and success states; in error state, the error copy explicitly references it ("Try the email link below").
- **D-15a [informational]:** If the user later prefers a public-facing alias (e.g., `hi@braehods.com` once domain mail is configured), this is a single-line edit in `data/site.ts.contactEmail` (planner factors the value into the data layer so it's swappable without code changes). Not implemented in v1; informational carry-forward for Phase 6 polish or v1.x.

### Animation + Modal Shape (Claude's Discretion)
- **D-16:** Modal entrance = **CSS-only fade-in via `:open` selector**, ~200-240ms duration matching the established Phase 1/2 motion contract. `dialog::backdrop` gets a fade-in too (~150ms, lower opacity ramp). Reduced-motion globally defeats both via `app/globals.css` lines 54-63. NOT instant (feels jarring on a polished editorial site). NOT 400ms+ slide (too "app-y" / SaaS-modal energy). Reuses the `fadeInUp`-family motion primitive from `lib/motion.ts` if applicable.
- **D-17:** Modal shape = **centered dialog on all viewports**, max-width ~`max-w-md` (~28rem), full-width on mobile with `mx-4` horizontal margin, internal padding `p-6 md:p-8`. NOT mobile bottom-sheet (more "app-y", introduces a second layout primitive when one suffices; native `<dialog>` showModal centers fine on mobile). NOT full-screen mobile (overweighted for a 3-field form). The `<dialog>` element gets `view-transition-name: contact-modal` reserved IF Phase 6 polish wants to add a card-to-modal seam later; for v1 it's just a centered native dialog.
- **D-18:** Backdrop = **dim with subtle blur** (`dialog::backdrop { background: rgba(10, 10, 10, 0.6); backdrop-filter: blur(2px); }`). The blur is 2px (subtle, not glassmorphism — explicitly NOT the rejected anti-pattern from CLAUDE.md "What NOT to use"). On reduced-motion: backdrop appears instantly with the same dim color, no blur transition.

### Submission Strategy (Claude's Discretion)
- **D-19:** Use **`@formspree/react@3.0.0` `useForm` hook** (already in CLAUDE.md recommended stack). Adds ~3-5KB to the client island bundle but eliminates hand-rolling submission state machine + retry/error edge cases. Imports: `import { useForm, ValidationError } from '@formspree/react'`. The Formspree ID is read from `process.env.NEXT_PUBLIC_FORMSPREE_ID` (set in Vercel + .env.local from Phase 1 D-13 — no code change needed). Alternative considered + rejected: raw `fetch()` POST to `https://formspree.io/f/${id}` — saves 3-5KB but requires hand-rolling all state transitions; YAGNI.

### Claude's Discretion (during execution)
- Exact file paths for the new modal component(s) (`components/contact/ContactModal.tsx` vs `components/ui/ContactDialog.tsx` etc.) — planner picks against existing folder convention (`components/{ui,layout,home,work}/`).
- Whether to add a thin `data/site.ts.contactEmail` field for the mailto target so it's a single-line edit (recommended for forward-compat per D-15a), or hard-code the email literal in the component for v1.
- Field label exact text ("Name" vs "Your name", "Email" vs "Email address", "Message" vs "What's on your mind?") — anchored to editorial-restrained but slightly warmer than enterprise-form language.
- Whether to add a Phase 5 SUMMARY.md note that ContactModal is the v1 inflection point where the site stops being 100% RSC and becomes (1 client island + N RSC routes).
- Stagger choreography for the modal contents on open — likely none (the modal itself fades in; per-element stagger inside a 200ms modal entrance would feel chaotic). Verify against UI-SPEC.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project + Requirements
- `.planning/PROJECT.md` — Core value (visual polish #1, contact-conversion #2), Constraints § Contact ("Must preserve the Formspree integration (id `xqeypnkw`)"), Out-of-Scope explicit reject of reCAPTCHA + multi-language
- `.planning/REQUIREMENTS.md` § Contact (CTCT-01..07) + § Accessibility A11Y-03 — locked requirements; especially CTCT-04 (custom honeypot name, NOT `_gotcha`), CTCT-06 (mailto: fallback), CTCT-07 (background scroll lock + clean reopen), and the explicit reject of reCAPTCHA in the Out-of-Scope table
- `.planning/ROADMAP.md` § Phase 5 — phase goal, 5 success criteria, dependencies on Phase 1 (focus ring tokens) + Phase 2 (Nav trigger placeholder) + Phase 3 (/about CTA placeholder)

### Phase 1, 2, 3 carry-forwards (the most load-bearing prior context)
- `.planning/phases/01-foundation-design-tokens/01-CONTEXT.md` D-13 — `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` set in Vercel project env across Production + Preview + Development. Phase 5 reads this var; no Vercel env change needed.
- `.planning/phases/01-foundation-design-tokens/01-PLAN.md` § threat model T-01-08 — Formspree DoS / abuse explicitly accepted at Phase 1 with note "Phase 5 ships honeypot + min-time-to-submit per CTCT-04." Binding constraint on D-13 + D-14.
- `.planning/phases/02-home-page/02-CONTEXT.md` D-25 — single client island for ContactModal (FOUND-07); zero `'use client'` everywhere else. Phase 5 IS the carve-out — verify zero new `'use client'` outside the modal component(s).
- `.planning/phases/02-home-page/02-CONTEXT.md` D-22 — per-element view-transition discipline; Phase 5 does NOT introduce a project-wide `<ViewTransition>` wrapper. Modal entrance is CSS-only.
- `.planning/phases/03-about-page/03-CONTEXT.md` D-15 — atomic trigger swap binding constraint: Nav `Contact` (`href="/"` placeholder) + /about `Get in touch` CTA (`<CTAArrowLink href="/" staggerIndex={4}>`) MUST swap atomically when modal lands. Single commit, single Wave.
- `.planning/phases/03-about-page/.continue-here.md` — explicitly names Phase 5 as the owner of the atomic trigger rewire.

### Reusable source files (Phase 5 modifies or imports from these)
- `components/layout/Nav.tsx` line 15 — `LINKS` array with `{ href: '/', label: 'Contact' }` placeholder (the Nav-side trigger swap target per D-05)
- `app/about/page.tsx` line 75 — `<CTAArrowLink href="/" staggerIndex={4}>Get in touch</CTAArrowLink>` (the /about-side trigger swap target per D-05)
- `components/home/CTAArrowLink.tsx` — accent text-link with `→` glyph + hover-translate; reusable IF the modal uses an in-modal CTA, but primarily this file just gets its `href` indirectly updated via the /about page (CTAArrowLink itself is a Server Component and stays so)
- `components/layout/Footer.tsx` — chrome wrapper; Phase 5 does NOT add a Footer Contact link per D-04
- `app/layout.tsx` — Nav + Footer + page chrome; ContactModal mounts here (or in a thin wrapper) so it's available globally
- `lib/motion.ts` — `fadeInUp` + `stagger(N)` seam; D-16 modal entrance reuses or mirrors the established motion class names
- `app/globals.css` — focus-ring rule (`*:focus-visible`); modal must not regress; reduced-motion `@media` block defeats D-16/D-18 motion automatically
- `data/site.ts` — candidate location for the contact-email field per D-15a (planner picks: hard-code in modal component for v1 vs surface in data layer for forward-compat)

### Phase 1 invariants still binding
- FOUND-07 — single client island for ContactModal; everything else server-rendered. Phase 5 IS this carve-out.
- DSGN-06 — visible focus ring (electric-blue outline) on all interactive elements. Modal fields, submit button, mailto link all inherit.
- DSGN-08 — `prefers-reduced-motion: no-preference` gates all motion. D-16 modal fade + D-18 backdrop blur both respect this via the global `globals.css` rule.
- A11Y-02 — visible focus rings, no `outline: none` without replacement. Modal fields use the same `*:focus-visible` rule from `app/globals.css`.

### Stack + library docs
- `CLAUDE.md` § "Other Specific Decisions" → "Formspree integration" — locks `@formspree/react@3.0.0` (`useForm`, `ValidationError`) over server actions. Phase 5 D-19 follows this.
- `CLAUDE.md` § "What NOT to use" — Radix UI primitives explicitly excluded for the contact modal ("a ~50-line `<dialog>` element ships native, accessible, and zero-dep"). Phase 5 D-17 follows this.
- `CLAUDE.md` § "Recommended Stack" — `@formspree/react@3.0.0`, `clsx@2.1.1`, `tailwind-merge@3.5.0` (likely consumed for conditional class composition inside the client island).
- `@formspree/react` v3.0.0 npm — https://www.npmjs.com/package/@formspree/react (verify `useForm` API surface, `ValidationError` component shape; package last published 2024 but stable per CLAUDE.md note)

### External docs (pull as needed during planning)
- MDN `<dialog>` element — https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog (verify `showModal()` focus trap + scroll lock + top-layer behavior)
- WAI-ARIA Authoring Practices Modal Dialog Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (verify focus trap + ESC + return-focus + `aria-labelledby` requirements per A11Y-03)
- WCAG 2.1 § 2.4.3 Focus Order — https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html
- Tailwind v4 `:open` + `::backdrop` selector — https://tailwindcss.com/docs/hover-focus-and-other-states (verify D-16 + D-18 fade + blur)

### Memory (cross-project user context)
- `feedback_avoid_paid_tools.md` — informs the explicit reCAPTCHA reject + the honeypot+min-time-to-submit choice (already in PROJECT.md Out-of-Scope; memory reinforces).
- `userEmail = fakegoat1@gmail.com` (CLAUDE.md context) — fallback mailto target per D-15.
- `feedback_reel_cta_dm_format.md` — informed the broader "first-person, action-oriented CTA" voice that lands in D-08..12 modal copy. Modal heading "Get in touch" matches the warm-but-restrained register.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`components/layout/Nav.tsx`** — already mobile + desktop, native `<details>`/`<summary>` hamburger from `a975967`. The `LINKS` array (line 12-16) is the single source for both desktop nav AND mobile hamburger nav — D-07 confirmed: a single trigger swap covers both surfaces. No structural change to Nav.tsx, just one `href` value flip.
- **`components/home/CTAArrowLink.tsx`** — Server Component, accent text-link + `→` glyph + hover-translate + `staggerIndex` prop. Phase 5 does not modify this file; the /about consumption site (`app/about/page.tsx` line 75) swaps the `href` prop.
- **`app/layout.tsx`** — chrome wrapper; Nav + Footer wrap every route. Phase 5 mounts ContactModal here (or in a thin wrapper component) so the modal is in the DOM on every route, available for any trigger to open.
- **`lib/motion.ts` `fadeInUp` + `stagger(N)`** — established motion seam from Phase 1. D-16 modal fade likely reuses these class names + custom property pattern, OR mirrors them in modal-scoped CSS if the `:open` pseudo-class needs a separate keyframe.
- **`app/globals.css`** — `@theme` block with the 6 locked color tokens; `.fade-in-up` keyframe; `*:focus-visible` rule (modal fields inherit); reduced-motion `@media` block (defeats D-16/D-18 motion automatically). Likely needs new lines for `dialog::backdrop` styling per D-18.
- **`data/site.ts`** — candidate for `contactEmail` field per D-15a (planner picks hard-code-in-component vs surface-in-data-layer trade-off).

### Established Patterns
- **Server Components by default, single-client-island carve-out** (FOUND-07 / D-25 from Phase 2) — Phase 5 IS the carve-out. The ONLY new `'use client'` directive in the entire codebase lands in `components/contact/ContactModal.tsx` (or whatever path planner picks). Specs verify: `git grep "use client"` returns exactly 1 file post-Phase-5.
- **`transition-[<single-property>]` on currentColor inheritors** (Phase 2 Plan 02-04 lesson, Phase 4 Plan 04-02 reaffirmed) — modal CTAs and form buttons MUST use `transition-[border-color,color,transform]` (or similar property-list) NOT `transition-colors` shorthand which bleeds into `outline-color` and clobbers the focus-visible accent ring.
- **`target="_blank" rel="noopener noreferrer"` on external `<a>`** — does not apply directly to the modal trigger (internal mechanism via `#contact` hash or onclick). DOES apply to the mailto: fallback link (per Phase 4 spec patterns) — actually: `mailto:` links don't need `noopener noreferrer` (they don't open a new browser tab in the JS sense), but adding them is safe and consistent.
- **Hairline-tile + accent border hover** (Phase 2 D-02 + Phase 4 D-01 family) — modal CTA button (Send message) and mailto fallback link can mirror this language so the modal reads as part of the same editorial-tile design family.
- **Verbatim string assertions in Playwright specs** (Phase 4 lesson — `:text-is("...")` not `text=`) — modal copy specs MUST use exact-match selectors to avoid the substring-collision class of bug seen in Plan 04-02 Task 4.

### Integration Points
- **`app/layout.tsx`** — ContactModal mounts here. Likely structure: `<body>...<Nav /><main>{children}</main><Footer /><ContactModal /></body>`. The modal's `<dialog>` lives at the end of the body so it's a top-level sibling (not nested inside `<main>`), aligning with the native top-layer behavior.
- **`components/layout/Nav.tsx` line 15** — single character edit if D-06 lands on hash-based architecture (`href: '/'` → `href: '#contact'`). Larger edit if button-with-onclick (would require client wrapper around Nav to expose `openContact()` — the CHEAPEST way to preserve Nav as Server Component is hash-based, reinforcing D-06's strong recommendation).
- **`app/about/page.tsx` line 75** — same single character edit for hash-based (`href="/"` → `href="#contact"` on the CTAArrowLink). Atomic with Nav per D-05.
- **`app/globals.css`** — likely additions: `@keyframes` for modal fade-in if not already present; `dialog::backdrop` rule for D-18 backdrop dim+blur; possibly a `:open` modifier rule for the modal entrance.
- **`process.env.NEXT_PUBLIC_FORMSPREE_ID`** — already set in Vercel + `.env.local` from Phase 1 D-13. Modal client island reads it via `process.env.NEXT_PUBLIC_FORMSPREE_ID` (Next.js inlines `NEXT_PUBLIC_*` vars at build time). No env change in Phase 5.

### New Files Phase 5 Adds (planner refines paths)
- `components/contact/ContactModal.tsx` (or equivalent) — the single client island. ~80-150 lines: dialog open/close, form state via `useForm` from `@formspree/react`, honeypot + min-time-to-submit, character counter, 4 state renders, `aria-live` regions, mailto fallback link.
- Possibly `components/contact/ContactTrigger.tsx` — only if D-06 lands on button-with-onclick architecture (would need a client wrapper). NOT created if D-06 lands on hash-based (Nav + /about CTA stay as-is, just `href` value swaps).
- New Playwright specs (planner confirms exact list):
    - `tests/contact-modal-opens-from-nav.spec.ts` — clicks Nav Contact, asserts dialog opens, focus traps inside
    - `tests/contact-modal-opens-from-about.spec.ts` — clicks /about Get in touch, asserts same
    - `tests/contact-modal-esc-closes.spec.ts` — ESC closes, focus returns to trigger
    - `tests/contact-modal-states.spec.ts` — all 4 states render expected text + are wrapped in `aria-live` regions
    - `tests/contact-modal-honeypot.spec.ts` — submission with honeypot filled silently rejects
    - `tests/contact-modal-min-time.spec.ts` — submission within 1500ms of mount silently rejects
    - `tests/contact-modal-mailto-fallback.spec.ts` — mailto link present + correct href
    - `tests/contact-trigger-rewire.spec.ts` — Nav + /about CTA both point at modal trigger (atomic per D-05)
    - `tests/single-client-island.spec.ts` — `git grep -l "use client" -- '*.tsx' '*.ts'` returns exactly 1 file (the ContactModal component path)

</code_context>

<specifics>
## Specific Ideas

- **Modal copy is locked verbatim** (D-08, D-09, D-10, D-11, D-12). Specs MUST use exact-match Playwright selectors (`:text-is("...")`) to assert each string. This is the Phase 4 lesson: substring `text=` matchers collide across DOM (e.g., "Send message" button label could substring-match a description in another component). Lock exact strings, lock with `:text-is()`.
- **Honeypot field name is locked: `company`** (D-13). NOT `_gotcha` (CTCT-04 explicit exclusion). Visually-hidden via `absolute opacity-0 pointer-events-none` + `tabindex="-1"` + `autocomplete="off"` + `aria-hidden="true"`. Spec asserts: real submission with honeypot empty succeeds; submission with honeypot filled silently rejects (returns success-shaped response, no Formspree call made — verify by mocking the Formspree network call in the spec).
- **Min-time-to-submit threshold is locked: 1500ms** (D-14). Mount timestamp captured via `useState(() => Date.now())` (lazy init — only runs once on mount). Spec uses Playwright clock manipulation or just submits within 1500ms and asserts no Formspree call.
- **Mailto target is locked: `mailto:fakegoat1@gmail.com?subject=Hi%20Braeden`** (D-15) for v1. Forward-compat surfaces the value via `data/site.ts.contactEmail` (Claude's discretion if the planner factors this in execute time vs hard-codes for v1). v1.x or Phase 6 candidate to swap to `hi@braehods.com` once domain mail is wired.
- **Atomic trigger swap is binding** (D-05) — single commit, single Wave for Nav.tsx + about/page.tsx. Phase 3 `.continue-here.md` explicitly flags this as a Phase 5 carry-forward. Plan-checker should refuse plans that put the two swaps in different Waves.
- **Modal mounts in `app/layout.tsx`** — verifies ContactModal is rendered on every route (Nav trigger works from `/`, `/about`, `/work`). Spec asserts the dialog element is present in the DOM on all 3 routes (not necessarily open, just mounted).
- **The cliché-scrub spec from Phase 3 (`tests/about-renders.spec.ts`) is NOT reusable for the modal copy** — the modal copy is short + locked + first-person + already past the AI-template phrase ban. No need for a per-string regex check; the verbatim assertion in `tests/contact-modal-states.spec.ts` is the test.
- **Tab order on every page after Phase 5:** Nav (4 links) → page content → Footer socials. When modal opens: focus traps to first focusable element inside the dialog (close button, then name field, then email, message, honeypot-skipped-via-tabindex-minus-one, send button, mailto link). ESC closes + returns focus to the original trigger element (Nav Contact link OR /about CTAArrowLink, whichever opened it).

</specifics>

<deferred>
## Deferred Ideas

- **Hero (`/`) CTA + Footer Contact link surfaces** — explicit reject per D-04 ("tight, 2 surfaces"). v1.x candidate IF post-launch traffic data shows a high `/`-bounce-without-click rate that a third surface could rescue.
- **Subject field in form** — explicit reject per D-01 ("minimum 3 fields only"). v1.x candidate if the user notices triage friction in the inbox.
- **Topic dropdown (collab / hire / question / just hi)** — explicit reject per D-01 (too app-y). v2 candidate if the user wants Formspree-side filters per topic, OR if a future "/services" or "/coaching" surface needs to route a specific intent type.
- **Contact form as a dedicated `/contact` page** — REQUIREMENTS.md CTCT-01 explicitly says modal NOT page. Modal is the v1 mechanism; a dedicated page would be v2 only if SEO requires a crawlable contact route.
- **`view-transition-name` on the modal for card-to-modal seam** (e.g., card click → modal slides from card position) — irrelevant for v1 (cards link out externally; no in-site target). Reserved as `view-transition-name: contact-modal` placeholder per D-17 in case Phase 6 wants it.
- **Status-color tokens (paper-trading amber `#c8a86a`) promoted to `globals.css` `@theme`** — D-02 reuses the Phase 4 D-09 inline literal for the textarea counter warning state. If the literal propagates to a 3rd location in v1, Phase 6 polish should promote both literals (`#c8a86a` + `#707070`) to `@theme` tokens. v1 still ships them inline-only.
- **Public-facing email alias (`hi@braehods.com`)** — D-15a informational. Requires domain mail config (likely Cloudflare Email Routing or Vercel-side equivalent). Phase 6 polish OR v1.x.
- **Cliché-scrub spec for modal copy** — explicit reject; copy is locked verbatim in D-08..12, no AI-template risk. The `:text-is()` assertion in `tests/contact-modal-states.spec.ts` is the test.
- **Light-mode color tokens for modal backdrop** — v1 dark-only. LITE-01 in v2.
- **Auto-grow textarea** — D-02 considered + rejected in favor of fixed 4-row + counter. v1.x candidate if user feedback says the 4-row feels cramped for longer messages.
- **reCAPTCHA / hCaptcha integration** — explicit reject (REQUIREMENTS.md Out-of-Scope + memory `feedback_avoid_paid_tools.md`). Honeypot + min-time-to-submit do the bot defense job. Indefinite defer unless real spam volume warrants — at which point Cloudflare Turnstile (free, no Google tracking) is the migration target, NOT reCAPTCHA.
- **Form analytics** (track open-rate, abandon-rate, send-rate) — out of v1 scope. Vercel Analytics already counts page views; modal-specific events are Phase 6 polish if the user wants conversion-funnel data.
- **In-modal stagger choreography** — D-16 lands the modal-level fade-in only. Per-element stagger inside a 200ms modal entrance would feel chaotic. v2 polish if the modal grows in size.

### Reviewed Todos (not folded)

None — `gsd-sdk query todo.match-phase 5` returned `todo_count: 0`.

</deferred>

---

*Phase: 5-contact-modal*
*Context gathered: 2026-05-13*
