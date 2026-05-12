// components/home/Hero.tsx
// Source: PLAN.md 02-06-T1; UI-SPEC § Hero (composition D-01..D-09, D-19, D-20, D-22, CD-03..CD-05).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Composes the home
// hero block. Reads typed data from data/*.ts (Plan 01 populated). Wires
// the Phase 1 lib/motion.ts seam for the staggered fade-in (CD-03).
//
// Stacking order top→bottom (D-06): <h1>Braeden</h1> → positioning subhead
// → CurrentlyLine → ChannelButtonRow → CTAArrowLinks → (photo reflows to
// top on mobile, right on desktop per D-01 / CD-04).
//
// D-05: <h1> renders 'Braeden' (single word — no surname). D-19/D-20: CTAs
// are inline accent text-links with arrow glyph, separated from channels by
// a small mt-6 vertical gap so they read as a related-but-lower-density group.
//
// D-22: Per-element view-transition seam only — HeroPhoto carries the
// inline style; this plan does NOT introduce any project-wide <ViewTransition>
// wrapper (blast-radius discipline for v1).
//
// Per D-24 (HOME-04, PERF-06): the <h1> + HeroPhoto carry NO animation —
// both are LCP candidates and ship at first paint. All other text (
// positioning subhead, CurrentlyLine, channel buttons, CTAs) animate via
// fadeInUp + stagger(i) at 80ms increments.
//
// Tab order on / after this plan (per 02-SCOPE-AMENDMENT.md, 2026-05-11):
//   Nav (4) → ChannelButton Instagram → CTAArrowLink /about → CTAArrowLink /work
//   → Footer GH → Footer IG → Footer 'View source →'. Hero <h1>, positioning
//   subhead, CurrentlyLine statement, and HeroPhoto are NOT focusable.
//
// DEVIATION (Rule 1 — Bug; correctness): the plan body's example markup
// omits a `data-test="hero-flex"` selector on the inner flex container, but
// tests/mobile-hero-stacks-cleanly.spec.ts (Plan 01 RED stub) asserts
// `getComputedStyle(page.locator('[data-test="hero-flex"]')).flexDirection
// === 'column-reverse'` at <768px viewports. Added the selector so the spec
// can resolve. Selector is decorative-only (no styling tied to it), matches
// the [data-test="hero-section"] / [data-test="hero-display"] /
// [data-test="hero-positioning"] convention from UI-SPEC. Does not violate
// any plan-body invariant.

import { site } from '@/data/site';
import { currently } from '@/data/currently';
import { channels } from '@/data/channels';
import { HeroPhoto } from '@/components/home/HeroPhoto';
import { CurrentlyLine } from '@/components/home/CurrentlyLine';
import { ChannelButtonRow } from '@/components/home/ChannelButtonRow';
import { CTAArrowLink } from '@/components/home/CTAArrowLink';
import { fadeInUp, stagger } from '@/lib/motion';

export function Hero() {
  return (
    <section data-test="hero-section" className="py-8 md:py-12">
      <div
        data-test="hero-flex"
        className="mx-auto flex max-w-5xl flex-col-reverse gap-8 md:flex-row md:items-center md:gap-16"
      >
        <div className="flex flex-col items-start">
          <h1
            data-test="hero-display"
            className="font-serif text-[clamp(4rem,12vw,6rem)] leading-[1.05] font-bold"
          >
            Braeden
          </h1>
          <p
            data-test="hero-positioning"
            className={`mt-4 max-w-[44ch] font-sans text-lg leading-relaxed ${fadeInUp}`}
            style={{ color: 'var(--color-text)', ...stagger(1) }}
          >
            {site.tagline}
          </p>
          <CurrentlyLine data={currently} />
          <ChannelButtonRow channels={channels} />
          <div className="mt-6 flex flex-col gap-2">
            <CTAArrowLink href="/about" staggerIndex={5}>
              More about me
            </CTAArrowLink>
            <CTAArrowLink href="/work" staggerIndex={6}>
              See the work
            </CTAArrowLink>
          </div>
        </div>
        <HeroPhoto />
      </div>
    </section>
  );
}
