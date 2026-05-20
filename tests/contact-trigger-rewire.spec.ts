/**
 * D-05 atomic trigger rewire (binding from Phase 3 D-15 carry-forward):
 *
 * The Nav `Contact` link and the /about `Get in touch` CTA MUST swap
 * atomically from `href="/"` placeholder to `href="#contact"` in a SINGLE
 * commit (or single Wave). Plan-checker refuses split-Wave variants.
 *
 * This spec asserts BOTH triggers in ONE test so the swap cannot land
 * partially. The companion update to tests/about-renders.spec.ts (currently
 * asserts `href === '/'` placeholder per Phase 3 D-15) MUST land in the
 * same commit as the source-file rewires.
 *
 * Source decisions: D-04 (locked 2-surface trigger set: Nav + /about CTA)
 *                   D-05 (atomic swap binding — single commit / single Wave)
 *                   D-06 (hash-based architecture)
 *
 * RED until Plan 05-03 atomically rewires:
 *   - components/layout/Nav.tsx line 15 LINKS array
 *   - app/about/page.tsx line 75 <CTAArrowLink>
 *   - tests/about-renders.spec.ts companion update
 *   - app/layout.tsx (mounts ContactModal globally)
 * all in the SAME commit.
 */
import { test, expect } from '@playwright/test';

test("D-05 atomic rewire: BOTH Nav Contact AND /about Get in touch resolve href === '#contact'", async ({
  page,
}) => {
  // /about CTA — pre-Phase-5 ground truth was href="/"; Phase 5 swaps to #contact
  await page.goto('/about');
  const aboutCta = page.getByRole('link', { name: /Get in touch/i });
  await expect(
    aboutCta,
    'D-05 atomic rewire — about/page.tsx line 75 CTAArrowLink must point at #contact (single commit binding with Nav.tsx swap)',
  ).toHaveAttribute('href', '#contact');

  // Nav Contact — pre-Phase-5 ground truth was href="/"; Phase 5 swaps to #contact
  await page.goto('/');
  // Phase 6 06-01 Cat A (W2 follow-up): open the mobile hamburger on
  // chromium-mobile (Pixel 5 viewport below the sm breakpoint). No-op on
  // chromium-desktop. Without this guard the Contact link is collapsed
  // inside the closed <details> on mobile and `getByRole('link')` returns
  // no element. Same pattern as the 7 contact-modal-*.spec.ts files
  // refactored in W0 atomic commit a1c7a3f — this spec was missed in that
  // commit and is corrected here.
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    await page.locator('details.nav-mobile > summary').click();
  }
  const navContact = page.getByRole('link', { name: 'Contact' }).first();
  await expect(
    navContact,
    'D-05 atomic rewire — Nav.tsx line 15 LINKS[Contact] must point at #contact (single commit binding with /about CTA swap)',
  ).toHaveAttribute('href', '#contact');
});
