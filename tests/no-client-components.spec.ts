/**
 * FOUND-07 Phase 5 carve-out: exactly ONE `'use client'` directive allowed
 * across `app/`, `components/`, `lib/`, and it MUST be at
 * `components/contact/ContactModal.tsx`.
 *
 * History:
 *   Phase 1 — `'use client'` count must be 0 (asserted empty offenders array).
 *   Phase 5 — count must be exactly 1; the one allowed file is ContactModal.
 *
 * This spec was atomically updated in Plan 05-02 alongside the creation of
 * the new ContactModal client island. Without the atomic update, this spec
 * would have gone RED the moment the directive landed. GREEN at Phase 5 once
 * ContactModal lands as the sole carve-out per FOUND-07 — and stays GREEN
 * for the life of v1 unless a second client island is justified.
 *
 * Companion spec: tests/single-client-island.spec.ts asserts the same
 * invariant from a different angle (allow-list + count check). Both must
 * stay GREEN together.
 *
 * Cross-platform path normalization: tests run on Windows 10 / PowerShell
 * AND CI Linux. `path.relative(...)` returns back-slashes on Windows;
 * .split(path.sep).join('/') normalizes to forward-slash form so the
 * assertion is portable.
 *
 * Filesystem-only (no browser).
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
 * Strip leading // line comments and / * ... * / block comments from the
 * top of a file so a banner like `// 'use client' explained below` doesn't
 * trigger a false positive. We only remove comments that appear before the
 * first non-comment, non-blank token.
 */
function stripLeadingComments(source: string): string {
  let i = 0;
  const len = source.length;
  while (i < len) {
    // Skip whitespace.
    while (i < len && /\s/.test(source[i]!)) i += 1;
    if (i >= len) break;
    // Block comment.
    if (source[i] === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end === -1) return ''; // unterminated — file is effectively all comment
      i = end + 2;
      continue;
    }
    // Line comment.
    if (source[i] === '/' && source[i + 1] === '/') {
      const eol = source.indexOf('\n', i);
      i = eol === -1 ? len : eol + 1;
      continue;
    }
    // First real token.
    break;
  }
  return source.slice(i);
}

test(`exactly 1 'use client' directive (ContactModal — Phase 5 FOUND-07 carve-out)`, () => {
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
