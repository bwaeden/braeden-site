/**
 * A11Y-02: No `outline: none` without a `:focus-visible` replacement.
 *
 * Reads every `.css` file under the project root (excluding `node_modules/`,
 * `.next/`, `tests/`) — primarily `app/globals.css` for v1. For each
 * `outline: none` (whitespace-tolerant) occurrence, asserts that within
 * the next 3 lines there is a `:focus-visible` rule containing
 * `outline: 2px solid var(--color-accent)`.
 *
 * Tiny regex parser; full PostCSS not required for the v1 surface area.
 *
 * RED until W2 lands `app/globals.css` (which per CD-02 will use
 * `:focus-visible` with the accent ring globally and never strip outlines
 * unconditionally).
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.next', 'tests', '.git', '.planning']);

function collectCssFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectCssFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      out.push(full);
    }
  }
  return out;
}

test('every `outline: none` has a paired :focus-visible accent ring within 3 lines', () => {
  const root = process.cwd();
  const cssFiles = collectCssFiles(root);

  expect(
    cssFiles.length,
    'expected at least one `.css` file (e.g. app/globals.css) to inspect'
  ).toBeGreaterThan(0);

  const offenders: { file: string; line: number; snippet: string }[] = [];

  const bareOutlineRe = /outline\s*:\s*none/i;
  const focusVisibleAccentRe =
    /:focus-visible[\s\S]*?outline\s*:\s*2px\s+solid\s+var\(\s*--color-accent\s*\)/i;

  for (const file of cssFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      if (bareOutlineRe.test(lines[i]!)) {
        // Look ahead 3 lines (inclusive) for a :focus-visible accent ring.
        const window = lines.slice(i, Math.min(lines.length, i + 4)).join('\n');
        if (!focusVisibleAccentRe.test(window)) {
          offenders.push({
            file: path.relative(root, file),
            line: i + 1,
            snippet: lines[i]!.trim(),
          });
        }
      }
    }
  }

  expect(
    offenders,
    `bare \`outline: none\` without paired :focus-visible accent ring: ${JSON.stringify(
      offenders,
      null,
      2
    )}`
  ).toEqual([]);
});
