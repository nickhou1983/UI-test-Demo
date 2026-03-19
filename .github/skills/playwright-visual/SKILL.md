---
name: playwright-visual
description: >-
  Generate and run Playwright visual regression tests with screenshot comparison.
  Use when: user asks for visual testing, screenshot testing, visual regression,
  responsive design testing, pixel comparison, visual diff, UI screenshot tests,
  or baseline screenshot management. Focuses on core screenshot workflows and
  hands off Azure, CI gating, and VLM governance concerns separately.
---

# Playwright Visual Regression Core

## ⚠️ Report-Only Policy

This skill generates and runs tests only. It does NOT fix failures.

- When visual regressions are detected, output a report with affected screenshots and pixel diff details
- Do NOT automatically update baselines or modify test files to fix visual failures
- Do NOT proactively offer to apply fixes; wait for the tester to explicitly request changes
- When discovering UI rendering issues, report them as findings but do NOT modify source files
- Baseline updates require explicit tester approval

## Purpose

This skill owns the core screenshot workflow only:

- page and state selection
- viewport coverage
- i18n visual coverage
- baseline creation and comparison
- screenshot-oriented assertion strategy

It does not own cloud governance, CI policy, or VLM adjudication logic.

## Prerequisites

- Project Analysis Report with routes and i18n information
- `playwright.config.ts` with a `visual` project configured

Use `playwright-config` if the local visual project is missing.

## Input Contract

Before generating or running visual tests, collect:

| Input | Required | Example |
|-------|----------|---------|
| routes or page inventory | yes | `/`, `/destinations`, `/about` |
| baseline environment | yes | `local` or `azure` |
| viewport set | yes | `desktop` or `mobile/tablet/desktop` |
| state variants | no | default, filtered, expanded, dialog-open |
| i18n coverage | no | `en`, `zh` |

If route discovery is incomplete, request discovery first instead of guessing coverage.

## Interactive Visual Testing

Use `playwright-cli` for quick visual inspection during development:

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

### Standard Mode

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

### Coverage Modes

Use these as composable layers:

1. route default state
2. responsive viewports
3. stateful variants such as filters or expanded panels
4. i18n variants when the page meaningfully changes by language

### Responsive Viewport Example

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const viewport of viewports) {
  test(`{PageName} at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('{route}');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`{page-name}-${viewport.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
```

### i18n Visual Example

```typescript
test('{PageName} in {language}', async ({ page }) => {
  await page.goto('{route}');
  await page.getByRole('button', { name: '{lang_toggle}' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('{page-name}-{lang}.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
```

## Baseline Management

- First run generates baseline screenshots and they must be reviewed before commit
- Subsequent runs compare against the approved baseline
- Baseline updates require explicit approval from the tester
- Keep one authoritative baseline environment per suite

## Environment Rules

- Local-only baseline management is acceptable for local-first teams
- Azure-only baseline management is acceptable for cloud-authoritative teams
- Do not mix local and Azure baselines for the same suite

## Execution Commands

| Action | Command |
|--------|---------|
| Run visual tests (local) | `npx playwright test --project=visual` |
| Update baselines (local) | `npx playwright test --project=visual --update-snapshots` |

## Governance Boundary

This skill should hand off the following concerns instead of owning them inline:

- Azure Playwright Workspace setup and execution policy
- CI merge gating and artifact retention policy
- VLM-based semantic adjudication
- PR review workflow and baseline authority rules

Route those concerns to:

- `playwright-azure` — Azure Workspace infrastructure
- `playwright-vlm` — VLM reviewer implementation, prompts, cost controls, and reporter
- `ui-test-governance` — CI gating policy, baseline authority, and VLM enablement decisions

## Optional Integrations

If the repository already contains optional helpers such as `tests/fixtures/visual-test.ts`
or `tests/utils/vlm-reporter.ts`, this skill may reference them as an extension path.
See [playwright-vlm](../playwright-vlm/SKILL.md) for the full VLM integration guide and portable templates.

Do not make VLM the default or required generation path.

## Generation Rules

- Prefer one spec file per route family or page family
- Capture the minimal number of screenshots that still protect layout regressions
- Avoid snapshotting unstable transient states unless explicitly requested
- Use deterministic setup before each screenshot
- Wait for network and layout stabilization before asserting screenshots

## Definition Of Done

This skill is complete when:

1. requested pages or states are covered with deterministic screenshots
2. the baseline environment is explicit
3. responsive or i18n coverage is added only where it provides signal
4. governance-heavy concerns are delegated instead of embedded here
