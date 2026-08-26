import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import {
  AI_PROVIDER,
  grokModel,
  grokModelName,
  isGrokConfigured,
} from '@/lib/ai';
import { grokChatSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isGrokConfigured()) {
    return NextResponse.json(
      {
        error: 'Grok is not configured. Set XAI_API_KEY on the server.',
        provider: AI_PROVIDER,
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = grokChatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const model = grokModelName();
    const { text } = await generateText({
      model: grokModel(),
      prompt: parsed.data.prompt,
    });

    return NextResponse.json({
      provider: AI_PROVIDER,
      model,
      text,
    });
  } catch {
    console.error('Grok request failed');
    return NextResponse.json(
      {
        error: 'Grok request failed',
        provider: AI_PROVIDER,
      },
      { status: 502 }
    );
  }
}
