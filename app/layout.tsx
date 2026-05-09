import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { fraunces, GeistSans, GeistMono } from './fonts';
import './globals.css';

export const metadata = {
  title: { default: 'Braeden Hodson', template: '%s · Braeden Hodson' },
  description: 'Personal site of Braeden Hodson.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
