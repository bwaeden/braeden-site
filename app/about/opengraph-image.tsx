// app/about/opengraph-image.tsx
//
// Dynamic Open Graph image for /about via Next 16 `next/og` ImageResponse.
// Renders the route title in Fraunces 700 on the charcoal gradient + grain,
// with the monogram anchored top-left at the 80px safe margin.
//
// Runtime: edge (fastest first-byte for social-card crawlers). Edge runtime
// cannot use next/font, so the TTFs are fetched as raw bytes via
// `fetch(new URL(..., import.meta.url))` (Next 16 edge-asset pattern).
//
// Font fallback: the `fonts` array lists Fraunces first, Geist Sans second.
// ImageResponse picks the first available font per text element; if the
// Fraunces TTF fetch fails (vendor file missing / edge hiccup), the title
// renders in Geist Sans rather than crashing.
//
// Composition is byte-identical to /work/opengraph-image.tsx except for the
// TITLE const + exported `alt`.

import { ImageResponse } from 'next/og';
import { MONOGRAM_PATH } from '@/lib/og/monogram-path';

export const runtime = 'edge';
export const alt = 'About Braeden Hodson';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITLE = 'About';

// feTurbulence grain — identical params to body::after in app/globals.css.
// Two-value backgroundSize required by satori's parseSimpleList when paired
// with a data-URI backgroundImage.
const GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default async function Image() {
  const [fraunces, geist] = await Promise.all([
    fetch(new URL('../../assets/Fraunces-Bold.ttf', import.meta.url)).then((r) =>
      r.arrayBuffer(),
    ),
    fetch(new URL('../../assets/GeistSans-Bold.ttf', import.meta.url)).then((r) =>
      r.arrayBuffer(),
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #1a1a1f 0%, #0a0a0a 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: `url("${GRAIN_DATA_URI}")`,
            backgroundSize: '200px 200px',
            opacity: 0.04,
          }}
        />
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="#e8e8e8"
          style={{ position: 'absolute', top: 80, left: 80 }}
        >
          <path d={MONOGRAM_PATH} />
        </svg>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Fraunces',
            fontSize: 128,
            fontWeight: 700,
            lineHeight: 1.05,
            color: '#e8e8e8',
            letterSpacing: '-0.02em',
            maxWidth: 1040,
            textAlign: 'center',
          }}
        >
          {TITLE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' },
        { name: 'Geist Sans', data: geist, weight: 700, style: 'normal' },
      ],
    },
  );
}
