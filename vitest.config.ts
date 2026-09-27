import { defineConfig } from "vitest/config";

/**
 * unit  - данные, i18n, llms.txt (без сборки)
 * dist  - готовая сборка dist/: SEO, JSON-LD, ссылки, sitemap (сначала npm run build)
 * nginx - продовый nginx-конфиг в Docker: коды, заголовки, кэш (NGINX_URL - проверить внешний адрес)
 */
export default defineConfig({
  test: {
    projects: [
      { test: { name: "unit", include: ["tests/unit/**/*.test.ts"] } },
      { test: { name: "dist", include: ["tests/dist/**/*.test.ts"] } },
      {
        test: {
          name: "nginx",
          include: ["tests/nginx/**/*.test.ts"],
          globalSetup: ["tests/nginx/setup.ts"],
          testTimeout: 15_000,
        },
      },
    ],
  },
});
