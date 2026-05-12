/**
 * HOME-04 + CD-04 + LNCH-05 (carry-forward): Hero layout stacks cleanly on
 * mobile — flex-direction: column-reverse below 768px so the portrait sits
 * above the text on small viewports, and no horizontal overflow at 320px.
 *
 * On `/` at <768px viewports:
 *  - the hero flex container resolves with `flex-direction: column-reverse`
 *    (UI-SPEC line 185)
 *  - `document.documentElement.scrollWidth <= window.innerWidth` (no x-overflow)
 *  - same assertions repeated at 320×640 (smallest supported viewport)
 *
 * Runs in the `chromium-mobile` Pixel-5 project from `playwright.config.ts`.
 *
 * RED until Plan 02-06 lands the `Hero.tsx` flex layout.
 */
import { test, expect } from '@playwright/test';

test.describe('HOME-04: mobile hero layout', () => {
  test('hero flex container is column-reverse on chromium-mobile (Pixel 5)', async ({
    page,
    viewport,
  }) => {
    // Pixel 5 default viewport in playwright.config.ts is ~393x851; assertion
    // is meaningful for any viewport <768px. Skip the desktop project.
    test.skip(
      !viewport || viewport.width >= 768,
      'mobile-stacking assertion only applies at <768px viewports (chromium-mobile project)'
    );

    await page.goto('/');

    const heroFlex = page.locator('[data-test="hero-flex"]').first();
    await expect(heroFlex, 'hero flex container should exist').toHaveCount(1);

    const flexDir = await heroFlex.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(
      flexDir,
      `mobile hero should use column-reverse (got: ${flexDir})`
    ).toBe('column-reverse');

    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(noOverflow, 'no horizontal overflow at mobile viewport').toBe(true);
  });

  test('hero has no horizontal overflow at 320×640', async ({ page, viewport }) => {
    test.skip(
      !viewport || viewport.width >= 768,
      '320px overflow assertion runs only in chromium-mobile project'
    );

    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');

    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(noOverflow, 'no horizontal overflow at 320×640 (smallest supported viewport)').toBe(
      true
    );
  });
});
