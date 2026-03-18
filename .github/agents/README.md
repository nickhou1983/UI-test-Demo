# UI Test Agents Guide

This folder contains the split UI testing agents for this repository.

The goal of this split is simple:

1. keep the existing testing logic and skills unchanged
2. make the default entry lighter
3. separate day-to-day testing from governance-heavy workflows

## Agent Overview

| Agent | Use when | Main responsibility |
| --- | --- | --- |
| `ui-test` | You want one default entry | Route the request to the correct specialized agent |
| `ui-test-discovery` | You want analysis before writing tests | Shared discovery, environment checks, routes, components, locators, journeys |
| `ui-test-component` | You want component tests / CT | Generate and run Playwright Component Tests |
| `ui-test-e2e` | You want E2E / user journey tests | Generate and run Playwright E2E tests |
| `ui-test-visual` | You want screenshot baselines or visual regression | Generate and run Playwright visual tests |
| `ui-test-governance` | You want Azure / CI / VLM / visual gating guidance | Handle advanced governance and cloud execution concerns |

## Recommended Usage

### Default entry

Use `ui-test` when:

1. you are not sure which testing path is correct
2. you want the agent to classify the request first
3. you want a lightweight default workflow

### Go direct when the request is already clear

Use `ui-test-component` when:

1. the request is about component rendering
2. the request is about props or event callbacks
3. the request is about Playwright CT specifically

Use `ui-test-e2e` when:

1. the request is about page navigation
2. the request is about forms, search, filters, or cross-page flows
3. the request is about user journeys

Use `ui-test-visual` when:

1. the request is about screenshot baselines
2. the request is about visual regression
3. the request is about responsive or i18n screenshot coverage

Use `ui-test-governance` when:

1. the request is about Azure Playwright Workspace
2. the request is about CI/CD integration
3. the request is about PR visual gating
4. the request is about VLM-enhanced visual review

Use `ui-test-discovery` when:

1. you want the app analyzed before any test is generated
2. you want route or component inventory first
3. you want locator or journey analysis before implementation

## Collaboration Model

The intended collaboration flow is:

1. `ui-test` is the main entry point
2. `ui-test-discovery` provides shared analysis when needed
3. `ui-test-component`, `ui-test-e2e`, and `ui-test-visual` handle normal testing work
4. `ui-test-governance` is only used for advanced cloud / CI / VLM concerns

In other words:

1. normal testing should stay in the testing agents
2. governance should stay out of the default path unless explicitly requested
3. discovery should be reused, not duplicated

## Practical Flows

### Flow 1: Simple component test

1. Start with `ui-test` or go directly to `ui-test-component`
2. If needed, reuse `ui-test-discovery` for component context
3. Generate CT specs
4. Run CT locally

### Flow 2: E2E workflow

1. Start with `ui-test` or go directly to `ui-test-e2e`
2. Reuse `ui-test-discovery` for routes, locators, and journeys
3. Generate E2E specs
4. Run E2E tests

### Flow 3: Visual regression workflow

1. Start with `ui-test` or go directly to `ui-test-visual`
2. Reuse `ui-test-discovery` for page inventory and variants
3. Generate baselines or run screenshot comparison
4. Only involve `ui-test-governance` if Azure, CI, or VLM is part of the request

### Flow 4: Governance-heavy workflow

1. Start with `ui-test-governance`
2. Validate Azure / CI / VLM prerequisites
3. Reuse testing agents only if the user wants execution to continue after governance analysis

## What Did Not Change

This split does not change the existing testing logic.

The implementation logic still lives in the existing skills:

1. `playwright-ct`
2. `playwright-e2e`
3. `playwright-visual`
4. `playwright-config`
5. `playwright-azure`

The split changes orchestration, not test semantics.

## Team Guidance

Use this rule of thumb:

1. if you want a single front door, use `ui-test`
2. if you already know the testing mode, go directly to the specialized agent
3. if the task mentions Azure, CI, gating, or VLM, use `ui-test-governance`
4. if the task says "analyze first", use `ui-test-discovery`