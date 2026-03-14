/**
 * Категории технического стека — двуязычная версия.
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
    skills: ["Node.js", "Go", "NestJS", "Express", "Moleculer.js", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "RabbitMQ", "gRPC", "WebSocket", "SSE", "Prisma", "TypeORM", "Sequelize"],
  },
  {
    title: "DevOps и инфраструктура",
    icon: "cloud",
    description: "Развёртывание, мониторинг и поддержка production-инфраструктуры",
    skills: ["Kubernetes", "Docker", "Docker Compose", "Docker Swarm", "CI/CD", "GitHub Actions", "GitLab CI", "TeamCity", "nginx", "Dokploy", "Coolify", "OpenTelemetry", "Grafana", "Sentry", "Prometheus", "Linux", "Bash"],
  },
  {
    title: "Frontend",
    icon: "layout",
    description: "Современные SPA и SSR-приложения с фокусом на производительность и UX",
    skills: ["React", "Vue", "Next.js", "Nuxt.js", "Astro", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Tanstack Query", "React Native", "Electron", "Vite", "Webpack", "FSD", "Storybook", "Cypress", "Playwright", "VitePress"],
  },
  {
    title: "Telegram и боты",
    icon: "bot",
    description: "Разработка Telegram-ботов, Mini App и интеграции с Telegram API",
    skills: ["Telegraf", "Telegram Bot API", "Telegram Mini App", "grammY", "Webhook/Polling", "Inline-режим"],
  },
  {
    title: "AI и автоматизация",
    icon: "brain",
    description: "Интеграция LLM и AI-инструментов в процессы разработки и продукты",
    skills: ["LLM", "RAG", "Claude Code", "Cursor", "Vector DB", "Embeddings", "OpenAI API", "DeepSeek", "Prompt Engineering"],
  },
];

const expertiseEn: SkillCategory[] = [
  {
    title: "Backend & Microservices",
    icon: "server",
    description: "Designing and building scalable high-load microservice systems",
    skills: ["Node.js", "Go", "NestJS", "Express", "Moleculer.js", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "RabbitMQ", "gRPC", "WebSocket", "SSE", "Prisma", "TypeORM", "Sequelize"],
  },
  {
    title: "DevOps & Infrastructure",
    icon: "cloud",
    description: "Deploying, monitoring, and maintaining production infrastructure",
    skills: ["Kubernetes", "Docker", "Docker Compose", "Docker Swarm", "CI/CD", "GitHub Actions", "GitLab CI", "TeamCity", "nginx", "Dokploy", "Coolify", "OpenTelemetry", "Grafana", "Sentry", "Prometheus", "Linux", "Bash"],
  },
  {
    title: "Frontend",
    icon: "layout",
    description: "Modern SPA and SSR applications with a focus on performance and UX",
    skills: ["React", "Vue", "Next.js", "Nuxt.js", "Astro", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Tanstack Query", "React Native", "Electron", "Vite", "Webpack", "FSD", "Storybook", "Cypress", "Playwright", "VitePress"],
  },
  {
    title: "Telegram & Bots",
    icon: "bot",
    description: "Building Telegram bots, Mini Apps, and integrations with Telegram API",
    skills: ["Telegraf", "Telegram Bot API", "Telegram Mini App", "grammY", "Webhook/Polling", "Inline Mode"],
  },
  {
    title: "AI & Automation",
    icon: "brain",
    description: "Integrating LLMs and AI tools into development workflows and products",
    skills: ["LLM", "RAG", "Claude Code", "Cursor", "Vector DB", "Embeddings", "OpenAI API", "DeepSeek", "Prompt Engineering"],
  },
];

export function getExpertise(lang: Lang): SkillCategory[] {
  return lang === "ru" ? expertiseRu : expertiseEn;
}

/** Полный стек технологий по категориям (одинаковый для обоих языков) */
export const techStackGroups = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Go", "SQL", "Bash", "HTML/CSS"] },
  { category: "Backend", items: ["Node.js", "NestJS", "Express", "Moleculer.js", "Koa", "Go"] },
  { category: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "ClickHouse", "MinIO/S3"] },
  { category: "Message Brokers", items: ["Kafka", "RabbitMQ", "Redis Streams"] },
  { category: "Frontend", items: ["React", "Vue", "Next.js", "Nuxt.js", "Astro", "Tailwind CSS", "Redux Toolkit", "React Native", "Electron"] },
  { category: "Telegram", items: ["Telegraf", "Telegram Bot API", "Telegram Mini App", "grammY"] },
  { category: "DevOps", items: ["Docker", "Kubernetes", "nginx", "GitHub Actions", "GitLab CI", "TeamCity"] },
  { category: "Monitoring", items: ["OpenTelemetry", "Grafana", "Prometheus", "Sentry", "ELK"] },
  { category: "Architecture", items: ["Microservices", "Event-Driven", "DDD", "CQRS", "Circuit Breaker", "Inbox Pattern"] },
] as const;
