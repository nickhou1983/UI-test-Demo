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

### VLM Source Code Reference

When generating VLM infrastructure for a project, use the following implementations as the canonical reference. Generate these files verbatim (adjusting only project-specific paths if needed).

#### `tests/utils/vlm-prompts.ts`

```typescript
/**
 * VLM Visual Regression Review — Prompt Templates
 *
 * Provides system and user prompts for Azure OpenAI GPT-4o vision
 * to perform semantic-level visual diff review.
 */

export const VLM_SYSTEM_PROMPT = `You are a senior UI/UX quality assurance engineer specializing in visual regression testing. Your job is to compare two screenshots of a web page — a BASELINE (the approved reference) and an ACTUAL (the current build) — and determine whether the differences constitute a real visual regression bug or acceptable rendering noise.

## Severity Levels

Classify every diff into exactly one severity level:

### "none"
No visible difference, or differences only detectable at sub-pixel zoom level.
Examples: identical screenshots, imperceptible anti-aliasing changes.

### "cosmetic"
Differences that are visible upon close inspection but do NOT affect usability or readability.
Examples:
- Font rendering / anti-aliasing variations across OS or browser versions
- Shadow or border-radius sub-pixel rounding (±1px)
- Image compression artifact differences
- Gradient banding differences
- Scrollbar style differences

### "minor"
Differences that are noticeable but do NOT break functionality or significantly degrade UX.
Examples:
- Spacing changes < 5px
- Subtle color shade shifts that preserve readability
- Icon size minor variation
- Text wrapping difference that does not truncate content

### "breaking"
Differences that indicate a real visual regression bug requiring immediate attention.
Examples:
- Elements missing, hidden, or overlapping incorrectly
- Text truncated, overflowing, or unreadable
- Layout collapsed or significantly shifted (> 10px)
- Color changes that break contrast / accessibility (e.g., white text on white background)
- Navigation or interactive elements obscured
- Images broken or replaced with wrong asset
- Entire sections missing or reordered

## Output Format

Respond with ONLY a valid JSON object (no markdown, no code fence). The JSON must have exactly these fields:

{
  "severity": "none" | "cosmetic" | "minor" | "breaking",
  "description": "Concise description of the visual differences found",
  "areas": ["list", "of", "affected", "UI", "areas"],
  "recommendation": "pass" | "warn" | "fail",
  "confidence": 0.0 to 1.0
}

## Rules

- "recommendation" mapping: severity "none"→"pass", "cosmetic"→"pass", "minor"→"warn", "breaking"→"fail"
- "confidence" reflects how certain you are about the severity classification (1.0 = absolutely certain)
- If you cannot determine the difference clearly, set confidence low (< 0.7) and severity to "minor"
- Focus on what a real human tester would notice at normal viewing distance
- Do NOT flag differences that are clearly OS/browser rendering engine variations
- Be precise in "areas" — use UI region names like "navbar", "hero section", "footer", "sidebar", "card grid"
- "description" should be actionable — a developer should understand what changed`;

export interface VlmPromptContext {
  pageName: string;
  route?: string;
  viewport?: string;
  language?: string;
}

/**
 * Build the user prompt with two images and page context.
 */
export function buildUserPrompt(context: VlmPromptContext): string {
  const parts = [`Page: "${context.pageName}"`];
  if (context.route) parts.push(`Route: ${context.route}`);
  if (context.viewport) parts.push(`Viewport: ${context.viewport}`);
  if (context.language) parts.push(`Language: ${context.language}`);

  return `Compare these two UI screenshots and provide your visual regression analysis.

Context:
${parts.join('\n')}

Image 1 (BASELINE — the approved reference):
[see first attached image]

Image 2 (ACTUAL — the current build):
[see second attached image]

Analyze all visual differences and return your JSON verdict.`;
}
```

#### `tests/utils/vlm-reviewer.ts`

```typescript
/**
 * VLM Visual Regression Reviewer
 *
 * Sends baseline + actual screenshots to Azure OpenAI GPT-4o vision
 * for semantic-level visual diff analysis. Used as a "smart noise filter"
 * when pixel-level comparison fails.
 */

import { readFileSync } from 'fs';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import { VLM_SYSTEM_PROMPT, buildUserPrompt, type VlmPromptContext } from './vlm-prompts';

export interface VlmReviewResult {
  severity: 'none' | 'cosmetic' | 'minor' | 'breaking';
  description: string;
  areas: string[];
  recommendation: 'pass' | 'warn' | 'fail';
  confidence: number;
}

export interface VlmReviewOptions extends VlmPromptContext {
  /** Azure OpenAI endpoint (overrides env) */
  endpoint?: string;
  /** Azure OpenAI API key (overrides env, skips Entra ID if set) */
  apiKey?: string;
  /** Deployment name for GPT-4o (default: "gpt-4o") */
  deploymentName?: string;
  /** API version (default: "2024-12-01-preview") */
  apiVersion?: string;
  /** Max tokens for response (default: 1024) */
  maxTokens?: number;
}

/** Global call counter for cost control */
let vlmCallCount = 0;
const VLM_MAX_CALLS = Number(process.env.VLM_MAX_CALLS) || 10;

export function getVlmCallCount(): number {
  return vlmCallCount;
}

export function resetVlmCallCount(): void {
  vlmCallCount = 0;
}

function imageToBase64DataUrl(filePath: string): string {
  const buffer = readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return `data:image/png;base64,${base64}`;
}

function createAzureClient(options: VlmReviewOptions): AzureOpenAI {
  const endpoint = options.endpoint || process.env.AZURE_OPENAI_ENDPOINT;
  if (!endpoint) {
    throw new Error(
      'Azure OpenAI endpoint not configured. Set AZURE_OPENAI_ENDPOINT env var or pass endpoint option.',
    );
  }

  const apiKey = options.apiKey || process.env.AZURE_OPENAI_API_KEY;
  const deployment = options.deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const apiVersion = options.apiVersion || '2024-12-01-preview';

  if (apiKey) {
    return new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });
  }

  // Use DefaultAzureCredential (Entra ID) — consistent with playwright.service.config.ts
  const credential = new DefaultAzureCredential();
  const scope = 'https://cognitiveservices.azure.com/.default';
  const azureADTokenProvider = getBearerTokenProvider(credential, scope);
  return new AzureOpenAI({ endpoint, azureADTokenProvider, deployment, apiVersion });
}

function parseVlmResponse(content: string): VlmReviewResult {
  // Strip markdown code fences if present
  const cleaned = content.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim();

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  const validSeverities = ['none', 'cosmetic', 'minor', 'breaking'];
  const validRecommendations = ['pass', 'warn', 'fail'];

  if (!validSeverities.includes(parsed.severity)) {
    throw new Error(`Invalid severity: ${parsed.severity}`);
  }
  if (!validRecommendations.includes(parsed.recommendation)) {
    throw new Error(`Invalid recommendation: ${parsed.recommendation}`);
  }
  if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
    throw new Error(`Invalid confidence: ${parsed.confidence}`);
  }

  return {
    severity: parsed.severity,
    description: String(parsed.description || ''),
    areas: Array.isArray(parsed.areas) ? parsed.areas.map(String) : [],
    recommendation: parsed.recommendation,
    confidence: parsed.confidence,
  };
}

/**
 * Review a visual diff by sending baseline + actual screenshots to Azure OpenAI GPT-4o.
 */
export async function reviewVisualDiff(
  baselinePath: string,
  actualPath: string,
  options: VlmReviewOptions,
): Promise<VlmReviewResult> {
  // Cost control: enforce max calls per run
  if (vlmCallCount >= VLM_MAX_CALLS) {
    throw new Error(
      `VLM call limit reached (${VLM_MAX_CALLS}). Skipping review to control costs. ` +
        'Set VLM_MAX_CALLS env var to increase the limit.',
    );
  }
  vlmCallCount++;

  const client = createAzureClient(options);
  const baselineDataUrl = imageToBase64DataUrl(baselinePath);
  const actualDataUrl = imageToBase64DataUrl(actualPath);
  const userPrompt = buildUserPrompt(options);

  const response = await client.chat.completions.create({
    model: options.deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
    max_tokens: options.maxTokens || 1024,
    temperature: 0.1, // Low temperature for consistent judgments
    messages: [
      { role: 'system', content: VLM_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: baselineDataUrl, detail: 'high' } },
          { type: 'image_url', image_url: { url: actualDataUrl, detail: 'high' } },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Azure OpenAI');
  }

  const result = parseVlmResponse(content);
  (result as VlmReviewResult & { usage?: typeof response.usage }).usage = response.usage;

  return result;
}

/**
 * Check if VLM review is enabled via environment variable.
 */
export function isVlmEnabled(): boolean {
  return process.env.VLM_REVIEW === 'true';
}

/**
 * Check if VLM credentials are available.
 */
export function hasVlmCredentials(): boolean {
  return !!(
    process.env.AZURE_OPENAI_ENDPOINT &&
    (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_CLIENT_ID)
  );
}
```

#### `tests/fixtures/visual-test.ts`

```typescript
/**
 * VLM-Enhanced Visual Test Fixture
 *
 * Extends Playwright's test fixture with a hybrid visual regression strategy:
 * 1. Run native toHaveScreenshot() pixel comparison
 * 2. If pixel diff fails AND VLM_REVIEW=true → send to Azure OpenAI GPT-4o for semantic review
 * 3. VLM judges cosmetic (confidence ≥ 0.7) → WARN, test passes with annotation
 * 4. VLM judges breaking OR low confidence → test fails as usual
 */

import { test as base, expect, type Page, type Locator } from '@playwright/test';
import { existsSync } from 'fs';
import { join, basename } from 'path';
import {
  reviewVisualDiff,
  isVlmEnabled,
  hasVlmCredentials,
  type VlmReviewResult,
} from '../utils/vlm-reviewer';

/** Collected VLM review results, exported for the reporter */
export const vlmResults: Array<{
  testTitle: string;
  screenshotName: string;
  pixelDiffFailed: boolean;
  vlmResult?: VlmReviewResult;
  vlmError?: string;
  action: 'skipped' | 'passed_pixel' | 'passed_vlm' | 'warned_vlm' | 'failed';
}> = [];

const CONFIDENCE_THRESHOLD = Number(process.env.VLM_CONFIDENCE_THRESHOLD) || 0.7;

interface ScreenshotWithVlmOptions {
  /** Screenshot name (e.g., 'home-main.png') */
  name: string;
  /** Page or locator to screenshot */
  target: Page | Locator;
  /** Standard Playwright screenshot options */
  screenshotOptions?: {
    animations?: 'disabled' | 'allow';
    fullPage?: boolean;
    maxDiffPixelRatio?: number;
    maxDiffPixels?: number;
    mask?: Locator[];
    stylePath?: string | string[];
  };
  /** VLM context */
  pageName: string;
  route?: string;
  viewport?: string;
  language?: string;
}

export const test = base.extend<{
  assertScreenshotWithVlm: (options: ScreenshotWithVlmOptions) => Promise<void>;
}>({
  // eslint-disable-next-line no-empty-pattern
  assertScreenshotWithVlm: async ({}, use, testInfo) => {
    const fn = async (options: ScreenshotWithVlmOptions) => {
      const { name, target, screenshotOptions = {}, pageName, route, viewport, language } = options;

      try {
        // Step 1: Try native pixel comparison
        if ('getByRole' in target) {
          await expect(target as Page).toHaveScreenshot(name, screenshotOptions);
        } else {
          await expect(target as Locator).toHaveScreenshot(name, screenshotOptions);
        }

        vlmResults.push({
          testTitle: testInfo.title,
          screenshotName: name,
          pixelDiffFailed: false,
          action: 'passed_pixel',
        });
        return;
      } catch (pixelError) {
        // Step 2: Pixel comparison failed — should we invoke VLM?
        if (!isVlmEnabled()) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            action: 'failed',
          });
          throw pixelError;
        }

        if (!hasVlmCredentials()) {
          console.warn('[VLM] VLM_REVIEW=true but Azure OpenAI credentials not found.');
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: 'Missing Azure OpenAI credentials',
            action: 'failed',
          });
          throw pixelError;
        }

        // Step 3: Find baseline and actual screenshot files
        const snapshotDir = testInfo.snapshotDir;
        const snapshotSuffix = testInfo.snapshotSuffix;
        const baselineName = basename(name, '.png') + snapshotSuffix + '.png';
        const baselinePath = join(snapshotDir, baselineName);
        const actualName = basename(name, '.png') + '-actual.png';
        const actualPath = join(testInfo.outputDir, actualName);

        if (!existsSync(baselinePath) || !existsSync(actualPath)) {
          console.warn(`[VLM] Cannot find baseline or actual. Falling back to pixel diff.`);
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: `Screenshot files not found`,
            action: 'failed',
          });
          throw pixelError;
        }

        // Step 4: Call VLM for semantic review
        console.log(`[VLM] Pixel diff failed for "${name}". Sending to Azure OpenAI GPT-4o...`);

        let vlmResult: VlmReviewResult;
        try {
          vlmResult = await reviewVisualDiff(baselinePath, actualPath, {
            pageName, route, viewport, language,
          });
        } catch (vlmError) {
          console.warn(`[VLM] API call failed: ${vlmError}. Falling back to pixel diff.`);
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: String(vlmError),
            action: 'failed',
          });
          throw pixelError;
        }

        console.log(`[VLM] Verdict: severity=${vlmResult.severity}, confidence=${vlmResult.confidence}`);

        // Step 5: Apply confidence threshold
        if (vlmResult.confidence < CONFIDENCE_THRESHOLD) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: 'failed',
          });
          testInfo.annotations.push({
            type: 'vlm-low-confidence',
            description: `VLM confidence ${vlmResult.confidence} < ${CONFIDENCE_THRESHOLD}: ${vlmResult.description}`,
          });
          throw pixelError;
        }

        // Step 6: Act on VLM recommendation
        if (vlmResult.recommendation === 'pass') {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: vlmResult.severity === 'none' ? 'passed_vlm' : 'warned_vlm',
          });
          testInfo.annotations.push({
            type: 'vlm-override',
            description: `[VLM ${vlmResult.severity}] ${vlmResult.description} (confidence: ${vlmResult.confidence})`,
          });
          return; // Test passes
        }

        if (vlmResult.recommendation === 'warn') {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: 'warned_vlm',
          });
          testInfo.annotations.push({
            type: 'vlm-warning',
            description: `[VLM minor] ${vlmResult.description} (confidence: ${vlmResult.confidence})`,
          });
          return; // Test passes with warning
        }

        // Breaking — test fails
        vlmResults.push({
          testTitle: testInfo.title,
          screenshotName: name,
          pixelDiffFailed: true,
          vlmResult,
          action: 'failed',
        });
        testInfo.annotations.push({
          type: 'vlm-breaking',
          description: `[VLM breaking] ${vlmResult.description} (areas: ${vlmResult.areas.join(', ')})`,
        });
        throw pixelError;
      }
    };

    await use(fn);
  },
});

export { expect };
```

#### `tests/utils/vlm-reporter.ts`

```typescript
/**
 * VLM Visual Review Reporter
 *
 * Custom Playwright reporter that collects VLM review results
 * and generates a JSON report file at the end of the test run.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface VlmReportEntry {
  testTitle: string;
  testFile: string;
  screenshotName: string;
  pixelDiffFailed: boolean;
  vlmSeverity?: string;
  vlmDescription?: string;
  vlmAreas?: string[];
  vlmRecommendation?: string;
  vlmConfidence?: number;
  vlmError?: string;
  action: string;
}

export default class VlmReporter implements Reporter {
  private entries: VlmReportEntry[] = [];
  private outputDir: string = '';
  private vlmCallCount = 0;

  onBegin(config: FullConfig, _suite: Suite): void {
    this.outputDir = config.configFile ? dirname(config.configFile) : config.rootDir;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    for (const annotation of result.annotations) {
      if (
        annotation.type === 'vlm-override' ||
        annotation.type === 'vlm-warning' ||
        annotation.type === 'vlm-breaking' ||
        annotation.type === 'vlm-low-confidence'
      ) {
        this.vlmCallCount++;
        this.entries.push({
          testTitle: test.title,
          testFile: test.location.file,
          screenshotName: this.extractScreenshotName(annotation.description || ''),
          pixelDiffFailed: true,
          vlmSeverity: this.extractSeverity(annotation.type),
          vlmDescription: annotation.description || '',
          vlmRecommendation: this.extractRecommendation(annotation.type),
          vlmConfidence: this.extractConfidence(annotation.description || ''),
          action: this.annotationTypeToAction(annotation.type),
        });
      }
    }
  }

  onEnd(result: FullResult): void {
    const report = {
      generatedAt: new Date().toISOString(),
      testRunStatus: result.status,
      vlmEnabled: process.env.VLM_REVIEW === 'true',
      vlmCallCount: this.vlmCallCount,
      maxCalls: Number(process.env.VLM_MAX_CALLS) || 10,
      confidenceThreshold: Number(process.env.VLM_CONFIDENCE_THRESHOLD) || 0.7,
      summary: {
        total: this.entries.length,
        passed_vlm: this.entries.filter((e) => e.action === 'passed_vlm').length,
        warned_vlm: this.entries.filter((e) => e.action === 'warned_vlm').length,
        failed: this.entries.filter((e) => e.action === 'failed').length,
      },
      entries: this.entries,
    };

    const reportPath = join(this.outputDir, 'vlm-review-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n[VLM Reporter] Report written to: ${reportPath}`);

    if (this.entries.length > 0) {
      console.log(`[VLM Reporter] Summary: ${report.summary.passed_vlm} passed, ${report.summary.warned_vlm} warned, ${report.summary.failed} failed`);
    } else {
      console.log(`[VLM Reporter] No VLM reviews triggered.`);
    }
  }

  private extractScreenshotName(description: string): string {
    return description.split(']')[1]?.trim().split(' ')[0] || 'unknown';
  }

  private extractSeverity(annotationType: string): string {
    const map: Record<string, string> = {
      'vlm-override': 'cosmetic',
      'vlm-warning': 'minor',
      'vlm-breaking': 'breaking',
      'vlm-low-confidence': 'uncertain',
    };
    return map[annotationType] || 'unknown';
  }

  private extractRecommendation(annotationType: string): string {
    const map: Record<string, string> = {
      'vlm-override': 'pass',
      'vlm-warning': 'warn',
      'vlm-breaking': 'fail',
      'vlm-low-confidence': 'fail',
    };
    return map[annotationType] || 'fail';
  }

  private extractConfidence(description: string): number | undefined {
    const match = description.match(/confidence:\s*([\d.]+)/);
    return match ? parseFloat(match[1]) : undefined;
  }

  private annotationTypeToAction(annotationType: string): string {
    const map: Record<string, string> = {
      'vlm-override': 'passed_vlm',
      'vlm-warning': 'warned_vlm',
      'vlm-breaking': 'failed',
      'vlm-low-confidence': 'failed',
    };
    return map[annotationType] || 'failed';
  }
}
```

### VLM Dependencies

When generating VLM infrastructure, ensure these packages are in `devDependencies`:

```bash
npm install -D openai @azure/identity
```

### VLM Reporter Config

Add the VLM reporter to `playwright.config.ts` in the `reporter` array:

```typescript
reporter: [
  ['html', { open: 'never' }],
  ['./tests/utils/vlm-reporter.ts'],
],
```

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
