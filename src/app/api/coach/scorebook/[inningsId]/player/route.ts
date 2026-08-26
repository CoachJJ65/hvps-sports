import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { inningsInclude, loadScorebook } from '@/lib/scorebook';
import { addCricketPlayerSchema } from '@/lib/validations';

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

  const parsed = addCricketPlayerSchema.safeParse(body);
  if (!parsed.success) return jsonError('Name is required');

  const innings = await db.cricketInnings.findUnique({
    where: { id: inningsId },
    include: inningsInclude,
  });
  if (!innings) return jsonError('Innings not found', 404);

  if (parsed.data.role === 'BATTER') {
    const order =
      Math.max(0, ...innings.batters.map((batter) => batter.batting_order)) + 1;
    await db.cricketBatter.create({
      data: {
        innings_id: innings.id,
        name: parsed.data.name,
        player_id: parsed.data.playerId ?? null,
        batting_order: order,
        how_out: 'NOT_OUT',
      },
    });
  } else {
    const order =
      Math.max(0, ...innings.bowlers.map((bowler) => bowler.bowling_order)) + 1;
    const bowler = await db.cricketBowler.create({
      data: {
        innings_id: innings.id,
        name: parsed.data.name,
        player_id: parsed.data.playerId ?? null,
        bowling_order: order,
      },
    });
    if (innings.deliveries.length > 0) {
      const legal = innings.deliveries.filter((d) => d.is_legal).length;
      if (legal > 0 && legal % 6 === 0) {
        await db.cricketInnings.update({
          where: { id: innings.id },
          data: { current_bowler_id: bowler.id },
        });
      }
    }
  }

  return NextResponse.json(await loadScorebook(innings.fixture_id));
}
