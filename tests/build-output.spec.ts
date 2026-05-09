/**
 * FOUND-02: Tailwind v4 `@theme` compiles to CSS custom props.
 *
 * Reads every CSS file under `.next/static/css/` and asserts at least one
 * file contains `--color-bg-end: #0a0a0a` (whitespace tolerant).
 *
 * This spec is RED until W2 lands `@theme` tokens in `app/globals.css` and
 * a `npm run build` is performed before invoking the test.
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

function collectCssFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectCssFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      out.push(full);
    }
  }
  return out;
}

test('Tailwind @theme emits --color-bg-end: #0a0a0a in built CSS', () => {
  const cssDir = path.resolve(process.cwd(), '.next/static/css');
  const cssFiles = collectCssFiles(cssDir);

  expect(
    cssFiles.length,
    'expected at least one CSS file under .next/static/css/ — run `npm run build` first'
  ).toBeGreaterThan(0);

  // Whitespace-tolerant match for `--color-bg-end: #0a0a0a` (Tailwind may
  // emit with or without a space after the colon; case is irrelevant for
  // the property name but the hex literal is canonical lowercase here).
  const tokenRegex = /--color-bg-end\s*:\s*#0a0a0a/i;

  let matchCount = 0;
  for (const file of cssFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    // Strip line-leading hash comments (defensive — CSS uses /* */, but
    // mirror the grep -v '^#' hygiene called for in the contract).
    const cleaned = raw
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('#'))
      .join('\n');
    if (tokenRegex.test(cleaned)) matchCount += 1;
  }

  expect(
    matchCount,
    `expected at least one CSS file to contain --color-bg-end: #0a0a0a`
  ).toBeGreaterThan(0);
});
