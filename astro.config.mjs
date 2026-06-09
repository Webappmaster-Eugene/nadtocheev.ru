// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://nadtocheev.ru",
  trailingSlash: "ignore",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 0.8,
      lastmod: new Date("2026-06-09"),
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
          item.changefreq = "weekly";
        } else if (url.pathname === "/en/" || url.pathname === "/en") {
          item.priority = 0.9;
          item.changefreq = "weekly";
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
