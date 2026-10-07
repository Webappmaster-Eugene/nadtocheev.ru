/**
 * llms.txt / llms-full.txt - статические файлы для AI-агентов. Их пишут руками,
 * поэтому тест сверяет их с данными сайта: при правке контента падает, пока файлы не обновлены.
 */
import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { markdownLinks } from "../helpers/strings.ts";

vi.stubEnv("SITE_BUILD_DATE", process.env.SITE_BUILD_DATE ?? new Date().toISOString().slice(0, 10));

const { personal } = await import("../../src/data/personal.ts");
const { getExperience } = await import("../../src/data/experience.ts");
const { getStartups } = await import("../../src/data/projects.ts");
const { getServices } = await import("../../src/data/services.ts");
const { getPublications } = await import("../../src/data/publications.ts");
const { getMentoring } = await import("../../src/data/mentoring.ts");
const { experienceYears } = await import("../../src/data/career.ts");

const read = (f: string) => fs.readFileSync(new URL(`../../public/${f}`, import.meta.url), "utf8");
const FILES = { "llms.txt": read("llms.txt"), "llms-full.txt": read("llms-full.txt") };
const norm = (u: string) => u.replace(/\/$/, "");

describe.each(Object.entries(FILES))("%s", (name, text) => {
  it("формат llmstxt.org: H1, цитата-summary, разделы H2", () => {
    expect(text).toMatch(/^# .+\n\n> .+/);
    expect(text.match(/^## /gm)?.length ?? 0).toBeGreaterThanOrEqual(5);
  });

  it("стаж совпадает с текущим (career.ts)", () => {
    const stated = [...text.matchAll(/(\d+)\+? years of commercial/g)].map((m) => Number(m[1]));
    expect(stated.length).toBeGreaterThan(0);
    for (const y of stated) expect(y, "обнови стаж в llms*.txt").toBe(experienceYears);
  });

  it("длительности завершённых мест работы совпадают с сайтом", () => {
    for (const e of getExperience("en").filter((x) => x.end)) {
      expect(text, e.company).toContain(e.duration);
    }
  });

  it("цены услуг совпадают с сайтом", () => {
    for (const s of getServices("en").items) {
      const rub = s.price.replace(/\s*₽$/, " RUB");
      expect(text, s.name).toContain(rub);
    }
  });

  it("контакты совпадают с personal", () => {
    for (const v of [personal.email, personal.phone, personal.telegram, personal.github, personal.habr, personal.freelance.vsesdal]) {
      expect(text).toContain(v);
    }
  });

  it("статьи - те же ссылки и названия, что на сайте", () => {
    for (const a of getPublications("ru").articles) {
      expect(text, a.url).toContain(a.url);
      expect(text, a.title).toContain(a.title);
    }
  });

  it("стартапы и менторские площадки - те же адреса", () => {
    const urls = [...getStartups("en").map((s) => s.url), ...getMentoring("en").platforms.map((p) => p.url)];
    for (const u of urls) expect(text, u).toContain(norm(u));
  });

  it.runIf(name === "llms.txt")("ссылки в формате markdown [title](url), https", () => {
    const links = markdownLinks(text);
    expect(links.length).toBeGreaterThan(10);
    for (const l of links) {
      expect(l.url, l.title).toMatch(/^https:\/\//);
      expect(() => new URL(l.url)).not.toThrow();
    }
  });

  it("ссылки на сам сайт указывают на существующие страницы и файлы", () => {
    const own = [...text.matchAll(/https:\/\/nadtocheev\.ru(\/[^\s)#]*)?/g)].map((m) => m[1] ?? "/");
    const GENERATED = ["/", "/en/", "/career-consultation/", "/mock-interview/", "/en/career-consultation/", "/en/mock-interview/", "/sitemap-index.xml", "/sitemap-0.xml"];
    const exists = (p: string) => GENERATED.includes(p) || fs.existsSync(new URL(`../../public${p}`, import.meta.url));
    for (const p of own) expect(exists(p), p).toBe(true);
  });

  it("нет убранных фактов (EasyOffer, зарплата, PreOffer)", () => {
    expect(text).not.toMatch(/easyoffer|salary|280[ ,]?000|pre[\s-]?offer|ambassador/i);
  });
});
