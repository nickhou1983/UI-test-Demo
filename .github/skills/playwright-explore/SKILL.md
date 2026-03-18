---
name: playwright-explore
description: >-
  Explore a live website when only a URL is available and generate reusable
  Playwright exploration output. Use when: user asks to inspect a site by URL,
  crawl routes without source code, map a live UI, probe interactions, or
  generate self-contained E2E and visual test drafts from browser exploration.
---

# Playwright Explore

## ⚠️ Report-Only Policy

This skill explores and reports **only**. It does NOT fix issues.

- When discovering site issues (broken links, accessibility problems, CSS bugs), report them as findings but do NOT modify any files
- Do NOT proactively offer to fix discovered issues — wait for the tester to explicitly request changes
- Generate tests that reflect the **current state** of the live site — do NOT adjust tests to avoid known issues
- Site exploration output is a read-only report for the tester to review

## Purpose

Explore a live website when **no source code is available** or when URL-first
reconnaissance is faster than reading the repo. This skill should stay
self-contained and rely on browser tooling, not repository internals.

It uses `playwright-cli` to:

- crawl reachable pages
- collect a compact site map
- probe interactive elements
- generate self-contained E2E and visual test drafts

## When to Use

- User says "test this site: {URL}" without opening a local project
- User provides a URL and asks to explore or analyze a website
- No `package.json` in the workspace (or workspace is empty / unrelated)
- User explicitly states they don't have the source code

## Minimal Input Contract

Only these inputs are required:

| Input | Required | Notes |
|-------|----------|-------|
| target URL | yes | entry point for exploration |
| crawl depth | no | default `3` |
| page limit | no | default `20` |
| auth context | no | cookies, credentials, or token if needed |
| output mode | no | report only, E2E draft, visual draft, or both |

## Prerequisites

- `playwright-cli` must be available
- No other packages or local project setup needed

## Output Contract

The output of this skill should be reusable outside the current repository.

Produce these artifacts conceptually, even if only some are requested:

1. site map
2. locator strategy map
3. interaction probe table
4. proposed user journeys
5. optional E2E draft
6. optional visual draft

## Workflow

### Phase 1: Initial Reconnaissance

```bash
# 1. Open the target URL
playwright-cli open {url}

# 2. Capture initial snapshot
playwright-cli snapshot

# 3. Check robots.txt (respect crawl rules)
playwright-cli goto {origin}/robots.txt
playwright-cli snapshot
playwright-cli go-back

# 4. Detect technology stack via DOM hints
playwright-cli eval "JSON.stringify({
  generator: document.querySelector('meta[name=generator]')?.content,
  react: !!document.querySelector('[data-reactroot]'),
  vue: !!document.querySelector('[data-v-]'),
  next: !!document.querySelector('#__next'),
  nuxt: !!document.querySelector('#__nuxt'),
  svelte: !!document.querySelector('[class*=svelte]'),
  angular: !!document.querySelector('[ng-version]')
})"
```

### Phase 2: Link Discovery & Site Map

```bash
# Extract all internal links
playwright-cli eval "JSON.stringify([...document.querySelectorAll('a[href]')].map(a => ({text: a.textContent.trim().substring(0,50), href: a.href})).filter(l => l.href.startsWith(location.origin)))"
```

Build site map table:

```
| # | Link Text | URL | Source Region | Visited |
|---|-----------|-----|---------------|---------|
| 1 | {text}    | {url} | navbar/body/footer | ✅/⬜ |
```

**Rules:**
- Exclude external links (different origin)
- Exclude `#`, `mailto:`, `tel:`, `javascript:` links
- Deduplicate by URL
- Max depth: 3 levels from entry URL
- Max pages: 20
- Prioritize primary navigation and high-value content routes over long-tail pages

### Phase 3: Page-by-Page Crawl

For each unvisited page:

```bash
playwright-cli goto {page_url}
playwright-cli snapshot
# Discover new links on this page
playwright-cli eval "JSON.stringify([...document.querySelectorAll('a[href]')].map(a => ({text: a.textContent.trim().substring(0,50), href: a.href})).filter(l => l.href.startsWith(location.origin)))"
```

Record per page:
- Title (`document.title`)
- Heading structure (h1, h2, h3 hierarchy)
- Navigation regions count
- Landmark elements (header, main, footer, aside)
- Forms and interactive elements

### Phase 4: Interactive Element Probing

For each interactive element found:

```bash
# Text input
playwright-cli fill {ref} "test input"
playwright-cli snapshot

# Button click
playwright-cli click {ref}
playwright-cli snapshot

# Select/dropdown
playwright-cli select {ref} {value}
playwright-cli snapshot

# Search bar
playwright-cli fill {search_ref} "search term"
playwright-cli press Enter
playwright-cli snapshot
```

Record before/after state changes in I/O probe table.

### Phase 4A: Minimal Classification

For each page, classify the dominant page purpose:

- landing / marketing
- listing / search
- detail
- form / workflow
- auth / gated
- mixed utility

This classification should drive which E2E and visual drafts are worth generating.

### Phase 5: Close Browser

```bash
playwright-cli close
```

## Output: Site Exploration Report

```markdown
## Site Exploration Report

**Target URL:** {url}
**Explored at:** {timestamp}
**Technology:** {detected or "Unknown"}
**Pages discovered:** {N}

### Site Map
| # | Page Title | URL | Links Found | Interactive Elements |
|---|-----------|-----|-------------|---------------------|

### Navigation Graph
| Source | Action | Target | State Transfer |
|--------|--------|--------|----------------|

### Locator Strategy Map
(per page — recommended locators for key elements)

### I/O Probe Results
(per page — interaction → observable change)

### Proposed User Journeys
(at least 3 journeys covering entry→depth, search/filter, cross-page)
```

## Reusable Draft Rules

- Generated tests must avoid project-specific imports
- Generated tests must rely on `baseURL` rather than hard-coded absolute URLs
- Prefer semantic locators and stable text over brittle CSS selectors
- Keep assertions focused on visible, user-facing outcomes

## Test Generation Templates

### E2E Test (URL-Only)

```typescript
import { test, expect } from '@playwright/test';

test.describe('{site_title} — E2E Tests', () => {

  test('homepage loads with expected content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/{title_pattern}/);
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('navigation to {page_name}', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '{link_text}' }).click();
    await expect(page).toHaveURL(/{url_pattern}/);
    await expect(page.getByRole('heading', { name: '{heading}' })).toBeVisible();
  });

  test('{journey_name}', async ({ page }) => {
    // Step 1: Entry
    await page.goto('/');
    // Step 2: Interaction
    await page.getByRole('{role}', { name: '{name}' }).click();
    // Step 3: Verification
    await expect(page.getByRole('{role}', { name: '{expected}' })).toBeVisible();
    // Continue journey steps...
  });
});
```

### Visual Test (URL-Only)

```typescript
import { test, expect } from '@playwright/test';

test.describe('{site_title} — Visual Regression', () => {

  test('{page_name} screenshot', async ({ page }) => {
    await page.goto('{path}');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('{page_name}.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
```

### Minimal Config (URL-Only)

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: '{discovered_base_url}',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'e2e',
      testMatch: /\.spec\.ts$/,
    },
    {
      name: 'visual',
      testMatch: /\.visual\.spec\.ts$/,
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
```

## Handoff Rules

- If source code later becomes available, hand off to `ui-test-discovery` or repo-based skills
- Do not invent component tests for a URL-only target
- Do not expand into CI or Azure governance from this skill

## Rules

1. **Same-origin only** — never follow links to external domains
2. **Respect robots.txt** — skip disallowed paths
3. **Max 3 levels deep** from entry URL
4. **Max 20 pages** — prioritize navigation links over body links
5. **500ms delay** between page navigations
6. **Component testing unavailable** — always inform user
7. All generated tests use `baseURL` from config — no hardcoded full URLs in test files
8. Use semantic locators exclusively (`getByRole`, `getByText`, `getByLabel`)
9. Generated tests must be runnable with `npx playwright test` immediately
10. If the site requires authentication, prompt the user for credentials or a pre-authenticated cookie/token

## Definition Of Done

This skill is complete when:

1. the reachable site structure is mapped to a practical depth
2. high-value interactions are probed and summarized
3. at least one realistic journey is documented
4. optional E2E or visual drafts are self-contained and repo-agnostic
