/**
 * Стаж считается от дат на момент сборки - сайт пересобирается при каждом деплое,
 * поэтому длительности и «N лет опыта» не устаревают вручную.
 */
import type { Lang } from "../i18n/translations.ts";
import { BUILD_DATE } from "./build-date.ts";

/** Месяц в формате "YYYY-MM" */
export type YearMonth = `${number}-${number}`;

/** Начало коммерческого опыта (Systems-fd) */
export const CAREER_START: YearMonth = "2021-08";

function toMonthIndex(ym: YearMonth): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

const nowIndex = BUILD_DATE.getFullYear() * 12 + BUILD_DATE.getMonth();

/** Русская форма по числу: 1 год, 2 года, 5 лет */
export function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Длительность периода с учётом обоих крайних месяцев (ноябрь 2022 - ноябрь 2024 = 2 года 1 месяц) */
export function formatDuration(start: YearMonth, end: YearMonth | undefined, lang: Lang): string {
  const total = (end ? toMonthIndex(end) : nowIndex) - toMonthIndex(start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (lang === "ru") {
    if (years) parts.push(`${years} ${ruPlural(years, "год", "года", "лет")}`);
    if (months) parts.push(`${months} ${ruPlural(months, "месяц", "месяца", "месяцев")}`);
  } else {
    if (years) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
    if (months) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  }
  return parts.join(" ");
}

/** Полных лет коммерческого опыта */
export const experienceYears = Math.floor((nowIndex - toMonthIndex(CAREER_START)) / 12);

/** «с 5 годами опыта» / «с 1 годом опыта» */
export const experienceYearsRuInstr = `${experienceYears} ${ruPlural(experienceYears, "годом", "годами", "годами")}`;
