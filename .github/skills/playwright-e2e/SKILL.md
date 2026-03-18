---
name: playwright-e2e
description: >-
  Generate and run Playwright E2E (end-to-end) tests for any frontend project.
  Use when: user asks to run E2E tests, write E2E tests, test page navigation,
  test form interactions, test i18n switching, create user journey tests,
  or verify UI behavior across pages. Requires a shared E2E discovery contract
  and, when needed, runtime DOM exploration from ui-test or ui-test-discovery.
---

# Playwright E2E Testing

## ⚠️ Report-Only Policy

This skill generates and runs tests **only**. It does NOT fix failures.

- When tests fail, output a structured error report with root cause analysis and fix suggestions
- Do NOT automatically modify test files or source code to fix failures
- Do NOT proactively offer to apply fixes — wait for the tester to explicitly request changes
- When discovering application bugs during testing, report them as findings but do NOT modify source files
- Generate tests that reflect the **current state** of the application — do NOT pre-adjust tests to avoid expected failures

## Prerequisites

Before generating E2E tests, the following should be available from the shared
discovery workflow, usually produced by the ui-test or ui-test-discovery agent:
- **Project Analysis Report** — routes, components, i18n config
- **Component I/O Profiles** — per-component inputs, outputs, events, and sample data
- **User Journey Map** — prioritized user journeys with steps and state checkpoints
- **Locator Strategy Map** — per-page locator recommendations
- **I/O Probe Results** — interaction-to-output mapping for each page

## Input Contract

This skill should consume a structured E2E testing brief and should not recreate
full discovery inside the skill.

Minimum contract:

| Field | Required | Notes |
|-------|----------|-------|
| routes under test | yes | entry points and expected content |
| key interactions | yes | click, fill, switch, submit |
| locator recommendations | yes | preferred semantic locators |
| expected outputs | yes | URL, UI text, counts, state changes |
| user journeys | no | prioritized multi-step flows |
| i18n expectations | no | if language switching exists |

If route inventory or locators are unclear, stop and request discovery output rather than guessing unstable selectors.

## Interactive E2E (playwright-cli)

Use this mode for exploration, manual verification, and quick debugging.

Workflow:
1. Open browser: `playwright-cli open {dev_server_url}`
2. Navigate to each discovered route
3. Take snapshots to analyze DOM structure: `playwright-cli snapshot`
4. Interact with elements: `playwright-cli click`, `playwright-cli fill`, etc.
5. Verify state with eval: `playwright-cli eval "document.querySelector('{selector}').textContent"`
6. Take screenshots as evidence: `playwright-cli screenshot --filename={page}-{state}.png`
7. Each action auto-generates Playwright test code — collect these into test files

Guidelines:
- Test each route discovered during project discovery
- For forms: fill inputs, trigger submit, verify result
- For navigation: click links, verify URL changes
- For dynamic content: trigger state changes, verify updates
- For i18n: switch language, verify text changes
- Use `playwright-cli resize {width} {height}` to test responsive viewports

## Automated E2E Test Generation

Generate `tests/e2e/{page}.spec.ts` files based on discovered routes and interactions.

### Templates

**Page Load Test:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('{PageName} Page', () => {
  test('should load and display key content', async ({ page }) => {
    await page.goto('{route}');
    await expect(page.locator('{key_heading_locator}')).toBeVisible();
  });
});
```

**Navigation Test:**
```typescript
test('should navigate from {source} to {target}', async ({ page }) => {
  await page.goto('{source_route}');
  await page.getByRole('link', { name: '{link_text}' }).click();
  await expect(page).toHaveURL(/{target_url_pattern}/);
});
```

**Form Interaction Test:**
```typescript
test('should filter/search correctly', async ({ page }) => {
  await page.goto('{route}');
  await page.getByRole('textbox', { name: '{input_label}' }).fill('{test_value}');
  const results = page.locator('{result_item_selector}');
  await expect(results).toHaveCount({expected_count});
});
```

**i18n Test (if applicable):**
```typescript
test('should switch language', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '{lang_button}' }).click();
  await expect(page.locator('{text_element}')).toHaveText('{translated_text}');
});
```

**Full User Journey Test (multi-step with state verification):**
```typescript
test.describe('User Journey: {journey_name}', () => {
  test('{journey_description}', async ({ page }) => {
    // Step 1: Entry point
    await page.goto('{start_route}');
    await expect(page.locator('{entry_element}')).toBeVisible();

    // Step 2: First interaction
    await page.locator('{action_locator_1}').click();
    await expect(page).toHaveURL(/{step2_url_pattern}/);
    // Checkpoint: verify state transferred correctly
    await expect(page.locator('{state_indicator}')).toBeVisible();

    // Step 3: Continue deeper
    await page.locator('{action_locator_2}').click();
    await expect(page).toHaveURL(/{step3_url_pattern}/);
    await expect(page.locator('{detail_content}')).toBeVisible();

    // Step N: Verify end state or navigate back
    await page.locator('{back_locator}').click();
    await expect(page).toHaveURL(/{return_url_pattern}/);
  });
});
```

**Journey with state transfer (URL params / filter persistence):**
```typescript
test('journey: category filter from homepage to list', async ({ page }) => {
  // Start on homepage
  await page.goto('{home_route}');

  // Click category card — transfers state via URL param
  await page.locator('{category_card_locator}').click();
  await expect(page).toHaveURL(/{destinations_with_param}/);

  // Verify filter was auto-applied from URL param
  const results = page.locator('{result_card_selector}');
  await expect(results).toHaveCount({filtered_count});
  // All visible cards should match the category
  for (const card of await results.all()) {
    await expect(card.locator('{category_badge}')).toHaveText(/{category_text}/);
  }
});
```

**Journey with i18n switching mid-flow:**
```typescript
test('journey: browse destinations then switch language', async ({ page }) => {
  await page.goto('{start_route}');
  // Verify default language content
  await expect(page.locator('{heading}')).toHaveText('{default_lang_text}');

  // Navigate to a detail page
  await page.locator('{card_locator}').click();
  await expect(page.locator('{detail_heading}')).toBeVisible();

  // Switch language mid-journey
  await page.locator('{lang_toggle}').click();
  // Verify content switched on current page without navigation
  await expect(page.locator('{detail_heading}')).toHaveText('{alt_lang_text}');
  await expect(page.locator('{sidebar_content}')).toContainText(/{alt_lang_pattern}/);
});
```

**Backward navigation journey:**
```typescript
test('journey: navigate deep then return via breadcrumb', async ({ page }) => {
  await page.goto('{list_route}');
  await page.locator('{item_locator}').click();
  await expect(page).toHaveURL(/{detail_url}/);

  // Use breadcrumb to go back
  await page.locator('{breadcrumb_link}').click();
  await expect(page).toHaveURL(/{list_url}/);
  // Verify list page is intact
  await expect(page.locator('{list_content}')).toBeVisible();
});
```

### Test Generation Rules

- Use semantic locators: `getByRole()`, `getByText()`, `getByLabel()` over CSS selectors
- **Consult the Locator Strategy Map** to choose the correct locator for each element
- When a naive locator matches multiple elements (as identified in B+3), use scoping: `page.getByRole('main').getByRole(...)`, `page.locator('nav').first().getByRole(...)`, or `{ exact: true }`
- For elements inside landmark regions (`<main>`, `<header>`, `<footer>`), scope the locator to the landmark
- Each page gets its own spec file
- Use `test.describe()` to group related tests
- Prefer `await expect().toBeVisible()` over raw assertions
- Add i18n switching test if i18n is detected

### Contract Discipline Rules

- Do not invent routes not present in the input contract
- Do not use placeholder values when discovery supplied real examples
- Do not degrade to brittle CSS selectors unless the locator strategy explicitly requires it
- Fail fast when the journey map is missing but the request is journey-heavy

### Journey Test Generation Rules

Journey tests are generated from the **Journey Map**. They live in `tests/e2e/user-journey.spec.ts`.

- **Each journey from the discovery output becomes a `test()` block** wrapped in `test.describe('User Journeys', ...)`
- **Critical priority journeys** must always be generated; Medium priority can be skipped if the user requests minimal tests
- Each journey step must have an **intermediate assertion** (checkpoint) — never chain multiple navigations without verifying state
- When a journey includes **state transfer via URL params**, assert the param is present in the URL AND the UI reflects the transferred state (e.g., filter is pre-applied)
- When a journey includes **i18n switching**, assert at least 2 text elements changed language (not just one)
- For **backward navigation** steps, verify the return page still shows correct content (no stale state)
- Journey tests should use **data from PRD / type resolution** for realistic test values, not placeholders
- Include a **// Journey: {name} [Priority: {level}]** comment at the top of each test for traceability back to the discovery output
- If the Journey Coverage Matrix shows uncovered routes or actions, flag them as TODO comments in the test file

### I/O-Aware Test Generation Rules

- **Every interactive element** from the I/O Probe Results must be covered by at least one test
- For each form input: test with representative values from the discovery sample data, and assert the observable output change recorded in the I/O probe results
- For **filter/search** components: test that input changes reduce or modify the visible result set (assert count and/or content)
- For **navigation triggers** (buttons/links that change URL): assert both the click action AND the target page content
- For **state toggles** (language switcher, theme toggle, sort order): assert the before→after visible difference
- For **"no results" states**: test with a value known to yield zero results and assert the empty state message
- Use **resolved type information** from discovery to pick meaningful test values (e.g., use actual category enum values, not arbitrary strings)
- Test **edge cases** identified through type resolution: optional props absent, empty arrays, boundary values for numeric fields

## Handoff Boundary

This skill owns E2E test generation and execution patterns.

It does not own:

- initial route discovery
- component-level prop analysis
- Azure governance policy
- visual baseline authority

Use `ui-test-discovery` when inputs are incomplete and `playwright-azure` or `ui-test-governance` when the request is cloud or CI oriented.

## Definition Of Done

This skill is complete when:

1. the requested routes and interactions are covered with stable assertions
2. journeys include intermediate checkpoints instead of only final assertions
3. i18n, search, and filter flows are covered only when present in the contract
4. missing discovery data is surfaced explicitly rather than guessed

### Execution Commands

| Action | Command |
|--------|---------|
| Run all E2E tests | `npx playwright test --project=e2e` |
| Run specific test file | `npx playwright test tests/e2e/{file}` |
| Run tests matching name | `npx playwright test --project=e2e -g "{pattern}"` |
| Run in headed mode | `npx playwright test --project=e2e --headed` |
| Run in debug mode | `npx playwright test --project=e2e --debug` |
| Run in UI mode | `npx playwright test --project=e2e --ui` |
| View HTML report | `npx playwright show-report` |
