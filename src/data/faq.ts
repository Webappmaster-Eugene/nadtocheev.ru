/**
 * FAQ - двуязычная версия.
 * Выводится видимым блоком на странице (FAQ.astro) и в JSON-LD FAQPage (Layout.astro):
 * по правилам Google разметка должна совпадать с видимым контентом.
 */
import type { Lang } from "../i18n/translations.ts";
import { experienceYears, experienceYearsRuInstr } from "./career.ts";

export interface FaqItem {
  q: string;
  a: string;
}

const faqRu: FaqItem[] = [
  { q: "Чем занимается Евгений Надточеев?", a: `Fullstack-разработчик с ${experienceYearsRuInstr} коммерческого опыта. Специализируется на backend (Node.js, Go, NestJS, Fastify), DevOps (Kubernetes, Docker, OpenTelemetry), highload-микросервисах и AI/LLM-интеграциях. Сейчас работает в bnmap.pro - топ-1 b2b-платформе аналитики недвижимости в РФ.` },
  { q: "Какой технологический стек у Евгения?", a: "Backend: Node.js, Go, NestJS, Fastify, PostgreSQL (pgvector), Redis, Kafka, RabbitMQ, BullMQ, gRPC, GraphQL Federation, Drizzle ORM, Prisma. DevOps: Kubernetes, Helm, FluxCD, Docker, Dokploy, OpenTelemetry, Tempo, Loki, Prometheus, Grafana, Sentry. Frontend: React, React Native, Vue, Next.js 15, Vike SSR, Astro, TypeScript, Tailwind. AI: Claude Code, Cursor, RAG-пайплайны на pgvector." },
  { q: "Можно ли нанять Евгения как ментора?", a: "Да. На сайте доступны платные услуги: карьерная консультация - 2000 ₽ за час (разбор резюме, карьерная стратегия, подготовка к оффер-переговорам) и мок-собеседование - 5000 ₽ за 2 часа (live coding, system design, теория, развёрнутый фидбек). Также доступен на Solvery, GetMentor и через Telegram." },
  { q: "Проводит ли Евгений технические собеседования при найме?", a: "Да. Был тимлидом небольшой команды и активно проводит технические интервью с кандидатами в компанию - провёл уже несколько десятков. Оценивает архитектурное мышление, code review, фундамент по Node.js, SQL и system design." },
  { q: "Как связаться с Евгением?", a: "Предпочитаемый способ - Telegram: @eugene_nadtocheev (https://t.me/eugene_nadtocheev). Также доступен по email: johnn.hotmail@mail.ru и телефону: +7 (920) 080-87-00. Резюме на Habr Career: https://career.habr.com/webappmaster." },
  { q: "В каких отраслях работал Евгений?", a: "Финтех (платёжные системы, криптовалюты, fiat, биллинг - команда довела продукт до регистрации Оператором Финансовой Платформы ЦБ РФ); аналитика недвижимости (топ-1 b2b-платформа в РФ с 40K+ DAU, 200K+ посещений/сутки и 2000 rps); системная интеграция и IT-консалтинг." },
  { q: "Работает ли Евгений с AI и LLM?", a: "Да, активно. Спроектировал и реализовал ИИ-чат на собственном RAG-пайплайне со стримингом ответов внутри платформы аналитики, развернул pgvector в PostgreSQL для embeddings. Ежедневно использует Claude Code и Cursor в разработке - даёт реальное ускорение в пару раз." },
  { q: "Какое образование у Евгения?", a: "Академия Федеральной службы охраны Российской Федерации, Орёл (2019). Специальность: информационная безопасность телекоммуникационных систем; автоматизированные системы обработки информации и управления. Сертификат English Level B2 (2023)." },
  { q: "Создавал ли Евгений свои стартапы?", a: "Да, создатель двух собственных продуктов: СПИН (https://podbor-minuta.ru) - сервис мониторинга цен на новостройки Москвы с уведомлениями о скидках застройщиков (ПИК, Самолёт, Гранель, Level, Эталон) в Telegram; и SMETAS (https://alibaba.hhos.ru) - SaaS-платформа для составления строительных смет с базой материалов и командной работой." },
  { q: "В каком формате Евгений работает?", a: "Удалённо или гибридом из Москвы. Готов к переезду. Доступен для клиентов по всей России и странам СНГ. Менторство и услуги - для русскоязычных разработчиков по всему миру (на запрос - английский, уровень B2)." },
  { q: "Какие платные услуги предлагает Евгений на сайте?", a: "Карьерная консультация - 2000 ₽ за 1 час (разбор резюме и hh-профиля, карьерная стратегия и роадмап на 3-6 месяцев, подготовка к переговорам об оффере, запись встречи и текстовый follow-up). Мок-собеседование - 5000 ₽ за 2 часа (live coding и алгоритмы, system design на реальном кейсе, теория по Node.js / БД / архитектуре, развёрнутый фидбек по сильным и слабым сторонам). Оплата по факту проведения, удобное время согласуется в Telegram." },
  { q: "Где Евгений публикуется?", a: "Пишет технические и карьерные статьи на Хабре (habr.com/ru/articles/913984, habr.com/p/727810) и vc.ru. Выступает экспертом и лектором в Школе 21 (Сбер), на профильных IT-конференциях и митапах. Ведёт Telegram-каналы @captain_galera и @eugene_vibecode." },
];

const faqEn: FaqItem[] = [
  { q: "What does Evgeny Nadtocheev do?", a: `Fullstack Developer with ${experienceYears} years of commercial experience. Specializes in backend (Node.js, Go, NestJS, Fastify), DevOps (Kubernetes, Docker, OpenTelemetry), high-load microservices, and AI/LLM integrations. Currently at bnmap.pro, the #1 B2B real estate analytics platform in Russia.` },
  { q: "What is his tech stack?", a: "Backend: Node.js, Go, NestJS, Fastify, PostgreSQL (pgvector), Redis, Kafka, RabbitMQ, BullMQ, gRPC, GraphQL Federation, Drizzle ORM, Prisma. DevOps: Kubernetes, Helm, FluxCD, Docker, Dokploy, OpenTelemetry, Tempo, Loki, Prometheus, Grafana, Sentry. Frontend: React, React Native, Vue, Next.js 15, Vike SSR, Astro, TypeScript, Tailwind. AI: Claude Code, Cursor, in-house RAG with pgvector." },
  { q: "Can I hire Evgeny as a mentor?", a: "Yes. Paid services on this site: Career Consultation - 2,000 RUB / 1 hour (resume review, career strategy, offer negotiation prep) and Mock Interview - 5,000 RUB / 2 hours (live coding, system design, theory, detailed feedback). Also available on Solvery, GetMentor, and via Telegram." },
  { q: "Does Evgeny conduct technical interviews on the hiring side?", a: "Yes. He has acted as a tech lead for a small team and regularly conducts technical interviews for hiring - dozens of interviews so far. He evaluates architectural thinking, code review, and Node.js / SQL / system design fundamentals." },
  { q: "How to contact Evgeny?", a: "Preferred method: Telegram @eugene_nadtocheev (https://t.me/eugene_nadtocheev). Also reachable via email: johnn.hotmail@mail.ru and phone: +7 (920) 080-87-00. CV on Habr Career: https://career.habr.com/webappmaster." },
  { q: "What industries has he worked in?", a: "Fintech (payment systems, crypto, fiat, billing - team-built product registered as a financial platform operator by the Central Bank of Russia); Real Estate Analytics (#1 B2B platform in Russia with 40K+ DAU, 200K+ daily visits, 2,000 rps); System Integration and IT Consulting." },
  { q: "Does he work with AI and LLMs?", a: "Yes, actively. He designed and built an in-house RAG-powered AI chat with streaming responses inside the analytics platform, and rolled out pgvector in PostgreSQL for embeddings. He uses Claude Code and Cursor daily - it is a real 2× productivity multiplier." },
  { q: "What is his education?", a: "Academy of the Federal Guard Service of the Russian Federation (FSO), Oryol (2019). Specialty: Information Security of Telecommunication Systems; Automated Information Processing and Control Systems. English Level B2 certificate (2023)." },
  { q: "Has Evgeny founded any startups?", a: "Yes, founder of two products of his own: SPIN (https://podbor-minuta.ru) - a Moscow new-build price tracker with Telegram alerts on discounts from major developers (PIK, Samolet, Granel, Level, Etalon); and SMETAS (https://alibaba.hhos.ru) - a SaaS platform for construction estimates with a shared materials database and team collaboration." },
  { q: "What is his work format?", a: "Remote or hybrid from Moscow. Open to relocation. Available for clients across Russia and CIS. Mentoring and paid services worldwide for Russian-speaking developers (English available on request, B2 level)." },
  { q: "What paid services does Evgeny offer on this site?", a: "Career Consultation - 2,000 RUB / 1 hour (resume and Habr Career / hh profile review, career strategy and 3-6 month roadmap, offer negotiation prep, call recording and written follow-up). Mock Interview - 5,000 RUB / 2 hours (live coding and algorithmic round, system design on a real-world case, Node.js / DB / architecture theory, detailed feedback). Payment after the session, exact time agreed via Telegram." },
  { q: "Where does Evgeny publish?", a: "Writes technical and career articles on Habr (habr.com/ru/articles/913984, habr.com/p/727810) and vc.ru. Lectures and acts as an expert at School 21 (Sber) and at IT conferences and meetups. Runs Telegram channels @captain_galera and @eugene_vibecode." },
];

export function getFaq(lang: Lang): FaqItem[] {
  return lang === "ru" ? faqRu : faqEn;
}
