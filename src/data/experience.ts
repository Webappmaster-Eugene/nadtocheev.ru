/**
 * Опыт работы — двуязычная версия.
 * При обновлении резюме редактируйте оба языковых варианта.
 */
import type { Lang } from "../i18n/translations.ts";

export interface WorkExperience {
  company: string;
  url?: string;
  role: string;
  period: string;
  duration: string;
  industry: string;
  backendFocus: string;
  highlights: string[];
  stack: {
    backend: string[];
    frontend: string[];
    devops?: string[];
  };
}

const experienceRu: WorkExperience[] = [
  {
    company: "bnmap.pro",
    role: "Fullstack-разработчик (Node.js/React)",
    period: "Ноябрь 2024 — настоящее время",
    duration: "1 год 5 месяцев",
    industry: "Аналитика недвижимости — топ-1 сервис в РФ",
    backendFocus: "80/20 backend",
    highlights: [
      "Поддержка и развитие 3 микросервисов (1 на NestJS + 2 на Moleculer.js) и 4 фронтов (3 на React, 1 на Vue/Nuxt)",
      "Вывод фич на production с нагрузкой 40 000+ посещений/сутки (5000 rps)",
      "Внедрение OpenTelemetry — distributed tracing, Prometheus, OTLP/gRPC, Sentry для error tracking",
      "Организация Redis Streams для ускорения генерации отчётов и как транспорта между сервисами",
      "Рефакторинг архитектуры: TypeScript, zod-контракты, smart mock, интеграционные тесты с MariaDB",
      "Внутренний портал документации на VitePress — ускорение онбординга аналитиков и разработчиков",
      "Деплой лендингов на Astro с SEO-оптимизацией и индексацией для поисковиков",
      "Оптимизация SQL-запросов PostgreSQL, MySQL; работа с ClickHouse",
      "Event-Driven Architecture (pub/sub, message queues), Circuit Breaker, MinIO/S3 для хранения отчётов",
    ],
    stack: {
      backend: ["NestJS", "Moleculer.js", "PostgreSQL", "MySQL", "Sequelize", "Redis", "gRPC", "WebSocket", "SSE", "Jest"],
      frontend: ["React", "Vue (Nuxt)", "Next.js", "Redux Toolkit", "Tanstack Query", "FSD", "Tailwind", "Vite", "Vitest", "Cypress"],
      devops: ["Kubernetes", "Lens", "Docker", "CI/CD", "OpenTelemetry", "Grafana", "Prometheus", "Sentry", "MinIO/S3"],
    },
  },
  {
    company: "ООО Форвард",
    url: "forvard.me",
    role: "Fullstack-разработчик (Node.js/React)",
    period: "Февраль 2024 — Ноябрь 2024",
    duration: "10 месяцев",
    industry: "Финтех — 11-й зарегистрированный ОФП в РФ",
    backendFocus: "70/30 backend",
    highlights: [
      "Разработка платёжного модуля (биллинг): криптовалюты, fiat, онлайн-кассы, международные каналы",
      "Архитектура на 5 микросервисах с монорепозиторием Nx",
      "Внедрение Kafka как брокера сообщений между микросервисами",
      "Внедрение Redis для кэширования — увеличение скорости ответов сервера",
      "Полноценный Dependency Injection на NestJS для безопасности и переиспользования",
      "Продакшн с нагрузкой 50 000+ посещений/сутки",
      "Система-конструктор пайплайнов обработки заказов на React Flow",
      "DevOps: docker compose (Portainer, Dokploy, Swarm), CI/CD (GitHub Actions), nginx, кроны, Linux",
      "Внутренний портал документации на VitePress для аналитиков и разработчиков",
    ],
    stack: {
      backend: ["NestJS", "Express", "PostgreSQL", "Prisma", "TypeORM", "Kafka", "RabbitMQ", "Redis", "gRPC", "Jest"],
      frontend: ["React", "Next.js", "Vue", "Redux Toolkit", "Tanstack Query", "Tailwind (shadcn)", "NextUI", "React Admin", "Playwright", "Vitest", "Storybook"],
      devops: ["Docker Compose", "Portainer", "Dokploy", "Swarm", "GitHub Actions", "Husky"],
    },
  },
  {
    company: "Витрина А",
    url: "vitrina.ru",
    role: "Fullstack-разработчик",
    period: "Ноябрь 2022 — Февраль 2024",
    duration: "1 год 4 месяца",
    industry: "Маркетинг и реклама",
    backendFocus: "60/40 backend",
    highlights: [
      "Перевод легаси-проекта с Koa2 на NestJS — масштабируемая архитектура",
      "Внедрение Feature-Sliced Design (FSD) и Storybook как UI-kit",
      "Настройка CI/CD через GitHub Actions, деплой на VDS",
      "Test coverage 70% — unit и e2e тесты",
      "Работа в команде из 8–10 человек: фронт, бэк, QA, дизайн, аналитика, PM",
    ],
    stack: {
      backend: ["NestJS", "Express", "Koa", "MySQL/MariaDB", "Prisma", "TypeORM", "RabbitMQ", "Redis"],
      frontend: ["React", "Next.js", "Vue", "Redux Toolkit", "Tanstack Query", "Tailwind", "Ant Design"],
      devops: ["Docker Compose", "nginx", "GitHub Actions", "Grafana", "ELK"],
    },
  },
  {
    company: "Systems-fd",
    url: "systems-fd.com",
    role: "Fullstack-разработчик",
    period: "Август 2021 — Ноябрь 2022",
    duration: "1 год 4 месяца",
    industry: "Системная интеграция, ИТ-консалтинг",
    backendFocus: "50/50 frontend/backend",
    highlights: [
      "Внедрение TypeScript (замена JSDoc) — уменьшение ошибок типизации",
      "Интеграции REST API: Telegram, Google Maps, amoCRM, Stripe, Кинескоп, Wasabi",
      "Внедрение Redux Toolkit и RTK Query, Feature-Sliced Design",
      "Продуктовый подход: составление ТЗ, работа в сжатые сроки",
    ],
    stack: {
      backend: ["NestJS", "MongoDB", "Mongoose", "RabbitMQ", "nginx"],
      frontend: ["React", "Next.js", "Redux", "Tanstack Query", "Zustand", "Tailwind", "MaterialUI"],
    },
  },
];

const experienceEn: WorkExperience[] = [
  {
    company: "bnmap.pro",
    role: "Fullstack Developer (Node.js/React)",
    period: "November 2024 — present",
    duration: "1 year 5 months",
    industry: "Real Estate Analytics — #1 platform in Russia",
    backendFocus: "80/20 backend",
    highlights: [
      "Maintained and evolved 3 backend microservices (1 NestJS + 2 Moleculer.js) and 4 frontends (3 React, 1 Vue/Nuxt)",
      "Shipping features to production handling 40,000+ daily visits (5,000 rps)",
      "Implemented OpenTelemetry — distributed tracing, Prometheus, OTLP/gRPC, Sentry for error tracking",
      "Set up Redis Streams to accelerate report generation and act as inter-service transport",
      "Architecture refactoring: TypeScript, zod contracts, smart mocks, integration tests with MariaDB",
      "Internal VitePress documentation portal — faster onboarding for analysts and engineers",
      "Deployed Astro landing pages with SEO optimization and search engine indexing",
      "Optimized SQL queries for PostgreSQL and MySQL; worked with ClickHouse",
      "Event-Driven Architecture (pub/sub, message queues), Circuit Breaker, MinIO/S3 for report storage",
    ],
    stack: {
      backend: ["NestJS", "Moleculer.js", "PostgreSQL", "MySQL", "Sequelize", "Redis", "gRPC", "WebSocket", "SSE", "Jest"],
      frontend: ["React", "Vue (Nuxt)", "Next.js", "Redux Toolkit", "Tanstack Query", "FSD", "Tailwind", "Vite", "Vitest", "Cypress"],
      devops: ["Kubernetes", "Lens", "Docker", "CI/CD", "OpenTelemetry", "Grafana", "Prometheus", "Sentry", "MinIO/S3"],
    },
  },
  {
    company: "Forward LLC",
    url: "forvard.me",
    role: "Fullstack Developer (Node.js/React)",
    period: "February 2024 — November 2024",
    duration: "10 months",
    industry: "Fintech — 11th registered financial platform operator in Russia",
    backendFocus: "70/30 backend",
    highlights: [
      "Developed payment (billing) module: cryptocurrency, fiat, online payment terminals, international channels",
      "Architecture with 5 microservices in an Nx monorepo",
      "Implemented Kafka as a message broker between microservices",
      "Implemented Redis caching — improved server response times",
      "Full Dependency Injection on NestJS for security and method reusability",
      "Production environment handling 50,000+ daily visits",
      "Built a drag-and-drop pipeline constructor for order processing using React Flow",
      "DevOps: docker compose (Portainer, Dokploy, Swarm), CI/CD (GitHub Actions), nginx, crons, Linux",
      "Internal VitePress documentation portal for analysts and engineers",
    ],
    stack: {
      backend: ["NestJS", "Express", "PostgreSQL", "Prisma", "TypeORM", "Kafka", "RabbitMQ", "Redis", "gRPC", "Jest"],
      frontend: ["React", "Next.js", "Vue", "Redux Toolkit", "Tanstack Query", "Tailwind (shadcn)", "NextUI", "React Admin", "Playwright", "Vitest", "Storybook"],
      devops: ["Docker Compose", "Portainer", "Dokploy", "Swarm", "GitHub Actions", "Husky"],
    },
  },
  {
    company: "Vitrina A",
    url: "vitrina.ru",
    role: "Fullstack Developer",
    period: "November 2022 — February 2024",
    duration: "1 year 4 months",
    industry: "Marketing & Advertising",
    backendFocus: "60/40 backend",
    highlights: [
      "Migrated a legacy project from Koa2 to NestJS — scalable architecture",
      "Introduced Feature-Sliced Design (FSD) and Storybook as a UI kit",
      "Set up CI/CD via GitHub Actions, deployed to VDS",
      "Achieved 70% test coverage — unit and e2e tests",
      "Worked in a team of 8–10: frontend, backend, QA, design, analytics, PM",
    ],
    stack: {
      backend: ["NestJS", "Express", "Koa", "MySQL/MariaDB", "Prisma", "TypeORM", "RabbitMQ", "Redis"],
      frontend: ["React", "Next.js", "Vue", "Redux Toolkit", "Tanstack Query", "Tailwind", "Ant Design"],
      devops: ["Docker Compose", "nginx", "GitHub Actions", "Grafana", "ELK"],
    },
  },
  {
    company: "Systems-fd",
    url: "systems-fd.com",
    role: "Fullstack Developer",
    period: "August 2021 — November 2022",
    duration: "1 year 4 months",
    industry: "System Integration & IT Consulting",
    backendFocus: "50/50 frontend/backend",
    highlights: [
      "Adopted TypeScript (replacing JSDoc) — reduced type-related bugs",
      "REST API integrations: Telegram, Google Maps, amoCRM, Stripe, Kinescope, Wasabi",
      "Introduced Redux Toolkit, RTK Query, and Feature-Sliced Design",
      "Product-oriented approach: writing specifications, delivering under tight deadlines",
    ],
    stack: {
      backend: ["NestJS", "MongoDB", "Mongoose", "RabbitMQ", "nginx"],
      frontend: ["React", "Next.js", "Redux", "Tanstack Query", "Zustand", "Tailwind", "MaterialUI"],
    },
  },
];

export function getExperience(lang: Lang): WorkExperience[] {
  return lang === "ru" ? experienceRu : experienceEn;
}
