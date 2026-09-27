/** Доступность: axe-core (WCAG 2.2 AA) на обеих версиях, темах и ширинах + фокус с клавиатуры */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Result } from "axe-core";
import { LANGS, scrollThrough } from "../helpers.ts";

/** Нарушение -> строки «impact id: селектор (сообщение с цветами)» для понятного диффа */
const describe = (violations: Result[]) =>
  violations.flatMap((v) => v.nodes.slice(0, 8).map((n) => `${v.impact} ${v.id}: ${n.target.join(" ")} (${(n.any[0]?.message ?? n.failureSummary ?? "").replace(/\. Expected.*$/, "").slice(0, 140)})`));

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const { lang, path } of LANGS) {
  for (const scheme of ["dark", "light"] as const) {
    for (const width of [375, 1280]) {
      test(`axe: ${lang}, ${scheme}, ${width}px - без нарушений`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
        await page.goto(path);
        await scrollThrough(page);
        const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        expect(describe(violations)).toEqual([]);
      });
    }
  }
}

test("axe: страница 404", async ({ page }) => {
  await page.goto("/no-such-page");
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(describe(violations)).toEqual([]);
});

for (const scheme of ["dark", "light"] as const)
test(`axe: открытое мобильное меню и раскрытый FAQ (${scheme})`, async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
  await page.goto("/");
  await page.click("#mobile-menu-toggle");
  await page.locator("#faq details").first().evaluate((d) => ((d as HTMLDetailsElement).open = true));
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(describe(violations)).toEqual([]);
});

test("фокус с клавиатуры виден на всех интерактивных элементах шапки", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.keyboard.press("Tab"); // skip-link
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, text: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 20), visible: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 || s.boxShadow !== "none" };
    });
    expect(outline.visible, `нет видимого фокуса: ${outline.tag} ${outline.text}`).toBe(true);
  }
});

test("язык страницы и заголовки для скринридера", async ({ page }) => {
  for (const { lang, path } of LANGS) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("header nav")).toHaveAttribute("aria-label", /.+/);
  }
});
