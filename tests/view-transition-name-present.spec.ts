/**
 * HOME-05 / D-21: Hero photo wrapper carries `view-transition-name: hero-photo`
 * so the cross-route motion seam can hand the portrait off to /about.
 *
 * On `/`:
 *  - `[data-test="hero-photo-tile"]` resolves once
 *  - `getComputedStyle(wrapper).viewTransitionName === 'hero-photo'`
 *
 * RED until Plan 02-02 lands `components/home/HeroPhoto.tsx` with the
 * inline style (or Plan 02-06's globals.css utility).
 *
 * Phase-1 carry-forward: Chromium serializes `view-transition-name` as the
 * literal string `"hero-photo"` (no quoting). No browser-serializer
 * regex needed here.
 */
import { test, expect } from '@playwright/test';

test('HOME-05 / D-21: hero photo wrapper has viewTransitionName "hero-photo"', async ({ page }) => {
  await page.goto('/');

  const tile = page.locator('[data-test="hero-photo-tile"]');
  await expect(tile, 'hero photo tile wrapper should exist').toHaveCount(1);

  const vtName = await tile.evaluate(
    (node) => (getComputedStyle(node) as CSSStyleDeclaration & { viewTransitionName?: string }).viewTransitionName
  );
  expect(vtName, 'wrapper viewTransitionName should be "hero-photo"').toBe('hero-photo');
});
