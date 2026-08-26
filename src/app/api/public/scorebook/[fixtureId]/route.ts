import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/roles';
import { loadScorebook } from '@/lib/scorebook';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  try {
    const book = await loadScorebook(fixtureId);
    if (!book) return jsonError('Fixture not found', 404);
    return NextResponse.json(book);
  } catch {
    return jsonError('Failed to load scorebook', 500);
  }
}
