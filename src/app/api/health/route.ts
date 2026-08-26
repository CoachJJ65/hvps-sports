import { NextResponse } from 'next/server';
import { AI_PROVIDER, grokModelName, isGrokConfigured } from '@/lib/ai';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'hvps-sports',
    time: new Date().toISOString(),
    ai: {
      provider: AI_PROVIDER,
      model: grokModelName(),
      configured: isGrokConfigured(),
    },
  });
}
