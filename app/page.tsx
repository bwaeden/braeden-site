// app/page.tsx
// Source: PLAN.md 02-06-T2; UI-SPEC § Hero (full composition D-01..D-25).
//
// Server Component. Composes the home page hero via components/home/Hero.tsx.
// Reads typed data from data/*.ts (Plan 01 populates channels + site.socials).
// Hero owns the data-test="hero-section" / data-test="hero-display" selectors
// that Phase 1 Lighthouse + visual specs assert.
//
// Per D-22: NO project-wide <ViewTransition> wrapper introduced here or in
// app/layout.tsx. The view-transition seam is per-element on HeroPhoto only.

import { Hero } from '@/components/home/Hero';

export default function HomePage() {
  return <Hero />;
}
