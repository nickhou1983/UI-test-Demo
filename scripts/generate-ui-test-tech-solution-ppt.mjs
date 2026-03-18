import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'GitHub Copilot';
pptx.company = 'UI-test-Demo';
pptx.subject = 'UI Test 智能测试体系技术方案';
pptx.title = 'UI Test 智能测试体系技术方案';
pptx.lang = 'zh-CN';
pptx.theme = {
  headFontFace: 'Microsoft YaHei',
  bodyFontFace: 'Microsoft YaHei',
  lang: 'zh-CN',
};

const W = 13.333;
const H = 7.5;

const palette = {
  navy: '17324D',
  ink: '10212F',
  teal: '0E8C8F',
  mint: '59C3C3',
  sand: 'F4EFE6',
  cream: 'FBF9F5',
  coral: 'E3725B',
  gold: 'D5A44B',
  slate: '5F7383',
  steel: 'D8E2E7',
  white: 'FFFFFF',
  text: '20303C',
  muted: '708494',
  success: '2C8F68',
  warn: 'C8782B',
};

function addBg(slide, color) {
  slide.background = { color };
}

function addFooter(slide, page, inverse = false) {
  slide.addText('UI-test 智能测试体系技术方案', {
    x: 0.55,
    y: 7.03,
    w: 4.5,
    h: 0.2,
    fontFace: 'Microsoft YaHei',
    fontSize: 8,
    color: inverse ? palette.steel : palette.muted,
    margin: 0,
  });
  slide.addText(String(page).padStart(2, '0'), {
    x: 12.3,
    y: 6.98,
    w: 0.45,
    h: 0.22,
    fontFace: 'Microsoft YaHei',
    fontSize: 9,
    bold: true,
    color: inverse ? palette.white : palette.navy,
    align: 'right',
    margin: 0,
  });
}

function addSectionHeader(slide, eyebrow, title, subtitle, opts = {}) {
  const dark = opts.dark ?? false;
  const x = opts.x ?? 0.65;
  const y = opts.y ?? 0.5;
  slide.addText(eyebrow, {
    x,
    y,
    w: 2.6,
    h: 0.25,
    fontFace: 'Microsoft YaHei',
    fontSize: 11,
    bold: true,
    color: dark ? palette.mint : palette.teal,
    charSpacing: 1.2,
    margin: 0,
  });
  slide.addText(title, {
    x,
    y: y + 0.22,
    w: 8.4,
    h: 0.55,
    fontFace: 'Microsoft YaHei',
    fontSize: 28,
    bold: true,
    color: dark ? palette.white : palette.ink,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x,
      y: y + 0.8,
      w: 8.8,
      h: 0.45,
      fontFace: 'Microsoft YaHei',
      fontSize: 13,
      color: dark ? 'D7E4EB' : palette.muted,
      margin: 0,
    });
  }
}

function addRoundedPanel(slide, x, y, w, h, fill, line = fill, radius = 0.12) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: radius,
    fill: { color: fill },
    line: { color: line, width: 1 },
  });
}

function addMetricCard(slide, { x, y, w, h, value, label, accent, detail }) {
  addRoundedPanel(slide, x, y, w, h, palette.white, palette.steel);
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.14,
    h,
    fill: { color: accent },
    line: { color: accent, width: 0 },
  });
  slide.addText(value, {
    x: x + 0.28,
    y: y + 0.18,
    w: w - 0.4,
    h: 0.42,
    fontFace: 'Microsoft YaHei',
    fontSize: 24,
    bold: true,
    color: palette.ink,
    margin: 0,
  });
  slide.addText(label, {
    x: x + 0.28,
    y: y + 0.66,
    w: w - 0.4,
    h: 0.25,
    fontFace: 'Microsoft YaHei',
    fontSize: 11,
    bold: true,
    color: palette.slate,
    margin: 0,
  });
  slide.addText(detail, {
    x: x + 0.28,
    y: y + 1.0,
    w: w - 0.45,
    h: h - 1.1,
    fontFace: 'Microsoft YaHei',
    fontSize: 10,
    color: palette.muted,
    margin: 0,
    fit: 'shrink',
  });
}

function addBulletList(slide, items, x, y, w, h, color = palette.text, fontSize = 15) {
  slide.addText(
    items.map((item, index) => ({
      text: item,
      options: { bullet: true, breakLine: index !== items.length - 1 },
    })),
    {
      x,
      y,
      w,
      h,
      fontFace: 'Microsoft YaHei',
      fontSize,
      color,
      breakLine: false,
      paraSpaceAfterPt: 8,
      margin: 0,
      valign: 'top',
      fit: 'shrink',
    }
  );
}

function addIconCircle(slide, x, y, diameter, fill, text, fontSize = 14) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x,
    y,
    w: diameter,
    h: diameter,
    fill: { color: fill },
    line: { color: fill, width: 0 },
  });
  slide.addText(text, {
    x,
    y: y + 0.01,
    w: diameter,
    h: diameter,
    align: 'center',
    valign: 'mid',
    margin: 0,
    fontFace: 'Microsoft YaHei',
    fontSize,
    bold: true,
    color: palette.white,
  });
}

function addProcessArrow(slide, x, y, w, h, fill) {
  slide.addShape(pptx.ShapeType.chevron, {
    x,
    y,
    w,
    h,
    fill: { color: fill },
    line: { color: fill, width: 0 },
  });
}

function addCaption(slide, text, x, y, w, color = palette.muted) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.2,
    fontFace: 'Microsoft YaHei',
    fontSize: 9,
    italic: true,
    color,
    margin: 0,
  });
}

// Slide 1
{
  const slide = pptx.addSlide();
  addBg(slide, palette.navy);

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: H,
    fill: { color: palette.navy },
    line: { color: palette.navy, width: 0 },
  });
  slide.addShape(pptx.ShapeType.arc, {
    x: 9.4,
    y: -0.9,
    w: 5.6,
    h: 5.6,
    line: { color: palette.teal, width: 10, transparency: 45 },
    fill: { color: palette.navy, transparency: 100 },
    adjustPoint: 0.22,
  });
  slide.addShape(pptx.ShapeType.arc, {
    x: 8.5,
    y: 3.25,
    w: 5.2,
    h: 3.6,
    line: { color: palette.coral, width: 7, transparency: 55 },
    fill: { color: palette.navy, transparency: 100 },
    adjustPoint: 0.28,
  });

  slide.addText('TECHNICAL SOLUTION', {
    x: 0.78,
    y: 0.66,
    w: 3.2,
    h: 0.25,
    color: palette.mint,
    fontFace: 'Arial',
    fontSize: 12,
    bold: true,
    charSpacing: 2.2,
    margin: 0,
  });
  slide.addText('UI-test 智能测试体系技术方案', {
    x: 0.75,
    y: 1.18,
    w: 6.6,
    h: 0.92,
    color: palette.white,
    fontFace: 'Microsoft YaHei',
    fontSize: 28,
    bold: true,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('面向技术负责人，聚焦 UI 自动化分层、回归效率、视觉治理与 Azure 扩展路径', {
    x: 0.8,
    y: 2.2,
    w: 5.9,
    h: 0.55,
    color: 'D7E4EB',
    fontFace: 'Microsoft YaHei',
    fontSize: 15,
    margin: 0,
    fit: 'shrink',
  });

  addRoundedPanel(slide, 0.82, 3.22, 2.1, 0.82, '244B6A', '244B6A');
  addRoundedPanel(slide, 3.04, 3.22, 2.25, 0.82, '244B6A', '244B6A');
  addRoundedPanel(slide, 5.42, 3.22, 2.35, 0.82, '244B6A', '244B6A');
  slide.addText('5 个测试代理', {
    x: 1.08,
    y: 3.44,
    w: 1.55,
    h: 0.24,
    fontFace: 'Microsoft YaHei',
    fontSize: 16,
    bold: true,
    color: palette.white,
    margin: 0,
    align: 'center',
  });
  slide.addText('3 条日常测试链路', {
    x: 3.32,
    y: 3.44,
    w: 1.72,
    h: 0.24,
    fontFace: 'Microsoft YaHei',
    fontSize: 16,
    bold: true,
    color: palette.white,
    margin: 0,
    align: 'center',
  });
  slide.addText('Azure / VLM 可选增强', {
    x: 5.73,
    y: 3.44,
    w: 1.75,
    h: 0.24,
    fontFace: 'Microsoft YaHei',
    fontSize: 16,
    bold: true,
    color: palette.white,
    margin: 0,
    align: 'center',
  });

  addRoundedPanel(slide, 8.2, 1.05, 4.1, 5.25, palette.cream, palette.cream);
  slide.addText('方案核心', {
    x: 8.62,
    y: 1.42,
    w: 1.6,
    h: 0.35,
    fontFace: 'Microsoft YaHei',
    fontSize: 18,
    bold: true,
    color: palette.ink,
    margin: 0,
  });
  addBulletList(
    slide,
    [
      '以 ui-test 作为统一入口，对测试请求做快速分类与路由。',
      '以 discovery 复用环境、路由、组件、定位器、旅程等上下文。',
      '以 CT、E2E、Visual 三条链路承担日常测试执行。',
      '以 Governance 独立承接 Azure、CI/CD、VLM 与基线策略。',
      '默认本地优先，治理能力按需升级，避免一开始就引入重流程。',
    ],
    8.55,
    1.95,
    3.25,
    2.75,
    palette.text,
    14
  );
  addCaption(slide, '基于当前 UI-test-Demo 仓库现状梳理', 8.56, 5.55, 2.5, palette.slate);
  addFooter(slide, 1, true);
}

// Slide 2
{
  const slide = pptx.addSlide();
  addBg(slide, palette.cream);
  addSectionHeader(slide, 'EXECUTIVE SUMMARY', '为什么现在要升级 UI 测试体系', '核心目标不是“多写测试”，而是把质量验证做成可编排、可治理、可扩展的工程能力。');

  addMetricCard(slide, {
    x: 0.72,
    y: 1.75,
    w: 3.8,
    h: 2.1,
    value: '统一入口',
    label: '降低协作成本',
    accent: palette.teal,
    detail: '测试诉求统一进入 ui-test，再由专业代理接管，避免“先问工具、后问目标”的沟通摩擦。',
  });
  addMetricCard(slide, {
    x: 4.75,
    y: 1.75,
    w: 3.8,
    h: 2.1,
    value: '复用 Discovery',
    label: '减少重复分析',
    accent: palette.coral,
    detail: '路由、组件、i18n、locator、journey 不再被每条链路重复发现，降低生成测试时的随机性。',
  });
  addMetricCard(slide, {
    x: 8.78,
    y: 1.75,
    w: 3.8,
    h: 2.1,
    value: '治理可插拔',
    label: '本地优先，云上增强',
    accent: palette.gold,
    detail: '本地默认使用原生 Playwright，只有在需要 PR 门禁、Azure 云执行、VLM 审查时再引入治理链路。',
  });

  addRoundedPanel(slide, 0.72, 4.2, 12.0, 2.15, palette.white, palette.steel);
  addIconCircle(slide, 1.05, 4.6, 0.42, palette.teal, '1', 13);
  addIconCircle(slide, 4.28, 4.6, 0.42, palette.coral, '2', 13);
  addIconCircle(slide, 7.5, 4.6, 0.42, palette.gold, '3', 13);
  addIconCircle(slide, 10.73, 4.6, 0.42, palette.navy, '4', 13);
  slide.addText('质量目标', {
    x: 1.56,
    y: 4.55,
    w: 1.2,
    h: 0.2,
    fontSize: 14,
    bold: true,
    color: palette.ink,
    margin: 0,
  });
  slide.addText('工程目标', {
    x: 4.78,
    y: 4.55,
    w: 1.2,
    h: 0.2,
    fontSize: 14,
    bold: true,
    color: palette.ink,
    margin: 0,
  });
  slide.addText('治理目标', {
    x: 8.01,
    y: 4.55,
    w: 1.2,
    h: 0.2,
    fontSize: 14,
    bold: true,
    color: palette.ink,
    margin: 0,
  });
  slide.addText('业务目标', {
    x: 11.23,
    y: 4.55,
    w: 1.2,
    h: 0.2,
    fontSize: 14,
    bold: true,
    color: palette.ink,
    margin: 0,
  });
  slide.addText('发现回归更早、定位更快。', { x: 1.56, y: 4.88, w: 1.8, h: 0.4, fontSize: 11, color: palette.muted, margin: 0, fit: 'shrink' });
  slide.addText('测试链路标准化，可重复生成。', { x: 4.78, y: 4.88, w: 1.9, h: 0.4, fontSize: 11, color: palette.muted, margin: 0, fit: 'shrink' });
  slide.addText('基线与云执行能力可控引入。', { x: 8.01, y: 4.88, w: 1.9, h: 0.4, fontSize: 11, color: palette.muted, margin: 0, fit: 'shrink' });
  slide.addText('保障关键页面和用户旅程稳定。', { x: 11.23, y: 4.88, w: 1.2, h: 0.6, fontSize: 11, color: palette.muted, margin: 0, fit: 'shrink' });
  addFooter(slide, 2);
}

// Slide 3
{
  const slide = pptx.addSlide();
  addBg(slide, palette.cream);
  addSectionHeader(slide, 'CURRENT STATE', '仓库现状与机会点', '当前项目已经具备较好的 Playwright 基础，但覆盖结构仍偏“点状”，需要升级为体系化能力。');

  slide.addChart(pptx.ChartType.bar, [
    { name: '现有资产', labels: ['功能型 CT', 'E2E 规格', '页面视觉基线', '组件视觉基线'], values: [6, 6, 8, 10] },
  ], {
    x: 0.8,
    y: 1.75,
    w: 5.3,
    h: 3.4,
    catAxisLabelFontFace: 'Microsoft YaHei',
    valAxisLabelFontFace: 'Microsoft YaHei',
    catAxisLabelColor: palette.slate,
    valAxisLabelColor: palette.slate,
    chartColors: [palette.teal],
    chartArea: { fill: { color: palette.white }, roundedCorners: true, line: { color: palette.steel, width: 1 } },
    showTitle: true,
    title: '现有测试资产分布',
    titleFontFace: 'Microsoft YaHei',
    titleFontSize: 16,
    titleColor: palette.ink,
    showLegend: false,
    showValue: true,
    valGridLine: { color: 'E3E8EB', size: 0.5 },
    catGridLine: { style: 'none' },
    dataLabelColor: palette.ink,
    dataLabelPosition: 'outEnd',
  });

  addRoundedPanel(slide, 6.45, 1.75, 6.0, 3.42, palette.white, palette.steel);
  slide.addText('关键观察', {
    x: 6.82,
    y: 2.02,
    w: 1.9,
    h: 0.25,
    fontSize: 18,
    bold: true,
    color: palette.ink,
    margin: 0,
  });
  addBulletList(slide, [
    '日常执行已分为 E2E、Visual、CT 三条本地链路，基础配置完整。',
    '视觉测试具备 VLM fallback 扩展，但默认仍保持像素比对优先。',
    'Trip/Favorites 等业务页面已有视觉基线，功能型 E2E 仍相对薄弱。',
    '组件测试重点集中于 Navbar、DestinationCard、FilterBar、SearchBar，仍有组件只做了视觉基线。',
  ], 6.8, 2.45, 5.1, 1.8, palette.text, 13);

  addRoundedPanel(slide, 0.82, 5.45, 3.85, 1.15, 'E9F7F5', 'D0ECE8');
  addRoundedPanel(slide, 4.85, 5.45, 3.85, 1.15, 'FFF1EC', 'F3D6CC');
  addRoundedPanel(slide, 8.88, 5.45, 3.55, 1.15, 'FFF7E8', 'EEDDB8');
  slide.addText('优势：配置与目录结构已经稳定', { x: 1.1, y: 5.72, w: 3.2, h: 0.18, fontSize: 13, bold: true, color: palette.success, margin: 0 });
  slide.addText('缺口：功能覆盖与视觉覆盖不均衡', { x: 5.13, y: 5.72, w: 3.15, h: 0.18, fontSize: 13, bold: true, color: palette.coral, margin: 0 });
  slide.addText('机会：治理能力可以按需接入', { x: 9.16, y: 5.72, w: 2.9, h: 0.18, fontSize: 13, bold: true, color: palette.warn, margin: 0 });
  slide.addText('适合在现有基础上升级，不需要重做框架。', { x: 1.1, y: 6.03, w: 3.2, h: 0.24, fontSize: 10.5, color: palette.muted, margin: 0 });
  slide.addText('需要一套更清晰的场景矩阵与推进优先级。', { x: 5.13, y: 6.03, w: 3.15, h: 0.24, fontSize: 10.5, color: palette.muted, margin: 0 });
  slide.addText('适合把 Azure / CI / VLM 留在后续治理阶段。', { x: 9.16, y: 6.03, w: 2.9, h: 0.24, fontSize: 10.5, color: palette.muted, margin: 0, fit: 'shrink' });
  addFooter(slide, 3);
}

// Slide 4
{
  const slide = pptx.addSlide();
  addBg(slide, palette.white);
  addSectionHeader(slide, 'ARCHITECTURE', '总体架构：轻入口 + 专业代理 + 可复用发现层', '把“请求分类、测试执行、云上治理”拆开，是这套体系能长期演进的关键。');

  addRoundedPanel(slide, 4.1, 1.55, 5.1, 0.86, palette.navy, palette.navy);
  slide.addText('ui-test 统一入口', {
    x: 4.35,
    y: 1.82,
    w: 4.6,
    h: 0.24,
    align: 'center',
    fontSize: 20,
    bold: true,
    color: palette.white,
    margin: 0,
  });
  slide.addText('接收自然语言测试需求，判断应走哪一条能力链路。', {
    x: 4.55,
    y: 2.08,
    w: 4.15,
    h: 0.2,
    align: 'center',
    fontSize: 10.5,
    color: 'D7E4EB',
    margin: 0,
  });

  slide.addShape(pptx.ShapeType.line, { x: 6.66, y: 2.42, w: 0, h: 0.45, line: { color: palette.teal, width: 2.2 } });

  addRoundedPanel(slide, 0.88, 2.92, 2.25, 1.18, 'F0FAFA', 'CDE9EA');
  addRoundedPanel(slide, 3.38, 2.92, 2.25, 1.18, 'F5FBFC', 'CDE9EA');
  addRoundedPanel(slide, 5.88, 2.92, 2.25, 1.18, 'FFF7EF', 'EFDCC2');
  addRoundedPanel(slide, 8.38, 2.92, 2.25, 1.18, 'FFF3EF', 'EBCFC6');
  addRoundedPanel(slide, 10.88, 2.92, 1.6, 1.18, 'EFF2F7', 'D6DEE6');

  const agentBoxes = [
    ['Discovery', '环境、路由、组件、locator、journey'],
    ['Component', '隔离渲染、props、event、provider'],
    ['E2E', '页面流、筛选、导航、用户旅程'],
    ['Visual', '页面/组件基线、差异分析'],
    ['Governance', 'Azure、CI、VLM、基线策略'],
  ];
  const agentXs = [1.08, 3.58, 6.08, 8.58, 11.07];
  const agentWs = [1.85, 1.85, 1.85, 1.85, 1.22];
  agentBoxes.forEach(([title, desc], i) => {
    slide.addText(title, {
      x: agentXs[i],
      y: 3.15,
      w: agentWs[i],
      h: 0.22,
      align: 'center',
      fontSize: 16,
      bold: true,
      color: palette.ink,
      margin: 0,
    });
    slide.addText(desc, {
      x: agentXs[i] - 0.05,
      y: 3.48,
      w: agentWs[i] + 0.1,
      h: 0.42,
      align: 'center',
      fontSize: 9.5,
      color: palette.muted,
      margin: 0,
      fit: 'shrink',
    });
  });

  slide.addShape(pptx.ShapeType.line, { x: 1.98, y: 4.16, w: 9.75, h: 0, line: { color: palette.steel, width: 1.2 } });

  addRoundedPanel(slide, 1.05, 4.55, 3.35, 1.4, 'F7FBFD', palette.steel);
  addRoundedPanel(slide, 5.0, 4.55, 3.35, 1.4, 'F7FBFD', palette.steel);
  addRoundedPanel(slide, 8.95, 4.55, 3.35, 1.4, 'F7FBFD', palette.steel);

  slide.addText('配置与运行层', { x: 1.33, y: 4.83, w: 1.7, h: 0.2, fontSize: 16, bold: true, color: palette.navy, margin: 0 });
  slide.addText('playwright.config.ts / playwright-ct.config.ts / playwright.service.config.ts', { x: 1.33, y: 5.15, w: 2.7, h: 0.36, fontSize: 10.5, color: palette.muted, margin: 0, fit: 'shrink' });
  slide.addText('执行产物层', { x: 5.28, y: 4.83, w: 1.7, h: 0.2, fontSize: 16, bold: true, color: palette.navy, margin: 0 });
  slide.addText('HTML 报告、test-results、视觉快照、VLM JSON、Azure Portal 结果', { x: 5.28, y: 5.15, w: 2.7, h: 0.36, fontSize: 10.5, color: palette.muted, margin: 0, fit: 'shrink' });
  slide.addText('组织收益层', { x: 9.23, y: 4.83, w: 1.7, h: 0.2, fontSize: 16, bold: true, color: palette.navy, margin: 0 });
  slide.addText('统一协作入口、回归效率、基线治理、云执行能力、面向 PR 的质量门禁', { x: 9.23, y: 5.15, w: 2.7, h: 0.36, fontSize: 10.5, color: palette.muted, margin: 0, fit: 'shrink' });

  addFooter(slide, 4);
}

// Slide 5
{
  const slide = pptx.addSlide();
  addBg(slide, palette.white);
  addSectionHeader(slide, 'SCENARIO MATRIX', '测试场景矩阵', '不同链路解决的是不同层次的问题，不能用一套测试去替代全部需求。');

  const rows = [
    [
      { text: '链路', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '核心目标', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '主要输入', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '主要输出', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
    ],
    [
      'Component / CT',
      '验证组件渲染、props、event、条件分支',
      '组件路径、样例 props、provider 依赖、关键渲染输出',
      '组件 spec、挂载断言、失败定位结论',
    ],
    [
      'E2E',
      '验证页面流程、交互与用户旅程',
      '路由清单、交互点、locator 建议、预期 URL / 文本 / 状态变化',
      '页面 spec、旅程 spec、失败证据与 root cause 分析',
    ],
    [
      'Visual',
      '验证 UI 布局与视觉回归',
      '页面清单、视口、状态变体、基线环境、i18n 变体',
      '基线快照、差异截图、像素或语义级判定',
    ],
    [
      'Governance',
      '定义 Azure / CI / VLM / 基线治理规则',
      '套件目标、Workspace、认证方式、门禁策略、成本约束',
      '执行策略、CI 约束、审查标准、平台报表',
    ],
  ];

  slide.addTable(rows, {
    x: 0.72,
    y: 1.78,
    w: 11.9,
    h: 3.7,
    colW: [2.0, 3.0, 3.55, 3.35],
    rowH: [0.5, 0.74, 0.82, 0.76, 0.76],
    fontFace: 'Microsoft YaHei',
    fontSize: 11,
    color: palette.text,
    border: { type: 'solid', color: palette.steel, pt: 1 },
    fill: palette.white,
    margin: 0.08,
    valign: 'mid',
    autoFit: false,
  });

  addRoundedPanel(slide, 0.9, 5.75, 3.65, 0.95, 'F0FAFA', 'CFE8E9');
  addRoundedPanel(slide, 4.84, 5.75, 3.65, 0.95, 'FFF3EF', 'EBCFC6');
  addRoundedPanel(slide, 8.78, 5.75, 3.1, 0.95, 'FFF7E8', 'EDDAB0');
  slide.addText('原则 1：先问测试目标，再决定链路。', { x: 1.16, y: 6.03, w: 3.0, h: 0.18, fontSize: 12.5, bold: true, color: palette.teal, margin: 0 });
  slide.addText('原则 2：先像素、后 VLM，保持默认链路简单。', { x: 5.1, y: 6.03, w: 3.0, h: 0.18, fontSize: 12.5, bold: true, color: palette.coral, margin: 0 });
  slide.addText('原则 3：CT 不上 Azure。', { x: 9.03, y: 6.03, w: 2.55, h: 0.18, fontSize: 12.5, bold: true, color: palette.warn, margin: 0 });
  addFooter(slide, 5);
}

// Slide 6
{
  const slide = pptx.addSlide();
  addBg(slide, palette.cream);
  addSectionHeader(slide, 'PROCESS FLOW', '端到端测试流程设计', '把“从需求到报告”的每一步标准化，才能把测试从手工作坊变成稳定流程。');

  const processY = 2.25;
  const boxW = 2.05;
  const boxH = 1.05;
  const xs = [0.7, 3.05, 5.4, 7.75, 10.1];
  const fills = [palette.navy, palette.teal, palette.coral, palette.gold, palette.ink];
  const titles = ['需求进入', '能力分类', '上下文补齐', '测试执行', '结果沉淀'];
  const descs = [
    '自然语言需求进入 ui-test',
    '路由到 discovery / CT / E2E / Visual / Governance',
    '补齐路由、组件、locator、journey、环境',
    '运行 Playwright 本地或 Azure 云上套件',
    '产出 HTML 报告、截图、JSON、Portal 记录',
  ];

  xs.forEach((x, i) => {
    addRoundedPanel(slide, x, processY, boxW, boxH, fills[i], fills[i]);
    slide.addText(titles[i], {
      x: x + 0.14,
      y: processY + 0.22,
      w: boxW - 0.28,
      h: 0.22,
      align: 'center',
      fontSize: 18,
      bold: true,
      color: palette.white,
      margin: 0,
    });
    slide.addText(descs[i], {
      x: x + 0.12,
      y: processY + 0.53,
      w: boxW - 0.24,
      h: 0.32,
      align: 'center',
      fontSize: 9.5,
      color: 'EAF2F5',
      margin: 0,
      fit: 'shrink',
    });
    if (i < xs.length - 1) {
      addProcessArrow(slide, x + 1.95, processY + 0.28, 0.48, 0.5, 'BFD7DE');
    }
  });

  addRoundedPanel(slide, 0.8, 4.35, 12.0, 1.7, palette.white, palette.steel);
  slide.addText('标准化检查点', { x: 1.08, y: 4.68, w: 1.8, h: 0.2, fontSize: 18, bold: true, color: palette.ink, margin: 0 });
  addBulletList(slide, [
    '输入不完整时，优先走 discovery，而不是直接猜测组件或 locator。',
    '测试生成后默认先本地执行；只有在用户明确提出 CI / Azure / 门禁要求时才升级治理链路。',
    '失败处理遵循 report-only：定位、分类、给方向，不默认自动改业务代码。',
    '视觉回归默认使用原生 toHaveScreenshot，只有像素失败且 VLM_REVIEW=true 时才触发语义判断。',
  ], 1.05, 5.0, 11.1, 0.75, palette.text, 12.5);
  addFooter(slide, 6);
}

// Slide 7
{
  const slide = pptx.addSlide();
  addBg(slide, palette.white);
  addSectionHeader(slide, 'INPUT / OUTPUT', '输入输出契约', '对技术负责人而言，最重要的不是“有多少测试”，而是每一条链路的输入是否稳定、输出是否可消费。');

  addRoundedPanel(slide, 0.82, 1.8, 5.85, 4.8, 'F7FBFD', 'D7E4EB');
  addRoundedPanel(slide, 6.75, 1.8, 5.75, 4.8, 'FFFDF8', 'E8DFC8');
  slide.addText('输入层', { x: 1.12, y: 2.08, w: 1.2, h: 0.2, fontSize: 20, bold: true, color: palette.navy, margin: 0 });
  slide.addText('输出层', { x: 7.05, y: 2.08, w: 1.2, h: 0.2, fontSize: 20, bold: true, color: palette.navy, margin: 0 });
  addBulletList(slide, [
    '测试意图：组件、E2E、视觉、Azure、VLM、CI 门禁。',
    '发现产物：Project Analysis Report、Route Inventory、Component Inventory、Locator Notes、Journey Notes。',
    '运行参数：baseURL、视口、语言、样例数据、localStorage seed、云端认证。',
    '治理约束：基线环境、并发、成本上限、PR 通过条件、VLM 阈值。',
  ], 1.08, 2.52, 5.0, 2.3, palette.text, 13);
  addBulletList(slide, [
    '代码层：CT/E2E/Visual spec、fixture、reporter、service config。',
    '证据层：HTML 报告、test-results、trace、失败截图、视觉快照。',
    '治理层：vlm-review-report.json、Azure Portal Test Runs、CI Artifact。',
    '决策层：通过 / 失败 / 基线更新 / 低置信度待人工复核。',
  ], 7.02, 2.52, 4.9, 2.3, palette.text, 13);

  slide.addShape(pptx.ShapeType.line, { x: 6.65, y: 2.05, w: 0, h: 4.2, line: { color: palette.steel, width: 1.4, dash: 'dash' } });

  addRoundedPanel(slide, 1.08, 5.2, 4.95, 0.98, 'EAF6F6', 'D0E8E9');
  addRoundedPanel(slide, 7.02, 5.2, 4.9, 0.98, 'FFF6EA', 'EEDDB8');
  slide.addText('输入设计的目标：减少猜测，提升生成稳定性。', { x: 1.35, y: 5.53, w: 4.4, h: 0.18, fontSize: 12.5, bold: true, color: palette.teal, margin: 0 });
  slide.addText('输出设计的目标：让测试结果能直接被研发、测试、CI 消费。', { x: 7.28, y: 5.53, w: 4.35, h: 0.18, fontSize: 12.2, bold: true, color: palette.warn, margin: 0, fit: 'shrink' });
  addFooter(slide, 7);
}

// Slide 8
{
  const slide = pptx.addSlide();
  addBg(slide, palette.cream);
  addSectionHeader(slide, 'REPO MAPPING', '当前仓库落地映射', '技术方案不是从零开始，而是建立在当前已经可运行的仓库资产之上。');

  addRoundedPanel(slide, 0.82, 1.82, 4.0, 4.9, palette.white, palette.steel);
  addRoundedPanel(slide, 4.98, 1.82, 4.0, 4.9, palette.white, palette.steel);
  addRoundedPanel(slide, 9.14, 1.82, 3.38, 4.9, palette.white, palette.steel);

  slide.addText('配置与脚本', { x: 1.12, y: 2.08, w: 1.4, h: 0.2, fontSize: 18, bold: true, color: palette.navy, margin: 0 });
  addBulletList(slide, [
    'playwright.config.ts：本地 E2E + Visual。',
    'playwright-ct.config.ts：本地组件测试。',
    'playwright.service.config.ts：Azure Playwright Workspace。',
    'package.json 脚本：test:e2e / test:ct / test:visual / test:azure:*。',
  ], 1.06, 2.45, 3.25, 2.0, palette.text, 12.5);

  slide.addText('测试目录', { x: 5.28, y: 2.08, w: 1.4, h: 0.2, fontSize: 18, bold: true, color: palette.navy, margin: 0 });
  addBulletList(slide, [
    'tests/component：功能型组件测试 + 组件视觉基线。',
    'tests/e2e：页面验证、导航、i18n、用户旅程。',
    'tests/visual：页面级视觉回归。',
    'tests/fixtures 与 tests/utils：wrapper、VLM fixture、reporter、reviewer。',
  ], 5.22, 2.45, 3.25, 2.0, palette.text, 12.5);

  slide.addText('已有业务覆盖', { x: 9.44, y: 2.08, w: 1.7, h: 0.2, fontSize: 18, bold: true, color: palette.navy, margin: 0 });
  addBulletList(slide, [
    '首页、列表页、详情页、About 已有 E2E。',
    'Favorites、Trips、TripEdit 已有视觉基线。',
    'Navbar、DestinationCard、FilterBar、SearchBar 已有核心 CT。',
  ], 9.38, 2.45, 2.45, 2.0, palette.text, 12.2);

  slide.addChart(pptx.ChartType.doughnut, [
    { name: '覆盖结构', labels: ['功能验证', '视觉验证', '治理扩展'], values: [12, 18, 5] },
  ], {
    x: 1.2,
    y: 4.75,
    w: 2.15,
    h: 1.55,
    holeSize: 58,
    chartColors: [palette.teal, palette.coral, palette.gold],
    showTitle: false,
    showLegend: false,
    showValue: false,
    showPercent: false,
    showCategoryName: false,
  });
  slide.addText('当前资产以\n视觉验证占比更高', {
    x: 1.53,
    y: 5.15,
    w: 1.45,
    h: 0.6,
    align: 'center',
    valign: 'mid',
    fontSize: 11,
    bold: true,
    color: palette.ink,
    margin: 0,
  });

  addRoundedPanel(slide, 4.58, 5.2, 3.82, 0.95, 'F0FAFA', 'CFE9EA');
  addRoundedPanel(slide, 8.76, 5.2, 3.28, 0.95, 'FFF3EF', 'EBCFC6');
  slide.addText('建议一：优先补 Trip / Favorites 的功能型 E2E。', { x: 4.85, y: 5.52, w: 3.3, h: 0.18, fontSize: 12.5, bold: true, color: palette.teal, margin: 0, fit: 'shrink' });
  slide.addText('建议二：对仅有视觉基线的组件补充行为断言。', { x: 9.03, y: 5.52, w: 2.72, h: 0.18, fontSize: 12.1, bold: true, color: palette.coral, margin: 0, fit: 'shrink' });
  addFooter(slide, 8);
}

// Slide 9
{
  const slide = pptx.addSlide();
  addBg(slide, palette.white);
  addSectionHeader(slide, 'GOVERNANCE', '治理与平台扩展边界', '默认把日常测试留在本地，把复杂性留给真正需要治理的场景。');

  addMetricCard(slide, {
    x: 0.8,
    y: 1.95,
    w: 3.9,
    h: 3.65,
    value: 'Local First',
    label: '默认执行模型',
    accent: palette.teal,
    detail: '日常 E2E、Visual、CT 都优先使用本地 Playwright。\n优点是反馈快、链路简单、对团队门槛低。',
  });
  addMetricCard(slide, {
    x: 4.93,
    y: 1.95,
    w: 3.9,
    h: 3.65,
    value: 'Azure PT',
    label: '云执行与规模化',
    accent: palette.coral,
    detail: '只承接 E2E 与 Visual。CT 不上云。\n适合 PR 门禁、统一浏览器环境、并行执行、平台可观测。',
  });
  addMetricCard(slide, {
    x: 9.06,
    y: 1.95,
    w: 3.45,
    h: 3.65,
    value: 'VLM Review',
    label: '视觉语义兜底',
    accent: palette.gold,
    detail: '仅在像素差异失败且显式开启 VLM_REVIEW=true 时触发。\n目的不是替代像素比对，而是降低误报、辅助人工判断。',
  });

  addRoundedPanel(slide, 0.82, 5.95, 11.72, 0.75, 'F7FBFD', 'D7E4EB');
  slide.addText('治理边界结论：把 Azure、CI、VLM 视为“可插拔能力”，而不是所有团队一开始就必须承受的复杂度。', {
    x: 1.15,
    y: 6.22,
    w: 11.1,
    h: 0.18,
    fontSize: 13.5,
    bold: true,
    color: palette.ink,
    margin: 0,
    align: 'center',
  });
  addFooter(slide, 9);
}

// Slide 10
{
  const slide = pptx.addSlide();
  addBg(slide, palette.cream);
  addSectionHeader(slide, 'ROADMAP', '分阶段实施路线', '先补覆盖，再补治理；先把高频问题解决，再把平台能力做深。');

  const phases = [
    { x: 0.85, title: 'Phase 1', subtitle: '覆盖补齐', color: palette.teal, points: ['补 Trip / Favorites / TripEdit 的 E2E 关键路径', '补 FavoriteButton / WeatherWidget 等组件行为 CT'] },
    { x: 3.95, title: 'Phase 2', subtitle: '视觉治理', color: palette.coral, points: ['区分“基线更新”与“真实回归”', '补多视口和关键 i18n 页面视觉覆盖'] },
    { x: 7.05, title: 'Phase 3', subtitle: '平台接入', color: palette.gold, points: ['接入 Azure PT 的 PR / main 执行路径', '统一 Artifact、Trace、Portal 查看入口'] },
    { x: 10.15, title: 'Phase 4', subtitle: '智能审查', color: palette.navy, points: ['把 VLM 控制在视觉差异误报场景', '以阈值、成本、置信度为约束上线'] },
  ];

  slide.addShape(pptx.ShapeType.line, { x: 1.1, y: 3.95, w: 11.0, h: 0, line: { color: palette.steel, width: 2.2 } });
  phases.forEach((phase, i) => {
    slide.addShape(pptx.ShapeType.line, { x: phase.x + 1.1, y: 3.6, w: 0, h: 0.72, line: { color: phase.color, width: 5 } });
    addRoundedPanel(slide, phase.x, 2.05, 2.25, 1.2, phase.color, phase.color);
    slide.addText(phase.title, { x: phase.x + 0.28, y: 2.34, w: 1.7, h: 0.22, align: 'center', fontSize: 19, bold: true, color: palette.white, margin: 0 });
    slide.addText(phase.subtitle, { x: phase.x + 0.28, y: 2.65, w: 1.7, h: 0.18, align: 'center', fontSize: 11, color: 'EAF2F5', margin: 0 });
    addRoundedPanel(slide, phase.x - 0.02, 4.3, 2.3, 1.55, palette.white, palette.steel);
    addBulletList(slide, phase.points, phase.x + 0.15, 4.55, 1.95, 0.95, palette.text, 11.2);
    if (i < phases.length - 1) {
      addProcessArrow(slide, phase.x + 2.28, 2.38, 0.45, 0.42, 'BFD7DE');
    }
  });
  addCaption(slide, '建议节奏：先解决业务高频回归与关键页面覆盖，再把治理能力逐步提升为平台标准。', 0.92, 6.35, 6.3, palette.slate);
  addFooter(slide, 10);
}

// Slide 11
{
  const slide = pptx.addSlide();
  addBg(slide, palette.white);
  addSectionHeader(slide, 'RISKS & CONTROLS', '主要风险与控制策略', '技术负责人需要关注的是：这套方案如何避免失控，而不是它理论上能做多少。');

  const cards = [
    ['定位器脆弱', '尽量依赖 role / label / text，必要时先经过 discovery 形成 locator strategy map。', palette.teal],
    ['视觉误报', '默认像素比对；只有用户显式开启时才用 VLM 做语义兜底，并加置信度阈值。', palette.coral],
    ['基线漂移', '明确 authoritative baseline 环境，避免本地与 Azure 基线混用。', palette.gold],
    ['云上复杂度过早引入', '把 Azure / CI / 门禁放到治理层，不污染日常测试链路。', palette.navy],
    ['业务覆盖失衡', '用覆盖矩阵驱动补强优先级，先补高价值页面与旅程。', palette.success],
    ['结果不可消费', '输出必须带 HTML 报告、截图证据、JSON 或 Portal 结果，避免只留终端日志。', palette.warn],
  ];
  const positions = [
    [0.85, 1.92], [4.55, 1.92], [8.25, 1.92],
    [0.85, 4.2], [4.55, 4.2], [8.25, 4.2],
  ];
  cards.forEach(([title, body, color], i) => {
    const [x, y] = positions[i];
    addRoundedPanel(slide, x, y, 3.1, 1.72, 'FBFCFD', palette.steel);
    slide.addShape(pptx.ShapeType.rect, { x, y, w: 3.1, h: 0.14, fill: { color }, line: { color, width: 0 } });
    slide.addText(title, { x: x + 0.2, y: y + 0.28, w: 2.7, h: 0.2, fontSize: 16, bold: true, color: palette.ink, margin: 0 });
    slide.addText(body, { x: x + 0.2, y: y + 0.64, w: 2.68, h: 0.74, fontSize: 11.2, color: palette.muted, margin: 0, fit: 'shrink' });
  });
  addFooter(slide, 11);
}

// Slide 12
{
  const slide = pptx.addSlide();
  addBg(slide, palette.ink);
  addSectionHeader(slide, 'DECISION', '建议的决策与下一步', '这不是要不要做自动化的问题，而是要不要把现有能力升级成可持续的平台化体系。', { dark: true });

  addRoundedPanel(slide, 0.9, 2.08, 3.7, 2.7, '173A52', '173A52');
  addRoundedPanel(slide, 4.82, 2.08, 3.7, 2.7, '173A52', '173A52');
  addRoundedPanel(slide, 8.74, 2.08, 3.7, 2.7, '173A52', '173A52');

  slide.addText('决策 1', { x: 1.2, y: 2.38, w: 0.9, h: 0.2, fontSize: 19, bold: true, color: palette.mint, margin: 0 });
  slide.addText('确认 ui-test 作为统一入口', { x: 1.2, y: 2.72, w: 2.95, h: 0.28, fontSize: 18, bold: true, color: palette.white, margin: 0, fit: 'shrink' });
  slide.addText('统一团队使用口径，避免按人和工具分裂测试流程。', { x: 1.2, y: 3.2, w: 2.92, h: 0.6, fontSize: 12.2, color: 'D9E4EA', margin: 0, fit: 'shrink' });

  slide.addText('决策 2', { x: 5.12, y: 2.38, w: 0.9, h: 0.2, fontSize: 19, bold: true, color: palette.coral, margin: 0 });
  slide.addText('优先补关键业务路径覆盖', { x: 5.12, y: 2.72, w: 2.95, h: 0.28, fontSize: 18, bold: true, color: palette.white, margin: 0, fit: 'shrink' });
  slide.addText('优先级建议：Trip / Favorites 的功能型 E2E，其次补仅有视觉基线的组件行为 CT。', { x: 5.12, y: 3.2, w: 2.95, h: 0.7, fontSize: 12.2, color: 'D9E4EA', margin: 0, fit: 'shrink' });

  slide.addText('决策 3', { x: 9.04, y: 2.38, w: 0.9, h: 0.2, fontSize: 19, bold: true, color: palette.gold, margin: 0 });
  slide.addText('治理能力按阶段启用', { x: 9.04, y: 2.72, w: 2.95, h: 0.28, fontSize: 18, bold: true, color: palette.white, margin: 0, fit: 'shrink' });
  slide.addText('先把本地链路做稳定，再接入 Azure 门禁与 VLM；不要让治理能力反过来拖慢研发反馈。', { x: 9.04, y: 3.2, w: 2.95, h: 0.7, fontSize: 12.2, color: 'D9E4EA', margin: 0, fit: 'shrink' });

  slide.addShape(pptx.ShapeType.line, { x: 1.0, y: 5.48, w: 11.3, h: 0, line: { color: '506A7A', width: 1.2 } });
  slide.addText('最终结论：当前仓库已经具备“升级为平台化 UI 测试体系”的基础条件，建议以“覆盖补齐 + 治理延后”的方式推进。', {
    x: 1.02,
    y: 5.8,
    w: 11.25,
    h: 0.5,
    align: 'center',
    fontSize: 16,
    bold: true,
    color: palette.white,
    margin: 0,
  });
  addFooter(slide, 12, true);
}

// Slide 13
{
  const slide = pptx.addSlide();
  addBg(slide, palette.white);
  addSectionHeader(slide, 'APPENDIX A', '附录：关键配置映射', '把入口、配置、执行范围和治理边界映射清楚，便于技术评审时快速对齐责任。');

  const rows = [
    [
      { text: '配置 / 文件', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '定位', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '主要职责', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '关键边界', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
    ],
    [
      'ui-test.agent.md',
      '.github/agents',
      '统一入口，负责把需求路由到 Discovery / CT / E2E / Visual / Governance。',
      '不直接承载完整实现逻辑，避免重新变回单体代理。',
    ],
    [
      'playwright.config.ts',
      '仓库根目录',
      '本地 E2E 与 Visual 默认配置，定义 baseURL、reporter、webServer、project 拆分。',
      '默认本地优先；Visual 仍以原生像素比对为主。',
    ],
    [
      'playwright-ct.config.ts',
      '仓库根目录',
      '组件测试配置，复用 Vite / PostCSS，负责 CT 挂载环境。',
      'CT 仅本地执行，不进入 Azure Playwright Workspace。',
    ],
    [
      'playwright.service.config.ts',
      '仓库根目录',
      'Azure Playwright Workspace 云执行配置，增加 cloud reporter 与连接参数。',
      '仅承接 E2E / Visual；引入 Azure 凭据与平台侧并发。',
    ],
    [
      'tests/fixtures/visual-test.ts',
      'tests/fixtures',
      '封装像素优先、VLM 兜底的视觉断言逻辑。',
      '只有像素失败且 VLM_REVIEW=true 时才进入语义审查。',
    ],
  ];

  slide.addTable(rows, {
    x: 0.72,
    y: 1.75,
    w: 12.0,
    h: 4.2,
    colW: [2.2, 2.0, 4.0, 3.8],
    rowH: [0.48, 0.72, 0.8, 0.72, 0.8, 0.8],
    fontFace: 'Microsoft YaHei',
    fontSize: 10.5,
    color: palette.text,
    border: { type: 'solid', color: palette.steel, pt: 1 },
    fill: palette.white,
    margin: 0.08,
    valign: 'mid',
    autoFit: false,
  });

  addRoundedPanel(slide, 0.9, 6.2, 5.65, 0.6, 'F0FAFA', 'CFE8E9');
  addRoundedPanel(slide, 6.72, 6.2, 5.65, 0.6, 'FFF3EF', 'EBCFC6');
  slide.addText('评审重点 1：是否接受“主流程本地优先、治理能力后置”的工程边界。', { x: 1.16, y: 6.41, w: 5.1, h: 0.16, fontSize: 11.6, bold: true, color: palette.teal, margin: 0, fit: 'shrink' });
  slide.addText('评审重点 2：是否确认 ui-test 与 3 套 Playwright 配置的职责拆分长期保持不变。', { x: 6.98, y: 6.41, w: 5.1, h: 0.16, fontSize: 11.4, bold: true, color: palette.coral, margin: 0, fit: 'shrink' });
  addFooter(slide, 13);
}

// Slide 14
{
  const slide = pptx.addSlide();
  addBg(slide, palette.cream);
  addSectionHeader(slide, 'APPENDIX B', '附录：当前覆盖矩阵与缺口', '这页用于技术评审时回答“我们现在具体测到了哪里，还差哪里”。');

  const rows = [
    [
      { text: '对象', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '功能型 CT', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: 'E2E', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '视觉回归', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
      { text: '结论', options: { bold: true, color: palette.white, fill: { color: palette.navy }, align: 'center' } },
    ],
    ['Home / Destinations / Detail / About', '部分覆盖', '已覆盖', '已覆盖', '核心主链路相对完整，可作为标准样板。'],
    ['Favorites / Trip Planner / Trip Edit', '未覆盖', '弱覆盖 / 待补', '已覆盖', '属于当前最值得优先补强的业务缺口。'],
    ['Navbar / DestinationCard / FilterBar / SearchBar', '已覆盖', '间接覆盖', '部分覆盖', '组件行为断言基础较好，可持续复用。'],
    ['FavoriteButton / WeatherWidget / ScrollToTop / Layout', '弱覆盖 / 未覆盖', '间接覆盖', '已覆盖', '目前更偏视觉基线，缺行为型验证。'],
    ['Azure / VLM 治理链路', '不适用', '按需启用', '按需启用', '能力已具雏形，但不应早于本地链路标准化。'],
  ];

  slide.addTable(rows, {
    x: 0.72,
    y: 1.72,
    w: 12.0,
    h: 3.95,
    colW: [2.8, 1.75, 1.55, 1.55, 4.35],
    rowH: [0.48, 0.67, 0.72, 0.67, 0.72, 0.72],
    fontFace: 'Microsoft YaHei',
    fontSize: 10.4,
    color: palette.text,
    border: { type: 'solid', color: palette.steel, pt: 1 },
    fill: palette.white,
    margin: 0.08,
    valign: 'mid',
    autoFit: false,
  });

  addMetricCard(slide, {
    x: 0.9,
    y: 5.95,
    w: 3.65,
    h: 0.95,
    value: '优先级 A',
    label: '先补业务高价值 E2E',
    accent: palette.teal,
    detail: 'Trip / Favorites / TripEdit 直接影响业务闭环，应优先补充功能流验证。',
  });
  addMetricCard(slide, {
    x: 4.84,
    y: 5.95,
    w: 3.65,
    h: 0.95,
    value: '优先级 B',
    label: '再补组件行为 CT',
    accent: palette.coral,
    detail: '针对仅有视觉基线的组件补断言，降低 UI 变化误判与行为漏测。',
  });
  addMetricCard(slide, {
    x: 8.78,
    y: 5.95,
    w: 3.65,
    h: 0.95,
    value: '优先级 C',
    label: '最后补治理门禁',
    accent: palette.gold,
    detail: '等本地链路、基线策略和覆盖矩阵稳定后，再引入 Azure / VLM 门禁。',
  });
  addFooter(slide, 14);
}

// Slide 15
{
  const slide = pptx.addSlide();
  addBg(slide, palette.white);
  addSectionHeader(slide, 'APPENDIX C', '附录：执行命令与治理触发条件', '这页用于回答“团队如何跑、何时上云、何时启用 VLM”。');

  addRoundedPanel(slide, 0.82, 1.78, 6.0, 4.95, 'F7FBFD', 'D7E4EB');
  addRoundedPanel(slide, 6.95, 1.78, 5.55, 4.95, 'FFFDF8', 'E8DFC8');

  slide.addText('常用执行命令', { x: 1.12, y: 2.05, w: 1.8, h: 0.2, fontSize: 18, bold: true, color: palette.navy, margin: 0 });
  const commandRows = [
    ['本地 E2E', 'npm run test:e2e'],
    ['本地 Visual', 'npm run test:visual'],
    ['本地 CT', 'npm run test:ct'],
    ['本地更新视觉基线', 'npm run test:update-snapshots'],
    ['Azure E2E', 'npm run test:azure:e2e'],
    ['Azure Visual', 'npm run test:azure:visual'],
    ['启用 VLM 的本地 Visual', 'npm run test:visual:vlm'],
    ['启用 VLM 的 Azure Visual', 'npm run test:azure:visual:vlm'],
  ];
  slide.addTable([
    [
      { text: '场景', options: { bold: true, color: palette.white, fill: { color: palette.teal }, align: 'center' } },
      { text: '命令', options: { bold: true, color: palette.white, fill: { color: palette.teal }, align: 'center' } },
    ],
    ...commandRows,
  ], {
    x: 1.08,
    y: 2.38,
    w: 5.45,
    h: 3.6,
    colW: [1.8, 3.65],
    rowH: [0.42, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38, 0.45, 0.45],
    fontFace: 'Consolas',
    fontSize: 10,
    color: palette.text,
    border: { type: 'solid', color: palette.steel, pt: 1 },
    fill: palette.white,
    margin: 0.07,
    valign: 'mid',
    autoFit: false,
  });

  slide.addText('治理触发条件', { x: 7.24, y: 2.05, w: 1.8, h: 0.2, fontSize: 18, bold: true, color: palette.navy, margin: 0 });
  addBulletList(slide, [
    '只有明确要求 PR 门禁、统一浏览器环境、平台报表时，才切到 Azure Playwright Workspace。',
    '只有像素差异失败且团队希望降低视觉误报时，才显式开启 VLM_REVIEW=true。',
    'CT 永远留在本地，因为它依赖本地组件挂载和 Vite 开发上下文。',
    '本地链路没有稳定之前，不建议先上云治理，否则会把问题复杂化而不是解决问题。',
  ], 7.18, 2.42, 4.6, 2.05, palette.text, 12.6);

  addRoundedPanel(slide, 7.18, 5.0, 4.6, 1.22, 'FFF3EF', 'EBCFC6');
  slide.addText('给技术负责人的控制点', { x: 7.46, y: 5.24, w: 2.2, h: 0.18, fontSize: 13.5, bold: true, color: palette.coral, margin: 0 });
  slide.addText('先控制入口、配置、覆盖优先级，再控制云执行与语义审查成本。', { x: 7.46, y: 5.58, w: 3.95, h: 0.24, fontSize: 11.6, color: palette.muted, margin: 0, fit: 'shrink' });
  addFooter(slide, 15);
}

await pptx.writeFile({ fileName: '/Users/qifenghou/Codes/UI-test-Demo/docs/presentations/ui-test-technical-solution-zh.pptx' });