import { readFileSync } from 'fs';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import { AzureOpenAI } from 'openai';
import { VLM_SYSTEM_PROMPT, buildUserPrompt, type VlmPromptContext } from './vlm-prompts';

export type VlmChangedProperty =
  | 'color'
  | 'layout'
  | 'typography'
  | 'spacing'
  | 'visibility'
  | 'content'
  | 'image'
  | 'animation';

export interface VlmReviewResult {
  severity: 'none' | 'cosmetic' | 'minor' | 'breaking';
  description: string;
  areas: string[];
  changedProperties: VlmChangedProperty[];
  recommendation: 'pass' | 'warn' | 'fail';
  confidence: number;
}

export interface VlmReviewOptions extends VlmPromptContext {
  endpoint?: string;
  apiKey?: string;
  deploymentName?: string;
  apiVersion?: string;
  maxTokens?: number;
}

let vlmCallCount = 0;
const VLM_MAX_CALLS = Number(process.env.VLM_MAX_CALLS) || 10;

export function getVlmCallCount(): number {
  return vlmCallCount;
}

export function resetVlmCallCount(): void {
  vlmCallCount = 0;
}

function imageToBase64DataUrl(filePath: string): string {
  return `data:image/png;base64,${readFileSync(filePath).toString('base64')}`;
}

function createAzureClient(options: VlmReviewOptions): AzureOpenAI {
  const endpoint = options.endpoint || process.env.AZURE_OPENAI_ENDPOINT;
  if (!endpoint) {
    throw new Error('Azure OpenAI endpoint is not configured.');
  }

  const apiKey = options.apiKey || process.env.AZURE_OPENAI_API_KEY;
  const deployment = options.deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const apiVersion = options.apiVersion || '2024-12-01-preview';

  if (apiKey) {
    return new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });
  }

  const credential = new DefaultAzureCredential();
  const azureADTokenProvider = getBearerTokenProvider(
    credential,
    'https://cognitiveservices.azure.com/.default',
  );
  return new AzureOpenAI({ endpoint, azureADTokenProvider, deployment, apiVersion });
}

function parseVlmResponse(content: string): VlmReviewResult {
  const cleaned = content
    .replace(/^```(?:json)?\s*\n?/m, '')
    .replace(/\n?```\s*$/m, '')
    .trim();
  const parsed = JSON.parse(cleaned);
  const validProperties: VlmChangedProperty[] = [
    'color',
    'layout',
    'typography',
    'spacing',
    'visibility',
    'content',
    'image',
    'animation',
  ];

  return {
    severity: parsed.severity,
    description: String(parsed.description || ''),
    areas: Array.isArray(parsed.areas) ? parsed.areas.map(String) : [],
    changedProperties: Array.isArray(parsed.changedProperties)
      ? parsed.changedProperties.filter((value: string) =>
          validProperties.includes(value as VlmChangedProperty),
        )
      : [],
    recommendation: parsed.recommendation,
    confidence: parsed.confidence,
  };
}

export async function reviewVisualDiff(
  baselinePath: string,
  actualPath: string,
  options: VlmReviewOptions,
): Promise<VlmReviewResult> {
  if (vlmCallCount >= VLM_MAX_CALLS) {
    throw new Error(`VLM call limit reached (${VLM_MAX_CALLS}).`);
  }
  vlmCallCount += 1;

  const client = createAzureClient(options);
  const response = await client.chat.completions.create({
    model: options.deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
    max_completion_tokens: options.maxTokens || 1024,
    temperature: 0.1,
    messages: [
      { role: 'system', content: VLM_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: buildUserPrompt(options) },
          { type: 'image_url', image_url: { url: imageToBase64DataUrl(baselinePath), detail: 'high' } },
          { type: 'image_url', image_url: { url: imageToBase64DataUrl(actualPath), detail: 'high' } },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Azure OpenAI returned an empty response.');
  }

  return parseVlmResponse(content);
}

export function isVlmEnabled(): boolean {
  return process.env.VLM_REVIEW === 'true';
}

export function hasVlmCredentials(): boolean {
  return Boolean(process.env.AZURE_OPENAI_ENDPOINT && (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_CLIENT_ID || process.env.AZURE_TENANT_ID));
}