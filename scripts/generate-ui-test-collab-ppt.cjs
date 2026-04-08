/**
 * generate-ui-test-collab-ppt.cjs
 * ──────────────────────────────────────────────
 * 生成一页宽屏 PPT：UI-test — Agent 协作流程
 *   暗色主题，三栏布局：Chat 面板 | 6 步流程 | 测试报告 + 底部 Handoff
 *   参考 PM-assistant 截图风格
 * ──────────────────────────────────────────────
 */

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRobot, FaSearch, FaPuzzlePiece, FaCamera, FaShieldAlt,
  FaChartBar, FaArrowRight, FaCheckCircle, FaCogs, FaPlay,
  FaCode, FaEye, FaRoute, FaLayerGroup, FaClipboardCheck,
  FaLock, FaUser, FaCloudUploadAlt, FaFileAlt, FaStar,
  FaExclamationTriangle, FaProjectDiagram
} = require("react-icons/fa");

// ═══════════════════════════════════════════════
//  Color palette — Dark theme (GitHub Dark style)
// ═══════════════════════════════════════════════
const C = {
  bg:          "0D1117",
  cardBg:      "161B22",
  chatBg:      "1C2128",
  panelBg:     "13171E",
  green:       "3FB950",
  purple:      "A855F7",
  orange:      "F59E0B",
  teal:        "0D9488",
  blue:        "58A6FF",
  red:         "F85149",
  cyan:        "22D3EE",
  gold:        "FBBF24",
  white:       "FFFFFF",
  border:      "30363D",
  textPrimary: "E6EDF3",
  textSecond:  "8B949E",
  textMuted:   "6E7681",
  stepGreen:   "10B981",
  stepPurple:  "7C3AED",
  stepBlue:    "2563EB",
  stepOrange:  "F59E0B",
  stepCyan:    "06B6D4",
  stepRed:     "EF4444",
  gradLeft:    "7C3AED",
  gradRight:   "10B981",
};

// ═══════════════════════════════════════════════
//  Icon utilities (reused from repo pattern)
// ═══════════════════════════════════════════════
function renderIconSvg(Icon, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color, size: String(size) })
  );
}
async function iconPng(Icon, color, size = 256) {
  const svg = renderIconSvg(Icon, "#" + color, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

const mkShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.18 });
const mkCardShadow = () => ({ type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.25 });

// ═══════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";        // 13.333 × 7.5
  pres.author = "UI-Test Agent";
  pres.title  = "UI-test — Agent 协作流程";

  // ── Pre-render icons ──
  const I = {};
  const defs = [
    ["robot",     FaRobot,              C.purple],
    ["robotW",    FaRobot,              C.white],
    ["search",    FaSearch,             C.purple],
    ["searchW",   FaSearch,             C.white],
    ["puzzle",    FaPuzzlePiece,        C.green],
    ["puzzleW",   FaPuzzlePiece,        C.white],
    ["camera",    FaCamera,             C.red],
    ["cameraW",   FaCamera,             C.white],
    ["shield",    FaShieldAlt,          C.cyan],
    ["shieldW",   FaShieldAlt,          C.white],
    ["chart",     FaChartBar,           C.gold],
    ["chartW",    FaChartBar,           C.white],
    ["arrow",     FaArrowRight,         C.textSecond],
    ["arrowW",    FaArrowRight,         C.white],
    ["check",     FaCheckCircle,        C.green],
    ["checkW",    FaCheckCircle,        C.white],
    ["cogs",      FaCogs,               C.textSecond],
    ["cogsW",     FaCogs,               C.white],
    ["play",      FaPlay,               C.green],
    ["playW",     FaPlay,               C.white],
    ["code",      FaCode,               C.blue],
    ["codeW",     FaCode,               C.white],
    ["eye",       FaEye,                C.red],
    ["eyeW",      FaEye,                C.white],
    ["route",     FaRoute,              C.blue],
    ["routeW",    FaRoute,              C.white],
    ["layers",    FaLayerGroup,         C.blue],
    ["layersW",   FaLayerGroup,         C.white],
    ["clipboard", FaClipboardCheck,     C.green],
    ["lock",      FaLock,               C.orange],
    ["lockW",     FaLock,               C.white],
    ["user",      FaUser,               C.green],
    ["cloud",     FaCloudUploadAlt,     C.cyan],
    ["cloudW",    FaCloudUploadAlt,     C.white],
    ["file",      FaFileAlt,            C.textSecond],
    ["fileW",     FaFileAlt,            C.white],
    ["star",      FaStar,               C.gold],
    ["warn",      FaExclamationTriangle,C.orange],
    ["diagram",   FaProjectDiagram,     C.purple],
    ["diagramW",  FaProjectDiagram,     C.white],
  ];
  for (const [name, comp, color] of defs) {
    I[name] = await iconPng(comp, color);
  }

  // ════════════════════════════════════════════════════
  // SINGLE SLIDE — UI-test Agent 协作流程
  // ════════════════════════════════════════════════════
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // ────── A. Top gradient accent bars ──────
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 13.333, h: 0.06, fill: { color: C.gradLeft } });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.5, y: 0, w: 4.5, h: 0.06, fill: { color: C.gradRight } });
  s.addShape(pres.shapes.RECTANGLE, { x: 9, y: 0, w: 4.333, h: 0.06, fill: { color: C.cyan } });

  // ────── B. Title bar ──────
  s.addText("UI-test — Agent 协作流程", {
    x: 0.4, y: 0.15, w: 8, h: 0.5,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.white, bold: true,
  });
  s.addText("从一句测试需求到全栈覆盖：6 步自动化协作，联动 Discovery、CT/E2E/Visual Agent、VLM 增强、下游 Skill/Governance", {
    x: 0.4, y: 0.6, w: 9.5, h: 0.35,
    fontSize: 10, fontFace: "Microsoft YaHei", color: C.textSecond, italic: true,
  });

  // Right-top badge
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 10.6, y: 0.2, w: 2.4, h: 0.4, rectRadius: 0.08,
    fill: { color: C.cardBg }, line: { color: C.border, width: 1 },
  });
  s.addText("UI 测试入口 · 需求校准器", {
    x: 10.6, y: 0.2, w: 2.4, h: 0.4,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.textSecond, align: "center", valign: "middle",
  });

  // ────── C. Left panel — Copilot Chat simulation ──────
  const chatX = 0.25, chatY = 1.1, chatW = 2.55, chatH = 5.0;

  // Chat panel background
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: chatX, y: chatY, w: chatW, h: chatH, rectRadius: 0.12,
    fill: { color: C.chatBg }, line: { color: C.border, width: 1 }, shadow: mkCardShadow(),
  });

  // Chat header (three dots + title)
  s.addShape(pres.shapes.OVAL, { x: chatX + 0.15, y: chatY + 0.12, w: 0.1, h: 0.1, fill: { color: C.red } });
  s.addShape(pres.shapes.OVAL, { x: chatX + 0.3, y: chatY + 0.12, w: 0.1, h: 0.1, fill: { color: C.orange } });
  s.addShape(pres.shapes.OVAL, { x: chatX + 0.45, y: chatY + 0.12, w: 0.1, h: 0.1, fill: { color: C.green } });
  s.addText("Copilot Chat", {
    x: chatX + 0.65, y: chatY + 0.06, w: 1.6, h: 0.2,
    fontSize: 10, fontFace: "Microsoft YaHei", color: C.textSecond, bold: true,
  });

  // Divider
  s.addShape(pres.shapes.LINE, { x: chatX + 0.1, y: chatY + 0.35, w: chatW - 0.2, h: 0, line: { color: C.border, width: 0.5 } });

  // ── User message ──
  const umY = chatY + 0.5;
  s.addImage({ data: I.user, x: chatX + 0.12, y: umY + 0.02, w: 0.18, h: 0.18 });
  s.addText("用户", {
    x: chatX + 0.35, y: umY, w: 0.5, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.green, bold: true,
  });
  // User message card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: chatX + 0.12, y: umY + 0.25, w: chatW - 0.3, h: 0.65, rectRadius: 0.06,
    fill: { color: C.panelBg }, line: { color: C.border, width: 0.5 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: chatX + 0.12, y: umY + 0.25, w: 0.04, h: 0.65, fill: { color: C.green },
  });
  s.addText("@ui-test\n帮我写 TravelVista 的组件测试\n和视觉回归测试", {
    x: chatX + 0.25, y: umY + 0.28, w: chatW - 0.55, h: 0.6,
    fontSize: 8.5, fontFace: "Microsoft YaHei", color: C.textPrimary, lineSpacingMultiple: 1.2,
  });

  // ── Assistant reply 1 ──
  const a1Y = umY + 1.05;
  s.addImage({ data: I.robot, x: chatX + 0.12, y: a1Y + 0.02, w: 0.18, h: 0.18 });
  s.addText("ui-test", {
    x: chatX + 0.35, y: a1Y, w: 0.8, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.purple, bold: true,
  });
  // Reply card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: chatX + 0.12, y: a1Y + 0.25, w: chatW - 0.3, h: 1.45, rectRadius: 0.06,
    fill: { color: C.panelBg }, line: { color: C.border, width: 0.5 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: chatX + 0.12, y: a1Y + 0.25, w: 0.04, h: 1.45, fill: { color: C.purple },
  });
  s.addText([
    { text: "收到需求 ", options: { fontSize: 8.5, color: C.textPrimary } },
    { text: "✅", options: { fontSize: 8.5, color: C.green } },
    { text: " 开始路由分析...\n", options: { fontSize: 8.5, color: C.textPrimary } },
    { text: "✂ ", options: { fontSize: 8, color: C.orange } },
    { text: "提取核心测试类型：\n", options: { fontSize: 8, color: C.textSecond, italic: true } },
    { text: "  · 组件测试 (CT)\n", options: { fontSize: 8, color: C.textPrimary } },
    { text: "  · E2E 端到端\n", options: { fontSize: 8, color: C.textPrimary } },
    { text: "  · 视觉回归\n", options: { fontSize: 8, color: C.textPrimary } },
    { text: "● 关键词：", options: { fontSize: 8, color: C.textSecond } },
  ], {
    x: chatX + 0.25, y: a1Y + 0.28, w: chatW - 0.55, h: 0.95,
    fontFace: "Microsoft YaHei", lineSpacingMultiple: 1.1, valign: "top",
  });

  // Keyword badges
  const kwY = a1Y + 1.3;
  const keywords = [
    { t: "组件测试", c: C.teal },
    { t: "视觉回归", c: C.red },
  ];
  let kwX = chatX + 0.25;
  for (const kw of keywords) {
    const kwW = kw.t.length * 0.16 + 0.2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: kwX, y: kwY, w: kwW, h: 0.22, rectRadius: 0.06,
      fill: { color: kw.c, transparency: 85 }, line: { color: kw.c, width: 0.5 },
    });
    s.addText(kw.t, {
      x: kwX, y: kwY, w: kwW, h: 0.22,
      fontSize: 7, fontFace: "Microsoft YaHei", color: kw.c, align: "center", valign: "middle",
    });
    kwX += kwW + 0.08;
  }

  // ── Assistant reply 2 ──
  const a2Y = a1Y + 1.85;
  s.addImage({ data: I.robot, x: chatX + 0.12, y: a2Y + 0.02, w: 0.18, h: 0.18 });
  s.addText("ui-test", {
    x: chatX + 0.35, y: a2Y, w: 0.8, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.purple, bold: true,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: chatX + 0.12, y: a2Y + 0.24, w: chatW - 0.3, h: 0.4, rectRadius: 0.06,
    fill: { color: C.panelBg }, line: { color: C.border, width: 0.5 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: chatX + 0.12, y: a2Y + 0.24, w: 0.04, h: 0.4, fill: { color: C.purple },
  });
  s.addText("正在调用 Discovery Agent 扫描...", {
    x: chatX + 0.25, y: a2Y + 0.26, w: chatW - 0.55, h: 0.35,
    fontSize: 8.5, fontFace: "Microsoft YaHei", color: C.textPrimary, valign: "middle",
  });

  // ────── D. Central workflow area — 6 steps ──────
  const cwX = 3.0, cwY = 1.1;

  // Helper: draw a step card
  function stepCard(x, y, w, h, accentColor, stepLabel, title, desc, badges, iconData) {
    // Card background
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: 0.1,
      fill: { color: C.cardBg }, line: { color: C.border, width: 0.8 }, shadow: mkCardShadow(),
    });
    // Top accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.05, y, w: w - 0.1, h: 0.04, fill: { color: accentColor },
    });
    // Step label
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.08, y: y + 0.1, w: 0.55, h: 0.2, rectRadius: 0.06,
      fill: { color: accentColor },
    });
    s.addText(stepLabel, {
      x: x + 0.08, y: y + 0.1, w: 0.55, h: 0.2,
      fontSize: 7, fontFace: "Microsoft YaHei", color: C.white, align: "center", valign: "middle", bold: true,
    });
    // Icon
    if (iconData) {
      s.addImage({ data: iconData, x: x + w - 0.38, y: y + 0.08, w: 0.25, h: 0.25 });
    }
    // Title
    s.addText(title, {
      x: x + 0.08, y: y + 0.30, w: w - 0.16, h: 0.2,
      fontSize: 9, fontFace: "Microsoft YaHei", color: C.white, bold: true,
    });
    // Description
    s.addText(desc, {
      x: x + 0.08, y: y + 0.48, w: w - 0.16, h: h - 0.80,
      fontSize: 7, fontFace: "Microsoft YaHei", color: C.textSecond, lineSpacingMultiple: 1.15, valign: "top",
    });
    // Badges
    let bx = x + 0.08;
    const by = y + h - 0.26;
    for (const badge of badges) {
      const bw = badge.length * 0.08 + 0.16;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: bx, y: by, w: bw, h: 0.2, rectRadius: 0.06,
        fill: { color: accentColor, transparency: 85 }, line: { color: accentColor, width: 0.5 },
      });
      s.addText(badge, {
        x: bx, y: by, w: bw, h: 0.2,
        fontSize: 6, fontFace: "Consolas", color: accentColor, align: "center", valign: "middle",
      });
      bx += bw + 0.06;
    }
  }

  // Helper: draw arrow between steps
  function stepArrow(x, y, horizontal, len) {
    if (horizontal) {
      s.addShape(pres.shapes.LINE, { x, y, w: len, h: 0, line: { color: C.textMuted, width: 1, dashType: "dash" } });
      s.addImage({ data: I.arrow, x: x + len - 0.12, y: y - 0.06, w: 0.12, h: 0.12 });
    } else {
      s.addShape(pres.shapes.LINE, { x, y, w: 0, h: len, line: { color: C.textMuted, width: 1, dashType: "dash" } });
    }
  }

  // Row 1: Step 0 + Step 1
  const r1Y = cwY;
  const stepW1 = 2.65, stepH1 = 1.25;
  stepCard(cwX, r1Y, stepW1, stepH1, C.stepOrange, "步骤 0", "🔐 配置与环境检查",
    "检测 Playwright 配置\n验证依赖安装状态\n获取项目框架信息",
    ["playwright.config.ts"], I.lockW);
  stepArrow(cwX + stepW1 + 0.02, r1Y + stepH1 / 2, true, 0.3);
  stepCard(cwX + stepW1 + 0.35, r1Y, stepW1, stepH1, C.stepBlue, "步骤 1", "📋 需求理解与路由",
    "提炼 3-5 测试类型\n用户画像分析\n路由分类决策",
    ["LLM 分析"], I.routeW);

  // Arrow down from row 1 to row 2
  stepArrow(cwX + stepW1 / 2, r1Y + stepH1 + 0.02, false, 0.2);

  // Row 2: Step 2 + Step 3
  const r2Y = r1Y + stepH1 + 0.25;
  stepCard(cwX, r2Y, stepW1, stepH1, C.stepPurple, "步骤 2", "🔍 Discovery 深度扫描",
    "扫描路由/组件/定位器\n逐项分析 Side Effects\n✅ 全新  ⚠ 重叠  ❌ 已有",
    ["ui-test-discovery"], I.searchW);
  stepArrow(cwX + stepW1 + 0.02, r2Y + stepH1 / 2, true, 0.3);
  stepCard(cwX + stepW1 + 0.35, r2Y, stepW1, stepH1, C.stepGreen, "步骤 3", "🧪 测试代码生成",
    "CT / E2E / Visual\n三路并行生成测试代码\n覆盖组件·路由·截图",
    ["playwright-ct", "playwright-e2e"], I.codeW);

  // Arrow down from row 2 to row 3
  stepArrow(cwX + stepW1 / 2, r2Y + stepH1 + 0.02, false, 0.2);

  // Row 3: Step 4a (execute) + Step 4b (quality gate) — side by side
  const r3Y = r2Y + stepH1 + 0.25;
  const stepW3 = 2.65, stepH3 = 1.25;
  stepCard(cwX, r3Y, stepW3, stepH3, C.stepCyan, "步骤 4a", "🎯 测试执行",
    "本地运行全部测试\n失败诊断 · 覆盖率统计\nMVP 可收敛",
    ["npx playwright test"], I.playW);

  // Plus sign between 4a and 4b
  s.addText("+", {
    x: cwX + stepW3 + 0.04, y: r3Y + stepH3 / 2 - 0.12, w: 0.25, h: 0.24,
    fontSize: 16, fontFace: "Arial", color: C.textMuted, align: "center", valign: "middle",
  });

  stepCard(cwX + stepW3 + 0.35, r3Y, stepW3, stepH3, C.stepRed, "步骤 4b", "🛡️ 质量门禁评估",
    "VLM 视觉审查\n基线权威判定\n可行性: 高/中/低",
    ["playwright-vlm"], I.shieldW);

  // Arrow down from row 3 to row 4
  stepArrow(cwX + (stepW1 * 2 + 0.35) / 2, r3Y + stepH3 + 0.02, false, 0.2);

  // Row 4: Step 5 — wide centered
  const r4Y = r3Y + stepH3 + 0.18;
  const stepW4 = 5.65, stepH4 = 0.55;
  // Output report card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cwX, y: r4Y, w: stepW4, h: stepH4, rectRadius: 0.1,
    fill: { color: C.cardBg }, line: { color: C.border, width: 0.8 }, shadow: mkCardShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: cwX + 0.05, y: r4Y, w: stepW4 - 0.1, h: 0.04, fill: { color: C.gold },
  });
  // Step label
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cwX + 0.1, y: r4Y + 0.1, w: 0.55, h: 0.2, rectRadius: 0.06,
    fill: { color: C.gold },
  });
  s.addText("步骤 5", {
    x: cwX + 0.1, y: r4Y + 0.1, w: 0.55, h: 0.2,
    fontSize: 7, fontFace: "Microsoft YaHei", color: C.bg, align: "center", valign: "middle", bold: true,
  });
  s.addImage({ data: I.chartW, x: cwX + 0.7, y: r4Y + 0.08, w: 0.22, h: 0.22 });
  s.addText("📊 输出《测试分析报告》", {
    x: cwX + 0.96, y: r4Y + 0.08, w: 2, h: 0.22,
    fontSize: 10, fontFace: "Microsoft YaHei", color: C.white, bold: true, valign: "middle",
  });

  // Chapter chips
  const chapters = [
    "Ch.1 覆盖统计", "Ch.2 CT 结果", "Ch.3 E2E 结果",
    "Ch.4 Visual Diff", "Ch.5 VLM 审查", "Ch.6 建议",
  ];
  let chX = cwX + 0.1;
  const chY = r4Y + 0.38;
  for (const ch of chapters) {
    const chW = ch.length * 0.1 + 0.15;
    s.addText(ch, {
      x: chX, y: chY, w: chW, h: 0.18,
      fontSize: 6.5, fontFace: "Microsoft YaHei", color: C.textSecond,
    });
    if (ch !== chapters[chapters.length - 1]) {
      s.addText("·", {
        x: chX + chW - 0.04, y: chY, w: 0.12, h: 0.18,
        fontSize: 7, color: C.textMuted, align: "center",
      });
    }
    chX += chW + 0.05;
  }

  // ────── E. Right panel — Test Report preview ──────
  const rpX = 9.05, rpY = 1.1, rpW = 4.0, rpH = 5.0;

  // Report panel bg
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: rpX, y: rpY, w: rpW, h: rpH, rectRadius: 0.12,
    fill: { color: C.chatBg }, line: { color: C.border, width: 1 }, shadow: mkCardShadow(),
  });

  // Terminal dots
  s.addShape(pres.shapes.OVAL, { x: rpX + 0.15, y: rpY + 0.12, w: 0.1, h: 0.1, fill: { color: C.red } });
  s.addShape(pres.shapes.OVAL, { x: rpX + 0.3, y: rpY + 0.12, w: 0.1, h: 0.1, fill: { color: C.orange } });
  s.addShape(pres.shapes.OVAL, { x: rpX + 0.45, y: rpY + 0.12, w: 0.1, h: 0.1, fill: { color: C.green } });
  s.addText("📊 测试分析报告", {
    x: rpX + 0.65, y: rpY + 0.06, w: 2.5, h: 0.22,
    fontSize: 10, fontFace: "Microsoft YaHei", color: C.textPrimary, bold: true,
  });

  // Divider
  s.addShape(pres.shapes.LINE, { x: rpX + 0.1, y: rpY + 0.35, w: rpW - 0.2, h: 0, line: { color: C.border, width: 0.5 } });

  // ── Section: 需求概述 ──
  let ry = rpY + 0.45;
  s.addText("❓ 需求概述", {
    x: rpX + 0.15, y: ry, w: 2, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.orange, bold: true,
  });
  ry += 0.25;
  const overviewItems = [
    { k: "核心功能", v: "CT · E2E · 视觉回归" },
    { k: "目标用户", v: "React + Vite 前端项目" },
  ];
  for (const item of overviewItems) {
    s.addText(item.k, {
      x: rpX + 0.2, y: ry, w: 1, h: 0.16,
      fontSize: 7.5, fontFace: "Microsoft YaHei", color: C.textSecond,
    });
    s.addText(item.v, {
      x: rpX + 1.2, y: ry, w: 2.6, h: 0.16,
      fontSize: 7.5, fontFace: "Microsoft YaHei", color: C.textPrimary,
    });
    ry += 0.18;
  }

  // ── Section: Discovery 结果 ──
  ry += 0.1;
  s.addText("🔍 Discovery 结果", {
    x: rpX + 0.15, y: ry, w: 2, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.purple, bold: true,
  });
  ry += 0.25;
  s.addText("10 组件 · 8 路由 · i18n ✅ · Side Effects 5", {
    x: rpX + 0.2, y: ry, w: rpW - 0.4, h: 0.16,
    fontSize: 7.5, fontFace: "Microsoft YaHei", color: C.textPrimary,
  });

  // ── Section: 竞品 ──
  ry += 0.3;
  s.addText("🏷️ 竞品", {
    x: rpX + 0.15, y: ry, w: 2, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.teal, bold: true,
  });
  ry += 0.22;
  const competitors = [
    { name: "Cypress", desc: "组件级 · 免费 · 无 VLM" },
    { name: "Chromatic", desc: "视觉回归 · 付费 · 云端" },
  ];
  for (const cp of competitors) {
    s.addText(cp.name, {
      x: rpX + 0.2, y: ry, w: 1, h: 0.16,
      fontSize: 7.5, fontFace: "Microsoft YaHei", color: C.textPrimary, bold: true,
    });
    s.addText(cp.desc, {
      x: rpX + 1.2, y: ry, w: 2.6, h: 0.16,
      fontSize: 7, fontFace: "Microsoft YaHei", color: C.textSecond,
    });
    ry += 0.18;
  }

  // ── Section: 测试执行 ──
  ry += 0.1;
  s.addText("🧪 测试执行", {
    x: rpX + 0.15, y: ry, w: 2, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.stepGreen, bold: true,
  });
  ry += 0.25;
  const testResults = [
    { label: "CT", stat: "42 tests · ✅ 38 passed · ⚠️ 4 flaky" },
    { label: "E2E", stat: "24 tests · ✅ 22 passed · ❌ 2 failed" },
    { label: "Visual", stat: "16 snapshots · ✅ 14 match · 🔶 2 diff" },
  ];
  for (const tr of testResults) {
    s.addText(tr.label, {
      x: rpX + 0.2, y: ry, w: 0.6, h: 0.16,
      fontSize: 7.5, fontFace: "Consolas", color: C.blue, bold: true,
    });
    s.addText(tr.stat, {
      x: rpX + 0.8, y: ry, w: 3, h: 0.16,
      fontSize: 7, fontFace: "Microsoft YaHei", color: C.textPrimary,
    });
    ry += 0.2;
  }

  // ── Section: 质量评分 ──
  ry += 0.1;
  s.addText("⭐ 价值评分", {
    x: rpX + 0.15, y: ry, w: 2, h: 0.2,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.gold, bold: true,
  });
  ry += 0.25;
  const scores = [
    { label: "组件覆盖", stars: "★★★★☆", score: "4/5" },
    { label: "路由覆盖", stars: "★★★★★", score: "5/5" },
    { label: "视觉基线", stars: "★★★☆☆", score: "3/5" },
    { label: "VLM 审查", stars: "★★★★☆", score: "4/5" },
  ];
  for (const sc of scores) {
    s.addText(sc.label, {
      x: rpX + 0.2, y: ry, w: 0.9, h: 0.16,
      fontSize: 7.5, fontFace: "Microsoft YaHei", color: C.textSecond,
    });
    s.addText(sc.stars, {
      x: rpX + 1.15, y: ry, w: 1.2, h: 0.16,
      fontSize: 8, fontFace: "Microsoft YaHei", color: C.gold,
    });
    s.addText(sc.score, {
      x: rpX + 2.5, y: ry, w: 0.5, h: 0.16,
      fontSize: 7.5, fontFace: "Microsoft YaHei", color: C.textPrimary,
    });
    ry += 0.18;
  }

  // ── Recommendation badge ──
  ry += 0.12;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: rpX + 0.15, y: ry, w: rpW - 0.3, h: 0.55, rectRadius: 0.1,
    fill: { color: C.stepGreen, transparency: 90 }, line: { color: C.stepGreen, width: 1 },
  });
  s.addText("✅ 建议推进", {
    x: rpX + 0.25, y: ry + 0.04, w: 2, h: 0.2,
    fontSize: 10, fontFace: "Microsoft YaHei", color: C.green, bold: true,
  });
  s.addText("综合评分 4.0/5 — 视觉基线需更新", {
    x: rpX + 0.25, y: ry + 0.27, w: rpW - 0.6, h: 0.2,
    fontSize: 8, fontFace: "Microsoft YaHei", color: C.textPrimary,
  });

  // ────── F. Bottom Handoff bar ──────
  const hbY = 6.45, hbH = 0.85;
  // Label
  s.addText("🔗 下游联动 — 建议推进后的 Handoff 路径", {
    x: 0.4, y: hbY - 0.25, w: 6, h: 0.2,
    fontSize: 8.5, fontFace: "Microsoft YaHei", color: C.textMuted, italic: true,
  });

  // Handoff items
  const handoffItems = [
    { label: "✅ 推进\nui-test", color: C.green, type: "Agent" },
    { label: "Skill\nplaywright-config", color: C.teal, type: "Skill" },
    { label: "Agent\nui-test-governance", color: C.stepPurple, type: "Agent" },
    { label: "Skill\nplaywright-azure", color: C.stepBlue, type: "Skill" },
    { label: "Skill\nplaywright-vlm", color: C.stepRed, type: "Skill" },
    { label: "Skill\nCI/CD Gate", color: C.gold, type: "Skill" },
  ];
  const hbStartX = 0.4;
  const hbItemW = 1.8;
  const hbGap = 0.35;
  for (let i = 0; i < handoffItems.length; i++) {
    const hi = handoffItems[i];
    const hx = hbStartX + i * (hbItemW + hbGap);

    // Item card
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: hx, y: hbY, w: hbItemW, h: 0.55, rectRadius: 0.08,
      fill: { color: C.cardBg }, line: { color: hi.color, width: 1.2 }, shadow: mkShadow(),
    });
    // Type label top-left
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: hx + 0.06, y: hbY + 0.06, w: 0.42, h: 0.16, rectRadius: 0.04,
      fill: { color: hi.color },
    });
    s.addText(hi.type, {
      x: hx + 0.06, y: hbY + 0.06, w: 0.42, h: 0.16,
      fontSize: 6, fontFace: "Microsoft YaHei", color: C.white, align: "center", valign: "middle", bold: true,
    });
    // Label text
    const lines = hi.label.split("\n");
    s.addText(lines[1] || lines[0], {
      x: hx + 0.06, y: hbY + 0.28, w: hbItemW - 0.12, h: 0.2,
      fontSize: 7.5, fontFace: "Microsoft YaHei", color: C.textPrimary, valign: "middle",
    });

    // Arrow between items
    if (i < handoffItems.length - 1) {
      s.addText("→", {
        x: hx + hbItemW + 0.03, y: hbY + 0.12, w: 0.3, h: 0.3,
        fontSize: 14, fontFace: "Arial", color: C.textMuted, align: "center", valign: "middle",
      });
    }
  }

  // ────── Save ──────
  const outPath = "docs/presentations/ui-test-collab-workflow.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("✅ PPT generated:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
