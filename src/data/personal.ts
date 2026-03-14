/**
 * Личные данные и контакты.
 * Единственное место для редактирования контактной информации.
 */
export const personal = {
  name: {
    first: { ru: "Евгений", en: "Evgeny" },
    last: { ru: "Надточеев", en: "Nadtocheev" },
    full: { ru: "Евгений Надточеев", en: "Evgeny Nadtocheev" },
  },
  location: { ru: "Москва, Россия", en: "Moscow, Russia" },

  /* Контакты — для HR и рекрутеров */
  email: "johnn.hotmail@mail.ru",
  phone: "+7 (920) 080-87-00",
  telegram: "https://t.me/eugene_nadtocheev",
  telegramUsername: "@eugene_nadtocheev",
  github: "https://github.com/Webappmaster-Eugene",
  habr: "https://career.habr.com/webappmaster",
  habrArticles: "https://habr.com/ru/articles/913984/",
  youtube: "https://www.youtube.com/@webappmaster/videos",
  website: "https://nadtocheev.ru",
  websiteProjects: "https://webappmaster.ru",

  /* Конкурентное программирование */
  leetcode: "https://leetcode.com/u/Numart/",
  codewars: "https://www.codewars.com/users/Wepappmaster",

  /* Telegram-каналы */
  telegramChannels: {
    captainGalera: "https://t.me/captain_galera",
    eugeneVibecode: "https://t.me/eugene_vibecode",
  },

  /* Менторство */
  mentoring: {
    solvery: "https://solvery.io/ru/mentor/28861",
    getmentor: "https://getmentor.dev/mentor/evgeniy-nadtocheev-5227",
    easyoffer: "https://easyoffer.ru/mentors/captain_galera",
    hcareers: "https://h.careers/",
    school21Post: "https://t.me/ingacademy_magas/614",
    purpleschool: "https://purpleschool.ru",
  },

  /* Фриланс */
  freelance: {
    a24: "https://a24.biz/authors/2121425/",
    vsesdal: "https://vsesdal.com/cabinet/executor/1836368",
  },

  /* Стартапы */
  startups: {
    adminHouse: "https://github.com/Webappmaster-Eugene/admin-house-full",
    mskFlatParser: "https://github.com/Webappmaster-Eugene/msk_flat_parser",
    calendarClown: "https://github.com/Webappmaster-Eugene/calendar_clown",
  },

  /* Амбассадорство */
  preoffer: "https://preoffer.vercel.app/",
} as const;

/** Ключевые метрики для hero-секции */
export const heroMetrics = [
  { value: "5+" },
  { value: "50K+" },
  { value: "5000" },
  { value: "10+" },
] as const;
