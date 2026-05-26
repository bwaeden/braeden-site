// lib/og/monogram-path.ts
// Source: 06-PATTERNS.md § lib/og/monogram-path.ts; 06-UI-SPEC § Component Inventory.
//
// Triple-source contract (Phase 6 extends Phase 1 D-04 dual-write to triple-write).
// MONOGRAM_PATH is the single source for the "B" monogram glyph path data. It
// MUST stay byte-identical across all THREE surfaces:
//   1. components/ui/MonogramMark.tsx  (imports this const into its <path d>)
//   2. app/icon.svg                    (static .svg — cannot import; keeps an
//                                        inline literal with a cross-reference
//                                        comment pointing back here)
//   3. the OG ImageResponse JSX in app/about/opengraph-image.tsx +
//      app/work/opengraph-image.tsx + scripts/build-static-og.mjs (import this)
//
// Any monogram swap (Phase 1 D-01 v1.x designer-pass) re-runs the Fraunces trace
// and updates ALL THREE surfaces in a single atomic commit. Provenance: traced
// from Google Fonts Fraunces v38 weight 900 ("Black"), glyph "B", scaled to a
// 64×64 viewBox with ~6px padding (see MonogramMark.tsx leading comment).
export const MONOGRAM_PATH =
  'M58.41 45.56Q58.41 51.13 53.60 54.56Q48.79 58 38.72 58L8.71 58Q7.11 58 6.35 57.33Q5.59 56.66 5.59 55.55Q5.59 53.58 7.49 52.84L8.93 52.32Q9.90 51.95 10.36 51.39Q10.83 50.83 10.83 49.90L10.83 14.10Q10.83 13.17 10.36 12.61Q9.90 12.05 8.93 11.68L7.49 11.16Q5.59 10.42 5.59 8.45Q5.59 7.30 6.35 6.65Q7.11 6 8.71 6L32.15 6Q39.43 6 44.63 7.93Q49.83 9.86 52.63 13.32Q55.44 16.77 55.44 21.41Q55.44 25.17 53.19 28.04Q50.94 30.92 46.67 32.56Q42.40 34.19 36.31 34.19L38.02 32.67Q44.07 32.67 48.66 34.28Q53.25 35.90 55.83 38.82Q58.41 41.73 58.41 45.56M32.85 36.23L23.38 36.23L23.38 32.22L31.07 32.22Q33.82 32.22 35.66 31.18Q37.50 30.14 38.41 27.95Q39.32 25.76 39.32 22.42Q39.32 18.78 38.09 16.18Q36.87 13.58 34.56 12.15Q32.26 10.72 29.07 10.72L27.99 10.72L27.99 48.94Q27.99 51.17 29.25 52.22Q30.51 53.28 32.82 53.28L34.75 53.28Q36.83 53.28 38.33 52.32Q39.84 51.35 40.67 49.49Q41.51 47.64 41.51 45Q41.51 40.88 39.21 38.56Q36.90 36.23 32.85 36.23';
