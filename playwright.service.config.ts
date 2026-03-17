import { defineConfig } from '@playwright/test';
import { getServiceConfig, ServiceOS } from '@azure/playwright';
import baseConfig from './playwright.config';

/**
 * Playwright service config for Azure App Testing — Playwright Workspace.
 * Inherits all settings from playwright.config.ts and adds Azure cloud connection.
 *
 * Prerequisites:
 * - npm install -D @azure/playwright
 * - Set PLAYWRIGHT_SERVICE_URL env var (or .env file)
 * - Authenticate via `az login` (Entra ID) or set PLAYWRIGHT_SERVICE_ACCESS_TOKEN
 *
 * Usage:
 *   npx playwright test --config=playwright.service.config.ts
 */
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
