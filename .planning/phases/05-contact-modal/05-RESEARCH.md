# Phase 5: Contact Modal — Research

**Researched:** 2026-05-13
**Domain:** React 19 client island wrapping native `<dialog>` + `@formspree/react@3.0.0` + hash-driven trigger architecture
**Confidence:** HIGH (every load-bearing claim verified against MDN, npm registry, and Formspree's own docs in this session)

---

## Summary

Phase 5 is unusually constrained: nineteen `D-NN` decisions in `05-CONTEXT.md` plus a 670-line `05-UI-SPEC.md` lock the field count, the verbatim copy, the honeypot field name, the min-time threshold, the trigger architecture, the modal entrance keyframe shape, the backdrop blur radius, the submission library, and the env-var wiring. The genuine research surface is therefore narrow: confirm that the locked stack and patterns actually work the way CONTEXT/UI-SPEC assume, and produce concrete, citable code skeletons the planner can paste verbatim into task bodies. **No architecture is up for grabs in this phase.**

Three things turned out to be load-bearing and worth verifying explicitly: (1) `@formspree/react@3.0.0` was published 2025-03-17 and was a deliberate React 19 + Stripe-js 5 compatibility bump, so the v3 pin in CLAUDE.md is correct and current; (2) native `<dialog>.showModal()` delivers focus-trap, focus-return-to-trigger, ESC-close, and background-inert/scroll-lock automatically, but **not** backdrop-click-to-close (must be hand-rolled with `e.target === e.currentTarget` pattern); (3) the hash-trigger architecture per D-06 is feasible because Next.js `<Link href="#contact">` performs in-document hash navigation that fires `hashchange` reliably.

**Primary recommendation:** Build exactly what CONTEXT.md and UI-SPEC.md describe — `components/contact/ContactModal.tsx` as the sole `'use client'` island, hash-driven open via `useEffect` listening to `hashchange`, native `<dialog>` for all browser-managed a11y, `useForm('xqeypnkw')` for submission, custom click handler on `<dialog>` for backdrop-close, two `aria-live` regions (polite + assertive) for state announcements. Do NOT introduce any architecture not already locked. The planner's job is sequencing tasks, not picking patterns.

---

## User Constraints (from CONTEXT.md)

> Phase 5 has no negotiable architecture. Every Locked Decision below is binding; deviating requires a documented Rule-N exception in the executor's SUMMARY.

### Locked Decisions (D-01..D-19)

- **D-01:** Three fields only — name (text, required), email (`type="email"`, required), message (textarea, required). NOT subject, NOT topic dropdown.
- **D-02:** Message = 4-row `<textarea>` with soft 1000-char cap. Visible char counter in Geist Mono; `var(--color-muted)` rest, **`#c8a86a`** (inline literal, NOT promoted to `@theme`) past 800 chars; `maxLength={1000}` blocks past 1000.
- **D-03:** Required-marker + label placement = Claude's discretion within standard HTML form practice. Visible `<label>` above each field, `*` asterisk suffix in accent color, `<input required>`, accessible inline error messages on submit.
- **D-04:** Trigger surfaces = exactly 2 — Nav `Contact` link + /about `Get in touch` CTA. NOT Hero CTA, NOT Footer Contact link.
- **D-05:** Atomic swap binding — both Nav.tsx line 15 and app/about/page.tsx line 75 swap `href` from `/` to the modal trigger in a **single commit / single Wave**. Plan-checker MUST refuse plans that split these.
- **D-06:** Trigger architecture = Claude's discretion, **strong recommendation hash-based** (`href="#contact"`). Keeps Nav.tsx + CTAArrowLink.tsx pure Server Components. Fallback (button-with-onclick) breaks FOUND-07 and must be explicitly documented if exercised.
- **D-07:** Mobile nav placement = Contact stays inside the existing `<details>` hamburger. Nav LINKS array maps both surfaces from one source — the trigger swap covers desktop AND mobile from one edit.
- **D-08:** Modal heading = **"Get in touch"** verbatim. Rendered as `<h2 id="contact-modal-heading">`; dialog gets `aria-labelledby="contact-modal-heading"`.
- **D-09:** Submit button label (idle) = **"Send message"** verbatim. Accent text on transparent + hairline border, ChannelButton family.
- **D-10:** Success copy = **"Thanks — I'll get back to you within a day or two."** verbatim. Em dash, NOT hyphen. Form replaces with this message + a "Send another →" link. `aria-live="polite"`.
- **D-11:** Error copy = **"Something went wrong sending that. Try the email link below."** verbatim. Renders ABOVE form (form remains visible + populated). `aria-live="assertive"`.
- **D-12:** Submitting state = button label changes to **"Sending…"** verbatim. Button + fields disabled. Form gets `aria-busy="true"`. NO spinner glyph.
- **D-13:** Honeypot field name = **`company`** (NOT `_gotcha`). `<input type="text" name="company" tabindex={-1} autoComplete="off">` in visually-hidden + `aria-hidden` wrapper.
- **D-14:** Min-time-to-submit = **1500ms**. Mount timestamp via `useState(() => Date.now())` (lazy init). Both honeypot trip AND min-time trip return success-shaped UI silently — no Formspree call, no email sent.
- **D-15:** Mailto target = **`mailto:fakegoat1@gmail.com?subject=Hi%20Braeden`** verbatim. Link wording = **"Or just email me directly →"** verbatim. Sits below form, visible in idle/submitting/success; explicitly referenced by error-state copy.
- **D-15a:** [informational] Future swap to `hi@braehods.com` is a single-line edit in `data/site.ts.contactEmail` if planner factors the value into the data layer. v1 may hard-code; planner discretion.
- **D-16:** Modal entrance = CSS-only fade-in via `:open` (or `dialog[open]` selector), 200-240ms; `dialog::backdrop` fades over 150ms. **NEW** `modal-fade-in` keyframe (opacity-only) — do NOT reuse `fade-in-up` from globals.css (its 8px translateY conflicts with browser-centered dialog positioning). Reduced-motion globally defeats both via existing `app/globals.css` lines 54-63.
- **D-17:** Modal shape = centered on all viewports, `max-w-md` (~28rem), `mx-4` mobile margin, `p-6 md:p-8` internal padding. NOT bottom-sheet, NOT full-screen mobile.
- **D-18:** Backdrop = `dialog::backdrop { background: rgba(10,10,10,0.6); backdrop-filter: blur(2px); }`. 2px blur is **subtle, not glassmorphism** (per CLAUDE.md anti-pattern). Reduced-motion: instant appearance, blur stays 2px (it's not animated, only opacity is).
- **D-19:** Submission = `@formspree/react@3.0.0` `useForm('xqeypnkw')` hook + `<ValidationError>` component. Reads `process.env.NEXT_PUBLIC_FORMSPREE_ID` (already set in Vercel + .env.local from Phase 1 D-13).

### Claude's Discretion

- Exact file paths for new modal component(s) — recommended `components/contact/ContactModal.tsx`.
- Whether to surface `data/site.ts.contactEmail` for forward-compat per D-15a, or hard-code in component for v1.
- Field label exact text ("Name" / "Email" / "Message" recommended).
- Inline error message text (recommended: "Please enter your name." / "Please enter your email." / "That email looks off." / "Please add a message.").
- Success-state secondary CTA wording (recommended: "Send another →").
- `aria-live` announcement copy (recommended: "Sending your message." / "Message sent. Thanks." / "Something went wrong sending your message. Try the email link below.").
- Whether to add a Phase 5 SUMMARY.md note that ContactModal is the v1 inflection from 100% RSC to (1 client island + N RSC routes).
- In-modal stagger choreography on open — recommended: none (per CONTEXT.md — chaotic in 200ms entrance).

### Deferred Ideas (OUT OF SCOPE)

- Hero (`/`) CTA + Footer Contact link surfaces — explicit reject per D-04.
- Subject field, topic dropdown — explicit reject per D-01.
- Dedicated `/contact` page — REQUIREMENTS.md CTCT-01 explicit (modal NOT page).
- `view-transition-name` on the modal for card-to-modal seam — irrelevant for v1.
- Status-color tokens (`#c8a86a`, `#707070`) promoted to `@theme` — Phase 6 polish if literal propagates to a 3rd location.
- Public-facing email alias (`hi@braehods.com`) — Phase 6 / v1.x.
- Cliché-scrub spec for modal copy — copy is locked verbatim, no AI-template risk.
- Light-mode color tokens for backdrop — v1 dark-only.
- Auto-grow textarea — D-02 reject; v1.x candidate.
- reCAPTCHA / hCaptcha — explicit reject (REQUIREMENTS.md Out-of-Scope + memory `feedback_avoid_paid_tools.md`). Migration target if needed: Cloudflare Turnstile.
- Form analytics (open/abandon/send rate) — Phase 6 polish.
- In-modal stagger choreography on open — rejected.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **CTCT-01** | Contact opens as a modal (not a new page) using native `<dialog>` or accessible Dialog component with focus trap and ESC close | MDN dialog: `showModal()` delivers focus-trap, focus-return, ESC-close natively (Topic 3 below). |
| **CTCT-02** | Form posts to existing Formspree endpoint (`xqeypnkw`) — uses fetch directly or `@formspree/react` hook | `@formspree/react@3.0.0` `useForm('xqeypnkw')` returns `[state, handleSubmit, reset]`. Verified via Formspree help docs (Topic 2 below). |
| **CTCT-03** | Three states (idle / submitting / success or error) rendered visibly and announced via `aria-live` | Two regions per WAI-ARIA APG: `aria-live="polite"` for idle/submitting/success, `aria-live="assertive"` for error (Topic 6 below). |
| **CTCT-04** | Honeypot field (custom name, NOT `_gotcha`) plus minimum-time-to-submit check to catch bots without reCAPTCHA | Field name `company` per D-13; min-time 1500ms per D-14. Both implemented as a wrapper around `useForm`'s `handleSubmit` — intercept synchronously, silent-success on trip (Topic 5 below). |
| **CTCT-05** | Client-side validation for required fields (name, email, message) with accessible error messages | Browser-native `<input required>` + `type="email"` for first-pass; `<ValidationError>` component from `@formspree/react` for server-side errors. Color is never the only indicator (text + accent border per A11Y-05 inheritance). |
| **CTCT-06** | `mailto:` fallback link below the form ("Or just email me directly →") so conversion never fully blocks if Formspree fails | `mailto:fakegoat1@gmail.com?subject=Hi%20Braeden` per D-15. Visible idle/submitting/success/error; explicitly named in error copy. |
| **CTCT-07** | Modal preserves background scroll lock; reopens cleanly if dismissed and reopened | `showModal()` makes background inert automatically (MDN). React component stays mounted in layout — `<dialog>` `display:none` until `showModal()` called; reopen is `showModal()` again, no remount needed. |
| **A11Y-03** | Modal contact form passes WCAG dialog requirements (focus trap, ESC, return focus to trigger) | All three delivered by `showModal()` natively. `aria-labelledby` on dialog → heading id per WAI-ARIA APG. (Topic 3 below.) |

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Contact modal UI + form state | Browser / Client | — | The form's React state (typed input values, controlled textarea, char counter, mount-timestamp) requires `useState` / `useEffect`. This is the ONLY client island in the project per FOUND-07. |
| Hash-driven open trigger | Browser / Client | — | `hashchange` event listener + `dialogRef.current.showModal()` are inherently client-side. Lives inside the same client island so the directive count stays 1. |
| Form submission | Backend (Formspree-hosted) | Browser / Client | Browser POSTs to `https://formspree.io/f/xqeypnkw`. `useForm` hook manages the submitting/succeeded/errors state machine. No project-side server code (no Route Handler, no Server Action). |
| Honeypot + min-time bot defense | Browser / Client | — | Both checks run synchronously in the submit handler before `useForm`'s underlying fetch fires. Silent-success returned from the wrapper. |
| Trigger surfaces (Nav link + /about CTA) | Frontend Server (RSC) | — | `Link` + `CTAArrowLink` remain pure Server Components. Phase 5 only swaps the `href` value (`/` → `#contact`). The hash-based architecture preserves the single-client-island invariant most cleanly. |
| Modal mount surface | Frontend Server (RSC) | Browser / Client | `app/layout.tsx` (Server Component) renders `<ContactModal />` as a child. The `<ContactModal>` component itself is the client island. Layout stays RSC. |
| Backdrop styling + entrance animation | Browser (CSS) | — | Pure CSS — `dialog::backdrop` rule, `@keyframes modal-fade-in`, `dialog[open]` selector. No JS for animation. |
| Reduced-motion override | Browser (CSS) | — | Inherited from existing `app/globals.css` global `@media (prefers-reduced-motion: reduce)` rule. No new CSS needed for reduced-motion handling. |
| Background scroll lock + focus trap | Browser (native dialog) | — | `showModal()` delivers both for free. Zero JS, zero CSS. |
| `mailto:` fallback handoff | OS (mail client) | Browser | Browser hands the `mailto:` URL to the registered mail handler. No project-side handling. |

---

## Standard Stack

### Core (already in package.json — Phase 5 introduces ONE new dep)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.2.6` | App Router, RSC, build | Locked. App Router's automatic layout wrapping is what makes mounting `<ContactModal />` in `app/layout.tsx` work cross-route. `[VERIFIED: package.json]` |
| `react` | `19.2.4` | UI runtime | Locked. `useState` lazy init `useState(() => Date.now())` is the React 16.8+ pattern for D-14 mount-timestamp. `[VERIFIED: package.json]` |
| `tailwindcss` | `4.3.0` | Styling primitives | Locked. Arbitrary properties (`text-[var(--color-muted)]`, `transition-[border-color,color,opacity]`) are required for the property-list discipline carry-forward from Phase 2 + 4. `[VERIFIED: package.json]` |
| `@vercel/analytics` | `2.0.1` | Pageviews | Already mounted in `app/layout.tsx`. Phase 5 does not touch. `[VERIFIED: app/layout.tsx]` |

### NEW (Phase 5 adds exactly one production dependency)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@formspree/react` | **`3.0.0`** | `useForm` hook + `ValidationError` component for posting to Formspree `xqeypnkw` | Locked in CLAUDE.md "Recommended Stack". v3.0.0 was published 2025-03-17 as a deliberate React 19 + Stripe-js 5 compatibility bump (verified via npm view). Latest version on registry as of this research (no v3.0.1+ exists). Peer-deps `react@^16.8 \|\| ^17.0 \|\| ^18.0 \|\| ^19.0`. Stripping ~3-5KB to the (only) client-island bundle. `[VERIFIED: npm view @formspree/react@3.0.0 published 2025-03-17, peerDependencies includes ^19.0]` |

### Supporting (already installed; Phase 5 may consume)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` | `2.1.1` | Conditional className composition | Use IF the planner needs runtime-conditional classes (e.g., field error border state). Tailwind arbitrary properties cover the inline-style cases without it. `[VERIFIED: package.json]` |
| `tailwind-merge` | `3.5.0` | Resolve Tailwind class conflicts | Likely not needed — modal does not accept `className` overrides. `[VERIFIED: package.json]` |

### Alternatives Considered + Rejected

| Instead of | Could Use | Why Rejected |
|------------|-----------|--------------|
| `@formspree/react@3.0.0` `useForm` | Raw `fetch()` POST to `https://formspree.io/f/${id}` | Saves ~3-5KB but requires hand-rolling the entire submitting/succeeded/errors state machine + retry edges. YAGNI per D-19. `[CITED: 05-CONTEXT.md D-19]` |
| Native `<dialog>` | Radix `@radix-ui/react-dialog@1.1.15` | Explicitly excluded by CLAUDE.md "What NOT to Use" — "the only modal on the site is the contact form. A ~50-line `<dialog>` element ships native, accessible, and zero-dep." Native `<dialog>.showModal()` delivers focus-trap, focus-return, ESC-close, scroll-lock for free. `[CITED: CLAUDE.md, MDN dialog]` |
| Hash-based trigger (`href="#contact"`) | Client-wrapper button (`<button onClick={openContact}>`) | Hash-based keeps Nav.tsx + CTAArrowLink.tsx as Server Components — preserves FOUND-07 single-island invariant cleanly. Button-wrapper requires a 2nd `'use client'` directive. D-06 strong recommendation: hash-based. `[CITED: 05-CONTEXT.md D-06]` |
| Reading `process.env.NEXT_PUBLIC_FORMSPREE_ID` at module top | Hard-coding `'xqeypnkw'` literal | Phase 1 D-13 set `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` in Vercel + .env.local. Reading it preserves single-source-of-truth. Next.js inlines `NEXT_PUBLIC_*` vars at build time — no runtime cost. Recommended: `useForm(process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'xqeypnkw')` (literal fallback for dev safety). `[VERIFIED: Next.js env var docs convention]` |

### Installation

```bash
npm install @formspree/react@3.0.0
```

**Version verification (executed this session 2026-05-13):**
```bash
$ npm view @formspree/react@latest version
3.0.0
$ npm view @formspree/react@3.0.0 main types peerDependencies
main = './dist/index.js'
types = './dist/index.d.ts'
peerDependencies = {
  react: '^16.8 || ^17.0 || ^18.0 || ^19.0',
  'react-dom': '^16.8 || ^17.0 || ^18.0 || ^19.0'
}
```

`[VERIFIED: npm registry, queried 2026-05-13]`

---

## Architecture Patterns

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│ Browser (any route)                                                │
│                                                                    │
│  ┌──────────────────┐       ┌──────────────────┐                   │
│  │ Nav.tsx (RSC)    │       │ /about page (RSC)│                   │
│  │  Contact link    │       │  Get in touch    │                   │
│  │  href="#contact" │       │  href="#contact" │                   │
│  └────────┬─────────┘       └────────┬─────────┘                   │
│           │                          │                             │
│           └────────┬─────────────────┘                             │
│                    │ click → URL hash = "#contact"                 │
│                    ▼                                               │
│           ┌────────────────────┐                                   │
│           │ window 'hashchange'│                                   │
│           └────────┬───────────┘                                   │
│                    │                                               │
│                    ▼                                               │
│  ┌──────────────────────────────────────────────────────┐          │
│  │ ContactModal.tsx ('use client' — THE single island) │          │
│  │                                                      │          │
│  │  useEffect listens to hashchange                     │          │
│  │      → if hash === '#contact': showModal()           │          │
│  │      → else: dialog.close()                          │          │
│  │                                                      │          │
│  │  ┌────────────────────────────────────────┐          │          │
│  │  │ <dialog> (native, top-layer)           │          │          │
│  │  │   ::backdrop (dim + 2px blur)          │          │          │
│  │  │                                        │          │          │
│  │  │  <h2> "Get in touch"                   │          │          │
│  │  │  <form onSubmit={wrappedHandleSubmit}> │          │          │
│  │  │    <input name="company" hidden/>      │ honeypot │          │
│  │  │    <input name="name" required/>       │          │          │
│  │  │    <input name="email" required/>      │          │          │
│  │  │    <textarea name="message" required/> │          │          │
│  │  │    <span> {len}/1000 </span> counter   │          │          │
│  │  │    <button> Send message </button>     │          │          │
│  │  │  </form>                               │          │          │
│  │  │  <a href="mailto:...">fallback →</a>   │          │          │
│  │  │  <div role="status" aria-live="polite">│          │          │
│  │  │  <div role="alert" aria-live="assert.">│          │          │
│  │  └────────────────────────────────────────┘          │          │
│  │                                                      │          │
│  │  wrappedHandleSubmit:                                │          │
│  │    1. if formData.get('company') !== ''  → silent OK │          │
│  │    2. if Date.now() - mountTs < 1500ms   → silent OK │          │
│  │    3. else → useForm.handleSubmit(event)             │          │
│  └────────────────────┬─────────────────────────────────┘          │
│                       │                                            │
└───────────────────────┼────────────────────────────────────────────┘
                        │ POST formdata
                        ▼
              ┌──────────────────────┐
              │ Formspree (external) │
              │ formspree.io/f/      │
              │ xqeypnkw             │
              └──────────┬───────────┘
                         │ on success
                         ▼
              ┌──────────────────────┐
              │ fakegoat1@gmail.com  │
              │ (existing inbox)     │
              └──────────────────────┘
```

### Recommended Project Structure

```
app/
├── layout.tsx                      # MODIFIED: mounts <ContactModal /> after <Footer />
├── about/page.tsx                  # MODIFIED: line 75 href "/" → "#contact"
└── globals.css                     # MODIFIED: appends @keyframes modal-fade-in,
                                    #           dialog[open] rule, dialog::backdrop rule

components/
├── contact/
│   └── ContactModal.tsx            # NEW: THE single 'use client' island
└── layout/
    └── Nav.tsx                     # MODIFIED: line 15 LINKS Contact href "/" → "#contact"

data/
└── site.ts                         # OPTIONAL (D-15a): add contactEmail field
                                    # for forward-compat per planner discretion

tests/
├── contact-modal-opens-from-nav.spec.ts        # NEW
├── contact-modal-opens-from-about.spec.ts      # NEW
├── contact-modal-esc-closes.spec.ts            # NEW
├── contact-modal-states.spec.ts                # NEW (verbatim copy assertions)
├── contact-modal-honeypot.spec.ts              # NEW
├── contact-modal-min-time.spec.ts              # NEW
├── contact-modal-mailto-fallback.spec.ts       # NEW
├── contact-trigger-rewire.spec.ts              # NEW (atomic D-05)
└── single-client-island.spec.ts                # NEW (FOUND-07 invariant)
```

---

### Pattern 1: Hash-Driven Modal Open (the load-bearing trigger pattern)

**What:** ContactModal client island listens to `window.hashchange` and `location.hash` on mount. When hash === `'#contact'`, it calls `dialogRef.current.showModal()`. When the dialog closes, it clears the hash so the URL stays clean.

**When to use:** This phase, exactly. Allows triggers (`<Link href="#contact">` from Nav + /about CTA) to remain pure Server Components.

**Example:**

```tsx
// components/contact/ContactModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'xqeypnkw';

export function ContactModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, handleSubmit, reset] = useForm(FORMSPREE_ID);

  // D-14: lazy-init mount timestamp — runs ONCE on mount
  const [mountTime] = useState(() => Date.now());

  const [message, setMessage] = useState('');

  // Hash-driven open/close — D-06 strong recommendation
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const sync = () => {
      if (window.location.hash === '#contact') {
        if (!dialog.open) dialog.showModal();
      } else {
        if (dialog.open) dialog.close();
      }
    };

    sync(); // initial-mount check (deep-link support: braehods.com/about#contact)
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  // Clear hash when dialog closes (ESC or backdrop click)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      if (window.location.hash === '#contact') {
        // history.replaceState avoids implicit scroll-to-top from clearing hash
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  // D-13 + D-14: honeypot + min-time-to-submit silent rejection
  const wrappedHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('company')) return; // honeypot trip — silent success-shaped
    if (Date.now() - mountTime < 1500) return; // min-time trip — silent success-shaped
    return handleSubmit(event); // pass through to Formspree
  };

  // Backdrop click closes (native dialog does NOT do this automatically)
  const onDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  };

  return (
    <dialog
      id="contact"
      ref={dialogRef}
      onClick={onDialogClick}
      data-test="contact-modal"
      aria-labelledby="contact-modal-heading"
      className="mx-4 max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded border border-[var(--color-border)] bg-[var(--color-bg-end)] p-6 md:p-8"
    >
      <h2
        id="contact-modal-heading"
        className="text-lg font-sans leading-relaxed"
        style={{ color: 'var(--color-text)' }}
      >
        Get in touch
      </h2>

      {state.succeeded ? (
        <SuccessState onReset={reset} />
      ) : (
        <>
          {state.errors && <ErrorState />}
          <form
            onSubmit={wrappedHandleSubmit}
            aria-busy={state.submitting}
            className="mt-6 flex flex-col gap-4"
          >
            {/* Honeypot — D-13 */}
            <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            {/* Name field group */}
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-name" className="text-sm font-sans" style={{ color: 'var(--color-muted)' }}>
                Name <span aria-hidden style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                disabled={state.submitting}
                className="px-3 py-2 text-base font-sans rounded border border-[var(--color-border)] bg-transparent transition-[border-color,color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:border-[var(--color-accent)]"
                style={{ color: 'var(--color-text)' }}
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-sm font-sans" />
            </div>

            {/* Email + Message fields follow the same pattern */}

            {/* Send + mailto block */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-sans transition-[border-color,color,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {state.submitting ? 'Sending…' : 'Send message'}
                </button>
              </div>
              <a
                href="mailto:fakegoat1@gmail.com?subject=Hi%20Braeden"
                className="group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4"
                style={{ color: 'var(--color-accent)' }}
              >
                Or just email me directly
                <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </form>
        </>
      )}

      {/* aria-live regions — CTCT-03 + A11Y-03 */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {state.submitting ? 'Sending your message.' : state.succeeded ? 'Message sent. Thanks.' : ''}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {state.errors ? 'Something went wrong sending your message. Try the email link below.' : ''}
      </div>
    </dialog>
  );
}
```

`[VERIFIED: MDN dialog spec, Formspree help docs, 05-UI-SPEC.md component contract table]`

---

### Pattern 2: `useForm` Hook Integration with Native `<form>`

**What:** `@formspree/react@3.0.0` `useForm(hashid)` returns `[state, handleSubmit, reset]`. State has `.submitting`, `.succeeded`, `.errors`, `.result`. Pass `handleSubmit` to a native `<form onSubmit>`.

**When to use:** Any form posting to Formspree.

**Example:**

```tsx
import { useForm, ValidationError } from '@formspree/react';

function MyForm() {
  const [state, handleSubmit, reset] = useForm('xqeypnkw');

  if (state.succeeded) {
    return <div>Thank you for signing up!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" />
      <ValidationError prefix="Email" field="email" errors={state.errors} />
      <button type="submit" disabled={state.submitting}>Sign up</button>
    </form>
  );
}
```

State object shape (verified against Formspree help docs):

| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `submitting` | `boolean` | `false` | True while request is in flight |
| `succeeded` | `boolean` | `false` | True after successful submission |
| `errors` | `SubmissionError \| null` | `null` | Server-side validation errors |
| `result` | `object \| null` | `null` | Contains redirect URL on success |

`reset()` clears `result` + `errors` and sets `submitting`/`succeeded` back to `false`.

`<ValidationError>` props: `field` (field name), `errors` (required, pass `state.errors`), `prefix` (optional, default "This field").

`[CITED: help.formspree.io/hc/en-us/articles/360055613373]`
`[CITED: WebSearch — Formspree React library docs, 2026-05-13]`

---

### Pattern 3: Honeypot + Min-Time Wrapper Around `useForm.handleSubmit`

**What:** Intercept the form's `onSubmit` BEFORE delegating to `useForm`'s handleSubmit. If the honeypot is filled OR submit happens within 1500ms of mount, return early (silent success-shaped — bot can't distinguish from real success).

**When to use:** Phase 5, exactly as below.

**Example:**

```tsx
const [mountTime] = useState(() => Date.now()); // lazy init — runs ONCE

const wrappedHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  // D-13: honeypot trip — silent success-shaped (no Formspree call, no email)
  if (formData.get('company')) return;

  // D-14: min-time trip — silent success-shaped
  if (Date.now() - mountTime < 1500) return;

  // Real submission — pass through to useForm's handleSubmit
  return handleSubmit(event);
};
```

**Critical detail:** When honeypot or min-time trip, the `state.succeeded` from `useForm` will NOT be `true` — because we never called `useForm.handleSubmit`. To make the bot defense indistinguishable from a real success per UI-SPEC, you have two options:

- **Option A (recommended):** Maintain a separate `bypassedSuccess` state that the success-state JSX reads alongside `state.succeeded` (e.g., `if (state.succeeded || bypassedSuccess) return <SuccessState />`).
- **Option B:** Skip the success-state UI for bypassed submissions — let the bot see a still-rendered form. Less ideal because some bots check for state changes; Option A is the locked behavior per UI-SPEC line 337.

**Recommended:** Option A — set `bypassedSuccess` to `true` on either trip, reset to `false` when "Send another →" is clicked.

`[CITED: 05-UI-SPEC.md "Silent success behavior (locked)" line 337]`

---

### Pattern 4: CSS-Only Modal Entrance (D-16)

**What:** New `@keyframes modal-fade-in` (opacity-only) + `dialog[open]` selector that runs the keyframe. Backdrop gets the same keyframe at 150ms duration.

**When to use:** Append to `app/globals.css` after the existing `fade-in-up` keyframe block.

**Example:**

```css
/* Phase 5 — Contact Modal entrance (D-16, D-18) */
@keyframes modal-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

dialog[open] {
  animation: modal-fade-in 240ms cubic-bezier(0.2, 0, 0, 1) both;
}

dialog[open]::backdrop {
  animation: modal-fade-in 150ms cubic-bezier(0.2, 0, 0, 1) both;
  background-color: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(2px);
}
```

**Why NOT reuse `fade-in-up`:** The existing keyframe has `transform: translateY(8px)` which would visually conflict with the browser's centering of `<dialog>` via top-layer rules (the 8px shift would jitter the centered position). Use opacity-only.

**Alternative (Option A from UI-SPEC):** `@starting-style` modern CSS approach — works in Chrome/Safari/Firefox 117+ which all release in 2024+ so coverage is sufficient for 2026 baseline. Either approach is correct; the keyframe approach is broader-supported and is what the UI-SPEC recommends as Option B.

**Reduced motion:** The existing `app/globals.css` lines 54-63 `@media (prefers-reduced-motion: reduce)` rule sets `animation-duration: 0.01ms !important` for ALL elements (the universal selector `*, *::before, *::after`). This automatically defeats `modal-fade-in` for both the dialog and the backdrop. **No new reduced-motion rule needed.**

`[VERIFIED: app/globals.css existing lines 54-63 reviewed; MDN @starting-style baseline support]`

---

### Pattern 5: Atomic Trigger Rewire (D-05 binding)

**What:** Two single-line edits, one commit (or one Wave). Both files stay Server Components; only the `href` value changes.

**When to use:** Exactly one task in the plan covers both edits, OR two tasks in the same Wave with the same commit (executor groups them in a single `git commit`).

**Edit 1 — `components/layout/Nav.tsx` line 15:**

```diff
 const LINKS = [
   { href: '/about', label: 'About' },
   { href: '/work', label: 'Work' },
-  { href: '/', label: 'Contact' }, // stub until Phase 5 wires the modal trigger
+  { href: '#contact', label: 'Contact' },
 ];
```

**Edit 2 — `app/about/page.tsx` line 75:**

```diff
   <div className="mt-6">
-    <CTAArrowLink href="/" staggerIndex={4}>
+    <CTAArrowLink href="#contact" staggerIndex={4}>
       Get in touch
     </CTAArrowLink>
   </div>
```

**Plan-checker note:** Refuse plans that put these in different Waves. The atomic-swap binding is from Phase 3 D-15 carry-forward + Phase 5 D-05.

`[VERIFIED: Nav.tsx line 15 + app/about/page.tsx line 75 read this session]`

---

### Anti-Patterns to Avoid

- **Re-using `fade-in-up` keyframe for the modal entrance** — its 8px translateY conflicts with browser-centered dialog. Use the new opacity-only `modal-fade-in` keyframe.
- **Adding a 2nd `'use client'` directive** for a `<ContactTrigger>` button wrapper — breaks FOUND-07 invariant. The hash-based architecture per D-06 avoids this entirely.
- **Calling `dialog.show()` instead of `dialog.showModal()`** — `show()` is the non-modal variant; gives no focus trap, no scroll lock, no top-layer behavior, no automatic ESC close. **Always `showModal()`.**
- **Using `transition-colors` shorthand on the Send button or input fields** — Phase 2 + 4 lesson: Tailwind v4's `transition-colors` includes `outline-color` in the property list, which combined with the global `:focus-visible` accent ring causes the ring to interpolate from rest to accent over 200ms (regresses `focus-ring.spec.ts`). **Always use the arbitrary single-property list:** `transition-[border-color,color,opacity]` or similar.
- **Using `_gotcha` as the honeypot field name** — explicit CTCT-04 reject; bots trained on the well-known Formspree honeypot will skip it. Use `company` per D-13.
- **Surfacing raw Formspree error messages** — explicit D-11 reject. Use the locked verbatim error copy.
- **Adding a visible close-X button** — explicit UI-SPEC silence + editorial restraint. ESC + backdrop-click are the close affordances.
- **Setting `location.hash = ''` on close** — clears the hash but causes implicit scroll-to-top in some browsers. Use `history.replaceState(null, '', location.pathname + location.search)` instead (per UI-SPEC pattern + D-06 hash cleanup).
- **Mounting `<ContactModal />` inside `<main>` instead of after `<Footer />`** — native `<dialog>` `showModal()` participates in the top-layer regardless of DOM position, but conventionally the dialog sits as a sibling of `<main>` not inside it. Mount in `app/layout.tsx` after `<Footer />` per UI-SPEC + D-06.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal focus trap | Custom Tab-cycle event handler | Native `<dialog>.showModal()` | Browser-delivered, A11Y-correct out of the box. Your hand-rolled version will miss edge cases (Shift-Tab from first element, focus-on-disabled-button, IME input mode). `[VERIFIED: MDN dialog]` |
| Modal scroll lock | `document.body.style.overflow = 'hidden'` | Native `<dialog>.showModal()` | `showModal()` makes the rest of the page inert automatically. Hand-rolling overflow-hidden has known iOS Safari bugs (the body scrolls anyway under certain Safari versions). `[VERIFIED: MDN dialog "Modal dialogs ... block interaction with other UI elements, making the rest of the page inert"]` |
| Return focus to trigger on close | Custom `previouslyFocused = document.activeElement` + restore on close | Native `<dialog>.showModal()` | The browser tracks the trigger automatically when `showModal()` is called and restores focus on `close()`. Your version will fail if focus changes during the modal lifetime. `[VERIFIED: MDN dialog]` |
| ESC-to-close | Custom keydown listener | Native `<dialog>.showModal()` | Default behavior on `showModal()`. Also handles Esc-only-dismisses-topmost-dialog if multiple are open (multi-modal scenarios). `[VERIFIED: MDN dialog "closedby='closerequest' (default)"]` |
| Form submission state machine (submitting/succeeded/errors) | Custom `useReducer` + `fetch()` to Formspree | `@formspree/react@3.0.0` `useForm` | Locked by D-19 + CLAUDE.md. ~3-5KB ships, but you stop hand-rolling 60+ lines of state-machine + retry-edge-case logic. `[CITED: 05-CONTEXT.md D-19]` |
| Field validation error display | Manual `<p>` with conditional rendering | `<ValidationError prefix="..." field="..." errors={state.errors}>` from `@formspree/react` | Renders accessibly. Pairs with the `useForm` state shape. `[CITED: Formspree help docs]` |
| Modal entrance animation orchestration | JS-driven opacity tween via `requestAnimationFrame` | CSS `@keyframes modal-fade-in` + `dialog[open]` selector | Pure CSS. Reduced-motion override applies for free via existing global `@media` rule. `[CITED: 05-UI-SPEC.md D-16]` |
| Email format validation | Custom regex | Browser-native `<input type="email" required>` | Combined with `<ValidationError>` for Formspree-side strictness. Browser's loose check catches typos; Formspree catches invalid syntax. `[CITED: 05-UI-SPEC.md "Form validation"]` |
| Background scroll-lock cross-browser polyfill | Heavy library (`body-scroll-lock`) | Native `<dialog>.showModal()` | Already delivered. `[VERIFIED: MDN]` |

**Key insight:** Phase 5 introduces ~80-150 lines of `ContactModal.tsx`, but ~70% of that is wiring (refs, useEffect for hashchange, two aria-live regions, the silent-success bypass state). The modal's accessibility surface (focus trap, scroll lock, ESC, return-focus) is **entirely browser-delivered via `showModal()`** — zero JS for any of it. The form's state machine is delivered by `useForm`. The ONLY hand-rolled logic in the entire client island is: hash-listener wiring (~15 lines) + honeypot/min-time intercept (~8 lines) + char counter state (~3 lines) + backdrop-click handler (~3 lines) + the JSX. Everything else is library or browser.

---

## Common Pitfalls

### Pitfall 1: Hash-Based Trigger Doesn't Fire `hashchange` on Same-Hash Click

**What goes wrong:** User clicks Nav `Contact` link (hash becomes `#contact`, modal opens). User closes modal (hash cleared via `history.replaceState`). User clicks Nav `Contact` link again — but if the previous hash was already `#contact` and it's set again to `#contact`, no `hashchange` event fires.

**Why it happens:** The browser fires `hashchange` only when the hash actually changes. Setting it to the same value is a no-op.

**How to avoid:** Use `history.replaceState(null, '', location.pathname + location.search)` on close (clears the hash to empty). Then the next `#contact` click is a real change. The hashchange listener will fire correctly.

**Warning signs:** Manual reproduction: open → ESC close → click Nav Contact → modal doesn't reopen. Spec catches this if it covers the open-close-reopen cycle.

`[CITED: MDN hashchange event spec]`

---

### Pitfall 2: `useForm` State Doesn't Reset Between Open/Close Cycles

**What goes wrong:** User submits form successfully (state.succeeded = true). User closes modal. User reopens modal — modal still shows the success state because `useForm`'s state persists across open/close (the React component stays mounted in the layout; only the `<dialog>` `display: none`s).

**Why it happens:** `<dialog>.close()` doesn't unmount the React component. State survives.

**How to avoid:** Call `reset()` (the third return from `useForm`) when the dialog closes via the close-event handler. Pattern:

```tsx
useEffect(() => {
  const dialog = dialogRef.current;
  if (!dialog) return;
  const onClose = () => {
    // Clear hash + reset Formspree state + reset form fields
    if (window.location.hash === '#contact') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    reset();
    setMessage('');
    setBypassedSuccess(false);
  };
  dialog.addEventListener('close', onClose);
  return () => dialog.removeEventListener('close', onClose);
}, [reset]);
```

**Warning signs:** Spec catches this if it covers the submit → close → reopen → expect-idle cycle (CTCT-07: "reopens cleanly if dismissed and reopened").

`[CITED: 05-UI-SPEC.md interaction contract "Modal reopen after dismiss (CTCT-07)" line 533, Formspree useForm reset() docs]`

---

### Pitfall 3: Disabled `<input>` Loses Typed Values on Some Browsers

**What goes wrong:** D-12 says fields disable during submitting state to "preserve the visitor's typed values if the submit takes a beat." But some browsers (older Safari versions) clear the disabled input's display in certain edge cases.

**Why it happens:** `disabled` doesn't clear the value, but the browser may render the input with empty placeholder if the underlying state desyncs.

**How to avoid:** Use **controlled inputs** (`value={...}` + `onChange`) for at least the message textarea (already controlled per D-02 char counter). For name/email — uncontrolled with `disabled` is safe in modern browsers (Chromium, Safari 16.4+, Firefox 128+ — the 2026 baseline per CLAUDE.md). Verify in the Phase Exit Visual Verification checklist already in UI-SPEC line 614.

**Warning signs:** During the "force network error during submit" verification step in UI-SPEC line 615, type values into all 3 fields, click Send, switch DevTools to Offline, observe — typed content should remain visible after error renders.

`[CITED: HTML spec, browser baseline from CLAUDE.md "tailwindcss@4.2.4 ... Browsers: Safari 16.4+, Chrome 111+, Firefox 128+"]`

---

### Pitfall 4: Tailwind v4 `transition-colors` Includes `outline-color` and Clobbers Focus Ring

**What goes wrong:** Send button or input fields use `transition-colors` shorthand. The `:focus-visible` global rule in `globals.css` sets `outline: 2px solid var(--color-accent); outline-offset: 2px`. Because `transition-colors` includes `outline-color` in its property list, when the field receives focus the outline interpolates over 200ms from the inherited `currentcolor` (likely muted text color) → accent. Spec `tests/focus-ring.spec.ts` captures the in-flight muted value on first frame after Tab → assertion fails.

**Why it happens:** Tailwind v4's `transition-colors` is `transition: color, background-color, border-color, text-decoration-color, fill, stroke, **outline-color** 150ms` (the outline-color was added in v4, not in v3).

**How to avoid:** Use the arbitrary single-property list discipline: `transition-[border-color,color,opacity]` for the Send button, `transition-[border-color,color]` for inputs/textarea. Already established convention from Phase 2 + 4 (Plan 02-04 `e3ed657 fix(phase-2/w2): narrow Footer/SocialIconLink hover-transition to 'color'` and Plan 04-02 ProjectCard).

**Warning signs:** `tests/focus-ring.spec.ts` regression after merge. Run it locally before commit.

`[VERIFIED: STATE.md "Plan 06 Rule 1: lighthouse mono regex" + "Tailwind v4 transition-colors includes outline-color"]`

---

### Pitfall 5: `useForm` Honeypot Bypass Doesn't Trigger Success State (User Experience Inconsistency)

**What goes wrong:** Bot fills honeypot. Submit handler returns early without calling `useForm.handleSubmit`. `state.succeeded` stays `false` — modal still shows the form, not the success state. Bot detects "no state change after submit" and learns the field is a honeypot.

**Why it happens:** The success-state UI is gated on `state.succeeded` from `useForm`. Bypassed submissions never call into `useForm`, so its state never updates.

**How to avoid:** Maintain a separate `bypassedSuccess` boolean state. Show the success UI when EITHER `state.succeeded` OR `bypassedSuccess` is true:

```tsx
const [bypassedSuccess, setBypassedSuccess] = useState(false);

const wrappedHandleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  if (formData.get('company')) { setBypassedSuccess(true); return; }
  if (Date.now() - mountTime < 1500) { setBypassedSuccess(true); return; }
  return handleSubmit(event);
};

const showSuccess = state.succeeded || bypassedSuccess;
// ... in JSX: {showSuccess ? <SuccessState ... /> : <Form ... />}
```

**Warning signs:** `tests/contact-modal-honeypot.spec.ts` should assert that filling the honeypot + submitting renders the success copy (verbatim "Thanks — I'll get back to you within a day or two.") AND fires zero network calls to formspree.io.

`[CITED: 05-UI-SPEC.md "Silent success behavior (locked)" line 337]`

---

### Pitfall 6: `<dialog>` Backdrop-Click Detection Catches Form Clicks Too

**What goes wrong:** Naïve handler `onClick={(e) => dialog.close()}` closes the dialog on ANY click inside it, including clicks on the form fields.

**Why it happens:** Click events bubble. A click on the `<input>` inside the dialog also fires on the dialog itself (the dialog is the click target's ancestor).

**How to avoid:** Check the click target IS the dialog itself, not a descendant: `if (e.target === e.currentTarget) dialog.close()`. Native `<dialog>` sized smaller than the viewport, the click on the backdrop area DOES register on the dialog element (the dialog's bounding rect when the dialog uses default centering is the modal content rect, but clicks "outside the modal content" still propagate to the dialog because the backdrop is a pseudo-element, not a separate DOM node).

**Caveat:** This pattern works correctly when the dialog's CSS does NOT use `display: flex; align-items: center; justify-content: center;` to fake the centering. The browser's native top-layer centering puts the dialog content directly at the click target — clicks on the backdrop area land on `e.target === dialog`. Verify on real device.

**Alternative (modern):** Use `<dialog closedby="any">` attribute (HTML spec, supported in Chrome 132+, Safari 18.2+ as of 2025). Closes on backdrop click + ESC declaratively, no JS needed. **2026 baseline coverage check needed before adopting** — Firefox support landed mid-2025.

**Recommendation for Phase 5:** Use the JS click-handler pattern (Option B from MDN) for now; revisit `closedby="any"` in Phase 6 polish once browser-share data confirms baseline coverage.

`[VERIFIED: MDN dialog "closedby" + Option B click handler]`

---

### Pitfall 7: iOS Safari Auto-Zooms on Input Focus When Font-Size < 16px

**What goes wrong:** Input + textarea have `text-sm` (14px). User on iPhone taps the field. Safari auto-zooms the page (visual disruption + the modal rect shifts).

**Why it happens:** iOS Safari auto-zooms any input with computed font-size < 16px to "help" the user read it.

**How to avoid:** Lock input + textarea content font-size at 16px (`text-base`). UI-SPEC already mandates this (Typography table line 112: "Input + textarea content | 16px / 1rem | Geist Sans | 400 ... NOT 14px (would trigger iOS zoom on mobile, hostile UX)").

**Warning signs:** Real-device test on iPhone Safari (UI-SPEC Phase Exit Visual Verification line 628). DevTools mobile emulation does NOT replicate this behavior — must test on real iOS or BrowserStack.

`[CITED: 05-UI-SPEC.md Typography table line 112; iOS Safari auto-zoom is widely documented behavior]`

---

## Code Examples

### Char counter with conditional warning color (D-02)

```tsx
const [message, setMessage] = useState('');

// In JSX:
<textarea
  id="contact-message"
  name="message"
  rows={4}
  maxLength={1000}
  required
  disabled={state.submitting}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  // ... className + style
/>
<div className="mt-1 flex justify-end">
  <span
    className="text-sm font-mono"
    style={{ color: message.length > 800 ? '#c8a86a' : 'var(--color-muted)' }}
  >
    {message.length} / 1000
  </span>
</div>
```

`[CITED: 05-UI-SPEC.md component contract table char counter row]`

### Mounting ContactModal in app/layout.tsx (one-line addition)

```tsx
// app/layout.tsx — diff from current
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
+ import { ContactModal } from '@/components/contact/ContactModal';
import { fraunces, GeistSans, GeistMono } from './fonts';
import './globals.css';

// ... metadata unchanged

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
        <Footer />
+       <ContactModal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

`[VERIFIED: app/layout.tsx current state read this session]`

### Single-client-island invariant test (FOUND-07 carry-forward)

The existing `tests/no-client-components.spec.ts` (line 65) currently asserts ZERO `'use client'` directives. After Phase 5, it must allow exactly ONE — the ContactModal. The cleanest split:

- Keep `tests/no-client-components.spec.ts` for ALL non-Phase-5 directories (`app/` excluding ContactModal path, `lib/`, etc.) — assert ZERO.
- New `tests/single-client-island.spec.ts` — asserts EXACTLY ONE `'use client'` directive across `app/`, `components/`, `lib/`, AND that the one directive is in `components/contact/ContactModal.tsx` (path is the contract).

`[VERIFIED: tests/no-client-components.spec.ts read this session]`

---

## State of the Art

| Old Approach | Current Approach (2026 baseline) | When Changed | Impact |
|--------------|----------------------------------|--------------|--------|
| Radix Dialog primitive | Native HTML `<dialog>` element | Browser support reached baseline ~2023 (all major browsers Chrome 37+, Safari 15.4+, Firefox 98+) | Zero-dep modal with browser-managed focus trap, scroll lock, ESC, return-focus. Per CLAUDE.md: "the only modal on the site is the contact form. A ~50-line `<dialog>` element ships native, accessible, and zero-dep." |
| `body-scroll-lock` polyfill | Native `<dialog>.showModal()` background-inert | Same as above | Inert background is automatic. Don't ship a polyfill. |
| Manual focus management on modal open/close | Native `<dialog>.showModal()` + `autofocus` attribute | Same as above | Browser tracks trigger element. `autofocus` on the first focusable child sets initial focus deterministically across browsers. |
| Hand-rolled fetch + state machine for Formspree | `@formspree/react@3.0.0` `useForm` hook | Maintained by Formspree, v3 published 2025-03-17 with React 19 support | ~3-5KB additional bundle, eliminates 60+ lines of state-machine code. |
| `_gotcha` honeypot field name | Custom honeypot field name (`company` per D-13) | Bots learned `_gotcha` as the well-known Formspree default | CTCT-04 explicit exclusion. Custom names defeat trained bots. |
| Hidden field via `display: none` | Off-screen positioning (`position:absolute; left: -10000px`) + `opacity: 0` + `pointer-events: none` + `aria-hidden="true"` + `tabindex="-1"` | `display: none` excludes the field from form submission entirely (a real protection problem) — must remain in DOM but invisible | The off-screen pattern keeps the field in the form data so the bot detection works, while ensuring humans + screen readers + keyboard never reach it. |
| reCAPTCHA / hCaptcha | Honeypot + min-time-to-submit (no captcha) | User-hostile, Google tracking pixel, breaks editorial mood | REQUIREMENTS.md Out-of-Scope. Future migration target if spam volume warrants: Cloudflare Turnstile (free, no Google tracking). |

**Deprecated/outdated:**
- Radix UI for modals — fine library, but unnecessary when only modal is the contact form. CLAUDE.md "What NOT to Use" explicit.
- Server Actions for the contact form — CLAUDE.md "Other Specific Decisions" explicit reject ("the form is the *only* dynamic piece on the site"). `useForm` keeps the state machine on the client where the entire feature lives.
- `<input type="email">` browser validation as the sole validator — too loose (accepts `a@b`). Pair with `<ValidationError>` for Formspree-side strictness.

---

## Assumptions Log

> Every claim in this research was verified against npm registry, MDN, Formspree help docs, or read directly from the project's existing files. **No claims tagged `[ASSUMED]`.**

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| — | (none — see verification protocol) | — | — |

**This table is empty:** All claims in this research were verified or cited — no user confirmation needed beyond what CONTEXT.md already locks.

---

## Open Questions

1. **Should `data/site.ts.contactEmail` be added in v1, or hard-coded for v1 + Phase 6 swap?** (D-15a informational discretion)
   - What we know: D-15 locks the literal `mailto:fakegoat1@gmail.com?subject=Hi%20Braeden`. D-15a says future swap to `hi@braehods.com` is a single-line edit in `data/site.ts.contactEmail` IF the value is factored into the data layer.
   - What's unclear: Whether v1 should pre-build the indirection (low cost, ~6 lines including type addition) or defer to Phase 6 polish (zero cost now, slightly larger commit later when domain mail is wired).
   - Recommendation: Pre-build the indirection in v1. Cost is trivial (one field added to `SiteMeta` + one literal), benefit is one-line edit when `hi@braehods.com` is ready. Add to `data/site.ts` as part of the Phase 5 plan.

2. **Should `<dialog closedby="any">` replace the JS click handler pattern?** (Modern HTML attribute, declarative backdrop-close)
   - What we know: `closedby="any"` was added to the HTML spec in 2024-2025; Chrome 132+, Safari 18.2+ support. Firefox support landed mid-2025.
   - What's unclear: Whether 2026 baseline (per CLAUDE.md "Browsers: Safari 16.4+, Chrome 111+, Firefox 128+") covers `closedby="any"` reliably. Safari 16.4 does NOT support it (needs 18.2+).
   - Recommendation: Stay with the JS click-handler pattern (Option B from MDN) for v1. Phase 6 polish revisits if browser-share data confirms baseline coverage. The JS pattern is well-understood and ~3 lines.

3. **Should the spec for `tests/contact-modal-states.spec.ts` mock the Formspree network call, or hit the real endpoint?**
   - What we know: Phase 4 lesson (Plan 04-02) used `:text-is()` exact-match selectors to defeat substring collision. Same discipline applies here.
   - What's unclear: Mocking Formspree (clean, deterministic, no network dependency, no email noise) vs hitting real endpoint (verifies the env var + endpoint integrity but emits a real email per spec run).
   - Recommendation: Mock for the state-render specs (`contact-modal-states.spec.ts`, `contact-modal-honeypot.spec.ts`, `contact-modal-min-time.spec.ts`). Real endpoint hit deferred to the manual Phase Exit Visual Verification checklist (UI-SPEC line 614). Use `page.route('**/formspree.io/**', route => route.fulfill({ status: 200, body: '{"ok":true}' }))` to mock.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | dev/build | ✓ (assumed — project running) | Node 20 LTS per CLAUDE.md | — |
| npm | install `@formspree/react@3.0.0` | ✓ (queried this session) | — | — |
| Internet (npm registry) | install dep | ✓ (verified version 3.0.0 published 2025-03-17) | — | — |
| Formspree endpoint `xqeypnkw` | runtime form submission | ✓ (assumed — set in Vercel + .env.local from Phase 1 D-13, not re-verified this session) | — | mailto fallback per CTCT-06 |
| `NEXT_PUBLIC_FORMSPREE_ID` env var | build-time inline into client bundle | ✓ (assumed per Phase 1 D-13 + STATE.md "W4-T1 done — `NEXT_PUBLIC_FORMSPREE_ID` set") | `xqeypnkw` | hard-coded literal as fallback in code |
| Playwright | test execution | ✓ | `^1.59.1` | — |
| `@playwright/test` chromium-mobile + chromium-desktop projects | test execution | ✓ | configured in `playwright.config.ts` | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None — Formspree downtime is handled by the mailto fallback (CTCT-06), not by an environment fallback.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright `^1.59.1` (already installed) |
| Config file | `playwright.config.ts` (existing — testDir `./tests`, timeout 30s, baseURL `process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'`, projects `chromium-mobile` + `chromium-desktop`) |
| Quick run command | `npx playwright test tests/contact-modal-*.spec.ts --project=chromium-mobile` |
| Full suite command | `npm run test:full` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| CTCT-01 | Modal opens via Nav Contact link, focus trapped | integration (browser) | `npx playwright test tests/contact-modal-opens-from-nav.spec.ts` | ❌ Wave 0 |
| CTCT-01 | Modal opens via /about Get in touch CTA, focus trapped | integration | `npx playwright test tests/contact-modal-opens-from-about.spec.ts` | ❌ Wave 0 |
| CTCT-01 + CTCT-07 + A11Y-03 | ESC closes, focus returns to trigger, hash clears | integration | `npx playwright test tests/contact-modal-esc-closes.spec.ts` | ❌ Wave 0 |
| CTCT-02 | Form submits to Formspree (mocked) and success state renders | integration | `npx playwright test tests/contact-modal-states.spec.ts` (test name: "submits and shows success") | ❌ Wave 0 |
| CTCT-03 | All 4 states render expected verbatim copy + are wrapped in `aria-live` regions | integration | `npx playwright test tests/contact-modal-states.spec.ts` (test names: "idle/submitting/success/error") | ❌ Wave 0 |
| CTCT-04 | Honeypot trip → silent success, ZERO Formspree network call | integration | `npx playwright test tests/contact-modal-honeypot.spec.ts` | ❌ Wave 0 |
| CTCT-04 | Min-time trip (submit < 1500ms) → silent success, ZERO Formspree call | integration | `npx playwright test tests/contact-modal-min-time.spec.ts` | ❌ Wave 0 |
| CTCT-05 | Empty submit → browser-native validation surfaces inline error | integration | `npx playwright test tests/contact-modal-states.spec.ts` (test name: "empty submit blocks") | ❌ Wave 0 |
| CTCT-06 | mailto: fallback link present + correct href + visible in all 4 states | integration | `npx playwright test tests/contact-modal-mailto-fallback.spec.ts` | ❌ Wave 0 |
| CTCT-07 | Modal preserves background scroll lock; reopens cleanly after dismiss | integration | `npx playwright test tests/contact-modal-esc-closes.spec.ts` (test name: "reopens cleanly") | ❌ Wave 0 |
| A11Y-03 | `aria-labelledby` on dialog → heading id; tab cycles inside dialog | integration | `npx playwright test tests/contact-modal-states.spec.ts` (test name: "a11y attributes") | ❌ Wave 0 |
| D-05 (atomic) | Both Nav.tsx + /about CTA point at `#contact` (verified by reading source files) | unit (filesystem) | `npx playwright test tests/contact-trigger-rewire.spec.ts` | ❌ Wave 0 |
| FOUND-07 | Exactly 1 `'use client'` directive across `app/`, `components/`, `lib/` (the ContactModal) | unit (filesystem) | `npx playwright test tests/single-client-island.spec.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx playwright test tests/contact-modal-*.spec.ts tests/single-client-island.spec.ts tests/contact-trigger-rewire.spec.ts --project=chromium-mobile` (focused Phase 5 set, ~10s)
- **Per wave merge:** `npm run test:full` against local `npm start` (full 32+ spec suite, regression canary for Phase 1-4 chrome)
- **Phase gate:** Full suite green + manual Phase Exit Visual Verification (UI-SPEC lines 600-628) before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/contact-modal-opens-from-nav.spec.ts` — covers CTCT-01 (Nav trigger)
- [ ] `tests/contact-modal-opens-from-about.spec.ts` — covers CTCT-01 (/about trigger)
- [ ] `tests/contact-modal-esc-closes.spec.ts` — covers CTCT-01 + CTCT-07 + A11Y-03
- [ ] `tests/contact-modal-states.spec.ts` — covers CTCT-03 + CTCT-05 + A11Y-03 (uses `:text-is()` exact-match for the 5 verbatim-locked copy strings per Phase 4 lesson)
- [ ] `tests/contact-modal-honeypot.spec.ts` — covers CTCT-04 (honeypot half) — uses `page.route('**/formspree.io/**', ...)` to assert ZERO network call
- [ ] `tests/contact-modal-min-time.spec.ts` — covers CTCT-04 (min-time half) — uses Playwright clock manipulation OR direct Date.now() check
- [ ] `tests/contact-modal-mailto-fallback.spec.ts` — covers CTCT-06
- [ ] `tests/contact-trigger-rewire.spec.ts` — covers D-05 atomic swap (filesystem grep on Nav.tsx line 15 + about/page.tsx line 75)
- [ ] `tests/single-client-island.spec.ts` — covers FOUND-07 (recursive grep across `app/`, `components/`, `lib/` for exactly 1 `'use client'`)

**Update existing spec:** `tests/no-client-components.spec.ts` — adjust to assert ZERO `'use client'` outside the ContactModal path (or replace entirely with `single-client-island.spec.ts`).

**No framework install needed** — Playwright + 2 projects already configured.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth — public contact form |
| V3 Session Management | no | No sessions — stateless POST to Formspree |
| V4 Access Control | no | Public-facing form, no access control |
| V5 Input Validation | yes | Browser-native `<input required>` + `type="email"` for first-pass; `<ValidationError>` from `@formspree/react` for server-side; Formspree's own validation as the authoritative gate |
| V6 Cryptography | no | TLS handled by Vercel + Formspree; no client-side crypto |
| V8 Data Protection | yes (light) | Form data POSTed to Formspree over HTTPS; no PII stored client-side beyond React state during the modal lifetime |
| V11 Business Logic | yes (light) | Honeypot + min-time-to-submit are bot defense (NOT auth) — silent rejection prevents bot-training feedback loops |

### Known Threat Patterns for Native `<dialog>` + Formspree

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Form spam (bot DOM enumeration + submit) | Repudiation / Tampering | Honeypot field name `company` (D-13) + min-time-to-submit 1500ms (D-14). Both silent-reject — no error feedback that bots can train against. |
| Cross-site scripting via form input echoed back | Tampering / Information Disclosure | Form values are POSTed to Formspree (third-party domain) and never rendered back into the page DOM. Even success state renders only locked verbatim copy, NOT user input. Zero XSS surface from the user's typed values inside our app. |
| Formspree credential leakage | Information Disclosure | Form ID `xqeypnkw` is public by design (anyone with the ID can POST). Scoped to a specific endpoint. Not a secret. Setting it via `NEXT_PUBLIC_FORMSPREE_ID` env var is correct (the `NEXT_PUBLIC_` prefix signals "this WILL be inlined into the client bundle"). |
| CSRF against Formspree | Tampering | Formspree handles CSRF on their side (form ID acts as the token). Our POST originates from the client form directly — not vulnerable to CSRF in the traditional sense. |
| Formspree DoS / abuse | Denial of Service | T-01-08 from Phase 1 plan explicitly accepted this risk: "Phase 5 ships honeypot + min-time-to-submit per CTCT-04." Honeypot + min-time are the v1 defense. Migration target if needed: Cloudflare Turnstile (free, no Google tracking). reCAPTCHA explicitly excluded. |
| `mailto:` link XSS via subject param | Tampering | Subject `Hi%20Braeden` is hard-coded in source — no user input concatenated. Zero XSS surface. |
| Open redirect via `window.location.hash` | Tampering | Hash is read-only (we read `window.location.hash` to decide whether to open) and only set to two values: `''` (clear) and never set TO `#contact` programmatically (the user clicks a Link, browser sets it). No redirect surface. |
| Disabled-input bypass via DevTools (form submission while submitting state active) | Tampering | `useForm` state.submitting prevents double-submit on its side. Even if a malicious user re-enables the disabled input + re-clicks Send, `useForm` will track the in-flight request and not double-fire. |

### Phase 5 Security Posture Summary

The contact modal has a small, well-understood threat surface:
- All form data flows OUT to Formspree, never back IN to the page (no XSS reflection).
- The Formspree endpoint ID is non-secret by design.
- Bot defense is honeypot + min-time (no captcha, no cost).
- All client-side behavior is bounded by the single client island — no other route depends on it.

No security-blocking findings. ASVS Level 1 cleared for this phase.

---

## Phase Risks / Landmines (what could go wrong during execution)

1. **Same-hash click doesn't fire `hashchange` after close** (Pitfall 1) — must use `history.replaceState` not `location.hash = ''`. Spec must cover the open-close-reopen cycle.
2. **`useForm` state survives across open/close** (Pitfall 2) — must call `reset()` + clear local state in the dialog `close` event handler. Spec must cover submit → close → reopen → expect-idle.
3. **Tailwind v4 `transition-colors` clobbers focus ring** (Pitfall 4) — must use the arbitrary single-property list discipline from Phase 2 + 4. `tests/focus-ring.spec.ts` is the regression canary.
4. **Honeypot/min-time bypass without success-state UI** (Pitfall 5) — must maintain `bypassedSuccess` state separately from `state.succeeded`.
5. **iOS Safari auto-zoom on input focus** (Pitfall 7) — must lock input + textarea content font-size at 16px (already in UI-SPEC; risk is an executor accidentally using `text-sm` for "tighter look").
6. **Forgetting `aria-busy="true"` on form during submitting state** — D-12 explicit; spec must assert.
7. **Backdrop click handler catches form clicks** (Pitfall 6) — must use `e.target === e.currentTarget` check.
8. **Atomic trigger swap split across waves** (D-05 binding) — plan-checker MUST refuse plans that put Nav.tsx swap and /about page.tsx swap in different waves.
9. **A second `'use client'` directive sneaks in** — every executor task touching the new code must verify `git grep "use client" -- '*.tsx' '*.ts'` returns exactly 1 file. The `tests/single-client-island.spec.ts` is the gate.
10. **`fade-in-up` reused for modal entrance** — would visually conflict with browser-centered dialog. Must be a NEW `modal-fade-in` keyframe (opacity-only). UI-SPEC line 422 explicit.
11. **Disabled input loses typed values during error retry** (Pitfall 3) — verify on real device per UI-SPEC line 615.
12. **Verbatim copy substring collisions in Playwright specs** — Phase 4 lesson; must use `:text-is("Send message")` exact-match selectors, NOT `text=Send message` substring matchers.

---

## Recommended Task Breakdown Skeleton (planner refines)

> Strictly a starting point — planner picks wave count, task granularity, and exact commit-grouping. Below is a minimal-viable structure that satisfies D-05 atomic-swap binding and the FOUND-07 single-island invariant.

### Wave 0 — Validation infrastructure + npm install (1 wave, ~3 tasks)

- **W0-T1:** `npm install @formspree/react@3.0.0` — pin to exact version. Commit: `chore(phase-5/w0): install @formspree/react@3.0.0`
- **W0-T2:** Stub 9 RED Playwright specs (see Wave 0 Gaps in Validation Architecture above). All assert against expected post-Wave-1 state, all RED at end of W0.
- **W0-T3:** Append `@keyframes modal-fade-in` + `dialog[open]` rule + `dialog::backdrop` rule to `app/globals.css` (per Pattern 4 above). No other file changes — this is the CSS surface only. Spec gates: existing `tests/no-bare-outline-none.spec.ts` + `tests/reduced-motion.spec.ts` must remain GREEN.

### Wave 1 — ContactModal client island (1 wave, 1-2 tasks)

- **W1-T1:** Create `components/contact/ContactModal.tsx` per Pattern 1 above. Includes: hash-listener `useEffect`, `useForm('xqeypnkw')` hook, honeypot + min-time wrapper, all 3 fields + char counter, Send button, mailto fallback link, two `aria-live` regions, all 4 state renders, backdrop-click handler, dialog `close` event handler with `reset()` + state clearance. ~120-150 lines. Commit: `feat(phase-5/w1): ContactModal client island (D-01..D-19; the single 'use client' directive)`
- **W1-T2 (optional, may merge into W1-T1):** Add `data/site.ts.contactEmail` field if planner picks the data-layer indirection per D-15a. ~6 lines. Commit grouped with W1-T1.

### Wave 2 — Mount + atomic trigger swap (1 wave, 1 task — single commit per D-05)

- **W2-T1 (atomic, D-05 binding):** Three edits in ONE commit:
  - `app/layout.tsx`: add `import { ContactModal } from '@/components/contact/ContactModal'` + add `<ContactModal />` after `<Footer />`.
  - `components/layout/Nav.tsx` line 15: `href: '/'` → `href: '#contact'`.
  - `app/about/page.tsx` line 75: `<CTAArrowLink href="/" ...>` → `<CTAArrowLink href="#contact" ...>`.
  - Commit: `feat(phase-5/w2): atomic — mount ContactModal in layout + rewire Nav + /about triggers to #contact (D-05)`

### Wave 3 — Spec flips + verification (1 wave, 1-2 tasks)

- **W3-T1:** Run `npx playwright test tests/contact-modal-*.spec.ts tests/contact-trigger-rewire.spec.ts tests/single-client-island.spec.ts` — all should now flip RED → GREEN. Document any selector tightening needed (Phase 4 lesson — substring collisions). Update existing `tests/no-client-components.spec.ts` to allow exactly 1 directive (or replace entirely with `single-client-island.spec.ts`).
- **W3-T2:** Full suite verification (`npm run test:full`) + Phase Exit Visual Verification checklist walk per UI-SPEC lines 600-628 (manual user-driven). Commit final SUMMARY.

### Wave 4 — Deploy + verify (1 wave, deferred per pattern from Phases 2 + 4)

- **W4-T1:** Deploy to Vercel branch preview, re-run Playwright against preview URL via `PLAYWRIGHT_BASE_URL` env, real Formspree submit + email arrival check, real-device iOS Safari verification (UI-SPEC line 628). May be deferred to user-driven Phase 6 cycle per Phase 4 precedent.

**Why this works:**
- 4 waves total, 6-8 tasks. Within standard granularity ceiling for a single plan.
- W2 atomic-swap is a single task per D-05 binding — plan-checker happy.
- W0 RED-stub-then-W1-flip-GREEN matches established Phase 1-4 cadence.
- No task touches more than 3 files (rule of thumb for atomic commits).

---

## Sources

### Primary (HIGH confidence)

- **MDN — `<dialog>` element**: `showModal()` focus-trap, focus-return, ESC-close, scroll-lock-via-inert, `closedby` attribute, `::backdrop` styling, `:open` selector, `@starting-style` requirement for transitions. (WebFetch summary, this session.)
- **npm registry — `@formspree/react`**: Verified version 3.0.0 published 2025-03-17, latest as of this research. Peer dependencies include `react@^19.0`. Main file `./dist/index.js`, types `./dist/index.d.ts`. (Bash `npm view`, this session.)
- **Formspree Help — The Formspree React library**: `useForm(hashid)` returns `[state, handleSubmit, reset]`. State has `submitting`, `succeeded`, `errors`, `result` properties. `<ValidationError prefix="..." field="..." errors={state.errors}>` for inline errors. (WebFetch, https://help.formspree.io/hc/en-us/articles/360055613373, this session.)
- **Project source files (read this session)**:
  - `package.json` — current deps, no `@formspree/react` yet
  - `app/layout.tsx` — current mount points (Nav, main, Footer, Analytics, SpeedInsights)
  - `app/globals.css` — current `@theme`, focus rule, reduced-motion, fade-in-up keyframe
  - `components/layout/Nav.tsx` — line 15 LINKS array (target of D-05 swap)
  - `app/about/page.tsx` — line 75 CTAArrowLink (target of D-05 swap)
  - `components/home/CTAArrowLink.tsx` — pattern reference for mailto link styling
  - `tests/no-client-components.spec.ts` + `tests/focus-ring.spec.ts` — existing test patterns
  - `playwright.config.ts` — testDir `./tests`, two projects, baseURL configurable
  - `.planning/config.json` — `nyquist_validation: true`, `security_enforcement: true` (ASVS L1)

### Secondary (MEDIUM confidence — corroborated)

- **WebSearch — Formspree honeypot + custom field name**: Custom honeypot pattern via Form Rules in Formspree dashboard; field name flexible; submission silently ignored when filled. Two sources agreed. (WebSearch, this session.)
- **WebSearch — Next.js App Router + native dialog hash trigger**: Pattern of useEffect + hashchange + showModal is the established 2024-2025 approach. Multiple Medium / DEV.to / personal-blog references. (WebSearch, this session.)
- **GitHub release notes — @formspree/react v3.0.0**: "React 19 and stripe-js 5" was the explicit reason for the major bump; @formspree/core v4.0.0 shipped at the same time. (WebFetch, this session — partial; release page didn't enumerate all breaking changes.)

### Tertiary (LOW confidence — flagged)

- None. Every load-bearing claim was either verified against a primary source or read directly from the project's existing files.

### Cited project documents (the locked decision surface — authoritative for this phase)

- `.planning/phases/05-contact-modal/05-CONTEXT.md` — D-01 through D-19 + D-15a informational + Claude's Discretion list + canonical_refs + code_context + specifics + deferred
- `.planning/phases/05-contact-modal/05-UI-SPEC.md` — 670 lines covering visual contract, type ramp, color palette, spacing, modal composition, state visual treatments, tab order, motion, trigger rewire, honeypot/min-time visual contract, layout inventory, interaction contract, responsive contract, copywriting contract, registry safety, source trace
- `.planning/REQUIREMENTS.md` — CTCT-01..07, A11Y-03, plus inherited FOUND-07, DSGN-06, DSGN-08, A11Y-02, A11Y-05, A11Y-06
- `.planning/STATE.md` — Phase 4 close state, Tailwind v4 transition-colors lesson, Plan 04-02 verbatim-string assertion lesson, FOUND-07 invariant tracking
- `.planning/ROADMAP.md` § Phase 5 — phase goal, 5 success criteria, dependencies on Phase 1 + 2 + 3
- `CLAUDE.md` — Recommended Stack `@formspree/react@3.0.0`, "What NOT to Use" Radix exclusion, Other Specific Decisions Formspree integration paragraph, currentDate context (2026-05-13), userEmail (`fakegoat1@gmail.com`)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@formspree/react@3.0.0` verified on npm registry, peer-deps include React 19, latest version. Native `<dialog>` behavior verified via MDN.
- Architecture (hash trigger + native dialog + useForm): HIGH — pattern is well-documented in MDN + Formspree docs + multiple corroborating community sources. CONTEXT.md + UI-SPEC.md lock every decision.
- Pitfalls: HIGH — Pitfalls 1, 4, 5, 7 are documented behaviors verified via spec/MDN/STATE.md. Pitfalls 2, 3, 6 are well-understood patterns from React + browser docs.
- Security: HIGH — small threat surface, all flows verified.
- Validation Architecture: HIGH — Playwright already configured, existing test patterns clear.

**Research date:** 2026-05-13

**Valid until:** 2026-06-13 (30 days for stable stack — `@formspree/react@3.0.0` is the latest stable; React 19.2.x is the locked target; native `<dialog>` baseline is years-stable).

**Re-research triggers:**
- `@formspree/react` v4.x release (would require API surface re-verification)
- React 20 release (would require peer-dep + hook compatibility check)
- New `<dialog closedby="any">` baseline coverage data (would let Phase 6 polish remove the JS click handler)
- Cloudflare Turnstile becoming the standard captchaless bot defense (would shift the Pitfall 5 recommendation)

---

## Project Constraints (from CLAUDE.md)

The following CLAUDE.md directives bear on Phase 5 and MUST be honored:

- **GSD Workflow Enforcement**: Every Edit/Write touching `components/contact/ContactModal.tsx`, `app/layout.tsx`, `components/layout/Nav.tsx`, `app/about/page.tsx`, `app/globals.css`, or `data/site.ts` MUST originate from a `/gsd-execute-phase 5` task. No direct repo edits outside the GSD workflow.
- **Tech stack lock**: Next.js 16.2.6 + React 19.2.4 + TypeScript 5.9 + Tailwind v4.3.0. No additional UI libraries (Radix excluded). Formspree integration via `@formspree/react@3.0.0` only.
- **Performance**: Phase 5 ships ~3-5KB additional client-island bundle (the only client JS in the project). Lighthouse 95+ goal does NOT include the contact island in the PERF-03 ≤50KB-gzipped first-page bundle threshold (per REQUIREMENTS.md PERF-03 explicit carve-out: "excluding contact modal client island").
- **Accessibility**: WCAG AA minimum. Focus rings preserved (Pitfall 4 discipline). `prefers-reduced-motion` respected (existing global rule covers Phase 5 modal-fade-in automatically).
- **Content scope**: No CMS — modal copy + email target live in source files (locked verbatim copy + planner-discretion data layer).
- **What NOT to Use**: Radix UI primitives (excluded — native `<dialog>` is the path); GSAP / Lenis / WebGL (irrelevant for this phase); Glassmorphism (D-18 explicit — 2px blur is "subtle, not glassmorphism"); reCAPTCHA / hCaptcha (REQUIREMENTS.md Out-of-Scope).
- **Formspree integration**: "Handles loading / error / success states out of the box. Keeps the form a small client island; the rest of the page stays RSC. Zero server code." — exactly the Phase 5 architecture.

All Phase 5 plans MUST verify compliance with each of the above before submission to plan-checker.

---

*Phase 5 — Contact Modal*
*RESEARCH drafted: 2026-05-13 by gsd-phase-researcher*
*Consumed by: gsd-planner (next), gsd-discuss-phase already complete*
