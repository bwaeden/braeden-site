// components/ui/MonogramMark.tsx
// Source: PLAN.md W3-T1; CONTEXT.md D-01..D-05; RESEARCH.md Pattern 4 + A3 fallback.
//
// Server Component (NO 'use client' — FOUND-07). Inline SVG monogram with
// `currentColor` fill so the parent's `text-*` class drives color
// (CLAUDE.md "Monogram approach"). `role="presentation"` when aria-hidden
// (decorative everywhere in Phase 1).
//
// Path provenance (W3-T1):
//   Traced from Google Fonts Fraunces v38, weight 900 (Black), opsz 9..144
//   default. Source TTF was the live Google Fonts gstatic.com asset
//   (v38/6NUh8FyL...nfgRYIcHhyjDg.ttf), opened with opentype.js, glyph "B"
//   extracted via getPath() at fontSize=74.286 (UPM=2000, glyph yMax=1400)
//   and translated to (baselineX=2.32, baselineY=58) so the visible glyph
//   bbox is X:5.59..58.41 / Y:6..58 — ~6px padding inside the 64x64 viewBox.
//
//   Note on the SOFT axis: STATE.md (W2 Open Question #2 verdict) records
//   that next/font/google rejects axes alongside explicit weights at runtime.
//   Per RESEARCH.md A3 we trace from a STATIC Fraunces Black source instead;
//   the SOFT axis is therefore not applied here. The Phase 6 designer-pass
//   (D-01) will replace this with the final designed mark.
//
// Single-source enforcement (D-04, extended to triple-source in Phase 6):
//   The path data is now imported from `lib/og/monogram-path.ts`
//   (MONOGRAM_PATH). It MUST stay byte-identical across all three surfaces:
//   this component, `app/icon.svg` (inline literal + cross-reference comment),
//   and the OG ImageResponse JSX (which also imports MONOGRAM_PATH). The
//   favicon adds rendering hints (charcoal <rect> background,
//   shape-rendering="crispEdges", explicit fill="#e8e8e8") but the path is shared.

import { MONOGRAM_PATH } from '@/lib/og/monogram-path';

interface MonogramMarkProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

export function MonogramMark({
  size = 24,
  className,
  'aria-hidden': ariaHidden = true,
}: MonogramMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-hidden={ariaHidden}
      role={ariaHidden ? 'presentation' : 'img'}
    >
      {/* Path traced from Fraunces Black (Google Fonts v38, wght=900),
          character "B". Phase 6 swap-pass will replace with the designed
          mark (D-01). Triple source via MONOGRAM_PATH — must stay
          byte-identical with lib/og/monogram-path.ts + app/icon.svg (D-04). */}
      <path d={MONOGRAM_PATH} />
    </svg>
  );
}
