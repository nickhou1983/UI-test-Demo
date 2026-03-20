/**
 * VLM HTML Visual Reporter
 *
 * Generates a standalone HTML report with:
 * - Dashboard: severity distribution, detected patterns
 * - Per-entry cards: baseline / actual screenshots side-by-side,
 *   severity badge, confidence bar, areas + changedProperties tags
 *
 * Image handling:
 *   Default  → external <img src="file:///..."> refs (smaller HTML)
 *   VLM_REPORT_INLINE=true → base64-encoded inline images (portable)
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface HtmlReportEntry {
  testTitle: string;
  severity: string;
  confidence: number | null;
  action: string;
  areas: string[];
  changedProperties: string[];
  description: string;
  baselinePath?: string;
  actualPath?: string;
  diffPath?: string;
}

export default class VlmHtmlReporter implements Reporter {
  private entries: HtmlReportEntry[] = [];
  private outputDir = '';
  private inlineImages = process.env.VLM_REPORT_INLINE === 'true';

  onBegin(config: FullConfig, _suite: Suite): void { // eslint-disable-line @typescript-eslint/no-unused-vars
    this.outputDir = config.configFile ? dirname(config.configFile) : config.rootDir;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const attachmentPaths: Record<string, string> = {};
    for (const att of result.attachments) {
      if (att.path && att.name.startsWith('vlm-')) {
        attachmentPaths[att.name] = att.path;
      }
    }

    for (const annotation of result.annotations) {
      if (!['vlm-override', 'vlm-warning', 'vlm-breaking', 'vlm-low-confidence'].includes(annotation.type)) continue;
      const desc = annotation.description || '';

      this.entries.push({
        testTitle: test.title,
        severity: this.mapSeverity(annotation.type),
        confidence: this.extractConfidence(desc),
        action: this.mapAction(annotation.type),
        areas: this.extractList(desc, 'areas'),
        changedProperties: this.extractList(desc, 'changedProperties'),
        description: desc,
        baselinePath: this.findAttachment(attachmentPaths, 'vlm-baseline-'),
        actualPath: this.findAttachment(attachmentPaths, 'vlm-actual-'),
        diffPath: this.findAttachment(attachmentPaths, 'vlm-diff-'),
      });
    }
  }

  onEnd(_result: FullResult): void { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (this.entries.length === 0) return;

    const html = this.buildHtml();
    const outPath = join(this.outputDir, 'vlm-visual-report.html');
    writeFileSync(outPath, html, 'utf-8');
    console.log(`[VLM HTML Reporter] Report written to: ${outPath}`);
  }

  // ── HTML generation ──

  private buildHtml(): string {
    const severityCounts = this.countBy((e) => e.severity);
    const actionCounts = this.countBy((e) => e.action);
    const propertyCounts = this.flatCountBy((e) => e.changedProperties);
    const areaCounts = this.flatCountBy((e) => e.areas);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VLM Visual Regression Report</title>
<style>
  :root {
    --bg: #0d1117; --surface: #161b22; --border: #30363d;
    --text: #e6edf3; --text-dim: #8b949e;
    --green: #3fb950; --yellow: #d29922; --red: #f85149; --blue: #58a6ff; --cyan: #39d2c0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); padding: 24px; }
  h1 { font-size: 1.6rem; margin-bottom: 8px; }
  .subtitle { color: var(--text-dim); margin-bottom: 24px; font-size: 0.9rem; }
  /* Dashboard */
  .dashboard { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; min-width: 140px; }
  .stat-card .label { color: var(--text-dim); font-size: 0.8rem; text-transform: uppercase; }
  .stat-card .value { font-size: 1.8rem; font-weight: 700; margin-top: 4px; }
  .stat-card .value.green { color: var(--green); }
  .stat-card .value.yellow { color: var(--yellow); }
  .stat-card .value.red { color: var(--red); }
  /* Patterns */
  .patterns { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 32px; }
  .patterns h2 { font-size: 1.1rem; margin-bottom: 8px; }
  .pattern-item { color: var(--text-dim); margin: 4px 0; }
  /* Tags */
  .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
  .tag { background: #21262d; border: 1px solid var(--border); border-radius: 12px; padding: 2px 10px; font-size: 0.75rem; color: var(--cyan); }
  .tag.prop { color: var(--yellow); }
  /* Entries */
  .entry { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px; overflow: hidden; }
  .entry-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .entry-title { font-weight: 600; }
  .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
  .badge.cosmetic { background: #0e3a1c; color: var(--green); }
  .badge.minor { background: #3a2a05; color: var(--yellow); }
  .badge.breaking { background: #3d1014; color: var(--red); }
  .badge.uncertain { background: #1c2d3a; color: var(--blue); }
  .entry-body { padding: 16px 20px; }
  .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 12px; }
  .screenshot-box { text-align: center; }
  .screenshot-box .label { font-size: 0.8rem; color: var(--text-dim); margin-bottom: 6px; }
  .screenshot-box img { max-width: 100%; border-radius: 6px; border: 1px solid var(--border); }
  /* Confidence bar */
  .conf-bar { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .conf-bar .bar { flex: 1; max-width: 120px; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .conf-bar .fill { height: 100%; border-radius: 3px; }
  .conf-bar .conf-label { font-size: 0.8rem; color: var(--text-dim); }
  .desc { color: var(--text-dim); font-size: 0.85rem; margin-top: 8px; word-break: break-word; }
  @media (max-width: 600px) { .screenshots { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<h1>VLM Visual Regression Report</h1>
<p class="subtitle">Generated ${new Date().toISOString()} &mdash; ${this.entries.length} VLM reviews</p>

<!-- Dashboard -->
<div class="dashboard">
  <div class="stat-card"><div class="label">Total</div><div class="value">${this.entries.length}</div></div>
  <div class="stat-card"><div class="label">Passed</div><div class="value green">${actionCounts['passed_vlm'] || 0}</div></div>
  <div class="stat-card"><div class="label">Warned</div><div class="value yellow">${actionCounts['warned_vlm'] || 0}</div></div>
  <div class="stat-card"><div class="label">Failed</div><div class="value red">${actionCounts['failed'] || 0}</div></div>
</div>

<!-- Severity & Property Breakdown -->
${this.renderPatterns(severityCounts, propertyCounts, areaCounts)}

<!-- Entries -->
${this.entries.map((e) => this.renderEntry(e)).join('\n')}

</body>
</html>`;
  }

  private renderPatterns(
    severityCounts: Record<string, number>,
    propertyCounts: Record<string, number>,
    areaCounts: Record<string, number>,
  ): string {
    const total = this.entries.length;
    const patternsHtml: string[] = [];

    for (const [area, count] of Object.entries(areaCounts)) {
      if (count / total >= 0.5) {
        patternsHtml.push(`<div class="pattern-item">&#128205; "${this.esc(area)}" affected in ${count}/${total} pages (${Math.round(count / total * 100)}%)</div>`);
      }
    }
    for (const [prop, count] of Object.entries(propertyCounts)) {
      if (count / total >= 0.5) {
        patternsHtml.push(`<div class="pattern-item">&#127912; "${this.esc(prop)}" change across ${count}/${total} pages (${Math.round(count / total * 100)}%)</div>`);
      }
    }

    if (patternsHtml.length === 0 && Object.keys(severityCounts).length <= 1) return '';

    return `<div class="patterns">
  <h2>Detected Patterns</h2>
  ${patternsHtml.length > 0 ? patternsHtml.join('\n  ') : '<div class="pattern-item">No cross-page patterns detected.</div>'}
  <div style="margin-top:12px;color:var(--text-dim);font-size:0.8rem;">
    Severity: ${Object.entries(severityCounts).map(([k, v]) => `${this.esc(k)}: ${v}`).join(' | ')}
    &nbsp;&mdash;&nbsp;
    Properties: ${Object.entries(propertyCounts).map(([k, v]) => `${this.esc(k)}: ${v}`).join(' | ') || 'none'}
  </div>
</div>`;
  }

  private renderEntry(e: HtmlReportEntry): string {
    const confPct = e.confidence != null ? Math.round(e.confidence * 100) : null;
    const confColor = e.confidence != null
      ? (e.confidence >= 0.8 ? 'var(--green)' : e.confidence >= 0.5 ? 'var(--yellow)' : 'var(--red)')
      : 'var(--border)';

    const screenshots = [
      { label: 'Baseline', path: e.baselinePath },
      { label: 'Actual', path: e.actualPath },
      { label: 'Diff', path: e.diffPath },
    ].filter((s) => s.path);

    return `<div class="entry">
  <div class="entry-header">
    <span class="entry-title">${this.esc(e.testTitle)}</span>
    <span class="badge ${e.severity}">${this.esc(e.severity)}</span>
  </div>
  <div class="entry-body">
    ${confPct != null ? `<div class="conf-bar"><span class="conf-label">Confidence: ${confPct}%</span><div class="bar"><div class="fill" style="width:${confPct}%;background:${confColor}"></div></div></div>` : ''}
    ${e.areas.length > 0 ? `<div class="tags">${e.areas.map((a) => `<span class="tag">${this.esc(a)}</span>`).join('')}</div>` : ''}
    ${e.changedProperties.length > 0 ? `<div class="tags">${e.changedProperties.map((p) => `<span class="tag prop">${this.esc(p)}</span>`).join('')}</div>` : ''}
    ${screenshots.length > 0 ? `<div class="screenshots">${screenshots.map((s) => this.renderScreenshot(s.label, s.path!)).join('')}</div>` : ''}
  </div>
</div>`;
  }

  private renderScreenshot(label: string, filePath: string): string {
    const src = this.inlineImages ? this.toDataUri(filePath) : `file://${filePath}`;
    return `<div class="screenshot-box"><div class="label">${this.esc(label)}</div><img src="${src}" alt="${this.esc(label)}" loading="lazy"></div>`;
  }

  // ── Helpers ──

  private toDataUri(filePath: string): string {
    if (!existsSync(filePath)) return '';
    const ext = extname(filePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const buf = readFileSync(filePath);
    return `data:${mime};base64,${buf.toString('base64')}`;
  }

  private esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  private findAttachment(paths: Record<string, string>, prefix: string): string | undefined {
    for (const [name, path] of Object.entries(paths)) {
      if (name.startsWith(prefix)) return path;
    }
    return undefined;
  }

  private extractConfidence(desc: string): number | null {
    const m = desc.match(/confidence:\s*([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
  }

  private extractList(desc: string, key: string): string[] {
    const re = new RegExp(`\\(${key}:\\s*([^)]+)\\)`);
    const m = desc.match(re);
    return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  }

  private mapSeverity(type: string): string {
    return ({ 'vlm-override': 'cosmetic', 'vlm-warning': 'minor', 'vlm-breaking': 'breaking', 'vlm-low-confidence': 'uncertain' } as Record<string, string>)[type] || 'unknown';
  }

  private mapAction(type: string): string {
    return ({ 'vlm-override': 'passed_vlm', 'vlm-warning': 'warned_vlm', 'vlm-breaking': 'failed', 'vlm-low-confidence': 'failed' } as Record<string, string>)[type] || 'failed';
  }

  private countBy(fn: (e: HtmlReportEntry) => string): Record<string, number> {
    const map: Record<string, number> = {};
    for (const e of this.entries) { const k = fn(e); map[k] = (map[k] || 0) + 1; }
    return map;
  }

  private flatCountBy(fn: (e: HtmlReportEntry) => string[]): Record<string, number> {
    const map: Record<string, number> = {};
    for (const e of this.entries) { for (const k of fn(e)) { map[k] = (map[k] || 0) + 1; } }
    return map;
  }
}
