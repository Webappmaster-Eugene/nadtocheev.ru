/**
 * Публикации и выступления - двуязычная версия.
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
      title: "Рациональный подход к фрилансу. Критикуешь? Предлагай",
      source: "Хабр",
      year: "2025",
      url: "https://habr.com/ru/articles/913984/",
      summary:
        "Подробный разбор фриланса как карьерного пути: что работает, что нет, на чём строится длинная игра - с цифрами и кейсами.",
    },
    {
      title: "Что нам стоит на Bubble построить (+ мнение о возможности симбиоза кода и nocode)",
      source: "Хабр",
      year: "2023",
      url: "https://habr.com/ru/articles/727810/",
      summary:
        "Кейс MVP мобильного приложения аренды спорткаров в Дубае на Bubble: архитектура, интеграции, выводы по запуску и где no-code упирается в потолок.",
    },
    {
      title: "Uber для портных: как подготовить и запустить MVP на Bubble.io",
      source: "vc.ru",
      year: "2023",
      url: "https://vc.ru/id1301474/682696-uber-dlya-portnyh-kak-podgotovit-i-zapustit-mvp-na-bubbleio",
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
        "Темы - Node.js, микросервисы, разработка с AI, переход с фронтенда в fullstack, наставничество.",
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
      title: "A rational approach to freelancing: if you criticize, propose",
      source: "Habr",
      year: "2025",
      url: "https://habr.com/ru/articles/913984/",
      summary:
        "An in-depth look at freelancing as a career path: what works, what does not, and how to play the long game - with numbers and real cases.",
    },
    {
      title: "What it takes to build on Bubble (+ thoughts on combining code and no-code)",
      source: "Habr",
      year: "2023",
      url: "https://habr.com/ru/articles/727810/",
      summary:
        "Case study of a Dubai sports car rental app MVP built on Bubble: architecture, integrations, launch takeaways, and where no-code hits its limits.",
    },
    {
      title: "Uber for tailors: how to prepare and launch an MVP on Bubble.io",
      source: "vc.ru",
      year: "2023",
      url: "https://vc.ru/id1301474/682696-uber-dlya-portnyh-kak-podgotovit-i-zapustit-mvp-na-bubbleio",
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
        "Topics - Node.js, microservices, AI-assisted development, frontend to fullstack transition, mentoring.",
      role: "Speaker",
    },
  ],
  ctaArticles: "Read on Habr",
};

export function getPublications(lang: Lang): PublicationsData {
  return lang === "ru" ? publicationsRu : publicationsEn;
}
