/**
 * Поведение продового nginx: коды ответов, редиректы, 404, security-заголовки, кэш, gzip.
 * Запуск против прода: NGINX_URL=https://nadtocheev.ru npm run test:nginx
 */
import { describe, expect, inject, it } from "vitest";

const BASE = inject("baseURL");
const EXTERNAL = inject("external");

const get = (p: string, init: RequestInit = {}) => fetch(BASE + p, { redirect: "manual", ...init });

const SECURITY = {
  "x-frame-options": "SAMEORIGIN",
  "x-content-type-options": "nosniff",
  "referrer-policy": /strict-origin-when-cross-origin/,
  "strict-transport-security": /max-age=\d{8,}; includeSubDomains; preload/,
  "permissions-policy": /camera=\(\)/,
};

const expectSecurity = (res: Response, p: string) => {
  for (const [h, v] of Object.entries(SECURITY)) {
    const got = res.headers.get(h);
    expect(got, `${p}: ${h}`).toBeTruthy();
    if (typeof v === "string") expect(got, `${p}: ${h}`).toBe(v);
    else expect(got, `${p}: ${h}`).toMatch(v);
  }
  // Заголовок не должен дублироваться из-за наследования add_header
  expect(res.headers.get("x-frame-options"), `${p}: дубль X-Frame-Options`).not.toContain(",");
};

describe("страницы", () => {
  it.each(["/", "/en/", "/robots.txt", "/llms.txt", "/llms-full.txt", "/sitemap-index.xml", "/sitemap-0.xml", "/site.webmanifest", "/og-image.png", "/og-image-en.png", "/favicon.svg", "/humans.txt"])("%s - 200", async (p) => {
    const res = await get(p);
    expect(res.status).toBe(200);
    expect(Number(res.headers.get("content-length") ?? (await res.arrayBuffer()).byteLength)).toBeGreaterThan(0);
  });

  it("типы содержимого", async () => {
    const types: Record<string, RegExp> = {
      "/": /^text\/html/, "/robots.txt": /^text\/plain/, "/llms.txt": /^text\/plain/,
      "/sitemap-index.xml": /xml/, "/og-image.png": /^image\/png/, "/favicon.svg": /^image\/svg\+xml/,
      "/site.webmanifest": /^application\/manifest\+json/, "/fonts/inter-latin-var.woff2": /^font\/woff2/,
    };
    for (const [p, re] of Object.entries(types)) expect((await get(p)).headers.get("content-type"), p).toMatch(re);
  });

  it("HTML: русская и английская версии", async () => {
    expect(await (await get("/")).text()).toContain('<html lang="ru"');
    expect(await (await get("/en/")).text()).toContain('<html lang="en"');
  });
});

describe("редиректы", () => {
  it("/en -> /en/ относительным адресом (не уводит с HTTPS за прокси)", async () => {
    const res = await get("/en");
    expect(res.status).toBe(301);
    const loc = res.headers.get("location")!;
    if (EXTERNAL) expect(loc).toMatch(/^(\/en\/|https:\/\/[^/]+\/en\/)$/);
    else expect(loc).toBe("/en/");
  });

  it.each([["/index.html", "/"], ["/en/index.html", "/en/"], ["/career-consultation/index.html?utm_source=test", "/career-consultation/?utm_source=test"]])("%s перенаправляется на canonical %s", async (from, to) => {
    const response = await get(from);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(to);
  });
});

describe("страницы услуг", () => {
  it.each(["/career-consultation/", "/mock-interview/", "/en/career-consultation/", "/en/mock-interview/"])("%s — HTML 200 со своим canonical", async route => {
    const response = await get(route);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(await response.text()).toContain(`href="https://nadtocheev.ru${route}"`);
  });
});

describe("404", () => {
  it.each(["/nope", "/en/nope", "/404", "/wp-admin/", "/images/missing.png", "/_astro/missing.js", "/fonts/missing.woff2"])("%s - код 404", async (p) => {
    expect((await get(p)).status).toBe(404);
  });

  it("своя страница 404 с noindex и заголовками безопасности", async () => {
    const res = await get("/nope");
    const html = await res.text();
    expect(html).toContain('content="noindex, follow"');
    expect(html).toContain('href="/"');
    expectSecurity(res, "/nope");
  });

  it("/404.html напрямую недоступна (internal)", async () => {
    expect((await get("/404.html")).status).toBe(404);
  });
});

describe("скрытые файлы", () => {
  it.each(["/.env", "/.git/config", "/.htaccess", "/.DS_Store"])("%s - закрыт", async (p) => {
    expect([403, 404]).toContain((await get(p)).status);
  });
});

describe("заголовки безопасности на всех типах ответов", () => {
  it.each(["/", "/en/", "/robots.txt", "/og-image.png", "/fonts/inter-latin-var.woff2", "/site.webmanifest"])("%s", async (p) => {
    const res = await get(p);
    expect(res.status).toBe(200);
    expectSecurity(res, p);
  });

  it("CSP: ограниченный список аналитики, запрет object и чужих фреймов", async () => {
    const csp = (await get("/")).headers.get("content-security-policy")!;
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).not.toContain("*");
    const domains = [...csp.matchAll(/https?:\/\/([^ ;]+)/g)].map(m => m[1]);
    for (const domain of domains) expect(["mc.yandex.ru", "mc.yandex.com", "www.googletagmanager.com", "www.google-analytics.com", "region1.google-analytics.com"]).toContain(domain);
  });

  it.runIf(!EXTERNAL)("версия nginx не раскрывается", async () => {
    expect((await get("/")).headers.get("server")).toBe("nginx");
  });
});

describe("кэширование", () => {
  const cc = async (p: string) => (await get(p)).headers.get("cache-control");

  it("HTML и txt ревалидируются (деплой виден сразу)", async () => {
    for (const p of ["/", "/en/", "/llms.txt", "/robots.txt"]) expect(await cc(p), p).toBe("no-cache");
  });

  it("шрифты - 30 дней без immutable", async () => {
    expect(await cc("/fonts/inter-latin-var.woff2")).toBe("public, max-age=2592000");
    expect(await cc("/fonts/inter-cyrillic-var.woff2")).toBe("public, max-age=2592000");
  });

  it("картинки, манифест, sitemap - сутки", async () => {
    for (const p of ["/og-image.png", "/favicon.svg", "/site.webmanifest", "/sitemap-0.xml"]) expect(await cc(p), p).toBe("public, max-age=86400");
  });

  it("Cache-Control не дублируется (fetch склеивает повторы через запятую)", async () => {
    for (const p of ["/", "/og-image.png", "/fonts/inter-latin-var.woff2", "/site.webmanifest"]) {
      const v = (await cc(p))!;
      expect((v.match(/max-age|no-cache/g) ?? []).length, `${p}: ${v}`).toBe(1);
    }
  });
});

describe("сжатие", () => {
  it.each(["/", "/en/", "/llms-full.txt", "/site.webmanifest", "/favicon.svg"])("%s отдаётся в gzip", async (p) => {
    const res = await get(p, { headers: { "accept-encoding": "gzip" } });
    expect(res.headers.get("content-encoding")).toMatch(/gzip|br|zstd/);
    expect(res.headers.get("vary")?.toLowerCase()).toContain("accept-encoding");
  });

  it("woff2 и png не пережимаются", async () => {
    for (const p of ["/fonts/inter-latin-var.woff2", "/og-image.png"]) {
      const res = await get(p, { headers: { "accept-encoding": "gzip" } });
      expect(res.headers.get("content-encoding"), p).toBeNull();
    }
  });
});
