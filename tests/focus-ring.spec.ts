/**
 * DSGN-06: `:focus-visible` shows electric-blue ring.
 * A11Y-02: No bare `outline: none` (paired with the static-CSS spec).
 *
 * Loads `/`, presses Tab to walk through the first 5 focusable elements
 * (covers nav links + footer link), and asserts each focused element's
 * computed `outline` matches `2px solid rgb(124,135,255)` (i.e., the
 * locked accent token #7c87ff per D-08, CD-02).
 *
 * RED until W2 lands the global `:focus-visible` rule in `app/globals.css`
 * AND W2-T5 / W3 ships the nav + footer with focusable links.
 */
import { test, expect } from '@playwright/test';

// Chromium's computed-style serializer for the `outline` shorthand orders
// the parts as `<color> <style> <width>` (e.g. "rgb(124, 135, 255) solid 2px"),
// while authored CSS uses the canonical `<width> <style> <color>` order
// ("2px solid var(--color-accent)"). Match either form so the assertion
// verifies the *visual* contract (electric-blue 2px solid ring) rather than
// a serializer artifact. Same family of fix as W2-T5's gradient-regex
// correction (STATE.md: 59aae89).
const ACCENT_OUTLINE_RE =
  /(2px\s+solid\s+(rgb\(124,\s*135,\s*255\)|#7c87ff)|(rgb\(124,\s*135,\s*255\)|#7c87ff)\s+solid\s+2px)/i;

test('DSGN-06: first 5 Tab targets show the accent focus ring', async ({ page }) => {
  await page.goto('/');
  // Settle before measuring: under parallel-suite load against a remote
  // URL (Vercel preview), the first Tab can fire before Chromium has
  // established keyboard-interaction modality, causing :focus-visible to
  // fail to match even though the CSS rule is correct.
  // (See 01-01-SUMMARY.md "Surprises" for the diagnosis.)

  // Phase 1's `/` exposes 4 focusable elements: the nav <Link href="/">
  // logo+name wrap + 3 placeholder nav links (About/Work/Contact). The
  // footer renders monogram + (c) text + braehods.com all as plain text
  // (UI-SPEC W3-T3: "braehods.com is plain text NOT a link in Phase 1").
  //
  // The contract DSGN-06 / A11Y-02 asserts is "every interactive element
  // shows the accent focus ring on :focus-visible" — not "there are at
  // least 5 focusable elements." Iterate up to 5 Tab steps, asserting the
  // ring on each focusable element and stopping at the first wrap-around
  // (activeElement === document.body, which means we've walked off the end
  // of the focus chain). Phases 2-6 add more interactive surface (real
  // route hrefs, contact button, etc.) — the loop will then walk all 5.
  //
  // W4-T2 discovery: Vercel preview deploys inject a <vercel-live-feedback>
  // custom element into the tab order for the preview-feedback toolbar.
  // It is not part of our app and uses its own UA styling, so we stop the
  // walk when we encounter any custom element (tagName contains a hyphen).
  let visitedFocusable = 0;
  for (let i = 0; i < 5; i += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      // Custom elements (e.g., <vercel-live-feedback>) are out of contract.
      if (el.tagName.includes('-')) return { outOfContract: true } as const;
      return { outOfContract: false, outline: getComputedStyle(el).outline };
    });

    if (focused === null || focused.outOfContract) break;
    expect(focused.outline).toMatch(ACCENT_OUTLINE_RE);
    visitedFocusable += 1;
  }

  expect(
    visitedFocusable,
    'expected at least one focusable element on / to receive the accent ring'
  ).toBeGreaterThan(0);
});
