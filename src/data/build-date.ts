/**
 * Дата сборки - от неё считаются стаж, длительности, dateModified, lastmod и год в футере.
 * SITE_BUILD_DATE (ISO, например 2026-09-27) фиксирует дату для детерминированных
 * тестов и скриншотов; в проде переменная не задаётся и берётся текущая дата.
 */
const fixed = process.env.SITE_BUILD_DATE;

export const BUILD_DATE = fixed ? new Date(fixed) : new Date();

if (Number.isNaN(BUILD_DATE.getTime())) {
  throw new Error(`SITE_BUILD_DATE="${fixed}" - неверная дата, ожидается ISO (2026-09-27)`);
}
