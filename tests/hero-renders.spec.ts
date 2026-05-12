/**
 * HOME-01, HOME-02, HOME-03, HOME-05: Hero section renders with name +
 * positioning copy + Currently statement + channel buttons + dual CTAs.
 *
 * On `/`:
 *  - exactly one `[data-test="hero-section"]` resolves
 *  - `[data-test="hero-display"]` text contains "Braeden"
 *  - the positioning copy literal from `data/site.ts.tagline` appears
 *  - the `currently.statement` literal appears
 *  - both CTA strings appear ("More about me" and "See the work")
 *
 * RED until Plan 02-06 lands `components/home/Hero.tsx` + `app/page.tsx` rewrite.
 */
import { test, expect } from '@playwright/test';

const TAGLINE =
  'Business student and entrepreneur in LA, building things and running a small content brand';
const CURRENTLY_STATEMENT = 'Currently shipping CapitolLens';

test('HOME-01/02/03/05: hero section renders name + positioning + Currently + CTAs', async ({
  page,
}) => {
  await page.goto('/');

  const heroSection = page.locator('[data-test="hero-section"]');
  await expect(heroSection, 'expected exactly one [data-test="hero-section"] on /').toHaveCount(1);

  const heroDisplay = page.locator('[data-test="hero-display"]');
  await expect(heroDisplay, 'hero-display should contain "Braeden"').toContainText(/Braeden/);

  await expect(
    page.getByText(TAGLINE, { exact: false }),
    'positioning copy from data/site.ts.tagline should appear on /'
  ).toHaveCount(1);

  await expect(
    page.getByText(CURRENTLY_STATEMENT, { exact: false }),
    'currently.statement literal should appear on /'
  ).toHaveCount(1);

  await expect(
    page.getByText('More about me', { exact: false }),
    'CTA1 "More about me" should appear on /'
  ).toHaveCount(1);

  await expect(
    page.getByText('See the work', { exact: false }),
    'CTA2 "See the work" should appear on /'
  ).toHaveCount(1);
});
