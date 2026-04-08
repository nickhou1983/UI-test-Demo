import { test, expect } from '@playwright/test';

test.describe('Trip planner flow', () => {
  test('creates, edits, enriches, and deletes a trip from a destination detail page', async ({ page }) => {
    await page.goto('destinations/bali');
    await page.locator('a', { hasText: '开始规划行程' }).click();

    await expect(page).toHaveURL(/\/trips\?dest=bali$/);
    await expect(page.getByRole('heading', { level: 2, name: '创建行程' })).toBeVisible();
    await expect(page.getByLabel('选择目的地')).toHaveValue('bali');

    await page.getByPlaceholder('例如：巴厘岛蜜月之旅').fill('巴厘岛测试行程');
    await page.getByLabel('天数').fill('4');
    await page.getByRole('button', { name: '创建行程' }).last().click();

    await expect(page.getByText('巴厘岛测试行程')).toBeVisible();
    await page.getByRole('link', { name: '编辑行程' }).click();

    await expect(page).toHaveURL(/\/trips\/[a-z0-9]+$/);
    await page.getByLabel('行程名称').fill('巴厘岛深度测试行程');
    await expect(page.getByLabel('行程名称')).toHaveValue('巴厘岛深度测试行程');

    await page.getByRole('button', { name: '+ 海神庙' }).click();
    await expect(page.getByText('海神庙', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: '+ 添加活动' }).click();
    await page.getByPlaceholder('活动名称').fill('晚霞观景');
    await page.getByPlaceholder('时间').fill('18:00');
    await page.getByPlaceholder('备注').fill('提前十分钟到达');
    await page.getByRole('button', { name: '保存' }).click();

    await expect(page.getByText('晚霞观景')).toBeVisible();
    await expect(page.getByText('18:00')).toBeVisible();

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await page.getByRole('button', { name: /删除行程/ }).last().click();

    await expect(page).toHaveURL(/\/trips$/);
    await expect(page.getByText('还没有行程，开始规划吧！')).toBeVisible();
  });
});
