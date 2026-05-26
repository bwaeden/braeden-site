/**
 * SEO-04a: /sitemap.xml renders a valid dynamic sitemap.
 *
 * Requests `/sitemap.xml` (Next.js App Router file convention — app/sitemap.ts).
 * Asserts:
 *  - HTTP 200
 *  - response content-type matches /xml/i
 *  - body contains a `<url>` entry
 *  - body contains the absolute braehods.com URLs for `/about` and `/work`
 *
 * Analog: tests/favicon.spec.ts (asset-URL fetch + content-type + body shape).
 * RED until Plan 06-02 W1 ships app/sitemap.ts (verified GREEN against the
 * Vercel preview URL in Task 9).
 */
import { test, expect } from '@playwright/test';

test('SEO-04a: /sitemap.xml returns 200 XML with /, /about, /work entries', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status(), 'expected 200 from /sitemap.xml').toBe(200);

  const contentType = response.headers()['content-type'] ?? '';
  expect(
    contentType,
    `content-type should mention xml (got: ${contentType})`
  ).toMatch(/xml/i);

  const body = await response.text();
  expect(body, 'sitemap body must contain a <url> entry').toMatch(/<url>/);
  expect(
    body,
    'sitemap must list the absolute /about URL'
  ).toContain('https://braehods.com/about');
  expect(
    body,
    'sitemap must list the absolute /work URL'
  ).toContain('https://braehods.com/work');
});
