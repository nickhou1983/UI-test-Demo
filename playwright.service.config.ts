import { defineConfig, type ReporterDescription } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceAuth, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import baseConfig from './playwright.config';

const reporter: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never' }],
  ['@azure/playwright/reporter'],
];

if (process.env.VLM_REVIEW === 'true') {
  reporter.push(['./tests/utils/vlm-reporter.ts']);
  reporter.push(['./tests/utils/vlm-html-reporter.ts']);
}

if (process.env.PLAYWRIGHT_SERVICE_URL?.startsWith('https://')) {
  process.env.PLAYWRIGHT_SERVICE_URL = process.env.PLAYWRIGHT_SERVICE_URL.replace(
    /^https:\/\//i,
    'wss://',
  );
}

const useAccessToken = Boolean(
  process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN && !process.env.AZURE_CLIENT_ID,
);

/**
 * Playwright service config for Azure App Testing — Playwright Workspace.
 * Inherits all settings from playwright.config.ts and adds Azure cloud connection.
 *
 * Prerequisites:
 * - npm install -D @azure/playwright @azure/identity
 * - Set PLAYWRIGHT_SERVICE_URL env var (or .env file)
 * - Authenticate via `az login` / OIDC (`DefaultAzureCredential`) or `PLAYWRIGHT_SERVICE_ACCESS_TOKEN`
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
    serviceAuthType: useAccessToken ? ServiceAuth.ACCESS_TOKEN : ServiceAuth.ENTRA_ID,
    ...(useAccessToken ? {} : { credential: new DefaultAzureCredential() }),
  }),
  {
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 20 : undefined,
    reporter,
  }
);
