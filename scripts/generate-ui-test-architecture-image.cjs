/**
 * generate-ui-test-architecture-image.cjs
 * ──────────────────────────────────────────────────────────────────────────
 * 基于 Mermaid 架构图生成高清、色彩分层、正交总线的 UI 测试架构全景图：
 *   - docs/presentations/ui-test-architecture-diagram.svg
 *   - docs/presentations/ui-test-architecture-diagram.png (3840 × 2320 4K @ 2x)
 * ──────────────────────────────────────────────────────────────────────────
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const W = 1920;
const H = 1160;

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function groupBox({
  x,
  y,
  w,
  h,
  rx = 14,
  fill = "#0F1A36",
  stroke = "#263B6E",
  strokeWidth = 1.8,
  badgeBg = "#172752",
  badgeStroke = "#06B6D4",
  badgeText = "",
  badgeColor = "#38BDF8",
  badgeXOffset = 18,
  badgePosition = "top", // "top" | "bottom" | "left-pillar"
  pillarCode = "",
  pillarTitle = "",
  pillarSub = "",
}) {
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" filter="url(#dropShadow)" />`;
  if (badgePosition === "left-pillar") {
    const pw = 114;
    out += `
      <rect x="${x}" y="${y}" width="${pw}" height="${h}" rx="${rx}" fill="${badgeBg}" stroke="${badgeStroke}" stroke-width="1.5" />
      <rect x="${x + pw - 2}" y="${y + 10}" width="2" height="${h - 20}" fill="${badgeStroke}" opacity="0.6" />
      <rect x="${x + 25}" y="${y + h / 2 - 42}" width="64" height="22" rx="5" fill="#0B132B" stroke="${badgeStroke}" stroke-width="1.2" />
      <text x="${x + 57}" y="${y + h / 2 - 27}" text-anchor="middle" fill="${badgeColor}" font-family="Menlo" font-size="11" font-weight="700">${esc(pillarCode)}</text>
      <text x="${x + 57}" y="${y + h / 2 + 2}" text-anchor="middle" fill="#FFFFFF" font-family="PingFang SC" font-size="13" font-weight="700">${esc(pillarTitle)}</text>
      <text x="${x + 57}" y="${y + h / 2 + 22}" text-anchor="middle" fill="${badgeColor}" font-family="PingFang SC" font-size="10.5" font-weight="600">${esc(pillarSub)}</text>
    `;
  } else if (badgeText) {
    const bw = Math.max(180, badgeText.length * 13.5 + 32);
    const by = badgePosition === "bottom" ? y + h - 14 : y - 14;
    out += `
      <rect x="${x + badgeXOffset}" y="${by}" width="${bw}" height="28" rx="7" fill="${badgeBg}" stroke="${badgeStroke}" stroke-width="1.4" />
      <text x="${x + badgeXOffset + bw / 2}" y="${by + 19}" text-anchor="middle" fill="${badgeColor}" font-family="PingFang SC" font-size="13" font-weight="700">${esc(badgeText)}</text>
    `;
  }
  return out;
}

function nodeCard({
  x,
  y,
  w,
  h,
  rx = 10,
  fill = "#16244A",
  stroke = "#06B6D4",
  strokeWidth = 1.6,
  topBarColor = null,
  title = "",
  titleColor = "#FFFFFF",
  titleFont = "Menlo",
  titleSize = 13.5,
  subtitle = "",
  subtitle2 = "",
  subtitleColor = "#CBD5E1",
  subtitleSize = 11.5,
  tag = "",
  tagBg = "#0E294B",
  tagColor = "#38BDF8",
}) {
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" filter="url(#cardShadow)" />`;
  if (topBarColor) {
    out += `<rect x="${x}" y="${y}" width="${w}" height="5" rx="3" fill="${topBarColor}" />`;
  }
  const cx = x + w / 2;
  if (tag) {
    const tw = Math.max(66, tag.length * 9 + 18);
    out += `<rect x="${cx - tw / 2}" y="${y + 9}" width="${tw}" height="18" rx="4" fill="${tagBg}" stroke="${stroke}" stroke-width="0.9" />`;
    out += `<text x="${cx}" y="${y + 22}" text-anchor="middle" fill="${tagColor}" font-family="PingFang SC" font-size="10" font-weight="700">${esc(tag)}</text>`;
  }
  const titleY = tag ? y + 44 : subtitle2 ? y + 27 : y + 31;
  out += `<text x="${cx}" y="${titleY}" text-anchor="middle" fill="${titleColor}" font-family="${titleFont}" font-size="${titleSize}" font-weight="700">${esc(title)}</text>`;
  if (subtitle) {
    const subY = tag ? y + 64 : subtitle2 ? y + 48 : y + 54;
    out += `<text x="${cx}" y="${subY}" text-anchor="middle" fill="${subtitleColor}" font-family="PingFang SC" font-size="${subtitleSize}" font-weight="500">${esc(subtitle)}</text>`;
  }
  if (subtitle2) {
    const sub2Y = tag ? y + 81 : y + 66;
    out += `<text x="${cx}" y="${sub2Y}" text-anchor="middle" fill="#94A3B8" font-family="PingFang SC" font-size="${subtitleSize - 0.5}" font-weight="500">${esc(subtitle2)}</text>`;
  }
  return out;
}

function lineLabel({ x, y, text, color = "#38BDF8", bg = "#0B132B", w = null }) {
  const width = w || Math.max(54, text.length * 10.5 + 16);
  return `
    <rect x="${x - width / 2}" y="${y - 10}" width="${width}" height="20" rx="5" fill="${bg}" stroke="${color}" stroke-width="1.1" />
    <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${color}" font-family="PingFang SC" font-size="10.5" font-weight="700">${esc(text)}</text>
  `;
}

function orthoPath(points, { color = "#06B6D4", width = 2, dashed = false, marker = "arrowCyan" } = {}) {
  const d = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const dashAttr = dashed ? `stroke-dasharray="6,4"` : "";
  const markerAttr = marker ? `marker-end="url(#${marker})"` : "";
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${dashAttr} ${markerAttr} />`;
}

function dot(x, y, color = "#06B6D4", r = 3.5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" />`;
}

async function generate() {
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070D1F" />
      <stop offset="50%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#0E1938" />
    </linearGradient>
    <filter id="dropShadow" x="-3%" y="-3%" width="106%" height="108%">
      <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#000000" flood-opacity="0.42" />
    </filter>
    <filter id="cardShadow" x="-4%" y="-4%" width="108%" height="112%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.32" />
    </filter>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
      <path d="M0,0.5 L7.5,4 L0,7.5 Z" fill="#06B6D4" />
    </marker>
    <marker id="arrowMint" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
      <path d="M0,0.5 L7.5,4 L0,7.5 Z" fill="#10B981" />
    </marker>
    <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
      <path d="M0,0.5 L7.5,4 L0,7.5 Z" fill="#F59E0B" />
    </marker>
    <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
      <path d="M0,0.5 L7.5,4 L0,7.5 Z" fill="#A855F7" />
    </marker>
    <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
      <path d="M0,0.5 L7.5,4 L0,7.5 Z" fill="#F43F5E" />
    </marker>
    <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
      <path d="M0,0.5 L7.5,4 L0,7.5 Z" fill="#38BDF8" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)" />

  <!-- Subtle Grid Pattern -->
  <g stroke="#1E293B" stroke-width="0.6" opacity="0.35">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="${H}" />`).join("\n    ")}
    ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="${W}" y2="${i * 80}" />`).join("\n    ")}
  </g>

  <!-- ===================================================================== -->
  <!-- TOP HEADER BANNER                                                     -->
  <!-- ===================================================================== -->
  <rect x="36" y="18" width="${W - 72}" height="74" rx="12" fill="#121E40" stroke="#283E75" stroke-width="1.6" filter="url(#dropShadow)" />
  <rect x="36" y="18" width="8" height="74" rx="4" fill="#06B6D4" />
  <text x="64" y="48" fill="#FFFFFF" font-family="PingFang SC" font-size="22" font-weight="700">UI 自动化测试 7 Agents × 9 Skills 分层架构全景图（Architecture Blueprint）</text>
  <text x="64" y="75" fill="#94A3B8" font-family="PingFang SC" font-size="13">五层解耦架构：入口与独立审查层  →  共享发现与多通道探索层  →  专业测试执行层  →  核心技能与唯一配置层  +  产物与报告层 (Report-Only)</text>

  <!-- Legend Pills on Top Right -->
  <g transform="translate(1235, 28)">
    <rect x="0" y="0" width="625" height="54" rx="8" fill="#0B132B" stroke="#233563" stroke-width="1.2" />
    <!-- Legend 1 -->
    <line x1="16" y1="18" x2="54" y2="18" stroke="#06B6D4" stroke-width="2.4" marker-end="url(#arrowCyan)" />
    <text x="64" y="22" fill="#E2E8F0" font-family="PingFang SC" font-size="11.5" font-weight="600">路由分发 / 主 Skill 调用</text>
    <!-- Legend 2 -->
    <line x1="226" y1="18" x2="264" y2="18" stroke="#10B981" stroke-width="2.4" stroke-dasharray="5,3" marker-end="url(#arrowMint)" />
    <text x="274" y="22" fill="#E2E8F0" font-family="PingFang SC" font-size="11.5" font-weight="600">discovery-meta + 交接契约</text>
    <!-- Legend 3 -->
    <line x1="450" y1="18" x2="488" y2="18" stroke="#F59E0B" stroke-width="2.2" stroke-dasharray="5,3" marker-end="url(#arrowAmber)" />
    <text x="498" y="22" fill="#E2E8F0" font-family="PingFang SC" font-size="11.5" font-weight="600">配置门控 / 治理参考</text>
    <!-- Legend 4 -->
    <line x1="16" y1="40" x2="54" y2="40" stroke="#38BDF8" stroke-width="2.2" marker-end="url(#arrowBlue)" />
    <text x="64" y="44" fill="#E2E8F0" font-family="PingFang SC" font-size="11.5" font-weight="600">多通道探索调用 / 驱动</text>
    <!-- Legend 5 -->
    <line x1="226" y1="40" x2="264" y2="40" stroke="#A855F7" stroke-width="2.2" marker-end="url(#arrowPurple)" />
    <text x="274" y="44" fill="#E2E8F0" font-family="PingFang SC" font-size="11.5" font-weight="600">测试产物与报告输出</text>
    <!-- Legend 6 -->
    <line x1="450" y1="40" x2="488" y2="40" stroke="#F43F5E" stroke-width="2.2" marker-end="url(#arrowRose)" />
    <text x="498" y="44" fill="#E2E8F0" font-family="PingFang SC" font-size="11.5" font-weight="600">独立代码审查通道</text>
  </g>

  <!-- ===================================================================== -->
  <!-- LAYER 1: 入口与独立审查层 (Agents)                                    -->
  <!-- ===================================================================== -->
  ${groupBox({
    x: 410,
    y: 112,
    w: 920,
    h: 106,
    fill: "#0F1B38",
    stroke: "#06B6D4",
    badgeBg: "#0E294B",
    badgeStroke: "#06B6D4",
    badgePosition: "left-pillar",
    pillarCode: "LAYER 01",
    pillarTitle: "入口与审查层",
    pillarSub: "Entry Agents",
    badgeColor: "#38BDF8",
  })}

  <!-- Node: ui-test -->
  ${nodeCard({
    x: 548,
    y: 129,
    w: 360,
    h: 72,
    fill: "#172A57",
    stroke: "#06B6D4",
    topBarColor: "#06B6D4",
    title: "ui-test",
    titleColor: "#38BDF8",
    titleSize: 15,
    subtitle: "UI 测试统一路由入口",
    subtitle2: "意图分流 · 按需唤醒发现 · 保持默认路径轻量",
  })}

  <!-- Node: code-review (Agent) -->
  ${nodeCard({
    x: 944,
    y: 129,
    w: 360,
    h: 72,
    fill: "#27193C",
    stroke: "#F43F5E",
    topBarColor: "#F43F5E",
    title: "code-review",
    titleColor: "#FDA4AF",
    titleSize: 15,
    subtitle: "独立只读代码审查 Agent",
    subtitle2: "与 UI 测试执行解耦 · 专注 6 维质量与安全审计",
  })}

  <!-- ===================================================================== -->
  <!-- LAYER 2: 共享发现与多通道探索层                                       -->
  <!-- ===================================================================== -->
  ${groupBox({
    x: 236,
    y: 266,
    w: 948,
    h: 278,
    fill: "#0E1A36",
    stroke: "#38BDF8",
    badgeBg: "#0F294A",
    badgeStroke: "#38BDF8",
    badgePosition: "left-pillar",
    pillarCode: "LAYER 02",
    pillarTitle: "探索与发现层",
    pillarSub: "Shared Discovery",
    badgeColor: "#38BDF8",
  })}

  <!-- Node: ui-test-discovery -->
  ${nodeCard({
    x: 566,
    y: 292,
    w: 396,
    h: 66,
    fill: "#162A56",
    stroke: "#38BDF8",
    topBarColor: "#38BDF8",
    title: "ui-test-discovery",
    titleColor: "#7DD3FC",
    titleSize: 14.5,
    subtitle: "环境检查 · Git 新鲜度 · 契约生成",
  })}

  <!-- Node: Skill: playwright-explore -->
  ${nodeCard({
    x: 584,
    y: 386,
    w: 360,
    h: 60,
    fill: "#14254B",
    stroke: "#06B6D4",
    title: "Skill: playwright-explore",
    titleColor: "#38BDF8",
    titleSize: 13.5,
    subtitle: "无源码 URL 站点探索",
  })}

  <!-- 3 Exploration Channel Nodes at bottom of Layer 2 (x: 368..1166) -->
  <!-- 1. MCP: Browser Use -->
  ${nodeCard({
    x: 368,
    y: 472,
    w: 250,
    h: 58,
    fill: "#132347",
    stroke: "#38BDF8",
    title: "MCP: Browser Use",
    titleColor: "#E2E8F0",
    titleSize: 13,
    subtitle: "实时/已登录标签页 · JS 探针",
  })}

  <!-- 2. Skill: playwright-cli -->
  ${nodeCard({
    x: 639,
    y: 472,
    w: 250,
    h: 58,
    fill: "#132347",
    stroke: "#38BDF8",
    title: "Skill: playwright-cli",
    titleColor: "#E2E8F0",
    titleSize: 13,
    subtitle: "CLI 快照与录制",
  })}

  <!-- 3. MCP: Computer Use -->
  ${nodeCard({
    x: 910,
    y: 472,
    w: 254,
    h: 58,
    fill: "#132347",
    stroke: "#38BDF8",
    title: "MCP: Computer Use",
    titleColor: "#E2E8F0",
    titleSize: 13,
    subtitle: "OS 原生文件框/权限弹窗接管",
  })}

  <!-- Internal Connections inside Layer 2 -->
  <!-- ui-test-discovery -> Skill: playwright-explore -->
  ${orthoPath([[764, 358], [764, 384]], { color: "#38BDF8", width: 2, marker: "arrowBlue" })}
  ${lineLabel({ x: 804, y: 371, text: "调用", color: "#38BDF8", w: 46 })}

  <!-- ui-test-discovery -> MCP: Browser Use -->
  ${orthoPath([[566, 325], [450, 325], [450, 470]], { color: "#38BDF8", width: 2, marker: "arrowBlue" })}
  ${lineLabel({ x: 450, y: 398, text: "调用", color: "#38BDF8", w: 46 })}

  <!-- ui-test-discovery -> MCP: Computer Use -->
  ${orthoPath([[962, 325], [1080, 325], [1080, 470]], { color: "#38BDF8", width: 2, marker: "arrowBlue" })}
  ${lineLabel({ x: 1080, y: 398, text: "调用", color: "#38BDF8", w: 46 })}

  <!-- Skill: playwright-explore -> 3 Channels (驱动) -->
  ${orthoPath([[645, 446], [645, 456], [535, 456], [535, 470]], { color: "#06B6D4", width: 1.8, marker: "arrowCyan" })}
  ${lineLabel({ x: 535, y: 454, text: "驱动", color: "#06B6D4", w: 44 })}

  ${orthoPath([[764, 446], [764, 470]], { color: "#06B6D4", width: 1.8, marker: "arrowCyan" })}
  ${lineLabel({ x: 804, y: 458, text: "驱动", color: "#06B6D4", w: 44 })}

  ${orthoPath([[885, 446], [885, 456], [995, 456], [995, 470]], { color: "#06B6D4", width: 1.8, marker: "arrowCyan" })}
  ${lineLabel({ x: 995, y: 454, text: "驱动", color: "#06B6D4", w: 44 })}

  <!-- ===================================================================== -->
  <!-- LAYER 3: 专业测试执行层 (Testing Agents)                              -->
  <!-- Uses left-pillar so NO top-entering vertical lines ever touch badge   -->
  <!-- ===================================================================== -->
  ${groupBox({
    x: 36,
    y: 622,
    w: 1274,
    h: 112,
    fill: "#0F1C3A",
    stroke: "#10B981",
    badgeBg: "#0D2E2B",
    badgeStroke: "#10B981",
    badgePosition: "left-pillar",
    pillarCode: "LAYER 03",
    pillarTitle: "测试执行层",
    pillarSub: "Testing Agents",
    badgeColor: "#34D399",
  })}

  <!-- 4 Testing Agent Cards (x: 168..1290) -->
  <!-- 1. ui-test-component -->
  ${nodeCard({
    x: 168,
    y: 640,
    w: 264,
    h: 76,
    fill: "#15284E",
    stroke: "#06B6D4",
    topBarColor: "#06B6D4",
    title: "ui-test-component",
    titleColor: "#38BDF8",
    titleSize: 14,
    subtitle: "组件隔离测试",
    subtitle2: "Props · 事件回调 · Provider 挂载",
  })}

  <!-- 2. ui-test-e2e -->
  ${nodeCard({
    x: 450,
    y: 640,
    w: 264,
    h: 76,
    fill: "#15284E",
    stroke: "#10B981",
    topBarColor: "#10B981",
    title: "ui-test-e2e",
    titleColor: "#34D399",
    titleSize: 14,
    subtitle: "端到端与用户旅程",
    subtitle2: "路由导航 · 表单搜索 · i18n 切换",
  })}

  <!-- 3. ui-test-visual -->
  ${nodeCard({
    x: 732,
    y: 640,
    w: 264,
    h: 76,
    fill: "#15284E",
    stroke: "#38BDF8",
    topBarColor: "#38BDF8",
    title: "ui-test-visual",
    titleColor: "#7DD3FC",
    titleSize: 14,
    subtitle: "视觉回归与基线门控",
    subtitle2: "多视口截图 · 去抖 · 像素与 VLM 比对",
  })}

  <!-- 4. ui-test-governance -->
  ${nodeCard({
    x: 1014,
    y: 640,
    w: 276,
    h: 76,
    fill: "#1D2448",
    stroke: "#F59E0B",
    topBarColor: "#F59E0B",
    title: "ui-test-governance",
    titleColor: "#FBBF24",
    titleSize: 14,
    subtitle: "CI 金字塔 · 跨 OS 基线 · VLM 策略",
    subtitle2: "Azure 云端工作区 · PR 视觉门禁治理",
  })}

  <!-- ===================================================================== -->
  <!-- CONNECTIONS: LAYER 1 & LAYER 2  ──►  LAYER 3                          -->
  <!-- ===================================================================== -->

  <!-- 1) ui-test -> ui-test-discovery (路由分发) -->
  ${orthoPath([[764, 201], [764, 290]], { color: "#06B6D4", width: 2.4, marker: "arrowCyan" })}
  ${lineLabel({ x: 764, y: 242, text: "路由分发", color: "#06B6D4", w: 68 })}

  <!-- 2) ui-test -> 4 Testing Agents (路由分发 Bus around Layer 2) -->
  <!-- Left branch from ui-test to ui-test-component (x=195) & ui-test-e2e (x=535) — ZERO line crossings -->
  ${orthoPath([[610, 201], [610, 236], [195, 236], [195, 638]], { color: "#06B6D4", width: 2.2, marker: "arrowCyan" })}
  ${orthoPath([[218, 236], [218, 566], [535, 566], [535, 638]], { color: "#06B6D4", width: 2.2, marker: "arrowCyan" })}
  ${dot(218, 236, "#06B6D4", 4)}
  ${lineLabel({ x: 195, y: 405, text: "路由分发", color: "#06B6D4", w: 68 })}
  ${lineLabel({ x: 385, y: 566, text: "路由分发", color: "#06B6D4", w: 68 })}

  <!-- Right branch from ui-test to ui-test-visual (x=910) & ui-test-governance (x=1230) -->
  ${orthoPath([[845, 201], [845, 236], [1230, 236], [1230, 638]], { color: "#06B6D4", width: 2.2, marker: "arrowCyan" })}
  ${orthoPath([[1205, 236], [1205, 566], [910, 566], [910, 638]], { color: "#06B6D4", width: 2.2, marker: "arrowCyan" })}
  ${dot(1205, 236, "#06B6D4", 4)}
  ${lineLabel({ x: 1205, y: 405, text: "路由分发", color: "#06B6D4", w: 68 })}
  ${lineLabel({ x: 1060, y: 566, text: "路由分发", color: "#06B6D4", w: 68 })}

  <!-- 3) ui-test-discovery (Layer 2 bottom) -> 3 Testing Agents (discovery-meta + 交接契约) -->
  ${orthoPath([[764, 544], [764, 594], [335, 594], [335, 638]], { color: "#10B981", width: 2.2, dashed: true, marker: "arrowMint" })}
  ${orthoPath([[764, 594], [615, 594], [615, 638]], { color: "#10B981", width: 2.2, dashed: true, marker: "arrowMint" })}
  ${orthoPath([[764, 594], [835, 594], [835, 638]], { color: "#10B981", width: 2.2, dashed: true, marker: "arrowMint" })}
  ${dot(764, 594, "#10B981", 4)}
  ${dot(615, 594, "#10B981", 4)}
  ${lineLabel({ x: 475, y: 594, text: "discovery-meta + 交接契约", color: "#10B981", w: 168 })}
  ${lineLabel({ x: 760, y: 594, text: "discovery-meta + 交接契约", color: "#10B981", w: 168 })}

  <!-- ===================================================================== -->
  <!-- LAYER 4 (Bottom-Left): 核心技能与唯一配置层 (Skills)                  -->
  <!-- Uses left-pillar so NO top-entering vertical lines touch the badge    -->
  <!-- ===================================================================== -->
  ${groupBox({
    x: 36,
    y: 936,
    w: 1326,
    h: 178,
    fill: "#0F1A36",
    stroke: "#F59E0B",
    badgeBg: "#2B2112",
    badgeStroke: "#F59E0B",
    badgePosition: "left-pillar",
    pillarCode: "LAYER 04",
    pillarTitle: "核心技能层",
    pillarSub: "9 Skills & Config",
    badgeColor: "#FBBF24",
  })}

  <!-- 7 Skill Cards inside Layer 4 (x: 164..1346) -->
  <!-- 1. Skill: playwright-ct (cx = 242) -->
  ${nodeCard({
    x: 164,
    y: 954,
    w: 156,
    h: 142,
    fill: "#152447",
    stroke: "#06B6D4",
    topBarColor: "#06B6D4",
    tag: "主 Skill (CT)",
    tagBg: "#0D2847",
    tagColor: "#38BDF8",
    title: "playwright-ct",
    titleColor: "#38BDF8",
    titleSize: 12.5,
    subtitle: "组件挂载与",
    subtitle2: "test-utils 夹具",
  })}

  <!-- 2. Skill: playwright-e2e (cx = 412) -->
  ${nodeCard({
    x: 334,
    y: 954,
    w: 156,
    h: 142,
    fill: "#152447",
    stroke: "#10B981",
    topBarColor: "#10B981",
    tag: "主 Skill (E2E)",
    tagBg: "#0D2E2B",
    tagColor: "#34D399",
    title: "playwright-e2e",
    titleColor: "#34D399",
    titleSize: 12.5,
    subtitle: "页面流 · 副作用",
    subtitle2: "I/O 零容忍断言",
  })}

  <!-- 3. Skill: playwright-visual (cx = 582) -->
  ${nodeCard({
    x: 504,
    y: 954,
    w: 156,
    h: 142,
    fill: "#152447",
    stroke: "#38BDF8",
    topBarColor: "#38BDF8",
    tag: "主 Skill (Visual)",
    tagBg: "#0D2847",
    tagColor: "#7DD3FC",
    title: "playwright-visual",
    titleColor: "#7DD3FC",
    titleSize: 12,
    subtitle: "截图五步去抖与",
    subtitle2: "visual-helpers",
  })}

  <!-- 4. Skill: playwright-vlm (cx = 752) -->
  ${nodeCard({
    x: 674,
    y: 954,
    w: 156,
    h: 142,
    fill: "#1C2244",
    stroke: "#F59E0B",
    topBarColor: "#F59E0B",
    tag: "AI 语义裁决",
    tagBg: "#2B2112",
    tagColor: "#FBBF24",
    title: "playwright-vlm",
    titleColor: "#FBBF24",
    titleSize: 12.5,
    subtitle: "GPT-4o 语义复核",
    subtitle2: "与 visual-test 夹具",
  })}

  <!-- 5. Skill: playwright-azure (cx = 922) -->
  ${nodeCard({
    x: 844,
    y: 954,
    w: 156,
    h: 142,
    fill: "#1C2244",
    stroke: "#F59E0B",
    topBarColor: "#F59E0B",
    tag: "云端与 CI 治理",
    tagBg: "#2B2112",
    tagColor: "#FBBF24",
    title: "playwright-azure",
    titleColor: "#FBBF24",
    titleSize: 12,
    subtitle: "Azure 云端工作区",
    subtitle2: "与三阶段 CI 流水线",
  })}

  <!-- 6. Skill: playwright-config (cx = 1096) -->
  ${nodeCard({
    x: 1014,
    y: 954,
    w: 164,
    h: 142,
    fill: "#26213B",
    stroke: "#F59E0B",
    topBarColor: "#F59E0B",
    tag: "唯一配置所有者",
    tagBg: "#3B2810",
    tagColor: "#FDE68A",
    title: "playwright-config",
    titleColor: "#FDE68A",
    titleSize: 12,
    subtitle: "统一维护三大 Config",
    subtitle2: "脚本与环境门控模板",
  })}

  <!-- 7. Skill: code-review (cx = 1268) -->
  ${nodeCard({
    x: 1192,
    y: 954,
    w: 154,
    h: 142,
    fill: "#27193C",
    stroke: "#F43F5E",
    topBarColor: "#F43F5E",
    tag: "主 Skill (审查)",
    tagBg: "#39152A",
    tagColor: "#FDA4AF",
    title: "code-review",
    titleColor: "#FDA4AF",
    titleSize: 12.5,
    subtitle: "6 维度代码审查",
    subtitle2: "安全与可维护性清单",
  })}

  <!-- ===================================================================== -->
  <!-- LAYER 5 (Bottom-Right): 产物与报告层 (Report-Only)                    -->
  <!-- Badge placed at bottom so top-entering vertical lines are 100% clear  -->
  <!-- ===================================================================== -->
  ${groupBox({
    x: 1382,
    y: 936,
    w: 502,
    h: 178,
    fill: "#0F1A36",
    stroke: "#A855F7",
    badgeBg: "#271543",
    badgeStroke: "#A855F7",
    badgeText: "L5 · 产物与报告层 (Report-Only)",
    badgeColor: "#C084FC",
    badgePosition: "bottom",
    badgeXOffset: 125,
  })}

  <!-- 3 Report Cards inside Layer 5 -->
  <!-- 1. docs/TEST_REPORT.md (cx = 1474) -->
  ${nodeCard({
    x: 1398,
    y: 954,
    w: 152,
    h: 136,
    fill: "#1E1A42",
    stroke: "#A855F7",
    topBarColor: "#A855F7",
    tag: "增量归属报告",
    tagBg: "#2A184E",
    tagColor: "#C084FC",
    title: "TEST_REPORT.md",
    titleColor: "#E9D5FF",
    titleSize: 12,
    subtitle: "docs/ 统一报告",
    subtitle2: "按 Agent 段落归属更新",
  })}

  <!-- 2. playwright-report/ (cx = 1636) -->
  ${nodeCard({
    x: 1560,
    y: 954,
    w: 152,
    h: 136,
    fill: "#1E1A42",
    stroke: "#A855F7",
    topBarColor: "#A855F7",
    tag: "可视化与 Trace",
    tagBg: "#2A184E",
    tagColor: "#C084FC",
    title: "playwright-report/",
    titleColor: "#E9D5FF",
    titleSize: 11.5,
    subtitle: "HTML 交互报告与",
    subtitle2: "VLM 视觉裁决产物",
  })}

  <!-- 3. docs/CODE_REVIEW_REPORT.md (cx = 1796) -->
  ${nodeCard({
    x: 1722,
    y: 954,
    w: 146,
    h: 136,
    fill: "#27193C",
    stroke: "#F43F5E",
    topBarColor: "#F43F5E",
    tag: "独立审查报告",
    tagBg: "#39152A",
    tagColor: "#FDA4AF",
    title: "CODE_REVIEW",
    titleColor: "#FECDD3",
    titleSize: 12,
    subtitle: "docs/ 审查报告",
    subtitle2: "6 维问题分级清单",
  })}

  <!-- ===================================================================== -->
  <!-- CONNECTIONS: LAYER 3 (Testing Agents) ──► LAYER 4 & LAYER 5           -->
  <!-- Upper Band (y=750..836): Horizontal routing tracks ONLY               -->
  <!-- Lower Band (y=840..954): Pure vertical drops + non-overlapping pills  -->
  <!-- ===================================================================== -->

  <!-- Track 1 (y=752): Report-Only Bus 1 -> docs/TEST_REPORT.md (x=1474) -->
  ${orthoPath([[355, 716], [355, 752], [1474, 752], [1474, 952]], { color: "#A855F7", width: 2.1, marker: "arrowPurple" })}
  ${orthoPath([[635, 716], [635, 752]], { color: "#A855F7", width: 2.1, marker: "" })}
  ${orthoPath([[915, 716], [915, 752]], { color: "#A855F7", width: 2.1, marker: "" })}
  ${orthoPath([[1210, 716], [1210, 752]], { color: "#A855F7", width: 2.1, marker: "" })}
  ${dot(635, 752, "#A855F7", 4)}
  ${dot(915, 752, "#A855F7", 4)}
  ${dot(1210, 752, "#A855F7", 4)}
  ${lineLabel({ x: 1474, y: 868, text: "段落增量归属写入", color: "#C084FC", w: 112 })}

  <!-- Track 2 (y=770): Report-Only Bus 2 -> playwright-report/ (x=1636) -->
  ${orthoPath([[385, 716], [385, 770], [1636, 770], [1636, 952]], { color: "#A855F7", width: 2.1, marker: "arrowPurple" })}
  ${orthoPath([[665, 716], [665, 770]], { color: "#A855F7", width: 2.1, marker: "" })}
  ${orthoPath([[945, 716], [945, 770]], { color: "#A855F7", width: 2.1, marker: "" })}
  ${dot(665, 770, "#A855F7", 4)}
  ${dot(945, 770, "#A855F7", 4)}
  ${lineLabel({ x: 1636, y: 898, text: "HTML / VLM 报告", color: "#C084FC", w: 114 })}

  <!-- Track 3 (y=790): 配置门控校验/生成 Bus -> Skill: playwright-config (x=1048) -->
  ${orthoPath([[310, 716], [310, 790], [1048, 790], [1048, 952]], { color: "#F59E0B", width: 2, dashed: true, marker: "arrowAmber" })}
  ${orthoPath([[590, 716], [590, 790]], { color: "#F59E0B", width: 2, dashed: true, marker: "" })}
  ${orthoPath([[870, 716], [870, 790]], { color: "#F59E0B", width: 2, dashed: true, marker: "" })}
  ${dot(590, 790, "#F59E0B", 4)}
  ${dot(870, 790, "#F59E0B", 4)}
  ${lineLabel({ x: 1048, y: 864, text: "配置门控校验/生成", color: "#F59E0B", w: 112 })}

  <!-- Track 4 (y=810): 治理参考 Bus from ui-test-governance -> vlm (x=792), azure (x=922), config (x=1144) -->
  ${orthoPath([[1144, 716], [1144, 810], [792, 810], [792, 952]], { color: "#F59E0B", width: 2, dashed: true, marker: "arrowAmber" })}
  ${orthoPath([[922, 810], [922, 952]], { color: "#F59E0B", width: 2, dashed: true, marker: "arrowAmber" })}
  ${orthoPath([[1144, 810], [1144, 952]], { color: "#F59E0B", width: 2, dashed: true, marker: "arrowAmber" })}
  ${dot(922, 810, "#F59E0B", 4)}
  ${dot(1144, 810, "#F59E0B", 4)}
  ${lineLabel({ x: 792, y: 904, text: "治理参考", color: "#F59E0B", w: 62 })}
  ${lineLabel({ x: 922, y: 884, text: "治理参考", color: "#F59E0B", w: 62 })}
  ${lineLabel({ x: 1144, y: 904, text: "治理参考", color: "#F59E0B", w: 62 })}

  <!-- Track 5 (y=830): Direct Skill Mappings (主 Skill + 显式启用时) -->
  <!-- ui-test-component -> Skill: playwright-ct (x=242) -->
  ${orthoPath([[242, 716], [242, 952]], { color: "#06B6D4", width: 2.4, marker: "arrowCyan" })}
  ${lineLabel({ x: 242, y: 884, text: "主 Skill", color: "#06B6D4", w: 58 })}

  <!-- ui-test-e2e -> Skill: playwright-e2e (x=412) -->
  ${orthoPath([[510, 716], [510, 830], [412, 830], [412, 952]], { color: "#10B981", width: 2.4, marker: "arrowMint" })}
  ${lineLabel({ x: 412, y: 884, text: "主 Skill", color: "#10B981", w: 58 })}

  <!-- ui-test-visual -> Skill: playwright-visual (x=582) -->
  ${orthoPath([[775, 716], [775, 830], [582, 830], [582, 952]], { color: "#38BDF8", width: 2.4, marker: "arrowBlue" })}
  ${lineLabel({ x: 582, y: 884, text: "主 Skill", color: "#38BDF8", w: 58 })}

  <!-- ui-test-visual -> Skill: playwright-vlm (x=712, 显式启用时) -->
  ${orthoPath([[820, 716], [820, 830], [712, 830], [712, 952]], { color: "#F59E0B", width: 2, dashed: true, marker: "arrowAmber" })}
  ${lineLabel({ x: 712, y: 864, text: "显式启用时", color: "#F59E0B", w: 72 })}

  <!-- ===================================================================== -->
  <!-- CONNECTIONS: code-review Agent (Layer 1 Right) ──► Skill & Report     -->
  <!-- ===================================================================== -->
  <!-- code-review Agent -> Skill: code-review (x=1268) -->
  ${orthoPath([[1304, 180], [1356, 180], [1356, 830], [1268, 830], [1268, 952]], { color: "#F43F5E", width: 2.4, marker: "arrowRose" })}
  ${lineLabel({ x: 1268, y: 884, text: "主 Skill", color: "#FDA4AF", w: 62 })}

  <!-- code-review Agent -> docs/CODE_REVIEW_REPORT.md (x=1815) -->
  ${orthoPath([[1304, 152], [1815, 152], [1815, 952]], { color: "#F43F5E", width: 2.4, marker: "arrowRose" })}
  ${lineLabel({ x: 1815, y: 868, text: "生成审查报告", color: "#FDA4AF", w: 92 })}

  <!-- ===================================================================== -->
  <!-- RIGHT-SIDE ARCHITECTURE CALLOUT CARD (x=1395..1755, Clear of Lines)   -->
  <!-- ===================================================================== -->
  <g transform="translate(1395, 250)">
    <rect x="0" y="0" width="360" height="484" rx="12" fill="#101C3B" stroke="#283E75" stroke-width="1.6" filter="url(#dropShadow)" />
    <rect x="0" y="0" width="360" height="6" rx="3" fill="#06B6D4" />
    <text x="22" y="34" fill="#FFFFFF" font-family="PingFang SC" font-size="15.5" font-weight="700">架构设计四大黄金原则 (Core Principles)</text>

    <!-- Principle 1 -->
    <rect x="18" y="52" width="324" height="94" rx="8" fill="#16264F" stroke="#06B6D4" stroke-width="1.1" />
    <text x="32" y="74" fill="#38BDF8" font-family="PingFang SC" font-size="13" font-weight="700">1. 单向依赖与职责正交</text>
    <text x="32" y="95" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• Agent 负责意图编排、门控与交接契约</text>
    <text x="32" y="114" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• Skill 封装领域规范、脚本模板与断言标准</text>
    <text x="32" y="133" fill="#94A3B8" font-family="PingFang SC" font-size="11">• 严禁跨 Agent 循环调用或职责越界</text>

    <!-- Principle 2 -->
    <rect x="18" y="158" width="324" height="94" rx="8" fill="#16264F" stroke="#10B981" stroke-width="1.1" />
    <text x="32" y="180" fill="#34D399" font-family="PingFang SC" font-size="13" font-weight="700">2. 发现共享 + Git 新鲜度校验</text>
    <text x="32" y="201" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• ui-test-discovery 一次探索，三端复用</text>
    <text x="32" y="220" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• 校验 git-commit 哈希防过期缓存污染</text>
    <text x="32" y="239" fill="#94A3B8" font-family="PingFang SC" font-size="11">• 融合 AST + Browser/CLI/Computer Use</text>

    <!-- Principle 3 -->
    <rect x="18" y="264" width="324" height="94" rx="8" fill="#16264F" stroke="#F59E0B" stroke-width="1.1" />
    <text x="32" y="286" fill="#FBBF24" font-family="PingFang SC" font-size="13" font-weight="700">3. 配置文件唯一所有者铁律</text>
    <text x="32" y="307" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• playwright-config 独占三大配置文件</text>
    <text x="32" y="326" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• CT / E2E / Visual 执行前仅做门控检查</text>
    <text x="32" y="345" fill="#94A3B8" font-family="PingFang SC" font-size="11">• 杜绝多 Agent 并发篡改编译与端口参数</text>

    <!-- Principle 4 -->
    <rect x="18" y="370" width="324" height="96" rx="8" fill="#16264F" stroke="#A855F7" stroke-width="1.1" />
    <text x="32" y="392" fill="#C084FC" font-family="PingFang SC" font-size="13" font-weight="700">4. Report-Only 只报不改源码</text>
    <text x="32" y="413" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• 测试与审查 Agent 严禁擅改 src/ 业务码</text>
    <text x="32" y="432" fill="#CBD5E1" font-family="PingFang SC" font-size="11.5">• 按段落归属更新 docs/TEST_REPORT.md</text>
    <text x="32" y="451" fill="#94A3B8" font-family="PingFang SC" font-size="11">• 像素比对优先 + GPT-4o VLM 语义降噪</text>
  </g>

  <!-- Bottom Footer -->
  <text x="36" y="1144" fill="#64748B" font-family="PingFang SC" font-size="11.5">TravelVista UI Automation Architecture  |  7 Specialized Agents × 9 Reusable Skills × 4 Exploration Channels × Report-Only Governance</text>
  <text x="${W - 36}" y="1144" text-anchor="end" fill="#64748B" font-family="Menlo" font-size="11">docs/presentations/ui-test-architecture-diagram.png</text>
</svg>`;

  const outDir = path.join(process.cwd(), "docs", "presentations");
  fs.mkdirSync(outDir, { recursive: true });

  const svgPath = path.join(outDir, "ui-test-architecture-diagram.svg");
  const pngPath = path.join(outDir, "ui-test-architecture-diagram.png");

  fs.writeFileSync(svgPath, svg, "utf8");

  await sharp(Buffer.from(svg), { density: 144 })
    .resize(W * 2, H * 2)
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(pngPath);

  const stat = fs.statSync(pngPath);
  console.log(`Generated SVG: ${svgPath}`);
  console.log(`Generated PNG: ${pngPath} (${(stat.size / 1024).toFixed(1)} KB)`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
