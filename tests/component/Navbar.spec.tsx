import { test, expect } from '@playwright/experimental-ct-react';
import Navbar from '../../src/components/Navbar';
import { TestWrapper } from '../fixtures/test-utils';

test('renders brand name TravelVista', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Navbar />
    </TestWrapper>
  );
  await expect(component.getByText('TravelVista')).toBeVisible();
});

test('renders navigation links', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Navbar />
    </TestWrapper>
  );
  await expect(component.getByRole('link', { name: '首页' })).toBeVisible();
  await expect(component.getByRole('link', { name: '目的地' })).toBeVisible();
  await expect(component.getByRole('link', { name: '关于我们' })).toBeVisible();
});

test('renders language toggle button', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Navbar />
    </TestWrapper>
  );
  await expect(component.getByRole('button', { name: 'EN' })).toBeVisible();
});

test('highlights active link for home page', async ({ mount }) => {
  const component = await mount(
    <TestWrapper initialEntries={['/']}>
      <Navbar />
    </TestWrapper>
  );
  const homeLink = component.getByRole('link', { name: '首页' }).first();
  await expect(homeLink).toHaveClass(/text-emerald-300/);
});

test('highlights active link for destinations page', async ({ mount }) => {
  const component = await mount(
    <TestWrapper initialEntries={['/destinations']}>
      <Navbar />
    </TestWrapper>
  );
  const destLink = component.getByRole('link', { name: '目的地' }).first();
  await expect(destLink).toHaveClass(/text-emerald-300/);
});

test('brand links to home', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Navbar />
    </TestWrapper>
  );
  await expect(component.getByRole('link', { name: 'TravelVista' })).toHaveAttribute('href', '/');
});

test('mobile menu toggle button exists', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Navbar />
    </TestWrapper>
  );
  await expect(component.getByLabel('Toggle menu')).toBeAttached();
});
