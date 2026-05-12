// components/home/CurrentlyLine.tsx
// Source: PLAN.md 02-02-T2; UI-SPEC § CurrentlyLine (CD-02, HOME-02).
//
// Server Component (zero client directive — FOUND-07 / D-25). Renders the
// "Currently" line: accent dot + statement + middle dot + Geist Mono date.
// First real consumer of Phase 1's lib/motion.ts seam — applies fadeInUp +
// stagger(2) = 160ms delay (CD-03). Date formatting in lib/format.ts
// (server-side UTC-anchored — no client-side date math, no timezone surprises).
//
// Pattern analog: app/%5Ftokens/page.tsx color-row (lines 41-52) — flex
// row with a small leading visual + Geist Sans label + mono value. Phase 2
// transposes that shape: 6px accent dot prefix (w-1.5 h-1.5, the documented
// sub-grid exception per UI-SPEC line 73) replaces the swatch; <time dateTime>
// semantic element replaces the second mono span.

import type { CurrentlyStatement } from '@/data/currently';
import { formatDate } from '@/lib/format';
import { fadeInUp, stagger } from '@/lib/motion';

interface CurrentlyLineProps {
  data: CurrentlyStatement;
}

export function CurrentlyLine({ data }: CurrentlyLineProps) {
  return (
    <p
      className={`mt-6 flex items-center gap-2 text-base ${fadeInUp}`}
      style={stagger(2)}
    >
      <span
        aria-hidden
        className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
      />
      {data.link ? (
        <a
          href={data.link}
          className="underline underline-offset-4 decoration-1"
          style={{ color: 'var(--color-text)' }}
        >
          {data.statement}
        </a>
      ) : (
        <span style={{ color: 'var(--color-text)' }}>{data.statement}</span>
      )}
      <span aria-hidden style={{ color: 'var(--color-muted)' }}>
        ·
      </span>
      <time
        dateTime={data.updatedAt}
        className="font-mono text-sm"
        style={{ color: 'var(--color-muted)' }}
      >
        {formatDate(data.updatedAt)}
      </time>
    </p>
  );
}
