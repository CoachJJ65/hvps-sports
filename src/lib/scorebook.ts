import { db } from '@/lib/db';
import {
  buildStoredDelivery,
  computeInningsTotals,
  inningsShouldClose,
  isBowlerWicket,
  nextEnds,
  serializeInnings,
  type DeliveryInput,
} from '@/lib/cricket';
import { fixtureInclude, serializeFixture } from '@/lib/sports';

export const inningsInclude = {
  batters: true,
  bowlers: true,
  deliveries: { orderBy: { sequence: 'asc' as const } },
} as const;

export async function loadScorebook(fixtureId: string) {
  const fixture = await db.fixture.findUnique({
    where: { id: fixtureId },
    include: fixtureInclude,
  });
  if (!fixture) return null;
  return {
    fixture: serializeFixture(fixture),
    innings: fixture.cricket_innings.map((innings) => serializeInnings(innings)),
  };
}

export async function syncFixtureCricketScore(fixtureId: string) {
  const fixture = await db.fixture.findUnique({
    where: { id: fixtureId },
    include: {
      cricket_innings: { include: { deliveries: true } },
    },
  });
  if (!fixture) return;

  const totals: Record<string, ReturnType<typeof computeInningsTotals>> = {};
  for (const innings of fixture.cricket_innings) {
    totals[innings.batting_side] = computeInningsTotals(innings.deliveries);
  }
  const hvpsRuns = totals.HVPS?.runs ?? null;
  const oppRuns = totals.OPPOSITION?.runs ?? null;
  const bothClosed =
    fixture.cricket_innings.length >= 2 &&
    fixture.cricket_innings.every((innings) => innings.closed);

  await db.fixture.update({
    where: { id: fixtureId },
    data: {
      home_score: fixture.is_away ? oppRuns : hvpsRuns,
      away_score: fixture.is_away ? hvpsRuns : oppRuns,
      status: bothClosed
        ? 'COMPLETED'
        : fixture.cricket_innings.length > 0
          ? 'ONGOING'
          : fixture.status,
    },
  });
}

export async function recordDelivery(args: {
  inningsId: string;
  input: DeliveryInput;
  newBatter?: { name: string; playerId?: string | null };
  nextBowlerId?: string;
  fielderName?: string;
}) {
  const innings = await db.cricketInnings.findUnique({
    where: { id: args.inningsId },
    include: inningsInclude,
  });
  if (!innings) throw new Error('Innings not found');
  if (innings.closed) throw new Error('Innings is closed');
  if (!innings.striker_id || !innings.non_striker_id || !innings.current_bowler_id) {
    throw new Error('Set striker, non-striker, and bowler first');
  }

  const legalBefore = innings.deliveries.filter((d) => d.is_legal).length;
  const stored = buildStoredDelivery({
    sequence: innings.deliveries.length + 1,
    legalBallsBefore: legalBefore,
    bowlerId: innings.current_bowler_id,
    strikerId: innings.striker_id,
    nonStrikerId: innings.non_striker_id,
    input: args.input,
  });

  const legalAfter = legalBefore + (stored.is_legal ? 1 : 0);
  let { strikerId, nonStrikerId } = nextEnds({
    strikerId: innings.striker_id,
    nonStrikerId: innings.non_striker_id,
    legalBallsAfter: legalAfter,
    input: args.input,
  });

  const dismissedId =
    stored.dismissed_id ??
    (stored.wicket_type ? innings.striker_id : null);

  if (stored.wicket_type && dismissedId) {
    const bowler = innings.bowlers.find((b) => b.id === innings.current_bowler_id);
    await db.cricketBatter.update({
      where: { id: dismissedId },
      data: {
        how_out: stored.wicket_type,
        bowler_name: isBowlerWicket(stored.wicket_type)
          ? (bowler?.name ?? null)
          : null,
        fielder_name: args.fielderName ?? null,
      },
    });
  }

  await db.cricketDelivery.create({
    data: {
      innings_id: innings.id,
      sequence: stored.sequence,
      over_number: stored.over_number,
      ball_in_over: stored.ball_in_over,
      bowler_id: stored.bowler_id,
      striker_id: stored.striker_id,
      non_striker_id: stored.non_striker_id,
      runs_off_bat: stored.runs_off_bat,
      extra_type: stored.extra_type,
      extra_runs: stored.extra_runs,
      is_legal: stored.is_legal,
      wicket_type: stored.wicket_type,
      dismissed_id: dismissedId,
    },
  });

  if (stored.wicket_type && dismissedId && args.newBatter) {
    const nextOrder =
      Math.max(0, ...innings.batters.map((b) => b.batting_order)) + 1;
    const created = await db.cricketBatter.create({
      data: {
        innings_id: innings.id,
        name: args.newBatter.name,
        player_id: args.newBatter.playerId ?? null,
        batting_order: nextOrder,
        how_out: 'NOT_OUT',
      },
    });
    if (dismissedId === strikerId) strikerId = created.id;
    else if (dismissedId === nonStrikerId) nonStrikerId = created.id;
    else strikerId = created.id;
  }

  const wickets =
    innings.deliveries.filter((d) => d.wicket_type).length +
    (stored.wicket_type ? 1 : 0);
  const closed = inningsShouldClose({
    legalBalls: legalAfter,
    wickets,
    oversLimit: innings.overs_limit,
  });

  await db.cricketInnings.update({
    where: { id: innings.id },
    data: {
      striker_id: strikerId,
      non_striker_id: nonStrikerId,
      current_bowler_id: args.nextBowlerId ?? innings.current_bowler_id,
      closed,
    },
  });

  await syncFixtureCricketScore(innings.fixture_id);
  return loadScorebook(innings.fixture_id);
}

export async function undoLastDelivery(inningsId: string) {
  const innings = await db.cricketInnings.findUnique({
    where: { id: inningsId },
    include: inningsInclude,
  });
  if (!innings) throw new Error('Innings not found');
  const last = innings.deliveries[innings.deliveries.length - 1];
  if (!last) throw new Error('No deliveries to undo');

  if (last.wicket_type && last.dismissed_id) {
    await db.cricketBatter.update({
      where: { id: last.dismissed_id },
      data: { how_out: 'NOT_OUT', bowler_name: null, fielder_name: null },
    });
  }

  await db.cricketDelivery.delete({ where: { id: last.id } });

  const remaining = innings.deliveries.slice(0, -1);
  const keep = new Set([last.striker_id, last.non_striker_id]);
  for (const delivery of remaining) {
    keep.add(delivery.striker_id);
    keep.add(delivery.non_striker_id);
    if (delivery.dismissed_id) keep.add(delivery.dismissed_id);
  }
  await db.cricketBatter.deleteMany({
    where: {
      innings_id: innings.id,
      id: { notIn: Array.from(keep) },
      how_out: 'NOT_OUT',
    },
  });

  await db.cricketInnings.update({
    where: { id: innings.id },
    data: {
      striker_id: last.striker_id,
      non_striker_id: last.non_striker_id,
      current_bowler_id: last.bowler_id,
      closed: false,
    },
  });
  await syncFixtureCricketScore(innings.fixture_id);
  return loadScorebook(innings.fixture_id);
}
