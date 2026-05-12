/**
 * HOME-06: Footer social row renders GitHub + Instagram icon links + a
 * "View source" link (source link reuses site.socials.github per D-17).
 *
 * Per 02-SCOPE-AMENDMENT.md (2026-05-11): v1 footer has 2 social icons
 * (GH + IG) — YouTube channel link dropped because no YT channel exists yet.
 *
 * On `/`:
 *  - footer contains ≥2 `<a target="_blank">` elements
 *  - exactly 1 `<a aria-label="GitHub profile">`
 *  - exactly 1 `<a aria-label="Instagram profile">`
 *  - NO `<a aria-label="YouTube channel">` in v1 (dropped per amendment)
 *  - 1 `<a>` containing "View source" with target="_blank" + noopener +
 *    noreferrer
 *  - footer contains ≥3 `<svg>` (1 monogram + 2 lucide icons)
 *
 * RED until Plan 02-04 extends Footer + lands `SocialIconLink.tsx`.
 */
import { test, expect } from '@playwright/test';

test('HOME-06: footer has GitHub + Instagram social icons (v1 — no YT per amendment)', async ({
  page,
}) => {
  await page.goto('/');

  const footer = page.locator('footer');

  // At least 2 external links in footer (GH icon + IG icon, plus source link).
  const externalLinks = footer.locator('a[target="_blank"]');
  await expect(
    externalLinks,
    'expected ≥2 footer <a target="_blank"> (GH + IG; source link also external)'
  ).not.toHaveCount(0);
  const externalCount = await externalLinks.count();
  expect(
    externalCount,
    `expected ≥2 external footer links (got ${externalCount})`
  ).toBeGreaterThanOrEqual(2);

  await expect(
    footer.locator('a[aria-label="GitHub profile"]'),
    'exactly 1 GitHub profile icon link in footer'
  ).toHaveCount(1);

  await expect(
    footer.locator('a[aria-label="Instagram profile"]'),
    'exactly 1 Instagram profile icon link in footer'
  ).toHaveCount(1);

  await expect(
    footer.locator('a[aria-label="YouTube channel"]'),
    'no YouTube channel link in v1 (per 02-SCOPE-AMENDMENT.md)'
  ).toHaveCount(0);
});

test('HOME-06: footer "View source" link is external with rel guards', async ({ page }) => {
  await page.goto('/');

  const sourceLink = page.locator('footer a', { hasText: /View source/i });
  await expect(sourceLink, '"View source" link should exist in footer').toHaveCount(1);

  await expect(sourceLink).toHaveAttribute('target', '_blank');
  await expect(sourceLink).toHaveAttribute('rel', /noopener/);
  await expect(sourceLink).toHaveAttribute('rel', /noreferrer/);
});

test('HOME-06: footer renders ≥3 svgs (monogram + 2 lucide icons)', async ({ page }) => {
  await page.goto('/');

  const svgs = page.locator('footer svg');
  const count = await svgs.count();
  expect(
    count,
    `expected ≥3 svgs in footer (1 monogram + 2 lucide icons in v1) — got ${count}`
  ).toBeGreaterThanOrEqual(3);
});
