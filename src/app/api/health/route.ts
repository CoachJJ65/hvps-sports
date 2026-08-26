import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'hvps-sports',
    time: new Date().toISOString(),
  });
}
