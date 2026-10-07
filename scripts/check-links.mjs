/**
 * Проверка всех внешних ссылок сайта: извлекает URL из src/ и public/
 * и проверяет не только HTTP-код, но и «мягкие 404» (страница 200, но профиль не найден).
 * Не входит в npm test: зависит от чужих сайтов, в CI идёт по расписанию (.github/workflows/monitor.yml).
 *   npm run check:links             - все внешние ссылки
 *   node scripts/check-links.mjs --json - машинно-читаемый вывод
 * Код выхода 1, если есть битые ссылки.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCAN = ["src", "public"];
const SKIP_DIRS = new Set(["fonts", "node_modules"]);
const IGNORE = [
  /schema\.org/, /w3\.org/, /sitemaps\.org/, /google\.com\/schemas/, /localhost/, /XXXX/,
  /googletagmanager/, /mc\.yandex/, /robotstxt\.org/, /spawning\.ai/, /github\.com\/rsms\/inter/, /scripts\.sil\.org/,
];
/* Собственный домен проверяется отдельно (prod-check), здесь он только шумит */
const OWN = /^https?:\/\/(www\.)?nadtocheev\.ru/;
/* Сайты, которые режут ботов по User-Agent: 403/401 не значит «битая» - проверять вручную */
const BOT_WALLED = [/leetcode\.com/];
const SOFT_404 = [/ментор не найден/i, /страница не найдена/i, /page not found/i, /user not found/i, /профиль не найден/i, /не существует/i];
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out); }
    else if (/\.(astro|ts|txt|json|webmanifest|xml)$/.test(e.name) || e.name.startsWith(".")) out.push(path.join(dir, e.name));
  }
  return out;
}

const found = new Map(); // url -> Set(files)
for (const dir of SCAN) {
  for (const file of walk(path.join(ROOT, dir))) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/https?:\/\/[^\s"'`<>)\\]+/g)) {
      const url = m[0].replace(/[.,;:]+$/, "").replace(/#.*$/, "");
      if (IGNORE.some((r) => r.test(url)) || OWN.test(url) || url.includes("${")) continue;
      if (!found.has(url)) found.set(url, new Set());
      found.get(url).add(path.relative(ROOT, file));
    }
  }
}

/** Чужие сайты иногда отвечают медленно - перед вердиктом «битая» вторая попытка */
async function check(url) {
  const first = await checkOnce(url);
  return first.verdict === "broken" ? checkOnce(url) : first;
}

async function checkOnce(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "ru,en" }, redirect: "follow", signal: ctrl.signal });
    const body = res.headers.get("content-type")?.includes("text/html") ? await res.text() : "";
    const title = body.match(/<title[^>]*>([^<]*)/i)?.[1]?.trim() ?? "";
    const soft = SOFT_404.find((r) => r.test(title));
    let verdict = "ok";
    if (res.status === 401) verdict = "restricted";
    else if (!res.ok) verdict = BOT_WALLED.some((r) => r.test(url)) ? "manual" : "broken";
    else if (soft) verdict = "broken";
    else if (res.redirected && new URL(res.url).pathname !== new URL(url).pathname) verdict = "redirect";
    return { url, status: res.status, final: res.redirected ? res.url : "", title: title.slice(0, 80), verdict };
  } catch (e) {
    return { url, status: 0, final: "", title: String(e.cause?.code ?? e.name), verdict: "broken" };
  } finally {
    clearTimeout(timer);
  }
}

const urls = [...found.keys()].sort();
const results = [];
for (let i = 0; i < urls.length; i += 6) results.push(...(await Promise.all(urls.slice(i, i + 6).map(check))));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(results.map((r) => ({ ...r, files: [...found.get(r.url)] })), null, 2));
} else {
  const icon = { ok: "✓", redirect: "→", manual: "?", restricted: "!", broken: "✗" };
  for (const r of results) {
    console.log(`${icon[r.verdict]} ${String(r.status).padEnd(3)} ${r.url}${r.final ? `  → ${r.final}` : ""}${r.verdict !== "ok" && r.title ? `  [${r.title}]` : ""}`);
    if (["broken", "restricted"].includes(r.verdict)) console.log(`      в файлах: ${[...found.get(r.url)].join(", ")}`);
  }
  const count = (v) => results.filter((r) => r.verdict === v).length;
  console.log(`\nВсего ${results.length}: ok ${count("ok")}, редиректы ${count("redirect")}, вручную ${count("manual")}, ограничен доступ ${count("restricted")}, битые ${count("broken")}`);
  console.log("Заголовок страницы проверяй глазами: ссылка может быть живой, но вести не на тот профиль/статью.");
}
process.exit(results.some((r) => ["broken", "restricted"].includes(r.verdict)) ? 1 : 0);
