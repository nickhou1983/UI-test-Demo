/**
 * VLM Visual Regression Reviewer
 *
 * Canonical source: .github/skills/playwright-vlm/templates/utils/vlm-reviewer.ts
 *
 * Sends baseline + actual screenshots to Azure OpenAI GPT-4o vision
 * for semantic-level visual diff analysis. Used as a "smart noise filter"
 * when pixel-level comparison fails.
 */

import { readFileSync } from 'fs';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import { VLM_SYSTEM_PROMPT, buildUserPrompt, type VlmPromptContext } from './vlm-prompts';

export type VlmChangedProperty = 'color' | 'layout' | 'typography' | 'spacing' | 'visibility' | 'content' | 'image' | 'animation';

export interface VlmReviewResult {
  severity: 'none' | 'cosmetic' | 'minor' | 'breaking';
  description: string;
  areas: string[];
  changedProperties: VlmChangedProperty[];
  recommendation: 'pass' | 'warn' | 'fail';
  confidence: number;
}

export interface VlmReviewOptions extends VlmPromptContext {
  /** Azure OpenAI endpoint (overrides env) */
  endpoint?: string;
  /** Azure OpenAI API key (overrides env, skips Entra ID if set) */
  apiKey?: string;
  /** Deployment name for GPT-4o (default: "gpt-4o") */
  deploymentName?: string;
  /** API version (default: "2024-12-01-preview") */
  apiVersion?: string;
  /** Max tokens for response (default: 1024) */
  maxTokens?: number;
}

/** Global call counter for cost control */
let vlmCallCount = 0;
const VLM_MAX_CALLS = Number(process.env.VLM_MAX_CALLS) || 10;

export function getVlmCallCount(): number {
  return vlmCallCount;
}

export function resetVlmCallCount(): void {
  vlmCallCount = 0;
}

function imageToBase64DataUrl(filePath: string): string {
  const buffer = readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return `data:image/png;base64,${base64}`;
}

function createAzureClient(options: VlmReviewOptions): AzureOpenAI {
  const endpoint = options.endpoint || process.env.AZURE_OPENAI_ENDPOINT;
  if (!endpoint) {
    throw new Error(
      'Azure OpenAI endpoint not configured. Set AZURE_OPENAI_ENDPOINT env var or pass endpoint option.',
    );
  }

  const apiKey = options.apiKey || process.env.AZURE_OPENAI_API_KEY;
  const deployment = options.deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const apiVersion = options.apiVersion || '2024-12-01-preview';

  if (apiKey) {
    return new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });
  }

  // Use DefaultAzureCredential (Entra ID) — consistent with playwright.service.config.ts
  const credential = new DefaultAzureCredential();
  const scope = 'https://cognitiveservices.azure.com/.default';
  const azureADTokenProvider = getBearerTokenProvider(credential, scope);
  return new AzureOpenAI({ endpoint, azureADTokenProvider, deployment, apiVersion });
}

function parseVlmResponse(content: string): VlmReviewResult {
  // Strip markdown code fences if present
  const cleaned = content.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim();

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  const validSeverities = ['none', 'cosmetic', 'minor', 'breaking'];
  const validRecommendations = ['pass', 'warn', 'fail'];

  if (!validSeverities.includes(parsed.severity)) {
    throw new Error(`Invalid severity: ${parsed.severity}`);
  }
  if (!validRecommendations.includes(parsed.recommendation)) {
    throw new Error(`Invalid recommendation: ${parsed.recommendation}`);
  }
  if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
    throw new Error(`Invalid confidence: ${parsed.confidence}`);
  }

  const validProperties: VlmChangedProperty[] = ['color', 'layout', 'typography', 'spacing', 'visibility', 'content', 'image', 'animation'];
  const changedProperties: VlmChangedProperty[] = Array.isArray(parsed.changedProperties)
    ? parsed.changedProperties.filter((p: string) => validProperties.includes(p as VlmChangedProperty))
    : [];

  return {
    severity: parsed.severity,
    description: String(parsed.description || ''),
    areas: Array.isArray(parsed.areas) ? parsed.areas.map(String) : [],
    changedProperties,
    recommendation: parsed.recommendation,
    confidence: parsed.confidence,
  };
}

/**
 * Review a visual diff by sending baseline + actual screenshots to Azure OpenAI GPT-4o.
 *
 * Returns a structured verdict with severity, description, and recommendation.
 * Throws if API call fails or response cannot be parsed.
 */
export async function reviewVisualDiff(
  baselinePath: string,
  actualPath: string,
  options: VlmReviewOptions,
): Promise<VlmReviewResult> {
  // Cost control: enforce max calls per run
  if (vlmCallCount >= VLM_MAX_CALLS) {
    throw new Error(
      `VLM call limit reached (${VLM_MAX_CALLS}). Skipping review to control costs. ` +
        'Set VLM_MAX_CALLS env var to increase the limit.',
    );
  }
  vlmCallCount++;

  const client = createAzureClient(options);
  const baselineDataUrl = imageToBase64DataUrl(baselinePath);
  const actualDataUrl = imageToBase64DataUrl(actualPath);
  const userPrompt = buildUserPrompt(options);

  const response = await client.chat.completions.create({
    model: options.deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
    max_completion_tokens: options.maxTokens || 1024,
    temperature: 0.1, // Low temperature for consistent judgments
    messages: [
      { role: 'system', content: VLM_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: baselineDataUrl, detail: 'high' } },
          { type: 'image_url', image_url: { url: actualDataUrl, detail: 'high' } },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Azure OpenAI');
  }

  const result = parseVlmResponse(content);

  // Attach token usage for cost tracking
  (result as VlmReviewResult & { usage?: typeof response.usage }).usage = response.usage;

  return result;
}

/**
 * Check if VLM review is enabled via environment variable.
 */
export function isVlmEnabled(): boolean {
  return process.env.VLM_REVIEW === 'true';
}

/**
 * Check if VLM credentials are available.
 */
export function hasVlmCredentials(): boolean {
  return !!(
    process.env.AZURE_OPENAI_ENDPOINT &&
    (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_CLIENT_ID)
  );
}
