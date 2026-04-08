import { test, expect } from '@playwright/test';

test.describe('About page', () => {
  test('displays mission, values, team sections and contact link', async ({ page }) => {
    await page.goto('about');

    await expect(page.getByRole('heading', { level: 1, name: /关于本站/ })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /我们的使命/ })).toBeVisible();

    // Values section — three value cards
    await expect(page.getByText('🌍')).toBeVisible();
    await expect(page.getByText('✨')).toBeVisible();
    await expect(page.getByText('❤️')).toBeVisible();

    // Team section
    await expect(page.getByRole('heading', { level: 2, name: /我们的团队/ })).toBeVisible();

    // Contact section
    const mailto = page.locator('a[href^="mailto:"]');
    await expect(mailto).toHaveAttribute('href', 'mailto:hello@travelvista.com');
  });

  test('switches language on the about page', async ({ page }) => {
    await page.goto('about');

    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page.getByRole('heading', { level: 1, name: /About/ })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /Our Mission/ })).toBeVisible();
  });
});

test.describe('404 page', () => {
  test('shows 404 heading and a link back to the home page', async ({ page }) => {
    await page.goto('nonexistent-page');

    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
    await expect(main.getByRole('link', { name: /返回首页/ })).toBeVisible();

    await main.getByRole('link', { name: /返回首页/ }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/?$/);
  });
});
