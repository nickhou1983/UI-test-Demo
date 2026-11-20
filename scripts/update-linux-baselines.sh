#!/usr/bin/env bash
# Generate authoritative Linux (-linux.png) visual baselines inside the official
# Playwright Ubuntu container so Linux CI & Azure Playwright Workspace match 100%.
#
# Usage:
#   npm run test:visual:linux-baselines

set -euo pipefail

PLAYWRIGHT_VERSION=$(node -p "require('./node_modules/@playwright/test/package.json').version")
IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is required to generate Linux visual baselines locally." >&2
  echo "Alternatively, trigger the 'Playwright Tests (Azure)' GitHub Actions workflow with update_linux_baselines=true." >&2
  exit 1
fi

echo "Generating Linux (-linux.png) visual baselines using ${IMAGE}..."
docker run --rm --ipc=host \
  -v "$(pwd):/work" \
  -w /work \
  -e CI=true \
  -e VLM_REVIEW=false \
  "${IMAGE}" \
  npx playwright test --project=visual --update-snapshots

echo "Linux visual baselines updated under tests/visual/*-snapshots/*-linux.png."
echo "Please review the generated snapshots before committing."
