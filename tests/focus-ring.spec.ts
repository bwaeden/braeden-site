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

const ACCENT_OUTLINE_RE = /2px solid (rgb\(124,\s*135,\s*255\)|#7c87ff)/i;

test('DSGN-06: first 5 Tab targets show the accent focus ring', async ({ page }) => {
  await page.goto('/');

  for (let i = 0; i < 5; i += 1) {
    await page.keyboard.press('Tab');
    const focusedOutline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      return getComputedStyle(el).outline;
    });

    expect(
      focusedOutline,
      `Tab #${i + 1}: focused element should have an accent outline (got: ${focusedOutline})`
    ).not.toBeNull();
    expect(focusedOutline!).toMatch(ACCENT_OUTLINE_RE);
  }
});
