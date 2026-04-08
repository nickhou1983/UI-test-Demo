# TravelVista 项目生成过程总结

> 生成日期：2026-03-23  
> 仓库：[nickhou1983/UI-test-Demo](https://github.com/nickhou1983/UI-test-Demo)  
> 线上地址：https://nickhou1983.github.io/UI-test-Demo/

---

## 目录

1. [项目概览](#1-项目概览)
2. [阶段一：静态 HTML 原型](#2-阶段一静态-html-原型2026-03-16)
3. [阶段二：React + TypeScript 重构](#3-阶段二react--typescript-重构2026-03-16)
4. [阶段三：功能扩展 + Playwright 全套测试](#4-阶段三功能扩展--playwright-全套测试2026-03-18)
5. [阶段四：VLM 视觉审查 + 基线修复](#5-阶段四vlm-视觉审查--基线修复2026-03-18)
6. [阶段五：Agent 工作流重构 + Discovery 深化](#6-阶段五agent-工作流重构--discovery-深化2026-03-20)
7. [阶段六：文档完善 + UI 主题更新](#7-阶段六文档完善--ui-主题更新2026-03-20)
8. [技术栈全景](#8-技术栈全景)
9. [最终项目结构](#9-最终项目结构)
10. [时间线总览](#10-时间线总览)

---

## 1. 项目概览

TravelVista 是一个旅游目的地浏览网站，同时也是一个**以 Playwright UI 测试 Agent 系统为核心展示目标**的 Demo 项目。整个项目在 **5 天内（3/16 – 3/20）从零构建完成**，核心开发集中在 3 天，全程借助 AI 辅助完成。

### 项目双重目标

| 目标 | 说明 |
|------|------|
| **前端应用** | 精美的旅游目的地浏览 SPA，含搜索、筛选、收藏、行程规划等功能 |
| **测试 Agent 系统** | 多 Agent 协作 + Skill 分层的 Playwright 测试架构，涵盖组件/E2E/视觉/VLM 回归测试 |

---

## 2. 阶段一：静态 HTML 原型（2026-03-16）

**提交：** `a56730c` — *feat: TravelVista 旅游目的地浏览网站初始版本*

### 工作内容

从零开始，通过 AI 辅助生成了一个**纯 HTML/CSS/JS 的多页静态站点**：

- 撰写 `PRD.md` 产品需求文档，定义项目需求和设计规范
- 生成 **8 个 HTML 页面**（中英各一套）：
  - `index.html` / `index-en.html` — 首页
  - `destinations.html` / `destinations-en.html` — 目的地列表
  - `destination-detail.html` / `destination-detail-en.html` — 目的地详情
  - `about.html` / `about-en.html` — 关于我们
- **Tailwind CSS**（CDN）做响应式布局
- **原生 JavaScript**：
  - `js/main.js` — 汉堡菜单、轮播组件等交互
  - `js/search.js` — 搜索和筛选功能
- 从 Unsplash 下载 **14+ 张旅游目的地高质量图片**，存放在 `assets/images/`

### 产出文件

```
PRD.md                          # 产品需求文档
index.html / index-en.html      # 首页（中/英）
destinations.html / -en.html    # 目的地列表（中/英）
destination-detail.html / -en   # 目的地详情（中/英）
about.html / about-en.html      # 关于页面（中/英）
assets/css/custom.css            # 自定义样式
assets/images/                   # 图片资源（14+ 张）
js/main.js                      # 交互逻辑
js/search.js                    # 搜索筛选
```

### 设计特点

- 蓝绿色调设计风格
- 响应式布局（移动端/平板/桌面）
- 中英双语通过独立页面实现
- 12 个旅游目的地数据（巴厘岛、京都、圣托里尼等）

---

## 3. 阶段二：React + TypeScript 重构（2026-03-16）

**提交：** `64c3373` — *refactor: 重构为 React + TypeScript + Vite + Tailwind CSS*

### 重构动机

静态 HTML 多页面方案存在明显局限：
- 中英双语需要维护两套 HTML，内容同步困难
- 无组件复用机制，代码重复度高
- 不适合后续构建现代化测试体系

### 工作内容

**同一天**完成从静态站点到现代 React SPA 的完整重构：

#### 技术栈升级

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.4 | UI 框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Vite | 8.0.0 | 构建工具 + 开发服务器 |
| React Router DOM | 7.13.1 | 客户端 SPA 路由 |
| react-i18next | 16.5.8 | 国际化（运行时中英切换） |
| Tailwind CSS | 4.2.1 | Utility-first CSS（PostCSS 模式） |
| ESLint | 9.x | 代码质量检查 |

#### 组件化拆分

**6 个公共组件：**
- `Navbar` — 固定顶部导航（Logo + 路由链接 + 语言切换 + 移动端汉堡菜单）
- `Footer` — 三列页脚（品牌 / 快速链接 / 社交媒体）
- `Layout` — 包装组件（Navbar + Outlet + Footer）
- `DestinationCard` — 目的地卡片（封面图 + 类型标签 + 评分）
- `SearchBar` — 搜索输入框
- `FilterBar` — 组合筛选栏（搜索 + 地区下拉 + 类型下拉）
- `Carousel` — 自动轮播组件（4 秒间隔 + 圆点导航）

**4 个页面：**
- `HomePage` — Hero + 热门目的地 + 旅行主题 + 评价轮播
- `DestinationsPage` — 全部 12 个目的地 + 高级筛选
- `DestinationDetailPage` — 图片画廊 + 景点 + 侧边栏实用信息
- `AboutPage` — 使命愿景 + 核心价值 + 团队介绍

#### 其他关键改动

- **路由**：BrowserRouter（basename `/UI-test-Demo`），支持 URL 查询参数（如 `?type=beach`）
- **i18n**：~130 个翻译键（`src/i18n/zh.json` + `en.json`），运行时切换无需刷新
- **数据层**：TypeScript 接口定义（`Destination`, `DestinationDetail`, `Attraction` 等）
- **CI/CD**：GitHub Actions 自动 `npm ci` → `npm run build` → 部署 GitHub Pages
- 删除所有旧 HTML/JS/CSS 文件，图片从 `assets/` 迁移到 `public/images/`

### 后续修补

| 提交 | 说明 |
|------|------|
| `e90f51c` | 修复图片路径 — 添加 `assetUrl()` 工具函数自动拼接 Vite base URL |
| `f66e70e` | 更新 PRD.md 反映 React 重构后的项目现状 |

---

## 4. 阶段三：功能扩展 + Playwright 全套测试（2026-03-18）

**提交：** `71cf31e` + `1fea6db` — 项目最大的一次变更

这是项目的**核心里程碑**，同时完成了新功能开发和完整 Playwright 测试体系搭建。

### 4.1 新增页面和组件

#### 4 个新页面

| 页面 | 路由 | 功能 |
|------|------|------|
| `FavoritesPage` | `/favorites` | 心愿单（localStorage 持久化），空状态 CTA |
| `TripPlannerPage` | `/trips` | 行程列表、创建行程弹窗（目的地选择 + 名称 + 天数）、删除确认 |
| `TripEditPage` | `/trips/:tripId` | 行程名称编辑、天数标签页、活动 CRUD、快速添加景点、天气侧边栏 |
| `NotFoundPage` | `*` | 404 页面 + 返回首页链接 |

#### 3 个新组件

| 组件 | 功能 |
|------|------|
| `FavoriteButton` | 收藏按钮（心形图标，localStorage + 自定义事件通知） |
| `ScrollToTop` | 返回顶部按钮（滚动 300px 后显示） |
| `WeatherWidget` | 目的地天气展示组件 |

#### 新增数据和工具模块

- `src/data/weather.ts` — 天气数据
- `src/utils/favorites.ts` — 收藏工具函数（localStorage 读写）
- `src/utils/tripPlanner.ts` — 行程规划工具函数
- i18n 翻译扩展至 ~200+ 键

### 4.2 Playwright 测试体系

#### 组件测试（Component Test / CT）

配置：`playwright-ct.config.ts`，使用 `@playwright/experimental-ct-react`

| 测试文件 | 覆盖组件 |
|----------|---------|
| `tests/component/Carousel.spec.tsx` | 轮播组件 |
| `tests/component/DestinationCard.spec.tsx` | 目的地卡片 |
| `tests/component/FilterBar.spec.tsx` | 筛选栏 |
| `tests/component/Footer.spec.tsx` | 页脚 |
| `tests/component/Navbar.spec.tsx` | 导航栏 |
| `tests/component/SearchBar.spec.tsx` | 搜索框 |
| `tests/component/VisualBaseline.spec.tsx` | 组件级视觉基线 |

#### E2E 测试（End-to-End）

配置：`playwright.config.ts`（project: `e2e`）

| 测试文件 | 覆盖范围 |
|----------|---------|
| `tests/e2e/home.spec.ts` | 首页功能 |
| `tests/e2e/destinations.spec.ts` | 目的地列表 + 筛选 |
| `tests/e2e/destination-detail.spec.ts` | 目的地详情 |
| `tests/e2e/about.spec.ts` | 关于页面 |
| `tests/e2e/navigation.spec.ts` | 全站导航 |
| `tests/e2e/user-journey.spec.ts` | 用户旅程 |

#### 视觉回归测试（Visual Regression）

配置：`playwright.config.ts`（project: `visual`）

| 测试文件 | 覆盖范围 |
|----------|---------|
| `tests/visual/pages.visual.spec.ts` | 全部 8 个页面的截图基线 |

#### VLM 语义审查工具

| 工具文件 | 功能 |
|----------|------|
| `tests/utils/vlm-reviewer.ts` | Azure OpenAI GPT-4o 视觉模型调用 |
| `tests/utils/vlm-reporter.ts` | VLM 审查结果 Playwright Reporter |
| `tests/utils/vlm-html-reporter.ts` | HTML 格式 VLM 报告生成 |
| `tests/utils/vlm-prompts.ts` | VLM 审查提示词模板 |

#### 测试辅助设施

| 文件 | 功能 |
|------|------|
| `tests/fixtures/test-utils.tsx` | CT 测试 Provider 包装（Router + i18n） |
| `tests/fixtures/visual-stories.tsx` | 视觉测试 Story 定义 |
| `tests/fixtures/visual-test.ts` | 视觉测试工具函数 |

#### npm 脚本

```bash
npm run test:e2e              # E2E 测试（Desktop Chrome）
npm run test:visual           # 视觉回归（VLM 关闭）
npm run test:ct               # 组件测试
npm run test:all              # E2E + Visual + CT 全部
npm run test:update-snapshots # 更新视觉基线
npm run test:azure            # Azure 云端执行
npm run test:visual:vlm       # 视觉 + VLM 语义审查
```

### 4.3 Agent & Skill 体系

#### 6 个 Agent（`.github/agents/`）

```
ui-test.agent.md              → 路由入口，分类请求并转发
ui-test-discovery.agent.md    → 共享发现层（环境检测、组件清单、路由发现）
ui-test-component.agent.md    → 组件测试 Agent
ui-test-e2e.agent.md          → E2E 测试 Agent
ui-test-visual.agent.md       → 视觉回归测试 Agent
ui-test-governance.agent.md   → 治理 Agent（Azure/CI/VLM）
```

#### 7 个 Skill（`.github/skills/`）

```
playwright-config/    → 配置文件生成（唯一所有者）
playwright-ct/        → 组件测试模板
playwright-e2e/       → E2E 测试模板
playwright-visual/    → 视觉截图核心
playwright-vlm/       → VLM 语义审查
playwright-azure/     → Azure 云端执行
playwright-explore/   → URL 探索
```

#### 架构设计

```
用户请求 → ui-test (路由) → ui-test-discovery (发现)
                           ├→ ui-test-component (CT)
                           ├→ ui-test-e2e (E2E)
                           ├→ ui-test-visual (视觉)
                           └→ ui-test-governance (治理)
```

### 4.4 CI/CD 和项目治理

| 文件 | 功能 |
|------|------|
| `.github/workflows/deploy.yml` | GitHub Pages 自动部署 |
| `.github/workflows/playwright-azure.yml` | Azure Playwright 云端测试 CI |
| `.github/CODEOWNERS` | 代码所有权 |
| `.github/pull_request_template.md` | PR 模板 |
| `.github/TESTING.md` | 测试架构决策文档 |
| `playwright.service.config.ts` | Azure Playwright Workspace 云端配置 |

---

## 5. 阶段四：VLM 视觉审查 + 基线修复（2026-03-18）

**提交：** `57cb3c2` → `98b34fc` → `50be803`

### 工作内容

| 提交 | 说明 |
|------|------|
| `57cb3c2` | 清理 `.gitignore`，排除 `playwright/.cache` 和 Office 临时文件 |
| `98b34fc` | 为 playwright-visual Skill 添加 VLM 源码参考文档 |
| `50be803` | 404 页面改为红色主题；修复 VLM 路径解析和 API 参数兼容性；新增视觉基线截图 |

---

## 6. 阶段五：Agent 工作流重构 + Discovery 深化（2026-03-20）

**提交：** `5ee10dd` → `fc34e00` → `9856813`

对测试 Agent 协作架构进行系统性优化。

### 6.1 Discovery Agent 增强

**提交：** `5ee10dd` — *feat: enhance Discovery agent with Side-Effect Inventory*

- 添加**副作用清单**（Side-Effect Inventory）：`window.confirm()`, `localStorage`, `dispatchEvent` 等
- 更新组件和页面发现数据
- 添加 VLM Skill 和相关报告

### 6.2 Agent 所有权重构

**提交：** `fc34e00` — *refactor: optimize UI test agent workflow with clear ownership and gates*

- 明确 Agent 之间的**所有权边界矩阵**
- 引入**门控机制**：发现门控 → 配置门控 → Fixture 门控
- 确立 "日常测试" 与 "治理" 的分离原则

### 6.3 视觉基线策略

**提交：** `9856813` — *feat(visual-agent): add strict baseline update policy*

- 添加 ⛔ **基线更新政策**：report-only 行为强制执行
- 禁止自动更新基线（需用户明确请求）
- 定义条件-行为决策表（何时报告 vs 何时更新）
- 刷新全部 10 个页面的视觉基线截图

---

## 7. 阶段六：文档完善 + UI 主题更新（2026-03-20）

**提交：** `3af3c2a` → `7ba4668` → `5bfc946` → `956b1c5` → `4610ad1`

### 7.1 工作流文档

**提交：** `3af3c2a` — 12 节全面工作流文档

撰写 `docs/UI-TEST-WORKFLOW-DETAIL.md`，涵盖：
- 6 个 Agent 角色、路由规则和所有权边界
- 7 个 Skill 模板、文件所有权和生成规则
- 3 层配置架构（本地/CT/Azure）
- 5 个端到端工作流图（CT/E2E/Visual/VLM/Azure）
- 门控机制、基线管理策略和 VLM 语义审查

### 7.2 深度发现报告

**提交：** `5bfc946` — Deep Discovery Report

撰写 `docs/DEEP_DISCOVERY_REPORT.md`，全面分析：
- 8 条路由及其页面组件
- 10 个组件的 Props/状态/事件/Provider 依赖
- 5 个副作用模式（`window.confirm`, `localStorage`, `dispatchEvent` 等）
- Locator 策略推荐

### 7.3 文档整理 + 主题更新

| 提交 | 说明 |
|------|------|
| `7ba4668` | 删除已被取代的旧工作流文档 |
| `956b1c5` | 将发现报告整理到 `docs/` 目录 |
| `4610ad1` | **UI 主题更新为深蓝色调（navy blue）** + VLM 视觉报告增强 |

---

## 8. 技术栈全景

### 前端应用

| 分类 | 技术 | 版本 |
|------|------|------|
| UI 框架 | React | 19.2.4 |
| 类型系统 | TypeScript | 5.9.3 |
| 构建工具 | Vite | 8.0.0 |
| 路由 | react-router-dom | 7.13.1 |
| 国际化 | i18next + react-i18next | 25.8.18 / 16.5.8 |
| 样式 | Tailwind CSS（PostCSS） | 4.2.1 |
| 图标 | react-icons | 5.6.0 |
| 代码检查 | ESLint + typescript-eslint | 9.x |

### 测试体系

| 分类 | 技术 | 版本 |
|------|------|------|
| 测试框架 | Playwright | 1.58.2 |
| 组件测试 | @playwright/experimental-ct-react | 1.58.2 |
| 云端执行 | @azure/playwright | 1.1.2 |
| Azure 认证 | @azure/identity | 4.13.0 |
| VLM 审查 | openai（Azure OpenAI GPT-4o） | 6.32.0 |
| 图片处理 | sharp | 0.34.5 |

### CI/CD

| 平台 | 用途 |
|------|------|
| GitHub Actions | 自动构建 + GitHub Pages 部署 |
| Azure Playwright Workspace | 云端浏览器执行 E2E/视觉测试 |

---

## 9. 最终项目结构

```
UI-test-Demo/
├── .github/
│   ├── agents/                    # 6 个 UI 测试 Agent
│   │   ├── ui-test.agent.md       #   路由入口
│   │   ├── ui-test-discovery.agent.md  # 共享发现
│   │   ├── ui-test-component.agent.md  # 组件测试
│   │   ├── ui-test-e2e.agent.md        # E2E 测试
│   │   ├── ui-test-visual.agent.md     # 视觉回归
│   │   └── ui-test-governance.agent.md # 治理
│   ├── skills/                    # 7 个 Playwright Skill
│   │   ├── playwright-config/
│   │   ├── playwright-ct/
│   │   ├── playwright-e2e/
│   │   ├── playwright-visual/
│   │   ├── playwright-vlm/
│   │   ├── playwright-azure/
│   │   └── playwright-explore/
│   ├── workflows/
│   │   ├── deploy.yml             # GitHub Pages 部署
│   │   └── playwright-azure.yml   # Azure 云端测试
│   ├── CODEOWNERS
│   ├── TESTING.md                 # 测试架构决策
│   └── pull_request_template.md
├── docs/
│   ├── DEEP_DISCOVERY_REPORT.md   # 深度发现报告
│   ├── LOCATOR_STRATEGY_REPORT.md # Locator 策略报告
│   ├── UI-TEST-WORKFLOW-DETAIL.md # 工作流详细文档
│   └── presentations/
│       └── DISCOVERY_REPORT.md    # 发现报告（演示版）
├── src/
│   ├── App.tsx                    # 路由定义
│   ├── main.tsx                   # 入口
│   ├── index.css                  # 全局样式
│   ├── components/                # 10 个组件
│   │   ├── Carousel.tsx
│   │   ├── DestinationCard.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SearchBar.tsx
│   │   └── WeatherWidget.tsx
│   ├── pages/                     # 8 个页面
│   │   ├── HomePage.tsx
│   │   ├── DestinationsPage.tsx
│   │   ├── DestinationDetailPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── TripPlannerPage.tsx
│   │   ├── TripEditPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── data/                      # 数据层
│   │   ├── destinations.ts        # 12 个目的地
│   │   ├── reviews.ts             # 3 条评价
│   │   ├── team.ts                # 4 位团队成员
│   │   └── weather.ts             # 天气数据
│   ├── i18n/                      # 国际化
│   │   ├── index.ts
│   │   ├── zh.json                # ~200+ 中文键
│   │   └── en.json                # ~200+ 英文键
│   ├── types/
│   │   └── index.ts               # TypeScript 接口
│   └── utils/
│       ├── assetUrl.ts            # Vite base URL 拼接
│       ├── favorites.ts           # 收藏工具
│       └── tripPlanner.ts         # 行程规划工具
├── tests/
│   ├── component/                 # 7 个组件测试
│   │   ├── Carousel.spec.tsx
│   │   ├── DestinationCard.spec.tsx
│   │   ├── FilterBar.spec.tsx
│   │   ├── Footer.spec.tsx
│   │   ├── Navbar.spec.tsx
│   │   ├── SearchBar.spec.tsx
│   │   └── VisualBaseline.spec.tsx
│   ├── e2e/                       # 10 个 E2E 测试
│   │   ├── home.spec.ts
│   │   ├── destinations.spec.ts
│   │   ├── destination-detail.spec.ts
│   │   ├── about.spec.ts
│   │   ├── favorites.spec.ts
│   │   ├── trip-planner.spec.ts
│   │   ├── trip-edit.spec.ts
│   │   ├── not-found.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── user-journey.spec.ts
│   ├── visual/                    # 视觉回归测试
│   │   └── pages.visual.spec.ts
│   ├── fixtures/                  # 测试辅助
│   │   ├── test-utils.tsx
│   │   ├── visual-stories.tsx
│   │   └── visual-test.ts
│   └── utils/                     # VLM 工具
│       ├── vlm-reviewer.ts
│       ├── vlm-reporter.ts
│       ├── vlm-html-reporter.ts
│       └── vlm-prompts.ts
├── public/images/                 # 静态图片资源
├── playwright.config.ts           # E2E + Visual 配置
├── playwright-ct.config.ts        # CT 组件测试配置
├── playwright.service.config.ts   # Azure 云端配置
├── PRD.md                         # 产品需求文档
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 10. 时间线总览

```
2026-03-16  ┌──────────────────────────────────────────────────┐
            │  阶段一：PRD 撰写 → 静态 HTML 原型(8页面)          │
            │  阶段二：React + TS + Vite 全面重构               │
            │         6组件 + 4页面 + i18n + GitHub Pages CI    │
            └──────────────────────────────────────────────────┘
                                    │
2026-03-18  ┌──────────────────────────────────────────────────┐
            │  阶段三：功能扩展 + 测试体系（最大变更）             │
            │         +4页面 +3组件                             │
            │         CT(7) + E2E(6) + Visual + VLM 工具       │
            │         6 Agent + 7 Skill + Azure CI             │
            │  阶段四：VLM 修复 + 基线更新                      │
            └──────────────────────────────────────────────────┘
                                    │
2026-03-20  ┌──────────────────────────────────────────────────┐
            │  阶段五：Agent 协作架构优化                        │
            │         Discovery 增强 + 所有权重构               │
            │         视觉基线严格策略                           │
            │  阶段六：文档完善 + UI 主题更新（深蓝色）           │
            │         工作流文档 + 深度发现报告                  │
            └──────────────────────────────────────────────────┘
```

### 提交统计

| 日期 | 提交数 | 关键里程碑 |
|------|--------|-----------|
| 2026-03-16 | 4 | 从零到一：PRD → HTML → React SPA |
| 2026-03-18 | 4 | 核心变更：功能扩展 + 完整测试体系 |
| 2026-03-20 | 7 | 架构优化：Agent 重构 + 文档完善 |
| **合计** | **15** | **5 天完成全部开发** |

### 构建方式

整个项目全程使用 **AI 辅助开发**，工作模式为：

1. **PRD 先行** — 先撰写产品需求文档，定义清晰的目标和规范
2. **快速原型** — 用静态 HTML 快速验证设计
3. **技术升级** — 立即重构为现代 React 架构
4. **测试驱动** — 功能开发与测试体系同步构建
5. **架构迭代** — 持续优化 Agent 协作和所有权边界
6. **文档闭环** — 最终完善所有技术文档

---

*本文档基于 Git 提交历史和项目文件结构梳理生成。*
