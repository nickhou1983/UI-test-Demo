import { dirname, extname, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

interface HtmlReportEntry {
  testTitle: string;
  severity: string;
  confidence: number | null;
  areas: string[];
  changedProperties: string[];
  baselinePath?: string;
  actualPath?: string;
  diffPath?: string;
}

export default class VlmHtmlReporter implements Reporter {
  private entries: HtmlReportEntry[] = [];
  private outputDir = '';
  private inlineImages = process.env.VLM_REPORT_INLINE === 'true';

  onBegin(config: FullConfig, _suite: Suite): void {
    this.outputDir = config.configFile ? dirname(config.configFile) : config.rootDir;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const attachmentPaths: Record<string, string> = {};
    for (const attachment of result.attachments) {
      if (attachment.path && attachment.name.startsWith('vlm-')) {
        attachmentPaths[attachment.name] = attachment.path;
      }
    }

    for (const annotation of result.annotations) {
      if (!['vlm-override', 'vlm-warning', 'vlm-breaking', 'vlm-low-confidence'].includes(annotation.type)) {
        continue;
      }

      const description = annotation.description || '';
      this.entries.push({
        testTitle: test.title,
        severity: this.mapSeverity(annotation.type),
        confidence: this.extractConfidence(description),
        areas: this.extractList(description, 'areas'),
        changedProperties: this.extractList(description, 'changedProperties'),
        baselinePath: this.findAttachment(attachmentPaths, 'vlm-baseline-'),
        actualPath: this.findAttachment(attachmentPaths, 'vlm-actual-'),
        diffPath: this.findAttachment(attachmentPaths, 'vlm-diff-'),
      });
    }
  }

  onEnd(_result: FullResult): void {
    if (this.entries.length === 0) {
      return;
    }

    const reportPath = join(this.outputDir, 'vlm-visual-report.html');
    writeFileSync(reportPath, this.buildHtml(), 'utf-8');
    console.log(`[VLM HTML Reporter] Report written to: ${reportPath}`);
  }

  private buildHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VLM Visual Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 24px; }
    h1 { margin: 0 0 16px; }
    .entry { background: #111827; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #1e293b; margin-bottom: 10px; }
    .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 12px; }
    img { width: 100%; border-radius: 8px; border: 1px solid #475569; }
    .tags { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
    .tag { padding: 2px 8px; border-radius: 999px; background: #1e293b; color: #67e8f9; font-size: 12px; }
  </style>
</head>
<body>
  <h1>VLM Visual Report</h1>
  ${this.entries
    .map(
      (entry) => `<section class="entry">
        <div class="badge">${this.escape(entry.severity)}${entry.confidence != null ? ` · confidence ${Math.round(entry.confidence * 100)}%` : ''}</div>
        <h2>${this.escape(entry.testTitle)}</h2>
        <div class="tags">${entry.areas.map((area) => `<span class="tag">${this.escape(area)}</span>`).join('')}${entry.changedProperties.map((property) => `<span class="tag">${this.escape(property)}</span>`).join('')}</div>
        <div class="screenshots">
          ${this.renderImage(entry.baselinePath, 'Baseline')}
          ${this.renderImage(entry.actualPath, 'Actual')}
          ${this.renderImage(entry.diffPath, 'Diff')}
        </div>
      </section>`,
    )
    .join('')}
</body>
</html>`;
  }

  private renderImage(filePath: string | undefined, label: string): string {
    if (!filePath) {
      return '';
    }

    return `<figure><figcaption>${this.escape(label)}</figcaption><img src="${this.inlineImages ? this.toDataUri(filePath) : `file://${filePath}`}" alt="${this.escape(label)}" /></figure>`;
  }

  private toDataUri(filePath: string): string {
    if (!existsSync(filePath)) {
      return '';
    }

    const mime = extname(filePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${readFileSync(filePath).toString('base64')}`;
  }

  private findAttachment(paths: Record<string, string>, prefix: string): string | undefined {
    for (const [name, path] of Object.entries(paths)) {
      if (name.startsWith(prefix)) {
        return path;
      }
    }
    return undefined;
  }

  private extractConfidence(description: string): number | null {
    const match = description.match(/confidence:\s*([\d.]+)/);
    return match ? Number.parseFloat(match[1]) : null;
  }

  private extractList(description: string, key: string): string[] {
    const match = description.match(new RegExp(`\\(${key}:\\s*([^)]+)\\)`));
    return match ? match[1].split(',').map((item) => item.trim()).filter(Boolean) : [];
  }

  private mapSeverity(type: string): string {
    return {
      'vlm-override': 'cosmetic',
      'vlm-warning': 'minor',
      'vlm-breaking': 'breaking',
      'vlm-low-confidence': 'uncertain',
    }[type] || 'unknown';
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}