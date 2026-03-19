/**
 * VLM Visual Review Reporter
 *
 * Canonical source: .github/skills/playwright-vlm/templates/utils/vlm-reporter.ts
 *
 * Custom Playwright reporter that collects VLM review results
 * and generates a JSON report file at the end of the test run.
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
  vlmRecommendation?: string;
  vlmConfidence?: number;
  vlmError?: string;
  action: string;
}

export default class VlmReporter implements Reporter {
  private entries: VlmReportEntry[] = [];
  private outputDir: string = '';
  private vlmCallCount = 0;

  onBegin(config: FullConfig, _suite: Suite): void { // eslint-disable-line @typescript-eslint/no-unused-vars
    this.outputDir = config.configFile ? dirname(config.configFile) : config.rootDir;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // Extract VLM annotations from test results
    for (const annotation of result.annotations) {
      if (
        annotation.type === 'vlm-override' ||
        annotation.type === 'vlm-warning' ||
        annotation.type === 'vlm-breaking' ||
        annotation.type === 'vlm-low-confidence'
      ) {
        this.vlmCallCount++;
        this.entries.push({
          testTitle: test.title,
          testFile: test.location.file,
          screenshotName: this.extractScreenshotName(annotation.description || ''),
          pixelDiffFailed: true,
          vlmSeverity: this.extractSeverity(annotation.type),
          vlmDescription: annotation.description || '',
          vlmAreas: this.extractAreas(annotation.description || ''),
          vlmRecommendation: this.extractRecommendation(annotation.type),
          vlmConfidence: this.extractConfidence(annotation.description || ''),
          action: this.annotationTypeToAction(annotation.type),
        });
      }
    }
  }

  onEnd(result: FullResult): void {
    const report = {
      generatedAt: new Date().toISOString(),
      testRunStatus: result.status,
      vlmEnabled: process.env.VLM_REVIEW === 'true',
      vlmCallCount: this.vlmCallCount,
      maxCalls: Number(process.env.VLM_MAX_CALLS) || 10,
      confidenceThreshold: Number(process.env.VLM_CONFIDENCE_THRESHOLD) || 0.7,
      summary: {
        total: this.entries.length,
        passed_vlm: this.entries.filter((e) => e.action === 'passed_vlm').length,
        warned_vlm: this.entries.filter((e) => e.action === 'warned_vlm').length,
        failed: this.entries.filter((e) => e.action === 'failed').length,
      },
      entries: this.entries,
    };

    const reportPath = join(this.outputDir, 'vlm-review-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n[VLM Reporter] Report written to: ${reportPath}`);

    if (this.entries.length > 0) {
      this.printTable(report);
    } else {
      console.log(`[VLM Reporter] No VLM reviews triggered (all pixel comparisons passed or VLM disabled).`);
    }
  }

  private printTable(report: {
    vlmCallCount: number;
    maxCalls: number;
    confidenceThreshold: number;
    summary: { total: number; passed_vlm: number; warned_vlm: number; failed: number };
    entries: VlmReportEntry[];
  }): void {
    const actionIcon: Record<string, string> = {
      passed_vlm: '✅ Pass',
      warned_vlm: '⚠️  Warn',
      failed: '❌ Fail',
    };

    const severityLabel: Record<string, string> = {
      cosmetic: 'Cosmetic',
      minor: 'Minor',
      breaking: 'Breaking',
      uncertain: 'Uncertain',
    };

    // ── Build rows ──
    const rows = report.entries.map((e) => ({
      page: e.testTitle,
      severity: severityLabel[e.vlmSeverity || ''] || e.vlmSeverity || '-',
      confidence: e.vlmConfidence != null ? e.vlmConfidence.toFixed(2) : '-',
      result: actionIcon[e.action] || e.action,
      areas: (e.vlmAreas ?? []).join(', ') || this.extractAreasFromDesc(e.vlmDescription || ''),
    }));

    // ── Calculate column widths ──
    const headers = { page: 'Page', severity: 'Severity', confidence: 'Conf.', result: 'Result', areas: 'Affected Areas' };
    const colW = {
      page: Math.max(headers.page.length, ...rows.map((r) => r.page.length)),
      severity: Math.max(headers.severity.length, ...rows.map((r) => r.severity.length)),
      confidence: Math.max(headers.confidence.length, ...rows.map((r) => r.confidence.length)),
      result: Math.max(headers.result.length, ...rows.map((r) => this.displayWidth(r.result))),
      areas: Math.max(headers.areas.length, ...rows.map((r) => r.areas.length)),
    };

    const pad = (s: string, w: number) => s + ' '.repeat(Math.max(0, w - this.displayWidth(s)));
    const sep = `+-${'-'.repeat(colW.page)}-+-${'-'.repeat(colW.severity)}-+-${'-'.repeat(colW.confidence)}-+-${'-'.repeat(colW.result)}-+-${'-'.repeat(colW.areas)}-+`;

    const headerLine = `| ${pad(headers.page, colW.page)} | ${pad(headers.severity, colW.severity)} | ${pad(headers.confidence, colW.confidence)} | ${pad(headers.result, colW.result)} | ${pad(headers.areas, colW.areas)} |`;

    // ── Print ──
    console.log('');
    console.log(`  VLM Visual Regression Report  (VLM calls: ${report.vlmCallCount}/${report.maxCalls}, confidence threshold: ${report.confidenceThreshold})`);
    console.log(sep);
    console.log(headerLine);
    console.log(sep);
    for (const r of rows) {
      console.log(`| ${pad(r.page, colW.page)} | ${pad(r.severity, colW.severity)} | ${pad(r.confidence, colW.confidence)} | ${pad(r.result, colW.result)} | ${pad(r.areas, colW.areas)} |`);
    }
    console.log(sep);

    // Summary row
    const { summary } = report;
    console.log(`  Total: ${summary.total}  |  ✅ Passed: ${summary.passed_vlm}  |  ⚠️  Warned: ${summary.warned_vlm}  |  ❌ Failed: ${summary.failed}`);
    console.log('');
  }

  /** Approximate display width — simple length for alignment */
  private displayWidth(s: string): number {
    return s.length;
  }

  /** Extract areas from annotation description — matches `(areas: x, y, z)` format */
  private extractAreas(description: string): string[] {
    const match = description.match(/\(areas:\s*([^)]+)\)/);
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
    // Try to extract screenshot name from description, fallback to test title
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
