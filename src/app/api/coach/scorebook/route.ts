import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isCricketSport } from '@/lib/cricket';
import { jsonError, requireRole, STAFF_ROLES } from '@/lib/roles';
import { inningsInclude, loadScorebook, syncFixtureCricketScore } from '@/lib/scorebook';
import { startInningsSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const { session, error } = await requireRole(STAFF_ROLES);
  if (error || !session) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const parsed = startInningsSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Striker, non-striker, and bowler are required');
  }

  const fixture = await db.fixture.findUnique({
    where: { id: parsed.data.fixtureId },
    include: { team: { include: { sport: true } } },
  });
  if (!fixture) return jsonError('Fixture not found', 404);
  if (!isCricketSport(fixture.team.sport.name)) {
    return jsonError('Scorebook is only for cricket fixtures');
  }

  const existing = await db.cricketInnings.findUnique({
    where: {
      fixture_id_batting_side_innings_number: {
        fixture_id: fixture.id,
        batting_side: parsed.data.battingSide,
        innings_number: 1,
      },
    },
  });
  if (existing) {
    const book = await loadScorebook(fixture.id);
    return NextResponse.json(book);
  }

  const innings = await db.cricketInnings.create({
    data: {
      fixture_id: fixture.id,
      batting_side: parsed.data.battingSide,
      innings_number: 1,
      overs_limit: parsed.data.oversLimit ?? 20,
    },
  });

  const striker = await db.cricketBatter.create({
    data: {
      innings_id: innings.id,
      name: parsed.data.striker.name,
      player_id: parsed.data.striker.playerId ?? null,
      batting_order: 1,
      how_out: 'NOT_OUT',
    },
  });
  const nonStriker = await db.cricketBatter.create({
    data: {
      innings_id: innings.id,
      name: parsed.data.nonStriker.name,
      player_id: parsed.data.nonStriker.playerId ?? null,
      batting_order: 2,
      how_out: 'NOT_OUT',
    },
  });
  const bowler = await db.cricketBowler.create({
    data: {
      innings_id: innings.id,
      name: parsed.data.bowler.name,
      player_id: parsed.data.bowler.playerId ?? null,
      bowling_order: 1,
    },
  });

  await db.cricketInnings.update({
    where: { id: innings.id },
    data: {
      striker_id: striker.id,
      non_striker_id: nonStriker.id,
      current_bowler_id: bowler.id,
    },
    include: inningsInclude,
  });

  await syncFixtureCricketScore(fixture.id);
  return NextResponse.json(await loadScorebook(fixture.id), { status: 201 });
}
