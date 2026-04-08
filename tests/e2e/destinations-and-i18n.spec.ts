import { test, expect } from '@playwright/test';

test.describe('Destinations and language flows', () => {
  test('filters destinations by region and type', async ({ page }) => {
    await page.goto('destinations');

    const main = page.getByRole('main');

    await main.getByRole('combobox', { name: '所有地区', exact: true }).selectOption('asia');
    await main.getByRole('combobox', { name: '所有类型', exact: true }).selectOption('beach');

    await expect(main.getByText('共 2 个目的地')).toBeVisible();
    await expect(main.getByRole('heading', { level: 3, name: '巴厘岛' })).toBeVisible();
    await expect(main.getByRole('heading', { level: 3, name: '马尔代夫' })).toBeVisible();
    await expect(main.getByRole('heading', { level: 3 })).toHaveCount(2);
  });

  test('switches between Chinese and English content', async ({ page }) => {
    await page.goto('.');

    const nav = page.getByRole('navigation').first();

    await expect(page.getByRole('heading', { level: 1, name: '探索世界，发现美好' })).toBeVisible();
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Explore the World, Discover Beauty' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Wishlist', exact: true })).toBeVisible();

    await page.getByRole('button', { name: '中文' }).click();
    await expect(page.getByRole('heading', { level: 1, name: '探索世界，发现美好' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '心愿单', exact: true })).toBeVisible();
  });
});