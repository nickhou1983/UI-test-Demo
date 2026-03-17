---
name: playwright-visual
description: >-
  Generate and run Playwright visual regression tests with screenshot comparison.
  Use when: user asks for visual testing, screenshot testing, visual regression,
  responsive design testing, pixel comparison, visual diff, UI screenshot tests,
  or baseline screenshot management. Supports local and Azure PT cloud execution.
---

# Playwright Visual Regression Testing

## Prerequisites

- **Project Analysis Report** (Module B) — routes, i18n config
- **playwright.config.ts** with `visual` project configured (generate via `playwright-config` skill if missing)

## Interactive Visual Testing (playwright-cli)

Use for quick visual checks during development:

```bash
# Desktop screenshot
playwright-cli open {dev_server_url}
playwright-cli screenshot --filename=screenshots/{page}-desktop.png

# Tablet screenshot
playwright-cli resize 768 1024
playwright-cli screenshot --filename=screenshots/{page}-tablet.png

# Mobile screenshot
playwright-cli resize 375 812
playwright-cli screenshot --filename=screenshots/{page}-mobile.png

playwright-cli close
```

## Automated Visual Regression Test Generation

Generate `tests/visual/{page}.visual.spec.ts` files:

**Page-level screenshot test:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('{PageName} Visual Regression', () => {
  test('default viewport', async ({ page }) => {
    await page.goto('{route}');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('{page-name}.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
```

**Responsive viewport test:**
```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test(`{page} at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('{route}');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`{page}-${vp.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
```

**i18n visual test (if applicable):**
```typescript
test('{page} in {language}', async ({ page }) => {
  await page.goto('{route}');
  await page.getByRole('button', { name: '{lang_toggle}' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('{page}-{lang}.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
```

## Baseline Management

- First run generates baseline screenshots → commit to git
- Subsequent runs compare against baseline
- Update baselines: `npx playwright test --project=visual --update-snapshots`

## Azure PT Cloud Visual Testing

When running via Azure Playwright Workspace cloud:

**Advantages:**
- Consistent OS & browser environment across all team members (Linux containers)
- Eliminates "works on my machine" baseline drift from different OS font rendering
- Parallel execution across multiple browsers

**Baseline management in cloud mode:**
1. First run: `npx playwright test --config=playwright.service.config.ts --project=visual --update-snapshots`
2. Commit generated baselines (`*-snapshots/` directories) to git
3. Subsequent CI runs compare against committed baselines
4. Always update baselines on Azure PT (not local) to maintain consistency

**Important:** Baselines generated locally and on Azure PT are NOT interchangeable. Choose one environment and stick with it.

## Execution Commands

| Action | Command |
|--------|---------|
| Run visual tests (local) | `npx playwright test --project=visual` |
| Update baselines (local) | `npx playwright test --project=visual --update-snapshots` |
| Run visual tests (Azure PT) | `npx playwright test --config=playwright.service.config.ts --project=visual` |
| Update baselines (Azure PT) | `npx playwright test --config=playwright.service.config.ts --project=visual --update-snapshots` |
