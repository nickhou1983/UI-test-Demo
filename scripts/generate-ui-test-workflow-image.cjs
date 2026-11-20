/**
 * generate-ui-test-workflow-image.cjs
 * ──────────────────────────────────────────────────────────────────────────
 * 生成基于当前 7 Agents × 9 Skills 设计的 UI 自动化测试全链路工作流高清图：
 *   - docs/presentations/ui-test-workflow-diagram.svg
 *   - docs/presentations/ui-test-workflow-diagram.png (2800 × 1760 @ 2x)
 * ──────────────────────────────────────────────────────────────────────────
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const W = 1600;
const H = 1040;

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function card({ x, y, w, h, rx = 10, fill = "#152244", stroke = "#2A3F73", strokeWidth = 1.5, topBarColor = null, leftBarColor = null }) {
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" filter="url(#dropShadow)" />`;
  if (topBarColor) {
    out += `<rect x="${x}" y="${y}" width="${w}" height="6" rx="3" fill="${topBarColor}" />`;
  }
  if (leftBarColor) {
    out += `<rect x="${x}" y="${y}" width="7" height="${h}" rx="3" fill="${leftBarColor}" />`;
  }
  return out;
}

function pill({ x, y, w, h = 24, rx = 6, fill = "#1C2D5A", stroke = "#06B6D4", text, textColor = "#06B6D4", fontSize = 11, fontFamily = "PingFang SC", bold = true }) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1" />
    <text x="${x + w / 2}" y="${y + h / 2 + fontSize * 0.35}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${bold ? "700" : "500"}">${esc(text)}</text>
  `;
}

function gateBadge({ x, y, num, title, color }) {
  return `
    <rect x="${x}" y="${y}" width="76" height="24" rx="5" fill="${color}" />
    <text x="${x + 38}" y="${y + 16}" text-anchor="middle" fill="#FFFFFF" font-family="PingFang SC" font-size="11" font-weight="700">${esc(num)}</text>
    <text x="${x + 88}" y="${y + 17}" fill="#FFFFFF" font-family="PingFang SC" font-size="15" font-weight="700">${esc(title)}</text>
  `;
}

function arrowDown(x, y1, y2, color = "#06B6D4", label = "") {
  const midY = (y1 + y2) / 2;
  let s = `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 - 6}" stroke="${color}" stroke-width="2.2" stroke-dasharray="0" marker-end="url(#arrowCyan)" />`;
  if (label) {
    s += `<rect x="${x - 70}" y="${midY - 11}" width="140" height="20" rx="4" fill="#0B132B" stroke="${color}" stroke-width="1" />`;
    s += `<text x="${x}" y="${midY + 3}" text-anchor="middle" fill="${color}" font-family="PingFang SC" font-size="10.5" font-weight="600">${esc(label)}</text>`;
  }
  return s;
}

function arrowRight(x1, y, x2, color = "#06B6D4") {
  return `<line x1="${x1}" y1="${y}" x2="${x2 - 6}" y2="${y}" stroke="${color}" stroke-width="2.2" marker-end="url(#arrowCyan)" />`;
}

async function generate() {
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#080F24" />
      <stop offset="50%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#0F1B3D" />
    </linearGradient>
    <filter id="dropShadow" x="-4%" y="-4%" width="108%" height="112%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#06B6D4" />
    </marker>
    <marker id="arrowMint" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#10B981" />
    </marker>
    <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#F59E0B" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)" />

  <!-- Top Header Banner -->
  <rect x="36" y="22" width="${W - 72}" height="74" rx="10" fill="#131F42" stroke="#2A3F73" stroke-width="1.5" />
  <rect x="36" y="22" width="8" height="74" rx="4" fill="#06B6D4" />
  <text x="62" y="52" fill="#FFFFFF" font-family="PingFang SC" font-size="22" font-weight="700">TravelVista UI 智能自动化测试工作流全景图（7 Agents × 9 Skills × 6-Gate Pipeline）</text>
  <text x="62" y="79" fill="#94A3B8" font-family="PingFang SC" font-size="13">核心范式：多通道动态站点探索 (Static / Browser Use / CLI / Computer Use)  ──►  契约驱动确定性代码生成 (Playwright)  ──►  像素优先 + GPT-4o VLM 语义复核</text>
  ${pill({ x: 1350, y: 34, w: 196, h: 24, fill: "#0F2942", stroke: "#06B6D4", text: "AI 探路 × 代码守门", textColor: "#06B6D4", fontSize: 11.5 })}
  ${pill({ x: 1350, y: 63, w: 196, h: 24, fill: "#132A2E", stroke: "#10B981", text: "100% Report-Only 铁律", textColor: "#10B981", fontSize: 11.5 })}

  <!-- ===================================================================== -->
  <!-- ROW 1: GATE 01 (Intent Routing)  +  GATE 02 (Multi-Channel Discovery) -->
  <!-- ===================================================================== -->

  <!-- GATE 01 Card (Left) -->
  ${card({ x: 36, y: 114, w: 430, h: 220, leftBarColor: "#06B6D4" })}
  ${gateBadge({ x: 54, y: 128, num: "GATE 01", title: "意图识别与分流门控 (Routing Gate)", color: "#06B6D4" })}
  <text x="54" y="172" fill="#CBD5E1" font-family="PingFang SC" font-size="12">用户输入自然语言需求（或明确指定专业测试 Agent 直达）：</text>

  <!-- Primary Router Box -->
  <rect x="54" y="184" width="245" height="78" rx="7" fill="#1C2D5A" stroke="#06B6D4" stroke-width="1.2" />
  <text x="68" y="205" fill="#06B6D4" font-family="Menlo" font-size="12.5" font-weight="700">ui-test (入口路由 Agent)</text>
  <text x="68" y="226" fill="#E2E8F0" font-family="PingFang SC" font-size="11">• 识别 CT / E2E / Visual / 治理诉求</text>
  <text x="68" y="246" fill="#E2E8F0" font-family="PingFang SC" font-size="11">• 保持默认路径轻量，不混入重型云端治理</text>

  <!-- Independent Code Review Box -->
  <rect x="311" y="184" width="138" height="78" rx="7" fill="#1C2D5A" stroke="#F59E0B" stroke-width="1.2" />
  <text x="323" y="205" fill="#F59E0B" font-family="Menlo" font-size="11.5" font-weight="700">code-review</text>
  <text x="323" y="226" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 独立只读审查通道</text>
  <text x="323" y="246" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 6 维质量与安全审计</text>

  <!-- Routing Target Tags -->
  ${pill({ x: 54, y: 274, w: 92, h: 22, fill: "#0F2942", stroke: "#0D9488", text: "► Discovery", textColor: "#2DD4BF", fontSize: 10.5, fontFamily: "Menlo" })}
  ${pill({ x: 154, y: 274, w: 92, h: 22, fill: "#0F2942", stroke: "#10B981", text: "► CT 组件", textColor: "#10B981", fontSize: 10.5 })}
  ${pill({ x: 254, y: 274, w: 92, h: 22, fill: "#0F2942", stroke: "#3B82F6", text: "► E2E 旅程", textColor: "#60A5FA", fontSize: 10.5 })}
  ${pill({ x: 354, y: 274, w: 95, h: 22, fill: "#0F2942", stroke: "#8B5CF6", text: "► Visual/治理", textColor: "#A78BFA", fontSize: 10.5 })}
  <text x="54" y="316" fill="#94A3B8" font-family="PingFang SC" font-size="11">分流原则：测试需求未明确时先做共享发现；明确时直达目标 Agent</text>

  <!-- Arrow GATE 01 -> GATE 02 -->
  ${arrowRight(466, 224, 496, "#06B6D4")}

  <!-- GATE 02 Card (Right, Wide) -->
  ${card({ x: 496, y: 114, w: 1068, h: 220, leftBarColor: "#0D9488" })}
  ${gateBadge({ x: 514, y: 128, num: "GATE 02", title: "多通道发现与缓存新鲜度门控 (Discovery Gate · ui-test-discovery)", color: "#0D9488" })}
  ${pill({ x: 1120, y: 128, w: 424, h: 24, fill: "#132A2E", stroke: "#10B981", text: "缓存校验：比对 discovery-meta 中 git-commit 与 src/ 变更", textColor: "#34D399", fontSize: 11 })}

  <!-- 4 Channel Subcards inside GATE 02 -->
  <!-- Ch 1 -->
  <rect x="514" y="164" width="246" height="114" rx="7" fill="#1C2D5A" stroke="#0D9488" stroke-width="1.2" />
  <text x="526" y="184" fill="#2DD4BF" font-family="PingFang SC" font-size="12" font-weight="700">① Static AST 源码分析（首选）</text>
  <text x="526" y="203" fill="#94A3B8" font-family="Menlo" font-size="10">src/ 路由·组件·i18n·Storage</text>
  <text x="526" y="223" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 解析 8 条路由与 /UI-test-Demo/ 子路径</text>
  <text x="526" y="242" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 提取 9 个组件 I/O 档案与 Provider 依赖</text>
  <text x="526" y="261" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 盘点 travelvista_favorites / trips 键名</text>

  <!-- Ch 2 -->
  <rect x="774" y="164" width="252" height="114" rx="7" fill="#1C2D5A" stroke="#3B82F6" stroke-width="1.2" />
  <text x="786" y="184" fill="#60A5FA" font-family="PingFang SC" font-size="12" font-weight="700">② Browser Use (MCP 实时探查)</text>
  <text x="786" y="203" fill="#94A3B8" font-family="Menlo" font-size="10">manage_user_tab / run_javascript</text>
  <text x="786" y="223" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 复用已登录 Chrome/Edge 标签页免密探查</text>
  <text x="786" y="242" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 支持 SSO / MFA 敏感步骤人工交接</text>
  <text x="786" y="261" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• JS 探针采集真实 DOM 树与 I/O 副作用</text>

  <!-- Ch 3 -->
  <rect x="1040" y="164" width="246" height="114" rx="7" fill="#1C2D5A" stroke="#8B5CF6" stroke-width="1.2" />
  <text x="1052" y="184" fill="#A78BFA" font-family="PingFang SC" font-size="12" font-weight="700">③ playwright-cli（干净录制）</text>
  <text x="1052" y="203" fill="#94A3B8" font-family="Menlo" font-size="10">open / snapshot / click / eval</text>
  <text x="1052" y="223" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 独立无状态浏览器会话抓取无障碍快照</text>
  <text x="1052" y="242" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 自动将交互录制为 Playwright TS 草稿</text>
  <text x="1052" y="261" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 适用于仅提供目标 URL 的黑盒站点探索</text>

  <!-- Ch 4 -->
  <rect x="1300" y="164" width="246" height="114" rx="7" fill="#1C2D5A" stroke="#EF4444" stroke-width="1.2" />
  <text x="1312" y="184" fill="#F87171" font-family="PingFang SC" font-size="12" font-weight="700">④ Computer Use (MCP 桌面级)</text>
  <text x="1312" y="203" fill="#94A3B8" font-family="Menlo" font-size="10">computer-use exec_js (cua)</text>
  <text x="1312" y="223" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 突破 DOM 边界处理系统原生文件选择框</text>
  <text x="1312" y="242" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 处理 OS 级权限弹窗与桌面容器应用</text>
  <text x="1312" y="261" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 探测后收敛为 setInputFiles 等标准 API</text>

  <!-- Discovery Output Bar -->
  <rect x="514" y="288" width="1032" height="34" rx="6" fill="#0F1B3D" stroke="#2A3F73" stroke-width="1" />
  <text x="528" y="310" fill="#2DD4BF" font-family="PingFang SC" font-size="11.5" font-weight="700">共享发现契约产物：</text>
  <text x="640" y="310" fill="#E2E8F0" font-family="Menlo" font-size="11">docs/DEEP_DISCOVERY_REPORT.md + docs/LOCATOR_STRATEGY_REPORT.md</text>
  <text x="1095" y="310" fill="#94A3B8" font-family="PingFang SC" font-size="11">（含路由清单、组件 I/O 档案、语义化 Locator 优先级、副作用清单）</text>

  <!-- Arrow Down from Row 1 to Row 2 -->
  ${arrowDown(800, 334, 368, "#06B6D4", "契约注入 & 配置校验")}

  <!-- ===================================================================== -->
  <!-- ROW 2: GATE 03 (Sole Config & Fixtures Bar)                           -->
  <!-- ===================================================================== -->
  ${card({ x: 36, y: 368, w: 1528, h: 92, leftBarColor: "#6366F1" })}
  ${gateBadge({ x: 54, y: 382, num: "GATE 03", title: "唯一配置与共享夹具门控 (Config & Fixture Gate · Sole Owner: playwright-config Skill)", color: "#6366F1" })}
  <text x="54" y="422" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">严禁测试 Agent 私自生成配置文件，缺失或失配时唯一调用 playwright-config 统一维护三套配置与三大测试夹具：</text>

  ${pill({ x: 54, y: 430, w: 280, h: 22, fill: "#1C2D5A", stroke: "#6366F1", text: "playwright.config.ts (e2e / visual 项目)", textColor: "#A5B4FC", fontSize: 10.5, fontFamily: "Menlo" })}
  ${pill({ x: 346, y: 430, w: 280, h: 22, fill: "#1C2D5A", stroke: "#6366F1", text: "playwright-ct.config.ts (Vite + React CT)", textColor: "#A5B4FC", fontSize: 10.5, fontFamily: "Menlo" })}
  ${pill({ x: 638, y: 430, w: 300, h: 22, fill: "#1C2D5A", stroke: "#6366F1", text: "playwright.service.config.ts (Azure Cloud)", textColor: "#A5B4FC", fontSize: 10.5, fontFamily: "Menlo" })}
  ${pill({ x: 950, y: 430, w: 285, h: 22, fill: "#132A2E", stroke: "#10B981", text: "test-utils.ts (Router / i18n 挂载夹具)", textColor: "#34D399", fontSize: 10.5, fontFamily: "Menlo" })}
  ${pill({ x: 1247, y: 430, w: 298, h: 22, fill: "#231C42", stroke: "#8B5CF6", text: "visual-helpers.ts + visual-test.ts (去抖/VLM)", textColor: "#C4B5FD", fontSize: 10.5, fontFamily: "Menlo" })}

  <!-- Arrows Down from GATE 03 to 4 Parallel Agent Tracks in GATE 04 -->
  ${arrowDown(220, 460, 492, "#10B981")}
  ${arrowDown(605, 460, 492, "#3B82F6")}
  ${arrowDown(995, 460, 492, "#8B5CF6")}
  ${arrowDown(1380, 460, 492, "#EF4444")}

  <!-- ===================================================================== -->
  <!-- ROW 3: GATE 04 (4 Parallel Agent Tracks: CT / E2E / Visual / Gov)     -->
  <!-- ===================================================================== -->
  ${card({ x: 36, y: 492, w: 1528, h: 244, leftBarColor: "#8B5CF6" })}
  ${gateBadge({ x: 54, y: 506, num: "GATE 04", title: "专业 Agent 契约驱动生成与工程化质量门控 (Spec Generation & Engineering Gate)", color: "#8B5CF6" })}

  <!-- Track 1: CT -->
  <rect x="54" y="540" width="360" height="180" rx="8" fill="#1C2D5A" stroke="#10B981" stroke-width="1.5" />
  <rect x="54" y="540" width="360" height="5" rx="2" fill="#10B981" />
  <text x="68" y="564" fill="#34D399" font-family="Menlo" font-size="13" font-weight="700">ui-test-component</text>
  <text x="235" y="564" fill="#94A3B8" font-family="Menlo" font-size="10.5">→ Skill: playwright-ct</text>
  <text x="68" y="586" fill="#FFFFFF" font-family="PingFang SC" font-size="11.5" font-weight="700">组件隔离测试层（tests/component/*.spec.tsx · 9 个文件）</text>
  <text x="68" y="608" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 覆盖 Carousel / DestinationCard / FilterBar / Navbar 等</text>
  <text x="68" y="628" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 注入 MemoryRouter 与 i18next Provider 真实样式挂载</text>
  <text x="68" y="648" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 校验 Props 渲染、回调触发、边界空值与条件显隐</text>
  <text x="68" y="668" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 校验键盘焦点 (Tab/Enter/Space) 与 ARIA 无障碍角色</text>
  ${pill({ x: 68, y: 686, w: 332, h: 22, fill: "#0F2942", stroke: "#10B981", text: "执行命令: npm run test:ct (本地极速组件回归)", textColor: "#34D399", fontSize: 10, fontFamily: "Menlo" })}

  <!-- Track 2: E2E -->
  <rect x="430" y="540" width="365" height="180" rx="8" fill="#1C2D5A" stroke="#3B82F6" stroke-width="1.5" />
  <rect x="430" y="540" width="365" height="5" rx="2" fill="#3B82F6" />
  <text x="444" y="564" fill="#60A5FA" font-family="Menlo" font-size="13" font-weight="700">ui-test-e2e</text>
  <text x="565" y="564" fill="#94A3B8" font-family="Menlo" font-size="10.5">→ Skill: playwright-e2e</text>
  <text x="444" y="586" fill="#FFFFFF" font-family="PingFang SC" font-size="11.5" font-weight="700">端到端用户旅程层（tests/e2e/*.spec.ts · 6 文件 / 21 用例）</text>
  <text x="444" y="608" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 覆盖首页心愿单、筛选与双语切换、详情与行程规划闭环</text>
  <text x="444" y="628" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 强制 beforeEach 注入 localStorage.clear() 状态隔离</text>
  <text x="444" y="648" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 监听 pageerror / console.error 运行时异常零容忍</text>
  <text x="444" y="668" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 优先 getByRole + Landmark 消歧，复用共享 POM 夹具</text>
  ${pill({ x: 444, y: 686, w: 337, h: 22, fill: "#0F2942", stroke: "#3B82F6", text: "执行命令: npm run test:e2e / test:azure:e2e", textColor: "#60A5FA", fontSize: 10, fontFamily: "Menlo" })}

  <!-- Track 3: Visual -->
  <rect x="811" y="540" width="365" height="180" rx="8" fill="#1C2D5A" stroke="#8B5CF6" stroke-width="1.5" />
  <rect x="811" y="540" width="365" height="5" rx="2" fill="#8B5CF6" />
  <text x="825" y="564" fill="#A78BFA" font-family="Menlo" font-size="13" font-weight="700">ui-test-visual</text>
  <text x="955" y="564" fill="#94A3B8" font-family="Menlo" font-size="10.5">→ Skill: playwright-visual/vlm</text>
  <text x="825" y="586" fill="#FFFFFF" font-family="PingFang SC" font-size="11.5" font-weight="700">视觉回归测试层（tests/visual/*.spec.ts · 24 张快照）</text>
  <text x="825" y="608" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 五步去抖：冻结 setInterval 轮播 + 注入禁动画 CSS</text>
  <text x="825" y="628" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 滚动触发懒加载并校验所有 img.complete 与字体就绪</text>
  <text x="825" y="648" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• 覆盖桌面 (1280×720)、移动 (375×812)、中英双语与组件级</text>
  <text x="825" y="668" fill="#FCA5A5" font-family="PingFang SC" font-size="10.8" font-weight="700">• 铁律：对比失败严禁自动运行 --update-snapshots</text>
  ${pill({ x: 825, y: 686, w: 337, h: 22, fill: "#231C42", stroke: "#8B5CF6", text: "执行命令: npm run test:visual / test:visual:vlm", textColor: "#C4B5FD", fontSize: 10, fontFamily: "Menlo" })}

  <!-- Track 4: Governance -->
  <rect x="1192" y="540" width="354" height="180" rx="8" fill="#1C2D5A" stroke="#EF4444" stroke-width="1.5" />
  <rect x="1192" y="540" width="354" height="5" rx="2" fill="#EF4444" />
  <text x="1206" y="564" fill="#F87171" font-family="Menlo" font-size="13" font-weight="700">ui-test-governance</text>
  <text x="1370" y="564" fill="#94A3B8" font-family="Menlo" font-size="10.5">→ azure + vlm</text>
  <text x="1206" y="586" fill="#FFFFFF" font-family="PingFang SC" font-size="11.5" font-weight="700">云端执行与 CI 门禁治理层（playwright-azure.yml）</text>
  <text x="1206" y="608" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• Stage 1: Runner 本地执行 lint + build + test:ct</text>
  <text x="1206" y="628" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• Stage 2: Azure Linux 云端 10 Workers 并发 E2E</text>
  <text x="1206" y="648" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• Stage 3: 视觉回归门禁 + 跨 OS (darwin/linux) 基线对齐</text>
  <text x="1206" y="668" fill="#E2E8F0" font-family="PingFang SC" font-size="10.8">• VLM 护栏：VLM_MAX_CALLS=10，置信度阈值 >= 0.7</text>
  ${pill({ x: 1206, y: 686, w: 326, h: 22, fill: "#2D1625", stroke: "#EF4444", text: "无云端密钥时自动降级本地 Headless Chromium", textColor: "#FCA5A5", fontSize: 10 })}

  <!-- Arrows Down from Row 3 to Row 4 -->
  ${arrowDown(430, 736, 770, "#06B6D4", "本地 / 云端分层执行")}
  ${arrowDown(1170, 736, 770, "#10B981", "分段汇总 & 产物归档")}

  <!-- ===================================================================== -->
  <!-- ROW 4: GATE 05 (Execution & VLM Adjudication) + GATE 06 (Report Gate) -->
  <!-- ===================================================================== -->

  <!-- GATE 05 Card (Left) -->
  ${card({ x: 36, y: 770, w: 770, h: 218, leftBarColor: "#F59E0B" })}
  ${gateBadge({ x: 54, y: 784, num: "GATE 05", title: "分层执行与像素 + GPT-4o VLM 双层裁决门控 (Execution Gate)", color: "#F59E0B" })}

  <!-- Execution Step Boxes -->
  <rect x="54" y="820" width="232" height="148" rx="7" fill="#1C2D5A" stroke="#2A3F73" stroke-width="1.2" />
  <text x="66" y="842" fill="#FBBF24" font-family="PingFang SC" font-size="12" font-weight="700">1. 运行时环境拉起</text>
  <text x="66" y="864" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 自动拉起 Vite 服务 (:5173)</text>
  <text x="66" y="884" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 校验 /UI-test-Demo/ 子路径</text>
  <text x="66" y="904" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 云端通过 exposeNetwork 回环</text>
  <text x="66" y="924" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 禁用纯 --reporter=line 覆盖</text>
  <text x="66" y="944" fill="#94A3B8" font-family="Menlo" font-size="9.5">确保 HTML 报告与 Trace 完整生成</text>

  <rect x="298" y="820" width="238" height="148" rx="7" fill="#1C2D5A" stroke="#2A3F73" stroke-width="1.2" />
  <text x="310" y="842" fill="#60A5FA" font-family="PingFang SC" font-size="12" font-weight="700">2. 第一层：原生像素比对</text>
  <text x="310" y="864" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 调用原生 toHaveScreenshot()</text>
  <text x="310" y="884" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 全局阈值 0.0005 / 用例级 0.01</text>
  <text x="310" y="904" fill="#34D399" font-family="PingFang SC" font-size="10.5" font-weight="700">• 像素通过 → 直接记 passed_pixel</text>
  <text x="310" y="924" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 零大模型调用、毫秒级极速返回</text>
  <text x="310" y="944" fill="#94A3B8" font-family="Menlo" font-size="9.5">95%+ 常规回归在此层直接完成</text>

  <rect x="548" y="820" width="240" height="148" rx="7" fill="#1C2D5A" stroke="#8B5CF6" stroke-width="1.2" />
  <text x="560" y="842" fill="#C4B5FD" font-family="PingFang SC" font-size="12" font-weight="700">3. 第二层：GPT-4o VLM 兜底</text>
  <text x="560" y="864" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 仅当像素失败且 VLM_REVIEW=true</text>
  <text x="560" y="884" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 传入 Baseline + Actual + Diff 三图</text>
  <text x="560" y="904" fill="#34D399" font-family="PingFang SC" font-size="10.5">• 抗锯齿/微差 (conf≥0.7) → 放行/告警</text>
  <text x="560" y="924" fill="#F87171" font-family="PingFang SC" font-size="10.5" font-weight="700">• 布局错位/缺失 (major) → 阻断流水线</text>
  <text x="560" y="944" fill="#94A3B8" font-family="Menlo" font-size="9.5">Azure OpenAI Vision 语义级降噪</text>

  <!-- Arrow GATE 05 -> GATE 06 -->
  ${arrowRight(806, 878, 836, "#10B981")}

  <!-- GATE 06 Card (Right) -->
  ${card({ x: 836, y: 770, w: 728, h: 218, leftBarColor: "#10B981" })}
  ${gateBadge({ x: 854, y: 784, num: "GATE 06", title: "只读分段报告与全链路可观测门控 (Report & Observability Gate)", color: "#10B981" })}

  <rect x="854" y="820" width="340" height="148" rx="7" fill="#1C2D5A" stroke="#10B981" stroke-width="1.2" />
  <text x="868" y="842" fill="#34D399" font-family="PingFang SC" font-size="12" font-weight="700">多 Agent 段落归属总表 (docs/TEST_REPORT.md)</text>
  <text x="868" y="864" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 结果总览表：各 Agent 仅更新自身对应行与时间戳</text>
  <text x="868" y="884" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 专属章节隔离：端到端测试 / 组件测试 / 视觉回归测试</text>
  <text x="868" y="904" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 严守 Report-Only：只定位根因与修复方向，不改源码</text>
  <text x="868" y="924" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• 独立审查输出：docs/CODE_REVIEW_REPORT.md</text>
  <text x="868" y="944" fill="#94A3B8" font-family="Menlo" font-size="9.5">Section Ownership 杜绝多 Agent 并发覆盖</text>

  <rect x="1208" y="820" width="338" height="148" rx="7" fill="#1C2D5A" stroke="#06B6D4" stroke-width="1.2" />
  <text x="1222" y="842" fill="#06B6D4" font-family="PingFang SC" font-size="12" font-weight="700">交互式诊断与 CI 归档产物 (14 Days)</text>
  <text x="1222" y="864" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• playwright-report/index.html (完整交互式 HTML 报告)</text>
  <text x="1222" y="884" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• test-results/ 失败截图与 on-first-retry Trace 轨迹</text>
  <text x="1222" y="904" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• vlm-report.json &amp; VLM HTML 三图并排对比视图</text>
  <text x="1222" y="924" fill="#E2E8F0" font-family="PingFang SC" font-size="10.5">• tests/visual/*.spec.ts-snapshots/ 权威基线库</text>
  <text x="1222" y="944" fill="#94A3B8" font-family="Menlo" font-size="9.5">支持 npx playwright show-report 一键回放</text>

  <!-- Footer -->
  <text x="36" y="1016" fill="#64748B" font-family="PingFang SC" font-size="11">TravelVista UI Automation Architecture · 7 Agents (ui-test / discovery / component / e2e / visual / governance / code-review) × 9 Skills × 4 Exploration Channels</text>
  <text x="${W - 36}" y="1016" text-anchor="end" fill="#64748B" font-family="Menlo" font-size="11">Generated for nickhou1983/UI-test-Demo</text>
</svg>`;

  const svgPath = path.resolve(__dirname, "../docs/presentations/ui-test-workflow-diagram.svg");
  const pngPath = path.resolve(__dirname, "../docs/presentations/ui-test-workflow-diagram.png");

  fs.writeFileSync(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg), { density: 180 })
    .png({ quality: 100 })
    .toFile(pngPath);

  console.log("Generated workflow SVG:", svgPath);
  console.log("Generated workflow PNG:", pngPath);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
