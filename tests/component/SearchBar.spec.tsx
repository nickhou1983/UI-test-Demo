import { test, expect } from '@playwright/experimental-ct-react';
import SearchBar from '../../src/components/SearchBar';
import { TestWrapper } from '../fixtures/test-utils';

test('renders with placeholder', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <SearchBar value="" onChange={() => {}} />
    </TestWrapper>
  );
  await expect(component.getByPlaceholder('搜索目的地...')).toBeVisible();
});

test('renders with custom placeholder', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <SearchBar value="" onChange={() => {}} placeholder="自定义占位符" />
    </TestWrapper>
  );
  await expect(component.getByPlaceholder('自定义占位符')).toBeVisible();
});

test('displays current value', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <SearchBar value="巴厘岛" onChange={() => {}} />
    </TestWrapper>
  );
  await expect(component.getByRole('textbox')).toHaveValue('巴厘岛');
});

test('calls onChange when typing', async ({ mount }) => {
  const values: string[] = [];
  const component = await mount(
    <TestWrapper>
      <SearchBar value="" onChange={(v) => values.push(v)} />
    </TestWrapper>
  );
  await component.getByRole('textbox').fill('京都');
  expect(values.length).toBeGreaterThan(0);
  expect(values[values.length - 1]).toBe('京都');
});
