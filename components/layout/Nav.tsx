// components/layout/Nav.tsx
// Source: PLAN.md W3-T2; RESEARCH.md Pattern 2 (RSC by Default);
// UI-SPEC § Layout & Component Inventory + Copywriting.
//
// Server Component (NO 'use client' — FOUND-07). Native <a> / next/link is
// keyboard-activatable by default; aria-label="Primary" on the inner <nav>
// gives screen readers a landmark; px-2 py-2 + 16px text yields a >=44x44
// click target (UI-SPEC Interaction Contract). Hover affordance is
// underline only — hover-lift is reserved for Phase 2+.

import Link from 'next/link';
import { MonogramMark } from '@/components/ui/MonogramMark';

export function Nav() {
  return (
    <header className="divider-bottom px-6 py-6 lg:px-12">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <MonogramMark size={24} aria-hidden />
          <span className="font-sans text-base">Braeden Hodson</span>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-4">
          {/* Phase 1 stubs — all route to /; Phases 3/4/5 swap in real targets */}
          <Link
            href="/"
            className="px-2 py-2 font-sans text-base decoration-1 underline-offset-4 hover:underline"
          >
            About
          </Link>
          <Link
            href="/"
            className="px-2 py-2 font-sans text-base decoration-1 underline-offset-4 hover:underline"
          >
            Work
          </Link>
          <Link
            href="/"
            className="px-2 py-2 font-sans text-base decoration-1 underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
