import { test, expect } from '@playwright/test';

test.describe('AboutPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./about');
  });

  test('should display about page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '关于我们' }).first()).toBeVisible();
  });

  test('should display mission section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '我们的使命' })).toBeVisible();
  });

  test('should display three value cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '全球视野' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '精心策划' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '贴心服务' })).toBeVisible();
  });

  test('should display team section with 4 members', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '我们的团队' })).toBeVisible();
    await expect(page.getByText('张旅行')).toBeVisible();
    await expect(page.getByText('李探索')).toBeVisible();
    await expect(page.getByText('王远方')).toBeVisible();
    await expect(page.getByText('赵世界')).toBeVisible();
  });

  test('should display contact section with email', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '联系我们' })).toBeVisible();
    await expect(page.getByText('hello@travelvista.com')).toBeVisible();
  });
});
