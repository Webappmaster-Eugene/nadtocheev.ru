# nadtocheev.ru — Сайт-визитка Евгения Надточеева

Персональный сайт-визитка Fullstack-разработчика. Двуязычная версия (русский / английский), оптимизированная для SEO, поисковых систем Google/Яндекс и обнаружения нейросетями (LLM-friendly).

**Стек:** Astro 6 + Tailwind CSS v4 + TypeScript (strict) — полностью статический сайт с нулевым клиентским JS-бандлом.

**Деплой:** Docker (multi-stage: node:22-alpine → nginx:alpine) → Dokploy (Traefik для SSL).

---

## Быстрый старт

```bash
# Установка зависимостей
npm install

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
app/
├── src/
│   ├── pages/
│   │   ├── index.astro                # Русская версия (/)
│   │   ├── en/index.astro             # Английская версия (/en/)
│   │   └── 404.astro                  # Своя 404 (noindex)
│   ├── layouts/
│   │   └── Layout.astro               # SEO meta, OG, hreflang, JSON-LD @graph, общие inline-скрипты
│   ├── components/
│   │   ├── Header.astro               # Навигация, тема, язык, мобильное меню, подсветка секции
│   │   ├── Hero.astro                 # Имя, роль, tagline, CTA, метрики-счётчики
│   │   ├── About.astro                # «Обо мне»
│   │   ├── Expertise.astro            # 6 карточек направлений экспертизы
│   │   ├── Experience.astro           # Timeline опыта; на мобильных - «Показать всё»
│   │   ├── Projects.astro             # 3 ключевых проекта + собственные продукты (стартапы)
│   │   ├── AISection.astro            # AI & Automation, анимированный пример кода
│   │   ├── CodingChallenges.astro     # LeetCode, Codewars
│   │   ├── Publications.astro         # Статьи и выступления
│   │   ├── Mentoring.astro            # Менторство, площадки, каналы, фриланс
│   │   ├── Services.astro             # Платные услуги
│   │   ├── FAQ.astro                  # Частые вопросы (видимые + JSON-LD FAQPage)
│   │   ├── Contacts.astro             # Каналы связи
│   │   └── Footer.astro
│   ├── data/                          # ← ДАННЫЕ: редактируйте здесь при обновлении резюме
│   │   ├── personal.ts                # ФИО, контакты, ссылки, метрики hero
│   │   ├── career.ts                  # Стаж и длительности - считаются при сборке
│   │   ├── experience.ts              # Опыт работы (ru + en)
│   │   ├── projects.ts                # Ключевые проекты и стартапы (ru + en)
│   │   ├── skills.ts                  # Экспертиза (ru + en)
│   │   ├── publications.ts            # Статьи и выступления
│   │   ├── mentoring.ts               # Менторство
│   │   ├── services.ts                # Услуги и цены
│   │   └── faq.ts                     # FAQ
│   ├── i18n/translations.ts           # UI-строки, meta title/description (ru + en)
│   └── styles/global.css              # Tailwind v4, @font-face, токены, светлая тема, анимации
├── public/
│   ├── fonts/                         # Inter variable + JetBrains Mono (self-hosted, OFL)
│   ├── og-image.png, og-image-en.png  # OG-картинки RU/EN (scripts/generate-icons.mjs)
│   ├── robots.txt, llms.txt, llms-full.txt, humans.txt, site.webmanifest, .well-known/
│   └── favicon*.{svg,ico,png}, apple-touch-icon.png
├── scripts/generate-icons.mjs         # Фавиконки и OG-картинки (--og-only)
├── astro.config.mjs                   # site URL, Tailwind, Sitemap, инлайн CSS
├── Dockerfile                         # node:22-alpine → nginx:alpine
├── nginx.conf                         # Редиректы, 404, gzip, кеширование
├── nginx-security-headers.conf        # Security-заголовки (include в каждый location)
└── docker-compose.yml                 # Для Dokploy
```

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
3. Заполните все поля: `company`, `role`, `period`, `start`, `end` (без `end` - «по настоящее время»), `industry`, `backendFocus`, `highlights`, `stack`

Длительность («1 год 11 месяцев») и «N лет опыта» в hero, meta и FAQ вычисляются при сборке в `src/data/career.ts` - вручную их не пишите. На мобильных в карточке видны первые 4 достижения, остальное - по кнопке «Показать всё».

### Файл `src/data/projects.ts` — Проекты

Аналогично опыту: два массива (`projectsRu`, `projectsEn`), функция `getProjects(lang)`. Там же стартапы для блока «Собственные продукты»: `getStartups(lang)`.

### Файл `src/data/faq.ts` — FAQ

Один источник для видимого блока «Частые вопросы» и JSON-LD `FAQPage` (Google требует, чтобы разметка совпадала с видимым контентом). URL в ответах становятся ссылками автоматически.

### Синхронизация с `public/llms.txt` и `llms-full.txt`

Эти файлы для нейропоиска пишутся вручную. После изменения фактов (стек, опыт, услуги, ссылки) обновите их тоже - поищите старую формулировку по `src/` и `public/`.

### Файл `src/data/skills.ts` — Навыки и стек

- `getExpertise(lang)` — 6 категорий экспертизы (Backend, Архитектура, DevOps, Frontend, Telegram, AI) с описаниями на обоих языках

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
- `og:image` (1200x630) — `public/og-image.png` для RU, `public/og-image-en.png` для EN (генерируются `node scripts/generate-icons.mjs --og-only`)

### Twitter Cards

`summary_large_image` с title, description, image.

### JSON-LD Structured Data

Граф сущностей через `@id`: **Person** (контакты, sameAs, knowsAbout, образование, предложения услуг), **WebSite**, **ProfilePage** (даты публикации/изменения - изменение берётся из даты сборки), **BreadcrumbList**, **Organization**, два **Service** (консультация, мок-собеседование), **FAQPage** (из `faq.ts`, совпадает с видимым FAQ), два **SoftwareApplication** (стартапы).

Правило: в разметке только то, что есть на странице. Не добавлять SearchAction (поиска нет), Course, Article чужих статей, зарплату.

### Sitemap

Автоматически генерируется через `@astrojs/sitemap`. Содержит обе страницы:
- `https://nadtocheev.ru/`
- `https://nadtocheev.ru/en/`

Ссылка на sitemap указана в `robots.txt`.

### llms.txt

Файл `public/llms.txt` — машиночитаемое описание сайта для нейросетей (формат llmstxt.org: ссылки в перечнях - markdown `[название](url)`). Подробная версия - `public/llms-full.txt`. Содержит:
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

Шрифты self-hosted в `public/fonts/`: Inter variable (ось `wght` 100–900, по файлу на latin и cyrillic) и JetBrains Mono 400/500; `font-display: swap`, preload латиницы (и кириллицы на RU).

### Анимации

| Класс | Эффект | Где используется |
|-------|--------|-----------------|
| `.animate-fade-in` | Плавное появление (opacity 0→1) | Hero badge |
| `.animate-slide-up` | Появление снизу (translateY + opacity) | Hero CTA |
| `.gradient-text` | Градиент на тексте | Фамилия в hero |
| `.reveal` | Scroll-triggered появление снизу (только при классе `.js` на `<html>` - без JS контент виден) | Каждая секция |
| `.stagger-children` | Последовательное появление дочерних элементов | Карточки, списки |
| `.timeline-dot--active` | Пульсирующее свечение | Текущая позиция в timeline |

Все анимации **автоматически отключаются** при `prefers-reduced-motion: reduce`. Имя, роль, tagline и метрики hero - без анимации появления: это кандидаты в LCP. Блобы hero на телефонах статичны.

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

Порядок на странице (id секции = якорь в меню):

1. **Header** — фиксированная шапка: лого, навигация (на `lg+`), переключатель темы (по умолчанию системная), EN/RU (сохраняет текущий раздел), CTA в Telegram, мобильное меню; подсветка активной секции
2. **Hero** (`#hero`) — статус, имя, роль, tagline, CTA (Telegram, GitHub, Habr Career), 4 метрики-счётчика (стаж считается при сборке)
3. **About** (`#about`) — 5 абзацев: три места работы, принципы, продукты и менторство
4. **Expertise** (`#expertise`) — 6 карточек направлений со skill-badges
5. **Experience** (`#experience`) — timeline 3 мест работы: роль, период, длительность (авто), достижения, стек
6. **Projects** (`#projects`) — 3 ключевых проекта с метриками и стеком + «Собственные продукты» (СПИН, SMETAS)
7. **AI & Automation** (`#ai`) — описание, 3 фичи, анимированный пример кода RAG (pgvector + Drizzle + SSE)
8. **Coding** (`#coding`) — LeetCode, Codewars
9. **Publications** (`#publications`) — статистика, статьи (Хабр, vc.ru), выступления
10. **Mentoring** (`#mentoring`) — статистика, площадки, что делаю, Telegram-каналы, амбассадорство, фриланс
11. **Services** (`#services`) — 2 платные услуги с ценой и составом, запись в Telegram
12. **FAQ** (`#faq`) — 12 вопросов-аккордеонов (в меню нет)
13. **Contacts** (`#contacts`) — Telegram (предпочтительно), телефон, email, GitHub, Habr Career, статьи, webappmaster.ru
14. **Footer** — копирайт

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

1. **Yandex.Webmaster**: раскомментировать `<meta name="yandex-verification">` в `Layout.astro` и вставить ID
2. **Google Search Console**: аналогично для `google-site-verification`
3. **Яндекс.Метрика / Google Analytics**: добавить скрипт при необходимости

---

## Nginx

Конфигурация `nginx.conf` включает:

| Настройка | Описание |
|-----------|----------|
| Gzip | text, css, json, js, xml, svg, manifest — сжатие от 256 байт |
| Кеширование | `/_astro/*` (хешированные) — `1 year, immutable`; `/fonts/*` — 30 дней; прочая статика без хеша (og-image, фавиконки) — 1 день; HTML/txt — `no-cache` |
| Security headers | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy — в `nginx-security-headers.conf`, подключается через `include` в каждый location (nginx не наследует `add_header` уровня server) |
| Редиректы | `absolute_redirect off` — `/en` → `/en/` относительным редиректом, без ухода на http за Traefik |
| 404 | `error_page 404 /404.html` — кастомная страница с кодом 404 (в т.ч. на `/404`), `noindex` |
| Hidden files | Запрет доступа к файлам, начинающимся с `.` (кроме `/.well-known/`) |

---

## Производительность

| Метрика | Значение |
|---------|----------|
| JS-бандлы | 0 файлов, только inline-скрипты |
| CSS | ~45 KB (~9 KB gzip), инлайнится в HTML - нет render-blocking запросов |
| HTML (RU / EN) | ~222 / ~205 KB (~45 / ~41 KB gzip) |
| Шрифты | Self-hosted Inter variable (2 файла, ~67 KB) + JetBrains Mono, preload + display=swap |
| Gzip | Настроен в nginx |
| Cache | `/_astro/*` - 1 год immutable; шрифты - 30 дней; прочая статика - 1 день; HTML - `no-cache` |
| Lighthouse (mobile / desktop) | 97–99 / 100; Accessibility, Best Practices, SEO - 100 |

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
- Ссылка «Перейти к содержимому» первым Tab; фокус-кольцо `:focus-visible`
- Без JS контент виден (reveal-анимации включаются только под `.js`)
- Кнопка EN/RU: aria-label содержит видимый текст; «Показать всё» в опыте - `aria-expanded` / `aria-controls`

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
