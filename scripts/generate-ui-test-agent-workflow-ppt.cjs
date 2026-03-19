const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRoute, FaSearch, FaPuzzlePiece, FaGlobe, FaCamera,
  FaCloudUploadAlt, FaCogs, FaCheckCircle, FaExclamationTriangle,
  FaArrowRight, FaDesktop, FaMobileAlt, FaTabletAlt,
  FaLayerGroup, FaProjectDiagram, FaPlay, FaFileAlt,
  FaCode, FaEye, FaSitemap, FaShieldAlt,
  FaBullseye, FaClipboardCheck, FaLightbulb, FaHandPointRight,
  FaUsers, FaTasks, FaRobot, FaBookOpen
} = require("react-icons/fa");

// ── Color Palette (Tech Navy) ──
const C = {
  navy:      "0F172A",
  darkBlue:  "1E3A5F",
  blue:      "2563EB",
  lightBlue: "3B82F6",
  teal:      "0D9488",
  green:     "10B981",
  orange:    "F59E0B",
  red:       "EF4444",
  purple:    "7C3AED",
  violet:    "8B5CF6",
  white:     "FFFFFF",
  offWhite:  "F8FAFC",
  gray100:   "F1F5F9",
  gray200:   "E2E8F0",
  gray400:   "94A3B8",
  gray600:   "475569",
  gray800:   "1E293B",
};

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

const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12 });
const makeCardShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.10 });

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "UI-Test Agent";
  pres.title = "UI-Test Agent 工作流程";

  // ── Pre-render all icons ──
  const icons = {};
  const iconDefs = [
    ["route", FaRoute, C.blue],
    ["search", FaSearch, C.purple],
    ["puzzle", FaPuzzlePiece, C.green],
    ["globe", FaGlobe, C.orange],
    ["camera", FaCamera, C.red],
    ["cloud", FaCloudUploadAlt, C.violet],
    ["cogs", FaCogs, C.gray600],
    ["check", FaCheckCircle, C.green],
    ["warn", FaExclamationTriangle, C.orange],
    ["arrow", FaArrowRight, C.white],
    ["desktop", FaDesktop, C.blue],
    ["mobile", FaMobileAlt, C.teal],
    ["tablet", FaTabletAlt, C.purple],
    ["layers", FaLayerGroup, C.blue],
    ["diagram", FaProjectDiagram, C.purple],
    ["play", FaPlay, C.green],
    ["file", FaFileAlt, C.gray600],
    ["code", FaCode, C.blue],
    ["eye", FaEye, C.red],
    ["sitemap", FaSitemap, C.teal],
    ["shield", FaShieldAlt, C.violet],
    ["target", FaBullseye, C.red],
    ["clipboard", FaClipboardCheck, C.green],
    ["bulb", FaLightbulb, C.orange],
    ["hand", FaHandPointRight, C.blue],
    ["users", FaUsers, C.teal],
    ["tasks", FaTasks, C.blue],
    ["robot", FaRobot, C.purple],
    ["book", FaBookOpen, C.navy],
    ["arrowBlue", FaArrowRight, C.blue],
    ["arrowWhite", FaArrowRight, C.white],
    ["checkWhite", FaCheckCircle, C.white],
    ["codeWhite", FaCode, C.white],
    ["eyeWhite", FaEye, C.white],
    ["diagramWhite", FaProjectDiagram, C.white],
    ["searchWhite", FaSearch, C.white],
    ["puzzleWhite", FaPuzzlePiece, C.white],
    ["cameraWhite", FaCamera, C.white],
    ["globeWhite", FaGlobe, C.white],
    ["shieldWhite", FaShieldAlt, C.white],
    ["layersWhite", FaLayerGroup, C.white],
    ["robotWhite", FaRobot, C.white],
    ["tasksWhite", FaTasks, C.white],
    ["targetWhite", FaBullseye, C.white],
    ["clipboardWhite", FaClipboardCheck, C.white],
    ["fileWhite", FaFileAlt, C.white],
    ["playWhite", FaPlay, C.white],
  ];
  for (const [name, comp, color] of iconDefs) {
    icons[name] = await iconToBase64Png(comp, color);
  }

  // ════════════════════════════════════════════════════
  // SLIDE 1 — Title
  // ════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    // Decorative top accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.blue }
    });

    // Robot icon
    slide.addImage({ data: icons.robotWhite, x: 4.5, y: 0.8, w: 1, h: 1 });

    // Title
    slide.addText("UI-Test Agent 工作流程", {
      x: 0.5, y: 2.0, w: 9, h: 1,
      fontSize: 40, fontFace: "Arial Black", color: C.white,
      align: "center", bold: true, margin: 0
    });

    // Subtitle
    slide.addText("基于 Playwright 的多层 Agent 架构 UI 测试体系", {
      x: 1.5, y: 3.1, w: 7, h: 0.6,
      fontSize: 18, fontFace: "Calibri", color: C.gray400,
      align: "center", margin: 0
    });

    // Horizontal divider
    slide.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.9, w: 3, h: 0,
      line: { color: C.blue, width: 2 }
    });

    // Five pillars preview
    const pillars = [
      { icon: icons.searchWhite, label: "Discovery" },
      { icon: icons.puzzleWhite, label: "CT" },
      { icon: icons.globeWhite, label: "E2E" },
      { icon: icons.cameraWhite, label: "Visual" },
      { icon: icons.shieldWhite, label: "Governance" },
    ];
    pillars.forEach((p, i) => {
      const cx = 1.2 + i * 1.7;
      slide.addImage({ data: p.icon, x: cx + 0.2, y: 4.3, w: 0.4, h: 0.4 });
      slide.addText(p.label, {
        x: cx - 0.2, y: 4.8, w: 1.2, h: 0.4,
        fontSize: 11, fontFace: "Calibri", color: C.gray400,
        align: "center", margin: 0
      });
    });
  }

  // ════════════════════════════════════════════════════
  // SLIDE 2 — Architecture Overview
  // ════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    // Title bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy }
    });
    slide.addText("Agent 架构总览", {
      x: 0.5, y: 0.1, w: 9, h: 0.7,
      fontSize: 26, fontFace: "Arial Black", color: C.white, margin: 0
    });

    // Entry agent card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 3.2, y: 1.2, w: 3.6, h: 0.8,
      fill: { color: C.blue }, rectRadius: 0.1, shadow: makeShadow()
    });
    slide.addImage({ data: icons.robotWhite, x: 3.5, y: 1.32, w: 0.4, h: 0.4 });
    slide.addText("ui-test 路由 Agent", {
      x: 4.0, y: 1.3, w: 2.6, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.white, bold: true, margin: 0
    });

    // Five arrows going down from entry
    const agents = [
      { label: "Discovery", color: C.purple, icon: icons.searchWhite, x: 0.3 },
      { label: "Component", color: C.green, icon: icons.puzzleWhite, x: 2.2 },
      { label: "E2E", color: C.orange, icon: icons.globeWhite, x: 4.1 },
      { label: "Visual", color: C.red, icon: icons.cameraWhite, x: 6.0 },
      { label: "Governance", color: C.violet, icon: icons.shieldWhite, x: 7.9 },
    ];

    agents.forEach((a) => {
      // Connecting line
      slide.addShape(pres.shapes.LINE, {
        x: a.x + 0.85, y: 2.0, w: 0, h: 0.5,
        line: { color: C.gray400, width: 1.5 }
      });
      // Agent card
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: a.x, y: 2.55, w: 1.7, h: 0.9,
        fill: { color: a.color }, rectRadius: 0.08, shadow: makeShadow()
      });
      slide.addImage({ data: a.icon, x: a.x + 0.6, y: 2.62, w: 0.35, h: 0.35 });
      slide.addText(a.label, {
        x: a.x, y: 3.02, w: 1.7, h: 0.35,
        fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
      });
    });

    // Skills layer
    slide.addText("Skill 层", {
      x: 0.5, y: 3.7, w: 2, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.gray600, bold: true, margin: 0
    });
    slide.addShape(pres.shapes.LINE, {
      x: 0.3, y: 4.05, w: 9.4, h: 0,
      line: { color: C.gray200, width: 1, dashType: "dash" }
    });

    const skills = [
      { label: "playwright-ct", color: C.green },
      { label: "playwright-e2e", color: C.orange },
      { label: "playwright-visual", color: C.red },
      { label: "playwright-config", color: C.gray600 },
      { label: "playwright-azure", color: C.violet },
    ];
    skills.forEach((s, i) => {
      const sx = 0.3 + i * 1.95;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: sx, y: 4.2, w: 1.8, h: 0.5,
        fill: { color: C.white },
        line: { color: s.color, width: 1.5 },
        rectRadius: 0.06
      });
      slide.addText(s.label, {
        x: sx, y: 4.25, w: 1.8, h: 0.4,
        fontSize: 10, fontFace: "Consolas", color: s.color, align: "center", margin: 0
      });
    });

    // Key principle cards at bottom
    const principles = [
      { text: "请求分类 → 路由分发", icon: icons.route },
      { text: "Discovery 共享上下文", icon: icons.search },
      { text: "仅报告不自动修复", icon: icons.clipboard },
    ];
    principles.forEach((p, i) => {
      const px = 0.5 + i * 3.2;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: px, y: 4.95, w: 2.9, h: 0.5,
        fill: { color: C.white }, rectRadius: 0.06, shadow: makeCardShadow()
      });
      slide.addImage({ data: p.icon, x: px + 0.15, y: 5.05, w: 0.3, h: 0.3 });
      slide.addText(p.text, {
        x: px + 0.5, y: 5.0, w: 2.2, h: 0.4,
        fontSize: 11, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });
  }

  // ════════════════════════════════════════════════════
  // SLIDE 3 — Overall Workflow (Flow)
  // ════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy }
    });
    slide.addText("1. 整体工作流程", {
      x: 0.5, y: 0.1, w: 9, h: 0.7,
      fontSize: 26, fontFace: "Arial Black", color: C.white, margin: 0
    });

    // Step 1: User Request
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: 1.2, w: 1.8, h: 0.7,
      fill: { color: C.navy }, rectRadius: 0.08
    });
    slide.addText("用户请求", {
      x: 0.3, y: 1.3, w: 1.8, h: 0.5,
      fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });

    // Arrow 1
    slide.addImage({ data: icons.arrowBlue, x: 2.25, y: 1.35, w: 0.35, h: 0.35 });

    // Step 2: Router
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.8, y: 1.2, w: 1.8, h: 0.7,
      fill: { color: C.blue }, rectRadius: 0.08, shadow: makeShadow()
    });
    slide.addText("ui-test 路由", {
      x: 2.8, y: 1.3, w: 1.8, h: 0.5,
      fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });

    // Arrow 2
    slide.addImage({ data: icons.arrowBlue, x: 4.75, y: 1.35, w: 0.35, h: 0.35 });

    // Step 3: Classify
    slide.addShape(pres.shapes.OVAL, {
      x: 5.3, y: 1.1, w: 1.8, h: 0.9,
      fill: { color: C.white }, line: { color: C.blue, width: 2 }
    });
    slide.addText("请求分类", {
      x: 5.3, y: 1.25, w: 1.8, h: 0.5,
      fontSize: 13, fontFace: "Calibri", color: C.blue, bold: true, align: "center", margin: 0
    });

    // Five routing targets
    const targets = [
      { label: "Discovery Agent", desc: "环境检查 · 框架检测\n路由发现 · 组件清单", color: C.purple },
      { label: "Component Agent", desc: "Props 测试 · 事件测试\n条件渲染 · Provider", color: C.green },
      { label: "E2E Agent", desc: "页面导航 · 表单交互\n用户旅程 · i18n", color: C.orange },
      { label: "Visual Agent", desc: "截图基线 · 回归比对\n响应式 · 多语言", color: C.red },
      { label: "Governance Agent", desc: "Azure 云端 · CI/CD\nPR 门控 · VLM", color: C.violet },
    ];

    targets.forEach((t, i) => {
      const tx = 0.15 + i * 1.96;
      // Target card
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: tx, y: 2.3, w: 1.82, h: 1.4,
        fill: { color: C.white },
        line: { color: t.color, width: 2 },
        rectRadius: 0.08, shadow: makeCardShadow()
      });
      // Colored top strip
      slide.addShape(pres.shapes.RECTANGLE, {
        x: tx + 0.08, y: 2.38, w: 1.66, h: 0.35,
        fill: { color: t.color }
      });
      slide.addText(t.label, {
        x: tx, y: 2.38, w: 1.82, h: 0.35,
        fontSize: 10, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
      });
      slide.addText(t.desc, {
        x: tx + 0.1, y: 2.8, w: 1.62, h: 0.8,
        fontSize: 9, fontFace: "Calibri", color: C.gray600, margin: 0
      });
    });

    // Discovery shared context box
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: 4.0, w: 9.4, h: 1.4,
      fill: { color: C.white },
      line: { color: C.purple, width: 1.5, dashType: "dash" },
      rectRadius: 0.1
    });
    slide.addText("Discovery 共享上下文（所有测试 Agent 依赖）", {
      x: 0.5, y: 4.05, w: 5, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.purple, bold: true, margin: 0
    });

    const discoveryItems = [
      "项目分析报告", "组件清单 & I/O Profile",
      "路由清单", "定位器策略图",
      "用户旅程图", "i18n 检测结果"
    ];
    discoveryItems.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const ix = 0.6 + col * 3.1;
      const iy = 4.45 + row * 0.4;
      slide.addImage({ data: icons.check, x: ix, y: iy + 0.03, w: 0.2, h: 0.2 });
      slide.addText(item, {
        x: ix + 0.28, y: iy, w: 2.6, h: 0.3,
        fontSize: 11, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });
  }

  // ════════════════════════════════════════════════════
  // SLIDE 4 — CT Component Test Workflow
  // ════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.green }
    });
    slide.addImage({ data: icons.puzzleWhite, x: 0.4, y: 0.2, w: 0.45, h: 0.45 });
    slide.addText("2. CT 组件测试流程", {
      x: 1.0, y: 0.1, w: 8, h: 0.7,
      fontSize: 26, fontFace: "Arial Black", color: C.white, margin: 0
    });

    // Phase 1: Discovery Input
    const phaseY = 1.15;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: phaseY, w: 2.8, h: 2.1,
      fill: { color: C.white }, line: { color: C.purple, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.38, y: phaseY + 0.08, w: 2.64, h: 0.35,
      fill: { color: C.purple }
    });
    slide.addText("① Discovery 输入", {
      x: 0.3, y: phaseY + 0.08, w: 2.8, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    const discoveryInputs = [
      "组件文件路径 & 导出名",
      "Props 类型 & 示例值",
      "事件处理器 & 回调签名",
      "Provider 依赖",
      "样式依赖 (Tailwind/CSS)",
    ];
    discoveryInputs.forEach((item, i) => {
      slide.addText("• " + item, {
        x: 0.5, y: phaseY + 0.55 + i * 0.28, w: 2.4, h: 0.25,
        fontSize: 9, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });

    // Arrow
    slide.addImage({ data: icons.arrowBlue, x: 3.25, y: 1.95, w: 0.35, h: 0.35 });

    // Phase 2: Prerequisites
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 3.8, y: phaseY, w: 2.5, h: 2.1,
      fill: { color: C.white }, line: { color: C.green, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 3.88, y: phaseY + 0.08, w: 2.34, h: 0.35,
      fill: { color: C.green }
    });
    slide.addText("② 前置检查", {
      x: 3.8, y: phaseY + 0.08, w: 2.5, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    const prereqs = [
      "CT 包安装检查",
      "playwright-ct.config.ts",
      "生成 test fixtures",
      "Provider 包装器",
      "  Router / i18n / Context",
    ];
    prereqs.forEach((item, i) => {
      slide.addText("• " + item, {
        x: 4.0, y: phaseY + 0.55 + i * 0.28, w: 2.1, h: 0.25,
        fontSize: 9, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });

    // Arrow
    slide.addImage({ data: icons.arrowBlue, x: 6.45, y: 1.95, w: 0.35, h: 0.35 });

    // Phase 3: Test Generation
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 7.0, y: phaseY, w: 2.7, h: 2.1,
      fill: { color: C.white }, line: { color: C.blue, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 7.08, y: phaseY + 0.08, w: 2.54, h: 0.35,
      fill: { color: C.blue }
    });
    slide.addText("③ 生成测试", {
      x: 7.0, y: phaseY + 0.08, w: 2.7, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    const testTypes = [
      "渲染测试 (mount → visible)",
      "Props 测试 (值 → 输出)",
      "事件测试 (触发 → 回调)",
      "条件渲染测试",
      "Provider 依赖测试",
    ];
    testTypes.forEach((item, i) => {
      slide.addText("• " + item, {
        x: 7.2, y: phaseY + 0.55 + i * 0.28, w: 2.3, h: 0.25,
        fontSize: 9, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });

    // I/O Coverage Rules section
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: 3.5, w: 6.0, h: 1.85,
      fill: { color: C.white }, line: { color: C.teal, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.38, y: 3.58, w: 5.84, h: 0.35,
      fill: { color: C.teal }
    });
    slide.addText("④ I/O 覆盖规则", {
      x: 0.3, y: 3.58, w: 6.0, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    const ioRules = [
      ["每个 Input (Prop) 至少 1 个代表值", "Union/Enum 至少测试 2 个不同值"],
      ["每个 Output 必须有对应断言", "Optional Props 测试有/无两种情况"],
      ["每个 Event 测试回调 & 载荷类型", "Array Props 测试空/单/多元素"],
    ];
    ioRules.forEach((row, ri) => {
      row.forEach((item, ci) => {
        const ix = 0.5 + ci * 3.0;
        const iy = 4.05 + ri * 0.38;
        slide.addImage({ data: icons.check, x: ix, y: iy + 0.02, w: 0.18, h: 0.18 });
        slide.addText(item, {
          x: ix + 0.25, y: iy, w: 2.6, h: 0.28,
          fontSize: 9, fontFace: "Calibri", color: C.gray800, margin: 0
        });
      });
    });

    // Execution & Report
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.6, y: 3.5, w: 3.1, h: 1.85,
      fill: { color: C.navy }, rectRadius: 0.08, shadow: makeShadow()
    });
    slide.addText("⑤ 执行 & 报告", {
      x: 6.6, y: 3.6, w: 3.1, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    slide.addText([
      { text: "执行命令:", options: { breakLine: true, bold: true, fontSize: 9, color: C.gray400 } },
      { text: "npx playwright test", options: { breakLine: true, fontSize: 9, color: C.white, fontFace: "Consolas" } },
      { text: "  -c playwright-ct.config.ts", options: { breakLine: true, fontSize: 9, color: C.white, fontFace: "Consolas" } },
      { text: "", options: { breakLine: true, fontSize: 6 } },
      { text: "仅本地执行", options: { breakLine: true, fontSize: 9, color: C.orange, bold: true } },
      { text: "不支持 Azure 云端", options: { breakLine: true, fontSize: 9, color: C.orange } },
      { text: "失败仅报告，不自动修复", options: { fontSize: 9, color: C.gray400 } },
    ], { x: 6.8, y: 4.0, w: 2.7, h: 1.2, margin: 0, fontFace: "Calibri" });
  }

  // ════════════════════════════════════════════════════
  // SLIDE 5 — E2E Testing Workflow
  // ════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.orange }
    });
    slide.addImage({ data: icons.globeWhite, x: 0.4, y: 0.2, w: 0.45, h: 0.45 });
    slide.addText("3. E2E 端到端测试流程", {
      x: 1.0, y: 0.1, w: 8, h: 0.7,
      fontSize: 26, fontFace: "Arial Black", color: C.white, margin: 0
    });

    // Discovery inputs
    const phaseY = 1.15;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: phaseY, w: 2.8, h: 2.2,
      fill: { color: C.white }, line: { color: C.purple, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.38, y: phaseY + 0.08, w: 2.64, h: 0.35,
      fill: { color: C.purple }
    });
    slide.addText("① Discovery 输入", {
      x: 0.3, y: phaseY + 0.08, w: 2.8, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    const e2eInputs = [
      "路由清单",
      "关键导航动作",
      "交互元素清单",
      "定位器策略图",
      "用户旅程图（可选）",
      "I/O 探测结果",
    ];
    e2eInputs.forEach((item, i) => {
      slide.addText("• " + item, {
        x: 0.5, y: phaseY + 0.55 + i * 0.26, w: 2.4, h: 0.23,
        fontSize: 9, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });

    // Arrow
    slide.addImage({ data: icons.arrowBlue, x: 3.25, y: 2.0, w: 0.35, h: 0.35 });

    // Test Generation - Three layers
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 3.8, y: phaseY, w: 5.9, h: 2.2,
      fill: { color: C.white }, line: { color: C.orange, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 3.88, y: phaseY + 0.08, w: 5.74, h: 0.35,
      fill: { color: C.orange }
    });
    slide.addText("② 三层测试生成", {
      x: 3.8, y: phaseY + 0.08, w: 5.9, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });

    // Layer cards inside
    const layers = [
      { title: "页面级测试", items: ["页面加载", "导航验证", "表单交互", "状态变化"], color: C.orange },
      { title: "i18n 测试", items: ["语言切换", "文本验证", "多元素变化"], color: C.teal },
      { title: "用户旅程测试", items: ["中间 checkpoint", "状态传递验证", "反向导航"], color: C.blue },
    ];
    layers.forEach((l, i) => {
      const lx = 4.0 + i * 1.9;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: lx, y: phaseY + 0.55, w: 1.72, h: 1.5,
        fill: { color: C.gray100 }, rectRadius: 0.06
      });
      slide.addText(l.title, {
        x: lx, y: phaseY + 0.6, w: 1.72, h: 0.25,
        fontSize: 10, fontFace: "Calibri", color: l.color, bold: true, align: "center", margin: 0
      });
      l.items.forEach((item, j) => {
        slide.addText("· " + item, {
          x: lx + 0.1, y: phaseY + 0.9 + j * 0.25, w: 1.5, h: 0.2,
          fontSize: 8, fontFace: "Calibri", color: C.gray600, margin: 0
        });
      });
    });

    // Locator Rules
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: 3.6, w: 4.6, h: 1.8,
      fill: { color: C.white }, line: { color: C.blue, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.38, y: 3.68, w: 4.44, h: 0.35,
      fill: { color: C.blue }
    });
    slide.addText("③ 定位器规则", {
      x: 0.3, y: 3.68, w: 4.6, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    const locRules = [
      "优先语义定位器: getByRole / getByText / getByLabel",
      "多匹配时使用作用域: page.getByRole('main')...",
      "Landmark 区域内定位: main / header / footer",
      "参考定位器策略图选择最佳定位器",
    ];
    locRules.forEach((item, i) => {
      slide.addImage({ data: icons.target, x: 0.5, y: 4.15 + i * 0.3, w: 0.18, h: 0.18 });
      slide.addText(item, {
        x: 0.75, y: 4.12 + i * 0.3, w: 3.9, h: 0.25,
        fontSize: 9, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });

    // I/O Aware Rules + Execution
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.1, y: 3.6, w: 4.6, h: 2.05,
      fill: { color: C.navy }, rectRadius: 0.08, shadow: makeShadow()
    });
    slide.addText("④ I/O 感知 & 执行", {
      x: 5.1, y: 3.68, w: 4.6, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });
    const ioE2e = [
      "每个交互元素至少一个测试",
      "搜索/过滤 → 断言结果集变化",
      "导航触发 → 断言 URL + 目标内容",
      "使用类型解析的真实值",
    ];
    ioE2e.forEach((item, i) => {
      slide.addImage({ data: icons.checkWhite, x: 5.3, y: 4.15 + i * 0.3, w: 0.18, h: 0.18 });
      slide.addText(item, {
        x: 5.55, y: 4.12 + i * 0.3, w: 3.9, h: 0.25,
        fontSize: 9, fontFace: "Calibri", color: C.gray200, margin: 0
      });
    });

    // Command
    slide.addText("npx playwright test --project=e2e", {
      x: 5.3, y: 5.32, w: 4.2, h: 0.25,
      fontSize: 9, fontFace: "Consolas", color: C.orange, margin: 0
    });
  }

  // ════════════════════════════════════════════════════
  // SLIDE 6 — Visual Regression Workflow
  // ════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.red }
    });
    slide.addImage({ data: icons.cameraWhite, x: 0.4, y: 0.2, w: 0.45, h: 0.45 });
    slide.addText("4. 视觉回归测试流程", {
      x: 1.0, y: 0.1, w: 8, h: 0.7,
      fontSize: 26, fontFace: "Arial Black", color: C.white, margin: 0
    });

    // Two main modes
    const modeY = 1.15;

    // Baseline Generation
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.3, y: modeY, w: 4.6, h: 2.8,
      fill: { color: C.white }, line: { color: C.blue, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.38, y: modeY + 0.08, w: 4.44, h: 0.35,
      fill: { color: C.blue }
    });
    slide.addText("模式 A: 基线生成", {
      x: 0.3, y: modeY + 0.08, w: 4.6, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });

    const baselineSteps = [
      { num: "1", text: "确定覆盖范围（路由 × 视口 × 语言 × 状态）" },
      { num: "2", text: "生成 visual spec 文件" },
      { num: "3", text: "等待稳定化 (waitForLoadState)" },
      { num: "4", text: "首次执行生成基线截图 (--update-snapshots)" },
      { num: "5", text: "人工审查基线截图" },
      { num: "6", text: "提交审批后的基线到仓库" },
    ];
    baselineSteps.forEach((s, i) => {
      const sy = modeY + 0.6 + i * 0.35;
      slide.addShape(pres.shapes.OVAL, {
        x: 0.55, y: sy + 0.02, w: 0.25, h: 0.25,
        fill: { color: C.blue }
      });
      slide.addText(s.num, {
        x: 0.55, y: sy + 0.02, w: 0.25, h: 0.25,
        fontSize: 8, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0
      });
      slide.addText(s.text, {
        x: 0.9, y: sy, w: 3.8, h: 0.28,
        fontSize: 9, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });

    // Regression Comparison
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.1, y: modeY, w: 4.6, h: 2.8,
      fill: { color: C.white }, line: { color: C.red, width: 1.5 },
      rectRadius: 0.08, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.18, y: modeY + 0.08, w: 4.44, h: 0.35,
      fill: { color: C.red }
    });
    slide.addText("模式 B: 回归比对", {
      x: 5.1, y: modeY + 0.08, w: 4.6, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
    });

    const regressionSteps = [
      { num: "1", text: "执行视觉测试（当前截图 vs 基线）" },
      { num: "2", text: "自动检测像素差异" },
      { num: "3a", text: "无差异 → 视觉回归通过 ✅", color: C.green },
      { num: "3b", text: "有差异 → 分析差异类型", color: C.red },
      { num: "4a", text: "预期变更 → 标记需更新基线", color: C.orange },
      { num: "4b", text: "疑似回归 → 报告不自动修复", color: C.red },
    ];
    regressionSteps.forEach((s, i) => {
      const sy = modeY + 0.6 + i * 0.35;
      slide.addShape(pres.shapes.OVAL, {
        x: 5.35, y: sy + 0.02, w: 0.25, h: 0.25,
        fill: { color: C.red }
      });
      slide.addText(s.num, {
        x: 5.35, y: sy + 0.02, w: 0.25, h: 0.25,
        fontSize: 7, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0
      });
      slide.addText(s.text, {
        x: 5.7, y: sy, w: 3.8, h: 0.28,
        fontSize: 9, fontFace: "Calibri", color: s.color || C.gray800, margin: 0
      });
    });

    // Coverage Layers
    const covY = 4.2;
    slide.addText("可组合覆盖层", {
      x: 0.5, y: covY, w: 3, h: 0.3,
      fontSize: 12, fontFace: "Calibri", color: C.gray800, bold: true, margin: 0
    });

    const coverageLayers = [
      { icon: icons.desktop, label: "路由默认状态", desc: "每页默认视口截图" },
      { icon: icons.layers, label: "响应式视口", desc: "375 / 768 / 1280" },
      { icon: icons.cogs, label: "状态变体", desc: "过滤器 / 弹窗展开" },
      { icon: icons.globe, label: "i18n 变体", desc: "多语言截图对比" },
    ];
    coverageLayers.forEach((c, i) => {
      const cx = 0.3 + i * 2.45;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx, y: covY + 0.35, w: 2.25, h: 0.9,
        fill: { color: C.white }, rectRadius: 0.06, shadow: makeCardShadow()
      });
      slide.addImage({ data: c.icon, x: cx + 0.15, y: covY + 0.48, w: 0.3, h: 0.3 });
      slide.addText(c.label, {
        x: cx + 0.5, y: covY + 0.42, w: 1.6, h: 0.25,
        fontSize: 10, fontFace: "Calibri", color: C.gray800, bold: true, margin: 0
      });
      slide.addText(c.desc, {
        x: cx + 0.5, y: covY + 0.68, w: 1.6, h: 0.25,
        fontSize: 8, fontFace: "Calibri", color: C.gray600, margin: 0
      });
    });
  }

  // ════════════════════════════════════════════════════
  // SLIDE 7 — Governance & Escalation
  // ════════════════════════════════════════════════════
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.violet }
    });
    slide.addImage({ data: icons.shieldWhite, x: 0.4, y: 0.2, w: 0.45, h: 0.45 });
    slide.addText("治理层 & 升级机制", {
      x: 1.0, y: 0.1, w: 8, h: 0.7,
      fontSize: 26, fontFace: "Arial Black", color: C.white, margin: 0
    });

    // Default path vs Governance path
    slide.addText("默认路径（日常测试）", {
      x: 0.5, y: 1.15, w: 4, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: C.green, bold: true, margin: 0
    });

    const defaultItems = [
      "本地 Playwright 执行 CT / E2E / Visual",
      "原生截图比对 (toHaveScreenshot)",
      "本地基线管理",
      "测试失败仅报告，不自动修复",
    ];
    defaultItems.forEach((item, i) => {
      slide.addImage({ data: icons.check, x: 0.5, y: 1.6 + i * 0.3, w: 0.2, h: 0.2 });
      slide.addText(item, {
        x: 0.8, y: 1.58 + i * 0.3, w: 4.0, h: 0.25,
        fontSize: 11, fontFace: "Calibri", color: C.gray800, margin: 0
      });
    });

    // Arrow indicating escalation
    slide.addText("显式请求时升级 →", {
      x: 4.3, y: 1.55, w: 1.15, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: C.violet, bold: true, italic: true, margin: 0
    });

    // Governance domains
    slide.addText("治理路径（按需激活）", {
      x: 5.5, y: 1.15, w: 4, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: C.violet, bold: true, margin: 0
    });

    const govDomains = [
      { title: "Azure Playwright Workspace", desc: "云端浏览器执行 E2E + Visual", color: C.blue },
      { title: "CI/CD 门控", desc: "workflow pass/fail · 制品上传", color: C.orange },
      { title: "VLM 语义审查", desc: "可选 · 需显式启用 · 置信阈值控制", color: C.red },
      { title: "基线权威策略", desc: "本地 vs Azure 二选一 · 不混用", color: C.teal },
    ];
    govDomains.forEach((g, i) => {
      const gy = 1.6 + i * 0.55;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 5.5, y: gy, w: 4.2, h: 0.5,
        fill: { color: C.white }, line: { color: g.color, width: 1.5 },
        rectRadius: 0.06, shadow: makeCardShadow()
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 5.58, y: gy + 0.08, w: 0.08, h: 0.34,
        fill: { color: g.color }
      });
      slide.addText(g.title, {
        x: 5.8, y: gy + 0.02, w: 2.0, h: 0.22,
        fontSize: 10, fontFace: "Calibri", color: C.gray800, bold: true, margin: 0
      });
      slide.addText(g.desc, {
        x: 5.8, y: gy + 0.24, w: 3.7, h: 0.22,
        fontSize: 8, fontFace: "Calibri", color: C.gray600, margin: 0
      });
    });

    // Key Design Principles
    slide.addShape(pres.shapes.LINE, {
      x: 0.3, y: 3.85, w: 9.4, h: 0,
      line: { color: C.gray200, width: 1 }
    });
    slide.addText("核心设计原则", {
      x: 0.5, y: 4.0, w: 4, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
    });

    const principles = [
      { icon: icons.layers, title: "分层解耦", desc: "路由 Agent 分发，专业 Agent 执行，Skill 提供实现指南" },
      { icon: icons.search, title: "共享发现", desc: "Discovery Agent 产出可复用上下文，避免重复探索" },
      { icon: icons.clipboard, title: "仅报告策略", desc: "测试失败输出结构化报告，不自动修改代码" },
      { icon: icons.shield, title: "治理分离", desc: "Azure / CI / VLM 治理与日常测试完全隔离" },
    ];
    principles.forEach((p, i) => {
      const px = 0.3 + i * 2.45;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: px, y: 4.45, w: 2.25, h: 1.0,
        fill: { color: C.white }, rectRadius: 0.06, shadow: makeCardShadow()
      });
      slide.addImage({ data: p.icon, x: px + 0.15, y: 4.55, w: 0.3, h: 0.3 });
      slide.addText(p.title, {
        x: px + 0.5, y: 4.52, w: 1.6, h: 0.25,
        fontSize: 11, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
      });
      slide.addText(p.desc, {
        x: px + 0.15, y: 4.85, w: 1.95, h: 0.5,
        fontSize: 8, fontFace: "Calibri", color: C.gray600, margin: 0
      });
    });
  }

  // ── Write file ──
  const outputPath = "/Users/qifenghou/Codes/UI-test-Demo/docs/presentations/UI-Test-Agent-Workflow.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("Done: " + outputPath);
}

main().catch(err => { console.error(err); process.exit(1); });
