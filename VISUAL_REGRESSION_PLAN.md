# UI-test-Demo 视觉回归测试方案

## 1. 目标

为当前仓库建立一套可持续的 UI 视觉回归测试方案，覆盖页面级回归、关键交互状态、响应式视口和中英文切换，并且尽量复用现有 Playwright 测试基础设施，避免重复建设。

## 2. 当前项目现状

### 已有基础

- 已使用 Playwright 作为主测试框架
- 已存在 [playwright.config.ts](playwright.config.ts)
- 已存在 [playwright.service.config.ts](playwright.service.config.ts)
- 已存在 [package.json](package.json) 中的视觉测试脚本入口
- 已有较完整的 E2E 测试集，位于 [tests/e2e](tests/e2e)

### 当前缺口

- `visual` project 已配置，但 `tests/visual` 目录尚未落地
- 尚无任何视觉快照基线
- 尚无页面级视觉回归测试
- 尚无响应式视觉覆盖
- 尚无中英文视觉覆盖
- 尚无关键异常状态的视觉覆盖

## 3. 方案选型结论

### 推荐顺序

1. Playwright 原生视觉回归
2. Azure Playwright Workspace
3. Percy
4. Applitools Eyes
5. Chromatic
6. Happo
7. BackstopJS

### 最终建议

当前阶段优先采用 Playwright 原生视觉回归。

原因如下：

- 与现有仓库技术栈完全一致
- 无需引入新的测试运行时
- 可直接复用现有 `baseURL`、CI、页面路由和测试目录结构
- 对当前项目这种页面型应用来说，接入成本最低，落地速度最快
- 在没有 Storybook 的前提下，组件导向平台的收益不高

### 暂不优先采用的方案

#### Chromatic

适合已有 Storybook 和组件库工作流的团队。当前仓库没有 Storybook，强行引入会增加额外维护成本。

#### Happo

同样更适合 Storybook 或组件库导向场景。当前项目不是这类工作流。

#### Percy / Applitools

二者都适合更大规模的团队协作、跨浏览器矩阵和集中式视觉审阅，但对当前仓库来说偏重，现阶段性价比不高。

#### BackstopJS

虽然开源且可控，但会和现有 Playwright 体系重复建设，不如直接沿用 Playwright。

## 4. 分阶段落地路线

### Phase 1: 先落地 Playwright 页面级视觉回归

目标是用最小成本建立第一版稳定基线。

#### 需要新增的目录

- `tests/visual/`

#### 需要覆盖的页面

- 首页 `/`
- 目的地列表页 `/destinations`
- 目的地详情页 `/destinations/bali`
- 关于页 `/about`
- 无效详情页 `/destinations/nonexistent-id`

#### 需要覆盖的视口

- Mobile: `375 x 812`
- Tablet: `768 x 1024`
- Desktop: `1280 x 720`

#### 需要覆盖的语言

- 中文 `zh`
- 英文 `en`

#### 需要覆盖的关键状态

- 默认加载状态
- 列表页筛选结果状态
- 列表页无结果状态
- 首页搜索无结果状态
- 移动端导航菜单展开状态

### Phase 2: 统一云端执行与基线环境

当页面级视觉测试稳定后，优先把页面视觉回归统一到 Azure Playwright Workspace：

- 使用 Azure Linux 作为页面基线的权威环境
- 在 CI 中直接执行 Playwright visual project 并以测试结果判定通过/失败
- 保持本地视觉测试用于快速验证，避免多环境基线混用
- 通过 artifact 和 HTML 报告完成差异排查

这一步不会推翻 Phase 1，而是把执行环境收敛到单一可信来源。

### Phase 3: 组件级视觉测试

只有当仓库未来引入 Storybook 或形成可复用组件库后，再考虑：

- Chromatic
- Happo
- Applitools Storybook Addon

这一阶段的重点是覆盖组件状态，而不是页面级路由。

## 5. 页面视觉覆盖矩阵

### 首页 `/`

必测场景：

- 默认状态，中文，Desktop
- 默认状态，英文，Desktop
- Mobile 视口下的 Hero 和导航
- 搜索无结果状态
- 旅行主题区可见状态
- 评价轮播首屏状态
- 移动端菜单展开状态

### 目的地列表页 `/destinations`

必测场景：

- 默认状态，12 个目的地
- `?type=beach` 筛选状态
- `?type=city` 筛选状态
- 关键词无结果状态
- Mobile 视口下的筛选栏堆叠
- 英文语言下的列表页布局

### 目的地详情页 `/destinations/bali`

必测场景：

- 默认详情页布局
- 图片画廊区域
- 景点卡片区
- 侧边栏概览和实用信息区
- Mobile 视口下的侧边栏堆叠布局
- 英文语言下的详情布局

### 关于页 `/about`

必测场景：

- 默认状态
- 团队区域
- 联系方式区域
- Mobile 视口布局
- 英文语言版本

### 错误页 `/destinations/nonexistent-id`

必测场景：

- Not Found 页面默认视觉状态
- 返回按钮区域可见

## 6. 快照稳定性要求

为了降低误报，需要在视觉测试里明确处理以下问题：

- 在统一环境中生成和更新基线
- 对轮播、动画、过渡效果做稳定化处理
- 对懒加载图片确保加载完成后再截图
- 对可能波动的元素使用统一等待策略
- 尽量减少依赖网络时序的截图时机

建议做法：

- 使用 `await page.waitForLoadState('networkidle')`
- 对关键图片区增加显式可见断言
- 在截图前等待轮播和动画稳定
- 必要时使用 `stylePath` 隐藏不稳定元素或关闭动画

## 7. 建议的测试组织方式

建议在 `tests/visual/` 下按页面拆分文件：

- `home.visual.spec.ts`
- `destinations.visual.spec.ts`
- `destination-detail.visual.spec.ts`
- `about.visual.spec.ts`
- `not-found.visual.spec.ts`

建议在每个文件中：

- 使用 `test.describe()` 按页面分组
- 通过视口矩阵循环减少重复代码
- 通过辅助函数统一语言切换逻辑
- 为每个截图命名时显式包含页面、语言、视口和状态

命名建议示例：

- `home-zh-desktop-default.png`
- `home-zh-mobile-menu-open.png`
- `destinations-en-tablet-type-beach.png`
- `detail-bali-zh-desktop-default.png`

## 8. 与当前仓库最匹配的实施建议

### 推荐做法

先只做页面级视觉回归，不急于做组件级视觉测试。

原因：

- 当前仓库已经有成熟的页面路由和 E2E 用例
- 当前没有 Storybook，也没有组件故事文件
- 页面级视觉回归能最快覆盖最主要的 UI 风险

### 不建议的做法

- 现阶段直接引入 Chromatic
- 现阶段为了视觉测试改造整套组件开发流程
- 同时并行接入多个视觉平台

## 9. 验收标准

第一版视觉回归方案完成后，至少应满足以下条件：

- 已创建 `tests/visual/` 并可执行
- 至少覆盖 5 个页面或页面状态
- 至少覆盖 3 个响应式视口
- 至少覆盖中英文两种语言中的关键页面
- 可通过 `npm run test:visual` 执行
- 可通过 `npm run test:update-snapshots` 更新基线
- 基线截图已纳入版本控制并可审阅

## 10. 一句话决策

对 UI-test-Demo 来说，最优路径不是引入额外视觉审查平台，而是把现有 Playwright 视觉回归真正落地，并用 Azure Playwright Workspace 统一页面视觉执行环境。
