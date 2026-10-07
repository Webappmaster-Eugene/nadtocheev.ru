import { describe, expect, it } from "vitest";
import { metricsConfig } from "../../src/lib/metrics-config.ts";
import { getServicePage, serviceSlugs, servicePath } from "../../src/data/service-pages.ts";
import { getServices } from "../../src/data/services.ts";

describe("public metrics configuration", () => {
  it("no account IDs means no third-party collection", () => {
    expect(metricsConfig({})).toMatchObject({ yandexId: "", googleId: "", debug: false });
  });
  it("valid public IDs and verification are preserved", () => {
    expect(metricsConfig({ PUBLIC_YANDEX_METRIKA_ID: "12345678", PUBLIC_GA4_MEASUREMENT_ID: "G-ABC123", PUBLIC_YANDEX_VERIFICATION: "abcdef012345", PUBLIC_GOOGLE_SITE_VERIFICATION: "abc_123-xyz" })).toMatchObject({ yandexId: "12345678", googleId: "G-ABC123", googleVerification: "abc_123-xyz" });
  });
  it.each(["G-XXXX;alert(1)", "https://tracker.invalid", "</script>"])("invalid settings fail the build: %s", value => {
    expect(() => metricsConfig({ PUBLIC_GA4_MEASUREMENT_ID: value })).toThrow();
  });
});

describe.each(["ru", "en"] as const)("service content: %s", lang => {
  it.each(serviceSlugs)("%s uses the same price/duration/features as the homepage", slug => {
    const page = getServicePage(slug, lang);
    const service = getServices(lang).items[serviceSlugs.indexOf(slug)];
    expect(page.service).toEqual(service);
    expect(page.title).toContain(service.price.replace(/\s*₽$/, lang === "ru" ? " ₽" : " RUB"));
    expect(page.title.length).toBeLessThanOrEqual(75);
    expect(page.description.length).toBeLessThanOrEqual(175);
    expect(page.path).toBe(servicePath(slug, lang));
    expect(page.faq.some(item => item.a.includes(lang === "ru" ? "2500" : "2,500"))).toBe(true);
  });
});
