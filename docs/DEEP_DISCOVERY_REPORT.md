<!-- discovery-meta
  generated: 2026-04-07T00:00:00+08:00
  scope: deep
  routes-found: 8
  components-found: 10
  i18n-detected: true
  side-effects-found: 4
-->

# TravelVista 深度发现报告

> 生成时间：2026-04-07 | 分析范围：deep | 实时网站 + 源码分析

---

## 目录

1. [项目架构概览](#1-项目架构概览)
2. [完整路由地图](#2-完整路由地图)
3. [组件清单](#3-组件清单)
4. [页面结构与交互分析](#4-页面结构与交互分析)
5. [定位器策略分析](#5-定位器策略分析)
6. [i18n 覆盖分析](#6-i18n-覆盖分析)
7. [交互元素目录](#7-交互元素目录)
8. [数据流与状态管理](#8-数据流与状态管理)
9. [副作用清单](#9-副作用清单)
10. [响应式行为分析](#10-响应式行为分析)
11. [推荐测试场景](#11-推荐测试场景)
12. [发现的问题与建议](#12-发现的问题与建议)

---

## 1. 项目架构概览

### 1.1 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19.x |
| 语言 | TypeScript | 5.9.x |
| 构建工具 | Vite | 8.x |
| 路由 | react-router-dom | 7.x |
| 国际化 | i18next + react-i18next | 25.x / 16.x |
| 样式 | Tailwind CSS | 4.x (PostCSS) |
| 测试 | Playwright (E2E + CT + Visual) | 1.58.x |
| 图标 | react-icons | 5.x |

### 1.2 项目结构

```
src/
├── App.tsx                  # 路由定义（Routes 配置）
├── main.tsx                 # 入口，BrowserRouter basename="/UI-test-Demo"
├── index.css                # 全局样式
├── components/              # 10 个通用组件
│   ├── Layout.tsx           # 布局容器（Navbar + Outlet + Footer + ScrollToTop）
│   ├── Navbar.tsx           # 导航栏（含语言切换、移动端菜单）
│   ├── Footer.tsx           # 页脚
│   ├── Carousel.tsx         # 轮播组件
│   ├── DestinationCard.tsx  # 目的地卡片
│   ├── FavoriteButton.tsx   # 收藏按钮
│   ├── FilterBar.tsx        # 筛选栏
│   ├── SearchBar.tsx        # 搜索框
│   ├── WeatherWidget.tsx    # 天气组件
│   └── ScrollToTop.tsx      # 返回顶部按钮
├── pages/                   # 8 个页面
│   ├── HomePage.tsx
│   ├── DestinationsPage.tsx
│   ├── DestinationDetailPage.tsx
│   ├── FavoritesPage.tsx
│   ├── AboutPage.tsx
│   ├── TripPlannerPage.tsx
│   ├── TripEditPage.tsx
│   └── NotFoundPage.tsx
├── data/                    # 静态数据源
│   ├── destinations.ts      # 12 个目的地 + 详情 + 分类
│   ├── reviews.ts           # 3 条首页评价
│   ├── team.ts              # 4 名团队成员
│   └── weather.ts           # 模拟天气数据
├── i18n/                    # 国际化
│   ├── index.ts             # i18next 初始化（默认语言：zh）
│   ├── zh.json              # 中文（~460+ 个键）
│   └── en.json              # 英文（~460+ 个键）
├── types/
│   └── index.ts             # TypeScript 类型定义
└── utils/
    ├── assetUrl.ts           # 基于 BASE_URL 的资源路径
    ├── favorites.ts          # localStorage 收藏管理
    └── tripPlanner.ts        # localStorage 行程管理
```

### 1.3 关键架构特征

- **纯前端应用**：无 API 调用，所有数据为静态内联或 localStorage 持久化
- **状态管理**：无全局状态管理库（无 Redux/Zustand），组件间通过 `window` 自定义事件同步
- **路由基路径**：`basename="/UI-test-Demo"`，所有路由需加此前缀
- **资源路径**：通过 `assetUrl()` 函数基于 `import.meta.env.BASE_URL` 动态计算

---

## 2. 完整路由地图

| 路由 | 页面组件 | 参数 | 查询参数 | 描述 |
|------|----------|------|----------|------|
| `/` | `HomePage` | - | - | 首页：Hero + 搜索 + 热门目的地 + 主题 + 评价 |
| `/destinations` | `DestinationsPage` | - | `region`, `type` | 目的地列表：筛选 + 排序 + 搜索 |
| `/destinations/:id` | `DestinationDetailPage` | `id` (目的地 ID) | - | 目的地详情：图片 + 景点 + 评价 + 天气 + 实用信息 |
| `/favorites` | `FavoritesPage` | - | - | 心愿单：已收藏的目的地列表 |
| `/about` | `AboutPage` | - | - | 关于页：使命 + 价值观 + 团队 + 联系 |
| `/trips` | `TripPlannerPage` | - | `dest` | 行程规划列表：创建/删除行程 |
| `/trips/:tripId` | `TripEditPage` | `tripId` | - | 行程编辑：天数标签 + 活动管理 |
| `*` | `NotFoundPage` | - | - | 404 页面 |

### 2.1 路由参数详情

- **目的地 ID 值**：`bali`, `kyoto`, `santorini`, `paris`, `maldives`, `swiss`, `newyork`, `chengdu`, `machupicchu`, `capetown`, `greatbarrierreef`, `nepal`（共 12 个）
- **地区筛选值**：`asia`, `europe`, `north-america`, `south-america`, `africa`, `oceania`
- **类型筛选值**：`beach`, `mountain`, `city`, `culture`
- **行程 ID**：由 `Date.now().toString(36)` 动态生成

### 2.2 导航结构

```
Navbar
├── TravelVista（Logo → /）
├── 首页（/）
├── 目的地（/destinations）
├── 心愿单（/favorites）
├── 行程规划（/trips）
├── 关于我们（/about）
└── 语言切换按钮（EN / 中文）

Footer
├── 品牌信息
├── 快速链接（首页、目的地、关于我们）
└── 社交链接（微博、微信、Instagram）
```

---

## 3. 组件清单

### 3.1 Layout（布局组件）

| 属性 | 说明 |
|------|------|
| 子组件 | Navbar + Outlet + Footer + ScrollToTop |
| 样式 | `min-h-screen flex flex-col` |
| 特征 | 所有页面共享此布局 |

### 3.2 Navbar（导航栏）

| 属性 | 说明 |
|------|------|
| Props | 无 |
| 状态 | `menuOpen`（移动端菜单开关） |
| 交互 | 5 个导航链接 + 语言切换按钮 + 移动端汉堡菜单 |
| 高亮逻辑 | 基于 `useLocation().pathname` 判断活跃路由 |
| 响应式 | `md:` 断点切换桌面/移动导航 |
| 定位 | `sticky top-0 z-50` |

### 3.3 Footer（页脚）

| 属性 | 说明 |
|------|------|
| Props | 无 |
| 内容 | 品牌描述 + 快速链接（3个） + 社交链接（3个） + 版权信息 |
| 布局 | 3 列网格（`md:grid-cols-3`） |

### 3.4 Carousel（轮播组件）

| 属性 | 说明 |
|------|------|
| Props | `items: ReactNode[]`, `autoPlayInterval?: number`（默认 4000ms） |
| 状态 | `current`（当前幻灯片索引） |
| 交互 | 自动播放 + 底部圆点指示器点击切换 |
| 动画 | CSS `translateX` + `transition-transform duration-500` |

### 3.5 DestinationCard（目的地卡片）

| 属性 | 说明 |
|------|------|
| Props | `destination: Destination` |
| 子组件 | FavoriteButton |
| 交互 | 整个卡片为 `<Link>` 跳转到详情页 |
| 展示 | 图片 + 类型标签 + 名称 + 国家 + 描述（2行截断） + 星级 + 评分 |

### 3.6 FavoriteButton（收藏按钮）

| 属性 | 说明 |
|------|------|
| Props | `destinationId: string`, `className?: string` |
| 状态 | `favorited`（基于 localStorage） |
| 交互 | 点击切换收藏状态，阻止事件冒泡 |
| 事件 | 触发 `window.dispatchEvent(new Event('favorites-changed'))` |
| aria-label | `"Add to wishlist"` / `"Remove from wishlist"` |
| 存储 | localStorage key: `travelvista_favorites` |

### 3.7 FilterBar（筛选栏）

| 属性 | 说明 |
|------|------|
| Props | `keyword`, `region`, `type`, `sortBy` + 4 个 onChange 回调 |
| 子组件 | SearchBar |
| 交互 | 搜索框 + 地区下拉 + 类型下拉 + 排序下拉 |
| aria-label | 各下拉框通过 `aria-label` 标注 |

### 3.8 SearchBar（搜索框）

| 属性 | 说明 |
|------|------|
| Props | `value: string`, `onChange: (v: string) => void`, `placeholder?: string` |
| 交互 | 实时输入搜索（受控组件） |
| 样式 | 左侧搜索图标 + 圆角输入框 |

### 3.9 WeatherWidget（天气组件）

| 属性 | 说明 |
|------|------|
| Props | `destinationId: string` |
| 数据源 | `data/weather.ts` 静态数据 |
| 展示 | 当前温度/湿度/风速 + 5 日预报 |
| 条件渲染 | 若无天气数据则返回 `null` |

### 3.10 ScrollToTop（返回顶部）

| 属性 | 说明 |
|------|------|
| Props | 无 |
| 状态 | `visible`（滚动超过 300px 显示） |
| 交互 | 点击平滑滚动到顶部 |
| aria-label | `"Back to top"` |

---

## 4. 页面结构与交互分析

### 4.1 HomePage（首页）

**区块结构：**
1. **Hero 区域** — 全屏背景图 + 标题 + 副标题 + SearchBar
2. **热门目的地** — 4 列卡片网格（前 8 个目的地），支持搜索过滤
3. **旅行主题** — 4 个分类卡片（海滩/山岳/城市/文化），点击跳转带 `type` 参数的目的地页
4. **旅行者评价** — Carousel 轮播 3 条评价
5. **查看全部** — 按钮跳转到 `/destinations`

**交互：**
- 搜索框实时过滤热门目的地（基于名称和描述匹配）
- 主题卡片链接到 `/destinations?type={type}`
- 评价轮播自动播放（4秒间隔）

### 4.2 DestinationsPage（目的地列表页）

**区块结构：**
1. **页面标题** — 深色背景 banner
2. **FilterBar** — 搜索 + 地区（6个选项） + 类型（4个选项） + 排序（3个选项）
3. **结果计数** — "共 N 个目的地"
4. **卡片网格** — 3 列布局
5. **空状态** — 无匹配结果提示

**交互：**
- URL 查询参数 `region` 和 `type` 可预选筛选条件
- 搜索基于 i18n 翻译文本进行关键词匹配
- 排序支持评分和名称排序

### 4.3 DestinationDetailPage（目的地详情页）

**区块结构：**
1. **面包屑导航** — 首页 > 目的地 > 当前目的地名
2. **图片画廊** — 主图（2/3宽度） + 2 张副图
3. **主内容区**
   - 标题 + 收藏按钮
   - 国家/地区
   - 详细描述
   - 必游景点（2列卡片）
   - 旅行者评价（带星级）
4. **侧边栏**
   - 旅行概览（最佳季节/花费/评分）
   - 天气组件
   - 实用信息（交通/签证/货币/时区/语言）
   - "开始规划行程" 按钮 → `/trips?dest={id}`
   - "返回目的地列表" 按钮
5. **相关推荐** — 3 个相关目的地卡片

**交互：**
- 无效目的地 ID 显示 "未找到" + 返回链接
- 收藏按钮切换
- "开始规划行程" 链接预选目的地

### 4.4 FavoritesPage（心愿单页）

**区块结构：**
1. **页面标题** — 深色 banner
2. **卡片网格** — 3 列，展示已收藏的目的地
3. **空状态** — "还没有收藏的目的地" + "去探索目的地" 按钮

**交互：**
- 监听 `favorites-changed` 事件实时更新
- 取消收藏后卡片立即移除

### 4.5 AboutPage（关于页）

**区块结构：**
1. **Hero** — 背景图 + 标题
2. **使命** — 标题 + 描述 + 3 个价值观卡片
3. **团队** — 4 个团队成员卡片（头像占位 + 姓名 + 职位 + 简介）
4. **联系** — 联系文案 + `mailto:` 链接

**交互：**
- `mailto:hello@travelvista.com` 链接

### 4.6 TripPlannerPage（行程规划页）

**区块结构：**
1. **页面标题** — 深色 banner
2. **创建行程按钮**
3. **行程列表** — 2 列卡片（图片 + 名称 + 目的地 + 天数 + 编辑/删除按钮）
4. **空状态** — 📋 图标 + 提示文字
5. **创建行程弹窗（Modal）** — 目的地选择 + 行程名称 + 天数 + 取消/创建按钮

**交互：**
- 创建行程弹窗：选择目的地（下拉）、输入名称、设置天数（1-14）
- 删除行程：触发 `window.confirm()` 确认对话框
- URL 参数 `dest` 自动打开弹窗并预选目的地
- 表单验证：目的地和名称必填

### 4.7 TripEditPage（行程编辑页）

**区块结构：**
1. **Header** — 返回链接 + 可编辑行程名称输入框 + 目的地信息
2. **主内容区**
   - 天数标签页切换
   - 当前天活动列表（序号 + 名称 + 时间 + 备注 + 删除按钮）
   - 快速添加景点（目的地景点按钮列表）
   - 自定义活动表单（名称 + 时间 + 备注）
3. **侧边栏**
   - 目的地卡片
   - 天气组件
   - 删除行程按钮

**交互：**
- 行程名称可编辑（即时保存）
- 天数标签页切换
- 快速添加景点
- 自定义活动添加（名称必填）
- 删除活动（hover 显示删除按钮）
- 删除行程（`window.confirm()` → 导航回列表）
- 无效行程 ID 显示 "未找到"

### 4.8 NotFoundPage（404 页面）

**区块结构：**
1. **大号 404** — 蓝色标题
2. **提示文案**
3. **返回首页按钮**

---

## 5. 定位器策略分析

### 5.1 当前状态总览

| 定位策略 | 可用性 | 覆盖度 | 评估 |
|----------|--------|--------|------|
| **aria-label** | ✅ 部分可用 | ~40% | FavoriteButton、FilterBar 下拉框、Toggle menu、Back to top、Slide 按钮 |
| **角色定位 (role)** | ✅ 语义 HTML | ~70% | `<nav>`、`<main>`、`<footer>` (contentinfo)、`<button>`、`<link>`、`<heading>` |
| **文本定位** | ✅ 可用 | ~90% | 大部分元素有可见文本，但 i18n 切换后文本变化 |
| **data-testid** | ❌ 完全缺失 | 0% | **整站无任何 data-testid 属性** |
| **CSS 类名** | ⚠️ 不稳定 | - | Tailwind 原子类不适合定位 |

### 5.2 各组件可用定位器

#### Navbar
```
- 品牌链接: getByRole('link', { name: 'TravelVista' })
- 导航链接: getByRole('link', { name: t('nav.home') })  // ⚠️ 文本随语言变化
- 语言按钮: getByRole('button', { name: /EN|中文/ })
- 汉堡菜单: getByRole('button', { name: 'Toggle menu' })
```

#### DestinationCard
```
- 卡片链接: getByRole('link', { name: /巴厘岛/ })  // ⚠️ 包含子元素文本
- 收藏按钮: getByRole('button', { name: /wishlist/ }) → 多实例需上下文限定
```

#### FilterBar
```
- 搜索框: getByPlaceholder(t('destinations.search'))  // ⚠️ 语言相关
- 地区下拉: getByRole('combobox', { name: t('destinations.region') })
- 类型下拉: getByRole('combobox', { name: t('destinations.type') })
- 排序下拉: getByRole('combobox', { name: t('destinations.sort') })
```

#### TripPlannerPage
```
- 创建按钮: getByRole('button', { name: /创建行程/ })
- 删除按钮: getByRole('button', { name: /删除行程/ })
- 弹窗选择: getByRole('combobox', { name: t('trip.selectDest') })
- 名称输入: getByPlaceholder(t('trip.namePlaceholder'))
```

### 5.3 定位器优先级建议

```
1. getByRole()   — 首选，语义最强
2. getByLabel()  — 表单元素
3. getByText()   — 静态文本（需注意 i18n 影响）
4. getByPlaceholder() — 输入框
5. data-testid   — 目前不可用，强烈建议添加
```

### 5.4 🔴 需添加 data-testid 的关键元素

| 组件 / 元素 | 建议 data-testid | 原因 |
|-------------|-----------------|------|
| Navbar 容器 | `navbar` | 与 footer nav 区分 |
| 语言切换按钮 | `lang-switch` | 按钮文本随状态变化 |
| DestinationCard | `destination-card-{id}` | 多实例需唯一标识 |
| FavoriteButton | `favorite-btn-{id}` | 多实例区分 |
| FilterBar | `filter-search`, `filter-region`, `filter-type`, `filter-sort` | 稳定定位 |
| 行程卡片 | `trip-card-{id}` | 动态生成的多实例 |
| 天数标签 | `day-tab-{n}` | 数值化定位 |
| 创建行程弹窗 | `create-trip-dialog` | 弹窗定位 |
| 天气组件 | `weather-widget` | 组件隔离 |
| Hero 区域 | `hero-section` | 区域定位 |
| Footer | `footer` | 区域标识 |

---

## 6. i18n 覆盖分析

### 6.1 配置详情

| 项目 | 值 |
|------|-----|
| 框架 | i18next + react-i18next |
| 默认语言 | `zh`（中文） |
| 回退语言 | `zh` |
| 支持语言 | `zh`, `en` |
| 切换方式 | Navbar 按钮 `i18n.changeLanguage()` |
| 键总数 | ~460+ 个翻译键 |
| 命名空间 | 单一 `translation` |

### 6.2 i18n 键分布

| 模块 | 键前缀 | 大致数量 | 覆盖范围 |
|------|--------|----------|----------|
| 导航 | `nav.*` | 6 | ✅ 完整 |
| 首页 | `hero.*`, `home.*` | 10 | ✅ 完整 |
| 目的地列表 | `dest.*`, `destinations.*`, `filter.*` | ~30 | ✅ 完整 |
| 目的地详情 | `detail.*` | ~150+ | ✅ 完整（12 个目的地的景点/描述/实用信息） |
| 评价 | `review.*` | ~60+ | ✅ 完整 |
| 收藏 | `favorites.*` | 4 | ✅ 完整 |
| 关于 | `about.*`, `team.*` | ~20 | ✅ 完整 |
| 行程 | `trip.*` | ~20 | ✅ 完整 |
| 天气 | `weather.*` | ~15 | ✅ 完整 |
| 页脚 | `footer.*` | 8 | ✅ 完整 |
| 404 | `notFound.*` | 3 | ✅ 完整 |
| 分类 | `cat.*` | 4 | ✅ 完整 |

### 6.3 i18n 特殊注意事项

1. **插值参数**：
   - `destinations.count`: `{{count}}`
   - `trip.day`: `{{n}}`
   - `trip.daysCount`: `{{n}}`

2. **aria-label 未国际化**：
   - `"Add to wishlist"` / `"Remove from wishlist"` — 固定为英文
   - `"Toggle menu"` — 固定为英文
   - `"Back to top"` — 固定为英文
   - `"Slide N"` — 固定为英文
   - 这些 aria-label 在 i18n 切换时不变，可作为测试中的稳定锚点

3. **搜索基于翻译文本**：搜索功能使用 `t(d.nameKey)` 进行匹配，切换语言后搜索行为不同

---

## 7. 交互元素目录

### 7.1 按类型分类

#### 链接 (`<Link>` / `<a>`)

| 位置 | 目标 | 数量 | 说明 |
|------|------|------|------|
| Navbar | 5 个导航链接 | 5 | 桌面和移动端各一套 |
| Footer | 3 个快速链接 | 3 | - |
| HomePage | 8 张目的地卡片 + 4 个主题卡片 + "查看全部" 按钮 | 13 | - |
| DestinationsPage | N 张目的地卡片 | 最多 12 | 筛选后数量变化 |
| DetailPage | 面包屑（3个） + 相关推荐（3个） + "规划行程" + "返回列表" | 8 | - |
| FavoritesPage | N 张卡片 + "去探索目的地" | 动态 | - |
| TripPlannerPage | N 张行程卡 "编辑行程" | 动态 | - |
| TripEditPage | "返回行程列表" | 1 | - |
| AboutPage | `mailto:` 链接 | 1 | 外部操作 |
| NotFoundPage | "返回首页" | 1 | - |

#### 按钮 (`<button>`)

| 位置 | 功能 | aria-label | 说明 |
|------|------|------------|------|
| Navbar | 语言切换 | 无（文本 EN/中文） | 切换中英文 |
| Navbar | 汉堡菜单 | `"Toggle menu"` | 仅移动端可见 |
| DestinationCard | 收藏 | `"Add/Remove from wishlist"` | 每张卡片内 |
| DetailPage | 收藏 | `"Add/Remove from wishlist"` | 标题旁 |
| Carousel | 圆点指示器 | `"Slide N"` | 3 个 |
| ScrollToTop | 返回顶部 | `"Back to top"` | 滚动 >300px 显示 |
| TripPlannerPage | 创建行程 | 无（文本） | - |
| TripPlannerPage | 删除行程 | 无（文本） | 触发 confirm |
| TripPlannerPage | 弹窗取消/创建 | 无（文本） | - |
| TripEditPage | 天数标签 | 无（文本） | N 个按钮 |
| TripEditPage | 快速添加景点 | 无（文本） | 4 个按钮 |
| TripEditPage | 添加活动 | 无（文本） | - |
| TripEditPage | 保存/取消活动 | 无（文本） | - |
| TripEditPage | 删除活动 | `t('trip.delete')` | hover 显示 |
| TripEditPage | 删除行程 | 无（文本） | 触发 confirm |

#### 表单输入

| 位置 | 元素类型 | placeholder / label | 说明 |
|------|----------|---------------------|------|
| HomePage | `<input>` text | `t('hero.search')` | 搜索目的地 |
| DestinationsPage | `<input>` text | `t('destinations.search')` | 搜索筛选 |
| DestinationsPage | 3 个 `<select>` | aria-label 标注 | 地区/类型/排序 |
| TripPlannerPage | `<select>` | aria-label=`t('trip.selectDest')` | 目的地选择 |
| TripPlannerPage | `<input>` text | placeholder=`t('trip.namePlaceholder')` | 行程名称 |
| TripPlannerPage | `<input>` number | aria-label=`t('trip.days')` | 天数 (1-14) |
| TripEditPage | `<input>` text | aria-label=`t('trip.name')` | 可编辑行程名称 |
| TripEditPage | `<input>` text | placeholder | 活动名称/时间/备注 |

---

## 8. 数据流与状态管理

### 8.1 数据源

| 数据类型 | 来源 | 持久化 | 同步机制 |
|----------|------|--------|----------|
| 目的地列表 | `data/destinations.ts` 静态导入 | 否 | 编译时确定 |
| 天气数据 | `data/weather.ts` 静态导入 | 否 | 编译时确定 |
| 评价数据 | `data/reviews.ts` 静态导入 | 否 | 编译时确定 |
| 团队数据 | `data/team.ts` 静态导入 | 否 | 编译时确定 |
| 收藏数据 | `localStorage` (`travelvista_favorites`) | ✅ | `favorites-changed` 事件 |
| 行程数据 | `localStorage` (`travelvista_trips`) | ✅ | `trips-changed` 事件 |

### 8.2 跨组件通信模式

```
FavoriteButton
  → toggleFavorite() → localStorage 写入
  → window.dispatchEvent('favorites-changed')
  → FavoritesPage useEffect 监听 → 重新读取 getFavorites()

TripPlanner
  → createTrip() / deleteTrip() → localStorage 写入
  → window.dispatchEvent('trips-changed')（在 saveTrips 中自动派发）
  → 组件 useEffect 监听 → 重新读取 getTrips()
```

### 8.3 URL 与状态联动

| URL 参数 | 读取页面 | 行为 |
|----------|----------|------|
| `/destinations?region=asia` | DestinationsPage | 预选地区筛选 |
| `/destinations?type=beach` | DestinationsPage | 预选类型筛选 |
| `/trips?dest=bali` | TripPlannerPage | 自动打开创建弹窗 + 预选目的地 |

---

## 9. 副作用清单

### 9.1 浏览器对话框 (Dialogs)

| 页面 | 触发动作 | 对话框类型 | 消息 | 源码位置 |
|------|----------|------------|------|----------|
| TripPlannerPage | 点击"删除行程"按钮 | `window.confirm()` | `t('trip.deleteConfirm')` | TripPlannerPage.tsx L39 |
| TripEditPage | 点击"🗑 删除行程"按钮 | `window.confirm()` | `t('trip.deleteConfirm')` | TripEditPage.tsx L72 |

**推荐测试处理：**
```typescript
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('confirm');
  await dialog.accept(); // 或 dialog.dismiss() 测试取消
});
```

### 9.2 外部导航

| 页面 | 元素 | 类型 | 目标 |
|------|------|------|------|
| AboutPage | 联系邮箱链接 | `mailto:` | `hello@travelvista.com` |

**推荐测试处理：**
```typescript
// 验证 href 属性而非实际导航
await expect(page.getByText('hello@travelvista.com')).toHaveAttribute(
  'href', 'mailto:hello@travelvista.com'
);
```

### 9.3 新标签页 / window.open

未检测到 `target="_blank"` 或 `window.open()` 调用。

### 9.4 下载

未检测到 `download` 属性或文件下载行为。

---

## 10. 响应式行为分析

### 10.1 断点设计

基于 Tailwind CSS 默认断点：

| 断点 | 宽度 | 影响组件 |
|------|------|----------|
| `sm` | ≥640px | 卡片网格 2 列 |
| `md` | ≥768px | Navbar 桌面/移动切换、Footer 3 列、Hero 高度、卡片网格变化 |
| `lg` | ≥1024px | 卡片网格 3-4 列、详情页主内容/侧边栏分栏 |

### 10.2 关键响应式变化

| 组件 | 移动端 (< 768px) | 桌面端 (≥ 768px) |
|------|-------------------|-------------------|
| Navbar | 汉堡菜单（可展开） | 水平导航链接 |
| HomePage Hero | `h-[70vh]` | `h-[85vh]` |
| HomePage 卡片 | 1 列 | 4 列 (`lg:grid-cols-4`) |
| DestinationsPage 卡片 | 1 列 | 3 列 (`lg:grid-cols-3`) |
| FilterBar | 垂直排列 | 水平排列 (`sm:flex-row`) |
| DetailPage 图片 | 单列 | 主图 2/3 + 副图 1/3 |
| DetailPage 内容 | 单列 | 主内容 2/3 + 侧边栏 1/3 |
| TripPlanner 卡片 | 1 列 | 2 列 |
| AboutPage 价值观 | 1 列 | 3 列 |
| 团队成员 | 1-2 列 | 4 列 |

---

## 11. 推荐测试场景

### 11.1 组件测试 (CT) — playwright-ct.config.ts

#### SearchBar

| 编号 | 场景 | 重要性 |
|------|------|--------|
| CT-SB-01 | 渲染默认 placeholder | 🟢 |
| CT-SB-02 | 自定义 placeholder | 🟢 |
| CT-SB-03 | 输入触发 onChange 回调 | 🔴 |
| CT-SB-04 | 清空输入后值为空 | 🟡 |

#### FavoriteButton

| 编号 | 场景 | 重要性 |
|------|------|--------|
| CT-FB-01 | 初始未收藏状态渲染（空心♡） | 🔴 |
| CT-FB-02 | 初始已收藏状态渲染（实心❤） | 🔴 |
| CT-FB-03 | 点击切换收藏状态 | 🔴 |
| CT-FB-04 | 点击阻止事件冒泡 | 🔴 |
| CT-FB-05 | 触发 `favorites-changed` 事件 | 🟡 |
| CT-FB-06 | aria-label 正确切换 | 🟡 |

#### DestinationCard

| 编号 | 场景 | 重要性 |
|------|------|--------|
| CT-DC-01 | 渲染目的地名称、国家、描述 | 🔴 |
| CT-DC-02 | 渲染类型标签 | 🟡 |
| CT-DC-03 | 渲染星级和评分 | 🟡 |
| CT-DC-04 | 链接指向正确详情页 | 🔴 |
| CT-DC-05 | 包含图片并有 alt 文本 | 🟡 |
| CT-DC-06 | 包含 FavoriteButton | 🟢 |

#### Carousel

| 编号 | 场景 | 重要性 |
|------|------|--------|
| CT-CR-01 | 渲染所有幻灯片 | 🔴 |
| CT-CR-02 | 圆点指示器数量正确 | 🟡 |
| CT-CR-03 | 点击圆点切换幻灯片 | 🔴 |
| CT-CR-04 | 自动播放切换 | 🟡 |
| CT-CR-05 | 循环播放到第一张 | 🟢 |

#### FilterBar

| 编号 | 场景 | 重要性 |
|------|------|--------|
| CT-FB-01 | 渲染搜索框和 3 个下拉框 | 🔴 |
| CT-FB-02 | 搜索输入触发 onKeywordChange | 🔴 |
| CT-FB-03 | 地区选择触发 onRegionChange | 🔴 |
| CT-FB-04 | 各下拉框选项正确 | 🟡 |
| CT-FB-05 | 初始值从 props 正确设置 | 🟡 |

#### WeatherWidget

| 编号 | 场景 | 重要性 |
|------|------|--------|
| CT-WW-01 | 渲染当前温度 | 🔴 |
| CT-WW-02 | 渲染 5 日预报 | 🔴 |
| CT-WW-03 | 无数据时不渲染 | 🟡 |
| CT-WW-04 | 天气图标正确显示 | 🟢 |

#### ScrollToTop

| 编号 | 场景 | 重要性 |
|------|------|--------|
| CT-ST-01 | 初始不可见 | 🟡 |
| CT-ST-02 | 滚动超 300px 后显示 | 🟡 |
| CT-ST-03 | 点击滚动到顶部 | 🟡 |

### 11.2 E2E 测试 — playwright.config.ts (project: e2e)

#### 导航

| 编号 | 场景 | 重要性 |
|------|------|--------|
| E2E-NAV-01 | 所有导航链接可点击并跳转对应页面 | 🔴 |
| E2E-NAV-02 | 活跃链接高亮 | 🟡 |
| E2E-NAV-03 | 移动端汉堡菜单展开/收回 | 🔴 |
| E2E-NAV-04 | Logo 跳转首页 | 🟢 |
| E2E-NAV-05 | Footer 链接可用 | 🟢 |
| E2E-NAV-06 | 面包屑导航功能 | 🟡 |

#### i18n

| 编号 | 场景 | 重要性 |
|------|------|--------|
| E2E-I18N-01 | 默认显示中文 | 🔴 |
| E2E-I18N-02 | 点击 EN 按钮切换到英文 | 🔴 |
| E2E-I18N-03 | 切换后所有可见文本变为英文 | 🔴 |
| E2E-I18N-04 | 再次切换恢复中文 | 🟡 |
| E2E-I18N-05 | 搜索功能在英文下正常工作 | 🟡 |

#### 搜索与筛选

| 编号 | 场景 | 重要性 |
|------|------|--------|
| E2E-SF-01 | 首页搜索过滤热门目的地 | 🔴 |
| E2E-SF-02 | 目的地页搜索关键词过滤 | 🔴 |
| E2E-SF-03 | 地区筛选过滤 | 🔴 |
| E2E-SF-04 | 类型筛选过滤 | 🔴 |
| E2E-SF-05 | 评分排序 | 🟡 |
| E2E-SF-06 | 名称排序 | 🟡 |
| E2E-SF-07 | 组合筛选（地区+类型） | 🔴 |
| E2E-SF-08 | 无结果状态显示 | 🟡 |
| E2E-SF-09 | URL 参数预选筛选条件 | 🟡 |

#### 收藏功能

| 编号 | 场景 | 重要性 |
|------|------|--------|
| E2E-FAV-01 | 点击收藏按钮添加到心愿单 | 🔴 |
| E2E-FAV-02 | 再次点击取消收藏 | 🔴 |
| E2E-FAV-03 | 心愿单页面显示已收藏目的地 | 🔴 |
| E2E-FAV-04 | 在心愿单页面取消收藏后卡片消失 | 🔴 |
| E2E-FAV-05 | 刷新后收藏状态保持（localStorage） | 🟡 |
| E2E-FAV-06 | 空心愿单显示空状态 | 🟡 |
| E2E-FAV-07 | 详情页收藏按钮同步状态 | 🟡 |

#### 行程规划

| 编号 | 场景 | 重要性 |
|------|------|--------|
| E2E-TRIP-01 | 创建新行程（完整流程） | 🔴 |
| E2E-TRIP-02 | 创建行程表单验证（必填字段） | 🔴 |
| E2E-TRIP-03 | 删除行程（确认对话框） | 🔴 |
| E2E-TRIP-04 | 删除行程（取消对话框） | 🟡 |
| E2E-TRIP-05 | 编辑行程名称即时保存 | 🔴 |
| E2E-TRIP-06 | 切换天数标签 | 🟡 |
| E2E-TRIP-07 | 添加自定义活动 | 🔴 |
| E2E-TRIP-08 | 快速添加景点 | 🟡 |
| E2E-TRIP-09 | 删除活动 | 🔴 |
| E2E-TRIP-10 | 从详情页跳转并预选目的地 | 🟡 |
| E2E-TRIP-11 | 空行程显示空状态 | 🟡 |
| E2E-TRIP-12 | 刷新后行程数据保持 | 🟡 |

#### 目的地详情

| 编号 | 场景 | 重要性 |
|------|------|--------|
| E2E-DET-01 | 从列表页跳转到详情页 | 🔴 |
| E2E-DET-02 | 显示所有详情信息 | 🟡 |
| E2E-DET-03 | 天气组件显示 | 🟡 |
| E2E-DET-04 | 相关推荐跳转 | 🟢 |
| E2E-DET-05 | 无效 ID 显示 404 状态 | 🟡 |

#### 404 页面

| 编号 | 场景 | 重要性 |
|------|------|--------|
| E2E-404-01 | 无效路由显示 404 | 🔴 |
| E2E-404-02 | "返回首页" 按钮可用 | 🟡 |

### 11.3 视觉回归测试 — playwright.config.ts (project: visual)

#### 页面基线截图

| 编号 | 页面 | 视口 | 语言 | 重要性 |
|------|------|------|------|--------|
| VIS-HP-01 | HomePage | Desktop (1280×720) | zh | 🔴 |
| VIS-HP-02 | HomePage | Mobile (375×667) | zh | 🔴 |
| VIS-HP-03 | HomePage | Desktop | en | 🟡 |
| VIS-DP-01 | DestinationsPage | Desktop | zh | 🔴 |
| VIS-DP-02 | DestinationsPage | Mobile | zh | 🟡 |
| VIS-DD-01 | DestinationDetailPage (bali) | Desktop | zh | 🔴 |
| VIS-DD-02 | DestinationDetailPage (bali) | Mobile | zh | 🟡 |
| VIS-FP-01 | FavoritesPage（空状态） | Desktop | zh | 🟡 |
| VIS-FP-02 | FavoritesPage（有收藏） | Desktop | zh | 🟡 |
| VIS-AP-01 | AboutPage | Desktop | zh | 🟡 |
| VIS-TP-01 | TripPlannerPage（空状态） | Desktop | zh | 🟡 |
| VIS-TP-02 | TripPlannerPage（创建弹窗） | Desktop | zh | 🟡 |
| VIS-TE-01 | TripEditPage | Desktop | zh | 🟡 |
| VIS-NF-01 | NotFoundPage | Desktop | zh | 🟢 |

#### 组件基线截图

| 编号 | 组件 | 状态 | 重要性 |
|------|------|------|--------|
| VIS-CT-NAV-01 | Navbar 桌面端 | 默认 | 🔴 |
| VIS-CT-NAV-02 | Navbar 移动端（展开） | 展开菜单 | 🟡 |
| VIS-CT-CARD-01 | DestinationCard | 未收藏 | 🔴 |
| VIS-CT-CARD-02 | DestinationCard | 已收藏 | 🟡 |
| VIS-CT-FILTER-01 | FilterBar | 默认 | 🟡 |
| VIS-CT-WEATHER-01 | WeatherWidget | 晴天 | 🟡 |
| VIS-CT-FOOTER-01 | Footer | 默认 | 🟢 |

---

## 12. 发现的问题与建议

### 12.1 🔴 高优先级

| 编号 | 问题 | 影响 | 建议 |
|------|------|------|------|
| ISS-01 | **完全没有 `data-testid` 属性** | 测试定位不稳定，i18n 切换后定位器失效 | 为关键交互元素添加 data-testid（见 5.4 节） |
| ISS-02 | **aria-label 硬编码英文** | 不符合可访问性最佳实践，中文环境下屏幕阅读器体验差 | 将 aria-label 纳入 i18n 翻译键 |
| ISS-03 | **`tests/` 目录为空** | 无任何测试覆盖 | 按 11 节场景添加 E2E、CT、Visual 测试 |
| ISS-04 | **`<title>` 为 "temp-vite-app"** | 页面标题未正确设置，影响 SEO 和可访问性 | 在 `index.html` 中修改 title 为 "TravelVista" |

### 12.2 🟡 中优先级

| 编号 | 问题 | 影响 | 建议 |
|------|------|------|------|
| ISS-05 | **`window.confirm()` 原生对话框** | 无法自定义样式，可能导致 E2E 测试需额外处理 | 测试中注册 `page.on('dialog')` 处理 |
| ISS-06 | **语言切换无持久化** | 刷新后恢复默认中文 | 可考虑 localStorage 持久化语言选择 |
| ISS-07 | **搜索仅基于名称和描述** | 用户可能期望搜索更多字段（国家、景点等） | 扩展搜索范围 |
| ISS-08 | **图片懒加载不一致** | 部分 `<img>` 有 `loading="lazy"`，部分没有 | 统一添加懒加载 |
| ISS-09 | **行程 ID 使用 `Date.now().toString(36)`** | 在极短时间创建多个行程可能产生冲突 | 使用 crypto.randomUUID() 或加入随机因子 |

### 12.3 🟢 低优先级

| 编号 | 问题 | 影响 | 建议 |
|------|------|------|------|
| ISS-10 | 社交链接（微博/微信/Instagram）为 `<span>` 无链接 | 点击无实际操作 | 添加实际社交链接或移除手型光标 |
| ISS-11 | 团队成员无真实头像 | 使用 👤 emoji 占位 | 添加真实头像或 SVG 占位图 |
| ISS-12 | Carousel 无拖拽/滑动支持 | 移动端体验欠佳 | 添加触摸滑动手势支持 |
| ISS-13 | 天气数据为硬编码 | 与实际天气无关 | 如需真实数据可接入天气 API |

---

## 附录 A：Playwright 配置映射

| 测试类型 | 配置文件 | 项目名 | 测试目录 | npm 脚本 |
|----------|----------|--------|----------|----------|
| E2E | `playwright.config.ts` | `e2e` | `tests/e2e/` | `npm run test:e2e` |
| Visual | `playwright.config.ts` | `visual` | `tests/visual/` | `npm run test:visual` |
| CT | `playwright-ct.config.ts` | - | `tests/component/` | `npm run test:ct` |
| Azure E2E | `playwright.service.config.ts` | `e2e` | `tests/e2e/` | `npm run test:azure:e2e` |
| Azure Visual | `playwright.service.config.ts` | `visual` | `tests/visual/` | `npm run test:azure:visual` |

## 附录 B：localStorage 数据结构

### `travelvista_favorites`
```json
["bali", "kyoto", "paris"]
```

### `travelvista_trips`
```json
[
  {
    "id": "m1abc",
    "name": "巴厘岛蜜月之旅",
    "destinationId": "bali",
    "days": [
      {
        "dayNumber": 1,
        "activities": [
          { "id": "m1xyz", "customName": "海神庙", "time": "上午 9:00", "notes": "日出时分最美" }
        ]
      },
      { "dayNumber": 2, "activities": [] },
      { "dayNumber": 3, "activities": [] }
    ],
    "createdAt": "2026-04-07T00:00:00.000Z",
    "updatedAt": "2026-04-07T00:00:00.000Z"
  }
]
```

## 附录 C：目的地 ID 与数据对照表

| ID | 中文名 | 地区 | 类型 | 评分 | 有详情数据 | 有天气数据 |
|----|--------|------|------|------|------------|------------|
| `bali` | 巴厘岛 | 亚洲 | 海滩 | 4.7 | ✅ | ✅ |
| `kyoto` | 京都 | 亚洲 | 文化 | 4.8 | ✅ | ✅ |
| `santorini` | 圣托里尼 | 欧洲 | 海滩 | 4.6 | ✅ | ✅ |
| `paris` | 巴黎 | 欧洲 | 城市 | 4.5 | ✅ | ✅ |
| `maldives` | 马尔代夫 | 亚洲 | 海滩 | 4.9 | ✅ | ✅ |
| `swiss` | 瑞士 | 欧洲 | 山岳 | 4.7 | ✅ | ✅ |
| `newyork` | 纽约 | 北美 | 城市 | 4.4 | ✅ | ✅ |
| `chengdu` | 成都 | 亚洲 | 文化 | 4.5 | ✅ | ✅ |
| `machupicchu` | 马丘比丘 | 南美 | 文化 | 4.8 | ✅ | ✅ |
| `capetown` | 开普敦 | 非洲 | 山岳 | 4.5 | ✅ | ✅ |
| `greatbarrierreef` | 大堡礁 | 大洋洲 | 海滩 | 4.7 | ✅ | ✅ |
| `nepal` | 尼泊尔 | 亚洲 | 山岳 | 4.6 | ✅ | ✅ |
<!-- discovery-meta
  generated: 2026-03-20T00:00:00.000Z
  scope: deep
  routes-found: 8
  components-found: 10
  i18n-detected: true
  side-effects-found: 5
-->

# TravelVista — Deep Discovery Report

## 1. Environment & Playwright Readiness

| Check | Status | Detail |
|-------|--------|--------|
| Playwright version | ✅ Installed | `@playwright/test@1.58.2`, `@playwright/experimental-ct-react@1.58.2` |
| Node environment | ✅ Ready | Vite 8, TypeScript 5.9 |
| E2E config | ✅ `playwright.config.ts` | Projects: `e2e` (tests/e2e), `visual` (tests/visual) |
| CT config | ✅ `playwright-ct.config.ts` | testDir: `tests/component`, PostCSS integration for Tailwind |
| Azure config | ✅ `playwright.service.config.ts` | `@azure/playwright@1.1.2`, `DefaultAzureCredential` auth |
| Dev server | ✅ Running | `http://localhost:5173/UI-test-Demo/` (Vite, `reuseExistingServer` enabled) |
| VLM integration | ✅ Available | Opt-in via `VLM_REVIEW=true`, Azure OpenAI GPT-4o, reporter in `tests/utils/vlm-reporter.ts` |
| Visual baselines | ✅ 24 baselines | 10 component-level (darwin), 14 page-level (darwin) |
| Web server config | ✅ Configured | `npm run dev`, baseURL `http://localhost:5173/UI-test-Demo/` |

### npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `test:e2e` | `playwright test --project=e2e` | E2E tests only |
| `test:visual` | `VLM_REVIEW=false playwright test --project=visual` | Visual regression (no VLM) |
| `test:ct` | `playwright test -c playwright-ct.config.ts` | Component tests |
| `test:all` | Both E2E/visual + CT | Full local suite |
| `test:update-snapshots` | `--update-snapshots` | Regenerate visual baselines |
| `test:azure` | `--config=playwright.service.config.ts` | Azure Playwright cloud |
| `test:visual:vlm` | `VLM_REVIEW=true ...` | Visual with VLM adjudication |

---

## 2. Framework & Build Detection

| Aspect | Value |
|--------|-------|
| **Framework** | React 19.2.4 |
| **Build tool** | Vite 8.0.0 (`@vitejs/plugin-react@6.0.0`) |
| **CSS** | Tailwind CSS 4.2.1 (via `@tailwindcss/postcss`, `postcss.config.js`) |
| **Routing** | `react-router-dom@7.13.1` (hash-less BrowserRouter, base path `/UI-test-Demo/`) |
| **i18n** | `i18next@25.8.18` + `react-i18next@16.5.8` |
| **Icons** | `react-icons@5.6.0` (not heavily used — primarily inline SVG) |
| **TypeScript** | 5.9.3 (strict, composite config with `tsconfig.app.json` + `tsconfig.node.json`) |
| **Linting** | ESLint 9 with `typescript-eslint`, `react-hooks`, `react-refresh` plugins |
| **Package manager** | npm (package-lock.json) |
| **Base URL** | `/UI-test-Demo/` (set in `vite.config.ts` `base` option) |

---

## 3. Route Inventory

All routes are defined in `src/App.tsx` inside a `<Layout>` wrapper (Navbar + Footer + ScrollToTop).

| Route Pattern | Page Component | Description |
|---------------|---------------|-------------|
| `/` | `HomePage` | Hero banner, search, popular destinations (8), travel themes (4 categories), review carousel |
| `/destinations` | `DestinationsPage` | Full destination grid (12), filter bar (keyword, region, type, sort), URL query params support |
| `/destinations/:id` | `DestinationDetailPage` | Breadcrumb, image gallery, attractions, reviews, sidebar (overview, weather, practical info), related destinations |
| `/about` | `AboutPage` | Hero, mission section, 3 value cards, team (4 members), contact/email |
| `/favorites` | `FavoritesPage` | Saved destinations from localStorage, empty state with CTA |
| `/trips` | `TripPlannerPage` | Trip list, create trip modal (destination select, name, days), delete with `window.confirm()` |
| `/trips/:tripId` | `TripEditPage` | Trip name editing, day tabs, activity CRUD, quick-add attractions, weather sidebar, delete with `window.confirm()` |
| `*` | `NotFoundPage` | 404 page with "back home" link |

### URL Query Parameter Support
- `/destinations?type=beach` — Pre-selects type filter
- `/destinations?region=asia` — Pre-selects region filter
- `/trips?dest=bali` — Pre-selects destination and opens create modal

---

## 4. Component Inventory

### 4.1 Layout Components

| Component | File | Props | Dependencies | Notes |
|-----------|------|-------|-------------|-------|
| **Layout** | `src/components/Layout.tsx` | — | `Navbar`, `Footer`, `ScrollToTop`, `react-router-dom.Outlet` | Wraps all routes; flex column with min-h-screen |
| **Navbar** | `src/components/Navbar.tsx` | — | `react-router-dom.Link`, `useLocation`, `useTranslation`, `useState` | Sticky top, responsive mobile menu hamburger, language toggle, active link highlighting |
| **Footer** | `src/components/Footer.tsx` | — | `react-router-dom.Link`, `useTranslation` | 3-column grid: brand, links, social. Copyright bar |
| **ScrollToTop** | `src/components/ScrollToTop.tsx` | — | `useState`, `useEffect` | Fixed bottom-right button, appears after 300px scroll |

### 4.2 Interactive Components

| Component | File | Props | Events | Dependencies |
|-----------|------|-------|--------|-------------|
| **SearchBar** | `src/components/SearchBar.tsx` | `value: string`, `onChange: (v: string) => void`, `placeholder?: string` | `onChange` on input | `useTranslation` |
| **FilterBar** | `src/components/FilterBar.tsx` | `keyword`, `region`, `type`, `sortBy`, `onKeywordChange`, `onRegionChange`, `onTypeChange`, `onSortChange` | 4 change handlers | `SearchBar`, `useTranslation` |
| **Carousel** | `src/components/Carousel.tsx` | `items: ReactNode[]`, `autoPlayInterval?: number` (default: 4000) | Dot click navigation | `useState`, `useEffect`, `useCallback` |
| **FavoriteButton** | `src/components/FavoriteButton.tsx` | `destinationId: string`, `className?: string` | `onClick` (stops propagation) | `utils/favorites`, `useState`, `window.dispatchEvent('favorites-changed')` |
| **DestinationCard** | `src/components/DestinationCard.tsx` | `destination: Destination` | — (entire card is a Link) | `FavoriteButton`, `Link`, `useTranslation` |
| **WeatherWidget** | `src/components/WeatherWidget.tsx` | `destinationId: string` | — | `useTranslation`, `data/weather` |

### 4.3 Provider Dependencies

All components using `useTranslation()` require an `I18nextProvider` wrapper.
All components using `Link` / `useLocation` require a Router wrapper.
Test fixture `TestWrapper` provides both: `<I18nextProvider><MemoryRouter>`.

---

## 5. i18n Detection

| Property | Value |
|----------|-------|
| **Library** | i18next + react-i18next |
| **Default language** | `zh` (Chinese) |
| **Fallback language** | `zh` |
| **Supported languages** | `zh` (Chinese), `en` (English) |
| **Translation files** | `src/i18n/zh.json` (474 lines), `src/i18n/en.json` (474 lines) |
| **Total keys** | 432 per language |
| **Switch mechanism** | Toggle button in Navbar (`i18n.changeLanguage()`) |
| **Persistence** | None — language resets on page reload (in-memory only) |

### i18n Key Distribution

| Prefix | Count | Scope |
|--------|-------|-------|
| `detail.*` | 186 | Destination detail pages (attractions, reviews, practical info) |
| `review.*` | 87 | User reviews on detail pages + homepage carousel |
| `dest.*` | 36 | Destination names, countries, descriptions |
| `trip.*` | 24 | Trip planner UI |
| `weather.*` | 17 | Weather widget labels |
| `about.*` | 14 | About page content |
| `team.*` | 12 | Team member names/titles/bios |
| `destinations.*` | 11 | Destinations page filters/labels |
| `filter.*` | 10 | Filter option labels (regions + types) |
| `footer.*` | 8 | Footer section |
| `home.*` | 8 | Homepage section titles |
| `nav.*` | 6 | Navigation labels |
| `cat.*` | 4 | Category names |
| `hero.*` | 3 | Hero section |
| `favorites.*` | 3 | Favorites page |
| `notFound.*` | 3 | 404 page |

---

## 6. Runtime DOM Exploration

### 6.1 Homepage (`/`)

Verified live at `http://localhost:5173/UI-test-Demo/`:

- **Navbar**: Sticky `<nav>` with `TravelVista` brand link, 5 nav links (首页, 目的地, 心愿单, 行程规划, 关于我们), `EN` toggle button, mobile hamburger `Toggle menu` button
- **Hero section**: Full-width image, `<h1>` "探索世界，发现美好", subtitle paragraph, `<input>` search bar with "搜索目的地..." placeholder
- **Popular Destinations**: `<h2>` heading, 8 DestinationCards in 4-column grid, each card is an `<a>` link to `/destinations/:id` with image, type badge, name heading, country, description, star ratings, and a FavoriteButton
- **Travel Themes**: 4 category links (`beach`, `mountain`, `city`, `culture`) each linking to `/destinations?type=xxx`
- **Reviews Carousel**: 3 review slides with dot navigation buttons (`Slide 1`, `Slide 2`, `Slide 3`), auto-play
- **Footer**: 3-column layout with brand, quick links, social media, copyright `© 2026 TravelVista`
- **ScrollToTop**: Hidden `Back to top` button (appears on scroll > 300px)

### 6.2 Destinations Page (`/destinations`)

- **Page header**: `<h1>` "探索目的地", subtitle
- **FilterBar**: Search input "搜索目的地名称...", 3 `<select>` comboboxes (所有地区/所有类型/排序方式)
- **Result count**: "共 12 个目的地"
- **Card grid**: 12 DestinationCards in 3-column grid
- Filters are reactive — URL params `?type=` and `?region=` pre-populate

### 6.3 Trip Planner Page (`/trips`)

- **Page header**: `<h1>` "行程规划", subtitle "规划您的完美旅程"
- **Create button**: `+ 创建行程` (opens modal)
- **Empty state**: 📋 icon, "还没有行程，开始规划吧！"
- **Modal (when open)**: Destination `<select>`, trip name `<input>`, days `<input type="number">`, cancel/create buttons

---

## 7. Locator Strategy

### 7.1 Recommended Locators by Component

| Element | Recommended Locator | Fallback |
|---------|-------------------|----------|
| **Brand link** | `getByRole('link', { name: 'TravelVista' })` | `locator('nav a:first-child')` |
| **Nav Home** | `getByRole('navigation').getByRole('link', { name: '首页' })` | — |
| **Nav Destinations** | `getByRole('navigation').getByRole('link', { name: '目的地' })` | — |
| **Nav Favorites** | `getByRole('navigation').getByRole('link', { name: '心愿单' })` | — |
| **Nav Trip Planner** | `getByRole('navigation').getByRole('link', { name: '行程规划' })` | — |
| **Nav About** | `getByRole('navigation').getByRole('link', { name: '关于我们' })` | — |
| **Language toggle** | `getByRole('button', { name: 'EN' })` / `getByRole('button', { name: '中文' })` | — |
| **Mobile hamburger** | `getByRole('button', { name: 'Toggle menu' })` | — |
| **Hero search** | `getByPlaceholder('搜索目的地...')` | `locator('.search-input')` |
| **Destinations search** | `getByPlaceholder('搜索目的地名称...')` | — |
| **Region filter** | `getByRole('combobox', { name: '所有地区' })` | `getByLabel('所有地区')` |
| **Type filter** | `getByRole('combobox', { name: '所有类型' })` | `getByLabel('所有类型')` |
| **Sort select** | `getByRole('combobox', { name: '排序方式' })` | `getByLabel('排序方式')` |
| **Dest count text** | `getByText(/共 \d+ 个目的地/)` | — |
| **Destination card** | `locator('a[href*="/destinations/"]')` | `getByRole('link', { name: '巴厘岛' })` |
| **Favorite button** | `getByRole('button', { name: /wishlist/ })` | — |
| **Carousel dot** | `getByRole('button', { name: 'Slide N' })` | — |
| **View All button** | `getByRole('link', { name: '查看全部目的地' })` | — |
| **Create trip** | `getByRole('button', { name: /创建行程/ })` | — |
| **Back to top** | `getByRole('button', { name: 'Back to top' })` | — |
| **Footer copyright** | `getByText('© 2026 TravelVista')` | — |
| **Breadcrumb Home** | `getByRole('main').getByRole('link', { name: '首页' })` | — |
| **Breadcrumb Dest** | `getByRole('main').getByRole('link', { name: '目的地', exact: true })` | — |

### 7.2 i18n-Aware Locator Notes

- All text-based locators above use the default Chinese (`zh`) language
- For English tests, swap to: `'Home'`, `'Destinations'`, `'About'`, `'Explore the World'`, etc.
- Language toggle: after clicking `EN`, button becomes `'中文'`; heading becomes `'Explore the World, Discover Beauty'`
- **Stars**: Use `.star-filled` / `.star-empty` CSS class selectors for star rating counts
- **Card hover**: `.card-hover` class on DestinationCard root

---

## 8. Interaction Analysis

### 8.1 Forms & Input Elements

| Page | Element | Type | Behavior |
|------|---------|------|----------|
| HomePage | Search bar | `<input type="text">` | Filters 8 homepage destinations by name/description match |
| DestinationsPage | Search bar | `<input type="text">` | Filters all 12 destinations |
| DestinationsPage | Region select | `<select>` | Filters by region (6 options) |
| DestinationsPage | Type select | `<select>` | Filters by type (4 options) |
| DestinationsPage | Sort select | `<select>` | Sorts by rating or name |
| TripPlannerPage | Modal: Dest select | `<select>` | All 12 destinations |
| TripPlannerPage | Modal: Name input | `<input type="text">` | Required for trip creation |
| TripPlannerPage | Modal: Days input | `<input type="number" min=1 max=14>` | Controls number of trip days |
| TripEditPage | Trip name input | `<input type="text">` | Inline editable trip name |
| TripEditPage | Activity name | `<input type="text">` | New activity name (required) |
| TripEditPage | Activity time | `<input type="text">` | Optional time for activity |
| TripEditPage | Activity notes | `<input type="text">` | Optional notes |

### 8.2 Buttons & Actions

| Action | Page | Element | Side Effect |
|--------|------|---------|-------------|
| **Toggle favorite** | Any card | Heart button | localStorage write + `favorites-changed` event |
| **Toggle language** | Navbar | EN/中文 button | `i18n.changeLanguage()` |
| **Create trip** | TripPlannerPage | "创建行程" button | Opens modal |
| **Submit trip** | Modal | "创建行程" submit | localStorage write + `trips-changed` event + modal close |
| **Delete trip** | TripPlannerPage | "删除" button | `window.confirm()` → localStorage delete |
| **Delete trip** | TripEditPage | "🗑 删除" button | `window.confirm()` → navigate to `/trips` |
| **Edit trip name** | TripEditPage | Name input | localStorage update |
| **Add activity** | TripEditPage | "保存" button | localStorage update |
| **Quick-add attraction** | TripEditPage | Attraction pills | Direct add without form |
| **Remove activity** | TripEditPage | "✕" button | localStorage update |
| **Switch day tab** | TripEditPage | Day N buttons | UI state change |
| **Carousel dot** | HomePage | Slide N buttons | Carousel slide navigation |
| **Scroll to top** | All pages | ↑ button | Smooth scroll to top |
| **Mobile menu** | All pages | Hamburger | Toggle mobile menu visibility |

---

## 9. Side-Effect Inventory

### 9.1 Dialogs (window.confirm)

| Source File | Line | Triggering Action | Dialog Message | Recommended Handling |
|-------------|------|-------------------|----------------|---------------------|
| `src/pages/TripPlannerPage.tsx` | L41 | Click delete trip button | `t('trip.deleteConfirm')` ("确认删除此行程？") | `page.on('dialog', d => d.accept())` |
| `src/pages/TripEditPage.tsx` | L73 | Click delete trip button | `t('trip.deleteConfirm')` ("确认删除此行程？") | `page.on('dialog', d => d.accept())` |

### 9.2 External Navigation / mailto

| Source File | Element | Type | Target |
|-------------|---------|------|--------|
| `src/pages/AboutPage.tsx` | Contact email link | `<a href="mailto:...">` | `mailto:hello@travelvista.com` |

### 9.3 Custom Events (window.dispatchEvent)

| Event Name | Fired By | Listened By |
|------------|----------|------------|
| `favorites-changed` | `FavoriteButton` component | `FavoritesPage` |
| `trips-changed` | `tripPlanner.ts` utils | `TripPlannerPage`, `TripEditPage` |

### 9.4 localStorage Operations

| Key | Reader | Writer | Data Type |
|-----|--------|--------|-----------|
| `travelvista_favorites` | `getFavorites()`, `isFavorite()` | `toggleFavorite()` | `string[]` (destination IDs) |
| `travelvista_trips` | `getTrips()`, `getTrip()` | `createTrip()`, `updateTrip()`, `deleteTrip()`, `addActivity()`, `removeActivity()` | `Trip[]` |

### 9.5 No New Tabs / Downloads Detected

- No `target="_blank"` links found
- No `window.open()` calls
- No `download` attributes on elements

---

## 10. User Journey Map

### Journey 1: Browse & Discover (Critical Path)
1. Land on homepage → see hero + search
2. Type in search → see filtered popular destinations
3. Click "查看全部目的地" → navigate to `/destinations`
4. Apply region/type/sort filters → see filtered grid
5. Click destination card → navigate to `/destinations/:id`
6. Read detail page (attractions, reviews, weather, practical info)
7. Click related destination → navigate again
8. Use breadcrumb to return to destinations list

### Journey 2: Wishlist Management
1. On any page with destination cards, click heart icon → toggle favorite
2. Navigate to `/favorites` via navbar
3. See saved destinations (or empty state)
4. Remove favorites by clicking heart again
5. Click "探索目的地" link from empty state

### Journey 3: Trip Planning (Full CRUD)
1. From destination detail, click "📋 规划行程" → navigate to `/trips?dest=bali`
2. Auto-open create modal with pre-selected destination
3. Fill trip name, days → click "创建行程"
4. See new trip card → click "编辑行程"
5. Switch day tabs → add activities (quick-add or custom form)
6. Edit trip name inline
7. Remove activities with ✕ button
8. Delete trip with confirm dialog

### Journey 4: i18n Language Switch
1. On any page, click "EN" → all text switches to English
2. Navigate to another page → language persists in session
3. Click "中文" → switch back to Chinese

### Journey 5: Theme-Based Navigation
1. On homepage, click a travel theme card (e.g., "海滩度假")
2. Navigate to `/destinations?type=beach` with pre-applied filter
3. Browse filtered results

### Journey 6: About & Contact
1. Navigate to `/about` via navbar
2. Read mission, values, team
3. Click email link → opens mail client (mailto:)

### Journey 7: 404 Handling
1. Navigate to invalid URL → see 404 page
2. Click "返回首页" → back to homepage

---

## 11. Existing Test Coverage Analysis

### 11.1 E2E Tests (6 files, ~25+ test cases)

| File | Coverage | Key Tests |
|------|----------|-----------|
| `tests/e2e/home.spec.ts` | ✅ Good | Hero display, search filtering, no-results, themes section, "View All" navigation, reviews carousel |
| `tests/e2e/destinations.spec.ts` | ✅ Good | Page title, 12 dest count, keyword/region/type filtering, no-results, card navigation, URL query params |
| `tests/e2e/destination-detail.spec.ts` | ✅ Good | Name display, breadcrumb, image gallery, attractions, rating, related destinations, back navigation |
| `tests/e2e/about.spec.ts` | ✅ Good | Title, mission, 3 values, 4 team members, contact email |
| `tests/e2e/navigation.spec.ts` | ✅ Good | Full navbar navigation, logo home, i18n switch (EN→CN, CN→EN), language persistence, footer |
| `tests/e2e/user-journey.spec.ts` | ✅ Good | Full browse→filter→detail→back journey, theme-based navigation |

### 11.2 Component Tests (7 files, ~40+ test cases)

| File | Coverage | Key Tests |
|------|----------|-----------|
| `tests/component/Carousel.spec.tsx` | ✅ Good | All slides render, dot count, dot navigation, first dot highlighted, single item, auto-play |
| `tests/component/DestinationCard.spec.tsx` | ✅ Good | Name/country, type badge, rating, stars (5 and 4), link href, image alt, description |
| `tests/component/FilterBar.spec.tsx` | ⚠️ Partial | Renders inputs/dropdowns, keyword value, onChange callbacks — **missing: sortBy/onSortChange, combobox count is 2 not 3** |
| `tests/component/Footer.spec.tsx` | ✅ Good | Brand name, nav links, social media, copyright |
| `tests/component/Navbar.spec.tsx` | ✅ Good | Brand, nav links, language toggle, active link highlighting, brand home link, mobile menu |
| `tests/component/SearchBar.spec.tsx` | ✅ Good | Placeholder (default + custom), value display, onChange callback |
| `tests/component/VisualBaseline.spec.tsx` | ✅ Good | Visual baselines for all 10 components |

### 11.3 Visual Tests (1 file + component baselines)

| File | Coverage |
|------|----------|
| `tests/visual/pages.visual.spec.ts` | ✅ Full page screenshots: Home, Destinations, Destination Detail (Bali), About, Favorites (seeded), Trip Planner (seeded), Trip Edit (seeded), Not Found |
| `tests/component/VisualBaseline.spec.tsx` | ✅ Component baselines: Carousel, DestinationCard, FavoriteButton, FilterBar, Footer, Layout, Navbar, ScrollToTop, SearchBar, WeatherWidget |

### 11.4 Test Fixtures & Utilities

| File | Purpose |
|------|---------|
| `tests/fixtures/test-utils.tsx` | `TestWrapper` — provides Router + I18nextProvider for CT |
| `tests/fixtures/visual-stories.tsx` | `VisualFrame`, `LayoutVisualStory` — visual test wrappers |
| `tests/fixtures/visual-test.ts` | VLM-enhanced visual fixture with `assertScreenshotWithVlm` |
| `tests/utils/vlm-reviewer.ts` | Azure OpenAI GPT-4o visual diff reviewer |
| `tests/utils/vlm-prompts.ts` | VLM system/user prompts |
| `tests/utils/vlm-reporter.ts` | Custom Playwright reporter for VLM results |

### 11.5 Baseline Snapshots

**Component baselines (10):** carousel, destination-card, favorite-button, filter-bar, footer, layout, navbar, scroll-to-top, search-bar, weather-widget

**Page baselines (14):** home-page, home-hero, home-main, destinations-page, destinations-hero, destination-detail-bali, destination-detail-hero, about-page, about-hero, favorites-page, trip-planner-page, trip-edit-page, not-found-page, navbar

---

## 12. Coverage Gaps & Recommendations

### 12.1 Missing E2E Coverage

| Gap | Priority | Description |
|-----|----------|-------------|
| **Favorites page (E2E)** | 🔴 High | No E2E test for favorites page — adding/removing favorites, empty state, navigation from empty state |
| **Trip Planner (E2E)** | 🔴 High | No E2E test for trip CRUD — create trip modal, trip list, edit trip, add/remove activities, day switching, delete with confirm dialog |
| **Trip Edit page (E2E)** | 🔴 High | No E2E test for trip editing — inline name edit, activity management, quick-add, weather widget display |
| **Sort functionality** | 🟡 Medium | Destinations sort by rating/name not tested in E2E |
| **Destination detail weather** | 🟡 Medium | Weather widget display not verified in detail E2E tests |
| **Destination detail "plan trip" link** | 🟡 Medium | "📋 规划行程" navigation to `/trips?dest=id` not tested |
| **Mobile responsive nav** | 🟡 Medium | Mobile hamburger menu open/close and navigation |
| **Scroll to top** | 🟢 Low | ScrollToTop button visibility and behavior |
| **Combined filters** | 🟢 Low | Multiple simultaneous filters (keyword + region + type) |
| **Empty favorites navigation** | 🟢 Low | "探索目的地" link from empty favorites state |

### 12.2 Missing Component Test Coverage

| Gap | Priority | Description |
|-----|----------|-------------|
| **WeatherWidget CT** | 🟡 Medium | No component test for WeatherWidget — shows weather for valid destination, returns null for invalid |
| **FavoriteButton CT** | 🟡 Medium | No component test — toggle behavior, localStorage interaction, click stops propagation |
| **ScrollToTop CT** | 🟢 Low | Scroll visibility threshold, click behavior |
| **FilterBar sortBy/onSortChange** | 🟡 Medium | Existing tests don't cover the sort dropdown (3rd combobox) |

### 12.3 Missing Visual Coverage

| Gap | Priority |
|-----|----------|
| **i18n English variant screenshots** | 🟡 Medium — no English-language baselines exist |
| **Mobile viewport baselines** | 🟡 Medium — all baselines are desktop-only |
| **Destination detail for non-Bali** | 🟢 Low — only Bali detail tested visually |
| **Trip create modal open state** | 🟢 Low — modal not captured in visual tests |

### 12.4 FilterBar Test Discrepancy

The `FilterBar` component now accepts `sortBy` and `onSortChange` props (4 total selects), but existing CT tests in `FilterBar.spec.tsx` only test 2 selects (region + type). The sort dropdown tests should be added. Similarly, the assertion for combobox count should account for 3 comboboxes.

---

## 13. Data Inventory

### 13.1 Destinations (12 total)

| ID | Name (zh) | Region | Type | Rating | Stars |
|----|-----------|--------|------|--------|-------|
| `bali` | 巴厘岛 | asia | beach | 4.7 | 5 |
| `kyoto` | 京都 | asia | culture | 4.8 | 5 |
| `santorini` | 圣托里尼 | europe | beach | 4.6 | 5 |
| `paris` | 巴黎 | europe | city | 4.5 | 4 |
| `maldives` | 马尔代夫 | asia | beach | 4.9 | 5 |
| `swiss` | 瑞士 | europe | mountain | 4.7 | 5 |
| `newyork` | 纽约 | north-america | city | 4.4 | 4 |
| `chengdu` | 成都 | asia | culture | 4.5 | 4 |
| `machupicchu` | 马丘比丘 | south-america | culture | 4.8 | 5 |
| `capetown` | 开普敦 | africa | mountain | 4.5 | 4 |
| `greatbarrierreef` | 大堡礁 | oceania | beach | 4.7 | 5 |
| `nepal` | 尼泊尔 | asia | mountain | 4.6 | 5 |

### 13.2 Filter Dimensions

- **Regions (6):** asia, europe, north-america, south-america, africa, oceania
- **Types (4):** beach, mountain, city, culture
- **Sort Options (2):** rating, name

### 13.3 Regional Distribution

| Region | Count | Destinations |
|--------|-------|-------------|
| Asia | 5 | bali, kyoto, maldives, chengdu, nepal |
| Europe | 3 | santorini, paris, swiss |
| North America | 1 | newyork |
| South America | 1 | machupicchu |
| Africa | 1 | capetown |
| Oceania | 1 | greatbarrierreef |

### 13.4 Type Distribution

| Type | Count | Destinations |
|------|-------|-------------|
| Beach | 4 | bali, santorini, maldives, greatbarrierreef |
| Mountain | 3 | swiss, capetown, nepal |
| City | 2 | paris, newyork |
| Culture | 3 | kyoto, chengdu, machupicchu |

---

## 14. Technical Architecture Notes

### State Management
- **No global state library** — uses React `useState` + localStorage for persistence
- **Custom events** (`favorites-changed`, `trips-changed`) for cross-component synchronization
- **URL search params** for filter state on destinations page

### Storage Schema
```typescript
// localStorage: travelvista_favorites
string[]  // e.g., ["bali", "paris"]

// localStorage: travelvista_trips
Trip[] // { id, name, destinationId, days: TripDay[], createdAt, updatedAt }
```

### CSS Architecture
- Tailwind CSS 4 utility classes throughout
- Custom CSS classes: `.search-input`, `.card-hover`, `.hero-overlay`, `.star-filled`, `.star-empty`
- Responsive breakpoints: `sm:`, `md:`, `lg:` (Tailwind defaults)
- Aspect ratios: `.aspect-16-10`, `.aspect-video`, `.aspect-square`

### Image Loading
- `loading="lazy"` on non-hero images
- Images served from `/UI-test-Demo/images/` via `assetUrl()` utility
- Categories: `destinations/`, `categories/`, `hero/`, `icons/`
