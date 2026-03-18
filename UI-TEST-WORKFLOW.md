# TravelVista UI 自动化测试工作流 — 架构说明文档

> 版本：1.0 | 更新日期：2026-03-18

---

## 目录

1. [项目概览](#1-项目概览)
2. [测试分层架构](#2-测试分层架构)
3. [各阶段数据流：输入 → 处理 → 输出](#3-各阶段数据流输入--处理--输出)
4. [执行环境对比](#4-执行环境对比)
5. [CI/CD 流水线](#5-cicd-流水线)
6. [测试覆盖矩阵](#6-测试覆盖矩阵)
7. [关键配置清单](#7-关键配置清单)
8. [工具链依赖图](#8-工具链依赖图)

---

## 1. 项目概览

### 1.1 被测系统

**TravelVista** 是一个旅行目的地发现平台，使用以下技术栈构建：

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | UI 框架 |
| TypeScript | 5.9 | 类型安全 |
| Vite | 8.0 | 构建工具 & 开发服务器 |
| Tailwind CSS | 4.2 | 样式系统 |
| React Router | 7.13 | 客户端路由 |
| i18next | 25.8 | 国际化（中文/英文） |

### 1.2 路由结构

```
/ (Layout: Navbar + Outlet + Footer)
├── /                    → HomePage        — 首页：Hero搜索 + 热门目的地 + 旅行主题 + 评价轮播
├── /destinations        → DestinationsPage — 12个目的地卡片 + 搜索/地区/类型筛选
├── /destinations/:id    → DestinationDetailPage — 目的地详情（目前仅巴厘岛完整数据）
└── /about               → AboutPage       — 使命、价值观、团队、联系方式
```

### 1.3 数据规模

- **12 个目的地** 横跨 **6 个地区**（亚洲、欧洲、北美、南美、非洲、大洋洲）和 **4 个类型**（海滩、山脉、城市、文化）
- **2 种语言**：中文（默认）/ 英文（运行时切换），共 100+ 个 i18n 翻译键
- **3 条评价** 用于首页轮播，**4 名团队成员** 用于关于页

### 1.4 部署地址

部署至 **GitHub Pages**，基础路径为 `/UI-test-Demo/`。

线上地址：`https://nickhou1983.github.io/UI-test-Demo/`

---

## 2. 测试分层架构

本项目采用 **三层测试金字塔** 策略，从底层到顶层覆盖度递减、集成度递增：

```
          ┌──────────────────┐
          │  Visual Regression│  ← 1 spec / 4 screenshots
          │  (像素级视觉比对)   │
          ├──────────────────┤
          │   E2E 端到端测试   │  ← 6 spec files
          │  (完整页面 + 用户旅程)│
          ├──────────────────┤
          │  Component Testing │  ← 6 spec files
          │  (隔离组件单元测试)  │
          └──────────────────┘
```

### 2.1 Layer 1 — 组件测试 (Component Testing)

| 属性 | 说明 |
|------|------|
| **工具** | `@playwright/experimental-ct-react` v1.58 |
| **配置文件** | `playwright-ct.config.ts` |
| **运行命令** | `npm run test:ct` |
| **测试目录** | `tests/component/` |
| **入口文件** | `playwright/index.html` + `playwright/index.tsx` |
| **浏览器** | Desktop Chrome |

**核心机制：** Playwright CT 使用内置的 Vite 服务器加载组件，通过 `mount()` API 将单个 React 组件挂载到隔离的 DOM 环境中。

**入口文件 `playwright/index.tsx` 的作用：**
```typescript
import '../src/index.css';    // 加载 Tailwind CSS 全局样式
import '../src/i18n';          // 初始化 i18next 国际化
```

**测试夹具 `tests/fixtures/test-utils.tsx`：**
```typescript
export function TestWrapper({ children, initialEntries = ['/'] }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </I18nextProvider>
  );
}
```
> `TestWrapper` 为每个组件测试提供 **路由上下文**（MemoryRouter）和 **i18n 上下文**（I18nextProvider），确保组件在隔离环境中也能正常渲染。

**6 个组件测试规格：**

| 测试文件 | 被测组件 | 测试覆盖点 |
|---------|---------|-----------|
| `Navbar.spec.tsx` | Navbar | 品牌名、3个导航链接、语言切换按钮、active 状态高亮、移动端汉堡菜单、Logo 链接 |
| `SearchBar.spec.tsx` | SearchBar | 默认/自定义 placeholder、值显示与输入、onChange 回调触发 |
| `FilterBar.spec.tsx` | FilterBar | 搜索框 + 2 个下拉菜单组合、6 地区 / 4 类型选项、三个 onChange 回调、预选值显示 |
| `Carousel.spec.tsx` | Carousel | 全部轮播项渲染、导航圆点数量、点击切换、自动播放（默认 4000ms）、首个圆点高亮、CSS transform 变化 |
| `DestinationCard.spec.tsx` | DestinationCard | 名称/国家（i18n）、类型徽章、评分数字、星级渲染（实心/空心）、链接地址 |
| `Footer.spec.tsx` | Footer | 品牌名、3 个导航链接、社交媒体区域、版权文字 |

### 2.2 Layer 2 — E2E 端到端测试 (End-to-End Testing)

| 属性 | 说明 |
|------|------|
| **工具** | `@playwright/test` v1.58 |
| **配置文件** | `playwright.config.ts` → project `e2e` |
| **运行命令** | `npm run test:e2e` |
| **测试目录** | `tests/e2e/` |
| **Web Server** | Vite dev server（自动启动） |
| **浏览器** | Desktop Chrome |

**核心机制：** Playwright 启动真实浏览器，通过 `webServer` 配置自动启动 `npm run dev`（Vite 开发服务器），访问 `http://localhost:5173/UI-test-Demo/`，在完整应用环境中模拟真实用户交互。

**6 个 E2E 测试规格：**

| 测试文件 | 测试页面 | 测试覆盖点 |
|---------|---------|-----------|
| `home.spec.ts` | HomePage | Hero 区域标题&搜索、热门目的地展示与筛选、旅行主题区域、评价轮播、"查看全部"导航 |
| `destinations.spec.ts` | DestinationsPage | 12 个目的地展示、关键字搜索、地区筛选（6 地区）、类型筛选（4 类型）、URL 查询参数初始化、卡片导航 |
| `destination-detail.spec.ts` | DetailPage | 名称/国家显示、面包屑导航、图片画廊、景点区域、侧边栏评分&信息、推荐目的地（3 张卡片）、404 页面 |
| `about.spec.ts` | AboutPage | 页面标题、使命区域、3 张价值观卡片、4 名团队成员、联系区域含邮箱 |
| `navigation.spec.ts` | 跨页面导航 | Navbar 链接导航、Logo 返回首页、中英文切换（EN ↔ 中文）、语言切换跨页持久化、Footer 在所有页面出现 |
| `user-journey.spec.ts` | 完整用户旅程 | 首页 → 目的地列表 → 筛选 → 详情页 → 面包屑返回 → 关于页 → Logo 回首页；主题分类导航（从首页主题卡进入筛选后列表） |

### 2.3 Layer 3 — 视觉回归测试 (Visual Regression Testing)

| 属性 | 说明 |
|------|------|
| **工具** | `@playwright/test` + 可选 VLM 语义复核 |
| **配置文件** | `playwright.config.ts` → project `visual` |
| **运行命令** | `npm run test:visual` |
| **测试文件** | `tests/visual/pages.visual.spec.ts` |
| **基线快照** | `tests/visual/pages.visual.spec.ts-snapshots/` |
| **比对阈值** | `maxDiffPixelRatio: 0.01`（允许 1% 像素差异） |

**核心机制：** 截取页面当前截图，与基线快照逐像素比对。超过阈值的差异将导致测试失败。首次运行时生成基线截图，后续运行与基线对比。

**8 个页面截图测试用例：**

| 截图名称 | 页面 | 等待策略 | 截图范围 | 特殊配置 |
|---------|------|---------|---------|---------|
| `home-page.png` | `/` | `networkidle` + 验证首页主标题 | 整页（`fullPage: true`） | `animations: 'disabled'` |
| `destinations-page.png` | `/destinations` | `networkidle` + 验证页面标题 | 整页（`fullPage: true`） | `animations: 'disabled'` |
| `about-page.png` | `/about` | `networkidle` + 验证页面标题 | 整页（`fullPage: true`） | `animations: 'disabled'` |
| `destination-detail-bali.png` | `/destinations/bali` | `networkidle` + 验证"巴厘岛"标题 | 整页（`fullPage: true`） | `animations: 'disabled'` |
| `favorites-page.png` | `/favorites` | `networkidle` + 注入收藏数据并验证卡片 | 整页（`fullPage: true`） | `animations: 'disabled'` |
| `trip-planner-page.png` | `/trips` | `networkidle` + 注入行程数据并验证行程卡片 | 整页（`fullPage: true`） | `animations: 'disabled'` |
| `trip-edit-page.png` | `/trips/visual-trip` | `networkidle` + 验证行程编辑表单 | 整页（`fullPage: true`） | `animations: 'disabled'` |
| `not-found-page.png` | `/missing-route` | `networkidle` + 验证 404 标题 | 整页（`fullPage: true`） | `animations: 'disabled'` |

> **关键设计决策：** 所有截图都禁用 CSS 动画（`animations: 'disabled'`），确保截图稳定性，避免动画帧差异导致的误报。

---

## 3. 各阶段数据流：输入 → 处理 → 输出

### Stage 1：源码准备

```
┌─────────────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│         INPUT           │     │     PROCESS      │     │         OUTPUT           │
│                         │     │                  │     │                          │
│ • src/**/*.tsx (组件)    │     │  Vite Dev Server │     │ 运行中的 Web 应用          │
│ • src/i18n/*.json (翻译) │ ──→ │  (HMR + React)   │ ──→ │ http://localhost:5173     │
│ • src/types/index.ts    │     │                  │     │ /UI-test-Demo/            │
│ • public/images/** (资源)│     │  或 vite build   │     │ 或 dist/ 静态产物          │
│ • index.html (入口)      │     │                  │     │                          │
└─────────────────────────┘     └──────────────────┘     └──────────────────────────┘
```

| 字段 | 说明 |
|------|------|
| **Input** | TypeScript 源码（4 页面 + 7 组件）、i18n 翻译文件（zh.json / en.json，100+ 键）、类型定义（5 个 interface）、静态资源（目的地/分类/英雄图片）|
| **Process** | Vite 开发服务器启动（dev 模式）或 `tsc -b && vite build`（生产构建），React Hot Module Replacement，Tailwind CSS 通过 PostCSS 处理 |
| **Output** | 开发环境：`localhost:5173/UI-test-Demo/` 运行中的应用；生产构建：`dist/` 目录的静态 HTML/JS/CSS |

### Stage 2：组件测试

```
┌─────────────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│         INPUT           │     │     PROCESS      │     │         OUTPUT           │
│                         │     │                  │     │                          │
│ • src/components/*.tsx   │     │ Playwright CT    │     │ ✅/❌ 逐测试用例结果      │
│ • src/types/index.ts    │     │ mount() + assert │     │ HTML 测试报告              │
│ • tests/fixtures/       │ ──→ │                  │ ──→ │ (playwright-report/)      │
│   test-utils.tsx        │     │ 内置 Vite 加载器  │     │                          │
│ • playwright/index.tsx  │     │ Desktop Chrome   │     │                          │
│ • playwright-ct.config  │     │                  │     │                          │
└─────────────────────────┘     └──────────────────┘     └──────────────────────────┘
```

| 字段 | 说明 |
|------|------|
| **Input** | 6 个 React 组件源码、`Destination` / `Review` 等类型定义（用于构造测试 props）、TestWrapper 夹具（提供 Router + i18n 上下文）、CT 入口文件（加载全局 CSS + i18n 初始化）、`playwright-ct.config.ts` |
| **Process** | Playwright CT 通过内置 Vite 服务器加载组件 → `mount()` 将组件挂载到隔离 DOM → 执行点击、填充、选择等交互操作 → 使用 `expect()` 断言可见性、文本、CSS 类、属性值、回调触发 |
| **Output** | 每个组件的功能验证结果（pass/fail）、HTML 格式测试报告 |

### Stage 3：E2E 端到端测试

```
┌─────────────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│         INPUT           │     │     PROCESS      │     │         OUTPUT           │
│                         │     │                  │     │                          │
│ • 运行中的 Web 应用       │     │ Playwright E2E   │     │ ✅/❌ 逐测试用例结果      │
│   (webServer 自动启动)   │     │ 浏览器自动化操作   │     │ trace 文件 (首次重试时)    │
│ • tests/e2e/*.spec.ts   │ ──→ │ goto → interact  │ ──→ │ 失败截图 (only-on-failure)│
│ • playwright.config.ts  │     │  → assert        │     │ HTML 测试报告              │
│   (project: e2e)        │     │ Desktop Chrome   │     │ (playwright-report/)      │
└─────────────────────────┘     └──────────────────┘     └──────────────────────────┘
```

| 字段 | 说明 |
|------|------|
| **Input** | 完整运行的 Web 应用（Playwright 通过 `webServer` 配置自动启动 Vite dev server）、6 个 E2E 测试脚本、`playwright.config.ts` 中 `e2e` project 的设备和基础 URL 配置 |
| **Process** | 启动 Chromium 浏览器实例 → `page.goto()` 访问各路由 → 执行用户操作（点击导航、填充搜索、选择筛选器、切换语言）→ `expect()` 断言页面内容、URL、元素可见性 |
| **Output** | 路由级功能验证结果、Trace 文件（首次重试时自动捕获，包含操作录像 + 网络请求 + DOM 快照）、失败截图（仅在测试失败时捕获）、HTML 格式测试报告 |

### Stage 4：视觉回归测试

```
┌─────────────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│         INPUT           │     │     PROCESS      │     │         OUTPUT           │
│                         │     │                  │     │                          │
│ • 运行中的 Web 应用       │     │ Playwright Visual│     │ ✅/❌ 截图比对结果        │
│ • 基线截图 (snapshots/)  │     │ screenshot()     │     │ 新截图 / 差异截图          │
│ • maxDiffPixelRatio:    │ ──→ │ → pixel diff     │ ──→ │ HTML 报告 + 差异截图      │
│   0.01 (1% 阈值)        │     │ → threshold check│     │ HTML 测试报告              │
│ • playwright.config.ts  │     │ animations: off  │     │ (playwright-report/)      │
│   (project: visual)     │     │                  │     │                          │
└─────────────────────────┘     └──────────────────┘     └──────────────────────────┘
```

| 字段 | 说明 |
|------|------|
| **Input** | 运行中的 Web 应用、已有的基线截图（`tests/visual/pages.visual.spec.ts-snapshots/` 目录）、比对阈值配置（`maxDiffPixelRatio: 0.01`）、`visual` project 配置 |
| **Process** | 导航到目标页面 → 等待 `networkidle` → 验证关键内容已渲染 → 禁用动画后截图 → 与基线逐像素比对 → 判断差异是否超过 1% 阈值 |
| **Output** | 视觉比对结果（pass：差异在阈值内 / fail：差异超阈值）、新生成或更新的截图、差异可视化图（标注变化区域）、HTML 报告与 `test-results/` 产物 |

### Stage 5：Azure 云端执行

```
┌─────────────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│         INPUT           │     │     PROCESS      │     │         OUTPUT           │
│                         │     │                  │     │                          │
│ • 全部本地测试代码        │     │ Azure Playwright │     │ 云端测试结果               │
│ • playwright.service.   │     │ Workspace        │     │ Azure Portal 仪表板       │
│   config.ts             │ ──→ │ Linux Chromium   │ ──→ │ HTML 报告                 │
│ • DefaultAzureCredential│     │ 10 workers 并行   │     │ Azure Portal + HTML 报告  │
│ • PLAYWRIGHT_SERVICE_URL│     │ exposeNetwork:   │     │ @azure/playwright 报告     │
│                         │     │ '<loopback>'     │     │                          │
└─────────────────────────┘     └──────────────────┘     └──────────────────────────┘
```

| 字段 | 说明 |
|------|------|
| **Input** | 本地测试代码 + `playwright.service.config.ts`（继承主配置并叠加 Azure 覆盖层）、Microsoft Entra ID 认证（`DefaultAzureCredential`）、Azure Playwright Workspace 服务 URL |
| **Process** | Playwright 通过 `@azure/playwright` SDK 连接到 Azure 云端 → 使用 Linux OS 的 Chromium 浏览器 → 最多 10 个 worker 并行执行 → `exposeNetwork: '<loopback>'` 让云端浏览器能访问本地 webServer → 2 次自动重试（CI 环境） |
| **Output** | 与本地相同的测试结果 + Azure Playwright Portal 仪表板（趋势图、trace 查看器、flaky test 检测）+ 两种格式报告（HTML / Azure） |

### Stage 6：CI 集成（GitHub Actions）

```
┌─────────────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│         INPUT           │     │     PROCESS      │     │         OUTPUT           │
│                         │     │                  │     │                          │
│ • Git push/PR 事件       │     │ GitHub Actions   │     │ CI 状态 (pass/fail)       │
│ • GitHub Secrets:       │     │ playwright-      │     │ Artifacts (14天保留):     │
│   PLAYWRIGHT_SERVICE_URL│ ──→ │ azure.yml        │ ──→ │  • playwright-report/    │
│   PLAYWRIGHT_SERVICE_   │     │                  │     │  • test-results/         │
│   ACCESS_TOKEN          │     │ ubuntu-latest    │     │ HTML 报告 + test-results  │
│                         │     │ Node 22          │     │ CI 通过/失败状态           │
└─────────────────────────┘     └──────────────────┘     └──────────────────────────┘
```

| 字段 | 说明 |
|------|------|
| **Input** | Git 事件（push 到 main / PR 到 main / 手动触发 workflow_dispatch）、2 个 GitHub Secrets（Azure 服务 URL、Azure 访问令牌）|
| **Process** | `actions/checkout@v4` → `actions/setup-node@v4`（Node 22）→ `npm ci` → `npx playwright install --with-deps chromium` → E2E 测试（Azure PT）→ 视觉回归测试（Azure PT，失败即阻断）→ 上传 artifacts |
| **Output** | GitHub CI 检查状态（绿色/红色）、`playwright-report/` 产物（HTML 报告，14 天保留）、`test-results/` 产物（trace + 截图，14 天保留） |

### Stage 7：部署

```
┌─────────────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│         INPUT           │     │     PROCESS      │     │         OUTPUT           │
│                         │     │                  │     │                          │
│ • main 分支代码          │     │ GitHub Actions   │     │ GitHub Pages 线上应用     │
│   (push to main 触发)    │ ──→ │ deploy.yml       │ ──→ │ https://nickhou1983.     │
│                         │     │ npm run build    │     │ github.io/UI-test-Demo/  │
│                         │     │ → upload → deploy│     │                          │
└─────────────────────────┘     └──────────────────┘     └──────────────────────────┘
```

| 字段 | 说明 |
|------|------|
| **Input** | main 分支的最新代码（由 push 事件触发） |
| **Process** | `npm ci` → `npm run build`（`tsc -b && vite build`）→ `actions/upload-pages-artifact@v3` 上传 `dist/` → `actions/deploy-pages@v4` 部署到 GitHub Pages |
| **Output** | 线上可访问的 Web 应用：`https://nickhou1983.github.io/UI-test-Demo/` |

---

## 4. 执行环境对比

| 维度 | 本地开发环境 | Azure Playwright Workspace |
|------|------------|---------------------------|
| **配置文件** | `playwright.config.ts` | `playwright.service.config.ts`（继承主配置 + Azure overlay） |
| **npm 命令** | `test:ct` / `test:e2e` / `test:visual` / `test:all` | `test:azure` / `test:azure:e2e` / `test:azure:visual` |
| **Web Server** | Vite dev server（localhost:5173） | 本地 Vite + `exposeNetwork: '<loopback>'` 暴露给云端 |
| **浏览器 OS** | 开发者本机（macOS/Windows/Linux） | Azure 云端 Linux |
| **浏览器** | 本地安装的 Chromium | Azure 托管的 Chromium |
| **并行度** | `fullyParallel: true`，`workers: auto` | CI: `workers: 10`，最多 50 并行 |
| **重试次数** | 0 | CI: 2 |
| **认证** | 无需 | `DefaultAzureCredential`（Entra ID，支持 `az login` 或 Service Principal） |
| **报告格式** | HTML | HTML + Azure Playwright Portal |
| **Trace 捕获** | 首次重试时 | 首次重试时 + Azure Portal 可在线查看 |
| **截图** | 仅失败时 | 仅失败时 + Azure Portal 可在线查看 |
| **适用场景** | 开发时快速验证 | CI/CD 流水线、基线一致性（Linux 环境）、大规模并行 |

### 配置继承关系

```text
playwright.config.ts  (基础配置: projects, webServer, reporter, use)
        │
        └── playwright.service.config.ts  (叠加 Azure 配置)
                 │
                 ├── createAzurePlaywrightConfig(): exposeNetwork, connectTimeout, os, credential
                 ├── workers: 10 (CI)
                 ├── retries: 2 (CI)
     └── reporter: [list, html, @azure/playwright] (+ 可选 VLM reporter)
```

> **重要提示：** 本地生成的基线截图与 Azure 云端生成的基线截图**不兼容**（操作系统字体渲染差异），需选择一个环境作为基线来源并保持一致。

---

## 5. CI/CD 流水线

### 5.1 测试流水线 — `playwright-azure.yml`

**触发条件：**
- `push` 到 `main` 分支
- `pull_request` 目标为 `main` 分支
- `workflow_dispatch`（手动触发）

**执行步骤：**

```
Step 1: actions/checkout@v4                         — 拉取代码
Step 2: actions/setup-node@v4 (node 22, cache npm)  — 设置 Node.js
Step 3: npm ci                                      — 安装依赖
Step 4: npx playwright install --with-deps chromium  — 安装浏览器
Step 5: E2E tests on Azure PT                       — 在 Azure 云端运行 E2E
        └ config: playwright.service.config.ts --project=e2e
        └ env: PLAYWRIGHT_SERVICE_URL, PLAYWRIGHT_SERVICE_ACCESS_TOKEN
Step 6: Visual tests on Azure PT                     — 在 Azure 云端运行视觉回归
        └ config: playwright.service.config.ts --project=visual
  └ env: VLM_REVIEW=false
Step 7: Upload playwright-report/ (14 days)          — 上传 HTML 报告
Step 8: Upload test-results/ (14 days)               — 上传 trace & 截图
```

**运行环境：** `ubuntu-latest`, 超时 30 分钟

**所需 Secrets：**

| Secret | 用途 |
|--------|------|
| `PLAYWRIGHT_SERVICE_URL` | Azure Playwright Workspace 服务端点 |
| `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` | Azure 服务访问令牌 |

### 5.2 部署流水线 — `deploy.yml`

**触发条件：** `push` 到 `main` 分支

**执行步骤：**

```
Job 1: build
  Step 1: actions/checkout@v4
  Step 2: actions/setup-node@v4 (node 22)
  Step 3: npm ci
  Step 4: npm run build  →  tsc -b && vite build  →  dist/
  Step 5: actions/upload-pages-artifact@v3 (path: dist)

Job 2: deploy (depends on build)
  Step 1: actions/deploy-pages@v4  →  GitHub Pages
```

**权限：** `contents: read`, `pages: write`, `id-token: write`

**并发控制：** `group: pages`, `cancel-in-progress: false`

### 5.3 两条流水线的关系

```
                    push to main
                        │
            ┌───────────┼───────────┐
            ↓                       ↓
   playwright-azure.yml        deploy.yml
   (测试验证)                   (生产部署)
            │                       │
            ↓                       ↓
   E2E + Visual 测试           Build → GitHub Pages
   Azure PT 执行
```

> 两条流水线**独立并行运行**，部署不依赖测试通过。若需门控，可在 `deploy.yml` 中添加 `needs` 依赖。

---

## 6. 测试覆盖矩阵

### 6.1 按被测对象

| 被测对象 | 组件测试 (CT) | E2E 测试 | 视觉回归 |
|---------|:------------:|:-------:|:-------:|
| **Navbar** | ✅ `Navbar.spec.tsx` | ✅ `navigation.spec.ts` | ✅ 含在所有页面截图中 |
| **SearchBar** | ✅ `SearchBar.spec.tsx` | ✅ `home.spec.ts` / `destinations.spec.ts` | ✅ |
| **FilterBar** | ✅ `FilterBar.spec.tsx` | ✅ `destinations.spec.ts` | ✅ |
| **Carousel** | ✅ `Carousel.spec.tsx` | ✅ `home.spec.ts` | ✅ |
| **DestinationCard** | ✅ `DestinationCard.spec.tsx` | ✅ `destinations.spec.ts` | ✅ |
| **Footer** | ✅ `Footer.spec.tsx` | ✅ `navigation.spec.ts` | ✅ 含在所有页面截图中 |
| **HomePage** | — | ✅ `home.spec.ts` | ✅ `home-main.png` |
| **DestinationsPage** | — | ✅ `destinations.spec.ts` | ✅ `destinations-page.png` |
| **DetailPage** | — | ✅ `destination-detail.spec.ts` | ✅ `destination-detail-bali.png` |
| **AboutPage** | — | ✅ `about.spec.ts` | ✅ `about-page.png` |
| **i18n 语言切换** | — | ✅ `navigation.spec.ts` | — |
| **用户完整旅程** | — | ✅ `user-journey.spec.ts` | — |

### 6.2 按测试维度

| 测试维度 | 组件测试 | E2E 测试 | 视觉回归 |
|---------|---------|---------|---------|
| **渲染正确性** | ✅ 组件内容、props 映射 | ✅ 页面内容完整性 | ✅ 像素级外观 |
| **交互行为** | ✅ 点击、输入、选择回调 | ✅ 导航、搜索、筛选 | — |
| **状态管理** | ✅ active 状态、选中值 | ✅ URL 参数、筛选状态 | — |
| **路由导航** | — | ✅ 页面间跳转、面包屑 | — |
| **国际化** | ✅ 中文默认渲染 | ✅ 中/英切换 + 持久化 | — |
| **响应式布局** | — | — | ✅ Desktop Chrome 视口 |
| **边界情况** | — | ✅ 搜索无结果、404 页面 | — |

### 6.3 测试用例统计

| 类型 | spec 文件数 | 测试用例数 |
|------|:---------:|:--------:|
| 组件测试 | 6 | ~30 |
| E2E 测试 | 6 | ~25 |
| 视觉回归 | 1 | 8 |
| **合计** | **13** | **~63** |

---

## 7. 关键配置清单

### 7.1 测试配置文件

| 文件 | 作用 | 关键参数 |
|------|------|---------|
| `playwright.config.ts` | 主测试配置 | `baseURL: localhost:5173/UI-test-Demo/`<br>`projects: [e2e, visual]`<br>`webServer: npm run dev`<br>`reporter: [html] (+ 可选 VLM)`<br>`trace: on-first-retry`<br>`screenshot: only-on-failure` |
| `playwright-ct.config.ts` | 组件测试配置 | `testDir: ./tests/component`<br>`devices: Desktop Chrome`<br>`ctViteConfig: { css: { postcss } }` |
| `playwright.service.config.ts` | Azure 云端配置 | 继承 `playwright.config.ts` +<br>`exposeNetwork: '<loopback>'`<br>`connectTimeout: 30000`<br>`os: ServiceOS.LINUX`<br>`credential: DefaultAzureCredential`<br>`workers: 10 (CI)` |

### 7.2 构建配置文件

| 文件 | 作用 | 关键参数 |
|------|------|---------|
| `vite.config.ts` | Vite 构建 | `plugins: [react()]`<br>`base: '/UI-test-Demo/'` |
| `tsconfig.json` | TypeScript 根配置 | 引用 `tsconfig.app.json` + `tsconfig.node.json` |
| `tsconfig.app.json` | 应用 TS 配置 | `target: ES2023`, `jsx: react-jsx`, `strict: true` |
| `postcss.config.js` | PostCSS 处理 | Tailwind CSS 与 autoprefixer |
| `eslint.config.js` | 代码质量 | `@eslint/js` + `typescript-eslint` + `react-hooks` + `react-refresh` |

### 7.3 npm Scripts 速查表

| 命令 | 执行内容 | 用途 |
|------|---------|------|
| `npm run dev` | `vite` | 启动开发服务器 |
| `npm run build` | `tsc -b && vite build` | 生产构建 |
| `npm run test:ct` | `playwright test -c playwright-ct.config.ts` | 运行组件测试 |
| `npm run test:e2e` | `playwright test --project=e2e` | 运行 E2E 测试 |
| `npm run test:visual` | `VLM_REVIEW=false playwright test --project=visual` | 运行默认视觉回归测试 |
| `npm run test:all` | `VLM_REVIEW=false playwright test && playwright test -c playwright-ct.config.ts` | 运行全部测试 |
| `npm run test:update-snapshots` | `VLM_REVIEW=false playwright test --project=visual --update-snapshots` | 更新默认视觉基线截图 |
| `npm run test:azure` | `VLM_REVIEW=false playwright test --config=playwright.service.config.ts` | Azure 云端运行全部 |
| `npm run test:azure:e2e` | `playwright test --config=playwright.service.config.ts --project=e2e` | Azure 云端 E2E |
| `npm run test:azure:visual` | `VLM_REVIEW=false playwright test --config=playwright.service.config.ts --project=visual` | Azure 云端默认视觉回归 |

---

## 8. 工具链依赖图

### 8.1 技术栈全景

```
┌─────────────── 应用层 ───────────────┐
│  React 19 + TypeScript 5.9           │
│  React Router 7.13 + i18next 25.8    │
│  Tailwind CSS 4.2                    │
└──────────────┬─┬─┬───────────────────┘
               │ │ │
    ┌──────────┘ │ └──────────┐
    ↓            ↓            ↓
┌─────────┐ ┌─────────┐ ┌──────────┐
│Playwright│ │Playwright│ │Playwright│
│ CT React│ │  E2E    │ │  Visual  │
│ v1.58   │ │  v1.58  │ │ + VLM    │
└────┬────┘ └────┬────┘ └────┬─────┘
     │           │           │
     │    ┌──────┴──────┐    │
     │    │ Vite 8.0    │    │
     │    │ Dev Server  │    │
     │    └──────┬──────┘    │
     │           │           │
     └─────┬─────┘───────────┘
           │
    ┌──────┴──────────────────┐
    │ Azure Playwright        │
    │ Workspace               │
    │ • @azure/playwright 1.1 │
    │ • @azure/identity 4.13  │
    │ • Linux Chromium        │
    │ • 10 workers 并行        │
    └──────┬──────────────────┘
           │
    ┌──────┴──────────────────┐
    │ GitHub Actions CI/CD    │
    ├─────────────────────────┤
    │ playwright-azure.yml    │
    │  → E2E + Visual on Azure│
    ├─────────────────────────┤
    │ deploy.yml              │
    │  → Build + GitHub Pages │
    └──────┬──────────────────┘
           │
           ↓
    ┌─────────────────────────┐
    │ GitHub Pages            │
    │ (Production)            │
    │ nickhou1983.github.io   │
    │ /UI-test-Demo/          │
    └─────────────────────────┘
```

### 8.2 关键依赖包

| 包名 | 版本 | 角色 |
|------|------|------|
| `@playwright/test` | 1.58 | E2E + 视觉测试框架 |
| `@playwright/experimental-ct-react` | 1.58 | React 组件测试框架 |
| `@azure/playwright` | 1.1 | Azure 云端浏览器连接 + Portal 报告 |
| `@azure/identity` | 4.13 | Azure Entra ID 认证 |

### 8.3 目录结构总览

```
UI-test-Demo/
├── src/                          # 应用源码（被测系统）
│   ├── components/               #   7 个 React 组件
│   ├── pages/                    #   4 个页面组件
│   ├── data/                     #   静态数据（目的地/评价/团队）
│   ├── i18n/                     #   国际化：index.ts + zh.json + en.json
│   ├── types/                    #   TypeScript 接口定义
│   ├── utils/                    #   工具函数（assetUrl）
│   ├── App.tsx                   #   路由定义
│   └── main.tsx                  #   应用入口
├── tests/                        # 测试代码
│   ├── component/                #   6 个组件测试 (*.spec.tsx)
│   ├── e2e/                      #   6 个 E2E 测试 (*.spec.ts)
│   ├── visual/                   #   1 个视觉测试 + snapshots/
│   └── fixtures/                 #   TestWrapper 公共夹具
├── playwright/                   # CT 入口文件
│   ├── index.html                #   CT HTML 入口
│   └── index.tsx                 #   加载全局 CSS + i18n
├── .github/workflows/            # CI/CD 流水线
│   ├── playwright-azure.yml      #   测试流水线
│   └── deploy.yml                #   部署流水线
├── playwright.config.ts          # 主测试配置
├── playwright-ct.config.ts       # 组件测试配置
├── playwright.service.config.ts  # Azure 云端配置
├── vite.config.ts                # Vite 构建配置
└── package.json                  # npm scripts + 依赖
```

---

## 附录：快速上手指南

### 本地运行测试

```bash
# 1. 安装依赖
npm ci

# 2. 安装 Playwright 浏览器
npx playwright install --with-deps chromium

# 3. 运行组件测试
npm run test:ct

# 4. 运行 E2E 测试（自动启动 dev server）
npm run test:e2e

# 5. 运行视觉回归测试
npm run test:visual

# 6. 运行全部测试
npm run test:all

# 7. 更新视觉基线截图
npm run test:update-snapshots

# 8. 查看测试报告
npx playwright show-report
```

### Azure 云端运行

```bash
# 1. Azure 认证
az login

# 2. 设置环境变量
export PLAYWRIGHT_SERVICE_URL="wss://eastus.api.playwright.microsoft.com/..."

# 3. 运行 Azure 云端测试
npm run test:azure
```
