import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Nav } from '@/components/layout/Nav';
import { fraunces, GeistSans, GeistMono } from './fonts';
import './globals.css';

export const metadata = {
  title: { default: 'Braeden Hodson', template: '%s · Braeden Hodson' },
  description: 'Personal site of Braeden Hodson.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
        {/* Phase 1 W3 will replace this placeholder footer with <Footer/> */}
        <footer className="divider-top px-6 py-8 lg:px-12" data-test="footer-placeholder" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
