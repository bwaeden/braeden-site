/**
 * SEO-08: Branded 404 page renders full chrome + monogram + heading + return link.
 *
 * Navigating to an unmatched route (`/this-route-does-not-exist`):
 *  - response status is 404
 *  - Nav chrome present (<nav>)
 *  - Footer chrome present (<footer>)
 *  - heading h1 with verbatim text "Page not found"
 *  - return link with accessible name /Back home/ whose href === '/'
 *
 * Verbatim copy asserted via :text-is() per Phase 4 lesson (05-CONTEXT D-08).
 * Analog: tests/about-renders.spec.ts (page.goto + role locator) +
 * tests/footer-socials-render.spec.ts (chrome presence).
 * RED until Plan 06-02 W1 ships app/not-found.tsx + CTAArrowLink direction prop.
 */
import { test, expect } from '@playwright/test';

test('SEO-08: /this-route-does-not-exist renders branded 404 with chrome + return link', async ({
  page,
}) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status(), 'unmatched route should return HTTP 404').toBe(404);

  await expect(page.locator('nav'), 'Nav chrome should render on 404').not.toHaveCount(
    0
  );
  await expect(
    page.locator('footer'),
    'Footer chrome should render on 404'
  ).not.toHaveCount(0);

  await expect(
    page.locator('h1:text-is("Page not found")'),
    'h1 should read verbatim "Page not found"'
  ).toHaveCount(1);

  const backHome = page.getByRole('link', { name: /Back home/ });
  await expect(backHome, 'a "Back home" return link should render').toHaveCount(1);
  await expect(backHome, '"Back home" link should point at /').toHaveAttribute(
    'href',
    '/'
  );
});
