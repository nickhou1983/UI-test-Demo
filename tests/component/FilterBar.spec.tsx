import { test, expect } from '@playwright/experimental-ct-react';
import FilterBar from '../../src/components/FilterBar';

test('renders localized controls', async ({ mount }) => {
  const component = await mount(
    <FilterBar
      keyword=""
      region=""
      type=""
      sortBy=""
      onKeywordChange={() => undefined}
      onRegionChange={() => undefined}
      onTypeChange={() => undefined}
      onSortChange={() => undefined}
    />,
    { hooksConfig: { language: 'zh' } },
  );

  await expect(component.getByPlaceholder('搜索目的地名称...')).toBeVisible();
  await expect(component.getByRole('combobox', { name: '所有地区' })).toBeVisible();
  await expect(component.getByRole('combobox', { name: '所有类型' })).toBeVisible();
  await expect(component.getByRole('combobox', { name: '排序方式' })).toBeVisible();
});

test('propagates keyword and select changes', async ({ mount }) => {
  const state = {
    keyword: '',
    region: '',
    type: '',
    sortBy: '',
  };

  const component = await mount(
    <FilterBar
      keyword=""
      region=""
      type=""
      sortBy=""
      onKeywordChange={(value) => {
        state.keyword = value;
      }}
      onRegionChange={(value) => {
        state.region = value;
      }}
      onTypeChange={(value) => {
        state.type = value;
      }}
      onSortChange={(value) => {
        state.sortBy = value;
      }}
    />,
    { hooksConfig: { language: 'zh' } },
  );

  await component.getByPlaceholder('搜索目的地名称...').fill('巴厘');
  await component.getByRole('combobox', { name: '所有地区' }).selectOption('asia');
  await component.getByRole('combobox', { name: '所有类型' }).selectOption('beach');
  await component.getByRole('combobox', { name: '排序方式' }).selectOption('rating');

  await expect.poll(() => JSON.stringify(state)).toBe(
    JSON.stringify({ keyword: '巴厘', region: 'asia', type: 'beach', sortBy: 'rating' }),
  );
});