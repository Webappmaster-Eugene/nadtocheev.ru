/**
 * Платные услуги (консультации и мок-собеседования) — двуязычная версия.
 */
import type { Lang } from "../i18n/translations.ts";

export interface ServiceItem {
  name: string;
  price: string;
  duration: string;
  description: string;
  includes: string[];
  icon: "consult" | "mock";
  accent: "accent" | "purple" | "green" | "orange";
}

export interface ServicesData {
  ctaLabel: string;
  items: ServiceItem[];
}

const servicesRu: ServicesData = {
  ctaLabel: "Записаться в Telegram",
  items: [
    {
      name: "Карьерная консультация",
      price: "2 000 ₽",
      duration: "1 час",
      description:
        "Разбор резюме, карьерный трек, выбор стека, подготовка к выходу на рынок и переговоры о грейде/оффере.",
      includes: [
        "Разбор резюме и LinkedIn/hh-профиля",
        "Карьерная стратегия и роадмап на 3–6 месяцев",
        "Подготовка к переговорам об оффере",
        "Запись встречи и follow-up в текстовом виде",
      ],
      icon: "consult",
      accent: "accent",
    },
    {
      name: "Мок-собеседование",
      price: "5 000 ₽",
      duration: "2 часа",
      description:
        "Полноценное техническое интервью fullstack/backend с разбором: live coding, system design, теория, soft skills.",
      includes: [
        "Live coding и алгоритмическая часть",
        "System design под реальный кейс",
        "Теория: Node.js, базы данных, архитектура",
        "Развёрнутый фидбек по сильным и слабым сторонам",
      ],
      icon: "mock",
      accent: "purple",
    },
  ],
};

const servicesEn: ServicesData = {
  ctaLabel: "Book on Telegram",
  items: [
    {
      name: "Career Consultation",
      price: "2,000 ₽",
      duration: "1 hour",
      description:
        "Resume review, career track, stack choice, market positioning, and offer/grade negotiation prep.",
      includes: [
        "Resume & LinkedIn/hh profile review",
        "Career strategy and 3–6 month roadmap",
        "Offer negotiation preparation",
        "Call recording and written follow-up",
      ],
      icon: "consult",
      accent: "accent",
    },
    {
      name: "Mock Interview",
      price: "5,000 ₽",
      duration: "2 hours",
      description:
        "Full technical fullstack/backend interview with debrief: live coding, system design, theory, soft skills.",
      includes: [
        "Live coding and algorithmic round",
        "System design on a real-world case",
        "Theory: Node.js, databases, architecture",
        "Detailed feedback on strengths and gaps",
      ],
      icon: "mock",
      accent: "purple",
    },
  ],
};

export function getServices(lang: Lang): ServicesData {
  return lang === "ru" ? servicesRu : servicesEn;
}
