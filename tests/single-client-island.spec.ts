/**
 * FOUND-07 Phase 5 carve-out: exactly ONE `'use client'` directive across
 * `app/`, `components/`, `lib/`, and it MUST be at
 * `components/contact/ContactModal.tsx`.
 *
 * Source decisions: FOUND-07 (single-client-island discipline locked since
 *                   Phase 1) + 05-CONTEXT D-25 carry-forward (ContactModal
 *                   is THE carve-out for the entire site).
 *
 * RED until Plan 05-02 ships `components/contact/ContactModal.tsx` with
 * the directive. The companion update to `tests/no-client-components.spec.ts`
 * (allow-list ContactModal, OR rename/replace this spec with the inverted
 * assertion) is also a Plan 05-02 concern — lands atomically with the new
 * client file.
 *
 * Helpers (SCAN_ROOTS, collectSourceFiles, stripLeadingComments) mirror
 * tests/no-client-components.spec.ts verbatim — single source of truth
 * for the `use client` detection logic.
 *
 * Cross-platform path normalization: tests run on Windows 10 / PowerShell
 * (per CLAUDE.md env block) AND CI Linux. `path.relative(...)` returns
 * back-slashes on Windows; .split(path.sep).join('/') normalizes to forward-
 * slash form so the assertion is portable.
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SCAN_ROOTS = ['app', 'components', 'lib'];

const ALLOWED_CLIENT_ISLANDS = ['components/contact/ContactModal.tsx'];

function collectSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Strip leading // line comments and /* ... *\/ block comments from the top
 * of a file so a banner like `// 'use client' explained below` doesn't
 * trigger a false positive. We only remove comments that appear before the
 * first non-comment, non-blank token. Mirror of no-client-components.spec.ts.
 */
function stripLeadingComments(source: string): string {
  let i = 0;
  const len = source.length;
  while (i < len) {
    while (i < len && /\s/.test(source[i]!)) i += 1;
    if (i >= len) break;
    if (source[i] === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end === -1) return '';
      i = end + 2;
      continue;
    }
    if (source[i] === '/' && source[i + 1] === '/') {
      const eol = source.indexOf('\n', i);
      i = eol === -1 ? len : eol + 1;
      continue;
    }
    break;
  }
  return source.slice(i);
}

test(`exactly 1 'use client' directive and it is the ContactModal (FOUND-07 Phase 5 carve-out)`, () => {
  const root = process.cwd();
  const offenders: string[] = [];

  for (const sub of SCAN_ROOTS) {
    const dir = path.join(root, sub);
    for (const file of collectSourceFiles(dir)) {
      const raw = fs.readFileSync(file, 'utf8');
      const stripped = stripLeadingComments(raw);
      if (/^\s*['"]use client['"]/.test(stripped)) {
        // Cross-platform: Windows path.sep is `\`; normalize to `/` for
        // portable assertion (CI Linux + dev Windows).
        const rel = path.relative(root, file).split(path.sep).join('/');
        offenders.push(rel);
      }
    }
  }

  expect(
    offenders.sort(),
    `Phase 5 carve-out: exactly 1 'use client' allowed (${ALLOWED_CLIENT_ISLANDS.join(
      ',',
    )}). Found: ${offenders.join(', ')}`,
  ).toEqual([...ALLOWED_CLIENT_ISLANDS].sort());
});
