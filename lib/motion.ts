// lib/motion.ts
// Isolation seam for animation. CSS-only for v1; if motion@12.x is ever added,
// this is the one file that changes. Source: CONTEXT.md CD-03; ARCHITECTURE.md.

export const respectsReducedMotion = true;

/** Class name applying @keyframes fade-in-up (defined in app/globals.css). */
export const fadeInUp = 'fade-in-up' as const;

/** Inline-style helper for staggered animation delays.
 *  Usage: <div style={stagger(2)} className={fadeInUp}>...
 *  Phase 2 hero will consume both. */
export function stagger(i: number): React.CSSProperties {
  return { '--stagger': `${i * 80}ms` } as React.CSSProperties;
}
