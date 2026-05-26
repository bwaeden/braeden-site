// app/not-found.tsx
// Source: 06-UI-SPEC § 404 Page Composition (D-05); 06-RESEARCH Pattern 6;
// 06-PATTERNS § app/not-found.tsx.
//
// Server Component (no client directive — FOUND-07 / D-25 inherited). Renders
// inside app/layout.tsx, so Nav + Footer chrome come for free — the branded
// 404 keeps the site identity on a miss. Composition: 80px monogram +
// Fraunces "Page not found" heading + body line with 3 inline accent links +
// a CTAArrowLink "← Back home" return link (the new direction='back' variant).
//
// Tab order (D-05): chrome -> /about -> /work -> get in touch -> Back home ->
// footer. The monogram is decorative (aria-hidden, no tabstop). The #contact
// inline link triggers the Phase 5 ContactModal via the existing hashchange +
// delegated-click handler — works identically from the 404 route.

import Link from 'next/link';
import { MonogramMark } from '@/components/ui/MonogramMark';
import { CTAArrowLink } from '@/components/home/CTAArrowLink';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <section
      data-test="not-found-section"
      aria-labelledby="not-found-heading"
      className="mx-auto flex min-h-[60vh] max-w-[44ch] flex-col items-center justify-center gap-6 py-8 text-center md:py-12"
    >
      <MonogramMark size={80} aria-hidden />
      <h1
        id="not-found-heading"
        className="font-serif text-4xl leading-tight font-bold md:text-5xl"
      >
        Page not found
      </h1>
      <p className="font-sans text-base">
        Try{' '}
        <Link
          href="/about"
          style={{ color: 'var(--color-accent)' }}
          className="decoration-1 underline-offset-4 hover:underline"
        >
          /about
        </Link>{' '}
        or{' '}
        <Link
          href="/work"
          style={{ color: 'var(--color-accent)' }}
          className="decoration-1 underline-offset-4 hover:underline"
        >
          /work
        </Link>{' '}
        — or{' '}
        <Link
          href="#contact"
          style={{ color: 'var(--color-accent)' }}
          className="decoration-1 underline-offset-4 hover:underline"
        >
          get in touch
        </Link>{' '}
        if you were looking for me.
      </p>
      <CTAArrowLink href="/" staggerIndex={0} direction="back">
        Back home
      </CTAArrowLink>
    </section>
  );
}
