import { existsSync } from 'fs';
import { defineConfig, devices, type ReporterDescription } from '@playwright/test';

// Load .env so VLM credentials (AZURE_OPENAI_ENDPOINT, etc.) are available
if (existsSync('.env')) process.loadEnvFile('.env');

const reporter: ReporterDescription[] = [['html', { open: 'never' }]];

if (process.env.VLM_REVIEW === 'true') {
  reporter.push(['./tests/utils/vlm-reporter.ts']);
  reporter.push(['./tests/utils/vlm-html-reporter.ts']);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter,

  use: {
    baseURL: 'http://localhost:5173/UI-test-Demo/',
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
        toHaveScreenshot: { maxDiffPixelRatio: 0.0005 },
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173/UI-test-Demo/',
    reuseExistingServer: !process.env.CI,
  },
});
