const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// ── Icon helpers ──
const {
  FaReact, FaCode, FaDesktop, FaCloud, FaGithub, FaCheckCircle, FaEye,
  FaCogs, FaLayerGroup, FaChartBar, FaRocket, FaServer, FaImage,
  FaBolt, FaGlobe, FaPuzzlePiece, FaClipboardCheck, FaShieldAlt,
  FaProjectDiagram, FaStar
} = require("react-icons/fa");

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

// ── Palette: Ocean Gradient ──
const C = {
  navy:      "1E2761",
  deepBlue:  "065A82",
  teal:      "1C7293",
  midnight:  "21295C",
  ice:       "CADCFC",
  white:     "FFFFFF",
  lightGray: "F0F4F8",
  darkText:  "1E293B",
  mutedText: "64748B",
  accent:    "0D9488",
  accentAlt: "14B8A6",
  coral:     "F96167",
  gold:      "F59E0B",
  green:     "10B981",
  purple:    "7C3AED",
};

const FONT_TITLE = "Arial Black";
const FONT_BODY  = "Arial";

// ── Shadow & style factories (fresh object each call to avoid PptxGenJS mutation bug) ──
const mkShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.12 });
const mkCardShadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.10 });

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "TravelVista Team";
  pres.title = "TravelVista UI 自动化测试架构";

  // Pre-render icons
  const icons = {};
  const iconDefs = [
    ["react", FaReact, C.white],
    ["code", FaCode, C.white],
    ["desktop", FaDesktop, C.white],
    ["cloud", FaCloud, C.white],
    ["github", FaGithub, C.white],
    ["check", FaCheckCircle, C.white],
    ["eye", FaEye, C.white],
    ["cogs", FaCogs, C.white],
    ["layers", FaLayerGroup, C.white],
    ["chart", FaChartBar, C.white],
    ["rocket", FaRocket, C.white],
    ["server", FaServer, C.white],
    ["image", FaImage, C.white],
    ["bolt", FaBolt, C.white],
    ["globe", FaGlobe, C.white],
    ["puzzle", FaPuzzlePiece, C.white],
    ["clipboard", FaClipboardCheck, C.white],
    ["shield", FaShieldAlt, C.white],
    ["project", FaProjectDiagram, C.white],
    ["star", FaStar, C.gold],
    ["checkDark", FaCheckCircle, C.accent],
    ["codeDark", FaCode, C.deepBlue],
    ["desktopDark", FaDesktop, C.teal],
    ["eyeDark", FaEye, C.purple],
    ["cloudDark", FaCloud, C.deepBlue],
    ["githubDark", FaGithub, C.darkText],
  ];
  for (const [name, comp, color] of iconDefs) {
    icons[name] = await iconToBase64Png(comp, `#${color}`);
  }

  // ── Helper: add page number ──
  function addPageNum(slide, num, total) {
    slide.addText(`${num} / ${total}`, {
      x: 8.8, y: 5.2, w: 1.0, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, color: C.mutedText, align: "right",
    });
  }

  // ── Helper: icon in colored circle ──
  function addIconCircle(slide, iconData, x, y, bgColor, size = 0.5) {
    slide.addShape(pres.shapes.OVAL, {
      x, y, w: size, h: size,
      fill: { color: bgColor },
    });
    const pad = size * 0.2;
    slide.addImage({
      data: iconData, x: x + pad, y: y + pad,
      w: size - pad * 2, h: size - pad * 2,
    });
  }

  const TOTAL = 10;

  // ════════════════════════════════════════════════════════════════
  // SLIDE 1: 封面
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    // Decorative shape
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 2.0,
      fill: { color: C.midnight, transparency: 40 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 4.6, w: 10, h: 1.025,
      fill: { color: C.midnight, transparency: 40 },
    });
    // Title
    s.addText("TravelVista", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.0,
      fontSize: 48, fontFace: FONT_TITLE, color: C.white, bold: true,
      align: "center", charSpacing: 4,
    });
    s.addText("UI 自动化测试架构", {
      x: 0.8, y: 2.1, w: 8.4, h: 0.8,
      fontSize: 32, fontFace: FONT_BODY, color: C.ice, align: "center",
    });
    // Subtitle line
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.1, w: 3.0, h: 0,
      line: { color: C.accent, width: 2 },
    });
    s.addText("Playwright · React 19 · Vite 8 · Azure Cloud", {
      x: 0.8, y: 3.3, w: 8.4, h: 0.5,
      fontSize: 14, fontFace: FONT_BODY, color: C.mutedText, align: "center",
    });
    // Icons row
    const iconRow = [icons.react, icons.code, icons.eye, icons.cloud, icons.github];
    const startX = 3.0;
    for (let i = 0; i < iconRow.length; i++) {
      addIconCircle(s, iconRow[i], startX + i * 0.9, 4.0, C.deepBlue, 0.5);
    }
    s.addText("2026 年 3 月", {
      x: 0.8, y: 4.8, w: 8.4, h: 0.4,
      fontSize: 12, fontFace: FONT_BODY, color: C.mutedText, align: "center",
    });
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 2: 项目概览
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    // Top bar
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    s.addText("项目概览", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 28, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });

    // Left column: tech stack cards
    const techStack = [
      ["React 19", "UI 框架"],
      ["TypeScript 5.9", "类型安全"],
      ["Vite 8.0", "构建工具"],
      ["Tailwind CSS 4.2", "样式系统"],
      ["React Router 7.13", "客户端路由"],
      ["i18next 25.8", "国际化 (中/英)"],
    ];
    s.addText("技术栈", {
      x: 0.6, y: 1.0, w: 4.0, h: 0.4,
      fontSize: 16, fontFace: FONT_BODY, color: C.accent, bold: true, margin: 0,
    });
    for (let i = 0; i < techStack.length; i++) {
      const yPos = 1.5 + i * 0.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y: yPos, w: 4.0, h: 0.45,
        fill: { color: C.lightGray },
        shadow: mkCardShadow(),
      });
      s.addText(techStack[i][0], {
        x: 0.8, y: yPos, w: 1.8, h: 0.45,
        fontSize: 12, fontFace: FONT_BODY, color: C.darkText, bold: true, valign: "middle",
      });
      s.addText(techStack[i][1], {
        x: 2.6, y: yPos, w: 1.9, h: 0.45,
        fontSize: 11, fontFace: FONT_BODY, color: C.mutedText, valign: "middle",
      });
    }

    // Right column: routes & data
    s.addText("路由结构", {
      x: 5.4, y: 1.0, w: 4.0, h: 0.4,
      fontSize: 16, fontFace: FONT_BODY, color: C.accent, bold: true, margin: 0,
    });
    const routes = [
      ["/", "HomePage — 首页"],
      ["/destinations", "DestinationsPage — 目的地列表"],
      ["/destinations/:id", "DestinationDetailPage — 详情"],
      ["/about", "AboutPage — 关于页"],
    ];
    for (let i = 0; i < routes.length; i++) {
      const yPos = 1.5 + i * 0.52;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 5.4, y: yPos, w: 0.06, h: 0.42,
        fill: { color: C.accent },
      });
      s.addText(routes[i][0], {
        x: 5.6, y: yPos, w: 1.6, h: 0.42,
        fontSize: 10, fontFace: "Consolas", color: C.deepBlue, valign: "middle",
      });
      s.addText(routes[i][1], {
        x: 7.2, y: yPos, w: 2.4, h: 0.42,
        fontSize: 10, fontFace: FONT_BODY, color: C.mutedText, valign: "middle",
      });
    }

    // Data scale boxes
    s.addText("数据规模", {
      x: 5.4, y: 3.7, w: 4.0, h: 0.4,
      fontSize: 16, fontFace: FONT_BODY, color: C.accent, bold: true, margin: 0,
    });
    const stats = [
      ["12", "目的地"],
      ["6", "地区"],
      ["4", "类型"],
      ["2", "语言"],
    ];
    for (let i = 0; i < stats.length; i++) {
      const xPos = 5.4 + i * 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xPos, y: 4.2, w: 0.95, h: 0.9,
        fill: { color: C.navy },
        shadow: mkCardShadow(),
      });
      s.addText(stats[i][0], {
        x: xPos, y: 4.2, w: 0.95, h: 0.5,
        fontSize: 24, fontFace: FONT_TITLE, color: C.white, align: "center", valign: "bottom", bold: true,
      });
      s.addText(stats[i][1], {
        x: xPos, y: 4.7, w: 0.95, h: 0.4,
        fontSize: 10, fontFace: FONT_BODY, color: C.ice, align: "center", valign: "top",
      });
    }

    addPageNum(s, 2, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 3: 测试分层架构 — 三层金字塔
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    s.addText("测试分层架构", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 28, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });
    s.addText("三层测试金字塔 — 从底层到顶层覆盖度递减、集成度递增", {
      x: 0.6, y: 0.9, w: 8.8, h: 0.4,
      fontSize: 13, fontFace: FONT_BODY, color: C.mutedText, margin: 0,
    });

    // Pyramid layers — using trapezoid-like rectangles
    // Layer 3 (top) — Visual
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.2, y: 1.6, w: 3.6, h: 0.9,
      fill: { color: C.purple },
      shadow: mkShadow(),
    });
    addIconCircle(s, icons.eye, 3.4, 1.75, C.purple, 0.4);
    s.addText("视觉回归测试", {
      x: 3.9, y: 1.6, w: 2.7, h: 0.45,
      fontSize: 14, fontFace: FONT_BODY, color: C.white, bold: true, valign: "bottom", margin: 0,
    });
    s.addText("1 spec · 8 截图", {
      x: 3.9, y: 2.05, w: 2.7, h: 0.35,
      fontSize: 11, fontFace: FONT_BODY, color: "E0D5F5", valign: "top", margin: 0,
    });

    // Layer 2 (middle) — E2E
    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.3, y: 2.7, w: 5.4, h: 0.9,
      fill: { color: C.deepBlue },
      shadow: mkShadow(),
    });
    addIconCircle(s, icons.globe, 2.5, 2.85, C.deepBlue, 0.4);
    s.addText("E2E 端到端测试", {
      x: 3.0, y: 2.7, w: 4.5, h: 0.45,
      fontSize: 14, fontFace: FONT_BODY, color: C.white, bold: true, valign: "bottom", margin: 0,
    });
    s.addText("6 spec · 页面导航 + 用户旅程", {
      x: 3.0, y: 3.15, w: 4.5, h: 0.35,
      fontSize: 11, fontFace: FONT_BODY, color: C.ice, valign: "top", margin: 0,
    });

    // Layer 1 (bottom) — CT
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.3, y: 3.8, w: 7.4, h: 0.9,
      fill: { color: C.accent },
      shadow: mkShadow(),
    });
    addIconCircle(s, icons.puzzle, 1.5, 3.95, C.accent, 0.4);
    s.addText("组件测试 (Component Testing)", {
      x: 2.0, y: 3.8, w: 6.5, h: 0.45,
      fontSize: 14, fontFace: FONT_BODY, color: C.white, bold: true, valign: "bottom", margin: 0,
    });
    s.addText("6 spec · 隔离组件单元测试", {
      x: 2.0, y: 4.25, w: 6.5, h: 0.35,
      fontSize: 11, fontFace: FONT_BODY, color: "D1FAE5", valign: "top", margin: 0,
    });

    // Arrows and labels
    s.addText("集成度 ↑", {
      x: 0.3, y: 1.6, w: 0.8, h: 3.1,
      fontSize: 11, fontFace: FONT_BODY, color: C.mutedText, align: "center", valign: "middle",
      rotate: 270,
    });

    addPageNum(s, 3, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 4: Layer 1 — 组件测试
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    s.addText("Layer 1: 组件测试 (Component Testing)", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 26, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });

    // Config card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.1, w: 4.2, h: 1.8,
      fill: { color: C.lightGray }, shadow: mkCardShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.1, w: 0.06, h: 1.8, fill: { color: C.accent } });
    s.addText("核心配置", {
      x: 0.85, y: 1.15, w: 3.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.accent, bold: true, margin: 0,
    });
    s.addText([
      { text: "工具: @playwright/experimental-ct-react", options: { breakLine: true, fontSize: 10 } },
      { text: "配置: playwright-ct.config.ts", options: { breakLine: true, fontSize: 10 } },
      { text: "命令: npm run test:ct", options: { breakLine: true, fontSize: 10 } },
      { text: "浏览器: Desktop Chrome", options: { fontSize: 10 } },
    ], {
      x: 0.85, y: 1.55, w: 3.8, h: 1.3,
      fontFace: "Consolas", color: C.darkText, paraSpaceAfter: 4,
    });

    // Mechanism card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: 1.1, w: 4.2, h: 1.8,
      fill: { color: C.lightGray }, shadow: mkCardShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 0.06, h: 1.8, fill: { color: C.deepBlue } });
    s.addText("核心机制", {
      x: 5.45, y: 1.15, w: 3.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.deepBlue, bold: true, margin: 0,
    });
    s.addText([
      { text: "CT 内置 Vite 加载组件", options: { breakLine: true, fontSize: 10 } },
      { text: "mount() 挂载到隔离 DOM", options: { breakLine: true, fontSize: 10 } },
      { text: "TestWrapper 提供 Router + i18n 上下文", options: { breakLine: true, fontSize: 10 } },
      { text: "expect() 断言可见性/文本/CSS/回调", options: { fontSize: 10 } },
    ], {
      x: 5.45, y: 1.55, w: 3.8, h: 1.3,
      fontFace: FONT_BODY, color: C.darkText, paraSpaceAfter: 4,
    });

    // 6 component spec cards
    s.addText("6 个组件测试规格", {
      x: 0.6, y: 3.1, w: 8.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.accent, bold: true, margin: 0,
    });
    const comps = [
      ["Navbar", "导航链接 · 语言切换\n移动端菜单 · Logo"],
      ["SearchBar", "Placeholder · 值输入\nonChange 回调"],
      ["FilterBar", "搜索框 + 下拉菜单\n6 地区 / 4 类型"],
      ["Carousel", "轮播项 · 导航圆点\n自动播放 · 切换"],
      ["DestinationCard", "名称/国家(i18n)\n评分 · 星级"],
      ["Footer", "品牌名 · 导航链接\n社交媒体 · 版权"],
    ];
    for (let i = 0; i < comps.length; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const xPos = 0.6 + col * 3.1;
      const yPos = 3.55 + row * 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xPos, y: yPos, w: 2.9, h: 0.95,
        fill: { color: C.white }, shadow: mkCardShadow(),
        line: { color: C.accent, width: 0.5 },
      });
      s.addText(comps[i][0], {
        x: xPos + 0.1, y: yPos + 0.05, w: 2.7, h: 0.3,
        fontSize: 12, fontFace: FONT_BODY, color: C.accent, bold: true, margin: 0,
      });
      s.addText(comps[i][1], {
        x: xPos + 0.1, y: yPos + 0.35, w: 2.7, h: 0.55,
        fontSize: 9, fontFace: FONT_BODY, color: C.mutedText, margin: 0,
      });
    }

    addPageNum(s, 4, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 5: Layer 2 — E2E 测试
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.deepBlue } });
    s.addText("Layer 2: E2E 端到端测试", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 26, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });

    // Config card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.1, w: 4.2, h: 1.5,
      fill: { color: C.lightGray }, shadow: mkCardShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.1, w: 0.06, h: 1.5, fill: { color: C.deepBlue } });
    s.addText("核心配置", {
      x: 0.85, y: 1.15, w: 3.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.deepBlue, bold: true, margin: 0,
    });
    s.addText([
      { text: "配置: playwright.config.ts → project: e2e", options: { breakLine: true, fontSize: 10 } },
      { text: "命令: npm run test:e2e", options: { breakLine: true, fontSize: 10 } },
      { text: "Web Server: Vite dev (自动启动)", options: { breakLine: true, fontSize: 10 } },
      { text: "浏览器: Desktop Chrome", options: { fontSize: 10 } },
    ], {
      x: 0.85, y: 1.55, w: 3.8, h: 1.0,
      fontFace: "Consolas", color: C.darkText, paraSpaceAfter: 3,
    });

    // Flow card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: 1.1, w: 4.2, h: 1.5,
      fill: { color: C.lightGray }, shadow: mkCardShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 0.06, h: 1.5, fill: { color: C.accent } });
    s.addText("执行流程", {
      x: 5.45, y: 1.15, w: 3.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.accent, bold: true, margin: 0,
    });
    s.addText([
      { text: "启动 Chromium → goto() 访问路由", options: { breakLine: true, fontSize: 10 } },
      { text: "→ 执行用户操作 (点击/填充/选择)", options: { breakLine: true, fontSize: 10 } },
      { text: "→ expect() 断言页面内容 & URL", options: { breakLine: true, fontSize: 10 } },
      { text: "Trace 首次重试 · 失败截图", options: { fontSize: 10 } },
    ], {
      x: 5.45, y: 1.55, w: 3.8, h: 1.0,
      fontFace: FONT_BODY, color: C.darkText, paraSpaceAfter: 3,
    });

    // 6 E2E specs
    s.addText("6 个 E2E 测试规格", {
      x: 0.6, y: 2.85, w: 8.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.deepBlue, bold: true, margin: 0,
    });
    const e2eSpecs = [
      ["home.spec.ts", "Hero 搜索 · 热门目的地\n旅行主题 · 评价轮播"],
      ["destinations.spec.ts", "12 目的地 · 关键字搜索\n地区/类型筛选 · 卡片导航"],
      ["destination-detail.spec.ts", "面包屑 · 图片画廊\n景点 · 侧边栏 · 推荐卡片"],
      ["about.spec.ts", "使命 · 价值观\n团队成员 · 联系区域"],
      ["navigation.spec.ts", "Navbar 导航 · Logo\n中英文切换 · Footer"],
      ["user-journey.spec.ts", "首页→列表→筛选→详情\n面包屑返回→关于→首页"],
    ];
    for (let i = 0; i < e2eSpecs.length; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const xPos = 0.6 + col * 3.1;
      const yPos = 3.3 + row * 1.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xPos, y: yPos, w: 2.9, h: 1.05,
        fill: { color: C.white }, shadow: mkCardShadow(),
        line: { color: C.deepBlue, width: 0.5 },
      });
      s.addText(e2eSpecs[i][0], {
        x: xPos + 0.1, y: yPos + 0.05, w: 2.7, h: 0.3,
        fontSize: 11, fontFace: "Consolas", color: C.deepBlue, bold: true, margin: 0,
      });
      s.addText(e2eSpecs[i][1], {
        x: xPos + 0.1, y: yPos + 0.4, w: 2.7, h: 0.6,
        fontSize: 9, fontFace: FONT_BODY, color: C.mutedText, margin: 0,
      });
    }

    addPageNum(s, 5, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 6: Layer 3 — 视觉回归
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.purple } });
    s.addText("Layer 3: 视觉回归测试", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 26, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });

    // Left — config
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.1, w: 4.2, h: 1.5,
      fill: { color: C.lightGray }, shadow: mkCardShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.1, w: 0.06, h: 1.5, fill: { color: C.purple } });
    s.addText("核心配置", {
      x: 0.85, y: 1.15, w: 3.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.purple, bold: true, margin: 0,
    });
    s.addText([
      { text: "项目: playwright.config.ts → visual", options: { breakLine: true, fontSize: 10 } },
      { text: "命令: npm run test:visual", options: { breakLine: true, fontSize: 10 } },
      { text: "阈值: maxDiffPixelRatio: 0.05%", options: { breakLine: true, fontSize: 10 } },
      { text: "动画: animations: 'disabled'", options: { fontSize: 10 } },
    ], {
      x: 0.85, y: 1.55, w: 3.8, h: 1.0,
      fontFace: "Consolas", color: C.darkText, paraSpaceAfter: 3,
    });

    // Right — flow
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: 1.1, w: 4.2, h: 1.5,
      fill: { color: C.lightGray }, shadow: mkCardShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 0.06, h: 1.5, fill: { color: C.coral } });
    s.addText("比对流程", {
      x: 5.45, y: 1.15, w: 3.8, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.coral, bold: true, margin: 0,
    });
    s.addText([
      { text: "导航 → networkidle 等待", options: { breakLine: true, fontSize: 10 } },
      { text: "→ 验证关键内容已渲染", options: { breakLine: true, fontSize: 10 } },
      { text: "→ 禁用动画 → fullPage 截图", options: { breakLine: true, fontSize: 10 } },
      { text: "→ 与基线逐像素比对", options: { fontSize: 10 } },
    ], {
      x: 5.45, y: 1.55, w: 3.8, h: 1.0,
      fontFace: FONT_BODY, color: C.darkText, paraSpaceAfter: 3,
    });

    // 8 page screenshots — 2 rows x 4

    s.addText("8 个页面截图", {
      x: 0.6, y: 2.85, w: 4.0, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: C.purple, bold: true, margin: 0,
    });

    const pages = [
      ["home-page", "首页"],
      ["destinations-page", "目的地列表"],
      ["about-page", "关于页"],
      ["detail-bali", "巴厘岛详情"],
      ["favorites-page", "收藏页"],
      ["trip-planner", "行程规划"],
      ["trip-edit", "行程编辑"],
      ["not-found", "404 页面"],
    ];
    for (let i = 0; i < pages.length; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const xPos = 0.6 + col * 2.35;
      const yPos = 3.3 + row * 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xPos, y: yPos, w: 2.15, h: 0.9,
        fill: { color: C.white }, shadow: mkCardShadow(),
        line: { color: C.purple, width: 0.5 },
      });
      s.addImage({ data: icons.eyeDark, x: xPos + 0.1, y: yPos + 0.15, w: 0.25, h: 0.25 });
      s.addText(pages[i][0], {
        x: xPos + 0.4, y: yPos + 0.05, w: 1.65, h: 0.4,
        fontSize: 9, fontFace: "Consolas", color: C.purple, margin: 0, valign: "middle",
      });
      s.addText(pages[i][1], {
        x: xPos + 0.1, y: yPos + 0.5, w: 1.95, h: 0.35,
        fontSize: 10, fontFace: FONT_BODY, color: C.mutedText, margin: 0,
      });
    }



    addPageNum(s, 6, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 7: 执行环境对比
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    s.addText("执行环境对比", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 28, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });

    // Left: Local
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.2, w: 4.3, h: 3.8,
      fill: { color: C.lightGray }, shadow: mkShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.5, fill: { color: C.accent } });
    addIconCircle(s, icons.desktop, 0.7, 1.25, C.accent, 0.4);
    s.addText("本地开发环境", {
      x: 1.2, y: 1.2, w: 3.3, h: 0.5,
      fontSize: 16, fontFace: FONT_BODY, color: C.white, bold: true, valign: "middle", margin: 0,
    });
    const localItems = [
      ["配置", "playwright.config.ts\nplaywright-ct.config.ts"],
      ["命令", "test:ct / test:e2e / test:visual"],
      ["服务器", "Vite dev (localhost:5173)"],
      ["浏览器", "本地 Chromium (macOS/Win/Linux)"],
      ["并行度", "fullyParallel, workers: auto"],
      ["重试", "0 次"],
      ["认证", "无需"],
    ];
    for (let i = 0; i < localItems.length; i++) {
      const yPos = 1.85 + i * 0.44;
      s.addText(localItems[i][0], {
        x: 0.7, y: yPos, w: 0.8, h: 0.4,
        fontSize: 9, fontFace: FONT_BODY, color: C.accent, bold: true, valign: "top", margin: 0,
      });
      s.addText(localItems[i][1], {
        x: 1.5, y: yPos, w: 3.1, h: 0.4,
        fontSize: 9, fontFace: FONT_BODY, color: C.darkText, valign: "top", margin: 0,
      });
    }

    // Right: Azure
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: 1.2, w: 4.3, h: 3.8,
      fill: { color: C.lightGray }, shadow: mkShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.5, fill: { color: C.deepBlue } });
    addIconCircle(s, icons.cloud, 5.4, 1.25, C.deepBlue, 0.4);
    s.addText("Azure Playwright Workspace", {
      x: 5.9, y: 1.2, w: 3.4, h: 0.5,
      fontSize: 14, fontFace: FONT_BODY, color: C.white, bold: true, valign: "middle", margin: 0,
    });
    const azureItems = [
      ["配置", "playwright.service.config.ts\n(继承主配置 + Azure overlay)"],
      ["命令", "test:azure / test:azure:e2e\ntest:azure:visual"],
      ["服务器", "本地 Vite + exposeNetwork"],
      ["浏览器", "Azure 托管 Linux Chromium"],
      ["并行度", "CI: workers: 10 (最多 50)"],
      ["重试", "CI: 2 次"],
      ["认证", "DefaultAzureCredential\n(Entra ID / az login)"],
    ];
    for (let i = 0; i < azureItems.length; i++) {
      const yPos = 1.85 + i * 0.44;
      s.addText(azureItems[i][0], {
        x: 5.4, y: yPos, w: 0.8, h: 0.4,
        fontSize: 9, fontFace: FONT_BODY, color: C.deepBlue, bold: true, valign: "top", margin: 0,
      });
      s.addText(azureItems[i][1], {
        x: 6.2, y: yPos, w: 3.1, h: 0.4,
        fontSize: 9, fontFace: FONT_BODY, color: C.darkText, valign: "top", margin: 0,
      });
    }

    // Config inheritance note
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 5.15, w: 9.0, h: 0.35,
      fill: { color: C.navy },
    });
    s.addText("⚠ 本地基线截图与 Azure 云端基线不兼容 (OS 字体渲染差异) — 需选择单一环境作为基线来源", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.35,
      fontSize: 10, fontFace: FONT_BODY, color: C.white, valign: "middle",
    });

    addPageNum(s, 7, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 8: CI/CD 流水线
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    s.addText("CI/CD 双流水线", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 28, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });
    s.addText("两条流水线独立并行运行", {
      x: 0.6, y: 0.85, w: 8.8, h: 0.3,
      fontSize: 12, fontFace: FONT_BODY, color: C.mutedText, margin: 0,
    });

    // Trigger
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.5, y: 1.3, w: 3.0, h: 0.5,
      fill: { color: C.navy }, shadow: mkShadow(),
    });
    s.addText("push / PR to main", {
      x: 3.5, y: 1.3, w: 3.0, h: 0.5,
      fontSize: 12, fontFace: FONT_BODY, color: C.white, align: "center", valign: "middle", bold: true,
    });

    // Arrow down left
    s.addShape(pres.shapes.LINE, { x: 4.0, y: 1.8, w: 0, h: 0.4, line: { color: C.mutedText, width: 1.5 } });
    // Arrow down right
    s.addShape(pres.shapes.LINE, { x: 6.0, y: 1.8, w: 0, h: 0.4, line: { color: C.mutedText, width: 1.5 } });

    // Pipeline 1: Test
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 2.3, w: 4.3, h: 2.9,
      fill: { color: C.lightGray }, shadow: mkShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.3, w: 4.3, h: 0.5, fill: { color: C.deepBlue } });
    s.addText("playwright-azure.yml  (测试验证)", {
      x: 0.7, y: 2.3, w: 3.9, h: 0.5,
      fontSize: 13, fontFace: FONT_BODY, color: C.white, bold: true, valign: "middle", margin: 0,
    });
    const testSteps = [
      "1. checkout + setup-node 22",
      "2. npm ci",
      "3. playwright install chromium",
      "4. E2E tests on Azure PT",
      "5. Visual tests on Azure PT",
      "6. Upload artifacts (14 天)",
    ];
    for (let i = 0; i < testSteps.length; i++) {
      const yPos = 2.9 + i * 0.36;
      s.addImage({ data: icons.checkDark, x: 0.7, y: yPos + 0.05, w: 0.2, h: 0.2 });
      s.addText(testSteps[i], {
        x: 1.0, y: yPos, w: 3.6, h: 0.32,
        fontSize: 10, fontFace: FONT_BODY, color: C.darkText, valign: "middle", margin: 0,
      });
    }

    // Pipeline 2: Deploy
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: 2.3, w: 4.3, h: 2.9,
      fill: { color: C.lightGray }, shadow: mkShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.3, w: 4.3, h: 0.5, fill: { color: C.accent } });
    s.addText("deploy.yml  (生产部署)", {
      x: 5.4, y: 2.3, w: 3.9, h: 0.5,
      fontSize: 13, fontFace: FONT_BODY, color: C.white, bold: true, valign: "middle", margin: 0,
    });
    const deploySteps = [
      "1. checkout + setup-node 22",
      "2. npm ci",
      "3. npm run build (tsc + vite)",
      "4. Upload dist/ artifact",
      "5. Deploy to GitHub Pages",
    ];
    for (let i = 0; i < deploySteps.length; i++) {
      const yPos = 2.9 + i * 0.36;
      s.addImage({ data: icons.checkDark, x: 5.4, y: yPos + 0.05, w: 0.2, h: 0.2 });
      s.addText(deploySteps[i], {
        x: 5.7, y: yPos, w: 3.6, h: 0.32,
        fontSize: 10, fontFace: FONT_BODY, color: C.darkText, valign: "middle", margin: 0,
      });
    }

    // Outputs row
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.15, w: 4.3, h: 0.0, line: { color: C.deepBlue, width: 1 } });
    s.addText("→ HTML 报告 + Trace + Azure Portal 仪表板", {
      x: 0.5, y: 5.2, w: 4.3, h: 0.3,
      fontSize: 9, fontFace: FONT_BODY, color: C.deepBlue, align: "center",
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 5.15, w: 4.3, h: 0.0, line: { color: C.accent, width: 1 } });
    s.addText("→ GitHub Pages 线上应用", {
      x: 5.2, y: 5.2, w: 4.3, h: 0.3,
      fontSize: 9, fontFace: FONT_BODY, color: C.accent, align: "center",
    });

    addPageNum(s, 8, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 9: 测试覆盖矩阵
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
    s.addText("测试覆盖矩阵", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.6,
      fontSize: 28, fontFace: FONT_TITLE, color: C.darkText, bold: true, margin: 0,
    });

    const headerRow = [
      { text: "被测对象", options: { fill: { color: C.navy }, color: C.white, bold: true, align: "center", fontSize: 10 } },
      { text: "组件测试 (CT)", options: { fill: { color: C.accent }, color: C.white, bold: true, align: "center", fontSize: 10 } },
      { text: "E2E 测试", options: { fill: { color: C.deepBlue }, color: C.white, bold: true, align: "center", fontSize: 10 } },
      { text: "视觉回归", options: { fill: { color: C.purple }, color: C.white, bold: true, align: "center", fontSize: 10 } },
    ];

    const dataRows = [
      ["Navbar",          "✅", "✅", "✅"],
      ["SearchBar",       "✅", "✅", "✅"],
      ["FilterBar",       "✅", "✅", "✅"],
      ["Carousel",        "✅", "✅", "✅"],
      ["DestinationCard", "✅", "✅", "✅"],
      ["Footer",          "✅", "✅", "✅"],
      ["HomePage",        "—",  "✅", "✅"],
      ["DestinationsPage","—",  "✅", "✅"],
      ["DetailPage",      "—",  "✅", "✅"],
      ["AboutPage",       "—",  "✅", "✅"],
      ["i18n 语言切换",    "—",  "✅", "—"],
      ["用户完整旅程",     "—",  "✅", "—"],
    ];

    const tableData = [headerRow];
    const makeRowCell = (text, isOdd) => ({
      text,
      options: {
        fill: { color: isOdd ? C.lightGray : C.white },
        color: text === "✅" ? C.accent : (text === "—" ? C.mutedText : C.darkText),
        align: "center",
        fontSize: 9,
        fontFace: FONT_BODY,
      },
    });

    for (let i = 0; i < dataRows.length; i++) {
      const isOdd = i % 2 === 1;
      const row = dataRows[i].map((cell, ci) => {
        const opts = {
          fill: { color: isOdd ? C.lightGray : C.white },
          color: cell === "✅" ? "10B981" : (cell === "—" ? C.mutedText : C.darkText),
          align: ci === 0 ? "left" : "center",
          fontSize: 9,
          fontFace: FONT_BODY,
          bold: ci === 0,
        };
        return { text: cell, options: opts };
      });
      tableData.push(row);
    }

    s.addTable(tableData, {
      x: 0.6, y: 1.1, w: 8.8,
      colW: [2.5, 2.1, 2.1, 2.1],
      border: { pt: 0.5, color: "E2E8F0" },
      rowH: 0.3,
      autoPage: false,
    });

    addPageNum(s, 9, TOTAL);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 10: 总结
  // ════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 1.2,
      fill: { color: C.midnight, transparency: 40 },
    });
    s.addText("总结 & 关键数据", {
      x: 0.6, y: 0.3, w: 8.8, h: 0.7,
      fontSize: 30, fontFace: FONT_TITLE, color: C.white, bold: true, margin: 0,
    });

    // Big stat boxes
    const stats = [
      { num: "3", label: "测试层级", sub: "CT + E2E + Visual", color: C.accent },
      { num: "13", label: "测试规格", sub: "6 CT + 6 E2E + 1 Visual", color: C.deepBlue },
      { num: "8", label: "页面截图", sub: "全页 fullPage", color: C.purple },
      { num: "2", label: "执行路径", sub: "本地 + Azure 云端", color: C.coral },
    ];
    for (let i = 0; i < stats.length; i++) {
      const xPos = 0.5 + i * 2.4;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xPos, y: 1.5, w: 2.1, h: 1.6,
        fill: { color: stats[i].color, transparency: 15 },
        shadow: mkShadow(),
      });
      s.addText(stats[i].num, {
        x: xPos, y: 1.55, w: 2.1, h: 0.7,
        fontSize: 42, fontFace: FONT_TITLE, color: C.white, align: "center", valign: "bottom", bold: true,
      });
      s.addText(stats[i].label, {
        x: xPos, y: 2.3, w: 2.1, h: 0.4,
        fontSize: 14, fontFace: FONT_BODY, color: C.ice, align: "center",
      });
      s.addText(stats[i].sub, {
        x: xPos, y: 2.65, w: 2.1, h: 0.35,
        fontSize: 9, fontFace: FONT_BODY, color: C.mutedText, align: "center",
      });
    }

    // Key highlights
    s.addText("亮点特性", {
      x: 0.6, y: 3.3, w: 8.8, h: 0.35,
      fontSize: 16, fontFace: FONT_BODY, color: C.ice, bold: true, margin: 0,
    });

    const highlights = [
      ["三层金字塔", "从组件隔离 → 端到端 → 像素级视觉，逐层递进"],
      ["双环境执行", "本地快速验证 + Azure 云端 CI 大规模并行"],
      ["VLM 可选增强", "AI 语义级视觉审查，超越像素比对"],
      ["CI/CD 集成", "GitHub Actions 双流水线，push 自动触发"],
    ];
    for (let i = 0; i < highlights.length; i++) {
      const yPos = 3.7 + i * 0.38;
      s.addImage({ data: icons.star, x: 0.6, y: yPos + 0.05, w: 0.22, h: 0.22 });
      s.addText(highlights[i][0], {
        x: 0.9, y: yPos, w: 1.6, h: 0.33,
        fontSize: 12, fontFace: FONT_BODY, color: C.white, bold: true, valign: "middle", margin: 0,
      });
      s.addText(highlights[i][1], {
        x: 2.5, y: yPos, w: 7.0, h: 0.33,
        fontSize: 11, fontFace: FONT_BODY, color: C.ice, valign: "middle", margin: 0,
      });
    }

    s.addText("TravelVista UI 自动化测试架构 · 2026", {
      x: 0.6, y: 5.2, w: 8.8, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, color: C.mutedText, align: "center",
    });
  }

  // Write file
  const outPath = "./docs/presentations/UI-Test-Workflow.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log(`✅ PPT generated: ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
