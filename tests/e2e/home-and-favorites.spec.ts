import { test, expect } from '@playwright/test';

test.describe('Home and favorites flows', () => {
  test('opens a destination detail page from the home grid', async ({ page }) => {
    await page.goto('.');

    await expect(page.getByRole('heading', { level: 1, name: '探索世界，发现美好' })).toBeVisible();
    await page.getByRole('link', { name: /巴厘岛/ }).first().click();

    await expect(page).toHaveURL(/\/destinations\/bali$/);
    await expect(page.getByRole('heading', { level: 1, name: '巴厘岛' })).toBeVisible();
    await expect(page.getByText('📍 印度尼西亚')).toBeVisible();
  });

  test('adds and removes a favorite across home and wishlist pages', async ({ page }) => {
    await page.goto('.');

    await page.getByRole('button', { name: 'Add to wishlist' }).first().click();
    await expect(page.getByRole('button', { name: 'Remove from wishlist' }).first()).toBeVisible();

    const favorites = await page.evaluate(() => JSON.parse(localStorage.getItem('travelvista_favorites') ?? '[]'));
    expect(favorites).toContain('bali');

    await page.goto('favorites');
    await expect(page.getByRole('main').getByRole('heading', { level: 1, name: /我的心愿单/ })).toBeVisible();
    await expect(page.getByRole('main').getByRole('heading', { level: 3, name: '巴厘岛' })).toBeVisible();

    await page.getByRole('button', { name: 'Remove from wishlist' }).click();
    await expect(page.getByText('还没有收藏的目的地')).toBeVisible();
  });
});