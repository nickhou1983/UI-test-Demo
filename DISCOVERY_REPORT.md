# TravelVista UI 测试发现报告

> 生成时间：2026-03-19  
> 运行地址：http://localhost:5174/UI-test-Demo/  
> 可供 component / e2e / visual 测试 agent 复用

---

## 1. 环境就绪状态

| 项目 | 状态 | 详情 |
|------|------|------|
| **框架** | React 19.2 | `react@^19.2.4`, `react-dom@^19.2.4` |
| **构建工具** | Vite 8.0 | `@vitejs/plugin-react@^6.0.0` |
| **语言** | TypeScript 5.9 | 严格模式，`tsconfig.json` + `tsconfig.app.json` |
| **样式系统** | Tailwind CSS v4 + PostCSS | `@tailwindcss/postcss@^4.2.1`，通过 `postcss.config.js` 集成 |
| **路由** | react-router-dom v7 | BrowserRouter，basename=`/UI-test-Demo` |
| **i18n** | i18next + react-i18next | 默认 `zh`，支持 `en` |
| **Playwright E2E** | 已就绪 | `playwright.config.ts`，projects: `e2e` + `visual` |
| **Playwright CT** | 已就绪 | `playwright-ct.config.ts`，`@playwright/experimental-ct-react@^1.58.2` |
| **Playwright Azure** | 已配置 | `playwright.service.config.ts`，`@azure/playwright@^1.1.2` |
| **VLM Review** | 可选 | `VLM_REVIEW=true` 开启，默认关闭 |
| **Base URL** | `/UI-test-Demo/` | Vite base + Router basename 同步 |

### npm 脚本速查

```bash
npm run test:e2e          # E2E 测试（Desktop Chrome）
npm run test:visual       # 视觉回归（VLM 关闭）
npm run test:ct           # 组件测试
npm run test:all          # E2E + Visual + CT
npm run test:update-snapshots  # 视觉基线更新
```

### 已有测试覆盖

| 类型 | 文件 |
|------|------|
| **Component** | `Carousel.spec.tsx`, `DestinationCard.spec.tsx`, `FilterBar.spec.tsx`, `Footer.spec.tsx`, `Navbar.spec.tsx`, `SearchBar.spec.tsx`, `VisualBaseline.spec.tsx` |
| **E2E** | `about.spec.ts`, `destination-detail.spec.ts`, `destinations.spec.ts`, `home.spec.ts`, `navigation.spec.ts`, `user-journey.spec.ts` |
| **Visual** | `pages.visual.spec.ts` |

---

## 2. 组件清单

### 2.1 基础组件 (`src/components/`)

#### Carousel

| 属性 | 值 |
|------|------|
| **文件** | `src/components/Carousel.tsx` |
| **导出** | `default function Carousel` |
| **Props** | `items: React.ReactNode[]`, `autoPlayInterval?: number` (默认 4000) |
| **状态** | `useState(current)`, `useEffect(自动轮播定时器)`, `useCallback(goTo)` |
| **事件** | 点击 indicator button → `goTo(i)` |
| **Provider 依赖** | 无 |
| **样式** | Tailwind（`flex`, `transition-transform`, `rounded-full`） |
| **子组件** | 无 |
| **Locator 策略** | `button[aria-label="Slide N"]`, `.rounded-full` indicator |

#### DestinationCard

| 属性 | 值 |
|------|------|
| **文件** | `src/components/DestinationCard.tsx` |
| **导出** | `default function DestinationCard` |
| **Props** | `destination: Destination` |
| **状态** | 无（无状态） |
| **事件** | 整卡片为 `<Link>`，内嵌 `FavoriteButton` |
| **Provider 依赖** | `Router`（Link）, `i18n`（useTranslation） |
| **样式** | Tailwind（`card-hover`, `shadow-md`, `line-clamp-2`） |
| **子组件** | `FavoriteButton` |
| **Locator 策略** | `link` 包含目的地名称, `img[alt=名称]`, `button[aria-label="Add/Remove from wishlist"]` |

#### FavoriteButton

| 属性 | 值 |
|------|------|
| **文件** | `src/components/FavoriteButton.tsx` |
| **导出** | `default function FavoriteButton` |
| **Props** | `destinationId: string`, `className?: string` |
| **状态** | `useState(favorited)` — 读写 `localStorage` |
| **事件** | `onClick` → `toggleFavorite()` + `dispatchEvent('favorites-changed')` |
| **Provider 依赖** | 无（但依赖 `localStorage`） |
| **样式** | Tailwind（`hover:scale-110`, `active:scale-95`） |
| **子组件** | SVG 图标（心形，filled/outline 切换） |
| **Locator 策略** | `button[aria-label="Add to wishlist"]` / `button[aria-label="Remove from wishlist"]` |
| **副作用** | `e.preventDefault()` + `e.stopPropagation()`（阻止父 Link 导航） |

#### FilterBar

| 属性 | 值 |
|------|------|
| **文件** | `src/components/FilterBar.tsx` |
| **导出** | `default function FilterBar` |
| **Props** | `keyword`, `region`, `type`, `sortBy` (string) + 4 个 `onChange` 回调 |
| **状态** | 无（受控组件） |
| **事件** | `onKeywordChange`, `onRegionChange`, `onTypeChange`, `onSortChange` |
| **Provider 依赖** | `i18n`（useTranslation） |
| **样式** | Tailwind（`flex`, `sm:flex-row`, 响应式） |
| **子组件** | `SearchBar` |
| **Locator 策略** | `combobox[aria-label="所有地区/所有类型/排序方式"]`, SearchBar input |
| **数据** | regions: `['asia','europe','north-america','south-america','africa','oceania']`, types: `['beach','mountain','city','culture']` |

#### Footer

| 属性 | 值 |
|------|------|
| **文件** | `src/components/Footer.tsx` |
| **导出** | `default function Footer` |
| **Props** | 无 |
| **状态** | 无 |
| **Provider 依赖** | `Router`（Link）, `i18n`（useTranslation） |
| **样式** | Tailwind（`bg-orange-900`, `grid`, `md:grid-cols-3`） |
| **DOM 结构** | `<footer>` → 品牌/快速链接/社交媒体 三栏 + 版权 |
| **Locator 策略** | `contentinfo` landmark, `link("首页/目的地/关于我们")`, `text("微博/微信/Instagram")` |

#### Layout

| 属性 | 值 |
|------|------|
| **文件** | `src/components/Layout.tsx` |
| **导出** | `default function Layout` |
| **Props** | 无 |
| **状态** | 无 |
| **Provider 依赖** | `Router`（Outlet） |
| **子组件** | `Navbar`, `Footer`, `ScrollToTop`, `<Outlet />` |
| **结构** | `div.min-h-screen` → Navbar + flex-1(Outlet) + Footer + ScrollToTop |

#### Navbar

| 属性 | 值 |
|------|------|
| **文件** | `src/components/Navbar.tsx` |
| **导出** | `default function Navbar` |
| **Props** | 无 |
| **状态** | `useState(menuOpen)` — 手机菜单展开/收起 |
| **事件** | 语言切换 `toggleLanguage()`，移动菜单 `setMenuOpen` |
| **Provider 依赖** | `Router`（Link, useLocation）, `i18n`（useTranslation, i18n.changeLanguage） |
| **样式** | Tailwind（`sticky top-0 z-50`, `md:hidden`, 响应式导航） |
| **导航链接** | `/` 首页, `/destinations` 目的地, `/favorites` 心愿单, `/trips` 行程规划, `/about` 关于我们 |
| **Locator 策略** | `navigation` landmark, `link("首页/目的地/...")`, `button("EN"/exact)`, `button("Toggle menu")` |
| **已知问题** | `sticky` navbar 的 z-index 与页面 `hero-overlay` 冲突，需 `{ force: true }` 点击语言按钮 |

#### ScrollToTop

| 属性 | 值 |
|------|------|
| **文件** | `src/components/ScrollToTop.tsx` |
| **导出** | `default function ScrollToTop` |
| **Props** | 无 |
| **状态** | `useState(visible)`, `useEffect(scroll 监听)` |
| **事件** | `onClick` → `window.scrollTo({ top: 0 })` |
| **Locator 策略** | `button[aria-label="Back to top"]` |
| **可见性** | `window.scrollY > 300` 时显示 |

#### SearchBar

| 属性 | 值 |
|------|------|
| **文件** | `src/components/SearchBar.tsx` |
| **导出** | `default function SearchBar` |
| **Props** | `value: string`, `onChange: (value: string) => void`, `placeholder?: string` |
| **状态** | 无（受控组件） |
| **Provider 依赖** | `i18n`（useTranslation，默认 placeholder） |
| **样式** | Tailwind（`rounded-full`, `search-input`） |
| **Locator 策略** | `textbox[placeholder="搜索目的地..."]` / `textbox[placeholder="搜索目的地名称..."]` |

#### WeatherWidget

| 属性 | 值 |
|------|------|
| **文件** | `src/components/WeatherWidget.tsx` |
| **导出** | `default function WeatherWidget` |
| **Props** | `destinationId: string` |
| **状态** | 无 |
| **Provider 依赖** | `i18n`（useTranslation） |
| **数据** | `getWeatherForDestination(id)` → 当前天气 + 5 天预报 |
| **Locator 策略** | `heading("🌤 天气预报")`, 温度 `.text-3xl`, 通过天气 emoji 定位 |
| **条件渲染** | 无天气数据时返回 `null` |

---

### 2.2 页面组件 (`src/pages/`)

#### HomePage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/HomePage.tsx` |
| **路由** | `/` |
| **状态** | `useState(search)`, `useMemo(filtered)` |
| **子组件** | `SearchBar`, `DestinationCard` ×8, `Carousel`(评论), `Link` |
| **Provider 依赖** | `Router`, `i18n` |
| **数据导入** | `homepageDestinations`(8 个), `categories`(4 个), `reviews` |
| **区块** | Hero（搜索）→ 热门目的地（4 列网格）→ 旅行主题（4 类）→ 用户评价（轮播） |
| **Locator 策略** | `heading("探索世界，发现美好")`, `heading("热门目的地")`, `heading("旅行主题")`, `heading("用户评价")`, `link("查看更多目的地")` |
| **已知问题** | hero-overlay `absolute inset-0` 覆盖整个页面，阻挡 navbar 点击 |

#### DestinationsPage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/DestinationsPage.tsx` |
| **路由** | `/destinations` |
| **状态** | `useState` × 4 (keyword, region, type, sortBy) + `useMemo(filtered)` |
| **子组件** | `FilterBar`, `DestinationCard` ×N |
| **Provider 依赖** | `Router`(useSearchParams), `i18n` |
| **数据** | `destinations`(12 个), 支持 URL query `?type=xxx&region=xxx` |
| **区块** | Header → FilterBar → 计数 → 3 列网格 / 空状态 |
| **Locator 策略** | `heading("探索目的地")`, 计数 `text("共 N 个目的地")`, 筛选 combobox |

#### DestinationDetailPage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/DestinationDetailPage.tsx` |
| **路由** | `/destinations/:id` |
| **状态** | 无（从 URL param 派生） |
| **子组件** | `FavoriteButton`, `WeatherWidget`, `DestinationCard`(相关推荐) |
| **Provider 依赖** | `Router`(useParams, Link), `i18n` |
| **区块** | 面包屑 → 图片画廊(3 图) → 主内容(名称/描述/景点/评价) + 侧边栏(概览/天气/实用信息/操作按钮) → 相关推荐 |
| **Locator 策略** | `navigation`(面包屑), `heading(目的地名)`, `heading("必游景点")`, `heading("旅行者评价")`, `link("📋 规划行程")` |
| **条件渲染** | id 无效时显示"未找到" + 返回按钮 |

#### AboutPage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/AboutPage.tsx` |
| **路由** | `/about` |
| **状态** | 无 |
| **Provider 依赖** | `i18n` |
| **区块** | Hero → 使命(3 价值观卡片) → 团队(4 成员) → 联系(邮件链接) |
| **Locator 策略** | `heading("关于本站")`, `heading("我们的使命")`, `heading("我们的团队")`, `heading("联系我们")`, `link("hello@travelvista.com")` |

#### FavoritesPage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/FavoritesPage.tsx` |
| **路由** | `/favorites` |
| **状态** | `useState(favoriteIds)`, `useEffect(favorites-changed 监听)` |
| **子组件** | `DestinationCard` ×N |
| **Provider 依赖** | `Router`, `i18n` |
| **数据** | `localStorage` → `getFavorites()` → 过滤 destinations |
| **区块** | Header → 3 列网格 / 空状态("还没有收藏的目的地" + "去探索目的地"按钮) |
| **Locator 策略** | `heading("我的心愿单")`, `text("还没有收藏的目的地")`, `link("去探索目的地")` |

#### TripPlannerPage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/TripPlannerPage.tsx` |
| **路由** | `/trips` |
| **状态** | `useState` ×5 (trips, showModal, formDest, formName, formDays) |
| **子组件** | 模态框(创建行程), 行程卡片 |
| **Provider 依赖** | `Router`(useSearchParams, Link), `i18n` |
| **数据** | `localStorage` → `getTrips()`/`createTrip()`/`deleteTrip()` |
| **交互** | 创建行程(模态框: 选目的地+名称+天数) → 编辑/删除(confirm 弹窗) |
| **Locator 策略** | `heading("行程规划")`, `button("+ 创建行程")`, 模态框中 `select`, `input`, `button("创建行程/取消")` |
| **URL Query** | `?dest=xxx` 预选目的地并自动打开模态框 |

#### TripEditPage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/TripEditPage.tsx` |
| **路由** | `/trips/:tripId` |
| **状态** | `useState` ×5 (trip, activeDay, showAddForm, activityName/Time/Notes) |
| **子组件** | `WeatherWidget`, 日程 tab, 活动列表, "快速添加"景点按钮 |
| **Provider 依赖** | `Router`(useParams, useNavigate, Link), `i18n` |
| **交互** | 修改行程名(input) → 日切换(tab) → 快速添加景点 → 自定义活动(表单) → 删除活动(×按钮) → 删除行程(confirm) |
| **Locator 策略** | `input[aria-label="行程名称"]`, day tab buttons, 活动编号圆圈, `button("✕")` |

#### NotFoundPage

| 属性 | 值 |
|------|------|
| **文件** | `src/pages/NotFoundPage.tsx` |
| **路由** | `*` (catch-all) |
| **状态** | 无 |
| **Provider 依赖** | `Router`, `i18n` |
| **Locator 策略** | `heading("404")`, `text("抱歉...不存在或已被移除")`, `link("返回首页")` |

---

## 3. 路由清单

| 路径 | 页面组件 | 动态参数 | URL Query | 布局 |
|------|---------|---------|-----------|------|
| `/` | `HomePage` | - | - | Layout (Navbar+Footer+ScrollToTop) |
| `/destinations` | `DestinationsPage` | - | `?type=xxx&region=xxx` | Layout |
| `/destinations/:id` | `DestinationDetailPage` | `id` (e.g. `bali`, `kyoto`) | - | Layout |
| `/about` | `AboutPage` | - | - | Layout |
| `/favorites` | `FavoritesPage` | - | - | Layout |
| `/trips` | `TripPlannerPage` | - | `?dest=xxx` | Layout |
| `/trips/:tripId` | `TripEditPage` | `tripId` (UUID) | - | Layout |
| `*` | `NotFoundPage` | - | - | Layout |

**Provider 包装链**：`StrictMode` → `BrowserRouter(basename="/UI-test-Demo")` → `Routes` → `Layout(Outlet)` → Page

**已知目的地 ID**（可用于 `:id` 参数测试）：来自 `destinations` 数据，至少包含 `bali`, `kyoto`, `santorini` 等 12 个。

---

## 4. i18n 配置

| 项目 | 详情 |
|------|------|
| **库** | `i18next@^25.8.18` + `react-i18next@^16.5.8` |
| **默认语言** | `zh`（中文） |
| **支持语言** | `zh`, `en` |
| **回退语言** | `zh` |
| **切换方式** | Navbar 按钮 `toggleLanguage()` → `i18n.changeLanguage('en'/'zh')` |
| **按钮文案** | 中文时显示 "EN"，英文时显示 "中文"（由 `t('nav.lang')` 控制） |
| **翻译文件** | `src/i18n/zh.json`, `src/i18n/en.json` |
| **加载方式** | 静态 import with `{ type: 'json' }` |
| **插值** | `escapeValue: false` |

### i18n 测试要点
- 所有文案通过 `t('key')` 调用，无硬编码文案（除品牌名 "TravelVista"）
- 切换语言后路由不变，仅文案刷新
- 部分 aria-label 为英文硬编码（如 `"Add to wishlist"`, `"Back to top"`, `"Toggle menu"`）

---

## 5. 运行时 DOM 探索结果

### 5.1 全局布局结构

```
<div>                           ← root
  <nav.sticky.top-0.z-50>      ← Navbar (navigation landmark)
    <div.max-w-7xl>
      <a>TravelVista</a>       ← Logo link
      <button>Toggle menu</button> ← Mobile only (md:hidden)
    </div>
    <div.hidden.md:flex>        ← Desktop nav links
      <a>首页/目的地/心愿单/行程规划/关于我们</a>
      <button>EN</button>       ← 语言切换
    </div>
    <div.md:hidden>             ← Mobile menu (expandable)
  </nav>
  <main>                        ← Page content (via Outlet)
  <footer.bg-orange-900>        ← Footer (contentinfo landmark)
  <button>Back to top</button>  ← ScrollToTop (fixed, conditional)
</div>
```

### 5.2 各页面关键 DOM 特征

#### 首页 (/)
- **Hero**: `section.relative.h-[70vh]` → `img[alt="Hero"]` + `.hero-overlay` + h1/p/SearchBar
- **热门目的地**: `section` → h2 + `grid.grid-cols-1.sm:grid-cols-2.lg:grid-cols-4` (8 张 DestinationCard)
- **旅行主题**: `section.bg-white` → `grid.grid-cols-2.md:grid-cols-4` (4 个 category Link)
- **用户评价**: `section` → Carousel (dot indicators)

#### 目的地列表 (/destinations)
- **Header**: `section.bg-orange-800` → h1 + p
- **FilterBar**: SearchBar textbox + 3 个 `<select>` (region/type/sort)
- **计数**: `p text("共 12 个目的地")`
- **Grid**: `grid.grid-cols-1.sm:grid-cols-2.lg:grid-cols-3`

#### 目的地详情 (/destinations/:id)
- **面包屑**: `<nav>` → `首页 / 目的地 / 名称`
- **图片画廊**: 3 图布局 (md:col-span-2 + 2 小图)
- **主内容**: h1 + FavoriteButton + 描述 + 景点(2 列) + 评价
- **侧边栏**: 概览卡片 + WeatherWidget + 实用信息 + 操作按钮

#### 关于页面 (/about)
- **Hero**: 与首页共用 hero-main.jpg
- **使命**: 3 个价值观卡片 (emoji + 标题 + 描述)
- **团队**: 4 人 (👤 头像圆形 + 姓名 + 职位 + 简介)
- **联系**: `mailto:` 链接

#### 心愿单 (/favorites)
- **空状态**: "还没有收藏的目的地" + "去探索目的地" 按钮
- **有数据**: 3 列 DestinationCard 网格

#### 行程规划 (/trips)
- **空状态**: 📋 emoji + "还没有行程"
- **有数据**: 2 列卡片网格 (图片+名称+目的地+天数+编辑/删除)
- **模态框**: 目的地选择 + 名称输入 + 天数输入 + 创建/取消

#### 行程编辑 (/trips/:tripId)
- **标题**: 可编辑 input
- **日程 tab**: `button("第 N 天")` 横排
- **活动列表**: 编号圆圈 + 名称/时间/备注 + 删除按钮
- **快速添加**: 景点 pill 按钮
- **自定义添加**: 名称/时间/备注 表单

#### 404 页面
- h1 "404" + 描述 + "返回首页" 链接

### 5.3 已发现的 Locator 问题

| 问题 | 影响 | 建议 |
|------|------|------|
| `hero-overlay absolute inset-0` | 首页和关于页面的 overlay 拦截 navbar 点击 | E2E 测试中导航到首页后使用 `{ force: true }` 或先滚动到非 hero 区域 |
| 语言按钮 "EN" 与 "Toggle menu" 按钮都匹配 `getByRole('button', { name: 'EN' })` | 严格模式报错 | 使用 `{ name: 'EN', exact: true }` |
| FavoriteButton 的 `e.preventDefault()` + `e.stopPropagation()` | 点击收藏不会触发父 Link 导航 | 测试收藏功能时确认无导航发生 |
| `window.confirm()` 弹窗 | 删除行程需要处理 dialog | E2E 中 `page.on('dialog', d => d.accept())` |
| localStorage 依赖 | 收藏和行程数据贯穿多个页面 | 测试前后需 `context.clearStorageState()` 或设置初始 storage |

---

## 6. 样式系统

| 项目 | 详情 |
|------|------|
| **CSS 框架** | Tailwind CSS v4（通过 `@tailwindcss/postcss` 插件） |
| **PostCSS** | `postcss.config.js` 仅含 `@tailwindcss/postcss` 插件 |
| **全局样式** | `src/index.css` |
| **自定义类** | `card-hover`, `hero-overlay`, `search-input`, `star-filled`, `star-empty`, `aspect-16-10` |
| **响应式断点** | Tailwind 默认: `sm:640px`, `md:768px`, `lg:1024px` |
| **CT 配置** | `playwright-ct.config.ts` 已配置 `ctViteConfig.css.postcss` 指向 PostCSS |

### Visual 测试要点
- 主色调: orange-700/800/900 + emerald-600 + slate
- 响应式布局: 网格列数在 sm/md/lg 切换
- 固定元素: Navbar(sticky top-0), ScrollToTop(fixed right-6 bottom-6)
- 动画: Carousel `transition-transform`, 卡片 `card-hover`, 菜单 `transition-all duration-300`

---

## 7. 数据依赖

| 数据源 | 文件 | 导出 |
|-------|------|------|
| 目的地列表 | `src/data/destinations.ts` | `destinations` (12个), `homepageDestinations` (前8个), `categories` (4个) |
| 目的地详情 | `src/data/destinations.ts` | `destinationDetails` (Record), `getDestinationDetail(id)` |
| 评论 | `src/data/reviews.ts` | `reviews: Review[]` |
| 团队成员 | `src/data/team.ts` | `teamMembers: TeamMember[]` |
| 天气 | `src/data/weather.ts` | `getWeatherForDestination(id)`, `conditionEmoji` |
| 收藏 | `src/utils/favorites.ts` | `getFavorites()`, `isFavorite()`, `toggleFavorite()` — localStorage |
| 行程 | `src/utils/tripPlanner.ts` | `getTrips()`, `getTrip()`, `createTrip()`, `updateTrip()`, `addActivity()`, `removeActivity()`, `deleteTrip()` — localStorage |
| 资源路径 | `src/utils/assetUrl.ts` | `assetUrl(path)` — 拼接 `BASE_URL` |

---

## 8. CT 测试 Provider 总结

组件测试挂载时需要的 Provider wrapper：

| 组件 | 需要 Router | 需要 i18n | 需要 localStorage | 其他 |
|------|:---------:|:--------:|:----------------:|------|
| Carousel | - | - | - | 传入 `items` |
| DestinationCard | ✅ | ✅ | - | 传入 `destination` |
| FavoriteButton | - | - | ✅ | 传入 `destinationId`; `e.preventDefault` |
| FilterBar | - | ✅ | - | 传入 4 个 value + 4 个 onChange |
| Footer | ✅ | ✅ | - | - |
| Layout | ✅ | - | - | 需要 `Outlet` |
| Navbar | ✅ | ✅ | - | 需要 `useLocation` |
| ScrollToTop | - | - | - | 需要 scroll event mock |
| SearchBar | - | ✅ | - | 传入 `value` + `onChange` |
| WeatherWidget | - | ✅ | - | 传入 `destinationId` |

---

## 9. E2E 用户旅程建议

### Journey 1: 浏览与收藏
1. 首页 → 搜索目的地 → 查看搜索结果
2. 点击 "查看更多目的地" → 目的地列表
3. 使用筛选器（地区/类型/排序）
4. 点击目的地卡片 → 详情页
5. 点击收藏按钮 → 验证心形变红
6. 导航到心愿单 → 验证收藏出现

### Journey 2: 行程规划
1. 目的地详情 → 点击 "规划行程"
2. 自动跳转 `/trips?dest=xxx` → 模态框打开
3. 填写行程名称和天数 → 创建
4. 点击编辑 → 进入行程编辑页
5. 快速添加景点 → 自定义添加活动
6. 切换日期 tab → 删除活动
7. 返回行程列表 → 删除行程

### Journey 3: 多语言
1. 任意页面 → 点击 "EN" 按钮（需 force click 或非 hero 页面）
2. 验证所有文案切换为英文
3. 切回中文 → 验证恢复

### Journey 4: 响应式
1. Desktop → Tablet → Mobile 视口
2. 验证 Navbar 切换为汉堡菜单
3. 验证网格列数变化
4. 验证 hero 区域高度适应

---

## 10. Visual 回归测试页面清单

| 页面 | URL | 截图重点 |
|------|-----|---------|
| 首页 | `/` | Hero + 目的地网格 + 主题 + 轮播 |
| 目的地列表 | `/destinations` | Header + FilterBar + 网格 |
| 目的地详情 | `/destinations/bali` | 图片画廊 + 内容 + 侧边栏 |
| 关于页面 | `/about` | Hero + 价值观 + 团队 + 联系 |
| 心愿单(空) | `/favorites` | 空状态 UI |
| 行程规划(空) | `/trips` | 空状态 UI |
| 404 页面 | `/nonexistent` | 404 布局 |

### 视口变体
- Desktop: 1280×720 (默认 Playwright Desktop Chrome)
- Tablet: 768×1024
- Mobile: 375×667

### i18n 变体
- 每个页面 × `zh` + `en`
