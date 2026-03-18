/**
 * TravelVista 项目技术概览 PPT 生成脚本
 * 面向技术负责人的项目介绍演示文稿
 */
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// react-icons
const { FaReact, FaGithub, FaGlobe, FaLayerGroup, FaCheckCircle, FaCloud, FaCode, FaShieldAlt } = require("react-icons/fa");
const { SiTypescript, SiVite, SiTailwindcss } = require("react-icons/si");
const { BiTestTube } = require("react-icons/bi");
const { MdLanguage, MdDevices, MdBugReport, MdDashboard, MdTimeline, MdArchitecture } = require("react-icons/md");
const { HiOutlinePhotograph, HiOutlineEye } = require("react-icons/hi");

// ── Color Palette (Ocean Gradient aligned with TravelVista blue-green theme) ──
const C = {
  navy:       "0F2A4A",
  deepBlue:   "1E3A5F",
  blue:       "1E40AF",
  teal:       "0D9488",
  emerald:    "059669",
  skyBg:      "F0F9FF",
  white:      "FFFFFF",
  offWhite:   "F8FAFC",
  slate700:   "334155",
  slate500:   "64748B",
  slate300:   "CBD5E1",
  lightBlue:  "DBEAFE",
  lightTeal:  "CCFBF1",
  accent:     "F59E0B",
  coral:      "F97316",
};

// ── Typography ──
const FONT = { head: "Georgia", body: "Calibri" };

// ── Icon renderer ──
function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}
async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, "#" + color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ── Helper: shadow factory (never reuse objects) ──
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10 });
const makeCardShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12 });

// ── Helper: add a card rectangle ──
function addCard(slide, pres, x, y, w, h, fillColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: fillColor || C.white },
    shadow: makeCardShadow(),
  });
}

// ── Helper: add icon in a colored circle ──
function addIconCircle(slide, iconData, x, y, circleColor, circleSize) {
  const sz = circleSize || 0.6;
  slide.addShape(slide._slideLayout ? slide._slideLayout : undefined, {});
  // Just add the icon image directly – circle effect via rounding
  slide.addImage({
    data: iconData,
    x: x + 0.05, y: y + 0.05,
    w: sz - 0.1, h: sz - 0.1,
  });
}

// ── Main ──
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "TravelVista Team";
  pres.title = "TravelVista 项目技术概览";

  // Pre-render all icons
  const icons = {};
  const iconDefs = [
    ["react", FaReact, C.blue],
    ["typescript", SiTypescript, C.blue],
    ["vite", SiVite, C.teal],
    ["tailwind", SiTailwindcss, C.teal],
    ["playwright", BiTestTube, C.emerald],
    ["globe", FaGlobe, C.white],
    ["layer", FaLayerGroup, C.white],
    ["check", FaCheckCircle, C.emerald],
    ["cloud", FaCloud, C.blue],
    ["code", FaCode, C.white],
    ["shield", FaShieldAlt, C.white],
    ["github", FaGithub, C.white],
    ["language", MdLanguage, C.white],
    ["devices", MdDevices, C.white],
    ["bug", MdBugReport, C.white],
    ["dashboard", MdDashboard, C.white],
    ["timeline", MdTimeline, C.white],
    ["arch", MdArchitecture, C.white],
    ["photo", HiOutlinePhotograph, C.white],
    ["eye", HiOutlineEye, C.white],
    // dark variants for light backgrounds
    ["react_dark", FaReact, C.blue],
    ["typescript_dark", SiTypescript, C.blue],
    ["vite_dark", SiVite, "8B5CF6"],
    ["tailwind_dark", SiTailwindcss, C.teal],
    ["playwright_dark", BiTestTube, C.emerald],
    ["globe_dark", FaGlobe, C.blue],
    ["layer_dark", FaLayerGroup, C.blue],
    ["cloud_dark", FaCloud, C.blue],
    ["code_dark", FaCode, C.slate700],
    ["shield_dark", FaShieldAlt, C.teal],
    ["github_dark", FaGithub, C.slate700],
    ["language_dark", MdLanguage, C.teal],
    ["devices_dark", MdDevices, C.blue],
    ["bug_dark", MdBugReport, C.coral],
    ["dashboard_dark", MdDashboard, C.blue],
    ["timeline_dark", MdTimeline, C.blue],
    ["arch_dark", MdArchitecture, C.deepBlue],
    ["check_dark", FaCheckCircle, C.emerald],
    ["photo_dark", HiOutlinePhotograph, C.blue],
    ["eye_dark", HiOutlineEye, C.teal],
  ];
  for (const [key, Comp, color] of iconDefs) {
    icons[key] = await iconToBase64Png(Comp, color);
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 1 — Title Slide (dark navy background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    // Decorative accent bar at top
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal },
    });

    // Small icon row at top
    const topIcons = ["react", "typescript", "vite", "tailwind", "playwright"];
    const iconStartX = 3.0;
    for (let i = 0; i < topIcons.length; i++) {
      slide.addImage({
        data: icons[topIcons[i]],
        x: iconStartX + i * 0.85, y: 0.5, w: 0.45, h: 0.45,
      });
    }

    // Main title
    slide.addText("TravelVista", {
      x: 0.8, y: 1.5, w: 8.4, h: 1.0,
      fontSize: 48, fontFace: FONT.head, color: C.white, bold: true,
      align: "center",
    });

    // Subtitle
    slide.addText("项目技术概览", {
      x: 0.8, y: 2.4, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT.head, color: C.teal,
      align: "center", charSpacing: 4,
    });

    // Tagline
    slide.addText("React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Playwright", {
      x: 0.8, y: 3.3, w: 8.4, h: 0.45,
      fontSize: 14, fontFace: FONT.body, color: C.slate300,
      align: "center",
    });

    // Divider line
    slide.addShape(pres.shapes.LINE, {
      x: 3.5, y: 4.0, w: 3.0, h: 0,
      line: { color: C.teal, width: 1.5 },
    });

    // Presenter info
    slide.addText("面向技术负责人", {
      x: 0.8, y: 4.3, w: 8.4, h: 0.4,
      fontSize: 14, fontFace: FONT.body, color: C.slate500, align: "center",
    });
    slide.addText("2026 年 3 月", {
      x: 0.8, y: 4.65, w: 8.4, h: 0.35,
      fontSize: 12, fontFace: FONT.body, color: C.slate500, align: "center",
    });

    // GitHub link at bottom
    slide.addImage({ data: icons.github, x: 3.7, y: 5.05, w: 0.3, h: 0.3 });
    slide.addText("github.com/nickhou1983/UI-test-Demo", {
      x: 4.1, y: 5.05, w: 3.5, h: 0.3,
      fontSize: 11, fontFace: FONT.body, color: C.slate300,
      hyperlink: { url: "https://github.com/nickhou1983/UI-test-Demo" },
    });
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 2 — 议程 / Agenda (light background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    // Title
    slide.addText("议程", {
      x: 0.6, y: 0.3, w: 5, h: 0.7,
      fontSize: 32, fontFace: FONT.head, color: C.deepBlue, bold: true,
    });

    // Teal accent line under title
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.95, w: 1.2, h: 0.04, fill: { color: C.teal },
    });

    const items = [
      { num: "01", title: "项目概览", desc: "产品定位、目标用户与线上地址", icon: "globe_dark" },
      { num: "02", title: "技术架构", desc: "核心技术栈、构建工具与项目结构", icon: "arch_dark" },
      { num: "03", title: "功能亮点", desc: "路由设计、组件体系与国际化", icon: "code_dark" },
      { num: "04", title: "自动化测试体系", desc: "三层测试金字塔：组件 / E2E / 视觉回归", icon: "layer_dark" },
      { num: "05", title: "CI/CD 与云端执行", desc: "GitHub Actions + Azure Playwright Workspace", icon: "cloud_dark" },
      { num: "06", title: "质量保障总结", desc: "覆盖矩阵与下一步计划", icon: "check_dark" },
    ];

    const startY = 1.4;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const yPos = startY + i * 0.65;

      // Number circle
      slide.addShape(pres.shapes.OVAL, {
        x: 0.8, y: yPos + 0.05, w: 0.42, h: 0.42,
        fill: { color: C.deepBlue },
      });
      slide.addText(item.num, {
        x: 0.8, y: yPos + 0.05, w: 0.42, h: 0.42,
        fontSize: 12, fontFace: FONT.body, color: C.white, bold: true,
        align: "center", valign: "middle",
      });

      // Icon
      slide.addImage({ data: icons[item.icon], x: 1.45, y: yPos + 0.06, w: 0.36, h: 0.36 });

      // Title and description
      slide.addText(item.title, {
        x: 2.0, y: yPos, w: 4, h: 0.3,
        fontSize: 16, fontFace: FONT.body, color: C.slate700, bold: true,
      });
      slide.addText(item.desc, {
        x: 2.0, y: yPos + 0.28, w: 5, h: 0.25,
        fontSize: 12, fontFace: FONT.body, color: C.slate500,
      });
    }

    // Right side decorative shape
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 7.8, y: 0, w: 2.2, h: 5.625,
      fill: { color: C.deepBlue },
    });
    // Decorative icons on dark side
    const decoIcons = ["globe", "layer", "code", "shield", "cloud"];
    for (let i = 0; i < decoIcons.length; i++) {
      slide.addImage({
        data: icons[decoIcons[i]],
        x: 8.5, y: 0.6 + i * 0.95, w: 0.55, h: 0.55,
      });
    }
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 3 — 项目概览 (dark background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    // Section number + title
    slide.addText("01", {
      x: 0.6, y: 0.25, w: 0.7, h: 0.5,
      fontSize: 24, fontFace: FONT.head, color: C.teal, bold: true,
    });
    slide.addText("项目概览", {
      x: 1.3, y: 0.25, w: 4, h: 0.5,
      fontSize: 28, fontFace: FONT.head, color: C.white, bold: true,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.75, w: 2.0, h: 0.03, fill: { color: C.teal },
    });

    // Left column: project info cards
    const infoCards = [
      { label: "项目名称", value: "TravelVista", icon: "globe" },
      { label: "项目类型", value: "React 单页应用 (SPA)", icon: "react" },
      { label: "目标用户", value: "旅游爱好者、行程规划者", icon: "devices" },
      { label: "默认语言", value: "中文，支持运行时切换英文", icon: "language" },
    ];

    for (let i = 0; i < infoCards.length; i++) {
      const card = infoCards[i];
      const yPos = 1.1 + i * 0.9;

      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y: yPos, w: 4.3, h: 0.72,
        fill: { color: C.deepBlue },
        shadow: makeShadow(),
      });
      slide.addImage({ data: icons[card.icon], x: 0.8, y: yPos + 0.13, w: 0.42, h: 0.42 });
      slide.addText(card.label, {
        x: 1.4, y: yPos + 0.05, w: 3.2, h: 0.3,
        fontSize: 11, fontFace: FONT.body, color: C.slate300,
      });
      slide.addText(card.value, {
        x: 1.4, y: yPos + 0.32, w: 3.2, h: 0.3,
        fontSize: 14, fontFace: FONT.body, color: C.white, bold: true,
      });
    }

    // Right column: key stats
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: 1.1, w: 4.2, h: 3.85,
      fill: { color: C.deepBlue },
      shadow: makeShadow(),
    });
    slide.addText("关键指标", {
      x: 5.6, y: 1.2, w: 3.6, h: 0.4,
      fontSize: 16, fontFace: FONT.body, color: C.teal, bold: true,
    });

    const stats = [
      { num: "12", label: "热门目的地" },
      { num: "6", label: "覆盖地区" },
      { num: "4", label: "旅行类型" },
      { num: "2", label: "支持语言" },
      { num: "4", label: "核心页面" },
    ];
    for (let i = 0; i < stats.length; i++) {
      const s = stats[i];
      const yPos = 1.72 + i * 0.6;

      slide.addText(s.num, {
        x: 5.8, y: yPos, w: 1.0, h: 0.45,
        fontSize: 32, fontFace: FONT.head, color: C.accent, bold: true,
        align: "center", valign: "middle",
      });
      slide.addText(s.label, {
        x: 6.8, y: yPos, w: 2.4, h: 0.45,
        fontSize: 14, fontFace: FONT.body, color: C.white,
        valign: "middle",
      });
      if (i < stats.length - 1) {
        slide.addShape(pres.shapes.LINE, {
          x: 5.8, y: yPos + 0.52, w: 3.2, h: 0,
          line: { color: C.slate700, width: 0.5 },
        });
      }
    }

    // Online URL at bottom
    slide.addImage({ data: icons.globe, x: 0.6, y: 5.05, w: 0.25, h: 0.25 });
    slide.addText("nickhou1983.github.io/UI-test-Demo", {
      x: 0.95, y: 5.05, w: 4.0, h: 0.25,
      fontSize: 11, fontFace: FONT.body, color: C.teal,
      hyperlink: { url: "https://nickhou1983.github.io/UI-test-Demo/" },
    });
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 4 — 技术架构 (light background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addText("02", {
      x: 0.6, y: 0.25, w: 0.7, h: 0.5,
      fontSize: 24, fontFace: FONT.head, color: C.teal, bold: true,
    });
    slide.addText("技术架构", {
      x: 1.3, y: 0.25, w: 4, h: 0.5,
      fontSize: 28, fontFace: FONT.head, color: C.deepBlue, bold: true,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.75, w: 2.0, h: 0.03, fill: { color: C.teal },
    });

    // Tech stack cards in 2x3 grid
    const techStack = [
      { name: "React 19", desc: "UI 框架 · Hooks + Router 7", icon: "react_dark", bg: C.lightBlue },
      { name: "TypeScript 5.9", desc: "类型安全 · 严格模式", icon: "typescript_dark", bg: C.lightBlue },
      { name: "Vite 8", desc: "构建工具 · HMR 开发服务器", icon: "vite_dark", bg: "F3E8FF" },
      { name: "Tailwind CSS 4", desc: "Utility-first · PostCSS", icon: "tailwind_dark", bg: C.lightTeal },
      { name: "Playwright 1.58", desc: "三层自动化测试框架", icon: "playwright_dark", bg: C.lightTeal },
      { name: "GitHub Actions", desc: "CI/CD + GitHub Pages 部署", icon: "github_dark", bg: "F1F5F9" },
    ];

    const colW = 2.7, colGap = 0.3, rowH = 1.5, rowGap = 0.25;
    const gridStartX = 0.6, gridStartY = 1.1;

    for (let i = 0; i < techStack.length; i++) {
      const tech = techStack[i];
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cx = gridStartX + col * (colW + colGap);
      const cy = gridStartY + row * (rowH + rowGap);

      // Card background
      addCard(slide, pres, cx, cy, colW, rowH, tech.bg);

      // Teal left accent
      slide.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: cy, w: 0.06, h: rowH, fill: { color: C.teal },
      });

      // Icon
      slide.addImage({ data: icons[tech.icon], x: cx + 0.25, y: cy + 0.3, w: 0.55, h: 0.55 });

      // Title
      slide.addText(tech.name, {
        x: cx + 0.9, y: cy + 0.25, w: 1.6, h: 0.35,
        fontSize: 14, fontFace: FONT.body, color: C.slate700, bold: true,
      });

      // Description
      slide.addText(tech.desc, {
        x: cx + 0.9, y: cy + 0.6, w: 1.6, h: 0.65,
        fontSize: 11, fontFace: FONT.body, color: C.slate500,
      });
    }

    // Bottom section: project structure overview
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 3.65, w: 8.8, h: 1.7,
      fill: { color: C.white },
      shadow: makeCardShadow(),
    });
    slide.addText("项目目录结构（核心）", {
      x: 0.9, y: 3.75, w: 4, h: 0.35,
      fontSize: 14, fontFace: FONT.body, color: C.deepBlue, bold: true,
    });

    const dirItems = [
      "src/pages/        4 个页面组件 (Home / Destinations / Detail / About)",
      "src/components/   10 个公共组件 (Navbar / Footer / FilterBar / Carousel …)",
      "src/i18n/         中英文翻译文件 (zh.json / en.json，200+ 条目)",
      "src/data/         静态数据 (12 目的地 / 4 分类 / 3 评价 / 4 团队成员)",
      "tests/            component / e2e / visual 三层测试代码",
    ];
    slide.addText(
      dirItems.map((t, i) => ({
        text: t,
        options: { bullet: true, breakLine: i < dirItems.length - 1, fontSize: 11, fontFace: "Consolas", color: C.slate700 },
      })),
      { x: 0.9, y: 4.1, w: 8.2, h: 1.15, paraSpaceAfter: 2 }
    );
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 5 — 功能亮点 (dark background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("03", {
      x: 0.6, y: 0.25, w: 0.7, h: 0.5,
      fontSize: 24, fontFace: FONT.head, color: C.teal, bold: true,
    });
    slide.addText("功能亮点", {
      x: 1.3, y: 0.25, w: 4, h: 0.5,
      fontSize: 28, fontFace: FONT.head, color: C.white, bold: true,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.75, w: 2.0, h: 0.03, fill: { color: C.teal },
    });

    // Route architecture (left half)
    slide.addText("路由架构", {
      x: 0.6, y: 1.05, w: 4.3, h: 0.35,
      fontSize: 16, fontFace: FONT.body, color: C.teal, bold: true,
    });

    const routes = [
      { path: "/", page: "HomePage", desc: "Hero + 热门目的地 + 分类 + 评价轮播" },
      { path: "/destinations", page: "DestinationsPage", desc: "搜索/地区/类型三重筛选 + 12 卡片" },
      { path: "/destinations/:id", page: "DetailPage", desc: "画廊 + 景点 + 侧边栏实用信息" },
      { path: "/about", page: "AboutPage", desc: "使命 + 价值观 + 团队 + 联系" },
    ];

    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      const yPos = 1.5 + i * 0.82;

      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y: yPos, w: 4.3, h: 0.68,
        fill: { color: C.deepBlue },
        shadow: makeShadow(),
      });
      // Path badge
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.75, y: yPos + 0.12, w: 1.6, h: 0.22,
        fill: { color: C.teal },
      });
      slide.addText(r.path, {
        x: 0.75, y: yPos + 0.1, w: 1.6, h: 0.26,
        fontSize: 10, fontFace: "Consolas", color: C.white, align: "center", valign: "middle",
      });
      slide.addText(r.page, {
        x: 2.5, y: yPos + 0.06, w: 2.2, h: 0.25,
        fontSize: 12, fontFace: FONT.body, color: C.white, bold: true,
      });
      slide.addText(r.desc, {
        x: 2.5, y: yPos + 0.33, w: 2.2, h: 0.28,
        fontSize: 10, fontFace: FONT.body, color: C.slate300,
      });
    }

    // Right half: feature highlights
    slide.addText("核心特性", {
      x: 5.3, y: 1.05, w: 4.2, h: 0.35,
      fontSize: 16, fontFace: FONT.body, color: C.teal, bold: true,
    });

    const features = [
      { title: "响应式设计", desc: "Mobile / Tablet / Desktop\n三断点自适应布局", icon: "devices" },
      { title: "国际化 (i18n)", desc: "运行时中英切换\n200+ 翻译键，无需刷新", icon: "language" },
      { title: "高级筛选", desc: "关键词 + 地区 + 类型\nAND 组合 + URL 参数联动", icon: "dashboard" },
      { title: "组件化架构", desc: "10 个可复用组件\nProps 驱动 + 关注点分离", icon: "code" },
    ];

    for (let i = 0; i < features.length; i++) {
      const f = features[i];
      const yPos = 1.5 + i * 0.82;

      slide.addShape(pres.shapes.RECTANGLE, {
        x: 5.3, y: yPos, w: 4.2, h: 0.68,
        fill: { color: C.deepBlue },
        shadow: makeShadow(),
      });

      // Icon circle background
      slide.addShape(pres.shapes.OVAL, {
        x: 5.5, y: yPos + 0.1, w: 0.48, h: 0.48,
        fill: { color: C.teal },
      });
      slide.addImage({ data: icons[f.icon], x: 5.56, y: yPos + 0.15, w: 0.36, h: 0.36 });

      slide.addText(f.title, {
        x: 6.15, y: yPos + 0.05, w: 3.1, h: 0.25,
        fontSize: 13, fontFace: FONT.body, color: C.white, bold: true,
      });
      slide.addText(f.desc, {
        x: 6.15, y: yPos + 0.3, w: 3.1, h: 0.32,
        fontSize: 10, fontFace: FONT.body, color: C.slate300, lineSpacingMultiple: 1.0,
      });
    }

    // Bottom banner
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.9, w: 8.8, h: 0.45,
      fill: { color: C.teal, transparency: 20 },
    });
    slide.addText("所有路由共享 Layout 包装 (Navbar + Outlet + Footer)  ·  BrowserRouter 驱动  ·  base: /UI-test-Demo/", {
      x: 0.8, y: 4.9, w: 8.4, h: 0.45,
      fontSize: 11, fontFace: FONT.body, color: C.white, align: "center", valign: "middle",
    });
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 6 — 自动化测试体系 (light background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addText("04", {
      x: 0.6, y: 0.25, w: 0.7, h: 0.5,
      fontSize: 24, fontFace: FONT.head, color: C.teal, bold: true,
    });
    slide.addText("自动化测试体系", {
      x: 1.3, y: 0.25, w: 5, h: 0.5,
      fontSize: 28, fontFace: FONT.head, color: C.deepBlue, bold: true,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.75, w: 2.0, h: 0.03, fill: { color: C.teal },
    });

    // Test Pyramid (left side)
    slide.addText("三层测试金字塔", {
      x: 0.6, y: 1.05, w: 4.0, h: 0.35,
      fontSize: 14, fontFace: FONT.body, color: C.deepBlue, bold: true,
    });

    // Pyramid visualization
    // Top layer: Visual
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.8, y: 1.5, w: 2.2, h: 0.7,
      fill: { color: "ECFDF5" },
      shadow: makeCardShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.8, y: 1.5, w: 0.05, h: 0.7, fill: { color: C.emerald },
    });
    slide.addText([
      { text: "Visual Regression", options: { bold: true, fontSize: 11, breakLine: true, color: C.emerald } },
      { text: "1 spec · 8 截图", options: { fontSize: 9, color: C.slate500 } },
    ], { x: 1.95, y: 1.52, w: 1.9, h: 0.65, margin: 0 });

    // Middle layer: E2E
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.2, y: 2.35, w: 3.4, h: 0.7,
      fill: { color: C.lightBlue },
      shadow: makeCardShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.2, y: 2.35, w: 0.05, h: 0.7, fill: { color: C.blue },
    });
    slide.addText([
      { text: "E2E 端到端测试", options: { bold: true, fontSize: 11, breakLine: true, color: C.blue } },
      { text: "6 specs · 页面 + 用户旅程", options: { fontSize: 9, color: C.slate500 } },
    ], { x: 1.35, y: 2.37, w: 3.1, h: 0.65, margin: 0 });

    // Bottom layer: Component
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 3.2, w: 4.6, h: 0.7,
      fill: { color: C.lightTeal },
      shadow: makeCardShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 3.2, w: 0.05, h: 0.7, fill: { color: C.teal },
    });
    slide.addText([
      { text: "Component Testing (CT)", options: { bold: true, fontSize: 11, breakLine: true, color: C.teal } },
      { text: "6 specs · 隔离组件单元测试", options: { fontSize: 9, color: C.slate500 } },
    ], { x: 0.75, y: 3.22, w: 4.3, h: 0.65, margin: 0 });

    // Right side: detail cards
    const testLayers = [
      {
        title: "组件测试 (CT)",
        tool: "@playwright/experimental-ct-react",
        cmd: "npm run test:ct",
        specs: "Navbar · SearchBar · FilterBar · Carousel · DestinationCard · Footer",
        color: C.teal,
      },
      {
        title: "E2E 端到端测试",
        tool: "@playwright/test",
        cmd: "npm run test:e2e",
        specs: "home · destinations · detail · about · navigation · user-journey",
        color: C.blue,
      },
      {
        title: "视觉回归测试",
        tool: "Playwright Screenshot + 像素比对",
        cmd: "npm run test:visual",
        specs: "8 页面截图 · maxDiffPixelRatio: 0.01 · animations: disabled",
        color: C.emerald,
      },
    ];

    for (let i = 0; i < testLayers.length; i++) {
      const t = testLayers[i];
      const yPos = 1.1 + i * 1.08;

      slide.addShape(pres.shapes.RECTANGLE, {
        x: 5.5, y: yPos, w: 4.0, h: 0.95,
        fill: { color: C.white },
        shadow: makeCardShadow(),
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 5.5, y: yPos, w: 0.06, h: 0.95, fill: { color: t.color },
      });

      slide.addText(t.title, {
        x: 5.7, y: yPos + 0.05, w: 3.6, h: 0.22,
        fontSize: 12, fontFace: FONT.body, color: C.slate700, bold: true,
      });
      slide.addText(t.tool, {
        x: 5.7, y: yPos + 0.27, w: 3.6, h: 0.2,
        fontSize: 9, fontFace: "Consolas", color: C.slate500,
      });
      slide.addText(t.cmd, {
        x: 5.7, y: yPos + 0.46, w: 3.6, h: 0.2,
        fontSize: 9, fontFace: "Consolas", color: C.teal,
      });
      slide.addText(t.specs, {
        x: 5.7, y: yPos + 0.65, w: 3.6, h: 0.25,
        fontSize: 9, fontFace: FONT.body, color: C.slate500,
      });
    }

    // Bottom: total test count
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.2, w: 4.6, h: 1.1,
      fill: { color: C.white },
      shadow: makeCardShadow(),
    });
    slide.addText("总测试规模", {
      x: 0.8, y: 4.25, w: 2.0, h: 0.3,
      fontSize: 12, fontFace: FONT.body, color: C.deepBlue, bold: true,
    });

    const totals = [
      { num: "13", label: "Spec 文件" },
      { num: "8", label: "视觉截图" },
      { num: "3", label: "测试层级" },
    ];
    for (let i = 0; i < totals.length; i++) {
      const cx = 0.8 + i * 1.5;
      slide.addText(totals[i].num, {
        x: cx, y: 4.55, w: 1.2, h: 0.35,
        fontSize: 28, fontFace: FONT.head, color: C.teal, bold: true, align: "center",
      });
      slide.addText(totals[i].label, {
        x: cx, y: 4.88, w: 1.2, h: 0.25,
        fontSize: 10, fontFace: FONT.body, color: C.slate500, align: "center",
      });
    }
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 7 — CI/CD & Azure Cloud (dark background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("05", {
      x: 0.6, y: 0.25, w: 0.7, h: 0.5,
      fontSize: 24, fontFace: FONT.head, color: C.teal, bold: true,
    });
    slide.addText("CI/CD 与云端执行", {
      x: 1.3, y: 0.25, w: 5, h: 0.5,
      fontSize: 28, fontFace: FONT.head, color: C.white, bold: true,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.75, w: 2.0, h: 0.03, fill: { color: C.teal },
    });

    // Left: CI/CD Pipeline
    slide.addText("GitHub Actions 流水线", {
      x: 0.6, y: 1.1, w: 4.3, h: 0.35,
      fontSize: 15, fontFace: FONT.body, color: C.teal, bold: true,
    });

    const pipelineSteps = [
      { step: "1", label: "代码推送 / PR", desc: "push main · PR → main · 手动触发" },
      { step: "2", label: "环境准备", desc: "Node 22 + npm ci + 安装 Chromium" },
      { step: "3", label: "E2E 云端测试", desc: "Azure PT · playwright.service.config" },
      { step: "4", label: "视觉回归云端测试", desc: "Azure PT · 像素比对 · 失败即阻断" },
      { step: "5", label: "产物上传", desc: "HTML 报告 + trace + 截图（14 天保留）" },
    ];

    for (let i = 0; i < pipelineSteps.length; i++) {
      const p = pipelineSteps[i];
      const yPos = 1.55 + i * 0.62;

      // Step circle
      slide.addShape(pres.shapes.OVAL, {
        x: 0.7, y: yPos + 0.06, w: 0.36, h: 0.36,
        fill: { color: C.teal },
      });
      slide.addText(p.step, {
        x: 0.7, y: yPos + 0.06, w: 0.36, h: 0.36,
        fontSize: 12, fontFace: FONT.body, color: C.white, bold: true,
        align: "center", valign: "middle",
      });

      // Connecting line (except last)
      if (i < pipelineSteps.length - 1) {
        slide.addShape(pres.shapes.LINE, {
          x: 0.88, y: yPos + 0.42, w: 0, h: 0.26,
          line: { color: C.teal, width: 1.5 },
        });
      }

      slide.addText(p.label, {
        x: 1.2, y: yPos, w: 3.4, h: 0.25,
        fontSize: 12, fontFace: FONT.body, color: C.white, bold: true,
      });
      slide.addText(p.desc, {
        x: 1.2, y: yPos + 0.25, w: 3.4, h: 0.22,
        fontSize: 10, fontFace: FONT.body, color: C.slate300,
      });
    }

    // Right: Azure Playwright Workspace
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: 1.1, w: 4.2, h: 4.2,
      fill: { color: C.deepBlue },
      shadow: makeShadow(),
    });
    slide.addText("Azure Playwright Workspace", {
      x: 5.5, y: 1.2, w: 3.8, h: 0.35,
      fontSize: 15, fontFace: FONT.body, color: C.teal, bold: true,
    });

    const azureFeatures = [
      { label: "浏览器环境", value: "Linux Chromium（云端托管）" },
      { label: "并行执行", value: "最多 10 workers · CI 状态下 50 并行" },
      { label: "认证方式", value: "DefaultAzureCredential (Entra ID)" },
      { label: "网络模式", value: 'exposeNetwork: "<loopback>"' },
      { label: "自动重试", value: "CI 环境 2 次重试" },
      { label: "报告输出", value: "HTML + Azure Portal 仪表板" },
      { label: "Trace", value: "首次重试时自动捕获 · Portal 在线查看" },
    ];

    for (let i = 0; i < azureFeatures.length; i++) {
      const f = azureFeatures[i];
      const yPos = 1.7 + i * 0.47;

      slide.addImage({ data: icons.check, x: 5.55, y: yPos + 0.04, w: 0.22, h: 0.22 });
      slide.addText(f.label, {
        x: 5.85, y: yPos, w: 1.4, h: 0.22,
        fontSize: 10, fontFace: FONT.body, color: C.slate300,
      });
      slide.addText(f.value, {
        x: 5.85, y: yPos + 0.2, w: 3.4, h: 0.22,
        fontSize: 10, fontFace: FONT.body, color: C.white, bold: true,
      });
    }

    // Config inheritance diagram at bottom of Azure card
    slide.addText("配置继承关系", {
      x: 5.55, y: 4.55, w: 3.8, h: 0.25,
      fontSize: 10, fontFace: FONT.body, color: C.accent, bold: true,
    });
    slide.addText("playwright.config.ts → playwright.service.config.ts (Azure 叠加层)", {
      x: 5.55, y: 4.78, w: 3.8, h: 0.35,
      fontSize: 9, fontFace: "Consolas", color: C.slate300,
    });
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 8 — 质量保障覆盖矩阵 (light background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addText("06", {
      x: 0.6, y: 0.25, w: 0.7, h: 0.5,
      fontSize: 24, fontFace: FONT.head, color: C.teal, bold: true,
    });
    slide.addText("质量保障总结", {
      x: 1.3, y: 0.25, w: 5, h: 0.5,
      fontSize: 28, fontFace: FONT.head, color: C.deepBlue, bold: true,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 0.75, w: 2.0, h: 0.03, fill: { color: C.teal },
    });

    // Coverage matrix table
    slide.addText("测试覆盖矩阵", {
      x: 0.6, y: 1.0, w: 4, h: 0.3,
      fontSize: 14, fontFace: FONT.body, color: C.deepBlue, bold: true,
    });

    const headerOpts = {
      fill: { color: C.deepBlue },
      color: C.white,
      bold: true,
      fontSize: 10,
      fontFace: FONT.body,
      align: "center",
      valign: "middle",
    };
    const cellOpts = {
      fontSize: 10,
      fontFace: FONT.body,
      color: C.slate700,
      align: "center",
      valign: "middle",
      border: { pt: 0.5, color: C.slate300 },
    };
    const cellLeftOpts = { ...cellOpts, align: "left" };

    const rows = [
      [
        { text: "测试对象", options: headerOpts },
        { text: "组件测试", options: headerOpts },
        { text: "E2E 测试", options: headerOpts },
        { text: "视觉回归", options: headerOpts },
      ],
      [
        { text: "  Navbar", options: { ...cellLeftOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "—", options: { ...cellOpts, fill: { color: C.white } } },
      ],
      [
        { text: "  SearchBar", options: { ...cellLeftOpts, fill: { color: "F8FAFC" } } },
        { text: "✅", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "✅", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "—", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
      ],
      [
        { text: "  FilterBar", options: { ...cellLeftOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "—", options: { ...cellOpts, fill: { color: C.white } } },
      ],
      [
        { text: "  HomePage", options: { ...cellLeftOpts, fill: { color: "F8FAFC" } } },
        { text: "—", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "✅", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "✅", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
      ],
      [
        { text: "  DestinationsPage", options: { ...cellLeftOpts, fill: { color: C.white } } },
        { text: "—", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
      ],
      [
        { text: "  DetailPage (Bali)", options: { ...cellLeftOpts, fill: { color: "F8FAFC" } } },
        { text: "—", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "✅", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "✅", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
      ],
      [
        { text: "  AboutPage", options: { ...cellLeftOpts, fill: { color: C.white } } },
        { text: "—", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
      ],
      [
        { text: "  i18n 语言切换", options: { ...cellLeftOpts, fill: { color: "F8FAFC" } } },
        { text: "—", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "✅", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
        { text: "—", options: { ...cellOpts, fill: { color: "F8FAFC" } } },
      ],
      [
        { text: "  用户旅程", options: { ...cellLeftOpts, fill: { color: C.white } } },
        { text: "—", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "✅", options: { ...cellOpts, fill: { color: C.white } } },
        { text: "—", options: { ...cellOpts, fill: { color: C.white } } },
      ],
    ];

    slide.addTable(rows, {
      x: 0.6, y: 1.35, w: 5.5,
      colW: [1.8, 1.2, 1.2, 1.3],
      rowH: 0.32,
      border: { pt: 0.5, color: C.slate300 },
    });

    // Right side: highlights
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 6.4, y: 1.0, w: 3.2, h: 4.3,
      fill: { color: C.white },
      shadow: makeCardShadow(),
    });
    slide.addText("亮点与优势", {
      x: 6.6, y: 1.1, w: 2.8, h: 0.35,
      fontSize: 14, fontFace: FONT.body, color: C.deepBlue, bold: true,
    });

    const highlights = [
      { icon: "check_dark", text: "Playwright 统一测试\n框架，3 层复用基础设施" },
      { icon: "shield_dark", text: "视觉回归 1% 阈值\n动画禁用确保稳定性" },
      { icon: "cloud_dark", text: "Azure 云端浏览器\n与本地环境互补" },
      { icon: "timeline_dark", text: "CI 自动化\n每次推送自动验证" },
      { icon: "eye_dark", text: "VLM 语义审查\n可选 AI 增强视觉验收" },
    ];

    for (let i = 0; i < highlights.length; i++) {
      const h = highlights[i];
      const yPos = 1.55 + i * 0.72;

      slide.addImage({ data: icons[h.icon], x: 6.6, y: yPos + 0.02, w: 0.32, h: 0.32 });
      slide.addText(h.text, {
        x: 7.0, y: yPos, w: 2.35, h: 0.6,
        fontSize: 11, fontFace: FONT.body, color: C.slate700, lineSpacingMultiple: 1.1,
      });
    }
  }

  // ════════════════════════════════════════════════════════════════
  // SLIDE 9 — Thank You / 结束页 (dark background)
  // ════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    // Decorative teal bar top
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal },
    });

    // Centered content
    slide.addText("Thank You", {
      x: 0.8, y: 1.2, w: 8.4, h: 0.9,
      fontSize: 44, fontFace: FONT.head, color: C.white, bold: true, align: "center",
    });

    slide.addText("谢谢", {
      x: 0.8, y: 2.0, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT.head, color: C.teal, align: "center",
    });

    // Divider
    slide.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.9, w: 3.0, h: 0,
      line: { color: C.teal, width: 1.5 },
    });

    // Project links
    slide.addText([
      { text: "项目仓库: ", options: { fontSize: 14, color: C.slate300, fontFace: FONT.body } },
      { text: "github.com/nickhou1983/UI-test-Demo", options: { fontSize: 14, color: C.teal, fontFace: FONT.body, bold: true } },
    ], { x: 0.8, y: 3.3, w: 8.4, h: 0.4, align: "center" });

    slide.addText([
      { text: "线上地址: ", options: { fontSize: 14, color: C.slate300, fontFace: FONT.body } },
      { text: "nickhou1983.github.io/UI-test-Demo", options: { fontSize: 14, color: C.teal, fontFace: FONT.body, bold: true } },
    ], { x: 0.8, y: 3.7, w: 8.4, h: 0.4, align: "center" });

    // Tech icons row
    const endIcons = ["react", "typescript", "vite", "tailwind", "playwright", "github"];
    const endStartX = 2.5;
    for (let i = 0; i < endIcons.length; i++) {
      slide.addImage({
        data: icons[endIcons[i]],
        x: endStartX + i * 0.9, y: 4.5, w: 0.5, h: 0.5,
      });
    }

    // Bottom teal bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.teal },
    });
  }

  // ── Write file ──
  const outputPath = "/Users/qifenghou/Codes/UI-test-Demo/docs/presentations/TravelVista-技术概览.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log(`✅ PPT 已生成: ${outputPath}`);
}

main().catch(err => {
  console.error("❌ PPT 生成失败:", err);
  process.exit(1);
});
