# TravelVista — 旅游目的地浏览网站

> React + TypeScript + Vite 单页应用，搭配 Playwright 多层自动化测试体系

[![Deploy](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://nickhou1983.github.io/UI-test-Demo/)

## 项目概览

| 项目 | 说明 |
| --- | --- |
| 线上地址 | <https://nickhou1983.github.io/UI-test-Demo/> |
| 技术栈 | React 19 · TypeScript 5.9 · Vite 8 · Tailwind CSS 4 · react-i18next |
| 测试框架 | Playwright E2E / CT / Visual + VLM (可选) |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

## 测试命令

| 命令 | 说明 |
| --- | --- |
| `npm run test:ct` | 组件测试 (Playwright CT) |
| `npm run test:e2e` | 端到端测试 |
| `npm run test:visual` | 视觉回归测试 (VLM 关闭) |
| `npm run test:visual:vlm` | 视觉回归 + VLM 审查 |
| `npm run test:all` | 运行全部测试 |
| `npm run test:update-snapshots` | 更新视觉基线截图 |
| `npm run test:azure:e2e` | Azure 云端 E2E |
| `npm run test:azure:visual` | Azure 云端视觉回归 |

---

## UI-Test Agent 工作流架构

本仓库采用**分层路由 + 专业 Agent**的自动化测试架构，由 `ui-test` 入口统一调度，下辖 Discovery、Component、E2E、Visual、Governance 五个专业 Agent，配合 7 个 Playwright Skill 完成从发现到执行的全流程。

### 全局架构

```mermaid
flowchart TB
    subgraph Entry["🎯 入口层"]
        UT["ui-test<br/>(路由入口)"]
    end

    subgraph Routing["📌 路由决策"]
        direction TB
        R1{"组件测试？<br/>CT / props / events"}
        R2{"E2E 测试？<br/>页面流 / 用户旅程"}
        R3{"视觉回归？<br/>截图 / 基线"}
        R4{"分析优先？<br/>探索代码库"}
        R5{"云端 / CI / VLM？<br/>Azure / 治理"}
    end

    subgraph Discovery["🔍 Discovery 共享层"]
        DIS["ui-test-discovery"]
        DIS_MIN["最小检查<br/>• 代码库 vs URL<br/>• Playwright 就绪<br/>• 配置文件验证"]
        DIS_STD["标准发现<br/>• 框架/构建检测<br/>• 路由清单<br/>• 组件清单<br/>• i18n 检测"]
        DIS_DEEP["深度发现<br/>• 运行时 DOM 探索<br/>• Locator 策略<br/>• Journey 映射<br/>• 副作用清单"]
    end

    subgraph Agents["⚙️ 专业 Agent 层"]
        CT["ui-test-component<br/>组件测试"]
        E2E["ui-test-e2e<br/>端到端测试"]
        VIS["ui-test-visual<br/>视觉回归测试"]
        GOV["ui-test-governance<br/>治理 & 云端"]
    end

    subgraph Skills["📦 Skill 层"]
        SK_CT["playwright-ct"]
        SK_E2E["playwright-e2e"]
        SK_VIS["playwright-visual"]
        SK_CFG["playwright-config"]
        SK_AZ["playwright-azure"]
        SK_VLM["playwright-vlm"]
        SK_EXP["playwright-explore"]
    end

    subgraph Outputs["📊 输出"]
        RPT["docs/TEST_REPORT.md"]
        HTML["playwright-report/"]
        BASE["tests/visual/__screenshots__/"]
    end

    UT --> R1
    R1 -->|是| CT
    R1 -->|否| R2
    R2 -->|是| E2E
    R2 -->|否| R3
    R3 -->|是| VIS
    R3 -->|否| R4
    R4 -->|是| DIS
    R4 -->|否| R5
    R5 -->|是| GOV
    R5 -->|否| DIS

    CT -.->|Discovery Gate| DIS
    E2E -.->|Discovery Gate| DIS
    VIS -.->|Discovery Gate| DIS

    DIS --> DIS_MIN --> DIS_STD --> DIS_DEEP

    CT --> SK_CT
    CT --> SK_CFG
    E2E --> SK_E2E
    E2E --> SK_CFG
    VIS --> SK_VIS
    VIS --> SK_CFG
    GOV --> SK_AZ
    GOV --> SK_VLM
    GOV --> SK_CFG

    VIS -.->|"升级 (用户显式请求)"| GOV

    CT -->|"更新: 组件测试"| RPT
    E2E -->|"更新: 端到端测试"| RPT
    VIS -->|"更新: 视觉回归"| RPT
    CT --> HTML
    E2E --> HTML
    VIS --> HTML
    VIS --> BASE
```

### 路由决策说明

| 用户请求 | 路由目标 |
| --- | --- |
| 组件测试 / CT / props / events | `ui-test-component` |
| E2E / 页面流 / 用户旅程 | `ui-test-e2e` |
| 视觉回归 / 截图 / 基线管理 | `ui-test-visual` |
| 分析代码库 / 探索组件 | `ui-test-discovery` |
| Azure 云端 / CI/CD / VLM | `ui-test-governance` |

---

### Agent 通用门控流程

每个测试 Agent 在执行前必须通过 6 步门控，确保环境就绪、配置正确、产物可追溯。

```mermaid
flowchart LR
    subgraph GateFlow["🚦 Agent 通用门控流程"]
        direction TB
        START(["Agent 收到请求"]) --> DG

        subgraph DG["① Discovery Gate"]
            DG1{"discovery-meta<br/>存在且 scope 足够？"}
            DG1 -->|是| DG_OK["✅ 复用已有 Discovery"]
            DG1 -->|scope 不足| DG_DEEP["🔄 调用 Discovery 深度补充"]
            DG1 -->|不存在| DG_NEW["🆕 调用 Discovery 全量分析"]
        end

        DG_OK & DG_DEEP & DG_NEW --> CG

        subgraph CG["② Configuration Gate"]
            CG1{"配置文件存在<br/>且设置正确？"}
            CG1 -->|是| CG_OK["✅ 直接使用"]
            CG1 -->|否| CG_GEN["🔧 playwright-config 生成"]
        end

        CG_OK & CG_GEN --> FG

        subgraph FG["③ Fixture Gate"]
            FG1{"测试 fixtures<br/>已存在？"}
            FG1 -->|是| FG_OK["✅ 复用"]
            FG1 -->|否| FG_GEN["🔧 对应 Skill 生成"]
        end

        FG_OK & FG_GEN --> GEN["④ 测试生成"]
        GEN --> RUN["⑤ 测试执行"]
        RUN --> REPORT["⑥ Report Gate<br/>更新 TEST_REPORT.md"]
    end
```

| 门控 | 职责 | 失败时动作 |
| --- | --- | --- |
| Discovery Gate | 检查 `discovery-meta` 头，确认分析深度足够 | 调用 `ui-test-discovery` 补充 |
| Configuration Gate | 验证 Playwright 配置文件存在且设置正确 | 调用 `playwright-config` Skill 生成 |
| Fixture Gate | 确认 `tests/fixtures/` 中工具类就绪 | 调用对应 Skill 生成 |
| Report Gate | 更新 `docs/TEST_REPORT.md` 中本 Agent 拥有的段落 | 仅更新自己的段落，不覆盖他人 |

---

### 视觉测试关键决策流

视觉回归测试有两个核心决策路径：**基线更新策略** 和 **VLM 审查启用**。

```mermaid
flowchart TB
    subgraph VisualDecision["📸 视觉测试 - 基线更新决策流"]
        direction TB
        VT_RUN["运行视觉测试"] --> VT_CHECK{"像素差异<br/>检测到？"}
        VT_CHECK -->|无差异| VT_PASS["✅ 全部通过"]
        VT_CHECK -->|有差异| VT_REPORT["📋 报告差异<br/>文件路径 + 差异百分比"]
        VT_REPORT --> VT_ASK["❓ 询问用户：<br/>是否更新基线？"]
        VT_ASK --> VT_WAIT["⏳ 等待用户响应"]
        VT_WAIT -->|"用户确认更新"| VT_UPDATE["🔄 仅更新受影响测试的基线"]
        VT_WAIT -->|"用户拒绝更新"| VT_DOC["📝 记录为回归问题"]
        VT_WAIT -->|"无响应"| VT_NO["⛔ 不自动更新 (硬规则)"]
    end

    subgraph VLMDecision["🤖 VLM 审查决策"]
        direction TB
        VLM_REQ{"用户显式<br/>请求 VLM？"} -->|否| VLM_OFF["VLM_REVIEW=false<br/>(默认关闭)"]
        VLM_REQ -->|是| VLM_PRE["检查前置条件<br/>• Azure OpenAI endpoint<br/>• API key / Entra ID<br/>• 成本预算"]
        VLM_PRE --> VLM_CFG["设置参数<br/>• VLM_MAX_CALLS=10<br/>• VLM_CONFIDENCE=0.7"]
        VLM_CFG --> VLM_STRAT["像素优先 → VLM 兜底策略"]
    end
```

> **⛔ 硬规则**：视觉测试失败后，**禁止自动更新基线**，必须等待用户确认。

---

### Skill 所有权与配置矩阵

```mermaid
graph LR
    subgraph Ownership["🗂️ Skill 与 Fixture 所有权矩阵"]
        direction TB

        subgraph AgentSkill["Agent → Skill 映射"]
            CT_A["ui-test-component"] -->|主 Skill| SK1["playwright-ct"]
            E2E_A["ui-test-e2e"] -->|主 Skill| SK2["playwright-e2e"]
            VIS_A["ui-test-visual"] -->|主 Skill| SK3["playwright-visual"]
            GOV_A["ui-test-governance"] -->|参考| SK4["playwright-azure"]
            GOV_A -->|参考| SK5["playwright-vlm"]
            CT_A & E2E_A & VIS_A & GOV_A -->|配置| SK6["playwright-config"]
        end

        subgraph Configs["配置文件"]
            CFG1["playwright-ct.config.ts"]
            CFG2["playwright.config.ts"]
            CFG3["playwright.service.config.ts"]
        end

        subgraph Fixtures["Fixture 文件"]
            FIX1["tests/fixtures/test-utils.ts"]
            FIX2["tests/fixtures/visual-helpers.ts"]
            FIX3["tests/fixtures/visual-test.ts"]
        end

        SK1 -->|拥有| FIX1
        SK3 -->|拥有| FIX2
        SK5 -->|拥有| FIX3

        SK6 -->|生成| CFG1
        SK6 -->|生成| CFG2
        SK6 -->|生成| CFG3
    end
```

| Agent | 主 Skill | 拥有的 Fixture | 报告段落 |
| --- | --- | --- | --- |
| `ui-test-component` | `playwright-ct` | `tests/fixtures/test-utils.ts` | 组件测试 |
| `ui-test-e2e` | `playwright-e2e` | — | 端到端测试 |
| `ui-test-visual` | `playwright-visual` | `tests/fixtures/visual-helpers.ts` | 视觉回归测试 |
| `ui-test-governance` | `playwright-azure` · `playwright-vlm` | `tests/fixtures/visual-test.ts` | — (治理策略) |

> `playwright-config` 是所有配置文件（CT / E2E / Azure）的**唯一生成者**。

---

### Discovery 输出契约

Discovery Agent 为下游 Agent 提供标准化的分析输出，通过 `discovery-meta` 头标记新鲜度和深度。

| 下游 Agent | 接收的 Discovery 数据 |
| --- | --- |
| **Component** | 组件名 · import 路径 · Props(必需/可选) · Events · Provider 依赖 |
| **E2E** | 路由清单 · 导航元素 · 交互流 · Locator 策略 · 用户旅程 · 副作用清单 |
| **Visual** | 页面清单 · 路由 URL · i18n 变体 · 响应式目标 · 副作用警告 |

```html
<!-- discovery-meta
  generated: {ISO-8601 timestamp}
  scope: minimum | standard | deep
  routes-found: {count}
  components-found: {count}
  i18n-detected: true | false
  side-effects-found: {count}
-->
```

---

## 项目结构

```text
├── src/
│   ├── components/     # 可复用 UI 组件
│   ├── pages/          # 页面组件
│   ├── data/           # 静态数据
│   ├── i18n/           # 国际化资源 (zh/en)
│   ├── types/          # TypeScript 类型定义
│   └── utils/          # 工具函数
├── tests/
│   ├── component/      # Playwright CT 组件测试
│   ├── e2e/            # Playwright E2E 端到端测试
│   ├── visual/         # Playwright 视觉回归测试
│   ├── fixtures/       # 测试工具 & Provider 包装
│   └── utils/          # 测试辅助工具
├── .github/
│   ├── agents/         # UI-Test Agent 定义
│   └── skills/         # Playwright Skill 定义
├── playwright.config.ts         # E2E + Visual 配置
├── playwright-ct.config.ts      # 组件测试配置
└── playwright.service.config.ts # Azure 云端配置
```

## License

MIT
