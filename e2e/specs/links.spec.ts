import { expect, test } from "@playwright/test";

for (const path of ["/", "/en/", "/career-consultation/", "/mock-interview/", "/en/career-consultation/", "/en/mock-interview/"]) {
  test(`${path}: visible links can be clicked without overlays`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    // The skip link becomes visible on keyboard focus, then transfers focus to main.
    await page.keyboard.press("Tab");
    const skip = page.locator('a[href="#main-content"]');
    await expect(skip).toBeFocused();
    await skip.click();
    const links = page.locator("a[href]");
    for (let index = 0; index < await links.count(); index++) {
      const link = links.nth(index);
      if (await link.getAttribute("href") === "#main-content") continue;
      if (!await link.isVisible()) continue;
      await link.scrollIntoViewIfNeeded();
      await link.evaluate(element => element.scrollIntoView({ block: "center", inline: "nearest" }));
      const result = await link.evaluate(element => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        // Section permalink icons are intentionally revealed on heading hover.
        if (Number(style.opacity) === 0) return { hidden: true, clickable: true };
        const clickable = [...element.getClientRects()].some(rect => {
          const point = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
          return point !== null && (point === element || element.contains(point));
        });
        return { hidden: false, clickable, pointerEvents: style.pointerEvents, href: element.getAttribute("href") };
      });
      if (!result.hidden) {
        expect(result.pointerEvents, result.href ?? "link").not.toBe("none");
        expect(result.clickable, result.href ?? "link").toBe(true);
      }
    }
  });
}
