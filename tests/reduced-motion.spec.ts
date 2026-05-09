/**
 * DSGN-08 / A11Y-06: `prefers-reduced-motion: reduce` zeroes durations.
 *
 * Emulates `reducedMotion: 'reduce'`, loads `/`, then sets a transition
 * on `body` and asserts the computed `transition-duration` is `'0.01ms'`
 * (the CD-01 global override).
 *
 * RED until W2 lands the reduced-motion override block in
 * `app/globals.css`.
 */
import { test, expect } from '@playwright/test';

test('reduced-motion override forces 0.01ms transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const transitionDuration = await page.evaluate(() => {
    const el = document.body;
    el.style.transition = 'opacity 1s';
    return getComputedStyle(el).transitionDuration;
  });

  expect(transitionDuration).toBe('0.01ms');
});
