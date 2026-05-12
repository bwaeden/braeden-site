// components/home/CTAArrowLink.tsx
// Source: PLAN.md 02-03-T3; UI-SPEC § CTAArrowLink (D-19, D-20).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Accent-colored
// Next.js <Link> with a Unicode '→' glyph that translates +4px on hover
// via the group/group-hover Tailwind pattern. Implements D-19 (subtle
// accent text-link with arrow glyph — NOT a pill button; pill treatment
// belongs to ChannelButton). Internal routes only (/about, /work) —
// next/link gives client-side prefetch automatically.
//
// staggerIndex is a prop (not computed inside) so the caller (Plan 06
// Hero.tsx) owns the choreography sequence — CTA1 passes 5, CTA2 passes
// 6 per CD-03. children is locked to `string` (not React.ReactNode) per
// D-19's "plain text label" contract — keeps the underline-offset render
// clean. Reduced-motion globally defeats the arrow translate via
// app/globals.css lines 54-63.

import Link from 'next/link';
import { fadeInUp, stagger } from '@/lib/motion';

interface CTAArrowLinkProps {
  href: string;
  children: string;
  staggerIndex: number;
}

export function CTAArrowLink({ href, children, staggerIndex }: CTAArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4 ${fadeInUp}`}
      style={{ color: 'var(--color-accent)', ...stagger(staggerIndex) }}
    >
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
