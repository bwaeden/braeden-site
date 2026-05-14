# Phase 5: Contact Modal - Pattern Map

**Mapped:** 2026-05-14
**Files analyzed:** 6 source files + 9 new spec files = 15
**Analogs found:** 14 / 15 (1 has no exact analog — see "No Analog Found")

> Phase 5 introduces the **first and only `'use client'` island** on the site. Per FOUND-07 the codebase currently has **zero** client components — verified by `tests/no-client-components.spec.ts` and confirmed by Grep (the apparent matches under `app/` and `components/` were all in source-comments referencing FOUND-07 history, not actual top-of-file directives). Therefore there is **no existing client-component analog**; the planner must compose the directive + `useState`/`useEffect`/`useRef` patterns from CONTEXT.md and RESEARCH.md, while inheriting all *visual* + *transition-discipline* patterns from the existing Server Components (`ChannelButton.tsx`, `ProjectCard.tsx`, `CTAArrowLink.tsx`).

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `components/contact/ContactModal.tsx` (NEW) | component (client island) | event-driven (form submit + hashchange) | `components/home/ChannelButton.tsx` (visual + transition discipline) + `components/work/ProjectCard.tsx` (inline color literal) | role-partial (no client analog exists; visual + button-family analog is exact) |
| `components/layout/Nav.tsx` (MODIFIED — line 15) | component (RSC) | request-response (link href) | `components/layout/Nav.tsx` itself (lines 12-16 LINKS array) | exact (1-character `href` value flip) |
| `app/about/page.tsx` (MODIFIED — line 75) | route (RSC) | request-response (link href) | `app/about/page.tsx` itself (line 75 `<CTAArrowLink href="/" staggerIndex={4}>`) | exact (1-character `href` value flip) |
| `app/layout.tsx` (MODIFIED) | route (RSC chrome wrapper) | mount-only | `app/layout.tsx` itself (line 17-19 `<Nav>` / `<main>` / `<Footer>` chain) | exact (one new `<ContactModal />` sibling after `<Footer />`) |
| `app/globals.css` (MODIFIED — append) | config (CSS) | none | `app/globals.css` lines 65-79 `@keyframes fade-in-up` + `.fade-in-up` | role-match (mirror keyframe shape; opacity-only NOT translateY) |
| `data/site.ts` (OPTIONAL MODIFIED per D-15a) | config (typed data) | none | `data/site.ts` itself (existing `email?: string` field on the `SiteMeta` interface) | exact (already has the slot — wire a value) |
| `tests/contact-modal-opens-from-nav.spec.ts` (NEW) | test (Playwright) | request-response | `tests/channels-render.spec.ts` (`getByRole('link')` + scoping to a section) | role-match |
| `tests/contact-modal-opens-from-about.spec.ts` (NEW) | test (Playwright) | request-response | `tests/about-renders.spec.ts` (loads `/about`, asserts CTA href) | exact |
| `tests/contact-modal-esc-closes.spec.ts` (NEW) | test (Playwright) | event-driven (keyboard) | `tests/focus-ring.spec.ts` (`page.keyboard.press('Tab')` + `document.activeElement` evaluate) | role-match (closest keyboard-driven spec) |
| `tests/contact-modal-states.spec.ts` (NEW — verbatim copy) | test (Playwright) | event-driven (form submit) | `tests/work-grid-renders.spec.ts` (`:text-is(...)` exact-match assertions) | exact |
| `tests/contact-modal-honeypot.spec.ts` (NEW) | test (Playwright) | event-driven (form submit + network) | `tests/work-grid-renders.spec.ts` (assertion structure only) | partial (no `page.route()` analog exists in current tests — see "No Analog Found") |
| `tests/contact-modal-min-time.spec.ts` (NEW) | test (Playwright) | event-driven (form submit + timing) | `tests/work-grid-renders.spec.ts` (assertion structure only) | partial (no `page.route()` analog) |
| `tests/contact-modal-mailto-fallback.spec.ts` (NEW) | test (Playwright) | request-response | `tests/about-renders.spec.ts` (assert link href + visible text) | exact |
| `tests/contact-trigger-rewire.spec.ts` (NEW — atomic D-05) | test (Playwright) | request-response | `tests/about-renders.spec.ts` lines 41-47 (asserts CTA `href === '/'` placeholder) — invert the assertion to `'#contact'` | exact |
| `tests/single-client-island.spec.ts` (NEW — FOUND-07 invariant) | test (Playwright/filesystem) | none | `tests/no-client-components.spec.ts` (entire file — modify the `expect(offenders).toEqual([])` to `expect(offenders).toEqual(['components/contact/ContactModal.tsx'])`) | exact |

---

## Pattern Assignments

### `components/contact/ContactModal.tsx` (component, event-driven)

**Analog A (visual + transition discipline):** `components/home/ChannelButton.tsx`
**Analog B (inline color literal `#c8a86a`):** `components/work/ProjectCard.tsx`
**Analog C (Server Component baseline that the new island deviates from):** `components/home/CTAArrowLink.tsx`

> No existing client-component analog exists in the codebase. The `'use client'` directive itself, the `useState`/`useEffect`/`useRef` composition, and the `useForm`/`ValidationError` Formspree wiring must be sourced from RESEARCH.md (which provides paste-ready code skeletons in lines 272-400+). The patterns below extract everything the new island can *inherit* from the existing RSC analogs.

**Comment-banner pattern** (`components/home/ChannelButton.tsx` lines 1-42):

```tsx
// components/home/ChannelButton.tsx
// Source: PLAN.md 02-03-T1; UI-SPEC § ChannelButton (D-12..D-14, CD-01).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). [...]
//
// DEVIATION — Rule 3+4 (architectural, auto-selected in auto-mode): [...]
```
The new ContactModal MUST include an analogous banner that **inverts** the FOUND-07 line: `// 'use client' — THE single client island per FOUND-07 carve-out (Phase 5 D-25 / 05-CONTEXT.md). Verified by tests/single-client-island.spec.ts.`

**Hairline-tile button pattern** (`components/home/ChannelButton.tsx` lines 73-89 — directly applicable to the Send button per UI-SPEC D-09 inheritance):

```tsx
<a
  href={channel.url}
  target="_blank"
  rel="noopener noreferrer"
  className="group inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-sans transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-px hover:border-[var(--color-accent)]"
>
```
Send button differences: drop `hover:-translate-y-px` (modal CTA stays static); add `transition-[border-color,color,opacity]` (opacity replaces transform — enables disabled-state fade per D-12); add `disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none`. The `transition-[<list>]` discipline (NOT `transition-colors` shorthand) is the load-bearing carry-forward — see "Shared Patterns → Transition-Property Discipline" below.

**Inline color-literal pattern** (`components/work/ProjectCard.tsx` lines 33-38 + line 58 — model for textarea char-counter `#c8a86a` warning per D-02):

```tsx
const STATUS_DOT_COLOR: Record<Project['status'], string> = {
  shipped: 'var(--color-accent)', // #7c87ff (token)
  'paper-trading': '#c8a86a', // muted amber, inline literal (D-09 — NOT in @theme)
  'in-dev': 'var(--color-muted)', // #a8a8a8 (token)
  archived: '#707070', // deep grey, inline literal (D-09 — NOT in @theme; ...)
};
// ...usage:
<span
  aria-hidden
  className="inline-block w-1.5 h-1.5 rounded-full"
  style={{ backgroundColor: STATUS_DOT_COLOR[project.status] }}
/>
```
ContactModal counter applies this discipline as: `style={{ color: charCount > 800 ? '#c8a86a' : 'var(--color-muted)' }}` on the counter `<span>`. The inline literal MUST stay inline (NOT promoted to `@theme`) per D-02 + Phase 4 D-09 carry-forward.

**Inline-style with custom-property + utility-class pattern** (`components/home/CTAArrowLink.tsx` lines 27-43 — model for state copy + accent text):

```tsx
<Link
  href={href}
  className={`group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4 ${fadeInUp}`}
  style={{ color: 'var(--color-accent)', ...stagger(staggerIndex) }}
>
  {children}
  <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
    →
  </span>
</Link>
```
The mailto fallback link (`"Or just email me directly →"` per D-15) and the "Send another →" success-state link (per D-10) are direct re-skins of this pattern. Reuse `var(--color-accent)` inline-style + the same `→` Unicode glyph + the same `group-hover:translate-x-1` arrow shift. Do **NOT** import `<CTAArrowLink>` itself (it's a Server Component using `next/link` for internal route prefetch — the modal mailto/reset links are different semantics: `<a href="mailto:...">` external + `<button onClick={reset}>` form-state-reset, neither benefits from `next/link`).

---

### `components/layout/Nav.tsx` (component, MODIFIED line 15)

**Analog:** itself, lines 12-16 (the LINKS array)

**Current state pattern** (lines 12-16):

```tsx
const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/', label: 'Contact' }, // stub until Phase 5 wires the modal trigger
];
```

**Target swap** (D-05 atomic — must land in same Wave as `app/about/page.tsx` line 75 swap):

```tsx
const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '#contact', label: 'Contact' }, // Phase 5: hash-driven trigger per D-06 strong recommendation
];
```

> **Why hash-based works without modifying Nav.tsx structure:** The LINKS array is consumed by both desktop nav (line 32-36) AND mobile hamburger (line 77-81). `<Link>` from `next/link` natively honors `href="#contact"` as in-document hash navigation that fires `hashchange`. Nav.tsx stays a pure Server Component (no `'use client'` added). The single value flip covers both surfaces from one edit per D-07.

---

### `app/about/page.tsx` (route, MODIFIED line 75)

**Analog:** itself, line 75 (the `<CTAArrowLink>` consumption site)

**Current state pattern** (line 75):

```tsx
<CTAArrowLink href="/" staggerIndex={4}>
  Get in touch
</CTAArrowLink>
```

**Target swap** (D-05 atomic):

```tsx
<CTAArrowLink href="#contact" staggerIndex={4}>
  Get in touch
</CTAArrowLink>
```

> **CTAArrowLink itself does NOT change.** The component receives any `href: string` prop (line 22 — `interface CTAArrowLinkProps { href: string; ... }`). It passes the value through to `next/link` (line 30) which honors hash-only hrefs. Phase 5 only flips the consumer's prop value.

---

### `app/layout.tsx` (route, MODIFIED — append `<ContactModal />` sibling)

**Analog:** itself, lines 13-25 (the existing chrome wrapper)

**Current state pattern** (lines 13-25):

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Target shape** (mount `<ContactModal />` as a `<body>`-level sibling AFTER `<Footer />` so the native `<dialog>` lives at the end of `<body>` for clean top-layer behavior; per RESEARCH.md the dialog mounted in layout makes the modal available on every route):

```tsx
import { ContactModal } from '@/components/contact/ContactModal';
// ...
<body>
  <Nav />
  <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
  <Footer />
  <ContactModal />
  <Analytics />
  <SpeedInsights />
</body>
```

> **Layout stays a Server Component.** Importing the client island into a Server Component is the standard Next.js App Router pattern — Next handles the RSC→client boundary at the import site. No `'use client'` is added to `app/layout.tsx`.

---

### `app/globals.css` (config, MODIFIED — append modal-fade-in keyframe + dialog rules)

**Analog (mirror for `modal-fade-in` keyframe shape):** `app/globals.css` lines 65-79 (`@keyframes fade-in-up` + `.fade-in-up`)

**Current `fade-in-up` keyframe pattern** (lines 65-79 — the structure to mirror):

```css
/* Phase 2 hero will consume — defined now per CD-03 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fade-in-up 400ms cubic-bezier(0.2, 0, 0, 1) both;
  animation-delay: var(--stagger, 0ms);
}
```

**Target shape** (`modal-fade-in` keyframe per D-16 — opacity-only; the 8px translateY is **omitted** because it conflicts with the browser-centered dialog top-layer positioning per RESEARCH.md):

```css
/* Phase 5 — modal entrance per D-16. Opacity-only (NOT translateY — would
   conflict with browser-managed <dialog> top-layer centering). */
@keyframes modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
dialog[open] {
  animation: modal-fade-in 200ms cubic-bezier(0.2, 0, 0, 1) both;
}

/* Phase 5 — backdrop dim+2px blur per D-18. NOT glassmorphism (CLAUDE.md anti-pattern). */
@keyframes modal-backdrop-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
dialog::backdrop {
  background-color: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(2px);
  animation: modal-backdrop-fade-in 150ms cubic-bezier(0.2, 0, 0, 1) both;
}
```

**Reduced-motion gate inheritance** (lines 53-63 — already in place; no change needed):

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
The `*` selector covers `dialog[open]` and `dialog::backdrop` automatically — no Phase-5-specific reduced-motion override needed.

**Token inheritance** (lines 3-16 — already in place; no new tokens added):

```css
@theme {
  --color-bg-start: #1a1a1f;
  --color-bg-end: #0a0a0a;
  --color-text: #e8e8e8;
  --color-muted: #a8a8a8;
  --color-accent: #7c87ff;
  --color-border: #2a2a2f;
  /* ...font vars... */
}
```
Modal consumes these via `bg-[var(--color-bg-end)]`, `border-[var(--color-border)]`, `text-[var(--color-muted)]`, etc. **No `@theme` additions** per D-02 + D-09 inline-only discipline.

---

### `data/site.ts` (config, OPTIONAL MODIFIED per D-15a — Claude's discretion)

**Analog:** itself, lines 1-22 (the existing `SiteMeta` interface + literal)

**Current state pattern**:

```ts
export interface SiteMeta {
  name: string;
  tagline: string;
  domain: string;
  email?: string;             // ← already exists; v1 has no value wired
  socials: { github?: string; instagram?: string; youtube?: string };
}

export const site: SiteMeta = {
  name: 'Braeden Hodson',
  tagline: 'Business student and entrepreneur in LA, ...',
  domain: 'braehods.com',
  socials: { github: '...', instagram: '...' },
};
```

**Target shape (recommended per D-15a — surface `contactEmail` for forward-compat swap to `hi@braehods.com` later):**

```ts
export const site: SiteMeta = {
  name: 'Braeden Hodson',
  tagline: '...',
  domain: 'braehods.com',
  email: 'fakegoat1@gmail.com', // Phase 5 D-15 — modal mailto target. Future: hi@braehods.com per D-15a.
  socials: { ... },
};
```

> Planner discretion per D-15a: surfacing the value in `data/site.ts` makes the future swap a single-line edit; hard-coding the literal in `ContactModal.tsx` for v1 is also acceptable and saves one import. Recommend the data-layer approach because the slot already exists on the interface (line 5: `email?: string`).

---

### `tests/contact-modal-states.spec.ts` (test — verbatim copy assertions)

**Analog:** `tests/work-grid-renders.spec.ts` lines 60-69 (`:text-is(...)` exact-match scoped to a span)

**Source pattern** (lines 60-69):

```ts
// Status label = literal schema value from data (scoped to <span> +
// exact-match — substring matchers collide with descriptions containing
// the enum value [...])
await expect(
  card.locator(`span:text-is("${project.status}")`),
  `card ${i} (${project.slug}): status label "${project.status}" should appear`
).toHaveCount(1);
```

**Target shape** for verbatim modal copy assertions (D-08 / D-09 / D-10 / D-11 / D-12 — all locked strings):

```ts
// D-08 modal heading verbatim
await expect(
  page.locator('h2:text-is("Get in touch")'),
  'modal heading must read exactly "Get in touch" (D-08)'
).toHaveCount(1);

// D-09 idle button verbatim
await expect(
  page.locator('button:text-is("Send message")'),
  'submit button (idle) must read exactly "Send message" (D-09)'
).toHaveCount(1);

// D-10 success copy verbatim (em-dash, NOT hyphen)
await expect(
  page.locator(':text-is("Thanks — I\'ll get back to you within a day or two.")'),
  'success copy must read verbatim per D-10 (em-dash, not hyphen)'
).toHaveCount(1);
```

> **Critical:** Phase 4 lesson (cited in CONTEXT.md "Established Patterns" + UI-SPEC inheritance): substring `text=` matchers cause cross-DOM collisions; `:text-is()` is the locked form for verbatim assertions. The `tests/work-grid-renders.spec.ts` comment block (lines 60-65) explicitly documents *why* — copy that rationale verbatim into the new spec headers.

---

### `tests/contact-trigger-rewire.spec.ts` (test — atomic D-05 invariant)

**Analog:** `tests/about-renders.spec.ts` lines 41-47 (asserts CTA `href === '/'` placeholder)

**Source pattern** (lines 41-47 — currently in GREEN state asserting the placeholder):

```ts
const cta = page.getByRole('link', { name: CTA_TEXT_REGEX });
await expect(cta, 'exactly one CTA link matching /Get in touch|Drop me a line|Say hi/i').toHaveCount(1);
await expect(cta, 'CTA href should be "/" placeholder (D-15 — Phase 5 atomic swap)').toHaveAttribute(
  'href',
  '/',
);
```

**Target shape** (Phase 5 inverts the assertion — and the line 44 message in `about-renders.spec.ts` MUST also be updated since the placeholder is being removed):

```ts
// Phase 5 D-05 atomic rewire — both Nav AND /about CTA point to #contact
await page.goto('/about');
const aboutCta = page.getByRole('link', { name: /Get in touch/i });
await expect(aboutCta, '/about CTA must point to modal hash trigger (D-05)').toHaveAttribute('href', '#contact');

await page.goto('/');
const navContact = page.getByRole('link', { name: 'Contact' }).first();
await expect(navContact, 'Nav Contact must point to modal hash trigger (D-05)').toHaveAttribute('href', '#contact');
```

> **Atomicity gate:** This spec asserts BOTH surfaces in a single test so the swap cannot land split. Plan-checker should refuse plans that put the Nav.tsx swap and the about/page.tsx swap in different Waves. The companion update to `tests/about-renders.spec.ts` line 41-47 is a Wave-0 concern (existing spec must be updated to match the new ground-truth) and lands atomically with the source swap.

---

### `tests/single-client-island.spec.ts` (test — FOUND-07 invariant)

**Analog:** `tests/no-client-components.spec.ts` (entire file — 85 lines)

**Source pattern** (lines 65-84 — currently asserts `offenders.toEqual([])`):

```ts
test('no `use client` directives anywhere in app/ components/ lib/', () => {
  const root = process.cwd();
  const offenders: string[] = [];

  for (const sub of SCAN_ROOTS) {
    const dir = path.join(root, sub);
    for (const file of collectSourceFiles(dir)) {
      const raw = fs.readFileSync(file, 'utf8');
      const stripped = stripLeadingComments(raw);
      if (/^\s*['"]use client['"]/.test(stripped)) {
        offenders.push(path.relative(root, file));
      }
    }
  }

  expect(
    offenders,
    `Phase 1 must be RSC-only; found 'use client' in: ${offenders.join(', ')}`
  ).toEqual([]);
});
```

**Target shape** (Phase 5 — the new spec asserts EXACTLY 1 file, and that file is the ContactModal. Note: the existing `no-client-components.spec.ts` will need to be either renamed/repurposed or have its assertion inverted from `toEqual([])` to `toEqual(['components/contact/ContactModal.tsx'])` — planner picks. Recommend: keep `no-client-components.spec.ts` as-is, and ADD `single-client-island.spec.ts` that explicitly allow-lists ContactModal):

```ts
const ALLOWED_CLIENT_ISLANDS = ['components/contact/ContactModal.tsx'];

test('exactly 1 client island and it is the ContactModal (FOUND-07 carve-out per Phase 5)', () => {
  // ...same scan as no-client-components.spec.ts...
  expect(
    offenders.sort(),
    `Phase 5 carve-out: exactly 1 'use client' allowed (ContactModal). Found: ${offenders.join(', ')}`
  ).toEqual(ALLOWED_CLIENT_ISLANDS);
});
```

> **Important:** When this spec ships, `tests/no-client-components.spec.ts` will go RED (because ContactModal IS a `use client` file). The plan must coordinate: either delete `no-client-components.spec.ts` and replace with `single-client-island.spec.ts`, OR update `no-client-components.spec.ts`'s allow-list. Recommend: rename + invert assertion (single source of truth — one spec for the FOUND-07 invariant across all phases).

---

## Shared Patterns

### Transition-Property Discipline
**Source:** `components/work/ProjectCard.tsx` lines 22-29 (banner) + line 51 (usage); `components/home/ChannelButton.tsx` line 78
**Apply to:** All interactive elements inside `ContactModal.tsx` (Send button, input/textarea focus borders, mailto link)

```tsx
// Pattern: arbitrary property list, NOT `transition-colors` shorthand
className="... transition-[border-color,color,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ..."
```

> **Why** (verbatim from `ProjectCard.tsx` lines 22-29): Tailwind v4's `transition-colors` shorthand includes `outline-color` in the transitioned-property list, which combined with the parent's muted color cascade made `*:focus-visible`'s 2px accent ring 200ms-interpolate from muted to accent on first frame after Tab. The arbitrary list `transition-[border-color,color,transform]` excludes `outline-color` so the focus ring renders the locked accent immediately. Verified GREEN by `tests/focus-ring.spec.ts`. **Apply this discipline to every interactive surface in the modal** — replace `transform` with `opacity` for the Send button (per D-12 disabled-state fade).

### Inline-Style + CSS-Variable Pattern
**Source:** `components/home/CTAArrowLink.tsx` line 32; `components/work/ProjectCard.tsx` lines 58, 60, 66, 79, 84
**Apply to:** All color-bearing elements in the modal that need cross-cascade reliability (modal heading, state copy, accent text, asterisk decorator)

```tsx
// Pattern: inline `style={{ color: 'var(--color-X)' }}` wins the cascade
// against utility classes — used wherever the cascade matters (e.g., parent
// passes a different color but the child must lock its own)
<span style={{ color: 'var(--color-text)' }}>...</span>
<span style={{ color: 'var(--color-accent)' }}>*</span>
<span style={{ color: 'var(--color-muted)' }}>0 / 1000</span>
```

> **Note:** The `ChannelButton.tsx` line 85 documents an explicit one-off **deviation** (using Tailwind utility `text-[var(--color-muted)]` instead of inline-style) for the verb-on-hover affordance. Modal does NOT need that deviation — every modal color is either fixed (heading, labels, copy) or toggles only on focus/disabled (button, fields), neither of which involves the parent-color-override that drove the ChannelButton verb-text exception. Stick with inline-style.

### Inline Color-Literal Discipline (`#c8a86a` reuse for char counter)
**Source:** `components/work/ProjectCard.tsx` lines 33-38 + comment block lines 18-19
**Apply to:** ContactModal char counter (D-02 — turns `#c8a86a` past 800 chars)

```tsx
// Pattern: inline literal, NOT promoted to @theme. Documented in comment.
'paper-trading': '#c8a86a', // muted amber, inline literal (D-09 — NOT in @theme)
```

> Phase 5 is the **second** consumer of `#c8a86a` (Phase 4 ProjectCard paper-trading dot was the first). Per D-02 + Phase 4 D-09 discipline carry-forward, the literal STAYS inline-only at this count. Phase 6 polish revisits `@theme` promotion **only if** a 3rd location appears.

### Comment-Banner Documentation Pattern
**Source:** `components/home/ChannelButton.tsx` lines 1-42; `components/work/ProjectCard.tsx` lines 1-29; `components/home/CTAArrowLink.tsx` lines 1-16
**Apply to:** `components/contact/ContactModal.tsx` (NEW — must include the FOUND-07 deviation banner inverting the existing pattern)

Every component file in the codebase opens with a banner that documents:
1. Source (PLAN reference + UI-SPEC reference)
2. Server Component / Client Component declaration with FOUND-07 / D-25 reference
3. Notable deviations (with Rule numbers if auto-mode auto-selected)
4. Cross-file rationale for any non-obvious patterns

The ContactModal banner MUST invert the standard line: "Server Component (NO 'use client' — FOUND-07 / D-25)" becomes "Client Component (`'use client'` — THE single client island per FOUND-07 carve-out / 05-CONTEXT D-25 inheritance). Verified by tests/single-client-island.spec.ts."

### `aria-hidden` Decorative Glyph Pattern
**Source:** `components/home/CTAArrowLink.tsx` lines 35-40 (the `→` glyph); `components/work/ProjectCard.tsx` lines 56-59 (status dot) + lines 69-75 (`↗` glyph)
**Apply to:** ContactModal required-field asterisks (`<span aria-hidden>*</span>`), mailto-link arrow, "Send another →" arrow, status dots (none in v1 modal but reserved)

```tsx
<span
  aria-hidden
  className="inline-block transition-transform group-hover:translate-x-1"
>
  →
</span>
```

> Asterisks + arrows are decorative — accessible name carries the meaning (`<input required>` for the asterisk; visible link text for the arrow). The `aria-hidden` keeps them out of the screen-reader pass.

---

## No Analog Found

Files with no close match in the codebase (planner should source patterns from RESEARCH.md instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/contact/ContactModal.tsx` (the `'use client'` directive + `useState`/`useEffect`/`useRef` + `useForm` composition) | client island | event-driven | **Zero existing client components in the codebase per FOUND-07.** The visual + button-family + transition-discipline analogs above cover the *static rendering* concerns; the React-hook + `<dialog>.showModal()` + `hashchange` listener + Formspree submission patterns must be sourced from RESEARCH.md lines 264-400+ (paste-ready code). |
| `tests/contact-modal-honeypot.spec.ts` (the `page.route()` Formspree mock) | test | event-driven (network) | **Zero existing Playwright tests use `page.route()`.** Verified via `Grep("page.route(")` returning no matches in `tests/`. Planner must source the network-mock pattern from Playwright docs (cited in RESEARCH.md). Recommended skeleton: `await page.route('**/formspree.io/**', route => route.abort()); /* fill honeypot, submit, assert no aborted call fired */`. |
| `tests/contact-modal-min-time.spec.ts` (timing-based silent rejection) | test | event-driven (timing) | Same as honeypot — needs `page.route()` to verify "no Formspree call was made within 1500ms of mount." Pair with the honeypot spec — same mock pattern, different trigger condition. |
| `tests/contact-modal-esc-closes.spec.ts` (focus-return-to-trigger) | test | event-driven (keyboard) | The closest analog (`tests/focus-ring.spec.ts`) drives Tab-walking but does not test ESC + focus-return. Planner must compose: `await page.keyboard.press('Escape'); /* assert dialog closed, focus on original trigger */` using `document.activeElement` evaluate (pattern lines 53-58 from focus-ring.spec.ts is reusable). |

---

## Metadata

**Analog search scope:** `components/`, `app/`, `tests/`, `data/`, `lib/`
**Files scanned:** 13 source files (4 in `components/home/`, 1 in `components/work/`, 3 in `components/layout/`, 1 in `components/ui/`, 2 in `components/icons/`, 4 in `app/`), 4 in `data/`, 3 in `lib/`, 28 in `tests/`
**Pattern extraction date:** 2026-05-14
**Verification:** `tests/no-client-components.spec.ts` (lines 65-84) confirms zero `'use client'` directives currently exist in `app/` `components/` `lib/` — Phase 5 IS the FOUND-07 carve-out.
