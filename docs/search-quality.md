# SEO, GEO и измерение качества

Статические страницы: `/`, `/en/`, `/career-consultation/`, `/mock-interview/` и английские версии услуг. Главная отвечает на запросы о специалисте, страницы услуг — на разные задачи клиентов. Это полноценные страницы с условиями, подготовкой, результатом и ссылками, а не копии текста для набора ключевых слов.

## Контент и разметка

- Цены и состав услуг: `src/data/services.ts`. Тексты страниц услуг: `src/data/service-pages.ts`. FAQ виден читателю и совпадает с JSON-LD.
- JSON-LD собирает `src/lib/structured-data.ts`: Person, WebSite, ProfilePage на главной, WebPage/Service/BreadcrumbList на страницах услуг, FAQPage и собственные проекты как CreativeWork. `sameAs` содержит личные профили. Неподтверждённых рейтингов, цен стартапов и организаций нет.
- canonical и hreflang указывают на конкретную страницу своего языка. `/index.html` и `/en/index.html` перенаправляются на адреса с `/`. URL с метками доступны роботу: Google/Bing могут прочесть canonical; Яндекс использует Clean-param.
- `llms.txt` / `llms-full.txt` — дополнительное представление тех же фактов для сервисов, которые их используют. Google не использует эти файлы для повышения видимости или позиций и не требует специальной GEO-разметки.
- Google прекратил показ FAQ rich results с 7 мая 2026. Видимый FAQ и согласованный FAQPage описывают содержимое; Service — семантическое описание услуги, не обещание товарного rich result. Разметка должна соответствовать видимому содержимому.

## Подключение аккаунтов

В `.env.example` перечислены **публичные** параметры сборки:

| Параметр | Назначение |
| --- | --- |
| `PUBLIC_YANDEX_METRIKA_ID` | ID счётчика Метрики |
| `PUBLIC_GA4_MEASUREMENT_ID` | Measurement ID вида `G-…` |
| `PUBLIC_YANDEX_VERIFICATION` | Проверка владения в Вебмастере |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Проверка владения в Search Console |
| `PUBLIC_WEB_VITALS_DEBUG=true` | Локальная диагностика без аккаунтов |

Для локальной сборки задайте значения в `.env`; файл не коммитится. Docker принимает четыре ID/кода через build args, compose передаёт одноимённые переменные среды. После изменения значений требуется пересборка статического сайта. Секреты и API-ключи в `PUBLIC_*` запрещены. Тестовая сборка принудительно выключает счётчики и debug для воспроизводимых проверок.

Без ID счётчиков нет запросов к внешней аналитике. Скрипты загружаются асинхронно во время простоя; Web Vitals измеряет официальная библиотека `web-vitals`, размещённая на своём домене. CSP разрешает конкретные домены провайдеров. Webvisor, clickmap и рекламные сигналы не включаются. Do Not Track / Global Privacy Control отключают измерение. Дополнительные события не передают query, hash, тексты контактов, произвольные URL ссылок или собственные постоянные ID.

В Метрике создайте JavaScript-цели `book_consultation`, `book_mock_interview`, `contact_telegram`, `contact_email`, `contact_phone`, `web_vitals`. В GA4 отметьте запись и обращения как key events; для отчётов зарегистрируйте event-scoped поля `metric_name`, `metric_rating`, `navigation_type` и custom metric `metric_value`. Значения LCP, INP, FCP, TTFB — миллисекунды; CLS — безразмерный коэффициент. Не суммируйте значения разных метрик. Для CWV рассчитывайте p75 по каждой метрике, устройству и странице. Стандартные отчёты GA4/Метрики сами по себе не заменяют расчёт p75.

Локально при debug значения доступны в `window.__siteVitals`, обновления — в событии `site:web-vital`. Некоторые метрики окончательны при уходе/скрытии страницы; INP требует взаимодействия пользователя. Отсутствие INP не означает нулевую задержку. Библиотека учитывает поддерживаемые браузером API; одинакового покрытия во всех движках нет.

## Постоянные проверки

| Команда в `app/` | Проверка и результат |
| --- | --- |
| `npm run check:seo -- --base=http://localhost:8089` | Обходит все страницы, внутренние пути/якоря, canonical, hreflang, H1, title/description. Отчёт `test-results/seo-audit.json` |
| `npm run check:links` | Внешние URL, редиректы, HTTP-статусы и мягкие 404. HTTP 401 — отдельный ограниченный доступ, проверка остаётся красной |
| `npm run check:performance -- --all-pages` | Lighthouse: mobile/desktop × все шесть страниц, FCP/LCP/CLS/TBT, accessibility/SEO. JSON и summary в `test-results/lighthouse/` |
| `npm run check:crux` | Полевые 28-дневные CrUX p75 для PHONE/DESKTOP. Нужен `CRUX_API_KEY` на машине/в CI secret; в браузер ключ не передаётся |

Lighthouse: Performance ≥90 mobile / ≥95 desktop; accessibility, best practices, SEO — 100. Полевые пороги CWV: LCP ≤2500 ms, INP ≤200 ms, CLS ≤0.1, оценка по p75. Лабораторный TBT не равен INP. `not-configured` / `no-data` в CrUX — отсутствие измерения, а не зелёные Web Vitals.

Еженедельный workflow `monitor.yml` сохраняет SEO/Lighthouse/CrUX-артефакты 90 дней и сигнализирует провалом проверки. Он начинает использовать изменения после публикации кода в GitHub. Проверки не создают задачи на Kubernetes и не выполняют деплой. Локальный `tools/lighthouse.mjs` использует тот же runner и сохраняет результаты в `tools/.out/lighthouse/`.

## Что смотреть в консолях

После подтверждения сайта отправьте `https://nadtocheev.ru/sitemap-index.xml` в Вебмастер и Search Console. Проверяйте индексирование шести canonical URL, выбранный поисковиком canonical, ошибки обхода, мобильную доступность и CWV. Позиции, показы, клики и CTR оценивайте по запросу/странице/языку/устройству за сопоставимые периоды; обращения и записи — в аналитике. Согласно актуальному руководству Google, в Search Console нужно проверить включение сайта в generative AI features и смотреть Generative AI performance report. Наличие настроек и данные отчёта в аккаунте владельца ещё не проверены. Для других AI-систем отдельно нужны контрольные запросы, цитирования и переходы; балл Lighthouse Agentic Browsing их не измеряет.

DNS `www` должен вести на сервер сайта и иметь постоянный HTTPS-редирект на апекс. Это настройка DNS/Traefik, одного изменения статических файлов для неё недостаточно.

## Официальные источники

- [Google: AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: актуальное руководство для генеративного поиска](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: прекращение FAQ rich results](https://developers.google.com/search/updates)
- [Google: canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Яндекс: сниппет](https://yandex.ru/support/webmaster/ru/search-results/site-description)
- [Яндекс: Clean-param](https://yandex.ru/support/webmaster/ru/robot-workings/clean-param)
- [Web Vitals: библиотека](https://github.com/GoogleChrome/web-vitals)
- [Пороговые значения CWV](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [CrUX API](https://developer.chrome.com/docs/crux/api)
