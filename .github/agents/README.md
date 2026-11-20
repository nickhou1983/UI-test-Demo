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
| `code-review` | You want an independent read-only code audit | Perform 6-dimension code review and output `docs/CODE_REVIEW_REPORT.md` |

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

The intended collaboration flow combines **AI-driven exploration** with **deterministic Playwright execution**:

1. `ui-test` is the main entry point.
2. `ui-test-discovery` provides shared static + multi-channel runtime analysis (**Browser Use** MCP for live/authenticated tabs, **`playwright-cli`** for clean CLI sessions, and **Computer Use** MCP for OS-native dialogs/file pickers), stamped with a commit-aware `discovery-meta` header (`git-commit`, `exploration-channels`).
3. `ui-test-component`, `ui-test-e2e`, and `ui-test-visual` turn discovery contracts into deterministic Playwright tests with built-in engineering gates (storage isolation, runtime console/pageerror checks, semantic/a11y locators, POM/fixture reuse, and screenshot stabilization).
4. `ui-test-governance` handles full-pyramid CI gating (`lint` + `build` + `CT` + `E2E` + `Visual`), cross-OS baseline alignment (`darwin` vs `linux`), Azure Playwright Workspace, and VLM review policies.

In other words:

1. AI browser exploration (`playwright-explore` / `playwright-cli`) is used for **discovery and probing**, never as a brittle substitute for deterministic CI regression assertions.
2. Normal testing stays in the testing agents; governance stays out of the default path unless explicitly requested.
3. Discovery is reused when `git-commit` is fresh and incrementally updated when `src/` changes.

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

1. `playwright-ct` — isolated component mounting and prop/event testing
2. `playwright-e2e` — deterministic page, journey, side-effect, and I/O testing
3. `playwright-visual` — screenshot stabilization and pixel comparison
4. `playwright-config` — sole owner of Playwright config file generation
5. `playwright-azure` — Azure Playwright Workspace cloud execution and CI workflows
6. `playwright-vlm` — optional GPT-4o VLM semantic diff review and cost controls
7. `playwright-explore` — live URL and interactive DOM exploration (`Browser Use` MCP + `playwright-cli` + `Computer Use` MCP)
8. `playwright-cli` — CLI-driven browser sessions, snapshots, and recording
9. `code-review` — 6-dimension read-only code quality, security, and maintainability checklist

The split changes orchestration, not test semantics.

## Team Guidance

Use this rule of thumb:

1. if you want a single front door, use `ui-test`
2. if you already know the testing mode, go directly to the specialized agent
3. if the task mentions Azure, CI, gating, or VLM, use `ui-test-governance`
4. if the task says "analyze first", use `ui-test-discovery`