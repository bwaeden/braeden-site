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

import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';

// SEO-01 / SEO-06: explicit home title (overrides the layout title.default so
// the per-route title is unambiguous) + one-line positioning description
// (≤160 chars) + canonical. openGraph.images is left to the file-based
// app/opengraph-image.png convention (do not set here — Pitfall 2).
export const metadata: Metadata = {
  title: 'Braeden Hodson',
  description:
    'Business student and entrepreneur in LA — building trading systems, a short-form content brand, and a stack of side projects.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <Hero />;
}
