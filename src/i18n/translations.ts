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
    mentoring: string;
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
    madeWith: string;
  };
}

export const translations: Record<Lang, Translation> = {
  ru: {
    meta: {
      title: "Евгений Надточеев — Fullstack-разработчик | Backend, DevOps, AI",
      description:
        "Fullstack-разработчик с 5+ годами опыта. Backend (Node.js, Go), DevOps (Kubernetes, Docker, CI/CD), Frontend (React, Vue). Highload-системы в финтехе и аналитике недвижимости. Микросервисная архитектура, AI/LLM интеграции.",
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
      mentoring: "Менторство",
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
      metricsYears: "лет опыта",
      metricsVisits: "посещений/сутки",
      metricsRps: "rps в production",
      metricsServices: "микросервисов",
    },
    about: {
      title: "Обо мне",
      subtitle: "Кратко о подходе и опыте",
      paragraphs: [
        'Fullstack-разработчик с <strong class="text-text">5+ годами коммерческого опыта</strong>. Специализируюсь на <strong class="text-text">backend-разработке</strong> (Node.js, Go) и <strong class="text-text">DevOps</strong> (Kubernetes, Docker, CI/CD). Фокус — <strong class="text-accent">80% backend</strong>.',
        'Работал в <strong class="text-text">финтехе</strong> (платёжные системы, криптовалюты, биллинг) и <strong class="text-text">аналитике недвижимости</strong> (топ-1 платформа в РФ) с нагрузкой до 50 000 посещений в сутки. Строил микросервисные архитектуры, внедрял Event-Driven подходы, настраивал мониторинг и distributed tracing.',
        'Также работаю с <strong class="text-text">Telegram-ботами</strong>, <strong class="text-text">Telegram Mini App</strong>, <strong class="text-text">React Native</strong> и <strong class="text-text">Electron</strong>. Активно использую <strong class="text-text">AI в разработке</strong>: пишу RAG-пайплайны, работаю с LLM, Claude Code, Cursor. Веду собственный проектный портал — <a href="https://webappmaster.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">webappmaster.ru</a>.',
        'Создатель <strong class="text-text">двух стартапов</strong>, автор open-source проектов. Управлял командами разработки, ценю Agile, результат для бизнеса и чистый масштабируемый код. Английский — <strong class="text-text">B1</strong>.',
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
    startups: {
      title: "Стартапы",
      subtitle: "Создатель собственных проектов",
      description: "Являюсь создателем 2 стартапов и нескольких open-source проектов",
    },
    contacts: {
      title: "Контакты",
      subtitle: "Свяжитесь со мной удобным способом",
      phone: "Телефон",
      preferredContact: "предпочитаемый способ связи",
    },
    footer: {
      rights: "Все права защищены.",
      madeWith: "Сделано с",
    },
  },

  en: {
    meta: {
      title: "Evgeny Nadtocheev — Fullstack Developer | Backend, DevOps, AI",
      description:
        "Fullstack Developer with 5+ years of experience. Backend (Node.js, Go), DevOps (Kubernetes, Docker, CI/CD), Frontend (React, Vue). High-load systems in fintech and real estate analytics. Microservice architecture, AI/LLM integrations.",
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
      mentoring: "Mentoring",
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
      metricsYears: "years of experience",
      metricsVisits: "daily visits",
      metricsRps: "rps in production",
      metricsServices: "microservices",
    },
    about: {
      title: "About Me",
      subtitle: "A brief overview of my approach and experience",
      paragraphs: [
        'Fullstack Developer with <strong class="text-text">5+ years of commercial experience</strong>. I specialize in <strong class="text-text">backend development</strong> (Node.js, Go) and <strong class="text-text">DevOps</strong> (Kubernetes, Docker, CI/CD). Focus — <strong class="text-accent">80% backend</strong>.',
        'I have worked in <strong class="text-text">fintech</strong> (payment systems, cryptocurrency, billing) and <strong class="text-text">real estate analytics</strong> (the #1 platform in Russia) handling up to 50,000 daily visitors. I have designed microservice architectures, implemented Event-Driven approaches, and set up monitoring and distributed tracing.',
        'I also work with <strong class="text-text">Telegram Bots</strong>, <strong class="text-text">Telegram Mini App</strong>, <strong class="text-text">React Native</strong>, and <strong class="text-text">Electron</strong>. I actively leverage <strong class="text-text">AI in development</strong>: building RAG pipelines, working with LLMs, Claude Code, and Cursor. I run my own project portal — <a href="https://webappmaster.ru" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">webappmaster.ru</a>.',
        'Founder of <strong class="text-text">two startups</strong>, author of open-source projects. I have managed development teams, value Agile practices, business outcomes, and clean scalable code. English — <strong class="text-text">B1</strong>.',
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
    startups: {
      title: "Startups",
      subtitle: "Creator of own projects",
      description: "Creator of 2 startups and several open-source projects",
    },
    contacts: {
      title: "Contacts",
      subtitle: "Get in touch through any convenient channel",
      phone: "Phone",
      preferredContact: "preferred contact method",
    },
    footer: {
      rights: "All rights reserved.",
      madeWith: "Built with",
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
