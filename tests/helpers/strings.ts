/** Все строковые значения объекта с путями - для проверок «нет пустых строк / плейсхолдеров» */
export function collectStrings(value: unknown, path = "$"): { path: string; value: string }[] {
  if (typeof value === "string") return [{ path, value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => collectStrings(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => collectStrings(v, `${path}.${k}`));
  }
  return [];
}

/** Форма объекта: ключи и типы значений, длина массивов не учитывается */
export function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.length ? ["array", shape(value[0])] : ["array"];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape((value as Record<string, unknown>)[k])]));
  }
  return typeof value;
}

/** Цифры из строки: "2 000 ₽" и "2,000 ₽" -> "2000" */
export const digits = (s: string) => s.replace(/\D/g, "");

/** Markdown-ссылки [title](url) */
export function markdownLinks(md: string): { title: string; url: string }[] {
  return [...md.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => ({ title: m[1], url: m[2] }));
}
