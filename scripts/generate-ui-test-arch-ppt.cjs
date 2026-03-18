/**
 * TravelVista UI 自动化测试架构 PPT 生成脚本
 * 面向技术负责人 — 聚焦测试体系、Agent 智能路由、VLM 创新
 */
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// ── Icon imports ──
const { FaReact, FaGithub, FaGlobe, FaLayerGroup, FaCheckCircle, FaCloud,
  FaCode, FaShieldAlt, FaCogs, FaSearch, FaEye, FaRobot, FaSitemap,
  FaProjectDiagram, FaChartBar, FaRocket, FaBrain } = require("react-icons/fa");
const { MdLanguage, MdDevices, MdDashboard, MdTimeline, MdArchitecture,
  MdAutoFixHigh } = require("react-icons/md");
const { SiTypescript, SiVite, SiTailwindcss } = require("react-icons/si");
const { BiTestTube } = require("react-icons/bi");
const { HiOutlineEye } = require("react-icons/hi");

// ── Color palette: "Teal Trust" — evokes quality, reliability, testing precision ──
const C = {
  dark:     "0A1628",    // slide backgrounds (dark)
  navy:     "0F2A4A",    // card backgrounds on dark slides
  teal:     "028090",    // primary accent
  seafoam:  "00A896",    // secondary accent
  mint:     "02C39A",    // highlights / success
  white:    "FFFFFF",
  offWhite: "F8FAFC",    // slide backgrounds (light)
  warmGray: "F1F5F9",    // card backgrounds on light slides
  slate700: "334155",    // primary text on light bg
  slate500: "64748B",    // secondary text
  slate300: "CBD5E1",    // muted text on dark bg
  amber:    "F59E0B",    // stat callout numbers
  coral:    "EF4444",    // breaking/warning accent
  purple:   "8B5CF6",    // VLM/AI accent
};

const FONT = { head: "Trebuchet MS", body: "Calibri", mono: "Consolas" };

// ── Icon utilities ──
function renderIconSvg(Icon, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color: "#" + color, size: String(size) })
  );
}
async function icon(Icon, color, size = 256) {
  const svg = renderIconSvg(Icon, color, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ── Reusable factory helpers (never reuse mutable options) ──
const mkShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10 });
const mkCardShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12 });

function card(slide, pres, x, y, w, h, fill) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill || C.white }, shadow: mkCardShadow() });
}
function accentBar(slide, pres, x, y, h, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h, fill: { color: color || C.teal } });
}
function sectionHead(slide, pres, num, title, dark) {
  const textColor = dark ? C.white : C.dark;
  slide.addText(num, { x: 0.6, y: 0.25, w: 0.8, h: 0.5, fontSize: 24, fontFace: FONT.head, color: C.teal, bold: true, margin: 0 });
  slide.addText(title, { x: 1.35, y: 0.25, w: 6, h: 0.5, fontSize: 28, fontFace: FONT.head, color: textColor, bold: true, margin: 0 });
}
function pageNum(slide, n, total, dark) {
  slide.addText(`${n} / ${total}`, { x: 8.5, y: 5.25, w: 1.2, h: 0.3, fontSize: 9, fontFace: FONT.body, color: dark ? C.slate300 : C.slate500, align: "right" });
}

// ═══════════════════════════════════════════════════════════
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "TravelVista Team";
  pres.title = "UI 自动化测试架构概览";
  const TOTAL = 11;

  // ── Pre-render icons ──
  const I = {};
  const defs = [
    ["react",   FaReact,   C.teal],   ["ts",       SiTypescript, C.teal],
    ["vite",    SiVite,    C.purple],  ["tw",       SiTailwindcss, C.teal],
    ["pw",      BiTestTube, C.mint],   ["gh",       FaGithub,     C.slate300],
    ["globe",   FaGlobe,   C.white],   ["layer",    FaLayerGroup, C.white],
    ["check",   FaCheckCircle, C.mint], ["cloud",    FaCloud,      C.white],
    ["code",    FaCode,    C.white],    ["shield",   FaShieldAlt,  C.white],
    ["cogs",    FaCogs,    C.white],    ["search",   FaSearch,     C.white],
    ["eye",     FaEye,     C.white],    ["robot",    FaRobot,      C.white],
    ["sitemap", FaSitemap, C.white],    ["diagram",  FaProjectDiagram, C.white],
    ["chart",   FaChartBar, C.white],   ["rocket",   FaRocket,     C.white],
    ["brain",   FaBrain,   C.white],    ["lang",     MdLanguage,   C.white],
    ["device",  MdDevices, C.white],    ["dash",     MdDashboard,  C.white],
    ["timeline",MdTimeline, C.white],   ["arch",     MdArchitecture, C.white],
    ["autofix", MdAutoFixHigh, C.white],["hieye",    HiOutlineEye, C.white],
    // Dark-bg variants for light slides
    ["d_check", FaCheckCircle, C.mint], ["d_cloud",  FaCloud,      C.teal],
    ["d_code",  FaCode,    C.slate700], ["d_shield", FaShieldAlt,  C.teal],
    ["d_robot", FaRobot,   C.purple],   ["d_eye",    FaEye,        C.teal],
    ["d_layer", FaLayerGroup, C.teal],  ["d_chart",  FaChartBar,   C.teal],
    ["d_arch",  MdArchitecture, C.dark],["d_rocket", FaRocket,     C.teal],
    ["d_brain", FaBrain,   C.purple],   ["d_sitemap",FaSitemap,    C.teal],
    ["d_diagram",FaProjectDiagram,C.teal],["d_timeline",MdTimeline,C.teal],
    ["d_autofix",MdAutoFixHigh,C.seafoam],["d_globe",FaGlobe,C.teal],
    ["d_cogs",  FaCogs,    C.slate700], ["d_search", FaSearch,     C.teal],
    ["d_pw",    BiTestTube, C.mint],    ["d_gh",     FaGithub,     C.slate700],
    ["d_lang",  MdLanguage, C.teal],    ["d_device", MdDevices,    C.teal],
    ["d_dash",  MdDashboard, C.teal],
  ];
  for (const [k, Comp, clr] of defs) I[k] = await icon(Comp, clr);

  // ══════════════════════════════════════════
  // SLIDE 1 — Title (dark)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.dark };
    // Top teal bar
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.05, fill: { color: C.teal } });
    // Tech icons top center
    const topIcons = ["react", "ts", "vite", "tw", "pw"];
    for (let i = 0; i < topIcons.length; i++)
      s.addImage({ data: I[topIcons[i]], x: 2.8 + i * 0.95, y: 0.5, w: 0.5, h: 0.5 });
    // Title
    s.addText("UI 自动化测试架构", { x: 0.8, y: 1.6, w: 8.4, h: 0.9, fontSize: 44, fontFace: FONT.head, color: C.white, bold: true, align: "center" });
    s.addText("TravelVista 项目", { x: 0.8, y: 2.45, w: 8.4, h: 0.55, fontSize: 26, fontFace: FONT.head, color: C.teal, align: "center", charSpacing: 3 });
    // Tagline
    s.addText("Playwright · 三层金字塔 · Agent 智能路由 · VLM 语义审查 · Azure 云端", { x: 0.8, y: 3.3, w: 8.4, h: 0.4, fontSize: 13, fontFace: FONT.body, color: C.slate300, align: "center" });
    // Divider
    s.addShape(pres.shapes.LINE, { x: 3.5, y: 3.95, w: 3, h: 0, line: { color: C.teal, width: 1.5 } });
    s.addText("面向技术负责人  |  2026 年 3 月", { x: 0.8, y: 4.15, w: 8.4, h: 0.35, fontSize: 12, fontFace: FONT.body, color: C.slate500, align: "center" });
    // GitHub link
    s.addImage({ data: I.gh, x: 3.3, y: 4.85, w: 0.25, h: 0.25 });
    s.addText("github.com/nickhou1983/UI-test-Demo", { x: 3.6, y: 4.85, w: 3.5, h: 0.25, fontSize: 10, fontFace: FONT.body, color: C.slate300, hyperlink: { url: "https://github.com/nickhou1983/UI-test-Demo" } });
    // Bottom bar
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.575, w: 10, h: 0.05, fill: { color: C.teal } });
    pageNum(s, 1, TOTAL, true);
  }

  // ══════════════════════════════════════════
  // SLIDE 2 — Agenda (light)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.offWhite };
    s.addText("议程", { x: 0.6, y: 0.3, w: 4, h: 0.6, fontSize: 32, fontFace: FONT.head, color: C.dark, bold: true });

    const items = [
      { n: "01", t: "被测系统概览", d: "TravelVista 技术栈与产品规模", ic: "d_globe" },
      { n: "02", t: "三层测试金字塔", d: "Component / E2E / Visual Regression", ic: "d_layer" },
      { n: "03", t: "组件测试 (CT)", d: "6 组件 · 27 断言 · 隔离挂载", ic: "d_code" },
      { n: "04", t: "E2E 端到端测试", d: "6 specs · 36 cases · 用户旅程", ic: "d_search" },
      { n: "05", t: "视觉回归测试", d: "8 页面截图 · 像素比对 · VLM 语义复核", ic: "d_eye" },
      { n: "06", t: "Agent 智能路由体系", d: "6 Agent 路由 · Discovery 契约 · Report-Only", ic: "d_robot" },
      { n: "07", t: "VLM 语义审查", d: "GPT-4o Vision · 4 级严重度 · 成本控制", ic: "d_brain" },
      { n: "08", t: "CI/CD 与 Azure 云端", d: "GitHub Actions + Azure Playwright Workspace", ic: "d_cloud" },
      { n: "09", t: "覆盖矩阵与规划", d: "测试覆盖全景 · 下一步路线图", ic: "d_chart" },
    ];

    const sy = 1.15;
    for (let i = 0; i < items.length; i++) {
      const it = items[i], yy = sy + i * 0.48;
      // Number badge
      s.addShape(pres.shapes.OVAL, { x: 0.7, y: yy + 0.02, w: 0.34, h: 0.34, fill: { color: C.dark } });
      s.addText(it.n, { x: 0.7, y: yy + 0.02, w: 0.34, h: 0.34, fontSize: 10, fontFace: FONT.body, color: C.white, bold: true, align: "center", valign: "middle" });
      // Icon
      s.addImage({ data: I[it.ic], x: 1.2, y: yy + 0.03, w: 0.3, h: 0.3 });
      // Text
      s.addText(it.t, { x: 1.65, y: yy - 0.02, w: 3.5, h: 0.25, fontSize: 13, fontFace: FONT.body, color: C.slate700, bold: true, margin: 0 });
      s.addText(it.d, { x: 1.65, y: yy + 0.2, w: 4.5, h: 0.22, fontSize: 10, fontFace: FONT.body, color: C.slate500, margin: 0 });
    }
    // Right decorative panel
    s.addShape(pres.shapes.RECTANGLE, { x: 7.5, y: 0, w: 2.5, h: 5.625, fill: { color: C.dark } });
    const decoIcons = ["layer", "code", "eye", "robot", "brain", "cloud", "chart"];
    for (let i = 0; i < decoIcons.length; i++)
      s.addImage({ data: I[decoIcons[i]], x: 8.35, y: 0.55 + i * 0.7, w: 0.45, h: 0.45 });
    pageNum(s, 2, TOTAL, false);
  }

  // ══════════════════════════════════════════
  // SLIDE 3 — 被测系统概览 (dark)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.dark };
    sectionHead(s, pres, "01", "被测系统概览", true);

    // Left: tech stack cards
    const techs = [
      { name: "React 19",       desc: "UI 框架 · Hooks + Router 7",   ic: "react" },
      { name: "TypeScript 5.9", desc: "严格模式类型安全",              ic: "ts" },
      { name: "Vite 8",         desc: "HMR 开发服务器 + 构建工具",    ic: "vite" },
      { name: "Tailwind CSS 4", desc: "Utility-first · PostCSS",     ic: "tw" },
      { name: "i18next",        desc: "中/英运行时切换 · 200+ 翻译键", ic: "lang" },
    ];
    for (let i = 0; i < techs.length; i++) {
      const t = techs[i], yy = 1.0 + i * 0.72;
      card(s, pres, 0.6, yy, 4.2, 0.58, C.navy);
      accentBar(s, pres, 0.6, yy, 0.58, C.teal);
      s.addImage({ data: I[t.ic], x: 0.8, y: yy + 0.08, w: 0.38, h: 0.38 });
      s.addText(t.name, { x: 1.3, y: yy + 0.03, w: 3.2, h: 0.26, fontSize: 13, fontFace: FONT.body, color: C.white, bold: true, margin: 0 });
      s.addText(t.desc, { x: 1.3, y: yy + 0.28, w: 3.2, h: 0.24, fontSize: 10, fontFace: FONT.body, color: C.slate300, margin: 0 });
    }

    // Right: key stats
    card(s, pres, 5.2, 1.0, 4.3, 3.85, C.navy);
    s.addText("产品规模", { x: 5.45, y: 1.1, w: 3.5, h: 0.35, fontSize: 15, fontFace: FONT.body, color: C.teal, bold: true, margin: 0 });
    const stats = [
      { n: "4",  l: "核心页面", sub: "Home / Destinations / Detail / About" },
      { n: "10", l: "组件", sub: "Navbar · Footer · FilterBar · Carousel …" },
      { n: "12", l: "目的地", sub: "6 地区 × 4 类型" },
      { n: "2",  l: "语言", sub: "中文 (默认) · English" },
      { n: "14", l: "测试 Spec 文件", sub: "6 CT + 6 E2E + 1 Visual + 1 CT-Visual" },
    ];
    for (let i = 0; i < stats.length; i++) {
      const st = stats[i], yy = 1.55 + i * 0.58;
      s.addText(st.n, { x: 5.5, y: yy, w: 0.9, h: 0.5, fontSize: 30, fontFace: FONT.head, color: C.amber, bold: true, align: "center", valign: "middle" });
      s.addText(st.l, { x: 6.4, y: yy, w: 2.8, h: 0.26, fontSize: 13, fontFace: FONT.body, color: C.white, bold: true, margin: 0, valign: "middle" });
      s.addText(st.sub, { x: 6.4, y: yy + 0.26, w: 2.8, h: 0.2, fontSize: 9, fontFace: FONT.body, color: C.slate300, margin: 0 });
      if (i < stats.length - 1)
        s.addShape(pres.shapes.LINE, { x: 5.5, y: yy + 0.52, w: 3.7, h: 0, line: { color: C.navy, width: 0.5 } });
    }
    // Online URL
    s.addImage({ data: I.globe, x: 5.5, y: 4.5, w: 0.2, h: 0.2 });
    s.addText("nickhou1983.github.io/UI-test-Demo", { x: 5.8, y: 4.5, w: 3.5, h: 0.2, fontSize: 10, fontFace: FONT.body, color: C.teal, hyperlink: { url: "https://nickhou1983.github.io/UI-test-Demo/" } });
    pageNum(s, 3, TOTAL, true);
  }

  // ══════════════════════════════════════════
  // SLIDE 4 — 三层测试金字塔 (light)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.offWhite };
    sectionHead(s, pres, "02", "三层测试金字塔", false);

    // Pyramid — three stacked layers
    // Layer 3 Visual (top, narrow)
    card(s, pres, 2.6, 1.1, 2.8, 0.85, "ECFDF5");
    accentBar(s, pres, 2.6, 1.1, 0.85, C.mint);
    s.addImage({ data: I.d_eye, x: 2.8, y: 1.2, w: 0.35, h: 0.35 });
    s.addText([
      { text: "Visual Regression", options: { bold: true, fontSize: 12, color: C.mint, breakLine: true } },
      { text: "1 spec · 8 截图 · 1% 像素阈值", options: { fontSize: 9, color: C.slate500 } },
    ], { x: 3.2, y: 1.15, w: 2.05, h: 0.75, margin: 0 });

    // Layer 2 E2E (middle, wider)
    card(s, pres, 1.6, 2.1, 4.8, 0.85, "DBEAFE");
    accentBar(s, pres, 1.6, 2.1, 0.85, "3B82F6");
    s.addImage({ data: I.d_search, x: 1.8, y: 2.2, w: 0.35, h: 0.35 });
    s.addText([
      { text: "E2E 端到端测试", options: { bold: true, fontSize: 12, color: "2563EB", breakLine: true } },
      { text: "6 specs · 36 cases · 页面导航 + 用户旅程 + i18n", options: { fontSize: 9, color: C.slate500 } },
    ], { x: 2.25, y: 2.15, w: 3.9, h: 0.75, margin: 0 });

    // Layer 1 CT (bottom, widest)
    card(s, pres, 0.6, 3.1, 6.8, 0.85, "CCFBF1");
    accentBar(s, pres, 0.6, 3.1, 0.85, C.teal);
    s.addImage({ data: I.d_code, x: 0.8, y: 3.2, w: 0.35, h: 0.35 });
    s.addText([
      { text: "Component Testing (CT)", options: { bold: true, fontSize: 12, color: C.teal, breakLine: true } },
      { text: "6 specs · 27 断言 · mount() 隔离挂载 · TestWrapper (Router + i18n)", options: { fontSize: 9, color: C.slate500 } },
    ], { x: 1.25, y: 3.15, w: 5.9, h: 0.75, margin: 0 });

    // Arrow labels
    s.addText("覆盖度↑", { x: 0.1, y: 1.3, w: 0.5, h: 0.4, fontSize: 9, fontFace: FONT.body, color: C.slate500, align: "center", rotate: 270 });
    s.addText("集成度↑", { x: 0.1, y: 2.5, w: 0.5, h: 0.4, fontSize: 9, fontFace: FONT.body, color: C.slate500, align: "center", rotate: 270 });

    // Right: unified framework highlight
    card(s, pres, 7.8, 1.1, 1.8, 2.85, C.dark);
    s.addImage({ data: I.pw, x: 8.25, y: 1.3, w: 0.55, h: 0.55 });
    s.addText("Playwright", { x: 7.85, y: 1.9, w: 1.7, h: 0.25, fontSize: 12, fontFace: FONT.body, color: C.teal, bold: true, align: "center" });
    s.addText("统一框架", { x: 7.85, y: 2.15, w: 1.7, h: 0.2, fontSize: 11, fontFace: FONT.body, color: C.white, align: "center" });
    s.addText("贯穿三层", { x: 7.85, y: 2.35, w: 1.7, h: 0.2, fontSize: 11, fontFace: FONT.body, color: C.white, align: "center" });
    s.addText([
      { text: "CT", options: { fontSize: 9, color: C.teal, bold: true, breakLine: true } },
      { text: "E2E", options: { fontSize: 9, color: "3B82F6", bold: true, breakLine: true } },
      { text: "Visual", options: { fontSize: 9, color: C.mint, bold: true } },
    ], { x: 7.85, y: 2.7, w: 1.7, h: 0.9, align: "center" });

    // Config inheritance at bottom
    card(s, pres, 0.6, 4.2, 8.8, 0.7, C.warmGray);
    s.addText("配置继承关系", { x: 0.85, y: 4.25, w: 2, h: 0.25, fontSize: 11, fontFace: FONT.body, color: C.dark, bold: true, margin: 0 });
    s.addText("playwright.config.ts  →  playwright-ct.config.ts  →  playwright.service.config.ts (Azure)", { x: 0.85, y: 4.5, w: 8.3, h: 0.25, fontSize: 10, fontFace: FONT.mono, color: C.teal, margin: 0 });
    s.addText("e2e + visual 项目                  CT 独立配置                        云端执行叠加层", { x: 0.85, y: 4.72, w: 8.3, h: 0.18, fontSize: 8, fontFace: FONT.body, color: C.slate500, margin: 0 });
    pageNum(s, 4, TOTAL, false);
  }

  // ══════════════════════════════════════════
  // SLIDE 5 — 组件测试 CT (dark)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.dark };
    sectionHead(s, pres, "03", "组件测试 (CT)", true);

    // Left: component list
    const comps = [
      { name: "Navbar",          tests: 5, desc: "Logo · 3 导航 · 语言切换 · 移动汉堡菜单" },
      { name: "SearchBar",       tests: 3, desc: "Placeholder · 值绑定 · onChange" },
      { name: "FilterBar",       tests: 3, desc: "搜索 + 2 下拉 · 6 地区 / 4 类型" },
      { name: "Carousel",        tests: 7, desc: "导航圆点 · 点击切换 · 自动播放" },
      { name: "DestinationCard", tests: 7, desc: "i18n 名称 · 类型徽章 · 评分星级" },
      { name: "Footer",          tests: 2, desc: "导航链接 · 社交区 · 版权" },
    ];
    for (let i = 0; i < comps.length; i++) {
      const c = comps[i], yy = 1.0 + i * 0.7;
      card(s, pres, 0.6, yy, 4.5, 0.58, C.navy);
      accentBar(s, pres, 0.6, yy, 0.58, C.teal);
      s.addText(c.name, { x: 0.85, y: yy + 0.04, w: 2.2, h: 0.24, fontSize: 12, fontFace: FONT.mono, color: C.teal, bold: true, margin: 0 });
      // Test count badge
      s.addShape(pres.shapes.OVAL, { x: 3.05, y: yy + 0.06, w: 0.3, h: 0.2, fill: { color: C.teal } });
      s.addText(String(c.tests), { x: 3.05, y: yy + 0.04, w: 0.3, h: 0.24, fontSize: 9, fontFace: FONT.body, color: C.white, bold: true, align: "center", valign: "middle" });
      s.addText(c.desc, { x: 0.85, y: yy + 0.3, w: 4.0, h: 0.22, fontSize: 9, fontFace: FONT.body, color: C.slate300, margin: 0 });
    }

    // Right: key mechanism
    card(s, pres, 5.4, 1.0, 4.15, 4.2, C.navy);
    s.addText("核心机制", { x: 5.65, y: 1.1, w: 3.6, h: 0.3, fontSize: 14, fontFace: FONT.body, color: C.teal, bold: true, margin: 0 });

    const mechs = [
      { t: "隔离挂载", d: "mount() API 将单组件挂载到\n独立 DOM，不依赖完整应用" },
      { t: "TestWrapper 上下文", d: "MemoryRouter + I18nextProvider\n为每个 CT 提供路由与 i18n" },
      { t: "内置 Vite 构建", d: "CT 使用独立 Vite 服务器加载组件\n支持 PostCSS / Tailwind 样式" },
      { t: "交互验证", d: "点击、填充、选择等用户操作\nexpect() 断言可见性和回调" },
    ];
    for (let i = 0; i < mechs.length; i++) {
      const m = mechs[i], yy = 1.55 + i * 0.88;
      s.addShape(pres.shapes.OVAL, { x: 5.65, y: yy + 0.05, w: 0.32, h: 0.32, fill: { color: C.teal } });
      s.addText(String(i + 1), { x: 5.65, y: yy + 0.05, w: 0.32, h: 0.32, fontSize: 11, fontFace: FONT.body, color: C.white, bold: true, align: "center", valign: "middle" });
      s.addText(m.t, { x: 6.1, y: yy, w: 3.2, h: 0.22, fontSize: 12, fontFace: FONT.body, color: C.white, bold: true, margin: 0 });
      s.addText(m.d, { x: 6.1, y: yy + 0.24, w: 3.2, h: 0.55, fontSize: 10, fontFace: FONT.body, color: C.slate300, margin: 0 });
    }

    // Bottom stats bar
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 5.0, w: 8.85, h: 0.4, fill: { color: C.teal, transparency: 15 } });
    s.addText("6 个组件  ·  27 个断言  ·  npm run test:ct  ·  playwright-ct.config.ts  ·  Desktop Chrome", {
      x: 0.8, y: 5.0, w: 8.5, h: 0.4, fontSize: 10, fontFace: FONT.body, color: C.white, align: "center", valign: "middle" });
    pageNum(s, 5, TOTAL, true);
  }

  // ══════════════════════════════════════════
  // SLIDE 6 — E2E 测试 (light)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.offWhite };
    sectionHead(s, pres, "04", "E2E 端到端测试", false);

    // E2E specs table
    const specs = [
      { file: "home.spec.ts",             tests: 7, coverage: "Hero + 搜索 · 热门目的地 · 主题 · 轮播 · 查看全部" },
      { file: "destinations.spec.ts",      tests: 7, coverage: "12 卡片 · 关键词/地区/类型筛选 · URL 参数 · 卡片导航" },
      { file: "destination-detail.spec.ts", tests: 9, coverage: "面包屑 · 画廊 · 景点 · 侧边栏 · 推荐 · 404" },
      { file: "about.spec.ts",            tests: 5, coverage: "标题 · 使命 · 3 价值卡 · 4 团队成员 · 邮箱" },
      { file: "navigation.spec.ts",       tests: 6, coverage: "Navbar 跨页 · Logo 首页 · 中英切换 · 语言持久化" },
      { file: "user-journey.spec.ts",     tests: 2, coverage: "完整多页旅程 + 主题分类导航" },
    ];

    // Table
    const hOpts = { fill: { color: C.dark }, color: C.white, bold: true, fontSize: 10, fontFace: FONT.body, align: "center", valign: "middle" };
    const cOpts = { fontSize: 10, fontFace: FONT.body, color: C.slate700, valign: "middle", border: { pt: 0.5, color: C.slate300 } };
    const rows = [
      [{ text: "Spec 文件", options: { ...hOpts, align: "left" } }, { text: "Cases", options: hOpts }, { text: "覆盖范围", options: { ...hOpts, align: "left" } }],
      ...specs.map((sp, i) => {
        const bg = i % 2 === 0 ? C.white : C.warmGray;
        return [
          { text: "  " + sp.file, options: { ...cOpts, fontFace: FONT.mono, fill: { color: bg }, fontSize: 9 } },
          { text: String(sp.tests), options: { ...cOpts, align: "center", fill: { color: bg }, bold: true, color: C.teal } },
          { text: "  " + sp.coverage, options: { ...cOpts, fill: { color: bg }, fontSize: 9 } },
        ];
      }),
    ];
    s.addTable(rows, { x: 0.6, y: 1.0, w: 8.8, colW: [2.3, 0.7, 5.8], rowH: 0.34, border: { pt: 0.5, color: C.slate300 } });

    // Bottom: key mechanisms row
    const e2eMechs = [
      { ic: "d_device", t: "真实浏览器", d: "Chromium 自动启动\n完整 DOM 环境" },
      { ic: "d_cogs",   t: "Vite WebServer", d: "自动启动 dev server\nlocalhost:5173" },
      { ic: "d_lang",   t: "i18n 验证", d: "中英切换 + 跨页\n语言持久化测试" },
      { ic: "d_timeline", t: "Trace 捕获", d: "首次重试自动录制\n操作 + 网络 + DOM" },
    ];
    const cardY = 3.75, cardW = 2.05, cardH = 1.3;
    for (let i = 0; i < e2eMechs.length; i++) {
      const m = e2eMechs[i], cx = 0.6 + i * (cardW + 0.2);
      card(s, pres, cx, cardY, cardW, cardH, C.white);
      accentBar(s, pres, cx, cardY, cardH, "3B82F6");
      s.addImage({ data: I[m.ic], x: cx + 0.2, y: cardY + 0.15, w: 0.32, h: 0.32 });
      s.addText(m.t, { x: cx + 0.6, y: cardY + 0.12, w: 1.3, h: 0.22, fontSize: 11, fontFace: FONT.body, color: C.slate700, bold: true, margin: 0 });
      s.addText(m.d, { x: cx + 0.15, y: cardY + 0.55, w: 1.75, h: 0.65, fontSize: 9, fontFace: FONT.body, color: C.slate500, margin: 0 });
    }
    // Stat
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 5.15, w: 8.8, h: 0.35, fill: { color: "DBEAFE" } });
    s.addText("6 specs  ·  36 test cases  ·  npm run test:e2e  ·  playwright.config.ts → project: e2e", {
      x: 0.8, y: 5.15, w: 8.4, h: 0.35, fontSize: 10, fontFace: FONT.body, color: "2563EB", align: "center", valign: "middle" });
    pageNum(s, 6, TOTAL, false);
  }

  // ══════════════════════════════════════════
  // SLIDE 7 — 视觉回归 + VLM (dark)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.dark };
    sectionHead(s, pres, "05", "视觉回归 + VLM 语义审查", true);

    // Left: Visual test screenshots
    s.addText("8 页面截图", { x: 0.6, y: 1.0, w: 3.5, h: 0.3, fontSize: 14, fontFace: FONT.body, color: C.teal, bold: true, margin: 0 });
    const pages = [
      "HomePage（Hero + 热门 + 主题 + 轮播）",
      "DestinationsPage（12 卡片 + 筛选栏）",
      "DestinationDetail — Bali（完整详情）",
      "AboutPage（使命 + 价值 + 团队）",
      "FavoritesPage（注入 localStorage）",
      "TripPlannerPage（注入行程数据）",
      "TripEditPage（编辑表单状态）",
      "NotFoundPage（404）",
    ];
    for (let i = 0; i < pages.length; i++) {
      const yy = 1.4 + i * 0.38;
      s.addImage({ data: I.check, x: 0.7, y: yy + 0.04, w: 0.2, h: 0.2 });
      s.addText(pages[i], { x: 1.0, y: yy, w: 3.8, h: 0.3, fontSize: 10, fontFace: FONT.body, color: C.slate300, margin: 0 });
    }

    // Bottom-left: key config
    card(s, pres, 0.6, 4.5, 4.2, 0.85, C.navy);
    s.addText("maxDiffPixelRatio: 0.01 · animations: disabled · fullPage: true · networkidle", {
      x: 0.8, y: 4.55, w: 3.8, h: 0.7, fontSize: 9, fontFace: FONT.mono, color: C.teal, margin: 0 });

    // Right: VLM Hybrid Flow
    s.addText("VLM Hybrid 策略", { x: 5.2, y: 1.0, w: 4.2, h: 0.3, fontSize: 14, fontFace: FONT.body, color: C.purple, bold: true, margin: 0 });

    const flowSteps = [
      { n: "1", t: "像素比对", d: "Playwright 原生截图与基线逐像素比对", color: C.teal },
      { n: "2", t: "VLM 触发条件", d: "像素 FAIL + VLM_REVIEW=true + 有凭证", color: C.amber },
      { n: "3", t: "GPT-4o 语义审查", d: "编码截图 → Azure OpenAI Vision API", color: C.purple },
      { n: "4", t: "严重度分类", d: "none / cosmetic / minor / breaking", color: C.mint },
      { n: "5", t: "智能决策", d: "cosmetic → WARN（通过）  breaking → FAIL", color: C.coral },
    ];
    for (let i = 0; i < flowSteps.length; i++) {
      const f = flowSteps[i], yy = 1.45 + i * 0.62;
      s.addShape(pres.shapes.OVAL, { x: 5.3, y: yy + 0.04, w: 0.32, h: 0.32, fill: { color: f.color } });
      s.addText(f.n, { x: 5.3, y: yy + 0.04, w: 0.32, h: 0.32, fontSize: 11, fontFace: FONT.body, color: C.white, bold: true, align: "center", valign: "middle" });
      if (i < flowSteps.length - 1)
        s.addShape(pres.shapes.LINE, { x: 5.46, y: yy + 0.36, w: 0, h: 0.26, line: { color: f.color, width: 1.5 } });
      s.addText(f.t, { x: 5.75, y: yy, w: 3.6, h: 0.2, fontSize: 11, fontFace: FONT.body, color: C.white, bold: true, margin: 0 });
      s.addText(f.d, { x: 5.75, y: yy + 0.2, w: 3.6, h: 0.2, fontSize: 9, fontFace: FONT.body, color: C.slate300, margin: 0 });
    }

    // VLM cost control
    card(s, pres, 5.2, 4.5, 4.3, 0.85, C.navy);
    s.addText([
      { text: "成本控制  ", options: { bold: true, fontSize: 10, color: C.amber } },
      { text: "VLM_MAX_CALLS=10/次  ·  置信度阈值 0.7  ·  默认关闭  ·  输出 vlm-review-report.json", options: { fontSize: 9, color: C.slate300 } },
    ], { x: 5.4, y: 4.55, w: 3.8, h: 0.7, margin: 0 });
    pageNum(s, 7, TOTAL, true);
  }

  // ══════════════════════════════════════════
  // SLIDE 8 — Agent 智能路由 (light)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.offWhite };
    sectionHead(s, pres, "06", "Agent 智能路由体系", false);

    // Central router — ui-test
    card(s, pres, 3.5, 1.0, 3.0, 0.7, C.dark);
    s.addImage({ data: I.d_sitemap, x: 3.65, y: 1.1, w: 0.35, h: 0.35 });
    s.addText("ui-test", { x: 4.1, y: 1.07, w: 1.5, h: 0.25, fontSize: 14, fontFace: FONT.mono, color: C.teal, bold: true, margin: 0 });
    s.addText("路由分类器", { x: 4.1, y: 1.35, w: 1.5, h: 0.2, fontSize: 10, fontFace: FONT.body, color: C.slate300, margin: 0 });

    // Discovery agent — center below
    card(s, pres, 3.3, 2.0, 3.4, 0.65, "F0FDF4");
    accentBar(s, pres, 3.3, 2.0, 0.65, C.teal);
    s.addText("ui-test-discovery", { x: 3.5, y: 2.05, w: 2.5, h: 0.22, fontSize: 11, fontFace: FONT.mono, color: C.teal, bold: true, margin: 0 });
    s.addText("共享分析：路由清单 · 组件清单 · 定位策略 · 旅程笔记", { x: 3.5, y: 2.3, w: 3.0, h: 0.25, fontSize: 8, fontFace: FONT.body, color: C.slate500, margin: 0 });
    // Arrow from router to discovery
    s.addShape(pres.shapes.LINE, { x: 5.0, y: 1.7, w: 0, h: 0.3, line: { color: C.teal, width: 1.5 } });

    // 4 specialized agents — bottom row
    const agents = [
      { name: "component", desc: "CT 组件测试\nmount() + 断言", color: C.teal, bg: "CCFBF1" },
      { name: "e2e", desc: "端到端测试\n页面 + 用户旅程", color: "3B82F6", bg: "DBEAFE" },
      { name: "visual", desc: "视觉回归\n截图 + 像素比对", color: C.mint, bg: "ECFDF5" },
      { name: "governance", desc: "治理层\nAzure · CI · VLM", color: C.purple, bg: "F3E8FF" },
    ];
    const agentY = 3.0, agentW = 2.05, agentH = 1.05;
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i], cx = 0.6 + i * (agentW + 0.2);
      card(s, pres, cx, agentY, agentW, agentH, a.bg);
      accentBar(s, pres, cx, agentY, agentH, a.color);
      s.addText("ui-test-" + a.name, { x: cx + 0.15, y: agentY + 0.08, w: 1.75, h: 0.22, fontSize: 10, fontFace: FONT.mono, color: a.color, bold: true, margin: 0 });
      s.addText(a.desc, { x: cx + 0.15, y: agentY + 0.35, w: 1.75, h: 0.6, fontSize: 9, fontFace: FONT.body, color: C.slate500, margin: 0 });
      // Arrow from discovery to agent
      const arrowX = cx + agentW / 2;
      s.addShape(pres.shapes.LINE, { x: arrowX, y: 2.65, w: 0, h: 0.35, line: { color: a.color, width: 1.2 } });
    }

    // Bottom: architectural patterns
    const patterns = [
      { ic: "d_diagram", t: "Discovery 契约", d: "共享发现输出，下游 agent 复用不重复分析" },
      { ic: "d_shield",  t: "Report-Only 策略", d: "只报告不自动修复，保持透明与人为决策" },
      { ic: "d_autofix", t: "日常 / 治理分离", d: "日常测试 4 agent vs 治理层 (governance)" },
    ];
    const patY = 4.3;
    for (let i = 0; i < patterns.length; i++) {
      const p = patterns[i], cx = 0.6 + i * 3.1;
      card(s, pres, cx, patY, 2.85, 0.85, C.white);
      s.addImage({ data: I[p.ic], x: cx + 0.12, y: patY + 0.12, w: 0.28, h: 0.28 });
      s.addText(p.t, { x: cx + 0.48, y: patY + 0.08, w: 2.2, h: 0.22, fontSize: 11, fontFace: FONT.body, color: C.slate700, bold: true, margin: 0 });
      s.addText(p.d, { x: cx + 0.12, y: patY + 0.42, w: 2.6, h: 0.35, fontSize: 9, fontFace: FONT.body, color: C.slate500, margin: 0 });
    }
    pageNum(s, 8, TOTAL, false);
  }

  // ══════════════════════════════════════════
  // SLIDE 9 — CI/CD + Azure (dark)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.dark };
    sectionHead(s, pres, "07", "CI/CD 与 Azure 云端执行", true);

    // Left: Pipeline steps
    s.addText("GitHub Actions 流水线", { x: 0.6, y: 1.0, w: 4, h: 0.3, fontSize: 14, fontFace: FONT.body, color: C.teal, bold: true, margin: 0 });

    const steps = [
      { n: "1", t: "代码推送 / PR", d: "push main · PR → main · 手动 dispatch" },
      { n: "2", t: "环境准备", d: "Node 22 · npm ci · Playwright Chromium" },
      { n: "3", t: "E2E 云端测试", d: "Azure PT · playwright.service.config" },
      { n: "4", t: "视觉回归云端", d: "Azure PT · 像素比对 · 失败即阻断" },
      { n: "5", t: "产物归档", d: "HTML 报告 + trace + 截图（14 天）" },
    ];
    for (let i = 0; i < steps.length; i++) {
      const st = steps[i], yy = 1.45 + i * 0.65;
      s.addShape(pres.shapes.OVAL, { x: 0.7, y: yy + 0.05, w: 0.32, h: 0.32, fill: { color: C.teal } });
      s.addText(st.n, { x: 0.7, y: yy + 0.05, w: 0.32, h: 0.32, fontSize: 11, fontFace: FONT.body, color: C.white, bold: true, align: "center", valign: "middle" });
      if (i < steps.length - 1) s.addShape(pres.shapes.LINE, { x: 0.86, y: yy + 0.37, w: 0, h: 0.28, line: { color: C.teal, width: 1.5 } });
      s.addText(st.t, { x: 1.15, y: yy, w: 3.3, h: 0.22, fontSize: 12, fontFace: FONT.body, color: C.white, bold: true, margin: 0 });
      s.addText(st.d, { x: 1.15, y: yy + 0.22, w: 3.3, h: 0.2, fontSize: 9, fontFace: FONT.body, color: C.slate300, margin: 0 });
    }

    // Right: Azure PT card
    card(s, pres, 5.2, 1.0, 4.35, 3.65, C.navy);
    s.addText("Azure Playwright Workspace", { x: 5.45, y: 1.1, w: 3.8, h: 0.3, fontSize: 14, fontFace: FONT.body, color: C.teal, bold: true, margin: 0 });

    const azFeats = [
      { k: "浏览器", v: "Linux Chromium（云端托管）" },
      { k: "并行度", v: "10 workers · 最多 50 并行" },
      { k: "认证", v: "DefaultAzureCredential (Entra ID)" },
      { k: "网络", v: 'exposeNetwork: "<loopback>"' },
      { k: "重试", v: "CI 环境 2 次自动重试" },
      { k: "报告", v: "HTML + Azure Portal 仪表板" },
      { k: "Trace", v: "首次重试自动捕获 · Portal 在线查看" },
    ];
    for (let i = 0; i < azFeats.length; i++) {
      const f = azFeats[i], yy = 1.55 + i * 0.42;
      s.addImage({ data: I.check, x: 5.5, y: yy + 0.03, w: 0.2, h: 0.2 });
      s.addText(f.k, { x: 5.8, y: yy - 0.02, w: 1.3, h: 0.2, fontSize: 9, fontFace: FONT.body, color: C.slate300, margin: 0 });
      s.addText(f.v, { x: 5.8, y: yy + 0.16, w: 3.5, h: 0.2, fontSize: 10, fontFace: FONT.body, color: C.white, bold: true, margin: 0 });
    }

    // Bottom comparison: local vs Azure
    s.addText("本地 vs Azure 关键差异", { x: 0.6, y: 4.75, w: 4, h: 0.25, fontSize: 11, fontFace: FONT.body, color: C.amber, bold: true, margin: 0 });
    s.addText("浏览器 OS 不同(字体渲染) → 基线截图不互通 · 需选定单一环境作为基线来源", {
      x: 0.6, y: 5.0, w: 8.8, h: 0.3, fontSize: 9, fontFace: FONT.body, color: C.slate300, margin: 0 });
    pageNum(s, 9, TOTAL, true);
  }

  // ══════════════════════════════════════════
  // SLIDE 10 — 覆盖矩阵 + 规划 (light)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.offWhite };
    sectionHead(s, pres, "08", "覆盖矩阵与规划", false);

    // Matrix table
    const hd = { fill: { color: C.dark }, color: C.white, bold: true, fontSize: 9, fontFace: FONT.body, align: "center", valign: "middle" };
    const cl = (bg) => ({ fontSize: 9, fontFace: FONT.body, color: C.slate700, valign: "middle", border: { pt: 0.5, color: C.slate300 }, fill: { color: bg } });
    const cc = (bg) => ({ ...cl(bg), align: "center" });

    const matrixRows = [
      [{ text: "测试对象", options: { ...hd, align: "left" } }, { text: "CT", options: hd }, { text: "E2E", options: hd }, { text: "Visual", options: hd }],
      [{ text: "  Navbar", options: cl(C.white) }, { text: "✅", options: cc(C.white) }, { text: "✅", options: cc(C.white) }, { text: "—", options: cc(C.white) }],
      [{ text: "  SearchBar / FilterBar", options: cl(C.warmGray) }, { text: "✅", options: cc(C.warmGray) }, { text: "✅", options: cc(C.warmGray) }, { text: "—", options: cc(C.warmGray) }],
      [{ text: "  Carousel / Card / Footer", options: cl(C.white) }, { text: "✅", options: cc(C.white) }, { text: "✅", options: cc(C.white) }, { text: "—", options: cc(C.white) }],
      [{ text: "  HomePage", options: cl(C.warmGray) }, { text: "—", options: cc(C.warmGray) }, { text: "✅", options: cc(C.warmGray) }, { text: "✅", options: cc(C.warmGray) }],
      [{ text: "  DestinationsPage", options: cl(C.white) }, { text: "—", options: cc(C.white) }, { text: "✅", options: cc(C.white) }, { text: "✅", options: cc(C.white) }],
      [{ text: "  DetailPage (Bali)", options: cl(C.warmGray) }, { text: "—", options: cc(C.warmGray) }, { text: "✅", options: cc(C.warmGray) }, { text: "✅", options: cc(C.warmGray) }],
      [{ text: "  AboutPage", options: cl(C.white) }, { text: "—", options: cc(C.white) }, { text: "✅", options: cc(C.white) }, { text: "✅", options: cc(C.white) }],
      [{ text: "  Favorites / Trips / 404", options: cl(C.warmGray) }, { text: "—", options: cc(C.warmGray) }, { text: "—", options: cc(C.warmGray) }, { text: "✅", options: cc(C.warmGray) }],
      [{ text: "  i18n 切换 / 用户旅程", options: cl(C.white) }, { text: "—", options: cc(C.white) }, { text: "✅", options: cc(C.white) }, { text: "—", options: cc(C.white) }],
    ];
    s.addTable(matrixRows, { x: 0.6, y: 0.9, w: 5.3, colW: [2.3, 0.9, 0.9, 1.0], rowH: 0.3, border: { pt: 0.5, color: C.slate300 } });

    // Right: totals
    const totals = [
      { n: "14", l: "Spec 文件", sub: "6 CT + 6 E2E + 1 Visual + 1 CT-Visual" },
      { n: "63+", l: "断言 / Cases", sub: "27 CT + 36 E2E" },
      { n: "8", l: "视觉截图", sub: "4 页面 + 4 特殊状态" },
      { n: "3", l: "测试层级", sub: "Component · E2E · Visual" },
    ];
    for (let i = 0; i < totals.length; i++) {
      const t = totals[i], yy = 0.95 + i * 0.72;
      card(s, pres, 6.2, yy, 3.4, 0.62, C.white);
      s.addText(t.n, { x: 6.3, y: yy + 0.02, w: 0.8, h: 0.55, fontSize: 28, fontFace: FONT.head, color: C.teal, bold: true, align: "center", valign: "middle" });
      s.addText(t.l, { x: 7.1, y: yy + 0.05, w: 2.3, h: 0.24, fontSize: 12, fontFace: FONT.body, color: C.slate700, bold: true, margin: 0 });
      s.addText(t.sub, { x: 7.1, y: yy + 0.3, w: 2.3, h: 0.22, fontSize: 9, fontFace: FONT.body, color: C.slate500, margin: 0 });
    }

    // Bottom: Roadmap
    s.addText("下一步规划", { x: 0.6, y: 4.05, w: 3, h: 0.3, fontSize: 14, fontFace: FONT.body, color: C.dark, bold: true, margin: 0 });

    const roadmap = [
      { ic: "d_device", t: "响应式视口覆盖", d: "Mobile 375 · Tablet 768 · Desktop 1280" },
      { ic: "d_lang",   t: "i18n 双语截图", d: "中文 + 英文基线完整覆盖" },
      { ic: "d_dash",   t: "更多详情页数据", d: "11 个目的地详情数据补全" },
      { ic: "d_shield", t: "PR 门禁 Gating", d: "视觉回归失败自动阻断合并" },
    ];
    for (let i = 0; i < roadmap.length; i++) {
      const r = roadmap[i], cx = 0.6 + i * 2.35;
      card(s, pres, cx, 4.4, 2.15, 0.95, C.white);
      accentBar(s, pres, cx, 4.4, 0.95, C.seafoam);
      s.addImage({ data: I[r.ic], x: cx + 0.15, y: 4.5, w: 0.25, h: 0.25 });
      s.addText(r.t, { x: cx + 0.45, y: 4.46, w: 1.55, h: 0.22, fontSize: 10, fontFace: FONT.body, color: C.slate700, bold: true, margin: 0 });
      s.addText(r.d, { x: cx + 0.12, y: 4.78, w: 1.9, h: 0.45, fontSize: 8, fontFace: FONT.body, color: C.slate500, margin: 0 });
    }
    pageNum(s, 10, TOTAL, false);
  }

  // ══════════════════════════════════════════
  // SLIDE 11 — Thank You (dark)
  // ══════════════════════════════════════════
  {
    const s = pres.addSlide(); s.background = { color: C.dark };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.05, fill: { color: C.teal } });
    s.addText("Thank You", { x: 0.8, y: 1.2, w: 8.4, h: 0.85, fontSize: 44, fontFace: FONT.head, color: C.white, bold: true, align: "center" });
    s.addText("谢谢", { x: 0.8, y: 2.0, w: 8.4, h: 0.55, fontSize: 26, fontFace: FONT.head, color: C.teal, align: "center" });

    s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.8, w: 3, h: 0, line: { color: C.teal, width: 1.5 } });

    // Key takeaways
    const takeaways = [
      "Playwright 统一框架，三层金字塔全覆盖",
      "6 Agent 智能路由，自动化测试生成与治理分离",
      "VLM 语义审查创新，AI 过滤视觉噪声",
      "Azure 云端执行，CI/CD 全流程集成",
    ];
    for (let i = 0; i < takeaways.length; i++) {
      s.addImage({ data: I.check, x: 2.8, y: 3.1 + i * 0.35, w: 0.2, h: 0.2 });
      s.addText(takeaways[i], { x: 3.1, y: 3.08 + i * 0.35, w: 4.5, h: 0.28, fontSize: 12, fontFace: FONT.body, color: C.slate300, margin: 0 });
    }

    // Links
    s.addText([
      { text: "仓库  ", options: { fontSize: 11, color: C.slate300 } },
      { text: "github.com/nickhou1983/UI-test-Demo", options: { fontSize: 11, color: C.teal, bold: true } },
    ], { x: 0.8, y: 4.6, w: 8.4, h: 0.3, align: "center" });

    // Bottom icons
    const endIcons = ["react", "ts", "vite", "tw", "pw", "gh"];
    for (let i = 0; i < endIcons.length; i++)
      s.addImage({ data: I[endIcons[i]], x: 2.5 + i * 0.9, y: 5.0, w: 0.4, h: 0.4 });

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.575, w: 10, h: 0.05, fill: { color: C.teal } });
    pageNum(s, 11, TOTAL, true);
  }

  // ── Write ──
  const outPath = "/Users/qifenghou/Codes/UI-test-Demo/docs/presentations/UI-Test-Architecture.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("PPT generated:", outPath);
}

main().catch(err => { console.error("FAILED:", err); process.exit(1); });
