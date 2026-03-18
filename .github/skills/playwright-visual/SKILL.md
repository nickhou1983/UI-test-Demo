---
name: playwright-visual
description: >-
  Generate and run Playwright visual regression tests with screenshot comparison.
  Use when: user asks for visual testing, screenshot testing, visual regression,
  responsive design testing, pixel comparison, visual diff, UI screenshot tests,
  or baseline screenshot management. Supports local and Azure PT cloud execution.
---

# Playwright Visual Regression Testing

## ⚠️ Report-Only Policy

This skill generates and runs tests **only**. It does NOT fix failures.

- When visual regressions are detected, output a report with affected screenshots and pixel diff details
- Do NOT automatically update baselines or modify test files to fix visual failures
- Do NOT proactively offer to apply fixes — wait for the tester to explicitly request changes
- When discovering UI rendering issues (layout breaks, styling bugs), report them as findings but do NOT modify source files
- Baseline updates require explicit tester approval

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

Generate `tests/visual/{page}.visual.spec.ts` files.

### Standard Mode (pixel-only)

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

### VLM-Enhanced Mode (pixel + AI fallback)

When VLM review is configured (see Agent Module A8 / J), use the VLM-enhanced fixture:

**Page-level VLM-enhanced test:**
```typescript
import { test, expect } from '../fixtures/visual-test';

test.describe('{PageName} Visual Regression', () => {
  test('default viewport', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('{route}');
    await page.waitForLoadState('networkidle');
    await assertScreenshotWithVlm({
      name: '{page-name}.png',
      target: page,
      screenshotOptions: { fullPage: true, maxDiffPixelRatio: 0.01 },
      pageName: '{PageName}',
      route: '{route}',
    });
  });
});
```

**VLM-enhanced responsive viewport test:**
```typescript
import { test, expect } from '../fixtures/visual-test';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test(`{page} at ${vp.name} (${vp.width}x${vp.height})`, async ({ page, assertScreenshotWithVlm }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('{route}');
    await page.waitForLoadState('networkidle');
    await assertScreenshotWithVlm({
      name: `{page}-${vp.name}.png`,
      target: page,
      screenshotOptions: { fullPage: true, maxDiffPixelRatio: 0.01 },
      pageName: '{PageName}',
      route: '{route}',
      viewport: `${vp.width}x${vp.height}`,
    });
  });
}
```

**VLM-enhanced i18n visual test:**
```typescript
test('{page} in {language}', async ({ page, assertScreenshotWithVlm }) => {
  await page.goto('{route}');
  await page.getByRole('button', { name: '{lang_toggle}' }).click();
  await page.waitForLoadState('networkidle');
  await assertScreenshotWithVlm({
    name: '{page}-{lang}.png',
    target: page,
    screenshotOptions: { fullPage: true, maxDiffPixelRatio: 0.01 },
    pageName: '{PageName}',
    route: '{route}',
    language: '{lang}',
  });
});
```

### Choosing Standard vs VLM-Enhanced Mode

| Condition | Mode |
|-----------|------|
| VLM fixture exists (`tests/fixtures/visual-test.ts`) + `openai` in devDeps | **VLM-Enhanced** |
| VLM not configured | **Standard** (pixel-only) |

When generating tests, check if VLM infrastructure exists. If yes, always generate VLM-enhanced tests. The fixture gracefully degrades to pixel-only when `VLM_REVIEW` is not set.

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
| Run visual + VLM (local) | `VLM_REVIEW=true npx playwright test --project=visual` |
| Run visual + VLM (Azure PT) | `VLM_REVIEW=true npx playwright test --config=playwright.service.config.ts --project=visual` |

## PR Visual Review (Argos CI)

Argos CI provides a PR-level visual diff review layer on top of Playwright's native screenshot comparison. It does NOT replace `toHaveScreenshot` — it adds team collaboration and GitHub Checks gating.

### How Argos Integrates with Playwright

Argos works via a **Playwright reporter**. No changes to test code needed:

1. Playwright runs visual tests and captures screenshots via `toHaveScreenshot()`
2. The `@argos-ci/playwright/reporter` uploads those screenshots to Argos cloud
3. Argos compares PR screenshots against the `main` branch baseline
4. Argos posts a GitHub Check on the PR with the comparison result
5. Reviewers approve/reject visual changes in the Argos Dashboard

### Setup

**1. Install:**
```bash
npm install -D @argos-ci/playwright
```

**2. Add reporter to `playwright.config.ts`:**
```typescript
reporter: [
  ['html', { open: 'never' }],
  ['@argos-ci/playwright/reporter'],
],
```

**3. Add reporter to `playwright.service.config.ts` (Azure PT):**
```typescript
reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['@azure/playwright/reporter'],
  ['@argos-ci/playwright/reporter'],
],
```

**4. Configure CI:**
Add `ARGOS_TOKEN` to the visual test step in `.github/workflows/playwright-azure.yml`:
```yaml
- name: Run Visual Regression tests
  run: npx playwright test --config=playwright.service.config.ts --project=visual
  continue-on-error: true
  env:
    PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
    PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
    ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
```

**5. Set `continue-on-error: true`** on the visual test step so that pixel differences don't fail CI directly — Argos Check handles the pass/fail decision.

### PR Review Flow

```
Code change → Push PR → CI runs visual tests → Screenshots uploaded to Argos
  → Argos compares with main baseline → GitHub Check posted on PR
  → No diff: Check passes automatically
  → Diff detected: Check requires action → Reviewer approves in Argos Dashboard → Check passes
```

### Baseline Management with Argos

- **Argos cloud baseline**: Automatically derived from the `main` branch. No manual management needed.
- **Playwright local baseline** (`*-snapshots/`): Still maintained in git for local development. Update after merging intentional UI changes:
  ```bash
  npx playwright test --project=visual --update-snapshots
  ```
- **Rule**: Argos handles PR gating (cloud). Playwright handles local regression checks (git). Both coexist independently.

### Execution Commands (with Argos)

| Action | Command |
|--------|---------|
| Run visual tests + upload to Argos | `ARGOS_TOKEN={token} npx playwright test --project=visual` |
| Run on Azure PT + upload to Argos | `ARGOS_TOKEN={token} npx playwright test --config=playwright.service.config.ts --project=visual` |

**Note:** Without `ARGOS_TOKEN`, the Argos reporter silently skips uploading. Local tests run normally.

## VLM-Enhanced Visual Review (AI Fallback)

VLM (Vision Language Model) provides an AI-powered semantic diff layer that activates **only when pixel comparison detects differences**. It does NOT replace pixel comparison — it reduces false positives by understanding whether visual diffs are meaningful.

### How VLM Integrates with Playwright

```
Test runs → Pixel comparison via toHaveScreenshot()
  → Pass: Done (zero AI cost)
  → Fail: VLM_REVIEW=true? → Send baseline + actual to Azure OpenAI GPT-4o
    → GPT-4o classifies severity: none / cosmetic / minor / breaking
    → confidence ≥ 0.7 + severity ≤ cosmetic → Pass (annotated)
    → confidence < 0.7 or severity ≥ minor → Fail (with AI explanation)
```

### Architecture

| File | Purpose |
|------|---------|
| `tests/utils/vlm-prompts.ts` | System prompt + user prompt builder |
| `tests/utils/vlm-reviewer.ts` | Azure OpenAI API integration |
| `tests/fixtures/visual-test.ts` | Custom fixture: `assertScreenshotWithVlm` |
| `tests/utils/vlm-reporter.ts` | JSON report generator |

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VLM_REVIEW` | No | `false` | Enable VLM fallback |
| `AZURE_OPENAI_ENDPOINT` | When VLM enabled | — | Azure OpenAI endpoint URL |
| `AZURE_OPENAI_API_KEY` | When VLM enabled | — | API key (or use Entra ID) |
| `AZURE_OPENAI_DEPLOYMENT` | When VLM enabled | `gpt-4o` | Model deployment name |
| `VLM_MAX_CALLS` | No | `10` | Max VLM API calls per run |
| `VLM_CONFIDENCE_THRESHOLD` | No | `0.7` | Min confidence to accept VLM verdict |

### Relationship: Pixel vs VLM vs Argos

| Layer | Role | When |
|-------|------|------|
| Pixel (`toHaveScreenshot`) | Primary comparison | Always |
| VLM (GPT-4o) | Smart false-positive filter | Pixel fails + `VLM_REVIEW=true` |
| Argos CI | Team review dashboard + PR gating | Always (when ARGOS_TOKEN set) |

All three layers are independent and composable. VLM reduces noise that reaches human reviewers in Argos.

### Execution Commands (with VLM)

| Action | Command |
|--------|---------|
| Local visual + VLM | `VLM_REVIEW=true npx playwright test --project=visual` |
| Azure PT + VLM | `VLM_REVIEW=true npx playwright test --config=playwright.service.config.ts --project=visual` |
| npm script (local + VLM) | `npm run test:visual:vlm` |
| npm script (Azure PT + VLM) | `npm run test:azure:visual:vlm` |

**Note:** Without `VLM_REVIEW=true` or without Azure OpenAI credentials, the VLM fixture gracefully degrades to pixel-only mode.
