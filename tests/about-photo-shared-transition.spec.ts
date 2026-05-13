/**
 * HOME-05 / D-17 / D-21 / D-22: The /about photo wrapper carries the same
 * `view-transition-name: hero-photo` as the home hero, so Chromium-class
 * browsers cross-fade the photo during /↔/about navigation.
 *
 * On `/about`:
 *  - `[data-test="hero-photo-tile"]` resolves once (Option A HeroPhoto reuse per D-08)
 *  - `getComputedStyle(wrapper).viewTransitionName === 'hero-photo'`
 *
 * Regression guard on `/`:
 *  - same selector resolves once
 *  - same computed `viewTransitionName === 'hero-photo'`
 *
 * RED until Plan 03-01 Task 2 lands the HeroPhoto wiring on /about. Once
 * GREEN, this spec documents the cross-route shared-element contract in one
 * place. Browsers without View Transitions API support fall back to standard
 * navigation per D-21 — the seam is CSS-only, no polyfill required.
 *
 * Phase-2 carry-forward: Chromium's getComputedStyle serializer returns the
 * literal string `"hero-photo"` (no quoting). The CSSStyleDeclaration cast
 * with the optional `viewTransitionName?` property handles the incomplete
 * Chromium typedef — same pattern as tests/view-transition-name-present.spec.ts.
 */
import { test, expect } from '@playwright/test';

test('HOME-05 / D-17: /about photo wrapper has viewTransitionName "hero-photo"', async ({ page }) => {
  await page.goto('/about');

  const tile = page.locator('[data-test="hero-photo-tile"]');
  await expect(tile, 'hero photo tile wrapper should exist on /about').toHaveCount(1);

  const vtName = await tile.evaluate(
    (node) =>
      (getComputedStyle(node) as CSSStyleDeclaration & { viewTransitionName?: string })
        .viewTransitionName,
  );
  expect(vtName, '/about wrapper viewTransitionName should be "hero-photo"').toBe('hero-photo');
});

test('HOME-05 / D-17: regression — / still carries viewTransitionName "hero-photo"', async ({ page }) => {
  await page.goto('/');

  const tile = page.locator('[data-test="hero-photo-tile"]');
  await expect(tile, 'hero photo tile wrapper should still exist on / (Phase 2 regression guard)').toHaveCount(1);

  const vtName = await tile.evaluate(
    (node) =>
      (getComputedStyle(node) as CSSStyleDeclaration & { viewTransitionName?: string })
        .viewTransitionName,
  );
  expect(vtName, '/ wrapper viewTransitionName should still be "hero-photo"').toBe('hero-photo');
});
