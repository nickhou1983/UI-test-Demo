# UI-Test Agent 工作流详细说明文档

> 生成时间：2026-03-20  
> 项目：TravelVista (React + Vite)  
> 仓库：nickhou1983/UI-test-Demo

---

## 目录

1. [系统总览](#1-系统总览)
2. [架构设计原则](#2-架构设计原则)
3. [Agent 层详解](#3-agent-层详解)
   - 3.1 [ui-test（路由入口）](#31-ui-test路由入口)
   - 3.2 [ui-test-discovery（共享发现层）](#32-ui-test-discovery共享发现层)
   - 3.3 [ui-test-component（组件测试）](#33-ui-test-component组件测试)
   - 3.4 [ui-test-e2e（端到端测试）](#34-ui-test-e2e端到端测试)
   - 3.5 [ui-test-visual（视觉回归测试）](#35-ui-test-visual视觉回归测试)
   - 3.6 [ui-test-governance（治理与云端）](#36-ui-test-governance治理与云端)
4. [Skill 层详解](#4-skill-层详解)
   - 4.1 [playwright-config（配置生成）](#41-playwright-config配置生成)
   - 4.2 [playwright-ct（组件测试模板）](#42-playwright-ct组件测试模板)
   - 4.3 [playwright-e2e（E2E 测试模板）](#43-playwright-e2e-e2e-测试模板)
   - 4.4 [playwright-visual（视觉截图核心）](#44-playwright-visual视觉截图核心)
   - 4.5 [playwright-vlm（VLM 语义审查）](#45-playwright-vlmvlm-语义审查)
   - 4.6 [playwright-azure（Azure 云端执行）](#46-playwright-azureazure-云端执行)
   - 4.7 [playwright-explore（URL 探索）](#47-playwright-exploreurl-探索)
5. [配置文件体系](#5-配置文件体系)
6. [npm 脚本命令映射](#6-npm-脚本命令映射)
7. [完整工作流程：从请求到执行](#7-完整工作流程从请求到执行)
   - 7.1 [组件测试完整流程](#71-组件测试完整流程)
   - 7.2 [E2E 测试完整流程](#72-e2e-测试完整流程)
   - 7.3 [视觉回归测试完整流程](#73-视觉回归测试完整流程)
   - 7.4 [VLM 增强视觉测试流程](#74-vlm-增强视觉测试流程)
   - 7.5 [Azure 云端执行流程](#75-azure-云端执行流程)
8. [门控机制详解](#8-门控机制详解)
9. [基线管理策略](#9-基线管理策略)
10. [VLM 语义审查机制](#10-vlm-语义审查机制)
11. [所有权边界矩阵](#11-所有权边界矩阵)
12. [测试文件结构](#12-测试文件结构)

---

## 1. 系统总览

UI-Test 系统采用 **多 Agent 协作 + Skill 分层** 的架构，将 Playwright 测试工作流拆分为六个专职 Agent 和七个执行技能，实现关注点分离。

```
┌─────────────────────────────────────────────────────────┐
│                    用户请求入口                            │
│              "进行视觉测试" / "写组件测试"                    │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │   ui-test     │  路由入口 Agent
              │  (Router)     │  分类请求 → 转发
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
  │component │ │   e2e    │ │  visual  │ │  governance  │
  │  Agent   │ │  Agent   │ │  Agent   │ │    Agent     │
  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘
       │             │             │              │
       │    ┌────────┴──────┐     │              │
       │    │   discovery   │◄────┘              │
       │    │    Agent      │◄────────────────── │←(按需)
       │    └───────────────┘                    │
       │             │             │              │
       ▼             ▼             ▼              ▼
  ┌─────────────────────────────────────────────────────┐
  │                    Skill 执行层                       │
  │  config │ ct │ e2e │ visual │ vlm │ azure │ explore │
  └─────────────────────────────────────────────────────┘
       │             │             │              │
       ▼             ▼             ▼              ▼
  ┌─────────────────────────────────────────────────────┐
  │               Playwright 运行时                       │
  │  playwright.config.ts │ ct.config.ts │ service.config│
  └─────────────────────────────────────────────────────┘
```

### 核心设计理念

| 原则 | 说明 |
|------|------|
| **路由入口轻量化** | `ui-test` 只做分类和转发，不执行实际测试 |
| **发现层共享** | `ui-test-discovery` 的输出被所有下游 Agent 复用 |
| **日常与治理分离** | 日常测试（CT/E2E/Visual）和治理（Azure/CI/VLM）分开处理 |
| **Skill 为执行模板** | Agent 是决策者，Skill 是执行手册 |
| **仅报告策略** | 所有 Skill 默认只报告问题，不自动修复 |
| **配置单一所有权** | `playwright-config` 是配置文件的唯一生成者 |

---

## 2. 架构设计原则

### 2.1 Agent vs Skill 的职责分工

```
Agent（决策层）                    Skill（执行层）
├── 理解用户意图                   ├── 提供具体模板和代码
├── 运行门控检查                   ├── 定义测试生成规则
├── 协调多个 Skill               ├── 封装 Playwright 命令
├── 决定何时升级/转发             ├── 管理文件所有权
└── 控制输出格式                  └── 定义完成标准
```

### 2.2 三层防护门控

每个测试 Agent 在执行前必须通过三道门控：

```
用户请求
   │
   ▼
┌─────────────────┐
│ Discovery Gate  │ ← 是否有充足的发现上下文？
│  (发现门控)      │    有 → 复用 / 不足 → 补充 / 无 → 发现
└────────┬────────┘
         ▼
┌─────────────────┐
│ Config Gate     │ ← 配置文件是否存在且正确？
│  (配置门控)      │    存在 → 继续 / 缺失 → 调用 playwright-config
└────────┬────────┘
         ▼
┌─────────────────┐
│ Fixture Gate    │ ← 测试夹具是否就绪？（仅 CT）
│  (夹具门控)      │    存在 → 继续 / 缺失 → 生成
└────────┬────────┘
         ▼
    开始测试生成
```

### 2.3 仅报告策略（Report-Only Policy）

所有七个 Skill 均遵循 **仅报告策略**：

- ✅ 生成测试、运行测试、报告结果
- ❌ 不自动修复失败的测试
- ❌ 不自动修改源代码
- ❌ 不自动更新基线截图（视觉测试特有）
- ❌ 不主动提出修复建议

用户必须 **明确请求** 才能触发修改操作。

---

## 3. Agent 层详解

### 3.1 ui-test（路由入口）

**文件位置：** `.github/agents/ui-test.agent.md`

**角色：** 系统总入口，请求分类器和路由器。

**核心职责：**
1. 识别用户的测试模式需求
2. 将请求路由到正确的专职 Agent
3. 保持交互轻量，不做具体实现

**路由规则决策表：**

| 用户请求关键词 | 路由目标 |
|--------------|---------|
| 组件测试、CT、props 测试、事件测试 | `ui-test-component` |
| E2E 测试、页面流测试、表单交互、用户旅程 | `ui-test-e2e` |
| 视觉回归、截图测试、基线生成、像素差异 | `ui-test-visual` |
| 分析前端、发现路由、组件清单 | `ui-test-discovery` |
| Azure 云执行、CI/CD、PR 门控、VLM 审查 | `ui-test-governance` |

**路由原则：**
- 优先选择最窄的专职 Agent
- 只在下游 Agent 需要时才触发 Discovery
- Azure/CI/VLM 是可选高级路径，不是默认路径
- 不在路由器中混合治理逻辑

**禁止行为：**
- 不复制 Discovery 工作流
- 不复制 CT/E2E/Visual 的实现细节
- 不默认走治理流程
- 不将路由器变回独体应用

---

### 3.2 ui-test-discovery（共享发现层）

**文件位置：** `.github/agents/ui-test-discovery.agent.md`

**角色：** 所有测试工作流的共享发现层，为下游 Agent 提供项目上下文。

**发现范围三级模型：**

| 级别 | 内容 | 何时触发 |
|------|------|---------|
| **最小检查** | 本地/URL 模式检测、Playwright 就绪性、配置存在性 | 每次 |
| **标准发现** | 框架、构建工具、路由、组件、样式、i18n、已有测试 | 首次或缺失时 |
| **深度发现** | 运行时 DOM 探索、定位器策略、旅程图、类型解析、副作用分析 | 按需 |

**产出物清单：**

1. **项目分析报告** — 框架、构建工具、基础 URL
2. **组件清单** — 组件名、路径、props、事件
3. **路由清单** — 所有路由及页面内容
4. **定位器策略** — 每个页面的推荐定位器
5. **旅程笔记** — 用户操作流程
6. **环境就绪笔记** — Playwright 安装状态
7. **副作用清单** — 对话框、新标签页、外部链接、下载操作

**产出物元数据头：**

```markdown
<!-- discovery-meta
  generated: 2026-03-20T10:00:00Z
  scope: standard
  routes-found: 8
  components-found: 10
  i18n-detected: true
  side-effects-found: 3
-->
```

**针对不同下游 Agent 的优先输出：**

| 下游 Agent | 优先提供 |
|-----------|---------|
| `ui-test-component` | 组件名、props/事件、Provider 依赖、样式依赖 |
| `ui-test-e2e` | 路由、导航点、交互流、定位器、旅程、副作用处理 |
| `ui-test-visual` | 页面清单、i18n 变体、响应式候选、基线目标、副作用警告 |

**新鲜度复用规则：**
- 下游 Agent 检查元数据头 → 如果存在且覆盖需求 → 直接复用
- 如果范围不足 → 请求定向深入，而非全量重跑
- 永不静默重复 Discovery 已有产出

---

### 3.3 ui-test-component（组件测试）

**文件位置：** `.github/agents/ui-test-component.agent.md`  
**主要技能：** `playwright-ct`  
**配置文件：** `playwright-ct.config.ts`

**核心工作流：**

```
1. Discovery Gate
   └── 检查组件清单、Provider 依赖、样式系统
       ├── 有 → 复用
       ├── 不足 → 要求 discovery 补充
       └── 无 → 调用 ui-test-discovery

2. Configuration Gate
   └── 检查 playwright-ct.config.ts
       ├── 存在 → 验证 testDir 和框架导入
       └── 缺失 → 调用 playwright-config 生成

3. Fixture Gate
   └── 检查 tests/fixtures/test-utils.ts
       ├── 存在 → 验证 Provider 包装器
       └── 缺失 → 通过 playwright-ct 模板生成

4. 测试生成
   ├── 渲染测试
   ├── Props 驱动输出测试
   ├── 事件回调测试
   ├── 条件分支测试
   └── Provider 依赖渲染测试

5. 执行 CT

6. 报告失败（不自动修复）
```

**I/O 覆盖规则：**
- 每个 Input（Prop）必须至少测试一个代表值
- 每个 Output（渲染）必须有对应断言
- 每个 Output（事件）必须通过 spy 回调测试
- 联合类型/枚举至少测试 2 个不同值
- 可选 Props 测试有/无两种情况
- 数组 Props 测试空、单项、多项

**边界：**
- 不生成跨页面旅程
- 不管理视觉基线
- 不涉及 Azure 云执行
- 不包含 VLM 逻辑

**执行命令：**
```bash
npx playwright test -c playwright-ct.config.ts
npx playwright test -c playwright-ct.config.ts tests/component/{Component}.spec.tsx
```

---

### 3.4 ui-test-e2e（端到端测试）

**文件位置：** `.github/agents/ui-test-e2e.agent.md`  
**主要技能：** `playwright-e2e`  
**配置文件：** `playwright.config.ts`（`e2e` project）

**核心工作流：**

```
1. Discovery Gate
   └── 检查路由清单、定位器策略、旅程图、副作用清单
       ├── 有 → 复用
       └── 缺失 → 调用 ui-test-discovery

2. Configuration Gate
   └── 检查 playwright.config.ts 中 e2e 项目
       ├── 存在且有效 → 继续
       └── 缺失/错误 → 调用 playwright-config

3. 测试生成
   ├── 页面加载测试
   ├── 导航测试
   ├── 表单交互测试
   ├── 状态变化测试
   ├── 用户旅程测试
   ├── i18n 切换测试（如适用）
   └── 副作用场景测试

4. 执行 E2E

5. 报告失败（不自动修复）
```

**副作用处理模式：**

| 副作用类型 | 处理方式 |
|-----------|---------|
| `window.confirm` / `alert` / `prompt` | 触发前注册 `page.on('dialog', d => d.accept())` |
| `target="_blank"` / `window.open` | `Promise.all([page.waitForEvent('popup'), trigger])` |
| `mailto:` / `tel:` / 外部链接 | 断言 `href` 属性，不实际点击 |
| `download` 属性 | `Promise.all([page.waitForEvent('download'), trigger])` |

**测试生成规则：**
- 使用语义定位器：`getByRole()`, `getByText()`, `getByLabel()`
- 每个页面一个 spec 文件
- 旅程测试放在 `user-journey.spec.ts`
- 每个旅程步骤必须有中间断言
- 使用 PRD/类型解析的真实数据

**执行命令：**
```bash
npx playwright test --project=e2e
npx playwright test --project=e2e --headed
npx playwright test --project=e2e --debug
```

---

### 3.5 ui-test-visual（视觉回归测试）

**文件位置：** `.github/agents/ui-test-visual.agent.md`  
**主要技能：** `playwright-visual`（核心）+ `playwright-vlm`（可选）  
**配置文件：** `playwright.config.ts`（`visual` project）

**核心工作流：**

```
1. Discovery Gate
   └── 检查页面清单、路由、i18n 变体、响应式目标

2. Configuration Gate
   └── 检查 playwright.config.ts 中 visual 项目

3. Screenshot Stabilization（截图稳定化）
   ├── 等待 networkidle
   ├── 注入 CSS 禁用动画/过渡
   ├── 处理对话框（如副作用清单有标记）
   └── 触发懒加载图片

4. 生成视觉测试规格

5. 运行基线生成或截图对比

6. ⛔ 仅报告差异 — 绝不自动更新基线
```

**⛔ 基线更新策略（硬规则）：**

| 条件 | 操作 |
|------|------|
| 测试因像素差异失败 | **报告**差异，附文件路径和差异百分比。**询问用户**是否更新。**停止等待响应。** |
| 用户说 "更新基线" / "update baselines" | 仅对受影响测试运行 `--update-snapshots` |
| 用户说 "运行视觉测试" / "进行视觉测试" | **仅运行对比**。即使全部失败也不更新基线 |

**禁止行为：**
- ❌ 永不将 `--update-snapshots` 作为测试失败后的"恢复"步骤
- ❌ 永不在单次响应中链式执行对比 + 自动更新
- ❌ 永不因测试失败就假设用户想要更新基线

**基线权威策略：**

| 策略 | 适用场景 | 基线位置 |
|------|---------|---------|
| **Local-only**（默认） | 快速迭代，本地优先团队 | `tests/visual/__screenshots__/` 提交到 Git |
| **Azure-only** | 云端权威团队，CI 一致性 | Azure 生成，存储为 CI 产物 |
| **Hybrid** | 本地开发 + Azure CI 门控 | 本地基线用于开发；Azure 基线用于 PR 合并门控 |

**升级规则（转发到 governance）：**
- Azure Playwright Workspace 执行
- PR 视觉门控
- VLM 审查启用策略
- 跨环境基线权威策略
- CI 产物/门户指导

**执行命令：**
```bash
npm run test:visual              # 本地视觉测试（无 VLM）
npm run test:visual:vlm          # 本地视觉测试（带 VLM）
npm run test:update-snapshots    # 更新基线快照
npm run test:azure:visual        # Azure 云端视觉测试
```

---

### 3.6 ui-test-governance（治理与云端）

**文件位置：** `.github/agents/ui-test-governance.agent.md`  
**参考技能：** `playwright-azure`, `playwright-config`, `playwright-vlm`

**角色：** 高级测试治理工作流的所有者，处理云执行、CI 策略和 VLM 增强。

**四大治理域：**

#### ① Azure 域
- Playwright Workspace 设置
- Service Config 期望
- 身份验证指导（Entra ID / Access Token）
- 云执行范围：仅 E2E 和 Visual（CT 不能在云端运行）

#### ② 视觉 CI 门控域
- 工作流 pass/fail 语义
- 产物上传期望
- 基线更新审查流程
- 真相来源策略

#### ③ 基线权威域

| 策略 | 所有者 | 更新流程 |
|------|-------|---------|
| Local-only | 开发者本机 | 开发者审查截图 → 提交到 Git |
| Azure-only | Azure CI Pipeline | CI 在 main 分支生成 → PR 对比 main 基线 |
| Hybrid | 两者（分域） | 本地快速开发；Azure 用于 PR 合并门控 |

#### ④ VLM 审查域（策略层）

| 预算控制 | 默认值 | 说明 |
|---------|-------|------|
| `VLM_MAX_CALLS` | 10 | 每次 Pipeline 的最大 VLM API 调用数 |
| `VLM_CONFIDENCE_THRESHOLD` | 0.7 | VLM 分类的最低可信度 |
| `VLM_REVIEW` | `false` | 主开关 — 必须显式启用 |

**VLM 预算超限降级行为：**
1. 前 N 次失败（不超过 `VLM_MAX_CALLS`）→ 接收 VLM 语义审查
2. 剩余失败 → 退回像素级门控（硬通过/失败）
3. CI 报告明确标注哪些失败有 VLM 审查、哪些没有

---

## 4. Skill 层详解

### 4.1 playwright-config（配置生成）

**文件位置：** `.github/skills/playwright-config/SKILL.md`

**唯一所有权：** 这是仓库中 **唯一** 允许生成 Playwright 配置文件的 Skill。

**生成产物：**

| 需求 | 产物 |
|------|------|
| 基础浏览器测试 | `playwright.config.ts` |
| 组件测试 | `playwright-ct.config.ts` |
| Azure 云执行 | `playwright.service.config.ts` |
| 标准脚本 | `package.json` scripts |
| 产物清理 | `.gitignore` |

**最小输入契约：**
- framework: `react`
- build tool: `vite`
- local base URL: `http://localhost:5173`
- dev command: `npm run dev`
- test modes: `e2e`, `visual`, `ct`

**配置规则：**
- `testDir` 根目录始终为 `./tests`
- 按职责拆分 projects，而非按浏览器
- 视觉默认保守：`maxDiffPixelRatio: 0.01`
- 非 CI 环境复用现有本地服务器

---

### 4.2 playwright-ct（组件测试模板）

**文件位置：** `.github/skills/playwright-ct/SKILL.md`

**所有权领域：**
- CT 测试生成规则
- `tests/fixtures/test-utils.ts` 夹具文件
- Provider 包装器（Router、i18n、Context）

**测试类型模板：**
- 渲染测试 → 验证组件可见性
- Props 测试 → 验证属性驱动输出
- 事件测试 → spy 回调追踪
- 条件渲染 → 分支覆盖
- Provider 依赖 → 包装器挂载

**重要限制：** CT 始终在本地运行，不能在 Azure PT 上执行。

---

### 4.3 playwright-e2e（E2E 测试模板）

**文件位置：** `.github/skills/playwright-e2e/SKILL.md`

**所有权领域：**
- E2E 测试生成规则
- 副作用处理模式
- 旅程测试模板
- I/O 感知测试生成

**测试类型模板：**
- 页面加载 → 关键内容可见
- 导航 → URL 变化验证
- 表单交互 → 输入-结果映射
- i18n 切换 → 语言变化验证
- 用户旅程 → 多步骤含状态检查
- 副作用处理 → 对话框/新标签页/下载

---

### 4.4 playwright-visual（视觉截图核心）

**文件位置：** `.github/skills/playwright-visual/SKILL.md`

**所有权领域：**
- 核心截图工作流
- 视口覆盖
- i18n 视觉覆盖
- 基线创建与对比
- `tests/fixtures/visual-helpers.ts` 稳定化工具

**截图稳定化帮助函数（visual-helpers.ts）：**
- `disableAnimations(page)` — 禁用 CSS 动画/过渡
- `waitForImages(page)` — 等待所有图片加载
- `dismissDialogs(page)` — 自动关闭浏览器对话框
- `stabilize(page)` — 完整稳定化序列

**覆盖模式：**
1. 路由默认状态
2. 响应式视口（mobile 375×812、tablet 768×1024、desktop 1280×720）
3. 有状态变体（筛选器、展开面板）
4. i18n 变体

---

### 4.5 playwright-vlm（VLM 语义审查）

**文件位置：** `.github/skills/playwright-vlm/SKILL.md`

**核心策略：像素优先，VLM 兜底**

```
          截图断言
             │
    ┌────────┴────────┐
    ▼                 ▼
 像素通过          像素失败
    │                 │
    ▼                 ▼
 测试通过     VLM_REVIEW=true?
              │           │
             NO          YES
              │           │
              ▼           ▼
          测试失败    调用 Azure OpenAI
                     GPT-4o Vision
                          │
                   ┌──────┴──────┐
                   ▼             ▼
             置信度 ≥ 0.7   置信度 < 0.7
                │                │
          ┌─────┴─────┐         ▼
          ▼     ▼     ▼     测试失败
        none  cosmetic minor breaking
        /cosmetic      │       │
          │            ▼       ▼
          ▼        通过+警告  测试失败
      通过+注释
```

**严重级别分类：**

| 级别 | 建议 | 操作 | 示例 |
|------|------|------|------|
| `none` | `pass` | 通过 + `vlm-override` 注解 | 相同截图、亚像素差异 |
| `cosmetic` | `pass` | 通过 + `vlm-override` 注解 | 字体反锯齿、±1px 阴影 |
| `minor` | `warn` | 通过 + `vlm-warning` 注解 | 间距 <5px、微妙色差 |
| `breaking` | `fail` | 失败 + `vlm-breaking` 注解 | 缺失元素、文本截断、布局崩溃 |

**自带模板文件：**
```
templates/
├── utils/
│   ├── vlm-prompts.ts       # GPT-4o 系统/用户 Prompt
│   ├── vlm-reviewer.ts      # 核心审查逻辑 + Azure OpenAI 客户端
│   └── vlm-reporter.ts      # Playwright 自定义 Reporter → JSON
└── fixtures/
    └── visual-test.ts        # 混合像素优先/VLM 兜底夹具
```

---

### 4.6 playwright-azure（Azure 云端执行）

**文件位置：** `.github/skills/playwright-azure/SKILL.md`

**云端 vs 本地对比：**

| 设置项 | 本地 | Azure PT 云端 |
|-------|------|---------------|
| 配置文件 | `playwright.config.ts` | `playwright.service.config.ts` |
| 浏览器 | 本地二进制 | Azure 托管（始终最新） |
| Workers | CPU 核心数 | 最高 50（云端并行浏览器） |
| 操作系统 | 宿主机 | Linux 容器（一致性） |
| 网络 | 直接访问 | 需要 `exposeNetwork: '<loopback>'` |

**不能在 Azure PT 运行的：**
- 组件测试（CT）— 需要本地 Vite 开发服务器
- `playwright-cli` 交互模式 — 云浏览器仅 headless

**认证方式：**
- **推荐：** `DefaultAzureCredential`（Entra ID，`az login`）
- **快速上手：** Access Token（最长 90 天有效期）

---

### 4.7 playwright-explore（URL 探索）

**文件位置：** `.github/skills/playwright-explore/SKILL.md`

**适用场景：** 仅有 URL、没有源代码时的网站探索。

**五阶段工作流：**
1. **初始侦察** — 打开 URL、捕获快照、检测技术栈
2. **链接发现 & 站点地图** — 抓取所有内部链接、构建站点图
3. **逐页爬取** — 每个未访问页面的 DOM 分析
4. **交互元素探测** — 填充输入、点击按钮、记录状态变化
5. **关闭浏览器** — 生成探索报告

---

## 5. 配置文件体系

### 5.1 三层配置架构

```
playwright.config.ts              ← 基础配置（本地 E2E + Visual）
    │
    ├── playwright-ct.config.ts   ← 独立 CT 配置
    │
    └── playwright.service.config.ts ← Azure 云端配置（继承基础配置）
```

### 5.2 playwright.config.ts

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['html'], ['./tests/utils/vlm-reporter.ts']],  // VLM reporter 条件加载
  use: {
    baseURL: 'http://localhost:5173/UI-test-Demo/',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'e2e',    testDir: './tests/e2e'    },  // E2E 项目
    { name: 'visual', testDir: './tests/visual'  },  // Visual 项目
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173/UI-test-Demo/',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.3 playwright-ct.config.ts

```typescript
export default defineConfig({
  testDir: './tests/component',
  use: {
    ...devices['Desktop Chrome'],
    ctViteConfig: {
      css: { postcss: './postcss.config.js' },  // 复用项目 PostCSS/Tailwind
    },
  },
});
```

### 5.4 playwright.service.config.ts

```typescript
export default defineConfig(
  baseConfig,                         // 继承本地配置
  createAzurePlaywrightConfig({       // Azure 连接层
    exposeNetwork: '<loopback>',
    connectTimeout: 30000,
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
  }),
  { reporter: [..., '@azure/playwright/reporter'] }  // Azure 门户报告
);
```

---

## 6. npm 脚本命令映射

| 脚本 | 命令 | 说明 |
|------|------|------|
| `test:e2e` | `playwright test --project=e2e` | 本地 E2E 测试 |
| `test:visual` | `VLM_REVIEW=false playwright test --project=visual` | 本地视觉测试（无 VLM） |
| `test:visual:vlm` | `VLM_REVIEW=true playwright test --project=visual` | 本地视觉测试（带 VLM） |
| `test:ct` | `playwright test -c playwright-ct.config.ts` | 本地组件测试 |
| `test:all` | `VLM_REVIEW=false playwright test && playwright test -c playwright-ct.config.ts` | 全量本地测试 |
| `test:update-snapshots` | `VLM_REVIEW=false playwright test --project=visual --update-snapshots` | 更新视觉基线 |
| `test:azure` | `VLM_REVIEW=false playwright test --config=playwright.service.config.ts` | Azure 全量测试 |
| `test:azure:e2e` | `playwright test --config=playwright.service.config.ts --project=e2e` | Azure E2E 测试 |
| `test:azure:visual` | `VLM_REVIEW=false playwright test --config=playwright.service.config.ts --project=visual` | Azure 视觉测试（无 VLM） |
| `test:azure:visual:vlm` | `VLM_REVIEW=true playwright test --config=playwright.service.config.ts --project=visual` | Azure 视觉测试（带 VLM） |

**命令设计原则：**
- 显式的项目范围命令优于笼统的 catch-all
- Azure 命令与本地命令分离
- VLM 通过环境变量前缀显式启用

---

## 7. 完整工作流程：从请求到执行

### 7.1 组件测试完整流程

```
用户: "对 Carousel 组件进行组件测试"
         │
         ▼
┌─ ui-test (Router) ─────────────────────────────┐
│  识别关键词: "组件测试"                            │
│  路由目标: ui-test-component                     │
└────────────┬──────────────────────────────────── ┘
             ▼
┌─ ui-test-component ────────────────────────────┐
│                                                │
│  1️⃣  Discovery Gate                            │
│     └── 检查: 是否有 Carousel 的组件清单？         │
│         ├── 有 → 复用 props/events 信息          │
│         └── 无 → 调用 ui-test-discovery          │
│              └── 发现: Carousel.tsx              │
│                  props: items[], autoPlay, etc.  │
│                  events: onSlideChange           │
│                  providers: Router               │
│                                                │
│  2️⃣  Configuration Gate                        │
│     └── 检查: playwright-ct.config.ts 存在？     │
│         ├── 是 → 验证 testDir + framework import │
│         └── 否 → 调用 playwright-config 生成     │
│                                                │
│  3️⃣  Fixture Gate                              │
│     └── 检查: tests/fixtures/test-utils.ts?     │
│         ├── 是 → 验证包含 Router Provider        │
│         └── 否 → 使用 playwright-ct 模板生成     │
│                                                │
│  4️⃣  测试生成 (使用 playwright-ct Skill)         │
│     └── 生成 tests/component/Carousel.spec.tsx  │
│         ├── 渲染测试: 组件可见性                   │
│         ├── Props 测试: items 数据驱动             │
│         ├── 事件测试: onSlideChange 回调          │
│         └── 条件测试: autoPlay 开/关              │
│                                                │
│  5️⃣  执行                                       │
│     └── npx playwright test -c playwright-ct.config.ts │
│         tests/component/Carousel.spec.tsx       │
│                                                │
│  6️⃣  报告结果                                    │
│     ├── ✅ 通过 → 输出覆盖摘要                     │
│     └── ❌ 失败 → 报告根因 + 修复方向（不自动修复）  │
└────────────────────────────────────────────────┘
```

---

### 7.2 E2E 测试完整流程

```
用户: "运行 E2E 测试"
         │
         ▼
┌─ ui-test (Router) ─────────────────────────────┐
│  路由目标: ui-test-e2e                           │
└────────────┬──────────────────────────────────── ┘
             ▼
┌─ ui-test-e2e ──────────────────────────────────┐
│                                                │
│  1️⃣  Discovery Gate                            │
│     └── 检查路由清单、定位器策略、副作用清单         │
│                                                │
│  2️⃣  Configuration Gate                        │
│     └── 检查 playwright.config.ts 有 e2e 项目    │
│                                                │
│  3️⃣  测试生成 (使用 playwright-e2e Skill)        │
│     ├── tests/e2e/home.spec.ts                 │
│     ├── tests/e2e/destinations.spec.ts         │
│     ├── tests/e2e/about.spec.ts                │
│     ├── tests/e2e/favorites.spec.ts            │
│     ├── tests/e2e/trip-planner.spec.ts         │
│     └── tests/e2e/user-journey.spec.ts         │
│         ├── Dialog handling (confirm 删除行程)   │
│         ├── Navigation (首页→目的地→详情)         │
│         └── i18n switching (中文→英文)            │
│                                                │
│  4️⃣  执行                                       │
│     └── npx playwright test --project=e2e      │
│                                                │
│  5️⃣  报告结果                                    │
└────────────────────────────────────────────────┘
```

---

### 7.3 视觉回归测试完整流程

```
用户: "进行视觉测试"
         │
         ▼
┌─ ui-test (Router) ─────────────────────────────┐
│  路由目标: ui-test-visual                        │
└────────────┬──────────────────────────────────── ┘
             ▼
┌─ ui-test-visual ───────────────────────────────┐
│                                                │
│  1️⃣  Discovery Gate                            │
│     └── 页面清单: 8 个路由页面                    │
│                                                │
│  2️⃣  Configuration Gate                        │
│     └── visual 项目: maxDiffPixelRatio: 0.0005  │
│                                                │
│  3️⃣  Screenshot Stabilization                  │
│     ├── waitForLoadState('networkidle')         │
│     ├── animations: 'disabled'                 │
│     └── fullPage: true                         │
│                                                │
│  4️⃣  执行 (VLM_REVIEW=false)                    │
│     └── npm run test:visual                    │
│                                                │
│  5️⃣  结果判定                                    │
│     ├── ✅ 全部通过 → 输出 8/8 passed             │
│     └── ❌ 有差异 → ⛔ 仅报告差异                  │
│         ├── 报告: home-page.png 差异 2.3%       │
│         ├── 报告: about-page.png 差异 5.1%      │
│         ├── 询问: "是否需要更新基线？"              │
│         └── ⏹  停止等待用户响应                    │
│                                                │
│  用户: "更新基线"                                 │
│     └── npm run test:update-snapshots          │
│         └── 仅更新受影响的截图                     │
└────────────────────────────────────────────────┘
```

**当前项目测试用例覆盖（pages.visual.spec.ts）：**

| 测试名 | 路由 | 截图名 | 特殊处理 |
|-------|------|--------|---------|
| home page baseline | `./` | `home-page.png` + `home-hero.png` | — |
| destinations page baseline | `./destinations` | `destinations-page.png` + `destinations-hero.png` | — |
| destination detail page baseline | `./destinations/bali` | `destination-detail-bali.png` + `destination-detail-hero.png` | — |
| about page baseline | `./about` | `about-page.png` + `about-hero.png` | — |
| favorites page baseline | `./favorites` | `favorites-page.png` | 预置 localStorage: bali, paris, kyoto |
| trip planner page baseline | `./trips` | `trip-planner-page.png` | 预置 localStorage: seededTrips |
| trip edit page baseline | `./trips/visual-trip/edit` | `trip-edit-page.png` | 预置 localStorage: seededTrips |
| not found page baseline | `./nonexistent-route` | `not-found-page.png` | — |

---

### 7.4 VLM 增强视觉测试流程

```
用户: "运行 VLM 视觉测试"
         │
         ▼
┌─ ui-test (Router) → ui-test-visual ────────────┐
│                                                │
│  VLM_REVIEW=true                               │
│                                                │
│  对每个截图断言执行:                                │
│  ┌─────────────────────────────────────────┐   │
│  │ Step 1: toHaveScreenshot() 像素对比      │   │
│  │         ├── 通过 → passed_pixel → 下一个  │   │
│  │         └── 失败 → Step 2               │   │
│  │                                         │   │
│  │ Step 2: 检查 VLM 凭证                    │   │
│  │         ├── 无凭证 → 像素失败 → 测试失败   │   │
│  │         └── 有凭证 → Step 3              │   │
│  │                                         │   │
│  │ Step 3: 定位基线和实际截图文件              │   │
│  │         ├── 文件缺失 → 测试失败            │   │
│  │         └── 文件就绪 → Step 4             │   │
│  │                                         │   │
│  │ Step 4: 调用 Azure OpenAI GPT-4o        │   │
│  │         发送基线+实际截图                   │   │
│  │         附页面上下文（名称、路由、视口）      │   │
│  │                                         │   │
│  │ Step 5: 应用置信阈值 (default 0.7)       │   │
│  │         ├── confidence < 0.7 → 测试失败   │   │
│  │         └── confidence ≥ 0.7 → Step 6   │   │
│  │                                         │   │
│  │ Step 6: 根据 VLM 建议行动                 │   │
│  │         ├── pass (none/cosmetic) → 通过   │   │
│  │         ├── warn (minor) → 通过+警告      │   │
│  │         └── fail (breaking) → 测试失败    │   │
│  └─────────────────────────────────────────┘   │
│                                                │
│  输出: vlm-review-report.json                    │
│  包含: vlmCallCount, severity, confidence, areas │
└────────────────────────────────────────────────┘
```

---

### 7.5 Azure 云端执行流程

```
用户: "在 Azure 上运行视觉测试"
         │
         ▼
┌─ ui-test (Router) ─────────────────────────────┐
│  识别: "Azure" → 路由到 ui-test-governance       │
└────────────┬──────────────────────────────────── ┘
             ▼
┌─ ui-test-governance ───────────────────────────┐
│                                                │
│  1️⃣  验证 Azure 前置条件                        │
│     ├── playwright.service.config.ts 存在？     │
│     ├── PLAYWRIGHT_SERVICE_URL 已配置？          │
│     └── az login / Access Token 已就绪？        │
│                                                │
│  2️⃣  确定执行范围                                │
│     └── visual project (CT 不能在云端运行)       │
│                                                │
│  3️⃣  使用 playwright-azure Skill 执行           │
│     └── npx playwright test                    │
│         --config=playwright.service.config.ts   │
│         --project=visual                       │
│                                                │
│  执行细节:                                       │
│  ├── 云端浏览器: Azure 托管 Linux 容器            │
│  ├── 网络: exposeNetwork: '<loopback>'          │
│  ├── 并行度: workers 可达 50                     │
│  ├── 认证: DefaultAzureCredential               │
│  └── 报告: Azure Portal Dashboard               │
│                                                │
│  4️⃣  结果报告                                    │
│     ├── 本地 HTML 报告                           │
│     ├── Azure Portal 仪表板                      │
│     └── (可选) VLM Review JSON                   │
└────────────────────────────────────────────────┘
```

---

## 8. 门控机制详解

### 8.1 Discovery Gate（发现门控）

**适用：** 所有三个执行 Agent（component、e2e、visual）

```
是否有可用的发现输出？
├── 存在且覆盖目标 → 直接复用
├── 存在但不完整 → 调用 ui-test-discovery 做定向深入
└── 完全没有 → 通知用户需要发现 → 调用 ui-test-discovery
```

**关键规则：** 永不静默重复 `ui-test-discovery` 已产出的内容。

### 8.2 Configuration Gate（配置门控）

**适用：** 所有三个执行 Agent

| Agent | 检查项 | 缺失时操作 |
|-------|-------|-----------|
| component | `playwright-ct.config.ts` 存在性 | 调用 `playwright-config` |
| e2e | `playwright.config.ts` 中有 `e2e` project | 调用 `playwright-config` |
| visual | `playwright.config.ts` 中有 `visual` project | 调用 `playwright-config` |

**关键规则：** Agent 只验证，不生成。`playwright-config` 是配置生成的唯一所有者。

### 8.3 Fixture Gate（夹具门控）

**仅适用：** ui-test-component

| 检查项 | 所有者 |
|-------|-------|
| `tests/fixtures/test-utils.ts` (Provider 包装器) | `playwright-ct` Skill |
| `tests/fixtures/visual-helpers.ts` (截图稳定化) | `playwright-visual` Skill |
| `tests/fixtures/visual-test.ts` (VLM 混合夹具) | `playwright-vlm` Skill |

---

## 9. 基线管理策略

### 9.1 三种策略对比

| 维度 | Local-only | Azure-only | Hybrid |
|------|-----------|------------|--------|
| **基线所有者** | 开发者本机 | Azure CI Pipeline | 分域 |
| **基线位置** | Git 仓库 | CI 产物 | 两者 |
| **更新流程** | 开发者审查 → `git commit` | CI 在 main 生成 → PR 对比 | 本地开发 / Azure 门控 |
| **一致性** | 取决于开发者环境 | Linux 容器保证一致 | 开发灵活 + CI 一致 |
| **默认** | ✅ 是 | 否 | 否 |

### 9.2 当前项目基线

```
tests/visual/pages.visual.spec.ts-snapshots/
├── about-page-visual-darwin.png
├── destination-detail-bali-visual-darwin.png
├── destination-detail-hero-visual-darwin.png
├── destinations-hero-visual-darwin.png
├── destinations-page-visual-darwin.png
├── favorites-page-visual-darwin.png
├── home-page-visual-darwin.png
├── not-found-page-visual-darwin.png
├── trip-edit-page-visual-darwin.png
└── trip-planner-page-visual-darwin.png
```

**命名规则：** `{test-name}-{project}-{platform}.png`

### 9.3 基线更新操作

```bash
# 标准更新（通过 npm 脚本，禁用 VLM）
npm run test:update-snapshots

# 绕过 Argos reporter 的本地更新（如果 ARGOS_TOKEN 缺失）
npx playwright test --project=visual --update-snapshots --reporter=line
```

---

## 10. VLM 语义审查机制

### 10.1 混合夹具实现（visual-test.ts）

核心类 `assertScreenshotWithVlm` 的六步流程：

| 步骤 | 操作 | 失败处理 |
|------|------|---------|
| 1 | `toHaveScreenshot()` 像素对比 | 通过 → 结束 |
| 2 | 检查 `VLM_REVIEW=true` | 否 → 抛出像素错误 |
| 3 | 检查 Azure OpenAI 凭证 | 缺失 → 抛出像素错误 |
| 4 | 定位基线/实际截图文件 | 缺失 → 抛出像素错误 |
| 5 | 调用 GPT-4o Vision API | API 错误 → 抛出像素错误 |
| 6 | 应用置信度阈值 + 严重级别判定 | breaking/低置信 → 失败 |

### 10.2 VLM 报告输出

生成 `vlm-review-report.json`：

```json
{
  "generatedAt": "2026-03-20T...",
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
      "screenshotName": "home-page.png",
      "pixelDiffFailed": true,
      "vlmSeverity": "cosmetic",
      "vlmConfidence": 0.95,
      "action": "passed_vlm"
    }
  ]
}
```

### 10.3 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `VLM_REVIEW` | `false` | VLM 开关 |
| `VLM_MAX_CALLS` | `10` | 每次运行最大 API 调用数 |
| `VLM_CONFIDENCE_THRESHOLD` | `0.7` | 最低可信度 |
| `AZURE_OPENAI_ENDPOINT` | — | Azure OpenAI 端点 |
| `AZURE_OPENAI_API_KEY` | — | API 密钥（或用 Entra ID） |
| `AZURE_OPENAI_DEPLOYMENT` | `gpt-4o` | 模型部署名 |

---

## 11. 所有权边界矩阵

### 11.1 Agent 所有权

| 职责 | ui-test | discovery | component | e2e | visual | governance |
|------|---------|-----------|-----------|-----|--------|-----------|
| 请求路由 | ✅ | | | | | |
| 环境检测 | | ✅ | | | | |
| 路由发现 | | ✅ | | | | |
| 组件清单 | | ✅ | | | | |
| CT 测试生成 | | | ✅ | | | |
| E2E 测试生成 | | | | ✅ | | |
| 视觉测试生成 | | | | | ✅ | |
| 基线管理 | | | | | ✅ | |
| Azure 云执行 | | | | | | ✅ |
| CI/CD 门控 | | | | | | ✅ |
| VLM 策略 | | | | | | ✅ |

### 11.2 Skill 所有权

| 产物 | 所有者 Skill |
|------|------------|
| `playwright.config.ts` | `playwright-config` |
| `playwright-ct.config.ts` | `playwright-config` |
| `playwright.service.config.ts` | `playwright-config` |
| `package.json` scripts | `playwright-config` |
| `tests/fixtures/test-utils.ts` | `playwright-ct` |
| `tests/fixtures/visual-helpers.ts` | `playwright-visual` |
| `tests/fixtures/visual-test.ts` | `playwright-vlm` |
| `tests/utils/vlm-prompts.ts` | `playwright-vlm` |
| `tests/utils/vlm-reviewer.ts` | `playwright-vlm` |
| `tests/utils/vlm-reporter.ts` | `playwright-vlm` |

### 11.3 不跨界规则

| Agent | 禁止做 |
|-------|-------|
| ui-test | 不执行测试、不做发现、不解释实现细节 |
| discovery | 不生成最终测试、不混入 Azure 指导 |
| component | 不做跨页面旅程、不管视觉基线、不接触 Azure |
| e2e | 不管组件挂载、不管视觉基线、不解释 Azure |
| visual | 不管 Azure 策略、不解释 PR 治理、不隐式开启 VLM |
| governance | 不做日常 CT/E2E/Visual 测试、不模糊默认门控与 VLM |

---

## 12. 测试文件结构

```
tests/
├── component/                    # 组件测试（每个组件一个文件）
│   ├── Carousel.spec.tsx
│   ├── DestinationCard.spec.tsx
│   ├── FavoriteButton.spec.tsx
│   ├── FilterBar.spec.tsx
│   ├── Footer.spec.tsx
│   ├── Navbar.spec.tsx
│   ├── SearchBar.spec.tsx
│   ├── VisualBaseline.spec.tsx
│   └── WeatherWidget.spec.tsx
│
├── e2e/                          # E2E 测试
│   ├── about.spec.ts
│   ├── destinations.spec.ts
│   ├── favorites.spec.ts
│   ├── home.spec.ts
│   ├── i18n.spec.ts
│   ├── navigation.spec.ts
│   ├── not-found.spec.ts
│   ├── trip-edit.spec.ts
│   ├── trip-planner.spec.ts
│   └── user-journey.spec.ts
│
├── visual/                       # 视觉回归测试
│   └── pages.visual.spec.ts     # 8 个页面的视觉基线
│       └── pages.visual.spec.ts-snapshots/  # 基线截图
│
├── fixtures/                     # 共享测试夹具
│   ├── test-utils.ts            # CT Provider 包装器（playwright-ct 所有）
│   └── visual-test.ts           # VLM 混合夹具（playwright-vlm 所有）
│
└── utils/                        # 测试工具
    ├── vlm-prompts.ts           # GPT-4o Prompt（playwright-vlm 所有）
    ├── vlm-reviewer.ts          # VLM 审查逻辑（playwright-vlm 所有）
    └── vlm-reporter.ts          # VLM Reporter（playwright-vlm 所有）
```

---

## 附录：快速参考卡

### 日常测试命令

```bash
# 组件测试
npm run test:ct

# E2E 测试
npm run test:e2e

# 视觉测试
npm run test:visual

# 全量测试
npm run test:all

# 更新基线
npm run test:update-snapshots
```

### Azure 云端命令

```bash
# Azure E2E
npm run test:azure:e2e

# Azure 视觉（无 VLM）
npm run test:azure:visual

# Azure 视觉（带 VLM）
npm run test:azure:visual:vlm
```

### 调试命令

```bash
# 带浏览器界面运行
npx playwright test --project=e2e --headed

# 调试模式
npx playwright test --project=e2e --debug

# UI 模式
npx playwright test --project=e2e --ui

# 查看报告
npx playwright show-report
```
