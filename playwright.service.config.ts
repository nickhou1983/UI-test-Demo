import { defineConfig, type ReporterDescription } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import baseConfig from './playwright.config';

const reporter: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never' }],
  ['@azure/playwright/reporter'],
];

if (process.env.VLM_REVIEW === 'true') {
  reporter.push(['./tests/utils/vlm-reporter.ts']);
}

/**
 * Playwright service config for Azure App Testing — Playwright Workspace.
 * Inherits all settings from playwright.config.ts and adds Azure cloud connection.
 *
 * Prerequisites:
 * - npm install -D @azure/playwright @azure/identity
 * - Set PLAYWRIGHT_SERVICE_URL env var (or .env file)
 * - Authenticate via `az login` (Entra ID)
 *
 * Usage:
 *   npx playwright test --config=playwright.service.config.ts
 */
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
    reporter,
  }
);
