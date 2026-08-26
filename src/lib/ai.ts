import { xai } from '@ai-sdk/xai';

export const AI_PROVIDER = 'xai' as const;
export const GROK_BASE_URL = 'https://api.x.ai/v1';
export const DEFAULT_GROK_MODEL = 'grok-4.6';

export function grokModelName(): string {
  return process.env.XAI_MODEL?.trim() || DEFAULT_GROK_MODEL;
}

export function isGrokConfigured(): boolean {
  return Boolean(process.env.XAI_API_KEY?.trim());
}

export function requireGrokApiKey(): string {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'XAI_API_KEY is not set. Add it to .env (server-side only). Get a key at https://console.x.ai'
    );
  }
  return key;
}

/** The only LLM model this app is allowed to call. */
export function grokModel() {
  requireGrokApiKey();
  return xai.responses(grokModelName());
}
