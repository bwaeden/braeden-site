/**
 * DSGN-07: Motion primitives defined but unused (Phase 1).
 *
 * Node-side spec (no browser). Imports `lib/motion.ts` and asserts:
 *  - `respectsReducedMotion === true`
 *  - `fadeInUp === 'fade-in-up'`
 *  - `stagger(2)` returns an object with `'--stagger': '160ms'`
 *
 * Plus a filesystem assertion that `app/globals.css` contains
 * `@keyframes fade-in-up` (the CSS side of the seam — CD-03).
 *
 * RED until W3 lands `lib/motion.ts` (CD-03) and the matching keyframes in
 * `app/globals.css`.
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

test('lib/motion.ts exports the documented seam contract', async () => {
  // Dynamic import so a missing file produces a clear assertion failure
  // rather than a parse-time crash that prevents collection.
  const mod = await import(path.resolve(process.cwd(), 'lib/motion.ts'));

  expect(
    mod.respectsReducedMotion,
    'lib/motion.ts must export respectsReducedMotion === true'
  ).toBe(true);

  expect(mod.fadeInUp, "lib/motion.ts must export fadeInUp === 'fade-in-up'").toBe(
    'fade-in-up'
  );

  expect(
    typeof mod.stagger,
    'lib/motion.ts must export a stagger(index) function'
  ).toBe('function');

  const result = mod.stagger(2);
  expect(result, "stagger(2) must return { '--stagger': '160ms' }").toEqual({
    '--stagger': '160ms',
  });
});

test('app/globals.css declares @keyframes fade-in-up', () => {
  const cssPath = path.resolve(process.cwd(), 'app/globals.css');
  expect(
    fs.existsSync(cssPath),
    'app/globals.css must exist (W2 deliverable)'
  ).toBe(true);
  const css = fs.readFileSync(cssPath, 'utf8');
  expect(css).toMatch(/@keyframes\s+fade-in-up\b/);
});
