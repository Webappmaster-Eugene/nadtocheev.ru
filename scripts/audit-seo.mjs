/** Read-only crawl of the actual served HTML and all internal page/fragment links. */
import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

const flag = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const base = new URL(flag("url") ?? flag("base") ?? "http://localhost:8089");
const queue = ["/", "/en/"];
const pages = new Map();
const problems = [];
const external = new Set();
const canonicalOrigin = "https://nadtocheev.ru";
const fetches = new Map();
function load(route) {
  if (!fetches.has(route)) fetches.set(route, fetch(new URL(route, base), { signal: AbortSignal.timeout(20000) }).then(async response => ({ status: response.status, type: response.headers.get("content-type") ?? "", body: await response.text() })));
  return fetches.get(route);
}
const own = url => url.origin === base.origin || url.origin === canonicalOrigin;
for (let i = 0; i < queue.length; i++) {
  const route = queue[i];
  if (pages.has(route)) continue;
  if (pages.size > 30) throw new Error("Unexpected crawl size");
  try {
    const response = await load(route);
    if (response.status !== 200 || !response.type.includes("text/html")) { problems.push(`${route}: expected HTML 200, got ${response.status}`); continue; }
    const doc = parse(response.body);
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
    const title = doc.querySelector("title")?.textContent.trim();
    const description = doc.querySelector('meta[name="description"]')?.getAttribute("content");
    if (canonical !== new URL(route, canonicalOrigin).href) problems.push(`${route}: canonical mismatch`);
    if (!title || !description) problems.push(`${route}: missing title/description`);
    if (doc.querySelectorAll("h1").length !== 1) problems.push(`${route}: expected one h1`);
    if (/noindex/.test(doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "")) problems.push(`${route}: noindex`);
    const ids = doc.querySelectorAll("[id]").map(el => el.id);
    if (new Set(ids).size !== ids.length) problems.push(`${route}: duplicate IDs`);
    const graph = JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "null");
    if (!graph?.["@graph"]) problems.push(`${route}: no JSON-LD graph`);
    const links = doc.querySelectorAll("a[href]").map(a => a.getAttribute("href"));
    for (const href of links) {
      const url = new URL(href, new URL(route, base));
      if (!/^(https?:|mailto:|tel:)$/.test(url.protocol)) problems.push(`${route}: unsupported link protocol`);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      if (!own(url)) external.add(url.href);
      else if (!path.extname(url.pathname) && !queue.includes(url.pathname)) queue.push(url.pathname);
    }
    pages.set(route, { title, description, canonical, links, ids, alternatives: doc.querySelectorAll('link[hreflang]').map(el => ({ lang: el.getAttribute("hreflang"), href: el.getAttribute("href") })) });
  } catch (error) { problems.push(`${route}: ${error.name}`); }
}
for (const [route, page] of pages) {
  for (const href of page.links) {
    const url = new URL(href, new URL(route, base));
    if (!own(url)) continue;
    const target = pages.get(url.pathname);
    if (!target) {
      try { const response = await load(url.pathname); if (response.status !== 200) problems.push(`${route}: broken internal link ${url.pathname} (${response.status})`); } catch { problems.push(`${route}: internal link request failed ${url.pathname}`); }
    } else if (url.hash && !target.ids.includes(decodeURIComponent(url.hash.slice(1)))) problems.push(`${route}: missing fragment ${url.pathname}${url.hash}`);
  }
  for (const alternative of page.alternatives) {
    const target = pages.get(new URL(alternative.href).pathname);
    if (!target?.alternatives.some(a => a.href === page.canonical)) problems.push(`${route}: hreflang not reciprocal: ${alternative.lang}`);
  }
}
for (const field of ["title", "description"]) {
  const seen = new Set();
  for (const [route, page] of pages) { if (seen.has(page[field])) problems.push(`${route}: duplicate ${field}`); seen.add(page[field]); }
}
const report = { checkedAt: new Date().toISOString(), origin: base.origin, pages: Object.fromEntries(pages), externalLinks: [...external].sort(), problems };
const output = path.resolve(import.meta.dirname, "../test-results/seo-audit.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(report, null, 2));
console.log(`SEO crawl: ${pages.size} pages, ${external.size} distinct external links, ${problems.length} problems`);
for (const problem of problems) console.log(problem);
process.exitCode = problems.length ? 1 : 0;
