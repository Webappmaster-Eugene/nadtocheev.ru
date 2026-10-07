import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { serviceSlugs, servicePath } from "../../src/data/service-pages.ts";

for (const lang of ["ru", "en"] as const) for (const slug of serviceSlugs) {
  for (const width of [320, 1440]) {
    test(`${lang} ${slug} ${width}: readable, accessible and all navigation works`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: width === 320 ? "dark" : "light", reducedMotion: "reduce" });
      await page.goto(servicePath(slug, lang));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('[aria-current="page"]')).toBeVisible();
      await expect(page.locator("#lang-switch")).toHaveAttribute("href", servicePath(slug, lang === "ru" ? "en" : "ru"));
      const links = await page.locator('a[href^="https://t.me/"]').count();
      expect(links).toBeGreaterThan(0);
      await page.locator("#faq").scrollIntoViewIfNeeded();
      await page.locator("#faq summary").first().click();
      await expect(page.locator("#faq details").first()).toHaveAttribute("open", "");
      const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(audit.violations).toEqual([]);
      await page.locator("#lang-switch").click();
      await expect(page).toHaveURL(new RegExp(servicePath(slug, lang === "ru" ? "en" : "ru")));
    });
  }
}

test("service pages work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.goto("/career-consultation/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('#mentor a[href="/#experience"]')).toBeVisible();
  await page.locator('#mentor a[href="/#experience"]').click();
  await expect(page).toHaveURL(/\/#experience$/);
  await context.close();
});
