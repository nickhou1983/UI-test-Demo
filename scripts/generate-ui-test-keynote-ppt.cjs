/**
 * generate-ui-test-keynote-ppt.cjs
 * ──────────────────────────────────────────────────────────────────────────
 * 生成 11 页 16:9 演讲级（Keynote 风格）宽屏 PPT：
 *   - docs/presentations/ui-test-solution-v3.pptx
 *   - docs/presentations/ui-test-keynote.pptx
 *
 * 设计原则（专为现场演讲优化）：
 *   1. 极简视觉：每页聚焦 1 个核心观点，大字号标题（26-40pt）、超大指标（36-46pt）、短词组标签（≤15字）
 *   2. 高留白度：摒弃密集长段落与多级列表，3 秒内即可扫清页面结构
 *   3. 演讲备注：每页内置完整的 Speaker Notes（逐字演讲稿），供演讲者视图提词
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
  FaCode,
  FaEye,
  FaLayerGroup,
  FaClipboardCheck,
  FaLock,
  FaCloudUploadAlt,
  FaFileAlt,
  FaExclamationTriangle,
  FaDesktop,
  FaTerminal,
  FaCompass,
  FaBolt,
  FaRocket,
  FaSitemap,
  FaArrowRight,
} = require("react-icons/fa");

// ── Color Palette (Teal Trust & Midnight Executive) ──
const C = {
  darkBg: "0B132B",
  darkCard: "152244",
  darkCardAlt: "1E3163",
  darkBorder: "2C4480",
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
  purple: "8B5CF6",
  amber: "F59E0B",
  coral: "EF4444",
};

const FONT = {
  head: "PingFang SC",
  body: "PingFang SC",
  mono: "Menlo",
};

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

const mkShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 10,
  offset: 3,
  angle: 135,
  opacity: 0.08,
});

const mkDarkShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 12,
  offset: 4,
  angle: 135,
  opacity: 0.30,
});

function addSlideHeader(slide, pres, eyebrow, title, takeaway, dark = false) {
  slide.background = { color: dark ? C.darkBg : C.lightBg };

  slide.addText(eyebrow, {
    x: 0.75,
    y: 0.45,
    w: 8.0,
    h: 0.26,
    fontFace: FONT.head,
    fontSize: 11,
    bold: true,
    color: dark ? C.cyan : C.teal,
    charSpacing: 1.8,
    valign: "top",
    margin: 0,
  });

  slide.addText(title, {
    x: 0.75,
    y: 0.76,
    w: 11.8,
    h: 0.50,
    fontFace: FONT.head,
    fontSize: 28,
    bold: true,
    color: dark ? C.white : C.ink,
    valign: "top",
    margin: 0,
  });

  if (takeaway) {
    slide.addText(takeaway, {
      x: 0.75,
      y: 1.32,
      w: 11.8,
      h: 0.32,
      fontFace: FONT.body,
      fontSize: 14,
      color: dark ? C.slate300 : C.slate500,
      valign: "top",
      margin: 0,
    });
  }
}

function addFooter(slide, pageNum, totalPages = 11, dark = false) {
  slide.addText("TravelVista · Agentic UI 自动化测试演讲 Deck", {
    x: 0.75,
    y: 7.05,
    w: 6.5,
    h: 0.24,
    fontFace: FONT.body,
    fontSize: 9.5,
    color: C.slate500,
    margin: 0,
  });
  slide.addText(`${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`, {
    x: 11.1,
    y: 7.05,
    w: 1.48,
    h: 0.24,
    fontFace: FONT.body,
    fontSize: 10,
    bold: true,
    color: dark ? C.slate300 : C.slate700,
    align: "right",
    margin: 0,
  });
}

function addCard(slide, pres, { x, y, w, h, fill, border, accentColor, accentSide = "top", dark = false }) {
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
        h: 0.08,
        fill: { color: accentColor },
        line: { color: accentColor, width: 0 },
      });
    } else if (accentSide === "left") {
      slide.addShape(pres.shapes.RECTANGLE, {
        x,
        y,
        w: 0.09,
        h,
        fill: { color: accentColor },
        line: { color: accentColor, width: 0 },
      });
    }
  }
}

function addIconBadge(slide, pres, { x, y, size = 0.56, bgColor, iconData }) {
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
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.author = "GitHub Copilot";
  pres.company = "TravelVista";
  pres.subject = "UI 智能自动化测试体系演讲稿";
  pres.title = "AI 探路，代码守门 — TravelVista UI 自动化测试方案";

  const I = {
    robotW: await iconPng(FaRobot, C.white),
    searchW: await iconPng(FaSearch, C.white),
    puzzleW: await iconPng(FaPuzzlePiece, C.white),
    cameraW: await iconPng(FaCamera, C.white),
    shieldW: await iconPng(FaShieldAlt, C.white),
    chartW: await iconPng(FaChartBar, C.white),
    checkW: await iconPng(FaCheckCircle, C.white),
    codeW: await iconPng(FaCode, C.white),
    eyeW: await iconPng(FaEye, C.white),
    layersW: await iconPng(FaLayerGroup, C.white),
    clipboardW: await iconPng(FaClipboardCheck, C.white),
    lockW: await iconPng(FaLock, C.white),
    cloudW: await iconPng(FaCloudUploadAlt, C.white),
    fileW: await iconPng(FaFileAlt, C.white),
    warnW: await iconPng(FaExclamationTriangle, C.white),
    desktopW: await iconPng(FaDesktop, C.white),
    terminalW: await iconPng(FaTerminal, C.white),
    compassW: await iconPng(FaCompass, C.white),
    boltW: await iconPng(FaBolt, C.white),
    rocketW: await iconPng(FaRocket, C.white),
    sitemapW: await iconPng(FaSitemap, C.white),
    arrowCyan: await iconPng(FaArrowRight, C.cyan),
    arrowTeal: await iconPng(FaArrowRight, C.teal),
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 1 — Cover (Dark Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };

    // Left vertical accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.75,
      y: 1.35,
      w: 0.10,
      h: 4.65,
      fill: { color: C.cyan },
      line: { color: C.cyan, width: 0 },
    });

    // Tag pill
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.10,
      y: 1.38,
      w: 4.10,
      h: 0.38,
      fill: { color: C.darkCardAlt },
      line: { color: C.cyan, width: 1 },
    });
    s.addText("NEXT-GEN AGENTIC UI TESTING", {
      x: 1.22,
      y: 1.44,
      w: 3.86,
      h: 0.26,
      fontFace: FONT.head,
      fontSize: 11,
      bold: true,
      color: C.cyan,
      charSpacing: 1.5,
      valign: "top",
      margin: 0,
    });

    // Hero Title
    s.addText("AI 探路，代码守门", {
      x: 1.10,
      y: 2.02,
      w: 7.2,
      h: 0.85,
      fontFace: FONT.head,
      fontSize: 42,
      bold: true,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    // Subtitle
    s.addText("TravelVista 智能 UI 自动化测试架构", {
      x: 1.10,
      y: 2.98,
      w: 7.2,
      h: 0.50,
      fontFace: FONT.head,
      fontSize: 22,
      bold: true,
      color: C.cyan,
      valign: "top",
      margin: 0,
    });

    // 3 Clean Value Pills
    const tags = [
      { text: "多通道智能探索 · Browser Use & Computer Use", color: C.teal },
      { text: "全金字塔确定性回归 · Playwright CT / E2E / Visual", color: C.blue },
      { text: "双层视觉裁决 · 像素优先 + GPT-4o VLM 降噪", color: C.purple },
    ];
    tags.forEach((t, i) => {
      const ty = 3.85 + i * 0.72;
      addCard(s, pres, { x: 1.10, y: ty, w: 6.60, h: 0.54, accentColor: t.color, accentSide: "left", dark: true });
      s.addText(t.text, {
        x: 1.36,
        y: ty + 0.13,
        w: 6.10,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 14,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });
    });

    // Right Column: 3 Giant Hero Stat Cards
    const stats = [
      { num: "7 × 9", label: "Agents × Skills 正交协同", color: C.cyan },
      { num: "4 通道", label: "源码 + 浏览器 + CLI + 桌面探索", color: C.mint },
      { num: "0 Token", label: "CI 确定性回归毫秒级守门", color: C.amber },
    ];
    stats.forEach((st, i) => {
      const sy = 1.35 + i * 1.62;
      addCard(s, pres, { x: 8.25, y: sy, w: 4.33, h: 1.40, accentColor: st.color, accentSide: "top", dark: true });
      s.addText(st.num, {
        x: 8.55,
        y: sy + 0.22,
        w: 3.80,
        h: 0.58,
        fontFace: FONT.head,
        fontSize: 34,
        bold: true,
        color: st.color,
        valign: "top",
        margin: 0,
      });
      s.addText(st.label, {
        x: 8.55,
        y: sy + 0.88,
        w: 3.80,
        h: 0.34,
        fontFace: FONT.body,
        fontSize: 13.5,
        bold: true,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P1 封面】\n大家好！今天跟大家分享 TravelVista 的智能 UI 自动化测试架构。我们用一个核心口号来概括这套体系——“AI 探路，代码守门”。\n通过 7 个专业 Agent 与 9 个可复用 Skill 的协同，我们把 Browser Use、Computer Use 的多通道动态探索能力，与 Playwright 毫秒级、零 Token 的确定性代码回归以及 GPT-4o VLM 视觉裁决结合在了一起。"
    );
    addFooter(s, 1, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 2 — 5-Generation Evolution (Light Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "01 / INDUSTRY EVOLUTION",
      "UI 自动化测试五代演进：走向 Agentic 混合范式",
      "告别纯脚本的脆弱与纯 AI 的缓慢，第五代架构实现“探索自适应”与“回归确定性”合一",
      false
    );

    const gens = [
      {
        gen: "1.0",
        era: "1990s · 坐标录制",
        tool: "QTP / Sikuli",
        verdict: "改分辨率即崩",
        color: C.slate500,
        active: false,
      },
      {
        gen: "2.0",
        era: "2004 · 协议驱动",
        tool: "Selenium",
        verdict: "sleep 偶发失败",
        color: C.amber,
        active: false,
      },
      {
        gen: "3.0",
        era: "2017 · 现代自等待",
        tool: "Playwright",
        verdict: "手写维护成本高",
        color: C.blue,
        active: false,
      },
      {
        gen: "4.0",
        era: "2023 · 纯 AI 驱动",
        tool: "Browser Use",
        verdict: "慢·贵·不确定",
        color: C.purple,
        active: false,
      },
      {
        gen: "5.0",
        era: "2025+ · 本方案",
        tool: "AI 探路 × 代码守门",
        verdict: "高覆盖+毫秒门禁",
        color: C.teal,
        active: true,
      },
    ];

    gens.forEach((g, i) => {
      const gx = 0.75 + i * 2.42;
      const gw = 2.14;
      addCard(s, pres, {
        x: gx,
        y: 1.92,
        w: gw,
        h: 3.15,
        fill: g.active ? C.darkCard : C.lightCard,
        border: g.active ? C.teal : C.lightBorder,
        accentColor: g.color,
        accentSide: "top",
        dark: g.active,
      });

      s.addText(`GEN ${g.gen}`, {
        x: gx + 0.20,
        y: 2.18,
        w: gw - 0.40,
        h: 0.48,
        fontFace: FONT.head,
        fontSize: 24,
        bold: true,
        color: g.active ? C.cyan : g.color,
        valign: "top",
        margin: 0,
      });

      s.addText(g.era, {
        x: gx + 0.20,
        y: 2.74,
        w: gw - 0.40,
        h: 0.30,
        fontFace: FONT.head,
        fontSize: 13.5,
        bold: true,
        color: g.active ? C.white : C.ink,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: gx + 0.20,
        y: 3.24,
        w: gw - 0.40,
        h: 0.44,
        fill: { color: g.active ? C.darkCardAlt : C.lightSubtle },
        line: { color: g.active ? C.darkBorder : C.lightBorder, width: 1 },
      });
      s.addText(g.tool, {
        x: gx + 0.24,
        y: 3.33,
        w: gw - 0.48,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 11.5,
        bold: true,
        color: g.active ? C.cyan : C.slate700,
        align: "center",
        valign: "top",
        margin: 0,
      });

      s.addText(g.active ? `★ ${g.verdict}` : `瓶颈：${g.verdict}`, {
        x: gx + 0.18,
        y: 4.10,
        w: gw - 0.36,
        h: 0.60,
        fontFace: FONT.head,
        fontSize: 11.5,
        bold: true,
        color: g.active ? C.mint : C.coral,
        valign: "top",
        margin: 0,
      });
    });

    // Bottom 4 Core Leaps Strip
    const leaps = [
      { k: "定位跃迁", v: "XPath → getByRole 语义契约", c: C.teal },
      { k: "同步跃迁", v: "sleep → 五步确定性去抖", c: C.blue },
      { k: "分层跃迁", v: "纯 E2E → CT + E2E + Visual", c: C.purple },
      { k: "视觉跃迁", v: "死板像素 → 像素 + VLM 复核", c: C.mint },
    ];
    leaps.forEach((lp, i) => {
      const lx = 0.75 + i * 3.00;
      addCard(s, pres, { x: lx, y: 5.45, w: 2.82, h: 1.25, accentColor: lp.c, accentSide: "left", dark: false });
      s.addText(lp.k, {
        x: lx + 0.24,
        y: 5.65,
        w: 2.40,
        h: 0.30,
        fontFace: FONT.head,
        fontSize: 14,
        bold: true,
        color: lp.c,
        valign: "top",
        margin: 0,
      });
      s.addText(lp.v, {
        x: lx + 0.24,
        y: 6.05,
        w: 2.40,
        h: 0.44,
        fontFace: FONT.body,
        fontSize: 12,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P2 五代演进】\n过去三十年，UI 自动化经历了五次代际演进：\n1.0 时代靠屏幕坐标录制，换个分辨率就全崩；2.0 Selenium 时代跨进程通信加满屏 sleep，偶发失败率极高；3.0 Playwright 时代解决了自等待和语义化定位，但手写成本依然高昂；4.0 时代尝试用纯大模型实时操作浏览器跑回归，但太慢、太贵且结果不确定，无法做 CI 门禁。\n因此我们走向了 5.0 Agentic 混合范式：让 AI 在探索期探路生成契约，让 Playwright 在回归期毫秒级守门。"
    );
    addFooter(s, 2, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 3 — Core Paradigm: 3 Pillars (Dark Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "02 / CORE PARADIGM",
      "核心设计范式：探索用 AI，守门用代码，异常找 VLM",
      "让最擅长的技术栈处理最匹配的生命周期阶段，彻底消除“覆盖率 vs 稳定性”悖论",
      true
    );

    const pillars = [
      {
        phase: "PHASE A · 发现与生成期",
        role: "AI 负责“广度”",
        headline: "多通道动态探路",
        icon: I.compassW,
        color: C.cyan,
        tags: ["免手写脚本冷启动", "穿透 SSO 登录与原生弹窗", "沉淀路由与语义定位契约"],
      },
      {
        phase: "PHASE B · 高频回归期",
        role: "代码负责“速度”",
        headline: "Playwright 确定性守门",
        icon: I.boltW,
        color: C.mint,
        tags: ["毫秒级执行 · 0 Token 成本", "100% 可复现断言与状态隔离", "Git 版本化评审与分片并发"],
      },
      {
        phase: "PHASE C · 视觉裁决期",
        role: "VLM 负责“降噪”",
        headline: "像素 + GPT-4o 双层复核",
        icon: I.eyeW,
        color: C.purple,
        tags: ["95% 常规回归走免费像素比对", "仅失败时触发 VLM 过滤渲染微差", "严守 Report-Only 不覆盖基线"],
      },
    ];

    pillars.forEach((p, i) => {
      const px = 0.75 + i * 4.05;
      addCard(s, pres, { x: px, y: 1.95, w: 3.75, h: 4.70, accentColor: p.color, accentSide: "top", dark: true });
      addIconBadge(s, pres, { x: px + 0.30, y: 2.28, size: 0.62, bgColor: p.color, iconData: p.icon });

      s.addText(p.phase, {
        x: px + 1.08,
        y: 2.30,
        w: 2.45,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 10.5,
        bold: true,
        color: p.color,
        valign: "top",
        margin: 0,
      });
      s.addText(p.role, {
        x: px + 1.08,
        y: 2.58,
        w: 2.45,
        h: 0.38,
        fontFace: FONT.head,
        fontSize: 20,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      s.addText(p.headline, {
        x: px + 0.30,
        y: 3.25,
        w: 3.15,
        h: 0.34,
        fontFace: FONT.head,
        fontSize: 15,
        bold: true,
        color: p.color,
        valign: "top",
        margin: 0,
      });

      p.tags.forEach((tg, ti) => {
        const ty = 3.82 + ti * 0.82;
        s.addShape(pres.shapes.RECTANGLE, {
          x: px + 0.30,
          y: ty,
          w: 3.15,
          h: 0.62,
          fill: { color: C.darkCardAlt },
          line: { color: C.darkBorder, width: 1 },
        });
        s.addText(tg, {
          x: px + 0.46,
          y: ty + 0.16,
          w: 2.85,
          h: 0.30,
          fontFace: FONT.body,
          fontSize: 13,
          bold: true,
          color: C.white,
          valign: "top",
          margin: 0,
        });
      });
    });

    s.addNotes(
      "【演讲词 · P3 核心范式】\n为什么我们不直接用大模型跑 CI？因为慢和贵。我们的解法是“三权分立”：\n第一，在发现期，用 AI 负责广度——自动探查路由、DOM 和系统级弹窗，生成测试契约；\n第二，在回归期，用 Playwright 代码负责速度——每次 PR 触发都是毫秒级执行、零 Token 消耗、100% 确定性；\n第三，在视觉对比期，用 GPT-4o VLM 负责降噪——95% 走原生像素比对，只有像素报错时才请大模型分辨是抗锯齿噪音还是真正的布局崩坏。"
    );
    addFooter(s, 3, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 4 — Engine Comparison: Playwright vs Browser Use vs Computer Use (Light Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "02B / CORE ENGINE COMPARISON",
      "三大核心引擎：Playwright · Browser Use · Computer Use",
      "三大引擎分别驻守“网页代码层”、“真人浏览器层”与“操作系统桌面层”，互补构成全边界自动化底座",
      false
    );

    const engines = [
      {
        tag: "ENGINE 01 · 确定性回归守门员",
        name: "Playwright",
        scope: "控制层：网页内核 (DOM / 无障碍树)",
        pros: ["毫秒级极速 · 0 Token 消耗", "100% 结果确定，支持云端高并发", "局限：点不了系统原生弹窗与扫码"],
        roleBadge: "定位：CI 日常回归绝对主力",
        icon: I.boltW,
        color: C.teal,
      },
      {
        tag: "ENGINE 02 · 实时网页侦察兵",
        name: "Browser Use",
        scope: "控制层：真人已打开的浏览器标签页",
        pros: ["支持真人扫码 → AI 无缝接手登录态", "实时注入探针采集动态 DOM 结构", "局限：仍受困于浏览器沙盒内部"],
        roleBadge: "定位：探索期免密进场与探路先锋",
        icon: I.compassW,
        color: C.blue,
      },
      {
        tag: "ENGINE 03 · 跨界破局特种兵",
        name: "Computer Use",
        scope: "控制层：整个电脑操作系统桌面",
        pros: ["跳出浏览器操控 macOS / Win 窗口", "通吃原生文件选择框与系统权限弹窗", "局限：速度慢、依赖桌面屏幕环境"],
        roleBadge: "定位：探索期跨越浏览器边界破局",
        icon: I.desktopW,
        color: C.coral,
      },
    ];

    engines.forEach((eng, i) => {
      const ex = 0.75 + i * 4.02;
      addCard(s, pres, { x: ex, y: 1.88, w: 3.78, h: 3.36, accentColor: eng.color, accentSide: "top", dark: false });
      addIconBadge(s, pres, { x: ex + 0.24, y: 2.12, size: 0.50, bgColor: eng.color, iconData: eng.icon });

      s.addText(eng.tag, {
        x: ex + 0.86,
        y: 2.10,
        w: 2.72,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 10.2,
        bold: true,
        color: eng.color,
        valign: "top",
        margin: 0,
      });
      s.addText(eng.name, {
        x: ex + 0.86,
        y: 2.34,
        w: 2.72,
        h: 0.30,
        fontFace: FONT.head,
        fontSize: 15.5,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: ex + 0.24,
        y: 2.78,
        w: 3.30,
        h: 0.34,
        fill: { color: C.lightSubtle },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addText(eng.scope, {
        x: ex + 0.32,
        y: 2.83,
        w: 3.14,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 10.5,
        bold: true,
        color: eng.color,
        valign: "middle",
        margin: 0,
      });

      eng.pros.forEach((pr, idx) => {
        const py = 3.26 + idx * 0.40;
        const isLimit = idx === 2;
        s.addText(`${isLimit ? "!" : "✓"} ${pr}`, {
          x: ex + 0.24,
          y: py,
          w: 3.30,
          h: 0.32,
          fontFace: FONT.body,
          fontSize: 11.2,
          bold: !isLimit,
          color: isLimit ? C.slate500 : C.slate700,
          valign: "top",
          margin: 0,
        });
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: ex + 0.24,
        y: 4.58,
        w: 3.30,
        h: 0.44,
        fill: { color: C.darkCard },
        line: { color: eng.color, width: 1.2 },
      });
      s.addText(eng.roleBadge, {
        x: ex + 0.32,
        y: 4.68,
        w: 3.14,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 11.2,
        bold: true,
        color: C.white,
        align: "center",
        valign: "top",
        margin: 0,
      });
    });

    // Bottom Golden Synergy Banner
    addCard(s, pres, { x: 0.75, y: 5.56, w: 11.82, h: 1.14, fill: C.darkCard, accentColor: C.teal, accentSide: "left", dark: true });
    s.addText("黄金协同公式：Browser Use 破登录墙 + Computer Use 破系统弹窗 ──► 100% 收敛为 Playwright 纯代码跑 CI", {
      x: 1.08,
      y: 5.96,
      w: 11.2,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 13.0,
      bold: true,
      color: C.cyan,
      valign: "middle",
      margin: 0,
    });

    s.addNotes(
      "【演讲词 · P4 三大核心引擎对比】\n在进入架构图之前，我们先花一分钟搞懂这套体系底层的三大核心引擎——Playwright、Browser Use 和 Computer Use 到底有什么区别：\n第一，Playwright 是网页内核级的确定性代码引擎。它直接跑编译好的测试代码，速度快到毫秒级、零 Token 消耗，是我们日常跑 CI 回归的绝对主力；但它的短板是只认网页 DOM，遇到扫码登录或者苹果/Windows 系统原生文件框就无能为力。\n第二，Browser Use 是 AI 实时浏览器协作引擎。它能直接接管你电脑上已经打开的 Chrome 标签页——你扫完码，AI 接着操作，瞬间打穿登录墙并实时探查动态 DOM；但它依然出不了浏览器这个沙盒。\n第三，Computer Use 是操作系统桌面级引擎。它跳出了浏览器，直接站在电脑屏幕视角操控鼠标键盘，连系统原生文件选择框、OS 权限弹窗都能点。\n所以我们的黄金公式是：探索期用 Browser Use 破登录、用 Computer Use 破系统弹窗，探明路径后全部沉淀为 Playwright 纯代码跑高频回归！"
    );
    addFooter(s, 4, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 5 — Architecture: 7 Agents × 9 Skills (Light Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "03 / ARCHITECTURE MATRIX",
      "总体架构：7 个专业 Agent × 9 个可复用 Skill",
      "Agent 专注流程门控与职责边界，Skill 封装标准化工程模板，调度与实现彻底解耦",
      false
    );

    // Tier 1: Entry & Code Review
    addCard(s, pres, { x: 0.75, y: 1.90, w: 7.55, h: 1.22, accentColor: C.teal, accentSide: "left", dark: false });
    addIconBadge(s, pres, { x: 1.02, y: 2.22, size: 0.56, bgColor: C.teal, iconData: I.sitemapW });
    s.addText("入口路由层 · ui-test", {
      x: 1.76,
      y: 2.12,
      w: 5.5,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 17,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });
    s.addText("识别 CT / E2E / Visual / 治理意图，保持默认路径轻量直达", {
      x: 1.76,
      y: 2.52,
      w: 6.2,
      h: 0.30,
      fontFace: FONT.body,
      fontSize: 13,
      color: C.slate500,
      valign: "top",
      margin: 0,
    });

    addCard(s, pres, { x: 8.55, y: 1.90, w: 4.03, h: 1.22, accentColor: C.coral, accentSide: "left", dark: false });
    addIconBadge(s, pres, { x: 8.80, y: 2.22, size: 0.56, bgColor: C.coral, iconData: I.clipboardW });
    s.addText("独立审查 · code-review", {
      x: 9.52,
      y: 2.12,
      w: 2.9,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 16,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });
    s.addText("安全·无障碍·性能 6 维只读审计", {
      x: 9.52,
      y: 2.52,
      w: 2.9,
      h: 0.30,
      fontFace: FONT.body,
      fontSize: 12.5,
      color: C.slate500,
      valign: "top",
      margin: 0,
    });

    // Tier 2: Discovery & Config Foundation
    addCard(s, pres, { x: 0.75, y: 3.38, w: 5.75, h: 1.25, accentColor: C.blue, accentSide: "left", dark: false });
    addIconBadge(s, pres, { x: 1.02, y: 3.72, size: 0.56, bgColor: C.blue, iconData: I.searchW });
    s.addText("前置探索 · ui-test-discovery", {
      x: 1.76,
      y: 3.60,
      w: 4.5,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });
    s.addText("调用 playwright-explore 与 cli · 产出共享契约", {
      x: 1.76,
      y: 4.00,
      w: 4.5,
      h: 0.30,
      fontFace: FONT.body,
      fontSize: 12.5,
      color: C.slate500,
      valign: "top",
      margin: 0,
    });

    addCard(s, pres, { x: 6.75, y: 3.38, w: 5.83, h: 1.25, accentColor: C.amber, accentSide: "left", dark: false });
    addIconBadge(s, pres, { x: 7.02, y: 3.72, size: 0.56, bgColor: C.amber, iconData: I.lockW });
    s.addText("唯一配置权威 · playwright-config Skill", {
      x: 7.76,
      y: 3.60,
      w: 4.6,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
      valign: "top",
      margin: 0,
    });
    s.addText("统管 3 套 Config 与共享夹具，严禁私改配置", {
      x: 7.76,
      y: 4.00,
      w: 4.6,
      h: 0.30,
      fontFace: FONT.body,
      fontSize: 12.5,
      color: C.slate500,
      valign: "top",
      margin: 0,
    });

    // Tier 3: 4 Specialist Execution Agents
    const specs = [
      { agent: "ui-test-component", skill: "Skill: playwright-ct", desc: "9 个组件隔离测试", color: C.mint },
      { agent: "ui-test-e2e", skill: "Skill: playwright-e2e", desc: "21 条跨页面核心旅程", color: C.blue },
      { agent: "ui-test-visual", skill: "Skill: playwright-visual", desc: "24 张多端视觉快照", color: C.purple },
      { agent: "ui-test-governance", skill: "Skills: azure + vlm", desc: "云端并发与 VLM 门禁", color: C.coral },
    ];
    specs.forEach((sp, i) => {
      const sx = 0.75 + i * 3.00;
      addCard(s, pres, { x: sx, y: 4.92, w: 2.82, h: 1.80, accentColor: sp.color, accentSide: "top", dark: false });
      s.addText(sp.agent, {
        x: sx + 0.20,
        y: 5.18,
        w: 2.42,
        h: 0.32,
        fontFace: FONT.mono,
        fontSize: 13,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
      s.addText(sp.skill, {
        x: sx + 0.20,
        y: 5.56,
        w: 2.42,
        h: 0.28,
        fontFace: FONT.mono,
        fontSize: 11,
        bold: true,
        color: sp.color,
        valign: "top",
        margin: 0,
      });
      s.addText(sp.desc, {
        x: sx + 0.20,
        y: 6.02,
        w: 2.42,
        h: 0.34,
        fontFace: FONT.head,
        fontSize: 13.5,
        bold: true,
        color: C.slate700,
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P4 总体架构】\n在架构设计上，我们采用了 7 个 Agent 乘 9 个 Skill 的分层解耦模式：\n最上层由 ui-test 负责轻量路由，code-review 负责独立审查；\n中间层是整个体系的基石：ui-test-discovery 负责前置探路，playwright-config 拥有配置文件与夹具的唯一所有权，防止多个 Agent 互相覆盖配置；\n最下层四个专业 Agent 各司其职，分别负责组件测试、端到端旅程、视觉回归以及云端门禁治理。"
    );
    addFooter(s, 5, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 5 — 4 Exploration Channels (Dark Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "04 / MULTI-CHANNEL EXPLORATION",
      "四通道智能探索：全边界感知，确定性收敛",
      "按需启用源码、浏览器与桌面级引擎探路，最终 100% 收敛为标准 Playwright API",
      true
    );

    const channels = [
      {
        num: "01",
        name: "Static AST 源码分析",
        badge: "白盒首选 · 零运行时开销",
        highlight: "秒级扫描 8 条路由、9 个组件 Props 与 i18n 键",
        icon: I.codeW,
        color: C.mint,
      },
      {
        num: "02",
        name: "Browser Use (MCP)",
        badge: "实时 DOM · 复用登录态",
        highlight: "接管已登录 Chrome/Edge 标签页，免密穿透 SSO",
        icon: I.compassW,
        color: C.cyan,
      },
      {
        num: "03",
        name: "playwright-cli",
        badge: "黑盒 URL · 自动录制",
        highlight: "抓取无障碍树快照，将探索动作自动转为 TS 草稿",
        icon: I.terminalW,
        color: C.blue,
      },
      {
        num: "04",
        name: "Computer Use (MCP)",
        badge: "桌面级 CUA · 跨 DOM 边界",
        highlight: "处理系统原生文件选择框、OS 权限弹窗与桌面应用",
        icon: I.desktopW,
        color: C.purple,
      },
    ];

    channels.forEach((ch, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = 0.75 + col * 6.02;
      const cy = 1.90 + row * 1.92;
      addCard(s, pres, { x: cx, y: cy, w: 5.80, h: 1.68, accentColor: ch.color, accentSide: "left", dark: true });
      addIconBadge(s, pres, { x: cx + 0.28, y: cy + 0.32, size: 0.58, bgColor: ch.color, iconData: ch.icon });

      s.addText(`${ch.num} · ${ch.name}`, {
        x: cx + 1.04,
        y: cy + 0.26,
        w: 4.50,
        h: 0.36,
        fontFace: FONT.head,
        fontSize: 18,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      s.addText(ch.badge, {
        x: cx + 1.04,
        y: cy + 0.66,
        w: 4.50,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 11.5,
        bold: true,
        color: ch.color,
        valign: "top",
        margin: 0,
      });

      s.addText(ch.highlight, {
        x: cx + 1.04,
        y: cy + 1.02,
        w: 4.50,
        h: 0.44,
        fontFace: FONT.body,
        fontSize: 13,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    // Bottom Convergence Banner
    addCard(s, pres, { x: 0.75, y: 5.80, w: 11.83, h: 0.96, fill: C.darkCardAlt, accentColor: C.amber, accentSide: "left", dark: true });
    s.addText("确定性收敛原则：探索期用足多模态能力，回归期收敛为 setInputFiles / grantPermissions 等标准无头 API", {
      x: 1.05,
      y: 6.10,
      w: 11.30,
      h: 0.36,
      fontFace: FONT.head,
      fontSize: 14.5,
      bold: true,
      color: C.amber,
      valign: "top",
      margin: 0,
    });

    s.addNotes(
      "【演讲词 · P5 四通道智能探索】\n面对不同测试场景，ui-test-discovery 拥有四条探查通道：\n有源码时，优先走 Static AST 秒级扫描；\n遇到复杂动态渲染或需要复用开发者已登录的 SSO 会话时，调用 Browser Use MCP；\n只有线上 URL 时，用 playwright-cli 边探索边录制代码；\n一旦遇到跳出浏览器 DOM 的系统原生文件上传框或 OS 权限弹窗，立即升级到 Computer Use 桌面级引擎。最关键的是底部的收敛原则：探明机制后，全部转化为 Playwright 原生无头 API，确保 CI 运行不依赖桌面环境。"
    );
    addFooter(s, 6, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 6 — Multi-Channel Collaboration Case Study (Light Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "04B / MULTI-CHANNEL RELAY IN ACTION",
      "实战接力案例：“扫码登录 + 上传护照办签证”全流程",
      "四条通道像特种部队接力破局，最后一步全部翻译为无需屏幕的纯代码指令",
      false
    );

    const relay = [
      {
        step: "第一棒 · 看代码图纸",
        name: "Static AST",
        gain: "2 秒扫清 /visa-apply 路由与字段",
        obstacle: "卡点：需企业微信扫码才能进",
        next: "──► 呼叫通道 02",
        icon: I.codeW,
        color: C.teal,
      },
      {
        step: "第二棒 · 借真人门票",
        name: "Browser Use",
        gain: "真人扫码后接管标签，导出通行证",
        obstacle: "发现：顶栏/底栏同名“提交”按钮",
        next: "──► 移交通道 03",
        icon: I.compassW,
        color: C.blue,
      },
      {
        step: "第三棒 · 录无障碍树",
        name: "playwright-cli",
        gain: "免密进沙盒填表，拍无障碍语义树",
        obstacle: "卡点：点上传弹出苹果系统文件框",
        next: "──► 升级通道 04",
        icon: I.terminalW,
        color: C.purple,
      },
      {
        step: "第四棒 · 控电脑桌面",
        name: "Computer Use",
        gain: "跳出浏览器点击系统文件框选照片",
        obstacle: "通关：验证“护照识别成功”并提交",
        next: "──► 转入纯代码收敛",
        icon: I.desktopW,
        color: C.coral,
      },
    ];

    relay.forEach((r, i) => {
      const rx = 0.75 + i * 3.03;
      addCard(s, pres, { x: rx, y: 1.88, w: 2.73, h: 3.24, accentColor: r.color, accentSide: "top", dark: false });
      addIconBadge(s, pres, { x: rx + 0.18, y: 2.12, size: 0.46, bgColor: r.color, iconData: r.icon });

      s.addText(r.step, {
        x: rx + 0.72,
        y: 2.10,
        w: 1.85,
        h: 0.22,
        fontFace: FONT.head,
        fontSize: 10.2,
        bold: true,
        color: r.color,
        valign: "top",
        margin: 0,
      });
      s.addText(r.name, {
        x: rx + 0.72,
        y: 2.34,
        w: 1.85,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 13.5,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });

      s.addText(`✓ ${r.gain}`, {
        x: rx + 0.18,
        y: 2.82,
        w: 2.37,
        h: 0.64,
        fontFace: FONT.body,
        fontSize: 11.5,
        bold: true,
        color: C.slate700,
        valign: "top",
        margin: 0,
      });

      s.addText(`! ${r.obstacle}`, {
        x: rx + 0.18,
        y: 3.56,
        w: 2.37,
        h: 0.64,
        fontFace: FONT.body,
        fontSize: 11.2,
        color: C.slate500,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: rx + 0.18,
        y: 4.42,
        w: 2.37,
        h: 0.44,
        fill: { color: C.lightSubtle },
        line: { color: r.color, width: 1 },
      });
      s.addText(r.next, {
        x: rx + 0.22,
        y: 4.52,
        w: 2.29,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 11,
        bold: true,
        color: r.color,
        align: "center",
        valign: "top",
        margin: 0,
      });
    });

    // Bottom Convergence Strip
    addCard(s, pres, { x: 0.75, y: 5.44, w: 11.82, h: 1.32, fill: C.darkCard, accentColor: C.mint, accentSide: "left", dark: true });
    s.addText("最终翻译成云端纯代码（Headless CI 零人工全自动运行）：", {
      x: 1.05,
      y: 5.56,
      w: 11.2,
      h: 0.28,
      fontFace: FONT.head,
      fontSize: 13.0,
      bold: true,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    const convPills = [
      { label: "① 扫码通行证 → storageState 免密注入", color: C.cyan },
      { label: "② 同名按钮 → getByRole('main') 区域消歧", color: C.mint },
      { label: "③ 系统文件框 → setInputFiles() 底层直塞", color: C.amber },
    ];
    convPills.forEach((cp, idx) => {
      const px = 1.05 + idx * 3.80;
      s.addShape(pres.shapes.RECTANGLE, {
        x: px,
        y: 5.96,
        w: 3.60,
        h: 0.56,
        fill: { color: C.darkCardAlt },
        line: { color: cp.color, width: 1.2 },
      });
      s.addText(cp.label, {
        x: px + 0.12,
        y: 6.12,
        w: 3.36,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 11.2,
        bold: true,
        color: C.white,
        align: "center",
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P6 四通道协同实战案例】\n我们用一个真实的“扫码登录 + 上传护照办签证”场景，来看看这四条通道是如何打配合的：\n第一棒，Static AST 先看代码图纸，2 秒摸清路由和字段，但发现页面有企业微信扫码拦截，于是呼叫第二棒；\n第二棒，Browser Use 请真人扫一次码，瞬间接管浏览器并把登录通行证保存下来，同时发现顶栏和底栏有两个重名的“提交”按钮；\n第三棒，playwright-cli 带着通行证进入干净沙盒试填表单、拍无障碍语义树，但点“上传护照”时弹出了苹果 macOS 系统文件夹窗口，跳出了浏览器边界，立即呼叫第四棒；\n第四棒，Computer Use 直接站在电脑桌面视角点击系统文件框完成上传。\n最关键的是底部这一步：探路完成后，AI 把扫码翻译成 storageState、把系统文件框翻译成 setInputFiles，生成纯代码剧本，半夜在无屏幕的云服务器上也能全自动跑通！"
    );
    addFooter(s, 7, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 6 — 6-Gate Pipeline (Light Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "05 / SIX-GATE PIPELINE",
      "端到端六步质量门控：让每一步交接都有据可查",
      "从意图路由到分段报告，6 道刚性门控杜绝“盲写选择器、重复探查、私改配置、篡改源码”",
      false
    );

    const gates = [
      { num: "01", title: "意图分流门控", rule: "按需路由，保持默认路径轻量", owner: "ui-test", color: C.teal },
      { num: "02", title: "缓存新鲜度门控", rule: "比对 git-commit，未变直接复用", owner: "discovery", color: C.blue },
      { num: "03", title: "唯一配置门控", rule: "三套 Config 与夹具单一归口", owner: "playwright-config", color: C.amber },
      { num: "04", title: "工程质量门控", rule: "强制 getByRole + 存储隔离", owner: "CT / E2E / Visual", color: C.mint },
      { num: "05", title: "双层裁决门控", rule: "本地/云端执行 + 像素/VLM 漏斗", owner: "Runner + VLM", color: C.purple },
      { num: "06", title: "只读报告门控", rule: "100% Report-Only，段落归属隔离", owner: "TEST_REPORT.md", color: C.coral },
    ];

    gates.forEach((g, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const gx = 0.75 + col * 4.02;
      const gy = 1.92 + row * 2.42;
      addCard(s, pres, { x: gx, y: gy, w: 3.78, h: 2.12, accentColor: g.color, accentSide: "top", dark: false });

      s.addText(`GATE ${g.num}`, {
        x: gx + 0.26,
        y: gy + 0.24,
        w: 1.80,
        h: 0.36,
        fontFace: FONT.head,
        fontSize: 18,
        bold: true,
        color: g.color,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: gx + 1.90,
        y: gy + 0.24,
        w: 1.64,
        h: 0.32,
        fill: { color: C.lightSubtle },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addText(g.owner, {
        x: gx + 1.94,
        y: gy + 0.30,
        w: 1.56,
        h: 0.22,
        fontFace: FONT.mono,
        fontSize: 9.0,
        bold: true,
        color: C.slate700,
        align: "center",
        valign: "top",
        margin: 0,
      });

      s.addText(g.title, {
        x: gx + 0.26,
        y: gy + 0.78,
        w: 3.26,
        h: 0.38,
        fontFace: FONT.head,
        fontSize: 18,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });

      s.addText(g.rule, {
        x: gx + 0.26,
        y: gy + 1.30,
        w: 3.26,
        h: 0.52,
        fontFace: FONT.body,
        fontSize: 13.5,
        color: C.slate500,
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P6 六步质量门控】\n多 Agent 协作最怕失控。为此我们设计了 6 道门控（6-Gate Pipeline）：\nGate 1 负责意图分流；\nGate 2 检查探索报告里的 Git Commit 指纹——只要 src/ 源码没改，直接秒级复用探索缓存；\nGate 3 锁定唯一配置权；\nGate 4 强制生成代码必须使用无障碍定位器并清空本地存储；\nGate 5 执行分层回归与 VLM 复核；\nGate 6 严守 Report-Only 铁律，所有 Agent 按各自章节写入 TEST_REPORT.md，绝不擅自修改业务源码。"
    );
    addFooter(s, 8, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 7 — Test Pyramid: CT + E2E (Dark Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "06 / TEST PYRAMID IN ACTION",
      "测试金字塔：底层组件极速隔离，中层旅程真实闭环",
      "用 Playwright CT 拦截 80% 组件逻辑与无障碍缺陷，让 E2E 专注跨页面核心业务流",
      true
    );

    // Left: Component Testing
    addCard(s, pres, { x: 0.75, y: 1.92, w: 5.75, h: 4.78, accentColor: C.mint, accentSide: "top", dark: true });
    addIconBadge(s, pres, { x: 1.10, y: 2.28, size: 0.64, bgColor: C.mint, iconData: I.puzzleW });
    s.addText("9 Specs", {
      x: 1.92,
      y: 2.18,
      w: 4.2,
      h: 0.56,
      fontFace: FONT.head,
      fontSize: 36,
      bold: true,
      color: C.mint,
      valign: "top",
      margin: 0,
    });
    s.addText("Playwright CT 组件隔离测试层", {
      x: 1.92,
      y: 2.78,
      w: 4.2,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 16,
      bold: true,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    const ctPoints = [
      { k: "真实包装挂载", v: "注入 MemoryRouter + i18next 真实样式" },
      { k: "契约穷举校验", v: "覆盖 Props 渲染、事件回调与空值边界" },
      { k: "无障碍与键盘", v: "校验 Tab / Enter / Space 焦点与 ARIA 角色" },
    ];
    ctPoints.forEach((pt, i) => {
      const py = 3.46 + i * 0.96;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 1.10,
        y: py,
        w: 5.05,
        h: 0.78,
        fill: { color: C.darkCardAlt },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(pt.k, {
        x: 1.32,
        y: py + 0.14,
        w: 1.65,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 14,
        bold: true,
        color: C.mint,
        valign: "top",
        margin: 0,
      });
      s.addText(pt.v, {
        x: 1.32,
        y: py + 0.44,
        w: 4.65,
        h: 0.26,
        fontFace: FONT.body,
        fontSize: 12.5,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    // Right: E2E Testing
    addCard(s, pres, { x: 6.83, y: 1.92, w: 5.75, h: 4.78, accentColor: C.cyan, accentSide: "top", dark: true });
    addIconBadge(s, pres, { x: 7.18, y: 2.28, size: 0.64, bgColor: C.cyan, iconData: I.layersW });
    s.addText("21 Cases", {
      x: 8.00,
      y: 2.18,
      w: 4.2,
      h: 0.56,
      fontFace: FONT.head,
      fontSize: 36,
      bold: true,
      color: C.cyan,
      valign: "top",
      margin: 0,
    });
    s.addText("Playwright E2E 端到端用户旅程层", {
      x: 8.00,
      y: 2.78,
      w: 4.2,
      h: 0.34,
      fontFace: FONT.head,
      fontSize: 16,
      bold: true,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    const e2ePoints = [
      { k: "6 大核心旅程", v: "首页·筛选·双语·详情·行程·导航全覆盖" },
      { k: "强制状态隔离", v: "beforeEach 自动清空 localStorage 收藏与行程" },
      { k: "异常零容忍", v: "全程监听 pageerror 与 console.error 报错" },
    ];
    e2ePoints.forEach((pt, i) => {
      const py = 3.46 + i * 0.96;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 7.18,
        y: py,
        w: 5.05,
        h: 0.78,
        fill: { color: C.darkCardAlt },
        line: { color: C.darkBorder, width: 1 },
      });
      s.addText(pt.k, {
        x: 7.40,
        y: py + 0.14,
        w: 1.65,
        h: 0.28,
        fontFace: FONT.head,
        fontSize: 14,
        bold: true,
        color: C.cyan,
        valign: "top",
        margin: 0,
      });
      s.addText(pt.v, {
        x: 7.40,
        y: py + 0.44,
        w: 4.65,
        h: 0.26,
        fontFace: FONT.body,
        fontSize: 12.5,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P7 测试金字塔】\n在测试金字塔落地中，我们告别了“把所有逻辑都塞进 E2E”的反模式：\n左侧是 9 个组件的 Playwright CT 隔离测试，挂载在真实的 MemoryRouter 和 i18n Provider 中，毫秒级验证 Props 边界和键盘无障碍交互；\n右侧是 6 个文件、21 条 E2E 端到端用例，聚焦跨页面的搜索、收藏、行程创建与中英切换，并在每个用例前强制清空 localStorage、监听运行时异常。"
    );
    addFooter(s, 9, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 8 — Visual Regression & VLM (Light Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "07 / VISUAL REGRESSION & VLM",
      "视觉回归：五步去抖稳住基线，双层漏斗过滤噪音",
      "24 张快照覆盖桌面/移动与中英双语，用 GPT-4o Vision 解决“1 像素抗锯齿误报”痛点",
      false
    );

    // Top: 5-Step Stabilization Flow
    s.addText("截图中五步确定性去抖（preparePageForVisualTest）", {
      x: 0.75,
      y: 1.85,
      w: 11.8,
      h: 0.30,
      fontFace: FONT.head,
      fontSize: 14,
      bold: true,
      color: C.teal,
      valign: "top",
      margin: 0,
    });

    const steps = [
      { n: "STEP 1", t: "等待 DOM 就绪" },
      { n: "STEP 2", t: "冻结轮播计时器" },
      { n: "STEP 3", t: "注入禁动画 CSS" },
      { n: "STEP 4", t: "滚动触发懒加载" },
      { n: "STEP 5", t: "字体与图片全就绪" },
    ];
    steps.forEach((st, i) => {
      const sx = 0.75 + i * 2.42;
      addCard(s, pres, { x: sx, y: 2.24, w: 2.14, h: 1.15, accentColor: C.teal, accentSide: "top", dark: false });
      s.addText(st.n, {
        x: sx + 0.16,
        y: 2.42,
        w: 1.82,
        h: 0.24,
        fontFace: FONT.mono,
        fontSize: 11,
        bold: true,
        color: C.teal,
        valign: "top",
        margin: 0,
      });
      s.addText(st.t, {
        x: sx + 0.16,
        y: 2.74,
        w: 1.82,
        h: 0.36,
        fontFace: FONT.head,
        fontSize: 14,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
    });

    // Bottom: 3 Large Cards for Dual-Layer Verdict & Redline
    const bottomCards = [
      {
        tag: "第一层 · 95% 常规流量",
        title: "原生像素比对",
        stat: "0 Token · 毫秒级",
        desc: "toHaveScreenshot 严格比对，通过即直接放行",
        color: C.blue,
      },
      {
        tag: "第二层 · 仅像素失败时触发",
        title: "GPT-4o VLM 语义仲裁",
        stat: "置信度 ≥ 0.7 放行",
        desc: "传入 Baseline/Actual/Diff 三图，过滤抗锯齿微差",
        color: C.purple,
      },
      {
        tag: "安全红线 · 严防基线污染",
        title: "严禁自动覆盖快照",
        stat: "100% 人工确认",
        desc: "对比失败绝不自动执行 --update-snapshots",
        color: C.coral,
      },
    ];

    bottomCards.forEach((bc, i) => {
      const bx = 0.75 + i * 4.02;
      addCard(s, pres, { x: bx, y: 3.75, w: 3.78, h: 2.95, accentColor: bc.color, accentSide: "left", dark: false });
      s.addText(bc.tag, {
        x: bx + 0.28,
        y: 3.98,
        w: 3.25,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 11,
        bold: true,
        color: bc.color,
        valign: "top",
        margin: 0,
      });
      s.addText(bc.title, {
        x: bx + 0.28,
        y: 4.32,
        w: 3.25,
        h: 0.40,
        fontFace: FONT.head,
        fontSize: 20,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
      s.addText(bc.stat, {
        x: bx + 0.28,
        y: 4.90,
        w: 3.25,
        h: 0.46,
        fontFace: FONT.head,
        fontSize: 22,
        bold: true,
        color: bc.color,
        valign: "top",
        margin: 0,
      });
      s.addText(bc.desc, {
        x: bx + 0.28,
        y: 5.58,
        w: 3.25,
        h: 0.60,
        fontFace: FONT.body,
        fontSize: 13,
        color: C.slate500,
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P8 视觉回归与 VLM 复核】\n做视觉回归最大的敌人是“抖动”。为此我们在截图前执行五步确定性去抖：冻结首页 5 秒轮播计时器、注入禁动画 CSS、触发懒加载并等待字体和图片 100% 就绪。\n在裁决阶段，我们采用双层漏斗：第一层走原生像素对比，毫秒级且零成本；只有当像素比对报警且开启 VLM_REVIEW 时，才把基线图、实际图、差异图发给 GPT-4o Vision 做语义级仲裁。同时我们立下铁律：任何测试失败严禁自动更新快照基线。"
    );
    addFooter(s, 10, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 9 — CI/CD & Cross-OS Cloud Governance (Dark Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "08 / CLOUD & CI GOVERNANCE",
      "云端协同：三阶段 CI 门禁与跨 OS 基线治理",
      "本地极速拦截 + Azure 10 并发云端浏览器 + 跨平台快照对齐",
      true
    );

    const stages = [
      {
        stage: "STAGE 01 · Runner 本地",
        title: "Lint + Build + CT",
        metric: "秒级快速反馈",
        desc: "零云端配额消耗，第一时间拦截语法与组件契约破坏",
        color: C.mint,
      },
      {
        stage: "STAGE 02 · Azure 云端",
        title: "E2E 旅程并发回归",
        metric: "10 Workers 并行",
        desc: "exposeNetwork 安全回环访问本地服务，无密钥自动降级",
        color: C.cyan,
      },
      {
        stage: "STAGE 03 · 视觉准入",
        title: "Visual + 产物归档",
        metric: "14 天报告留存",
        desc: "跨视口快照校验 + VLM 复核，完整归档 HTML 与 Trace",
        color: C.purple,
      },
    ];

    stages.forEach((st, i) => {
      const sx = 0.75 + i * 4.02;
      addCard(s, pres, { x: sx, y: 1.92, w: 3.78, h: 3.05, accentColor: st.color, accentSide: "top", dark: true });
      s.addText(st.stage, {
        x: sx + 0.28,
        y: 2.18,
        w: 3.22,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 11,
        bold: true,
        color: st.color,
        valign: "top",
        margin: 0,
      });
      s.addText(st.title, {
        x: sx + 0.28,
        y: 2.52,
        w: 3.22,
        h: 0.40,
        fontFace: FONT.head,
        fontSize: 20,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });
      s.addText(st.metric, {
        x: sx + 0.28,
        y: 3.12,
        w: 3.22,
        h: 0.46,
        fontFace: FONT.head,
        fontSize: 24,
        bold: true,
        color: st.color,
        valign: "top",
        margin: 0,
      });
      s.addText(st.desc, {
        x: sx + 0.28,
        y: 3.82,
        w: 3.22,
        h: 0.75,
        fontFace: FONT.body,
        fontSize: 13,
        color: C.slate300,
        valign: "top",
        margin: 0,
      });
    });

    // Bottom: Cross-OS Baseline Bar
    addCard(s, pres, { x: 0.75, y: 5.28, w: 11.83, h: 1.42, fill: C.darkCardAlt, accentColor: C.amber, accentSide: "left", dark: true });
    s.addText("跨 OS 视觉基线权威策略（解决 macOS -darwin 与 Linux -linux 字体渲染差异）", {
      x: 1.08,
      y: 5.48,
      w: 11.2,
      h: 0.32,
      fontFace: FONT.head,
      fontSize: 15,
      bold: true,
      color: C.amber,
      valign: "top",
      margin: 0,
    });
    s.addText("模式 A：Local-Only（本地开发对比）   |   模式 B：Azure Linux 权威（CI 门禁对齐）   |   模式 C：Hybrid 分层准入（本地 + 云端）", {
      x: 1.08,
      y: 6.00,
      w: 11.2,
      h: 0.36,
      fontFace: FONT.body,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    s.addNotes(
      "【演讲词 · P9 云端协同与跨 OS 治理】\n在 CI/CD 流水线中，我们将任务拆解为三个阶段：Stage 1 在本地 Runner 极速跑完 Lint、Build 和组件测试；Stage 2 连接 Azure Playwright Workspace 开启 10 并发跑 E2E；Stage 3 执行视觉门禁并归档 14 天报告。\n针对业界常见的“本地 Mac 截图与云端 Linux 截图后缀与字体不一致”问题，我们明确了三种基线权威策略，彻底消除跨平台误报。"
    );
    addFooter(s, 11, 13, true);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 10 — Observability & Deliverables (Light Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "09 / OBSERVABILITY & ARTIFACTS",
      "全链路可观测：三大标准化交付产物",
      "每次发现、执行与审查均输出结构化资产，失败根因可一键交互式回放",
      false
    );

    const artifacts = [
      {
        num: "01",
        title: "探索契约报告",
        file: "DEEP_DISCOVERY_REPORT.md\nLOCATOR_STRATEGY_REPORT.md",
        highlight: "内嵌 Git Commit 缓存指纹\n沉淀全站路由与语义定位器",
        icon: I.fileW,
        color: C.teal,
      },
      {
        num: "02",
        title: "分段归属测试总表",
        file: "docs/TEST_REPORT.md\ndocs/CODE_REVIEW_REPORT.md",
        highlight: "多 Agent 独立章节归属\n只读输出根因与修复建议",
        icon: I.clipboardW,
        color: C.blue,
      },
      {
        num: "03",
        title: "Trace 与视觉报告",
        file: "playwright-report/index.html\nvlm-report.json",
        highlight: "基线 / 实际 / 差异三图并排复核\n时间轴回放 DOM 与网络日志",
        icon: I.chartW,
        color: C.purple,
      },
    ];

    artifacts.forEach((a, i) => {
      const ax = 0.75 + i * 4.02;
      addCard(s, pres, { x: ax, y: 1.92, w: 3.78, h: 4.78, accentColor: a.color, accentSide: "top", dark: false });
      addIconBadge(s, pres, { x: ax + 0.28, y: 2.28, size: 0.60, bgColor: a.color, iconData: a.icon });

      s.addText(`ARTIFACT ${a.num}`, {
        x: ax + 1.04,
        y: 2.30,
        w: 2.45,
        h: 0.24,
        fontFace: FONT.head,
        fontSize: 11,
        bold: true,
        color: a.color,
        valign: "top",
        margin: 0,
      });
      s.addText(a.title, {
        x: ax + 1.04,
        y: 2.58,
        w: 2.45,
        h: 0.38,
        fontFace: FONT.head,
        fontSize: 19,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: ax + 0.28,
        y: 3.32,
        w: 3.22,
        h: 0.88,
        fill: { color: C.lightSubtle },
        line: { color: C.lightBorder, width: 1 },
      });
      s.addText(a.file, {
        x: ax + 0.40,
        y: 3.48,
        w: 2.98,
        h: 0.56,
        fontFace: FONT.mono,
        fontSize: 11,
        bold: true,
        color: C.slate700,
        valign: "top",
        margin: 0,
      });

      s.addText(a.highlight, {
        x: ax + 0.28,
        y: 4.58,
        w: 3.22,
        h: 1.20,
        fontFace: FONT.head,
        fontSize: 15,
        bold: true,
        color: C.ink,
        valign: "top",
        margin: 0,
      });
    });

    s.addNotes(
      "【演讲词 · P10 全链路可观测性】\n整套体系在运行后会沉淀三大类标准化资产：\n第一是前置探索报告，内嵌 Git Commit 指纹，把全站路由和推荐定位器变成可版本化契约；\n第二是多 Agent 共享的 TEST_REPORT.md，每个 Agent 只更新自己负责的段落，只报根因不改业务源码；\n第三是交互式 HTML 报告、Trace 时间轴录制以及 VLM 三图并排对比视图，让任何失败都能在一分钟内定位。"
    );
    addFooter(s, 12, 13, false);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 11 — Roadmap & Closing Quote (Dark Keynote Style)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    addSlideHeader(
      s,
      pres,
      "10 / ROADMAP & TAKEAWAY",
      "演进路线图与核心总结",
      "从“多通道协同底座”迈向“无障碍与全维韧性质量工程”",
      true
    );

    const phases = [
      {
        tag: "PHASE 01 · 已落地",
        title: "多通道探索与金字塔底座",
        items: ["7 Agents × 9 Skills 协同矩阵", "4 通道探索 + Git 指纹缓存", "9 CT + 21 E2E + 24 视觉快照"],
        color: C.mint,
      },
      {
        tag: "PHASE 02 · 近期加固",
        title: "CI 全门禁与跨平台统一",
        items: ["流水线合入 Lint / Build / CT", "容器化生成 Linux 权威基线", "全局开启运行时异常零容忍"],
        color: C.cyan,
      },
      {
        tag: "PHASE 03 · 中期演进",
        title: "无障碍与工程化纵深",
        items: ["集成 axe-core WCAG 自动扫描", "沉淀共享 POM 页面对象层", "扩展 Safari 与弱网韧性测试"],
        color: C.purple,
      },
    ];

    phases.forEach((ph, i) => {
      const px = 0.75 + i * 4.02;
      addCard(s, pres, { x: px, y: 1.90, w: 3.78, h: 3.35, accentColor: ph.color, accentSide: "top", dark: true });
      s.addText(ph.tag, {
        x: px + 0.28,
        y: 2.16,
        w: 3.22,
        h: 0.26,
        fontFace: FONT.head,
        fontSize: 11.5,
        bold: true,
        color: ph.color,
        valign: "top",
        margin: 0,
      });
      s.addText(ph.title, {
        x: px + 0.28,
        y: 2.50,
        w: 3.22,
        h: 0.38,
        fontFace: FONT.head,
        fontSize: 18,
        bold: true,
        color: C.white,
        valign: "top",
        margin: 0,
      });

      ph.items.forEach((it, idx) => {
        const iy = 3.12 + idx * 0.62;
        s.addShape(pres.shapes.RECTANGLE, {
          x: px + 0.28,
          y: iy,
          w: 3.22,
          h: 0.48,
          fill: { color: C.darkCardAlt },
          line: { color: C.darkBorder, width: 1 },
        });
        s.addText(it, {
          x: px + 0.44,
          y: iy + 0.11,
          w: 2.90,
          h: 0.26,
          fontFace: FONT.body,
          fontSize: 12.5,
          bold: true,
          color: C.slate300,
          valign: "top",
          margin: 0,
        });
      });
    });

    // Closing Hero Quote Banner
    addCard(s, pres, { x: 0.75, y: 5.52, w: 11.83, h: 1.22, fill: C.darkCardAlt, accentColor: C.cyan, accentSide: "left", dark: true });
    addIconBadge(s, pres, { x: 1.08, y: 5.84, size: 0.58, bgColor: C.cyan, iconData: I.robotW });
    s.addText("“以 AI 多通道探索打破覆盖边界，以确定性代码与门控筑牢质量底线。”", {
      x: 1.84,
      y: 5.88,
      w: 10.4,
      h: 0.48,
      fontFace: FONT.head,
      fontSize: 20,
      bold: true,
      color: C.white,
      valign: "top",
      margin: 0,
    });

    s.addNotes(
      "【演讲词 · P11 路线图与总结】\n最后看一下演进路线图：目前 Phase 1 的 7 Agents × 9 Skills 架构、四通道探索和全金字塔测试已经全部就位；近期 Phase 2 我们将统一 Linux 云端权威基线并收紧异常门禁；中期 Phase 3 将进一步引入 axe-core 无障碍扫描与弱网韧性测试。\n总结起来就是一句话：以 AI 多通道探索打破覆盖边界，以确定性代码与门控筑牢质量底线。谢谢大家！"
    );
    addFooter(s, 13, 13, true);
  }

  const outKeynote = path.resolve(__dirname, "../docs/presentations/ui-test-keynote.pptx");
  await pres.writeFile({ fileName: outKeynote });
  console.log("Keynote PPTX generated successfully:", outKeynote);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
