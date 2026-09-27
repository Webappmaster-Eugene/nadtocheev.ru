#!/usr/bin/env bash
# Скриншотные тесты в Docker-образе Playwright (Linux) - эталоны совпадают с CI.
#   bash scripts/visual-docker.sh             - сравнить с эталонами
#   bash scripts/visual-docker.sh --update    - перезаписать эталоны (после намеренной правки дизайна)
# Сборка dist/ с фиксированной датой делается на хосте, в контейнере только браузер.
set -euo pipefail

APP="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="$(node -p "require('$APP/node_modules/@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v${VERSION}-noble"

ARGS=()
for a in "$@"; do
  if [[ "$a" == "--update" ]]; then ARGS+=("--update-snapshots=changed"); else ARGS+=("$a"); fi
done

(cd "$APP" && npm run -s build:test >/dev/null)
docker run --rm --ipc=host --init \
  -v "$APP:/work" -w /work \
  -e CI="${CI:-}" -e E2E_PORT=4410 \
  "$IMAGE" npx playwright test --project=visual ${ARGS[@]+"${ARGS[@]}"}
