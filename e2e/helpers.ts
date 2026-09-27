import type { Page } from "@playwright/test";

export const LANGS = [
  { lang: "ru", path: "/" },
  { lang: "en", path: "/en/" },
] as const;

export const NAV_SECTIONS = ["about", "expertise", "experience", "projects", "ai", "coding", "publications", "mentoring", "services", "contacts"];

/** Ошибки JS и консоли страницы - проверяются в конце теста */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

/** Ждёт окончания плавной прокрутки: scrollY не меняется 500 мс (максимум 8 с) */
export async function waitScrollEnd(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    let last = -1, stable = 0;
    const started = Date.now();
    const tick = () => {
      stable = scrollY === last ? stable + 1 : 0;
      last = scrollY;
      if (stable >= 5 || Date.now() - started > 8000) resolve();
      else setTimeout(tick, 100);
    };
    setTimeout(tick, 100);
  }));
}

/** Прокручивает всю страницу, чтобы сработали reveal-анимации и ленивые скрипты */
export async function scrollThrough(page: Page, step = 400) {
  await page.evaluate(async (s) => {
    for (let y = 0; y < document.body.scrollHeight; y += s) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  }, step);
  await page.waitForTimeout(800);
}

/** Верх секции относительно окна */
export const sectionTop = (page: Page, id: string) =>
  page.evaluate((i) => Math.round(document.getElementById(i)!.getBoundingClientRect().top), id);
