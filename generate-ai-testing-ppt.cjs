const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// == Icon rendering utilities ==
const {
  FaRobot, FaCode, FaBug, FaChartLine, FaShieldAlt, FaMobileAlt,
  FaBrain, FaEye, FaSearch, FaCogs, FaRocket, FaLayerGroup,
  FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaStar,
  FaArrowRight, FaDatabase, FaClipboardCheck, FaUsersCog
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

// == Color Palette: Deep Navy + Teal Accent ==
const C = {
  navy: "0F172A",
  darkSlate: "1E293B",
  slate: "334155",
  midGray: "64748B",
  lightGray: "CBD5E1",
  offWhite: "F1F5F9",
  white: "FFFFFF",
  teal: "0D9488",
  tealLight: "14B8A6",
  tealBright: "2DD4BF",
  cyan: "06B6D4",
  amber: "F59E0B",
  red: "EF4444",
  green: "22C55E",
};

// == Shadow factory (never reuse objects) ==
const makeShadow = () => ({
  type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.25,
});
const makeCardShadow = () => ({
  type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.18,
});

// == Helper: add card with left accent ==
function addCard(slide, x, y, w, h, accentColor) {
  slide.addShape(slide._slideLayout ? "rect" : "rect", {
    x, y, w, h,
    fill: { color: C.darkSlate },
    shadow: makeCardShadow(),
  });
  // Accent bar on the left
  slide.addShape("rect", {
    x, y, w: 0.06, h,
    fill: { color: accentColor || C.teal },
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "AI Testing Team";
  pres.title = "AI大模型在手机App测试中的场景与应用";

  // Pre-render all icons
  const icons = {};
  const iconMap = {
    robot: [FaRobot, C.tealBright],
    code: [FaCode, C.tealBright],
    bug: [FaBug, C.red],
    chart: [FaChartLine, C.tealBright],
    shield: [FaShieldAlt, C.amber],
    mobile: [FaMobileAlt, C.tealBright],
    brain: [FaBrain, C.tealBright],
    eye: [FaEye, C.cyan],
    search: [FaSearch, C.tealBright],
    cogs: [FaCogs, C.tealBright],
    rocket: [FaRocket, C.amber],
    layer: [FaLayerGroup, C.tealBright],
    check: [FaCheckCircle, C.green],
    warn: [FaExclamationTriangle, C.amber],
    bulb: [FaLightbulb, C.amber],
    star: [FaStar, C.amber],
    arrow: [FaArrowRight, C.tealBright],
    db: [FaDatabase, C.tealBright],
    clipboard: [FaClipboardCheck, C.tealBright],
    usersCog: [FaUsersCog, C.tealBright],
  };
  for (const [key, [Comp, color]] of Object.entries(iconMap)) {
    icons[key] = await iconToBase64Png(Comp, "#" + color, 256);
  }

  // ========== SLIDE 1: Title Slide ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    // Decorative top bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.06,
      fill: { color: C.teal },
    });

    // Large icon
    slide.addImage({ data: icons.brain, x: 4.25, y: 0.7, w: 1.5, h: 1.5 });

    // Title
    slide.addText("AI大模型在手机App测试中的\n场景与应用", {
      x: 0.8, y: 2.4, w: 8.4, h: 1.6,
      fontSize: 36, fontFace: "Arial Black", color: C.white,
      align: "center", valign: "middle", lineSpacingMultiple: 1.3,
    });

    // Subtitle
    slide.addText("Scenarios & Applications of LLMs in Mobile App Testing", {
      x: 1, y: 4.1, w: 8, h: 0.5,
      fontSize: 14, fontFace: "Arial", color: C.midGray,
      align: "center", italic: true,
    });

    // Divider
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 3.5, y: 4.7, w: 3, h: 0.03,
      fill: { color: C.teal },
    });

    // Date
    slide.addText("2026年3月", {
      x: 1, y: 4.9, w: 8, h: 0.4,
      fontSize: 13, fontFace: "Arial", color: C.midGray,
      align: "center",
    });
  }

  // ========== SLIDE 2: 目录 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("目 录", {
      x: 0.8, y: 0.3, w: 4, h: 0.7,
      fontSize: 32, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 1.0, w: 1.2, h: 0.04, fill: { color: C.teal },
    });

    const tocItems = [
      { num: "01", title: "全景图：AI 切入移动测试的五大方向", icon: "layer" },
      { num: "02", title: "测试用例与脚本生成", icon: "code" },
      { num: "03", title: "智能测试执行", icon: "cogs" },
      { num: "04", title: "缺陷分析与根因定位", icon: "bug" },
      { num: "05", title: "质量预测与风险分析", icon: "chart" },
      { num: "06", title: "行业落地现状与成熟度", icon: "star" },
      { num: "07", title: "落地建议与路线图", icon: "rocket" },
    ];

    tocItems.forEach((item, i) => {
      const yBase = 1.4 + i * 0.56;
      slide.addImage({ data: icons[item.icon], x: 0.9, y: yBase + 0.04, w: 0.35, h: 0.35 });
      slide.addText(item.num, {
        x: 1.45, y: yBase, w: 0.55, h: 0.42,
        fontSize: 18, fontFace: "Arial Black", color: C.teal, valign: "middle", margin: 0,
      });
      slide.addText(item.title, {
        x: 2.0, y: yBase, w: 6, h: 0.42,
        fontSize: 16, fontFace: "Arial", color: C.lightGray, valign: "middle", margin: 0,
      });
      if (i < tocItems.length - 1) {
        slide.addShape(pres.shapes.LINE, {
          x: 0.9, y: yBase + 0.52, w: 7.5, h: 0,
          line: { color: C.slate, width: 0.5 },
        });
      }
    });
  }

  // ========== SLIDE 3: 全景图 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("01", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("全景图：AI大模型切入移动测试的五大方向", {
      x: 1.6, y: 0.25, w: 7, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    const cols = [
      { title: "测试生成", icon: "code", items: ["用例生成", "脚本生成", "数据构造"] },
      { title: "智能执行", icon: "cogs", items: ["自愈脚本", "探索测试", "视觉理解"] },
      { title: "缺陷分析", icon: "bug", items: ["崩溃归因", "根因定位", "重复检测"] },
      { title: "质量预测", icon: "chart", items: ["风险预测", "变更影响", "覆盖建议"] },
      { title: "测试运维", icon: "clipboard", items: ["日志摘要", "报告生成", "知识沉淀"] },
    ];

    const cardW = 1.6;
    const gap = 0.2;
    const startX = 0.6;

    cols.forEach((col, i) => {
      const x = startX + i * (cardW + gap);
      // Card bg
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.2, w: cardW, h: 3.6,
        fill: { color: C.darkSlate },
        shadow: makeCardShadow(),
      });
      // Top accent
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.2, w: cardW, h: 0.06,
        fill: { color: C.teal },
      });
      // Icon
      slide.addImage({ data: icons[col.icon], x: x + (cardW - 0.55) / 2, y: 1.5, w: 0.55, h: 0.55 });
      // Title
      slide.addText(col.title, {
        x, y: 2.15, w: cardW, h: 0.45,
        fontSize: 15, fontFace: "Arial", bold: true, color: C.tealBright,
        align: "center", margin: 0,
      });
      // Items
      col.items.forEach((item, j) => {
        slide.addText("·  " + item, {
          x: x + 0.15, y: 2.65 + j * 0.45, w: cardW - 0.3, h: 0.4,
          fontSize: 13, fontFace: "Arial", color: C.lightGray, margin: 0,
        });
      });
    });

    // bottom note
    slide.addText("AI 大模型正从生成、执行、分析、预测、运维五个维度全面赋能移动应用测试", {
      x: 0.8, y: 5.0, w: 8.4, h: 0.4,
      fontSize: 11, fontFace: "Arial", color: C.midGray, italic: true, align: "center",
    });
  }

  // ========== SLIDE 4: 测试用例与脚本生成 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("02", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("测试用例与脚本生成（效率提升最显著）", {
      x: 1.6, y: 0.25, w: 7.5, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    // Table: scenarios
    const tableRows = [
      [
        { text: "场景", options: { bold: true, color: C.white, fill: { color: C.teal }, fontSize: 12, fontFace: "Arial", align: "center", valign: "middle" } },
        { text: "传统做法", options: { bold: true, color: C.white, fill: { color: C.teal }, fontSize: 12, fontFace: "Arial", align: "center", valign: "middle" } },
        { text: "AI 大模型做法", options: { bold: true, color: C.white, fill: { color: C.teal }, fontSize: 12, fontFace: "Arial", align: "center", valign: "middle" } },
        { text: "提升", options: { bold: true, color: C.white, fill: { color: C.teal }, fontSize: 12, fontFace: "Arial", align: "center", valign: "middle" } },
      ],
      [
        { text: "PRD → 测试用例", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.darkSlate }, valign: "middle" } },
        { text: "QA 手动阅读需求，逐条编写", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.darkSlate }, valign: "middle" } },
        { text: "LLM 读取 PRD + 设计稿，自动生成正向/异常/边界用例", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.darkSlate }, valign: "middle" } },
        { text: "5~10x", options: { fontSize: 14, fontFace: "Arial Black", color: C.tealBright, fill: { color: C.darkSlate }, align: "center", valign: "middle" } },
      ],
      [
        { text: "UI 截图 → 脚本", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.slate }, valign: "middle" } },
        { text: "手动录制或编码", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.slate }, valign: "middle" } },
        { text: "多模态模型识别 UI 元素，直接生成 Espresso/Appium 脚本", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.slate }, valign: "middle" } },
        { text: "3~5x", options: { fontSize: 14, fontFace: "Arial Black", color: C.tealBright, fill: { color: C.slate }, align: "center", valign: "middle" } },
      ],
      [
        { text: "自然语言 → 代码", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.darkSlate }, valign: "middle" } },
        { text: "自动化工程师手写脚本", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.darkSlate }, valign: "middle" } },
        { text: "QA 用自然语言描述流程，LLM 输出可执行测试代码", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.darkSlate }, valign: "middle" } },
        { text: "2~3x", options: { fontSize: 14, fontFace: "Arial Black", color: C.tealBright, fill: { color: C.darkSlate }, align: "center", valign: "middle" } },
      ],
      [
        { text: "测试数据构造", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.slate }, valign: "middle" } },
        { text: "手动准备或写 Faker", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.slate }, valign: "middle" } },
        { text: "LLM 根据字段语义生成合理数据（含边界值、国际化）", options: { fontSize: 11, fontFace: "Arial", color: C.lightGray, fill: { color: C.slate }, valign: "middle" } },
        { text: "3~5x", options: { fontSize: 14, fontFace: "Arial Black", color: C.tealBright, fill: { color: C.slate }, align: "center", valign: "middle" } },
      ],
    ];

    slide.addTable(tableRows, {
      x: 0.5, y: 1.1, w: 9, h: 2.8,
      colW: [1.5, 2.2, 3.8, 1.0],
      border: { pt: 0.5, color: C.slate },
      rowH: [0.4, 0.55, 0.55, 0.55, 0.55],
    });

    // Tools section
    slide.addText("典型工具", {
      x: 0.8, y: 4.1, w: 3, h: 0.4,
      fontSize: 16, fontFace: "Arial", bold: true, color: C.tealBright, margin: 0,
    });

    const tools = [
      "GitHub Copilot / Cursor — IDE 中直接生成测试代码",
      "Applitools Eyes + AI — 从设计稿推断测试断言",
      "Testim / mabl — 基于 AI 自动生成和维护测试流程",
      "自建方案 — PRD 喂给 GPT-4 / Claude，批量输出用例",
    ];
    tools.forEach((t, i) => {
      slide.addImage({ data: icons.check, x: 0.9, y: 4.55 + i * 0.28, w: 0.18, h: 0.18 });
      slide.addText(t, {
        x: 1.2, y: 4.5 + i * 0.28, w: 8, h: 0.28,
        fontSize: 11, fontFace: "Arial", color: C.lightGray, margin: 0,
      });
    });
  }

  // ========== SLIDE 5: 自愈测试脚本 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("03", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("智能测试执行：自愈脚本 & 探索测试", {
      x: 1.6, y: 0.25, w: 7.5, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    // Left: Self-healing flow
    slide.addText("自愈测试脚本（Self-Healing）", {
      x: 0.5, y: 1.05, w: 4.5, h: 0.4,
      fontSize: 15, fontFace: "Arial", bold: true, color: C.tealBright, margin: 0,
    });

    const healingSteps = [
      "元素定位失败",
      "LLM 分析页面 DOM / 截图",
      "推理「用户想点击哪个按钮」",
      "自动切换备选定位策略",
      "测试继续执行",
      "事后建议更新脚本",
    ];

    healingSteps.forEach((step, i) => {
      const y = 1.55 + i * 0.55;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 4.2, h: 0.4,
        fill: { color: i === 0 ? C.slate : C.darkSlate },
        shadow: makeCardShadow(),
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 0.05, h: 0.4,
        fill: { color: i === 0 ? C.red : C.teal },
      });
      slide.addText((i + 1) + ".  " + step, {
        x: 0.8, y, w: 3.9, h: 0.4,
        fontSize: 12, fontFace: "Arial", color: C.lightGray, valign: "middle", margin: 0,
      });
      if (i < healingSteps.length - 1) {
        slide.addImage({ data: icons.arrow, x: 2.5, y: y + 0.38, w: 0.18, h: 0.18 });
      }
    });

    // Right: AI Exploration
    slide.addText("AI 驱动的探索式测试", {
      x: 5.2, y: 1.05, w: 4.5, h: 0.4,
      fontSize: 15, fontFace: "Arial", bold: true, color: C.tealBright, margin: 0,
    });

    // Comparison: Monkey vs AI
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: 1.55, w: 4.3, h: 1.5,
      fill: { color: C.darkSlate }, shadow: makeCardShadow(),
    });
    slide.addText("传统 Monkey", {
      x: 5.4, y: 1.6, w: 2, h: 0.35,
      fontSize: 13, fontFace: "Arial", bold: true, color: C.amber, margin: 0,
    });
    slide.addText([
      { text: "随机点击", options: { breakLine: true } },
      { text: "覆盖低、重复高", options: { breakLine: true } },
      { text: "难以复现问题", options: {} },
    ], {
      x: 5.4, y: 1.95, w: 1.9, h: 1.0,
      fontSize: 11, fontFace: "Arial", color: C.midGray, margin: 0,
    });

    slide.addText("AI 探索", {
      x: 7.5, y: 1.6, w: 2, h: 0.35,
      fontSize: 13, fontFace: "Arial", bold: true, color: C.tealBright, margin: 0,
    });
    slide.addText([
      { text: "语义理解页面内容", options: { breakLine: true } },
      { text: "有目的地操作", options: { breakLine: true } },
      { text: "自动生成复现路径", options: {} },
    ], {
      x: 7.5, y: 1.95, w: 1.9, h: 1.0,
      fontSize: 11, fontFace: "Arial", color: C.lightGray, margin: 0,
    });

    // Visual understanding section
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: 3.3, w: 4.3, h: 2.0,
      fill: { color: C.darkSlate }, shadow: makeCardShadow(),
    });
    slide.addImage({ data: icons.eye, x: 5.4, y: 3.4, w: 0.35, h: 0.35 });
    slide.addText("多模态视觉理解测试", {
      x: 5.85, y: 3.4, w: 3.5, h: 0.35,
      fontSize: 13, fontFace: "Arial", bold: true, color: C.tealBright, margin: 0,
    });
    const visualItems = [
      "页面渲染是否正确（语义级，非像素级）",
      "文字截断/重叠检测",
      "深色模式/浅色模式异常",
      "不同屏幕尺寸布局合理性",
    ];
    visualItems.forEach((item, i) => {
      slide.addImage({ data: icons.check, x: 5.5, y: 3.85 + i * 0.3, w: 0.16, h: 0.16 });
      slide.addText(item, {
        x: 5.8, y: 3.82 + i * 0.3, w: 3.5, h: 0.25,
        fontSize: 11, fontFace: "Arial", color: C.lightGray, margin: 0,
      });
    });

    // Tools bar
    slide.addText("代表工具：Testim  ·  Healenium  ·  DroidBot-GPT  ·  Functionize  ·  Firebase Robo", {
      x: 0.5, y: 5.15, w: 9, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: C.midGray, italic: true, align: "center",
    });
  }

  // ========== SLIDE 6: 缺陷分析与根因定位 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("04", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("缺陷分析与根因定位", {
      x: 1.6, y: 0.25, w: 7, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    const defectCards = [
      { icon: "bug", title: "崩溃日志归因", desc: "LLM 读取 Crashlytics 堆栈，自动判断崩溃类型、定位代码模块，给出修复建议" },
      { icon: "search", title: "ANR 分析", desc: "分析 ANR trace，识别主线程阻塞原因：网络调用、IO、锁竞争等" },
      { icon: "db", title: "重复 Bug 检测", desc: "语义匹配新提 Bug，自动标记「可能是已知 Issue 的重复」" },
      { icon: "clipboard", title: "日志智能摘要", desc: "数千行 Logcat 输出提取关键错误信息，生成一句话摘要" },
      { icon: "cogs", title: "Flaky Test 分析", desc: "分析历史执行数据和日志，推断不稳定原因（网络超时、动画等）" },
    ];

    // Two column layout: 3 left, 2 right — compact to avoid overlap
    defectCards.forEach((card, i) => {
      const isLeft = i < 3;
      const x = isLeft ? 0.5 : 5.1;
      const row = isLeft ? i : i - 3;
      const y = 1.1 + row * 1.05;
      const cardW = isLeft ? 4.3 : 4.4;

      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.9,
        fill: { color: C.darkSlate }, shadow: makeCardShadow(),
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.05, h: 0.9,
        fill: { color: C.teal },
      });
      slide.addImage({ data: icons[card.icon], x: x + 0.2, y: y + 0.12, w: 0.35, h: 0.35 });
      slide.addText(card.title, {
        x: x + 0.7, y: y + 0.05, w: cardW - 0.9, h: 0.3,
        fontSize: 13, fontFace: "Arial", bold: true, color: C.tealBright, margin: 0,
      });
      slide.addText(card.desc, {
        x: x + 0.7, y: y + 0.38, w: cardW - 0.9, h: 0.48,
        fontSize: 10, fontFace: "Arial", color: C.lightGray, margin: 0,
      });
    });

    // Key insight box
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.5, w: 9, h: 0.65,
      fill: { color: C.darkSlate }, shadow: makeCardShadow(),
    });
    slide.addImage({ data: icons.bulb, x: 0.7, y: 4.62, w: 0.32, h: 0.32 });
    slide.addText("2000人团队每天产生数百个崩溃和几十个 Flaky Test，AI 可把排查时间从小时级降到分钟级", {
      x: 1.15, y: 4.5, w: 8.1, h: 0.65,
      fontSize: 12, fontFace: "Arial", bold: true, color: C.amber, valign: "middle", margin: 0,
    });
  }

  // ========== SLIDE 7: 质量预测与风险分析 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("05", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("质量预测与风险分析", {
      x: 1.6, y: 0.25, w: 7, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    const predictions = [
      {
        icon: "chart", title: "变更影响分析",
        desc: "LLM 读取 PR diff + 代码依赖图\n预测改动可能影响哪些功能模块\n推荐需要回归的测试用例",
      },
      {
        icon: "search", title: "缺陷热点预测",
        desc: "基于历史 Bug 数据 + 代码复杂度\n预测下一版本哪些模块最可能出 Bug\n提前集中测试资源",
      },
      {
        icon: "eye", title: "测试覆盖建议",
        desc: "分析当前测试用例集 vs 代码变更\n精准指出「覆盖盲区」\n减少测试遗漏风险",
      },
      {
        icon: "shield", title: "发版风险评估",
        desc: "综合测试通过率、崩溃率、性能指标\nAI 给出「是否可以发版」建议\n辅助 Release Manager 决策",
      },
    ];

    predictions.forEach((p, i) => {
      const isTop = i < 2;
      const col = i % 2;
      const x = 0.5 + col * 4.7;
      const y = isTop ? 1.1 : 3.2;

      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.4, h: 1.8,
        fill: { color: C.darkSlate }, shadow: makeCardShadow(),
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.4, h: 0.05,
        fill: { color: C.teal },
      });
      slide.addImage({ data: icons[p.icon], x: x + 0.2, y: y + 0.2, w: 0.45, h: 0.45 });
      slide.addText(p.title, {
        x: x + 0.8, y: y + 0.2, w: 3.3, h: 0.4,
        fontSize: 16, fontFace: "Arial", bold: true, color: C.tealBright, margin: 0,
      });
      slide.addText(p.desc, {
        x: x + 0.3, y: y + 0.75, w: 3.8, h: 0.95,
        fontSize: 12, fontFace: "Arial", color: C.lightGray, margin: 0,
        lineSpacingMultiple: 1.35,
      });
    });
  }

  // ========== SLIDE 8: 行业落地现状 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("06", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("行业落地现状与成熟度（2025~2026）", {
      x: 1.6, y: 0.25, w: 7.5, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    // Three tier system — compact row heights to fit all tiers
    const tiers = [
      {
        label: "已成熟可用", color: C.green, items: [
          ["AI 辅助生成测试代码", "Copilot, Cursor, Amazon Q"],
          ["自愈测试脚本", "Testim, Healenium, mabl"],
          ["崩溃日志智能分析", "Sentry AI, Crashlytics + LLM"],
          ["视觉 AI 测试", "Applitools Eyes, Percy AI"],
          ["用例从需求生成", "自建 LLM Pipeline"],
        ],
      },
      {
        label: "快速发展中", color: C.amber, items: [
          ["AI 驱动自主探索测试", "DroidBot-GPT 等"],
          ["多模态视觉理解测试", "GPT-4o / Gemini"],
          ["变更影响智能分析", "需深度集成代码仓库"],
        ],
      },
      {
        label: "尚在探索期", color: C.red, items: [
          ["AI Agent 全自主测试", "目前是「AI 辅助人」"],
          ["端侧模型实时测试", "设备端小模型，刚起步"],
        ],
      },
    ];

    const rowH = 0.3;
    let yOffset = 1.0;
    tiers.forEach((tier) => {
      const tierH = tier.items.length * rowH + 0.04;
      // Tier label
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: yOffset, w: 1.8, h: tierH,
        fill: { color: tier.color },
      });
      slide.addText(tier.label, {
        x: 0.5, y: yOffset, w: 1.8, h: tierH,
        fontSize: 11, fontFace: "Arial", bold: true, color: C.navy,
        align: "center", valign: "middle", margin: 0,
      });

      // Items
      tier.items.forEach((item, i) => {
        const rowY = yOffset + i * rowH + 0.02;
        slide.addShape(pres.shapes.RECTANGLE, {
          x: 2.4, y: rowY, w: 7.1, h: rowH - 0.02,
          fill: { color: i % 2 === 0 ? C.darkSlate : C.slate },
        });
        slide.addText(item[0], {
          x: 2.6, y: rowY, w: 3.2, h: rowH - 0.02,
          fontSize: 10, fontFace: "Arial", bold: true, color: C.lightGray, valign: "middle", margin: 0,
        });
        slide.addText(item[1], {
          x: 5.8, y: rowY, w: 3.5, h: rowH - 0.02,
          fontSize: 10, fontFace: "Arial", color: C.midGray, valign: "middle", margin: 0,
        });
      });

      yOffset += tierH + 0.12;
    });

    // Bottom: positioning statement
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.65, w: 9, h: 0.6,
      fill: { color: C.darkSlate }, shadow: makeCardShadow(),
    });
    slide.addImage({ data: icons.bulb, x: 0.7, y: 4.76, w: 0.3, h: 0.3 });
    slide.addText("AI 定位：「智能副驾」— 显著提效，但核心测试策略和质量决策仍需人来把关", {
      x: 1.1, y: 4.65, w: 8.2, h: 0.6,
      fontSize: 12, fontFace: "Arial", bold: true, color: C.amber,
      valign: "middle", margin: 0,
    });
  }

  // ========== SLIDE 9: 落地建议（优先级） ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("07", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("2000人 Android 团队落地建议", {
      x: 1.6, y: 0.25, w: 7.5, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    const priorities = [
      {
        level: "P0 立即可做（ROI 最高）",
        color: C.green,
        items: [
          "Copilot / Cursor 辅助编写测试代码 — 效率提升 2~3x",
          "崩溃日志 AI 分析 — 每日自动归因 + 修复建议",
          "PRD → 测试用例自动生成 — RAG 增强贴合业务",
        ],
      },
      {
        level: "P1 三到六个月内",
        color: C.amber,
        items: [
          "自愈测试脚本 — 降低自动化维护成本",
          "AI 探索测试 — 比 Monkey 多发现 30~50% 崩溃",
          "测试知识库 + RAG 问答 — 新人快速上手",
        ],
      },
      {
        level: "P2 六到十二个月",
        color: C.cyan,
        items: [
          "多模态视觉测试 — 多语言、深色模式验收",
          "变更影响分析 + 精准回归 — 节省机器资源",
          "发版质量 AI Dashboard — 辅助发版决策",
        ],
      },
    ];

    priorities.forEach((p, pi) => {
      const y = 1.0 + pi * 1.5;
      // Priority label
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y, w: 9, h: 0.38,
        fill: { color: p.color },
      });
      slide.addText(p.level, {
        x: 0.7, y, w: 8.5, h: 0.38,
        fontSize: 14, fontFace: "Arial", bold: true, color: C.navy, valign: "middle", margin: 0,
      });
      // Items
      p.items.forEach((item, i) => {
        slide.addImage({ data: icons.arrow, x: 0.7, y: y + 0.5 + i * 0.3, w: 0.16, h: 0.16 });
        slide.addText(item, {
          x: 1.0, y: y + 0.45 + i * 0.3, w: 8.2, h: 0.3,
          fontSize: 12, fontFace: "Arial", color: C.lightGray, margin: 0,
        });
      });
    });
  }

  // ========== SLIDE 10: 风险与注意事项 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    slide.addText("08", {
      x: 0.8, y: 0.25, w: 0.8, h: 0.55,
      fontSize: 24, fontFace: "Arial Black", color: C.teal, margin: 0,
    });
    slide.addText("风险与注意事项", {
      x: 1.6, y: 0.25, w: 7, h: 0.55,
      fontSize: 22, fontFace: "Arial Black", color: C.white, margin: 0,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.82, w: 8, h: 0.035, fill: { color: C.teal },
    });

    const risks = [
      { icon: "warn", title: "生成不准确", desc: "AI 生成的测试用例必须人工审核，AI 是「加速器」不是「替代者」" },
      { icon: "warn", title: "LLM 幻觉", desc: "关键判断环节（如发版决策）不能完全依赖 AI ，需有人类兜底" },
      { icon: "shield", title: "数据安全", desc: "代码和日志不能直接发给公有 LLM API，需部署私有化模型或企业版 API" },
      { icon: "chart", title: "成本控制", desc: "2000 人团队大量调用 LLM API 成本不低，需设置用量监控和缓存策略" },
      { icon: "usersCog", title: "避免过度依赖", desc: "保持团队基础测试设计能力，AI 辅助而非替代人类专业判断" },
    ];

    risks.forEach((r, i) => {
      const y = 1.1 + i * 0.85;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y, w: 9, h: 0.7,
        fill: { color: C.darkSlate }, shadow: makeCardShadow(),
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y, w: 0.06, h: 0.7,
        fill: { color: C.amber },
      });
      slide.addImage({ data: icons[r.icon], x: 0.75, y: y + 0.15, w: 0.4, h: 0.4 });
      slide.addText(r.title, {
        x: 1.3, y: y + 0.05, w: 2.5, h: 0.35,
        fontSize: 15, fontFace: "Arial", bold: true, color: C.amber, margin: 0,
      });
      slide.addText(r.desc, {
        x: 1.3, y: y + 0.35, w: 7.8, h: 0.3,
        fontSize: 12, fontFace: "Arial", color: C.lightGray, margin: 0,
      });
    });
  }

  // ========== SLIDE 11: 总结 ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.navy };

    // Decorative top bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.06,
      fill: { color: C.teal },
    });

    slide.addImage({ data: icons.rocket, x: 4.35, y: 0.4, w: 1.3, h: 1.3 });

    slide.addText("总  结", {
      x: 1, y: 1.75, w: 8, h: 0.65,
      fontSize: 32, fontFace: "Arial Black", color: C.white, align: "center", margin: 0,
    });

    // Key message box
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1, y: 2.5, w: 8, h: 1.4,
      fill: { color: C.darkSlate }, shadow: makeShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1, y: 2.5, w: 8, h: 0.06,
      fill: { color: C.teal },
    });

    slide.addText(
      "AI 大模型在移动测试中的最佳定位是「智能副驾」——\n\n" +
      "在测试生成、脚本维护、缺陷分析、探索测试四个方向上能显著提效，\n" +
      "核心测试策略设计、复杂业务判断、最终质量决策仍需要人来把关。",
      {
        x: 1.3, y: 2.63, w: 7.4, h: 1.2,
        fontSize: 14, fontFace: "Arial", color: C.lightGray,
        align: "center", valign: "middle", lineSpacingMultiple: 1.35, margin: 0,
      }
    );

    // Three action items — more space from message box
    const actions = [
      { num: "01", text: "Copilot 写测试", sub: "立即启动" },
      { num: "02", text: "崩溃 AI 分析", sub: "快速见效" },
      { num: "03", text: "用例自动生成", sub: "ROI 最高" },
    ];

    actions.forEach((a, i) => {
      const x = 1.2 + i * 2.8;
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 4.25, w: 2.3, h: 0.8,
        fill: { color: C.teal },
        shadow: makeCardShadow(),
      });
      slide.addText(a.num, {
        x, y: 4.25, w: 0.6, h: 0.8,
        fontSize: 20, fontFace: "Arial Black", color: C.navy,
        align: "center", valign: "middle", margin: 0,
      });
      slide.addText(a.text, {
        x: x + 0.55, y: 4.23, w: 1.6, h: 0.45,
        fontSize: 13, fontFace: "Arial", bold: true, color: C.white, margin: 0,
      });
      slide.addText(a.sub, {
        x: x + 0.55, y: 4.6, w: 1.6, h: 0.35,
        fontSize: 11, fontFace: "Arial", color: C.navy, margin: 0,
      });
    });
  }

  // ========== Write file ==========
  const outputPath = "/Users/qifenghou/Codes/UI-test-Demo/AI大模型在手机App测试中的场景与应用.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("PPT generated:", outputPath);
}

main().catch(console.error);
