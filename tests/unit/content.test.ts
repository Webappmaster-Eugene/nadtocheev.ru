/**
 * Контент сайта: полнота, отсутствие плейсхолдеров, согласованность RU/EN и разделов между собой.
 * Дата сборки фиксирована, чтобы проверки стажа не зависели от дня запуска.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import { collectStrings, digits, shape } from "../helpers/strings.ts";

vi.stubEnv("SITE_BUILD_DATE", "2026-09-27");

const LANGS = ["ru", "en"] as const;

const { personal, heroMetrics } = await import("../../src/data/personal.ts");
const { getExperience } = await import("../../src/data/experience.ts");
const { getProjects, getStartups } = await import("../../src/data/projects.ts");
const { getServices } = await import("../../src/data/services.ts");
const { getPublications } = await import("../../src/data/publications.ts");
const { getMentoring } = await import("../../src/data/mentoring.ts");
const { getExpertise } = await import("../../src/data/skills.ts");
const { getFaq } = await import("../../src/data/faq.ts");
const { experienceYears } = await import("../../src/data/career.ts");
const { translations } = await import("../../src/i18n/translations.ts");

const dataFor = (lang: (typeof LANGS)[number]) => ({
  translations: translations[lang],
  experience: getExperience(lang),
  projects: getProjects(lang),
  startups: getStartups(lang),
  services: getServices(lang),
  publications: getPublications(lang),
  mentoring: getMentoring(lang),
  expertise: getExpertise(lang),
  faq: getFaq(lang),
});

beforeAll(() => {
  expect(experienceYears).toBe(5);
});

describe.each(LANGS)("строки контента (%s)", (lang) => {
  const strings = collectStrings({ ...dataFor(lang), personal, heroMetrics });

  it("нет пустых строк и пробелов по краям", () => {
    const bad = strings.filter((s) => !s.value.trim() || s.value !== s.value.trim());
    expect(bad).toEqual([]);
  });

  it("нет плейсхолдеров и артефактов шаблонов", () => {
    const re = /\b(TODO|FIXME|TBD|undefined|NaN|null)\b|XXX|[Ll]orem ipsum|\[object |\$\{|\{\{/;
    expect(strings.filter((s) => re.test(s.value))).toEqual([]);
  });

  it("нет двойных пробелов", () => {
    expect(strings.filter((s) => / {2}/.test(s.value))).toEqual([]);
  });

  it("нет убранных владельцем фактов (EasyOffer, зарплата, ссылка на кабинет vsesdal)", () => {
    const re = /easyoffer|280[\s ,]?000|salary|зарплат|vsesdal\.com\/\S/i;
    expect(strings.filter((s) => re.test(s.value))).toEqual([]);
  });
});

describe("английская версия без кириллицы", () => {
  // Кириллица допустима только в названиях, которые пишутся так официально
  const ALLOWED = /ООО Форвард|СПИН|Евгений Надточеев|Надточеев|\(ОФП\)|₽/g;
  it("EN-данные не содержат непереведённых строк", () => {
    const leaks = collectStrings(dataFor("en"))
      .filter((s) => /[а-яё]/i.test(s.value.replace(ALLOWED, "")))
      .filter((s) => !s.path.startsWith("$.translations.nav.switchLangLabel"));
    expect(leaks).toEqual([]);
  });
});

describe("RU и EN совпадают по структуре", () => {
  const ru = dataFor("ru");
  const en = dataFor("en");

  it("словари переводов - одинаковые ключи", () => {
    expect(shape(en.translations)).toEqual(shape(ru.translations));
  });

  it.each(["experience", "projects", "startups", "faq", "expertise"] as const)("%s: одинаковое число элементов и форма", (key) => {
    expect(en[key].length).toBe(ru[key].length);
    expect(en[key].length).toBeGreaterThan(0);
    expect(shape(en[key])).toEqual(shape(ru[key]));
  });

  it("абзацы «Обо мне» - одинаковое число", () => {
    expect(en.translations.about.paragraphs.length).toBe(ru.translations.about.paragraphs.length);
  });

  it("опыт: те же компании, даты и число пунктов", () => {
    const pick = (x: typeof ru.experience) => x.map((e) => ({ url: e.url, start: e.start, end: e.end, highlights: e.highlights.length, stack: e.stack }));
    expect(pick(en.experience)).toEqual(pick(ru.experience));
  });

  it("проекты: одинаковые стеки и число метрик", () => {
    const pick = (x: typeof ru.projects) => x.map((p) => ({ stack: p.stack, metrics: p.metrics.length }));
    expect(pick(en.projects)).toEqual(pick(ru.projects));
  });

  it("стартапы, статьи, выступления, площадки - те же ссылки", () => {
    expect(en.startups.map((s) => s.url)).toEqual(ru.startups.map((s) => s.url));
    expect(en.publications.articles.map((a) => [a.url, a.year])).toEqual(ru.publications.articles.map((a) => [a.url, a.year]));
    expect(en.publications.talks.map((t) => t.url)).toEqual(ru.publications.talks.map((t) => t.url));
    expect(en.mentoring.platforms.map((p) => p.url)).toEqual(ru.mentoring.platforms.map((p) => p.url));
  });

  it("цифры статистики совпадают", () => {
    expect(en.publications.stats).toEqual(ru.publications.stats);
    expect(en.mentoring.stats).toEqual(ru.mentoring.stats);
  });

  it("услуги: те же цены, иконки и акценты, одинаковое число пунктов", () => {
    const pick = (x: typeof ru.services) => x.items.map((s) => ({ price: digits(s.price), dur: digits(s.duration), icon: s.icon, accent: s.accent, includes: s.includes.length }));
    expect(pick(en.services)).toEqual(pick(ru.services));
  });

  it("экспертиза: одинаковые иконки и число навыков", () => {
    expect(en.expertise.map((c) => [c.icon, c.skills.length])).toEqual(ru.expertise.map((c) => [c.icon, c.skills.length]));
  });
});

describe("личные данные", () => {
  const urls = collectStrings(personal).filter((s) => /^https?:/.test(s.value));

  it("все ссылки - валидные https", () => {
    expect(urls.length).toBeGreaterThan(10);
    for (const u of urls) {
      expect(u.value, u.path).toMatch(/^https:\/\//);
      expect(() => new URL(u.value), u.path).not.toThrow();
    }
  });

  it("email, телефон, Telegram", () => {
    expect(personal.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    expect(personal.phone).toMatch(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/);
    expect(personal.telegram).toBe(`https://t.me/${personal.telegramUsername.slice(1)}`);
    expect(personal.website).toBe("https://nadtocheev.ru");
  });

  it("метрика стажа в hero считается от даты сборки", () => {
    expect(heroMetrics[0].value).toBe(String(experienceYears));
    for (const m of heroMetrics) expect(m.value).toMatch(/^\d+(K\+|\+)?$/);
  });
});

describe.each(LANGS)("опыт работы (%s)", (lang) => {
  const exp = getExperience(lang);

  it("идёт от новых к старым, без пересечений, текущая работа одна и первая", () => {
    expect(exp.filter((e) => !e.end).length).toBe(1);
    expect(exp[0].end).toBeUndefined();
    for (let i = 1; i < exp.length; i++) {
      expect(exp[i].end! <= exp[i - 1].start, `${exp[i].company} заканчивается до ${exp[i - 1].company}`).toBe(true);
    }
  });

  it("начало карьеры = начало первой работы", async () => {
    const { CAREER_START } = await import("../../src/data/career.ts");
    expect(exp.at(-1)!.start).toBe(CAREER_START);
  });

  it("start <= end, формат YYYY-MM, текстовый период содержит годы", () => {
    for (const e of exp) {
      expect(e.start).toMatch(/^20\d\d-(0[1-9]|1[0-2])$/);
      if (e.end) {
        expect(e.end).toMatch(/^20\d\d-(0[1-9]|1[0-2])$/);
        expect(e.start <= e.end).toBe(true);
        expect(e.period).toContain(e.end.slice(0, 4));
      }
      expect(e.period).toContain(e.start.slice(0, 4));
    }
  });

  it("длительность считается и не пустая", () => {
    for (const e of exp) expect(e.duration).toMatch(/^\d+ /);
  });

  it("у каждого места работы есть достижения и стек", () => {
    for (const e of exp) {
      expect(e.highlights.length, e.company).toBeGreaterThanOrEqual(3);
      expect(e.stack.backend.length, e.company).toBeGreaterThan(0);
      expect(new Set(e.stack.backend).size, `${e.company}: дубли в стеке`).toBe(e.stack.backend.length);
    }
  });
});

describe.each(LANGS)("согласованность разделов (%s)", (lang) => {
  const d = dataFor(lang);
  const faqText = d.faq.map((f) => f.a).join("\n");

  it("FAQ: 8-20 вопросов, без дублей, вопросы с «?»", () => {
    expect(d.faq.length).toBeGreaterThanOrEqual(8);
    expect(d.faq.length).toBeLessThanOrEqual(20);
    expect(new Set(d.faq.map((f) => f.q)).size).toBe(d.faq.length);
    for (const f of d.faq) expect(f.q.trim().endsWith("?"), f.q).toBe(true);
  });

  it("FAQ: цены услуг совпадают с разделом «Услуги»", () => {
    const faqDigits = faqText.replace(/(\d)[\s ,](?=\d{3}\b)/g, "$1");
    for (const s of d.services.items) expect(faqDigits, s.name).toContain(digits(s.price));
  });

  it("FAQ: стаж в первом ответе = стаж из career.ts", () => {
    expect(d.faq[0].a).toContain(String(experienceYears));
  });

  it("FAQ: контакты совпадают с personal", () => {
    const contacts = d.faq.find((f) => f.a.includes(personal.telegram));
    expect(contacts?.a).toContain(personal.email);
    expect(contacts?.a).toContain(personal.phone);
  });

  it("FAQ: стартапы с теми же адресами", () => {
    for (const s of d.startups) expect(faqText).toContain(s.url.replace(/\/$/, ""));
  });

  it("FAQ: ссылки на статьи ведут на статьи из «Публикаций»", () => {
    const articleIds = d.publications.articles.map((a) => a.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""));
    for (const m of faqText.matchAll(/(?<![\w.])habr\.com\/[^\s,)]+/g)) {
      const ref = m[0].replace(/\/$/, "").replace(/[.;:]$/, "");
      expect(articleIds, ref).toContain(ref);
    }
  });

  it("мета: title <= 70, description 70-160 символов", () => {
    expect(d.translations.meta.title.length).toBeLessThanOrEqual(70);
    expect(d.translations.meta.description.length).toBeGreaterThanOrEqual(70);
    expect(d.translations.meta.description.length).toBeLessThanOrEqual(160);
    expect(d.translations.meta.description).toContain(String(experienceYears));
  });

  it("статьи: https, год 2015..год сборки, без дублей", () => {
    const urls = d.publications.articles.map((a) => a.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const a of d.publications.articles) {
      expect(a.url).toMatch(/^https:\/\//);
      expect(Number(a.year)).toBeGreaterThanOrEqual(2015);
      expect(Number(a.year)).toBeLessThanOrEqual(2026);
    }
  });

  it("менторские площадки: число совпадает со статистикой", () => {
    expect(String(d.mentoring.platforms.length)).toBe(d.mentoring.stats.platforms);
  });

  it("услуги: цена в рублях, длительность, 3+ пункта", () => {
    for (const s of d.services.items) {
      expect(s.price).toMatch(/₽$/);
      expect(s.duration).toMatch(/^\d+ /);
      expect(s.includes.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("экспертиза: навыки без дублей внутри категории", () => {
    for (const c of d.expertise) expect(new Set(c.skills).size, c.title).toBe(c.skills.length);
  });
});
