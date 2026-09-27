/**
 * Поднимает продовый nginx-конфиг в Docker на время тестов.
 *   по умолчанию      - nginx:alpine + смонтированные dist/ и конфиги (быстро, нужен npm run build:test)
 *   NGINX_MODE=image  - полный продовый образ из Dockerfile, как собирает Dokploy
 *   NGINX_URL=https://nadtocheev.ru - ничего не поднимать, проверить внешний адрес (прод)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { TestProject } from "vitest/node";

const APP = path.resolve(import.meta.dirname, "../..");
const NAME = "nadt-test-nginx";
const PORT = process.env.NGINX_PORT ?? "8088";

const docker = (...args: string[]) => execFileSync("docker", args, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();

declare module "vitest" {
  export interface ProvidedContext {
    baseURL: string;
    external: boolean;
  }
}

export default async function setup(project: TestProject) {
  const external = process.env.NGINX_URL?.replace(/\/$/, "");
  if (external) {
    project.provide("baseURL", external);
    project.provide("external", true);
    return;
  }

  try { docker("rm", "-f", NAME); } catch { /* контейнера не было */ }
  if (process.env.NGINX_MODE === "image") {
    docker("build", "-q", "-t", NAME, APP);
    docker("run", "-d", "--name", NAME, "-p", `${PORT}:80`, NAME);
  } else {
    if (!fs.existsSync(path.join(APP, "dist/index.html"))) throw new Error("Нет dist/ - сначала npm run build:test");
    docker(
      "run", "-d", "--name", NAME, "-p", `${PORT}:80`,
      "-v", `${APP}/dist:/usr/share/nginx/html:ro`,
      "-v", `${APP}/nginx.conf:/etc/nginx/conf.d/default.conf:ro`,
      "-v", `${APP}/nginx-security-headers.conf:/etc/nginx/snippets/security-headers.conf:ro`,
      "nginx:alpine",
    );
  }

  const url = `http://localhost:${PORT}`;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(url)).ok) break; } catch { /* ещё стартует */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  // Синтаксис конфига проверяет сам nginx
  execFileSync("docker", ["exec", NAME, "nginx", "-t"], { stdio: "pipe" });

  project.provide("baseURL", url);
  project.provide("external", false);
  return () => { try { docker("rm", "-f", NAME); } catch { /* уже удалён */ } };
}
