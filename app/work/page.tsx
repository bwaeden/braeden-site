// app/work/page.tsx
// Source: PLAN.md 04-02-T4; 04-UI-SPEC § Page Composition (D-05, D-06, D-07, D-13).
//
// Replaces the Plan 02-05 'Coming soon.' stub with the real /work route — an
// equal-weight responsive grid of ProjectCards mapped from data/projects.ts.
// Flips the 4 Wave-0 RED specs GREEN: tests/work-grid-renders.spec.ts,
// tests/work-status-badges.spec.ts, tests/work-no-flagship.spec.ts,
// tests/work-descriptions-cliche-scrub.spec.ts.
//
// Server Component invariant (FOUND-07 / D-25 inherited): zero 'use client',
// zero state, zero event handlers. The cards are pure HTML + CSS at runtime,
// no hydration cost — /work ships zero JS for the route layer.
//
// Inherits Nav + Footer chrome from app/layout.tsx automatically. Inherits
// the max-w-3xl mx-auto px-6 py-16 lg:px-12 container from layout.tsx — does
// NOT extend to max-w-5xl per D-05 + Phase 3 inheritance discipline (the
// /work prose column reads tighter than the home hero on purpose).
//
// Grid (D-05 / D-07 / CD-04): grid-cols-1 on mobile / md:grid-cols-2 on
// desktop / items-stretch row equalization so paired cards in a row share
// height regardless of description length. The orphan card on row 4 (when
// projects.length is odd, currently 7) sits left-aligned at half-width per
// D-06 — the empty right cell IS the design (no col-span, no justify-self,
// no centering).
//
// Stagger seam discipline (Pitfall 5): the fade-in-up keyframe lives on the
// per-card <li> wrapper, NOT on the inner <a>, to avoid colliding with the
// card's hover translate-x on the trailing ↗ glyph. The wrapper's
// className={fadeInUp} + style={stagger(i + 1)} pattern is identical to
// components/home/ChannelButtonRow.tsx (Phase 2 analog). First card animates
// at 80ms, last (7th) at 560ms.

import { fadeInUp, stagger } from '@/lib/motion';
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/work/ProjectCard';

export const metadata = { title: 'Work' };

export default function WorkPage() {
  return (
    <section
      data-test="work-section"
      aria-labelledby="work-heading"
      className="py-8 md:py-12"
    >
      <h1 id="work-heading" className="sr-only">
        Work
      </h1>
      <ul
        data-test="work-grid"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 items-stretch list-none p-0"
      >
        {projects.map((project, i) => (
          <li
            key={project.slug}
            className={fadeInUp}
            style={stagger(i + 1)}
          >
            <ProjectCard project={project} staggerIndex={i + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}
