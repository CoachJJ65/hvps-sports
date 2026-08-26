import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { loadScorebook } from '@/lib/scorebook';
import { setStrikeSchema } from '@/lib/validations';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ inningsId: string }> }
) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;
  const { inningsId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = setStrikeSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid strike update');

  const innings = await db.cricketInnings.findUnique({
    where: { id: inningsId },
  });
  if (!innings) return jsonError('Innings not found', 404);

  await db.cricketInnings.update({
    where: { id: inningsId },
    data: {
      ...(parsed.data.strikerId ? { striker_id: parsed.data.strikerId } : {}),
      ...(parsed.data.nonStrikerId
        ? { non_striker_id: parsed.data.nonStrikerId }
        : {}),
      ...(parsed.data.bowlerId
        ? { current_bowler_id: parsed.data.bowlerId }
        : {}),
    },
  });

  return NextResponse.json(await loadScorebook(innings.fixture_id));
}
