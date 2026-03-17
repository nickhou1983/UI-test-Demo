---
name: playwright-e2e
description: >-
  Generate and run Playwright E2E (end-to-end) tests for any frontend project.
  Use when: user asks to run E2E tests, write E2E tests, test page navigation,
  test form interactions, test i18n switching, create user journey tests,
  or verify UI behavior across pages. Requires project discovery (Module B)
  and DOM exploration (Module B+) to be completed first by the ui-test agent.
---

# Playwright E2E Testing

## Prerequisites

Before generating E2E tests, the following must be available from the ui-test agent:
- **Project Analysis Report** (Module B) — routes, components, i18n config
- **Component I/O Profiles** (Module B4b) — per-component inputs, outputs, events, and sample data
- **User Journey Map** (Module B9d) — prioritized user journeys with steps and state checkpoints
- **Locator Strategy Map** (Module B+4) — per-page locator recommendations
- **I/O Probe Results** (Module B+3a) — interaction-to-output mapping for each page

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
- Test each route discovered in Module B
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
- **Consult the Locator Strategy Map (Module B+4)** to choose the correct locator for each element
- When a naive locator matches multiple elements (as identified in B+3), use scoping: `page.getByRole('main').getByRole(...)`, `page.locator('nav').first().getByRole(...)`, or `{ exact: true }`
- For elements inside landmark regions (`<main>`, `<header>`, `<footer>`), scope the locator to the landmark
- Each page gets its own spec file
- Use `test.describe()` to group related tests
- Prefer `await expect().toBeVisible()` over raw assertions
- Add i18n switching test if i18n is detected

### Journey Test Generation Rules

Journey tests are generated from the **Journey Map (Module B9d)**. They live in `tests/e2e/user-journey.spec.ts`.

- **Each journey from B9d becomes a `test()` block** wrapped in `test.describe('User Journeys', ...)`
- **Critical priority journeys** must always be generated; Medium priority can be skipped if the user requests minimal tests
- Each journey step must have an **intermediate assertion** (checkpoint) — never chain multiple navigations without verifying state
- When a journey includes **state transfer via URL params**, assert the param is present in the URL AND the UI reflects the transferred state (e.g., filter is pre-applied)
- When a journey includes **i18n switching**, assert at least 2 text elements changed language (not just one)
- For **backward navigation** steps, verify the return page still shows correct content (no stale state)
- Journey tests should use **data from PRD / B4a type resolution** for realistic test values, not placeholders
- Include a **// Journey: {name} [Priority: {level}]** comment at the top of each test for traceability back to B9d
- If the Journey Coverage Matrix (B9d) shows uncovered routes or actions, flag them as TODO comments in the test file

### I/O-Aware Test Generation Rules

- **Every interactive element** from the I/O Probe Results (B+3a) must be covered by at least one test
- For each form input: test with representative values from B4b sample data, and assert the observable output change recorded in B+3a
- For **filter/search** components: test that input changes reduce or modify the visible result set (assert count and/or content)
- For **navigation triggers** (buttons/links that change URL): assert both the click action AND the target page content
- For **state toggles** (language switcher, theme toggle, sort order): assert the before→after visible difference
- For **"no results" states**: test with a value known to yield zero results and assert the empty state message
- Use **resolved type information** from B4a to pick meaningful test values (e.g., use actual category enum values, not arbitrary strings)
- Test **edge cases** identified through type resolution: optional props absent, empty arrays, boundary values for numeric fields

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
