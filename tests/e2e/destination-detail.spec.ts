import { test, expect } from '@playwright/test';

test.describe('Destination detail page', () => {
  test('shows full detail content for Bali', async ({ page }) => {
    await page.goto('destinations/bali');

    // Heading and breadcrumb
    await expect(page.getByRole('heading', { level: 1, name: '巴厘岛' })).toBeVisible();
    await expect(page.getByText('📍 印度尼西亚')).toBeVisible();

    // Attractions section
    await expect(page.getByRole('heading', { name: /必游景点/ })).toBeVisible();

    // Weather widget
    await expect(page.getByRole('heading', { name: /天气预报/ })).toBeVisible();

    // Related destinations
    await expect(page.getByRole('heading', { name: /你可能也喜欢/ })).toBeVisible();
  });

  test('navigates from detail page to trip planner with pre-selected destination', async ({ page }) => {
    await page.goto('destinations/bali');

    await page.locator('a', { hasText: '开始规划行程' }).click();
    await expect(page).toHaveURL(/\/trips\?dest=bali$/);
    await expect(page.getByLabel('选择目的地')).toHaveValue('bali');
  });

  test('breadcrumb navigation works from detail page', async ({ page }) => {
    await page.goto('destinations/kyoto');

    // Breadcrumb back to destinations
    await page.getByRole('link', { name: '目的地' }).first().click();
    await expect(page).toHaveURL(/\/destinations$/);
  });

  test('favorite button works on detail page', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('destinations/bali');

    await page.getByRole('button', { name: 'Add to wishlist' }).first().click();
    await expect(page.getByRole('button', { name: 'Remove from wishlist' }).first()).toBeVisible();

    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('travelvista_favorites') ?? '[]'),
    );
    expect(favorites).toContain('bali');
  });
});

test.describe('Destination search and combined filters', () => {
  test('search filters destinations by keyword', async ({ page }) => {
    await page.goto('destinations');

    const main = page.getByRole('main');
    await main.getByPlaceholder('搜索目的地名称...').fill('巴厘');
    await expect(main.getByText('共 1 个目的地')).toBeVisible();
    await expect(main.getByRole('heading', { level: 3, name: '巴厘岛' })).toBeVisible();
  });

  test('combined filter: region + type + sort', async ({ page }) => {
    await page.goto('destinations');

    const main = page.getByRole('main');
    await main.getByRole('combobox', { name: '所有地区' }).selectOption('europe');
    await expect(main.getByText(/共 \d+ 个目的地/)).toBeVisible();

    await main.getByRole('combobox', { name: '所有类型' }).selectOption('beach');
    await expect(main.getByRole('heading', { level: 3, name: '圣托里尼' })).toBeVisible();

    // Sort by rating
    await main.getByRole('combobox', { name: '排序方式' }).selectOption('rating');
    await expect(main.getByRole('heading', { level: 3, name: '圣托里尼' })).toBeVisible();
  });

  test('category links from home page pre-set filters', async ({ page }) => {
    await page.goto('.');

    // Click the beach category link (distinct heading text)
    await page.getByRole('link', { name: '海滩度假 海滩度假' }).click();
    await expect(page).toHaveURL(/\/destinations\?type=beach/);
    await expect(page.getByRole('combobox', { name: '所有类型' })).toHaveValue('beach');
  });

  test('search works in English after switching language', async ({ page }) => {
    await page.goto('destinations');

    await page.getByRole('button', { name: 'EN' }).click();
    await page.getByPlaceholder(/Search/).fill('Bali');
    await expect(page.getByRole('heading', { level: 3, name: 'Bali' })).toBeVisible();
  });
});
