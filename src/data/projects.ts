/**
 * Ключевые проекты — двуязычная версия.
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
    title: "Платформа аналитики недвижимости",
    description:
      "Топ-1 b2b-сервис аналитики недвижимости в РФ. Event-Driven архитектура с Circuit Breaker, полный observability-стек (Tempo + Loki + Prometheus + Grafana), Vike+React SSR-витрина с ИИ-чатом на собственном RAG, Fastify+Playwright-парсер 40 источников с обходом антибот-защиты.",
    role: "Fullstack-разработчик (backend-focus)",
    metrics: ["40K+ DAU / 200K+ посещений в сутки", "2000 rps в проде", "Микросервисы + микрофронтенды (Nx, Module Federation)", "Vike SSR + Astro-лендинги + Expo-приложение"],
    stack: ["NestJS", "Moleculer.js", "Fastify", "PostgreSQL (pgvector)", "Drizzle ORM", "Redis", "RabbitMQ", "BullMQ", "Kubernetes", "OpenTelemetry", "Tempo", "Loki", "Grafana"],
  },
  {
    title: "Финтех-платформа (ОФП ЦБ РФ)",
    description:
      "Финтех-продукт для крупного бигтеха: финансовое ядро (wallet), платёжный шлюз с криптой/fiat/онлайн-кассами, outbox-паттерн поверх Kafka, миграция клиента с REST на GraphQL Federation. Прошёл регистрацию ЦБ РФ как оператор финансовой платформы.",
    role: "Fullstack-разработчик (backend-focus)",
    metrics: ["Регистрация ОФП ЦБ РФ", "Команда из 3 разработчиков", "GraphQL Federation + gRPC", "Kubernetes + Helm + FluxCD"],
    stack: ["NestJS", "Fastify", "PostgreSQL", "Prisma", "Kafka", "Redis", "GraphQL Federation", "gRPC", "Next.js 15"],
  },
  {
    title: "AI-инструменты и автоматизация",
    description:
      "Разработка RAG-пайплайнов, интеграция LLM в рабочие процессы, Telegram-боты с голосовым управлением календарём через AI.",
    role: "Разработчик / Архитектор",
    metrics: ["RAG-пайплайны", "Voice-to-Calendar", "LLM-интеграции", "Векторные БД"],
    stack: ["Node.js", "OpenAI", "Claude Code", "Cursor", "Embeddings", "Astro"],
  },
];

const projectsEn: Project[] = [
  {
    title: "Real Estate Analytics Platform",
    description:
      "The #1 B2B real estate analytics service in Russia. Event-Driven architecture with Circuit Breaker, full observability stack (Tempo + Loki + Prometheus + Grafana), Vike+React SSR storefront with an in-house RAG-powered AI chat, Fastify+Playwright scraper for 40 sources with anti-bot bypass.",
    role: "Fullstack Developer (backend-focus)",
    metrics: ["40K+ DAU / 200K+ daily visits", "2,000 rps in production", "Microservices + microfrontends (Nx, Module Federation)", "Vike SSR + Astro landings + Expo app"],
    stack: ["NestJS", "Moleculer.js", "Fastify", "PostgreSQL (pgvector)", "Drizzle ORM", "Redis", "RabbitMQ", "BullMQ", "Kubernetes", "OpenTelemetry", "Tempo", "Loki", "Grafana"],
  },
  {
    title: "Fintech platform (CBR-registered)",
    description:
      "Fintech product for a major bigtech: financial core (wallet), payment gateway with crypto/fiat/online registers, outbox pattern on Kafka, client migration from REST to GraphQL Federation. Passed CBR review and was registered as a financial platform operator.",
    role: "Fullstack Developer (backend-focus)",
    metrics: ["Russian CBR financial platform registration", "Team of 3 engineers", "GraphQL Federation + gRPC", "Kubernetes + Helm + FluxCD"],
    stack: ["NestJS", "Fastify", "PostgreSQL", "Prisma", "Kafka", "Redis", "GraphQL Federation", "gRPC", "Next.js 15"],
  },
  {
    title: "AI Tools & Automation",
    description:
      "Building RAG pipelines, integrating LLMs into workflows, Telegram bots with voice-controlled calendar management via AI.",
    role: "Developer / Architect",
    metrics: ["RAG pipelines", "Voice-to-Calendar", "LLM integrations", "Vector DBs"],
    stack: ["Node.js", "OpenAI", "Claude Code", "Cursor", "Embeddings", "Astro"],
  },
];

export function getProjects(lang: Lang): Project[] {
  return lang === "ru" ? projectsRu : projectsEn;
}
