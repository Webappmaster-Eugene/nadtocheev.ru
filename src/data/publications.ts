/**
 * Публикации и выступления — двуязычная версия.
 * Источник: webappmaster.ru, mentorcareer.ru.
 */
import type { Lang } from "../i18n/translations.ts";

export interface Article {
  title: string;
  source: string;
  year: string;
  url: string;
  summary: string;
}

export interface Talk {
  title: string;
  venue: string;
  description: string;
  url?: string;
  role: string;
}

export interface PublicationsData {
  stats: {
    talks: string;
    articles: string;
    yearsTeaching: string;
  };
  statsLabels: {
    talks: string;
    articles: string;
    yearsTeaching: string;
  };
  articles: Article[];
  talks: Talk[];
  ctaArticles: string;
}

const publicationsRu: PublicationsData = {
  stats: {
    talks: "10+",
    articles: "5+",
    yearsTeaching: "2",
  },
  statsLabels: {
    talks: "выступлений и лекций",
    articles: "статей на Хабре и vc.ru",
    yearsTeaching: "года наставничества",
  },
  articles: [
    {
      title: "Критическое осмысление фриланса — гайд с высоты опыта 6 лет",
      source: "Хабр",
      year: "2025",
      url: "https://habr.com/ru/articles/913984/",
      summary:
        "Подробный разбор фриланса как карьерного пути: что работает, что нет, на чём строится длинная игра — с цифрами и кейсами.",
    },
    {
      title: "Опыт создания коммерческого приложения аренды авто в Дубае",
      source: "Хабр",
      year: "2023",
      url: "https://habr.com/p/727810/",
      summary:
        "Кейс продуктовой разработки MVP в международном проекте: архитектура, интеграции, выводы по запуску.",
    },
    {
      title: "Кейс — Uber для портных: подготовка и запуск MVP",
      source: "vc.ru",
      year: "2023",
      url: "https://vc.ru/u/1301474-evgeniy-ivanov/682696-uber-dlya-portnyh-kak-podgotovit-i-zapustit-mvp-na-bubble-io",
      summary:
        "Запуск MVP-маркетплейса услуг: путь от идеи до первых пользователей и метрик роста.",
    },
  ],
  talks: [
    {
      title: "Эксперт и лектор",
      venue: "Школа 21 (Сбер)",
      description:
        "Открытые лекции и экспертные сессии для студентов кампусов Школы 21 по fullstack-разработке, backend-архитектуре и подготовке к рынку.",
      url: "https://t.me/ingacademy_magas/614",
      role: "Лектор",
    },
    {
      title: "Выступления на профильных конференциях",
      venue: "IT-конференции и митапы",
      description:
        "Темы — Node.js, микросервисы, разработка с AI, переход с фронтенда в fullstack, наставничество.",
      role: "Спикер",
    },
  ],
  ctaArticles: "Читать на Хабре",
};

const publicationsEn: PublicationsData = {
  stats: {
    talks: "10+",
    articles: "5+",
    yearsTeaching: "2",
  },
  statsLabels: {
    talks: "talks and lectures",
    articles: "articles on Habr and vc.ru",
    yearsTeaching: "years mentoring",
  },
  articles: [
    {
      title: "A critical take on freelancing — a guide built on 6 years of experience",
      source: "Habr",
      year: "2025",
      url: "https://habr.com/ru/articles/913984/",
      summary:
        "An in-depth look at freelancing as a career path: what works, what does not, and how to play the long game — with numbers and real cases.",
    },
    {
      title: "Building a commercial car rental app in Dubai",
      source: "Habr",
      year: "2023",
      url: "https://habr.com/p/727810/",
      summary:
        "A product development case study for an international MVP: architecture, integrations, and launch takeaways.",
    },
    {
      title: "Uber for tailors: preparing and launching an MVP",
      source: "vc.ru",
      year: "2023",
      url: "https://vc.ru/u/1301474-evgeniy-ivanov/682696-uber-dlya-portnyh-kak-podgotovit-i-zapustit-mvp-na-bubble-io",
      summary:
        "Launching a services marketplace MVP: from idea to first users and growth metrics.",
    },
  ],
  talks: [
    {
      title: "Expert & Lecturer",
      venue: "School 21 (Sber)",
      description:
        "Open lectures and expert sessions for School 21 campus students on fullstack development, backend architecture, and market readiness.",
      url: "https://t.me/ingacademy_magas/614",
      role: "Lecturer",
    },
    {
      title: "Talks at industry conferences",
      venue: "IT conferences and meetups",
      description:
        "Topics — Node.js, microservices, AI-assisted development, frontend to fullstack transition, mentoring.",
      role: "Speaker",
    },
  ],
  ctaArticles: "Read on Habr",
};

export function getPublications(lang: Lang): PublicationsData {
  return lang === "ru" ? publicationsRu : publicationsEn;
}
