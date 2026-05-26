/**
 * SEO-04b: /robots.txt renders allow-all + sitemap reference.
 *
 * Requests `/robots.txt` (Next.js App Router file convention — app/robots.ts).
 * Asserts:
 *  - HTTP 200
 *  - body contains `User-Agent: *`
 *  - body contains `Sitemap: https://braehods.com/sitemap.xml`
 *
 * Analog: tests/favicon.spec.ts (asset-URL fetch + body shape).
 * RED until Plan 06-02 W1 ships app/robots.ts (verified GREEN against the
 * Vercel preview URL in Task 9).
 */
import { test, expect } from '@playwright/test';

test('SEO-04b: /robots.txt returns 200 with User-Agent: * + Sitemap ref', async ({
  request,
}) => {
  const response = await request.get('/robots.txt');
  expect(response.status(), 'expected 200 from /robots.txt').toBe(200);

  const body = await response.text();
  expect(body, 'robots.txt must contain "User-Agent: *"').toMatch(
    /User-Agent:\s*\*/i
  );
  expect(
    body,
    'robots.txt must reference the sitemap URL'
  ).toMatch(/Sitemap:\s*https:\/\/braehods\.com\/sitemap\.xml/i);
});
