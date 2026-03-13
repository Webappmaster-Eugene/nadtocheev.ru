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
      "Топ-1 сервис в России. Микросервисная архитектура с высокой нагрузкой, distributed tracing и real-time отчётами через Redis Streams.",
    role: "Fullstack-разработчик (backend-focus)",
    metrics: ["40 000+ посещений/сутки", "5000 rps", "3 микросервиса на бэке", "4 сервиса на фронте"],
    stack: ["NestJS", "Moleculer.js", "PostgreSQL", "Redis", "Kubernetes", "OpenTelemetry"],
  },
  {
    title: "Финтех-платформа (ОФП)",
    description:
      "11-й зарегистрированный оператор финансовой платформы в РФ. Платёжный модуль с поддержкой криптовалют, fiat-валют, онлайн-касс и международных платёжных каналов.",
    role: "Fullstack-разработчик (backend-focus)",
    metrics: ["50 000+ посещений/сутки", "5 микросервисов", "Монорепозиторий Nx", "Команда из 3 человек"],
    stack: ["NestJS", "PostgreSQL", "Kafka", "Redis", "React Flow", "Docker Swarm"],
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
      "The #1 service in Russia. High-load microservice architecture with distributed tracing and real-time reports via Redis Streams.",
    role: "Fullstack Developer (backend-focus)",
    metrics: ["40,000+ daily visits", "5,000 rps", "3 backend microservices", "4 frontend services"],
    stack: ["NestJS", "Moleculer.js", "PostgreSQL", "Redis", "Kubernetes", "OpenTelemetry"],
  },
  {
    title: "Fintech Platform (OFP)",
    description:
      "The 11th registered financial platform operator in Russia. Payment module supporting cryptocurrency, fiat currencies, online terminals, and international payment channels.",
    role: "Fullstack Developer (backend-focus)",
    metrics: ["50,000+ daily visits", "5 microservices", "Nx monorepo", "Team of 3"],
    stack: ["NestJS", "PostgreSQL", "Kafka", "Redis", "React Flow", "Docker Swarm"],
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
