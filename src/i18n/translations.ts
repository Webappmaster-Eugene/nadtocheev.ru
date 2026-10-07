/**
 * UI-строки для двуязычного сайта.
 * Все текстовые строки интерфейса вынесены сюда для удобства перевода.
 */

import { experienceYears, ruPlural } from "../data/career.ts";

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
    intro: string;
    sections: { title: string; text: string }[];
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
    showAll: string;
    showLess: string;
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
  };

  /* FAQ */
  faq: {
    title: string;
    subtitle: string;
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
        /* ≤ 155 символов: Google обрезает сниппет длиннее */
        `Fullstack-разработчик, ${experienceYears} ${ruPlural(experienceYears, "год", "года", "лет")} опыта: Node.js, Go, React, Kubernetes. Highload-микросервисы в финтехе и аналитике недвижимости, AI/LLM-интеграции.`,
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
      switchLangLabel: "EN - switch to English",
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
      metricsYears: `${ruPlural(experienceYears, "год", "года", "лет")} опыта`,
      metricsVisits: "посещений/сутки",
      metricsRps: "rps в production",
      metricsServices: "микросервисов",
    },
    about: {
      title: "Обо мне",
      intro: 'Я fullstack-разработчик и ментор с опытом работы в небольших и крупных командах: от проектов с выстроенными процессами до тех, где их нужно создавать с нуля. Участвовал в создании <strong class="text-text">двух стартапов с нуля</strong>. Моя экспертиза охватывает AI-разработку, fullstack, DevOps, Kubernetes и микросервисные системы. Работаю с <strong class="text-text">продуктовым подходом и пониманием бизнеса</strong>: связываю технические решения с задачами пользователей, целями продукта и его развитием.',
      sections: [
        {
          title: "Техническая экспертиза",
          text: 'Разрабатываю backend на Node.js и TypeScript, интерфейсы на React и Vue, проектирую микросервисы и интеграции. Работаю с высоконагруженными системами, Kubernetes, CI/CD и наблюдаемостью через OpenTelemetry. В AI-разработке создаю RAG-пайплайны и ИИ-чаты со стримингом ответов, интегрирую LLM в продукты и использую AI-инструменты в ежедневной работе. В основе моего подхода — понятная архитектура, строгая типизация и интеграционные тесты.',
        },
        {
          title: "Продукт и бизнес",
          text: 'Работал в финтехе, аналитике недвижимости, системной интеграции и IT-консалтинге. Умею смотреть на задачу целиком: от потребности пользователя и бизнес-логики до архитектуры, запуска и поддержки в проде. Развиваю собственные продукты: <a href="https://podbor-minuta.ru" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">СПИН</a> — мониторинг цен на новостройки с уведомлениями в Telegram, и <a href="https://alibaba.hhos.ru" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">SMETAS</a> — SaaS-платформу для строительных смет. Этот опыт помогает оценивать решения с точки зрения их пользы, стоимости и дальнейшего развития.',
        },
        {
          title: "Команда и менторство",
          text: 'Был тимлидом небольшой команды, провожу технические интервью при найме и помогаю разработчикам расти. Как ментор разбираю реальные рабочие задачи, архитектуру и карьерные шаги. Я эксперт и лектор в <strong class="text-text">Школе 21 (Сбер)</strong>, консультирую на Solvery и GetMentor. Провёл <strong class="text-text">30+ платных и 50+ бесплатных консультаций</strong>. Ценю ясную коммуникацию, обмен знаниями и ответственность за общий результат.',
        },
        {
          title: "Как со мной работать",
          text: 'Живу в Москве, работаю удалённо или в гибридном формате, готов к переезду. Английский — <strong class="text-text">B2</strong>. Резюме и подробный опыт — на <a href="https://career.habr.com/webappmaster" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">Habr Career</a>. Обсудить работу, проект или менторство удобнее всего в <a href="https://t.me/eugene_nadtocheev" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">Telegram</a>.',
        },
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
      showAll: "Показать всё",
      showLess: "Свернуть",
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
      title: "Собственные продукты",
      subtitle: "Стартапы, которые я придумал, сделал и развиваю",
    },
    faq: {
      title: "Частые вопросы",
      subtitle: "Коротко о главном: опыт, стек, услуги и как связаться",
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
        /* ≤ 155 characters: Google truncates longer snippets */
        `Fullstack developer, ${experienceYears} years of experience: Node.js, Go, React, Kubernetes. High-load microservices in fintech and real estate analytics, AI and LLM.`,
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
      switchLangLabel: "RU - переключить на русский",
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
      metricsYears: experienceYears === 1 ? "year of experience" : "years of experience",
      metricsVisits: "daily visits",
      metricsRps: "rps in production",
      metricsServices: "microservices",
    },
    about: {
      title: "About Me",
      intro: 'I am a fullstack developer and mentor with experience in small and large teams, from projects with established processes to those where processes need to be built from scratch. I helped build <strong class="text-text">two startups from the ground up</strong>. My expertise spans AI development, fullstack engineering, DevOps, Kubernetes and microservice systems. I bring a <strong class="text-text">product mindset and an understanding of business</strong>, connecting technical decisions to user needs, product goals and long-term development.',
      sections: [
        {
          title: "Technical Expertise",
          text: 'I build backends with Node.js and TypeScript, interfaces with React and Vue, and design microservices and integrations. I work with high-load systems, Kubernetes, CI/CD and observability through OpenTelemetry. In AI development, I build RAG pipelines and AI chats with streaming responses, integrate LLMs into products and use AI tools daily. My approach centres on clear architecture, strict typing and integration tests.',
        },
        {
          title: "Product and Business",
          text: 'I have worked in fintech, real estate analytics, system integration and IT consulting. I consider the whole problem, from user needs and business logic to architecture, launch and production support. I develop my own products: <a href="https://podbor-minuta.ru" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">SPIN</a>, a new-build price tracker with Telegram alerts, and <a href="https://alibaba.hhos.ru" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">SMETAS</a>, a SaaS platform for construction estimates. This experience helps me assess decisions in terms of value, cost and future development.',
        },
        {
          title: "Teamwork and Mentoring",
          text: 'I have led a small engineering team, conduct technical interviews for hiring and help developers grow. As a mentor, I work through real engineering problems, architecture and career decisions. I am an expert and lecturer at <strong class="text-text">School 21 (Sber)</strong> and mentor on Solvery and GetMentor. I have delivered <strong class="text-text">30+ paid and 50+ free consultations</strong>. I value clear communication, sharing knowledge and taking responsibility for the team’s results.',
        },
        {
          title: "Working Together",
          text: 'I am based in Moscow, work remotely or in a hybrid format, and am open to relocation. My English level is <strong class="text-text">B2</strong>. Find my CV and detailed experience on <a href="https://career.habr.com/webappmaster" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">Habr Career</a>. The easiest way to discuss a role, project or mentoring is through <a href="https://t.me/eugene_nadtocheev" target="_blank" rel="noopener noreferrer" class="text-accent-light underline decoration-accent-light/40 underline-offset-2 hover:decoration-accent-light">Telegram</a>.',
        },
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
      showAll: "Show all",
      showLess: "Show less",
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
      title: "Own Products",
      subtitle: "Startups I came up with, built, and keep developing",
    },
    faq: {
      title: "FAQ",
      subtitle: "The essentials: experience, stack, services, and how to reach me",
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
