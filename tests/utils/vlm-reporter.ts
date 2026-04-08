import { dirname, join } from 'path';
import { writeFileSync } from 'fs';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

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
  action: string;
  baselinePath?: string;
  actualPath?: string;
  diffPath?: string;
}

export default class VlmReporter implements Reporter {
  private entries: VlmReportEntry[] = [];
  private outputDir = '';
  private vlmCallCount = 0;

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
      this.vlmCallCount += 1;
      this.entries.push({
        testTitle: test.title,
        testFile: test.location.file,
        screenshotName: this.extractScreenshotName(description),
        pixelDiffFailed: true,
        vlmSeverity: this.extractSeverity(annotation.type),
        vlmDescription: description,
        vlmAreas: this.extractList(description, 'areas'),
        vlmChangedProperties: this.extractList(description, 'changedProperties'),
        vlmRecommendation: this.extractRecommendation(annotation.type),
        vlmConfidence: this.extractConfidence(description),
        action: this.annotationTypeToAction(annotation.type),
        baselinePath: this.findAttachment(attachmentPaths, 'vlm-baseline-'),
        actualPath: this.findAttachment(attachmentPaths, 'vlm-actual-'),
        diffPath: this.findAttachment(attachmentPaths, 'vlm-diff-'),
      });
    }
  }

  onEnd(result: FullResult): void {
    const reportPath = join(this.outputDir, 'vlm-review-report.json');
    const report = {
      generatedAt: new Date().toISOString(),
      testRunStatus: result.status,
      vlmEnabled: process.env.VLM_REVIEW === 'true',
      vlmCallCount: this.vlmCallCount,
      maxCalls: Number(process.env.VLM_MAX_CALLS) || 10,
      confidenceThreshold: Number(process.env.VLM_CONFIDENCE_THRESHOLD) || 0.7,
      summary: {
        total: this.entries.length,
        passed_vlm: this.entries.filter((entry) => entry.action === 'passed_vlm').length,
        warned_vlm: this.entries.filter((entry) => entry.action === 'warned_vlm').length,
        failed: this.entries.filter((entry) => entry.action === 'failed').length,
      },
      entries: this.entries,
    };

    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`[VLM Reporter] Report written to: ${reportPath}`);
  }

  private findAttachment(paths: Record<string, string>, prefix: string): string | undefined {
    for (const [name, path] of Object.entries(paths)) {
      if (name.startsWith(prefix)) return path;
    }
    return undefined;
  }

  private extractList(description: string, key: string): string[] {
    const match = description.match(new RegExp(`\\(${key}:\\s*([^)]+)\\)`));
    return match ? match[1].split(',').map((item) => item.trim()).filter(Boolean) : [];
  }

  private extractScreenshotName(description: string): string {
    const match = description.match(/^\[([^\]]+)\]/);
    return match?.[1] || 'unknown';
  }

  private extractSeverity(annotationType: string): string {
    return {
      'vlm-override': 'cosmetic',
      'vlm-warning': 'minor',
      'vlm-breaking': 'breaking',
      'vlm-low-confidence': 'uncertain',
    }[annotationType] || 'unknown';
  }

  private extractRecommendation(annotationType: string): string {
    return {
      'vlm-override': 'pass',
      'vlm-warning': 'warn',
      'vlm-breaking': 'fail',
      'vlm-low-confidence': 'fail',
    }[annotationType] || 'fail';
  }

  private extractConfidence(description: string): number | undefined {
    const match = description.match(/confidence:\s*([\d.]+)/);
    return match ? Number.parseFloat(match[1]) : undefined;
  }

  private annotationTypeToAction(annotationType: string): string {
    return {
      'vlm-override': 'passed_vlm',
      'vlm-warning': 'warned_vlm',
      'vlm-breaking': 'failed',
      'vlm-low-confidence': 'failed',
    }[annotationType] || 'failed';
  }
}