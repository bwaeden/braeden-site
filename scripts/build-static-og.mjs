// scripts/build-static-og.mjs
//
// One-shot Node script that generates the static `/` Open Graph image at
// `app/opengraph-image.png` (1200×630). Next 16 auto-wires the
// `<meta property="og:image">` tag from that file convention — the filename is
// load-bearing (renaming breaks the metadata wire).
//
// Run manually:  node scripts/build-static-og.mjs
// This is NOT wired into `next build` (per 06-UI-SPEC OQ-3). The output PNG is
// committed to the repo as a static asset; re-run only when the monogram or
// wordmark source changes (e.g. the v1.x designer-pass monogram refresh).
//
// IMPLEMENTATION NOTE — why React.createElement instead of JSX:
//   This script is executed by bare `node` (no SWC/Babel/TS loader in the
//   one-shot path), so JSX and `.ts` imports do not parse. We therefore build
//   the element tree with `React.createElement` (plain ESM) and source the
//   shared MONOGRAM_PATH by reading lib/og/monogram-path.ts as text and
//   extracting the literal — this preserves the triple-source byte-identity
//   guarantee at runtime (no hand-copied path that could drift).
//
// Composition (06-UI-SPEC § Static `/` OG Image):
//   - Background: linear-gradient(135deg, #1a1a1f 0%, #0a0a0a 100%)
//   - Grain overlay: feTurbulence data-URI (same params as body::after in
//     globals.css — baseFrequency 0.85 / numOctaves 2 / stitchTiles stitch),
//     opacity 0.04, NO mix-blend-mode (Satori rasterizes flat; blend modes are
//     unreliable at edge — flat 0.04 reproduces the dithered film-grain look).
//   - Monogram: MONOGRAM_PATH (shared triple-source const), 96×96, fill #e8e8e8.
//   - Wordmark: "Braeden", Fraunces 700, 180px, line-height 1.0, color #e8e8e8,
//     letter-spacing -0.02em.
//   - 48px gap between monogram and wordmark; composition nudged ~5% above true
//     center (optical baseline drift compensation for display serifs).
//
// UI-SPEC Dimension 5 FLAG resolution:
//   The spec lists monogram vertical-center y=275 and wordmark baseline y=445.
//   The FLAG asks to TRY multiples-of-4 first (monogram center y=276, wordmark
//   baseline y=444). Because the composition is a centered flex column with a
//   fixed 48px gap (not absolute-positioned glyphs), the effective anchors are
//   driven by the column's vertical centering plus an upward nudge. We use
//   `justifyContent: 'center'` + a -39px translate on the column so the visual
//   group sits ~5% above the 315 mid-line — which lands the 96px monogram's
//   center at ~y=276 and the 180px wordmark's optical baseline at ~y=444, i.e.
//   the multiples-of-4 attempt. If Task 11's visual review shows worse optical
//   drift than the y=275/445 spec, change OG_NUDGE_PX below by +1 (to -40px →
//   y=275/445), re-run this script, and re-commit the PNG. The original spec
//   values are y=275 (monogram center) / y=445 (wordmark baseline).
//
// Generated PNG MD5 (recorded after first run for regeneration determinism):
//   md5  = acf5f08ec8b6aca0c749e6af04f51a65
//   size = 798254 bytes, 1200×630, 8-bit RGBA (satori always emits RGBA; the
//          charcoal gradient fully covers the canvas so alpha is opaque).
//   If the monogram path / wordmark / OG_NUDGE_PX changes this hash changes —
//   re-run and update this value.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createElement as h } from 'react';

// `next/og` ships as CJS under bare node (its package `exports` map needs the
// Next resolver). Load the concrete `next/og.js` entry via createRequire.
const require = createRequire(import.meta.url);
const { ImageResponse } = require('next/og.js');

// Upward nudge so the monogram+wordmark group sits ~5% above true center.
// -39 → multiples-of-4 attempt (monogram center ~y=276 / wordmark baseline ~y=444).
// -40 → original spec values (monogram center y=275 / wordmark baseline y=445).
const OG_NUDGE_PX = -39;

// feTurbulence grain — identical params to body::after in app/globals.css.
const GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// Source MONOGRAM_PATH from lib/og/monogram-path.ts at runtime (byte-identical
// triple-source guarantee — no hand-copied literal that could drift).
async function loadMonogramPath() {
  const src = await readFile(
    join(process.cwd(), 'lib', 'og', 'monogram-path.ts'),
    'utf8',
  );
  const match = src.match(/MONOGRAM_PATH\s*=\s*\n?\s*'([^']+)'/);
  if (!match) {
    throw new Error('Could not extract MONOGRAM_PATH from lib/og/monogram-path.ts');
  }
  return match[1];
}

async function main() {
  const [fraunces, monogramPath] = await Promise.all([
    readFile(join(process.cwd(), 'assets', 'Fraunces-Bold.ttf')),
    loadMonogramPath(),
  ]);

  const tree = h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 1200,
        height: 630,
        background: 'linear-gradient(135deg, #1a1a1f 0%, #0a0a0a 100%)',
      },
    },
    // Grain overlay — full-bleed, flat opacity 0.04, no blend mode.
    h('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1200,
        height: 630,
        backgroundImage: `url("${GRAIN_DATA_URI}")`,
        // Two-value form required: satori's parseSimpleList rejects the
        // single-value `200px` for background-size when paired with a
        // data-URI background-image (throws "(cssText||'').split is not a
        // function"). `200px 200px` is equivalent and parses cleanly.
        backgroundSize: '200px 200px',
        opacity: 0.04,
      },
    }),
    // Centered monogram + wordmark group, nudged ~5% above center.
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${OG_NUDGE_PX}px)`,
        },
      },
      h(
        'svg',
        {
          width: 96,
          height: 96,
          viewBox: '0 0 64 64',
          fill: '#e8e8e8',
          style: { marginBottom: 48 },
        },
        h('path', { d: monogramPath }),
      ),
      h(
        'div',
        {
          style: {
            fontFamily: 'Fraunces',
            fontSize: 180,
            fontWeight: 700,
            lineHeight: 1.0,
            color: '#e8e8e8',
            letterSpacing: '-0.02em',
          },
        },
        'Braeden',
      ),
    ),
  );

  const response = new ImageResponse(tree, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' }],
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = join(process.cwd(), 'app', 'opengraph-image.png');
  await writeFile(outPath, buffer);

  const md5 = createHash('md5').update(buffer).digest('hex');
  console.log(`Wrote ${outPath}`);
  console.log(`  size: ${buffer.length} bytes`);
  console.log(`  md5:  ${md5}`);
}

main().catch((err) => {
  console.error('build-static-og failed:', err);
  process.exit(1);
});
