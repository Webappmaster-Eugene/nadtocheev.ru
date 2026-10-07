/** Интерактив: тема, счётчики, печать кода, таймлайн, FAQ, сворачивание опыта, стартапы */
import { expect, test } from "@playwright/test";
import { collectErrors, scrollThrough } from "../helpers.ts";

test.describe("тема", () => {
  for (const scheme of ["dark", "light"] as const) {
    test(`первый визит следует системной теме (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      await expect(page.locator("html")).toHaveClass(scheme === "light" ? /\blight\b/ : /^(?!.*\blight\b)/);
      await expect(page.locator("#meta-theme-color")).toHaveAttribute("content", scheme === "light" ? "#f8fafc" : "#0a0a0b");
    });
  }

  test("переключается, сохраняется после перезагрузки и перекрывает системную", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveClass(/\blight\b/);
    await expect(page.locator("#meta-theme-color")).toHaveAttribute("content", "#f8fafc");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\blight\b/);
    await page.goto("/en/");
    await expect(page.locator("html"), "тема общая для языков").toHaveClass(/\blight\b/);
    await page.click("#theme-toggle");
    await expect(page.locator("html")).not.toHaveClass(/\blight\b/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  });

  test("без сохранённой темы следует за сменой системной на лету", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveClass(/\blight\b/);
  });

  test("кнопка темы имеет доступное имя", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#theme-toggle")).toHaveAttribute("aria-label", /.+/);
  });
});

test.describe("анимации и скрипты", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("счётчики во всех секциях доходят до значений data-target", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    await page.waitForTimeout(1800);
    const counters = await page.$$eval(".counter[data-target]", (els) => els.map((e) => [e.textContent, e.getAttribute("data-target")]));
    expect(counters.length).toBeGreaterThanOrEqual(10);
    for (const [text, target] of counters) expect(text).toBe(target);
  });

  test("счётчики действительно анимируются: стартуют с 0 и растут", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__counterValues = {};
      new MutationObserver((records) => {
        for (const r of records) {
          const el = (r.target.nodeType === 3 ? r.target.parentElement : r.target) as HTMLElement;
          if (!el?.classList?.contains("counter")) continue;
          const key = el.getAttribute("data-target")!;
          ((window as any).__counterValues[key] ??= []).push(el.textContent);
        }
      }).observe(document, { subtree: true, childList: true, characterData: true });
    });
    await page.goto("/");
    await scrollThrough(page);
    await page.waitForTimeout(1800);
    const seen: Record<string, string[]> = await page.evaluate(() => (window as any).__counterValues);
    const numeric = await page.$$eval(".counter[data-target]", (els) => els.map((e) => e.getAttribute("data-target")!).filter((t) => /^\d/.test(t) && parseInt(t) > 1));
    for (const target of numeric) {
      // первые записи - вставка текста парсером; анимация начинается со сброса в 0
      const values = seen[target] ?? [];
      const start = values.findIndex((v) => /^0/.test(v));
      expect(start, `${target} стартует с 0: ${values.join(",")}`).toBeGreaterThanOrEqual(0);
      expect(values.length - start, `${target}: промежуточные значения`).toBeGreaterThan(2);
      expect(values.at(-1)).toBe(target);
    }
  });

  test("AI: код печатается и допечатывается целиком, высота блока не меняется", async ({ page, browser }) => {
    // Полный текст кода - как в HTML без JS
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const ref = await noJs.newPage();
    await ref.goto("/");
    const expected = (await ref.locator("#ai-code-block").textContent())!;
    await noJs.close();
    expect(expected.length).toBeGreaterThan(200);

    await page.goto("/");
    const block = page.locator("#ai-code-block");
    await block.evaluate((e) => e.closest(".rounded-xl")!.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(500);
    const early = (await block.textContent())!.length;
    const box = () => block.evaluate((e) => e.closest("pre")!.getBoundingClientRect().height);
    const h0 = await box();
    expect(early).toBeLessThan(expected.length);
    await expect(block).toHaveText(expected, { timeout: 20_000, useInnerText: false });
    const h1 = await box();
    expect(expected).toContain("cosineDistance");
    expect(expected).toContain("reply.sse");
    expect(Math.abs(h1 - h0), "блок кода растёт при печати (CLS)").toBeLessThanOrEqual(1);
  });

  test("таймлайн опыта растёт при прокрутке", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.getElementById("experience")!.scrollIntoView());
    const h0 = await page.$eval("#timeline-line", (e) => parseFloat((e as HTMLElement).style.height) || 0);
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(150); }
    const h1 = await page.$eval("#timeline-line", (e) => parseFloat((e as HTMLElement).style.height));
    expect(h1).toBeGreaterThan(h0);
    expect(h1).toBeGreaterThan(50);
  });

  test("reveal: секции проявляются при прокрутке", async ({ page }) => {
    await page.goto("/");
    const reveal = page.locator("#contacts .reveal").first();
    await expect(reveal).not.toHaveClass(/visible/);
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveClass(/visible/);
    await expect.poll(() => reveal.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  });
});

test.describe("FAQ", () => {
  test("вопросы раскрываются и сворачиваются, ссылки в ответах кликабельны", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/#faq");
    const items = page.locator("#faq details");
    expect(await items.count()).toBeGreaterThanOrEqual(8);
    for (const i of [0, 4]) {
      const d = items.nth(i);
      await d.locator("summary").click();
      await expect(d).toHaveAttribute("open", "");
      await expect(d.locator("summary + *")).toBeVisible();
    }
    const contacts = items.filter({ has: page.locator('a[href="https://t.me/eugene_nadtocheev"]') });
    await expect(contacts).toHaveCount(1);
    const link = contacts.locator('a[href="https://t.me/eugene_nadtocheev"]');
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await items.nth(0).locator("summary").click();
    await expect(items.nth(0)).not.toHaveAttribute("open", "");
    expect(errors).toEqual([]);
  });

  test("раскрывается с клавиатуры", async ({ page }) => {
    await page.goto("/#faq");
    const d = page.locator("#faq details").first();
    await d.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(d).toHaveAttribute("open", "");
  });
});

test.describe("опыт работы на мобильном", () => {
  test.use({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true });

  test("длинные пункты свёрнуты, «Показать больше» раскрывает и сворачивает", async ({ page }) => {
    await page.goto("/");
    const art = page.locator("#experience article").first();
    const btn = art.locator(".exp-toggle");
    const hidden = () => art.evaluate((a) => [...a.querySelectorAll(".exp-extra")].filter((e) => getComputedStyle(e).display === "none").length);
    expect(await hidden()).toBeGreaterThan(0);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    const controls = (await btn.getAttribute("aria-controls"))!.split(/\s+/);
    expect(controls.length).toBeGreaterThan(0);
    for (const id of controls) await expect(page.locator(`#${id}`), `aria-controls -> #${id}`).toHaveCount(1);
    const label = await btn.textContent();
    await btn.click();
    expect(await hidden()).toBe(0);
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(await btn.textContent()).not.toBe(label);
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(await hidden()).toBeGreaterThan(0);
  });
});

test.describe("опыт работы на десктопе", () => {
  test.use({ viewport: { width: 1280, height: 900 } });
  test("всё раскрыто, кнопок нет", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".exp-toggle:visible")).toHaveCount(0);
    const hidden = await page.$$eval("#experience .exp-extra", (els) => els.filter((e) => getComputedStyle(e).display === "none").length);
    expect(hidden).toBe(0);
  });
});

test.describe("контент разделов", () => {
  test("собственные продукты - в «Проектах», не в «Менторстве»", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#projects a[href*='podbor-minuta'], #projects a[href*='hhos.ru']")).toHaveCount(2);
    await expect(page.locator("#mentoring a[href*='podbor-minuta.ru'], #mentoring a[href*='hhos.ru'], #mentoring a[href*='webappmaster.ru']")).toHaveCount(0);
  });

  test("CTA услуг ведут в Telegram", async ({ page }) => {
    await page.goto("/");
    const ctas = page.locator("#services a[href^='https://t.me/']");
    expect(await ctas.count()).toBeGreaterThanOrEqual(2);
  });

  test("все target=_blank с noopener", async ({ page }) => {
    await page.goto("/");
    const bad = await page.$$eval("a[target=_blank]", (as) => as.filter((a) => !(a as HTMLAnchorElement).rel.includes("noopener")).map((a) => a.getAttribute("href")));
    expect(bad).toEqual([]);
  });
});

test.describe("без JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });

  test("весь контент виден", async ({ page }) => {
    await page.goto("/");
    const r = await page.evaluate(() => ({
      hidden: [...document.querySelectorAll(".reveal, .stagger-children > *")].filter((e) => getComputedStyle(e).opacity !== "1").length,
      cover: getComputedStyle(document.querySelector("#about .section-title-reveal")!, "::after").content,
      line: document.getElementById("timeline-line")!.getBoundingClientRect().height,
      code: document.getElementById("ai-code-block")!.textContent!.length,
      counters: [...document.querySelectorAll(".counter[data-target]")].every((e) => e.textContent === e.getAttribute("data-target")),
    }));
    expect(r.hidden, "элементы reveal скрыты без JS").toBe(0);
    expect(["none", "normal"]).toContain(r.cover);
    expect(r.line).toBeGreaterThan(500);
    expect(r.code, "код AI-секции пуст без JS").toBeGreaterThan(100);
    expect(r.counters).toBe(true);
  });

  test("мобильный: опыт работы не свёрнут (кнопка без JS не работает)", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 800 }, isMobile: true });
    const page = await ctx.newPage();
    await page.goto("/");
    const hidden = await page.$$eval("#experience .exp-extra", (els) => els.filter((e) => getComputedStyle(e).display === "none").length);
    expect(hidden).toBe(0);
    await expect(page.locator(".exp-toggle:visible")).toHaveCount(0);
    await ctx.close();
  });
});

test.describe("prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("контент виден сразу, код показан без печати, счётчики без анимации", async ({ page }) => {
    await page.goto("/");
    const r = await page.evaluate(() => ({
      reveal: getComputedStyle(document.querySelector("#contacts .reveal")!).opacity,
      code: document.getElementById("ai-code-block")!.textContent!.length,
      counters: [...document.querySelectorAll(".counter[data-target]")].every((e) => e.textContent === e.getAttribute("data-target")),
    }));
    expect(r.reveal).toBe("1");
    expect(r.code).toBeGreaterThan(200);
    expect(r.code === (await page.evaluate(() => document.getElementById("ai-code-block")!.textContent!.length))).toBe(true);
    expect(r.counters).toBe(true);
  });
});
