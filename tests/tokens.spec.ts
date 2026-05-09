/**
 * DSGN-03: Color tokens emit as CSS custom properties.
 *
 * Loads `/` and asserts each of the 6 locked tokens (D-08) is exposed on
 * `:root` (i.e., `document.documentElement`) at the expected hex value.
 *
 * RED until W2 lands `@theme` in `app/globals.css`.
 */
import { test, expect } from '@playwright/test';

const TOKENS: Array<[name: string, expected: string]> = [
  ['--color-bg-start', '#1a1a1f'],
  ['--color-bg-end', '#0a0a0a'],
  ['--color-text', '#e8e8e8'],
  ['--color-muted', '#a8a8a8'],
  ['--color-accent', '#7c87ff'],
  ['--color-border', '#2a2a2f'],
];

test('all 6 color tokens are exposed as CSS custom properties on :root', async ({
  page,
}) => {
  await page.goto('/');

  for (const [name, expected] of TOKENS) {
    const value = await page.evaluate(
      (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
      name
    );
    expect(value, `token ${name} should equal ${expected}`).toBe(expected);
  }
});
