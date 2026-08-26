import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError } from '@/lib/roles';
import { serializeSelection } from '@/lib/sports';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  try {
    const selections = await db.selection.findMany({
      where: { fixture_id: fixtureId },
      include: { player: true },
    });
    return NextResponse.json(selections.map(serializeSelection));
  } catch {
    return jsonError('Failed to fetch selections', 500);
  }
}
