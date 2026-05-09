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

  // Chromium's computed-style serializer normalizes `0.01ms` (the authored
  // CD-01 override in app/globals.css) to `1e-05s` — same numeric value,
  // different unit/notation. Assert against either form so the contract
  // verifies the *behavior* (transitions zeroed under reduced-motion) rather
  // than a serializer artifact. Same family of fix as W2-T5's gradient-regex
  // correction (STATE.md: 59aae89).
  expect(['0.01ms', '1e-05s']).toContain(transitionDuration);
});
