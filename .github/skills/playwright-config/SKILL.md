---
name: playwright-config
description: >-
  Generate Playwright configuration files, npm scripts, and gitignore entries.
  Use when: user needs playwright.config.ts, playwright-ct.config.ts,
  playwright.service.config.ts, test npm scripts, or .gitignore entries
  for Playwright test infrastructure setup. Also use when config files
  are missing and need to be generated before running tests.
---

# Playwright Configuration Generation

## Generate playwright.config.ts

Adapt based on discovered project settings from Module B:

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

## Generate playwright-ct.config.ts

See the `playwright-ct` skill for framework-specific CT configuration templates.

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

## Recommend .gitignore additions

```
# Playwright
test-results/
playwright-report/
blob-report/
.playwright/
```

## Generate playwright.service.config.ts (Azure PT)

When user wants Azure Playwright Workspace integration, generate `playwright.service.config.ts`.

**Recommended:** Run `npm init @azure/playwright@latest` to auto-generate the service config.

Alternatively, manually create:

```typescript
import { defineConfig } from '@playwright/test';
import { getServiceConfig, ServiceOS } from '@azure/playwright';
import baseConfig from './playwright.config';

export default defineConfig(
  baseConfig,
  getServiceConfig(baseConfig, {
    exposeNetwork: '<loopback>',
    timeout: 30000,
    os: ServiceOS.LINUX,
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
