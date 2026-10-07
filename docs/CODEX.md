# Harness nadtocheev.ru

Harness адаптирован по образцу `105.sovetnik` для статического Astro-сайта. Поддерживает запуск из workspace `108.nadtocheev/` и Git-репозитория `app/`. Исходники инструментов — `app/scripts/codex/`; машинные пути, роли, снимок контекста и состояния — в локальных `.codex/`.

## Запуск и проверки

Из `app/`:

```sh
npm ci
npm run codex:setup
npm run codex:doctor
npm run codex:native-check
npm run codex:mcp-check
npm run codex
```

Из workspace используйте `npm --prefix app run …`. `tools/` имеет отдельные зависимости: `npm --prefix tools ci` из workspace. `codex:setup` синхронизирует конфигурацию и доверяет только собственным проектным hooks. `codex:trust` в user registry меняет доверие только к двум путям проекта и конкретным hash этих hooks. Другие проекты и глобальные permissions не переписываются.

Default permissions — `:danger-full-access`, approvals — `never`, сеть разрешена. Альтернативные профили `nadtocheev` и `nadtocheev-review` предназначены для ограниченной работы и ревью. Модель пользователя сохраняется; роли наследуют её. Возможность multi-agent включена, использование делегирования определяется текущими инструкциями задачи.

После изменения источников harness, методологий или CLAUDE.md: `codex:sync`, затем `codex:trust`, если изменилось определение hook. `codex:test` проверяет реальные инварианты adapters/protocol/guardrails. `codex:verify` запускает harness tests, типы, контент/dist/e2e, nginx и Linux visual последовательно. Это не команда коммита или деплоя.

## Контекст и hooks

- SessionStart/SubagentStart подают полные правила проекта и CLAUDE.md. SessionStart также восстанавливает память и handoff, после compaction — checkpoint.
- PreToolUse применяет запреты опасных команд владельца/Claude и отдельное правило Kubernetes.
- PreCompact записывает ветку, HEAD и имена изменённых файлов; содержимое файлов, `.env`, приватные сообщения и credentials не сохраняются.
- Stop проверяет drift и whitespace. Повторная остановка не создаёт бесконечный цикл.

Symlinks в `app/` дают доступ к имеющимся `.claude`, `.agents`, приватному `.mcp.json`, памяти и handoff workspace. Генератор сохраняет существующие пути: при конфликте сообщает проблему вместо перезаписи. При локальной правке generated role выполняется защита от её потери. Generated/source manifests содержат hashes публичных исходников и структуру серверов, без значений env/headers.

## Skills и роли

Существующие `site-audit`, `prod-check`, `deploy-check`, `self-review` дополнены `project-harness`, `fix-bug`, `new-feature`, `frontend-design`. Адаптеры `.agents/skills` ссылаются на оригиналы `.claude/skills`; методология имеет один источник. Роли: code mapper, content, SEO, UI и performance reviewers. Ревьюеры работают только чтением и подтверждают findings сценарием сбоя и ссылкой на файл.

## MCP

Definitions берутся из существующего приватного workspace `.mcp.json`, IDE/Miro из пользовательского Claude config, и опционального `.codex/mcp.local.json`. STDIO bridge читает значения env только при старте процесса. Generated config содержит Node-команды и пути, не токены. HTTP headers передаются native helper по IPC; эту внутреннюю команду нельзя вызывать для вывода credentials в терминал. Native reports не сохраняют arbitrary global hooks, headers, env или страницу личного браузера.

Подключения: Context7, Playwright, официальный Chrome DevTools MCP, Yandex через этот же движок с локальным executable, GitHub, WebStorm, Miro и официальный OpenAI Developer Docs MCP. Browser adapters используют изолированные headless-профили. SSO проводится только в локальном Yandex; удалённые браузеры и перенос credentials не используются.

`codex:doctor` проверяет установку и конфигурацию. `codex:mcp-check` — initialize/tools-list; наличие каталога не доказывает права API-токена. `codex:native-check` дополнительно проверяет реальную загрузку full access, skills/hooks в обоих entry points и inventory MCP у установленного Codex. HTTP-сервер с OAuth может требовать отдельного входа: полный доступ к файловой системе не заменяет авторизацию аккаунта. `codex:browser-check -- yandex-devtools` проверяет фактическое подключение браузера, сохраняя только количество вкладок и статус.

GitHub bridge при отсутствии env токена использует уже существующий `gh auth` в памяти: токен не экспортируется глобально и не записывается в проект. Для Miro: `npm run codex:mcp-login -- miro` открывает ровно один OAuth flow в локальном Yandex и ожидает согласие аккаунта. Authorization/callback URL не выводятся и не сохраняются; после тайм-аута автоматического повтора нет.

После обновления config новые integrations/hooks используются новой сессией Codex. Рабочая модель и аккаунт сохраняются. Диагностика не запускает model turn и не отправляет реальные сообщения.

## Разрешения владельца

Full access не отменяет правило: во всех Kubernetes-кластерах можно только получать информацию. Мутации, exec/attach/cp/run/debug, deploy/restart и mutating dry-run запрещены. Auth can-i разрешён как проверка прав. Guardrails распознают обычные CLI/MCP-формы; они не являются полной границей безопасности для произвольного кода/API. Агент обязан соблюдать правило во всех инструментах.

Максимум три автоматические попытки восстановления Lens/авторизации; затем ручное восстановление владельцем. Счётчик нельзя обходить новой вкладкой, таймером, инструментом или перезапуском.

Коммит/push — по прямому запросу владельца, prod mutations — с подтверждением. Наличие инструмента или технических прав не является таким запросом.

## Источники

- [OpenAI: configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [OpenAI: advanced configuration](https://learn.chatgpt.com/docs/config-file/config-advanced)
- [OpenAI: Docs MCP](https://developers.openai.com/learn/docs-mcp)
