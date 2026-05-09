/**
 * SEO-07: Favicon SVG renders.
 *
 * Requests `/icon.svg` (Next.js App Router convention from D-04, D-05).
 * Asserts:
 *  - HTTP 200
 *  - response content-type contains `svg`
 *  - body contains `<path` and `viewBox=`
 *
 * RED until W3 ships `app/icon.svg` (the MonogramMark path data exported
 * via the App Router file convention).
 */
import { test, expect } from '@playwright/test';

test('SEO-07: /icon.svg returns a valid SVG with <path and viewBox', async ({
  request,
}) => {
  const response = await request.get('/icon.svg');
  expect(response.status(), 'expected 200 from /icon.svg').toBe(200);

  const contentType = response.headers()['content-type'] ?? '';
  expect(contentType, `content-type should mention svg (got: ${contentType})`).toMatch(
    /svg/i
  );

  const body = await response.text();
  expect(body, 'SVG body must contain <path').toMatch(/<path\b/);
  expect(body, 'SVG body must declare viewBox=').toMatch(/viewBox=/);
});
