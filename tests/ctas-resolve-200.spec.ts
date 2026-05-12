/**
 * HOME-05: Hero CTA destinations resolve 200 (/about and /work stubs).
 *
 * Two separate request tests so failures are isolated by route.
 *
 * RED until Plan 02-05 lands the `app/about/page.tsx` + `app/work/page.tsx`
 * stub routes.
 *
 * Mirrors `tests/favicon.spec.ts` request-based pattern.
 */
import { test, expect } from '@playwright/test';

test('HOME-05: /about returns 200', async ({ request, baseURL }) => {
  const response = await request.get((baseURL ?? '') + '/about');
  expect(response.status(), 'expected 200 from /about').toBe(200);
});

test('HOME-05: /work returns 200', async ({ request, baseURL }) => {
  const response = await request.get((baseURL ?? '') + '/work');
  expect(response.status(), 'expected 200 from /work').toBe(200);
});
