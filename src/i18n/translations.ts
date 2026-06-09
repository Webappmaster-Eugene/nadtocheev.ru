/**
 * UI-строки для двуязычного сайта.
 * Все текстовые строки интерфейса вынесены сюда для удобства перевода.
 */

export type Lang = "ru" | "en";

export interface Translation {
  /* Meta / SEO */
  meta: {
    title: string;
    description: string;
    ogLocale: string;
    htmlLang: string;
  };

  /* Navigation */
  nav: {
    about: string;
    expertise: string;
    experience: string;
    projects: string;
    ai: string;
    coding: string;
    publications: string;
    mentoring: string;
    services: string;
    contacts: string;
    contact: string;
    switchLang: string;
    switchLangLabel: string;
    switchThemeLabel: string;
    openMenu: string;
  };

  /* Hero */
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    tagline: string;
    ctaTelegram: string;
    ctaGithub: string;
    ctaHabr: string;
    metricsYears: string;
    metricsVisits: string;
    metricsRps: string;
    metricsServices: string;
  };

  /* About */
  about: {
    title: string;
    paragraphs: string[];
  };

  /* Expertise */
  expertise: {
    title: string;
    subtitle: string;
  };

  /* Experience */
  experience: {
    title: string;
    subtitle: string;
    present: string;
  };

  /* Projects */
  projects: {
    title: string;
  };

  /* AI */
  ai: {
    title: string;
    subtitle: string;
    heading: string;
    description: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };

  /* Coding Challenges */
  coding: {
    title: string;
    subtitle: string;
    description: string;
    leetcodeLabel: string;
    codewarsLabel: string;
  };

  /* Mentoring */
  mentoring: {
    title: string;
    subtitle: string;
    description: string;
    platformsTitle: string;
    activitiesTitle: string;
    channelsTitle: string;
    channelsDesc: string;
    ambassadorTitle: string;
    ambassadorDesc: string;
    freelanceTitle: string;
    freelanceDesc: string;
  };

  /* Publications */
  publications: {
    title: string;
    subtitle: string;
    description: string;
    articlesTitle: string;
    talksTitle: string;
    readMore: string;
  };

  /* Services */
  services: {
    title: string;
    subtitle: string;
    description: string;
    priceLabel: string;
    includesLabel: string;
    note: string;
  };

  /* Startups */
  startups: {
    title: string;
    subtitle: string;
    description: string;
  };

  /* Contacts */
  contacts: {
    title: string;
    subtitle: string;
    phone: string;
    preferredContact: string;
  };

  /* Footer */
  footer: {
    rights: string;
  };

  /* Accessibility */
  a11y: {
    mainNav: string;
    opensNewTab: string;
    skipToContent: string;
  };
}

export const translations: Record<Lang, Translation> = {
  ru: {
    meta: {
      title: "Евгений Надточеев - Fullstack-разработчик | Backend, DevOps, AI",
      description:
        "Fullstack-разработчик с 5 годами опыта. Backend (Node.js, Go), DevOps (Kubernetes, Docker, CI/CD), Frontend (React, Vue). Highload-системы в финтехе и аналитике недвижимости. Микросервисная архитектура, AI/LLM интеграции.",
      ogLocale: "ru_RU",
      htmlLang: "ru",
    },
    nav: {
      about: "Обо мне",
      expertise: "Экспертиза",
      experience: "Опыт",
      projects: "Проекты",
      ai: "AI",
      coding: "Алгоритмы",
      publications: "Публикации",
      mentoring: "Менторство",
      services: "Услуги",
      contacts: "Контакты",
      contact: "Связаться",
      switchLang: "EN",
      switchLangLabel: "Switch to English",
      switchThemeLabel: "Переключить тему",
      openMenu: "Открыть меню навигации",
    },
    hero: {
      badge: "Открыт к предложениям",
      title: "Fullstack-разработчик",
      subtitle: "Backend & DevOps & AI",
      tagline:
        "Строю highload-системы на Node.js и Go. Внедряю микросервисную архитектуру, настраиваю инфраструктуру и автоматизирую процессы с помощью AI.",
      ctaTelegram: "Написать в Telegram",
      ctaGithub: "GitHub",
      ctaHabr: "Habr Career",
      metricsYears: "лет опыта",
      metricsVisits: "посещений/сутки",
      metricsRps: "rps в production",
      metricsServices: "микросервисов",
    },
    about: {
      title: "Обо мне",
      paragraphs: [
        'С ноября 2024 - fullstack-разработчик в <a href="https://bnmap.pro" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">bnmap.pro</a>, b2b-платформе аналитики недвижимости №1 в России. Поддерживаю микросервисную архитектуру под нагрузкой <strong class="text-text">40K+ DAU и 2000 rps</strong>. Ключевые вехи: построил полный observability-стек на OpenTelemetry + Tempo + Loki + Prometheus + Grafana (4 дашборда, 64 панели, алерты в Telegram); перевёл proxy/scraper/notification/admin/cms-сервисы с Express на Fastify со снижением latency в 2× по k6; спроектировал и реализовал <strong class="text-text">Vike+React SSR-витрину</strong> с ролевым paywall и собственным ИИ-чатом на RAG со стримингом ответов; внедрил pgvector в PostgreSQL под embeddings; поднял парсер 40 источников на Fastify+Playwright с обходом антибот-защиты; интегрировал Robokassa с подпиской 30 дней; внедрил Drizzle ORM с общим schema-пакетом и выделил shared-инфраструктуру (contracts, logger, telemetry) для всей монорепы.',
        'С ноября 2022 по ноябрь 2024 - fullstack-разработчик в <strong class="text-text">ООО Форвард</strong> на финтех-аутсорсе для крупного бигтеха. В команде из трёх человек довёл продукт до регистрации в качестве <strong class="text-text">Оператора Финансовой Платформы ЦБ РФ</strong>. Спроектировал финансовое ядро (wallet) с оптимистичной блокировкой по version и атомарными Prisma-транзакциями; развернул outbox-паттерн поверх Kafka с DLQ и retry/backoff через Redis, что исключило двойные зачисления и потерянные выводы; перевёл клиент с REST на <strong class="text-text">GraphQL Federation</strong> (Apollo Client + Mercurius на Fastify), заменив 20 REST-интеграций одним типобезопасным эндпоинтом; настроил gRPC-контракты через buf + ts-proto с OTel-метриками на каждый вызов; владел инфраструктурой: Helm-чарты в Kubernetes, GitOps через FluxCD, GitLab CI с multistage pipeline.',
        'С августа 2021 по ноябрь 2022 - fullstack-разработчик в <strong class="text-text">Systems-fd</strong>: системная интеграция, IT-консалтинг, финтех, маркетинг. Перевёл проект с jsdoc на TypeScript и Zod-контракты, реализовал интеграции с Telegram, Google Maps, amoCRM, Stripe, Kinescope, Яндекс.Картами, интегрировал Robokassa с подпиской и webhook-обработкой. Внедрил полноценный DI на NestJS, систему учёта и классификации ошибок, внутреннюю админ-панель на React Admin и модуль email-уведомлений на React Email.',
        'В разработке придерживаюсь нескольких принципов: внятная архитектура без лишней магии, строгий TypeScript с Zod-контрактами, интеграционные тесты и понятная наблюдаемость через OpenTelemetry. Был <strong class="text-text">тимлидом небольшой команды</strong>; провожу технические интервью при найме (несколько десятков проведённых) - оцениваю архитектурное мышление, code review, фундамент по Node.js, SQL и system design. AI-инструменты (Claude Code, Cursor, собственные RAG-пайплайны) - часть ежедневного процесса.',
        'Параллельно развиваю собственные продукты: <a href="https://podbor-minuta.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">СПИН</a> - сервис мониторинга цен на новостройки Москвы с алертами в Telegram, и <a href="https://alibaba.hhos.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">SMETAS</a> - SaaS-платформу для строительных смет. Веду менторскую практику: эксперт и лектор в <strong class="text-text">Школе 21 (Сбер)</strong>, консультирую на Solvery, GetMentor, EasyOffer; провёл свыше 30 платных и 50 бесплатных консультаций. Английский - <strong class="text-text">B2</strong>, рабочий формат - удалённо или гибрид из Москвы, готов к переезду. Резюме - на <a href="https://career.habr.com/webappmaster" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Habr Career</a>, предпочтительный канал связи - <a href="https://t.me/eugene_nadtocheev" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Telegram</a>.',
      ],
    },
    expertise: {
      title: "Области экспертизы",
      subtitle: "Ключевые направления, в которых я работаю",
    },
    experience: {
      title: "Коммерческий опыт",
      subtitle: "Карьерный путь и ключевые достижения",
      present: "настоящее время",
    },
    projects: {
      title: "Ключевые проекты",
    },
    ai: {
      title: "AI & Automation",
      subtitle: "AI-first подход в разработке и продуктах",
      heading: "AI как мультипликатор продуктивности",
      description:
        "Активно интегрирую LLM и AI-инструменты в повседневную разработку и в продукты. Использую AI не как игрушку, а как инструмент, который кратно увеличивает скорость и качество работы.",
      feature1Title: "RAG-пайплайны",
      feature1Desc:
        "Retrieval-Augmented Generation для поиска и генерации на основе собственных данных",
      feature2Title: "AI-ассистенты в IDE",
      feature2Desc:
        "Claude Code, Cursor - ежедневные инструменты для генерации, рефакторинга и code review",
      feature3Title: "Векторные БД и Embeddings",
      feature3Desc:
        "Семантический поиск, хранение и работа с векторными представлениями данных",
    },
    coding: {
      title: "Алгоритмы и задачи",
      subtitle: "Решаю задачи для удовольствия и развития алгоритмического мышления",
      description: "Люблю решать алгоритмические задачи на LeetCode и Codewars - это помогает поддерживать остроту мышления и глубокое понимание структур данных.",
      leetcodeLabel: "LeetCode",
      codewarsLabel: "Codewars",
    },
    mentoring: {
      title: "Менторство и преподавание",
      subtitle: "Делюсь опытом и помогаю расти другим разработчикам",
      description: "Менторю по собственной системе и роадмапам через личный сайт, Telegram и сторонние площадки. Провожу мок-собеседования и карьерные консультации для fullstack-разработчиков.",
      platformsTitle: "Площадки",
      activitiesTitle: "Что я делаю",
      channelsTitle: "Telegram-каналы",
      channelsDesc: "Веду каналы о разработке и карьере",
      ambassadorTitle: "Амбассадор",
      ambassadorDesc: "Амбассадор платформы PreOffer",
      freelanceTitle: "Фриланс-опыт",
      freelanceDesc: "В прошлом - фрилансер на биржах",
    },
    publications: {
      title: "Публикации и выступления",
      subtitle: "Статьи, лекции и экспертная активность",
      description:
        "Пишу технические и карьерные статьи на Хабре и vc.ru, выступаю экспертом и лектором в Школе 21 (Сбер), на профильных IT-конференциях и митапах, веду Telegram-каналы о разработке и карьере.",
      articlesTitle: "Статьи",
      talksTitle: "Выступления и экспертиза",
      readMore: "Читать",
    },
    services: {
      title: "Платные услуги",
      subtitle: "Карьерные консультации и мок-собеседования для разработчиков",
      description:
        "Помогаю fullstack- и backend-разработчикам структурно расти в карьере и уверенно проходить технические интервью. Формат - онлайн, удобное время согласуем в Telegram.",
      priceLabel: "Стоимость",
      includesLabel: "Что входит",
      note: "Оплата по факту проведения. Для постоянных клиентов и студентов - индивидуальные условия.",
    },
    startups: {
      title: "Стартапы",
      subtitle: "Создатель собственных проектов",
      description: "СПИН - мониторинг цен на новостройки Москвы. SMETAS - SaaS для строительных смет.",
    },
    contacts: {
      title: "Контакты",
      subtitle: "Свяжитесь со мной удобным способом",
      phone: "Телефон",
      preferredContact: "предпочитаемый способ связи",
    },
    footer: {
      rights: "Все права защищены.",
    },
    a11y: {
      mainNav: "Основная навигация",
      opensNewTab: "(откроется в новой вкладке)",
      skipToContent: "Перейти к содержимому",
    },
  },

  en: {
    meta: {
      title: "Evgeny Nadtocheev - Fullstack Developer | Backend, DevOps, AI",
      description:
        "Fullstack Developer with 5 years of experience. Backend (Node.js, Go), DevOps (Kubernetes, Docker, CI/CD), Frontend (React, Vue). High-load systems in fintech and real estate analytics. Microservice architecture, AI/LLM integrations.",
      ogLocale: "en_US",
      htmlLang: "en",
    },
    nav: {
      about: "About",
      expertise: "Expertise",
      experience: "Experience",
      projects: "Projects",
      ai: "AI",
      coding: "Algorithms",
      publications: "Publications",
      mentoring: "Mentoring",
      services: "Services",
      contacts: "Contacts",
      contact: "Get in Touch",
      switchLang: "RU",
      switchLangLabel: "Переключить на русский",
      switchThemeLabel: "Toggle theme",
      openMenu: "Open navigation menu",
    },
    hero: {
      badge: "Open to opportunities",
      title: "Fullstack Developer",
      subtitle: "Backend & DevOps & AI",
      tagline:
        "I build high-load systems on Node.js and Go. I implement microservice architectures, set up infrastructure, and automate processes with AI.",
      ctaTelegram: "Message on Telegram",
      ctaGithub: "GitHub",
      ctaHabr: "Habr Career",
      metricsYears: "years of experience",
      metricsVisits: "daily visits",
      metricsRps: "rps in production",
      metricsServices: "microservices",
    },
    about: {
      title: "About Me",
      paragraphs: [
        'Since November 2024 - fullstack developer at <a href="https://bnmap.pro" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">bnmap.pro</a>, the #1 B2B real estate analytics platform in Russia. Operating microservice architecture under <strong class="text-text">40K+ DAU and 2,000 rps</strong>. Key milestones: built the full observability stack on OpenTelemetry + Tempo + Loki + Prometheus + Grafana (4 dashboards, 64 panels, Telegram alerts); migrated proxy/scraper/notification/admin/cms services from Express to Fastify with 2× latency reduction on k6; designed and shipped a <strong class="text-text">Vike+React SSR storefront</strong> with role-based paywall and an in-house RAG-powered AI chat with streaming responses; rolled out pgvector in PostgreSQL for embeddings; set up a 40-source scraper on Fastify+Playwright with anti-bot bypass; integrated Robokassa with a 30-day subscription; adopted Drizzle ORM with a shared schema package and extracted shared infrastructure (contracts, logger, telemetry) for the whole monorepo.',
        'November 2022 to November 2024 - fullstack developer at <strong class="text-text">Forward LLC</strong> on fintech outsourcing for a major bigtech. In a team of three, took the product through Central Bank of Russia review until it was registered as a <strong class="text-text">financial platform operator</strong>. Designed the financial core (wallet) with optimistic balance locking via version and atomic Prisma transactions; rolled out an outbox pattern on Kafka with DLQ and retry/backoff via Redis, ruling out double charges and lost payouts; migrated the client from REST to <strong class="text-text">GraphQL Federation</strong> (Apollo Client + Mercurius on Fastify), replacing 20 REST integrations with a single type-safe endpoint; set up gRPC contracts via buf + ts-proto with OTel metrics per call; owned the infrastructure: Helm charts to Kubernetes, GitOps via FluxCD, GitLab CI multistage pipeline.',
        'August 2021 to November 2022 - fullstack developer at <strong class="text-text">Systems-fd</strong>: system integration, IT consulting, fintech, marketing. Migrated the project from jsdoc to TypeScript and Zod contracts, built integrations with Telegram, Google Maps, amoCRM, Stripe, Kinescope, Yandex Maps, integrated Robokassa with subscription handling and webhook processing. Implemented full Dependency Injection on NestJS, an error tracking and classification system, an internal React Admin admin panel, and an email module on React Email.',
        'My approach is anchored on a few principles: clear architecture without unnecessary magic, strict TypeScript with Zod contracts, integration tests, and proper observability through OpenTelemetry. Acted as a <strong class="text-text">tech lead for a small team</strong>; conduct technical interviews on the hiring side (dozens to date) - evaluating architectural thinking, code review, and Node.js / SQL / system design fundamentals. AI tooling (Claude Code, Cursor, in-house RAG pipelines) is part of the daily workflow.',
        'In parallel I develop my own products: <a href="https://podbor-minuta.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">SPIN</a> - a Moscow new-build price tracker with Telegram alerts, and <a href="https://alibaba.hhos.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">SMETAS</a> - a SaaS platform for construction estimates. Run an active mentoring practice: expert and lecturer at <strong class="text-text">School 21 (Sber)</strong>, mentor on Solvery, GetMentor, EasyOffer; delivered over 30 paid and 50+ free sessions. English - <strong class="text-text">B2</strong>, work format - remote or hybrid from Moscow, open to relocation. CV on <a href="https://career.habr.com/webappmaster" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Habr Career</a>, preferred contact channel - <a href="https://t.me/eugene_nadtocheev" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Telegram</a>.',
      ],
    },
    expertise: {
      title: "Areas of Expertise",
      subtitle: "Key domains I work in",
    },
    experience: {
      title: "Professional Experience",
      subtitle: "Career path and key achievements",
      present: "present",
    },
    projects: {
      title: "Key Projects",
    },
    ai: {
      title: "AI & Automation",
      subtitle: "AI-first approach in development and products",
      heading: "AI as a productivity multiplier",
      description:
        "I actively integrate LLMs and AI tools into everyday development and products. I use AI not as a toy, but as a tool that significantly accelerates speed and quality of work.",
      feature1Title: "RAG Pipelines",
      feature1Desc:
        "Retrieval-Augmented Generation for search and content generation based on proprietary data",
      feature2Title: "AI Assistants in IDE",
      feature2Desc:
        "Claude Code, Cursor - daily tools for code generation, refactoring, and code review",
      feature3Title: "Vector Databases & Embeddings",
      feature3Desc:
        "Semantic search, storage, and working with vector representations of data",
    },
    coding: {
      title: "Algorithms & Challenges",
      subtitle: "Solving problems for fun and to sharpen algorithmic thinking",
      description: "I enjoy solving algorithmic problems on LeetCode and Codewars - it keeps my thinking sharp and deepens my understanding of data structures.",
      leetcodeLabel: "LeetCode",
      codewarsLabel: "Codewars",
    },
    mentoring: {
      title: "Mentoring & Teaching",
      subtitle: "Sharing experience and helping other developers grow",
      description: "I mentor through my own system and roadmaps via personal website, Telegram, and third-party platforms. I conduct mock interviews and career consultations for fullstack developers.",
      platformsTitle: "Platforms",
      activitiesTitle: "What I do",
      channelsTitle: "Telegram Channels",
      channelsDesc: "Running channels about development and career",
      ambassadorTitle: "Ambassador",
      ambassadorDesc: "Ambassador of the PreOffer platform",
      freelanceTitle: "Freelance Experience",
      freelanceDesc: "Former freelancer on exchanges",
    },
    publications: {
      title: "Publications & Talks",
      subtitle: "Articles, lectures, and expert engagements",
      description:
        "I write technical and career articles on Habr and vc.ru, serve as an expert and lecturer at School 21 (Sber) and at IT conferences and meetups, and run Telegram channels about development and career.",
      articlesTitle: "Articles",
      talksTitle: "Talks & Expert Roles",
      readMore: "Read",
    },
    services: {
      title: "Paid Services",
      subtitle: "Career consultations and mock interviews for developers",
      description:
        "I help fullstack and backend engineers grow their careers and confidently pass technical interviews. Format - online, exact time agreed via Telegram.",
      priceLabel: "Price",
      includesLabel: "What's included",
      note: "Payment after the session. Returning clients and students - flexible terms available.",
    },
    startups: {
      title: "Startups",
      subtitle: "Creator of own products",
      description: "SPIN - Moscow new-build price tracker. SMETAS - SaaS for construction estimates.",
    },
    contacts: {
      title: "Contacts",
      subtitle: "Get in touch through any convenient channel",
      phone: "Phone",
      preferredContact: "preferred contact method",
    },
    footer: {
      rights: "All rights reserved.",
    },
    a11y: {
      mainNav: "Main navigation",
      opensNewTab: "(opens in new tab)",
      skipToContent: "Skip to content",
    },
  },
};

/** Получить перевод по языку */
export function t(lang: Lang): Translation {
  return translations[lang];
}

/** Получить URL для альтернативной языковой версии */
export function getAlternateUrl(lang: Lang, base: string): string {
  return lang === "ru" ? `${base}/en/` : `${base}/`;
}

/** Получить URL для текущей языковой версии */
export function getLangUrl(lang: Lang): string {
  return lang === "ru" ? "/" : "/en/";
}
