/** Производительность в браузере: CLS при медленных шрифтах, только свои запросы, вес страницы */
import { expect, test } from "@playwright/test";
import { LANGS } from "../helpers.ts";

for (const { lang, path } of LANGS) {
  for (const [width, mobile] of [[1350, false], [375, true]] as const) {
    test(`CLS < 0.005 при шрифтах, пришедших через 1.5 с (${lang}, ${width}px)`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 940 }, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
      await ctx.addInitScript(() => {
        (window as any).__cls = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      const page = await ctx.newPage();
      await page.route(/\/fonts\/inter-.*\.woff2$/, async (r) => { await new Promise((res) => setTimeout(res, 1500)); await r.continue(); });
      await page.goto(path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      const cls = await page.evaluate(() => (window as any).__cls);
      expect(cls).toBeLessThan(0.005);
      await ctx.close();
    });
  }

  test(`${lang}: только запросы к своему домену, вес страницы в бюджете`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const foreign: string[] = [];
    let bytes = 0;
    page.on("request", (r) => { if (!r.url().startsWith(origin) && !r.url().startsWith("data:")) foreign.push(r.url()); });
    page.on("response", async (r) => { bytes += (await r.body().catch(() => Buffer.alloc(0))).length; });
    await page.goto(path, { waitUntil: "networkidle" });
    expect(foreign, "сторонние запросы (трекеры, CDN)").toEqual([]);
    expect(bytes, "вес загрузки без сжатия").toBeLessThan(600 * 1024);
  });

  test(`${lang}: шрифты грузятся по одному разу (preload совпадает с @font-face)`, async ({ page }) => {
    const fonts: string[] = [];
    page.on("request", (r) => { if (r.resourceType() === "font") fonts.push(new URL(r.url()).pathname); });
    await page.goto(path, { waitUntil: "networkidle" });
    expect(fonts).toContain("/fonts/inter-latin-var.woff2");
    expect(fonts.filter((f, i) => fonts.indexOf(f) !== i), "повторная загрузка шрифта").toEqual([]);
    expect(fonts.every((f) => f.startsWith("/fonts/") && f.endsWith(".woff2"))).toBe(true);
    expect(fonts.length, fonts.join(", ")).toBeLessThanOrEqual(4);
  });
}

test("LCP на десктопе < 1.5 с локально", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const lcp = await page.evaluate(() => new Promise<number>((resolve) => {
    new PerformanceObserver((l) => { const e = l.getEntries(); resolve(e[e.length - 1].startTime); }).observe({ type: "largest-contentful-paint", buffered: true });
  }));
  expect(lcp).toBeLessThan(1500);
});
