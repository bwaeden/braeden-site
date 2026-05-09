// app/_tokens/page.tsx
// Source: PLAN.md W3-T4; CONTEXT.md D-11; RESEARCH.md Open Question #4.
//
// Hidden but deployed (D-11). Phase 2 deletes this route. The
// `metadata.robots = { index: false, follow: false }` is per-route insurance
// until Phase 6's SEO-09 sweep noindexes ALL Vercel-preview routes — Vercel
// preview URLs are publicly reachable, and `robots: { index: false, follow:
// false }` emits `<meta name="robots" content="noindex, nofollow">` via the
// Next 16 metadata API.
//
// Anti-pattern guard: PITFALLS Pitfall 3 — Phase 1 has zero Fraunces samples
// below 40px (the smallest is "Display M . 40" at exactly 40px). Do NOT add
// 24px or 16px Fraunces samples here; the FOIT/CLS contract Phase 1 protects
// is "no display-serif sample below the fallback's substitution threshold."

import { MonogramMark } from '@/components/ui/MonogramMark';

// Hidden but deployed - D-11. Phase 2 deletes this route.
export const metadata = {
  title: 'Tokens',
  robots: { index: false, follow: false }, // RESEARCH.md Open Q #4 — cheap insurance
};

const tokens = [
  { name: '--color-bg-start', value: '#1a1a1f' },
  { name: '--color-bg-end', value: '#0a0a0a' },
  { name: '--color-text', value: '#e8e8e8' },
  { name: '--color-muted', value: '#a8a8a8' },
  { name: '--color-accent', value: '#7c87ff' },
  { name: '--color-border', value: '#2a2a2f' },
] as const;

export default function TokensPage() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
          Colors
        </h2>
        <div className="mt-6 space-y-2">
          {tokens.map((t) => (
            <div key={t.name} className="flex items-center gap-4">
              <span
                className="block h-8 w-8 rounded"
                style={{ background: t.value, border: '1px solid var(--color-border)' }}
              />
              <span className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
                {t.name}
              </span>
              <span className="font-mono text-sm">{t.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
          Typography
        </h2>
        <p className="mt-6 font-serif text-[6rem] leading-[1.05] font-bold">Display XL · 96</p>
        <p className="font-serif text-[4rem] leading-[1.10] font-bold">Display L · 64</p>
        <p className="font-serif text-[2.5rem] leading-[1.15] font-semibold">Display M · 40</p>
        <p className="mt-6 font-sans text-base">
          Body 16 / Geist Sans · The quick brown fox jumps over the lazy dog.
        </p>
        <p className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
          Mono 14 / Geist Mono · 0123456789
        </p>
      </section>

      <section>
        <h2 className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
          Monogram
        </h2>
        <div className="mt-6 flex flex-wrap items-end gap-6">
          {[16, 24, 48, 96, 120].map((s) => (
            <MonogramMark key={s} size={s} aria-hidden />
          ))}
        </div>
        <div className="mt-6" style={{ color: 'var(--color-accent)' }}>
          <MonogramMark size={48} aria-hidden />
          <p className="mt-2 font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
            currentColor inherits — accent variant
          </p>
        </div>
      </section>
    </div>
  );
}
