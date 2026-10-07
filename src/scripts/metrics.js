/* Inline adapter. The official web-vitals module is self-hosted and loaded during idle time.
   config/webVitalsURL are injected by Metrics.astro; no query strings, contact details,
   arbitrary link destinations or persistent custom identifiers are sent as event parameters. */
if (navigator.globalPrivacyControl || navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
if (window.__siteMetricsStarted) return;
window.__siteMetricsStarted = true;
const pagePath = location.pathname.replace(/index\.html$/, "");
const pageLocation = location.origin + pagePath;
let referrer = "";
try { if (document.referrer) { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } } catch (_) {}
if (config.googleId) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", config.googleId, {
    page_location: pageLocation, page_referrer: referrer,
    allow_google_signals: false, allow_ad_personalization_signals: false,
  });
}
if (config.yandexId) {
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = Date.now();
  window.ym(Number(config.yandexId), "init", {
    defer: true, clickmap: false, trackLinks: false, webvisor: false, accurateTrackBounce: true,
  });
  window.ym(Number(config.yandexId), "hit", pageLocation, { referer: referrer });
}
function report(eventName, params) {
  const payload = { ...params, page_path: pagePath, language: document.documentElement.lang };
  if (config.googleId) window.gtag("event", eventName, payload);
  if (config.yandexId) window.ym(Number(config.yandexId), "reachGoal", eventName, payload);
}
document.addEventListener("click", event => {
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!link) return;
  const goal = link.dataset.track;
  if (goal === "book_consultation" || goal === "book_mock_interview") report(goal, {});
  else if (link.href.startsWith("https://t.me/eugene_nadtocheev")) report("contact_telegram", {});
  else if (link.href.startsWith("mailto:")) report("contact_email", {});
  else if (link.href.startsWith("tel:")) report("contact_phone", {});
});
function addScript(src) {
  if ([...document.scripts].some(script => script.src === src)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.append(script);
}
function start() {
  if (config.googleId) addScript("https://www.googletagmanager.com/gtag/js?id=" + config.googleId);
  if (config.yandexId) addScript("https://mc.yandex.ru/metrika/tag.js");
  import(webVitalsURL).then(({ onCLS, onLCP, onINP, onFCP, onTTFB }) => {
    function record(metric) {
      const { name, value, rating, navigationType } = metric;
      if (!Number.isFinite(value)) return;
      const payload = { metric_name: name, metric_value: value, metric_rating: rating, navigation_type: navigationType };
      if (config.debug) {
        window.__siteVitals = window.__siteVitals || {};
        window.__siteVitals[name] = payload;
      }
      window.dispatchEvent(new CustomEvent("site:web-vital", { detail: payload }));
      report("web_vitals", payload);
    }
    [onCLS, onLCP, onINP, onFCP, onTTFB].forEach(register => register(record));
  }).catch(() => { /* Telemetry must never break navigation or content. */ });
}
if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 2500 });
else window.setTimeout(start, 1);
