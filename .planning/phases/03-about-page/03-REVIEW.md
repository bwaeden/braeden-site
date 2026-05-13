---
phase: 03-about-page
reviewed: 2026-05-13T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - app/about/page.tsx
  - tests/about-renders.spec.ts
  - tests/about-photo-shared-transition.spec.ts
findings:
  critical: 2
  warning: 2
  info: 2
  total: 6
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-05-13T00:00:00Z
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Three files reviewed: the About page Server Component, the bio/CTA/photo Playwright spec, and the view-transition regression spec. Cross-referenced `components/home/HeroPhoto.tsx`, `components/home/CTAArrowLink.tsx`, `lib/motion.ts`, `app/layout.tsx`, and `app/globals.css` to verify contracts.

The page component works mechanically — no `'use client'`, correct reuse of `HeroPhoto` and `CTAArrowLink`, stagger indices in place, bio prose passes the cliché-ban check. However there are two concrete WCAG AA failures that block ship: the page has no `<h1>` heading and the `<section>` landmark is unlabeled. Both are explicit requirements in `CLAUDE.md` ("WCAG AA at minimum"). The test specs have a word-count scope problem (non-bio tokens inflating the count) and an over-broad regex precision issue.

---

## Critical Issues

### CR-01: About page has no `<h1>` — WCAG 2.4.6 failure

**File:** `app/about/page.tsx:27-76`

**Issue:** The page renders three `<p>` bio paragraphs and a CTA link but no heading element at any level. WCAG Success Criterion 2.4.6 (Headings and Labels, AA) requires headings to describe the topic or purpose of content. Every other routed page in the project has a heading (`<h1>Braeden</h1>` in `Hero.tsx`). A screen-reader user navigating to `/about` gets no heading landmark and cannot use heading navigation to skim the page. The project constraint in `CLAUDE.md` explicitly requires WCAG AA.

**Fix:** Add an `<h1>` at the top of the text column, before the first `<p>`. The heading should receive no animation (same discipline as `Hero.tsx`'s `<h1>` — LCP element ships at first paint without a `fadeInUp` class):

```tsx
<div className="flex flex-col items-start">
  <h1 className="font-serif text-3xl font-bold leading-tight">
    About
  </h1>
  <p
    className={`mt-4 max-w-[44ch] font-sans text-base leading-relaxed ${fadeInUp}`}
    style={{ color: 'var(--color-text)', ...stagger(1) }}
  >
    Hi, I&apos;m Braeden ...
  </p>
  ...
```

If "About" as a visible heading is undesirable for design reasons, use a visually-hidden heading (e.g., `className="sr-only"`) rather than omitting the element entirely. Either way the heading must exist in the DOM.

---

### CR-02: `<section>` has no accessible name — unlabeled landmark

**File:** `app/about/page.tsx:29`

**Issue:** In HTML5, a `<section>` element is exposed as a `region` landmark to assistive technology **only** when it has an accessible name via `aria-label` or `aria-labelledby`. Without one, the element degrades to a generic container with no landmark semantics — assistive technology users cannot skip to or identify the section via landmark navigation (WCAG 2.4.1, Bypass Blocks, AA). The home page has the same `<section>` wrapper in `Hero.tsx` and carries the same gap, but this review is scoped to Phase 3 files — the About page's section must be fixed here.

**Fix:** Either (a) point `aria-labelledby` at the `<h1>` added in CR-01 fix, or (b) add a standalone `aria-label` if the heading stays visually hidden:

```tsx
// Option A — after CR-01 heading is added with id="about-heading"
<section
  data-test="about-section"
  aria-labelledby="about-heading"
  className="py-8 md:py-12"
>
  ...
  <h1 id="about-heading" className="font-serif text-3xl font-bold leading-tight">
    About
  </h1>
```

```tsx
// Option B — if no visible heading
<section
  data-test="about-section"
  aria-label="About Braeden"
  className="py-8 md:py-12"
>
```

CR-01 and CR-02 are best fixed together: add the `<h1>` with an `id`, wire `aria-labelledby` to it.

---

## Warnings

### WR-01: Word-count gate captures non-bio tokens (CTA text + arrow glyph)

**File:** `tests/about-renders.spec.ts:50-65`

**Issue:** `aboutSection.innerText()` returns the full rendered text of `[data-test="about-section"]`, which includes the CTA label "Get in touch" and the `→` arrow glyph inside `CTAArrowLink`. The `→` lives in a `<span aria-hidden>` but Chromium's `innerText()` does not strip `aria-hidden` content — `aria-hidden` is a ARIA semantic attribute, not a CSS visibility/display rule, so it is included in the serialization. The word-count split `text.split(/\s+/).filter(t => t.length > 0)` therefore counts "Get", "in", "touch", and "→" as four extra tokens.

At the current 171-word bio + 4 extra tokens = ~175, the test still passes (between 150 and 300). But if the bio is trimmed toward the 150-word floor the spec will pass while the actual bio is below the gate — the gate is silently lenient by 4 words. If the CTA label ever changes to a longer phrase the count drifts further.

**Fix:** Scope the word count to the `<p>` elements only, which are the bio-only nodes:

```ts
// Replace the current word-count block with:
const paragraphs = page.locator('[data-test="about-section"] p');
const bioText = await paragraphs.allInnerTexts().then((texts) => texts.join(' '));
const wordCount = bioText.split(/\s+/).filter((token) => token.length > 0).length;
expect(wordCount, `bio word count should be 150-300; measured ${wordCount}`).toBeGreaterThanOrEqual(150);
expect(wordCount).toBeLessThanOrEqual(300);
```

The cliché-ban and exclamation checks on `text` (the full `aboutSection.innerText()`) are fine to leave as-is — wider scope is conservative for those checks.

---

### WR-02: Cliché-ban regex uses `.` (any char) instead of `[-\s]` for multi-word phrases

**File:** `tests/about-renders.spec.ts:27-28`

**Issue:** `cutting.edge`, `results.oriented`, and `outcome.driven` use an unescaped `.` which matches any character, not just a hyphen or space. This makes the patterns match strings like `cuttingXedge` or `cutting5edge` — inputs that are not the banned phrases. While bio text is unlikely to trigger a false positive, the regex does not match the stated intent ("banned phrase list per D-05"), reduces spec self-documentation, and sets a precedent for imprecise pattern matching.

**Fix:** Replace `.` with `[-\s]` to match the intended separator (hyphen or space):

```ts
const CLICHE_BAN_REGEX =
  /passionate|I love to learn|driven by|innovative|cutting[-\s]edge|lifelong learner|wear many hats|results[-\s]oriented|outcome[-\s]driven/i;
```

---

## Info

### IN-01: `metadata` missing per-page `description`

**File:** `app/about/page.tsx:25`

**Issue:** The export only sets `title: 'About'`. The root layout provides a site-level fallback description ("Personal site of Braeden Hodson.") which will be used for the `/about` page in `<meta name="description">`. A dedicated per-page description improves SEO relevance for the page's specific content.

**Fix:**
```ts
export const metadata = {
  title: 'About',
  description:
    'Mechanical engineering student in LA building software at the intersection of markets, content, and AI tooling.',
};
```

---

### IN-02: `playwright.config.ts` `webServer` block is commented out — specs rely on external server

**File:** `tests/about-renders.spec.ts` / `tests/about-photo-shared-transition.spec.ts` (inherited from `playwright.config.ts:38-48`)

**Issue:** The `webServer` config is commented out with a TODO. Both new specs — like all specs in this suite — assume a server is already running on `PLAYWRIGHT_BASE_URL` (defaulting to `http://localhost:3000`). In a CI environment where no server is pre-started, Playwright will emit a connection error rather than a spec failure, making the RED→GREEN contract unreliable and the failure mode opaque.

**Fix:** Uncomment and populate the `webServer` block in `playwright.config.ts`:

```ts
webServer: {
  command: 'npm run start',
  url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
},
```

This is a pre-existing gap, but the Phase 3 specs inherit it and it affects their reliability in automated pipelines.

---

_Reviewed: 2026-05-13T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
