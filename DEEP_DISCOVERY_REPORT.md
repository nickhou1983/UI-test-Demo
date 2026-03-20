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
