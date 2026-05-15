// components/layout/Nav.tsx
// Source: PLAN.md W3-T2 (Phase 1 nav) + W4-T3 mobile-nav (a975967) + 02-04-T3
// (Phase 2 href rewire to /about, /work — Contact stays / until Phase 5).
//
// Server Component (NO 'use client' — FOUND-07). Mobile (<sm) uses native
// <details>/<summary> for a JS-free hamburger disclosure (ESC and outside
// activation handled by the browser). Desktop (>=sm) renders the inline nav.

import Link from 'next/link';
import { MonogramMark } from '@/components/ui/MonogramMark';

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '#contact', label: 'Contact' }, // Phase 5: hash-driven trigger per D-06 (ContactModal listens for #contact via hashchange)
];

const linkClass =
  'px-2 py-2 font-sans text-base decoration-1 underline-offset-4 hover:underline';

export function Nav() {
  return (
    <header className="divider-bottom px-6 py-6 lg:px-12">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <MonogramMark size={24} aria-hidden />
          <span className="whitespace-nowrap font-sans text-base">Braeden Hodson</span>
        </Link>

        {/* Desktop nav — sm and up */}
        <nav aria-label="Primary" className="hidden gap-4 sm:flex">
          {LINKS.map(({ href, label }) => (
            <Link key={label} href={href} className={linkClass}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile disclosure — below sm */}
        <details className="nav-mobile relative sm:hidden">
          <summary
            aria-label="Toggle menu"
            className="nav-mobile-toggle flex cursor-pointer items-center justify-center rounded-sm p-2"
          >
            <svg
              className="nav-icon-menu"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
              style={{ width: 20, height: 20 }}
            >
              <line x1="3" y1="6" x2="17" y2="6" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
            <svg
              className="nav-icon-close"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
              style={{ width: 20, height: 20 }}
            >
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </summary>
          <nav
            aria-label="Primary mobile"
            className="absolute right-0 top-full z-10 mt-2 flex w-44 flex-col gap-1 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-end)] p-2 shadow-lg"
          >
            {LINKS.map(({ href, label }) => (
              <Link key={label} href={href} className={`${linkClass} block`}>
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
