import { test, expect } from '@playwright/experimental-ct-react';
import DestinationCard from '../../src/components/DestinationCard';
import { destinations } from '../../src/data/destinations';

const bali = destinations.find((destination) => destination.id === 'bali');

if (!bali) {
  throw new Error('Missing bali destination fixture');
}

test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});

test('renders localized content and detail link', async ({ mount, page }) => {
  const component = await mount(<DestinationCard destination={bali} />, {
    hooksConfig: { language: 'zh', route: '/' },
  });

  await expect(component.getByRole('heading', { level: 3, name: '巴厘岛' })).toBeVisible();
  await expect(component.getByText('印度尼西亚')).toBeVisible();
  await expect(component.getByText('海滩', { exact: true })).toBeVisible();
  await expect(page.locator('a')).toHaveAttribute('href', '/destinations/bali');
});

test('allows toggling favorite state from inside the card', async ({ mount, page }) => {
  const component = await mount(<DestinationCard destination={bali} />, {
    hooksConfig: { language: 'zh', route: '/' },
  });

  await component.getByRole('button', { name: 'Add to wishlist' }).click();
  await expect(component.getByRole('button', { name: 'Remove from wishlist' })).toBeVisible();

  const favorites = await page.evaluate(() => JSON.parse(localStorage.getItem('travelvista_favorites') ?? '[]'));
  expect(favorites).toContain('bali');
});