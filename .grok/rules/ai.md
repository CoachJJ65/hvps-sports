# AI — Grok only

All AI/LLM features in HVPS Sports MUST use xAI Grok.

- Env: `XAI_API_KEY` (server-side only, never in the browser bundle)
- Base URL: `https://api.x.ai/v1`
- Default model: `grok-4.6` (override with `XAI_MODEL` if needed)
- Call site: `src/lib/ai.ts` and `src/app/api/ai/*`

Do not add OpenAI, Anthropic, Gemini, or any other model provider. Do not call an LLM from client components.
