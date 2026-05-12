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
  images: { qualities: [75, 90] },
};

export default withMDX(nextConfig);
