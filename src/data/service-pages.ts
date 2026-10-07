import type { Lang } from "../i18n/translations.ts";
import { getServices } from "./services.ts";
import { getFaq } from "./faq.ts";

export const serviceSlugs = ["career-consultation", "mock-interview"] as const;
export type ServiceSlug = typeof serviceSlugs[number];
export const servicePath = (slug: ServiceSlug, lang: Lang) => `${lang === "en" ? "/en" : ""}/${slug}/`;

const copy = {
  ru: {
    "career-consultation": {
      heading: "Карьерная консультация для разработчиков",
      intro: "Разберём вашу карьерную задачу: резюме, выбор стека, выход на рынок или переговоры об оффере. Консультация помогает связать текущий опыт с дальнейшими шагами в разработке.",
      audience: "Подойдёт, если вы хотите понятнее представить свой опыт работодателю, определить направление роста или подготовиться к смене работы. Фокус встречи — ваша ситуация и конкретные вопросы о карьере.",
      preparation: "Перед встречей пришлите в Telegram резюме или ссылку на профиль и вопросы, которые хотите разобрать. Если обсуждаем поиск работы, добавьте интересующие вакансии: так разговор будет предметнее.",
      result: "После встречи у вас останутся карьерный план на 3–6 месяцев, запись разговора и текстовый follow-up. Разберём, как представить ваш опыт и подготовиться к переговорам об оффере.",
    },
    "mock-interview": {
      heading: "Мок-собеседование для backend и fullstack-разработчиков",
      intro: "Практика технического интервью с разбором решений и развёрнутой обратной связью. Проверим live coding, system design и теорию по Node.js, базам данных и архитектуре.",
      audience: "Подойдёт, если вы готовитесь к техническому интервью и хотите проверить, как объясняете решения, рассуждаете об архитектуре и справляетесь с практическими задачами.",
      preparation: "Напишите в Telegram, к какой роли готовитесь, какой стек используете и какие темы вызывают вопросы. Можно прислать описание вакансии, чтобы обсудить её требования перед встречей.",
      result: "Получите развёрнутую обратную связь по сильным и слабым сторонам: практическим решениям, технической базе и тому, как вы объясняете свой ход мысли. Разбор поможет понять, что стоит подтянуть перед реальным интервью.",
    },
  },
  en: {
    "career-consultation": {
      heading: "Career Consultation for Developers",
      intro: "Work through your career questions: your resume, stack choices, job search or offer negotiations. Connect your current engineering experience to practical next steps.",
      audience: "For developers who want to present their experience more clearly, choose a growth direction or prepare for a job change. The session focuses on your situation and specific career questions.",
      preparation: "Send your resume or profile link and the questions you want to discuss on Telegram before the session. For job-search questions, include roles you are considering to make the discussion more concrete.",
      result: "You will receive a career plan for the next 3–6 months, a recording and a written follow-up. We will discuss how to present your experience and prepare for offer negotiations.",
    },
    "mock-interview": {
      heading: "Mock Interview for Backend and Fullstack Developers",
      intro: "Practise a technical interview with a review of your solutions and detailed feedback. Work through live coding, system design and Node.js, database and architecture fundamentals.",
      audience: "For developers preparing for a technical interview who want to test how they explain decisions, reason about architecture and handle practical tasks.",
      preparation: "On Telegram, describe the role you are preparing for, your stack and the topics you find challenging. You can share a job description so we can discuss its requirements before the session.",
      result: "Receive detailed feedback on your strengths and gaps: practical solutions, technical foundations and how you explain your reasoning. The review will help you decide what to work on before a real interview.",
    },
  },
};

export function getServicePage(slug: ServiceSlug, lang: Lang) {
  const index = serviceSlugs.indexOf(slug);
  const service = getServices(lang).items[index];
  if (!service) throw new Error(`Unknown service: ${slug}`);
  const content = copy[lang][slug];
  const price = service.price.replace(/\s*₽$/, lang === "ru" ? " рублей" : " RUB");
  return {
    slug, service, ...content,
    path: servicePath(slug, lang),
    title: lang === "ru"
      ? `${service.name} — ${service.price} | Евгений Надточеев`
      : `${service.name} — ${price} | Evgeny Nadtocheev`,
    description: lang === "ru"
      ? `${service.name}: ${price} за ${service.duration}. ${slug === "career-consultation" ? "Резюме, карьерный план, подготовка к офферу." : "Live coding, system design и развёрнутый фидбек."} Онлайн, запись в Telegram.`
      : `${service.name}: ${price} for ${service.duration}. ${slug === "career-consultation" ? "Resume review, career plan and offer negotiation prep." : "Live coding, system design and detailed feedback."} Book online via Telegram.`,
    faq: getFaq(lang).filter((_, i) => [2, 9, 10].includes(i)),
  };
}
