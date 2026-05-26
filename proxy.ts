// proxy.ts (repo root — NOT under app/)
// Source: 06-RESEARCH Pattern 5; 06-PATTERNS § proxy.ts; CONTEXT D-18.
//
// Next 16 renamed middleware.ts -> proxy.ts. This edge/Node proxy sets
// `X-Robots-Tag: noindex` on every response when the deploy is a Vercel
// preview (VERCEL_ENV === 'preview'), so preview URLs never get indexed by
// search engines (SEO-09 / threat T-06-04). Production deploys (VERCEL_ENV
// === 'production') and local dev (VERCEL_ENV undefined) ship no header.
//
// This is an edge/server-side proxy, NOT a client component — FOUND-07's
// single-client-island invariant is untouched. Do NOT set a `runtime` config
// option (Next 16 default is Node.js; setting runtime here is a build error).

import { NextResponse } from 'next/server';

export function proxy() {
  const response = NextResponse.next();
  if (process.env.VERCEL_ENV === 'preview') {
    response.headers.set('X-Robots-Tag', 'noindex');
  }
  return response;
}

export const config = {
  // Negative match — exclude static assets so they don't get the header and
  // the proxy doesn't run on every static-file request.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|images|opengraph-image|robots.txt|sitemap.xml).*)',
  ],
};
