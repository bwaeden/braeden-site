/**
 * HOME-03: Channel-link block renders Instagram channel button as an
 * external link that opens in a new tab with tabnabbing-prevention `rel`.
 *
 * Per 02-SCOPE-AMENDMENT.md (2026-05-11): v1 ships Instagram only — no
 * YouTube channel exists yet. The Channel.platform union still allows
 * 'youtube' | 'instagram' for forward-compat, but only 1 button renders.
 *
 * On `/`:
 *  - inside the hero region, exactly 1 `<a target="_blank">` resolves
 *    whose `rel` contains both `noopener` and `noreferrer`
 *  - the button contains text matching /DM me/ (Instagram CTA verb per D-12
 *    + memory feedback_reel_cta_dm_format)
 *  - no "Subscribe" CTA appears in v1 (YT dropped per amendment)
 *
 * RED until Plan 02-03 lands `components/home/ChannelButton.tsx` +
 * `ChannelButtonRow.tsx`, and Plan 02-06 mounts the row into the hero.
 */
import { test, expect } from '@playwright/test';

test('HOME-03: hero region has 1 external Instagram channel button (v1 — no YT per amendment)', async ({
  page,
}) => {
  await page.goto('/');

  const heroSection = page.locator('[data-test="hero-section"]');
  await expect(heroSection, 'hero section should exist').toHaveCount(1);

  // External buttons inside the hero region with both rel guards.
  const externalLinks = heroSection.locator(
    'a[target="_blank"][rel*="noopener"][rel*="noreferrer"]'
  );

  // The hero contains: 1 channel button (IG) + 0 YT. CTA1/CTA2 are internal
  // links so they are excluded by the target="_blank" filter. Other external
  // links in the hero region are not expected per the plan body.
  await expect(
    externalLinks,
    'expected 1 external channel button in hero region (Instagram only — YT dropped per scope amendment)'
  ).toHaveCount(1);

  // The button must read "DM me" (Instagram CTA verb).
  await expect(
    page.getByRole('link', { name: /DM me/i }),
    'Instagram channel button should advertise "DM me" CTA'
  ).toHaveCount(1);
});
