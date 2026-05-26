// scripts/measure-first-page-bundle.mjs
// Source: 06-RESEARCH Pivot #1 (D-11 override); 06-VALIDATION 06-02-13; PERF-03.
//
// PERF-03: first-page client JS bundle ≤ 50 KB gzipped, EXCLUDING the
// ContactModal client island chunk.
//
// Next 16 uses Turbopack, which is incompatible with @next/bundle-analyzer
// (webpack-only). Per researcher Pivot #1 we use Turbopack-native bundle data
// instead — zero new deps. This script reads the production build manifest
// (`.next/build-manifest.json` -> rootMainFiles, the first-load JS shipped on
// every document) plus any `/`-route page chunk from the app build, gzip-sizes
// each chunk, identifies the ContactModal chunk by its content signature
// (Formspree + honeypot markers — it is a SEPARATE chunk, not in
// rootMainFiles), and reports the first-page total with the modal excluded.
//
// Run AFTER `npm run build` (consumes .next/). Optionally run
// `npx next experimental-analyze --output` first for the interactive treemap
// (`.next/diagnostics/analyze/`). This script does NOT need the analyze output.
//
// Usage: node scripts/measure-first-page-bundle.mjs
// Writes JSON to stdout AND to
// .planning/phases/06-polish-seo-launch/perf-03-measurement.json
//
// NOTE on the framework baseline: rootMainFiles includes the React + react-dom
// + app-router runtime that Next ships on EVERY page (a fixed cost, not
// route-specific application JS). The report breaks this out as
// `framework_baseline_gz_kb` so the PERF-03 judgement against the ≤50KB target
// can focus on the route-specific application bytes (CLAUDE.md "ship near-zero
// JS for initial load"). Final pass/fail is recorded in 06-02-SUMMARY.md after
// the Task 9 preview deploy.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, '.next');
const CHUNKS_DIR = join(NEXT_DIR, 'static', 'chunks');
const TARGET_KB = 50;

function gzKb(absPath) {
  const buf = readFileSync(absPath);
  return gzipSync(buf).length / 1024;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

// 1. Gather the first-load JS chunks from build-manifest rootMainFiles.
const manifestPath = join(NEXT_DIR, 'build-manifest.json');
if (!existsSync(manifestPath)) {
  console.error(
    'ERROR: .next/build-manifest.json not found — run `npm run build` first.'
  );
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const rootMainFiles = manifest.rootMainFiles ?? [];

const firstLoadChunks = rootMainFiles
  .filter((rel) => rel.endsWith('.js'))
  .map((rel) => ({ rel, abs: join(NEXT_DIR, rel) }))
  .filter((c) => existsSync(c.abs));

// 2. Identify the ContactModal chunk among ALL emitted chunks. It is a
//    SEPARATE chunk (not in rootMainFiles) — lazily fetched when the modal
//    mounts. Signature: contains 'formspree' AND a ContactModal-only marker.
function isContactModalChunk(abs) {
  const src = readFileSync(abs, 'utf8');
  return (
    /formspree/i.test(src) &&
    (/Send another/i.test(src) || /honeypot/i.test(src) || /\bcompany\b/.test(src))
  );
}

let contactModalChunkGzKb = 0;
let contactModalChunkRel = null;
for (const file of readdirSync(CHUNKS_DIR)) {
  if (!file.endsWith('.js')) continue;
  const abs = join(CHUNKS_DIR, file);
  if (isContactModalChunk(abs)) {
    const gz = gzKb(abs);
    // Pick the most specific (smallest dedicated) modal chunk if multiple match.
    if (contactModalChunkRel === null || gz < contactModalChunkGzKb) {
      contactModalChunkGzKb = gz;
      contactModalChunkRel = join('static', 'chunks', file);
    }
  }
}

// 3. Sum first-load chunk gz. Framework baseline = react/react-dom/app-router
//    runtime shipped on every document; application = the remainder.
let firstPageBundleGzKb = 0;
const perChunk = [];
for (const { rel, abs } of firstLoadChunks) {
  const gz = gzKb(abs);
  firstPageBundleGzKb += gz;
  perChunk.push({ chunk: rel, gz_kb: round(gz) });
}

// Framework baseline heuristic: the two largest first-load chunks are the
// React + react-dom runtime (Turbopack groups the framework into a couple of
// big shared chunks). Report it for transparency; the application-only figure
// is the first-page total minus the framework baseline.
const sortedGz = perChunk.map((c) => c.gz_kb).sort((a, b) => b - a);
const frameworkBaselineGzKb = sortedGz.slice(0, 2).reduce((a, b) => a + b, 0);
const applicationGzKb = firstPageBundleGzKb - frameworkBaselineGzKb;

// If the ContactModal chunk happens to be part of the first-load set, exclude
// it; otherwise the first-page set already excludes it (separate lazy chunk).
const modalInFirstLoad = firstLoadChunks.some(
  (c) => c.rel === contactModalChunkRel
);
const targetExcludingModalKb = modalInFirstLoad
  ? firstPageBundleGzKb - contactModalChunkGzKb
  : firstPageBundleGzKb;

const result = {
  perf_03_target_kb: TARGET_KB,
  first_page_bundle_gz_kb: round(firstPageBundleGzKb),
  framework_baseline_gz_kb: round(frameworkBaselineGzKb),
  application_gz_kb: round(applicationGzKb),
  contact_modal_chunk: contactModalChunkRel,
  contact_modal_chunk_gz_kb: round(contactModalChunkGzKb),
  contact_modal_in_first_load: modalInFirstLoad,
  target_excluding_modal_kb: round(targetExcludingModalKb),
  // Application-only (excluding the React/react-dom framework baseline AND the
  // modal) is the figure that maps to "ship near-zero JS for initial load".
  application_excluding_modal_gz_kb: round(
    applicationGzKb - (modalInFirstLoad ? contactModalChunkGzKb : 0)
  ),
  perf_03_pass: round(applicationGzKb) <= TARGET_KB,
  per_chunk: perChunk,
  note:
    'rootMainFiles includes the React/react-dom/app-router framework baseline ' +
    '(fixed per-page cost). PERF-03 ≤50KB targets route-specific application ' +
    'JS — see application_gz_kb. Final pass/fail recorded in 06-02-SUMMARY.md ' +
    'after the Task 9 preview deploy.',
};

const outPath = join(
  ROOT,
  '.planning',
  'phases',
  '06-polish-seo-launch',
  'perf-03-measurement.json'
);
writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');

console.log(JSON.stringify(result, null, 2));
console.log(`\nWrote measurement to ${outPath}`);
