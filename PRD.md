# TravelVista — 旅游目的地浏览网站 PRD

## 1. 项目概览

| 项目 | 说明 |
| ------ | ------ |
| 项目名称 | TravelVista |
| 项目类型 | React 单页应用（SPA） |
| 目标用户 | 旅游爱好者、行程规划者 |
| 默认语言 | 中文（运行时切换英文） |
| 设计理念 | 简洁清晰、蓝绿色调、响应式布局 |
| 线上地址 | `https://nickhou1983.github.io/UI-test-Demo/` |
| 仓库地址 | `https://github.com/nickhou1983/UI-test-Demo` |

### 项目目标

为用户提供精美的旅游目的地浏览体验，展示全球热门旅行目的地。用户可通过搜索和筛选快速找到感兴趣的目的地，查看详细信息，获取实用旅行参考。

---

## 2. 技术栈

| 技术 | 版本 | 说明 |
| ------ | ------ | ------ |
| React | 19.2.4 | UI 框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Vite | 8.0.0 | 构建工具 & 开发服务器 |
| React Router DOM | 7.13.1 | 客户端 SPA 路由 |
| react-i18next | 16.5.8 | 国际化（中/英文运行时切换） |
| i18next | 25.8.18 | i18n 核心引擎 |
| Tailwind CSS | 4.2.1 | Utility-first CSS 框架（PostCSS 模式） |
| ESLint | 9.x | 代码质量 + TypeScript + React Hooks 规则 |
| GitHub Actions | — | CI/CD：自动构建 & 部署到 GitHub Pages |

### 构建 & 部署

| 命令 | 说明 |
| ------ | ------ |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | TypeScript 类型检查 + Vite 生产构建（输出 `dist/`） |
| `npm run preview` | 预览生产构建产物 |
| `npm run lint` | ESLint 代码检查 |

- 推送到 `main` 分支后，GitHub Actions 自动执行 `npm ci` → `npm run build` → 部署到 GitHub Pages
- Vite 配置 `base: '/UI-test-Demo/'`，保证 GitHub Pages 子路径下资源正确加载

---

## 3. 设计规范

### 配色方案

| 用途 | Tailwind 类 | 色值 | 说明 |
| ------ | ------ | ------ | ------ |
| 主色-深蓝 | `bg-blue-900` | `#1E3A5F` | 导航栏、页脚背景 |
| 主色-蓝 | `bg-blue-700` / `text-blue-600` | `#1E40AF` / `#2563EB` | 主按钮、链接、hover |
| 辅色-绿 | `bg-emerald-600` / `text-emerald-600` | `#059669` | 类型标签、辅按钮 |
| 背景色 | `bg-sky-50` | `#F0F9FF` | 页面浅蓝背景 |
| 文字-主 | `text-slate-700` / `text-blue-800` | `#1E293B` | 正文文字 |
| 文字-次 | `text-slate-500` | `#64748B` | 辅助说明文字 |
| 评分星 | — | `#FBBF24` / `#D1D5DB` | 金色填充 / 灰色空星 |

### 字体

- 系统默认 sans-serif（Tailwind 默认字体栈）

### 响应式断点

| 断点 | 宽度 | 说明 |
| ------ | ------ | ------ |
| Mobile | < 640px | 单列布局，汉堡菜单 |
| Tablet (sm/md) | 640px – 1024px | 双列卡片网格 |
| Desktop (lg+) | > 1024px | 三列卡片网格，完整导航 |

### 图片规范

- 来源：Unsplash / Pexels，下载至本地 `public/images/`
- 格式：JPG
- 目的地封面：16:10 宽高比，`object-cover`
- 全部通过 `assetUrl()` 工具函数加载，自动拼接 Vite base URL
- 卡片图片启用 `loading="lazy"` 懒加载

---

## 4. 路由 & 页面

### 路由表

| 路由 | 组件 | 说明 |
| ------ | ------ | ------ |
| `/` | `HomePage` | 首页：Hero + 热门目的地 + 分类 + 评价 |
| `/destinations` | `DestinationsPage` | 目的地列表：高级筛选 + 全部 12 个目的地 |
| `/destinations/:id` | `DestinationDetailPage` | 目的地详情：图片画廊 + 景点 + 实用信息 |
| `/about` | `AboutPage` | 关于我们：使命 + 核心价值 + 团队 + 联系 |

所有路由共享 `Layout` 包装组件（`Navbar` + 内容区 + `Footer`），通过 `BrowserRouter`（basename `/UI-test-Demo`）驱动。

### 4.1 首页（`/`）

| 区域 | 功能描述 |
| ------ | --------- |
| Hero 区域 | 全屏背景大图 + 渐变遮罩 + 主标语 + SearchBar 搜索框 |
| 热门目的地 | 卡片网格，展示前 8 个目的地（实时关键词过滤） |
| 旅行主题 | 4 个分类卡片（海滩/山岳/城市/文化），点击跳转 `/destinations?type=xxx` |
| 用户评价 | Carousel 轮播，展示 3 条用户旅行评价（4 秒自动轮播 + 圆点导航） |
| CTA 按钮 | "查看全部目的地" 链接到 `/destinations` |

### 4.2 目的地列表页（`/destinations`）

| 区域 | 功能描述 |
| ------ | --------- |
| FilterBar | 综合筛选栏：关键词搜索 + 地区下拉（6 个地区）+ 类型下拉（4 种类型） |
| 结果计数 | 显示当前筛选后的目的地数量 |
| 卡片网格 | 响应式网格：1 / 2 / 3 列，展示全部 12 个目的地 |
| 无结果提示 | 筛选无匹配时显示友好提示 |

支持 URL 查询参数（如 `?type=beach`），从首页分类跳转时自动生效。所有筛选条件以 AND 逻辑组合。

### 4.3 目的地详情页（`/destinations/:id`）

| 区域 | 功能描述 |
| ------ | --------- |
| 面包屑导航 | 首页 > 目的地 > 当前目的地名称 |
| 图片画廊 | 主图（2 倍宽）+ 2 张侧图 |
| 主内容区 | 名称、国家、详细描述、景点推荐（2×2 网格，含图片和简介） |
| 侧边栏 | 概览卡片（最佳季节/费用/评分）+ 实用信息卡片（交通/签证/货币/时区/语言）+ 返回按钮 |
| 相关推荐 | 3 个相关目的地卡片 |

> ⚠️ 当前仅巴厘岛（Bali）有完整详情数据，其余 11 个目的地待补充。

### 4.4 关于我们页（`/about`）

| 区域 | 功能描述 |
| ------ | --------- |
| Hero 区域 | 小版 Hero（40-50vh）+ 遮罩 + 标题 |
| 使命愿景 | 网站理念与目标说明文字 |
| 核心价值 | 3 个价值卡片（全球视野 🌍、精心甄选 ✨、贴心服务 💝） |
| 团队介绍 | 4 位团队成员（渐变色占位头像 + 姓名 + 职位 + 简介） |
| 联系方式 | 邮箱链接 + 社交媒体占位 |

---

## 5. 公共组件

### 布局组件

| 组件 | 文件 | 说明 |
| ------ | ------ | ------ |
| `Navbar` | `src/components/Navbar.tsx` | 固定顶部导航：Logo + 路由链接（高亮当前路由）+ 语言切换（中/EN）+ 移动端汉堡菜单 |
| `Footer` | `src/components/Footer.tsx` | 三列页脚（品牌描述 / 快速链接 / 社交媒体）+ 版权信息，深蓝背景 |
| `Layout` | `src/components/Layout.tsx` | 包装组件：`Navbar` + `<Outlet />` + `Footer` |

### 业务组件

| 组件 | 文件 | Props | 说明 |
| ------ | ------ | ------ | ------ |
| `DestinationCard` | `src/components/DestinationCard.tsx` | `destination: Destination` | 目的地卡片：封面图（16:10）+ 类型标签 + 名称/国家 + 描述（2 行截断）+ 星级评分，hover 上浮效果，整卡片可点击跳转详情 |
| `SearchBar` | `src/components/SearchBar.tsx` | `value`, `onChange`, `placeholder?` | 搜索输入框：左侧搜索图标 + focus 蓝色光晕 |
| `FilterBar` | `src/components/FilterBar.tsx` | `keyword`, `region`, `type`, `on*Change` | 组合筛选栏：搜索 + 地区下拉 + 类型下拉，移动端垂直堆叠 |
| `Carousel` | `src/components/Carousel.tsx` | `items: ReactNode[]`, `autoPlayInterval?` | 自动轮播（默认 4 秒）+ 圆点导航 + 平滑滑动过渡 |

### 按钮样式

| 类型 | 样式 |
| ------ | ------ |
| 主按钮 | `bg-blue-700 text-white rounded-lg px-6 py-3` |
| 辅按钮 | `bg-emerald-600 text-white rounded-lg` |
| 幽灵按钮 | `border border-blue-600 text-blue-600 bg-transparent` |

### 自定义 CSS 类（`src/index.css`）

| 类名 | 说明 |
| ------ | ------ |
| `.hero-overlay` | Hero 渐变遮罩（黑色 30%→60%） |
| `.card-hover` | 卡片 hover：上移 4px + 加深阴影 |
| `.star-filled` / `.star-empty` | 评分星金色/灰色 |
| `.aspect-16-10` | 16:10 宽高比 |
| `.search-input:focus` | 搜索框蓝色光晕 |

---

## 6. 数据模型

### TypeScript 接口（`src/types/index.ts`）

```typescript
interface Destination {
  id: string;            // 唯一标识（如 'bali'）
  nameKey: string;       // i18n 名称键
  countryKey: string;    // i18n 国家键
  descKey: string;       // i18n 描述键
  image: string;         // 封面图 URL
  region: string;        // 地区编码：asia | europe | north-america | south-america | africa | oceania
  type: string;          // 类型编码：beach | mountain | city | culture
  rating: number;        // 评分（0–5）
  stars: number;         // 星级（0–5）
}

interface DestinationDetail extends Destination {
  images: string[];      // 画廊图片数组
  seasonKey: string;     // 最佳季节（i18n 键）
  costKey: string;       // 平均花费（i18n 键）
  attractions: Attraction[];
  transport: string;     // 交通方式
  visa: string;          // 签证要求
  currency: string;      // 当地货币
  timezone: string;      // 时区
  language: string;      // 语言（i18n 键）
  related: string[];     // 相关目的地 ID
}

interface Attraction {
  nameKey: string;       // 景点名（i18n 键）
  descKey: string;       // 景点描述（i18n 键）
  image: string;         // 景点图片
}

interface TeamMember { nameKey: string; titleKey: string; bioKey: string; image: string; }
interface Review { quoteKey: string; authorKey: string; roleKey: string; }
interface Category { nameKey: string; type: string; image: string; }
```

### 数据文件

| 文件 | 导出 | 说明 |
| ------ | ------ | ------ |
| `src/data/destinations.ts` | `destinations` (12 条) | 全部目的地数据 |
| | `homepageDestinations` (8 条) | 首页展示子集 |
| | `categories` (4 条) | 旅行主题分类 |
| | `destinationDetails` | 详情数据（当前仅 Bali） |
| | `getDestinationDetail(id)` | 按 ID 获取详情 |
| `src/data/reviews.ts` | `reviews` (3 条) | 用户评价 |
| `src/data/team.ts` | `teamMembers` (4 条) | 团队成员 |

### 目的地列表（12 个）

| ID | 名称 | 地区 | 类型 | 评分 |
| ------ | ------ | ------ | ------ | ------ |
| bali | 巴厘岛 | 亚洲 | 海滩 | 4.7 ⭐⭐⭐⭐⭐ |
| kyoto | 京都 | 亚洲 | 文化 | 4.8 ⭐⭐⭐⭐⭐ |
| santorini | 圣托里尼 | 欧洲 | 海滩 | 4.6 ⭐⭐⭐⭐⭐ |
| paris | 巴黎 | 欧洲 | 城市 | 4.5 ⭐⭐⭐⭐ |
| maldives | 马尔代夫 | 亚洲 | 海滩 | 4.9 ⭐⭐⭐⭐⭐ |
| swiss | 瑞士 | 欧洲 | 山岳 | 4.7 ⭐⭐⭐⭐⭐ |
| newyork | 纽约 | 北美 | 城市 | 4.4 ⭐⭐⭐⭐ |
| chengdu | 成都 | 亚洲 | 文化 | 4.5 ⭐⭐⭐⭐ |
| machupicchu | 马丘比丘 | 南美 | 文化 | 4.8 ⭐⭐⭐⭐⭐ |
| capetown | 开普敦 | 非洲 | 山岳 | 4.5 ⭐⭐⭐⭐ |
| greatbarrierreef | 大堡礁 | 大洋洲 | 海滩 | 4.7 ⭐⭐⭐⭐⭐ |
| nepal | 尼泊尔 | 亚洲 | 山岳 | 4.6 ⭐⭐⭐⭐⭐ |

---

## 7. 国际化（i18n）

- 使用 `react-i18next` + `i18next`，运行时切换语言，无需刷新页面
- 默认语言：中文（`zh`），支持切换到英文（`en`）
- 翻译文件：`src/i18n/zh.json`（~200+ 条目）、`src/i18n/en.json`（~200+ 条目）
- 导航栏右侧语言切换按钮，点击调用 `i18n.changeLanguage()`
- 所有用户可见文本均通过 i18n 键值管理，数据层仅存储 `*Key` 引用

### i18n 键命名空间

| 前缀 | 说明 |
| ------ | ------ |
| `nav.*` | 导航链接 |
| `hero.*` | Hero 标语 |
| `home.*` | 首页文案 |
| `dest.*` | 目的地名称/国家/简介 |
| `cat.*` | 分类名称 |
| `filter.*` | 筛选选项 |
| `destinations.*` | 列表页文案 |
| `detail.*` | 详情页文案/景点/实用信息 |
| `about.*` | 关于页文案 |
| `team.*` | 团队成员信息 |
| `review.*` | 用户评价 |
| `footer.*` | 页脚内容 |

---

## 8. 文件目录结构

```text
UI-test-Demo/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions 部署流水线
├── public/
│   └── images/
│       ├── hero/
│       │   └── hero-main.jpg       # Hero 背景图
│       ├── destinations/           # 14 张目的地图片
│       │   ├── bali.jpg
│       │   ├── bali-temple.jpg
│       │   ├── bali-rice.jpg
│       │   ├── kyoto.jpg
│       │   ├── santorini.jpg
│       │   ├── paris.jpg
│       │   ├── maldives.jpg
│       │   ├── swiss.jpg
│       │   ├── newyork.jpg
│       │   ├── chengdu.jpg
│       │   ├── machupicchu.jpg
│       │   ├── capetown.jpg
│       │   ├── greatbarrierreef.jpg
│       │   └── nepal.jpg
│       └── categories/             # 4 张分类主题图
│           ├── beach.jpg
│           ├── mountain.jpg
│           ├── city.jpg
│           └── culture.jpg
├── src/
│   ├── main.tsx                    # 入口：i18n 初始化 + BrowserRouter
│   ├── App.tsx                     # 路由定义 + Layout 包装
│   ├── index.css                   # Tailwind 导入 + 自定义样式
│   ├── components/
│   │   ├── Navbar.tsx              # 导航栏
│   │   ├── Footer.tsx              # 页脚
│   │   ├── Layout.tsx              # 布局包装
│   │   ├── SearchBar.tsx           # 搜索输入框
│   │   ├── FilterBar.tsx           # 组合筛选栏
│   │   ├── DestinationCard.tsx     # 目的地卡片
│   │   └── Carousel.tsx            # 轮播组件
│   ├── pages/
│   │   ├── HomePage.tsx            # 首页
│   │   ├── DestinationsPage.tsx    # 目的地列表页
│   │   ├── DestinationDetailPage.tsx # 目的地详情页
│   │   └── AboutPage.tsx           # 关于我们页
│   ├── data/
│   │   ├── destinations.ts         # 目的地 + 分类 + 详情数据
│   │   ├── reviews.ts              # 用户评价数据
│   │   └── team.ts                 # 团队成员数据
│   ├── types/
│   │   └── index.ts                # TypeScript 接口定义
│   ├── utils/
│   │   └── assetUrl.ts             # 资源 URL 工具函数（拼接 Vite base URL）
│   └── i18n/
│       ├── index.ts                # i18next 初始化配置
│       ├── zh.json                 # 中文翻译（~200+ 条）
│       └── en.json                 # 英文翻译（~200+ 条）
├── index.html                      # HTML 入口
├── package.json                    # 依赖 & 脚本
├── vite.config.ts                  # Vite 配置（base: '/UI-test-Demo/'）
├── tsconfig.json                   # TypeScript 根配置
├── tsconfig.app.json               # 应用 TS 配置（ES2023, strict）
├── postcss.config.js               # PostCSS + Tailwind CSS v4
├── eslint.config.js                # ESLint 扁平配置
└── PRD.md                          # 本文档
```

---

## 9. 响应式设计要求

- **Mobile-first** 开发策略
- 导航栏在移动端折叠为汉堡菜单，点击展开/收起
- 卡片网格：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- 图片使用 `object-cover` + 16:10 宽高比
- Hero 区域在移动端调整高度和文字大小
- FilterBar 在移动端垂直堆叠
- 详情页侧边栏在移动端堆叠到主内容下方

---

## 10. 实现状态

### ✅ 已完成

- [x] React + TypeScript + Vite 项目搭建
- [x] 4 个页面路由（首页/列表/详情/关于）
- [x] 7 个公共组件（Navbar / Footer / Layout / SearchBar / FilterBar / DestinationCard / Carousel）
- [x] 中英文国际化（react-i18next，200+ 翻译条目）
- [x] 12 个目的地数据 + 4 个分类
- [x] 搜索 & 多条件筛选功能
- [x] 响应式设计（Mobile / Tablet / Desktop）
- [x] GitHub Actions CI/CD 自动部署到 GitHub Pages
- [x] 资源路径自动适配 Vite base URL

### ⚠️ 待完善

- [ ] 补充其余 11 个目的地的详情数据（当前仅 Bali 完整）
- [ ] 团队成员真实头像（当前为渐变色占位）
- [ ] `public/images/icons/` 图标资源

---

## 11. 验证标准

- [ ] 所有页面在 Chrome / Safari / Firefox 正常显示
- [ ] 移动端（375px）、平板端（768px）、桌面端（1440px）布局正确
- [ ] 搜索和筛选功能在各断点正常工作
- [ ] 中英文运行时切换正常，无需刷新页面
- [ ] 所有图片加载正常，`<img>` 标签包含 `alt` 属性
- [ ] `npm run build` 零错误通过
- [ ] GitHub Pages 部署后所有路由和资源可正常访问
- [ ] Lighthouse 性能评分 ≥ 90
- [ ] HTML 语义化，通过 W3C 验证
- [ ] Lighthouse 可访问性评分 > 90
