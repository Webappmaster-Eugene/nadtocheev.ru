import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { getServicePage, serviceSlugs, servicePath } from "../../src/data/service-pages.ts";
const root = path.resolve(import.meta.dirname, "../../dist");
const site = "https://nadtocheev.ru";
const documents = new Map<string, ReturnType<typeof parse>>();
const html = (route: string) => {
  if (!documents.has(route)) documents.set(route, parse(fs.readFileSync(path.join(root, route, "index.html"), "utf8")));
  return documents.get(route)!;
};

for (const lang of ["ru", "en"] as const) for (const slug of serviceSlugs) {
  const page = getServicePage(slug, lang);
  describe(page.path, () => {
    const doc = html(page.path);
    it("unique title/H1/description, canonical and reciprocal translations", () => {
      expect(doc.querySelectorAll("h1")).toHaveLength(1);
      expect(doc.querySelector("h1")?.textContent).toBe(page.heading);
      expect(doc.querySelector("title")?.textContent).toBe(page.title);
      expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(page.description);
      expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(site + page.path);
      for (const otherLang of ["ru", "en"] as const) expect(doc.querySelector(`link[hreflang="${otherLang}"]`)?.getAttribute("href")).toBe(site + servicePath(slug, otherLang));
    });
    it("Service schema matches the actual price, visible content and breadcrumb", () => {
      const graph = JSON.parse(doc.querySelector('script[type="application/ld+json"]')!.textContent)["@graph"];
      const service = graph.find((entry: any) => entry["@type"] === "Service");
      expect(service.name).toBe(page.service.name);
      expect(service.offers.price).toBe(page.service.price.replace(/\D/g, ""));
      expect(doc.textContent).toContain(page.service.price);
      const breadcrumb = graph.find((entry: any) => entry["@type"] === "BreadcrumbList");
      expect(breadcrumb.itemListElement.map((item: any) => item.name)).toEqual([lang === "ru" ? "Главная" : "Home", page.service.name]);
      expect(doc.querySelectorAll('nav[aria-label] [aria-current="page"]')).toHaveLength(1);
      const faq = graph.find((entry: any) => entry["@type"] === "FAQPage");
      expect(faq.mainEntity.map((item: any) => item.name)).toEqual(doc.querySelectorAll("#faq summary").map(item => item.textContent.trim()));
    });
  });
}

describe("all published pages", () => {
  const routes = ["/", "/en/", ...(["ru", "en"] as const).flatMap(lang => serviceSlugs.map(slug => servicePath(slug, lang)))];
  it("every internal page and fragment exists, every external link has safe attributes", () => {
    for (const route of routes) {
      const doc = html(route);
      const ids = doc.querySelectorAll("[id]").map(item => item.id);
      expect(new Set(ids).size, route).toBe(ids.length);
      for (const link of doc.querySelectorAll("a[href]")) {
        const url = new URL(link.getAttribute("href")!, site + route);
        expect(["https:", "mailto:", "tel:"], url.href).toContain(url.protocol);
        if (url.origin === site) {
          expect(routes, url.href).toContain(url.pathname);
          if (url.hash) expect(html(url.pathname).getElementById(decodeURIComponent(url.hash.slice(1))), url.href).toBeTruthy();
        } else if (url.protocol === "https:") {
          expect(link.getAttribute("target"), url.href).toBe("_blank");
          expect(link.getAttribute("rel"), url.href).toContain("noopener");
        }
      }
    }
  });
});
