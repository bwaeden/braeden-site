// components/layout/Footer.tsx
// Source: PLAN.md W3-T3; UI-SPEC § Layout & Component Inventory + Copywriting.
//
// Server Component (NO 'use client' — FOUND-07). Both the monogram and the
// adjacent text inherit `color: var(--color-muted)` so the SVG's
// `currentColor` resolves to muted gray (PITFALLS Pitfall 1 — muted #a8a8a8
// clears WCAG AA at ~7:1 against #0a0a0a). `braehods.com` is plain text in
// Phase 1 — UI-SPEC notes the real source link arrives in Phase 6. Year is
// hardcoded (UI-SPEC: "Phase 6 polish-pass evaluates whether to make it
// dynamic").

import { MonogramMark } from '@/components/ui/MonogramMark';

export function Footer() {
  return (
    <footer className="divider-top px-6 py-8 lg:px-12">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3" style={{ color: 'var(--color-muted)' }}>
          <MonogramMark size={16} aria-hidden />
          <span className="font-sans text-sm">© 2026 Braeden Hodson</span>
        </div>
        <span className="font-sans text-sm" style={{ color: 'var(--color-muted)' }}>
          braehods.com
        </span>
      </div>
    </footer>
  );
}
