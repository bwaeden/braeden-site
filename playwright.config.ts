import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for braeden-site (Phase 1 — Foundation + Design Tokens).
 *
 * `testDir` is `./tests`; specs are stubbed RED in Wave 0 and turn GREEN as
 * Waves 1–3 land the corresponding source files.
 *
 * `PLAYWRIGHT_BASE_URL` lets W4 point the suite at the live Vercel preview
 * URL; locally it falls back to `http://localhost:3000` once W1 wires up
 * `next start`.
 *
 * Two projects:
 *  - `chromium-mobile` — Pixel 5 viewport, primary quick-run target
 *  - `chromium-desktop` — 1280x800, used by the full-suite command
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  // TODO(W1): enable webServer once `next start` is wired up by W1-T1's
  // create-next-app merge. For now the suite assumes a server is already
  // running on PLAYWRIGHT_BASE_URL (or accepts the resulting connection
  // failures as part of the RED contract in W0).
  // webServer: {
  //   command: 'npm run start',
  //   url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120_000,
  // },
});
