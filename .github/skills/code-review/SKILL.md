---
name: code-review
description: >-
  代码审查规则集与检查清单。Use when: code review, 代码审查, review code,
  审查代码, PR review, security audit, 安全审查, code quality, 代码质量,
  review my code, 帮我审查, code style, 代码风格, accessibility audit,
  performance review, maintainability analysis.
---

# Code Review Skill

⚠️ **Report-Only 策略：** 本 Skill 只报告发现项，不自动修复代码。当发现问题时生成结构化建议，等待用户明确指示后再修改源码。

## 目的

提供系统化的代码审查检查清单，覆盖 6 大维度：代码风格与规范、安全漏洞、性能问题、可访问性、可维护性与复杂度、测试覆盖建议。针对 React + TypeScript + Vite 项目优化。

## 严重级别

| 级别 | 含义 | 影响 |
|------|------|------|
| `CRITICAL` | 必须立即修复 | 阻塞发布，存在安全漏洞或数据丢失风险 |
| `ERROR` | 应尽快修复 | 违反最佳实践，可能导致运行时错误 |
| `WARNING` | 建议修复 | 代码质量问题，影响可维护性或性能 |
| `INFO` | 供参考 | 改进建议，非阻塞性 |

## 输出格式

每个发现项使用以下格式：

```
[SEVERITY] Category > Rule
- File: path/to/file.tsx#L10-L15
- Issue: 具体问题描述
- Suggestion: 修复建议（含代码示例）
```

## 审查维度检查清单

### 1. 代码风格与规范

与项目 ESLint（`typescript-eslint` + `react-hooks` + `react-refresh`）和 TypeScript strict 模式对齐。

| # | 检查项 | 严重级别 |
|---|--------|----------|
| S1 | 命名规范：组件用 PascalCase，hooks 用 `use` 前缀，常量用 UPPER_SNAKE_CASE，变量/函数用 camelCase | WARNING |
| S2 | 文件命名：组件文件用 PascalCase（`MyComponent.tsx`），工具函数用 camelCase（`utils.ts`） | WARNING |
| S3 | import 排序：React/外部库 → 内部模块 → 类型 → 样式，各组之间空行分隔 | INFO |
| S4 | 未使用的变量和参数（对齐 `noUnusedLocals`、`noUnusedParameters`） | ERROR |
| S5 | 显式返回类型：导出函数和 hooks 应声明返回类型 | WARNING |
| S6 | `any` 类型使用：避免 `any`，使用 `unknown` + 类型守卫代替 | ERROR |
| S7 | `React.FC` 使用：优先使用函数声明 + Props 类型参数，而非 `React.FC` | INFO |
| S8 | 魔法字符串：重复出现的字面量应提取为常量或枚举 | WARNING |
| S9 | React Hooks 规则：hooks 不在条件/循环中调用（对齐 `eslint-plugin-react-hooks`） | ERROR |
| S10 | console.log 残留：生产代码中不应存在调试用的 `console.log` | WARNING |

### 2. 安全漏洞 (OWASP)

| # | 检查项 | 严重级别 |
|---|--------|----------|
| X1 | XSS：检查 `dangerouslySetInnerHTML` 使用，确保输入已清洗 | CRITICAL |
| X2 | XSS：用户输入直接拼接到 DOM、URL 或 `eval()` 中 | CRITICAL |
| X3 | 敏感数据暴露：API 密钥、密码、token 硬编码在前端代码中 | CRITICAL |
| X4 | URL 注入：用户输入未校验直接用于 `window.location`、`href` 或 `fetch` URL | ERROR |
| X5 | 不安全的第三方依赖：使用已知有漏洞的 npm 包版本 | ERROR |
| X6 | localStorage 敏感数据：token、密码等敏感信息不应存入 localStorage | ERROR |
| X7 | 不安全的正则表达式：可能触发 ReDoS 的正则（回溯爆炸） | WARNING |
| X8 | target="_blank" 安全：缺少 `rel="noopener noreferrer"` | WARNING |
| X9 | 不安全的 iframe：缺少 `sandbox` 属性 | WARNING |
| X10 | HTTP 资源混用：HTTPS 页面中加载 HTTP 资源 | ERROR |

### 3. 性能问题

| # | 检查项 | 严重级别 |
|---|--------|----------|
| P1 | 不必要的重渲染：大型组件缺少 `React.memo`，或每次渲染创建新对象/函数作为 props | WARNING |
| P2 | 缺少 `useMemo`/`useCallback`：昂贵的计算或传递给子组件的回调未记忆化 | WARNING |
| P3 | useEffect 依赖项：缺失或多余的依赖项导致无限循环或过时闭包 | ERROR |
| P4 | 大型 bundle：在首屏引入大型库但未使用 `React.lazy` + `Suspense` 懒加载 | WARNING |
| P5 | 图片优化：缺少 `width`/`height` 属性（引起布局偏移）、未使用 `loading="lazy"` | WARNING |
| P6 | 事件监听泄漏：`useEffect` 中添加事件监听但未在清理函数中移除 | ERROR |
| P7 | 不必要的状态：可通过 props 或已有状态派生的值不应用 `useState` | INFO |
| P8 | key 属性：列表渲染使用 index 作为 key（当列表可增删时） | WARNING |
| P9 | CSS 动画性能：使用 `top`/`left`/`width`/`height` 而非 `transform`/`opacity` 做动画 | INFO |
| P10 | 频繁的 setState：在循环中多次 `setState` 而非批量更新 | WARNING |

### 4. 可访问性 (a11y / WCAG 2.1 AA)

| # | 检查项 | 严重级别 |
|---|--------|----------|
| A1 | 语义 HTML：使用 `<button>` 而非 `<div onClick>`，使用 `<nav>`、`<main>`、`<article>` 等 | ERROR |
| A2 | 图片替代文本：`<img>` 缺少 `alt` 属性，或装饰性图片未使用 `alt=""` + `aria-hidden` | ERROR |
| A3 | 表单标签：表单控件缺少关联的 `<label>` 或 `aria-label` | ERROR |
| A4 | 键盘导航：交互元素不可通过 Tab 键聚焦，或缺少键盘事件处理 | ERROR |
| A5 | 焦点管理：模态框/弹出层打开时未将焦点移入，关闭时未恢复焦点 | WARNING |
| A6 | 颜色对比度：文本与背景的对比度不满足 WCAG AA（4.5:1 正常文本，3:1 大文本） | WARNING |
| A7 | ARIA 属性：使用了不适当的 ARIA 角色或属性（如在原生语义元素上冗余添加 role） | WARNING |
| A8 | 跳过导航链接：页面缺少 "Skip to main content" 链接 | INFO |
| A9 | 动态内容通知：状态变更（如提交成功/失败）未通过 `aria-live` 区域通知屏幕阅读器 | WARNING |
| A10 | 触摸目标尺寸：交互元素小于 44×44px（移动端） | INFO |

### 5. 可维护性与复杂度

| # | 检查项 | 严重级别 |
|---|--------|----------|
| M1 | 函数长度：单个函数超过 50 行（建议拆分） | WARNING |
| M2 | 文件长度：单个文件超过 300 行（建议拆分组件或提取逻辑） | WARNING |
| M3 | 组件职责单一性：一个组件同时处理数据获取、业务逻辑和 UI 渲染 | WARNING |
| M4 | 魔法数字：代码中硬编码数字未提取为命名常量 | WARNING |
| M5 | 重复代码：相似逻辑在多处重复出现（DRY 原则） | WARNING |
| M6 | 深层嵌套：条件/循环嵌套超过 3 层 | WARNING |
| M7 | 类型安全：使用类型断言 `as` 而非类型守卫 | INFO |
| M8 | 错误边界：App 级别或关键子树缺少 ErrorBoundary | INFO |
| M9 | 硬编码配置：环境相关的 URL、端口等硬编码而非读取环境变量 | WARNING |
| M10 | 过度抽象：仅使用一次的逻辑被过度封装为 hook 或工具函数 | INFO |

### 6. 测试覆盖建议

| # | 检查项 | 严重级别 |
|---|--------|----------|
| T1 | 关键业务逻辑无测试：工具函数（`utils/`）中的核心逻辑缺少单元测试 | WARNING |
| T2 | 组件无 CT 覆盖：公共组件（`components/`）缺少 Playwright Component Test | WARNING |
| T3 | 页面无 E2E 覆盖：主要页面路由缺少 Playwright E2E 测试 | INFO |
| T4 | 边界情况未覆盖：空数据、异常输入、网络错误等边界条件缺少测试 | WARNING |
| T5 | 视觉回归缺失：关键 UI 组件缺少 Playwright Visual 截图基线 | INFO |
| T6 | i18n 测试缺失：多语言切换场景缺少覆盖 | INFO |

## 审查流程

1. **确定范围**：根据用户指定的文件/目录/PR diff 确定审查范围。
2. **读取代码**：读取目标文件的完整内容。
3. **逐维度检查**：按上述 6 大维度的检查清单逐项审查。
4. **记录发现**：每个发现项使用标准格式记录（严重级别 + 分类 + 文件 + 问题 + 建议）。
5. **汇总排序**：按严重级别从 CRITICAL → INFO 排序所有发现项。
6. **生成报告**：输出结构化审查报告（见报告模板）。

## 报告模板

```markdown
# 代码审查报告

- 审查时间：{ISO timestamp}
- 审查范围：{文件列表/目录/PR 描述}
- 项目：{项目名称}

## 审查摘要

| 维度 | CRITICAL | ERROR | WARNING | INFO | 小计 |
|------|:--------:|:-----:|:-------:|:----:|-----:|
| 代码风格与规范 | 0 | 0 | 0 | 0 | 0 |
| 安全漏洞 | 0 | 0 | 0 | 0 | 0 |
| 性能问题 | 0 | 0 | 0 | 0 | 0 |
| 可访问性 | 0 | 0 | 0 | 0 | 0 |
| 可维护性与复杂度 | 0 | 0 | 0 | 0 | 0 |
| 测试覆盖建议 | 0 | 0 | 0 | 0 | 0 |
| **合计** | **0** | **0** | **0** | **0** | **0** |

## 详细发现

### 1. 代码风格与规范

{发现项或"✅ 未发现问题"}

### 2. 安全漏洞

{发现项或"✅ 未发现问题"}

### 3. 性能问题

{发现项或"✅ 未发现问题"}

### 4. 可访问性

{发现项或"✅ 未发现问题"}

### 5. 可维护性与复杂度

{发现项或"✅ 未发现问题"}

### 6. 测试覆盖建议

{发现项或"✅ 当前覆盖充分"}

## 最终裁定

**{PASS / CONDITIONAL PASS / FAIL}**

{裁定理由，1-3 句话概述整体代码质量}
```

### 裁定标准

| 裁定 | 条件 |
|------|------|
| **PASS** | 无 CRITICAL 或 ERROR 级别发现 |
| **CONDITIONAL PASS** | 无 CRITICAL，存在 ERROR 但均有明确修复路径 |
| **FAIL** | 存在 CRITICAL 级别发现，或 ERROR 数量超过 10 个 |

## PR 差异审查模式

当用户请求审查 PR 或 diff 时：

1. 仅审查变更的文件。
2. 优先关注新增和修改的代码行。
3. 关注变更是否引入新问题，而非审查未变更的已有代码。
4. 在报告中标注每个发现项是「新增问题」还是「已有问题」。

## 不做

- 不自动修复代码 — 只报告发现和建议
- 不修改 ESLint、TypeScript 或其他配置文件
- 不生成测试代码 — 仅建议测试覆盖方向
- 不审查 `node_modules/`、`dist/`、`playwright-report/`、`.git/` 等生成/依赖目录
- 不审查图片、字体等二进制文件
