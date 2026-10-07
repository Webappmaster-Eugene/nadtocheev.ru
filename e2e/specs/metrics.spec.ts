import fs from "node:fs";
import { expect, test } from "@playwright/test";
const source = fs.readFileSync(new URL("../../src/scripts/metrics.js", import.meta.url), "utf8");
const config = { googleId: "G-TEST123", yandexId: "12345678", debug: true };

test("telemetry measures real Web Vitals, sanitizes URLs and tracks contact intent", async ({ page }) => {
  const requests: string[] = [];
  await page.route(/https:\/\/(www.googletagmanager.com|mc.yandex.ru)\//, async route => {
    requests.push(route.request().url());
    await route.fulfill({ contentType: "text/javascript", body: "" });
  });
  await page.goto("/?utm_source=check&private_test_value=never-send#contacts");
  // Use the official self-hosted library built by Astro, rather than a mocked metric implementation.
  const files = fs.readdirSync(new URL("../../dist/_astro/", import.meta.url));
  const library = files.find(file => file.startsWith("web-vitals.") && file.endsWith(".js"));
  expect(library).toBeTruthy();
  await page.addScriptTag({ content: `(() => { const config = ${JSON.stringify(config)}; const webVitalsURL = '/_astro/${library}'; ${source}\n})();` });
  await expect.poll(() => page.evaluate(() => (window as any).__siteVitals?.TTFB?.metric_value)).toBeGreaterThanOrEqual(0);
  // Stop navigation in the test while exercising the actual delegated click handler.
  await page.evaluate(() => document.addEventListener("click", event => { if ((event.target as Element)?.closest('a[href^="https://t.me/"]')) event.preventDefault(); }));
  await page.locator('#contacts a[href="https://t.me/eugene_nadtocheev"]').click();
  await page.locator('#services a[data-track="book_consultation"]').click();
  const payload = await page.evaluate(() => JSON.stringify({ google: (window as any).dataLayer.map((args: IArguments) => Array.from(args)), yandex: (window as any).ym.a.map((args: IArguments) => Array.from(args)) }));
  expect(payload).toContain("web_vitals");
  expect(payload).toContain("contact_telegram");
  expect(payload).toContain("book_consultation");
  expect(payload).not.toContain("never-send");
  expect(payload).not.toContain("utm_source");
  expect(payload).not.toContain("#contacts");
  expect(requests.some(url => url.includes("googletagmanager"))).toBe(true);
});

test("Do Not Track disables all telemetry even with configured IDs", async ({ page, baseURL }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "doNotTrack", { get: () => "1" }));
  const origin = new URL(baseURL!).origin;
  const requests: string[] = [];
  page.on("request", request => {
    const url = new URL(request.url());
    if (/^https?:$/.test(url.protocol) && url.origin !== origin) requests.push(request.url());
  });
  await page.goto("/");
  await page.addScriptTag({ content: `(() => { const config = ${JSON.stringify(config)}; const webVitalsURL = '/should-never-load.js'; ${source}\n})();` });
  expect(await page.evaluate(() => (window as any).__siteMetricsStarted)).toBeUndefined();
  expect(requests).toEqual([]);
});
