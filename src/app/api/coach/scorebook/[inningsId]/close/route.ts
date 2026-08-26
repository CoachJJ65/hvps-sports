import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { loadScorebook, syncFixtureCricketScore } from '@/lib/scorebook';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ inningsId: string }> }
) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;
  const { inningsId } = await params;

  const innings = await db.cricketInnings.findUnique({
    where: { id: inningsId },
  });
  if (!innings) return jsonError('Innings not found', 404);

  await db.cricketInnings.update({
    where: { id: inningsId },
    data: { closed: true },
  });
  await syncFixtureCricketScore(innings.fixture_id);
  return NextResponse.json(await loadScorebook(innings.fixture_id));
}
