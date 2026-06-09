/**
 * Категории технического стека - двуязычная версия.
 */
import type { Lang } from "../i18n/translations.ts";

export interface SkillCategory {
  title: string;
  icon: string;
  description: string;
  skills: string[];
}

const expertiseRu: SkillCategory[] = [
  {
    title: "Backend и микросервисы",
    icon: "server",
    description: "Проектирование и разработка масштабируемых микросервисных систем с высокой нагрузкой",
    skills: ["Node.js", "Go", "NestJS", "Fastify", "Express", "Moleculer.js", "PostgreSQL (pgvector)", "MySQL", "MongoDB", "Redis", "RabbitMQ", "Kafka", "BullMQ", "gRPC", "WebSocket", "SSE", "Drizzle ORM", "Prisma", "TypeORM", "Sequelize"],
  },
  {
    title: "Архитектура",
    icon: "architecture",
    description: "Reliability-паттерны и архитектурные подходы для распределённых систем под high-load и реальные деньги",
    skills: ["Microservices", "Event-Driven", "Outbox Pattern", "Circuit Breaker (Opossum)", "Saga", "CQRS", "DDD", "Hexagonal", "Clean Architecture", "BFF", "GraphQL Federation", "FSD", "Slice Architecture", "Idempotency", "Optimistic Locking", "Graceful Shutdown"],
  },
  {
    title: "DevOps и инфраструктура",
    icon: "cloud",
    description: "Развёртывание, мониторинг и поддержка production-инфраструктуры",
    skills: ["Kubernetes", "Helm", "FluxCD (GitOps)", "Docker", "Docker Compose", "Docker Swarm", "Dokploy", "GitHub Actions", "GitLab CI", "TeamCity", "nginx", "OpenTelemetry", "Tempo", "Loki", "Prometheus", "Grafana", "Sentry", "k6", "Linux", "Bash"],
  },
  {
    title: "Frontend",
    icon: "layout",
    description: "Современные SPA и SSR-приложения с фокусом на производительность и UX",
    skills: ["React", "React Native + Expo", "Vue", "Next.js 15 (App Router, RSC)", "Vike (SSR)", "Nuxt.js", "Astro", "Pixi.js", "Babylon.js", "TypeScript", "Tailwind (shadcn)", "Redux Toolkit", "Tanstack Query", "Apollo Client", "Framer Motion", "Vite", "Webpack", "Vitest", "Storybook", "Playwright", "Cypress"],
  },
  {
    title: "Telegram и боты",
    icon: "bot",
    description: "Разработка Telegram-ботов, Mini App и интеграции с Telegram API",
    skills: ["Telegraf", "grammY", "Telegram Bot API", "Telegram Mini App", "Webhook/Polling", "Inline-режим"],
  },
  {
    title: "AI и автоматизация",
    icon: "brain",
    description: "Интеграция LLM и AI-инструментов в процессы разработки и продукты",
    skills: ["LLM", "RAG", "pgvector", "Embeddings", "Claude Code", "Cursor", "Vector DB", "OpenAI API", "DeepSeek", "Prompt Engineering"],
  },
];

const expertiseEn: SkillCategory[] = [
  {
    title: "Backend & Microservices",
    icon: "server",
    description: "Designing and building scalable high-load microservice systems",
    skills: ["Node.js", "Go", "NestJS", "Fastify", "Express", "Moleculer.js", "PostgreSQL (pgvector)", "MySQL", "MongoDB", "Redis", "RabbitMQ", "Kafka", "BullMQ", "gRPC", "WebSocket", "SSE", "Drizzle ORM", "Prisma", "TypeORM", "Sequelize"],
  },
  {
    title: "Architecture",
    icon: "architecture",
    description: "Reliability patterns and architectural approaches for distributed systems under high-load and real money",
    skills: ["Microservices", "Event-Driven", "Outbox Pattern", "Circuit Breaker (Opossum)", "Saga", "CQRS", "DDD", "Hexagonal", "Clean Architecture", "BFF", "GraphQL Federation", "FSD", "Slice Architecture", "Idempotency", "Optimistic Locking", "Graceful Shutdown"],
  },
  {
    title: "DevOps & Infrastructure",
    icon: "cloud",
    description: "Deploying, monitoring, and maintaining production infrastructure",
    skills: ["Kubernetes", "Helm", "FluxCD (GitOps)", "Docker", "Docker Compose", "Docker Swarm", "Dokploy", "GitHub Actions", "GitLab CI", "TeamCity", "nginx", "OpenTelemetry", "Tempo", "Loki", "Prometheus", "Grafana", "Sentry", "k6", "Linux", "Bash"],
  },
  {
    title: "Frontend",
    icon: "layout",
    description: "Modern SPA and SSR applications with a focus on performance and UX",
    skills: ["React", "React Native + Expo", "Vue", "Next.js 15 (App Router, RSC)", "Vike (SSR)", "Nuxt.js", "Astro", "Pixi.js", "Babylon.js", "TypeScript", "Tailwind (shadcn)", "Redux Toolkit", "Tanstack Query", "Apollo Client", "Framer Motion", "Vite", "Webpack", "Vitest", "Storybook", "Playwright", "Cypress"],
  },
  {
    title: "Telegram & Bots",
    icon: "bot",
    description: "Building Telegram bots, Mini Apps, and integrations with Telegram API",
    skills: ["Telegraf", "grammY", "Telegram Bot API", "Telegram Mini App", "Webhook/Polling", "Inline Mode"],
  },
  {
    title: "AI & Automation",
    icon: "brain",
    description: "Integrating LLMs and AI tools into development workflows and products",
    skills: ["LLM", "RAG", "pgvector", "Embeddings", "Claude Code", "Cursor", "Vector DB", "OpenAI API", "DeepSeek", "Prompt Engineering"],
  },
];

export function getExpertise(lang: Lang): SkillCategory[] {
  return lang === "ru" ? expertiseRu : expertiseEn;
}
