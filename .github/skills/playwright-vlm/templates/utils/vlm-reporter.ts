/**
 * VLM Visual Review Reporter
 *
 * Canonical source: .github/skills/playwright-vlm/templates/utils/vlm-reporter.ts
 *
 * Custom Playwright reporter that collects VLM review results
 * and generates an enhanced JSON report file at the end of the test run.
 *
 * Features:
 * - Extracts VLM annotations and screenshot attachments from test results
 * - Generates aggregated statistics by page, severity, area, and changedProperty
 * - Detects cross-page patterns (e.g., "global theme color change across 6/8 pages")
 * - Prints ANSI-colored terminal table with summary
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface VlmReportEntry {
  testTitle: string;
  testFile: string;
  screenshotName: string;
  pixelDiffFailed: boolean;
  vlmSeverity?: string;
  vlmDescription?: string;
  vlmAreas?: string[];
  vlmChangedProperties?: string[];
  vlmRecommendation?: string;
  vlmConfidence?: number;
  vlmError?: string;
  action: string;
  baselinePath?: string;
  actualPath?: string;
  diffPath?: string;
}

interface DetectedPattern {
  type: 'global-area' | 'global-property';
  label: string;
  affectedCount: number;
  totalCount: number;
  percentage: number;
  details: string;
}

// ANSI color codes
const c = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

export default class VlmReporter implements Reporter {
  private entries: VlmReportEntry[] = [];
  private outputDir: string = '';
  private vlmCallCount = 0;

  onBegin(config: FullConfig, _suite: Suite): void { // eslint-disable-line @typescript-eslint/no-unused-vars
    this.outputDir = config.configFile ? dirname(config.configFile) : config.rootDir;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // Extract screenshot attachment paths
    const attachmentPaths: Record<string, string> = {};
    for (const attachment of result.attachments) {
      if (attachment.path && attachment.name.startsWith('vlm-')) {
        attachmentPaths[attachment.name] = attachment.path;
      }
    }

    // Extract VLM annotations from test results
    for (const annotation of result.annotations) {
      if (
        annotation.type === 'vlm-override' ||
        annotation.type === 'vlm-warning' ||
        annotation.type === 'vlm-breaking' ||
        annotation.type === 'vlm-low-confidence'
      ) {
        this.vlmCallCount++;
        const desc = annotation.description || '';
        const screenshotName = this.extractScreenshotName(desc);

        this.entries.push({
          testTitle: test.title,
          testFile: test.location.file,
          screenshotName,
          pixelDiffFailed: true,
          vlmSeverity: this.extractSeverity(annotation.type),
          vlmDescription: desc,
          vlmAreas: this.extractAreas(desc),
          vlmChangedProperties: this.extractChangedProperties(desc),
          vlmRecommendation: this.extractRecommendation(annotation.type),
          vlmConfidence: this.extractConfidence(desc),
          action: this.annotationTypeToAction(annotation.type),
          baselinePath: this.findAttachment(attachmentPaths, 'vlm-baseline-'),
          actualPath: this.findAttachment(attachmentPaths, 'vlm-actual-'),
          diffPath: this.findAttachment(attachmentPaths, 'vlm-diff-'),
        });
      }
    }
  }

  onEnd(result: FullResult): void {
    const summary = {
      total: this.entries.length,
      passed_vlm: this.entries.filter((e) => e.action === 'passed_vlm').length,
      warned_vlm: this.entries.filter((e) => e.action === 'warned_vlm').length,
      failed: this.entries.filter((e) => e.action === 'failed').length,
    };

    const aggregation = this.buildAggregation();
    const patterns = this.detectPatterns();

    const report = {
      generatedAt: new Date().toISOString(),
      testRunStatus: result.status,
      vlmEnabled: process.env.VLM_REVIEW === 'true',
      vlmCallCount: this.vlmCallCount,
      maxCalls: Number(process.env.VLM_MAX_CALLS) || 10,
      confidenceThreshold: Number(process.env.VLM_CONFIDENCE_THRESHOLD) || 0.7,
      summary,
      patterns,
      aggregation,
      entries: this.entries,
    };

    const reportPath = join(this.outputDir, 'vlm-review-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n${c.cyan}[VLM Reporter]${c.reset} Report written to: ${reportPath}`);

    if (this.entries.length > 0) {
      this.printTable(report);
    } else {
      console.log(`${c.dim}[VLM Reporter] No VLM reviews triggered (all pixel comparisons passed or VLM disabled).${c.reset}`);
    }
  }

  // ── Aggregation ──

  private buildAggregation() {
    const bySeverity: Record<string, number> = {};
    const byArea: Record<string, number> = {};
    const byProperty: Record<string, number> = {};
    const byPage: Record<string, { severity: string; action: string; confidence?: number }> = {};

    for (const e of this.entries) {
      // By severity
      const sev = e.vlmSeverity || 'unknown';
      bySeverity[sev] = (bySeverity[sev] || 0) + 1;

      // By area
      for (const area of e.vlmAreas ?? []) {
        byArea[area] = (byArea[area] || 0) + 1;
      }

      // By changedProperty
      for (const prop of e.vlmChangedProperties ?? []) {
        byProperty[prop] = (byProperty[prop] || 0) + 1;
      }

      // By page
      byPage[e.testTitle] = {
        severity: sev,
        action: e.action,
        confidence: e.vlmConfidence,
      };
    }

    return { bySeverity, byArea, byProperty, byPage };
  }

  // ── Pattern Detection ──

  private detectPatterns(): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];
    const total = this.entries.length;
    if (total < 2) return patterns;

    const threshold = 0.5; // >50% of entries

    // Detect global area patterns
    const areaCounts: Record<string, number> = {};
    for (const e of this.entries) {
      for (const area of e.vlmAreas ?? []) {
        areaCounts[area] = (areaCounts[area] || 0) + 1;
      }
    }

    for (const [area, count] of Object.entries(areaCounts)) {
      const pct = count / total;
      if (pct >= threshold) {
        patterns.push({
          type: 'global-area',
          label: area,
          affectedCount: count,
          totalCount: total,
          percentage: Math.round(pct * 100),
          details: `"${area}" affected in ${count}/${total} pages (${Math.round(pct * 100)}%)`,
        });
      }
    }

    // Detect global changedProperty patterns
    const propCounts: Record<string, number> = {};
    for (const e of this.entries) {
      for (const prop of e.vlmChangedProperties ?? []) {
        propCounts[prop] = (propCounts[prop] || 0) + 1;
      }
    }

    for (const [prop, count] of Object.entries(propCounts)) {
      const pct = count / total;
      if (pct >= threshold) {
        patterns.push({
          type: 'global-property',
          label: prop,
          affectedCount: count,
          totalCount: total,
          percentage: Math.round(pct * 100),
          details: `"${prop}" change detected across ${count}/${total} pages (${Math.round(pct * 100)}%)`,
        });
      }
    }

    return patterns;
  }

  // ── Terminal Output ──

  private printTable(report: {
    vlmCallCount: number;
    maxCalls: number;
    confidenceThreshold: number;
    summary: { total: number; passed_vlm: number; warned_vlm: number; failed: number };
    patterns: DetectedPattern[];
    entries: VlmReportEntry[];
  }): void {
    const actionIcon = (action: string): string => {
      switch (action) {
        case 'passed_vlm': return `${c.green}✅ Pass${c.reset}`;
        case 'warned_vlm': return `${c.yellow}⚠️  Warn${c.reset}`;
        case 'failed': return `${c.red}❌ Fail${c.reset}`;
        default: return action;
      }
    };

    const severityColor = (sev: string): string => {
      switch (sev) {
        case 'cosmetic': return `${c.green}Cosmetic${c.reset}`;
        case 'minor': return `${c.yellow}Minor${c.reset}`;
        case 'breaking': return `${c.red}Breaking${c.reset}`;
        case 'uncertain': return `${c.yellow}Uncertain${c.reset}`;
        default: return sev;
      }
    };

    // ── Build rows ──
    const rows = report.entries.map((e) => ({
      page: e.testTitle,
      severity: e.vlmSeverity || '-',
      severityColored: severityColor(e.vlmSeverity || ''),
      confidence: e.vlmConfidence != null ? e.vlmConfidence.toFixed(2) : '-',
      result: actionIcon(e.action),
      areas: (e.vlmAreas ?? []).join(', ') || this.extractAreasFromDesc(e.vlmDescription || ''),
      properties: (e.vlmChangedProperties ?? []).join(', ') || '-',
    }));

    // ── Calculate column widths (without ANSI codes) ──
    const headers = { page: 'Page', severity: 'Severity', confidence: 'Conf.', result: 'Result', areas: 'Areas', properties: 'Properties' };
    const colW = {
      page: Math.max(headers.page.length, ...rows.map((r) => r.page.length)),
      severity: Math.max(headers.severity.length, ...rows.map((r) => r.severity.length)),
      confidence: Math.max(headers.confidence.length, ...rows.map((r) => r.confidence.length)),
      result: Math.max(headers.result.length, 7), // "✅ Pass" display width
      areas: Math.min(40, Math.max(headers.areas.length, ...rows.map((r) => r.areas.length))),
      properties: Math.max(headers.properties.length, ...rows.map((r) => r.properties.length)),
    };

    const pad = (s: string, w: number) => {
      const stripped = s.replace(/\u001b\[[0-9;]*m/g, ''); // eslint-disable-line no-control-regex
      return s + ' '.repeat(Math.max(0, w - stripped.length));
    };
    const sep = `+-${'-'.repeat(colW.page)}-+-${'-'.repeat(colW.severity)}-+-${'-'.repeat(colW.confidence)}-+-${'-'.repeat(colW.result)}-+-${'-'.repeat(colW.areas)}-+-${'-'.repeat(colW.properties)}-+`;

    const headerLine = `| ${pad(headers.page, colW.page)} | ${pad(headers.severity, colW.severity)} | ${pad(headers.confidence, colW.confidence)} | ${pad(headers.result, colW.result)} | ${pad(headers.areas, colW.areas)} | ${pad(headers.properties, colW.properties)} |`;

    // ── Print ──
    console.log('');
    console.log(`  ${c.bold}VLM Visual Regression Report${c.reset}  ${c.dim}(VLM calls: ${report.vlmCallCount}/${report.maxCalls}, confidence threshold: ${report.confidenceThreshold})${c.reset}`);
    console.log(sep);
    console.log(headerLine);
    console.log(sep);
    for (const r of rows) {
      const truncAreas = r.areas.length > colW.areas ? r.areas.slice(0, colW.areas - 1) + '…' : r.areas;
      console.log(`| ${pad(r.page, colW.page)} | ${pad(r.severityColored, colW.severity)} | ${pad(r.confidence, colW.confidence)} | ${pad(r.result, colW.result)} | ${pad(truncAreas, colW.areas)} | ${pad(r.properties, colW.properties)} |`);
    }
    console.log(sep);

    // Summary row
    const { summary } = report;
    console.log(`  Total: ${summary.total}  |  ${c.green}✅ Passed: ${summary.passed_vlm}${c.reset}  |  ${c.yellow}⚠️  Warned: ${summary.warned_vlm}${c.reset}  |  ${c.red}❌ Failed: ${summary.failed}${c.reset}`);

    // Pattern detection summary
    if (report.patterns.length > 0) {
      console.log('');
      console.log(`  ${c.cyan}${c.bold}🔍 Detected Patterns:${c.reset}`);
      for (const p of report.patterns) {
        const icon = p.type === 'global-area' ? '📍' : '🎨';
        console.log(`    ${icon} ${p.details}`);
      }
    }

    console.log('');
  }

  // ── Extraction Helpers ──

  /** Find the first attachment matching a prefix */
  private findAttachment(paths: Record<string, string>, prefix: string): string | undefined {
    for (const [name, path] of Object.entries(paths)) {
      if (name.startsWith(prefix)) return path;
    }
    return undefined;
  }

  /** Extract areas from annotation description — matches `(areas: x, y, z)` format */
  private extractAreas(description: string): string[] {
    const match = description.match(/\(areas:\s*([^)]+)\)/);
    if (match) {
      return match[1].split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }

  /** Extract changedProperties from annotation description — matches `(changedProperties: x, y)` format */
  private extractChangedProperties(description: string): string[] {
    const match = description.match(/\(changedProperties:\s*([^)]+)\)/);
    if (match) {
      return match[1].split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }

  /** Extract areas from VLM description when vlmAreas is not populated */
  private extractAreasFromDesc(description: string): string {
    const areaKeywords = ['navbar', 'hero', 'footer', 'background', 'button', 'card', 'header', 'sidebar', 'tab', 'link', 'icon', 'image', 'text', 'form'];
    const lower = description.toLowerCase();
    return areaKeywords.filter((k) => lower.includes(k)).join(', ') || '-';
  }

  private extractScreenshotName(description: string): string {
    return description.split(']')[1]?.trim().split(' ')[0] || 'unknown';
  }

  private extractSeverity(annotationType: string): string {
    const map: Record<string, string> = {
      'vlm-override': 'cosmetic',
      'vlm-warning': 'minor',
      'vlm-breaking': 'breaking',
      'vlm-low-confidence': 'uncertain',
    };
    return map[annotationType] || 'unknown';
  }

  private extractRecommendation(annotationType: string): string {
    const map: Record<string, string> = {
      'vlm-override': 'pass',
      'vlm-warning': 'warn',
      'vlm-breaking': 'fail',
      'vlm-low-confidence': 'fail',
    };
    return map[annotationType] || 'fail';
  }

  private extractConfidence(description: string): number | undefined {
    const match = description.match(/confidence:\s*([\d.]+)/);
    return match ? parseFloat(match[1]) : undefined;
  }

  private annotationTypeToAction(annotationType: string): string {
    const map: Record<string, string> = {
      'vlm-override': 'passed_vlm',
      'vlm-warning': 'warned_vlm',
      'vlm-breaking': 'failed',
      'vlm-low-confidence': 'failed',
    };
    return map[annotationType] || 'failed';
  }
}
