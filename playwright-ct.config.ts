import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './tests/component',
  use: {
    ...devices['Desktop Chrome'],
    ctViteConfig: {
      css: {
        postcss: './postcss.config.js',
      },
    },
  },
  reporter: [['html', { open: 'never' }]],
});
