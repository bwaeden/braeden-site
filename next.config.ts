import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [], // Phase 4 will add remark-gfm
    rehypePlugins: [], // Phase 4 will add rehype-pretty-code
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // Next 16 narrowed images.qualities default from [1..100] to [75]. HeroPhoto
  // (Plan 02-02) uses quality={90} for the hero portrait; without this entry
  // the production build rejects the prop. No remotePatterns added — Phase 2
  // ships only the local public/portrait.jpg static asset.
  //
  // formats: AVIF + WebP auto-negotiation via Accept header. Phase 2 W4 LCP
  // remediation (2026-05-12): hero portrait LCP measured 2885ms on Slow-4G
  // — adding AVIF (~30-40% smaller payload at equivalent quality) shaves
  // decode/transfer time. Vercel handles AVIF generation automatically at
  // request time; no source asset change required.
  images: {
    qualities: [75, 90],
    formats: ['image/avif', 'image/webp'],
  },
};

export default withMDX(nextConfig);
