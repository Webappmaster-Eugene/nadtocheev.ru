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
    stack: string;
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
    subtitle: string;
    paragraphs: string[];
  };

  /* Expertise */
  expertise: {
    title: string;
    subtitle: string;
  };

  /* Tech Stack */
  stack: {
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
    subtitle: string;
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
      title: "Евгений Надточеев — Fullstack-разработчик | Backend, DevOps, AI",
      description:
        "Fullstack-разработчик с 5 годами опыта. Backend (Node.js, Go), DevOps (Kubernetes, Docker, CI/CD), Frontend (React, Vue). Highload-системы в финтехе и аналитике недвижимости. Микросервисная архитектура, AI/LLM интеграции.",
      ogLocale: "ru_RU",
      htmlLang: "ru",
    },
    nav: {
      about: "Обо мне",
      expertise: "Экспертиза",
      stack: "Стек",
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
      subtitle: "Несколько слов от первого лица — без канцелярита",
      paragraphs: [
        'Привет, меня зовут <strong class="text-text">Женя</strong>. Пятый год пишу highload-сервисы на <strong class="text-text">Node.js</strong> — фокус <strong class="text-accent">~80% на бэке</strong>, остальное делю между фронтом (React, Vue), DevOps и AI-автоматизациями. Сейчас работаю в <a href="https://bnmap.pro" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">bnmap.pro</a> — это топ-1 в России платформа аналитики недвижимости: в проде стабильно держим <strong class="text-text">200K+ заходов в день</strong> и <strong class="text-text">2000 rps</strong>.',
        'До этого 2 года в <strong class="text-text">финтехе</strong> на аутсорсе для крупного бигтеха (ООО Форвард): wallet + платёжный шлюз (карты, крипта, fiat, онлайн-кассы), outbox-паттерн поверх Kafka, миграция клиента с REST на GraphQL Federation. Командой из 3 человек довели продукт до регистрации как <strong class="text-text">ОФП ЦБ РФ</strong>. Ещё раньше — системная интеграция в <strong class="text-text">Systems-fd</strong>, где я по совместительству был фронтом, бэком и devops в одном лице.',
        'Что мне важно в работе: внятная архитектура без лишней магии, строгий TypeScript с zod-контрактами, интеграционные тесты, которые ловят баги до прода, и понятные метрики через OpenTelemetry. Микросервисы, Kafka, Redis, gRPC — не как чек-лист в резюме, а как инструменты под конкретную задачу. <strong class="text-text">AI использую ежедневно</strong> (Claude Code, Cursor, RAG-пайплайны): это уже не игрушка, а реальное ускорение в пару раз.',
        'Был <strong class="text-text">тимлидом небольшой команды</strong> и активно <strong class="text-text">провожу технические собеседования</strong> с кандидатами в компанию — на стороне найма закрыл уже несколько десятков интервью. Оцениваю архитектурное мышление, code review, фундамент по Node.js, SQL и system design; декомпозирую задачи и разруливаю блокеры в команде.',
        'Параллельно делаю свои продукты: <a href="https://podbor-minuta.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">СПИН</a> — сервис мониторинга цен на новостройки Москвы с алертами в Telegram, и <a href="https://alibaba.hhos.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">SMETAS</a> — SaaS для составления строительных смет. Активно <strong class="text-text">менторю</strong>: эксперт и лектор в <strong class="text-text">Школе 21 (Сбер)</strong>, консультирую на Solvery, GetMentor, EasyOffer, пишу на Хабре и vc.ru. За плечами 30+ платных и 50+ бесплатных консультаций — реально кайфую, когда ребята закрывают первые офферы.',
        'По мелочи: английский — <strong class="text-text">B2</strong>, готов к удалёнке и переезду. Удобнее всего написать в <a href="https://t.me/eugene_nadtocheev" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Telegram</a>. Резюме — на <a href="https://career.habr.com/webappmaster" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Habr Career</a>, портал моих проектов — <a href="https://webappmaster.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">webappmaster.ru</a>.',
      ],
    },
    expertise: {
      title: "Области экспертизы",
      subtitle: "Ключевые направления, в которых я работаю",
    },
    stack: {
      title: "Технологический стек",
      subtitle: "Инструменты и технологии, с которыми работаю ежедневно",
    },
    experience: {
      title: "Коммерческий опыт",
      subtitle: "Карьерный путь и ключевые достижения",
      present: "настоящее время",
    },
    projects: {
      title: "Ключевые проекты",
      subtitle: "Проекты, которыми горжусь",
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
        "Claude Code, Cursor — ежедневные инструменты для генерации, рефакторинга и code review",
      feature3Title: "Векторные БД и Embeddings",
      feature3Desc:
        "Семантический поиск, хранение и работа с векторными представлениями данных",
    },
    coding: {
      title: "Алгоритмы и задачи",
      subtitle: "Решаю задачи для удовольствия и развития алгоритмического мышления",
      description: "Люблю решать алгоритмические задачи на LeetCode и Codewars — это помогает поддерживать остроту мышления и глубокое понимание структур данных.",
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
      freelanceDesc: "В прошлом — фрилансер на биржах",
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
        "Помогаю fullstack- и backend-разработчикам структурно расти в карьере и уверенно проходить технические интервью. Формат — онлайн, удобное время согласуем в Telegram.",
      priceLabel: "Стоимость",
      includesLabel: "Что входит",
      note: "Оплата по факту проведения. Для постоянных клиентов и студентов — индивидуальные условия.",
    },
    startups: {
      title: "Стартапы",
      subtitle: "Создатель собственных проектов",
      description: "СПИН — мониторинг цен на новостройки Москвы. SMETAS — SaaS для строительных смет.",
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
      title: "Evgeny Nadtocheev — Fullstack Developer | Backend, DevOps, AI",
      description:
        "Fullstack Developer with 5 years of experience. Backend (Node.js, Go), DevOps (Kubernetes, Docker, CI/CD), Frontend (React, Vue). High-load systems in fintech and real estate analytics. Microservice architecture, AI/LLM integrations.",
      ogLocale: "en_US",
      htmlLang: "en",
    },
    nav: {
      about: "About",
      expertise: "Expertise",
      stack: "Tech Stack",
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
      subtitle: "A few words in my own voice — without the corporate filler",
      paragraphs: [
        'Hi, I\'m <strong class="text-text">Eugene</strong>. I\'ve been writing high-load <strong class="text-text">Node.js</strong> services for five years now — about <strong class="text-accent">~80% backend</strong>, with the rest split between frontend (React, Vue), DevOps, and AI automations. These days I\'m at <a href="https://bnmap.pro" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">bnmap.pro</a>, the #1 real estate analytics platform in Russia: we keep <strong class="text-text">200K+ daily visits</strong> and <strong class="text-text">2,000 rps</strong> running in production.',
        'Before that I spent 2 years in <strong class="text-text">fintech</strong> as an outsourced engineer for a major bigtech (Forward LLC): wallet and payment gateway (cards, crypto, fiat, online registers), an outbox pattern on Kafka, migrating the client from REST to GraphQL Federation. With a team of 3 we took the product through review until it was registered as a <strong class="text-text">Central Bank financial platform operator</strong>. Earlier still — system integration at <strong class="text-text">Systems-fd</strong>, where I doubled as frontend, backend, and devops in a one-person band.',
        'What matters to me in the craft: clear architecture without unnecessary magic, strict TypeScript with zod contracts, integration tests that catch bugs before production, and observability via OpenTelemetry. Microservices, Kafka, Redis, gRPC — not as a resume checklist, but as tools picked for the problem at hand. <strong class="text-text">AI is a daily driver</strong> (Claude Code, Cursor, RAG pipelines): it\'s no longer a toy, it\'s a real 2× speed-up.',
        'I\'ve led <strong class="text-text">a small engineering team</strong> and regularly <strong class="text-text">run technical interviews</strong> as part of the hiring side — dozens of them under my belt by now. I evaluate architectural thinking, code review, the Node.js / SQL fundamentals and system design, break tasks down, and unblock teammates day to day.',
        'On the side I build my own products: <a href="https://podbor-minuta.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">SPIN</a> — a Moscow new-build price tracker with Telegram alerts, and <a href="https://alibaba.hhos.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">SMETAS</a> — a SaaS for construction estimates. I also <strong class="text-text">mentor</strong>: expert and lecturer at <strong class="text-text">School 21 (Sber)</strong>, one-on-ones on Solvery, GetMentor, EasyOffer, plus articles on Habr and vc.ru. Over 30 paid and 50+ free sessions so far — I genuinely enjoy watching folks land their first offers.',
        'A few practicalities: English is <strong class="text-text">B2</strong>, I\'m open to remote and relocation. The fastest way to reach me is <a href="https://t.me/eugene_nadtocheev" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Telegram</a>. CV on <a href="https://career.habr.com/webappmaster" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Habr Career</a>, projects portal at <a href="https://webappmaster.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">webappmaster.ru</a>.',
      ],
    },
    expertise: {
      title: "Areas of Expertise",
      subtitle: "Key domains I work in",
    },
    stack: {
      title: "Tech Stack",
      subtitle: "Tools and technologies I use daily",
    },
    experience: {
      title: "Professional Experience",
      subtitle: "Career path and key achievements",
      present: "present",
    },
    projects: {
      title: "Key Projects",
      subtitle: "Projects I am proud of",
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
        "Claude Code, Cursor — daily tools for code generation, refactoring, and code review",
      feature3Title: "Vector Databases & Embeddings",
      feature3Desc:
        "Semantic search, storage, and working with vector representations of data",
    },
    coding: {
      title: "Algorithms & Challenges",
      subtitle: "Solving problems for fun and to sharpen algorithmic thinking",
      description: "I enjoy solving algorithmic problems on LeetCode and Codewars — it keeps my thinking sharp and deepens my understanding of data structures.",
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
        "I help fullstack and backend engineers grow their careers and confidently pass technical interviews. Format — online, exact time agreed via Telegram.",
      priceLabel: "Price",
      includesLabel: "What's included",
      note: "Payment after the session. Returning clients and students — flexible terms available.",
    },
    startups: {
      title: "Startups",
      subtitle: "Creator of own products",
      description: "SPIN — Moscow new-build price tracker. SMETAS — SaaS for construction estimates.",
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
