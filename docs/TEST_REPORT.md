# TravelVista 测试报告

- 生成时间：2026-04-08 00:48:49 CST
- 测试环境：本地 macOS + Vite 开发服务器
- 应用地址：<http://localhost:5173/UI-test-Demo/>
- 测试框架：Playwright E2E / Playwright CT / Playwright Visual + VLM fallback

## 执行范围

本次测试覆盖以下三类自动化测试：

1. 组件测试
2. 端到端测试
3. 视觉回归测试

## 结果总览

| 测试类型 | 结果 | 通过数 | 说明 |
| --- | --- | ---: | --- |
| 组件测试 | 通过 | 10/10 | 覆盖收藏按钮、搜索栏、筛选栏、目的地卡片、天气组件 |
| 端到端测试 | 通过 | 5/5 | 覆盖首页、收藏、目的地筛选、i18n、行程规划流程 |
| 视觉回归 | 通过 | 5/5 | 覆盖桌面端中英文首页、筛选页、移动端详情页、创建行程弹窗 |
| 全量结果 | 通过 | 20/20 | 无失败用例 |

## 分项说明

### 组件测试

- 执行配置：`playwright-ct.config.ts`
- 验证点：
  - 收藏状态切换与 localStorage 同步
  - 搜索输入与本地化占位文案
  - 筛选栏多控件联动
  - 目的地卡片渲染与收藏交互
  - 天气组件数据展示与空态

### 端到端测试

- 执行配置：`playwright.config.ts`
- 验证点：
  - 首页内容渲染与详情页跳转
  - 收藏后在心愿单页面可见
  - 目的地筛选与排序
  - 中英文切换
  - 行程创建、编辑、活动添加与删除

### 视觉回归测试

- 执行配置：`playwright.config.ts`
- 验证模式：像素对比优先，VLM 作为失败兜底复审路径
- 本次结果：所有视觉断言均一次通过，未出现像素失败
- 结论：VLM 能力已按配置接入并执行测试链路，但本轮没有触发大模型复审，因此未生成单独的 `vlm-review-report.json` 或 `vlm-visual-report.html`

## 视觉基线产物

当前已生成 5 张视觉基线图：

1. `tests/visual/app.visual.spec.ts-snapshots/home-en-desktop-visual-darwin.png`
2. `tests/visual/app.visual.spec.ts-snapshots/home-zh-desktop-visual-darwin.png`
3. `tests/visual/app.visual.spec.ts-snapshots/destinations-filtered-zh-visual-darwin.png`
4. `tests/visual/app.visual.spec.ts-snapshots/detail-bali-mobile-zh-visual-darwin.png`
5. `tests/visual/app.visual.spec.ts-snapshots/trip-planner-create-modal-zh-visual-darwin.png`

## 报告产物

- Playwright HTML 报告：`playwright-report/index.html`
- 最近一次运行摘要：`test-results/.last-run.json`
- 本测试报告：`docs/TEST_REPORT.md`

## 结论

本次全套自动化测试执行完成，组件、E2E 与视觉回归全部通过，当前版本未发现阻断发布的问题。视觉回归链路已具备 VLM 复审能力，但由于本轮像素对比全绿，未产生额外的大模型审查报告文件。
