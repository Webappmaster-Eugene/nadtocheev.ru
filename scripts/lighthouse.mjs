/** Reproducible lab metrics. Field INP is collected separately with web-vitals/CrUX. */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const arg = (key, fallback) => process.argv.find(a => a.startsWith(`--${key}=`))?.slice(key.length + 3) ?? fallback;
const base = new URL(arg("url", arg("base", "http://localhost:8089")));
if (!/^https?:$/.test(base.protocol) || base.username || base.password || base.search) throw new Error("Use a public origin without credentials or query parameters");
const OUT = process.env.PERFORMANCE_REPORT_DIR ?? path.resolve(import.meta.dirname, "../test-results/lighthouse");
fs.mkdirSync(OUT, { recursive: true });
const routes = ["/", "/en/"];
if (process.argv.includes("--all-pages")) routes.push("/career-consultation/", "/mock-interview/", "/en/career-consultation/", "/en/mock-interview/");
const cli = path.resolve(import.meta.dirname, "../node_modules/lighthouse/cli/index.js");
const rows = [];
for (const device of ["mobile", "desktop"]) for (const route of routes) {
  const file = `${device}-${route === "/" ? "ru" : route === "/en/" ? "en" : route.split("/").filter(Boolean).join("-")}.json`;
  const output = path.join(OUT, file);
  const args = [cli, new URL(route, base).href, "--quiet", "--output=json", `--output-path=${output}`, "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage"];
  if (device === "desktop") args.push("--preset=desktop");
  execFileSync(process.execPath, args, { env: process.env, stdio: ["ignore", "ignore", "inherit"] });
  const result = JSON.parse(fs.readFileSync(output, "utf8"));
  const scores = Object.fromEntries(Object.values(result.categories).map(c => [c.id, Math.round(c.score * 100)]));
  const limits = { performance: device === "mobile" ? 90 : 95, accessibility: 100, "best-practices": 100, seo: 100, "agentic-browsing": 100 };
  const problems = Object.entries(limits).filter(([name, limit]) => scores[name] !== undefined && scores[name] < limit).map(([name, limit]) => `${name}: ${scores[name]} < ${limit}`);
  const metric = name => result.audits[name]?.numericValue ?? null;
  rows.push({ device, route, scores, lcpMs: metric("largest-contentful-paint"), fcpMs: metric("first-contentful-paint"), cls: metric("cumulative-layout-shift"), tbtMs: metric("total-blocking-time"), problems });
  console.log(`${device} ${route}: performance ${scores.performance}, a11y ${scores.accessibility}, SEO ${scores.seo}, LCP ${Math.round(metric("largest-contentful-paint"))} ms, CLS ${metric("cumulative-layout-shift")}${problems.length ? ` — FAIL ${problems.join(", ")}` : ""}`);
}
const summary = { measuredAt: new Date().toISOString(), origin: base.origin, source: "Lighthouse (lab; mobile simulated Slow 4G)", rows };
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
console.log("Laboratory measurements do not establish real-user INP or field Core Web Vitals compliance.");
process.exitCode = rows.some(row => row.problems.length) ? 1 : 0;
