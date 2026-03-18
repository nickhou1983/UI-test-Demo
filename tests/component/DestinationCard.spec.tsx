import { test, expect } from '@playwright/experimental-ct-react';
import DestinationCard from '../../src/components/DestinationCard';
import { TestWrapper } from '../fixtures/test-utils';
import type { Destination } from '../../src/types';

const bali: Destination = {
  id: 'bali',
  nameKey: 'dest.bali.name',
  countryKey: 'dest.bali.country',
  descKey: 'dest.bali.desc',
  image: '/UI-test-Demo/images/destinations/bali.jpg',
  region: 'asia',
  type: 'beach',
  rating: 4.7,
  stars: 5,
};

const paris: Destination = {
  id: 'paris',
  nameKey: 'dest.paris.name',
  countryKey: 'dest.paris.country',
  descKey: 'dest.paris.desc',
  image: '/UI-test-Demo/images/destinations/paris.jpg',
  region: 'europe',
  type: 'city',
  rating: 4.5,
  stars: 4,
};

test('renders destination name and country', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={bali} />
    </TestWrapper>
  );
  await expect(component.getByText('巴厘岛')).toBeVisible();
  await expect(component.getByText('印度尼西亚')).toBeVisible();
});

test('renders type badge', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={bali} />
    </TestWrapper>
  );
  await expect(component.getByText('海滩', { exact: true })).toBeVisible();
});

test('renders different type badge for city destination', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={paris} />
    </TestWrapper>
  );
  await expect(component.getByText('城市')).toBeVisible();
});

test('renders rating number', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={bali} />
    </TestWrapper>
  );
  await expect(component.getByText('4.7')).toBeVisible();
});

test('renders star ratings', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={bali} />
    </TestWrapper>
  );
  // bali has 5 filled stars
  const stars = component.locator('.star-filled');
  await expect(stars).toHaveCount(5);
});

test('renders 4 filled stars for paris', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={paris} />
    </TestWrapper>
  );
  const filledStars = component.locator('.star-filled');
  const emptyStars = component.locator('.star-empty');
  await expect(filledStars).toHaveCount(4);
  await expect(emptyStars).toHaveCount(1);
});

test('links to destination detail page', async ({ mount, page }) => {
  await mount(
    <TestWrapper>
      <DestinationCard destination={bali} />
    </TestWrapper>
  );
  const link = page.getByRole('link', { name: '巴厘岛' });
  await expect(link).toHaveAttribute('href', /\/destinations\/bali/);
});

test('renders destination image with alt text', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={bali} />
    </TestWrapper>
  );
  await expect(component.getByRole('img')).toHaveAttribute('alt', '巴厘岛');
});

test('renders description text', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <DestinationCard destination={bali} />
    </TestWrapper>
  );
  await expect(component.getByText('热带天堂海滩，文化与自然的完美融合')).toBeVisible();
});
