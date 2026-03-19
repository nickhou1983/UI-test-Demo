# TravelVista Locator 策略分析报告

> 生成日期: 2026-03-19  
> 分析工具: 浏览器 DOM Accessibility Snapshot  
> 站点地址: `http://localhost:5174/UI-test-Demo/`

---

## 目录

1. [全局共享组件](#1-全局共享组件)
2. [首页 (HomePage)](#2-首页-homepage)
3. [目的地列表页 (DestinationsPage)](#3-目的地列表页-destinationspage)
4. [目的地详情页 (DestinationDetailPage)](#4-目的地详情页-destinationdetailpage)
5. [关于页面 (AboutPage)](#5-关于页面-aboutpage)
6. [心愿单页面 (FavoritesPage)](#6-心愿单页面-favoritespage)
7. [行程规划页面 (TripPlannerPage)](#7-行程规划页面-tripplannerpage)
8. [行程编辑页面 (TripEditPage)](#8-行程编辑页面-tripeditpage)
9. [404 页面 (NotFoundPage)](#9-404-页面-notfoundpage)
10. [整站 Locator 策略总结](#10-整站-locator-策略总结)
11. [改进建议](#11-改进建议)

---

## 1. 全局共享组件

### 1.1 导航栏 (Navbar)

| 关键元素 | 推荐 Locator | 备选 Locator | 说明 |
|---------|-------------|-------------|------|
| Logo 链接 | `page.getByRole('link', { name: 'TravelVista' })` | `page.locator('nav a').first()` | 品牌名文本稳定 |
| 汉堡菜单按钮 | `page.getByRole('button', { name: 'Toggle menu' })` | `page.getByLabel('Toggle menu')` | 有 aria-label |
| 首页链接 | `page.getByRole('navigation').getByRole('link', { name: '首页' })` | `page.locator('nav').getByText('首页')` | 注意 footer 也有同名链接，需限定 scope |
| 目的地链接 | `page.getByRole('navigation').first().getByRole('link', { name: '目的地' })` | — | 同上，限定到顶部 nav |
| 心愿单链接 | `page.getByRole('navigation').first().getByRole('link', { name: '心愿单' })` | — | — |
| 行程规划链接 | `page.getByRole('navigation').first().getByRole('link', { name: '行程规划' })` | — | — |
| 关于我们链接 | `page.getByRole('navigation').first().getByRole('link', { name: '关于我们' })` | — | — |
| 语言切换按钮 | `page.getByRole('button', { name: 'EN' })` | `page.getByRole('button', { name: '中' })` | 文本随语言状态变化 |

### 1.2 页脚 (Footer)

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| Footer 容器 | `page.getByRole('contentinfo')` | `page.locator('footer')` |
| 品牌标题 | `page.getByRole('contentinfo').getByRole('heading', { name: 'TravelVista' })` | — |
| 快速链接-首页 | `page.getByRole('contentinfo').getByRole('link', { name: '首页' })` | — |
| 快速链接-目的地 | `page.getByRole('contentinfo').getByRole('link', { name: '目的地' })` | — |
| 快速链接-关于我们 | `page.getByRole('contentinfo').getByRole('link', { name: '关于我们' })` | — |
| 社交-微博 | `page.getByRole('contentinfo').getByText('微博')` | — |
| 社交-微信 | `page.getByRole('contentinfo').getByText('微信')` | — |
| 社交-Instagram | `page.getByRole('contentinfo').getByText('Instagram')` | — |
| 版权声明 | `page.getByText('© 2026 TravelVista')` | — |

### 1.3 返回顶部按钮 (ScrollToTop)

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 返回顶部按钮 | `page.getByRole('button', { name: 'Back to top' })` | `page.getByLabel('Back to top')` |

---

## 2. 首页 (HomePage)

**路由**: `/`

### 2.1 Hero 区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| Hero 图片 | `page.getByRole('img', { name: 'Hero' })` | — |
| 主标题 | `page.getByRole('heading', { level: 1, name: '探索世界，发现美好' })` | `page.getByText('探索世界，发现美好')` |
| 副标题 | `page.getByText('精选全球热门旅行目的地')` | — |
| 搜索框 | `page.getByRole('textbox', { name: '搜索目的地...' })` | `page.getByPlaceholder('搜索目的地...')` |

### 2.2 热门目的地区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '热门目的地' })` | — |
| 区域描述 | `page.getByText('精心挑选全球最受欢迎的旅行目的地')` | — |
| 目的地卡片（巴厘岛） | `page.getByRole('link', { name: /巴厘岛/ }).first()` | `page.locator('a[href*="destinations/bali"]').first()` |
| 卡片标题 | `page.getByRole('heading', { name: '巴厘岛', level: 3 }).first()` | — |
| 收藏按钮（任意卡片） | `page.getByRole('button', { name: 'Add to wishlist' }).first()` | `page.getByLabel('Add to wishlist').first()` |
| 查看全部链接 | `page.getByRole('link', { name: '查看全部目的地' })` | — |

### 2.3 旅行主题区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '探索旅行主题' })` | — |
| 海滩度假 | `page.getByRole('link', { name: /海滩度假/ })` | `page.locator('a[href*="type=beach"]')` |
| 山岳探险 | `page.getByRole('link', { name: /山岳探险/ })` | `page.locator('a[href*="type=mountain"]')` |
| 城市漫步 | `page.getByRole('link', { name: /城市漫步/ })` | `page.locator('a[href*="type=city"]')` |
| 文化之旅 | `page.getByRole('link', { name: /文化之旅/ })` | `page.locator('a[href*="type=culture"]')` |

---

## 3. 目的地列表页 (DestinationsPage)

**路由**: `/destinations`

### 3.1 页面标题

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 页面标题 | `page.getByRole('heading', { level: 1, name: '探索目的地' })` | — |
| 描述文字 | `page.getByText('发现您的下一个旅行目的地')` | — |

### 3.2 筛选栏 (FilterBar)

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 搜索框 | `page.getByRole('textbox', { name: '搜索目的地名称...' })` | `page.getByPlaceholder('搜索目的地名称...')` |
| 地区筛选 | `page.getByRole('combobox', { name: '所有地区' })` | `page.getByLabel('所有地区')` |
| 类型筛选 | `page.getByRole('combobox', { name: '所有类型' })` | `page.getByLabel('所有类型')` |
| 排序方式 | `page.getByRole('combobox', { name: '排序方式' })` | `page.getByLabel('排序方式')` |
| 结果计数 | `page.getByText(/共 \d+ 个目的地/)` | — |

**筛选选项值**:
- 地区: 所有地区 / 亚洲 / 欧洲 / 北美 / 南美 / 非洲 / 大洋洲
- 类型: 所有类型 / 海滩 / 山岳 / 城市 / 文化
- 排序: 默认排序 / 评分最高 / 名称排序

### 3.3 目的地卡片网格

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 任意卡片（按名称） | `page.getByRole('heading', { name: '巴厘岛', level: 3 }).locator('..')` 向上寻找 link | `page.locator('a[href*="destinations/bali"]')` |
| 卡片图片 | `page.getByRole('img', { name: '巴厘岛' })` | — |
| 收藏按钮（第 N 个） | `page.getByRole('button', { name: 'Add to wishlist' }).nth(n)` | — |
| 全部卡片 | `page.getByRole('main').getByRole('link').filter({ has: page.getByRole('heading', { level: 3 }) })` | — |

---

## 4. 目的地详情页 (DestinationDetailPage)

**路由**: `/destinations/bali`（示例）

### 4.1 面包屑导航

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 面包屑容器 | `page.getByRole('main').getByRole('navigation')` | — |
| 面包屑-首页 | `page.getByRole('main').getByRole('navigation').getByRole('link', { name: '首页' })` | — |
| 面包屑-目的地 | `page.getByRole('main').getByRole('navigation').getByRole('link', { name: '目的地' })` | — |
| 面包屑-当前页文本 | `page.getByRole('main').getByRole('navigation').getByText('巴厘岛')` | — |

### 4.2 主要信息

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| Banner 图片 | `page.getByRole('main').getByRole('img', { name: '巴厘岛' }).first()` | — |
| 目的地名称 | `page.getByRole('heading', { level: 1, name: '巴厘岛' })` | — |
| 收藏按钮 | `page.getByRole('heading', { level: 1 }).locator('..').getByRole('button', { name: /wishlist/ })` | `page.getByLabel(/wishlist/)` |
| 位置信息 | `page.getByText('📍 印度尼西亚')` | — |
| 详情描述 | `page.getByText(/巴厘岛是印度尼西亚最著名/)` | — |

### 4.3 必游景点

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '必游景点' })` | — |
| 景点名称（海神庙） | `page.getByRole('heading', { name: '海神庙', level: 3 })` | — |
| 景点图片 | `page.getByRole('img', { name: '海神庙' })` | — |
| 景点描述 | `page.getByText(/矗立在海中岩石上/)` | — |

### 4.4 旅行者评价

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '旅行者评价' })` | — |
| 评论者名称 | `page.getByText('张明')` | — |
| 评论日期 | `page.getByText('2025年11月')` | — |
| 评论内容 | `page.getByText(/巴厘岛的日落让我终生难忘/)` | — |

### 4.5 侧边栏信息

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 旅行概览标题 | `page.getByRole('heading', { name: '旅行概览' })` | — |
| 最佳季节 | `page.getByText('4月-10月（旱季）')` | — |
| 平均花费 | `page.getByText('¥5,000-15,000/人')` | — |
| 评分 | `page.getByText('4.7 / 5.0')` | — |
| 天气区域标题 | `page.getByRole('heading', { name: /天气预报/ })` | — |
| 当前温度 | `page.getByText('30°C')` | — |
| 天气状态 | `page.getByText('☀️ 晴天')` | — |
| 实用信息标题 | `page.getByRole('heading', { name: '实用信息' })` | — |
| 签证信息 | `page.getByText('中国护照免签30天')` | — |

### 4.6 行动按钮

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 开始规划行程 | `page.getByRole('link', { name: /开始规划行程/ })` | `page.locator('a[href*="trips?dest=bali"]')` |
| 返回目的地列表 | `page.getByRole('link', { name: '返回目的地列表' })` | — |

### 4.7 推荐目的地

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '你可能也喜欢' })` | — |
| 推荐卡片 | `page.getByRole('heading', { name: '你可能也喜欢' }).locator('..').getByRole('link')` | — |

---

## 5. 关于页面 (AboutPage)

**路由**: `/about`

### 5.1 Hero 区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| Banner 图片 | `page.getByRole('img', { name: 'About' })` | — |
| 主标题 | `page.getByRole('heading', { level: 1, name: '关于本站' })` | — |
| 副标题 | `page.getByText('了解 TravelVista 的故事')` | — |

### 5.2 使命区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '我们的使命' })` | — |
| 使命描述 | `page.getByText(/TravelVista 致力于为每一位旅行爱好者/)` | — |
| 特色卡片-全球视野 | `page.getByRole('heading', { name: '全球视野' })` | — |
| 特色卡片-精心策划 | `page.getByRole('heading', { name: '精心策划' })` | — |
| 特色卡片-贴心服务 | `page.getByRole('heading', { name: '贴心服务' })` | — |

### 5.3 团队区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '我们的团队' })` | — |
| 团队成员-张旅行 | `page.getByRole('heading', { name: '张旅行' })` | — |
| 职位信息 | `page.getByText('创始人 & CEO')` | — |
| 成员描述 | `page.getByText('资深旅行家，走遍 60+ 个国家')` | — |

### 5.4 联系区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 区域标题 | `page.getByRole('heading', { name: '联系我们' })` | — |
| 邮箱链接 | `page.getByRole('link', { name: 'hello@travelvista.com' })` | `page.locator('a[href*="mailto"]')` |

---

## 6. 心愿单页面 (FavoritesPage)

**路由**: `/favorites`

### 6.1 空状态

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 页面标题 | `page.getByRole('heading', { level: 1, name: '我的心愿单' })` | — |
| 空状态提示 | `page.getByText('还没有收藏的目的地')` | — |
| 探索链接 | `page.getByRole('link', { name: '去探索目的地' })` | — |

### 6.2 有收藏时（动态状态）

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 收藏卡片 | `page.getByRole('main').getByRole('link').filter({ has: page.getByRole('heading', { level: 3 }) })` | — |
| 移除收藏按钮 | `page.getByRole('button', { name: 'Remove from wishlist' })` | `page.getByLabel('Remove from wishlist')` |

---

## 7. 行程规划页面 (TripPlannerPage)

**路由**: `/trips`

### 7.1 页面基础

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 页面标题 | `page.getByRole('heading', { level: 1, name: '行程规划' })` | — |
| 描述文字 | `page.getByText('规划您的完美旅程')` | — |
| 创建行程按钮 | `page.getByRole('button', { name: '+ 创建行程' })` | `page.getByRole('button', { name: /创建行程/ })` |

### 7.2 空状态

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 空状态图标 | `page.getByText('📋').first()` | — |
| 空状态提示 | `page.getByText('还没有行程，开始规划吧！')` | — |

### 7.3 创建行程对话框

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 对话框标题 | `page.getByRole('heading', { name: '创建行程' })` | — |
| 目的地下拉 | `page.getByRole('combobox', { name: '选择目的地' })` | `page.getByLabel('选择目的地')` |
| 行程名称输入 | `page.getByRole('textbox', { name: /巴厘岛蜜月之旅/ })` | `page.getByPlaceholder('例如：巴厘岛蜜月之旅')` |
| 天数输入 | `page.getByRole('spinbutton', { name: '天数' })` | `page.getByLabel('天数')` |
| 取消按钮 | `page.getByRole('button', { name: '取消' })` | — |
| 创建按钮 | `page.getByRole('button', { name: '创建行程' }).last()` | — |

### 7.4 行程卡片（已有行程时）

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 行程标题 | `page.getByRole('heading', { name: '测试行程', level: 3 })` | — |
| 目的地信息 | `page.getByText('📍 巴厘岛')` | — |
| 天数信息 | `page.getByText(/\d+ 天行程/)` | — |
| 编辑行程链接 | `page.getByRole('link', { name: '编辑行程' })` | — |
| 删除行程按钮 | `page.getByRole('button', { name: '删除行程' })` | — |

---

## 8. 行程编辑页面 (TripEditPage)

**路由**: `/trips/:tripId`

### 8.1 头部区域

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 返回链接 | `page.getByRole('link', { name: /返回行程列表/ })` | `page.getByText('← 返回行程列表')` |
| 行程名称输入框 | `page.getByRole('textbox', { name: '行程名称' })` | `page.getByLabel('行程名称')` |
| 行程元信息 | `page.getByText(/📍.*·.*天行程/)` | — |

### 8.2 天数标签页

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 第 1 天标签 | `page.getByRole('button', { name: '第 1 天' })` | — |
| 第 2 天标签 | `page.getByRole('button', { name: '第 2 天' })` | — |
| 第 3 天标签 | `page.getByRole('button', { name: '第 3 天' })` | — |
| 当天标题 | `page.getByRole('heading', { name: '第 1 天', level: 2 })` | — |
| 空活动提示 | `page.getByText('暂无活动，点击下方按钮添加')` | — |

### 8.3 快速添加景点

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 快速添加标签 | `page.getByText('快速添加景点')` | — |
| 添加海神庙 | `page.getByRole('button', { name: '+ 海神庙' })` | — |
| 添加德格拉朗梯田 | `page.getByRole('button', { name: '+ 德格拉朗梯田' })` | — |
| 添加库塔海滩 | `page.getByRole('button', { name: '+ 库塔海滩' })` | — |
| 添加圣猴森林 | `page.getByRole('button', { name: '+ 圣猴森林' })` | — |
| 添加活动按钮 | `page.getByRole('button', { name: '+ 添加活动' })` | — |

### 8.4 侧边栏信息

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 目的地图片 | `page.getByRole('main').getByRole('img', { name: '巴厘岛' })` | — |
| 目的地名称 | `page.getByRole('main').getByRole('heading', { name: '巴厘岛', level: 3 })` | — |
| 天气区域 | `page.getByRole('heading', { name: /天气预报/ })` | — |
| 删除行程按钮 | `page.getByRole('button', { name: /删除行程/ })` | `page.getByText('🗑 删除行程')` |

---

## 9. 404 页面 (NotFoundPage)

**路由**: `*`（任意未匹配路由）

| 关键元素 | 推荐 Locator | 备选 Locator |
|---------|-------------|-------------|
| 404 标题 | `page.getByRole('heading', { level: 1, name: '404' })` | `page.getByText('404')` |
| 提示文字 | `page.getByText('抱歉，您访问的页面不存在或已被移除。')` | — |
| 返回首页链接 | `page.getByRole('link', { name: '返回首页' })` | — |

---

## 10. 整站 Locator 策略总结

### 10.1 可用 Locator 分类统计

| Locator 类型 | 可用性 | 覆盖范围 | 备注 |
|-------------|--------|---------|------|
| **ARIA roles** | ✅ 良好 | 高 | `navigation`, `main`, `contentinfo`, `link`, `button`, `heading`, `combobox`, `textbox`, `spinbutton`, `img`, `list`, `listitem` 均有正确语义 |
| **文本内容** | ✅ 良好 | 高 | 中文文本稳定可靠，但需注意 i18n 切换后文本变化 |
| **aria-label** | ⚠️ 部分 | 中 | 仅 `Toggle menu`, `Back to top`, `Add/Remove from wishlist`, 筛选栏下拉、行程表单字段有 aria-label |
| **data-testid** | ❌ 缺失 | 无 | **整站完全没有 data-testid**，这是最大的改进点 |
| **语义化 HTML** | ✅ 良好 | 高 | `<nav>`, `<main>`, `<footer>`, `<h1>`-`<h4>`, `<ul>/<li>`, `<select>`, `<input>`, `<a>` 使用正确 |
| **label 关联** | ⚠️ 部分 | 低 | 仅 TripPlannerPage 创建对话框有 `<label>`，其余表单缺少显式 label-for 关联 |

### 10.2 推荐 Locator 优先级

```
1. getByRole()          — 首选，语义明确、跨语言稳定
2. getByLabel()         — 有 aria-label 时优先
3. getByText()          — 适合独特文本，注意 i18n
4. getByPlaceholder()   — 输入框备选
5. locator('a[href*=""]') — URL 结构稳定时的可靠备选  
6. data-testid          — 目前不可用，强烈建议添加
```

### 10.3 i18n 对 Locator 的影响

当前站点支持中英文切换（`EN` / `中` 按钮），文本定位器在语言切换后会失效。

**应对策略**:
- 优先使用 `getByRole()` — 角色不随语言变化
- 对动态文本使用正则匹配（如 `{ name: /\d+ 个目的地/ }`）
- 关键交互元素补充 `data-testid`

---

## 11. 改进建议

### 11.1 🔴 高优先级：添加 data-testid

以下元素**强烈建议**添加 `data-testid`：

| 组件 / 页面 | 建议 data-testid | 原因 |
|------------|-----------------|------|
| Navbar | `data-testid="navbar"` | 与 footer nav 区分 |
| Navbar 各链接 | `data-testid="nav-home"`, `nav-destinations`... | 避免与 footer 同名链接冲突 |
| 语言切换按钮 | `data-testid="lang-switch"` | 文本随状态变化 |
| DestinationCard | `data-testid="destination-card-{id}"` | 卡片多实例需唯一标识 |
| FavoriteButton | `data-testid="favorite-btn-{id}"` | 多实例区分 |
| FilterBar 搜索框 | `data-testid="filter-search"` | 与首页搜索框区分 |
| FilterBar 下拉框 | `data-testid="filter-region"`, `filter-type"`, `filter-sort"` | 稳定定位 |
| 行程卡片 | `data-testid="trip-card-{id}"` | 多实例 |
| 天数标签 | `data-testid="day-tab-{n}"` | 数值化定位 |
| 创建行程对话框 | `data-testid="create-trip-dialog"` | 弹窗定位 |
| footer | `data-testid="footer"` | 语义明确 |
| Hero 区域 | `data-testid="hero-section"` | 区域定位 |
| 天气组件 | `data-testid="weather-widget"` | 组件隔离测试 |

### 11.2 🟡 中优先级：补充 ARIA 属性

| 问题元素 | 建议 | 说明 |
|---------|------|------|
| 社交媒体链接（微博/微信/Instagram） | 添加 `role="link"` 和 `aria-label` | 当前是 `<span>` 带 cursor:pointer，非语义化 |
| 评分星标 | 添加 `role="img"` 和 `aria-label="评分 4.7 / 5"` | 当前 ★ 是纯文本无语义 |
| 目的地类型标签 | 添加 `role="status"` 或 `aria-label` | 卡片上的 "海滩"/"文化" 标签无语义 |
| 创建行程对话框 | 添加 `role="dialog"` 和 `aria-modal="true"` | 当前弹窗无 dialog 角色 |
| 天气 5 日预报 | 添加 `role="table"` 或 `aria-label` | 数据展示无结构化语义 |
| `<label>` 的 `htmlFor` | TripPlannerPage 的 label 缺少 `htmlFor` 属性 | 虽有视觉 label 但无程序化关联 |

### 11.3 🟢 低优先级：结构优化

| 建议 | 说明 |
|------|------|
| 面包屑添加 `aria-label="Breadcrumb"` | 当前面包屑 nav 无 label，与顶部 nav 不易区分 |
| 页面 `<title>` 应反映当前路由 | 当前所有页面 title 均为 `temp-vite-app` |
| 搜索框区域添加 `role="search"` | 增强搜索区域可访问性 |
| 卡片链接的可访问名称优化 | 当前卡片链接 accessible name 含全部卡片文本（过长），建议简化 |

---

## 附录：Locator 速查表（按组件）

```typescript
// ============ Navbar ============
const navbar = page.getByRole('navigation').first();
const logo = navbar.getByRole('link', { name: 'TravelVista' });
const langSwitch = navbar.getByRole('button', { name: /EN|中/ });
const hamburger = page.getByRole('button', { name: 'Toggle menu' });

// ============ SearchBar ============
const heroSearch = page.getByPlaceholder('搜索目的地...');
const filterSearch = page.getByPlaceholder('搜索目的地名称...');

// ============ FilterBar ============
const regionFilter = page.getByRole('combobox', { name: '所有地区' });
const typeFilter = page.getByRole('combobox', { name: '所有类型' });
const sortFilter = page.getByRole('combobox', { name: '排序方式' });

// ============ DestinationCard ============
const cardByName = (name: string) => 
  page.getByRole('link').filter({ has: page.getByRole('heading', { name, level: 3 }) });
const favoriteBtn = (nth: number) => 
  page.getByRole('button', { name: /wishlist/ }).nth(nth);

// ============ TripPlanner ============
const createTripBtn = page.getByRole('button', { name: /创建行程/ }).first();
const destSelect = page.getByRole('combobox', { name: '选择目的地' });
const tripNameInput = page.getByPlaceholder('例如：巴厘岛蜜月之旅');
const daysInput = page.getByRole('spinbutton', { name: '天数' });

// ============ TripEdit ============
const tripNameEdit = page.getByRole('textbox', { name: '行程名称' });
const dayTab = (n: number) => page.getByRole('button', { name: `第 ${n} 天` });
const addActivityBtn = page.getByRole('button', { name: '+ 添加活动' });
const deleteTripBtn = page.getByRole('button', { name: /删除行程/ });

// ============ Footer ============
const footer = page.getByRole('contentinfo');
const backToTop = page.getByRole('button', { name: 'Back to top' });
```
