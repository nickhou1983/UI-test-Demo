/**
 * generate-ui-test-solution-v3-ppt.cjs
 * ──────────────────────────────────────────────────────────────────────────
 * 生成 11 页 16:9 宽屏技术方案 PPT：
 *   docs/presentations/ui-test-solution-v3.pptx
 * 涵盖：
 *   P1 封面：TravelVista UI 智能自动化测试方案 (V3)
 *   P2 演进脉络：UI 自动化测试的五代演进与四大维度跃迁
 *   P3 痛点与核心设计范式（AI 探索探路 × Playwright 确定性回归）
 *   P4 总体架构：7 Agents × 9 Skills 分层协同矩阵
 *   P5 多通道站点探索机制（Static + Browser Use + playwright-cli + Computer Use）
 *   P6 六步质量门控工作流（6-Gate Pipeline）
 *   P7 三层测试金字塔落地：CT 组件测试与 E2E 端到端旅程
 *   P8 视觉回归五步去抖与 GPT-4o VLM 语义复核
 *   P9 全金字塔 CI/CD 门禁与跨 OS 云端基线治理
 *   P10 交付物契约与全链路可观测性
 *   P11 三阶段演进路线图与落地总结
 * ──────────────────────────────────────────────────────────────────────────
 */

const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

const {
  FaRobot,
  FaSearch,
  FaPuzzlePiece,
  FaCamera,
  FaShieldAlt,
  FaChartBar,
  FaCheckCircle,
  FaCogs,
  FaCode,
  FaEye,
  FaRoute,
  FaLayerGroup,
  FaClipboardCheck,
  FaLock,
  FaCloudUploadAlt,
  FaFileAlt,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaDesktop,
  FaTerminal,
  FaCompass,
  FaBolt,
  FaBalanceScale,
  FaRocket,
  FaSitemap,
  FaBug,
  FaUniversalAccess,
} = require("react-icons/fa");

// ── Color Palette (Teal Trust & Midnight Slate) ──
const C = {
  darkBg: "0B132B",
  darkCard: "152244",
  darkCardAlt: "1C2D5A",
  darkBorder: "2A3F73",
  lightBg: "F8FAFC",
  lightCard: "FFFFFF",
  lightSubtle: "F1F5F9",
  lightBorder: "E2E8F0",
  ink: "0F172A",
  slate700: "334155",
  slate500: "64748B",
  slate300: "CBD5E1",
  white: "FFFFFF",
  teal: "0D9488",
  cyan: "06B6D4",
  mint: "10B981",
  blue: "3B82F6",
  indigo: "6366F1",
  purple: "8B5CF6",
  amber: "F59E0B",
  coral: "EF4444",
};

const FONT = {
  head: "PingFang SC",
  body: "PingFang SC",
  mono: "Menlo",
};

// ── Icon Rasterizer ──
function renderIconSvg(IconComponent, hexColor, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: "#" + hexColor, size: String(size) })
  );
}

async function iconPng(IconComponent, hexColor, size = 256) {
  const svg = renderIconSvg(IconComponent, hexColor, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Always create fresh shadow objects to avoid PptxGenJS in-place mutation bugs
const mkShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 8,
  offset: 2,
  angle: 135,
  opacity: 0.10,
});

const mkDarkShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 10,
  offset: 3,
  angle: 135,
  opacity: 0.28,
});

// ── Layout Helpers ──
function addSlideHeader(slide, pres, eyebrow, title, subtitle, dark = false) {
  slide.background = { color: dark ? C.darkBg : C.lightBg };

  // Eyebrow badge
  slide.addText(eyebrow, {
    x: 0.65,
    y: 0.38,
    w: 6.0,
    h: 0.24,
    fontFace: FONT.head,
    fontSize: 10,
    bold: true,
    color: dark ? C.cyan : C.teal,
    charSpacing: 1.5,
    margin: 0,
  });

  // Main slide title
  slide.addText(title, {
    x: 0.65,
    y: 0.62,
    w: 12.0,
    h: 0.42,
    fontFace: FONT.head,
    fontSize: 24,
    bold: true,
    color: dark ? C.white : C.ink,
    margin: 0,
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.65,
      y: 1.05,
      w: 12.0,
      h: 0.28,
      fontFace: FONT.body,
      fontSize: 11.5,
      color: dark ? C.slate300 : C.slate500,
      margin: 0,
    });
  }
}

function addFooter(slide, pageNum, totalPages = 11, dark = false) {
  slide.addText("TravelVista · UI 智能自动化测试体系技术方案 (Playwright + Agent + Skill + VLM)", {
    x: 0.65,
    y: 7.08,
    w: 6.5,
    h: 0.22,
    fontFace: FONT.body,
    fontSize: 8.5,
    color: dark ? C.slate500 : C.slate500,
    margin: 0,
  });
  slide.addText(`${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`, {
    x: 11.2,
    y: 7.08,
    w: 1.48,
    h: 0.22,
    fontFace: FONT.body,
    fontSize: 9,
    bold: true,
    color: dark ? C.slate300 : C.slate700,
    align: "right",
    margin: 0,
  });
}

function addCard(slide, pres, { x, y, w, h, fill, border, accentColor, accentSide = "left", dark = false }) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x,
    y,
    w,
    h,
    fill: { color: fill || (dark ? C.darkCard : C.lightCard) },
    line: { color: border || (dark ? C.darkBorder : C.lightBorder), width: 1 },
    shadow: dark ? mkDarkShadow() : mkShadow(),
  });
  if (accentColor) {
    if (accentSide === "top") {
      slide.addShape(pres.shapes.RECTANGLE, {
        x,
        y,
        w,
        h: 0.06,
        fill: { color: accentColor },
        line: { color: accentColor, width: 0 },
      });
    } else {
      slide.addShape(pres.shapes.RECTANGLE, {
        x,
        y,
        w: 0.07,
        h,
        fill: { color: accentColor },
        line: { color: accentColor, width: 0 },
      });
    }
  }
}

function addIconBadge(slide, pres, { x, y, size = 0.42, bgColor, iconData }) {
  slide.addShape(pres.shapes.OVAL, {
    x,
    y,
    w: size,
    h: size,
    fill: { color: bgColor },
    line: { color: bgColor, width: 0 },
  });
  const pad = size * 0.24;
  slide.addImage({
    data: iconData,
    x: x + pad,
    y: y + pad,
    w: size - pad * 2,
    h: size - pad * 2,
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches
  pres.author = "GitHub Copilot";
  pres.company = "TravelVista";
  pres.subject = "UI 智能自动化测试体系技术方案";
  pres.title = "TravelVista UI 智能自动化测试方案 (V3)";

  // Pre-render crisp white and colored icons
  const I = {
    robotW: await iconPng(FaRobot, C.white),
    searchW: await iconPng(FaSearch, C.white),
    puzzleW: await iconPng(FaPuzzlePiece, C.white),
    cameraW: await iconPng(FaCamera, C.white),
    shieldW: await iconPng(FaShieldAlt, C.white),
    chartW: await iconPng(FaChartBar, C.white),
    checkW: await iconPng(FaCheckCircle, C.white),
    cogsW: await iconPng(FaCogs, C.white),
    codeW: await iconPng(FaCode, C.white),
    eyeW: await iconPng(FaEye, C.white),
    routeW: await iconPng(FaRoute, C.white),
    layersW: await iconPng(FaLayerGroup, C.white),
    clipboardW: await iconPng(FaClipboardCheck, C.white),
    lockW: await iconPng(FaLock, C.white),
    cloudW: await iconPng(FaCloudUploadAlt, C.white),
    fileW: await iconPng(FaFileAlt, C.white),
    warnW: await iconPng(FaExclamationTriangle, C.white),
    diagramW: await iconPng(FaProjectDiagram, C.white),
    desktopW: await iconPng(FaDesktop, C.white),
    terminalW: await iconPng(FaTerminal, C.white),
    compassW: await iconPng(FaCompass, C.white),
    boltW: await iconPng(FaBolt, C.white),
    scaleW: await iconPng(FaBalanceScale, C.white),
    rocketW: await iconPng(FaRocket, C.white),
    sitemapW: await iconPng(FaSitemap, C.white),
    bugW: await iconPng(FaBug, C.white),
    a11yW: await iconPng(FaUniversalAccess, C.white),
    checkMint: await iconPng(FaCheckCircle, C.mint),
    warnAmber: await iconPng(FaExclamationTriangle, C.amber),
    warnCoral: await iconPng(FaExclamationTriangle, C.coral),
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 1 — Cover (Dark)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };

    // Left hero accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.65,
      y: 1.15,
      w: 0.09,
      h: 4.85,
      fill: { color: C.cyan },
      line: { color: C.cyan, width: 0 },
    });

    // Eyebrow badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.95,
      y: 1.18,
      w: 4.3,
      h: 0.34,
      fill: { color: C.darkCardAlt },
      line: { color: C.cyan, width: 1 },
    });
    s.addText("AI-NATIVE UI TESTING ARCHITECTURE · V3", {
      x: 1.05,
      y: 1.22,
      w: 4.1,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 10,
      bold: true,
      color: C.cyan,
      charSpacing: 1.2,
      margin: 0,
    });

    // Main title (intentional 2-line break to avoid orphan wrap)
    s.addText("TravelVista UI 智能自动化\n测试架构与工程实践方案", {
      x: 0.95,
      y: 1.68,
      w: 7.1,
      h: 1.18,
      fontFace: FONT.head,
      fontSize: 32,
      bold: true,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    // Subtitle
    s.addText("多通道智能探索（Browser Use / Computer Use）× 确定性 Playwright 执行 × GPT-4o VLM 视觉治理", {
      x: 0.95,
      y: 2.98,
      w: 7.0,
      h: 0.65,
      fontFace: FONT.body,
      fontSize: 13.5,
      color: C.slate300,
      valign: "top",
      margin: 0,
    });

    // 4 capability pills on left
    const pills = [
      { label: "四通道智能探索 (Static AST / Browser Use / CLI / Computer Use)", color: C.teal },
      { label: "7 Agents × 9 Skills 职责解耦与单一配置所有权", color: C.blue },
      { label: "6-Gate 端到端质量门控 + Git Commit 缓存新鲜度校验", color: C.purple },
      { label: "CT + E2E + Visual 全金字塔回归 + GPT-4o VLM 语义复核", color: C.mint },
    ];
    pills.forEach((p, idx) => {
      const py = 3.88 + idx * 0.52;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.95,
        y: py,
        w: 6.8,
        h: 0.40,
        fill: { color: C.darkCard },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.95,
        y: py,
        w: 0.08,
        h: 0.40,
        fill: { color: p.color },
        line: { color: p.color, width: 0 },
      });
      s.addText(p.label, {
        x: 1.18,
        y: py + 0.07,
        w: 6.4,
        h: 0.26,
        fontFace: FONT.body,
        fontSize: 11.5,
        color: C.white,
        margin: 0,
      });
    });

    // Right column: 4 key architecture KPI cards
    const kpis = [
      { num: "7 × 9", title: "Agent × Skill 协同矩阵", desc: "7 个专业 Agent 负责门控编排，9 个可复用 Skill 提供工程模板", icon: I.robotW, color: C.cyan },
      { num: "4 Channels", title: "多通道全边界站点探索", desc: "覆盖源码 AST、Browser Use、playwright-cli 与 Computer Use", icon: I.compassW, color: C.teal },
      { num: "30+ Specs", title: "三层测试金字塔覆盖", desc: "9 个组件 CT + 6 组 21 条 E2E 旅程 + 24 张跨视口双语快照", icon: I.layersW, color: C.purple },
      { num: "6 Gates", title: "端到端强门控闭环", desc: "发现、配置、夹具、生成、执行、分段报告全流程可追溯", icon: I.shieldW, color: C.mint },
    ];
    kpis.forEach((k, idx) => {
      const ky = 1.15 + idx * 1.32;
      addCard(s, pres, { x: 8.15, y: ky, w: 4.53, h: 1.18, accentColor: k.color, dark: true });
      addIconBadge(s, pres, { x: 8.38, y: ky + 0.22, size: 0.46, bgColor: k.color, iconData: k.icon });
      s.addText(
        [
          { text: `${k.num}  `, options: { fontSize: 17, bold: true, color: k.color } },
          { text: k.title, options: { fontSize: 12.5, bold: true, color: C.white } },
        ],
        {
          x: 9.0,
          y: ky + 0.16,
          w: 3.55,
          h: 0.34,
          fontFace: FONT.head,
          valign: "middle",
          margin: 0,
        }
      );
      s.addText(k.desc, {
        x: 9.0,
        y: ky + 0.56,
        w: 3.55,
        h: 0.48,
        fontFace: FONT.body,
        fontSize: 10,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    addFooter(s, 1, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 2 — 5-Generation Evolution of UI Automated Testing (Light)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "01 / EVOLUTION OF UI AUTOMATED TESTING",
      "UI 自动化测试的五代演进：从死板录制到 Agentic 混合范式",
      "三十余年历经五次代际跨越，当前架构处于第五代：AI 负责多通道探索与生成，确定性代码负责毫秒级守门",
      false
    );

    const gens = [
      {
        era: "GEN 01 · 1990s–2000s",
        title: "坐标与图像录制",
        stack: "QTP / WinRunner / Sikuli",
        solved: "首次实现零代码桌面与网页操作录制回放。",
        limit: "局限：强耦合屏幕坐标与分辨率，UI 微调即全线崩溃。",
        color: C.slate500,
        highlight: false,
      },
      {
        era: "GEN 02 · 2004–2016",
        title: "WebDriver 协议时代",
        stack: "Selenium / Appium",
        solved: "确立跨浏览器 W3C 标准，依靠 XPath/CSS 嵌入 CI。",
        limit: "局限：HTTP 跨进程链路长，手写 sleep 导致高 Flaky 率。",
        color: C.amber,
        highlight: false,
      },
      {
        era: "GEN 03 · 2017–2022",
        title: "现代自等待与全栈",
        stack: "Playwright / Cypress / CT",
        solved: "内核级 Auto-Wait + getByRole 无障碍树 + 组件隔离挂载。",
        limit: "局限：手写维护成本高，纯像素对比易受渲染噪音误报。",
        color: C.blue,
        highlight: false,
      },
      {
        era: "GEN 04 · 2023–2024",
        title: "纯 AI Agent 实时驱动",
        stack: "纯 LLM Browser / CUA",
        solved: "自然语言零代码探查黑盒页面，动态 DOM 自适应极强。",
        limit: "局限：单步秒级推理慢、Token 昂贵、非确定性难做门禁。",
        color: C.purple,
        highlight: false,
      },
      {
        era: "GEN 05 · 2025–至今 (本方案)",
        title: "Agentic 混合工程范式",
        stack: "Agent × Skill × Playwright",
        solved: "AI 多通道探路生成契约 + Playwright 零 Token 毫秒回归。",
        limit: "突破：Pixel-First + VLM 语义复核，兼顾覆盖广度与稳定。",
        color: C.teal,
        highlight: true,
      },
    ];

    gens.forEach((g, i) => {
      const gx = 0.65 + i * 2.44;
      const gw = 2.27;
      addCard(s, pres, {
        x: gx,
        y: 1.48,
        w: gw,
        h: 3.00,
        fill: g.highlight ? C.darkCard : C.lightCard,
        border: g.highlight ? C.teal : C.lightBorder,
        accentColor: g.color,
        accentSide: "top",
        dark: g.highlight,
      });

      s.addText(g.era, {
        x: gx + 0.14,
        y: 1.62,
        w: gw - 0.28,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 8.2,
        bold: true,
        color: g.highlight ? C.cyan : g.color,
        valign: "top",
        margin: 0,
      });

      s.addText(g.title, {
        x: gx + 0.14,
        y: 1.84,
        w: gw - 0.28,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 12,
        bold: true,
        color: g.highlight ? C.white : C.ink,
        valign: "top",
        margin: 0,
      });

      // Tech stack pill
      s.addShape(pres.shapes.RECTANGLE, {
        x: gx + 0.14,
        y: 2.18,
        w: gw - 0.28,
        h: 0.28,
        fill: { color: g.highlight ? C.darkCardAlt : C.lightSubtle },
        line: { color: g.highlight ? C.darkBorder : C.lightBorder, width: 1 },
      });
      s.addText(g.stack, {
        x: gx + 0.18,
        y: 2.20,
        w: gw - 0.36,
        h: 0.24,
        fontFace: FONT.mono,
        fontSize: 8.0,
        bold: true,
        color: g.highlight ? C.cyan : C.slate700,
        valign: "middle",
        margin: 0,
      });

      // Solved
      s.addText("核心价值：", {
        x: gx + 0.14,
        y: 2.56,
        w: gw - 0.28,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 8.8,
        bold: true,
        color: g.highlight ? C.mint : C.teal,
        valign: "top",
        margin: 0,
      });
      s.addText(g.solved, {
        x: gx + 0.14,
        y: 2.76,
        w: gw - 0.28,
        h: 0.62,
        fontFace: FONT.body,
        fontSize: 8.8,
        color: g.highlight ? C.slate300 : C.slate700,
        valign: "top",
        margin: 0,
      });

      // Limit / Breakthrough
      s.addShape(pres.shapes.RECTANGLE, {
        x: gx + 0.14,
        y: 3.46,
        w: gw - 0.28,
        h: 0.88,
        fill: { color: g.highlight ? C.darkCardAlt : C.lightSubtle },
        line: { color: g.highlight ? C.teal : C.lightBorder, width: 1 },
      });
      s.addText(g.limit, {
        x: gx + 0.20,
        y: 3.52,
        w: gw - 0.40,
        h: 0.76,
        fontFace: FONT.body,
        fontSize: 8.5,
        bold: g.highlight,
        color: g.highlight ? C.white : C.slate500,
        valign: "top",
        margin: 0,
      });
    });

    // Bottom section: 4 Core Dimension Leaps
    s.addText("支撑代际跨越的四大核心技术维度跃迁", {
      x: 0.65,
      y: 4.66,
      w: 12.0,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 12.5,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });

    const leaps = [
      {
        dim: "01 · 定位器维度 (Locator)",
        route: "XPath → getByRole 语义契约",
        desc: "告别易碎样式类名，采用 getByRole + Landmark 消歧，并通过源码 AST 与运行时 DOM 双重校准。",
        icon: I.compassW,
        color: C.teal,
      },
      {
        dim: "02 · 等待同步维度 (Sync)",
        route: "手写 sleep → 确定性多步去抖",
        desc: "内核级 Auto-Wait 结合冻结周期计时器、注入禁动画 CSS、校验字体与懒加载图片全量就绪。",
        icon: I.boltW,
        color: C.blue,
      },
      {
        dim: "03 · 测试分层维度 (Pyramid)",
        route: "重度 E2E → CT + E2E + Visual",
        desc: "底层 CT 毫秒级验证组件 Props 与键盘焦点，中层 E2E 覆盖跨页旅程，顶层快照锁定多端布局。",
        icon: I.layersW,
        color: C.purple,
      },
      {
        dim: "04 · 视觉裁决维度 (Verdict)",
        route: "纯像素对比 → Pixel + VLM 漏斗",
        desc: "绝大多数常规回归走免费毫秒级像素对比；仅在像素报警时按需调用 VLM 携带三图做语义降噪。",
        icon: I.eyeW,
        color: C.mint,
      },
    ];

    leaps.forEach((lp, i) => {
      const lx = 0.65 + i * 3.06;
      addCard(s, pres, { x: lx, y: 5.00, w: 2.84, h: 1.84, accentColor: lp.color, accentSide: "left", dark: false });
      addIconBadge(s, pres, { x: lx + 0.18, y: 5.16, size: 0.36, bgColor: lp.color, iconData: lp.icon });
      s.addText(lp.dim, {
        x: lx + 0.62,
        y: 5.14,
        w: 2.08,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 9.2,
        bold: true,
        color: lp.color,
        valign: "top",
        margin: 0,
      });
      s.addText(lp.route, {
        x: lx + 0.62,
        y: 5.36,
        w: 2.08,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 9.2,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
      s.addText(lp.desc, {
        x: lx + 0.18,
        y: 5.72,
        w: 2.52,
        h: 1.00,
        fontFace: FONT.body,
        fontSize: 8.8,
        color: C.slate700,
        valign: "top",
        margin: 0,
      });
    });

    addFooter(s, 2, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 3 — Executive Summary: Pain Points vs Core Paradigm (Light)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "02 / EXECUTIVE SUMMARY",
      "痛点与核心设计范式：AI 动态探路 × Playwright 确定性守门",
      "将“高适应性的 AI 浏览器探索”与“毫秒级零 Token 成本的确定性代码回归”解耦，兼顾覆盖广度与 CI 稳定性",
      false
    );

    // Left Card: Traditional Pain Points
    addCard(s, pres, { x: 0.65, y: 1.48, w: 5.82, h: 4.12, accentColor: C.coral, accentSide: "top", dark: false });
    s.addText("传统 UI 自动化与纯 AI 测试的四大瓶颈", {
      x: 0.9,
      y: 1.68,
      w: 5.3,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 15,
      bold: true,
      color: C.ink,
      margin: 0,
    });

    const pains = [
      { title: "手写脚本冷启动慢、选择器易碎", desc: "缺少前置路由与 Locator 策略分析，散落硬编码 CSS 选择器，UI 微调即大面积报错。" },
      { title: "跨边界与登录态场景难以覆盖", desc: "SSO 登录态复用困难，遇到系统原生文件选择框、OS 权限弹窗时传统 DOM 工具直接卡死。" },
      { title: "纯 LLM 驱动回归慢、贵、不确定", desc: "每步依赖大模型推理，耗时数十秒且消耗大量 Token，断言缺乏像素/存储级精确度。" },
      { title: "视觉对比噪音多、跨平台基线冲突", desc: "轮播图/字体渲染微差导致误报；本地 macOS (-darwin) 与云端 Linux (-linux) 快照不兼容。" },
    ];
    pains.forEach((p, i) => {
      const py = 2.18 + i * 0.82;
      s.addImage({ data: I.warnCoral, x: 0.92, y: py + 0.04, w: 0.24, h: 0.24 });
      s.addText(p.title, {
        x: 1.26,
        y: py,
        w: 4.95,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 11.5,
        bold: true,
        color: C.ink,
        margin: 0,
      });
      s.addText(p.desc, {
        x: 1.26,
        y: py + 0.27,
        w: 4.95,
        h: 0.44,
        fontFace: FONT.body,
        fontSize: 9.8,
        color: C.slate500,
        margin: 0,
      });
    });

    // Right Card: Our Solution Paradigm
    addCard(s, pres, { x: 6.85, y: 1.48, w: 5.82, h: 4.12, accentColor: C.teal, accentSide: "top", dark: false });
    s.addText("本方案解法：AI 探路 × 代码守门 × VLM 复核", {
      x: 7.1,
      y: 1.68,
      w: 5.3,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 15,
      bold: true,
      color: C.ink,
      margin: 0,
    });

    const solutions = [
      { title: "多通道探索层 (Browser Use + CLI + Computer Use)", desc: "发现阶段按需调用实时浏览器与桌面引擎，探明路由、I/O 与原生弹窗并映射为标准 API。" },
      { title: "契约驱动确定性生成 (Playwright CT / E2E / Visual)", desc: "基于 Discovery 契约生成 100% 确定性脚本，注入状态隔离、异常监听与语义化定位器。" },
      { title: "像素比对优先 + VLM 语义兜底", desc: "先走确定性去抖与原生像素门禁；仅当像素失败且显式开启 VLM 时做智能噪音裁定。" },
      { title: "全链路质量门控 + Report-Only 只读报告", desc: "绑定 Git Commit 增量复用发现结果；测试失败只输出根因诊断，绝不擅自篡改源码或基线。" },
    ];
    solutions.forEach((sol, i) => {
      const sy = 2.18 + i * 0.82;
      s.addImage({ data: I.checkMint, x: 7.12, y: sy + 0.04, w: 0.24, h: 0.24 });
      s.addText(sol.title, {
        x: 7.46,
        y: sy,
        w: 4.95,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 11.5,
        bold: true,
        color: C.ink,
        margin: 0,
      });
      s.addText(sol.desc, {
        x: 7.46,
        y: sy + 0.27,
        w: 4.95,
        h: 0.44,
        fontFace: FONT.body,
        fontSize: 9.8,
        color: C.slate500,
        margin: 0,
      });
    });

    // Bottom KPI Strip
    const bottomStats = [
      { k: "8 Routes / 9 Components", v: "100% 静态+动态映射覆盖", c: C.teal },
      { k: "0 Token 常规回归", v: "CI 默认运行确定性 Playwright", c: C.blue },
      { k: "≤ 10 次 / Run", v: "VLM 严格调用上限预算控制", c: C.purple },
      { k: "100% Report-Only", v: "严禁自动覆盖基线与业务代码", c: C.mint },
    ];
    bottomStats.forEach((st, i) => {
      const bx = 0.65 + i * 3.06;
      addCard(s, pres, { x: bx, y: 5.82, w: 2.84, h: 1.02, fill: C.lightSubtle, accentColor: st.c, dark: false });
      s.addText(st.k, {
        x: bx + 0.18,
        y: 5.95,
        w: 2.55,
        h: 0.34,
        fontFace: FONT.head,
        fontSize: 13.5,
        bold: true,
        color: st.c,
        margin: 0,
      });
      s.addText(st.v, {
        x: bx + 0.18,
        y: 6.35,
        w: 2.55,
        h: 0.32,
        fontFace: FONT.body,
        fontSize: 10,
        color: C.slate700,
        margin: 0,
      });
    });

    addFooter(s, 3, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 4 — Engine Comparison: Playwright vs Browser Use vs Computer Use (Dark)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "02B / CORE ENGINE COMPARISON",
      "三大核心引擎对比：Playwright · Browser Use · Computer Use",
      "厘清“网页确定性代码引擎”、“AI 实时浏览器协作引擎”与“AI 操作系统桌面引擎”的能力边界与黄金分工",
      true
    );

    const engines = [
      {
        tag: "ENGINE 01 · 确定性回归守门员",
        name: "Playwright",
        scope: "控制边界：浏览器网页内部 (DOM / 无障碍树)",
        principle: "底层原理：通过浏览器内核协议直接运行编译好的 .spec.ts 测试代码，内置 Auto-Wait 自动等待。",
        pros: "核心优势：毫秒级极速执行、0 Token 消耗、结果 100% 确定可复现，天然支持云端无头 (Headless CI) 高并发。",
        limit: "能力边界：无法操作浏览器外的系统原生文件框；遇到首次扫码/滑块登录需提前准备凭证。",
        icon: I.boltW,
        color: C.mint,
      },
      {
        tag: "ENGINE 02 · 实时网页侦察兵",
        name: "Browser Use (MCP)",
        scope: "控制边界：开发者已打开的 Chrome/Edge 标签页",
        principle: "底层原理：AI 直接接管真人正在使用的浏览器标签页，支持“真人扫码登录 → AI 接手探查”无缝交接。",
        pros: "核心优势：免密穿透企业微信/SSO/MFA 登录墙；可随时注入 JS 探针采集动态渲染后的 DOM 与存储状态。",
        limit: "能力边界：仍受限于网页沙盒内部（看不见操作系统弹窗）；单步需 AI 参与，不适合跑海量日常回归。",
        icon: I.compassW,
        color: C.cyan,
      },
      {
        tag: "ENGINE 03 · 跨界破局特种兵",
        name: "Computer Use (MCP)",
        scope: "控制边界：整个电脑操作系统桌面与原生窗口",
        principle: "底层原理：跳出浏览器限制，站在 macOS / Windows 操作系统桌面视角，模拟真人鼠标键盘操控任意系统窗口。",
        pros: "核心优势：唯一能操作 <input type=file> 系统原生文件夹窗口、OS 权限框、系统打印框及桌面应用的引擎。",
        limit: "能力边界：强依赖图形桌面环境且耗时较长，探明路径后需翻译为 Playwright 标准接口才能上云端 CI。",
        icon: I.desktopW,
        color: C.coral,
      },
    ];

    engines.forEach((eng, i) => {
      const ex = 0.65 + i * 4.10;
      addCard(s, pres, { x: ex, y: 1.46, w: 3.82, h: 3.38, accentColor: eng.color, accentSide: "top", dark: true });
      addIconBadge(s, pres, { x: ex + 0.20, y: 1.62, size: 0.42, bgColor: eng.color, iconData: eng.icon });

      s.addText(eng.tag, {
        x: ex + 0.72,
        y: 1.60,
        w: 2.92,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 8.8,
        bold: true,
        color: eng.color,
        valign: "top",
        margin: 0,
      });
      s.addText(eng.name, {
        x: ex + 0.72,
        y: 1.82,
        w: 2.92,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 13.0,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: ex + 0.20,
        y: 2.15,
        w: 3.42,
        h: 0.26,
        fill: { color: C.darkCardAlt },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(eng.scope, {
        x: ex + 0.28,
        y: 2.17,
        w: 3.26,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 8.6,
        bold: true,
        color: eng.color,
        valign: "middle",
        margin: 0,
      });

      s.addText(eng.principle, {
        x: ex + 0.20,
        y: 2.48,
        w: 3.42,
        h: 0.64,
        fontFace: FONT.body,
        fontSize: 9.0,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });

      s.addText(`✓ ${eng.pros}`, {
        x: ex + 0.20,
        y: 3.16,
        w: 3.42,
        h: 0.68,
        fontFace: FONT.body,
        fontSize: 9.0,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      s.addText(`! ${eng.limit}`, {
        x: ex + 0.20,
        y: 3.88,
        w: 3.42,
        h: 0.66,
        fontFace: FONT.body,
        fontSize: 8.8,
        color: C.amber,
        valign: "top",
        margin: 0,
      });
    });

    // Bottom Comparison Matrix Card
    addCard(s, pres, { x: 0.65, y: 5.14, w: 12.02, h: 1.66, fill: C.darkCardAlt, accentColor: C.cyan, dark: true });
    s.addText("四大核心维度横向速查表（为什么三者缺一不可？）", {
      x: 0.90,
      y: 5.24,
      w: 11.5,
      h: 0.24,
      fontFace: FONT.head,
      fontSize: 11.2,
      bold: true,
      color: C.cyan,
      valign: "top",
      margin: 0,
    });

    const matrixRows = [
      ["对比维度", "Playwright（确定性代码引擎）", "Browser Use（AI 实时浏览器）", "Computer Use（AI 桌面引擎）"],
      ["操控视野", "网页内部（DOM 树 / 无障碍树 / 网络）", "真实 Chrome/Edge 标签页（含已登录态）", "整个电脑桌面屏幕与操作系统原生窗口"],
      ["登录与系统弹窗", "依赖已导出的登录凭证 / 无法点系统弹窗", "支持真人扫码/MFA 交接 / 无法点系统弹窗", "通吃 macOS/Win 原生文件选择框与权限框"],
      ["在本方案中的分工", "【回归期主力】毫秒级、0 Token 跑 CI 门禁", "【探索期前锋】免密进场、动态采集页面结构", "【探索期特种兵】跨越浏览器边界打通死角"],
    ];

    const colWidths = [1.85, 3.32, 3.32, 3.13];
    matrixRows.forEach((row, rIdx) => {
      const ry = 5.56 + rIdx * 0.28;
      let curX = 0.90;
      row.forEach((cell, cIdx) => {
        const cw = colWidths[cIdx];
        const isHeader = rIdx === 0;
        s.addShape(pres.shapes.RECTANGLE, {
          x: curX,
          y: ry,
          w: cw,
          h: 0.26,
          fill: { color: isHeader ? C.darkCard : C.darkBg },
          line: { color: C.darkBorder, width: 0.75 },
        });
        const textColor = isHeader
          ? cIdx === 1
            ? C.mint
            : cIdx === 2
            ? C.cyan
            : cIdx === 3
            ? C.coral
            : C.white
          : cIdx === 0
          ? C.cyan
          : C.slate300;
        s.addText(cell, {
          x: curX + 0.10,
          y: ry + 0.03,
          w: cw - 0.20,
          h: 0.20,
          fontFace: isHeader || cIdx === 0 ? FONT.head : FONT.body,
          fontSize: isHeader ? 8.8 : 8.4,
          bold: isHeader || cIdx === 0,
          color: textColor,
          valign: "middle",
          margin: 0,
        });
        curX += cw;
      });
    });

    addFooter(s, 4, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 4 — Overall Architecture: 7 Agents × 9 Skills (Dark)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "03 / AGENT & SKILL ARCHITECTURE",
      "总体架构：7 个专业 Agent × 9 个可复用 Skill 分层矩阵",
      "Agent 负责门控流转、状态判断与责任边界；Skill 负责标准代码模板与工具执行指令，实现调度与实现解耦",
      true
    );

    // Layer 1: Entry & Independent Review
    addCard(s, pres, { x: 0.65, y: 1.45, w: 7.65, h: 1.08, accentColor: C.cyan, dark: true });
    addIconBadge(s, pres, { x: 0.88, y: 1.66, size: 0.42, bgColor: C.cyan, iconData: I.sitemapW });
    s.addText("入口路由层：ui-test (Primary Entry Agent)", {
      x: 1.42,
      y: 1.56,
      w: 6.6,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText("识别测试诉求（CT / E2E / Visual / Discovery / Governance），保持默认路径轻量，支持明确意图直达专业 Agent", {
      x: 1.42,
      y: 1.88,
      w: 6.6,
      h: 0.45,
      fontFace: FONT.body,
      fontSize: 10,
      color: C.slate300,
      margin: 0,
    });

    addCard(s, pres, { x: 8.50, y: 1.45, w: 4.18, h: 1.08, accentColor: C.amber, dark: true });
    addIconBadge(s, pres, { x: 8.72, y: 1.66, size: 0.42, bgColor: C.amber, iconData: I.codeW });
    s.addText("独立审查：code-review Agent", {
      x: 9.25,
      y: 1.56,
      w: 3.25,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText("绑定 code-review Skill，按 6 大维度只读审查代码并输出 CODE_REVIEW_REPORT.md", {
      x: 9.25,
      y: 1.88,
      w: 3.25,
      h: 0.45,
      fontFace: FONT.body,
      fontSize: 9.8,
      color: C.slate300,
      margin: 0,
    });

    // Layer 2: Shared Discovery Layer
    addCard(s, pres, { x: 0.65, y: 2.68, w: 12.03, h: 1.12, accentColor: C.teal, dark: true });
    addIconBadge(s, pres, { x: 0.88, y: 2.92, size: 0.44, bgColor: C.teal, iconData: I.searchW });
    s.addText("共享发现与探索层：ui-test-discovery  ──►  驱动 playwright-explore / playwright-cli / Browser Use / Computer Use", {
      x: 1.45,
      y: 2.78,
      w: 11.0,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText(
      "输出带 git-commit 指纹的 discovery-meta、路由清单、Component I/O 档案、I/O Probe 结果、Locator 策略图、localStorage 状态清单与副作用清单",
      {
        x: 1.45,
        y: 3.12,
        w: 11.0,
        h: 0.48,
        fontFace: FONT.body,
        fontSize: 10,
        color: C.slate300,
        margin: 0,
      }
    );

    // Layer 3: 4 Specialized Execution & Governance Agents
    const execAgents = [
      {
        name: "ui-test-component",
        skill: "Skill: playwright-ct",
        desc: "组件隔离挂载、Props 与事件回调校验、键盘焦点与 ARIA 无障碍验证、Router/i18n Provider 夹具封装 (test-utils.ts)",
        icon: I.puzzleW,
        color: C.mint,
      },
      {
        name: "ui-test-e2e",
        skill: "Skill: playwright-e2e",
        desc: "跨页业务旅程、URL 参数传递、localStorage 状态隔离、pageerror 运行时异常零容忍、POM 复用与副作用拦截",
        icon: I.routeW,
        color: C.blue,
      },
      {
        name: "ui-test-visual",
        skill: "Skill: playwright-visual / vlm",
        desc: "确定性截图去抖 (visual-helpers.ts)、桌面与移动端多视口及多语种像素对比、严禁失败后自动覆盖基线快照",
        icon: I.cameraW,
        color: C.purple,
      },
      {
        name: "ui-test-governance",
        skill: "Skill: playwright-azure / vlm",
        desc: "全金字塔 CI 分层门禁编排、Azure Linux 云端工作区并发执行、darwin/linux 跨 OS 基线治理与 VLM 预算护栏",
        icon: I.shieldW,
        color: C.coral,
      },
    ];
    execAgents.forEach((ag, i) => {
      const ax = 0.65 + i * 3.06;
      addCard(s, pres, { x: ax, y: 3.96, w: 2.85, h: 1.62, accentColor: ag.color, accentSide: "top", dark: true });
      addIconBadge(s, pres, { x: ax + 0.18, y: 4.14, size: 0.38, bgColor: ag.color, iconData: ag.icon });
      s.addText(ag.name, {
        x: ax + 0.64,
        y: 4.10,
        w: 2.1,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 11.2,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });
      s.addText(ag.skill, {
        x: ax + 0.64,
        y: 4.38,
        w: 2.1,
        h: 0.20,
        fontFace: FONT.mono,
        fontSize: 8.2,
        color: ag.color,
        valign: "top",
        margin: 0,
      });
      s.addText(ag.desc, {
        x: ax + 0.18,
        y: 4.68,
        w: 2.50,
        h: 0.82,
        fontFace: FONT.body,
        fontSize: 9.4,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    // Layer 4: Sole Config Owner & Report Artifacts
    addCard(s, pres, { x: 0.65, y: 5.75, w: 5.85, h: 1.08, accentColor: C.amber, dark: true });
    addIconBadge(s, pres, { x: 0.88, y: 5.98, size: 0.40, bgColor: C.amber, iconData: I.cogsW });
    s.addText("唯一配置生成底座：playwright-config Skill", {
      x: 1.42,
      y: 5.88,
      w: 4.9,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 11.5,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText("独占 playwright.config.ts / playwright-ct.config.ts / playwright.service.config.ts 生成权，各 Agent 仅校验不私自生成", {
      x: 1.42,
      y: 6.18,
      w: 4.9,
      h: 0.50,
      fontFace: FONT.body,
      fontSize: 9.5,
      color: C.slate300,
      margin: 0,
    });

    addCard(s, pres, { x: 6.72, y: 5.75, w: 5.96, h: 1.08, accentColor: C.mint, dark: true });
    addIconBadge(s, pres, { x: 6.95, y: 5.98, size: 0.40, bgColor: C.mint, iconData: I.clipboardW });
    s.addText("分段归属报告层：docs/TEST_REPORT.md + playwright-report/", {
      x: 7.48,
      y: 5.88,
      w: 5.0,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 11.5,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText("CT / E2E / Visual 各自维护专属章节与结果总览行，互不覆盖；每次运行强制产出 HTML 与 VLM 审查报告", {
      x: 7.48,
      y: 6.18,
      w: 5.0,
      h: 0.50,
      fontFace: FONT.body,
      fontSize: 9.5,
      color: C.slate300,
      margin: 0,
    });

    addFooter(s, 5, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 5 — Multi-Channel Site Exploration (Light)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "04 / MULTI-CHANNEL EXPLORATION",
      "四通道智能站点探索机制：从源码 AST 到 Browser Use 与 Computer Use",
      "ui-test-discovery 与 playwright-explore 根据目标特征自动选择最轻量的探查通道，并在跨越 DOM 边界时无缝升级",
      false
    );

    const channels = [
      {
        badge: "CHANNEL 01 · 默认首选",
        title: "Static AST 源码分析",
        tool: "src/ 路由·组件·类型扫描",
        when: "本地具备完整前端源码",
        bullets: [
          "解析 App.tsx 8 条路由与 basename 子路径",
          "提取 9 个组件 Props/Events 与 Provider 依赖",
          "识别 zh/en i18n 键名与 localStorage 结构",
          "计算 git-commit 指纹驱动增量更新",
        ],
        icon: I.codeW,
        color: C.teal,
      },
      {
        badge: "CHANNEL 02 · 实时/登录态",
        title: "Browser Use (MCP)",
        tool: "manage_tab / user_tab / eval",
        when: "复用已登录态或实时探查",
        bullets: [
          "接管 Chrome/Edge 已登录标签页免密探查",
          "支持 SSO / MFA / 验证码敏感步骤人工交接",
          "通过 run_javascript 高速采集链接与 ARIA 地标",
          "实时注入探针记录交互前后 DOM 与存储差异",
        ],
        icon: I.compassW,
        color: C.blue,
      },
      {
        badge: "CHANNEL 03 · 干净会话录制",
        title: "playwright-cli",
        tool: "open / snapshot / click / eval",
        when: "无源码探索与自动录制草稿",
        bullets: [
          "独立无状态浏览器会话，遵守 robots.txt",
          "每步输出 YAML 可访问性树快照 (e1, e2 引用)",
          "自动将交互动作录制为 Playwright TS 代码片段",
          "支持路由状态模拟、Cookie/Storage 导入导出",
        ],
        icon: I.terminalW,
        color: C.purple,
      },
      {
        badge: "CHANNEL 04 · 跨 DOM 边界",
        title: "Computer Use (MCP)",
        tool: "exec_js (cua 桌面自动化引擎)",
        when: "触发原生文件框或系统弹窗",
        bullets: [
          "处理原生文件上传/保存框 (<input type=file>)",
          "处理 macOS 系统级权限弹窗与原生打印窗口",
          "支持 Electron / Tauri 等桌面容器内嵌 Web 探查",
          "探测后强制转换为无头 CI 可运行的标准 API",
        ],
        icon: I.desktopW,
        color: C.coral,
      },
    ];

    channels.forEach((ch, i) => {
      const cx = 0.65 + i * 3.06;
      addCard(s, pres, { x: cx, y: 1.48, w: 2.85, h: 3.82, accentColor: ch.color, accentSide: "top", dark: false });
      addIconBadge(s, pres, { x: cx + 0.18, y: 1.68, size: 0.42, bgColor: ch.color, iconData: ch.icon });
      s.addText(ch.badge, {
        x: cx + 0.68,
        y: 1.66,
        w: 2.0,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 8.5,
        bold: true,
        color: ch.color,
        valign: "top",
        margin: 0,
      });
      s.addText(ch.title, {
        x: cx + 0.68,
        y: 1.88,
        w: 2.0,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 12.2,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.18,
        y: 2.24,
        w: 2.49,
        h: 0.30,
        fill: { color: C.lightSubtle },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addText(ch.tool, {
        x: cx + 0.24,
        y: 2.26,
        w: 2.37,
        h: 0.26,
        fontFace: FONT.mono,
        fontSize: 8.0,
        color: C.slate700,
        valign: "middle",
        margin: 0,
      });
      s.addText(`适用：${ch.when}`, {
        x: cx + 0.18,
        y: 2.64,
        w: 2.49,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 9.5,
        bold: true,
        color: ch.color,
        valign: "top",
        margin: 0,
      });

      const bulletItems = ch.bullets.map((b, idx) => ({
        text: b,
        options: { bullet: true, breakLine: idx < ch.bullets.length - 1 },
      }));
      s.addText(bulletItems, {
        x: cx + 0.18,
        y: 2.98,
        w: 2.49,
        h: 2.18,
        fontFace: FONT.body,
        fontSize: 9.4,
        color: C.slate700,
        valign: "top",
        paraSpaceAfter: 6,
        margin: 0,
      });
    });

    // Bottom Translation Banner
    addCard(s, pres, { x: 0.65, y: 5.50, w: 12.03, h: 1.32, fill: C.lightSubtle, accentColor: C.teal, dark: false });
    s.addText("关键工程原则：探索期跨边界接管，生成期强制收敛为确定性 Playwright API（保障 Headless CI 可执行）", {
      x: 0.90,
      y: 5.60,
      w: 11.5,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 11.5,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });

    const mappings = [
      { from: "Computer Use 原生文件选择框", to: "setInputFiles() / filechooser" },
      { from: "Computer Use 系统权限弹窗", to: "context.grantPermissions([...])" },
      { from: "Browser Use 登录态 / Storage", to: "storageState / addInitScript()" },
      { from: "原生 window.confirm / alert", to: "page.once('dialog', d.accept)" },
    ];
    mappings.forEach((m, i) => {
      const mx = 0.90 + i * 2.92;
      s.addShape(pres.shapes.RECTANGLE, {
        x: mx,
        y: 5.96,
        w: 2.78,
        h: 0.72,
        fill: { color: C.white },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addText(m.from, {
        x: mx + 0.12,
        y: 6.04,
        w: 2.54,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 9.2,
        bold: true,
        color: C.teal,
        valign: "top",
        margin: 0,
      });
      s.addText(`→ ${m.to}`, {
        x: mx + 0.12,
        y: 6.34,
        w: 2.54,
        h: 0.26,
        fontFace: FONT.mono,
        fontSize: 8.2,
        color: C.slate700,
        valign: "top",
        margin: 0,
      });
    });

    addFooter(s, 6, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 6 — Multi-Channel Collaboration Case Study (Dark)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "04B / MULTI-CHANNEL RELAY CASE STUDY",
      "四通道协同实战案例：“扫码登录 + 上传护照办签证”接力全流程",
      "一条复杂业务流串联 4 套侦察通道：按卡点自动升级接管，最终 100% 翻译为无头云服务器可执行的标准脚本",
      true
    );

    const relaySteps = [
      {
        baton: "第一棒 · CHANNEL 01",
        title: "Static AST 看图纸",
        meta: "耗时 ~2s · 扫描 src/ 源码",
        gain: "秒级查清 /visa-apply 路由、姓名/国家表单字段、多语言键与 localStorage['visa_draft'] 存储结构。",
        blocker: "遇到卡点：源码显示需企业微信扫码 (SSO) 才能进入，且国家下拉框为动态加载。",
        handoff: "呼叫通道 02 介入扫码",
        icon: I.codeW,
        color: C.teal,
      },
      {
        baton: "第二棒 · CHANNEL 02",
        title: "Browser Use 借门票",
        meta: "耗时 ~10s · 接管已登录标签",
        gain: "人工手机扫码后瞬间接管 Chrome 标签页，导出登录态 Cookie/Storage 电子通行证。",
        blocker: "探针发现：页面顶栏与表单底部各有一个“提交”按钮，存在同名冲突隐患。",
        handoff: "带通行证移交通道 03",
        icon: I.compassW,
        color: C.blue,
      },
      {
        baton: "第三棒 · CHANNEL 03",
        title: "playwright-cli 录快照",
        meta: "耗时 ~15s · 拍无障碍语义树",
        gain: "在干净沙盒注入通行证免密进入，试填“张三/日本”，每步拍 YAML 无障碍树并录成代码草稿。",
        blocker: "遇到卡点：点击“上传护照照片”弹出 macOS 系统原生文件夹窗口，跨出网页边界。",
        handoff: "升级通道 04 操控桌面",
        icon: I.terminalW,
        color: C.purple,
      },
      {
        baton: "第四棒 · CHANNEL 04",
        title: "Computer Use 控桌面",
        meta: "耗时 ~5s · 跨系统弹窗点击",
        gain: "站在电脑桌面视角识别苹果系统文件框，控制鼠标选中 passport-demo.jpg 并点击“打开”。",
        blocker: "打通全链路：网页显示“护照识别成功：张三”，顺利完成最终提交验证。",
        handoff: "转入下方纯代码收敛",
        icon: I.desktopW,
        color: C.coral,
      },
    ];

    relaySteps.forEach((st, i) => {
      const cx = 0.65 + i * 3.08;
      addCard(s, pres, { x: cx, y: 1.48, w: 2.78, h: 3.60, accentColor: st.color, accentSide: "top", dark: true });
      addIconBadge(s, pres, { x: cx + 0.16, y: 1.66, size: 0.40, bgColor: st.color, iconData: st.icon });
      s.addText(st.baton, {
        x: cx + 0.64,
        y: 1.64,
        w: 2.02,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 8.5,
        bold: true,
        color: st.color,
        valign: "top",
        margin: 0,
      });
      s.addText(st.title, {
        x: cx + 0.64,
        y: 1.86,
        w: 2.02,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 10.6,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.16,
        y: 2.20,
        w: 2.46,
        h: 0.28,
        fill: { color: C.darkCardAlt },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(st.meta, {
        x: cx + 0.22,
        y: 2.22,
        w: 2.34,
        h: 0.24,
        fontFace: FONT.mono,
        fontSize: 8.2,
        color: C.cyan,
        valign: "middle",
        margin: 0,
      });

      s.addText(`✓ 侦察收获：${st.gain}`, {
        x: cx + 0.16,
        y: 2.56,
        w: 2.46,
        h: 0.88,
        fontFace: FONT.body,
        fontSize: 9.0,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });

      s.addText(`! 关键节点：${st.blocker}`, {
        x: cx + 0.16,
        y: 3.48,
        w: 2.46,
        h: 0.88,
        fontFace: FONT.body,
        fontSize: 9.0,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.16,
        y: 4.50,
        w: 2.46,
        h: 0.40,
        fill: { color: st.color },
        line: { color: st.color, width: 1 },
      });
      s.addText(`接力 ──► ${st.handoff}`, {
        x: cx + 0.22,
        y: 4.59,
        w: 2.34,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 9.2,
        bold: true,
        color: C.white,
        align: "center",
        valign: "top",
        margin: 0,
      });
    });

    // Bottom Convergence Banner
    addCard(s, pres, { x: 0.65, y: 5.38, w: 12.02, h: 1.44, fill: C.darkCardAlt, accentColor: C.mint, dark: true });
    s.addText("最终一步（生成期翻译收敛）：将 4 个通道的探路过程转化为无需屏幕、无需人工值守的 .spec.ts 纯代码指令", {
      x: 0.90,
      y: 5.48,
      w: 11.5,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 11.2,
      bold: true,
      color: C.mint,
      valign: "top",
      margin: 0,
    });

    const translations = [
      {
        title: "1. 免扫码注入门票（源自通道 02）",
        code: "test.use({ storageState: 'auth.json' })",
        desc: "直接加载保存的电子通行证，半夜云端跑测试免扫码",
        color: C.cyan,
      },
      {
        title: "2. 地标消歧与语义填表（源自通道 01 & 03）",
        code: "main.getByRole('button', { name: '提交' })",
        desc: "利用无障碍角色 + main 区域限定，避开同名按钮冲突",
        color: C.mint,
      },
      {
        title: "3. 底层直塞文件免弹窗（源自通道 04）",
        code: "fileInput.setInputFiles('passport.jpg')",
        desc: "从代码底层直接把照片塞进网页，无需弹出苹果系统窗口",
        color: C.amber,
      },
    ];

    translations.forEach((tr, i) => {
      const tx = 0.90 + i * 3.92;
      s.addShape(pres.shapes.RECTANGLE, {
        x: tx,
        y: 5.82,
        w: 3.72,
        h: 0.86,
        fill: { color: C.darkBg },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(tr.title, {
        x: tx + 0.14,
        y: 5.88,
        w: 3.44,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 9.2,
        bold: true,
        color: tr.color,
        valign: "top",
        margin: 0,
      });
      s.addText(tr.code, {
        x: tx + 0.14,
        y: 6.14,
        w: 3.44,
        h: 0.22,
        fontFace: FONT.mono,
        fontSize: 8.2,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });
      s.addText(tr.desc, {
        x: tx + 0.14,
        y: 6.40,
        w: 3.44,
        h: 0.22,
        fontFace: FONT.body,
        fontSize: 8.4,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    addFooter(s, 7, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 6 — End-to-End Quality Pipeline (Light)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "05 / 6-GATE QUALITY PIPELINE",
      "六步质量门控工作流（6-Gate Pipeline）",
      "每个专业测试 Agent 在执行前后必须通过 6 道强制门控，确保缓存新鲜、配置唯一、隔离可靠、报告可追溯",
      false
    );

    const gates = [
      {
        num: "GATE 01",
        title: "意图分流门控 (Routing Gate)",
        owner: "Owner: ui-test",
        items: [
          "识别 CT / E2E / Visual / Discovery / Governance",
          "默认走最窄专业 Agent，不混入重型云端治理",
          "支持已明确测试类型的请求直接调用目标 Agent",
        ],
        icon: I.sitemapW,
        color: C.teal,
      },
      {
        num: "GATE 02",
        title: "发现与新鲜度门控 (Discovery Gate)",
        owner: "Owner: ui-test-discovery",
        items: [
          "检查 discovery-meta 头部 git-commit 短 SHA",
          "对比 src/ 路由、组件、i18n 是否发生 Git 变更",
          "未变更直接复用；已变更仅做增量 Deep-Dive",
        ],
        icon: I.searchW,
        color: C.blue,
      },
      {
        num: "GATE 03",
        title: "配置与夹具门控 (Config Gate)",
        owner: "Owner: playwright-config / 各 Skill",
        items: [
          "验证 e2e / visual / ct 配置文件与 baseURL 子路径",
          "缺失或错误时唯一调用 playwright-config 生成",
          "校验 test-utils.ts 与 visual-helpers.ts 夹具完备性",
        ],
        icon: I.cogsW,
        color: C.indigo,
      },
      {
        num: "GATE 04",
        title: "工程化生成门控 (Generation Gate)",
        owner: "Owner: CT / E2E / Visual Agents",
        items: [
          "强制 localStorage.clear() 状态隔离与副作用监听",
          "注入 pageerror / console.error 运行时异常零容忍",
          "优先 getByRole 语义化定位与 Landmark 作用域收敛",
        ],
        icon: I.codeW,
        color: C.purple,
      },
      {
        num: "GATE 05",
        title: "分层执行门控 (Execution Gate)",
        owner: "Owner: Playwright Runner / Azure",
        items: [
          "禁止单独使用 --reporter=line，确保更新 HTML 报告",
          "视觉测试严禁失败后自动附加 --update-snapshots",
          "按需切换本地 Vite 服务或 Azure Linux 云端工作区",
        ],
        icon: I.boltW,
        color: C.amber,
      },
      {
        num: "GATE 06",
        title: "只读报告门控 (Report Gate)",
        owner: "Owner: All Testing Agents",
        items: [
          "严守 Report-Only：只输出根因分析，不改业务源码",
          "增量更新 docs/TEST_REPORT.md 中本 Agent 专属章节",
          "同步更新结果总览对应行与最新 ISO 生成时间戳",
        ],
        icon: I.clipboardW,
        color: C.mint,
      },
    ];

    gates.forEach((g, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const gx = 0.65 + col * 4.10;
      const gy = 1.50 + row * 2.68;

      addCard(s, pres, { x: gx, y: gy, w: 3.82, h: 2.42, accentColor: g.color, accentSide: "left", dark: false });
      addIconBadge(s, pres, { x: gx + 0.22, y: gy + 0.20, size: 0.42, bgColor: g.color, iconData: g.icon });

      s.addText(g.num, {
        x: gx + 0.74,
        y: gy + 0.16,
        w: 1.5,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 9,
        bold: true,
        color: g.color,
        valign: "top",
        margin: 0,
      });
      s.addText(g.title, {
        x: gx + 0.74,
        y: gy + 0.38,
        w: 2.95,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 12,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
      s.addText(g.owner, {
        x: gx + 0.74,
        y: gy + 0.66,
        w: 2.95,
        h: 0.20,
        fontFace: FONT.mono,
        fontSize: 8.5,
        color: C.slate500,
        valign: "top",
        margin: 0,
      });

      const listItems = g.items.map((item, idx) => ({
        text: item,
        options: { bullet: true, breakLine: idx < g.items.length - 1 },
      }));
      s.addText(listItems, {
        x: gx + 0.22,
        y: gy + 1.00,
        w: 3.42,
        h: 1.32,
        fontFace: FONT.body,
        fontSize: 10.0,
        color: C.slate700,
        valign: "top",
        paraSpaceAfter: 8,
        margin: 0,
      });
    });

    addFooter(s, 8, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 7 — Test Pyramid in Action: CT & E2E (Dark)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "06 / TEST PYRAMID — COMPONENT & E2E",
      "测试金字塔落地：组件隔离测试 (CT) 与端到端用户旅程 (E2E)",
      "底层用 Playwright CT 快速验证组件契约与无障碍交互，中层用 E2E 验证真实浏览器跨页状态流转",
      true
    );

    // Left Column: Component Testing (CT)
    addCard(s, pres, { x: 0.65, y: 1.48, w: 5.82, h: 5.28, accentColor: C.mint, accentSide: "top", dark: true });
    addIconBadge(s, pres, { x: 0.90, y: 1.70, size: 0.46, bgColor: C.mint, iconData: I.puzzleW });
    s.addText("组件隔离测试层 (Playwright CT · 9 Specs)", {
      x: 1.48,
      y: 1.66,
      w: 3.5,
      h: 0.30,
      fontFace: FONT.head,
      fontSize: 15,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText("playwright-ct.config.ts · 端口 3100 · MemoryRouter + i18n 真实包装", {
      x: 1.48,
      y: 1.98,
      w: 4.8,
      h: 0.24,
      fontFace: FONT.body,
      fontSize: 9.8,
      color: C.mint,
      margin: 0,
    });

    const ctSpecs = [
      ["DestinationCard / TestimonialCard", "目的地卡片信息、价格徽章、详情跳转链接与评价星级渲染"],
      ["SearchFilterBar / CategoryTabs", "搜索输入、排序下拉、7 大分类 Tab 激活态与回调触发"],
      ["FavoriteButton / StarRating", "红心收藏切换、aria-label 状态变化、半星/满星精确展示"],
      ["Navbar / Footer", "桌面与移动端菜单折叠、中英文语言切换按钮、版权与社交链接"],
      ["HeroCarousel / ScrollToTop", "5 屏轮播前后切换、指示器点击、滚动阈值显隐控制"],
      ["WeatherBadge", "6 个目的地天气图标、温度与季节文案条件渲染及空值防御"],
    ];
    ctSpecs.forEach(([comp, detail], i) => {
      const cy = 2.40 + i * 0.54;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.90,
        y: cy,
        w: 5.32,
        h: 0.46,
        fill: { color: C.darkCardAlt },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(comp, {
        x: 1.04,
        y: cy + 0.04,
        w: 2.65,
        h: 0.20,
        fontFace: FONT.mono,
        fontSize: 9.0,
        bold: true,
        color: C.mint,
        valign: "top",
        margin: 0,
      });
      s.addText(detail, {
        x: 1.04,
        y: cy + 0.23,
        w: 5.05,
        h: 0.20,
        fontFace: FONT.body,
        fontSize: 8.8,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    s.addText("CT 工程规范：Provider 包装复用 (test-utils.ts) · 键盘焦点与 ARIA 校验 · 边界空值覆盖", {
      x: 0.90,
      y: 5.82,
      w: 5.32,
      h: 0.55,
      fontFace: FONT.body,
      fontSize: 10,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    // Right Column: E2E Testing
    addCard(s, pres, { x: 6.85, y: 1.48, w: 5.82, h: 5.28, accentColor: C.blue, accentSide: "top", dark: true });
    addIconBadge(s, pres, { x: 7.10, y: 1.70, size: 0.46, bgColor: C.blue, iconData: I.routeW });
    s.addText("端到端用户旅程层 (Playwright E2E · 21 Cases)", {
      x: 7.68,
      y: 1.66,
      w: 3.8,
      h: 0.30,
      fontFace: FONT.head,
      fontSize: 15,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText("playwright.config.ts · 端口 5173 · /UI-test-Demo/ 子路径全链路回归", {
      x: 7.68,
      y: 1.98,
      w: 4.8,
      h: 0.24,
      fontFace: FONT.body,
      fontSize: 9.8,
      color: C.cyan,
      margin: 0,
    });

    const e2eSpecs = [
      ["home.spec.ts (3 用例)", "首页轮播图、热门目的地网格、统计数字、评价区与页脚"],
      ["destinations.spec.ts (4 用例)", "分类筛选、关键词过滤、清除筛选恢复、收藏按钮计数同步"],
      ["destination-detail.spec.ts (3 用例)", "详情页加载、?destination=id 预填跳转行程、无效 ID 兜底"],
      ["itinerary.spec.ts (4 用例)", "创建行程、查看/添加活动、window.confirm 删除确认、空状态"],
      ["navigation.spec.ts (4 用例)", "全站导航栏跳转、关于页团队与 mailto 联系方式、404 页面返回"],
      ["i18n.spec.ts (3 用例)", "中→英与英→中实时切换、跨页面切换后语言状态保持"],
    ];
    e2eSpecs.forEach(([specName, detail], i) => {
      const ey = 2.40 + i * 0.54;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 7.10,
        y: ey,
        w: 5.32,
        h: 0.46,
        fill: { color: C.darkCardAlt },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(specName, {
        x: 7.22,
        y: ey + 0.04,
        w: 2.65,
        h: 0.20,
        fontFace: FONT.mono,
        fontSize: 9.2,
        bold: true,
        color: C.cyan,
        margin: 0,
      });
      s.addText(detail, {
        x: 7.22,
        y: ey + 0.23,
        w: 5.10,
        h: 0.20,
        fontFace: FONT.body,
        fontSize: 8.8,
        color: C.slate300,
        margin: 0,
      });
    });

    s.addText("E2E 质量门控：localStorage 隔离 · pageerror 零容忍 · 排序顺序/激活态完备断言 · POM 复用", {
      x: 7.10,
      y: 5.82,
      w: 5.32,
      h: 0.55,
      fontFace: FONT.body,
      fontSize: 10,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    addFooter(s, 9, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 8 — Visual Regression & VLM Semantic Review (Light)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "07 / VISUAL REGRESSION & VLM REVIEW",
      "视觉回归测试：五步确定性去抖 + GPT-4o VLM 语义复核",
      "以原生 Playwright 像素比对为第一道门禁，按需启用多模态 VLM 过滤动态渲染噪音，严守基线人工确认红线",
      false
    );

    // Col 1: 5-Step Stabilization
    addCard(s, pres, { x: 0.65, y: 1.48, w: 3.82, h: 5.28, accentColor: C.teal, accentSide: "top", dark: false });
    addIconBadge(s, pres, { x: 0.88, y: 1.68, size: 0.42, bgColor: C.teal, iconData: I.cameraW });
    s.addText("五步截图前稳定化 (visual-helpers.ts)", {
      x: 1.40,
      y: 1.66,
      w: 2.9,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 13,
      bold: true,
      color: C.ink,
      margin: 0,
    });
    s.addText("消除轮播、动画与懒加载导致的假阳性像素抖动", {
      x: 1.40,
      y: 1.94,
      w: 2.9,
      h: 0.22,
      fontFace: FONT.body,
      fontSize: 9.2,
      color: C.slate500,
      margin: 0,
    });

    const stabSteps = [
      ["1. 冻结定时器与清空存储", "addInitScript 清空 localStorage 并拦截 setInterval (>1000ms) 冻结轮播"],
      ["2. 注入全局禁动画样式", "强制 animation / transition 归零，设置 caret-color: transparent 隐藏光标"],
      ["3. 自动关闭意外弹窗", "注册 page.on('dialog', d => d.dismiss()) 防止阻塞截图"],
      ["4. 触发懒加载并复位滚动", "等待 networkidle → 滚动到底部触发懒加载 → 滚回顶部 (0, 0)"],
      ["5. 验证图片完全解码", "等待所有 HTMLImageElement.complete 为 true + 额外 300ms 渲染缓冲"],
    ];
    stabSteps.forEach(([stTitle, stDesc], i) => {
      const sy = 2.34 + i * 0.84;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.88,
        y: sy,
        w: 3.36,
        h: 0.72,
        fill: { color: C.lightSubtle },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addText(stTitle, {
        x: 1.00,
        y: sy + 0.06,
        w: 3.12,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 10,
        bold: true,
        color: C.teal,
        margin: 0,
      });
      s.addText(stDesc, {
        x: 1.00,
        y: sy + 0.30,
        w: 3.12,
        h: 0.36,
        fontFace: FONT.body,
        fontSize: 8.8,
        color: C.slate700,
        margin: 0,
      });
    });

    // Col 2: Pixel-First + VLM Fallback Flow
    addCard(s, pres, { x: 4.75, y: 1.48, w: 4.10, h: 5.28, accentColor: C.purple, accentSide: "top", dark: false });
    addIconBadge(s, pres, { x: 4.98, y: 1.68, size: 0.42, bgColor: C.purple, iconData: I.eyeW });
    s.addText("像素优先 + VLM 语义复核双层判定", {
      x: 5.50,
      y: 1.66,
      w: 3.2,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 13,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });
    s.addText("visual-test.ts · 24 张快照 (桌面 1280×720 + 移动 375×812 + 中英双语)", {
      x: 5.50,
      y: 1.96,
      w: 3.2,
      h: 0.22,
      fontFace: FONT.body,
      fontSize: 9.2,
      color: C.slate500,
      valign: "top",
      margin: 0,
    });

    const vlmFlow = [
      { step: "STEP 1 · 原生像素对比 (toHaveScreenshot)", detail: "对比基线与实际截图 (默认阈值 0.0005 / 用例级 0.01)。若像素通过 → 直接记为 passed_pixel，零 AI 调用。", color: C.blue },
      { step: "STEP 2 · 检查 VLM 开关与调用预算", detail: "像素失败时：若 VLM_REVIEW=false 或超出 VLM_MAX_CALLS (10 次) → 立即抛出原始像素错误，阻断流水线。", color: C.indigo },
      { step: "STEP 3 · Azure OpenAI GPT-4o 三图会诊", detail: "上传 Baseline + Actual + Diff 图像及页面路由/视口/语言上下文，输出 JSON 严重度与置信度。", color: C.purple },
      { step: "STEP 4 · 置信度门控与语义裁决", detail: "仅当 confidence >= 0.7 且 recommendation='pass' (无差异或抗锯齿微差) 时放行 (passed_vlm / warned_vlm)；真实回归一律拦截。", color: C.mint },
    ];
    vlmFlow.forEach((vf, i) => {
      const vy = 2.34 + i * 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 4.98,
        y: vy,
        w: 3.64,
        h: 0.92,
        fill: { color: C.lightSubtle },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 4.98,
        y: vy,
        w: 0.07,
        h: 0.92,
        fill: { color: vf.color },
        line: { color: vf.color, width: 0 },
      });
      s.addText(vf.step, {
        x: 5.15,
        y: vy + 0.06,
        w: 3.38,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 10,
        bold: true,
        color: vf.color,
        margin: 0,
      });
      s.addText(vf.detail, {
        x: 5.15,
        y: vy + 0.30,
        w: 3.38,
        h: 0.56,
        fontFace: FONT.body,
        fontSize: 8.8,
        color: C.slate700,
        margin: 0,
      });
    });

    // Col 3: Governance Controls & Baseline Redline
    addCard(s, pres, { x: 9.12, y: 1.48, w: 3.56, h: 2.52, accentColor: C.amber, accentSide: "top", dark: false });
    addIconBadge(s, pres, { x: 9.34, y: 1.68, size: 0.40, bgColor: C.amber, iconData: I.scaleW });
    s.addText("VLM 成本与安全护栏", {
      x: 9.84,
      y: 1.72,
      w: 2.7,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 12.5,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });
    const guardrails = [
      "VLM_REVIEW=false 默认关闭，需显式开启",
      "VLM_MAX_CALLS=10 限制单次流水线调用上限",
      "VLM_CONFIDENCE_THRESHOLD=0.7 过滤低置信度",
      "支持 DefaultAzureCredential 免密钥认证",
    ];
    s.addText(
      guardrails.map((g, idx) => ({ text: g, options: { bullet: true, breakLine: idx < guardrails.length - 1 } })),
      {
        x: 9.34,
        y: 2.24,
        w: 3.12,
        h: 1.60,
        fontFace: FONT.body,
        fontSize: 9.6,
        color: C.slate700,
        valign: "top",
        paraSpaceAfter: 7,
        margin: 0,
      }
    );

    // Baseline Redline Card
    addCard(s, pres, { x: 9.12, y: 4.20, w: 3.56, h: 2.56, accentColor: C.coral, accentSide: "top", dark: false });
    addIconBadge(s, pres, { x: 9.34, y: 4.40, size: 0.40, bgColor: C.coral, iconData: I.lockW });
    s.addText("视觉基线更新铁律", {
      x: 9.84,
      y: 4.44,
      w: 2.7,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 12.5,
      bold: true,
      color: C.coral,
      valign: "top",
      margin: 0,
    });
    const redlines = [
      "测试失败时严禁自动运行 --update-snapshots",
      "禁止在一次执行中串联“对比失败 → 自动更新”",
      "必须先输出差异路径与像素比，等待人工确认",
      "确认后仅更新受影响快照，防止掩盖真实 UI 缺陷",
    ];
    s.addText(
      redlines.map((r, idx) => ({ text: r, options: { bullet: true, breakLine: idx < redlines.length - 1 } })),
      {
        x: 9.34,
        y: 4.96,
        w: 3.12,
        h: 1.65,
        fontFace: FONT.body,
        fontSize: 9.6,
        color: C.slate700,
        valign: "top",
        paraSpaceAfter: 7,
        margin: 0,
      }
    );

    addFooter(s, 10, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 9 — Full-Pyramid CI/CD & Cross-OS Cloud Governance (Dark)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "08 / CI/CD & CLOUD GOVERNANCE",
      "全金字塔 CI/CD 门禁与 Azure 跨 OS 基线治理",
      "补齐 Lint/Build + CT + E2E + Visual 全链路门禁，结合 Azure Playwright Workspace 云端并发与跨平台快照对齐策略",
      true
    );

    // Top section: Layered CI Pipeline
    s.addText("分层 CI 门禁流水线 (.github/workflows/playwright-azure.yml)", {
      x: 0.65,
      y: 1.45,
      w: 12.0,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 13,
      bold: true,
      color: C.cyan,
      margin: 0,
    });

    const stages = [
      {
        tag: "STAGE 01 · 极速本地门禁",
        title: "Lint + Build + Playwright CT",
        cmd: "npm run lint && build && test:ct",
        desc: "在 GitHub Actions Runner 本地直接运行类型检查、生产打包与组件隔离测试，秒级拦截语法与组件契约破坏（不消耗云端浏览器配额）。",
        icon: I.codeW,
        color: C.mint,
      },
      {
        tag: "STAGE 02 · 云端并行 E2E",
        title: "Azure Playwright 云端并行 E2E",
        cmd: "npm run test:azure:e2e (或本地无头兜底)",
        desc: "通过 exposeNetwork: '<loopback>' 让 Azure Linux 云端浏览器访问 Runner 上的本地服务，高并发执行跨页端到端旅程；Fork PR 无密钥时自动降级本地 Chromium。",
        icon: I.cloudW,
        color: C.blue,
      },
      {
        tag: "STAGE 03 · 视觉门禁与归档",
        title: "Visual Regression + 产物归档",
        cmd: "npm run test:azure:visual + upload-artifact",
        desc: "执行全站桌面/移动端/多语种视觉快照比对（主干合并可按需开启 VLM 复核）；无论成功失败均上传 playwright-report/ 与 test-results/ 归档。",
        icon: I.shieldW,
        color: C.purple,
      },
    ];

    stages.forEach((st, i) => {
      const sx = 0.65 + i * 4.10;
      addCard(s, pres, { x: sx, y: 1.82, w: 3.82, h: 2.22, accentColor: st.color, accentSide: "top", dark: true });
      addIconBadge(s, pres, { x: sx + 0.20, y: 2.00, size: 0.40, bgColor: st.color, iconData: st.icon });
      s.addText(st.tag, {
        x: sx + 0.68,
        y: 1.98,
        w: 2.95,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 9,
        bold: true,
        color: st.color,
        valign: "top",
        margin: 0,
      });
      s.addText(st.title, {
        x: sx + 0.68,
        y: 2.18,
        w: 2.95,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 12,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: sx + 0.20,
        y: 2.52,
        w: 3.42,
        h: 0.30,
        fill: { color: C.darkCardAlt },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(st.cmd, {
        x: sx + 0.28,
        y: 2.54,
        w: 3.26,
        h: 0.26,
        fontFace: FONT.mono,
        fontSize: 8.2,
        color: C.cyan,
        valign: "middle",
        margin: 0,
      });
      s.addText(st.desc, {
        x: sx + 0.20,
        y: 2.94,
        w: 3.42,
        h: 1.00,
        fontFace: FONT.body,
        fontSize: 9.4,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    // Bottom section: Cross-OS Baseline Authority Governance
    s.addText("跨 OS 视觉基线权威策略（解决本地 macOS *-darwin.png 与云端 Linux *-linux.png 差异）", {
      x: 0.65,
      y: 4.24,
      w: 12.0,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 13,
      bold: true,
      color: C.amber,
      valign: "top",
      margin: 0,
    });

    const strategies = [
      {
        name: "策略 A：Local-Only（本地开发默认）",
        owner: "权威源：开发者本地机器 (*-darwin.png)",
        desc: "适合个人或全 Mac 团队本地快速回归；快照提交至 tests/visual/*.spec.ts-snapshots/，不作为 Linux CI 阻塞门禁，反馈成本最低。",
        color: C.teal,
      },
      {
        name: "策略 B：Linux / Azure 权威（CI 推荐）",
        owner: "权威源：Azure 云端或容器 (*-linux.png)",
        desc: "通过 Azure Playwright Workspace (ServiceOS.LINUX) 或官方 Docker 容器生成 *-linux.png 基线，保证本地与 PR 门禁 100% 像素一致。",
        color: C.cyan,
      },
      {
        name: "策略 C：Hybrid 分层治理（大型团队）",
        owner: "权威源：开发期本地基线 + 合入期云端基线",
        desc: "日常开发使用本地快照秒级反馈；PR 合入 main 分支时以 Azure Linux 基线 + VLM 语义复核作为最终准入裁决，兼顾效率与严谨。",
        color: C.amber,
      },
    ];

    strategies.forEach((st, i) => {
      const bx = 0.65 + i * 4.10;
      addCard(s, pres, { x: bx, y: 4.60, w: 3.82, h: 2.18, accentColor: st.color, accentSide: "left", dark: true });
      s.addText(st.name, {
        x: bx + 0.22,
        y: 4.76,
        w: 3.40,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 11.8,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });
      s.addText(st.owner, {
        x: bx + 0.22,
        y: 5.10,
        w: 3.40,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 9.8,
        bold: true,
        color: st.color,
        valign: "top",
        margin: 0,
      });
      s.addText(st.desc, {
        x: bx + 0.22,
        y: 5.44,
        w: 3.40,
        h: 1.20,
        fontFace: FONT.body,
        fontSize: 9.6,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    addFooter(s, 11, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 10 — Deliverables & Observability (Light)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "09 / DELIVERABLES & OBSERVABILITY",
      "标准化交付物契约与全链路测试可观测性",
      "从前置探索报告、增量缓存指纹到分段测试总表与 VLM 视觉对照报告，所有阶段产物均结构化落盘",
      false
    );

    const deliverables = [
      {
        tag: "ARTIFACT 01 · 发现与契约层",
        title: "Discovery 报告与 Git 指纹缓存",
        files: "docs/DEEP_DISCOVERY_REPORT.md\ndocs/LOCATOR_STRATEGY_REPORT.md",
        icon: I.fileW,
        color: C.teal,
        points: [
          "内嵌 discovery-meta 头部：记录 generated 时间、git-commit 短 SHA、exploration-channels 与资产计数",
          "完整涵盖前端路由清单、组件 I/O 档案与 Provider 依赖矩阵",
          "按页面给出推荐语义化 Locator 及 Landmark 消歧方案",
          "列出 localStorage 状态键与 confirm/mailto/setInterval 副作用处理模式",
        ],
      },
      {
        tag: "ARTIFACT 02 · 协同汇总层",
        title: "多 Agent 分段归属测试报告",
        files: "docs/TEST_REPORT.md\ndocs/CODE_REVIEW_REPORT.md",
        icon: I.clipboardW,
        color: C.blue,
        points: [
          "单一权威 Markdown 汇总表：包含结果总览、端到端测试、组件测试、视觉回归测试与基线产物清单",
          "严格的段落所有权（Section Ownership）：各 Agent 仅更新自身段落与总览对应行，杜绝互相覆盖",
          "遵循 Report-Only 铁律：精准定位失败文件、行号与修复建议，不擅自修改业务代码",
          "独立 code-review 通道按安全性、可访问性、性能与可维护性等维度输出分级审查清单",
        ],
      },
      {
        tag: "ARTIFACT 03 · 交互式诊断层",
        title: "HTML Trace 与 VLM 视觉报告",
        files: "playwright-report/index.html\nvlm-report.json / vlm-html-reporter",
        icon: I.chartW,
        color: C.purple,
        points: [
          "失败用例自动捕获完整页面截图 (only-on-failure)，首次重试自动录制 Trace 时间线 (on-first-retry)",
          "VLM 启用时通过 vlm-reporter.ts 与 vlm-html-reporter.ts 输出三图并排对比 (Baseline / Actual / Diff)",
          "清晰标注每个视觉用例的最终裁定动作：passed_pixel / passed_vlm / warned_vlm / failed",
          "支持本地 npx playwright show-report 交互式回放 DOM 快照、网络与控制台日志",
        ],
      },
    ];

    deliverables.forEach((d, i) => {
      const dx = 0.65 + i * 4.10;
      addCard(s, pres, { x: dx, y: 1.48, w: 3.82, h: 5.28, accentColor: d.color, accentSide: "top", dark: false });
      addIconBadge(s, pres, { x: dx + 0.22, y: 1.70, size: 0.44, bgColor: d.color, iconData: d.icon });
      s.addText(d.tag, {
        x: dx + 0.76,
        y: 1.68,
        w: 2.85,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 9,
        bold: true,
        color: d.color,
        valign: "top",
        margin: 0,
      });
      s.addText(d.title, {
        x: dx + 0.76,
        y: 1.90,
        w: 2.85,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 12.8,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: dx + 0.22,
        y: 2.32,
        w: 3.38,
        h: 0.46,
        fill: { color: C.lightSubtle },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addText(d.files, {
        x: dx + 0.30,
        y: 2.36,
        w: 3.22,
        h: 0.38,
        fontFace: FONT.mono,
        fontSize: 8.2,
        color: C.slate700,
        valign: "middle",
        margin: 0,
      });

      const ptItems = d.points.map((pt, idx) => ({
        text: pt,
        options: { bullet: true, breakLine: idx < d.points.length - 1 },
      }));
      s.addText(ptItems, {
        x: dx + 0.22,
        y: 2.96,
        w: 3.38,
        h: 3.56,
        fontFace: FONT.body,
        fontSize: 9.8,
        color: C.slate700,
        valign: "top",
        paraSpaceAfter: 9,
        margin: 0,
      });
    });

    addFooter(s, 12, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 11 — Evolution Roadmap & Takeaways (Dark)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "10 / ROADMAP & SUMMARY",
      "演进路线图与最佳实践总结",
      "从“多 Agent 协同与多通道探索确立”走向“全金字塔跨平台门禁闭环”与“无障碍/工程化深度演进”",
      true
    );

    const phases = [
      {
        phase: "PHASE 01 · 架构确立（已完成）",
        title: "多通道探索与 6-Gate 协同底座",
        icon: I.checkW,
        color: C.mint,
        items: [
          "完成 7 Agents × 9 Skills 职责解耦与 frontmatter 调用对齐",
          "补齐 Static / Browser Use / CLI / Computer Use 四通道探索矩阵",
          "建立绑定 git-commit 的 discovery-meta 增量缓存失效机制",
          "落地 9 CT + 21 E2E + 24 Visual 快照全金字塔及 VLM 夹具",
        ],
      },
      {
        phase: "PHASE 02 · 门禁加固（近期重点）",
        title: "CI 全金字塔闭环与跨 OS 基线统一",
        icon: I.shieldW,
        color: C.cyan,
        items: [
          "在 GitHub Actions 流水线补齐 lint、build 与 test:ct 门禁阶段",
          "通过 Linux 容器或 Azure 工作区统一生成 *-linux.png 权威基线",
          "在全局 E2E 夹具中默认开启 pageerror 与 console.error 零容忍拦截",
          "强化导航激活态样式与列表排序顺序等完备性断言",
        ],
      },
      {
        phase: "PHASE 03 · 深度工程化（中期演进）",
        title: "无障碍门禁、POM 抽象与多端矩阵",
        icon: I.rocketW,
        color: C.purple,
        items: [
          "集成 @axe-core/playwright 对核心页面执行自动化 WCAG 无障碍扫描",
          "抽离高频业务页面的 Page Object Model (POM) 共享夹具层",
          "扩展 WebKit (Safari) 与真实移动设备 Profile 测试矩阵",
          "增加网络层 page.route 慢网、接口失败与存储数据损坏等韧性测试",
        ],
      },
    ];

    phases.forEach((ph, i) => {
      const px = 0.65 + i * 4.10;
      addCard(s, pres, { x: px, y: 1.48, w: 3.82, h: 3.92, accentColor: ph.color, accentSide: "top", dark: true });
      addIconBadge(s, pres, { x: px + 0.22, y: 1.68, size: 0.42, bgColor: ph.color, iconData: ph.icon });
      s.addText(ph.phase, {
        x: px + 0.74,
        y: 1.66,
        w: 2.9,
        h: 0.20,
        fontFace: FONT.head,
        fontSize: 9,
        bold: true,
        color: ph.color,
        valign: "top",
        margin: 0,
      });
      s.addText(ph.title, {
        x: px + 0.74,
        y: 1.88,
        w: 2.9,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 12.5,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      const listItems = ph.items.map((it, idx) => ({
        text: it,
        options: { bullet: true, breakLine: idx < ph.items.length - 1 },
      }));
      s.addText(listItems, {
        x: px + 0.22,
        y: 2.34,
        w: 3.38,
        h: 2.90,
        fontFace: FONT.body,
        fontSize: 9.8,
        color: C.slate300,
        valign: "top",
        paraSpaceAfter: 9,
        margin: 0,
      });
    });

    // Bottom Core Takeaway Banner
    addCard(s, pres, { x: 0.65, y: 5.62, w: 12.03, h: 1.18, fill: C.darkCardAlt, accentColor: C.cyan, dark: true });
    addIconBadge(s, pres, { x: 0.92, y: 5.96, size: 0.48, bgColor: C.cyan, iconData: I.robotW });
    s.addText("核心架构总结：以 AI 探索打破覆盖边界，以确定性代码筑牢质量底线", {
      x: 1.56,
      y: 5.78,
      w: 10.8,
      h: 0.30,
      fontFace: FONT.head,
      fontSize: 14,
      bold: true,
      color: C.white,
      margin: 0,
    });
    s.addText(
      "Browser Use + Computer Use 赋予测试体系跨越登录态与系统原生弹窗的动态感知力；7 Agents × 9 Skills 的 6-Gate 门控将其沉淀为可维护、可分片、可治理的 Playwright 工程资产。",
      {
        x: 1.56,
        y: 6.14,
        w: 10.8,
        h: 0.48,
        fontFace: FONT.body,
        fontSize: 10.5,
        color: C.slate300,
        margin: 0,
      }
    );

    addFooter(s, 13, 13, true);
  }

  const outPath = path.resolve(__dirname, "../docs/presentations/ui-test-solution-v3.pptx");
  const outDetailed = path.resolve(__dirname, "../docs/presentations/ui-test-detailed.pptx");
  await pres.writeFile({ fileName: outPath });
  await pres.writeFile({ fileName: outDetailed });
  console.log("Detailed PPTX generated successfully:");
  console.log(" -", outPath);
  console.log(" -", outDetailed);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
