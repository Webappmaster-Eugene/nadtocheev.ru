/**
 * Опыт работы — двуязычная версия.
 * Источник: CV (резюме hh.ru) — Надточеев Е. В.
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
    url: "bnmap.pro",
    role: "Fullstack-разработчик (Node.js/React)",
    period: "Ноябрь 2024 — настоящее время",
    duration: "1 год 8 месяцев",
    industry: "B2B-аналитика недвижимости — топ-1 сервис в РФ",
    backendFocus: "80/20 backend",
    highlights: [
      "Поддерживаю и развиваю микросервисную архитектуру под нагрузкой 40K+ DAU и 2000 rps: Event-Driven (pub/sub), Circuit Breaker (Opossum), MinIO/S3 для отчётов",
      "Выстроил полный observability-стек: OpenTelemetry Collector (OTLP HTTP+gRPC), Tempo (TraceQL), Loki, Prometheus, 4 дашборда Grafana / 64 панели с алертами в Telegram (5xx, p95-latency, RabbitMQ-backlog, Redis-down, predictive disk-full); spanmetrics + servicegraph для авто-Service Map",
      "Перевёл proxy/scraper/notification/admin/cms с Express на Fastify — latency на k6 упала в 2× при той же памяти",
      "Реализовал Vike+React SSR-витрину: каталог ЖК, премиум-флоу с guards и paywall, аналитика цен на графиках, ИИ-чат на собственном RAG со стримингом ответов",
      "Запустил лендинги на Astro + Tailwind с WebGL-анимациями на Pixi.js — SSG, отличные Core Web Vitals и SEO-индексация",
      "Поднял парсер 40 источников на Fastify + Playwright + Rebrowser + Camoufox: обход антибот-защиты, fingerprint-ы, ghost-cursor, очередь в RabbitMQ, checkpoint-resume в Redis",
      "Внедрил pgvector в PostgreSQL для embeddings и RAG под AI-фичи; распределённый cron на BullMQ + Redis",
      "Интегрировал Robokassa (карты, СБП, ЮMoney) с 30-дневной подпиской и авто-завершением через scheduler-сервис",
      "Внедрил Drizzle ORM с типобезопасными миграциями и общим schema-пакетом; выделил shared-пакеты contracts (Zod DTO), logger (Pino+OTel), telemetry (auto-instrumentation) для всей монорепы",
      "CI/CD на self-hosted GitHub Actions runners: детекция изменённых сервисов, билд+push в Docker Hub, деплой через Dokploy + Docker Swarm, pre-push gate (lint, typecheck, unit + integration)",
      "Пирамида тестов: vitest unit, integration на docker-compose (Postgres + Redis + RabbitMQ + headless browser), k6 нагрузочное с историческим сравнением",
      "VitePress-портал внутренней документации — ускорил онбординг аналитиков и разработчиков",
    ],
    stack: {
      backend: ["NestJS", "Moleculer.js", "Fastify", "Express", "PostgreSQL (pgvector)", "MySQL", "Drizzle ORM", "Sequelize", "Redis", "RabbitMQ", "BullMQ", "gRPC", "WebSocket", "SSE", "Zod", "Pino", "MinIO/S3", "grammY"],
      frontend: ["React", "React Native + Expo", "Vike (SSR)", "Next.js", "Astro", "Pixi.js", "Babylon.js", "Redux Toolkit", "Tanstack Query", "FSD", "Tailwind (shadcn)", "Framer Motion", "Recharts", "Chart.js", "Vite", "Vitest", "Playwright", "Cypress"],
      devops: ["Kubernetes", "Docker Swarm", "Dokploy", "Lens", "OpenTelemetry", "Tempo", "Loki", "Prometheus", "Grafana", "Sentry", "GitHub Actions (self-hosted)", "k6"],
    },
  },
  {
    company: "ООО Форвард",
    url: "forvard.me",
    role: "Fullstack-разработчик (Node.js/React)",
    period: "Ноябрь 2022 — Ноябрь 2024",
    duration: "2 года 1 месяц",
    industry: "Финтех (аутсорс) — крупный бигтех, ОФП ЦБ РФ",
    backendFocus: "70/30 backend",
    highlights: [
      "В команде из 3 человек разработали финтех-продукт для крупного бигтеха — после защиты зарегистрирован как ОФП ЦБ РФ",
      "Финансовое ядро (wallet) и платёжный шлюз: оптимистичная блокировка через version, атомарные Prisma-транзакции, идемпотентность под конкурентной нагрузкой с реальными деньгами",
      "Outbox-паттерн поверх Kafka (доменные события, DLQ с retry/backoff через Redis, автоочистка) — гарантия консистентности БД, исключены двойные зачисления и потерянные выводы",
      "Платёжный модуль (биллинг): криптовалюты, fiat, онлайн-кассы, международные платёжные каналы",
      "Полный observability на фронте: Sentry Next.js (SSR + CSR error boundaries, performance tracing, session replay) с OTel-заголовками — ошибка на UI трассируется до конкретного gRPC-вызова в нужном микросервисе",
      "Перевели клиент с REST на GraphQL Federation (Apollo Client + GraphQL Codegen, Mercurius на Fastify) — один типобезопасный эндпоинт вместо 20 REST-интеграций; изменения backend ловятся CI на этапе codegen",
      "gRPC-контракты через buf + ts-proto: типобезопасные клиенты/сервисы, двусторонний маппинг ошибок, OTel-метрики на каждый RPC-вызов",
      "Coordinated graceful shutdown (SIGTERM/SIGINT/SIGQUIT/uncaught, таймауты) + Kubernetes-пробы startup/liveness/readiness с реальными проверками Prisma/Kafka/Redis",
      "Полный observability-стек на бэке: OTel SDK + Collector, Prometheus + Loki + Zipkin, Grafana; автоинструментация Fastify/GraphQL/gRPC/Prisma/KafkaJS/IORedis/MongoDB; кастомные метрики и Kafka consumer lag",
      "Инфраструктура: Docker-образы, деплой Helm-чартами в Kubernetes, GitOps через FluxCD, GitLab CI с multistage pipeline, автоматические стенды для изолированной разработки",
      "Жёсткие доменные правила: kafka.send() только через outbox-таблицу, Zod-валидация ENV на старте (fail-fast), schema-per-service в Prisma",
      "FSD на фронте для разделения бизнес-сущностей и понятного хранения кодовой базы",
    ],
    stack: {
      backend: ["NestJS", "Fastify", "Express", "Koa", "PostgreSQL", "MySQL/MariaDB", "Prisma", "TypeORM", "Kafka", "RabbitMQ", "Redis", "gRPC", "GraphQL", "Mercurius Federation", "WebSocket (Socket.io)", "Zod", "Husky"],
      frontend: ["Next.js 15 (App Router, RSC)", "Apollo Client 3", "GraphQL Codegen", "React", "Vue", "Redux Toolkit", "Tanstack Query", "Zustand", "FSD", "Tailwind", "Mantine", "React Admin", "React Email", "React Hook Form", "next-international", "Playwright", "Vitest"],
      devops: ["Kubernetes", "Helm", "FluxCD (GitOps)", "Docker", "GitLab CI", "OTel Collector", "Prometheus", "Loki", "Zipkin", "Grafana", "ELK", "Sentry", "Lighthouse", "k6"],
    },
  },
  {
    company: "Systems-fd",
    url: "systems-fd.com",
    role: "Fullstack-разработчик",
    period: "Август 2021 — Ноябрь 2022",
    duration: "1 год 4 месяца",
    industry: "Системная интеграция, ИТ-консалтинг, финтех, маркетинг",
    backendFocus: "50/50 frontend/backend",
    highlights: [
      "Внедрил TypeScript (был jsdoc) и Zod-контракты — меньше ошибок типизации, smart mock для интеграционных тестов",
      "Интеграции со сторонними API: Telegram, Google Maps, amoCRM, Stripe, Kinescope, Yandex Карты",
      "Платёжный шлюз Robokassa (карты, СБП, ЮMoney) с подпиской, тестовым и боевым контурами, webhook-обработкой и авто-завершением через отдельный сервис",
      "Реализовал систему учёта, классификации и обработки ошибок через встроенную архитектуру Nest.js",
      "Полноценный Dependency Injection на NestJS для безопасности и переиспользования",
      "Внутренняя админ-панель на React Admin — быстрая работа со статусами заявок на финансовые продукты",
      "Модуль писем на React Email — верстка email-уведомлений в 2× быстрее",
      "Рефакторинг архитектуры фронта: useEffect+useContext → Redux Toolkit + RTK Query — заметно сократили техдолг в спринтах",
      "i18n на next-international с Server Components и типобезопасностью ключей, multi-tenant на 10 валют",
      "Инфраструктура: docker-compose, Portainer, Docker Swarm; VDS, CI/CD на GitHub Actions; JWT + session cookies; авто-генерация OpenAPI/Swagger",
      "Команда: 3 разраба + тимлид + PM + дизайнер; дейли, ретро, стендапы, демо с заказчиками",
    ],
    stack: {
      backend: ["NestJS", "MongoDB", "Mongoose", "RabbitMQ", "Redis", "JWT", "OAuth", "Passport", "nginx", "Zod"],
      frontend: ["React", "Redux", "React Query", "MaterialUI", "Webpack", "GraphQL", "REST"],
      devops: ["Docker", "Docker Compose", "Portainer", "Docker Swarm", "Yandex Cloud", "GitHub Actions", "GitLab CI"],
    },
  },
];

const experienceEn: WorkExperience[] = [
  {
    company: "bnmap.pro",
    url: "bnmap.pro",
    role: "Fullstack Developer (Node.js/React)",
    period: "November 2024 — present",
    duration: "1 year 8 months",
    industry: "B2B Real Estate Analytics — #1 platform in Russia",
    backendFocus: "80/20 backend",
    highlights: [
      "Maintain and evolve microservice architecture under 40K+ DAU and 2,000 rps: Event-Driven (pub/sub), Circuit Breaker (Opossum), MinIO/S3 for reports",
      "Built the full observability stack: OpenTelemetry Collector (OTLP HTTP+gRPC), Tempo (TraceQL), Loki, Prometheus, 4 Grafana dashboards / 64 panels with Telegram alerts (5xx, p95-latency, RabbitMQ backlog, Redis-down, predictive disk-full); spanmetrics + servicegraph for an auto-generated Service Map",
      "Migrated proxy/scraper/notification/admin/cms services from Express to Fastify — k6 latency dropped 2× at the same memory footprint",
      "Built a Vike+React SSR storefront: housing catalog, premium flow with guards and paywall, price analytics charts, AI chat on an in-house RAG with streamed responses",
      "Shipped Astro + Tailwind landing pages with WebGL Pixi.js animations — SSG, strong Core Web Vitals, search engine indexing",
      "Set up a Fastify + Playwright + Rebrowser + Camoufox scraper for 40 sources: anti-bot bypass, fingerprinting, ghost-cursor, RabbitMQ queue, Redis checkpoint-resume",
      "Introduced pgvector in PostgreSQL for embeddings and AI RAG; distributed cron on BullMQ + Redis",
      "Integrated Robokassa (cards, SBP, YuMoney) with a 30-day subscription and auto-termination via a scheduler service",
      "Adopted Drizzle ORM with type-safe migrations and a shared schema package; extracted shared packages — contracts (Zod DTOs), logger (Pino+OTel), telemetry (auto-instrumentation) — for the whole monorepo",
      "CI/CD on self-hosted GitHub Actions runners: changed-service detection, build + push to Docker Hub, deploy via Dokploy + Docker Swarm, pre-push gate (lint, typecheck, unit + integration)",
      "Testing pyramid: vitest unit, integration on docker-compose (Postgres + Redis + RabbitMQ + headless browser), k6 load tests with historical comparison",
      "VitePress internal docs portal — sped up onboarding for analysts and engineers",
    ],
    stack: {
      backend: ["NestJS", "Moleculer.js", "Fastify", "Express", "PostgreSQL (pgvector)", "MySQL", "Drizzle ORM", "Sequelize", "Redis", "RabbitMQ", "BullMQ", "gRPC", "WebSocket", "SSE", "Zod", "Pino", "MinIO/S3", "grammY"],
      frontend: ["React", "React Native + Expo", "Vike (SSR)", "Next.js", "Astro", "Pixi.js", "Babylon.js", "Redux Toolkit", "Tanstack Query", "FSD", "Tailwind (shadcn)", "Framer Motion", "Recharts", "Chart.js", "Vite", "Vitest", "Playwright", "Cypress"],
      devops: ["Kubernetes", "Docker Swarm", "Dokploy", "Lens", "OpenTelemetry", "Tempo", "Loki", "Prometheus", "Grafana", "Sentry", "GitHub Actions (self-hosted)", "k6"],
    },
  },
  {
    company: "Forward LLC",
    url: "forvard.me",
    role: "Fullstack Developer (Node.js/React)",
    period: "November 2022 — November 2024",
    duration: "2 years 1 month",
    industry: "Fintech (outsourced) — major bigtech, Russian Central Bank registered financial platform operator",
    backendFocus: "70/30 backend",
    highlights: [
      "In a team of 3, built a fintech product for a major bigtech — passed CBR review and was registered as a financial platform operator",
      "Financial core (wallet) and payment gateway: optimistic balance locking via version, atomic Prisma transactions, idempotent operations under concurrent load with real money",
      "Outbox pattern on top of Kafka (domain events, DLQ with retry/backoff via Redis, auto-cleanup) — guaranteed DB consistency, no double charges or lost payouts",
      "Payment (billing) module: crypto, fiat, online payment terminals, international payment channels",
      "Full frontend observability: Sentry Next.js (SSR + CSR error boundaries, performance tracing, session replay) with OTel headers — a UI error traces all the way to the specific gRPC call in the right microservice",
      "Migrated the client from REST to GraphQL Federation (Apollo Client + GraphQL Codegen, Mercurius on Fastify) — one type-safe endpoint instead of 20 REST integrations; backend changes caught by CI at the codegen stage",
      "gRPC contracts via buf + ts-proto: type-safe clients/servers, two-way error mapping, OTel metrics per RPC call",
      "Coordinated graceful shutdown (SIGTERM/SIGINT/SIGQUIT/uncaught handlers, timeouts) + Kubernetes startup/liveness/readiness probes with real checks against Prisma/Kafka/Redis",
      "Full backend observability: OTel SDK + Collector, Prometheus + Loki + Zipkin, Grafana; auto-instrumentation for Fastify/GraphQL/gRPC/Prisma/KafkaJS/IORedis/MongoDB; custom metrics and Kafka consumer lag",
      "Infrastructure: Docker images, deploy via Helm charts to Kubernetes, GitOps with FluxCD, GitLab CI multistage pipeline, automatic isolated dev/test environments",
      "Strict domain rules: kafka.send() only via the outbox table, Zod ENV validation on startup (fail-fast), schema-per-service in Prisma",
      "FSD on the frontend for clean separation of business entities and a predictable codebase layout",
    ],
    stack: {
      backend: ["NestJS", "Fastify", "Express", "Koa", "PostgreSQL", "MySQL/MariaDB", "Prisma", "TypeORM", "Kafka", "RabbitMQ", "Redis", "gRPC", "GraphQL", "Mercurius Federation", "WebSocket (Socket.io)", "Zod", "Husky"],
      frontend: ["Next.js 15 (App Router, RSC)", "Apollo Client 3", "GraphQL Codegen", "React", "Vue", "Redux Toolkit", "Tanstack Query", "Zustand", "FSD", "Tailwind", "Mantine", "React Admin", "React Email", "React Hook Form", "next-international", "Playwright", "Vitest"],
      devops: ["Kubernetes", "Helm", "FluxCD (GitOps)", "Docker", "GitLab CI", "OTel Collector", "Prometheus", "Loki", "Zipkin", "Grafana", "ELK", "Sentry", "Lighthouse", "k6"],
    },
  },
  {
    company: "Systems-fd",
    url: "systems-fd.com",
    role: "Fullstack Developer",
    period: "August 2021 — November 2022",
    duration: "1 year 4 months",
    industry: "System Integration, IT consulting, fintech, marketing",
    backendFocus: "50/50 frontend/backend",
    highlights: [
      "Introduced TypeScript (replacing jsdoc) and Zod contracts — fewer type bugs, smart mocks for integration tests",
      "Integrations with third-party APIs: Telegram, Google Maps, amoCRM, Stripe, Kinescope, Yandex Maps",
      "Robokassa payment gateway (cards, SBP, YuMoney) with subscription, test and prod environments, webhook handling, and auto-termination via a dedicated service",
      "Built an error tracking, classification, and handling system using NestJS's built-in architecture",
      "Full Dependency Injection on NestJS for security and method reusability",
      "Internal admin panel on React Admin — fast operations on financial product application statuses",
      "Email module on React Email — formal email templates 2× faster to build",
      "Frontend architecture refactor: useEffect + useContext → Redux Toolkit + RTK Query — significant tech debt reduction across sprints",
      "i18n on next-international with Server Components and type-safe translation keys, multi-tenant for 10 currencies",
      "Infrastructure: docker-compose, Portainer, Docker Swarm; VDS, GitHub Actions CI/CD; JWT + session cookies; auto-generated OpenAPI/Swagger",
      "Team: 3 devs + tech lead + PM + designer; dailies, retro, stand-ups, customer demos",
    ],
    stack: {
      backend: ["NestJS", "MongoDB", "Mongoose", "RabbitMQ", "Redis", "JWT", "OAuth", "Passport", "nginx", "Zod"],
      frontend: ["React", "Redux", "React Query", "MaterialUI", "Webpack", "GraphQL", "REST"],
      devops: ["Docker", "Docker Compose", "Portainer", "Docker Swarm", "Yandex Cloud", "GitHub Actions", "GitLab CI"],
    },
  },
];

export function getExperience(lang: Lang): WorkExperience[] {
  return lang === "ru" ? experienceRu : experienceEn;
}
