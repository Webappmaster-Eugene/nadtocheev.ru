/**
 * Скриншотные тесты: каждая секция на 375 и 1440, RU/EN, тёмная/светлая тема, меню, 404.
 * Эталоны - Linux (Docker-образ Playwright той же версии, что в package.json):
 *   npm run test:visual           - сравнить
 *   npm run test:visual:update    - обновить эталоны после намеренной правки дизайна
 * Детерминизм: фиксированная дата сборки (build:test), reduced motion, отключённые анимации,
 * дождались шрифтов, скрыты плавающие элементы.
 */
import { expect, test, type Page } from "@playwright/test";
import { LANGS } from "../helpers.ts";
import { servicePath, serviceSlugs } from "../../src/data/service-pages.ts";

// Много крупных скриншотов в одном тесте: под нагрузкой CI каждый может занимать секунды
test.describe.configure({ timeout: 180_000 });

test.skip(process.platform !== "linux" && !process.env.VISUAL_ANY_OS, "эталоны сняты в Linux - запускай npm run test:visual (Docker)");

const SECTIONS = ["hero", "about", "expertise", "experience", "projects", "ai", "coding", "publications", "mentoring", "services", "faq", "contacts"];
/** Плавающие элементы перекрывают секции при скриншоте элемента */
const HIDE_FLOATING = "header, #back-to-top, #scroll-progress { visibility: hidden !important; }";

const MATRIX = [
  ...LANGS.flatMap(({ lang, path }) => [375, 1440].map((width) => ({ lang, path, width, scheme: "dark" as const }))),
  ...[375, 1440].map((width) => ({ lang: "ru", path: "/", width, scheme: "light" as const })),
];

async function open(page: Page, path: string, width: number, scheme: "dark" | "light", hideFloating = false) {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (hideFloating) await page.addStyleTag({ content: HIDE_FLOATING });
}

for (const { lang, path, width, scheme } of MATRIX) {
  test(`секции ${lang} ${scheme} ${width}`, async ({ page }) => {
    await open(page, path, width, scheme, true);
    for (const id of SECTIONS) {
      await expect.soft(page.locator(`#${id}`), id).toHaveScreenshot(`${lang}-${scheme}-${width}-${id}.png`);
    }
    await expect.soft(page.locator("footer")).toHaveScreenshot(`${lang}-${scheme}-${width}-footer.png`);
  });

  test(`шапка ${lang} ${scheme} ${width}`, async ({ page }) => {
    await open(page, path, width, scheme);
    await expect(page.locator("header")).toHaveScreenshot(`${lang}-${scheme}-${width}-header.png`);
  });
}

test("мобильное меню открыто", async ({ page }) => {
  await open(page, "/", 375, "dark");
  await page.click("#mobile-menu-toggle");
  await expect(page).toHaveScreenshot("ru-dark-375-menu.png");
});

test("мобильный опыт работы раскрыт", async ({ page }) => {
  await open(page, "/", 375, "dark", true);
  await page.locator("#experience article").first().locator(".exp-toggle").click();
  await expect(page.locator("#experience article").first()).toHaveScreenshot("ru-dark-375-experience-expanded.png");
});

test("FAQ: вопрос раскрыт", async ({ page }) => {
  await open(page, "/", 1440, "dark", true);
  await page.locator("#faq summary").first().click();
  await expect(page.locator("#faq details").first()).toHaveScreenshot("ru-dark-1440-faq-open.png");
});

for (const width of [375, 1440]) {
  test(`404 ${width}`, async ({ page }) => {
    await open(page, "/no-such-page", width, "dark");
    await expect(page).toHaveScreenshot(`404-dark-${width}.png`);
  });
}

for (const lang of ["ru", "en"] as const) for (const slug of serviceSlugs) for (const width of [375, 1440]) {
  test(`услуга ${slug} ${lang} ${width}`, async ({ page }) => {
    await open(page, servicePath(slug, lang), width, width === 375 ? "dark" : "light", true);
    await expect(page.locator("#main-content")).toHaveScreenshot(`${lang}-${width}-${slug}.png`);
  });
}
