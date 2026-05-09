/**
 * DSGN-01: Body shows charcoal gradient.
 * DSGN-02: Grain overlay renders (`body::after`, opacity 0.04).
 *
 * Loads `/` and asserts:
 *  - `getComputedStyle(body).backgroundImage` matches the locked gradient
 *    `linear-gradient(180deg, rgb(26, 26, 31), rgb(10, 10, 10))` (D-08, D-09)
 *  - `getComputedStyle(body, '::after').opacity === '0.04'` (D-09)
 *
 * RED until W2 lands the gradient + grain rules in `app/globals.css`.
 */
import { test, expect } from '@playwright/test';

test.describe('Body gradient and grain overlay (DSGN-01, DSGN-02)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('DSGN-01: body backgroundImage is the charcoal linear-gradient', async ({ page }) => {
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
    // NOTE: Chromium's getComputedStyle normalizes `linear-gradient(180deg, ...)`
    // by dropping the explicit 180deg (the default). Match either form so the
    // assertion verifies the *visual* contract (top-to-bottom charcoal) rather
    // than a serializer artifact. The 180deg literal is preserved in the
    // authored CSS in app/globals.css (D-09) — only the computed-style
    // serialization elides it.
    expect(bg).toMatch(
      /linear-gradient\((?:180deg,\s*)?rgb\(26,\s*26,\s*31\),\s*rgb\(10,\s*10,\s*10\)\)/
    );
  });

  test('DSGN-02: body::after grain opacity is 0.04', async ({ page }) => {
    const opacity = await page.evaluate(
      () => getComputedStyle(document.body, '::after').opacity
    );
    expect(opacity).toBe('0.04');
  });
});
