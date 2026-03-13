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
} as const;

/** Ключевые метрики для hero-секции */
export const heroMetrics = [
  { value: "5+" },
  { value: "50K+" },
  { value: "5000" },
  { value: "10+" },
] as const;
