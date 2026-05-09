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
// Single-source enforcement (D-04):
//   The `<path d="...">` data below MUST stay byte-identical to
//   `app/icon.svg`. The favicon adds rendering hints (charcoal <rect>
//   background, shape-rendering="crispEdges", explicit fill="#e8e8e8")
//   but the path data is shared.

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
          mark (D-01). Single source — must match app/icon.svg (D-04). */}
      <path d="M58.41 45.56Q58.41 51.13 53.60 54.56Q48.79 58 38.72 58L8.71 58Q7.11 58 6.35 57.33Q5.59 56.66 5.59 55.55Q5.59 53.58 7.49 52.84L8.93 52.32Q9.90 51.95 10.36 51.39Q10.83 50.83 10.83 49.90L10.83 14.10Q10.83 13.17 10.36 12.61Q9.90 12.05 8.93 11.68L7.49 11.16Q5.59 10.42 5.59 8.45Q5.59 7.30 6.35 6.65Q7.11 6 8.71 6L32.15 6Q39.43 6 44.63 7.93Q49.83 9.86 52.63 13.32Q55.44 16.77 55.44 21.41Q55.44 25.17 53.19 28.04Q50.94 30.92 46.67 32.56Q42.40 34.19 36.31 34.19L38.02 32.67Q44.07 32.67 48.66 34.28Q53.25 35.90 55.83 38.82Q58.41 41.73 58.41 45.56M32.85 36.23L23.38 36.23L23.38 32.22L31.07 32.22Q33.82 32.22 35.66 31.18Q37.50 30.14 38.41 27.95Q39.32 25.76 39.32 22.42Q39.32 18.78 38.09 16.18Q36.87 13.58 34.56 12.15Q32.26 10.72 29.07 10.72L27.99 10.72L27.99 48.94Q27.99 51.17 29.25 52.22Q30.51 53.28 32.82 53.28L34.75 53.28Q36.83 53.28 38.33 52.32Q39.84 51.35 40.67 49.49Q41.51 47.64 41.51 45Q41.51 40.88 39.21 38.56Q36.90 36.23 32.85 36.23" />
    </svg>
  );
}
