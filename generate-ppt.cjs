const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icons
const {
  FaShieldAlt, FaSearch, FaCode, FaBrowser, FaRoute, FaLayerGroup,
  FaCogs, FaRobot, FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle,
  FaChartBar, FaEye, FaPuzzlePiece, FaProjectDiagram, FaFileAlt,
  FaArrowRight, FaPlay, FaMapSigns, FaUsers, FaStar, FaMicrosoft
} = require("react-icons/fa");

// ─── Color Palette: Midnight Teal ───
const C = {
  bg_dark:    "0F172A",  // slide bg dark
  bg_card:    "1E293B",  // card bg
  bg_light:   "F8FAFC",  // light slide bg
  primary:    "0EA5E9",  // sky-500 teal accent
  primary_dk: "0284C7",  // darker teal
  accent:     "10B981",  // emerald-500
  accent2:    "F59E0B",  // amber-500
  text_white: "FFFFFF",
  text_light: "CBD5E1",  // slate-300
  text_muted: "94A3B8",  // slate-400
  text_dark:  "1E293B",  // dark text on light bg
  divider:    "334155",  // subtle divider
  gradient_l: "0F172A",  // gradient start
  gradient_r: "1E3A5F",  // gradient end
  red:        "EF4444",
  green:      "22C55E",
};

// ─── Helpers ───
function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color || `#${C.primary}`, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

const mkShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.25 });
const mkCardShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.20 });

function addPageNum(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 8.5, y: 5.2, w: 1.2, h: 0.3, fontSize: 9,
    color: C.text_muted, align: "right", fontFace: "Calibri"
  });
}

function addDarkBg(slide) {
  slide.background = { color: C.bg_dark };
}

function addLightBg(slide) {
  slide.background = { color: C.bg_light };
}

function addSectionTitle(slide, num, subtitle) {
  slide.addText(num, {
    x: 0.6, y: 0.35, w: 0.5, h: 0.5, fontSize: 14, bold: true,
    color: C.bg_dark, fontFace: "Calibri",
    fill: { color: C.primary }, align: "center", valign: "middle",
    shape: "roundRect", rectRadius: 0.08
  });
  slide.addText(subtitle, {
    x: 1.25, y: 0.35, w: 7, h: 0.5, fontSize: 11,
    color: C.text_muted, fontFace: "Calibri", valign: "middle"
  });
}

async function addIconCircle(slide, icon, color, x, y, size) {
  const iconData = await iconToBase64Png(icon, `#${color}`, 256);
  const circleSize = size || 0.5;
  slide.addShape("ellipse", {
    x: x, y: y, w: circleSize, h: circleSize,
    fill: { color: C.bg_card }
  });
  const pad = circleSize * 0.2;
  slide.addImage({
    data: iconData, x: x + pad, y: y + pad,
    w: circleSize - pad * 2, h: circleSize - pad * 2
  });
}

// ─── MAIN ───
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "UI Testing Agent";
  pres.title = "AI 驱动的 UI 自动化测试方案";
  const TOTAL = 22;

  // ═══════════════ SLIDE 1: Title ═══════════════
  let s = pres.addSlide();
  addDarkBg(s);
  // Accent bar top
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });

  s.addText("AI 驱动的 UI 自动化测试方案", {
    x: 0.8, y: 1.2, w: 8.4, h: 1.2, fontSize: 38, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("基于 Playwright + AI Agent 的智能测试生成与执行", {
    x: 0.8, y: 2.4, w: 8.4, h: 0.6, fontSize: 18,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "从需求到测试用例的全自动化流程", options: { breakLine: true } },
    { text: "静态分析 + 运行时探测 + 用户旅程驱动", options: { breakLine: true } },
    { text: "支持 E2E / 组件 / 视觉回归三种测试模式" }
  ], {
    x: 0.8, y: 3.3, w: 8.4, h: 1.2, fontSize: 13,
    color: C.text_light, fontFace: "Calibri", lineSpacingMultiple: 1.6, margin: 0
  });
  s.addText("2026.03", {
    x: 0.8, y: 4.9, w: 3, h: 0.4, fontSize: 12,
    color: C.text_muted, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, 1, TOTAL);

  // ═══════════════ SLIDE 2: Agenda ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  s.addText("目录", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 28, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const agenda = [
    { num: "01", title: "背景与挑战", sub: "为什么需要 AI 驱动的 UI 测试" },
    { num: "02", title: "方案架构总览", sub: "Agent + Skills 分层设计" },
    { num: "03", title: "智能发现能力", sub: "静态分析 + 运行时 DOM 探测 + 深度类型解析" },
    { num: "04", title: "用户旅程驱动测试", sub: "从 PRD 到自动化旅程测试" },
    { num: "05", title: "测试生成与执行", sub: "E2E / 组件 / 视觉回归三种模式" },
    { num: "06", title: "智能错误报告", sub: "结构化分析 + 修复建议" },
    { num: "07", title: "云端与 CI/CD", sub: "Azure Playwright Workspace 集成" },
    { num: "08", title: "实际演示与落地路径", sub: "TravelVista 项目实战案例" },
  ];
  for (let i = 0; i < agenda.length; i++) {
    const yBase = 1.3 + i * 0.5;
    s.addText(agenda[i].num, {
      x: 0.8, y: yBase, w: 0.5, h: 0.4, fontSize: 14, bold: true,
      color: C.primary, fontFace: "Calibri", valign: "middle", margin: 0
    });
    s.addText(agenda[i].title, {
      x: 1.5, y: yBase, w: 3, h: 0.4, fontSize: 15, bold: true,
      color: C.text_white, fontFace: "Calibri", valign: "middle", margin: 0
    });
    s.addText(agenda[i].sub, {
      x: 4.6, y: yBase, w: 5, h: 0.4, fontSize: 12,
      color: C.text_muted, fontFace: "Calibri", valign: "middle", margin: 0
    });
  }
  addPageNum(s, 2, TOTAL);

  // ═══════════════ SLIDE 3: Section 1 - 背景与挑战 ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  s.addText("01", {
    x: 3.5, y: 1.5, w: 3, h: 1.0, fontSize: 60, bold: true,
    color: C.primary, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("背景与挑战", {
    x: 1, y: 2.5, w: 8, h: 0.8, fontSize: 32, bold: true,
    color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("为什么需要 AI 驱动的 UI 测试", {
    x: 1, y: 3.3, w: 8, h: 0.5, fontSize: 15,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, 3, TOTAL);

  // ═══════════════ SLIDE 4: Pain Points ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "01", "背景与挑战");

  s.addText("传统 UI 测试的四大痛点", {
    x: 0.6, y: 1.0, w: 9, h: 0.6, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const pains = [
    { icon: FaSearch, title: "定位器脆弱", desc: "DOM 结构变化导致大量测试失败\n维护成本随项目增长指数上升" },
    { icon: FaFileAlt, title: "测试与需求脱节", desc: "手写测试凭经验，无法保证\n覆盖 PRD 中所有用户旅程" },
    { icon: FaUsers, title: "人力瓶颈", desc: "专职 QA 编写速度有限\n回归测试重复劳动占比 60%+" },
    { icon: FaExclamationTriangle, title: "环境不一致", desc: "本地/CI 环境差异导致\n\"在我机器上是好的\" 问题" },
  ];
  for (let i = 0; i < 4; i++) {
    const xBase = 0.6 + i * 2.3;
    s.addShape("roundRect", {
      x: xBase, y: 1.8, w: 2.1, h: 2.8, fill: { color: C.bg_card },
      rectRadius: 0.08, shadow: mkCardShadow()
    });
    // red top line
    s.addShape("rect", { x: xBase, y: 1.8, w: 2.1, h: 0.04, fill: { color: C.red } });
    s.addText(pains[i].title, {
      x: xBase + 0.15, y: 2.0, w: 1.8, h: 0.45, fontSize: 14, bold: true,
      color: C.text_white, fontFace: "Calibri", margin: 0
    });
    s.addText(pains[i].desc, {
      x: xBase + 0.15, y: 2.5, w: 1.8, h: 1.8, fontSize: 11,
      color: C.text_light, fontFace: "Calibri", margin: 0, lineSpacingMultiple: 1.5
    });
  }
  addPageNum(s, 4, TOTAL);

  // ═══════════════ SLIDE 5: AI Opportunity ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "01", "背景与挑战");

  s.addText("AI Agent 的范式转变", {
    x: 0.6, y: 1.0, w: 9, h: 0.6, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // before vs after columns
  s.addShape("roundRect", {
    x: 0.6, y: 1.8, w: 4.2, h: 3.2, fill: { color: C.bg_card },
    rectRadius: 0.08, shadow: mkCardShadow()
  });
  s.addShape("rect", { x: 0.6, y: 1.8, w: 4.2, h: 0.04, fill: { color: C.red } });
  s.addText("传统方式", {
    x: 0.8, y: 1.95, w: 3.8, h: 0.4, fontSize: 15, bold: true,
    color: C.red, fontFace: "Calibri", margin: 0
  });
  const beforeItems = [
    "手动分析页面结构 → 手写定位器",
    "凭经验选择测试场景 → 覆盖随机",
    "独立维护测试代码 → 与源码脱节",
    "本地跑通 ≠ CI 跑通 → 环境问题",
    "测试失败 → 人工排查 → 手动修复",
  ];
  s.addText(beforeItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < beforeItems.length - 1, color: C.text_light }
  })), {
    x: 0.9, y: 2.5, w: 3.6, h: 2.2, fontSize: 11,
    fontFace: "Calibri", lineSpacingMultiple: 1.7, margin: 0
  });

  s.addShape("roundRect", {
    x: 5.2, y: 1.8, w: 4.2, h: 3.2, fill: { color: C.bg_card },
    rectRadius: 0.08, shadow: mkCardShadow()
  });
  s.addShape("rect", { x: 5.2, y: 1.8, w: 4.2, h: 0.04, fill: { color: C.accent } });
  s.addText("AI Agent 方式", {
    x: 5.4, y: 1.95, w: 3.8, h: 0.4, fontSize: 15, bold: true,
    color: C.accent, fontFace: "Calibri", margin: 0
  });
  const afterItems = [
    "自动分析源码 + 运行时 DOM 探测",
    "从 PRD 提取旅程 → 覆盖有据可查",
    "类型解析生成精准 mock 数据",
    "Azure 云端统一环境 → 结果一致",
    "结构化错误报告 + 智能修复建议",
  ];
  s.addText(afterItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < afterItems.length - 1, color: C.text_light }
  })), {
    x: 5.5, y: 2.5, w: 3.6, h: 2.2, fontSize: 11,
    fontFace: "Calibri", lineSpacingMultiple: 1.7, margin: 0
  });
  addPageNum(s, 5, TOTAL);

  // ═══════════════ SLIDE 6: Section 2 - Architecture ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  s.addText("02", {
    x: 3.5, y: 1.5, w: 3, h: 1.0, fontSize: 60, bold: true,
    color: C.primary, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("方案架构总览", {
    x: 1, y: 2.5, w: 8, h: 0.8, fontSize: 32, bold: true,
    color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("Agent + Skills 分层设计", {
    x: 1, y: 3.3, w: 8, h: 0.5, fontSize: 15,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, 6, TOTAL);

  // ═══════════════ SLIDE 7: Architecture Diagram ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "02", "方案架构总览");

  s.addText("系统架构", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // Core Agent box
  s.addShape("roundRect", {
    x: 0.4, y: 1.65, w: 5.4, h: 3.5, fill: { color: "162033" },
    rectRadius: 0.1, line: { color: C.primary, width: 1.5 }
  });
  s.addText("Core Agent (737 行)", {
    x: 0.6, y: 1.7, w: 5, h: 0.35, fontSize: 12, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });

  const coreModules = [
    { label: "A  环境检查", color: C.accent2, y: 2.15, w: 2.4 },
    { label: "B  静态项目分析", color: C.primary, y: 2.65, w: 2.4 },
    { label: "B4a 深度类型解析", color: C.primary_dk, y: 3.15, w: 2.4 },
    { label: "B9 旅程图构建", color: C.accent, y: 3.65, w: 2.4 },
    { label: "B+ 运行时 DOM 探测", color: C.primary, y: 2.15, w: 2.7, x: 3 },
    { label: "B+3a I/O 交互探测", color: C.primary_dk, y: 2.65, w: 2.7, x: 3 },
    { label: "H  智能错误报告", color: C.red, y: 3.65, w: 2.7, x: 3 },
    { label: "Workflow 工作流编排", color: C.accent2, y: 4.15, w: 5.0 },
  ];
  for (const m of coreModules) {
    s.addShape("roundRect", {
      x: m.x || 0.6, y: m.y, w: m.w, h: 0.38,
      fill: { color: C.bg_card }, rectRadius: 0.06,
      line: { color: m.color, width: 1 }
    });
    s.addText(m.label, {
      x: (m.x || 0.6) + 0.1, y: m.y, w: m.w - 0.2, h: 0.38,
      fontSize: 10, color: m.color, fontFace: "Calibri", valign: "middle", margin: 0
    });
  }

  // Arrow
  s.addText("→", {
    x: 5.8, y: 2.8, w: 0.4, h: 0.5, fontSize: 24,
    color: C.primary, fontFace: "Calibri", align: "center", valign: "middle"
  });

  // Skills box
  s.addShape("roundRect", {
    x: 6.2, y: 1.65, w: 3.5, h: 3.5, fill: { color: "162033" },
    rectRadius: 0.1, line: { color: C.accent, width: 1.5 }
  });
  s.addText("Skills (按需加载)", {
    x: 6.4, y: 1.7, w: 3, h: 0.35, fontSize: 12, bold: true,
    color: C.accent, fontFace: "Calibri", margin: 0
  });

  const skills = [
    { label: "E2E 测试生成", y: 2.15 },
    { label: "组件测试", y: 2.65 },
    { label: "视觉回归测试", y: 3.15 },
    { label: "配置文件生成", y: 3.65 },
    { label: "Azure 云端集成", y: 4.15 },
  ];
  for (const sk of skills) {
    s.addShape("roundRect", {
      x: 6.4, y: sk.y, w: 3.1, h: 0.38,
      fill: { color: C.bg_card }, rectRadius: 0.06,
      line: { color: C.accent, width: 1 }
    });
    s.addText(sk.label, {
      x: 6.55, y: sk.y, w: 2.8, h: 0.38,
      fontSize: 10, color: C.accent, fontFace: "Calibri", valign: "middle", margin: 0
    });
  }
  addPageNum(s, 7, TOTAL);

  // ═══════════════ SLIDE 8: Three Testing Modes ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "02", "方案架构总览");

  s.addText("三种测试能力", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const modes = [
    { title: "E2E 端到端测试", color: C.primary, items: ["页面加载与导航", "表单交互与过滤", "i18n 语言切换", "用户旅程测试", "跨页状态传递"] },
    { title: "组件测试", color: C.accent, items: ["隔离挂载组件", "Props 输入验证", "事件回调追踪", "条件渲染分支", "Provider 包装"] },
    { title: "视觉回归测试", color: C.accent2, items: ["全页截图对比", "响应式三视口", "i18n 双语截图", "基准线管理", "Pixel Diff 检测"] },
  ];
  for (let i = 0; i < 3; i++) {
    const xBase = 0.4 + i * 3.15;
    s.addShape("roundRect", {
      x: xBase, y: 1.65, w: 2.95, h: 3.6, fill: { color: C.bg_card },
      rectRadius: 0.08, shadow: mkCardShadow()
    });
    s.addShape("rect", { x: xBase, y: 1.65, w: 2.95, h: 0.04, fill: { color: modes[i].color } });
    s.addText(modes[i].title, {
      x: xBase + 0.2, y: 1.8, w: 2.55, h: 0.45, fontSize: 14, bold: true,
      color: modes[i].color, fontFace: "Calibri", margin: 0
    });
    s.addText(modes[i].items.map((t, j) => ({
      text: t, options: { bullet: true, breakLine: j < modes[i].items.length - 1, color: C.text_light }
    })), {
      x: xBase + 0.25, y: 2.4, w: 2.5, h: 2.6, fontSize: 11,
      fontFace: "Calibri", lineSpacingMultiple: 1.8, margin: 0
    });
  }
  addPageNum(s, 8, TOTAL);

  // ═══════════════ SLIDE 9: Section 3 - Smart Discovery ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  s.addText("03", {
    x: 3.5, y: 1.5, w: 3, h: 1.0, fontSize: 60, bold: true,
    color: C.primary, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("智能发现能力", {
    x: 1, y: 2.5, w: 8, h: 0.8, fontSize: 32, bold: true,
    color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("静态分析 + 运行时 DOM 探测 + 深度类型解析", {
    x: 1, y: 3.3, w: 8, h: 0.5, fontSize: 15,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, 9, TOTAL);

  // ═══════════════ SLIDE 10: Module B Static Analysis ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "03", "智能发现能力");

  s.addText("Module B: 零配置静态分析", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const bSteps = [
    { step: "B1", label: "框架检测", desc: "自动识别 React/Vue/Svelte/Solid" },
    { step: "B2", label: "构建工具", desc: "Vite/Next/Webpack + base path + 端口" },
    { step: "B3", label: "路由发现", desc: "提取全部路由定义和参数" },
    { step: "B4", label: "组件清单", desc: "Props / Events / 依赖 / 条件渲染" },
    { step: "B5", label: "样式系统", desc: "Tailwind / CSS Modules / CSS-in-JS" },
    { step: "B6", label: "i18n 检测", desc: "翻译库 + 语言文件 + 键值命名空间" },
  ];
  for (let i = 0; i < bSteps.length; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const xBase = 0.5 + col * 3.1;
    const yBase = 1.7 + row * 1.7;
    s.addShape("roundRect", {
      x: xBase, y: yBase, w: 2.9, h: 1.4, fill: { color: C.bg_card },
      rectRadius: 0.06, shadow: mkCardShadow()
    });
    s.addText(bSteps[i].step, {
      x: xBase + 0.15, y: yBase + 0.1, w: 0.5, h: 0.3, fontSize: 11, bold: true,
      color: C.bg_dark, fontFace: "Calibri", align: "center", valign: "middle",
      fill: { color: C.primary }, shape: "roundRect", rectRadius: 0.04
    });
    s.addText(bSteps[i].label, {
      x: xBase + 0.75, y: yBase + 0.1, w: 2, h: 0.3, fontSize: 13, bold: true,
      color: C.text_white, fontFace: "Calibri", valign: "middle", margin: 0
    });
    s.addText(bSteps[i].desc, {
      x: xBase + 0.15, y: yBase + 0.55, w: 2.6, h: 0.7, fontSize: 11,
      color: C.text_light, fontFace: "Calibri", margin: 0
    });
  }
  addPageNum(s, 10, TOTAL);

  // ═══════════════ SLIDE 11: Deep Type Resolution ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "03", "智能发现能力");

  s.addText("B4a: 深度类型解析", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // Resolution chain visual
  s.addShape("roundRect", {
    x: 0.5, y: 1.7, w: 9, h: 3.5, fill: { color: C.bg_card },
    rectRadius: 0.08, shadow: mkCardShadow()
  });

  // Chain: DestinationCard → Props → Destination → Category
  const chain = [
    { label: "DestinationCard", sub: "Props", x: 0.7, color: C.primary },
    { label: "destination:", sub: "Destination", x: 2.9, color: C.accent2 },
    { label: "Destination", sub: "types/index.ts", x: 5.1, color: C.accent },
    { label: "category:", sub: "'beach'|'mountain'|'city'|'culture'", x: 7.3, color: C.red },
  ];
  for (let i = 0; i < chain.length; i++) {
    const cx = chain[i].x;
    s.addShape("roundRect", {
      x: cx, y: 2.0, w: 2.0, h: 1.0, fill: { color: "0F172A" },
      rectRadius: 0.06, line: { color: chain[i].color, width: 1.5 }
    });
    s.addText(chain[i].label, {
      x: cx + 0.1, y: 2.05, w: 1.8, h: 0.45, fontSize: 11, bold: true,
      color: chain[i].color, fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(chain[i].sub, {
      x: cx + 0.1, y: 2.5, w: 1.8, h: 0.4, fontSize: 9,
      color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
    });
    if (i < chain.length - 1) {
      s.addText("→", {
        x: cx + 2.0, y: 2.2, w: 0.4, h: 0.5, fontSize: 18,
        color: C.text_muted, fontFace: "Calibri", align: "center", valign: "middle"
      });
    }
  }

  s.addText("输出: Component I/O Profile", {
    x: 0.8, y: 3.3, w: 8.4, h: 0.35, fontSize: 13, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });

  // IO Profile table
  const ioData = [
    [
      { text: "维度", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "内容", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "示例", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
    ],
    ["Inputs (Props)", "解析类型 + 必填 + 样本值", "destination: Destination (required)"],
    ["Inputs (交互)", "可交互元素 + 触发事件", "<button onClick> → 跳转详情"],
    ["Outputs (渲染)", "可见内容 + 来源 + 条件", "destination.name → always"],
    ["Outputs (事件)", "事件 + payload 类型", "onSelect → string (id)"],
  ];
  s.addTable(ioData, {
    x: 0.8, y: 3.75, w: 8.4, h: 1.2,
    fontSize: 9, fontFace: "Calibri", color: C.text_light,
    border: { pt: 0.5, color: C.divider },
    colW: [2, 3, 3.4],
    rowH: [0.25, 0.23, 0.23, 0.23, 0.23],
  });
  addPageNum(s, 11, TOTAL);

  // ═══════════════ SLIDE 12: Runtime DOM Exploration ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "03", "智能发现能力");

  s.addText("Module B+: 运行时 DOM 探测", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  s.addText("为什么需要运行时探测？", {
    x: 0.6, y: 1.6, w: 9, h: 0.35, fontSize: 13, bold: true,
    color: C.accent2, fontFace: "Calibri", margin: 0
  });
  s.addText("静态代码分析无法检测：多个 <nav> 区域、重复链接文字、overlapping ARIA roles", {
    x: 0.6, y: 1.95, w: 9, h: 0.3, fontSize: 11,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });

  const bpSteps = [
    { label: "B+1 启动 Dev Server", desc: "自动运行 npm run dev" },
    { label: "B+2 逐页快照", desc: "Accessibility Tree + 可见文本" },
    { label: "B+3 DOM 结构分析", desc: "Nav/Link/Heading/Form 冲突检测" },
    { label: "B+3a 交互式 I/O 探测", desc: "表单填充 → 观察变化 → 记录" },
    { label: "B+4 构建 Locator Map", desc: "为冲突元素推荐唯一定位器" },
    { label: "B+5 输出报告", desc: "DOM Analysis + I/O Probe Results" },
  ];
  for (let i = 0; i < bpSteps.length; i++) {
    const yBase = 2.45 + i * 0.48;
    s.addShape("roundRect", {
      x: 0.6, y: yBase, w: 0.35, h: 0.35,
      fill: { color: i === 3 ? C.accent : C.primary }, rectRadius: 0.04
    });
    s.addText(String(i + 1), {
      x: 0.6, y: yBase, w: 0.35, h: 0.35, fontSize: 11, bold: true,
      color: C.bg_dark, fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
    s.addText(bpSteps[i].label, {
      x: 1.1, y: yBase, w: 3, h: 0.35, fontSize: 12, bold: true,
      color: C.text_white, fontFace: "Calibri", valign: "middle", margin: 0
    });
    s.addText(bpSteps[i].desc, {
      x: 4.1, y: yBase, w: 5.5, h: 0.35, fontSize: 11,
      color: C.text_light, fontFace: "Calibri", valign: "middle", margin: 0
    });
  }
  addPageNum(s, 12, TOTAL);

  // ═══════════════ SLIDE 13: Locator Strategy Map Example ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "03", "智能发现能力");

  s.addText("Locator Strategy Map 示例", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const locatorData = [
    [
      { text: "元素", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "原始定位器", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "问题", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "推荐定位器", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
    ],
    [
      "Navbar \"目的地\" 链接",
      "getByRole('link', { name: '目的地' })",
      { text: "3 matches", options: { color: C.red } },
      "page.getByRole('main').getByRole('link', { name: '目的地', exact: true })"
    ],
    [
      "\"精心策划\" 标题",
      "getByText('精心策划')",
      { text: "2 matches", options: { color: C.red } },
      "page.getByRole('heading', { name: '精心策划' })"
    ],
    [
      "\"查看全部\" 按钮",
      "getByRole('link', { name: /查看/ })",
      { text: "2 matches", options: { color: C.red } },
      "page.getByRole('main').getByRole('link', { name: '查看全部目的地' })"
    ],
  ];
  s.addTable(locatorData, {
    x: 0.4, y: 1.7, w: 9.2, h: 1.8,
    fontSize: 9, fontFace: "Calibri", color: C.text_light,
    border: { pt: 0.5, color: C.divider },
    colW: [1.8, 2.6, 1.2, 3.6],
    rowH: [0.3, 0.38, 0.38, 0.38],
  });

  // I/O Probe Results example
  s.addText("I/O Probe Results 示例", {
    x: 0.6, y: 3.7, w: 9, h: 0.4, fontSize: 16, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const ioProbeData = [
    [
      { text: "交互", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "目标", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "Before", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "After", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
    ],
    ["输入搜索 \"beach\"", "searchInput", "12 张卡片", { text: "3 张卡片", options: { color: C.accent } }],
    ["点击分类 \"文化\"", "filterButton", "无激活过滤", { text: "文化类高亮", options: { color: C.accent } }],
    ["点击语言切换", "langButton", "中文文本", { text: "English 文本", options: { color: C.accent } }],
  ];
  s.addTable(ioProbeData, {
    x: 0.4, y: 4.15, w: 9.2, h: 1.2,
    fontSize: 10, fontFace: "Calibri", color: C.text_light,
    border: { pt: 0.5, color: C.divider },
    colW: [2.2, 1.8, 2.6, 2.6],
    rowH: [0.28, 0.28, 0.28, 0.28],
  });
  addPageNum(s, 13, TOTAL);

  // ═══════════════ SLIDE 14: Section 4 - User Journey ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  s.addText("04", {
    x: 3.5, y: 1.5, w: 3, h: 1.0, fontSize: 60, bold: true,
    color: C.primary, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("用户旅程驱动测试", {
    x: 1, y: 2.5, w: 8, h: 0.8, fontSize: 32, bold: true,
    color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("从 PRD 到自动化旅程测试", {
    x: 1, y: 3.3, w: 8, h: 0.5, fontSize: 15,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, 14, TOTAL);

  // ═══════════════ SLIDE 15: Journey Graph ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "04", "用户旅程驱动测试");

  s.addText("B9: 旅程图构建流程", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // Flow: PRD → Nav Graph → Journey Paths → Journey Map
  const flow = [
    { label: "PRD 需求提取", sub: "B9a", x: 0.3, color: C.accent2 },
    { label: "导航图分析", sub: "B9b", x: 2.7, color: C.primary },
    { label: "旅程路径提取", sub: "B9c", x: 5.1, color: C.accent },
    { label: "Journey Map", sub: "B9d", x: 7.5, color: C.primary },
  ];
  for (let i = 0; i < flow.length; i++) {
    s.addShape("roundRect", {
      x: flow[i].x, y: 1.7, w: 2.2, h: 0.9, fill: { color: C.bg_card },
      rectRadius: 0.06, line: { color: flow[i].color, width: 1.5 }
    });
    s.addText(flow[i].label, {
      x: flow[i].x + 0.1, y: 1.75, w: 2, h: 0.45, fontSize: 12, bold: true,
      color: flow[i].color, fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(flow[i].sub, {
      x: flow[i].x + 0.1, y: 2.2, w: 2, h: 0.3, fontSize: 10,
      color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
    });
    if (i < flow.length - 1) {
      s.addText("→", {
        x: flow[i].x + 2.15, y: 1.9, w: 0.5, h: 0.4, fontSize: 16,
        color: C.text_muted, fontFace: "Calibri", align: "center", valign: "middle"
      });
    }
  }

  // Navigation Graph example
  s.addText("导航图示例 (TravelVista)", {
    x: 0.6, y: 2.9, w: 9, h: 0.35, fontSize: 13, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });

  const navData = [
    [
      { text: "Source", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "Action", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "Target", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "State", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
    ],
    ["/ (首页)", "点击分类「海滩」", "/destinations?type=beach", "URL: type=beach"],
    ["/ (首页)", "点击目的地卡片", "/destinations/{id}", "Route: id"],
    ["/destinations", "点击卡片", "/destinations/{id}", "Route: id"],
    ["/destinations/{id}", "点击面包屑「目的地」", "/destinations", "—"],
    ["/destinations/{id}", "点击相关推荐", "/destinations/{other}", "Route: id"],
  ];
  s.addTable(navData, {
    x: 0.4, y: 3.35, w: 9.2,
    fontSize: 9, fontFace: "Calibri", color: C.text_light,
    border: { pt: 0.5, color: C.divider },
    colW: [2.0, 2.3, 2.7, 2.2],
    rowH: [0.28, 0.26, 0.26, 0.26, 0.26, 0.26],
  });
  addPageNum(s, 15, TOTAL);

  // ═══════════════ SLIDE 16: Journey Map Example ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "04", "用户旅程驱动测试");

  s.addText("Journey Map: 旅程实例", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // Journey 1 card
  s.addShape("roundRect", {
    x: 0.4, y: 1.65, w: 9.2, h: 2.2, fill: { color: C.bg_card },
    rectRadius: 0.08, shadow: mkCardShadow()
  });
  s.addShape("rect", { x: 0.4, y: 1.65, w: 9.2, h: 0.04, fill: { color: C.accent } });

  s.addText("Journey 1: 浏览 → 筛选 → 查看详情", {
    x: 0.6, y: 1.75, w: 5, h: 0.35, fontSize: 13, bold: true,
    color: C.accent, fontFace: "Calibri", margin: 0
  });
  s.addText("[Priority: Critical]", {
    x: 7.5, y: 1.75, w: 2, h: 0.35, fontSize: 11, bold: true,
    color: C.red, fontFace: "Calibri", align: "right", margin: 0
  });

  const j1Data = [
    [
      { text: "Step", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "Page", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "Action", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "Expected State", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
    ],
    ["1", "/", "页面加载", "Hero + 搜索框可见"],
    ["2", "/", "点击「海滩」分类", "导航到 /destinations?type=beach"],
    ["3", "/destinations", "验证过滤结果", "仅显示海滩类目的地"],
    ["4", "/destinations", "点击「巴厘岛」卡片", "导航到 /destinations/bali"],
    ["5", "/destinations/bali", "查看详情内容", "图片画廊 + 景点 + 实用信息可见"],
    ["6", "/destinations/bali", "面包屑返回", "回到列表页"],
  ];
  s.addTable(j1Data, {
    x: 0.6, y: 2.2, w: 8.8,
    fontSize: 9, fontFace: "Calibri", color: C.text_light,
    border: { pt: 0.5, color: C.divider },
    colW: [0.5, 1.8, 2.5, 4],
    rowH: [0.22, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
  });

  // Coverage Matrix
  s.addText("旅程覆盖率矩阵", {
    x: 0.6, y: 4.0, w: 9, h: 0.35, fontSize: 13, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });

  const covData = [
    [
      { text: "Route", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "J1 浏览详情", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "J2 搜索过滤", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "J3 i18n 切换", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "J4 关于页访问", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
    ],
    ["/", { text: "✓", options: { color: C.green } }, { text: "✓", options: { color: C.green } }, { text: "✓", options: { color: C.green } }, "—"],
    ["/destinations", { text: "✓", options: { color: C.green } }, { text: "✓", options: { color: C.green } }, { text: "✓", options: { color: C.green } }, "—"],
    ["/destinations/:id", { text: "✓", options: { color: C.green } }, "—", "—", "—"],
    ["/about", "—", "—", "—", { text: "✓", options: { color: C.green } }],
  ];
  s.addTable(covData, {
    x: 0.6, y: 4.4, w: 8.8,
    fontSize: 9, fontFace: "Calibri", color: C.text_light,
    border: { pt: 0.5, color: C.divider },
    colW: [1.8, 1.75, 1.75, 1.75, 1.75],
    rowH: [0.22, 0.2, 0.2, 0.2, 0.2],
    align: "center"
  });
  addPageNum(s, 16, TOTAL);

  // ═══════════════ SLIDE 17: Section 5 - Test Generation ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  s.addText("05", {
    x: 3.5, y: 1.5, w: 3, h: 1.0, fontSize: 60, bold: true,
    color: C.primary, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("测试生成与执行", {
    x: 1, y: 2.5, w: 8, h: 0.8, fontSize: 32, bold: true,
    color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("E2E / 组件 / 视觉回归三种模式", {
    x: 1, y: 3.3, w: 8, h: 0.5, fontSize: 15,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, 17, TOTAL);

  // ═══════════════ SLIDE 18: Data-Driven Generation ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "05", "测试生成与执行");

  s.addText("数据驱动的测试代码生成", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // Input data sources
  const sources = [
    { label: "I/O Profiles\n(B4b)", color: C.primary },
    { label: "Journey Map\n(B9d)", color: C.accent },
    { label: "Locator Map\n(B+4)", color: C.accent2 },
    { label: "I/O Probes\n(B+3a)", color: C.primary_dk },
  ];
  for (let i = 0; i < 4; i++) {
    const xBase = 0.4 + i * 2.35;
    s.addShape("roundRect", {
      x: xBase, y: 1.7, w: 2.15, h: 0.7, fill: { color: C.bg_card },
      rectRadius: 0.06, line: { color: sources[i].color, width: 1.2 }
    });
    s.addText(sources[i].label, {
      x: xBase + 0.1, y: 1.72, w: 1.95, h: 0.66, fontSize: 10, bold: true,
      color: sources[i].color, fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
  }

  // Arrow down
  s.addText("▼", {
    x: 4.3, y: 2.45, w: 1.4, h: 0.35, fontSize: 16,
    color: C.primary, fontFace: "Calibri", align: "center"
  });

  // Generated files
  s.addShape("roundRect", {
    x: 0.4, y: 2.9, w: 9.2, h: 2.4, fill: { color: C.bg_card },
    rectRadius: 0.08, shadow: mkCardShadow()
  });
  s.addText("生成的测试文件", {
    x: 0.6, y: 2.95, w: 8.8, h: 0.35, fontSize: 13, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const genFiles = [
    { file: "tests/e2e/home.spec.ts", tests: "6 tests", type: "E2E", color: C.primary },
    { file: "tests/e2e/destinations.spec.ts", tests: "8 tests", type: "E2E", color: C.primary },
    { file: "tests/e2e/destination-detail.spec.ts", tests: "6 tests", type: "E2E", color: C.primary },
    { file: "tests/e2e/user-journey.spec.ts", tests: "4 journeys", type: "Journey", color: C.accent },
    { file: "tests/component/SearchBar.spec.tsx", tests: "5 tests", type: "CT", color: C.accent2 },
    { file: "tests/visual/pages.visual.spec.ts", tests: "12 screenshots", type: "Visual", color: C.red },
  ];
  for (let i = 0; i < genFiles.length; i++) {
    const yBase = 3.4 + i * 0.32;
    s.addText(genFiles[i].type, {
      x: 0.7, y: yBase, w: 0.8, h: 0.25, fontSize: 8, bold: true,
      color: C.bg_dark, fontFace: "Calibri", align: "center", valign: "middle",
      fill: { color: genFiles[i].color }, shape: "roundRect", rectRadius: 0.03
    });
    s.addText(genFiles[i].file, {
      x: 1.7, y: yBase, w: 5.5, h: 0.25, fontSize: 10,
      color: C.text_light, fontFace: "Consolas", valign: "middle", margin: 0
    });
    s.addText(genFiles[i].tests, {
      x: 7.5, y: yBase, w: 1.8, h: 0.25, fontSize: 10,
      color: C.text_muted, fontFace: "Calibri", align: "right", valign: "middle", margin: 0
    });
  }
  addPageNum(s, 18, TOTAL);

  // ═══════════════ SLIDE 19: Module H Error Reporting ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "06", "智能错误报告");

  s.addText("Module H: 结构化错误报告", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  s.addText("⚠️ 核心原则：不自动修复，人机协作", {
    x: 0.6, y: 1.55, w: 9, h: 0.35, fontSize: 13, bold: true,
    color: C.accent2, fontFace: "Calibri", margin: 0
  });

  // Error report structure
  s.addShape("roundRect", {
    x: 0.4, y: 2.05, w: 4.3, h: 3.2, fill: { color: C.bg_card },
    rectRadius: 0.08, shadow: mkCardShadow()
  });
  s.addShape("rect", { x: 0.4, y: 2.05, w: 4.3, h: 0.04, fill: { color: C.red } });
  s.addText("单个错误报告 (H1)", {
    x: 0.6, y: 2.15, w: 3.9, h: 0.35, fontSize: 13, bold: true,
    color: C.red, fontFace: "Calibri", margin: 0
  });

  const errorFields = [
    "Error Type: Strict Mode Violation",
    "Error Message: 完整 Playwright 错误",
    "Failed Locator: getByRole('link', ...)",
    "Expected vs Actual: 1 element / 3 found",
    "Root Cause: 多个 <nav> 包含相同链接",
    "Suggested Fix: Before → After 代码",
    "Confidence: High / Medium / Low",
  ];
  s.addText(errorFields.map((t, i) => ({
    text: t, options: { breakLine: i < errorFields.length - 1, color: C.text_light }
  })), {
    x: 0.6, y: 2.6, w: 3.9, h: 2.4, fontSize: 10,
    fontFace: "Calibri", lineSpacingMultiple: 1.7, margin: 0
  });

  // Summary panel
  s.addShape("roundRect", {
    x: 5.1, y: 2.05, w: 4.5, h: 3.2, fill: { color: C.bg_card },
    rectRadius: 0.08, shadow: mkCardShadow()
  });
  s.addShape("rect", { x: 5.1, y: 2.05, w: 4.5, h: 0.04, fill: { color: C.primary } });
  s.addText("汇总报告 (H2)", {
    x: 5.3, y: 2.15, w: 4.1, h: 0.35, fontSize: 13, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });

  // Stats
  s.addText("36", {
    x: 5.3, y: 2.65, w: 1.3, h: 0.6, fontSize: 32, bold: true,
    color: C.accent, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("Passed", {
    x: 5.3, y: 3.2, w: 1.3, h: 0.3, fontSize: 10,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("0", {
    x: 6.8, y: 2.65, w: 1.3, h: 0.6, fontSize: 32, bold: true,
    color: C.red, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("Failed", {
    x: 6.8, y: 3.2, w: 1.3, h: 0.3, fontSize: 10,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("5.7s", {
    x: 8.3, y: 2.65, w: 1.1, h: 0.6, fontSize: 28, bold: true,
    color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("Duration", {
    x: 8.3, y: 3.2, w: 1.1, h: 0.3, fontSize: 10,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });

  s.addText([
    { text: "修复优先级排序", options: { bold: true, breakLine: true, color: C.text_white } },
    { text: "1. 按影响面降序 — 一个修复解决多个失败", options: { breakLine: true } },
    { text: "2. 同根因失败合并为一组", options: { breakLine: true } },
    { text: "3. 包含 3-5 行代码上下文", options: { breakLine: true } },
    { text: "4. 用户显式要求时才应用修复" }
  ], {
    x: 5.3, y: 3.6, w: 4.1, h: 1.5, fontSize: 10,
    color: C.text_light, fontFace: "Calibri", lineSpacingMultiple: 1.6, margin: 0
  });
  addPageNum(s, 19, TOTAL);

  // ═══════════════ SLIDE 20: Azure Cloud ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "07", "云端与 CI/CD");

  s.addText("Azure Playwright Workspace", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // Comparison table
  const azData = [
    [
      { text: "维度", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "本地执行", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
      { text: "Azure PT 云端", options: { bold: true, color: C.text_white, fill: { color: C.primary_dk } } },
    ],
    ["配置文件", "playwright.config.ts", "playwright.service.config.ts"],
    ["浏览器", "本地二进制", "Azure 托管 (始终最新)"],
    ["并行度", "CPU 核心数", { text: "最多 50 个云端浏览器", options: { color: C.accent } }],
    ["运行环境", "宿主机 OS", { text: "Linux 容器 (一致性)", options: { color: C.accent } }],
    ["成本", "免费", "100 分钟/月免费额度"],
    ["报告", "本地 HTML 报告", { text: "Azure Portal Dashboard", options: { color: C.accent } }],
  ];
  s.addTable(azData, {
    x: 0.4, y: 1.7, w: 9.2,
    fontSize: 10, fontFace: "Calibri", color: C.text_light,
    border: { pt: 0.5, color: C.divider },
    colW: [1.8, 3.5, 3.9],
    rowH: [0.3, 0.28, 0.28, 0.28, 0.28, 0.28, 0.28],
  });

  // CI/CD flow
  s.addText("CI/CD 集成 (GitHub Actions)", {
    x: 0.6, y: 3.9, w: 9, h: 0.35, fontSize: 16, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const ciSteps = ["Push / PR", "npm ci", "Install\nBrowsers", "Run E2E\n(Azure PT)", "Run Visual\n(Azure PT)", "Upload\nReport"];
  for (let i = 0; i < ciSteps.length; i++) {
    const xBase = 0.3 + i * 1.6;
    s.addShape("roundRect", {
      x: xBase, y: 4.4, w: 1.4, h: 0.9, fill: { color: C.bg_card },
      rectRadius: 0.06, line: { color: C.primary, width: 1 }
    });
    s.addText(ciSteps[i], {
      x: xBase + 0.05, y: 4.42, w: 1.3, h: 0.86, fontSize: 9, bold: true,
      color: C.text_light, fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
    if (i < ciSteps.length - 1) {
      s.addText("→", {
        x: xBase + 1.35, y: 4.6, w: 0.3, h: 0.4, fontSize: 13,
        color: C.text_muted, fontFace: "Calibri", align: "center", valign: "middle"
      });
    }
  }
  addPageNum(s, 20, TOTAL);

  // ═══════════════ SLIDE 21: Demo & Results ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });
  addSectionTitle(s, "08", "实际演示与落地路径");

  s.addText("TravelVista 实战成果", {
    x: 0.6, y: 1.0, w: 9, h: 0.5, fontSize: 22, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  // Stats cards
  const stats = [
    { num: "36", label: "E2E 测试\n全部通过", color: C.accent },
    { num: "6", label: "测试文件\n自动生成", color: C.primary },
    { num: "5.7s", label: "总执行时间\nChromium", color: C.accent2 },
    { num: "0", label: "手动编写\n测试代码", color: C.red },
  ];
  for (let i = 0; i < 4; i++) {
    const xBase = 0.4 + i * 2.35;
    s.addShape("roundRect", {
      x: xBase, y: 1.7, w: 2.15, h: 1.5, fill: { color: C.bg_card },
      rectRadius: 0.08, shadow: mkCardShadow()
    });
    s.addText(stats[i].num, {
      x: xBase, y: 1.8, w: 2.15, h: 0.7, fontSize: 36, bold: true,
      color: stats[i].color, fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(stats[i].label, {
      x: xBase, y: 2.5, w: 2.15, h: 0.55, fontSize: 11,
      color: C.text_light, fontFace: "Calibri", align: "center", margin: 0
    });
  }

  // Landing path
  s.addText("三步落地", {
    x: 0.6, y: 3.5, w: 9, h: 0.4, fontSize: 16, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });

  const landing = [
    { step: "1", title: "安装 Agent", desc: "添加 .github/agents/ui-test.agent.md\n+ 5 个 Skill 文件到项目" },
    { step: "2", title: "执行测试", desc: "对话式输入 \"执行E2E测试\"\nAgent 自动完成全流程" },
    { step: "3", title: "查看报告", desc: "本地 HTML 报告\n或 Azure Portal Dashboard" },
  ];
  for (let i = 0; i < 3; i++) {
    const xBase = 0.4 + i * 3.15;
    s.addShape("roundRect", {
      x: xBase, y: 4.0, w: 2.95, h: 1.35, fill: { color: C.bg_card },
      rectRadius: 0.08, shadow: mkCardShadow()
    });
    s.addText(landing[i].step, {
      x: xBase + 0.15, y: 4.1, w: 0.35, h: 0.35, fontSize: 14, bold: true,
      color: C.bg_dark, fontFace: "Calibri", align: "center", valign: "middle",
      fill: { color: C.primary }, shape: "roundRect", rectRadius: 0.04
    });
    s.addText(landing[i].title, {
      x: xBase + 0.6, y: 4.1, w: 2.2, h: 0.35, fontSize: 13, bold: true,
      color: C.text_white, fontFace: "Calibri", valign: "middle", margin: 0
    });
    s.addText(landing[i].desc, {
      x: xBase + 0.15, y: 4.55, w: 2.65, h: 0.7, fontSize: 10,
      color: C.text_light, fontFace: "Calibri", margin: 0, lineSpacingMultiple: 1.5
    });
  }
  addPageNum(s, 21, TOTAL);

  // ═══════════════ SLIDE 22: Thank You ═══════════════
  s = pres.addSlide();
  addDarkBg(s);
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.primary } });

  s.addText("Thank You", {
    x: 1, y: 1.5, w: 8, h: 1.0, fontSize: 42, bold: true,
    color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("AI 驱动的 UI 自动化测试方案", {
    x: 1, y: 2.5, w: 8, h: 0.5, fontSize: 16,
    color: C.primary, fontFace: "Calibri", align: "center", margin: 0
  });

  // Divider
  s.addShape("rect", { x: 3.5, y: 3.2, w: 3, h: 0.02, fill: { color: C.divider } });

  s.addText([
    { text: "github.com/nickhou1983/UI-test-Demo", options: { breakLine: true, color: C.text_light } },
    { text: "Powered by Playwright + AI Agent", options: { color: C.text_muted } },
  ], {
    x: 1, y: 3.5, w: 8, h: 1.0, fontSize: 13,
    fontFace: "Calibri", align: "center", lineSpacingMultiple: 1.8, margin: 0
  });
  addPageNum(s, 22, TOTAL);

  // ═══════════════ WRITE ═══════════════
  const fileName = "UI-Testing-Agent-Client-Presentation.pptx";
  await pres.writeFile({ fileName: `/Users/qifenghou/Codes/UI-test-Demo/${fileName}` });
  console.log(`✅ Generated: ${fileName} (${TOTAL} slides)`);
}

main().catch(console.error);
