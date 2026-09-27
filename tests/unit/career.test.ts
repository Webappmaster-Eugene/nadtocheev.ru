import { afterEach, describe, expect, it, vi } from "vitest";

/** career.ts считает стаж от даты сборки на уровне модуля - перезагружаем модуль с нужной датой */
async function loadCareer(date: string) {
  vi.stubEnv("SITE_BUILD_DATE", date);
  vi.resetModules();
  return import("../../src/data/career.ts");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ruPlural", async () => {
  const { ruPlural } = await loadCareer("2026-09-27");
  it.each([
    [1, "год"], [2, "года"], [4, "года"], [5, "лет"], [11, "лет"], [12, "лет"], [14, "лет"],
    [21, "год"], [22, "года"], [25, "лет"], [101, "год"], [111, "лет"], [112, "лет"], [0, "лет"],
  ])("%i -> %s", (n, word) => {
    expect(ruPlural(n, "год", "года", "лет")).toBe(word);
  });
});

describe("formatDuration: оба крайних месяца включаются", async () => {
  const { formatDuration } = await loadCareer("2026-09-27");
  it.each([
    ["2022-11", "2024-11", "ru", "2 года 1 месяц"],
    ["2022-11", "2024-11", "en", "2 years 1 month"],
    ["2021-08", "2022-11", "ru", "1 год 4 месяца"],
    ["2021-08", "2022-11", "en", "1 year 4 months"],
    ["2024-01", "2024-12", "ru", "1 год"],
    ["2024-01", "2024-01", "ru", "1 месяц"],
    ["2024-01", "2024-05", "ru", "5 месяцев"],
    ["2024-01", "2024-02", "en", "2 months"],
  ] as const)("%s..%s (%s) = %s", (start, end, lang, expected) => {
    expect(formatDuration(start, end, lang)).toBe(expected);
  });

  it("без end - по месяц сборки включительно", () => {
    expect(formatDuration("2024-11", undefined, "ru")).toBe("1 год 11 месяцев");
    expect(formatDuration("2024-11", undefined, "en")).toBe("1 year 11 months");
  });
});

describe("стаж от CAREER_START", () => {
  it.each([
    ["2026-07-31", 4, "4 годами"],
    ["2026-08-01", 5, "5 годами"],
    ["2026-09-27", 5, "5 годами"],
    ["2027-08-01", 6, "6 годами"],
    ["2042-08-01", 21, "21 годом"],
  ])("на %s - %i лет (%s)", async (date, years, instr) => {
    const c = await loadCareer(date);
    expect(c.CAREER_START).toBe("2021-08");
    expect(c.experienceYears).toBe(years);
    expect(c.experienceYearsRuInstr).toBe(instr);
  });

  it("неверная SITE_BUILD_DATE роняет сборку", async () => {
    await expect(loadCareer("вчера")).rejects.toThrow(/SITE_BUILD_DATE/);
  });
});
