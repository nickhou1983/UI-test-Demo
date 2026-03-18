import { test, expect } from '@playwright/experimental-ct-react';
import Footer from '../../src/components/Footer';
import { TestWrapper } from '../fixtures/test-utils';

test('renders brand name in footer', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Footer />
    </TestWrapper>
  );
  await expect(component.getByRole('heading', { name: 'TravelVista' })).toBeVisible();
});

test('renders navigation links', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Footer />
    </TestWrapper>
  );
  await expect(component.getByRole('link', { name: '首页' })).toBeVisible();
  await expect(component.getByRole('link', { name: '目的地' })).toBeVisible();
  await expect(component.getByRole('link', { name: '关于我们' })).toBeVisible();
});

test('renders social media section', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Footer />
    </TestWrapper>
  );
  await expect(component.getByText('微博')).toBeVisible();
  await expect(component.getByText('微信')).toBeVisible();
  await expect(component.getByText('Instagram')).toBeVisible();
});

test('renders copyright text', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Footer />
    </TestWrapper>
  );
  await expect(component.getByRole('heading', { name: 'TravelVista' })).toBeVisible();
  await expect(component.getByText(/©.*TravelVista/)).toBeVisible();
});

test('footer links navigate correctly', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Footer />
    </TestWrapper>
  );
  await expect(component.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/');
  await expect(component.getByRole('link', { name: '目的地' })).toHaveAttribute('href', '/destinations');
  await expect(component.getByRole('link', { name: '关于我们' })).toHaveAttribute('href', '/about');
});
