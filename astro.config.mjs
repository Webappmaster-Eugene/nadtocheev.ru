// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";

/** Дата сборки; SITE_BUILD_DATE фиксирует её для тестов (см. src/data/build-date.ts) */
const buildDate = process.env.SITE_BUILD_DATE ? new Date(process.env.SITE_BUILD_DATE) : new Date();

export default defineConfig({
  site: "https://nadtocheev.ru",
  trailingSlash: "always",
  compressHTML: true,
  build: {
    // CSS инлайнится в HTML: убирает render-blocking запрос на небольших статических страницах
    inlineStylesheets: "always",
  },
  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 0.8,
      lastmod: buildDate, // дата сборки = дата деплоя
      i18n: {
        defaultLocale: "ru",
        locales: {
          ru: "ru",
          en: "en",
        },
      },
      filter: (page) => !page.includes("/404"),
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname === "/" || url.pathname === "") {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (url.pathname === "/en/" || url.pathname === "/en") {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
