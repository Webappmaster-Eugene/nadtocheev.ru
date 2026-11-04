/**
 * Платные услуги (консультации и мок-собеседования) - двуязычная версия.
 */
import type { Lang } from "../i18n/translations.ts";
import { personal } from "./personal.ts";

export interface ServiceItem {
  name: string;
  price: string;
  duration: string;
  description: string;
  includes: string[];
  icon: "consult" | "mock";
  accent: "accent" | "purple" | "green" | "orange";
  /** Форма заявки на mentorcareer.ru русская, поэтому на EN основной путь - Telegram. */
  bookingUrl: string;
}

export interface ServicesData {
  ctaLabel: string;
  items: ServiceItem[];
}

const servicesRu: ServicesData = {
  ctaLabel: "Записаться",
  items: [
    {
      name: "Карьерная консультация",
      price: "2 500 ₽",
      duration: "1 час",
      bookingUrl: `${personal.mentorSite}/karernaya-konsultatsiya#zayavka`,
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
      bookingUrl: `${personal.mentorSite}/mok-sobesedovanie#zayavka`,
      description:
        "Полноценное техническое интервью для frontend, backend и fullstack с разбором: live coding, system design, теория, soft skills.",
      includes: [
        "Live coding и алгоритмическая часть",
        "System design под реальный кейс",
        "Теория по вашему стеку: React и браузер или Node.js, базы данных и архитектура",
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
      price: "2,500 ₽",
      duration: "1 hour",
      bookingUrl: personal.telegram,
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
      bookingUrl: personal.telegram,
      description:
        "Full technical interview for frontend, backend and fullstack developers with debrief: live coding, system design, theory, soft skills.",
      includes: [
        "Live coding and algorithmic round",
        "System design on a real-world case",
        "Theory for your stack: React and the browser, or Node.js, databases and architecture",
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
