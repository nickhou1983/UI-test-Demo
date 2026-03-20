---
name: playwright-config
description: >-
  Generate Playwright configuration files, npm scripts, and gitignore entries.
  Use when: user needs playwright.config.ts, playwright-ct.config.ts,
  playwright.service.config.ts, package scripts, .gitignore entries, or a
  reusable Playwright setup template before running CT, E2E, or visual tests.
---

# Playwright Configuration Templates

## ⚠️ Report-Only Policy

When configuration issues are detected (missing files, incorrect settings, version mismatches), report the issue with suggested fixes but do NOT automatically modify configuration files unless the tester explicitly requests it.

## Purpose

This skill is the **sole owner** of Playwright configuration file generation.

No other agent or skill should generate `playwright.config.ts`,
`playwright-ct.config.ts`, or `playwright.service.config.ts` directly.
Testing agents (`ui-test-component`, `ui-test-e2e`, `ui-test-visual`) must
validate that the required config exists and invoke this skill when it is
missing or misconfigured.

This skill is intentionally template-driven.

It should work from a small configuration brief instead of depending on deep
business-code discovery.

Use it to produce the baseline testing scaffold for:

- local E2E
- local visual regression
- local component testing
- optional Azure Playwright Workspace execution

## Minimal Input Contract

Collect or infer these inputs before generating files:

| Input | Required | Example |
|-------|----------|---------|
| framework | yes | `react`, `vue`, `svelte` |
| build tool | yes | `vite`, `next`, `webpack` |
| local base URL | yes | `http://localhost:5173` |
| dev/start command | yes | `npm run dev` |
| test modes | yes | `e2e`, `visual`, `ct` |
| Azure enabled | no | `true` / `false` |
| VLM enabled | no | `true` / `false` |

If the user only asks for a starter setup, default to:

- `e2e` + `visual`
- local execution only
- no VLM
- no Azure service config

## Output Contract

This skill may generate or update only the following categories of artifacts:

1. Playwright config files
2. package.json scripts
3. .gitignore additions for Playwright artifacts
4. test directory scaffolding recommendations

It should not own route discovery, component analysis, or journey mapping.

## Template Selection Matrix

| Need | Artifact |
|------|----------|
| Base browser testing | `playwright.config.ts` |
| Component testing | `playwright-ct.config.ts` |
| Azure cloud execution | `playwright.service.config.ts` |
| Standard scripts | `package.json` `scripts` |
| Artifact hygiene | `.gitignore` |

## Generate playwright.config.ts

Adapt from the Minimal Input Contract rather than deep application-specific analysis:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: '{discovered_base_url}', // e.g. http://localhost:5173/base/
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
      },
      expect: {
        toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
      },
    },
  ],

  webServer: {
    command: '{discovered_dev_command}', // e.g. npm run dev
    url: '{discovered_base_url}',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Base Config Rules

- Keep `testDir` rooted at `./tests`
- Split projects by responsibility instead of browser
- Put shared runtime behavior in `use`
- Keep visual defaults conservative: `maxDiffPixelRatio: 0.01`
- Reuse existing local server when not running in CI

## Generate playwright-ct.config.ts

Only generate this file when CT is requested.

See the `playwright-ct` skill for framework-specific mounting rules.

## Recommend npm scripts

Suggest adding to `package.json`:
```json
{
  "scripts": {
    "test:e2e": "playwright test --project=e2e",
    "test:visual": "playwright test --project=visual",
    "test:ct": "playwright test -c playwright-ct.config.ts",
    "test:all": "playwright test && playwright test -c playwright-ct.config.ts",
    "test:update-snapshots": "playwright test --project=visual --update-snapshots"
  }
}
```

### Script Rules

- Prefer explicit project-scoped commands over one catch-all command
- Keep Azure commands separate from local commands
- Keep VLM opt-in through env-prefixed commands rather than default scripts

## Recommend .gitignore additions

```
# Playwright
test-results/
playwright-report/
blob-report/
.playwright/
```

## Optional VLM Reporter Configuration

When the project uses VLM semantic review for targeted visual diff analysis, add the VLM reporter only when `VLM_REVIEW=true`.

**In `playwright.config.ts`:**
```typescript
const reporter: ReporterDescription[] = [['html', { open: 'never' }]];

if (process.env.VLM_REVIEW === 'true') {
  reporter.push(['./tests/utils/vlm-reporter.ts']);
}
```

**In `playwright.service.config.ts` (Azure PT):**
```typescript
const reporter: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never' }],
  ['@azure/playwright/reporter'],
];

if (process.env.VLM_REVIEW === 'true') {
  reporter.push(['./tests/utils/vlm-reporter.ts']);
}
```

Additional npm scripts for Azure workflows:
```json
{
  "scripts": {
    "test:azure": "VLM_REVIEW=false playwright test --config=playwright.service.config.ts",
    "test:azure:e2e": "playwright test --config=playwright.service.config.ts --project=e2e",
    "test:azure:visual": "VLM_REVIEW=false playwright test --config=playwright.service.config.ts --project=visual",
    "test:azure:visual:vlm": "VLM_REVIEW=true playwright test --config=playwright.service.config.ts --project=visual"
  }
}
```

## Generate playwright.service.config.ts (Azure PT)

Generate this file only when the user explicitly wants Azure Playwright Workspace integration.

**Recommended:** Run `npm init @azure/playwright@latest` to auto-generate the service config.

Alternatively, manually create:

```typescript
import { defineConfig } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import { existsSync } from 'fs';
import baseConfig from './playwright.config';

if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig(
  baseConfig,
  createAzurePlaywrightConfig(baseConfig, {
    exposeNetwork: '<loopback>',
    connectTimeout: 30000,
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
  }),
  {
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 10 : undefined,
    reporter: [
      ['list'],
      ['html', { open: 'never' }],
      ['@azure/playwright/reporter'],
    ],
  }
);
```

**Key points:**
- Requires `npm install -D @azure/playwright @azure/identity`
- `process.loadEnvFile('.env')` loads PLAYWRIGHT_SERVICE_URL without extra dependencies
- `DefaultAzureCredential()` authenticates via `az login` (Entra ID) — recommended over Access Tokens
- Inherits all projects (e2e, visual) and webServer from base config
- `exposeNetwork: '<loopback>'` allows cloud browsers to reach the local/CI dev server
- `ServiceOS.LINUX` ensures consistent environment for visual baselines
- Azure Playwright reporter sends results to the Azure Portal dashboard
- `workers: 10` in CI leverages Azure PT cloud parallelism

Azure-specific npm scripts:
```json
{
  "scripts": {
    "test:azure": "playwright test --config=playwright.service.config.ts",
    "test:azure:e2e": "playwright test --config=playwright.service.config.ts --project=e2e",
    "test:azure:visual": "playwright test --config=playwright.service.config.ts --project=visual"
  }
}
```

### Governance Boundary

This skill may provide the service config template, but it does not own:

- Azure workspace provisioning
- CI/CD governance policy
- baseline authority rules
- VLM review policy

Route those concerns to:

- `playwright-azure`
- `ui-test-governance`

## Test Directory Structure

Recommend this standard structure:

```
tests/
├── e2e/                        # E2E tests (one file per page/feature)
│   ├── {page1}.spec.ts
│   ├── {page2}.spec.ts
│   └── user-journey.spec.ts
├── component/                  # Component tests (one file per component)
│   ├── {Component1}.spec.tsx
│   └── {Component2}.spec.tsx
├── visual/                     # Visual regression tests
│   ├── pages.visual.spec.ts
│   └── responsive.visual.spec.ts
└── fixtures/                   # Shared test utilities
    └── test-utils.ts
```

## Definition Of Done

This skill is complete when:

1. the correct config files for the requested modes exist
2. the required scripts are present
3. Playwright artifact directories are ignored appropriately
4. Azure-specific files are added only when explicitly requested
