export function metricsConfig(env: Record<string, string | undefined>) {
  const value = (name: string, pattern: RegExp) => {
    const input = (env[name] ?? "").trim();
    if (input && !pattern.test(input)) throw new Error(`Invalid public setting: ${name}`);
    return input;
  };
  return {
    yandexId: value("PUBLIC_YANDEX_METRIKA_ID", /^[1-9]\d*$/),
    googleId: value("PUBLIC_GA4_MEASUREMENT_ID", /^G-[A-Z0-9]+$/),
    yandexVerification: value("PUBLIC_YANDEX_VERIFICATION", /^[a-zA-Z0-9_-]+$/),
    googleVerification: value("PUBLIC_GOOGLE_SITE_VERIFICATION", /^[a-zA-Z0-9_-]+$/),
    debug: env.PUBLIC_WEB_VITALS_DEBUG === "true",
  };
}

export const siteMetrics = metricsConfig({
  PUBLIC_YANDEX_METRIKA_ID: import.meta.env.PUBLIC_YANDEX_METRIKA_ID,
  PUBLIC_GA4_MEASUREMENT_ID: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID,
  PUBLIC_YANDEX_VERIFICATION: import.meta.env.PUBLIC_YANDEX_VERIFICATION,
  PUBLIC_GOOGLE_SITE_VERIFICATION: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION,
  PUBLIC_WEB_VITALS_DEBUG: import.meta.env.PUBLIC_WEB_VITALS_DEBUG,
});
