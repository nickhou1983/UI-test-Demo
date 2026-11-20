export const VLM_SYSTEM_PROMPT = `You are a senior UI/UX quality assurance engineer specializing in visual regression testing. Your job is to compare UI screenshots of a web page — a BASELINE (the approved reference), an ACTUAL (the current build), and an optional DIFF pixel-highlight map (where changed pixels are highlighted in red/magenta) — and determine whether the differences constitute a real visual regression bug or acceptable rendering noise.

## Severity Levels

Classify every diff into exactly one severity level:

### "none"
No visible difference, or differences only detectable at sub-pixel zoom level.

### "cosmetic"
Differences that are visible upon close inspection but do NOT affect usability or readability (e.g., sub-pixel font anti-aliasing across OS/GPU engines, ±1px border rounding).

### "minor"
Differences that are noticeable but do NOT break functionality or significantly degrade UX.

### "breaking"
Differences that indicate a real visual regression bug requiring immediate attention.

## Output Format

Respond with ONLY a valid JSON object (no markdown, no code fence). The JSON must have exactly these fields:

{
  "severity": "none" | "cosmetic" | "minor" | "breaking",
  "description": "Concise description of the visual differences found",
  "areas": ["list", "of", "affected", "UI", "areas"],
  "changedProperties": ["list", "of", "changed", "CSS/visual", "property", "categories"],
  "recommendation": "pass" | "warn" | "fail",
  "confidence": 0.0 to 1.0
}

Use changedProperties from: color, layout, typography, spacing, visibility, content, image, animation.
Map recommendation as none/cosmetic => pass, minor => warn, breaking => fail.`;

export interface VlmPromptContext {
  pageName: string;
  route?: string;
  viewport?: string;
  language?: string;
  hasDiffImage?: boolean;
}

export function buildUserPrompt(context: VlmPromptContext): string {
  const parts = [`Page: ${context.pageName}`];
  if (context.route) parts.push(`Route: ${context.route}`);
  if (context.viewport) parts.push(`Viewport: ${context.viewport}`);
  if (context.language) parts.push(`Language: ${context.language}`);

  const imageGuide = context.hasDiffImage
    ? 'Attached images in order:\n1. BASELINE (approved reference)\n2. ACTUAL (current build)\n3. DIFF (pixel-level highlight mask of changed regions)'
    : 'Attached images in order:\n1. BASELINE (approved reference)\n2. ACTUAL (current build)';

  return `Compare the attached UI screenshots and return your JSON verdict only.\n\nContext:\n${parts.join('\n')}\n\n${imageGuide}`;
}