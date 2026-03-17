import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('home page hero and discovery sections', async ({ page }) => {
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    const main = page.getByRole('main');

    await expect(main).toContainText('探索世界，发现美好');
    await expect(main).toContainText('热门目的地');
    await expect(main).toContainText('探索旅行主题');

    await expect(main).toHaveScreenshot('home-main.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });
  });

  test('destinations page full layout', async ({ page }) => {
    await page.goto('./destinations');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '探索目的地' })).toBeVisible();
    await expect(page).toHaveScreenshot('destinations-page.png', {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('about page full layout', async ({ page }) => {
    await page.goto('./about');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '关于我们' }).first()).toBeVisible();
    await expect(page).toHaveScreenshot('about-page.png', {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('destination detail page full layout', async ({ page }) => {
    await page.goto('./destinations/bali');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '巴厘岛' })).toBeVisible();
    await expect(page).toHaveScreenshot('destination-detail-bali.png', {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});