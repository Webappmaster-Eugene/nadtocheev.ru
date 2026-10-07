/**
 * Статический сервер dist/ для e2e и скриншотов - повторяет маршрутизацию nginx.conf:
 * try_files $uri $uri/ $uri.html =404, error_page 404 /404.html, /en -> /en/.
 * Заголовки и кэш nginx проверяют tests/nginx; здесь нужен только тот же HTML.
 *   node scripts/static-server.mjs [port]   (по умолчанию 4400)
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../dist");
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4400);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2",
};

const isFile = (p) => p.startsWith(ROOT) && fs.existsSync(p) && fs.statSync(p).isFile();

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const rel = decodeURIComponent(url.pathname);
  if (rel.endsWith("/index.html")) {
    res.writeHead(301, { location: rel.slice(0, -10) + url.search }).end();
    return;
  }
  const abs = path.join(ROOT, rel);
  if (!rel.endsWith("/") && fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    res.writeHead(301, { location: `${rel}/${url.search}` }).end();
    return;
  }
  const file = [abs, path.join(abs, "index.html"), `${abs}.html`].find(isFile);
  const hidden = rel.split("/").some((s) => s.startsWith("."));
  const status = file && !hidden && rel !== "/404.html" && rel !== "/404" ? 200 : 404;
  const body = status === 200 ? file : path.join(ROOT, "404.html");
  res.writeHead(status, { "content-type": TYPES[path.extname(body)] ?? "application/octet-stream", "cache-control": "no-cache" });
  fs.createReadStream(body).pipe(res);
}).listen(PORT, () => console.log(`dist/ на http://localhost:${PORT}`));
