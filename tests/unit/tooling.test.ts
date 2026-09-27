/** Инфраструктура тестов: версии и даты должны совпадать в конфиге, CI и скриптах */
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { TEST_BUILD_DATE } from "../helpers/env.ts";

const read = (f: string) => fs.readFileSync(new URL(`../../${f}`, import.meta.url), "utf8");
const pkg = JSON.parse(read("package.json"));
const ci = read(".github/workflows/ci.yml");

describe("согласованность тестовой инфраструктуры", () => {
  it("образ Playwright в CI = установленная версия @playwright/test (иначе скриншоты разъедутся)", () => {
    const installed = JSON.parse(read("node_modules/@playwright/test/package.json")).version;
    expect(ci).toContain(`mcr.microsoft.com/playwright:v${installed}-noble`);
  });

  it("дата сборки для тестов одна: helpers, npm-скрипт, CI", () => {
    expect(pkg.scripts["build:test"]).toContain(`SITE_BUILD_DATE=${TEST_BUILD_DATE}`);
    expect(ci).toContain(`SITE_BUILD_DATE: "${TEST_BUILD_DATE}"`);
  });

  it("эталоны скриншотов есть для каждого теста визуального набора", () => {
    const shots = fs.readdirSync(new URL("../../e2e/visual/__screenshots__", import.meta.url));
    expect(shots.length).toBeGreaterThanOrEqual(80);
    for (const s of shots) expect(s).toMatch(/\.png$/);
  });
});
