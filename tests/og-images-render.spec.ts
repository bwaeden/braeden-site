/**
 * SEO-02 / SEO-03: og:image meta tag on each route resolves to a 200 PNG.
 *
 * For each route in ['/', '/about', '/work']:
 *  - page.goto(route)
 *  - read the <meta property="og:image"> content attribute
 *  - GET that image URL
 *  - expect 200 + content-type image/png
 *
 * `/` serves a static app/opengraph-image.png; `/about` + `/work` serve
 * dynamic next/og ImageResponse route segments.
 *
 * Analog: tests/favicon.spec.ts (HTTP GET + content-type assertion).
 * RED until Plan 06-02 W1 ships the static PNG + the 2 dynamic OG segments
 * AND the layout sets metadataBase (verified GREEN on the preview in Task 9).
 */
import { test, expect } from '@playwright/test';

for (const path of ['/', '/about', '/work']) {
  test(`SEO-02: ${path} og:image resolves to a 200 PNG`, async ({
    page,
    request,
  }) => {
    await page.goto(path);

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute('content');
    expect(
      ogImage,
      `${path} must declare a <meta property="og:image"> tag`
    ).toBeTruthy();

    const ogResponse = await request.get(ogImage as string);
    expect(
      ogResponse.status(),
      `og:image for ${path} should return 200 (got ${ogResponse.status()} for ${ogImage})`
    ).toBe(200);

    const contentType = ogResponse.headers()['content-type'] ?? '';
    expect(
      contentType,
      `og:image content-type should be image/png (got: ${contentType})`
    ).toMatch(/image\/png/i);
  });
}
