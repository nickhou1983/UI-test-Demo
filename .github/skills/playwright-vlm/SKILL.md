---
name: playwright-vlm
description: >-
  VLM-enhanced visual regression review using Azure OpenAI GPT-4o vision.
  Use when: user asks for VLM review, semantic visual diff, smart noise filter,
  vision language model, GPT-4o visual comparison, VLM confidence threshold,
  visual regression adjudication, VLM cost controls, or VLM-enhanced screenshot
  analysis. Provides a self-contained, cross-project portable VLM integration
  with templates that can be copied into any Playwright project.
---

# Playwright VLM Visual Regression Review

## ⚠️ Report-Only Policy

This skill does NOT auto-update baselines or modify test files.

- VLM review is advisory — it classifies pixel diffs as noise or real regressions
- When a breaking regression is detected, the test fails; this skill does NOT fix it
- Baseline updates still require explicit tester approval regardless of VLM verdict

## Purpose

This skill owns VLM-enhanced visual regression review:

- pixel-first, VLM-fallback strategy
- Azure OpenAI GPT-4o vision integration
- severity classification and judgment semantics
- confidence threshold and cost controls
- prompt engineering for visual diff analysis
- reporter output format (`vlm-review-report.json`)

It does **not** own:

- core pixel-level screenshot comparison → `playwright-visual`
- Azure Playwright Workspace infrastructure → `playwright-azure`
- CI merge gating and baseline authority policies → `ui-test-governance`

## Self-Contained Templates

This skill ships with ready-to-install templates in the `templates/` subdirectory:

```
templates/
├── utils/
│   ├── vlm-prompts.ts         # System & user prompt for GPT-4o vision
│   ├── vlm-reviewer.ts        # Core review logic + Azure OpenAI client
│   ├── vlm-reporter.ts        # Playwright custom reporter → JSON + ANSI console
│   └── vlm-html-reporter.ts   # Standalone HTML visual report with screenshots
└── fixtures/
    └── visual-test.ts          # Hybrid pixel-first / VLM-fallback fixture
```

To install in a new project, see the **Setup** section below.

## Prerequisites

- A Playwright visual testing project already configured (use `playwright-config` or `playwright-visual` first)
- Azure OpenAI resource with a GPT-4o (vision-capable) deployment
- Either an API key or Azure Entra ID credentials for authentication

## Input Contract

| Input | Required | Example |
|-------|----------|---------|
| VLM enabled | yes | `VLM_REVIEW=true` |
| Azure OpenAI endpoint | yes | `https://my-resource.openai.azure.com` |
| Authentication | yes | API key or Entra ID |
| Deployment name | no (default: `gpt-4o`) | `gpt-4o` |
| Max API calls per run | no (default: 10) | `VLM_MAX_CALLS=20` |
| Confidence threshold | no (default: 0.7) | `VLM_CONFIDENCE_THRESHOLD=0.8` |

## Strategy: Pixel-First, VLM-Fallback

```
                    Screenshot Assertion
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
          Pixel PASS            Pixel FAIL
             │                      │
             ▼                      ▼
         Test passes        VLM_REVIEW=true?
                            │            │
                           NO           YES
                            │            │
                            ▼            ▼
                       Test fails   Call Azure OpenAI
                                    GPT-4o Vision
                                         │
                                    ┌────┴────┐
                                    ▼         ▼
                              confidence   confidence
                               ≥ 0.7       < 0.7
                                 │            │
                            ┌────┴────┐       ▼
                            ▼         ▼   Test fails
                       none/cosmetic  minor  breaking
                            │         │       │
                            ▼         ▼       ▼
                        Pass+note  Pass+warn  Test fails
```

The native Playwright `toHaveScreenshot()` always runs first. VLM is only invoked when pixel comparison fails and `VLM_REVIEW=true`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VLM_REVIEW` | `false` | Enable VLM fallback review (`true` / `false`) |
| `VLM_MAX_CALLS` | `10` | Maximum VLM API calls per test run (cost control) |
| `VLM_CONFIDENCE_THRESHOLD` | `0.7` | Minimum confidence to trust VLM verdict |
| `AZURE_OPENAI_ENDPOINT` | — | Azure OpenAI resource endpoint (required) |
| `AZURE_OPENAI_API_KEY` | — | API key (if not using Entra ID) |
| `AZURE_OPENAI_DEPLOYMENT` | `gpt-4o` | Model deployment name |
| `VLM_REPORT_INLINE` | `false` | Embed base64 images in HTML report (`true` / `false`) |

## Severity Levels

| Severity | Recommendation | Action | Examples |
|----------|---------------|--------|----------|
| `none` | `pass` | Test passes + `vlm-override` annotation | Identical screenshots, sub-pixel differences |
| `cosmetic` | `pass` | Test passes + `vlm-override` annotation | Font anti-aliasing, ±1px shadow, compression artifacts |
| `minor` | `warn` | Test passes + `vlm-warning` annotation | Spacing <5px, subtle color shifts, minor icon variation |
| `breaking` | `fail` | Test fails + `vlm-breaking` annotation | Missing elements, text truncation, layout collapse >10px |

When confidence is below the threshold, the test fails with a `vlm-low-confidence` annotation regardless of severity.

## Authentication

### Option 1: API Key

```env
AZURE_OPENAI_ENDPOINT=https://my-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

### Option 2: Azure Entra ID (Managed Identity)

```env
AZURE_OPENAI_ENDPOINT=https://my-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o
# No API key — uses DefaultAzureCredential automatically
```

Entra ID requires the `Cognitive Services OpenAI User` role on the Azure OpenAI resource.

## Fixture Usage

Import the hybrid fixture instead of the standard Playwright test:

```typescript
import { test } from '../fixtures/visual-test';

test('home page', async ({ page, assertScreenshotWithVlm }) => {
  await page.goto('./');
  await assertScreenshotWithVlm({
    name: 'home-main.png',
    target: page,
    screenshotOptions: { animations: 'disabled', maxDiffPixelRatio: 0.01 },
    pageName: 'Home Page',
    route: '/',
    viewport: '1280x720',
  });
});
```

The `assertScreenshotWithVlm` fixture:
1. Runs native `toHaveScreenshot()` first
2. On pixel failure + `VLM_REVIEW=true`, calls GPT-4o vision
3. Applies confidence threshold and severity classification
4. Annotates the test result for the VLM reporter

## Reporter Configuration

Add the VLM reporter conditionally in `playwright.config.ts`:

```typescript
const reporter: ReporterDescription[] = [['html', { open: 'never' }]];

if (process.env.VLM_REVIEW === 'true') {
  reporter.push(['./tests/utils/vlm-reporter.ts']);
  reporter.push(['./tests/utils/vlm-html-reporter.ts']);
}

export default defineConfig({
  reporter,
  // ...
});
```

## Report Output

The reporters produce two output files:

- `vlm-review-report.json` — machine-readable JSON with aggregation and pattern detection
- `vlm-visual-report.html` — standalone HTML dashboard with screenshot side-by-side cards

### JSON Report

```json
{
  "generatedAt": "2026-03-19T08:00:00.000Z",
  "testRunStatus": "passed",
  "vlmEnabled": true,
  "vlmCallCount": 3,
  "maxCalls": 10,
  "confidenceThreshold": 0.7,
  "summary": {
    "total": 3,
    "passed_vlm": 2,
    "warned_vlm": 1,
    "failed": 0
  },
  "entries": [
    {
      "testTitle": "home page baseline",
      "testFile": "tests/visual/pages.visual.spec.ts",
      "screenshotName": "home-page.png",
      "pixelDiffFailed": true,
      "vlmSeverity": "cosmetic",
      "vlmDescription": "Subtle font rendering variation in navbar",
      "vlmAreas": ["navbar"],
      "vlmChangedProperties": ["color"],
      "vlmRecommendation": "pass",
      "vlmConfidence": 0.95,
      "action": "passed_vlm",
      "baselinePath": "test-results/.../baseline.png",
      "actualPath": "test-results/.../actual.png",
      "diffPath": "test-results/.../diff.png"
    }
  ],
  "patterns": [
    {
      "type": "global-property",
      "label": "color",
      "affectedCount": 6,
      "totalCount": 8,
      "percentage": 75,
      "details": "\"color\" change detected across 6/8 pages (75%)"
    }
  ],
  "aggregation": {
    "bySeverity": { "cosmetic": 2, "minor": 1 },
    "byArea": { "navbar": 3, "hero": 1 },
    "byProperty": { "color": 6, "typography": 1 },
    "byPage": {}
  }
}
```

### HTML Report

The HTML report (`vlm-visual-report.html`) features:
- **Dashboard**: severity distribution cards + detected cross-page patterns
- **Entry cards**: baseline / actual screenshots side-by-side with severity badge, confidence progress bar, areas and changedProperties tags
- **Image modes**: external `file://` refs by default (smaller HTML); set `VLM_REPORT_INLINE=true` for base64 inline (portable)

### Playwright HTML Reporter Integration

Screenshots are also attached via `testInfo.attach()`, making them visible inside Playwright's built-in HTML reporter per-test view.

### ANSI Terminal Output

The console table output is now color-coded:
- **Breaking** → red, **Minor** → yellow, **Cosmetic** → green
- Cross-page pattern detection summary at the bottom
```

## Prompt Engineering

The system prompt (in `templates/utils/vlm-prompts.ts`) instructs GPT-4o to:

1. Compare BASELINE and ACTUAL screenshots side by side
2. Classify differences into exactly one severity level
3. Return a structured JSON verdict with `severity`, `description`, `areas`, `changedProperties`, `recommendation`, `confidence`
4. Focus on what a human tester would notice at normal viewing distance
5. Ignore OS/browser rendering engine variations

The user prompt includes page context (name, route, viewport, language) to help the model understand what it is reviewing.

### Customizing Prompts

To adjust severity thresholds or add domain-specific rules, edit the `VLM_SYSTEM_PROMPT` in `vlm-prompts.ts`. For example, to make the model stricter about spacing:

```
Replace: "Spacing changes < 5px" under "minor"
With:    "Spacing changes < 3px" under "minor" and ">= 3px" under "breaking"
```

## Execution Commands

| Action | Command |
|--------|---------|
| Visual tests without VLM | `npm run test:visual` |
| Visual tests with VLM | `npm run test:visual:vlm` |
| Azure cloud visual without VLM | `npm run test:azure:visual` |
| Azure cloud visual with VLM | `npm run test:azure:visual:vlm` |

Equivalent manual commands:

```bash
# Local with VLM
VLM_REVIEW=true npx playwright test --project=visual

# Azure with VLM
VLM_REVIEW=true npx playwright test --config=playwright.service.config.ts --project=visual
```

## Setup — Installing in a New Project

Follow these steps to add VLM review to any Playwright project:

### 1. Copy Templates

```bash
# From .github/skills/playwright-vlm/templates/
cp templates/utils/vlm-prompts.ts   <project>/tests/utils/vlm-prompts.ts
cp templates/utils/vlm-reviewer.ts  <project>/tests/utils/vlm-reviewer.ts
cp templates/utils/vlm-reporter.ts       <project>/tests/utils/vlm-reporter.ts
cp templates/utils/vlm-html-reporter.ts  <project>/tests/utils/vlm-html-reporter.ts
cp templates/fixtures/visual-test.ts     <project>/tests/fixtures/visual-test.ts
```

### 2. Install npm Dependencies

```bash
npm install openai @azure/identity
```

### 3. Configure Reporter

Add to `playwright.config.ts`:

```typescript
const reporter: ReporterDescription[] = [['html', { open: 'never' }]];

if (process.env.VLM_REVIEW === 'true') {
  reporter.push(['./tests/utils/vlm-reporter.ts']);
  reporter.push(['./tests/utils/vlm-html-reporter.ts']);
}
```

### 4. Set Environment Variables

Create or update `.env`:

```env
VLM_REVIEW=true
VLM_MAX_CALLS=10
VLM_CONFIDENCE_THRESHOLD=0.7
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

### 5. Add npm Scripts (Optional)

```json
{
  "test:visual": "VLM_REVIEW=false playwright test --project=visual",
  "test:visual:vlm": "VLM_REVIEW=true playwright test --project=visual"
}
```

### 6. Add to .gitignore

```
vlm-review-report.json
vlm-visual-report.html
```

## Cost Controls

- `VLM_MAX_CALLS` caps the number of GPT-4o API calls per test run (default: 10)
- VLM is only invoked when pixel comparison fails — passing tests never call the API
- Each call sends two images (baseline + actual) at `detail: high`
- Token usage is attached to the review result for cost tracking
- Use `VLM_REVIEW=false` (the default) to disable VLM entirely

## Governance Boundary

This skill owns:

- VLM reviewer implementation and integration patterns
- Prompt engineering for visual diff classification
- VLM confidence and cost control configuration
- VLM reporter output format

This skill delegates:

- When/whether to enable VLM in CI pipelines → `ui-test-governance`
- Core pixel-level screenshot strategy → `playwright-visual`
- Azure OpenAI resource provisioning → `playwright-azure`
- PR merge gating based on VLM results → `ui-test-governance`

## Definition Of Done

This skill is complete when:

1. VLM templates are installed in the target project's `tests/` directory
2. Environment variables are configured with valid Azure OpenAI credentials
3. The VLM reporter is conditionally loaded in `playwright.config.ts`
4. Running `VLM_REVIEW=true npx playwright test --project=visual` produces `vlm-review-report.json` and `vlm-visual-report.html`
5. Pixel-passing tests do not invoke VLM (zero API cost for green runs)
