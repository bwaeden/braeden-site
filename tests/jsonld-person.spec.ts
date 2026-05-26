/**
 * SEO-05: Person JSON-LD with sameAs = [GitHub, Instagram] only (NO YouTube).
 *
 * On `/`:
 *  - locate the <script type="application/ld+json"> block
 *  - JSON.parse its text content
 *  - assert @type === 'Person'
 *  - assert sameAs equals [site.socials.github, site.socials.instagram]
 *    (imported from @/data/site — single source per Phase 2 D-15)
 *  - NEGATIVE: assert no sameAs entry matches /youtube/i (02-SCOPE-AMENDMENT.md)
 *
 * Analog: tests/footer-socials-render.spec.ts (DOM parse + cross-data
 * assertion against data/site.ts + explicit YouTube-exclusion guard).
 * RED until Plan 06-02 W1 lands the Person JSON-LD in app/layout.tsx.
 */
import { test, expect } from '@playwright/test';
import { site } from '@/data/site';

test('SEO-05: Person JSON-LD has @type Person + sameAs = [GH, IG], no YouTube', async ({
  page,
}) => {
  await page.goto('/');

  const ldText = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(ldText, 'expected a JSON-LD <script> block in the document').toBeTruthy();

  const parsed = JSON.parse(ldText as string);

  expect(parsed['@type'], 'JSON-LD @type should be Person').toBe('Person');

  const expectedSameAs = [site.socials.github, site.socials.instagram];
  expect(
    parsed.sameAs,
    'sameAs should equal [site.socials.github, site.socials.instagram]'
  ).toEqual(expectedSameAs);

  // Negative assertion — no YouTube URL leaks into sameAs (v1 dropped YT).
  expect(
    parsed.sameAs.some((url: string) => /youtube/i.test(url)),
    'sameAs must NOT contain a YouTube URL (per 02-SCOPE-AMENDMENT.md)'
  ).toBe(false);
});
