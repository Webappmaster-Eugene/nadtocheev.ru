/**
 * Готовая сборка dist/ (npm run build:test): то, что реально получают поисковики, AI-агенты и браузер.
 * SEO-теги, JSON-LD против видимого контента, внутренние ссылки и ассеты, sitemap, 404.
 */
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TEST_BUILD_DATE } from "../helpers/env.ts";

vi.stubEnv("SITE_BUILD_DATE", TEST_BUILD_DATE);
const { translations } = await import("../../src/i18n/translations.ts");
const { getFaq } = await import("../../src/data/faq.ts");
const { getExperience } = await import("../../src/data/experience.ts");
const { getServices } = await import("../../src/data/services.ts");
const { getPublications } = await import("../../src/data/publications.ts");
const { personal } = await import("../../src/data/personal.ts");

const DIST = path.resolve(import.meta.dirname, "../../dist");
const SITE = "https://nadtocheev.ru";
const PAGES = [
  { lang: "ru", file: "index.html", url: `${SITE}/` },
  { lang: "en", file: "en/index.html", url: `${SITE}/en/` },
] as const;
const SECTIONS = ["hero", "about", "expertise", "experience", "projects", "ai", "coding", "publications", "mentoring", "services", "faq", "contacts"];

const load = (file: string) => parse(fs.readFileSync(path.join(DIST, file), "utf8"));
const meta = (doc: HTMLElement, sel: string) => doc.querySelector(sel)?.getAttribute("content");
const text = (el: HTMLElement | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
const graphOf = (doc: HTMLElement) => {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  expect(scripts.length).toBe(1);
  return JSON.parse(scripts[0].textContent)["@graph"] as Record<string, any>[];
};
/** Файл в dist для локального пути: /en/ -> en/index.html, /fonts/x.woff2 -> fonts/x.woff2 */
const distFile = (p: string) => {
  const clean = decodeURIComponent(p.split(/[?#]/)[0]);
  const candidates = [clean, path.join(clean, "index.html"), `${clean}.html`];
  return candidates.find((c) => fs.existsSync(path.join(DIST, c)) && fs.statSync(path.join(DIST, c)).isFile());
};

beforeAll(() => {
  if (!fs.existsSync(path.join(DIST, "index.html"))) throw new Error("Нет dist/ - сначала npm run build:test");
  const mod = meta(load("index.html"), 'meta[property="article:modified_time"]') ?? "";
  if (!mod.startsWith(TEST_BUILD_DATE)) throw new Error(`dist/ собран не с SITE_BUILD_DATE=${TEST_BUILD_DATE} (${mod}) - npm run build:test`);
});

describe.each(PAGES)("$file", ({ lang, file, url }) => {
  const doc = load(file);
  const tr = translations[lang];
  const other = PAGES.find((p) => p.lang !== lang)!;

  describe("head и SEO", () => {
    it("lang, title, description из словаря", () => {
      expect(doc.querySelector("html")?.getAttribute("lang")).toBe(tr.meta.htmlLang);
      expect(text(doc.querySelector("title"))).toBe(tr.meta.title);
      expect(meta(doc, 'meta[name="description"]')).toBe(tr.meta.description);
      expect(doc.querySelectorAll("title").length).toBe(1);
      expect(doc.querySelectorAll('meta[name="description"]').length).toBe(1);
    });

    it("индексируется, canonical на себя, viewport, charset", () => {
      expect(meta(doc, 'meta[name="robots"]')).toMatch(/^index, follow/);
      expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(url);
      expect(meta(doc, 'meta[name="viewport"]')).toContain("width=device-width");
      expect(doc.querySelector("meta[charset]")?.getAttribute("charset")?.toLowerCase()).toBe("utf-8");
    });

    it("hreflang: ru, en и x-default ведут на обе версии", () => {
      const alt = Object.fromEntries(doc.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => [l.getAttribute("hreflang"), l.getAttribute("href")]));
      expect(alt).toMatchObject({ ru: `${SITE}/`, en: `${SITE}/en/`, "x-default": `${SITE}/` });
      expect(Object.values(alt)).toContain(url);
      expect(Object.values(alt)).toContain(other.url);
    });

    it("Open Graph и Twitter: абсолютные ссылки, картинка своего языка существует", () => {
      expect(meta(doc, 'meta[property="og:url"]')).toBe(url);
      expect(meta(doc, 'meta[property="og:title"]')).toBe(tr.meta.title);
      expect(meta(doc, 'meta[property="og:description"]')).toBe(tr.meta.description);
      expect(meta(doc, 'meta[property="og:locale"]')).toBe(tr.meta.ogLocale);
      const img = meta(doc, 'meta[property="og:image"]')!;
      expect(img).toBe(`${SITE}/${lang === "en" ? "og-image-en.png" : "og-image.png"}`);
      expect(meta(doc, 'meta[name="twitter:image"]')).toBe(img);
      expect(meta(doc, 'meta[name="twitter:card"]')).toBe("summary_large_image");
      const png = fs.readFileSync(path.join(DIST, new URL(img).pathname));
      expect(png.readUInt32BE(16), "ширина OG").toBe(1200);
      expect(png.readUInt32BE(20), "высота OG").toBe(630);
    });

    it("даты изменения - дата сборки", () => {
      expect(meta(doc, 'meta[property="og:updated_time"]')).toMatch(new RegExp(`^${TEST_BUILD_DATE}`));
    });

    it("шрифты: preload существующих файлов, кириллица только для RU", () => {
      const preloads = doc.querySelectorAll('link[rel="preload"][as="font"]').map((l) => l.getAttribute("href")!);
      for (const p of preloads) expect(distFile(p), p).toBeTruthy();
      expect(preloads.some((p) => p.includes("latin"))).toBe(true);
      expect(preloads.some((p) => p.includes("cyrillic"))).toBe(lang === "ru");
    });

    it("нет внешних скриптов и стилей, CSS инлайнится", () => {
      expect(doc.querySelectorAll("script[src]").length).toBe(0);
      expect(doc.querySelectorAll('link[rel="stylesheet"]').length).toBe(0);
      expect(doc.querySelectorAll("style").length).toBeGreaterThan(0);
    });

    it("размер HTML в бюджете (gzip < 55 KB)", () => {
      const gz = zlib.gzipSync(fs.readFileSync(path.join(DIST, file))).length;
      expect(gz).toBeLessThan(55 * 1024);
    });
  });

  describe("JSON-LD", () => {
    const graph = graphOf(doc);
    const byType = (t: string) => graph.filter((n) => n["@type"] === t);

    it("ровно разрешённые типы, без удалённых ProfessionalService/Course/Article/SearchAction", () => {
      expect(graph.map((n) => n["@type"]).sort()).toEqual(
        ["BreadcrumbList", "FAQPage", "Organization", "Person", "ProfilePage", "Service", "Service", "SoftwareApplication", "SoftwareApplication", "WebSite"].sort(),
      );
      const json = JSON.stringify(graph);
      expect(json).not.toMatch(/ProfessionalService|SearchAction|"Course"|"Article"|estimatedSalary|priceRange|easyoffer/i);
    });

    it("@id уникальны, ссылки внутри графа разрешаются", () => {
      const ids = graph.map((n) => n["@id"]).filter(Boolean);
      expect(new Set(ids).size).toBe(ids.length);
      const refs = [...JSON.stringify(graph).matchAll(/\{"@id":"([^"]+)"\}/g)].map((m) => m[1]);
      for (const r of refs) expect(ids, r).toContain(r);
    });

    it("Person: имя, контакты, sameAs только https без дублей", () => {
      const [p] = byType("Person");
      expect(p.name).toBe(personal.name.full[lang]);
      expect(p.email).toBe(`mailto:${personal.email}`);
      expect(p.telephone).toBe(personal.phone);
      expect(p.description).toBe(tr.meta.description);
      expect(new Set(p.sameAs).size).toBe(p.sameAs.length);
      for (const s of p.sameAs) expect(s).toMatch(/^https:\/\//);
      expect(p.sameAs).toContain(personal.github);
    });

    it("ProfilePage: dateModified = дата сборки, url = canonical", () => {
      const [pp] = byType("ProfilePage");
      expect(pp.url).toBe(url);
      expect(pp.dateModified).toMatch(new RegExp(`^${TEST_BUILD_DATE}`));
    });

    it("Service: цены совпадают с разделом «Услуги»", () => {
      const prices = byType("Service").map((s) => String(s.offers?.price ?? s.offers?.[0]?.price));
      const expected = getServices(lang).items.map((s) => s.price.replace(/\D/g, ""));
      expect(prices.sort()).toEqual(expected.sort());
    });

    it("FAQPage совпадает с данными и с видимым FAQ дословно", () => {
      const [faq] = byType("FAQPage");
      const ld = faq.mainEntity.map((q: any) => ({ q: q.name, a: q.acceptedAnswer.text }));
      expect(ld).toEqual(getFaq(lang));
      // Ссылки в видимом ответе показаны без https:// и с пометкой для скринридера - сравниваем по href
      const answer = (d: HTMLElement) => {
        const el = parse(d.querySelector("summary")!.nextElementSibling!.toString());
        el.querySelectorAll(".sr-only").forEach((x) => x.remove());
        el.querySelectorAll("a").forEach((a) => a.replaceWith(a.getAttribute("href")!));
        return text(el);
      };
      const visible = doc.querySelectorAll("#faq details").map((d) => ({ q: text(d.querySelector("summary")), a: answer(d) }));
      expect(visible.map((v) => v.q)).toEqual(ld.map((x: any) => x.q));
      expect(visible.map((v) => v.a)).toEqual(ld.map((x: any) => x.a.replace(/\s+/g, " ")));
    });

    it("BreadcrumbList ведёт на существующие секции", () => {
      const [bc] = byType("BreadcrumbList");
      for (const item of bc.itemListElement.slice(1)) {
        const id = new URL(item.item).hash.slice(1);
        expect(doc.getElementById(id), id).toBeTruthy();
      }
    });
  });

  describe("структура и контент", () => {
    it("секции в ожидаемом порядке", () => {
      const ids = doc.querySelectorAll("main section[id]").map((s) => s.id);
      expect(ids).toEqual(SECTIONS);
    });

    it("один h1 с именем, у каждой секции (кроме hero) есть h2", () => {
      const h1 = doc.querySelectorAll("h1");
      expect(h1.length).toBe(1);
      expect(text(h1[0])).toContain(personal.name.last[lang]);
      for (const id of SECTIONS.filter((s) => s !== "hero")) {
        expect(doc.querySelector(`#${id} h2`), id).toBeTruthy();
      }
    });

    it("уровни заголовков не перескакивают (h2 -> h4)", () => {
      const levels = doc.querySelectorAll("h1, h2, h3, h4, h5, h6").map((h) => Number(h.tagName[1]));
      for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `заголовок №${i}`).toBeLessThanOrEqual(1);
    });

    it("id уникальны", () => {
      const ids = doc.querySelectorAll("[id]").map((e) => e.id);
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    });

    it("в видимом тексте нет артефактов шаблонов", () => {
      const body = text(doc.querySelector("body"));
      expect(body).not.toMatch(/\bundefined\b|\bNaN\b|\[object |\{\{|\$\{/);
    });

    it("опыт: длительности посчитаны на дату сборки и выведены", () => {
      const body = text(doc.querySelector("#experience"));
      for (const e of getExperience(lang)) expect(body, e.company).toContain(e.duration);
    });

    it("услуги, статьи и контакты выведены", () => {
      for (const s of getServices(lang).items) expect(text(doc.querySelector("#services"))).toContain(s.price);
      for (const a of getPublications(lang).articles) expect(doc.querySelector(`#publications a[href="${a.url}"]`), a.url).toBeTruthy();
      const contacts = doc.querySelector("#contacts")!;
      expect(contacts.querySelector(`a[href="${personal.telegram}"]`)).toBeTruthy();
      expect(contacts.querySelector(`a[href="mailto:${personal.email}"]`)).toBeTruthy();
      expect(contacts.querySelector(`a[href^="tel:"]`)?.getAttribute("href")).toBe(`tel:${personal.phone.replace(/[^\d+]/g, "")}`);
    });

    it("год в футере = год сборки", () => {
      expect(text(doc.querySelector("footer"))).toContain(`© ${TEST_BUILD_DATE.slice(0, 4)}`);
    });
  });

  describe("ссылки и ассеты", () => {
    const links = doc.querySelectorAll("a[href]").map((a) => ({ href: a.getAttribute("href")!, a }));

    it("якоря # ведут на существующие id", () => {
      for (const { href } of links.filter((l) => l.href.startsWith("#"))) {
        expect(doc.getElementById(href.slice(1)), href).toBeTruthy();
      }
    });

    it("внутренние ссылки и ресурсы есть в dist", () => {
      const refs = [
        ...links.map((l) => l.href),
        ...doc.querySelectorAll("[src]").map((e) => e.getAttribute("src")!),
        ...doc.querySelectorAll("link[href]").map((e) => e.getAttribute("href")!),
      ].filter((h) => h.startsWith("/") && !h.startsWith("//"));
      expect(refs.length).toBeGreaterThan(5);
      for (const r of refs) expect(distFile(r), r).toBeTruthy();
    });

    it("внешние ссылки: https, target=_blank c noopener", () => {
      for (const { href, a } of links.filter((l) => /^https?:/.test(l.href))) {
        expect(href, "http без TLS").toMatch(/^https:/);
        if (new URL(href).hostname === "nadtocheev.ru") continue;
        expect(a.getAttribute("target"), href).toBe("_blank");
        expect(a.getAttribute("rel") ?? "", href).toContain("noopener");
      }
    });

    it("у картинок есть alt, у ссылок-иконок - доступное имя", () => {
      for (const img of doc.querySelectorAll("img")) expect(img.hasAttribute("alt"), img.getAttribute("src")!).toBe(true);
      for (const { href, a } of links) {
        const name = text(a) || a.getAttribute("aria-label") || a.querySelector("[aria-label]")?.getAttribute("aria-label") || a.getAttribute("title");
        expect(name, href).toBeTruthy();
      }
    });

    it("переключатель языка ведёт на другую версию", () => {
      expect(doc.getElementById("lang-switch")?.getAttribute("href")).toBe(new URL(other.url).pathname);
    });
  });
});

describe("404.html", () => {
  const doc = load("404.html");
  it("noindex, без canonical/hreflang/JSON-LD", () => {
    expect(meta(doc, 'meta[name="robots"]')).toBe("noindex, follow");
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
    expect(doc.querySelectorAll("link[hreflang]").length).toBe(0);
    expect(doc.querySelectorAll('script[type="application/ld+json"]').length).toBe(0);
  });
  it("ведёт на главную", () => {
    expect(doc.querySelector('a[href="/"]')).toBeTruthy();
  });
});

describe("sitemap и robots", () => {
  const index = fs.readFileSync(path.join(DIST, "sitemap-index.xml"), "utf8");
  const map = fs.readFileSync(path.join(DIST, "sitemap-0.xml"), "utf8");
  const robots = fs.readFileSync(path.join(DIST, "robots.txt"), "utf8");

  it("sitemap-index ссылается на sitemap-0", () => {
    expect(index).toContain(`<loc>${SITE}/sitemap-0.xml</loc>`);
  });

  it("в sitemap ровно / и /en/, без 404", () => {
    const locs = [...map.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.sort()).toEqual([`${SITE}/`, `${SITE}/en/`]);
    expect(map).not.toContain("404");
  });

  it("lastmod = дата сборки, hreflang-альтернативы", () => {
    const lastmods = [...map.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    expect(lastmods.length).toBe(2);
    for (const l of lastmods) expect(l).toMatch(new RegExp(`^${TEST_BUILD_DATE}`));
    expect(map).toContain(`hreflang="en" href="${SITE}/en/"`);
    expect(map).toContain(`hreflang="ru" href="${SITE}/"`);
  });

  it("robots: sitemap, нет устаревших Host/Crawl-delay, у поисковиков свои Disallow utm", () => {
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
    expect(robots).not.toMatch(/^(Host|Crawl-delay):/im);
    const group = (bot: string) => robots.split(/\n(?=User-agent:)/).find((g) => g.startsWith(`User-agent: ${bot}\n`));
    for (const bot of ["*", "Googlebot", "Bingbot"]) expect(group(bot), bot).toContain("Disallow: /*?*utm_");
    // Яндекс склеивает UTM-дубли через Clean-param
    for (const bot of ["Yandex", "YandexBot"]) expect(group(bot), bot).toMatch(/Clean-param: utm_source.*utm_campaign/);
    expect(robots).not.toMatch(/Disallow: \/\s*$/m);
  });

  it("webmanifest: валидный JSON, иконки существуют", () => {
    const m = JSON.parse(fs.readFileSync(path.join(DIST, "site.webmanifest"), "utf8"));
    expect(m.name).toBeTruthy();
    for (const i of m.icons) expect(distFile(i.src), i.src).toBeTruthy();
  });
});
