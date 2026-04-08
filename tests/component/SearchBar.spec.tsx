import { useState } from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import SearchBar from '../../src/components/SearchBar';

test('renders localized default placeholder', async ({ mount }) => {
  const component = await mount(<SearchBar value="" onChange={() => undefined} />, {
    hooksConfig: { language: 'zh' },
  });

  await expect(component.getByPlaceholder('搜索目的地...')).toBeVisible();
});

test('uses custom placeholder and emits controlled updates', async ({ mount }) => {
  let latestValue = '';

  const component = await mount(
    <SearchBar
      value=""
      onChange={(value) => {
        latestValue = value;
      }}
      placeholder="输入关键词"
    />,
    { hooksConfig: { language: 'zh' } },
  );

  await component.getByPlaceholder('输入关键词').fill('巴厘岛');
  await expect.poll(() => latestValue).toBe('巴厘岛');
});