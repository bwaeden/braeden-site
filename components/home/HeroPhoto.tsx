// components/home/HeroPhoto.tsx
// Source: PLAN.md 02-02-T3; UI-SPEC § HeroPhoto (D-01..D-04, D-21, D-22, D-23, D-24).
//
// Server Component (zero client directive — FOUND-07 / D-25). Wraps the v1
// portrait asset in a hairline-border tile with 8px inner padding (D-02).
// Marked with `view-transition-name: hero-photo` (D-21) so Phase 3's /about
// photo can wire the matching name for a CSS-only shared-element transition.
// Per-element seam only — NO project-wide ViewTransition root wrapper (D-22).
// NO animation — this IS the LCP element (D-24, HOME-04, PERF-06).
//
// Static-import portrait (D-04) enables next/image to derive a blur
// placeholder at build time without a manual blurDataURL. Explicit
// width=320 + height=320 props (PERF-04) are the intrinsic dimensions
// next/image uses for srcset + CLS; the Tailwind w-60 h-60 md:w-80 md:h-80
// classes do the responsive content reflow (240px <md, 320px ≥md per CD-04).
//
// quality={90} requires next.config.ts images.qualities to list 90 — Plan
// 02-01 already patched the config (images: { qualities: [75, 90] }).

import Image from 'next/image';
import portrait from '@/public/portrait.jpg';

export function HeroPhoto() {
  return (
    <div
      data-test="hero-photo-tile"
      className="rounded border border-[var(--color-border)] p-2 shrink-0"
      style={{ viewTransitionName: 'hero-photo' }}
    >
      <Image
        src={portrait}
        alt="Braeden Hodson"
        width={320}
        height={320}
        priority
        placeholder="blur"
        quality={90}
        className="rounded-[2px] w-60 h-60 md:w-80 md:h-80 object-cover"
      />
    </div>
  );
}
