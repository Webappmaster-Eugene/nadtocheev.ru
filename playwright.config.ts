import { defineConfig, devices } from "@playwright/test";

/**
 * e2e     - сценарии, адаптив, доступность (axe), CLS: e2e/specs
 * visual  - скриншотные тесты: e2e/visual. Эталоны сняты в Linux (Docker-образ Playwright),
 *           локально запускать через npm run test:visual / test:visual:update
 * Сайт: dist/ через scripts/static-server.mjs (npm run build:test заранее)
 * или внешний адрес E2E_BASE_URL (локальный nginx, прод).
 */
const PORT = Number(process.env.E2E_PORT ?? 4400);
const external = process.env.E2E_BASE_URL;
/** Вне Linux/CI e2e идёт в установленном Chrome (скачивание Chromium не обязательно) */
const localChrome = !process.env.CI && process.platform !== "linux" ? { channel: "chrome" } : {};

export default defineConfig({
  testDir: "e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { animations: "disabled", caret: "hide", scale: "css", maxDiffPixelRatio: 0.002 },
  },
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  use: {
    baseURL: external ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: external
    ? undefined
    : { command: `node scripts/static-server.mjs ${PORT}`, url: `http://localhost:${PORT}/`, reuseExistingServer: !process.env.CI },
  projects: [
    { name: "e2e", testDir: "e2e/specs", use: { ...devices["Desktop Chrome"], ...localChrome } },
    {
      name: "visual",
      testDir: "e2e/visual",
      use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" },
      expect: { timeout: 20_000, toHaveScreenshot: { animations: "disabled", caret: "hide", scale: "css", maxDiffPixelRatio: 0.002 } },
    },
  ],
});
