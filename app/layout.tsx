import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ContactModal } from '@/components/contact/ContactModal';
import { site } from '@/data/site';
import { fraunces, GeistSans, GeistMono } from './fonts';
import './globals.css';

// SEO-05 / SEO-06: metadataBase lets per-route relative canonicals + the
// file-based app/opengraph-image.png resolve to absolute braehods.com URLs.
// openGraph.images is intentionally NOT set here — the file-based
// opengraph-image convention overrides it automatically (Pitfall 2).
export const metadata: Metadata = {
  metadataBase: new URL('https://braehods.com'),
  title: { default: 'Braeden Hodson', template: '%s · Braeden Hodson' },
  description: 'Personal site of Braeden Hodson.',
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'Braeden Hodson',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
};

// SEO-05: Person JSON-LD. sameAs = GitHub + Instagram only (NO YouTube per
// 02-SCOPE-AMENDMENT.md); single source is data/site.ts (Phase 2 D-15).
// Inlined as a <script> in initial HTML (NOT next/script — crawlers like
// facebookexternalhit do not run JS, so the JSON-LD must ship in the HTML).
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: `https://${site.domain}`,
  sameAs: [site.socials.github, site.socials.instagram].filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
        <Footer />
        <ContactModal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
