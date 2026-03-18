const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaCubes, FaVial, FaGlobe, FaCamera, FaCloud, FaCodeBranch, FaRocket,
  FaLayerGroup, FaCheckCircle, FaCog, FaChartBar, FaListUl,
  FaArrowRight, FaTools, FaDesktop, FaMicrosoft, FaGithub, FaTerminal,
  FaPlay, FaEye, FaPuzzlePiece, FaFileAlt, FaSitemap
} = require("react-icons/fa");

// ─── Helpers ───
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Color palette — Ocean Gradient theme for travel app
const C = {
  navy:      "0F2B46",
  deepBlue:  "065A82",
  teal:      "1C7293",
  seafoam:   "0EA5E9",
  mint:      "38BDF8",
  white:     "FFFFFF",
  offWhite:  "F0F9FF",
  lightGray: "E2E8F0",
  gray:      "64748B",
  darkText:  "1E293B",
  emerald:   "10B981",
  amber:     "F59E0B",
  coral:     "F43F5E",
  violet:    "8B5CF6",
};

const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12 });

async function generatePPT() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "TravelVista QA Team";
  pres.title = "TravelVista UI 自动化测试工作流";

  // Pre-render icons
  const icons = {};
  const iconMap = {
    cubes: [FaCubes, C.white],
    vial: [FaVial, C.white],
    globe: [FaGlobe, C.white],
    camera: [FaCamera, C.white],
    cloud: [FaCloud, C.white],
    branch: [FaCodeBranch, C.white],
    rocket: [FaRocket, C.white],
    layer: [FaLayerGroup, C.white],
    check: [FaCheckCircle, C.emerald],
    cog: [FaCog, C.white],
    chart: [FaChartBar, C.white],
    list: [FaListUl, C.white],
    arrow: [FaArrowRight, C.seafoam],
    tools: [FaTools, C.white],
    desktop: [FaDesktop, C.white],
    ms: [FaMicrosoft, C.white],
    github: [FaGithub, C.white],
    terminal: [FaTerminal, C.white],
    play: [FaPlay, C.emerald],
    eye: [FaEye, C.white],
    puzzle: [FaPuzzlePiece, C.white],
    file: [FaFileAlt, C.white],
    sitemap: [FaSitemap, C.white],
    checkWhite: [FaCheckCircle, C.white],
    arrowWhite: [FaArrowRight, C.white],
    cubeTeal: [FaCubes, C.teal],
    vialTeal: [FaVial, C.teal],
    cameraTeal: [FaCamera, C.teal],
    eyeAmber: [FaEye, C.amber],
    playDark: [FaPlay, C.darkText],
  };
  for (const [key, [Comp, color]] of Object.entries(iconMap)) {
    icons[key] = await iconToBase64Png(Comp, `#${color}`);
  }

  // ────────────────────────────────────────
  // SLIDE 1 — Title
  // ────────────────────────────────────────
  let slide = pres.addSlide();
  slide.background = { color: C.navy };
  // Decorative top bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  // Large icon cluster
  slide.addImage({ data: icons.cubes, x: 0.8, y: 1.3, w: 0.6, h: 0.6 });
  slide.addImage({ data: icons.vial, x: 1.6, y: 1.0, w: 0.5, h: 0.5 });
  slide.addImage({ data: icons.camera, x: 1.5, y: 1.7, w: 0.45, h: 0.45 });
  // Title text
  slide.addText("TravelVista", {
    x: 2.6, y: 0.9, w: 6.8, h: 0.8,
    fontSize: 44, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
  });
  slide.addText("UI 自动化测试工作流架构", {
    x: 2.6, y: 1.65, w: 6.8, h: 0.65,
    fontSize: 28, fontFace: "Calibri", color: C.seafoam, margin: 0,
  });
  // Divider line
  slide.addShape(pres.shapes.LINE, { x: 2.6, y: 2.55, w: 3.5, h: 0, line: { color: C.teal, width: 2 } });
  // Subtitle
  slide.addText("3 层测试金字塔  ×  2 执行环境  ×  CI/CD 全流程", {
    x: 2.6, y: 2.85, w: 7, h: 0.45,
    fontSize: 15, fontFace: "Calibri", color: C.gray,
  });
  // Date & version
  slide.addText("2026-03-18  |  v1.0", {
    x: 2.6, y: 3.5, w: 4, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.gray,
  });
  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.0, w: 10, h: 0.625, fill: { color: C.deepBlue } });
  slide.addText("React 19  •  TypeScript 5.9  •  Playwright 1.58  •  Azure PT  •  Argos CI", {
    x: 0.6, y: 5.05, w: 8.8, h: 0.55,
    fontSize: 11, fontFace: "Calibri", color: C.mint, align: "center", valign: "middle",
  });

  // ────────────────────────────────────────
  // SLIDE 2 — 目录
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addText("目录", {
    x: 0.6, y: 0.25, w: 8, h: 0.65,
    fontSize: 32, fontFace: "Arial Black", color: C.navy, margin: 0,
  });
  slide.addShape(pres.shapes.LINE, { x: 0.6, y: 0.95, w: 2, h: 0, line: { color: C.seafoam, width: 2.5 } });

  const tocItems = [
    { num: "01", title: "项目概览", desc: "被测系统与技术栈" },
    { num: "02", title: "测试分层架构", desc: "三层金字塔：组件 / E2E / 视觉回归" },
    { num: "03", title: "各阶段数据流", desc: "每阶段 Input → Process → Output" },
    { num: "04", title: "执行环境对比", desc: "本地 vs Azure 云端" },
    { num: "05", title: "CI/CD 流水线", desc: "测试验证 + 生产部署" },
    { num: "06", title: "测试覆盖矩阵", desc: "覆盖维度与统计" },
    { num: "07", title: "关键配置与命令", desc: "配置文件 + npm scripts 速查" },
    { num: "08", title: "工具链全景", desc: "依赖关系与目录结构" },
  ];

  tocItems.forEach((item, i) => {
    const yBase = 1.35 + i * 0.5;
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.7, y: yBase + 0.02, w: 0.36, h: 0.36,
      fill: { color: C.deepBlue },
    });
    slide.addText(item.num, {
      x: 0.7, y: yBase + 0.02, w: 0.36, h: 0.36,
      fontSize: 11, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0,
    });
    slide.addText(item.title, {
      x: 1.25, y: yBase, w: 3, h: 0.4,
      fontSize: 16, fontFace: "Calibri", color: C.navy, bold: true, margin: 0,
    });
    slide.addText(item.desc, {
      x: 4.5, y: yBase, w: 5, h: 0.4,
      fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0,
    });
    if (i < tocItems.length - 1) {
      slide.addShape(pres.shapes.LINE, {
        x: 1.25, y: yBase + 0.44, w: 8, h: 0,
        line: { color: C.lightGray, width: 0.5 },
      });
    }
  });

  // ────────────────────────────────────────
  // SLIDE 3 — 项目概览
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  // Section number
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.deepBlue } });
  slide.addText("01", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("项目概览", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // Left: Tech stack card
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 4.3, h: 3.8, fill: { color: C.offWhite }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 4.3, h: 0.06, fill: { color: C.seafoam } });
  slide.addText("技术栈", { x: 0.75, y: 1.15, w: 3, h: 0.4, fontSize: 16, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  const techStack = [
    { name: "React 19", desc: "UI 框架" },
    { name: "TypeScript 5.9", desc: "类型安全" },
    { name: "Vite 8.0", desc: "构建工具 & 开发服务器" },
    { name: "Tailwind CSS 4.2", desc: "原子化样式系统" },
    { name: "React Router 7.13", desc: "客户端路由" },
    { name: "i18next 25.8", desc: "国际化（中/英）" },
  ];
  techStack.forEach((t, i) => {
    const y = 1.65 + i * 0.5;
    slide.addImage({ data: icons.check, x: 0.8, y: y + 0.04, w: 0.22, h: 0.22 });
    slide.addText(t.name, { x: 1.15, y, w: 1.8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0 });
    slide.addText(t.desc, { x: 3.0, y, w: 1.6, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.gray, margin: 0 });
  });

  // Right: App info card
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.0, w: 4.3, h: 3.8, fill: { color: C.offWhite }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.0, w: 4.3, h: 0.06, fill: { color: C.emerald } });
  slide.addText("应用信息", { x: 5.45, y: 1.15, w: 3, h: 0.4, fontSize: 16, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });

  const appInfo = [
    { label: "路由数", value: "4 页面", detail: "Home / Destinations / Detail / About" },
    { label: "目的地", value: "12 个", detail: "6 地区 × 4 类型" },
    { label: "语言", value: "中/英双语", detail: "100+ i18n 翻译键" },
    { label: "部署", value: "GitHub Pages", detail: "/UI-test-Demo/" },
  ];
  appInfo.forEach((info, i) => {
    const y = 1.65 + i * 0.75;
    slide.addText(info.value, { x: 5.5, y, w: 1.8, h: 0.35, fontSize: 18, fontFace: "Calibri", color: C.deepBlue, bold: true, margin: 0 });
    slide.addText(info.label, { x: 7.3, y, w: 1.8, h: 0.2, fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0 });
    slide.addText(info.detail, { x: 5.5, y: y + 0.3, w: 3.8, h: 0.25, fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0 });
  });

  // ────────────────────────────────────────
  // SLIDE 4 — 测试分层架构
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.deepBlue } });
  slide.addText("02", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("测试分层架构", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // Pyramid — three tiers
  const tiers = [
    { label: "Visual Regression", icon: icons.eye, bg: C.coral, w: 3.2, specs: "1 spec · 4 screenshots", y: 1.1, h: 1.0 },
    { label: "E2E 端到端测试", icon: icons.globe, bg: C.teal, w: 5.5, specs: "6 spec files", y: 2.2, h: 1.0 },
    { label: "Component Testing", icon: icons.cubes, bg: C.deepBlue, w: 7.8, specs: "6 spec files · ~30 用例", y: 3.3, h: 1.0 },
  ];
  tiers.forEach((t) => {
    const x = (10 - t.w) / 2;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: t.y, w: t.w, h: t.h, fill: { color: t.bg }, shadow: makeShadow() });
    slide.addImage({ data: t.icon, x: x + 0.35, y: t.y + 0.25, w: 0.45, h: 0.45 });
    slide.addText(t.label, {
      x: x + 1.0, y: t.y + 0.1, w: t.w - 1.5, h: 0.45,
      fontSize: 16, fontFace: "Calibri", color: C.white, bold: true, margin: 0,
    });
    slide.addText(t.specs, {
      x: x + 1.0, y: t.y + 0.52, w: t.w - 1.5, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, margin: 0,
    });
  });

  // Labels on right
  slide.addText("像素级视觉比对\nmaxDiffPixelRatio: 0.01", { x: 7.8, y: 1.15, w: 2, h: 0.8, fontSize: 10, fontFace: "Calibri", color: C.gray, margin: 0 });
  slide.addText("完整页面路由\n+ 用户旅程", { x: 8.0, y: 2.3, w: 1.8, h: 0.7, fontSize: 10, fontFace: "Calibri", color: C.gray, margin: 0 });
  slide.addText("隔离组件单元测试\nProps · Events · States", { x: 0.3, y: 3.4, w: 2, h: 0.7, fontSize: 10, fontFace: "Calibri", color: C.gray, margin: 0 });

  // Summary stats bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.6, w: 9, h: 0.7, fill: { color: C.offWhite } });
  const stats = [
    { val: "13", label: "spec 文件" },
    { val: "~59", label: "测试用例" },
    { val: "4", label: "页面截图" },
    { val: "6", label: "被测组件" },
  ];
  stats.forEach((s, i) => {
    const sx = 1.0 + i * 2.2;
    slide.addText(s.val, { x: sx, y: 4.62, w: 1, h: 0.4, fontSize: 22, fontFace: "Calibri", color: C.deepBlue, bold: true, align: "center", margin: 0 });
    slide.addText(s.label, { x: sx, y: 5.0, w: 1, h: 0.25, fontSize: 11, fontFace: "Calibri", color: C.gray, align: "center", margin: 0 });
  });

  // ────────────────────────────────────────
  // SLIDE 5 — Layer 1: 组件测试详解
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  // Header
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.2, w: 0.08, h: 0.5, fill: { color: C.deepBlue } });
  slide.addText("Layer 1 — 组件测试 (Component Testing)", { x: 0.75, y: 0.2, w: 8, h: 0.5, fontSize: 22, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // Config card
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.9, w: 3.0, h: 2.3, fill: { color: C.offWhite }, shadow: makeShadow() });
  slide.addText("配置", { x: 0.7, y: 0.95, w: 2, h: 0.35, fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  const cfgItems = [
    "工具: @playwright/experimental-ct-react",
    "配置: playwright-ct.config.ts",
    "入口: playwright/index.tsx",
    "夹具: TestWrapper (Router + i18n)",
    "浏览器: Desktop Chrome",
  ];
  cfgItems.forEach((t, i) => {
    slide.addText(t, { x: 0.7, y: 1.35 + i * 0.35, w: 2.6, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.darkText, margin: 0 });
  });

  // 6 components grid (2x3)
  const components = [
    { name: "Navbar", tests: "品牌名 · 导航链接 · 语言切换 · active 高亮 · 移动端菜单" },
    { name: "SearchBar", tests: "placeholder · 值输入 · onChange 回调" },
    { name: "FilterBar", tests: "搜索 + 2 下拉 · 6 地区 / 4 类型 · 回调触发" },
    { name: "Carousel", tests: "slide 渲染 · 圆点导航 · 自动播放 · CSS transform" },
    { name: "DestinationCard", tests: "名称(i18n) · 类型徽章 · 评分星级 · 链接" },
    { name: "Footer", tests: "品牌名 · 导航链接 · 社交媒体 · 版权" },
  ];
  components.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 3.8 + col * 2.1;
    const cy = 0.9 + row * 1.25;
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 1.95, h: 1.1, fill: { color: C.offWhite }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 1.95, h: 0.04, fill: { color: C.emerald } });
    slide.addText(c.name, { x: cx + 0.1, y: cy + 0.1, w: 1.7, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.deepBlue, bold: true, margin: 0 });
    slide.addText(c.tests, { x: cx + 0.1, y: cy + 0.4, w: 1.7, h: 0.6, fontSize: 9, fontFace: "Calibri", color: C.gray, margin: 0 });
  });

  // Mechanism description
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.5, w: 9, h: 1.6, fill: { color: C.navy } });
  slide.addText("核心机制", { x: 0.8, y: 3.6, w: 3, h: 0.35, fontSize: 14, fontFace: "Calibri", color: C.seafoam, bold: true, margin: 0 });
  const mechSteps = [
    "1. playwright/index.tsx 加载全局 CSS + i18n 初始化",
    "2. TestWrapper 提供 MemoryRouter + I18nextProvider 上下文",
    "3. mount() 将组件挂载到隔离 DOM 环境",
    "4. expect() 断言可见性、文本、CSS 类、属性值、回调触发",
  ];
  mechSteps.forEach((s, i) => {
    slide.addText(s, { x: 0.8, y: 4.0 + i * 0.25, w: 8.5, h: 0.22, fontSize: 11, fontFace: "Calibri", color: C.white, margin: 0 });
  });

  // ────────────────────────────────────────
  // SLIDE 6 — Layer 2: E2E 测试详解
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.2, w: 0.08, h: 0.5, fill: { color: C.teal } });
  slide.addText("Layer 2 — E2E 端到端测试", { x: 0.75, y: 0.2, w: 8, h: 0.5, fontSize: 22, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // 6 spec cards (3x2 grid)
  const e2eSpecs = [
    { name: "home.spec.ts", items: "Hero 搜索 · 热门目的地 · 旅行主题 · 评价轮播 · 查看全部导航" },
    { name: "destinations.spec.ts", items: "12 目的地 · 关键字搜索 · 地区筛选 · 类型筛选 · URL 参数 · 卡片导航" },
    { name: "detail.spec.ts", items: "名称/国家 · 面包屑 · 画廊 · 景点 · 评分 · 推荐 · 404" },
    { name: "navigation.spec.ts", items: "Navbar 导航 · Logo 返回 · 中英切换 · 语言跨页持久 · Footer" },
    { name: "about.spec.ts", items: "标题 · 使命 · 3 价值观 · 4 团队成员 · 联系邮箱" },
    { name: "user-journey.spec.ts", items: "首页→列表→筛选→详情→返回→关于→首页\n主题分类导航" },
  ];
  e2eSpecs.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 0.5 + col * 3.1;
    const cy = 0.9 + row * 2.0;
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 2.9, h: 1.8, fill: { color: C.offWhite }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 2.9, h: 0.04, fill: { color: C.teal } });
    slide.addText(s.name, { x: cx + 0.15, y: cy + 0.12, w: 2.5, h: 0.3, fontSize: 12, fontFace: "Consolas", color: C.deepBlue, bold: true, margin: 0 });
    slide.addText(s.items, { x: cx + 0.15, y: cy + 0.5, w: 2.5, h: 1.2, fontSize: 10, fontFace: "Calibri", color: C.gray, margin: 0 });
  });

  // Bottom bar with mechanism
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.95, w: 9, h: 0.5, fill: { color: C.navy } });
  slide.addText("webServer 自动启动 Vite → Chromium 浏览器访问路由 → 用户操作模拟 → expect() 断言页面内容和 URL", {
    x: 0.8, y: 4.98, w: 8.5, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0,
  });

  // ────────────────────────────────────────
  // SLIDE 7 — Layer 3: 视觉回归测试
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.2, w: 0.08, h: 0.5, fill: { color: C.coral } });
  slide.addText("Layer 3 — 视觉回归测试", { x: 0.75, y: 0.2, w: 8, h: 0.5, fontSize: 22, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // 4 screenshot cards
  const screenshots = [
    { name: "home-main.png", page: "首页", scope: "main 元素", wait: "networkidle + Hero/热门/主题文本" },
    { name: "destinations-page.png", page: "目的地列表", scope: "fullPage", wait: "networkidle + 页面标题" },
    { name: "about-page.png", page: "关于我们", scope: "fullPage", wait: "networkidle + 页面标题" },
    { name: "detail-bali.png", page: "巴厘岛详情", scope: "fullPage", wait: "networkidle + \"巴厘岛\"标题" },
  ];
  screenshots.forEach((s, i) => {
    const cx = 0.5 + i * 2.35;
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: 0.9, w: 2.15, h: 2.4, fill: { color: C.offWhite }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: 0.9, w: 2.15, h: 0.04, fill: { color: C.coral } });
    // Screenshot placeholder
    slide.addShape(pres.shapes.RECTANGLE, { x: cx + 0.15, y: 1.05, w: 1.85, h: 0.85, fill: { color: C.lightGray } });
    slide.addImage({ data: icons.eyeAmber, x: cx + 0.75, y: 1.25, w: 0.4, h: 0.4 });
    slide.addText(s.name, { x: cx + 0.1, y: 2.0, w: 1.9, h: 0.25, fontSize: 10, fontFace: "Consolas", color: C.deepBlue, bold: true, margin: 0 });
    slide.addText(`页面: ${s.page}\n范围: ${s.scope}\n等待: ${s.wait}`, {
      x: cx + 0.1, y: 2.3, w: 1.9, h: 0.9, fontSize: 9, fontFace: "Calibri", color: C.gray, margin: 0,
    });
  });

  // Config info bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.55, w: 9, h: 1.6, fill: { color: C.navy } });
  slide.addText("关键配置", { x: 0.8, y: 3.65, w: 3, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.seafoam, bold: true, margin: 0 });
  const visConfigs = [
    { label: "比对阈值", val: "maxDiffPixelRatio: 0.01（允许 1% 像素差异）" },
    { label: "动画处理", val: "animations: 'disabled'（禁用 CSS 动画，确保截图稳定）" },
    { label: "基线存储", val: "tests/visual/pages.visual.spec.ts-snapshots/" },
    { label: "集成工具", val: "@argos-ci/playwright/reporter → Argos CI 视觉审查 + PR 门控" },
  ];
  visConfigs.forEach((c, i) => {
    slide.addText(c.label, { x: 0.8, y: 4.05 + i * 0.27, w: 1.2, h: 0.22, fontSize: 11, fontFace: "Calibri", color: C.mint, bold: true, margin: 0 });
    slide.addText(c.val, { x: 2.1, y: 4.05 + i * 0.27, w: 7.2, h: 0.22, fontSize: 11, fontFace: "Calibri", color: C.white, margin: 0 });
  });

  // ────────────────────────────────────────
  // SLIDE 8 — 数据流：7 阶段
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.deepBlue } });
  slide.addText("03", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("各阶段数据流", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // 7-stage pipeline
  const stages = [
    { num: "1", name: "源码准备", input: "TS源码 + i18n + 资源", output: "运行中应用", color: C.deepBlue },
    { num: "2", name: "组件测试", input: "组件 + TestWrapper", output: "组件验证 + 报告", color: C.teal },
    { num: "3", name: "E2E测试", input: "Web应用 + 路由", output: "路由验证 + trace", color: C.teal },
    { num: "4", name: "视觉回归", input: "应用 + 基线截图", output: "差异报告 + Argos", color: C.coral },
    { num: "5", name: "Azure执行", input: "测试代码 + 凭据", output: "Portal + 多报告", color: C.violet },
    { num: "6", name: "CI集成", input: "Git事件 + Secrets", output: "CI状态 + artifacts", color: C.amber },
    { num: "7", name: "部署", input: "main分支代码", output: "GitHub Pages", color: C.emerald },
  ];

  stages.forEach((s, i) => {
    const y = 0.9 + i * 0.62;
    // Stage number
    slide.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.05, w: 0.35, h: 0.35, fill: { color: s.color } });
    slide.addText(s.num, { x: 0.6, y: y + 0.05, w: 0.35, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
    // Stage name
    slide.addText(s.name, { x: 1.1, y: y, w: 1.3, h: 0.4, fontSize: 13, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
    // Input box
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: y, w: 2.8, h: 0.4, fill: { color: C.offWhite } });
    slide.addText(s.input, { x: 2.6, y: y, w: 2.6, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.darkText, valign: "middle", margin: 0 });
    // Arrow
    slide.addImage({ data: icons.arrow, x: 5.45, y: y + 0.07, w: 0.25, h: 0.25 });
    // Process bar
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.85, y: y, w: 0.1, h: 0.4, fill: { color: s.color } });
    // Output box
    slide.addShape(pres.shapes.RECTANGLE, { x: 6.1, y: y, w: 3.3, h: 0.4, fill: { color: C.offWhite } });
    slide.addText(s.output, { x: 6.2, y: y, w: 3.1, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.darkText, valign: "middle", margin: 0 });
    // Connector line
    if (i < stages.length - 1) {
      slide.addShape(pres.shapes.LINE, { x: 0.77, y: y + 0.42, w: 0, h: 0.2, line: { color: C.lightGray, width: 1.5 } });
    }
  });

  // Column headers
  slide.addText("INPUT", { x: 3.2, y: 0.72, w: 1.5, h: 0.2, fontSize: 9, fontFace: "Calibri", color: C.gray, bold: true, align: "center", margin: 0 });
  slide.addText("OUTPUT", { x: 7.0, y: 0.72, w: 1.5, h: 0.2, fontSize: 9, fontFace: "Calibri", color: C.gray, bold: true, align: "center", margin: 0 });

  // ────────────────────────────────────────
  // SLIDE 9 — 执行环境对比
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.deepBlue } });
  slide.addText("04", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("执行环境对比", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // Comparison table
  const tableHeader = [
    { text: "维度", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 12, fontFace: "Calibri", align: "left" } },
    { text: "本地开发环境", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 12, fontFace: "Calibri", align: "center" } },
    { text: "Azure Playwright Workspace", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 12, fontFace: "Calibri", align: "center" } },
  ];
  const rowStyle = (text, opts = {}) => ({ text, options: { fontSize: 11, fontFace: "Calibri", color: C.darkText, ...opts } });
  const tableRows = [
    [rowStyle("配置文件"), rowStyle("playwright.config.ts", { align: "center" }), rowStyle("playwright.service.config.ts", { align: "center" })],
    [rowStyle("npm 命令"), rowStyle("test:ct / test:e2e / test:visual", { align: "center" }), rowStyle("test:azure:e2e / test:azure:visual", { align: "center" })],
    [rowStyle("浏览器 OS"), rowStyle("开发者本机 (macOS/Win/Linux)", { align: "center" }), rowStyle("Azure 云端 Linux", { align: "center" })],
    [rowStyle("并行度"), rowStyle("fullyParallel, workers: auto", { align: "center" }), rowStyle("CI: workers: 10 (最多 50)", { align: "center" })],
    [rowStyle("重试次数"), rowStyle("0", { align: "center" }), rowStyle("CI: 2", { align: "center" })],
    [rowStyle("认证"), rowStyle("无需", { align: "center" }), rowStyle("DefaultAzureCredential (Entra ID)", { align: "center" })],
    [rowStyle("报告格式"), rowStyle("HTML", { align: "center" }), rowStyle("HTML + Azure Portal + Argos CI", { align: "center" })],
    [rowStyle("适用场景"), rowStyle("开发时快速验证", { align: "center" }), rowStyle("CI/CD · 基线一致性 · 大规模并行", { align: "center" })],
  ];

  slide.addTable([tableHeader, ...tableRows], {
    x: 0.5, y: 0.95, w: 9, h: 3.6,
    colW: [1.8, 3.2, 4.0],
    border: { pt: 0.5, color: C.lightGray },
    rowH: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
    autoPage: false,
  });

  // Warning box
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.75, w: 9, h: 0.65, fill: { color: "FFF7ED" } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.75, w: 0.06, h: 0.65, fill: { color: C.amber } });
  slide.addText("⚠ 重要提示：本地生成的基线截图与 Azure 云端生成的基线截图不兼容（OS 字体渲染差异），需选择一个环境作为基线来源并保持一致。", {
    x: 0.75, y: 4.78, w: 8.5, h: 0.6, fontSize: 11, fontFace: "Calibri", color: C.darkText, valign: "middle", margin: 0,
  });

  // ────────────────────────────────────────
  // SLIDE 10 — CI/CD 流水线
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.deepBlue } });
  slide.addText("05", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("CI/CD 流水线", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // Left: Test pipeline
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.9, w: 4.5, h: 4.35, fill: { color: C.offWhite }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.9, w: 4.5, h: 0.5, fill: { color: C.deepBlue } });
  slide.addText("playwright-azure.yml — 测试流水线", { x: 0.7, y: 0.92, w: 4, h: 0.45, fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, valign: "middle", margin: 0 });

  slide.addText("触发条件", { x: 0.7, y: 1.5, w: 2, h: 0.25, fontSize: 11, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  slide.addText("push main · PR main · 手动触发", { x: 0.7, y: 1.75, w: 4, h: 0.25, fontSize: 10, fontFace: "Calibri", color: C.gray, margin: 0 });

  const ciSteps = [
    "1. checkout 代码",
    "2. setup Node 22 + npm ci",
    "3. install Chromium 浏览器",
    "4. E2E 测试 (Azure PT)",
    "5. Visual 测试 (Azure PT) ⚙ continue-on-error",
    "6. 上传 playwright-report/ (14天)",
    "7. 上传 test-results/ (14天)",
  ];
  ciSteps.forEach((s, i) => {
    const y = 2.15 + i * 0.3;
    slide.addText(s, { x: 0.7, y, w: 4, h: 0.25, fontSize: 10, fontFace: "Calibri", color: C.darkText, margin: 0 });
  });

  slide.addText("Secrets", { x: 0.7, y: 4.4, w: 2, h: 0.25, fontSize: 11, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  slide.addText("PLAYWRIGHT_SERVICE_URL\nPLAYWRIGHT_SERVICE_ACCESS_TOKEN\nARGOS_TOKEN", {
    x: 0.7, y: 4.65, w: 4, h: 0.5, fontSize: 9, fontFace: "Consolas", color: C.gray, margin: 0,
  });

  // Right: Deploy pipeline
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 0.9, w: 4.2, h: 2.7, fill: { color: C.offWhite }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 0.9, w: 4.2, h: 0.5, fill: { color: C.emerald } });
  slide.addText("deploy.yml — 部署流水线", { x: 5.5, y: 0.92, w: 3.8, h: 0.45, fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, valign: "middle", margin: 0 });

  slide.addText("触发: push to main", { x: 5.5, y: 1.5, w: 3.5, h: 0.25, fontSize: 11, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });

  const deploySteps = [
    "Job 1: Build",
    "  npm ci → npm run build → dist/",
    "  upload-pages-artifact",
    "",
    "Job 2: Deploy",
    "  deploy-pages → GitHub Pages",
  ];
  deploySteps.forEach((s, i) => {
    slide.addText(s, { x: 5.5, y: 1.85 + i * 0.25, w: 3.8, h: 0.22, fontSize: 10, fontFace: s.startsWith(" ") ? "Consolas" : "Calibri", color: s.startsWith("Job") ? C.deepBlue : C.gray, bold: s.startsWith("Job"), margin: 0 });
  });

  // Relationship note
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 3.8, w: 4.2, h: 1.45, fill: { color: C.navy } });
  slide.addText("两条流水线的关系", { x: 5.5, y: 3.9, w: 3.5, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.seafoam, bold: true, margin: 0 });
  slide.addText([
    { text: "独立并行运行", options: { breakLine: true, bold: true } },
    { text: "部署不依赖测试通过", options: { breakLine: true } },
    { text: "如需门控，可在 deploy.yml 添加 needs 依赖", options: {} },
  ], { x: 5.5, y: 4.25, w: 3.8, h: 0.9, fontSize: 10, fontFace: "Calibri", color: C.white, margin: 0 });

  // ────────────────────────────────────────
  // SLIDE 11 — 测试覆盖矩阵
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.deepBlue } });
  slide.addText("06", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("测试覆盖矩阵", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // Coverage matrix table
  const mHeader = [
    { text: "被测对象", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri" } },
    { text: "组件测试 (CT)", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri", align: "center" } },
    { text: "E2E 测试", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri", align: "center" } },
    { text: "视觉回归", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri", align: "center" } },
  ];
  const mRow = (name, ct, e2e, vis) => [
    { text: name, options: { fontSize: 10, fontFace: "Calibri", color: C.darkText } },
    { text: ct, options: { fontSize: 10, fontFace: "Calibri", color: ct === "✅" ? "10B981" : C.gray, align: "center" } },
    { text: e2e, options: { fontSize: 10, fontFace: "Calibri", color: e2e === "✅" ? "10B981" : C.gray, align: "center" } },
    { text: vis, options: { fontSize: 10, fontFace: "Calibri", color: vis === "✅" ? "10B981" : C.gray, align: "center" } },
  ];
  const mData = [
    mHeader,
    mRow("Navbar", "✅", "✅", "✅"),
    mRow("SearchBar", "✅", "✅", "✅"),
    mRow("FilterBar", "✅", "✅", "✅"),
    mRow("Carousel", "✅", "✅", "✅"),
    mRow("DestinationCard", "✅", "✅", "✅"),
    mRow("Footer", "✅", "✅", "✅"),
    mRow("HomePage", "—", "✅", "✅"),
    mRow("DestinationsPage", "—", "✅", "✅"),
    mRow("DetailPage", "—", "✅", "✅"),
    mRow("AboutPage", "—", "✅", "✅"),
    mRow("i18n 语言切换", "—", "✅", "—"),
    mRow("用户完整旅程", "—", "✅", "—"),
  ];

  slide.addTable(mData, {
    x: 0.5, y: 0.85, w: 5.5, h: 4.5,
    colW: [1.6, 1.3, 1.3, 1.3],
    border: { pt: 0.5, color: C.lightGray },
    rowH: [0.35, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32],
    autoPage: false,
  });

  // Right stats summary
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 0.85, w: 3.2, h: 4.5, fill: { color: C.offWhite }, shadow: makeShadow() });
  slide.addText("统计概览", { x: 6.5, y: 0.95, w: 2.8, h: 0.4, fontSize: 16, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });

  const summaryStats = [
    { val: "13", label: "spec 文件总数", color: C.deepBlue },
    { val: "~59", label: "测试用例总数", color: C.teal },
    { val: "4", label: "视觉截图数", color: C.coral },
    { val: "6", label: "CT 被测组件", color: C.emerald },
    { val: "100%", label: "路由覆盖率", color: C.amber },
    { val: "6/6", label: "组件覆盖率", color: C.violet },
  ];
  summaryStats.forEach((s, i) => {
    const y = 1.5 + i * 0.58;
    slide.addShape(pres.shapes.RECTANGLE, { x: 6.5, y, w: 0.08, h: 0.45, fill: { color: s.color } });
    slide.addText(s.val, { x: 6.75, y, w: 1.2, h: 0.45, fontSize: 22, fontFace: "Calibri", color: s.color, bold: true, valign: "middle", margin: 0 });
    slide.addText(s.label, { x: 8.0, y, w: 1.3, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.gray, valign: "middle", margin: 0 });
  });

  // ────────────────────────────────────────
  // SLIDE 12 — 关键配置与命令
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.deepBlue } });
  slide.addText("07", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("关键配置与命令", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.navy, margin: 0 });

  // Config files
  slide.addText("配置文件", { x: 0.6, y: 0.85, w: 3, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });

  const configs = [
    { file: "playwright.config.ts", desc: "主配置（E2E + Visual projects, webServer, reporter）" },
    { file: "playwright-ct.config.ts", desc: "组件测试（CT Vite, PostCSS）" },
    { file: "playwright.service.config.ts", desc: "Azure 云测试（继承主配置 + Azure overlay）" },
    { file: "vite.config.ts", desc: "应用构建（React plugin, base: /UI-test-Demo/）" },
  ];
  configs.forEach((c, i) => {
    const y = 1.2 + i * 0.38;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 8.8, h: 0.33, fill: { color: i % 2 === 0 ? C.offWhite : C.white } });
    slide.addText(c.file, { x: 0.7, y, w: 3, h: 0.33, fontSize: 10, fontFace: "Consolas", color: C.deepBlue, bold: true, valign: "middle", margin: 0 });
    slide.addText(c.desc, { x: 3.7, y, w: 5.5, h: 0.33, fontSize: 10, fontFace: "Calibri", color: C.gray, valign: "middle", margin: 0 });
  });

  // npm scripts
  slide.addText("npm Scripts 速查", { x: 0.6, y: 2.85, w: 3, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });

  const scripts = [
    { cmd: "npm run test:ct", desc: "运行组件测试" },
    { cmd: "npm run test:e2e", desc: "运行 E2E 测试" },
    { cmd: "npm run test:visual", desc: "运行视觉回归测试" },
    { cmd: "npm run test:all", desc: "运行全部测试" },
    { cmd: "npm run test:update-snapshots", desc: "更新视觉基线截图" },
    { cmd: "npm run test:azure", desc: "Azure 云端运行全部" },
    { cmd: "npm run test:azure:e2e", desc: "Azure 云端 E2E" },
    { cmd: "npm run test:azure:visual", desc: "Azure 云端视觉回归" },
  ];
  scripts.forEach((s, i) => {
    const y = 3.2 + i * 0.3;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 8.8, h: 0.26, fill: { color: i % 2 === 0 ? C.offWhite : C.white } });
    slide.addText(s.cmd, { x: 0.7, y, w: 4.2, h: 0.26, fontSize: 10, fontFace: "Consolas", color: C.darkText, valign: "middle", margin: 0 });
    slide.addText(s.desc, { x: 5.0, y, w: 4.2, h: 0.26, fontSize: 10, fontFace: "Calibri", color: C.gray, valign: "middle", margin: 0 });
  });

  // ────────────────────────────────────────
  // SLIDE 13 — 工具链全景
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });
  slide.addShape(pres.shapes.OVAL, { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fill: { color: C.seafoam } });
  slide.addText("08", { x: 0.5, y: 0.25, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Calibri", color: C.navy, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText("工具链全景", { x: 1.1, y: 0.25, w: 5, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: C.white, margin: 0 });

  // Application layer
  slide.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 0.9, w: 5, h: 0.5, fill: { color: C.deepBlue } });
  slide.addText("React 19 + TypeScript + Vite + Tailwind + i18n", {
    x: 2.6, y: 0.92, w: 4.8, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", margin: 0,
  });

  // Down arrow
  slide.addShape(pres.shapes.LINE, { x: 5, y: 1.4, w: 0, h: 0.25, line: { color: C.seafoam, width: 2 } });

  // Three test boxes
  const testBoxes = [
    { label: "Playwright CT\n(CT React)", x: 1.0, color: C.deepBlue },
    { label: "Playwright E2E\n(Desktop Chrome)", x: 3.8, color: C.teal },
    { label: "Playwright Visual\n(+ Argos CI)", x: 6.6, color: C.coral },
  ];
  testBoxes.forEach((b) => {
    slide.addShape(pres.shapes.RECTANGLE, { x: b.x, y: 1.75, w: 2.5, h: 0.7, fill: { color: b.color } });
    slide.addText(b.label, { x: b.x + 0.1, y: 1.78, w: 2.3, h: 0.65, fontSize: 10, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", margin: 0 });
  });

  // Down arrows
  [2.25, 5.05, 7.85].forEach((ax) => {
    slide.addShape(pres.shapes.LINE, { x: ax, y: 2.45, w: 0, h: 0.25, line: { color: C.seafoam, width: 1.5 } });
  });

  // Azure box
  slide.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 2.8, w: 7, h: 0.7, fill: { color: C.violet } });
  slide.addText("Azure Playwright Workspace  ·  Linux Chromium  ·  10 workers  ·  Entra ID", {
    x: 1.6, y: 2.83, w: 6.8, h: 0.65, fontSize: 11, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", margin: 0,
  });

  // Down arrow
  slide.addShape(pres.shapes.LINE, { x: 5, y: 3.5, w: 0, h: 0.25, line: { color: C.seafoam, width: 2 } });

  // CI/CD box
  slide.addShape(pres.shapes.RECTANGLE, { x: 2.0, y: 3.85, w: 6, h: 0.55, fill: { color: C.amber } });
  slide.addText("GitHub Actions CI/CD  ·  playwright-azure.yml + deploy.yml", {
    x: 2.1, y: 3.87, w: 5.8, h: 0.5, fontSize: 11, fontFace: "Calibri", color: C.navy, align: "center", valign: "middle", bold: true, margin: 0,
  });

  // Down arrow
  slide.addShape(pres.shapes.LINE, { x: 5, y: 4.4, w: 0, h: 0.25, line: { color: C.seafoam, width: 2 } });

  // GitHub Pages
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 4.75, w: 4, h: 0.55, fill: { color: C.emerald } });
  slide.addText("GitHub Pages  ·  nickhou1983.github.io/UI-test-Demo/", {
    x: 3.1, y: 4.77, w: 3.8, h: 0.5, fontSize: 11, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", margin: 0,
  });

  // ────────────────────────────────────────
  // SLIDE 14 — 结束页
  // ────────────────────────────────────────
  slide = pres.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.seafoam } });

  slide.addText("Thank You", {
    x: 1, y: 1.2, w: 8, h: 1,
    fontSize: 48, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle", margin: 0,
  });
  slide.addShape(pres.shapes.LINE, { x: 3.5, y: 2.4, w: 3, h: 0, line: { color: C.seafoam, width: 2.5 } });
  slide.addText("TravelVista UI 自动化测试工作流架构", {
    x: 1, y: 2.7, w: 8, h: 0.6,
    fontSize: 18, fontFace: "Calibri", color: C.seafoam, align: "center", margin: 0,
  });
  slide.addText("3 层测试金字塔  ×  2 执行环境  ×  CI/CD 全流程", {
    x: 1, y: 3.3, w: 8, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.gray, align: "center", margin: 0,
  });
  slide.addText("详细文档：UI-TEST-WORKFLOW.md", {
    x: 1, y: 4.2, w: 8, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.mint, align: "center", margin: 0,
  });

  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.0, w: 10, h: 0.625, fill: { color: C.deepBlue } });
  slide.addText("2026-03-18  |  TravelVista QA Team", {
    x: 0.6, y: 5.05, w: 8.8, h: 0.55,
    fontSize: 11, fontFace: "Calibri", color: C.gray, align: "center", valign: "middle",
  });

  // Write file
  await pres.writeFile({ fileName: "UI-Test-Workflow.pptx" });
  console.log("✅ PPT generated: UI-Test-Workflow.pptx");
}

generatePPT().catch(console.error);
