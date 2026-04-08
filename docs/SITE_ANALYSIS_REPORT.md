<!-- discovery-meta
  generated: 2026-04-08T01:16:00.000Z
  scope: deep
  routes-found: 8
  components-found: 10
  i18n-detected: true
  side-effects-found: 4
-->

# TravelVista 站点综合分析报告

> 生成时间：2026-04-08  
> 分析范围：源代码 + 运行时 DOM 探索  
> 站点地址：`http://localhost:5173/UI-test-Demo/`

---

## 1. 项目概述与技术栈

| 维度 | 详情 |
|------|------|
| 项目名称 | TravelVista — 旅行目的地展示与行程规划平台 |
| 框架 | React 19 + TypeScript 5.9 |
| 构建工具 | Vite 8 |
| 路由 | React Router DOM 7 (BrowserRouter, `base: /UI-test-Demo/`) |
| 样式方案 | Tailwind CSS 4 + PostCSS |
| 国际化 | i18next + react-i18next（中文/英文双语） |
| 图标 | react-icons |
| 状态管理 | React useState/useEffect + localStorage 持久化 |
| 测试框架 | Playwright (E2E / CT / Visual) |
| 云测试 | Azure Playwright Testing (`@azure/playwright`) |
| 部署基路径 | `/UI-test-Demo/`（Vite base 配置） |

### 依赖列表

**运行时依赖：**
- `react` / `react-dom` 19.x
- `react-router-dom` 7.x
- `i18next` 25.x / `react-i18next` 16.x

**开发依赖（关键）：**
- `@playwright/test` 1.58 / `@playwright/experimental-ct-react` 1.58
- `@azure/playwright` 1.1 / `@azure/identity` 4.x
- `tailwindcss` 4.x / `@tailwindcss/postcss`
- `vite` 8.x / `@vitejs/plugin-react` 6.x
- `openai` 6.x（VLM 视觉回归审查用）
- `sharp` 0.34（图像处理）

---

## 2. 路由 / 页面清单

| # | 路由路径 | 页面组件 | 描述 | 支持参数 |
|---|---------|---------|------|---------|
| 1 | `/` | `HomePage` | 首页 — Hero 区域、搜索、热门目的地、旅行主题、旅行者评价轮播 | — |
| 2 | `/destinations` | `DestinationsPage` | 目的地列表 — 筛选/搜索/排序/分页展示 | `?region=`, `?type=` |
| 3 | `/destinations/:id` | `DestinationDetailPage` | 目的地详情 — 图片画廊、景点、评论、天气、实用信息、相关推荐 | `:id` (bali, kyoto, santorini 等) |
| 4 | `/favorites` | `FavoritesPage` | 心愿单 — 展示用户收藏的目的地 | — |
| 5 | `/about` | `AboutPage` | 关于我们 — 使命、价值观、团队介绍、联系方式 | — |
| 6 | `/trips` | `TripPlannerPage` | 行程规划 — 行程列表、创建/删除行程 | `?dest=` (预选目的地) |
| 7 | `/trips/:tripId` | `TripEditPage` | 行程编辑 — 日程标签页、活动管理、快速添加景点 | `:tripId` |
| 8 | `*` | `NotFoundPage` | 404 页面 — 错误提示与返回首页链接 | — |

### 布局结构

所有页面共享 `<Layout>` 包裹：
```
Layout
├── Navbar（顶部导航，sticky）
├── <Outlet>（页面内容）
├── Footer（底部信息）
└── ScrollToTop（回到顶部浮动按钮）
```

---

## 3. 组件清单

### 3.1 布局组件

| 组件 | 文件 | Props | 关键行为 |
|------|------|-------|---------|
| `Layout` | `components/Layout.tsx` | — | 包裹 Navbar + Outlet + Footer + ScrollToTop |
| `Navbar` | `components/Navbar.tsx` | — | 响应式导航（桌面/移动），语言切换按钮，当前路由高亮 |
| `Footer` | `components/Footer.tsx` | — | 三列布局：品牌/快速链接/社交媒体 |
| `ScrollToTop` | `components/ScrollToTop.tsx` | — | 滚动超过 300px 显示，点击平滑回到顶部 |

### 3.2 业务组件

| 组件 | 文件 | Props | 关键行为 |
|------|------|-------|---------|
| `SearchBar` | `components/SearchBar.tsx` | `value`, `onChange`, `placeholder?` | 带搜索图标的文本输入框，实时搜索 |
| `FilterBar` | `components/FilterBar.tsx` | `keyword`, `region`, `type`, `sortBy` 及对应 `onChange` 回调 | 组合筛选：关键词搜索 + 区域选择 + 类型选择 + 排序方式 |
| `DestinationCard` | `components/DestinationCard.tsx` | `destination: Destination` | 带图片/标签/评分/收藏按钮的卡片链接 |
| `FavoriteButton` | `components/FavoriteButton.tsx` | `destinationId`, `className?` | 心形按钮切换收藏状态，通过 localStorage + 自定义事件同步 |
| `Carousel` | `components/Carousel.tsx` | `items: ReactNode[]`, `autoPlayInterval?` | 自动轮播（默认 4 秒），支持手动点击切换，带指示器圆点 |
| `WeatherWidget` | `components/WeatherWidget.tsx` | `destinationId` | 显示当前天气 + 5 天预报，含温度/湿度/风速/天气图标 |

### 3.3 组件关系图

```
HomePage
├── SearchBar（Hero 区域搜索）
├── DestinationCard × N（热门目的地网格）
│   └── FavoriteButton
├── Category Links（旅行主题网格）
└── Carousel（评价轮播）

DestinationsPage
├── FilterBar
│   └── SearchBar
└── DestinationCard × N
    └── FavoriteButton

DestinationDetailPage
├── FavoriteButton
├── WeatherWidget
└── DestinationCard × N（相关推荐）
    └── FavoriteButton

FavoritesPage
└── DestinationCard × N
    └── FavoriteButton

TripPlannerPage
└── 创建行程 Modal（表单）

TripEditPage
├── WeatherWidget
└── 活动管理表单
```

---

## 4. 数据模型与状态管理

### 4.1 核心类型

| 类型 | 用途 | 关键字段 |
|------|------|---------|
| `Destination` | 目的地基本信息 | `id`, `nameKey`, `countryKey`, `descKey`, `image`, `region`, `type`, `rating`, `stars` |
| `DestinationDetail` | 目的地完整详情 | 继承 Destination + `images[]`, `attractions[]`, `reviews[]`, `seasonKey`, `costKey`, `transport`, `visa`, `currency`, `timezone`, `language`, `related[]` |
| `Trip` | 行程计划 | `id`, `name`, `destinationId`, `days: TripDay[]`, `createdAt`, `updatedAt` |
| `TripDay` | 单日行程 | `dayNumber`, `activities: TripActivity[]` |
| `TripActivity` | 活动条目 | `id`, `customName`, `time`, `notes` |

### 4.2 数据存储

| 数据源 | 存储方式 | 键名 | 同步事件 |
|--------|---------|------|---------|
| 目的地列表 | 静态 TypeScript 模块 (`data/destinations.ts`) | — | — |
| 评价数据 | 静态 TypeScript 模块 (`data/reviews.ts`) | — | — |
| 团队数据 | 静态 TypeScript 模块 (`data/team.ts`) | — | — |
| 天气数据 | 静态 TypeScript 模块 (`data/weather.ts`) | — | — |
| 用户收藏 | `localStorage` | `travelvista_favorites` | `window` `favorites-changed` 事件 |
| 行程数据 | `localStorage` | `travelvista_trips` | `window` `trips-changed` 事件 |

### 4.3 目的地数据

共 **12 个** 目的地：

| ID | 中文名 | 区域 | 类型 | 评分 |
|----|--------|------|------|------|
| `bali` | 巴厘岛 | 亚洲 | 海滩 | 4.7 |
| `kyoto` | 京都 | 亚洲 | 文化 | 4.8 |
| `santorini` | 圣托里尼 | 欧洲 | 海滩 | 4.6 |
| `paris` | 巴黎 | 欧洲 | 城市 | 4.5 |
| `maldives` | 马尔代夫 | 亚洲 | 海滩 | 4.9 |
| `swiss` | 瑞士 | 欧洲 | 山岳 | 4.7 |
| `newyork` | 纽约 | 北美洲 | 城市 | 4.4 |
| `chengdu` | 成都 | 亚洲 | 文化 | 4.5 |
| `machupicchu` | 马丘比丘 | 南美洲 | 文化 | 4.8 |
| `capetown` | 开普敦 | 非洲 | 山岳 | 4.5 |
| `greatbarrierreef` | 大堡礁 | 大洋洲 | 海滩 | 4.7 |
| `nepal` | 尼泊尔 | 亚洲 | 山岳 | 4.6 |

首页展示前 8 个，目的地页面展示全部 12 个。

筛选维度：
- **区域**：asia, europe, north-america, south-america, africa, oceania
- **类型**：beach, mountain, city, culture
- **排序**：默认 / 评分 / 名称

---

## 5. 国际化 (i18n) 支持

### 5.1 配置

| 项目 | 值 |
|------|-----|
| 框架 | i18next + react-i18next |
| 默认语言 | `zh`（中文） |
| 回退语言 | `zh` |
| 支持语言 | `zh`（中文），`en`（英文） |
| 切换方式 | Navbar 按钮，中文模式显示 "EN"，英文模式显示 "中文" |
| 翻译存储 | 静态 JSON 导入（`zh.json`, `en.json`） |

### 5.2 i18n 覆盖范围

所有用户可见文本均通过 `t()` 函数国际化，包括：
- 导航菜单、页面标题、描述文字
- 目的地名称 / 国家 / 描述
- 筛选器标签和选项
- 表单标签和占位符
- 按钮文字
- 错误信息和空状态提示
- 天气条件描述
- 页脚内容

### 5.3 测试建议

- 切换语言后，验证所有页面文本已切换
- 验证搜索功能在不同语言下正确过滤（搜索使用翻译后的文本比较）
- 验证 `t()` 中的插值参数正常工作（如 `destinations.count`, `trip.daysCount`）

---

## 6. 定位策略建议 (Locator Strategy)

### 6.1 可用的语义定位器

| 定位方式 | 适用场景 | 示例 |
|---------|---------|------|
| **Role + Name** | 导航链接、按钮 | `getByRole('link', { name: '首页' })` |
| **aria-label** | FavoriteButton, 筛选器 select, Toggle menu | `getByLabel('Add to wishlist')` |
| **Heading 级别** | 页面标题、区块标题 | `getByRole('heading', { level: 1, name: '探索世界，发现美好' })` |
| **Placeholder** | 搜索框 | `getByPlaceholder('搜索目的地...')` |
| **链接文本** | 目的地卡片、导航 | `getByRole('link', { name: /巴厘岛/ })` |
| **按钮文本** | 功能按钮 | `getByRole('button', { name: /创建行程/ })` |

### 6.2 需要注意的定位问题

| 问题 | 元素 | 建议 |
|------|------|------|
| **无 data-testid** | 全站无 data-testid 属性 | 当前可依赖 role + name 定位，如需稳定性可后续添加 |
| **FavoriteButton aria-label 固定为英文** | `aria-label="Add to wishlist"` / `"Remove from wishlist"` | 注意 i18n 切换后 aria-label 不变（英文硬编码），可用于稳定定位 |
| **select 元素使用 aria-label** | 区域/类型/排序筛选器 | 可通过 `getByLabel(t('destinations.region'))` 定位，但注意随语言变化 |
| **Carousel 指示器** | `aria-label="Slide 1"`, `"Slide 2"` 等 | 稳定的英文 aria-label |
| **ScrollToTop 按钮** | `aria-label="Back to top"` | 英文 aria-label，稳定 |

### 6.3 推荐定位策略优先级

```
1. getByRole()     — 导航链接、按钮、标题、表单元素
2. getByLabel()    — 有 aria-label 的按钮、select 元素
3. getByPlaceholder() — 搜索框、表单输入
4. getByText()     — 静态文本、标签
5. CSS selector    — 仅在无语义标记时使用
```

### 6.4 i18n 对定位的影响

- **不受影响的定位器**：`aria-label="Add to wishlist"`, `aria-label="Back to top"`, `aria-label="Slide N"`, `aria-label="Toggle menu"`（均为英文硬编码）
- **受影响的定位器**：导航链接名称、按钮文字、标题文字、 placeholder 文本、select aria-label
- **建议**：E2E 测试中使用 i18n key 对应的翻译值匹配名称，或在测试固件中预设语言

---

## 7. 交互分析

### 7.1 搜索交互

| 页面 | 组件 | 行为 |
|------|------|------|
| 首页 | `SearchBar`（Hero 区域） | 实时过滤首页前 8 个目的地，匹配名称和描述 |
| 目的地页 | `FilterBar > SearchBar` | 实时过滤全部 12 个目的地 |

### 7.2 筛选交互

| 筛选器 | 类型 | 选项 |
|--------|------|------|
| 区域 | `<select>` | 全部 / 亚洲 / 欧洲 / 北美 / 南美 / 非洲 / 大洋洲 |
| 类型 | `<select>` | 全部 / 海滩 / 山岳 / 城市 / 文化 |
| 排序 | `<select>` | 默认 / 评分 / 名称 |

筛选器支持组合使用，URL 参数 `?region=` 和 `?type=` 可通过主题分类链接预设。

### 7.3 收藏交互

| 操作 | 触发元素 | 行为 |
|------|---------|------|
| 添加收藏 | 空心心形按钮 | 将目的地 ID 存入 localStorage，心形变红，dispatch `favorites-changed` |
| 取消收藏 | 实心心形按钮 | 从 localStorage 移除 ID，心形变空心 |
| 跨页面同步 | — | `FavoritesPage` 监听 `favorites-changed` 事件实时刷新 |
| 事件冒泡阻止 | `e.preventDefault()` + `e.stopPropagation()` | 防止点击收藏按钮触发卡片链接跳转 |

### 7.4 行程规划交互

| 操作 | 触发 | 行为 |
|------|------|------|
| 创建行程 | "创建行程" 按钮 → Modal 表单 | 选择目的地 + 输入名称 + 设置天数 → 存入 localStorage |
| 删除行程 | "删除" 按钮 | 弹出 `window.confirm()` 确认对话框后删除 |
| 编辑行程 | "编辑" 按钮链接 | 跳转到 `/trips/:tripId` |
| 切换日程 | Day 标签页按钮 | 切换当前显示的日程 |
| 添加活动 | "添加活动" 按钮 → 表单 | 输入活动名称/时间/备注后保存 |
| 快速添加景点 | 景点快捷按钮 | 一键添加目的地预设景点到当前日程 |
| 删除活动 | 悬停显示的 "✕" 按钮 | 直接删除活动条目 |
| 修改行程名称 | 头部可编辑输入框 | 实时保存名称变更 |
| 预选目的地 | 详情页 "规划行程" 链接 (`?dest=`) | 自动打开创建 Modal 并预选目的地 |

### 7.5 导航交互

| 操作 | 触发 | 行为 |
|------|------|------|
| 导航切换 | Navbar 链接 | SPA 客户端路由跳转 |
| 移动端菜单 | 汉堡按钮 | 展开/折叠移动端导航菜单，带动画过渡 |
| 语言切换 | "EN" / "中文" 按钮 | 切换全站语言 |
| 回到顶部 | 浮动按钮 | 滚动超过 300px 显示，点击平滑滚动到顶部 |
| 面包屑导航 | 详情页面包屑链接 | 首页 / 目的地 / 当前目的地名称 |

### 7.6 轮播交互

| 操作 | 触发 | 行为 |
|------|------|------|
| 自动播放 | 定时器 | 每 4 秒自动切换到下一张 |
| 手动切换 | 底部圆点按钮 | 点击切换到对应幻灯片 |
| 循环播放 | 到达最后一张后 | 自动回到第一张 |

---

## 8. 副作用清单 (Side-Effect Inventory)

### 8.1 对话框 (Dialogs)

| 文件 | 行号 | 类型 | 触发操作 | 推荐测试处理 |
|------|------|------|---------|-------------|
| `pages/TripPlannerPage.tsx` | ~41 | `window.confirm()` | 点击行程"删除"按钮 | `page.on('dialog', d => d.accept())` 或 `d.dismiss()` |
| `pages/TripEditPage.tsx` | ~76 | `window.confirm()` | 点击行程编辑页"删除"按钮 | `page.on('dialog', d => d.accept())` 或 `d.dismiss()` |

### 8.2 外部导航 (External Navigation)

| 文件 | 行号 | 类型 | 目标 | 推荐测试处理 |
|------|------|------|------|-------------|
| `pages/AboutPage.tsx` | ~80 | `mailto:` 链接 | `mailto:hello@travelvista.com` | 验证 `href` 属性而非实际点击 |

### 8.3 新标签页 / 下载

未检测到 `target="_blank"`、`window.open()` 或 `download` 属性使用。

### 8.4 localStorage 操作

| 操作 | 键 | 触发位置 |
|------|-----|---------|
| 读写收藏 | `travelvista_favorites` | `FavoriteButton` 点击 |
| 读写行程 | `travelvista_trips` | `TripPlannerPage` / `TripEditPage` 操作 |

---

## 9. 用户旅程映射

### 旅程 1：浏览与发现目的地

```
首页 → 搜索/浏览热门目的地 → 点击目的地卡片 → 查看详情页
                                                 → 查看景点/评论/天气
                                                 → 返回列表
```

### 旅程 2：按条件筛选目的地

```
首页 → 点击旅行主题(如"海滩") → 目的地页(已预选类型筛选)
                                → 进一步筛选区域/排序
                                → 点击卡片 → 详情页
```

### 旅程 3：收藏目的地

```
任意页面有目的地卡片 → 点击心形按钮收藏
                    → 导航到心愿单页面 → 查看已收藏列表
                    → 点击卡片 → 详情页
                    → 取消收藏 → 心愿单实时更新
```

### 旅程 4：规划行程

```
详情页 → 点击"规划行程" → 行程页(预选目的地的创建 Modal)
                        → 填写行程名/天数 → 创建
     或                 → 行程列表 → 点击"创建行程" → Modal
                                  → 点击"编辑" → 行程编辑页
                                               → 切换日程标签
                                               → 添加/删除活动
                                               → 快速添加景点
                                               → 修改行程名称
                                               → 删除整个行程
```

### 旅程 5：语言切换

```
任意页面 → 点击 Navbar "EN" 按钮 → 全站切换为英文
        → 点击 "中文" 按钮 → 全站切换回中文
        → 搜索/筛选功能使用当前语言文本匹配
```

### 旅程 6：响应式体验

```
桌面模式 → 水平导航菜单，网格布局
移动模式 → 汉堡菜单，单列布局
        → 点击汉堡按钮 → 展开移动导航 → 点击链接 → 菜单自动关闭
```

---

## 10. 现有测试覆盖

### 10.1 组件测试 (CT)

| 测试文件 | 覆盖组件 |
|---------|---------|
| `tests/component/DestinationCard.spec.tsx` | DestinationCard |
| `tests/component/FavoriteButton.spec.tsx` | FavoriteButton |
| `tests/component/FilterBar.spec.tsx` | FilterBar |
| `tests/component/SearchBar.spec.tsx` | SearchBar |
| `tests/component/WeatherWidget.spec.tsx` | WeatherWidget |

**未覆盖组件**：Carousel, Navbar, Footer, ScrollToTop, Layout

### 10.2 E2E 测试

| 测试文件 | 覆盖场景 |
|---------|---------|
| `tests/e2e/home-and-favorites.spec.ts` | 首页 + 收藏功能 |
| `tests/e2e/destinations-and-i18n.spec.ts` | 目的地 + 国际化切换 |
| `tests/e2e/trip-planner.spec.ts` | 行程规划全流程 |

### 10.3 视觉回归测试

| 测试文件 | 覆盖范围 |
|---------|---------|
| `tests/visual/app.visual.spec.ts` | 全站页面截图基线 |

---

## 11. 测试覆盖建议

### 11.1 组件测试补充

| 优先级 | 组件 | 建议测试点 |
|--------|------|-----------|
| 🔴 高 | `Carousel` | 自动播放切换、手动切换、指示器状态、循环逻辑 |
| 🟡 中 | `Navbar` | 响应式菜单展开/折叠、语言切换、当前路由高亮 |
| 🟡 中 | `Footer` | 链接渲染、i18n 文本 |
| 🟢 低 | `ScrollToTop` | 滚动可见性、点击滚动到顶部 |

### 11.2 E2E 测试增强

| 优先级 | 场景 | 建议测试点 |
|--------|------|-----------|
| 🔴 高 | 筛选器组合 | 多维度筛选组合测试、清除筛选、空结果状态 |
| 🔴 高 | 行程编辑深度 | 活动添加/删除/快速添加、日程切换、行程名编辑 |
| 🟡 中 | 详情页完整性 | 面包屑导航、图片画廊、天气小部件、相关推荐 |
| 🟡 中 | 404 页面 | 不存在路由跳转、返回首页链接 |
| 🟡 中 | 深度链接 | 带参数直接访问（`?type=beach`, `?dest=bali`） |
| 🟡 中 | localStorage 边界 | 清空 localStorage 后的行为、大量数据性能 |
| 🟢 低 | 响应式布局 | 移动端导航、网格布局适配 |

### 11.3 视觉回归补充

| 优先级 | 场景 | 建议 |
|--------|------|------|
| 🔴 高 | i18n 双语截图 | 中英文各页面对比基线 |
| 🟡 中 | 暗色模式 | 如未来支持暗色主题，需补充 |
| 🟡 中 | 移动端视口 | 375px / 768px 断点截图 |
| 🟢 低 | 交互状态 | 收藏按钮 hover/active 状态、筛选器选中态 |

### 11.4 无障碍测试建议

| 问题 | 详情 | 建议 |
|------|------|------|
| FavoriteButton aria-label 未国际化 | 始终为英文 `"Add to wishlist"` / `"Remove from wishlist"` | 如需支持多语言无障碍，应使用 `t()` 翻译 |
| 社交媒体链接无 `href` | Footer 社交图标为 `<span>` 标签 | 如为实际链接，应改为 `<a>` 标签 |
| 轮播无键盘导航 | 仅支持点击圆点切换 | 建议添加左右箭头键支持 |
| 图片 alt 文本 | 部分图片 alt 为空 (`alt=""`) | 装饰性图片可保留空 alt，但内容图片需补充 |

---

## 12. 环境就绪性说明

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 开发服务器 | ✅ 运行中 | `http://localhost:5173/UI-test-Demo/`（注意需要尾部斜杠） |
| Playwright 安装 | ✅ 已配置 | `@playwright/test` 1.58, 含 E2E/CT/Visual 三种项目配置 |
| E2E 配置 | ✅ `playwright.config.ts` | 含 `e2e` 和 `visual` 两个项目 |
| CT 配置 | ✅ `playwright-ct.config.ts` | 独立 CT 配置 |
| Azure 配置 | ✅ `playwright.service.config.ts` | Azure Playwright Testing 云端配置 |
| 现有测试 | ✅ 完整 | E2E 3 文件, CT 5 文件, Visual 1 文件 |
| VLM 集成 | ✅ 可选 | 通过 `VLM_REVIEW=true` 环境变量启用 |

---

## 附录 A：NPM 脚本速查

| 脚本 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run test:e2e` | 运行 E2E 测试 |
| `npm run test:ct` | 运行组件测试 |
| `npm run test:visual` | 运行视觉回归测试（VLM 关闭） |
| `npm run test:visual:vlm` | 运行视觉回归测试（VLM 开启） |
| `npm run test:all` | 运行所有测试 |
| `npm run test:update-snapshots` | 更新视觉回归基线截图 |
| `npm run test:azure` | Azure 云端运行所有测试 |
| `npm run test:azure:e2e` | Azure 云端运行 E2E 测试 |
| `npm run test:azure:visual` | Azure 云端运行视觉测试 |

## 附录 B：基路径注意事项

项目配置了 Vite `base: '/UI-test-Demo/'`，所有路由和资源路径均以此为前缀：
- React Router 内部路由如 `/destinations` 实际 URL 为 `/UI-test-Demo/destinations`
- 静态资源通过 `assetUrl()` 工具函数自动拼接基路径
- 测试中直接访问页面需使用完整路径（如 `page.goto('/UI-test-Demo/destinations')`），或配置 `baseURL`
