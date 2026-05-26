/**
 * SEO-09: Vercel preview deploys set X-Robots-Tag: noindex.
 *
 * proxy.ts at repo root injects `X-Robots-Tag: noindex` when
 * `process.env.VERCEL_ENV === 'preview'`. This can only be observed against a
 * real Vercel preview deploy, so the test skips unless PLAYWRIGHT_BASE_URL
 * points at a *.vercel.app preview URL (local dev / production prod-alias have
 * no preview header to assert).
 *
 * Analog: tests/favicon.spec.ts (header inspection) + tests/lighthouse.spec.ts
 * (test.skip gate pattern).
 * Verified GREEN against the Vercel preview URL in Task 9 (NOT skipped there
 * because the preview base URL contains "vercel.app").
 */
import { test, expect } from '@playwright/test';

test('SEO-09: preview deploy responds with X-Robots-Tag: noindex', async ({
  request,
}) => {
  test.skip(
    !process.env.PLAYWRIGHT_BASE_URL?.includes('vercel.app'),
    'Preview noindex header requires a Vercel preview URL (set PLAYWRIGHT_BASE_URL)'
  );

  const response = await request.get('/');
  expect(
    response.headers()['x-robots-tag'],
    'preview deploy should set X-Robots-Tag: noindex'
  ).toBe('noindex');
});
