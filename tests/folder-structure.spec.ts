/**
 * FOUND-04: Folder layout exists.
 *
 * Asserts every required Phase 1 directory exists. Test fails if any of
 * `app/`, `components/`, `components/ui/`, `components/layout/`,
 * `content/`, `data/`, `lib/`, `public/` is missing.
 *
 * RED until W1-T1 (`create-next-app` merge) and W1-T3 (folder scaffolds).
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const REQUIRED_DIRS = [
  'app',
  'components',
  'components/ui',
  'components/layout',
  'content',
  'data',
  'lib',
  'public',
];

test('required Phase 1 directories all exist', () => {
  const root = process.cwd();
  const missing: string[] = [];

  for (const rel of REQUIRED_DIRS) {
    const full = path.join(root, rel);
    let isDir = false;
    try {
      isDir = fs.statSync(full).isDirectory();
    } catch {
      isDir = false;
    }
    if (!isDir) missing.push(rel);
  }

  expect(missing, `missing required directories: ${missing.join(', ')}`).toEqual([]);
});
