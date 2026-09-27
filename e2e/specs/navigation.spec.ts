/** Навигация: меню, якоря, подсветка раздела, язык, skip-link, «наверх», 404 */
import { expect, test } from "@playwright/test";
import { NAV_SECTIONS, collectErrors, sectionTop, waitScrollEnd } from "../helpers.ts";

test.describe("десктоп 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("пункты меню доводят секцию под шапку и подсвечиваются", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    for (const id of NAV_SECTIONS) {
      await page.click(`header a.nav-link[href='#${id}']`);
      await waitScrollEnd(page);
      await expect(page.locator(".nav-link--active"), id).toHaveAttribute("href", `#${id}`);
      await expect(page.locator(".nav-link--active")).toHaveCount(1);
      if (id !== "contacts") expect(Math.abs((await sectionTop(page, id)) - 80), `${id} под шапкой`).toBeLessThanOrEqual(10);
    }
    expect(errors).toEqual([]);
  });

  test("FAQ без пункта меню не сбрасывает подсветку", async ({ page }) => {
    await page.goto("/");
    await page.click("header a.nav-link[href='#services']");
    await waitScrollEnd(page);
    await page.evaluate(() => document.getElementById("faq")!.scrollIntoView());
    await page.waitForTimeout(500);
    await expect(page.locator(".nav-link--active")).toHaveCount(1);
  });

  test("смена языка ведёт на /en/ и сохраняет раздел, обратно - на /", async ({ page }) => {
    await page.goto("/");
    await page.click("header a.nav-link[href='#services']");
    await waitScrollEnd(page);
    await page.click("#lang-switch");
    await expect(page).toHaveURL(/\/en\/#services$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await waitScrollEnd(page);
    expect(Math.abs((await sectionTop(page, "services")) - 80)).toBeLessThanOrEqual(10);
    await page.click("#lang-switch");
    await expect(page).toHaveURL(/\/#services$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  });

  test("из hero язык меняется без якоря", async ({ page }) => {
    await page.goto("/");
    await page.click("#lang-switch");
    await expect(page).toHaveURL(/\/en\/$/);
  });

  test("первый Tab - skip-link, Enter переводит фокус к содержимому", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.locator(".skip-link");
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("кнопка «наверх» появляется после прокрутки и возвращает наверх", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#back-to-top")).not.toHaveClass(/visible/);
    await page.evaluate(() => scrollTo(0, 3000));
    await expect(page.locator("#back-to-top")).toHaveClass(/visible/);
    await page.click("#back-to-top");
    await waitScrollEnd(page);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });

  test("прямой заход по якорю открывает секцию", async ({ page }) => {
    await page.goto("/en/#faq");
    await waitScrollEnd(page);
    await expect(page.locator("#faq h2")).toBeInViewport();
  });
});

test.describe("мобильный 375", () => {
  test.use({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true });

  test("меню: открывается, ведёт к секции и закрывается", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("#mobile-menu-toggle");
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const desktop = await page.locator("header a.nav-link").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    const mobile = await menu.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    for (const href of desktop) expect(mobile, "в мобильном меню есть все разделы").toContain(href);
    await menu.locator("a[href='#services']").click();
    await expect(menu).toBeHidden();
    await waitScrollEnd(page);
    expect(Math.abs((await sectionTop(page, "services")) - 80)).toBeLessThanOrEqual(10);
  });

  test("меню: Esc закрывает и возвращает фокус", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("#mobile-menu-toggle");
    await toggle.click();
    await expect(page.locator("#mobile-menu a").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("меню: фокус зациклен внутри (Tab с последнего пункта - на первый)", async ({ page }) => {
    await page.goto("/");
    await page.locator("#mobile-menu-toggle").click();
    const links = page.locator("#mobile-menu a, #mobile-menu button");
    await links.last().focus();
    await page.keyboard.press("Tab");
    await expect(links.first()).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(links.last()).toBeFocused();
  });

  test("кнопка EN: текст по центру по вертикали", async ({ page }) => {
    await page.goto("/");
    const off = await page.evaluate(() => {
      const a = document.getElementById("lang-switch")!;
      const r = a.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(a);
      const t = range.getBoundingClientRect();
      return Math.round(t.top + t.height / 2 - (r.top + r.height / 2));
    });
    expect(Math.abs(off)).toBeLessThanOrEqual(1);
  });
});

test.describe("404", () => {
  test("несуществующий адрес - своя страница с кодом 404", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Страница не найдена");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  });

  test("ссылки 404 ведут на главную и её разделы", async ({ page }) => {
    await page.goto("/no-such-page");
    await page.click("main a[href='/#services']");
    await expect(page).toHaveURL(/\/#services$/);
    await expect(page.locator("#services")).toBeInViewport();
  });
});
