/**
 * Данные о менторстве и преподавании — двуязычная версия.
 */
import type { Lang } from "../i18n/translations.ts";

export interface MentoringPlatform {
  name: string;
  url: string;
  description: string;
}

export interface MentoringData {
  stats: {
    paidConsultations: string;
    freeConsultations: string;
    teachingYears: string;
    platforms: string;
  };
  statsLabels: {
    paidConsultations: string;
    freeConsultations: string;
    teachingYears: string;
    platforms: string;
  };
  platforms: MentoringPlatform[];
  activities: string[];
}

const mentoringRu: MentoringData = {
  stats: {
    paidConsultations: "30+",
    freeConsultations: "50+",
    teachingYears: "2",
    platforms: "5+",
  },
  statsLabels: {
    paidConsultations: "платных консультаций",
    freeConsultations: "бесплатных консультаций",
    teachingYears: "года преподавания",
    platforms: "менторских площадок",
  },
  platforms: [
    {
      name: "Школа 21 (Сбер)",
      url: "https://t.me/ingacademy_magas/614",
      description: "Эксперт и лектор",
    },
    {
      name: "Purple School",
      url: "https://purpleschool.ru",
      description: "Наставник и преподаватель (2 года)",
    },
    {
      name: "Solvery",
      url: "https://solvery.io/ru/mentor/28861",
      description: "Ментор по fullstack-разработке",
    },
    {
      name: "GetMentor",
      url: "https://getmentor.dev/mentor/evgeniy-nadtocheev-5227",
      description: "Карьерные консультации и менторство",
    },
    {
      name: "EasyOffer",
      url: "https://easyoffer.ru/mentors/captain_galera",
      description: "Подготовка к собеседованиям",
    },
    {
      name: "H.Careers",
      url: "https://h.careers/",
      description: "Менторская площадка",
    },
  ],
  activities: [
    "Провожу мок-собеседования для fullstack-разработчиков",
    "Карьерные консультации: составление резюме, подготовка к интервью",
    "Менторство по собственной системе и роадмапам",
    "Провёл 30+ платных и 50+ бесплатных консультаций",
  ],
};

const mentoringEn: MentoringData = {
  stats: {
    paidConsultations: "30+",
    freeConsultations: "50+",
    teachingYears: "2",
    platforms: "5+",
  },
  statsLabels: {
    paidConsultations: "paid consultations",
    freeConsultations: "free consultations",
    teachingYears: "years of teaching",
    platforms: "mentoring platforms",
  },
  platforms: [
    {
      name: "School 21 (Sber)",
      url: "https://t.me/ingacademy_magas/614",
      description: "Expert & Lecturer",
    },
    {
      name: "Purple School",
      url: "https://purpleschool.ru",
      description: "Instructor & Mentor (2 years)",
    },
    {
      name: "Solvery",
      url: "https://solvery.io/ru/mentor/28861",
      description: "Fullstack development mentoring",
    },
    {
      name: "GetMentor",
      url: "https://getmentor.dev/mentor/evgeniy-nadtocheev-5227",
      description: "Career consulting & mentoring",
    },
    {
      name: "EasyOffer",
      url: "https://easyoffer.ru/mentors/captain_galera",
      description: "Interview preparation",
    },
    {
      name: "H.Careers",
      url: "https://h.careers/",
      description: "Mentoring platform",
    },
  ],
  activities: [
    "Mock interviews for fullstack developers",
    "Career consulting: resume building, interview preparation",
    "Mentoring based on custom roadmaps and methodology",
    "30+ paid and 50+ free consultations completed",
  ],
};

export function getMentoring(lang: Lang): MentoringData {
  return lang === "ru" ? mentoringRu : mentoringEn;
}
