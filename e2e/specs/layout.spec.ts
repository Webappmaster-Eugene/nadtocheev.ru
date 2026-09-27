/** Адаптив: 7 ширин x 2 языка - без горизонтального скролла, обрезанного текста и ошибок JS */
import { expect, test } from "@playwright/test";
import { LANGS, collectErrors, scrollThrough } from "../helpers.ts";

const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440];

for (const { lang, path } of LANGS) {
  for (const width of WIDTHS) {
    test.describe(`${lang} ${width}px`, () => {
      test.use({ viewport: { width, height: 800 }, isMobile: width < 768, hasTouch: width < 1024 });

      test("вёрстка не ломается", async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto(path);
        await scrollThrough(page);
        const r = await page.evaluate(() => ({
          docW: document.documentElement.scrollWidth,
          vw: document.documentElement.clientWidth,
          clipped: [...document.querySelectorAll(".card span, .card p, .card a, .card h3, .card h4, .card pre, .card li")]
            .filter((e) => {
              const b = e.getBoundingClientRect();
              const c = e.closest(".card")!.getBoundingClientRect();
              return b.width > 0 && b.right > c.right + 1;
            })
            .map((e) => e.textContent!.trim().slice(0, 40)),
          navOverflow: (() => { const n = document.querySelector("header nav")!; return n.scrollWidth > n.clientWidth + 1; })(),
          anchorsOut: [...document.querySelectorAll(".section-anchor")].filter((a) => { const b = a.getBoundingClientRect(); return b.width > 0 && (b.right > innerWidth || b.left < 0); }).length,
          smallTargets: [...document.querySelectorAll("header a, header button, main a.inline-flex, main button")]
            .filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.width < 24 || b.height < 24); })
            .map((e) => e.getAttribute("aria-label") ?? e.textContent!.trim().slice(0, 30)),
        }));
        expect(r.docW, "горизонтальный скролл").toBeLessThanOrEqual(r.vw);
        expect(r.clipped, "текст вылезает из карточки").toEqual([]);
        expect(r.navOverflow, "шапка не помещается").toBe(false);
        expect(r.anchorsOut, "иконки # за экраном").toBe(0);
        expect(r.smallTargets, "кликабельные элементы меньше 24px (WCAG 2.5.8)").toEqual([]);
        expect(errors).toEqual([]);
      });
    });
  }
}
