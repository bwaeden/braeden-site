// app/about/page.tsx
// Source: PLAN.md 02-05-T1; UI-SPEC § Stub Routes (D-18, HOME-05).
//
// Stub placeholder until Phase 3 ships real /about content + the matching
// view-transition-name: hero-photo on the about-page photo. Inherits
// Nav + Footer chrome from app/layout.tsx automatically.

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <section className="py-24">
      <p className="font-sans text-base" style={{ color: 'var(--color-muted)' }}>
        Coming soon.
      </p>
    </section>
  );
}
