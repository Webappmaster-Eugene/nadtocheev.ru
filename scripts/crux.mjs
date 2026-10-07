/** Server/CI-only: no API key is embedded in the website or written into reports. */
import fs from "node:fs";
import path from "node:path";

const origin = new URL(process.env.CRUX_ORIGIN ?? "https://nadtocheev.ru").origin;
const output = path.resolve(import.meta.dirname, "../test-results/crux.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
const key = process.env.CRUX_API_KEY;
const rows = [];
if (!key) {
  rows.push({ status: "not-configured", reason: "CRUX_API_KEY is required; no field measurement was performed" });
} else for (const formFactor of ["PHONE", "DESKTOP"]) {
  try {
    const url = new URL("https://chromeuxreport.googleapis.com/v1/records:queryRecord");
    url.searchParams.set("key", key);
    const response = await fetch(url, {
      method: "POST", signal: AbortSignal.timeout(30000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, formFactor, metrics: ["largest_contentful_paint", "interaction_to_next_paint", "cumulative_layout_shift", "first_contentful_paint", "experimental_time_to_first_byte"] }),
    });
    const data = await response.json();
    if (response.status === 404) rows.push({ formFactor, status: "no-data", reason: "CrUX has no record for this origin/device" });
    else if (!response.ok) rows.push({ formFactor, status: "error", httpStatus: response.status });
    else {
      const p75 = Object.fromEntries(Object.entries(data.record.metrics).map(([name, metric]) => [name, metric.percentiles?.p75 ?? null]));
      const limits = { largest_contentful_paint: 2500, interaction_to_next_paint: 200, cumulative_layout_shift: 0.1 };
      const problems = Object.entries(limits).filter(([name, limit]) => p75[name] != null && Number(p75[name]) > limit).map(([name]) => name);
      rows.push({ formFactor, status: "measured", collectionPeriod: data.record.collectionPeriod, p75, problems });
    }
  } catch { rows.push({ formFactor, status: "error", reason: "Request failed; credentials are omitted from diagnostics" }); }
}
fs.writeFileSync(output, JSON.stringify({ measuredAt: new Date().toISOString(), origin, source: "CrUX (field, rolling 28 days, p75)", rows }, null, 2));
for (const row of rows) console.log(`${row.formFactor ?? "CrUX"}: ${row.status}${row.reason ? ` — ${row.reason}` : ""}${row.problems?.length ? ` — thresholds exceeded: ${row.problems.join(", ")}` : ""}`);
process.exitCode = rows.some(row => row.status === "error" || row.problems?.length) ? 1 : 0;
