---
name: playwright-azure
description: >-
  Set up and run Playwright tests on Azure Playwright Workspace (cloud).
  Use when: user asks for Azure Playwright Testing, Azure PT, cloud testing,
  Azure cloud browsers, Azure test infrastructure, CI/CD with Azure Playwright,
  or setting up playwright.service.config.ts. Covers workspace setup,
  authentication, CI/CD workflows, cost management, and portal reporting.
---

# Azure Playwright Workspace Integration

## ⚠️ Report-Only Policy

When Azure configuration or authentication issues are detected, report the issue with diagnostic details and suggested fixes but do NOT automatically modify configuration files, environment variables, or Azure resources unless the tester explicitly requests it.

Cloud-based testing via [Azure App Testing — Playwright Workspace](https://learn.microsoft.com/azure/playwright-testing/).

> **Note:** The legacy "Microsoft Playwright Testing" service (package `@azure/microsoft-playwright-testing`) was retired on 2026-03-08. Use the replacement **Azure App Testing** with package `@azure/playwright`.

**Scope:** E2E tests and Visual Regression tests can run on Azure PT. Component tests (CT) CANNOT — CT requires a local Vite dev server.

## Setup Guide

### 1. Create Playwright Workspace

> - Sign in to the [Playwright Portal](https://playwright.microsoft.com) with your Azure account
> - Click **+ New workspace** → Provide workspace name, subscription, region
> - Click **Create workspace**
> - Alternatively: Azure Portal → Search **"Azure App Testing"** → Create **Playwright Workspace**

### 2. Get Region Endpoint URL

> - In the workspace → **setup guide**
> - Copy the **region endpoint URL** under "Add region endpoint in your setup"
> - The portal URL format is: `https://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>`
> - For `.env`, convert to WebSocket format: `wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers`
> - ⚠️ Do NOT use the legacy `/accounts/` path — use `/playwrightworkspaces/` path

### 3. Set Up Authentication

**Option A — Entra ID / DefaultAzureCredential (recommended):**
> ```bash
> npm install -D @azure/identity
> az login
> ```
> The service config uses `new DefaultAzureCredential()` from `@azure/identity` — this automatically picks up credentials from Azure CLI, managed identity, or environment variables.

**Option B — Access Token (quick start):**
> - Workspace → **Access tokens** → **Generate new token** (max 90 days expiry)
> ```bash
> export PLAYWRIGHT_SERVICE_ACCESS_TOKEN="{token}"
> ```

### 4. Configure Environment

> Use a `.env` file (auto-loaded by service config via `process.loadEnvFile`):
> ```
> PLAYWRIGHT_SERVICE_URL=wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers
> ```
> For CI/CD, add as GitHub Actions secret: `PLAYWRIGHT_SERVICE_URL`

## Service Config

See the `playwright-config` skill for `playwright.service.config.ts` template.

The service config:
- **Inherits** everything from `playwright.config.ts`
- **Adds** Azure PT connection via `createAzurePlaywrightConfig()`
- **Uses** `DefaultAzureCredential` from `@azure/identity` for Entra ID auth (requires `az login`)
- **Adds** Azure PT reporter for portal dashboard
- **Overrides** workers count for cloud parallelism

**Required RBAC roles:**
- **Reader** on the Playwright Workspace resource (to run tests)
- **Storage Blob Data Contributor** on the workspace storage account (to upload test artifacts/reports)

## Cloud Execution Strategy

| Setting | Local | Azure PT Cloud |
|---------|-------|---------|
| Config file | `playwright.config.ts` | `playwright.service.config.ts` |
| Browsers | Local binaries | Azure-managed (always latest) |
| Workers | CPU cores | Up to 50 (parallel cloud browsers) |
| OS | Host machine | Linux containers (consistent) |
| Network | Direct access | `exposeNetwork: '<loopback>'` required |

**What CANNOT run on Azure PT:**
- Component tests (CT) — requires local Vite dev server
- Tests using `playwright-cli` interactive mode — cloud browsers are headless only

## CI/CD Integration (GitHub Actions)

Generate `.github/workflows/playwright-azure.yml`:

```yaml
name: Playwright Tests (Azure)

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - run: npx playwright install --with-deps chromium

      - name: Run E2E tests on Azure Playwright Workspace
        run: npx playwright test --config=playwright.service.config.ts --project=e2e
        env:
          PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
          PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}

      - name: Run Visual Regression tests on Azure Playwright Workspace
        run: npx playwright test --config=playwright.service.config.ts --project=visual
        env:
          PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
          PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: test-results
          path: test-results/
          retention-days: 14
```

**Required GitHub Secrets:**
- `PLAYWRIGHT_SERVICE_URL` — Playwright Workspace region endpoint URL
- `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` — Access token (or use Entra ID with Azure login action)

## Azure Portal Test Reporting

When Azure PT reporter is configured, test results appear in the Azure Portal:

- **Dashboard**: Pass/fail rates, execution trends, flaky test detection
- **Test runs**: Each CI run with full details
- **Traces & screenshots**: Failed test traces uploaded automatically
- **Video playback**: Test execution videos for debugging

To view: Azure Portal → Playwright Testing workspace → **Test runs** → Select a run

## Cost Management

Azure PT pricing is based on cloud browser minutes:

- **Free tier**: 100 minutes/month (sufficient for small projects)
- **Beyond free tier**: Pay-per-minute pricing

Recommendations:
- Limit `workers` count in service config (default 10 in CI)
- Use `--project=e2e` or `--project=visual` to run specific suites
- Use `--grep` for subset of tests during development
- Monitor: Azure Portal → Playwright Testing workspace → **Usage**
- Consider: visual regression only on `main`, E2E on all PRs

## Execution Commands

| Action | Command |
|--------|---------|
| Run all (Azure PT) | `npx playwright test --config=playwright.service.config.ts` |
| E2E only (Azure PT) | `npx playwright test --config=playwright.service.config.ts --project=e2e` |
| Visual only (Azure PT) | `npx playwright test --config=playwright.service.config.ts --project=visual` |
| Update baselines (Azure PT) | `npx playwright test --config=playwright.service.config.ts --project=visual --update-snapshots` |
