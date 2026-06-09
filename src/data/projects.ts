/**
 * Ключевые проекты - двуязычная версия.
 * Срез синьорных достижений из коммерческого опыта (источник: CV).
 */
import type { Lang } from "../i18n/translations.ts";

export interface Project {
  title: string;
  description: string;
  role: string;
  metrics: string[];
  stack: string[];
}

const projectsRu: Project[] = [
  {
    title: "B2B-аналитика недвижимости (топ-1 в РФ)",
    description:
      "Развиваю микросервисы highload-платформы (40K+ DAU, 2000 rps): построил полный observability-стек (OTel Collector + Tempo + Loki + Prometheus + Grafana, 4 дашборда / 64 панели с алертами в Telegram), перевёл proxy/scraper/notification/admin/cms с Express на Fastify (latency × 2), реализовал Vike+React SSR-витрину с ролевым paywall и собственным ИИ-чатом на RAG со стримингом ответов, развернул pgvector для embeddings.",
    role: "Fullstack-разработчик (Node.js/React), 80% backend",
    metrics: ["40K+ DAU / 200K+ посещений в сутки", "2000 rps в проде, латенси × 2 после миграции на Fastify", "Vike SSR + Astro лендинги + Expo-приложение", "Распределённый cron на BullMQ + Circuit Breaker"],
    stack: ["NestJS", "Moleculer.js", "Fastify", "PostgreSQL (pgvector)", "Drizzle ORM", "Redis", "RabbitMQ", "BullMQ", "Vike", "Astro", "Pixi.js", "Kubernetes", "OpenTelemetry"],
  },
  {
    title: "Финтех-ядро для ОФП ЦБ РФ",
    description:
      "В команде из 3 человек довели продукт для крупного бигтеха до регистрации как Оператор Финансовой Платформы ЦБ РФ. Спроектировал wallet с оптимистичной блокировкой через version и атомарными Prisma-транзакциями, развернул outbox-паттерн поверх Kafka (доменные события + DLQ с retry/backoff через Redis), перевёл команду с REST на GraphQL Federation (Apollo Client + Mercurius на Fastify): 1 типобезопасный эндпоинт вместо 20 REST-интеграций.",
    role: "Fullstack-разработчик (Node.js/React), 70% backend",
    metrics: ["Регистрация ОФП ЦБ РФ", "Идемпотентные операции под реальные деньги", "Outbox + Kafka + DLQ (no double charges)", "REST → GraphQL Federation: 20 → 1 эндпоинт"],
    stack: ["NestJS", "Fastify", "PostgreSQL", "Prisma", "Kafka", "gRPC", "GraphQL Federation", "Mercurius", "Apollo Client 3", "Next.js 15 (RSC)", "Kubernetes", "Helm", "FluxCD"],
  },
  {
    title: "Platform Engineering & Observability",
    description:
      "Выделил кросс-сервисную инфраструктуру в shared-пакеты (contracts с Zod-DTO, logger на Pino+OTel, telemetry с OTel auto-instrumentation) - переиспользуемая база для всей монорепы. Поднял пирамиду тестов на 3 уровнях (vitest unit на все сервисы и shared-пакеты, integration на docker-compose с Postgres+Redis+RabbitMQ+headless browser, k6 нагрузочное с историческим сравнением). Настроил CI/CD на self-hosted GitHub Actions runners с детекцией изменённых сервисов, билдом и пушем в Docker Hub, деплоем через Dokploy + Docker Swarm.",
    role: "Senior fullstack / Platform owner",
    metrics: ["3 уровня тестов: unit + integration + k6", "4 Grafana-дашборда / 64 панели, Telegram-алерты", "Self-hosted GH Actions + Dokploy + Swarm", "Shared-пакеты переиспользуются всей командой"],
    stack: ["OpenTelemetry", "Tempo", "Loki", "Prometheus", "Grafana", "Sentry", "GitHub Actions", "Dokploy", "Docker Swarm", "k6", "Zod", "Pino", "Vitest"],
  },
];

const projectsEn: Project[] = [
  {
    title: "B2B Real Estate Analytics (#1 in Russia)",
    description:
      "Build and operate microservices for a high-load platform (40K+ DAU, 2,000 rps): set up the full observability stack (OTel Collector + Tempo + Loki + Prometheus + Grafana, 4 dashboards / 64 panels with Telegram alerts), migrated proxy/scraper/notification/admin/cms from Express to Fastify (latency × 2), built a Vike+React SSR storefront with role-based paywall and an in-house RAG-powered AI chat with streamed responses, rolled out pgvector for embeddings.",
    role: "Fullstack Developer (Node.js/React), 80% backend",
    metrics: ["40K+ DAU / 200K+ daily visits", "2,000 rps in prod, latency × 2 after Fastify migration", "Vike SSR + Astro landings + Expo app", "Distributed cron on BullMQ + Circuit Breaker"],
    stack: ["NestJS", "Moleculer.js", "Fastify", "PostgreSQL (pgvector)", "Drizzle ORM", "Redis", "RabbitMQ", "BullMQ", "Vike", "Astro", "Pixi.js", "Kubernetes", "OpenTelemetry"],
  },
  {
    title: "Fintech core for CBR-registered platform operator",
    description:
      "In a team of 3, took a product for a major bigtech through Central Bank of Russia review until it was registered as a financial platform operator (ОФП). Designed a wallet with optimistic balance locking via version and atomic Prisma transactions, rolled out an outbox pattern over Kafka (domain events + DLQ with retry/backoff via Redis), migrated the team from REST to GraphQL Federation (Apollo Client + Mercurius on Fastify): one type-safe endpoint instead of 20 REST integrations.",
    role: "Fullstack Developer (Node.js/React), 70% backend",
    metrics: ["CBR financial platform operator registration", "Idempotent operations on real money", "Outbox + Kafka + DLQ (no double charges)", "REST → GraphQL Federation: 20 → 1 endpoint"],
    stack: ["NestJS", "Fastify", "PostgreSQL", "Prisma", "Kafka", "gRPC", "GraphQL Federation", "Mercurius", "Apollo Client 3", "Next.js 15 (RSC)", "Kubernetes", "Helm", "FluxCD"],
  },
  {
    title: "Platform Engineering & Observability",
    description:
      "Extracted cross-service infrastructure into shared packages (contracts with Zod DTOs, logger on Pino+OTel, telemetry with OTel auto-instrumentation) reusable across the whole monorepo. Stood up a three-level testing pyramid (vitest unit across all services and shared packages, integration on docker-compose with Postgres+Redis+RabbitMQ+headless browser, k6 load tests with historical comparison between runs). Set up CI/CD on self-hosted GitHub Actions runners with changed-service detection, build and push to Docker Hub, deploy via Dokploy + Docker Swarm.",
    role: "Senior fullstack / Platform owner",
    metrics: ["3 levels of tests: unit + integration + k6", "4 Grafana dashboards / 64 panels, Telegram alerts", "Self-hosted GH Actions + Dokploy + Swarm", "Shared packages reused across the whole team"],
    stack: ["OpenTelemetry", "Tempo", "Loki", "Prometheus", "Grafana", "Sentry", "GitHub Actions", "Dokploy", "Docker Swarm", "k6", "Zod", "Pino", "Vitest"],
  },
];

export function getProjects(lang: Lang): Project[] {
  return lang === "ru" ? projectsRu : projectsEn;
}
