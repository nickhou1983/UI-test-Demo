const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

const {
  FaReact, FaVuejs, FaCode, FaCubes, FaEye, FaBook, FaCheckCircle,
  FaArrowRight, FaLayerGroup, FaGlobe, FaCogs, FaChartBar,
  FaPuzzlePiece, FaGamepad, FaSearch, FaRobot, FaCloudUploadAlt,
  FaGithub, FaExchangeAlt, FaSitemap, FaFileCode, FaPalette,
  FaProjectDiagram, FaShieldAlt, FaPlay, FaUsers, FaStar,
  FaImage, FaCamera, FaMobileAlt, FaDesktop, FaServer
} = require("react-icons/fa");

// ─── Color Palette: Ocean Gradient (前端技术主题) ───
const C = {
  bg_dark:    "0B1120",
  bg_card:    "1A2332",
  bg_light:   "F0F4F8",
  primary:    "3B82F6",  // blue-500
  primary_dk: "2563EB",
  accent:     "10B981",  // emerald-500
  accent2:    "F59E0B",  // amber-500
  accent3:    "8B5CF6",  // violet-500
  react:      "61DAFB",  // React blue
  vue:        "42B883",  // Vue green
  storybook:  "FF4785",  // Storybook pink
  playwright: "2EAD33",  // Playwright green
  text_white: "FFFFFF",
  text_light: "CBD5E1",
  text_muted: "94A3B8",
  text_dark:  "1E293B",
  divider:    "334155",
  red:        "EF4444",
  green:      "22C55E",
};

const TOTAL = 25;

// ─── Helpers ───
function renderIconSvg(Icon, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color, size: String(size) })
  );
}

async function iconToBase64Png(Icon, color, size = 256) {
  const svg = renderIconSvg(Icon, color || `#${C.primary}`, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

const mkShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.25 });
const mkCardShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.18 });

function addPageNum(s, n) {
  s.addText(`${n} / ${TOTAL}`, {
    x: 8.5, y: 5.2, w: 1.2, h: 0.3, fontSize: 9,
    color: C.text_muted, align: "right", fontFace: "Calibri"
  });
}

function darkBg(s) { s.background = { color: C.bg_dark }; }
function lightBg(s) { s.background = { color: C.bg_light }; }

function topBar(s, color) {
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: color || C.primary } });
}

function sectionBadge(s, num, subtitle) {
  s.addText(num, {
    x: 0.6, y: 0.35, w: 0.5, h: 0.5, fontSize: 14, bold: true,
    color: C.bg_dark, fontFace: "Calibri",
    fill: { color: C.primary }, align: "center", valign: "middle",
    shape: "roundRect", rectRadius: 0.08
  });
  s.addText(subtitle, {
    x: 1.25, y: 0.35, w: 7.5, h: 0.5, fontSize: 11,
    color: C.text_muted, fontFace: "Calibri", valign: "middle"
  });
}

async function iconCircle(s, icon, color, x, y, sz) {
  const data = await iconToBase64Png(icon, `#${color}`, 256);
  const r = sz || 0.45;
  s.addShape("ellipse", { x, y, w: r, h: r, fill: { color: C.bg_card } });
  const p = r * 0.22;
  s.addImage({ data, x: x + p, y: y + p, w: r - p * 2, h: r - p * 2 });
}

function card(s, x, y, w, h, opts) {
  s.addShape("rect", {
    x, y, w, h,
    fill: { color: opts?.fill || C.bg_card },
    shadow: mkCardShadow(),
    ...(opts?.rectRadius ? { rectRadius: opts.rectRadius } : {})
  });
}

function slideTitle(s, text, opts) {
  s.addText(text, {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7, fontSize: 26, bold: true,
    color: opts?.dark ? C.text_dark : C.text_white, fontFace: "Calibri", margin: 0
  });
}

// ─── MAIN ───
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Frontend Testing Guide";
  pres.title = "前端组件化开发与 UI 视觉测试";
  let s, n = 0;

  // ═══════════════════════════════════════════════════
  // SLIDE 1: Title
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  s.addText("前端组件化开发与 UI 视觉测试", {
    x: 0.8, y: 1.0, w: 8.4, h: 1.2, fontSize: 36, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("从 DOM 到 Components，从 Storybook 到视觉回归测试", {
    x: 0.8, y: 2.2, w: 8.4, h: 0.6, fontSize: 17,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "React / Vue 组件化开发核心概念", options: { breakLine: true } },
    { text: "Storybook 组件文档化与隔离开发", options: { breakLine: true } },
    { text: "主流 UI 视觉回归测试工具全景" }
  ], {
    x: 0.8, y: 3.2, w: 8.4, h: 1.0, fontSize: 13,
    color: C.text_light, fontFace: "Calibri", lineSpacingMultiple: 1.6, margin: 0
  });
  s.addText("2026.03", {
    x: 0.8, y: 4.9, w: 3, h: 0.3, fontSize: 12,
    color: C.text_muted, fontFace: "Calibri", margin: 0
  });
  await iconCircle(s, FaReact, C.react, 8.2, 1.2, 0.6);
  await iconCircle(s, FaVuejs, C.vue, 8.9, 1.9, 0.5);
  await iconCircle(s, FaEye, C.storybook, 8.4, 2.5, 0.45);
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 2: 目录
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  slideTitle(s, "目录");
  const agenda = [
    { num: "01", title: "前端组件化基础", sub: "DOM 与 Component 的关系", icon: FaLayerGroup, clr: C.primary },
    { num: "02", title: "React / Vue 核心概念", sub: "组件的核心元素与语法对照", icon: FaCode, clr: C.react },
    { num: "03", title: "组件分类全景", sub: "展示/逻辑/布局/导航/输入/展示/反馈组件", icon: FaCubes, clr: C.vue },
    { num: "04", title: "Storybook 介绍", sub: "组件的独立工作台 + 活文档 + 测试平台", icon: FaBook, clr: C.storybook },
    { num: "05", title: "Storybook 与 React/Vue", sub: "使用差异与最佳实践", icon: FaExchangeAlt, clr: C.accent2 },
    { num: "06", title: "UI 视觉测试工具全景", sub: "Playwright / Chromatic / Percy / Applitools", icon: FaEye, clr: C.accent },
    { num: "07", title: "工具选择与总结", sub: "推荐方案与完整工作流", icon: FaCheckCircle, clr: C.green },
  ];
  for (let i = 0; i < agenda.length; i++) {
    const yBase = 1.2 + i * 0.58;
    await iconCircle(s, agenda[i].icon, agenda[i].clr, 0.8, yBase, 0.4);
    s.addText(agenda[i].num, {
      x: 1.35, y: yBase, w: 0.45, h: 0.4, fontSize: 14, bold: true,
      color: C.primary, fontFace: "Calibri", valign: "middle"
    });
    s.addText(agenda[i].title, {
      x: 1.8, y: yBase, w: 3, h: 0.4, fontSize: 15, bold: true,
      color: C.text_white, fontFace: "Calibri", valign: "middle"
    });
    s.addText(agenda[i].sub, {
      x: 4.8, y: yBase, w: 4.5, h: 0.4, fontSize: 11,
      color: C.text_muted, fontFace: "Calibri", valign: "middle"
    });
  }
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 3: 章节封面 - 前端组件化基础
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s, C.primary);
  s.addText("01", {
    x: 0.8, y: 1.5, w: 1.5, h: 1.5, fontSize: 64, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0, transparency: 30
  });
  s.addText("前端组件化基础", {
    x: 2.5, y: 1.6, w: 6, h: 0.9, fontSize: 34, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("DOM 与 Component 的关系", {
    x: 2.5, y: 2.5, w: 6, h: 0.5, fontSize: 16,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 4: 什么是 DOM
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "01", "前端组件化基础");
  slideTitle(s, "什么是 DOM？");

  // 左侧说明
  s.addText("DOM = Document Object Model", {
    x: 0.8, y: 1.2, w: 4.2, h: 0.5, fontSize: 16, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "浏览器将 HTML 解析后生成的树形结构", options: { breakLine: true, bullet: true } },
    { text: "每个 HTML 标签都是一个 DOM 节点", options: { breakLine: true, bullet: true } },
    { text: "浏览器用它来计算布局、绘制像素", options: { breakLine: true, bullet: true } },
    { text: "响应用户交互（点击、滚动）", options: { bullet: true } },
  ], {
    x: 0.8, y: 1.8, w: 4.2, h: 2.0, fontSize: 13,
    color: C.text_light, fontFace: "Calibri", paraSpaceAfter: 8, margin: 0
  });

  // 右侧代码示例
  card(s, 5.3, 1.2, 4.2, 3.5);
  s.addText("浏览器中的 DOM 树", {
    x: 5.6, y: 1.35, w: 3.6, h: 0.35, fontSize: 11, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "<body>", options: { breakLine: true } },
    { text: "  <div id=\"app\">", options: { breakLine: true } },
    { text: "    <nav class=\"navbar\">", options: { breakLine: true } },
    { text: "      <a href=\"/\">首页</a>", options: { breakLine: true } },
    { text: "    </nav>", options: { breakLine: true } },
    { text: "    <main>", options: { breakLine: true } },
    { text: "      <div class=\"card\">", options: { breakLine: true } },
    { text: "        <h3>巴黎</h3>", options: { breakLine: true } },
    { text: "      </div>", options: { breakLine: true } },
    { text: "    </main>", options: { breakLine: true } },
    { text: "  </div>", options: { breakLine: true } },
    { text: "</body>" },
  ], {
    x: 5.6, y: 1.8, w: 3.6, h: 2.8, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  s.addText("你在浏览器 Elements 面板中看到的就是 DOM", {
    x: 0.8, y: 4.6, w: 8.4, h: 0.4, fontSize: 12, italic: true,
    color: C.accent2, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 5: 什么是组件
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "01", "前端组件化基础");
  slideTitle(s, "什么是组件（Component）？");

  s.addText("组件 = 可复用的 UI 构建块", {
    x: 0.8, y: 1.2, w: 5, h: 0.5, fontSize: 16, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: '一个函数/对象，描述\u201c在某些数据下 UI 应该长什么样\u201d', options: { breakLine: true, bullet: true } },
    { text: "组件本身不存在于页面上（浏览器看不到 <Card>）", options: { breakLine: true, bullet: true } },
    { text: "组件渲染出的 <div>、<nav> 等才是真实 DOM", options: { bullet: true } },
  ], {
    x: 0.8, y: 1.8, w: 5, h: 1.5, fontSize: 13,
    color: C.text_light, fontFace: "Calibri", paraSpaceAfter: 8, margin: 0
  });

  // React 示例
  card(s, 0.8, 3.3, 4.0, 1.8);
  s.addText("React 组件", {
    x: 1.0, y: 3.4, w: 3.6, h: 0.3, fontSize: 11, bold: true,
    color: C.react, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "function Card({ title }) {", options: { breakLine: true } },
    { text: "  return <div>{title}</div>", options: { breakLine: true } },
    { text: "}" },
  ], {
    x: 1.0, y: 3.75, w: 3.6, h: 1.2, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  // Vue 示例
  card(s, 5.2, 3.3, 4.3, 1.8);
  s.addText("Vue 组件", {
    x: 5.4, y: 3.4, w: 3.9, h: 0.3, fontSize: 11, bold: true,
    color: C.vue, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "<template>", options: { breakLine: true } },
    { text: "  <div>{{ title }}</div>", options: { breakLine: true } },
    { text: "</template>", options: { breakLine: true } },
    { text: "<script setup>", options: { breakLine: true } },
    { text: "defineProps(['title'])", options: { breakLine: true } },
    { text: "</script>" },
  ], {
    x: 5.4, y: 3.75, w: 3.9, h: 1.2, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 6: DOM 与组件的三层关系
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "01", "前端组件化基础");
  slideTitle(s, "三层关系：Component → Virtual DOM → Real DOM");

  const layers = [
    { title: "Component", sub: "你写的代码\n(JSX / .vue)", color: C.primary, icon: FaCode, x: 0.8 },
    { title: "Virtual DOM", sub: "框架内部维护的\n轻量级 JS 对象", color: C.accent2, icon: FaSitemap, x: 3.6 },
    { title: "Real DOM", sub: "浏览器渲染的\nHTML 元素树", color: C.accent, icon: FaGlobe, x: 6.4 },
  ];
  for (const l of layers) {
    card(s, l.x, 1.3, 2.5, 2.8);
    await iconCircle(s, l.icon, l.color, l.x + 0.95, 1.5, 0.6);
    s.addText(l.title, {
      x: l.x + 0.15, y: 2.3, w: 2.2, h: 0.4, fontSize: 15, bold: true,
      color: l.color, fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(l.sub, {
      x: l.x + 0.15, y: 2.75, w: 2.2, h: 0.9, fontSize: 11,
      color: C.text_light, fontFace: "Calibri", align: "center", margin: 0
    });
  }

  // Arrows between layers
  const arrowData = await iconToBase64Png(FaArrowRight, `#${C.text_muted}`, 256);
  s.addImage({ data: arrowData, x: 3.15, y: 2.3, w: 0.4, h: 0.4 });
  s.addImage({ data: arrowData, x: 5.95, y: 2.3, w: 0.4, h: 0.4 });

  s.addText(`组件是\u201c蓝图\u201d，DOM 是\u201c实物\u201d。组件描述\u201c要什么\u201d，DOM 是\u201c最终呈现的东西\u201d`, {
    x: 0.8, y: 4.5, w: 8.4, h: 0.5, fontSize: 13, italic: true,
    color: C.accent2, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 7: 类比理解
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "01", "前端组件化基础");
  slideTitle(s, "类比理解");

  const analogies = [
    { concept: "Component", analogy: "建筑图纸", desc: "可复用，描述结构", color: C.primary },
    { concept: "Virtual DOM", analogy: "3D 模型", desc: "轻量预览，计算差异", color: C.accent2 },
    { concept: "Real DOM", analogy: "实体建筑", desc: "真正矗立在那里", color: C.accent },
  ];
  for (let i = 0; i < analogies.length; i++) {
    const x = 0.8 + i * 3.0;
    card(s, x, 1.3, 2.7, 1.8);
    s.addText(analogies[i].concept, {
      x: x + 0.2, y: 1.45, w: 2.3, h: 0.35, fontSize: 14, bold: true,
      color: analogies[i].color, fontFace: "Calibri", margin: 0
    });
    s.addText(analogies[i].analogy, {
      x: x + 0.2, y: 1.9, w: 2.3, h: 0.45, fontSize: 20, bold: true,
      color: C.text_white, fontFace: "Calibri", margin: 0
    });
    s.addText(analogies[i].desc, {
      x: x + 0.2, y: 2.4, w: 2.3, h: 0.4, fontSize: 11,
      color: C.text_muted, fontFace: "Calibri", margin: 0
    });
  }

  // 关键要点
  card(s, 0.8, 3.5, 8.4, 1.4);
  s.addText("关键要点", {
    x: 1.0, y: 3.6, w: 8, h: 0.35, fontSize: 13, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  const points = [
    "组件不等于 DOM — 组件是 JS 函数，DOM 是浏览器节点",
    "一个组件可以渲染 0 个、1 个或多个 DOM 节点",
    "组件复用 ≠ DOM 复用 — 每次使用组件都创建新 DOM 实例",
    "Virtual DOM 负责对比差异，最小化真实 DOM 更新",
  ];
  s.addText(points.map((p, i) => ({
    text: p,
    options: { bullet: true, breakLine: i < points.length - 1 }
  })), {
    x: 1.0, y: 4.0, w: 8, h: 0.85, fontSize: 11,
    color: C.text_light, fontFace: "Calibri", paraSpaceAfter: 4, margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 8: 章节封面 - React/Vue 核心概念
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s, C.react);
  s.addText("02", {
    x: 0.8, y: 1.5, w: 1.5, h: 1.5, fontSize: 64, bold: true,
    color: C.react, fontFace: "Calibri", margin: 0, transparency: 30
  });
  s.addText("React / Vue 核心概念", {
    x: 2.5, y: 1.6, w: 6, h: 0.9, fontSize: 34, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("组件的核心元素与语法对照", {
    x: 2.5, y: 2.5, w: 6, h: 0.5, fontSize: 16,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 9: 组件核心元素总览
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "02", "React / Vue 核心概念");
  slideTitle(s, "组件核心元素总览");

  const elements = [
    { name: "模板/JSX", desc: "描述 UI 结构", icon: FaFileCode, clr: C.primary },
    { name: "状态 State", desc: "驱动 UI 变化的数据", icon: FaCogs, clr: C.accent },
    { name: "Props", desc: "父组件传入的参数", icon: FaArrowRight, clr: C.accent2 },
    { name: "事件 Events", desc: "用户交互的响应", icon: FaGamepad, clr: C.storybook },
    { name: "生命周期", desc: "创建→挂载→更新→销毁", icon: FaProjectDiagram, clr: C.accent3 },
    { name: "样式 Styles", desc: "CSS / Scoped / Tailwind", icon: FaPalette, clr: C.react },
  ];
  for (let i = 0; i < elements.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 3.0;
    const y = 1.3 + row * 1.8;
    card(s, x, y, 2.7, 1.5);
    await iconCircle(s, elements[i].icon, elements[i].clr, x + 0.2, y + 0.2, 0.45);
    s.addText(elements[i].name, {
      x: x + 0.8, y: y + 0.2, w: 1.7, h: 0.35, fontSize: 13, bold: true,
      color: C.text_white, fontFace: "Calibri", margin: 0
    });
    s.addText(elements[i].desc, {
      x: x + 0.8, y: y + 0.55, w: 1.7, h: 0.7, fontSize: 10,
      color: C.text_muted, fontFace: "Calibri", margin: 0
    });
  }
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 10: React vs Vue 语法对照表
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "02", "React / Vue 核心概念");
  slideTitle(s, "React vs Vue 语法对照");

  const headerRow = [
    { text: "元素", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "React", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "Vue", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
  ];
  const rows = [
    ["UI 描述", "JSX", "Template"],
    ["状态", "useState", "ref / reactive"],
    ["计算值", "useMemo", "computed"],
    ["属性", "props (函数参数)", "defineProps"],
    ["事件", "onClick={fn}", "@click=\"fn\""],
    ["子传父", "props 传回调", "defineEmits"],
    ["双向绑定", "受控组件模式", "v-model"],
    ["生命周期", "useEffect", "onMounted/watch"],
    ["路由", "react-router", "vue-router"],
    ["全局状态", "Zustand/Context", "Pinia"],
  ];
  const tableData = [headerRow, ...rows.map(r => r.map(t => ({
    text: t, options: { fontSize: 10, color: C.text_light, fontFace: "Calibri" }
  })))];
  s.addTable(tableData, {
    x: 0.8, y: 1.2, w: 8.4, colW: [2.0, 3.2, 3.2],
    border: { pt: 0.5, color: C.divider },
    rowH: 0.34,
    autoPage: false
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 11: 模板/JSX 对比
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "02", "React / Vue 核心概念");
  slideTitle(s, "模板 / JSX — 描述 UI 长什么样");

  // React JSX
  card(s, 0.8, 1.3, 4.0, 3.2);
  s.addText("React — JSX", {
    x: 1.0, y: 1.4, w: 3.6, h: 0.3, fontSize: 12, bold: true,
    color: C.react, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "return (", options: { breakLine: true } },
    { text: "  <div className=\"card\">", options: { breakLine: true } },
    { text: "    {isLoading", options: { breakLine: true } },
    { text: "      ? <Spinner />", options: { breakLine: true } },
    { text: "      : <Content data={data} />}", options: { breakLine: true } },
    { text: "    {items.map(item =>", options: { breakLine: true } },
    { text: "      <Item key={item.id} />", options: { breakLine: true } },
    { text: "    )}", options: { breakLine: true } },
    { text: "  </div>", options: { breakLine: true } },
    { text: ")" },
  ], {
    x: 1.0, y: 1.8, w: 3.6, h: 2.5, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  // Vue Template
  card(s, 5.2, 1.3, 4.3, 3.2);
  s.addText("Vue — Template", {
    x: 5.4, y: 1.4, w: 3.9, h: 0.3, fontSize: 12, bold: true,
    color: C.vue, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "<template>", options: { breakLine: true } },
    { text: "  <div class=\"card\">", options: { breakLine: true } },
    { text: "    <Spinner v-if=\"isLoading\" />", options: { breakLine: true } },
    { text: "    <Content v-else :data=\"data\" />", options: { breakLine: true } },
    { text: "    <Item", options: { breakLine: true } },
    { text: "      v-for=\"item in items\"", options: { breakLine: true } },
    { text: "      :key=\"item.id\"", options: { breakLine: true } },
    { text: "    />", options: { breakLine: true } },
    { text: "  </div>", options: { breakLine: true } },
    { text: "</template>" },
  ], {
    x: 5.4, y: 1.8, w: 3.9, h: 2.5, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  s.addText(`核心思想一致：声明式渲染 \u2014 告诉框架\u201c要什么\u201d，框架负责\u201c怎么做\u201d`, {
    x: 0.8, y: 4.7, w: 8.4, h: 0.4, fontSize: 12, italic: true,
    color: C.accent2, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 12: 状态与事件
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "02", "React / Vue 核心概念");
  slideTitle(s, "状态（State）与 事件（Events）");

  // State 对比
  card(s, 0.8, 1.2, 4.0, 1.7);
  s.addText("状态管理", {
    x: 1.0, y: 1.3, w: 3.6, h: 0.3, fontSize: 12, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "// React", options: { breakLine: true, color: C.text_muted } },
    { text: "const [count, setCount]", options: { breakLine: true } },
    { text: "  = useState(0)", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "// Vue", options: { breakLine: true, color: C.text_muted } },
    { text: "const count = ref(0)" },
  ], {
    x: 1.0, y: 1.65, w: 3.6, h: 1.1, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  // Event 对比
  card(s, 5.2, 1.2, 4.3, 1.7);
  s.addText("事件处理", {
    x: 5.4, y: 1.3, w: 3.9, h: 0.3, fontSize: 12, bold: true,
    color: C.storybook, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "// React: 事件就是 Props", options: { breakLine: true, color: C.text_muted } },
    { text: "<Child onSave={fn} />", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "// Vue: emit 机制", options: { breakLine: true, color: C.text_muted } },
    { text: "<Child @save=\"fn\" />", options: { breakLine: true } },
    { text: "emit('save', data)" },
  ], {
    x: 5.4, y: 1.65, w: 3.9, h: 1.1, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  // Props 与生命周期
  card(s, 0.8, 3.2, 4.0, 1.7);
  s.addText("Props — 父传子", {
    x: 1.0, y: 3.3, w: 3.6, h: 0.3, fontSize: 12, bold: true,
    color: C.accent2, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "// React: 函数参数", options: { breakLine: true, color: C.text_muted } },
    { text: "function Card({ title }) {...}", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "// Vue: defineProps", options: { breakLine: true, color: C.text_muted } },
    { text: "const props = defineProps({", options: { breakLine: true } },
    { text: "  title: String })" },
  ], {
    x: 1.0, y: 3.65, w: 3.6, h: 1.1, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  card(s, 5.2, 3.2, 4.3, 1.7);
  s.addText("生命周期", {
    x: 5.4, y: 3.3, w: 3.9, h: 0.3, fontSize: 12, bold: true,
    color: C.accent3, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "// React", options: { breakLine: true, color: C.text_muted } },
    { text: "useEffect(() => { ... }, [])", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "// Vue", options: { breakLine: true, color: C.text_muted } },
    { text: "onMounted(() => { ... })", options: { breakLine: true } },
    { text: "onUnmounted(() => { ... })" },
  ], {
    x: 5.4, y: 3.65, w: 3.9, h: 1.1, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 13: 章节封面 - 组件分类
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s, C.vue);
  s.addText("03", {
    x: 0.8, y: 1.5, w: 1.5, h: 1.5, fontSize: 64, bold: true,
    color: C.vue, fontFace: "Calibri", margin: 0, transparency: 30
  });
  s.addText("组件分类全景", {
    x: 2.5, y: 1.6, w: 6, h: 0.9, fontSize: 34, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("展示 / 逻辑 / 布局 / 导航 / 输入 / 展示 / 反馈", {
    x: 2.5, y: 2.5, w: 6, h: 0.5, fontSize: 16,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 14: 按职责分类
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "03", "组件分类全景");
  slideTitle(s, "按职责分类");

  const roles = [
    { title: "UI 展示组件", sub: "（哑组件）", desc: "只负责渲染 UI\n接收 Props → 输出 UI\n无状态或极少状态", clr: C.primary, icon: FaPalette },
    { title: "容器/逻辑组件", sub: "（智能组件）", desc: "管理状态，调用 API\n把数据传给展示组件\n不关心渲染细节", clr: C.accent2, icon: FaCogs },
    { title: "页面组件", sub: "（路由级别）", desc: "对应一个 URL 路径\n组合多个子组件\n构成完整页面", clr: C.accent, icon: FaDesktop },
  ];
  for (let i = 0; i < roles.length; i++) {
    const x = 0.8 + i * 3.0;
    card(s, x, 1.3, 2.7, 3.1);
    await iconCircle(s, roles[i].icon, roles[i].clr, x + 0.95, 1.5, 0.6);
    s.addText(roles[i].title, {
      x: x + 0.2, y: 2.3, w: 2.3, h: 0.35, fontSize: 14, bold: true,
      color: roles[i].clr, fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(roles[i].sub, {
      x: x + 0.2, y: 2.65, w: 2.3, h: 0.3, fontSize: 10,
      color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(roles[i].desc, {
      x: x + 0.3, y: 3.0, w: 2.1, h: 1.0, fontSize: 11,
      color: C.text_light, fontFace: "Calibri", margin: 0
    });
  }
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 15: 按功能分类
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "03", "组件分类全景");
  slideTitle(s, "按功能分类（UI 组件库标准分类）");

  const funcs = [
    { cat: "布局", examples: "Layout, Grid, Container, Flex, Sidebar", clr: C.primary },
    { cat: "导航", examples: "Navbar, Tabs, Breadcrumb, Pagination, Menu", clr: C.react },
    { cat: "数据录入", examples: "Input, Select, Checkbox, DatePicker, Upload", clr: C.accent },
    { cat: "数据展示", examples: "Card, Table, List, Carousel, Avatar, Tag", clr: C.accent2 },
    { cat: "反馈", examples: "Modal, Toast, Alert, Spinner, Skeleton, Progress", clr: C.storybook },
    { cat: "通用", examples: "Button, Icon, Typography", clr: C.accent3 },
  ];
  const headerRow2 = [
    { text: "分类", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 12 } },
    { text: "典型组件", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 12 } },
  ];
  const funcRows = funcs.map(f => [
    { text: f.cat, options: { fontSize: 12, color: f.clr, bold: true, fontFace: "Calibri" } },
    { text: f.examples, options: { fontSize: 11, color: C.text_light, fontFace: "Calibri" } },
  ]);
  s.addTable([headerRow2, ...funcRows], {
    x: 0.8, y: 1.2, w: 8.4, colW: [1.8, 6.6],
    border: { pt: 0.5, color: C.divider },
    rowH: 0.5,
    autoPage: false
  });

  s.addText("参考: Ant Design (70+)  |  MUI (60+)  |  Element Plus (70+)  |  shadcn/ui (40+)", {
    x: 0.8, y: 4.7, w: 8.4, h: 0.4, fontSize: 11, italic: true,
    color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 16: 章节封面 - Storybook
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s, C.storybook);
  s.addText("04", {
    x: 0.8, y: 1.5, w: 1.5, h: 1.5, fontSize: 64, bold: true,
    color: C.storybook, fontFace: "Calibri", margin: 0, transparency: 30
  });
  s.addText("Storybook 介绍", {
    x: 2.5, y: 1.6, w: 6, h: 0.9, fontSize: 34, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("组件的独立工作台 + 活文档 + 测试平台", {
    x: 2.5, y: 2.5, w: 6, h: 0.5, fontSize: 16,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 17: Storybook 是什么
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "04", "Storybook 介绍");
  slideTitle(s, "Storybook 是什么？");

  s.addText("开源的 UI 组件开发与文档化工具", {
    x: 0.8, y: 1.2, w: 8.4, h: 0.5, fontSize: 16, bold: true,
    color: C.storybook, fontFace: "Calibri", margin: 0
  });
  s.addText("在隔离环境中独立开发、测试和展示 UI 组件，无需启动整个应用", {
    x: 0.8, y: 1.7, w: 8.4, h: 0.4, fontSize: 13,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });

  const features = [
    { name: "Stories", desc: "每个组件的不同状态/变体", icon: FaBook, clr: C.storybook },
    { name: "Controls", desc: "实时调整 Props 参数", icon: FaGamepad, clr: C.primary },
    { name: "Actions", desc: "记录事件回调日志", icon: FaPlay, clr: C.accent },
    { name: "Docs", desc: "自动生成组件 API 文档", icon: FaFileCode, clr: C.accent2 },
    { name: "Viewport", desc: "模拟不同屏幕尺寸", icon: FaMobileAlt, clr: C.accent3 },
    { name: "A11y", desc: "内置可访问性检查", icon: FaShieldAlt, clr: C.green },
  ];
  for (let i = 0; i < features.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 3.0;
    const y = 2.3 + row * 1.3;
    card(s, x, y, 2.7, 1.1);
    await iconCircle(s, features[i].icon, features[i].clr, x + 0.15, y + 0.1, 0.38);
    s.addText(features[i].name, {
      x: x + 0.65, y: y + 0.1, w: 1.8, h: 0.35, fontSize: 12, bold: true,
      color: C.text_white, fontFace: "Calibri", margin: 0
    });
    s.addText(features[i].desc, {
      x: x + 0.65, y: y + 0.45, w: 1.8, h: 0.5, fontSize: 10,
      color: C.text_muted, fontFace: "Calibri", margin: 0
    });
  }
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 18: Storybook 类比
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "04", "Storybook 介绍");
  slideTitle(s, `React/Vue 负责\u201c造\u201d组件，Storybook 负责\u201c晒\u201d组件`);

  // 左 - React/Vue
  card(s, 0.8, 1.3, 3.8, 3.0);
  s.addText("React / Vue", {
    x: 1.0, y: 1.45, w: 3.4, h: 0.35, fontSize: 15, bold: true,
    color: C.react, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("= 厨房 + 食材 + 烹饪方法", {
    x: 1.0, y: 1.85, w: 3.4, h: 0.35, fontSize: 12,
    color: C.accent2, fontFace: "Calibri", align: "center", margin: 0
  });
  const leftPoints = [
    "用来构建组件的框架/库",
    "组件的逻辑、渲染、状态管理",
    "产出：可运行的应用",
    "必须有（没它组件不存在）",
  ];
  s.addText(leftPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < leftPoints.length - 1 } })), {
    x: 1.0, y: 2.3, w: 3.4, h: 1.5, fontSize: 11,
    color: C.text_light, fontFace: "Calibri", paraSpaceAfter: 6, margin: 0
  });

  // 右 - Storybook
  card(s, 5.2, 1.3, 4.3, 3.0);
  s.addText("Storybook", {
    x: 5.4, y: 1.45, w: 3.9, h: 0.35, fontSize: 15, bold: true,
    color: C.storybook, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("= 试菜台 + 菜品展示柜", {
    x: 5.4, y: 1.85, w: 3.9, h: 0.35, fontSize: 12,
    color: C.accent2, fontFace: "Calibri", align: "center", margin: 0
  });
  const rightPoints = [
    "展示和测试组件的工具",
    "组件的隔离预览、文档、调试",
    "产出：组件文档站 + 测试报告",
    "可选的（没它应用照样跑）",
  ];
  s.addText(rightPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < rightPoints.length - 1 } })), {
    x: 5.4, y: 2.3, w: 3.9, h: 1.5, fontSize: 11,
    color: C.text_light, fontFace: "Calibri", paraSpaceAfter: 6, margin: 0
  });

  s.addText("两者是互补关系，不是竞争关系", {
    x: 0.8, y: 4.5, w: 8.4, h: 0.5, fontSize: 14, bold: true,
    color: C.accent2, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 19: 章节封面 - Storybook + React/Vue 差异
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s, C.accent2);
  s.addText("05", {
    x: 0.8, y: 1.5, w: 1.5, h: 1.5, fontSize: 64, bold: true,
    color: C.accent2, fontFace: "Calibri", margin: 0, transparency: 30
  });
  s.addText("Storybook 与 React/Vue", {
    x: 2.5, y: 1.6, w: 6, h: 0.9, fontSize: 34, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("使用差异与最佳实践", {
    x: 2.5, y: 2.5, w: 6, h: 0.5, fontSize: 16,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 20: Story 写法对比
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "05", "Storybook 与 React/Vue");
  slideTitle(s, "Story 文件写法对比");

  // React Story
  card(s, 0.8, 1.2, 4.0, 3.5);
  s.addText("React (.stories.tsx)", {
    x: 1.0, y: 1.3, w: 3.6, h: 0.3, fontSize: 11, bold: true,
    color: C.react, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "import { Button } from './Button'", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "export const Primary: Story = {", options: { breakLine: true } },
    { text: "  args: { label: '点击' },", options: { breakLine: true } },
    { text: "}", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "// 自定义渲染: 直接写 JSX", options: { breakLine: true, color: C.text_muted } },
    { text: "render: (args) => (", options: { breakLine: true } },
    { text: "  <Button {...args} />", options: { breakLine: true } },
    { text: ")" },
  ], {
    x: 1.0, y: 1.7, w: 3.6, h: 2.8, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });

  // Vue Story
  card(s, 5.2, 1.2, 4.3, 3.5);
  s.addText("Vue (.stories.ts)", {
    x: 5.4, y: 1.3, w: 3.9, h: 0.3, fontSize: 11, bold: true,
    color: C.vue, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "import Button from './Button.vue'", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "export const Primary: Story = {", options: { breakLine: true } },
    { text: "  args: { label: '点击' },", options: { breakLine: true } },
    { text: "}", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "// 自定义渲染: 返回组件选项", options: { breakLine: true, color: C.text_muted } },
    { text: "render: (args) => ({", options: { breakLine: true } },
    { text: "  components: { Button },", options: { breakLine: true } },
    { text: "  template: `<Button v-bind=\"args\"/>`", options: { breakLine: true } },
    { text: "})" }
  ], {
    x: 5.4, y: 1.7, w: 3.9, h: 2.8, fontSize: 10,
    color: C.accent, fontFace: "Consolas", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 21: React vs Vue - Storybook 差异总结
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "05", "Storybook 与 React/Vue");
  slideTitle(s, "Storybook 使用差异总结");

  const diffHeader = [
    { text: "维度", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "React", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "Vue", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
  ];
  const diffs = [
    ["render 函数", "直接写 JSX", "返回组件选项对象"],
    ["Props 传递", "<Comp {...args} />", "<Comp v-bind=\"args\" />"],
    ["事件处理", "props 即事件，自动识别", "需要 argTypes 声明 emit"],
    ["插槽/Children", "children 更简洁", "v-slot 语法稍复杂"],
    ["类型推断", "TSX 原生支持，优秀", ".vue 文件需额外处理"],
    ["社区生态", "最成熟，示例最多", "很好，偶尔需自行适配"],
    ["编写体验", "JSX 天然契合 Storybook", "写法略显冗长"],
  ];
  const diffData = [diffHeader, ...diffs.map(r => r.map(t => ({
    text: t, options: { fontSize: 10, color: C.text_light, fontFace: "Calibri" }
  })))];
  s.addTable(diffData, {
    x: 0.8, y: 1.2, w: 8.4, colW: [2.0, 3.2, 3.2],
    border: { pt: 0.5, color: C.divider },
    rowH: 0.4,
    autoPage: false
  });

  s.addText("结论: Storybook 核心体验非常接近，但 React JSX 写法更简洁自然", {
    x: 0.8, y: 4.7, w: 8.4, h: 0.4, fontSize: 12, italic: true,
    color: C.accent2, fontFace: "Calibri", align: "center", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 22: 章节封面 - 视觉测试工具
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s, C.accent);
  s.addText("06", {
    x: 0.8, y: 1.5, w: 1.5, h: 1.5, fontSize: 64, bold: true,
    color: C.accent, fontFace: "Calibri", margin: 0, transparency: 30
  });
  s.addText("UI 视觉测试工具全景", {
    x: 2.5, y: 1.6, w: 6, h: 0.9, fontSize: 34, bold: true,
    color: C.text_white, fontFace: "Calibri", margin: 0
  });
  s.addText("Playwright / Chromatic / Percy / Applitools / BackstopJS", {
    x: 2.5, y: 2.5, w: 6, h: 0.5, fontSize: 16,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 23: 视觉测试工具详情
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "06", "UI 视觉测试工具全景");
  slideTitle(s, "主流视觉测试工具");

  const tools = [
    { name: "Playwright", type: "开源", desc: "内置 toHaveScreenshot()\n像素级截图对比\n跨浏览器支持", clr: C.playwright, icon: FaPlay },
    { name: "Chromatic", type: "SaaS", desc: "Storybook 生态首选\nWeb Review UI\n自动检测变化", clr: C.storybook, icon: FaCamera },
    { name: "Percy", type: "SaaS", desc: "BrowserStack 旗下\n智能对比算法\n多框架支持", clr: C.accent3, icon: FaEye },
    { name: "Applitools", type: "AI SaaS", desc: "Visual AI 驱动\n像人眼识别差异\n多对比模式", clr: C.accent2, icon: FaRobot },
    { name: "BackstopJS", type: "开源", desc: "完全免费\n配置简单\n内置 HTML 报告", clr: C.primary, icon: FaImage },
    { name: "Lost Pixel", type: "开源+SaaS", desc: "支持 Storybook + 页面\n简洁的 GitHub 集成\n开源版功能完整", clr: C.accent, icon: FaPuzzlePiece },
  ];
  for (let i = 0; i < tools.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 3.0;
    const y = 1.2 + row * 2.0;
    card(s, x, y, 2.7, 1.75);
    await iconCircle(s, tools[i].icon, tools[i].clr, x + 0.15, y + 0.12, 0.38);
    s.addText(tools[i].name, {
      x: x + 0.65, y: y + 0.12, w: 1.5, h: 0.3, fontSize: 13, bold: true,
      color: tools[i].clr, fontFace: "Calibri", margin: 0
    });
    s.addText(tools[i].type, {
      x: x + 1.8, y: y + 0.12, w: 0.7, h: 0.3, fontSize: 9,
      color: C.text_muted, fontFace: "Calibri", margin: 0, align: "right"
    });
    s.addText(tools[i].desc, {
      x: x + 0.15, y: y + 0.55, w: 2.4, h: 1.0, fontSize: 10,
      color: C.text_light, fontFace: "Calibri", margin: 0
    });
  }
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 24: 工具对比表
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  sectionBadge(s, "06", "UI 视觉测试工具全景");
  slideTitle(s, "工具对比一览");

  const toolHeader = [
    { text: "工具", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "类型", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "AI 对比", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "免费方案", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
    { text: "适用场景", options: { fill: { color: C.primary_dk }, color: C.text_white, bold: true, fontSize: 11 } },
  ];
  const toolRows = [
    ["Playwright", "开源", "❌", "✅ 完全免费", "E2E + 组件测试"],
    ["Chromatic", "SaaS", "❌", "✅ 有限额度", "Storybook 组件"],
    ["Percy", "SaaS", "⚠️ 智能算法", "❌", "多框架通用"],
    ["Applitools", "SaaS", "✅ Visual AI", "❌", "企业级大规模"],
    ["BackstopJS", "开源", "❌", "✅ 完全免费", "轻量级快速上手"],
    ["Lost Pixel", "开源+SaaS", "❌", "✅ 开源版", "Storybook + 页面"],
  ];
  const toolData = [toolHeader, ...toolRows.map(r => r.map(t => ({
    text: t, options: { fontSize: 10, color: C.text_light, fontFace: "Calibri" }
  })))];
  s.addTable(toolData, {
    x: 0.8, y: 1.2, w: 8.4, colW: [1.6, 1.2, 1.2, 1.6, 2.8],
    border: { pt: 0.5, color: C.divider },
    rowH: 0.4,
    autoPage: false
  });

  // 推荐
  card(s, 0.8, 4.0, 8.4, 1.0);
  s.addText("选择建议", {
    x: 1.0, y: 4.05, w: 8, h: 0.3, fontSize: 12, bold: true,
    color: C.accent2, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "轻量起步 → Playwright（免费、内置）   ", options: {} },
    { text: "团队 Review → Chromatic/Percy   ", options: {} },
    { text: "AI 减误报 → Applitools", options: {} },
  ], {
    x: 1.0, y: 4.35, w: 8, h: 0.5, fontSize: 11,
    color: C.text_light, fontFace: "Calibri", margin: 0
  });
  addPageNum(s, n);

  // ═══════════════════════════════════════════════════
  // SLIDE 25: 总结
  // ═══════════════════════════════════════════════════
  n++; s = pres.addSlide(); darkBg(s); topBar(s);
  slideTitle(s, "总结 — 完整工作流");

  // 流程
  const flow = [
    { step: "1", title: "组件开发", desc: "React/Vue\n编写组件代码", clr: C.react, icon: FaCode },
    { step: "2", title: "Storybook\n文档化", desc: "隔离预览\n自动文档", clr: C.storybook, icon: FaBook },
    { step: "3", title: "视觉测试", desc: "截图对比\n回归检测", clr: C.accent, icon: FaEye },
    { step: "4", title: "CI/CD\n自动化", desc: "持续集成\n自动验证", clr: C.accent2, icon: FaCloudUploadAlt },
  ];
  for (let i = 0; i < flow.length; i++) {
    const x = 0.6 + i * 2.4;
    card(s, x, 1.2, 2.1, 2.5);
    s.addText(flow[i].step, {
      x: x + 0.1, y: 1.3, w: 0.35, h: 0.35, fontSize: 14, bold: true,
      color: C.bg_dark, fontFace: "Calibri", align: "center", valign: "middle",
      fill: { color: flow[i].clr }, shape: "ellipse",
    });
    await iconCircle(s, flow[i].icon, flow[i].clr, x + 0.7, 1.3, 0.45);
    s.addText(flow[i].title, {
      x: x + 0.1, y: 1.9, w: 1.9, h: 0.6, fontSize: 13, bold: true,
      color: C.text_white, fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(flow[i].desc, {
      x: x + 0.1, y: 2.6, w: 1.9, h: 0.7, fontSize: 10,
      color: C.text_muted, fontFace: "Calibri", align: "center", margin: 0
    });
  }

  // Arrows
  for (let i = 0; i < 3; i++) {
    s.addImage({ data: arrowData, x: 2.55 + i * 2.4, y: 2.2, w: 0.35, h: 0.35 });
  }

  // Bottom takeaways
  card(s, 0.8, 4.0, 8.4, 1.2);
  s.addText("核心要点", {
    x: 1.0, y: 4.05, w: 8, h: 0.3, fontSize: 13, bold: true,
    color: C.primary, fontFace: "Calibri", margin: 0
  });
  s.addText([
    { text: "DOM 是浏览器的标准，Component 是框架的抽象 — 组件渲染出 DOM", options: { bullet: true, breakLine: true } },
    { text: "React/Vue 核心思想一致（组件化 + 响应式 + 声明式），只是语法不同", options: { bullet: true, breakLine: true } },
    { text: `Storybook 是组件的\u201c配套工具\u201d \u2014 造组件用框架，晒组件用 Storybook`, options: { bullet: true, breakLine: true } },
    { text: "视觉测试从 Playwright 免费方案起步，按需升级到 Chromatic/Applitools", options: { bullet: true } },
  ], {
    x: 1.0, y: 4.35, w: 8, h: 0.85, fontSize: 11,
    color: C.text_light, fontFace: "Calibri", paraSpaceAfter: 3, margin: 0
  });
  addPageNum(s, n);

  // ─── Write file ───
  const fileName = "前端组件化开发与UI视觉测试.pptx";
  await pres.writeFile({ fileName });
  console.log(`\n✅ PPT 生成完成: ${fileName} (${TOTAL} 页)`);
}

main().catch(err => { console.error("❌ Error:", err); process.exit(1); });
