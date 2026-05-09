/**
 * FOUND-07: No `'use client'` directives in Phase 1 sources.
 *
 * Recursively scans `app/`, `components/`, `lib/` for `*.ts` and `*.tsx`,
 * strips top-of-file comments (// and / * * /), and asserts zero hits for
 * `'use client'` or `"use client"`.
 *
 * Filesystem-only (no browser).
 *
 * RED until those directories exist (W1) and contain RSC-only sources
 * (W2/W3).
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SCAN_ROOTS = ['app', 'components', 'lib'];

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

test('no `use client` directives anywhere in app/ components/ lib/', () => {
  const root = process.cwd();
  const offenders: string[] = [];

  for (const sub of SCAN_ROOTS) {
    const dir = path.join(root, sub);
    for (const file of collectSourceFiles(dir)) {
      const raw = fs.readFileSync(file, 'utf8');
      const stripped = stripLeadingComments(raw);
      if (/^\s*['"]use client['"]/.test(stripped)) {
        offenders.push(path.relative(root, file));
      }
    }
  }

  expect(
    offenders,
    `Phase 1 must be RSC-only; found 'use client' in: ${offenders.join(', ')}`
  ).toEqual([]);
});
