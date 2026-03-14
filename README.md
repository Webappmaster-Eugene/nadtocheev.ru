# nadtocheev.ru — Сайт-визитка Евгения Надточеева

Персональный сайт-визитка Fullstack-разработчика. Двуязычная версия (русский / английский), оптимизированная для SEO, поисковых систем Google/Яндекс и обнаружения нейросетями (LLM-friendly).

**Стек:** Astro 6 + Tailwind CSS v4 + TypeScript (strict) — полностью статический сайт с нулевым клиентским JS-бандлом.

**Деплой:** Docker (multi-stage: node:22-alpine → nginx:alpine) → Dokploy (Traefik для SSL).

---

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Локальная разработка (hot-reload)
npm run dev        # → http://localhost:4321

# Продакшн-сборка
npm run build      # → dist/

# Предпросмотр сборки
npm run preview    # → http://localhost:4321
```

## Docker

```bash
# Сборка образа
docker build -t nadtocheev-visitka .

# Локальный запуск (с пробросом порта)
docker run -p 3000:80 nadtocheev-visitka   # → http://localhost:3000

# Через docker-compose (для Dokploy/Traefik — без проброса портов)
docker compose up -d
docker compose down
```

> **Примечание:** В `docker-compose.yml` порты не пробрасываются на хост — Traefik маршрутизирует трафик к контейнеру через внутреннюю сеть Docker. Для локальной отладки используйте `docker run -p 3000:80`.

---

## Структура проекта

```
visitka/
├── src/
│   ├── pages/
│   │   ├── index.astro                # Русская версия (/)
│   │   └── en/
│   │       └── index.astro            # Английская версия (/en/)
│   ├── layouts/
│   │   └── Layout.astro               # Базовый layout: SEO meta, OG, hreflang, JSON-LD, шрифты
│   ├── components/
│   │   ├── Header.astro               # Фиксированная навигация + переключатель языка + мобильное меню
│   │   ├── Hero.astro                 # Имя, tagline, метрики, CTA-кнопки, animated badge
│   │   ├── About.astro                # Секция «Обо мне»
│   │   ├── Expertise.astro            # 4 карточки направлений экспертизы
│   │   ├── TechStack.astro            # Полный стек по категориям (8 групп)
│   │   ├── Experience.astro           # Timeline карьеры с метриками и стеком
│   │   ├── Projects.astro             # 3 ключевых проекта
│   │   ├── AISection.astro            # AI & Automation — акцентная секция с code snippet
│   │   ├── Contacts.astro             # Все каналы связи (Telegram, телефон, email, GitHub, Habr, YouTube)
│   │   └── Footer.astro               # Копирайт
│   ├── data/                          # ← ДАННЫЕ: редактируйте здесь при обновлении резюме
│   │   ├── personal.ts                # ФИО, контакты, ссылки (общие для обоих языков)
│   │   ├── experience.ts              # Опыт работы (ru + en)
│   │   ├── projects.ts                # Ключевые проекты (ru + en)
│   │   └── skills.ts                  # Экспертиза и технологический стек (ru + en)
│   ├── i18n/
│   │   └── translations.ts            # Все UI-строки: секции, навигация, мета-теги (ru + en)
│   └── styles/
│       └── global.css                 # Tailwind v4, design tokens, анимации, utility-классы
├── public/
│   ├── favicon.svg                    # SVG-фавикон
│   ├── robots.txt                     # SEO: Allow all + sitemap
│   └── llms.txt                       # Структурированное описание для нейросетей
├── astro.config.mjs                   # Astro: site URL, Tailwind, Sitemap
├── tsconfig.json                      # TypeScript strict
├── package.json                       # Зависимости и скрипты
├── docker-compose.yml                 # Docker Compose для Dokploy
├── Dockerfile                         # Multi-stage build: node:22-alpine → nginx:alpine
├── nginx.conf                         # Gzip, кеширование, security headers
└── .dockerignore                      # Исключения для Docker-контекста
```

---

## Как редактировать контент

Весь контент сайта вынесен в **типизированные TypeScript-файлы** в `src/data/` и `src/i18n/`. Компоненты автоматически отрисовывают данные — при обновлении резюме менять компоненты не нужно.

### Файл `src/data/personal.ts` — Личные данные и контакты

Здесь хранятся ФИО, телефон, email, ссылки на все соцсети. Эти данные используются:
- В шапке сайта (лого, CTA-кнопка)
- В hero-секции (имя, CTA)
- В контактах (все каналы связи)
- В JSON-LD structured data (для поисковиков)
- В Open Graph мета-тегах

```typescript
export const personal = {
  name: {
    first: { ru: "Евгений", en: "Evgeny" },
    last: { ru: "Надточеев", en: "Nadtocheev" },
    full: { ru: "Евгений Надточеев", en: "Evgeny Nadtocheev" },
  },
  email: "johnn.hotmail@mail.ru",
  phone: "+7 (920) 080-87-00",
  telegram: "https://t.me/eugene_nadtocheev",
  // ... остальные контакты
};
```

### Файл `src/data/experience.ts` — Опыт работы

Массив позиций с полями: компания, роль, период, индустрия, достижения, стек. Есть отдельный массив для русского и английского языков. Функция `getExperience(lang)` возвращает нужную версию.

**Как добавить новое место работы:**
1. Добавьте объект в начало массива `experienceRu` (новое место — первое)
2. Добавьте аналогичный объект в `experienceEn`
3. Заполните все поля: `company`, `role`, `period`, `duration`, `industry`, `backendFocus`, `highlights`, `stack`

### Файл `src/data/projects.ts` — Проекты

Аналогично опыту: два массива (`projectsRu`, `projectsEn`), функция `getProjects(lang)`.

### Файл `src/data/skills.ts` — Навыки и стек

- `getExpertise(lang)` — 4 категории экспертизы (Backend, DevOps, Frontend, AI) с описаниями на обоих языках
- `techStackGroups` — 8 групп технологий (одинаковые для обоих языков, т.к. названия технологий не переводятся)

### Файл `src/i18n/translations.ts` — UI-строки

Все тексты интерфейса: заголовки секций, подписи кнопок, мета-теги, навигация. Структура:

```typescript
translations.ru.hero.badge      // → "Открыт к предложениям"
translations.en.hero.badge      // → "Open to opportunities"
translations.ru.nav.contact     // → "Связаться"
translations.en.nav.contact     // → "Get in Touch"
```

---

## Двуязычность (i18n)

### Архитектура

Сайт использует **file-based routing** Astro для двух языков:

| URL | Файл | Язык |
|-----|------|------|
| `/` | `src/pages/index.astro` | Русский (default) |
| `/en/` | `src/pages/en/index.astro` | Английский |

Оба файла идентичны по структуре — отличаются только значением `lang`:

```astro
const lang = "ru" as const;  // или "en"

<Layout lang={lang}>
  <Header lang={lang} />
  <Hero lang={lang} />
  <!-- ... -->
</Layout>
```

Каждый компонент принимает `lang` и получает переводы через `t(lang)`:

```typescript
import { type Lang, t } from "../i18n/translations.ts";
const tr = t(lang);
// tr.hero.badge → "Открыт к предложениям" или "Open to opportunities"
```

### Переключатель языка

В хедере есть кнопка **EN/RU**, которая ведёт на альтернативную языковую версию:
- На русской странице: кнопка «EN» → `/en/`
- На английской странице: кнопка «RU» → `/`

### hreflang

Обе страницы содержат тройку `<link rel="alternate" hreflang="...">`:
```html
<link rel="alternate" hreflang="ru" href="https://nadtocheev.ru/" />
<link rel="alternate" hreflang="en" href="https://nadtocheev.ru/en/" />
<link rel="alternate" hreflang="x-default" href="https://nadtocheev.ru/" />
```

Это позволяет Google и Яндексу правильно индексировать обе версии и показывать пользователю нужную.

---

## SEO-оптимизация

### Мета-теги (Layout.astro)

Каждая языковая версия имеет полный набор:
- `<title>` и `<meta name="description">` — на соответствующем языке
- `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`
- `<link rel="canonical">` — уникальный для каждой версии
- `<meta name="author">` — имя на соответствующем языке

### Open Graph

Тип `og:type="profile"` (оптимально для персональных сайтов):
- `og:locale` + `og:locale:alternate` — для мультиязычности
- `profile:first_name`, `profile:last_name` — для OG profile
- `og:image` (1200x630) — требуется `public/og-image.png`

### Twitter Cards

`summary_large_image` с title, description, image.

### JSON-LD Structured Data

Три связанных сущности через `@id`:

1. **Person** — имя, должность, email, телефон, sameAs (все соцсети), knowsAbout (19 технологий), knowsLanguage (ru, en с proficiencyLevel), address, nationality
2. **WebSite** — url, name, description, publisher → Person
3. **ProfilePage** — url, inLanguage, about → Person, isPartOf → WebSite

Это позволяет Google, Яндексу и нейросетям (ChatGPT, Claude, Perplexity) структурированно извлекать информацию о владельце сайта.

### Sitemap

Автоматически генерируется через `@astrojs/sitemap`. Содержит обе страницы:
- `https://nadtocheev.ru/`
- `https://nadtocheev.ru/en/`

Ссылка на sitemap указана в `robots.txt`.

### llms.txt

Файл `public/llms.txt` — машиночитаемое описание сайта для нейросетей (аналог robots.txt для LLM). Содержит:
- Контактную информацию
- Описание экспертизы
- Весь опыт работы
- Образование
- Языки

---

## Дизайн-система

### Цветовая палитра (тёмная тема)

| Token | Цвет | Назначение |
|-------|------|-----------|
| `--color-bg` | `#09090b` | Фон страницы |
| `--color-surface` | `#111113` | Фон карточек |
| `--color-surface-hover` | `#18181b` | Фон карточек при hover |
| `--color-border` | `#27272a` | Границы |
| `--color-text` | `#fafafa` | Основной текст |
| `--color-text-muted` | `#a1a1aa` | Вторичный текст |
| `--color-text-dim` | `#71717a` | Третичный текст |
| `--color-accent` | `#3b82f6` | Акцентный (синий) |
| `--color-purple` | `#8b5cf6` | Фиолетовый (AI-секция) |
| `--color-green` | `#22c55e` | Зелёный (статус, чекмарки) |
| `--color-orange` | `#f59e0b` | Оранжевый |
| `--color-red` | `#ef4444` | Красный |

### Типографика

- **Заголовки:** Inter 700–800
- **Тело:** Inter 400–500
- **Код:** JetBrains Mono 400–500

Шрифты подключены через Google Fonts с `display=swap` и `preconnect`.

### Анимации

| Класс | Эффект | Где используется |
|-------|--------|-----------------|
| `.animate-fade-in` | Плавное появление (opacity 0→1) | Hero badge, заголовок |
| `.animate-slide-up` | Появление снизу (translateY + opacity) | Hero subtitle, CTA, метрики |
| `.gradient-text` | Переливающийся градиент на тексте | Фамилия в hero, заголовки секций |
| `.reveal` | Scroll-triggered появление снизу | Каждая секция |
| `.stagger-children` | Последовательное появление дочерних элементов | Карточки, списки |
| `.timeline-dot--active` | Пульсирующее свечение | Текущая позиция в timeline |

Все анимации **автоматически отключаются** при `prefers-reduced-motion: reduce`.

### UI-компоненты

| Класс | Описание |
|-------|----------|
| `.card` | Карточка: bg-surface, border, border-radius 16px, hover с glow-эффектом |
| `.badge` | Тег/бейдж: округлённый, accent-цвет, мелкий шрифт |
| `.section-title` | Заголовок секции: 2.25–2.75rem, font-weight 800 |
| `.section-subtitle` | Подзаголовок секции: text-muted, margin-bottom 3rem |
| `.timeline-line` | Вертикальная линия timeline (gradient blue→purple→transparent) |
| `.timeline-dot` | Точка timeline с подсветкой |

---

## Секции сайта

### 1. Header
Фиксированный в верхней части экрана (`position: fixed`) с `backdrop-blur`. Содержит:
- Лого (фамилия с акцентной точкой)
- Навигационные ссылки (якоря на секции)
- Переключатель языка (EN/RU)
- CTA-кнопка «Связаться» → Telegram
- Мобильное меню (hamburger, скрыто на `md:`)

### 2. Hero
Главный экран с фоновым градиентным glow. Содержит:
- Пульсирующий зелёный индикатор «Открыт к предложениям»
- ФИО с gradient-text на фамилии
- Должность и специализация
- Tagline (1 предложение)
- Две CTA-кнопки: Telegram (primary) и GitHub (outline)
- 4 метрики: годы опыта, посещения, rps, микросервисы

### 3. About
Текстовый блок «Обо мне» — 4 параграфа с `<strong>` акцентами. Ключевые факты: 5+ лет, backend-фокус 80%, финтех, аналитика, AI, стартапы, управление командами.

### 4. Expertise
4 карточки с цветными левыми бордерами:
- Backend & Microservices (синий)
- DevOps & Infrastructure (зелёный)
- Frontend (оранжевый)
- AI & Automation (фиолетовый)

Каждая содержит SVG-иконку, описание и набор skill-badges.

### 5. Tech Stack
8 компактных карточек по категориям: Languages, Backend, Databases, Message Brokers, Frontend, DevOps, Monitoring, Architecture. Технологии в виде hoverable-тегов.

### 6. Experience
Вертикальный timeline с gradient-линией и пульсирующей точкой на текущей позиции. 4 позиции с:
- Компания, роль, период, длительность
- Индустрия и % backend
- 4–6 bullet-points с достижениями (с чекмарками)
- Стек в цветных бейджах: backend (синий), frontend (фиолетовый), devops (зелёный)

### 7. Projects
3 карточки ключевых проектов: аналитика недвижимости, финтех-платформа, AI-инструменты. Каждая содержит описание, метрики (2x2 grid) и стек.

### 8. AI & Automation
Акцентная секция с фиолетовым left-border. Двухколоночный layout:
- Левая: описание + 3 feature-блока (RAG, IDE-ассистенты, Vector DB)
- Правая: стилизованный code snippet (имитация IDE) + теги

### 9. Contacts
Список карточек-ссылок на все каналы связи. Telegram отмечен как предпочитаемый. Телефон и email — отдельные кликабельные карточки (`tel:`, `mailto:`). Внешние ссылки открываются в новой вкладке, внутренние (tel, mailto) — нет.

### 10. Footer
Копирайт + информация о технологиях сборки.

---

## Деплой через Dokploy

### Требования
- VDS с установленным Dokploy
- Домен `nadtocheev.ru` с A-записью на IP сервера

### Настройка в Dokploy

1. **Создать проект** → тип «Docker Compose»
2. **Источник**: GitHub → `https://github.com/Webappmaster-Eugene/nadtocheev.ru`
3. **Compose Path**: `docker-compose.yml`
4. **Домен**: `nadtocheev.ru` (Traefik автоматически выдаст SSL через Let's Encrypt)
5. **Port**: 80 (внутренний порт контейнера)

### ENV-переменные

**Не требуются.** Сайт полностью статический — все данные вшиваются на этапе сборки. Traefik проксирует трафик напрямую на порт 80 контейнера через внутреннюю сеть Docker.

### Что происходит при деплое

1. Dokploy клонирует репозиторий
2. Docker build: `node:22-alpine` устанавливает зависимости (`npm ci`) и собирает сайт (`npm run build`)
3. Результат сборки (`dist/`) копируется в `nginx:alpine`
4. nginx отдаёт статику с gzip, кешированием и security headers
5. Traefik проксирует HTTPS-трафик на порт 80 контейнера

### Что нужно сделать после первого деплоя

1. **OG-изображение**: создать `public/og-image.png` (1200x630 px) и пересобрать
2. **Фото**: добавить `public/photo.jpg` — оно указано в JSON-LD `image`
3. **Yandex.Webmaster**: раскомментировать `<meta name="yandex-verification">` в `Layout.astro` и вставить ID
4. **Google Search Console**: аналогично для `google-site-verification`
5. **Яндекс.Метрика / Google Analytics**: добавить скрипт при необходимости

---

## Nginx

Конфигурация `nginx.conf` включает:

| Настройка | Описание |
|-----------|----------|
| Gzip | text, css, json, js, xml, svg — сжатие от 256 байт |
| Кеширование | Статические ассеты (css, js, img, fonts) — `1 year, immutable` |
| Security headers | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection |
| SPA fallback | `try_files $uri $uri/ /index.html` |
| Hidden files | Запрет доступа к файлам, начинающимся с `.` |

---

## Производительность

| Метрика | Значение |
|---------|----------|
| JS-бандлы | 0 файлов (inline scripts ~30 строк) |
| CSS | ~31 KB (Tailwind v4 с tree-shaking) |
| HTML (RU) | ~76 KB |
| HTML (EN) | ~72 KB |
| Шрифты | Google Fonts с preconnect + display=swap |
| Gzip | Настроен в nginx |
| Cache | 1 год для статики (immutable) |

---

## Accessibility (a11y)

- Все декоративные SVG-иконки: `aria-hidden="true"`
- Мобильное меню: `aria-label`, `aria-expanded`, `aria-controls`
- Секции: `aria-label` на каждой `<section>`
- `prefers-reduced-motion: reduce` — все анимации отключаются, контент виден сразу
- `mailto:` и `tel:` ссылки не открываются в новой вкладке
- Семантическая разметка: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- `<html lang="ru">` / `<html lang="en">` — для screen readers
- `::selection` стилизован для лучшей читаемости

---

## Команды

| Команда | Описание |
|---------|----------|
| `npm install` | Установка зависимостей |
| `npm run dev` | Dev-сервер с hot-reload → `localhost:4321` |
| `npm run build` | Продакшн-сборка → `dist/` |
| `npm run preview` | Предпросмотр сборки → `localhost:4321` |
| `docker build -t visitka .` | Сборка Docker-образа |
| `docker compose up -d` | Запуск через docker-compose |
| `docker compose down` | Остановка |

---

## Зависимости

| Пакет | Версия | Назначение |
|-------|--------|-----------|
| `astro` | ^6.0.4 | Static site generator |
| `@tailwindcss/vite` | ^4.2.1 | Tailwind CSS v4 (Vite plugin) |
| `tailwindcss` | ^4.2.1 | CSS framework |
| `@astrojs/sitemap` | ^3.7.1 | Автогенерация sitemap.xml |
