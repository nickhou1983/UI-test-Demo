import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate through all pages via navbar', async ({ page }) => {
    await page.goto('./');

    // Home → Destinations
    await page.getByRole('navigation').getByRole('link', { name: '目的地' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations$/);
    await expect(page.getByRole('heading', { name: '探索目的地' })).toBeVisible();

    // Destinations → About
    await page.getByRole('navigation').getByRole('link', { name: '关于我们' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/about$/);
    await expect(page.getByRole('heading', { name: '关于本站' }).first()).toBeVisible();

    // About → Home
    await page.getByRole('navigation').getByRole('link', { name: '首页' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/?$/);
    await expect(page.getByRole('heading', { name: '探索世界，发现美好' })).toBeVisible();
  });

  test('should navigate to TravelVista logo link', async ({ page }) => {
    await page.goto('./about');
    await page.getByRole('navigation').getByRole('link', { name: 'TravelVista' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/?$/);
  });
});

test.describe('i18n Language Switching', () => {
  test('should switch from Chinese to English', async ({ page }) => {
    await page.goto('./');
    // Default is Chinese
    await expect(page.getByRole('heading', { name: '探索世界，发现美好' })).toBeVisible();

    // Click EN button to switch to English
    await page.getByRole('button', { name: 'EN' }).click();

    // Verify English content
    await expect(page.getByRole('heading', { name: /Explore the World/ })).toBeVisible();
    // Language button should now show 中文
    await expect(page.getByRole('button', { name: '中文' })).toBeVisible();
  });

  test('should switch back from English to Chinese', async ({ page }) => {
    await page.goto('./');
    // Switch to English
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page.getByRole('button', { name: '中文' })).toBeVisible();

    // Switch back to Chinese
    await page.getByRole('button', { name: '中文' }).click();
    await expect(page.getByRole('heading', { name: '探索世界，发现美好' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'EN' })).toBeVisible();
  });

  test('should persist language across navigation', async ({ page }) => {
    await page.goto('./');
    // Switch to English
    await page.getByRole('button', { name: 'EN' }).click();

    // Navigate to About
    await page.locator('nav').first().getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/about$/);
    // Should still be in English
    await expect(page.getByRole('button', { name: '中文' })).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('should display footer on all pages', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByText('© 2026 TravelVista')).toBeVisible();
  });
});
