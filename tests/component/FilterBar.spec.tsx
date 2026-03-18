import { test, expect } from '@playwright/experimental-ct-react';
import FilterBar from '../../src/components/FilterBar';
import { TestWrapper } from '../fixtures/test-utils';

test('renders search input and two dropdowns', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <FilterBar
        keyword=""
        region=""
        type=""
        onKeywordChange={() => {}}
        onRegionChange={() => {}}
        onTypeChange={() => {}}
      />
    </TestWrapper>
  );
  await expect(component.getByRole('textbox')).toBeVisible();
  await expect(component.getByRole('combobox')).toHaveCount(2);
});

test('displays keyword value in search input', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <FilterBar
        keyword="巴厘"
        region=""
        type=""
        onKeywordChange={() => {}}
        onRegionChange={() => {}}
        onTypeChange={() => {}}
      />
    </TestWrapper>
  );
  await expect(component.getByRole('textbox')).toHaveValue('巴厘');
});

test('calls onKeywordChange when typing', async ({ mount }) => {
  const keywords: string[] = [];
  const component = await mount(
    <TestWrapper>
      <FilterBar
        keyword=""
        region=""
        type=""
        onKeywordChange={(v) => keywords.push(v)}
        onRegionChange={() => {}}
        onTypeChange={() => {}}
      />
    </TestWrapper>
  );
  await component.getByRole('textbox').fill('马尔代夫');
  expect(keywords[keywords.length - 1]).toBe('马尔代夫');
});

test('calls onRegionChange when selecting region', async ({ mount }) => {
  const regions: string[] = [];
  const component = await mount(
    <TestWrapper>
      <FilterBar
        keyword=""
        region=""
        type=""
        onKeywordChange={() => {}}
        onRegionChange={(v) => regions.push(v)}
        onTypeChange={() => {}}
      />
    </TestWrapper>
  );
  await component.getByLabel('所有地区').selectOption('asia');
  expect(regions).toContain('asia');
});

test('calls onTypeChange when selecting type', async ({ mount }) => {
  const types: string[] = [];
  const component = await mount(
    <TestWrapper>
      <FilterBar
        keyword=""
        region=""
        type=""
        onKeywordChange={() => {}}
        onRegionChange={() => {}}
        onTypeChange={(v) => types.push(v)}
      />
    </TestWrapper>
  );
  await component.getByLabel('所有类型').selectOption('beach');
  expect(types).toContain('beach');
});

test('pre-selects region and type values', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <FilterBar
        keyword=""
        region="europe"
        type="city"
        onKeywordChange={() => {}}
        onRegionChange={() => {}}
        onTypeChange={() => {}}
      />
    </TestWrapper>
  );
  await expect(component.getByLabel('所有地区')).toHaveValue('europe');
  await expect(component.getByLabel('所有类型')).toHaveValue('city');
});
