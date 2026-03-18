---
name: playwright-ct
description: >-
  Generate and run Playwright Component Tests (CT) for isolated UI components.
  Use when: user asks for component testing, unit testing UI components,
  testing component props, testing component events, mounting components
  in isolation, or testing React/Vue/Svelte/Solid components with Playwright.
  Requires project discovery (Module B) to be completed first by the ui-test agent.
---

# Playwright Component Testing

## ⚠️ Report-Only Policy

This skill generates and runs tests **only**. It does NOT fix failures.

- When tests fail, output a structured error report with root cause analysis and fix suggestions
- Do NOT automatically modify test files or source code to fix failures
- Do NOT proactively offer to apply fixes — wait for the tester to explicitly request changes
- When discovering component bugs during testing (wrong rendering, broken events), report them as findings but do NOT modify source files
- Generate tests that reflect the **current state** of the components — do NOT pre-adjust tests to avoid expected failures

Uses Playwright Component Testing to mount and test individual components in isolation.

## Prerequisites

- **Project Analysis Report** (Module B) — components, props, events, dependencies
- **Component I/O Profiles** (Module B4b) — resolved types, sample values, event payloads
- Component testing package installed (`@playwright/experimental-ct-react`, etc.)
- `playwright-ct.config.ts` must exist (generate via `playwright-config` skill if missing)

> **Note:** Component tests always run locally. They CANNOT run on Azure Playwright Workspace
> because CT requires a local Vite dev server to mount components.

## CT Configuration

Generate `playwright-ct.config.ts` based on detected framework:

**React + Vite:**
```typescript
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './tests/component',
  use: {
    ...devices['Desktop Chrome'],
    ctViteConfig: {
      // Reuse project's Vite/PostCSS config for styles
    },
  },
});
```

**Vue + Vite:**
```typescript
import { defineConfig, devices } from '@playwright/experimental-ct-vue';

export default defineConfig({
  testDir: './tests/component',
  use: {
    ...devices['Desktop Chrome'],
    ctViteConfig: {},
  },
});
```

Adapt similarly for Svelte and Solid.

**Important:** If the project uses Tailwind CSS or PostCSS, ensure `ctViteConfig` includes the CSS config so styles render correctly in component tests.

## Test Fixtures

Generate `tests/fixtures/test-utils.ts` with provider wrappers:

- If using React Router → `MemoryRouter` wrapper
- If using i18n → `I18nextProvider` / `createI18n` wrapper
- If using state management → Context/Store provider wrapper
- Export a combined `TestWrapper` component that includes all needed providers

## Test Generation

For each component discovered in Module B, generate a `tests/component/{Component}.spec.tsx`:

**Rendering test:**
```typescript
import { test, expect } from '@playwright/experimental-ct-{framework}';
import { ComponentName } from '../../src/components/ComponentName';

test('{ComponentName} renders correctly', async ({ mount }) => {
  const component = await mount(<ComponentName {...defaultProps} />);
  await expect(component).toBeVisible();
});
```

**Props test:**
```typescript
test('{ComponentName} displays {prop} correctly', async ({ mount }) => {
  const component = await mount(<ComponentName prop={testValue} />);
  await expect(component.locator('{element}')).toHaveText('{expected}');
});
```

**Event test:**
```typescript
test('{ComponentName} handles {event}', async ({ mount }) => {
  const messages: string[] = [];
  const component = await mount(
    <ComponentName onEvent={(val) => messages.push(val)} />
  );
  await component.locator('{trigger}').click();
  expect(messages).toHaveLength(1);
});
```

## Generation Rules

- One spec file per component
- Test all required props with representative values **from B4b Component I/O Profile sample data**
- Test event handlers with callback tracking — **assert payload type matches B4b event payload definition**
- Wrap in providers if component uses Router/i18n/Context
- Test conditional rendering branches
- For components with complex state, test key state transitions

### I/O Coverage Rules

- **Every Input (Prop)** in the Component I/O Profile must be tested with at least one representative value from B4a deep type resolution
- **Every Output (Rendered)** must have a corresponding assertion — if a prop should produce visible text/image/list, assert it
- **Every Output (Event)** must be tested — mount with a spy callback, trigger the interaction, assert the callback was called with the correct payload type
- For **union type / enum props** (e.g., `category: 'beach' | 'mountain' | 'city'`), test at least 2 distinct values and verify the rendered difference
- For **optional props**, test both with and without the prop to verify default behavior
- For **array props** (e.g., `items: Destination[]`), test with empty array, single item, and multiple items
- Use the **resolved type fields** from B4a to construct realistic mock data instead of placeholder strings like `'test'` or `'foo'`

## Execution Commands

| Action | Command |
|--------|---------|
| Run all component tests | `npx playwright test -c playwright-ct.config.ts` |
| Run specific component | `npx playwright test -c playwright-ct.config.ts tests/component/{Component}.spec.tsx` |
| Run in headed mode | `npx playwright test -c playwright-ct.config.ts --headed` |
| Run in debug mode | `npx playwright test -c playwright-ct.config.ts --debug` |
